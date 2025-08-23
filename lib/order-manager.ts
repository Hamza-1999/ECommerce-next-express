import type { Order, CartItem } from "./types"

class OrderManager {
  private orders: Order[] = []

  createOrder(orderData: {
    userId: string
    items: CartItem[]
    totalAmount: number
    shippingAddress: Order["shippingAddress"]
    paymentMethod: string
  }): Order {
    const order: Order = {
      _id: "order_" + Math.random().toString(36).substr(2, 9),
      userId: orderData.userId,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      status: "pending",
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.orders.push(order)
    this.saveToStorage()
    return order
  }

  updateOrderStatus(orderId: string, status: Order["status"]): boolean {
    const orderIndex = this.orders.findIndex((order) => order._id === orderId)
    if (orderIndex > -1) {
      this.orders[orderIndex].status = status
      this.orders[orderIndex].updatedAt = new Date()
      this.saveToStorage()
      return true
    }
    return false
  }

  updatePaymentStatus(orderId: string, paymentStatus: Order["paymentStatus"]): boolean {
    const orderIndex = this.orders.findIndex((order) => order._id === orderId)
    if (orderIndex > -1) {
      this.orders[orderIndex].paymentStatus = paymentStatus
      this.orders[orderIndex].updatedAt = new Date()
      this.saveToStorage()
      return true
    }
    return false
  }

  getOrderById(orderId: string): Order | null {
    return this.orders.find((order) => order._id === orderId) || null
  }

  getOrdersByUserId(userId: string): Order[] {
    return this.orders.filter((order) => order.userId === userId)
  }

  getAllOrders(): Order[] {
    return this.orders
  }

  getOrdersByStatus(status: Order["status"]): Order[] {
    return this.orders.filter((order) => order.status === status)
  }

  cancelOrder(orderId: string): boolean {
    const orderIndex = this.orders.findIndex((order) => order._id === orderId)
    if (orderIndex > -1 && this.orders[orderIndex].status === "pending") {
      this.orders[orderIndex].status = "cancelled"
      this.orders[orderIndex].updatedAt = new Date()
      this.saveToStorage()
      return true
    }
    return false
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("orders", JSON.stringify(this.orders))
    }
  }

  loadFromStorage() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("orders")
      if (saved) {
        this.orders = JSON.parse(saved)
      }
    }
  }

  // Analytics methods
  getTotalRevenue(): number {
    return this.orders
      .filter((order) => order.paymentStatus === "paid")
      .reduce((total, order) => total + order.totalAmount, 0)
  }

  getOrderStats() {
    const total = this.orders.length
    const pending = this.orders.filter((o) => o.status === "pending").length
    const processing = this.orders.filter((o) => o.status === "processing").length
    const shipped = this.orders.filter((o) => o.status === "shipped").length
    const delivered = this.orders.filter((o) => o.status === "delivered").length
    const cancelled = this.orders.filter((o) => o.status === "cancelled").length

    return { total, pending, processing, shipped, delivered, cancelled }
  }
}

export const orderManager = new OrderManager()
