import axios from "axios";
import { User } from "../types";

export interface LoginProps {
  email: string;
  password: string;
}

export const Login = async ({
  email,
  password,
}: LoginProps): Promise<User | null> => {
  const res = await axios.post(
    "http://localhost:5000/auth/login",
    {
      email,
      password,
    },
    {
      withCredentials: true,
    }
  );
  return res.data;
};
export interface RegisterProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: {
    house: string;
    zip: string;
    city: string;
  };
}

export const Register = async ({
  firstName,
  lastName,
  email,
  password,
  phone,
  address,
}: RegisterProps): Promise<User | null> => {
  console.log("Attempting to register user:", {
    firstName,
    lastName,
    email,
    phone,
    address,
  });
  try {
    const res = await axios.post(
      "http://localhost:5000/auth/register",
      {
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
      },
      {
        withCredentials: true,
      }
    );
    console.log("Registration successful:", res.data);
    return res.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const MyProfile = async () => {
  const res = await axios.get("http://localhost:5000/auth/myProfile", {
    withCredentials: true,
  });
  return res.data;
};

export interface updateProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    house?: string;
    zip?: string;
    city?: string;
  };
}

export const UpdateProfile = async (profile: updateProfile) => {
  const res = await axios.patch(
    "http://localhost:5000/auth/updateProfile",
    profile,
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const Logout = async () => {
  const res = await axios.get("http://localhost:5000/auth/logout", {
    withCredentials: true,
  });
  return res.data;
};

export interface IAddAddress {
  house: string;
  city: string;
  zip: string;
  label: string;
  isDefault: boolean;
}

export const AddAddress = async (data: IAddAddress) => {
  const res = await axios.post("http://localhost:5000/auth/addAddress", data, {
    withCredentials: true,
  });
  return res.data;
};

export const RemoveAddress = async (id: string) => {
  const res = await axios.delete(`http://localhost:5000/auth/address/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const UpdateAddress = async (id: string, data: IAddAddress) => {
  const res = await axios.put(
    `http://localhost:5000/auth/address/${id}`,
    data,
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await axios.post(`http://localhost:5000/auth/forgotPassword`, {
    email,
  });
  return res.data;
};

export const CreatePassword = async (email: string, password: string) => {
  const res = await axios.post(
    `http://localhost:5000/auth/create-password/${email}`,
    { password }
  );
  return res.data;
};
