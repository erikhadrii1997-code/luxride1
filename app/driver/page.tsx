'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Car, DollarSign, Users, Star, TrendingUp, Calendar, MapPin, Package } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DriverNav from '@/components/driver/DriverNav'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { Booking } from '@/types'
import toast from 'react-hot-toast'

export default function DriverDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalRides: 0,
    totalEarnings: 0,
    rating: 4.9,
    activeRides: 0,
  })

  const [recentBookings, setRecentBookings] = useState<Booking[]>([])

  // Authentication check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      const userType = localStorage.getItem('userType')
      
      if (!userData || userType !== 'driver') {
        toast.error('Please login as a driver to access this page')
        router.push('/login')
        return
      }
    }
  }, [router])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load bookings from localStorage
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      const filteredBookings = bookings
        .filter((b: Booking) => b.status === 'requested')
        .slice(0, 5)
      setRecentBookings(filteredBookings)

      // Calculate stats
      const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      const completed = allBookings.filter((b: Booking) => b.status === 'completed')
      const totalEarnings = completed.reduce((sum: number, b: Booking) => sum + (b.price || 0), 0)

      setStats({
        totalRides: completed.length,
        totalEarnings,
        rating: 4.9,
        activeRides: allBookings.filter((b: Booking) => b.status === 'accepted' || b.status === 'in-progress').length,
      })
    }
  }, [])

  const handleAcceptBooking = (bookingId: string) => {
    if (typeof window !== 'undefined') {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      const updatedBookings = bookings.map((b: Booking) =>
        b.id === bookingId ? { ...b, status: 'accepted' as const } : b
      )
      localStorage.setItem('bookings', JSON.stringify(updatedBookings))
      setRecentBookings(updatedBookings.filter((b: Booking) => b.status === 'requested').slice(0, 5))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DriverNav />
          {/* Compact heading with background design */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative px-4 py-3 bg-cream rounded-xl border border-primary/20 shadow-md">
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-dark/5 rounded-xl"></div>
              
              {/* Text */}
              <div className="relative z-10 text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif bg-gradient-to-r from-primary via-primary-dark to-primary bg-clip-text text-transparent mb-1">
                  Driver Dashboard
                </h1>
                <p className="text-gray-600 text-sm md:text-base">Manage your rides and track your earnings</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Total Rides</p>
                  <p className="text-3xl font-bold">{stats.totalRides}</p>
                </div>
                <Car className="w-12 h-12 text-blue-200" />
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold">{formatCurrency(stats.totalEarnings)}</p>
                </div>
                <DollarSign className="w-12 h-12 text-green-200" />
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 mb-1">Rating</p>
                  <p className="text-3xl font-bold">{stats.rating}</p>
                </div>
                <Star className="w-12 h-12 text-yellow-200" />
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Active Rides</p>
                  <p className="text-3xl font-bold">{stats.activeRides}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-purple-200" />
              </div>
            </Card>
          </div>

          {/* Quick Links - Mobile Optimized */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link href="/driver/profile">
              <Card className="text-center hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:-translate-y-1 active:scale-95 p-4 min-h-[120px] flex flex-col items-center justify-center touch-manipulation">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <p className="font-semibold text-sm md:text-base">Profile</p>
              </Card>
            </Link>
            <Link href="/driver/rides">
              <Card className="text-center hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:-translate-y-1 active:scale-95 p-4 min-h-[120px] flex flex-col items-center justify-center touch-manipulation">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Car className="w-6 h-6 text-primary" />
                </div>
                <p className="font-semibold text-sm md:text-base">Rides</p>
              </Card>
            </Link>
            <Link href="/driver/orders">
              <Card className="text-center hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:-translate-y-1 active:scale-95 p-4 min-h-[120px] flex flex-col items-center justify-center touch-manipulation">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <p className="font-semibold text-sm md:text-base">Orders</p>
              </Card>
            </Link>
            <Link href="/driver/earnings">
              <Card className="text-center hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:-translate-y-1 active:scale-95 p-4 min-h-[120px] flex flex-col items-center justify-center touch-manipulation">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <p className="font-semibold text-sm md:text-base">Earnings</p>
              </Card>
            </Link>
          </div>

          {/* Recent Bookings */}
          <Card>
            <h2 className="text-2xl font-bold font-serif mb-6">Available Rides</h2>
            {recentBookings.length === 0 ? (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No available rides at the moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <MapPin className="w-5 h-5 text-primary" />
                          <span className="font-semibold">
                            {booking.pickup} → {booking.destination}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(booking.datetime).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4" />
                            <span>{booking.vehicleName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(booking.price)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleAcceptBooking(booking.id)}
                        variant="primary"
                        size="md"
                      >
                        Accept Ride
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

