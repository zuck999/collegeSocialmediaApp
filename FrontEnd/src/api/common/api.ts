import axiosInstance from "@/utils/axios.Instance";

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

export const commonApi = {

  posts: {

    getAllPost: async ()=>{
          const res = await axiosInstance.get("/post/all");
          return res.data;
    },

    likeDislike: async (postId: string, action: 'like' | 'dislike') => {
      const res = await axiosInstance.get(`/post/${postId}/${action}`);
      return res.data;
    },

    postComment: async (postId: string, text: string) => {
      const res = await axiosInstance.post(`/post/${postId}/comment`, { text });
      return res.data;
    },

    deletePost: async (postId: string) => {
      const res = await axiosInstance.delete(`/post/delete/${postId}`);
      return res.data;
    },
  },
  

  auth: {
    login: async (input: LoginInput) => {
      const res = await axiosInstance.post("/user/login", input);
      return res.data;
    },

    signup: async (input: SignupInput) => {
      const res = await axiosInstance.post("/user/register", input);
      return res.data;
    },
    
  },
};
