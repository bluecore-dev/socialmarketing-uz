import { createContext, useContext, ReactNode, useCallback, useEffect, useRef } from "react";
import { useGetMe, setAuthTokenGetter, getGetMeQueryKey, refreshToken } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getStoredToken, storeToken } from "@/lib/auth-tokens";

export { getStoredToken, storeToken, clearStoredToken } from "@/lib/auth-tokens";

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

setAuthTokenGetter(() => getStoredToken());

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const refreshAttemptedRef = useRef(false);

  const meQuery = useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  });

  useEffect(() => {
    if (
      !refreshAttemptedRef.current &&
      !meQuery.isLoading &&
      !meQuery.data &&
      !getStoredToken()
    ) {
      refreshAttemptedRef.current = true;
      (async () => {
        try {
          const result = await refreshToken();
          if (result?.accessToken) {
            const persist = !!localStorage.getItem("bluecore_access_token");
            storeToken(result.accessToken, persist);
            await queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          }
        } catch {
        }
      })();
    }
  }, [meQuery.isLoading, meQuery.data, queryClient]);

  const refetch = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
  }, [queryClient]);

  const user = meQuery.data as User | null | undefined;

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading: meQuery.isLoading,
        isAuthenticated: !!user,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
