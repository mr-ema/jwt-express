import express, { NextFunction, Request, Response } from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'JWT-Demo' });
});

const auth = require('../middleware/auth');

interface CustomRequest extends Request {
  user?: {
    user_id: string,
    email: string
  }
}

router.get('/status', auth, (req: CustomRequest, res: Response) => {
  if(req.user)  {
    const user = req.user;
    res.render('status', { status: 'Authenticated', user: user });

  }else res.status(500).send('something went wrong');
  
});

module.exports = router;