'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, Car, DollarSign, Check, X } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DriverNav from '@/components/driver/DriverNav'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Booking } from '@/types'
import toast from 'react-hot-toast'

export default function DriverRidesPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState<'all' | 'requested' | 'accepted' | 'completed'>('all')

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
    loadBookings()
  }, [])

  const loadBookings = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bookings')
      if (stored) {
        setBookings(JSON.parse(stored))
      }
    }
  }

  const handleStatusChange = (bookingId: string, newStatus: Booking['status']) => {
    if (typeof window !== 'undefined') {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      const updated = bookings.map((b: Booking) =>
        b.id === bookingId ? { ...b, status: newStatus } : b
      )
      localStorage.setItem('bookings', JSON.stringify(updated))
      setBookings(updated)
      toast.success(`Ride ${newStatus}`)
    }
  }

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true
    return b.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'accepted':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'requested':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
                  Ride Management
                </h1>
                <p className="text-gray-600 text-sm md:text-base">Manage your rides and orders</p>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2 mb-6">
            {(['all', 'requested', 'accepted', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  filter === f
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-cream text-gray-700 hover:bg-cream-dark'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <Card className="text-center py-12">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">No rides found</h2>
              <p className="text-gray-600">No rides match your current filter</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-xl transition-shadow duration-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <h3 className="text-xl font-bold">
                          {booking.pickup} → {booking.destination}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDateTime(booking.datetime || booking.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4" />
                          <span>{booking.vehicleName || booking.vehicleType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(booking.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                      {booking.status === 'requested' && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleStatusChange(booking.id, 'accepted')}
                            variant="primary"
                            size="sm"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            variant="danger"
                            size="sm"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      )}
                      {booking.status === 'accepted' && (
                        <Button
                          onClick={() => handleStatusChange(booking.id, 'completed')}
                          variant="primary"
                          size="sm"
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

