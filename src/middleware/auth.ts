import { Request, Response, NextFunction } from 'express';

const jwt = require('jsonwebtoken');

interface AuthRequest extends Request {
  user: string
}

// Token Key
const KEY: string = process.env.TOKEN_KEY as string;

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.query.token || req.cookies['x-access-token'];
  
  if (!token) return res.status(301).redirect('/signin');

  try {
    const decoded = jwt.verify(token, KEY);
    req.user = decoded as string;

  }catch(err) {
    return res.status(401).send('Invalid Token');
  }

  return next();
}

module.exports = verifyToken;