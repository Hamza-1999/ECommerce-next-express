import { type NextRequest, NextResponse } from "next/server"
import { orderManager } from "@/lib/order-manager"

export async function GET(request: NextRequest) {
  try {
    orderManager.loadFromStorage()
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")

    let orders
    if (userId) {
      orders = orderManager.getOrdersByUserId(userId)
    } else if (status) {
      orders = orderManager.getOrdersByStatus(status as any)
    } else {
      orders = orderManager.getAllOrders()
    }

    return NextResponse.json({ orders })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, items, totalAmount, shippingAddress, paymentMethod } = body

    if (!userId || !items || !totalAmount || !shippingAddress || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    orderManager.loadFromStorage()
    const order = orderManager.createOrder({
      userId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
    })

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
