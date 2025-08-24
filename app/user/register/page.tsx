"use client"

import type React from "react"

import { Header } from "@/components/user/header"
import { Footer } from "@/components/user/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, User, Phone, Sparkles, Shield, Users, CheckCircle } from "lucide-react"
import { useRegister } from "@/lib/hooks/api"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: true,
    address: {
      house: "",
      zip: "",
      city: "",
    },
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { mutate: register, isPending: isLoading } = useRegister()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
      // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms and conditions"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    register({ 
      firstName: formData.firstName, 
      lastName: formData.lastName, 
      email: formData.email, 
      password: formData.password, 
      phone: formData.phone,
      address: {
        house: formData.address.house,
        zip: formData.address.zip,
        city: formData.address.city,
      }
    }, {
      onSuccess: () => {
        toast.success("Account created successfully! Please sign in.")
        router.push("/user/login")
      },
      onError: (error) => {
        console.log(error)
        setErrors({ general: (error as any)?.response?.data?.message || "Registration failed. Please try again." })
        toast.error((error as any)?.response?.data?.message || "Registration failed. Please try again.")
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <Header />

      <div className="container mx-auto px-4 pb-16 pt-16">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-amber-800" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">Create Account</CardTitle>
              <p className="text-slate-600">Join our community of hijab lovers</p>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {errors.general}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">First Name</Label>
                    <div className="relative">
                      <Input
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        placeholder="Sarah"
                        className="pl-10 h-12 border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                    {errors.firstName && <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {errors.firstName}
                    </p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">Last Name</Label>
                    <div className="relative">
                      <Input
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        placeholder="Ahmed"
                        className="pl-10 h-12 border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    </div>
                    {errors.lastName && <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {errors.lastName}
                    </p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@example.com"
                      className="pl-10 h-12 border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                  {errors.email && <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    {errors.email}
                  </p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone Number (Optional)</Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="pl-10 h-12 border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="house" className="text-sm font-medium text-slate-700">House/Street Address</Label>
                      <Input
                        id="house"
                        value={formData.address.house}
                        onChange={(e) => 
                          setFormData((prev) => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              house: e.target.value,
                            },
                          }))
                        }
                        placeholder="123 Main Street"
                        className="h-12 border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-medium text-slate-700">City</Label>
                      <Input
                        id="city"
                        value={formData.address.city}
                        onChange={(e) => 
                          setFormData((prev) => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              city: e.target.value,
                            },
                          }))
                        }
                        placeholder="New York"
                        className="h-12 border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip" className="text-sm font-medium text-slate-700">ZIP Code</Label>
                      <Input
                        id="zip"
                        value={formData.address.zip}
                        onChange={(e) => 
                          setFormData((prev) => ({
                            ...prev,
                            address: {
                              ...prev.address,
                              zip: e.target.value,
                            },
                          }))
                        }
                        placeholder="10001"
                        className="h-12 border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Create a strong password"
                        className="pl-10 pr-10 h-12 border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {errors.password}
                    </p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10 h-12 border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {errors.confirmPassword}
                    </p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                      className="mt-1 border-slate-300 data-[state=checked]:bg-amber-800 data-[state=checked]:border-amber-800"
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed text-slate-600">
                      I agree to the{" "}
                      <Link href="/terms" className="text-amber-800 hover:text-amber-900 font-medium">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-amber-800 hover:text-amber-900 font-medium">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  {errors.agreeToTerms && <p className="text-red-600 text-xs flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    {errors.agreeToTerms}
                  </p>}

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="subscribeNewsletter"
                      checked={formData.subscribeNewsletter}
                      onCheckedChange={(checked) => handleInputChange("subscribeNewsletter", checked as boolean)}
                      className="border-slate-300 data-[state=checked]:bg-amber-800 data-[state=checked]:border-amber-800"
                    />
                    <Label htmlFor="subscribeNewsletter" className="text-sm text-slate-600">
                      Subscribe to our newsletter for exclusive offers and updates
                    </Label>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-amber-800 to-orange-800 hover:from-amber-900 hover:to-orange-900 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="mt-8">
                <Separator className="my-6" />
                <p className="text-center text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link href="/user/login" className="text-amber-800 hover:text-amber-900 font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
