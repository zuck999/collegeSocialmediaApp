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

export const user = {
  post: {
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
