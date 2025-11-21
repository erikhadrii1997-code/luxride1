'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar, Car, DollarSign, Check, X, Clock, Package } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DriverNav from '@/components/driver/DriverNav'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Booking } from '@/types'
import toast from 'react-hot-toast'

export default function DriverOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<{
    requested: Booking[]
    accepted: Booking[]
    completed: Booking[]
  }>({
    requested: [],
    accepted: [],
    completed: [],
  })

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
    loadOrders()
  }, [])

  const loadOrders = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('bookings')
      if (stored) {
        const bookings: Booking[] = JSON.parse(stored)
        
        setOrders({
          requested: bookings.filter(b => b.status === 'requested'),
          accepted: bookings.filter(b => b.status === 'accepted' || b.status === 'in-progress'),
          completed: bookings.filter(b => b.status === 'completed'),
        })
      }
    }
  }

  const handleAccept = (orderId: string) => {
    updateOrderStatus(orderId, 'accepted')
    toast.success('Order accepted')
  }

  const handleReject = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled')
    toast.success('Order rejected')
  }

  const handleComplete = (orderId: string) => {
    updateOrderStatus(orderId, 'completed')
    toast.success('Order marked as completed')
  }

  const updateOrderStatus = (orderId: string, newStatus: Booking['status']) => {
    if (typeof window !== 'undefined') {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      const updated = bookings.map((b: Booking) =>
        b.id === orderId ? { ...b, status: newStatus } : b
      )
      localStorage.setItem('bookings', JSON.stringify(updated))
      loadOrders()
    }
  }

  const OrderCard = ({ order, showActions = true }: { order: Booking; showActions?: boolean }) => (
    <Card className="hover:shadow-xl transition-shadow duration-200">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-bold text-lg">Order #{order.id.slice(-8)}</h3>
              <p className="text-sm text-gray-600">{formatDateTime(order.datetime || order.timestamp)}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            order.status === 'completed' ? 'bg-green-100 text-green-800' :
            order.status === 'accepted' || order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
            order.status === 'requested' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {order.status}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary mt-1" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Pickup</p>
              <p className="font-semibold">{order.pickup}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-red-500 mt-1" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Destination</p>
              <p className="font-semibold">{order.destination}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{order.vehicleName}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="font-bold text-primary">{formatCurrency(order.price)}</span>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2 pt-2">
            {order.status === 'requested' && (
              <>
                <Button
                  onClick={() => handleAccept(order.id)}
                  variant="primary"
                  size="sm"
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Accept
                </Button>
                <Button
                  onClick={() => handleReject(order.id)}
                  variant="danger"
                  size="sm"
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
            {(order.status === 'accepted' || order.status === 'in-progress') && (
              <Button
                onClick={() => handleComplete(order.id)}
                variant="primary"
                size="sm"
                className="w-full"
              >
                <Check className="w-4 h-4 mr-1" />
                Mark Complete
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  )

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
                  Order Management
                </h1>
                <p className="text-gray-600 text-sm md:text-base">Manage all your ride orders in one place</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 mb-1">New Requests</p>
                  <p className="text-3xl font-bold">{orders.requested.length}</p>
                </div>
                <Clock className="w-12 h-12 text-yellow-200" />
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">Active Orders</p>
                  <p className="text-3xl font-bold">{orders.accepted.length}</p>
                </div>
                <Package className="w-12 h-12 text-blue-200" />
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Completed</p>
                  <p className="text-3xl font-bold">{orders.completed.length}</p>
                </div>
                <Check className="w-12 h-12 text-green-200" />
              </div>
            </Card>
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Requested Orders */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                New Requests ({orders.requested.length})
              </h2>
              <div className="space-y-4">
                {orders.requested.length === 0 ? (
                  <Card className="text-center py-8 text-gray-500">
                    No new requests
                  </Card>
                ) : (
                  orders.requested.map(order => (
                    <OrderCard key={order.id} order={order} showActions={true} />
                  ))
                )}
              </div>
            </div>

            {/* Active Orders */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-500" />
                Active ({orders.accepted.length})
              </h2>
              <div className="space-y-4">
                {orders.accepted.length === 0 ? (
                  <Card className="text-center py-8 text-gray-500">
                    No active orders
                  </Card>
                ) : (
                  orders.accepted.map(order => (
                    <OrderCard key={order.id} order={order} showActions={true} />
                  ))
                )}
              </div>
            </div>

            {/* Completed Orders */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                Completed ({orders.completed.length})
              </h2>
              <div className="space-y-4">
                {orders.completed.length === 0 ? (
                  <Card className="text-center py-8 text-gray-500">
                    No completed orders
                  </Card>
                ) : (
                  orders.completed.map(order => (
                    <OrderCard key={order.id} order={order} showActions={false} />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

