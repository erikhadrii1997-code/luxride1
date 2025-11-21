'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Car, Package, DollarSign, LayoutDashboard } from 'lucide-react'

export default function DriverNav() {
  const pathname = usePathname()

  const driverLinks = [
    { href: '/driver', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/driver/profile', label: 'Profile', icon: User },
    { href: '/driver/rides', label: 'Rides', icon: Car },
    { href: '/driver/orders', label: 'Orders', icon: Package },
    { href: '/driver/earnings', label: 'Earnings', icon: DollarSign },
  ]

  const isActive = (href: string) => {
    if (href === '/driver') {
      return pathname === '/driver'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="bg-white rounded-xl shadow-md border border-gray-200 p-2 mb-6 sticky top-20 z-40">
      <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide -mx-2 px-2">
        {driverLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap
                touch-manipulation active:scale-95
                ${
                  isActive(link.href)
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 bg-gray-50'
                }
              `}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

