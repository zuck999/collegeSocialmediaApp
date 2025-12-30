import { useMutation } from "@tanstack/react-query";
import { commonApi } from "./api";

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
    mutationFn: (input: LoginInput) => commonApi.auth.login(input)
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (input: SignupInput) => commonApi.auth.signup(input),
  });
};

export const usePostComment = () => {
  return useMutation({
    mutationFn: ({postId,text}:{ postId: string; text: string }) => commonApi.posts.postComment(postId,text)
  })
}

export const useDeletePost = () =>{
  return useMutation({
    mutationFn:(postId:string) => commonApi.posts.deletePost(postId)
  })
}
