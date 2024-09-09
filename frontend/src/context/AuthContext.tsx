import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import baseAPI from "../api/api";

type AuthUserType = {
  id: string;
  name: string;
  email: string;
  profilePic: string;
  gender: "male" | "female";
};

const AuthContext = createContext<{
  authUser: AuthUserType | null;
  setAuthUser: Dispatch<SetStateAction<AuthUserType | null>>;
  isLoading: boolean;
}>({
  authUser: null,
  setAuthUser: () => {},
  isLoading: true,
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within an AuthContextProvider");
  return context;
};

export const AuthContextProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authUser, setAuthUser] = useState<AuthUserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthUser = async () => {
      try {
        const res = await baseAPI.get("/api/auth/me");
        if (res.status !== 200) throw new Error(`HTTP error! status: ${res.status}`);
        const contentType = res.headers['content-type'];
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = res.data;
          setAuthUser(data);
        } else {
          throw new Error("Oops, we haven't got JSON!");
        }
      } catch (error) {
        console.error('Error fetching auth user:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuthUser();
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
