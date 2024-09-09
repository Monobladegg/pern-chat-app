import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import baseAPI from "../api/api";
import toast from "react-hot-toast";
const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    try {
      const res = await baseAPI.post("/api/auth/logout");
      const data = res.data;
      if (!res.status) throw new Error(data.message);
      setAuthUser(null);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};

export default useLogout;
