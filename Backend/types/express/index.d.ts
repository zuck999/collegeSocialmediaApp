import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      id?: string;
      file?: Express.Multer.File;
      cookies?: any;
    }
  }
}

export {};
