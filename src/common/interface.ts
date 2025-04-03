import { UserT } from '@prisma/client';

export interface TokenPayload {
  sub: string;
  role: UserT;
}

export interface Requester extends TokenPayload {}
export interface ReqWithRequester {
  requester: Requester;
}
export interface ReqWithRequesterOpt {
  requester?: Requester;
}

export interface IRedisService {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
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
