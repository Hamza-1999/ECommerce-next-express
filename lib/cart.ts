import type { CartItem } from "./types"

class CartManager {
  private items: CartItem[] = []

  addItem(item: CartItem) {
    const existingItemIndex = this.items.findIndex(
      (i) => i.productId === item.productId && i.color === item.color && i.size === item.size,
    )

    if (existingItemIndex > -1) {
      this.items[existingItemIndex].quantity += item.quantity
    } else {
      this.items.push(item)
    }

    this.saveToStorage()
  }

  removeItem(productId: string, color: string, size: string) {
    this.items = this.items.filter(
      (item) => !(item.productId === productId && item.color === color && item.size === size),
    )
    this.saveToStorage()
  }

  updateQuantity(productId: string, color: string, size: string, quantity: number) {
    const itemIndex = this.items.findIndex((i) => i.productId === productId && i.color === color && i.size === size)

    if (itemIndex > -1) {
      if (quantity <= 0) {
        this.removeItem(productId, color, size)
      } else {
        this.items[itemIndex].quantity = quantity
        this.saveToStorage()
      }
    }
  }

  getItems(): CartItem[] {
    return this.items
  }

  getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0)
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  clearCart() {
    this.items = []
    this.saveToStorage()
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(this.items))
    }
  }

  loadFromStorage() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart")
      if (saved) {
        this.items = JSON.parse(saved)
      }
    }
  }
}

export const cart = new CartManager()
