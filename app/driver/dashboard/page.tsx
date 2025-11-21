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

export default function DriverDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalRides: 0,
    totalEarnings: 0,
    rating: 4.9,
    activeRides: 0,
    todayRides: 0,
    todayEarnings: 0,
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
      const today = new Date().toDateString()
      
      const todayBookings = completed.filter((b: Booking) => {
        const bookingDate = new Date(b.datetime || b.timestamp).toDateString()
        return bookingDate === today
      })

      const totalEarnings = completed.reduce((sum: number, b: Booking) => sum + (b.price || 0), 0)
      const todayEarnings = todayBookings.reduce((sum: number, b: Booking) => sum + (b.price || 0), 0)

      setStats({
        totalRides: completed.length,
        totalEarnings,
        rating: 4.9,
        activeRides: allBookings.filter((b: Booking) => b.status === 'accepted' || b.status === 'in-progress').length,
        todayRides: todayBookings.length,
        todayEarnings,
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-serif mb-2 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Driver Dashboard
            </h1>
            <p className="text-gray-600">Welcome back! Here's your overview</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Total Rides</p>
                  <p className="text-3xl font-bold">{stats.totalRides}</p>
                  <p className="text-blue-200 text-sm mt-1">Today: {stats.todayRides}</p>
                </div>
                <Car className="w-12 h-12 text-blue-200" />
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold">{formatCurrency(stats.totalEarnings)}</p>
                  <p className="text-green-200 text-sm mt-1">Today: {formatCurrency(stats.todayEarnings)}</p>
                </div>
                <DollarSign className="w-12 h-12 text-green-200" />
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 mb-1">Rating</p>
                  <p className="text-3xl font-bold">{stats.rating}</p>
                  <p className="text-yellow-200 text-sm mt-1">Based on {stats.totalRides} rides</p>
                </div>
                <Star className="w-12 h-12 text-yellow-200" />
              </div>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link href="/driver/profile">
              <Card className="text-center hover:shadow-xl transition-shadow cursor-pointer p-4">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm">Profile</p>
              </Card>
            </Link>
            <Link href="/driver/rides">
              <Card className="text-center hover:shadow-xl transition-shadow cursor-pointer p-4">
                <Car className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm">Rides</p>
              </Card>
            </Link>
            <Link href="/driver/orders">
              <Card className="text-center hover:shadow-xl transition-shadow cursor-pointer p-4">
                <Package className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm">Orders</p>
              </Card>
            </Link>
            <Link href="/driver/earnings">
              <Card className="text-center hover:shadow-xl transition-shadow cursor-pointer p-4">
                <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm">Earnings</p>
              </Card>
            </Link>
          </div>

          {/* Recent Bookings */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold font-serif">Available Rides</h2>
              <Link href="/driver/orders">
                <Button variant="outline" size="sm">
                  View All Orders
                </Button>
              </Link>
            </div>
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

