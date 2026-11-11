# Circuitron - Electrical Supplies & Services Platform

## 📋 Overview
Circuitron is a comprehensive Flask-based web application for electrical supplies and professional electrical services. The platform allows customers to purchase electrical products, book electrician services, and includes admin and worker management systems.

## 🚀 Features

### 🛒 E-commerce Features
- Product catalog with categories (switches, wires, lights, fans, MCBs)
- Shopping cart functionality
- Secure checkout process
- Order tracking and history
- Product search and filtering

### 👷 Service Booking System
- Professional electrician booking
- Service categories (repair, installation, maintenance, wiring)
- Booking scheduling with date/time slots
- Worker assignment and management

### 👥 User Management
- Customer registration and authentication
- Electrician (worker) registration and approval system
- Admin panel for complete management
- Role-based access control

### 🎨 Interactive Elements
- Interactive showcase page with scroll-based animations
- Product image carousels
- Responsive design with modern UI

## 📁 Project Structure

```
circuitron-project/
├── README.md                     # This documentation file
├── app.py                        # Main Flask application
├── database.py                   # Database schema and initialization
├── requirements.txt              # Python dependencies
├── circuitron.db                 # SQLite database
├── index.html                    # Interactive showcase page
├── templates/                    # HTML templates
│   ├── base.html                # Base template
│   ├── home.html                # Home page
│   ├── cart.html                # Shopping cart
│   ├── products.html            # Product listing
│   ├── admin/                   # Admin panel templates
│   ├── user/                    # Customer templates  
│   └── worker/                  # Worker dashboard templates
├── static/                       # Static assets
│   ├── style.css                # Main stylesheet
│   └── images/                  # Product and icon images
├── css/                          # Additional CSS files
│   ├── luxury-design.css        # Luxury design styles
│   └── scrollytelling.css       # Scroll animation styles
├── js/                          # JavaScript files
│   ├── main.js                  # Main JavaScript
│   ├── audio-synth.js           # Audio synthesis
│   ├── component-inspector.js   # Component inspection
│   ├── frame-loader.js          # Frame loading utilities
│   ├── scrolly-engine.js        # Scroll animation engine
│   └── switch-simulator.js      # Switch simulation
├── ps images/                   # Product source images
└── ezgif-76f0eba4832cdac7-jpg/  # Animated GIF frames
```

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.7+
- pip (Python package manager)

### Installation Steps

1. **Clone/Download the project**
   ```bash
   # Navigate to your project directory
   cd /path/to/project
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   # or
   python3 app.py
   ```

4. **Access the application**
   - Open your browser and navigate to: `http://localhost:5001`

## 🗄️ Database

The application uses SQLite database with the following main tables:

### Core Tables
- **users**: Customer and admin accounts
- **workers**: Electrician/worker profiles
- **categories**: Product categories
- **products**: Electrical products for sale
- **orders**: Customer purchase orders
- **order_items**: Order line items
- **service_categories**: Types of electrical services
- **bookings**: Service appointment bookings

### Pre-seeded Data
The database automatically initializes with:
- Product categories (switches, wires, lights, fans, MCBs)
- Sample products with images
- Service categories (repair, installation, maintenance, etc.)
- Default admin user
- Test worker account

## 🔐 Default Login Credentials

### Admin Access
- **URL:** `http://localhost:5001/admin`
- **Email:** `admin@circuitron.com`
- **Password:** `admin123`

### Worker Access
- **URL:** `http://localhost:5001/worker/login`
- **Email:** `worker@circuitron.com`
- **Password:** `worker123`

### Customer Access
Customers can register new accounts at `http://localhost:5001/register`

## 🎮 Key URLs

| URL | Description | Access |
|-----|-------------|--------|
| `/` | Home page | Public |
| `/showcase` | Interactive showcase | Public |
| `/products` | Product catalog | Public |
| `/services` | Service booking | Customer |
| `/cart` | Shopping cart | Customer |
| `/admin` | Admin dashboard | Admin |
| `/worker/dashboard` | Worker dashboard | Worker |
| `/register` | Customer registration | Public |
| `/login` | Customer login | Public |

## 🛠️ Development

### Running in Debug Mode
The application is configured to run in debug mode, which provides:
- Auto-reload on code changes
- Detailed error messages
- Debugger console access

### Customization
1. **Styling**: Modify CSS files in `css/` and `static/style.css`
2. **Templates**: Edit HTML files in `templates/` directory
3. **Database**: Modify `database.py` for schema changes
4. **Logic**: Update `app.py` for application logic

### Adding New Features
1. Add new routes to `app.py`
2. Create corresponding templates in appropriate directories
3. Update database schema in `database.py` if needed
4. Add any required static assets

## 📦 Dependencies

- **Flask 3.0.0**: Web framework
- **SQLite3**: Built-in database (no additional installation required)

