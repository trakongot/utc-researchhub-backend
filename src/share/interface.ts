import { UserT } from '@prisma/client';

export interface TokenPayload {
  sub: number;
  role: UserT;
}

export interface Requester extends TokenPayload {}
export interface ReqWithRequester {
  requester: Requester;
}
export interface ReqWithRequesterOpt {
  requester?: Requester;
}

export interface ITokenProvider {
  generateAccessToken(payload: TokenPayload): Promise<string>;
  generateRefreshToken(payload: TokenPayload): Promise<string>;
  verifyAccessToken(token: string): Promise<TokenPayload | null>;
  verifyRefreshToken(token: string): Promise<TokenPayload | null>;
  revokeRefreshToken(userId: number): Promise<void>;
}

export type TokenIntrospectResult = {
  payload: TokenPayload | null;
  error?: Error;
  isOk: boolean;
};

export type RefreshTokenIntrospectResult = {
  payload: TokenPayload | null;
  error?: Error;
  isOk: boolean;
};

export interface ITokenIntrospect {
  introspect(token: string): Promise<TokenIntrospectResult>;
}
