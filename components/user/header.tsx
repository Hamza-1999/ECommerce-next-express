"use client";

import Link from "next/link";
import { ShoppingBag, Search, User, Menu, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cart } from "@/lib/cart";
import { useState, useEffect } from "react";
import { useMyProfile } from "@/lib/hooks/api";
import useStore from "../store/store";

export function Header() {
  const { loggedIn } = useStore();
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    cart.loadFromStorage();
    setCartItemCount(cart.getTotalItems());
  }, []);

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 text-sm text-muted-foreground">
          <p>Free shipping on orders over $50</p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-foreground">
              Contact Us
            </Link>
            <Link href="/user/login" className="hover:text-foreground">
              Sign In
            </Link>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold text-amber-800">
            Hijab Collection
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="hover:text-amber-800 transition-colors">
              Home
            </Link>
            <Link
              href="/products"
              className="hover:text-amber-800 transition-colors"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="hover:text-amber-800 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="hover:text-amber-800 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Input placeholder="Search hijabs..." className="w-64" />
              <Button size="icon" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <Button
              className="w-max hover:bg-transparent cursor-pointer"
              size="icon"
              variant="ghost"
            >
              {loggedIn !== "" ? (
                <Link href="/user/account">
                  <div className="w-max">
                    <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {loggedIn.charAt(0)?.toUpperCase()}
                    </div>
                  </div>
                </Link>
              ) : (
                <Link href="/user/login">
                  <User className="h-4 w-4" />
                </Link>
              )}
            </Button>

            <Link href="/cart" className="relative">
              <Button size="icon" variant="ghost">
                <ShoppingBag className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button size="icon" variant="ghost">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/" className="text-lg hover:text-amber-800">
                    Home
                  </Link>
                  <Link
                    href="/products"
                    className="text-lg hover:text-amber-800"
                  >
                    Products
                  </Link>
                  <Link href="/about" className="text-lg hover:text-amber-800">
                    About Us
                  </Link>
                  <Link
                    href="/contact"
                    className="text-lg hover:text-amber-800"
                  >
                    Contact
                  </Link>
                  <div className="mt-4">
                    <Input placeholder="Search hijabs..." />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
