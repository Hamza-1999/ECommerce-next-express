import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Login,
  LoginProps,
  MyProfile,
  Register,
  RegisterProps,
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
    }: RegisterProps) =>
      Register({ firstName, lastName, email, password, phone }),
  });
};

export const useMyProfile = () => {
  return useQuery({
    queryKey: ["MyProfile"],
    queryFn: MyProfile,
  });
};
