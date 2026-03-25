import { createContext, useContext, ReactNode } from "react";
import { useGetMe, setAuthTokenGetter, getGetMeQueryKey } from "@workspace/api-client-react";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
  company?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  refetch: () => {},
});

const TOKEN_KEY = "bluecore_access_token";

export function getStoredToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function storeToken(token: string): void {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

export function clearStoredToken(): void {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

setAuthTokenGetter(() => getStoredToken());

export function AuthProvider({ children }: { children: ReactNode }) {
  const meQuery = useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  });

  const user = meQuery.data as User | null | undefined;

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading: meQuery.isLoading,
        isAuthenticated: !!user,
        refetch: meQuery.refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
