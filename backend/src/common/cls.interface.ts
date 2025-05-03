import { ClsStore } from 'nestjs-cls';

export interface AppClsStore extends ClsStore {
  user: {
    // guest 訪客為登入
    role: 'guest' | string;
    uid?: string;
    name?: string;
    isInit?: boolean;
    isDisable?: boolean;
    permissions?: string[];
  };
  reqInfo: {
    method: string;
    path: string;
    ip: string;
    userAgent: string;
    traceId: string;
  };
}
