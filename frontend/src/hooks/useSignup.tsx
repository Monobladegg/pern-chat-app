import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import baseAPI from "../api/api";
import toast from "react-hot-toast";

export type SignupInputs = {
  username: string;
  password: string;
  confirmPassword: string;
  gender: "male" | "female";
  fullName: string;
}

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const {setAuthUser} = useAuthContext();

  const signup = async (inputs: SignupInputs) => {
    try {
      const res = await baseAPI.post("/api/auth/signup", inputs);
      const data = res.data;
      if (!res.status) throw new Error(`HTTP error! status: ${res.status}`);

      setAuthUser(data);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  return {loading, signup}
}

export default useSignup