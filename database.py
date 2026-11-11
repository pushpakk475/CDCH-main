import sqlite3

def get_db():
    conn = sqlite3.connect('circuitron.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()

    c.executescript('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT,
            address TEXT,
            role TEXT DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS workers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT,
            specialization TEXT,
            experience TEXT,
            status TEXT DEFAULT 'pending',
            rating REAL DEFAULT 0,
            profile_photo TEXT DEFAULT NULL,           -- For worker profile picture
            last_login_photo TEXT DEFAULT NULL,        -- Base64 encoded photo from last login
            last_login_time TIMESTAMP DEFAULT NULL,    -- Timestamp of last login with photo
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            icon TEXT
        );

        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            stock INTEGER DEFAULT 0,
            category_id INTEGER,
            image TEXT DEFAULT 'placeholder.svg',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories(id)
        );

        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            total REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            payment_method TEXT DEFAULT 'cod',
            address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (product_id) REFERENCES products(id)
        );

        CREATE TABLE IF NOT EXISTS service_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            icon TEXT,
            description TEXT
        );

        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            worker_id INTEGER,
            service_category_id INTEGER NOT NULL,
            description TEXT,
            date TEXT NOT NULL,
            time_slot TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (worker_id) REFERENCES workers(id),
            FOREIGN KEY (service_category_id) REFERENCES service_categories(id)
        );
    ''')

    # Seed categories
    c.execute("SELECT COUNT(*) FROM categories")
    if c.fetchone()[0] == 0:
        c.executemany("INSERT INTO categories (name, icon) VALUES (?, ?)", [
            ('Switches & Sockets', '🔌'),
            ('Wires & Cables', '🔋'),
            ('LED Lights', '💡'),
            ('Fans', '🌀'),
            ('MCB & Isolators', '🔒'),
        ])

    # Seed service categories
    c.execute("SELECT COUNT(*) FROM service_categories")
    if c.fetchone()[0] == 0:
        c.executemany("INSERT INTO service_categories (name, icon, description) VALUES (?, ?, ?)", [
            ('Repair', '🔧', 'Fix electrical faults and issues'),
            ('Installation', '⚙️', 'Install new electrical equipment'),
            ('Maintenance', '🛠️', 'Regular checkups and servicing'),
            ('New Wiring', '🔌', 'Complete wiring for new spaces'),
            ('Fan Installation', '🌀', 'Ceiling and exhaust fan fitting'),
            ('Light Fitting', '💡', 'Indoor and outdoor light installation'),
        ])

    # Seed products
    c.execute("SELECT COUNT(*) FROM products")
    if c.fetchone()[0] == 0:
        c.executemany("INSERT INTO products (name, description, price, stock, category_id, image) VALUES (?, ?, ?, ?, ?, ?)", [
            # Switches & Sockets (cat 1)
            ('Modular 6A 1-Way Switch',    'Sleek white modular switch with anti-dust shutter',    33.00,  100, 1, 'Modular 6A 1-Way Switch.jpg'),
            ('Classic 10A 2-Way Switch',   'Premium classic series, ISI certified',                45.00,   80, 1, 'Classic 10A 2-Way Switch.webp'),
            ('16A Heavy Switch with LED',  'Heavy duty switch with neon indicator',                65.00,  150, 1, '16A Heavy Switch with LED INDICTOR.webp'),
            ('3-Pin 6A Socket Outlet',     'Standard 3-pin socket, child-safe shutter',            51.00,  120, 1, '3-Pin 6A Socket Outlet.jpg'),
            ('16A Universal Socket',       'Heavy duty universal socket for appliances',           76.00,   60, 1, '16A Universal Socket ps.jpg'),
            # Wires & Cables (cat 2)
            ('4mm Copper Wire (per mtr)',  'ISI marked flexible copper wiring cable',              25.00,  500, 2, 'finolex-single-core-cable-black_1 ps.webp'),
            ('2.5mm Flexible Cable',       'Multi-strand flexible cable for internal wiring',      18.00,  500, 2, 'finolex-single-core-cable-black_1 ps.webp'),
            # LED Lights (cat 3)
            ('9W LED Bulb Warm White',     'Energy saving warm white LED, 900 lumens',             85.00,  200, 3, 'Havells_9W_LED_Bulb_with_B22_Base_Warm_White_3000K_600x600_crop_center ps.webp'),
            ('18W LED Panel Light',        'Slim recessed panel light for false ceilings',        320.00,   50, 3, '51fy-LZY8dL._AC_UF1000,1000_QL80_ ps.jpg'),
            ('12W LED Batten Light',       'Energy efficient tube light replacement',             180.00,   80, 3, '12W LED Batten Light.jpg'),
            # Fans (cat 4)
            ('48-inch Ceiling Fan',        'Energy efficient BLDC ceiling fan, 5-star rated',    1800.00,   30, 4, '48-inch Ceiling Fan ps.webp'),
            ('Exhaust Fan 6-inch',         'Ventilation exhaust fan for kitchen & bathroom',      650.00,   40, 4, 'Exhaust Fan 6-inch ps.jpg'),
            # MCB & Isolators (cat 5)
            ('32A MCB Single Pole',        'Miniature circuit breaker, 10kA breaking capacity',   180.00,   70, 5, '32A MCB Single Pole ps.jpg'),
            ('63A RCCB 2-Pole',            'Residual current circuit breaker for safety',         850.00,   25, 5, '63A RCCB 2-Pole ps.jpg'),
            ('32A DP Isolator',            'Double pole isolator switch for main panel',           320.00,   40, 5, '32A DP Isolator ps.webp'),
            ('63A TPN Isolator',           'Triple pole & neutral isolator for 3-phase supply',   750.00,   20, 5, '63A TPN Isolator ps.webp'),
            ('16A MCB 4-Pole',             '4-pole MCB for 3-phase distribution boards',          420.00,   35, 5, '16A MCB 4-Pole ps.webp'),
        ])

    # Seed admin user
    c.execute("SELECT COUNT(*) FROM users WHERE role='admin'")
    if c.fetchone()[0] == 0:
        c.execute("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
                  ('Admin', 'admin@circuitron.com', 'admin123', 'admin'))

    # Seed test worker
    c.execute("SELECT COUNT(*) FROM workers")
    if c.fetchone()[0] == 0:
        c.execute("INSERT INTO workers (name, email, password, phone, specialization, experience, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                  ('Test Electrician', 'worker@circuitron.com', 'worker123', '9441539599', 'General Electrician', '5 years', 'approved'))

    conn.commit()
    conn.close()

