import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { AuthClient } from '~/features/auth';
import type { ILoginResponse } from '~/features/auth';
import { tokenManager } from '~/lib/token-manager';
type AuthProviderProps = {
  children: React.ReactNode;
};

type Profile = {
  uid: string;
  name: string;
  isDisable: boolean;
  isInit: boolean;
  role: string;
  permissions: string[];
};

type AsyncResult<T> = Promise<[T | null, unknown]>;

type AuthProviderState = {
  profile:
    | {
        uid: string;
        name: string;
        isDisable: boolean;
        isInit: boolean;
        role: string;
        permissions: string[];
      }
    | undefined;
  isAdmin: boolean;
  setProfile: (profile: any) => void;
  login: (
    email: string,
    password: string
  ) => AsyncResult<ILoginResponse['data']['data']>;
  logout: () => AsyncResult<null>;
};

const AuthProviderContext = createContext<AuthProviderState | undefined>(
  undefined
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const isAdmin = useMemo(() => {
    return profile?.role === 'root' || profile?.role === 'admin';
  }, [profile]);

  const logout = useCallback(async (): AsyncResult<null> => {
    // 清除 token 和狀態
    try {
      await AuthClient.logout();
      tokenManager.removeAccessToken();
      tokenManager.removeRefreshToken();
      setProfile(undefined);
      return [null, null];
    } catch (error) {
      console.error(error);
      return [null, error];
    }
  }, [AuthClient]);

  const login = useCallback(
    async (
      uid: string,
      password: string
    ): AsyncResult<ILoginResponse['data']['data']> => {
      try {
        const { data: axiosData } = await AuthClient.login({ uid, password });
        setProfile(axiosData.data.profile);
        tokenManager.setAccessToken(axiosData.data.accessToken);
        return [axiosData.data, null];
      } catch (error) {
        console.error(error);
        return [null, error];
      }
    },
    [AuthClient]
  );

  return (
    <AuthProviderContext.Provider
      value={{
        profile,
        isAdmin,
        setProfile,
        logout,
        login,
      }}
    >
      {children}
    </AuthProviderContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthProviderContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
