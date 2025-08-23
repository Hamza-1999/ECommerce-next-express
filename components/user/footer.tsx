import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-amber-400 mb-4">Hijab Collection</h3>
            <p className="text-slate-300 mb-4">
              Premium quality hijabs crafted with care for the modern Muslim woman. Discover elegance, comfort, and
              style.
            </p>
            <div className="flex gap-4">
              <Facebook className="h-5 w-5 text-slate-400 hover:text-amber-400 cursor-pointer" />
              <Instagram className="h-5 w-5 text-slate-400 hover:text-amber-400 cursor-pointer" />
              <Twitter className="h-5 w-5 text-slate-400 hover:text-amber-400 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link href="/" className="hover:text-amber-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-amber-400">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link href="/shipping" className="hover:text-amber-400">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-amber-400">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-amber-400">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-amber-400">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@hijabcollection.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>123 Fashion Ave, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
          <p>&copy; 2024 Hijab Collection. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
