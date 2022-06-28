import express, { NextFunction, Request, Response } from 'express';

const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  if (req.cookies['x-access-token'])  { 
    return res.status(200).redirect('/login');
  }
  res.render('signIn', {title: 'Sign In'});
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get user input
      const { name, email, password } = req.body;
  
      // Validate user input
      if (!(email && password && name)) {
        res.status(400).send("All input is required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ email });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
  
      //Encrypt user password
      const encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const user = await User.create({
        name: name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });
  
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;

      let options = {
        path:"/",
        sameSite:true,
        maxAge: 1000 * 60 * 60 * 2, // would expire after 2 hours
        httpOnly: true, // The cookie only accessible by the web server
      }
  
      res.cookie('x-access-token',token, options);
  
      res.status(201).redirect('/status');
    } catch (err) {
      console.log(err);
    }
});

module.exports = router;