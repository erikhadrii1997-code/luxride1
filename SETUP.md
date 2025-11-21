# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   # Terminal 1: Next.js frontend
   npm run dev

   # Terminal 2: Express API server
   npm run server
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   │   ├── login/           # Login page
│   │   └── signup/          # Signup page
│   ├── book/                # Book ride page
│   ├── trips/               # Trip history
│   ├── profile/             # User profile
│   ├── inbox/               # Notifications/inbox
│   ├── driver/              # Driver pages
│   │   ├── page.tsx         # Driver dashboard
│   │   ├── profile/         # Driver profile
│   │   ├── rides/           # Ride management
│   │   ├── earnings/        # Earnings tracking
│   │   └── schedule/        # Schedule management
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── ui/                  # UI components (Button, Input, Card)
│   ├── layout/              # Layout components (Navbar, Footer)
│   └── map/                 # Map components
├── lib/                     # Utilities
├── types/                   # TypeScript types
├── server/                  # Express API server
│   ├── index.js             # Server entry
│   └── data/                # Data storage (created automatically)
└── public/                  # Static assets
```

## Features Implemented

### Rider Features
- ✅ User authentication (Login/Signup)
- ✅ Book rides with multi-step form
- ✅ Vehicle selection (Standard, Premium, Luxury, XL)
- ✅ Real-time map integration (Leaflet)
- ✅ Trip history
- ✅ Profile management
- ✅ Inbox/notifications

### Driver Features
- ✅ Driver dashboard with statistics
- ✅ Profile management with photo upload
- ✅ Ride management and order tracking
- ✅ Schedule management
- ✅ Earnings tracking with monthly breakdown
- ✅ Accept/decline ride requests

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Custom CSS
- **Backend**: Express.js
- **Maps**: Leaflet, React-Leaflet
- **State Management**: localStorage (client-side)
- **Notifications**: React Hot Toast

## Data Persistence

The app uses:
- **Client-side**: localStorage for immediate storage
- **Server-side**: JSON files in `server/data/` directory

## API Endpoints

- `POST /api/driver/profile` - Save driver profile
- `GET /api/driver/profile` - Get driver profile
- `POST /api/driver/photo` - Upload driver photo
- `GET /api/driver/photo` - Get driver photo
- `POST /api/driver/profile/full` - Save full driver profile
- `GET /api/driver/profile/full` - Get full driver profile

## Notes

- PayPal integration is set up but requires PayPal client ID configuration
- All data persists in localStorage for demo purposes
- Map coordinates are mocked for demonstration (use geocoding API in production)
- Server runs on port 3001 by default
- Next.js runs on port 3000 by default

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file for environment variables:
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

