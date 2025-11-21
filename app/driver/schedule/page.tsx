'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DriverNav from '@/components/driver/DriverNav'
import toast from 'react-hot-toast'

export default function DriverSchedulePage() {
  const router = useRouter()

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DriverNav />
        </div>
      </main>

      <Footer />
    </div>
  )
}

