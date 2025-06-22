import { createContext, useContext, useState, useCallback } from 'react';
import AuthClient from '~/api/auth';
import { tokenManager } from '~/lib/token-manager';
import type { ILoginResponse } from '~/api/types';
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
  setProfile: (profile: any) => void;
  login: (email: string, password: string) => AsyncResult<ILoginResponse>;
  logout: () => AsyncResult<null>;
};

const AuthProviderContext = createContext<AuthProviderState | undefined>(
  undefined
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [profile, setProfile] = useState<Profile | undefined>(undefined);

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
    async (uid: string, password: string): AsyncResult<ILoginResponse> => {
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