## 🚨 Recent Changes

### September 20, 2026
**Removed Marketing Statements from Home Page:**
- ❌ Removed trust bar containing:
  - 🚚 Same Day Delivery (Order before 2 PM)
  - ✅ ISI Certified (100% genuine products)
  - 🔄 Easy Returns (7-day return policy)
  - 🔒 Secure Payment (COD & Online available)
  - 🛡️ 1 Year Warranty (On all products)
- ❌ Removed "Why Choose Circuitron" section containing:
  - 🏆 ISI Certified Products card
  - 🚚 Same Day Delivery card
  - 🛡️ 1-Year Warranty card
- ✏️ Updated customer review to remove "ISI certified" reference

**Files Modified:**
- `templates/user/home.html` (multiple sections removed)

### Initial Setup
**Server Configuration:**
- ✅ Flask application configured to run on port 5001
- ✅ Debug mode enabled for development
- ✅ Database auto-initialization on first run
- ✅ Default admin and worker accounts created

## 🔍 Troubleshooting

### Common Issues

1. **Server won't start:**
   - Check if port 5001 is already in use
   - Verify Python and Flask are installed correctly
   - Check for syntax errors in Python files

2. **Database issues:**
   - Delete `circuitron.db` to reset the database
   - Restart the application to re-initialize schema

3. **Static files not loading:**
   - Check browser console for 404 errors
   - Verify file paths in templates

### Port Conflicts
If port 5001 is already in use:
```bash
# Find process using port 5001
lsof -i :5001

# Kill the process
kill -9 <PID>

# Or change port in app.py
port = int(os.environ.get('PORT', 5001))  # Change 5001 to desired port
```

## 📈 Future Enhancements

### Planned Features
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Advanced search functionality
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced reporting and analytics

### Technical Improvements
- [ ] Migrate to PostgreSQL for production
- [ ] Add caching layer
- [ ] Implement REST API
- [ ] Add unit and integration tests
- [ ] Docker containerization

## 👥 User Roles & Permissions

### 1. **Customers** (Default role)
- Browse products and services
- Add items to cart and checkout
- Book electrical services
- View order and booking history
- Manage personal profile

### 2. **Workers** (Electricians)
- View assigned service bookings
- Accept/reject service requests
- Mark jobs as completed
- Update availability and profile
- View earnings and schedule

### 3. **Administrators**
- Full system access
- Manage products and categories
- Approve/reject worker registrations
- View all orders and bookings
- Manage user accounts
- Generate reports and analytics

## 🎨 Design Philosophy

The application follows a clean, modern design with:
- **Responsive design** that works on all devices
- **Intuitive navigation** for easy user experience
- **Consistent branding** with electrical/tech theme
- **Accessibility considerations** for wider usability
- **Performance optimization** for fast loading

## 📚 Learning Resources

