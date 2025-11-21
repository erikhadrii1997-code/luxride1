# Luxride - Professional Taxi Booking Application

A modern, full-featured taxi booking application built with Next.js, TypeScript, React, and Express.js.

## Features

### Rider Features
- User authentication (Login/Signup)
- Book rides with real-time map integration
- Vehicle selection (Standard, Premium, Luxury, XL)
- Trip history tracking
- Profile management
- Inbox/notifications
- PayPal payment integration
- Receipt generation

### Driver Features
- Driver dashboard with analytics
- Profile management with photo upload
- Ride management and order tracking
- Schedule management (calendar)
- Earnings tracking with charts
- Reviews and ratings system

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Express.js, Node.js
- **Maps**: Leaflet, React-Leaflet
- **Payments**: PayPal SDK
- **Charts**: Chart.js, React-Chartjs-2
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Run the Express API server (in a separate terminal):
```bash
npm run server
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app router
│   ├── (auth)/            # Authentication pages
│   ├── (rider)/           # Rider pages
│   ├── (driver)/          # Driver pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components
│   ├── rider/            # Rider-specific components
│   └── driver/           # Driver-specific components
├── lib/                   # Utilities and helpers
├── types/                 # TypeScript types
├── server/                # Express API server
│   ├── index.js          # Server entry
│   ├── routes/           # API routes
│   └── data/             # Data storage
└── public/                # Static assets
```

## License

MIT License - Free to use for personal and commercial projects.

