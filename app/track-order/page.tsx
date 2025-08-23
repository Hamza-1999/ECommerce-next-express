import { Header } from "@/components/user/header"
import { Footer } from "@/components/user/footer"
import { OrderTracking } from "@/components/user/order-tracking"

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Track Your Order</h1>
            <p className="text-slate-600">Enter your order ID to get real-time updates on your hijab delivery</p>
          </div>

          <OrderTracking />
        </div>
      </div>

      <Footer />
    </div>
  )
}
