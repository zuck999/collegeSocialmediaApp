import { useMutation } from "@tanstack/react-query";
import {user} from "./api";


type LoginInput = {
  email: string;
  password: string;
};

type SignupInput = {
  username: string;
  email: string;
  password: string;
  faculty: string;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (input: LoginInput) => user.post.login(input),
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (input: SignupInput) => user.post.signup(input),
  });
};
