'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DollarSign, TrendingUp, Car, Calendar } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DriverNav from '@/components/driver/DriverNav'
import Card from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { EarningsData } from '@/types'
import toast from 'react-hot-toast'

export default function DriverEarningsPage() {
  const router = useRouter()
  const [earnings, setEarnings] = useState({
    total: 0,
    thisMonth: 0,
    lastMonth: 0,
    rides: 0,
  })

  const [monthlyData, setMonthlyData] = useState<EarningsData[]>([])

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
      // Calculate earnings from bookings
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      const completed = bookings.filter((b: any) => b.status === 'completed')
      
      const total = completed.reduce((sum: number, b: any) => sum + (b.price || 0), 0)
      const thisMonth = completed
        .filter((b: any) => {
          const date = new Date(b.datetime || b.timestamp)
          const now = new Date()
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        })
        .reduce((sum: number, b: any) => sum + (b.price || 0), 0)
      
      const lastMonth = completed
        .filter((b: any) => {
          const date = new Date(b.datetime || b.timestamp)
          const now = new Date()
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)
          return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear()
        })
        .reduce((sum: number, b: any) => sum + (b.price || 0), 0)

      setEarnings({
        total,
        thisMonth,
        lastMonth,
        rides: completed.length,
      })

      // Generate monthly data for last 6 months
      const monthsData: EarningsData[] = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthData = completed
          .filter((b: any) => {
            const bookingDate = new Date(b.datetime || b.timestamp)
            return bookingDate.getMonth() === date.getMonth() && bookingDate.getFullYear() === date.getFullYear()
          })
        monthsData.push({
          month: date.toLocaleString('default', { month: 'short' }),
          earnings: monthData.reduce((sum: number, b: any) => sum + (b.price || 0), 0),
          rides: monthData.length,
        })
      }
      setMonthlyData(monthsData)
    }
  }, [])

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
                  Earnings
                </h1>
                <p className="text-gray-600 text-sm md:text-base">Track your earnings and performance</p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold">{formatCurrency(earnings.total)}</p>
                </div>
                <DollarSign className="w-12 h-12 text-green-200" />
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-1">This Month</p>
                  <p className="text-3xl font-bold">{formatCurrency(earnings.thisMonth)}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-blue-200" />
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 mb-1">Last Month</p>
                  <p className="text-3xl font-bold">{formatCurrency(earnings.lastMonth)}</p>
                </div>
                <Calendar className="w-12 h-12 text-purple-200" />
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 mb-1">Total Rides</p>
                  <p className="text-3xl font-bold">{earnings.rides}</p>
                </div>
                <Car className="w-12 h-12 text-yellow-200" />
              </div>
            </Card>
          </div>

          {/* Monthly Breakdown */}
          <Card>
            <h2 className="text-2xl font-bold font-serif mb-6">Monthly Breakdown</h2>
            <div className="space-y-4">
              {monthlyData.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No earnings data available</p>
              ) : (
                monthlyData.map((data, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {data.month.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{data.month}</p>
                        <p className="text-sm text-gray-600">{data.rides} rides</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(data.earnings)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

