import { useState } from 'react'
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import baseAPI from '../api/api';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const {setAuthUser} = useAuthContext();

  const login = async (username: string, password: string) => {
    try {
      const res = await baseAPI.post('/api/auth/login', {username, password});
      const data = res.data;
      if (!res.status) throw new Error(`HTTP error! status: ${res.status}`);
      setAuthUser(data);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    finally {
      setLoading(false);
    }
  }

  return {loading, login}

}

export default useLogin
