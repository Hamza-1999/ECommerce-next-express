import { type NextRequest, NextResponse } from "next/server"
import { orderManager } from "@/lib/order-manager"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    orderManager.loadFromStorage()
    const order = orderManager.getOrderById(params.id)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, paymentStatus } = body

    orderManager.loadFromStorage()

    let updated = false
    if (status) {
      updated = orderManager.updateOrderStatus(params.id, status)
    }
    if (paymentStatus) {
      updated = orderManager.updatePaymentStatus(params.id, paymentStatus) || updated
    }

    if (!updated) {
      return NextResponse.json({ error: "Order not found or update failed" }, { status: 404 })
    }

    const order = orderManager.getOrderById(params.id)
    return NextResponse.json({ order })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    orderManager.loadFromStorage()
    const cancelled = orderManager.cancelOrder(params.id)

    if (!cancelled) {
      return NextResponse.json({ error: "Order not found or cannot be cancelled" }, { status: 404 })
    }

    return NextResponse.json({ message: "Order cancelled successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 })
  }
}
