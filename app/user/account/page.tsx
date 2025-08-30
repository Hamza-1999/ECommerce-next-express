"use client";

import { Header } from "@/components/user/header";
import { Footer } from "@/components/user/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { mockAuth } from "@/lib/auth"
import { mockOrders } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Package, CreditCard, LogOut, Edit } from "lucide-react";
import {
  useAddAddress,
  useDeleteAddress,
  useLogout,
  useMyProfile,
  useUpdateAddress,
  useUpdateProfile,
} from "@/lib/hooks/api";
import { toast } from "sonner";
import useStore from "@/components/store/store";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IAddAddress } from "@/lib/API/api";

const formSchema = z.object({
  house: z.string().min(2, "house is required field"),
  city: z.string().min(2, "city is required field"),
  zip: z.string().min(2, "zip is required field"),
  label: z.string().nonempty("label is required field"),
  isDefault: z.boolean(),
});
export default function AccountPage() {
  const { mutate: updateAddress, isPending: updating } = useUpdateAddress();
  const { mutate: deleteAddress } = useDeleteAddress();
  const { mutate: addAddress } = useAddAddress();
  const { setLoggedIn } = useStore();
  const router = useRouter();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { data, isLoading, refetch } = useMyProfile();
  const { mutate: loggingOut } = useLogout();
  const profileData = data?.user;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: {
      house: "",
      zip: "",
      city: "",
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // defaultValues: {
    //   house: "",
    //   zip: "",
    //   city: "",
    //   label: "Home",
    //   isDefault: false,
    // },
  });

  // Address modal state
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    house: "",
    city: "",
    zip: "",
    label: "Home",
    isDefault: false,
  });

  // Update form data when profile data loads
  useEffect(() => {
    if (profileData) {
      setLoggedIn(profileData.firstName);
      setFormData({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        phone: profileData.phone || "",
        address: {
          house: profileData.address?.house || "",
          zip: profileData.address?.zip || "",
          city: profileData.address?.city || "",
        },
      });
    }
  }, [profileData]);

  const handleLogout = () => {
    loggingOut(undefined, {
      onSuccess: () => {
        setLoggedIn("");
        toast.success("successfully log out");
        router.push("/user/login");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "error to logout");
      },
    });
  };

  const handleSaveProfile = () => {
    updateProfile(
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: {
          house: formData.address.house,
          zip: formData.address.zip,
          city: formData.address.city,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Profile updated successfully!");
          refetch();
        },
        onError: (error) => {
          toast.error("Failed to update profile. Please try again.");
          console.error("Profile update error:", error);
        },
      }
    );
  };

  const handleCancelEdit = () => {
    // Reset form data to original values
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        phone: profileData.phone || "",
        address: {
          house: profileData.address?.house || "",
          zip: profileData.address?.zip || "",
          city: profileData.address?.city || "",
        },
      });
    }
    setIsEditing(false);
  };

  // Address form handlers
  const handleAddressInputChange = (field: string, value: string | boolean) => {
    setAddressFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDelete = (id: string) => {
    deleteAddress(id, {
      onSuccess: () => {
        toast.success("Delete address successfully");
        refetch();
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message || "Error in Deleting address"
        );
      },
    });
  };

  const handleAddressUpdate = async (id: string, data: IAddAddress) => {
    await updateAddress(
      { id, data },
      {
        onSuccess: () => {
          toast.success("Address updated successfully");
          refetch();
          setEditingAddressId(null); // Open for this address
        },
        onError: (err: any) => {
          console.log(err, "error in updating address");
          toast.error(
            err?.response?.data?.messga || "error occur in updating address"
          );
        },
      }
    );
  };

  const handleAddAddress = () => {
    // Validate required fields
    if (
      !addressFormData.house ||
      !addressFormData.city ||
      !addressFormData.zip
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    addAddress(addressFormData, {
      onSuccess: () => {
        refetch();
        console.log("Adding address:", addressFormData);
        toast.success("Address added successfully!");
        setAddressFormData({
          house: "",
          city: "",
          zip: "",
          label: "Home",
          isDefault: false,
        });
        setIsAddressModalOpen(false);
      },
      onError: (err) => {
        console.log(err, "error to add new address");
        toast.error(
          (err as any)?.response?.data?.message || `error to add new address`
        );
      },
    });
  };

  const handleCancelAddAddress = () => {
    setAddressFormData({
      house: "",
      city: "",
      zip: "",
      label: "Home",
      isDefault: false,
    });
    setIsAddressModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Account</h1>
            <p className="text-slate-600">
              Welcome back, {profileData?.firstName}!
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 hover:text-red-700 bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Package className="h-6 w-6 text-amber-800" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">12</p>
                      <p className="text-sm text-slate-600">Total Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Package className="h-6 w-6 text-green-800" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">8</p>
                      <p className="text-sm text-slate-600">Delivered</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <CreditCard className="h-6 w-6 text-blue-800" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        $847.50
                      </p>
                      <p className="text-sm text-slate-600">Total Spent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrders.slice(0, 3).map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-semibold">
                            Order #{order._id.toUpperCase()}
                          </p>
                          <p className="text-sm text-slate-600">
                            {order.items.length} items
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <p className="text-sm text-slate-600 mt-1">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockOrders.map((order) => (
                    <div key={order._id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">
                            Order #{order._id.toUpperCase()}
                          </h3>
                          <p className="text-sm text-slate-600">
                            Placed on{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <Image
                              src="/soft-silk-hijab.png"
                              alt="Product"
                              width={60}
                              height={60}
                              className="w-15 h-15 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium">Premium Hijab</p>
                              <p className="text-sm text-slate-600">
                                {item.color} • {item.size} • Qty:{" "}
                                {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-4" />

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-600">
                            Shipping to: {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            Total: ${order.totalAmount.toFixed(2)}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 bg-transparent"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleSaveProfile}
                        size="sm"
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        size="sm"
                        disabled={isUpdating}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      disabled={!isEditing || isUpdating}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      disabled={!isEditing || isUpdating}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData?.email || ""}
                    disabled={true}
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email address cannot be changed
                  </p>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    disabled={!isEditing || isUpdating}
                  />
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="house">House/Street Address</Label>
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
                        disabled={!isEditing || isUpdating}
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
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
                        disabled={!isEditing || isUpdating}
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
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
                        disabled={!isEditing || isUpdating}
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Shipping Addresses</CardTitle>
                <Dialog
                  open={isAddressModalOpen}
                  onOpenChange={setIsAddressModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">Add New Address</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Address</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="house">House/Street Address</Label>
                        <Input
                          id="house"
                          value={addressFormData.house}
                          onChange={(e) =>
                            handleAddressInputChange("house", e.target.value)
                          }
                          placeholder="Enter your street address"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={addressFormData.city}
                          onChange={(e) =>
                            handleAddressInputChange("city", e.target.value)
                          }
                          placeholder="Enter your city"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input
                          id="zip"
                          value={addressFormData.zip}
                          onChange={(e) =>
                            handleAddressInputChange("zip", e.target.value)
                          }
                          placeholder="Enter your ZIP code"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="label">Address Label</Label>
                        <Select
                          value={addressFormData.label}
                          onValueChange={(value) =>
                            handleAddressInputChange("label", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select address type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Home">Home</SelectItem>
                            <SelectItem value="Office">Office</SelectItem>
                            <SelectItem value="Work">Work</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isDefault"
                          checked={addressFormData.isDefault}
                          onChange={(e) =>
                            handleAddressInputChange(
                              "isDefault",
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="isDefault">
                          Set as default address
                        </Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={handleCancelAddAddress}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddAddress}>Add Address</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              {profileData?.addresses.length > 0 ? (
                profileData?.addresses?.map((address: any, i: number) => (
                  <CardContent key={address.city + i}>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">Home Address</p>
                            <p className="text-slate-600">
                              {address?.house || "No address provided"}
                              <br />
                              {address?.city && address?.zip && (
                                <>
                                  {address.city}, {address.zip}
                                </>
                              )}
                            </p>
                            <Badge variant="secondary" className="mt-2">
                              {address.isDefault ? "Default" : ""}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Dialog
                              open={editingAddressId === address._id}
                              onOpenChange={(value) => {
                                if (value) {
                                  setEditingAddressId(address._id); // Open for this address
                                  // When dialog opens, reset form values with current address
                                  form.reset({
                                    house: address.house,
                                    city: address.city,
                                    zip: address.zip,
                                    label: address.label,
                                    isDefault: address.isDefault,
                                  });
                                } else {
                                  setEditingAddressId(null); // Close modal
                                  form.reset(); // Reset to empty or default when closing
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline">Edit</Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Address</DialogTitle>
                                  <DialogDescription>
                                    Make changes to your address here. Click
                                    save when you&apos;re done.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4">
                                  <Form {...form}>
                                    <form
                                      onSubmit={form.handleSubmit((data: any) =>
                                        handleAddressUpdate(
                                          address._id as string,
                                          data
                                        )
                                      )}
                                      className="space-y-8"
                                    >
                                      <FormField
                                        // defaultValue={address.house}
                                        control={form.control}
                                        name="house"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>House</FormLabel>
                                            <FormControl>
                                              <Input
                                                placeholder="House...."
                                                {...field}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        // defaultValue={address.city}
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                              <Input
                                                placeholder="City..."
                                                {...field}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        // defaultValue={address.zip}
                                        control={form.control}
                                        name="zip"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>ZIP</FormLabel>
                                            <FormControl>
                                              <Input
                                                placeholder="ZIP Code..."
                                                type="number"
                                                {...field}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        // defaultValue={address.label}
                                        control={form.control}
                                        name="label"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Label</FormLabel>
                                            <FormControl>
                                              <Select
                                                value={addressFormData.label}
                                                onValueChange={(value) =>
                                                  handleAddressInputChange(
                                                    "label",
                                                    value
                                                  )
                                                }
                                              >
                                                <SelectTrigger className="min-w-full">
                                                  <SelectValue placeholder="Select address type" />
                                                </SelectTrigger>
                                                <SelectContent className="min-w-full">
                                                  <SelectItem value="Home">
                                                    Home
                                                  </SelectItem>
                                                  <SelectItem value="Office">
                                                    Office
                                                  </SelectItem>
                                                  <SelectItem value="Work">
                                                    Work
                                                  </SelectItem>
                                                </SelectContent>
                                              </Select>
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        // defaultValue={address.isDefault}
                                        control={form.control}
                                        name="isDefault"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Default</FormLabel>
                                            <FormControl>
                                              <div className="flex items-center gap-3">
                                                <input
                                                  id="label"
                                                  type="checkbox"
                                                  checked={field.value}
                                                  onChange={field.onChange}
                                                  onBlur={field.onBlur}
                                                  name={field.name}
                                                  ref={field.ref}
                                                />
                                                <Label
                                                  className="text-sm"
                                                  htmlFor="isDefault"
                                                >
                                                  Set as default address
                                                </Label>
                                              </div>
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <Button
                                        className="w-max mx-auto"
                                        type="submit"
                                      >
                                        {updating ? "submitting..." : "Submit"}
                                      </Button>
                                    </form>
                                  </Form>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              onClick={() => handleDelete(address._id)}
                              size="sm"
                              variant="outline"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                ))
              ) : (
                <p className="mx-auto w-max font-bold italic text-red-500 text-sm">
                  *No Address Exists*
                </p>
              )}
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-slate-600">
                      Receive updates about your orders and promotions
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-slate-600">
                      Change your account password
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-600">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between text-red-600">
                  <div>
                    <h4 className="font-medium">Delete Account</h4>
                    <p className="text-sm">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
