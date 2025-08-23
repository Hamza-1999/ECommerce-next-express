export interface User {
  _id: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  images: string[]
  stock: number
  featured: boolean
  colors: string[]
  sizes: string[]
  material: string
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  productId: string
  quantity: number
  color: string
  size: string
  price: number
}

export interface Order {
  _id: string
  userId: string
  items: CartItem[]
  totalAmount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    firstName: string
    lastName: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
  }
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed"
  createdAt: Date
  updatedAt: Date
}

export interface AuthUser {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: "user" | "admin"
}
