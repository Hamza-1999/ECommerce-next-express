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
}

export const Register = async ({
  firstName,
  lastName,
  email,
  password,
  phone,
}: RegisterProps): Promise<User | null> => {
  console.log("Attempting to register user:", {
    firstName,
    lastName,
    email,
    phone,
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
  const res = await axios.get("http://localhost:5000/auth/myProfile");
  return res.data;
};
