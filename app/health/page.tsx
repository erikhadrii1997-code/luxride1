'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Clock, Server } from 'lucide-react'
import Card from '@/components/ui/Card'

export default function HealthPage() {
  const [status, setStatus] = useState({
    app: 'healthy',
    api: 'checking',
    timestamp: new Date().toLocaleString(),
  })

  useEffect(() => {
    // Check API server status
    const checkAPI = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/driver/profile')
        if (response.ok) {
          setStatus(prev => ({ ...prev, api: 'healthy' }))
        } else {
          setStatus(prev => ({ ...prev, api: 'unhealthy' }))
        }
      } catch (error) {
        setStatus(prev => ({ ...prev, api: 'unhealthy' }))
      }
    }

    checkAPI()
    const interval = setInterval(() => {
      setStatus(prev => ({ ...prev, timestamp: new Date().toLocaleString() }))
      checkAPI()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500'
      case 'unhealthy':
        return 'bg-red-500'
      default:
        return 'bg-yellow-500'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Server className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold font-serif mb-2">Luxride Health Check</h1>
          <p className="text-gray-600">Application Status Monitor</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="font-semibold">Frontend App</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(status.app)}`}></div>
              <span className="text-sm font-medium capitalize">{status.app}</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Server className="w-6 h-6 text-blue-500" />
              <span className="font-semibold">API Server</span>
            </div>
            <div className="flex items-center gap-2">
              {status.api === 'checking' ? (
                <Clock className="w-4 h-4 animate-spin text-yellow-500" />
              ) : (
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status.api)}`}></div>
              )}
              <span className="text-sm font-medium capitalize">{status.api}</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Last Check: {status.timestamp}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

