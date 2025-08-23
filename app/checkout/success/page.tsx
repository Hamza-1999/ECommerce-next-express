import { Header } from "@/components/user/header"
import { Footer } from "@/components/user/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react"

export default function CheckoutSuccessPage() {
  const orderNumber = "HJB-" + Math.random().toString(36).substr(2, 9).toUpperCase()

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
            <p className="text-lg text-slate-600">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          {/* Order Details */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Order Number</h3>
                  <p className="text-amber-800 font-mono">{orderNumber}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Estimated Delivery</h3>
                  <p className="text-slate-600">3-5 business days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-amber-800 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Confirmation Email</h3>
                <p className="text-sm text-slate-600">We've sent a confirmation email with your order details</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Package className="h-8 w-8 text-amber-800 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Order Processing</h3>
                <p className="text-sm text-slate-600">Your order is being prepared for shipment</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <ArrowRight className="h-8 w-8 text-amber-800 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Tracking Info</h3>
                <p className="text-sm text-slate-600">You'll receive tracking details once shipped</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button variant="outline" size="lg">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/user/account">
              <Button size="lg" className="bg-amber-800 hover:bg-amber-900">
                View Order Status
              </Button>
            </Link>
          </div>

          {/* Support */}
          <div className="mt-12 p-6 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
            <p className="text-slate-600 mb-4">
              If you have any questions about your order, please don't hesitate to contact us.
            </p>
            <Link href="/contact">
              <Button variant="outline">Contact Support</Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
