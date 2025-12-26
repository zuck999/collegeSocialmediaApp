import { Request } from 'express';

// TypedRequest simplifies the Request<> generic parameters.
// Usage: TypedRequest<ReqBody, Params>
export type TypedRequest<ReqBody = undefined, Params = Record<string, any>> = Request<Params, any, ReqBody>;

export {};
