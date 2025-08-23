"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Package, Truck, CheckCircle, Clock } from "lucide-react"

interface OrderTrackingProps {
  orderId?: string
}

export function OrderTracking({ orderId: initialOrderId }: OrderTrackingProps) {
  const [orderId, setOrderId] = useState(initialOrderId || "")
  const [trackingData, setTrackingData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleTrack = async () => {
    if (!orderId) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock tracking data
    setTrackingData({
      orderId: orderId.toUpperCase(),
      status: "shipped",
      estimatedDelivery: "Dec 28, 2024",
      trackingNumber: "TRK123456789",
      timeline: [
        {
          status: "Order Placed",
          date: "Dec 20, 2024",
          time: "2:30 PM",
          completed: true,
          icon: Package,
        },
        {
          status: "Payment Confirmed",
          date: "Dec 20, 2024",
          time: "2:35 PM",
          completed: true,
          icon: CheckCircle,
        },
        {
          status: "Processing",
          date: "Dec 21, 2024",
          time: "10:00 AM",
          completed: true,
          icon: Package,
        },
        {
          status: "Shipped",
          date: "Dec 22, 2024",
          time: "3:45 PM",
          completed: true,
          icon: Truck,
        },
        {
          status: "Out for Delivery",
          date: "Dec 28, 2024",
          time: "Expected",
          completed: false,
          icon: Truck,
        },
        {
          status: "Delivered",
          date: "Dec 28, 2024",
          time: "Expected",
          completed: false,
          icon: CheckCircle,
        },
      ],
    })

    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Track Your Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="orderId">Order ID</Label>
            <div className="flex gap-2">
              <Input
                id="orderId"
                placeholder="Enter your order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
              <Button onClick={handleTrack} disabled={isLoading || !orderId}>
                {isLoading ? "Tracking..." : "Track"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {trackingData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Order #{trackingData.orderId}</CardTitle>
              <Badge
                className={
                  trackingData.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : trackingData.status === "shipped"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                }
              >
                {trackingData.status}
              </Badge>
            </div>
            <div className="text-sm text-slate-600">
              <p>Tracking Number: {trackingData.trackingNumber}</p>
              <p>Estimated Delivery: {trackingData.estimatedDelivery}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {trackingData.timeline.map((event: any, index: number) => {
                const Icon = event.icon
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        event.completed ? "bg-green-100" : "bg-slate-100"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${event.completed ? "text-green-600" : "text-slate-400"}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${event.completed ? "text-slate-900" : "text-slate-500"}`}>
                        {event.status}
                      </p>
                      <p className="text-sm text-slate-600">
                        {event.date} at {event.time}
                      </p>
                    </div>
                    {event.completed && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {!event.completed && index === trackingData.timeline.findIndex((e: any) => !e.completed) && (
                      <Clock className="h-5 w-5 text-amber-600" />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
