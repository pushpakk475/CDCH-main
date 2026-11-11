from flask import Flask, render_template, request, redirect, url_for, session, flash, send_from_directory
from database import get_db, init_db
import secrets
import os

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

# ─── INIT ────────────────────────────────────────────────────────────────────
@app.before_request
def setup():
    app.before_request_funcs[None].remove(setup)
    init_db()

def get_img(image):
    if image and (image.startswith('http://') or image.startswith('https://')):
        return image
    if image and image != 'no-image':
        from urllib.parse import quote
        return f"/static/images/{quote(image)}"
    return '/static/images/placeholder.svg'

app.jinja_env.globals['get_img'] = get_img

# ─── HOME ────────────────────────────────────────────────────────────────────
@app.route('/')
def home():
    db = get_db()
    categories = db.execute("SELECT * FROM categories").fetchall()
    products = db.execute("SELECT p.*, c.name as cat_name FROM products p JOIN categories c ON p.category_id = c.id LIMIT 8").fetchall()
    service_cats = db.execute("SELECT * FROM service_categories").fetchall()
    db.close()
    return render_template('user/home.html', categories=categories, products=products, service_cats=service_cats)

# ─── AUTH ────────────────────────────────────────────────────────────────────
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        phone = request.form['phone']
        account_type = request.form.get('account_type', 'customer')
        
        # If user wants to join as electrician, redirect to worker registration
        if account_type == 'electrician':
            # Store the basic info in session to pre-fill worker registration
            session['electrician_registration'] = {
                'name': name,
                'email': email,
                'password': password,
                'phone': phone
            }
            flash('Continue your electrician registration', 'info')
            return redirect(url_for('worker_register'))
        
        # Regular customer registration
        db = get_db()
        try:
            db.execute("INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)",
                       (name, email, password, phone))
            db.commit()
            flash('Account created! Please login.', 'success')
            return redirect(url_for('login'))
        except:
            flash('Email already exists.', 'error')
        finally:
            db.close()
    return render_template('user/register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        db = get_db()
        user = db.execute("SELECT * FROM users WHERE email=? AND password=?", (email, password)).fetchone()
        db.close()
        if user:
            session['user_id'] = user['id']
            session['user_name'] = user['name']
            session['user_role'] = user['role']
            if user['role'] == 'admin':
                return redirect(url_for('admin_dashboard'))
            return redirect(url_for('home'))
        flash('Invalid credentials.', 'error')
    return render_template('user/login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

# ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────
@app.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form['email']
        db = get_db()
        user = db.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
        db.close()
        if user:
            # In a real application, you would send a password reset email here
            # For this demo, we'll just show a message
            flash('Password reset instructions have been sent to your email if an account exists.', 'success')
            return redirect(url_for('login'))
        else:
            # Still show success message for security (don't reveal if email exists)
            flash('Password reset instructions have been sent to your email if an account exists.', 'success')
            return redirect(url_for('login'))
    return render_template('user/forgot_password.html')

# ─── PRODUCTS ────────────────────────────────────────────────────────────────
@app.route('/products')
def products():
    db = get_db()
    cat_id = request.args.get('category')
    if cat_id:
        prods = db.execute("SELECT p.*, c.name as cat_name FROM products p JOIN categories c ON p.category_id=c.id WHERE p.category_id=?", (cat_id,)).fetchall()
    else:
        prods = db.execute("SELECT p.*, c.name as cat_name FROM products p JOIN categories c ON p.category_id=c.id").fetchall()
    categories = db.execute("SELECT * FROM categories").fetchall()
    db.close()
    return render_template('user/products.html', products=prods, categories=categories, selected=cat_id)

@app.route('/product/<int:pid>')
def product_detail(pid):
    db = get_db()
    product = db.execute("SELECT p.*, c.name as cat_name FROM products p JOIN categories c ON p.category_id=c.id WHERE p.id=?", (pid,)).fetchone()
    db.close()
    return render_template('user/product_detail.html', product=product)

# ─── CART ────────────────────────────────────────────────────────────────────
@app.route('/cart/add/<int:pid>')
def add_to_cart(pid):
    if 'cart' not in session:
        session['cart'] = {}
    cart = session['cart']
    cart[str(pid)] = cart.get(str(pid), 0) + 1
    session['cart'] = cart
    flash('Added to cart!', 'success')
    return redirect(url_for('products'))

@app.route('/cart')
def cart():
    cart = session.get('cart', {})
    items = []
    total = 0
    if cart:
        db = get_db()
        for pid, qty in cart.items():
            p = db.execute("SELECT * FROM products WHERE id=?", (pid,)).fetchone()
            if p:
                items.append({'product': p, 'qty': qty, 'subtotal': p['price'] * qty})
                total += p['price'] * qty
        db.close()
    return render_template('user/cart.html', items=items, total=total)

@app.route('/cart/remove/<int:pid>')
def remove_from_cart(pid):
    cart = session.get('cart', {})
    cart.pop(str(pid), None)
    session['cart'] = cart
    return redirect(url_for('cart'))

# ─── CHECKOUT ────────────────────────────────────────────────────────────────
@app.route('/checkout', methods=['GET', 'POST'])
def checkout():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    cart = session.get('cart', {})
    if not cart:
        return redirect(url_for('cart'))
    db = get_db()
    items = []
    total = 0
    for pid, qty in cart.items():
        p = db.execute("SELECT * FROM products WHERE id=?", (pid,)).fetchone()
        if p:
            items.append({'product': p, 'qty': qty, 'subtotal': p['price'] * qty})
            total += p['price'] * qty
    if request.method == 'POST':
        address = request.form['address']
        payment = request.form['payment']
        order_id = db.execute("INSERT INTO orders (user_id, total, payment_method, address) VALUES (?, ?, ?, ?)",
                              (session['user_id'], total, payment, address)).lastrowid
        for pid, qty in cart.items():
            p = db.execute("SELECT * FROM products WHERE id=?", (pid,)).fetchone()
            db.execute("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
                       (order_id, pid, qty, p['price']))
        db.commit()
        db.close()
        session['cart'] = {}
        flash('Order placed successfully!', 'success')
        return redirect(url_for('my_orders'))
    db.close()
    return render_template('user/checkout.html', items=items, total=total)

# ─── ORDERS ──────────────────────────────────────────────────────────────────
@app.route('/orders')
def my_orders():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    db = get_db()
    orders = db.execute("SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC", (session['user_id'],)).fetchall()
    db.close()
    return render_template('user/orders.html', orders=orders)

# ─── SERVICES ────────────────────────────────────────────────────────────────
@app.route('/services')
def services():
    db = get_db()
    service_cats = db.execute("SELECT * FROM service_categories").fetchall()
    db.close()
    return render_template('user/services.html', service_cats=service_cats)

@app.route('/book/<int:sid>', methods=['GET', 'POST'])
def book_service(sid):
    if 'user_id' not in session:
        return redirect(url_for('login'))
    db = get_db()
    service = db.execute("SELECT * FROM service_categories WHERE id=?", (sid,)).fetchone()
    if request.method == 'POST':
        db.execute("INSERT INTO bookings (user_id, service_category_id, description, date, time_slot, address) VALUES (?, ?, ?, ?, ?, ?)",
                   (session['user_id'], sid, request.form['description'],
                    request.form['date'], request.form['time_slot'], request.form['address']))
        db.commit()
        db.close()
        flash('Booking confirmed!', 'success')
        return redirect(url_for('my_bookings'))
    db.close()
    return render_template('user/book_service.html', service=service)

@app.route('/bookings')
def my_bookings():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    db = get_db()
    bookings = db.execute('''
        SELECT b.*, sc.name as service_name, sc.icon, w.name as worker_name
        FROM bookings b
        JOIN service_categories sc ON b.service_category_id = sc.id
        LEFT JOIN workers w ON b.worker_id = w.id
        WHERE b.user_id=? ORDER BY b.created_at DESC
    ''', (session['user_id'],)).fetchall()
    db.close()
    return render_template('user/bookings.html', bookings=bookings)

# ─── WORKER ──────────────────────────────────────────────────────────────────
@app.route('/worker/register', methods=['GET', 'POST'])
def worker_register():
    import datetime
    # Get pre-filled data from session if coming from customer registration
    prefilled = session.get('electrician_registration', {})

    if request.method == 'POST':
        name           = request.form.get('name', '').strip()
        email          = request.form.get('email', '').strip()
        password       = request.form.get('password', '').strip()
        phone          = request.form.get('phone', '').strip()
        specialization = request.form.get('specialization', 'General Electrician')
        experience     = request.form.get('experience', '').strip()
        photo_data     = request.form.get('photo_data', '').strip()

        # ── Require photo ────────────────────────────────────────────────────
        if not photo_data:
            flash('Please upload your current photo before registering.', 'error')
            return render_template('worker/register.html', prefilled=request.form)

        # ── Strip data-URL prefix to store raw base64 ────────────────────────
        raw_photo = photo_data.split(',')[1] if ',' in photo_data else photo_data

        db = get_db()
        try:
            db.execute(
                "INSERT INTO workers (name, email, password, phone, specialization, experience, profile_photo) "
                "VALUES (?, ?, ?, ?, ?, ?, ?)",
                (name, email, password, phone, specialization, experience, raw_photo)
            )
            db.commit()
            session.pop('electrician_registration', None)
            flash('Registration submitted! Your photo has been saved. Wait for admin approval.', 'success')
            return redirect(url_for('worker_login'))
        except Exception:
            flash('Email is already registered. Please use a different email.', 'error')
        finally:
            db.close()

    return render_template('worker/register.html', prefilled=prefilled)

@app.route('/worker/login', methods=['GET', 'POST'])
def worker_login():
    if request.method == 'POST':
        import datetime
        email    = request.form.get('email', '')
        password = request.form.get('password', '')
        photo_data = request.form.get('photo_data', '').strip()

        # ── Require photo ────────────────────────────────────────────────────
        if not photo_data:
            flash('Please upload your current photo before logging in.', 'error')
            return render_template('worker/login.html')

        # ── Verify credentials ───────────────────────────────────────────────
        db = get_db()
        worker = db.execute(
            "SELECT * FROM workers WHERE email=? AND password=?",
            (email, password)
        ).fetchone()

        if not worker:
            db.close()
            flash('Invalid email or password.', 'error')
            return render_template('worker/login.html')

        if worker['status'] != 'approved':
            db.close()
            flash('Your account is pending admin approval.', 'error')
            return render_template('worker/login.html')

        # ── Save login photo + timestamp ─────────────────────────────────────
        # Strip the data-URL prefix if present (store raw base64)
        raw_photo = photo_data.split(',')[1] if ',' in photo_data else photo_data
        db.execute(
            "UPDATE workers SET last_login_photo=?, last_login_time=? WHERE id=?",
            (raw_photo, datetime.datetime.now().isoformat(), worker['id'])
        )
        db.commit()
        db.close()

        # ── Set session ──────────────────────────────────────────────────────
        session['worker_id']   = worker['id']
        session['worker_name'] = worker['name']
        flash('Welcome back, {}! Login photo recorded.'.format(worker['name']), 'success')
        return redirect(url_for('worker_dashboard'))

    return render_template('worker/login.html')

@app.route('/worker/logout')
def worker_logout():
    session.pop('worker_id', None)
    session.pop('worker_name', None)
    return redirect(url_for('worker_login'))

@app.route('/worker/dashboard')
def worker_dashboard():
    if 'worker_id' not in session:
        return redirect(url_for('worker_login'))
    db = get_db()
    jobs = db.execute('''
        SELECT b.*, sc.name as service_name, u.name as customer_name, u.phone as customer_phone
        FROM bookings b
        JOIN service_categories sc ON b.service_category_id = sc.id
        JOIN users u ON b.user_id = u.id
        WHERE b.worker_id=? ORDER BY b.created_at DESC
    ''', (session['worker_id'],)).fetchall()
    pending = db.execute('''
        SELECT b.*, sc.name as service_name, u.name as customer_name
        FROM bookings b
        JOIN service_categories sc ON b.service_category_id = sc.id
        JOIN users u ON b.user_id = u.id
        WHERE b.worker_id IS NULL AND b.status='pending'
    ''').fetchall()
    db.close()
    return render_template('worker/dashboard.html', jobs=jobs, pending=pending)

@app.route('/worker/accept/<int:bid>')
def accept_job(bid):
    if 'worker_id' not in session:
        return redirect(url_for('worker_login'))
    db = get_db()
    db.execute("UPDATE bookings SET worker_id=?, status='accepted' WHERE id=?", (session['worker_id'], bid))
    db.commit()
    db.close()
    return redirect(url_for('worker_dashboard'))

@app.route('/worker/complete/<int:bid>')
def complete_job(bid):
    if 'worker_id' not in session:
        return redirect(url_for('worker_login'))
    db = get_db()
    db.execute("UPDATE bookings SET status='completed' WHERE id=? AND worker_id=?", (bid, session['worker_id']))
    db.commit()
    db.close()
    return redirect(url_for('worker_dashboard'))

# ─── ADMIN ───────────────────────────────────────────────────────────────────
def admin_required():
    return 'user_id' in session and session.get('user_role') == 'admin'

@app.route('/admin')
def admin_dashboard():
    if not admin_required():
        return redirect(url_for('login'))
    db = get_db()
    stats = {
        'users': db.execute("SELECT COUNT(*) FROM users WHERE role='user'").fetchone()[0],
        'orders': db.execute("SELECT COUNT(*) FROM orders").fetchone()[0],
        'bookings': db.execute("SELECT COUNT(*) FROM bookings").fetchone()[0],
        'workers': db.execute("SELECT COUNT(*) FROM workers WHERE status='approved'").fetchone()[0],
        'revenue': db.execute("SELECT SUM(total) FROM orders WHERE status != 'cancelled'").fetchone()[0] or 0,
        'pending_workers': db.execute("SELECT COUNT(*) FROM workers WHERE status='pending'").fetchone()[0],
    }
    recent_orders = db.execute("SELECT o.*, u.name FROM orders o JOIN users u ON o.user_id=u.id ORDER BY o.created_at DESC LIMIT 5").fetchall()
    db.close()
    return render_template('admin/dashboard.html', stats=stats, recent_orders=recent_orders)

@app.route('/admin/products', methods=['GET', 'POST'])
def admin_products():
    if not admin_required():
        return redirect(url_for('login'))
    db = get_db()
    if request.method == 'POST':
        db.execute("INSERT INTO products (name, description, price, stock, category_id) VALUES (?, ?, ?, ?, ?)",
                   (request.form['name'], request.form['description'],
                    request.form['price'], request.form['stock'], request.form['category_id']))
        db.commit()
        flash('Product added!', 'success')
    products = db.execute("SELECT p.*, c.name as cat_name FROM products p JOIN categories c ON p.category_id=c.id").fetchall()
    categories = db.execute("SELECT * FROM categories").fetchall()
    db.close()
    return render_template('admin/products.html', products=products, categories=categories)

@app.route('/admin/products/delete/<int:pid>')
def admin_delete_product(pid):
    if not admin_required():
        return redirect(url_for('login'))
    db = get_db()
    db.execute("DELETE FROM products WHERE id=?", (pid,))
    db.commit()
    db.close()
    return redirect(url_for('admin_products'))

@app.route('/admin/orders')
def admin_orders():
    if not admin_required():
        return redirect(url_for('login'))
    db = get_db()
    orders = db.execute("SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id=u.id ORDER BY o.created_at DESC").fetchall()
    db.close()
    return render_template('admin/orders.html', orders=orders)

@app.route('/admin/orders/status/<int:oid>/<status>')
def update_order_status(oid, status):
    if not admin_required():
        return redirect(url_for('login'))
    db = get_db()
    db.execute("UPDATE orders SET status=? WHERE id=?", (status, oid))
    db.commit()
    db.close()
    return redirect(url_for('admin_orders'))

@app.route('/admin/workers')
def admin_workers():
    if not admin_required():
        return redirect(url_for('login'))
    db = get_db()
    workers = db.execute("SELECT * FROM workers ORDER BY created_at DESC").fetchall()
    db.close()
    return render_template('admin/workers.html', workers=workers)

@app.route('/admin/workers/approve/<int:wid>')
def approve_worker(wid):
    if not admin_required():
        return redirect(url_for('login'))
    db = get_db()
    db.execute("UPDATE workers SET status='approved' WHERE id=?", (wid,))
    db.commit()
    db.close()
    return redirect(url_for('admin_workers'))

@app.route('/admin/workers/reject/<int:wid>')
def reject_worker(wid):
    if not admin_required():
        return redirect(url_for('login'))
    db = get_db()
    db.execute("UPDATE workers SET status='rejected' WHERE id=?", (wid,))
    db.commit()
    db.close()
    return redirect(url_for('admin_workers'))

@app.route('/admin/worker-photos')
def admin_worker_photos():
    if not admin_required():
        return redirect(url_for('login'))
    db = get_db()
    workers = db.execute('''
        SELECT id, name, email, phone, specialization, 
               last_login_photo, last_login_time, status
        FROM workers 
        WHERE last_login_photo IS NOT NULL 
        ORDER BY last_login_time DESC
    ''').fetchall()
    db.close()
    return render_template('admin/worker_photos.html', workers=workers)

@app.route('/admin/bookings')
def admin_bookings():
    if not admin_required():
        return redirect(url_for('login'))
    db = get_db()
    bookings = db.execute('''
        SELECT b.*, sc.name as service_name, u.name as user_name, w.name as worker_name
        FROM bookings b
        JOIN service_categories sc ON b.service_category_id=sc.id
        JOIN users u ON b.user_id=u.id
        LEFT JOIN workers w ON b.worker_id=w.id
        ORDER BY b.created_at DESC
    ''').fetchall()
    db.close()
    return render_template('admin/bookings.html', bookings=bookings)

# ─── SHOWCASE / STATIC ASSETS ───────────────────────────────────────────────
@app.route('/aura')
@app.route('/showcase')
@app.route('/interactive')
def showcase():
    return send_from_directory('.', 'index.html')

@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('css', filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('js', filename)

@app.route('/ezgif-76f0eba4832cdac7-jpg/<path:filename>')
def serve_ezgif(filename):
    return send_from_directory('ezgif-76f0eba4832cdac7-jpg', filename)

@app.route('/ps images/<path:filename>')
def serve_ps_images(filename):
    return send_from_directory('ps images', filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"Starting Circuitron server on http://localhost:{port}")
    app.run(debug=True, host='127.0.0.1', port=port)
