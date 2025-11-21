'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, Car, Camera, Save } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DriverNav from '@/components/driver/DriverNav'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import toast from 'react-hot-toast'
import { DriverProfile } from '@/types'

export default function DriverProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Partial<DriverProfile>>({})
  const [photo, setPhoto] = useState<string>('')

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
    // Load profile from API or localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('driverProfile')
      if (stored) {
        const parsedProfile = JSON.parse(stored)
        setProfile(parsedProfile)
        // Load photo if it exists
        if (parsedProfile.photo) {
          setPhoto(parsedProfile.photo)
        }
      } else {
        // Default profile
        const defaultProfile = {
          firstName: 'John',
          lastName: 'Smith',
          fullName: 'John Smith',
          email: 'john.smith@luxride.com',
          phone: '+1 (555) 123-4567',
          driverId: 'DR-2847',
        }
        setProfile(defaultProfile)
        // Save default profile
        localStorage.setItem('driverProfile', JSON.stringify(defaultProfile))
      }
    }
  }, [])

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setPhoto(base64)
        toast.success('Photo uploaded successfully')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      // Ensure fullName is updated
      const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Driver'
      
      const updatedProfile = {
        ...profile,
        fullName,
        photo,
        updatedAt: new Date().toISOString(),
      }
      
      // Save driver profile to localStorage
      localStorage.setItem('driverProfile', JSON.stringify(updatedProfile))
      
      // Also update in allUsers array if user exists
      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]')
      const currentUserData = localStorage.getItem('user')
      if (currentUserData) {
        const currentUser = JSON.parse(currentUserData)
        const userIndex = allUsers.findIndex((u: any) => u.id === currentUser.id)
        
        if (userIndex !== -1) {
          // Update user in allUsers with profile info
          allUsers[userIndex] = {
            ...allUsers[userIndex],
            name: fullName,
            email: updatedProfile.email || allUsers[userIndex].email,
            phone: updatedProfile.phone || allUsers[userIndex].phone,
            photo: photo || allUsers[userIndex].photo,
            updatedAt: new Date().toISOString(),
          }
          localStorage.setItem('allUsers', JSON.stringify(allUsers))
          
          // Update current user session
          const updatedUser = { ...currentUser, ...allUsers[userIndex] }
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
      }
      
      // Update the profile state to reflect saved changes
      setProfile(updatedProfile)
      
      toast.success('Profile saved successfully')
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
                  Driver Profile
                </h1>
                <p className="text-gray-600 text-sm md:text-base">Manage your driver profile and information</p>
              </div>
            </div>
          </div>

          <Card>
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary to-primary-dark flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                  {(photo || profile.photo) ? (
                    <img src={photo || profile.photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-16 h-16" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors shadow-lg">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
              <h2 className="text-2xl font-bold mt-4">{profile.fullName || 'Driver'}</h2>
              <p className="text-gray-600">ID: {profile.driverId || 'DR-0000'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Input
                label="First Name"
                value={profile.firstName || ''}
                onChange={(e) => {
                  const firstName = e.target.value
                  const fullName = `${firstName} ${profile.lastName || ''}`.trim()
                  setProfile({ ...profile, firstName, fullName })
                }}
                icon={<User className="w-5 h-5" />}
                placeholder="Enter first name"
              />

              <Input
                label="Last Name"
                value={profile.lastName || ''}
                onChange={(e) => {
                  const lastName = e.target.value
                  const fullName = `${profile.firstName || ''} ${lastName}`.trim()
                  setProfile({ ...profile, lastName, fullName })
                }}
                icon={<User className="w-5 h-5" />}
                placeholder="Enter last name"
              />

              <Input
                label="Email"
                type="email"
                value={profile.email || ''}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                icon={<Mail className="w-5 h-5" />}
                placeholder="Enter email"
              />

              <Input
                label="Phone Number"
                type="tel"
                value={profile.phone || ''}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                icon={<Phone className="w-5 h-5" />}
                placeholder="Enter phone number"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} variant="primary" size="lg">
                <Save className="mr-2 w-5 h-5" />
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

