export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
}

export interface RefreshTokenResponse {
  accessToken: string;
  accessTokenExpires: number;
}
