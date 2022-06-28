import express, { Request, Response } from 'express';

const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const router = express.Router();

interface CustomRequest extends Request {
  user?: {
    email: string
  }
}

router.get('/', (req: CustomRequest, res: Response) => {
  if (req.cookies['x-access-token']) {
    res.render('login', {title: 'Log Out', login: true});
  }
  res.render('login', {title: 'Login', login: false});
});

router.post('/', async (req: Request, res: Response) => {
  // Our login logic starts here
  if (req.cookies['x-access-token'])  { 
    res.cookie("x-access-token", "", { expires: new Date(0), path: '/' })
    return res.status(200).redirect('/login');
  }
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token as string;
      
      
    let options = {
      path:"/",
      sameSite:true,
      maxAge: 1000 * 60 * 60 * 2, // would expire after 2 hours
      httpOnly: true, // The cookie only accessible by the web server
    }

    res.cookie('x-access-token',token, options);

      // user
      return res.status(200).redirect('/status');
    }
    return res.status(400).redirect('/login');
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

module.exports = router;