### For Developers
- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [HTML/CSS/JavaScript References](https://developer.mozilla.org/)

### For Users
- User guides available in the application
- Help section accessible from the footer
- Customer support contact information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For technical support or questions:
- Check the troubleshooting section above
- Review the documentation
- Contact the development team

---

*Last Updated: September 20, 2026*  
*Circuitron v1.0 - Electrical Solutions Platform*


## 🔄 Recent Updates (Continued)

### September 20, 2026 (Continued)
**Updated Landing Page Text from "Switches" to "Items":**
- ✏️ Changed main call-to-action button from "Shop Switches →" to "Shop Items →"
- ✏️ Updated slide description from "Elegant modular switches crafted for modern interiors" to "Premium electrical items for modern homes and businesses"
- ✏️ Changed slide tag from "⚡ Premium Modular Switches" to "⚡ Premium Electrical Items"
- ✏️ Updated page titles:
  - `Marcos Electrical Switches Shop` → `Marcos Electrical Items Shop` (home.html)
  - `Products - Marcos Switches` → `Products - Marcos Electrical` (products.html) 
  - `Shopping Cart - Marcos Switches` → `Shopping Cart - Marcos Electrical` (cart.html)
- ✏️ Updated subtitle from "Quality Electrical Switches & Accessories" to "Premium Electrical Items & Accessories"
- ✏️ Modified customer review text from "Ordered modular switches" to "Ordered electrical items"

**Files Modified:**
- `templates/user/home.html` (multiple text updates)
- `templates/home.html` (title and subtitle update)
- `templates/products.html` (title update)
- `templates/cart.html` (title update)

**Note:** The button now links to all products (`{{ url_for('products') }}`) instead of filtering by switches category only.


## 🔄 Recent Updates (Continued)

### September 20, 2026 (Continued)
**Enhanced Login & Registration Pages:**
- 👁️ **Password Visibility Toggle:** Added eye icon button to show/hide password on all password fields
  - Clicking the 👁️ icon reveals password text
  - Icon changes to 🙈 when password is visible
  - Works on: Customer login, Customer registration, Worker login, Worker registration

- 🔐 **Forgot Password Feature:** Added password recovery system
  - "Forgot Password?" link on login pages
  - Email-based password reset (demo implementation)
  - New route: `/forgot-password`
  - Security: Shows same success message whether email exists or not (prevents email enumeration)

- ↩️ **Back Navigation:** Added back button at top left of all auth pages
  - Consistent "← Back" button positioned at top left
  - Links back to appropriate previous page (home or login)
  - Clean header layout with logo and back button

**Technical Implementation:**
- **HTML/CSS Updates:**
  - New `.password-container` class with relative positioning
  - `.password-toggle` button styling with hover effects
  - `.form-options` container for forgot password link
  - `.auth-header` layout for back button and logo
  - Responsive design for mobile devices

- **Flask Routes Added:**
  - `/forgot-password` route with GET/POST handlers
  - Basic email verification (simulates sending reset email)
  - Security-conscious implementation (doesn't reveal if email exists)

**Files Modified/Created:**
- `templates/user/login.html` - Added password toggle, forgot password link, back button
- `templates/user/register.html` - Added password toggle, back button
- `templates/user/forgot_password.html` - New forgot password page
- `templates/worker/login.html` - Added password toggle, forgot password link, back button
- `templates/worker/register.html` - Added password toggle, back button
- `static/style.css` - Added new CSS for auth enhancements
- `app.py` - Added `/forgot-password` route

**User Experience Improvements:**
1. **Better Password Management:** Users can verify they typed password correctly
2. **Password Recovery:** Users can reset forgotten passwords
3. **Easy Navigation:** Clear back buttons for intuitive navigation
4. **Consistent Design:** Uniform styling across all auth pages
5. **Responsive Design:** Works well on mobile devices


## 🔄 Recent Updates (Continued)

### September 20, 2026 (Continued)
**Enhanced Electrician Registration & Login System:**

#### 1. 🔧 **"Join as Electrician" Option in Registration**
- ✅ **Account Type Selection:** Added radio buttons to choose between "Customer Account" and "Join as Electrician"
- ✅ **Visual Cards:** Interactive card selection with icons and descriptions
- ✅ **Seamless Flow:** Selecting "Join as Electrician" redirects to worker registration with pre-filled data
- ✅ **Pre-filled Forms:** Basic info (name, email, phone) carries over from initial registration

#### 2. 📸 **Photo Verification for Electrician Login**
- ✅ **Mandatory Photo Capture:** Electricians must take/upload a photo at each login
- ✅ **Attendance Tracking:** Photos are stored with timestamps for verification
- ✅ **Camera Integration:** Uses device camera with fallback to file upload
- ✅ **Security:** Prevents unauthorized access and tracks worker attendance

#### 3. 🗄️ **Database Schema Updates**
- **Added new columns to workers table:**
  - `profile_photo` - For worker profile pictures (future use)
  - `last_login_photo` - Stores base64-encoded login verification photos
  - `last_login_time` - Timestamp of last login with photo

#### 4. 👁️ **Photo Capture Interface**
- ✅ **Camera Access:** Direct camera integration with proper constraints
- ✅ **Live Preview:** Real-time camera feed with capture button
- ✅ **Retake Option:** Ability to retake photos before submission
- ✅ **File Upload Fallback:** Alternative method if camera is unavailable
- ✅ **User-Friendly:** Clear instructions and visual feedback

#### 5. 👨‍💼 **Admin Monitoring**
- ✅ **Worker Photos Dashboard:** New admin route `/admin/worker-photos`
- ✅ **Photo Gallery:** View all worker login photos with timestamps
- ✅ **Worker Details:** Shows worker info, status, and specialization
- ✅ **Attendance Tracking:** Monitor when electricians logged in

#### 6. 🔐 **Enhanced Security & Verification**
- **Two-Step Login Process:**
  1. Credentials verification (email/password)
  2. Photo capture for attendance
- **Session Management:** Temporary session storage during photo capture
- **Status Validation:** Only approved workers can proceed to photo capture
- **Data Integrity:** All photos timestamped and linked to worker accounts

**Files Modified/Created:**

**Database:**
- `database.py` - Updated workers table schema with photo fields

**Flask Routes (`app.py`):**
- Modified `/register` route to handle account type selection
- Modified `/worker/login` route for two-step photo verification
- Added `/admin/worker-photos` route for admin monitoring
- Enhanced `/worker/register` to accept pre-filled data

**HTML Templates:**
- `templates/user/register.html` - Added account type selection cards
- `templates/worker/login.html` - Added photo requirement notice
- `templates/worker/photo_capture.html` - New photo capture interface
- `templates/worker/register.html` - Supports pre-filled form data
- `templates/admin/worker_photos.html` - New admin photo dashboard
- `templates/admin/dashboard.html` - Added link to worker photos

**CSS Styles (`static/style.css`):**
- Added `.account-type-options` styling for registration cards
- Added `.photo-upload-container` styling for camera interface
- Added `.login-photo-notice` for photo requirement alerts
- Added `.photos-grid` styling for admin photo gallery

**JavaScript Features:**
- Camera access and photo capture functionality
- Real-time preview with canvas rendering
- File upload fallback system
- Form validation and data handling

**Workflow Improvements:**

**For New Users:**
1. **Registration:** Choose "Customer Account" or "Join as Electrician"
2. **Electrician Path:** Redirects to specialized registration form
3. **Approval:** Wait for admin approval (status: pending → approved)

**For Electrician Login:**
1. **Step 1:** Enter email/password credentials
2. **Step 2:** Capture verification photo (camera or upload)
3. **Step 3:** Photo saved to database with timestamp
4. **Step 4:** Access granted to worker dashboard

**For Admin Monitoring:**
1. **Dashboard:** New "Worker Photos" link in admin navigation
2. **View Photos:** See all login photos with worker details
3. **Track Attendance:** Monitor login times and verification status

**Technical Implementation Notes:**
- Uses HTML5 MediaDevices API for camera access
- Stores photos as base64 data URLs in database
- Implements session-based state management for multi-step login
- Responsive design works on desktop and mobile devices
- Graceful degradation for devices without camera access

**Security Considerations:**
- Photos only required for electrician accounts, not customers
- Photo data stored with login timestamps for audit trail
- Only approved workers can complete photo verification
- Admin can monitor all login activities through photo gallery

**Future Enhancement Opportunities:**
- Face recognition for identity verification
- Geolocation tracking with photos
- Scheduled photo requirements (daily check-ins)
- Photo quality validation
- Bulk export of attendance records
- Integration with time tracking/payroll systems


---

## 🔄 Update — September 20, 2026

### 📸 Inline Photo Upload on Electrician Login & Register

Both the electrician login and registration pages now have a **mandatory photo upload box built directly into the form**. The electrician must upload their current photo before they can submit — there is no separate page or extra step.

---

### What Changed

#### Electrician Login (`/worker/login`)
- A photo upload box is shown on the login form itself, below the password field
- The electrician clicks the box (or drags a photo onto it) to select their photo
- A live preview appears inside the box once a photo is chosen
- A **"Change Photo"** button lets them pick a different one
- Clicking **Login** without uploading a photo highlights the box in red and blocks the form
- On successful login the photo is saved to `last_login_photo` and `last_login_time` in the database

#### Electrician Register (`/worker/register`)
- Same photo upload box is shown at the bottom of the registration form
- Photo is mandatory — form will not submit without it
- On successful registration the photo is saved to `profile_photo` in the database
- If the email is already taken the form re-renders with all fields pre-filled (photo must be re-selected)

---

### How the Photo Box Works

| Action | Result |
|---|---|
| Click the box | Opens file picker (images only) |
| Drag & drop a file onto the box | Loads the image immediately |
| Pick a valid image | Preview fills the box, "✅ Photo ready" badge appears |
| Click **Change Photo** | Clears the preview, box resets |
| Submit without a photo | Box shakes and turns red, form blocked |

---

### Files Changed

| File | What changed |
|---|---|
| `templates/worker/login.html` | Completely rewritten — inline photo box added to form |
| `templates/worker/register.html` | Completely rewritten — inline photo box added to form |
| `app.py` — `worker_login()` | Single POST now validates photo + credentials together, saves photo to DB |
| `app.py` — `worker_register()` | Validates photo present, saves `profile_photo` to DB on insert |
| `static/style.css` | New classes: `.photo-section`, `.photo-box`, `.photo-box--filled`, `.photo-box--dragover`, `.photo-box--error`, `.photo-actions-row`, `.photo-retake-btn`, `.photo-ready-badge`, shake animation |

---

### Database Columns Used

| Table | Column | Purpose |
|---|---|---|
| `workers` | `profile_photo` | Stores base64 photo submitted at registration |
| `workers` | `last_login_photo` | Stores base64 photo submitted at each login |
| `workers` | `last_login_time` | ISO timestamp of last login with photo |

All three columns were added in the previous update and are already in the schema in `database.py`.

---

### Test It

1. Go to **http://localhost:5001/worker/login**
   - Try clicking Login without a photo — the box will shake
   - Upload a photo, then login with `worker@circuitron.com` / `worker123`

2. Go to **http://localhost:5001/worker/register**
   - Try submitting without a photo — blocked with red highlight
   - Upload a photo and fill in all fields to register a new electrician

3. Go to **http://localhost:5001/admin/worker-photos** (admin login required)
   - View the photos recorded at each electrician login
