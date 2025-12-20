class TokenManager {
  private static instance: TokenManager | null = null;
  private accessToken: string | null = null;

  private constructor() {}
  /**
   * 取得 TokenManager 的單例實例。
   * @returns {TokenManager} TokenManager 的實例。
   */
  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * 取得存取權杖。
   * @returns {string | null} 存取權杖。
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * 設定存取權杖。
   * @param {string} accessToken - 存取權杖。
   */
  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * 移除存取權杖。
   */
  removeAccessToken(): void {
    this.accessToken = null;
  }

  /**
   * 設定刷新權杖。
   * @param {string} refreshToken - 刷新權杖。
   */
  setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * 取得刷新權杖。
   * @returns {string | null} 刷新權杖。
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * 移除刷新權杖。
   */
  removeRefreshToken(): void {
    localStorage.removeItem('refreshToken');
  }
}

export default TokenManager;
export const tokenManager = TokenManager.getInstance();
