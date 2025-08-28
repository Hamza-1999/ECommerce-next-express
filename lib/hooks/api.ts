import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AddAddress,
  CreatePassword,
  forgotPassword,
  IAddAddress,
  Login,
  LoginProps,
  Logout,
  MyProfile,
  Register,
  RegisterProps,
  RemoveAddress,
  UpdateAddress,
  updateProfile,
  UpdateProfile,
} from "../API/api";

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ email, password }: LoginProps) => Login({ email, password }),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: ({
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
    }: RegisterProps) =>
      Register({ firstName, lastName, email, password, phone, address }),
  });
};

export const useMyProfile = () => {
  return useQuery({
    queryKey: ["MyProfile"],
    queryFn: MyProfile,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: (data: updateProfile) => UpdateProfile(data),
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: Logout,
  });
};

export const useAddAddress = () => {
  return useMutation({
    mutationFn: (data: IAddAddress) => AddAddress(data),
  });
};

export const useDeleteAddress = () => {
  return useMutation({
    mutationFn: (id: string) => RemoveAddress(id),
  });
};

export const useUpdateAddress = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IAddAddress }) =>
      UpdateAddress(id, data),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: ({ data }: { data: string }) => forgotPassword(data),
  });
};

export const useCreatePassword = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      CreatePassword(email, password),
  });
};
