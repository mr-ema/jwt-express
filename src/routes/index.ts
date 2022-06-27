import express, { NextFunction, Request, Response } from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'JWT-Demo' });
});

const auth = require('../middleware/auth');

router.get('/status', auth, (req: Request, res: Response) => {
  res.render('status', { status: 'Authenticated' });
});

module.exports = router;