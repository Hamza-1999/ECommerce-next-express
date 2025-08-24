import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Login,
  LoginProps,
  MyProfile,
  Register,
  RegisterProps,
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
      address
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
