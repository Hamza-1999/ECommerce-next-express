"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockUsers, mockOrders } from "@/lib/mock-data"
import { Search, Mail, Phone, MapPin, Eye, Edit, Trash2, UserPlus } from "lucide-react"

// Mock customer data with additional fields
const mockCustomers = [
  {
    _id: "customer1",
    firstName: "Sarah",
    lastName: "Ahmed",
    email: "sarah.ahmed@example.com",
    phone: "+1234567890",
    address: {
      city: "New York",
      state: "NY",
      country: "USA"
    },
    totalOrders: 5,
    totalSpent: 299.95,
    lastOrder: "2024-01-15",
    status: "active",
    joinDate: "2023-06-10"
  },
  {
    _id: "customer2",
    firstName: "Fatima",
    lastName: "Khan",
    email: "fatima.khan@example.com",
    phone: "+1987654321",
    address: {
      city: "Los Angeles",
      state: "CA",
      country: "USA"
    },
    totalOrders: 3,
    totalSpent: 159.97,
    lastOrder: "2024-01-10",
    status: "active",
    joinDate: "2023-08-22"
  },
  {
    _id: "customer3",
    firstName: "Aisha",
    lastName: "Hassan",
    email: "aisha.hassan@example.com",
    phone: "+1555123456",
    address: {
      city: "Chicago",
      state: "IL",
      country: "USA"
    },
    totalOrders: 8,
    totalSpent: 479.92,
    lastOrder: "2024-01-18",
    status: "active",
    joinDate: "2023-03-15"
  },
  {
    _id: "customer4",
    firstName: "Zara",
    lastName: "Mohammed",
    email: "zara.mohammed@example.com",
    phone: "+1444333222",
    address: {
      city: "Houston",
      state: "TX",
      country: "USA"
    },
    totalOrders: 2,
    totalSpent: 79.98,
    lastOrder: "2023-12-20",
    status: "inactive",
    joinDate: "2023-11-05"
  },
  {
    _id: "customer5",
    firstName: "Noor",
    lastName: "Ali",
    email: "noor.ali@example.com",
    phone: "+1777888999",
    address: {
      city: "Miami",
      state: "FL",
      country: "USA"
    },
    totalOrders: 12,
    totalSpent: 719.88,
    lastOrder: "2024-01-20",
    status: "active",
    joinDate: "2023-01-12"
  }
]

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const filteredCustomers = mockCustomers
    .filter((customer) => {
      const matchesSearch = 
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "active" && customer.status === "active") ||
        (filterBy === "inactive" && customer.status === "inactive") ||
        (filterBy === "high-value" && customer.totalSpent > 300) ||
        (filterBy === "new" && new Date(customer.joinDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        case "total-spent":
          return b.totalSpent - a.totalSpent
        case "total-orders":
          return b.totalOrders - a.totalOrders
        case "join-date":
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
        case "last-order":
          return new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime()
        default:
          return 0
      }
    })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-600">Manage your customer database</p>
        </div>
        <Button className="bg-amber-800 hover:bg-amber-900">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Customers</p>
                <p className="text-2xl font-bold text-slate-900">{mockCustomers.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Customers</p>
                <p className="text-2xl font-bold text-slate-900">
                  {mockCustomers.filter(c => c.status === "active").length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <UserPlus className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">High Value Customers</p>
                <p className="text-2xl font-bold text-slate-900">
                  {mockCustomers.filter(c => c.totalSpent > 300).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">New This Month</p>
                <p className="text-2xl font-bold text-slate-900">
                  {mockCustomers.filter(c => new Date(c.joinDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search customers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="high-value">High Value</SelectItem>
                <SelectItem value="new">New This Month</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="total-spent">Total Spent</SelectItem>
                <SelectItem value="total-orders">Total Orders</SelectItem>
                <SelectItem value="join-date">Join Date</SelectItem>
                <SelectItem value="last-order">Last Order</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div key={customer._id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50">
                <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-800 font-semibold text-lg">
                    {customer.firstName[0]}{customer.lastName[0]}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {customer.firstName} {customer.lastName}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                        )}
                        {customer.address && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {customer.address.city}, {customer.address.state}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={customer.status === "active" ? "default" : "secondary"}
                          className={
                            customer.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {customer.status}
                        </Badge>
                        {customer.totalSpent > 300 && (
                          <Badge className="bg-amber-100 text-amber-800">High Value</Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">${customer.totalSpent.toFixed(2)}</p>
                      <p className="text-sm text-slate-600">{customer.totalOrders} orders</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Last order: {new Date(customer.lastOrder).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

