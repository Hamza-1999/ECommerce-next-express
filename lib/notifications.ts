export interface Notification {
  id: string
  type: "order" | "payment" | "shipping" | "general"
  title: string
  message: string
  orderId?: string
  read: boolean
  createdAt: Date
}

class NotificationManager {
  private notifications: Notification[] = []

  createNotification(data: Omit<Notification, "id" | "read" | "createdAt">): Notification {
    const notification: Notification = {
      ...data,
      id: "notif_" + Math.random().toString(36).substr(2, 9),
      read: false,
      createdAt: new Date(),
    }

    this.notifications.unshift(notification)
    this.saveToStorage()
    return notification
  }

  markAsRead(notificationId: string): boolean {
    const notification = this.notifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.saveToStorage()
      return true
    }
    return false
  }

  markAllAsRead(): void {
    this.notifications.forEach((n) => (n.read = true))
    this.saveToStorage()
  }

  getNotifications(): Notification[] {
    return this.notifications
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length
  }

  // Order-related notification helpers
  notifyOrderPlaced(orderId: string): void {
    this.createNotification({
      type: "order",
      title: "Order Placed Successfully",
      message: `Your order #${orderId.toUpperCase()} has been placed and is being processed.`,
      orderId,
    })
  }

  notifyOrderShipped(orderId: string, trackingNumber: string): void {
    this.createNotification({
      type: "shipping",
      title: "Order Shipped",
      message: `Your order #${orderId.toUpperCase()} has been shipped. Tracking: ${trackingNumber}`,
      orderId,
    })
  }

  notifyOrderDelivered(orderId: string): void {
    this.createNotification({
      type: "shipping",
      title: "Order Delivered",
      message: `Your order #${orderId.toUpperCase()} has been delivered successfully.`,
      orderId,
    })
  }

  notifyPaymentConfirmed(orderId: string): void {
    this.createNotification({
      type: "payment",
      title: "Payment Confirmed",
      message: `Payment for order #${orderId.toUpperCase()} has been processed successfully.`,
      orderId,
    })
  }

  private saveToStorage(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("notifications", JSON.stringify(this.notifications))
    }
  }

  loadFromStorage(): void {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("notifications")
      if (saved) {
        this.notifications = JSON.parse(saved)
      }
    }
  }
}

export const notificationManager = new NotificationManager()
