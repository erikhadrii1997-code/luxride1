# LuxRide Driver - Professional Taxi Driver Management App

A modern, mobile-ready driver management application built with Capacitor for iOS and Android deployment.

## Features

- 🚗 **Driver Dashboard**: Real-time ride tracking and earnings overview
- 📊 **Analytics**: Performance metrics and ride statistics
- 💰 **Earnings Tracking**: Detailed earnings with monthly breakdowns
- 📅 **Schedule Management**: Calendar-based availability management
- 👤 **Profile Management**: Photo upload, personal info, vehicle details
- ⭐ **Reviews**: View customer feedback and ratings
- 📱 **Mobile-Ready**: Capacitor integration for native iOS/Android apps
- 💾 **Data Persistence**: Server-side storage with localStorage fallback

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Backend**: Node.js with Express
- **Mobile**: Capacitor 7.x
- **Maps**: Leaflet.js
- **Charts**: Chart.js
- **Icons**: Font Awesome
- **Fonts**: Inter, Playfair Display, JetBrains Mono

## Getting Started

### Prerequisites
- Node.js 16+ installed

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/luxride-driver.git
   cd luxride-driver
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000/driver-index.html
   ```

## Building for Mobile

### iOS (Requires Mac)
```bash
npm run cap:add:ios
npm run cap:sync
npm run cap:ios
```

### Android
```bash
npm run cap:add:android
npm run cap:sync
npm run cap:android
```

### Cloud Build (No Mac needed)
Use Ionic Appflow or similar services to build iOS without a Mac.

## File Structure

```
luxride-driver/
├── driver-index.html       # Main dashboard
├── driver-profile.html     # Profile management
├── driver-rides.html       # Ride management
├── driver-orders.html      # Order management
├── driver-schedule.html    # Schedule/calendar
├── driver-earnings.html    # Earnings analytics
├── server.js               # Express backend server
├── package.json            # Dependencies & scripts
├── capacitor.config.json   # Capacitor configuration
├── manifest.json           # PWA manifest
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## API Endpoints

- `POST /api/driver/profile` - Save driver name
- `GET /api/driver/profile` - Get driver profile
- `POST /api/driver/photo` - Upload profile photo
- `GET /api/driver/photo` - Get profile photo
- `POST /api/driver/profile/full` - Save full profile data
- `GET /api/driver/profile/full` - Get full profile data

## Features by Page

### Dashboard (`driver-index.html`)
- Quick stats overview
- Recent rides
- Performance metrics

### Profile (`driver-profile.html`)
- Edit name with modal
- Upload profile photo (auto-saves to server)
- Personal info (name, email, phone, DOB, address)
- Vehicle info (make, license, color, year, capacity, VIN)
- Bio section
- View customer reviews
- Download performance report

### Rides (`driver-rides.html`)
- Active ride management
- Ride history
- Filter by status

### Orders (`driver-orders.html`)
- Order tracking
- Status updates
- Order history

### Schedule (`driver-schedule.html`)
- Calendar view
- Availability management
- Time slot selection

### Earnings (`driver-earnings.html`)
- Monthly earnings charts
- Transaction history
- Withdrawal requests

## Contributing

Pull requests are welcome! For major changes, please open an issue first.

## License

MIT License - Free to use for personal and commercial projects.

## Contact

For support or questions, please create an issue on GitHub.
# luxride-app
>>>>>>> 749a11000b0011b36e7c775a14a5c31d5e698b2a
