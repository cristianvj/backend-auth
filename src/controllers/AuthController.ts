import type {Request, Response} from 'express';
import { hashPassword, comparePassword } from '../utils/auth';
import User from '../models/User';
import Token from '../models/Token';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email, name } = req.body;

      // Prevent user to create account with same email
      const userExist = await User.findOne({email});
      if (userExist) {
        const error = new Error("User already exists");
        return res.status(409).json({error: error.message});
      }
      // Create user account and save it in the database with hashed password
      const user = new User(req.body);
      // Hash password
      user.password = await hashPassword(password);
      // Generate token
      const token = new Token();
      token.token = generateToken();
      token.user = user._id
      //Send email
      AuthEmail.sendConfirmationEmail({email, name, token})
      // Save user
      await Promise.allSettled([user.save(), token.save()]);
      res.send("Account was created successfully, check your email to confirm it");
    } catch (error) {
      res.status(500).json({error: "Creating account error"});
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({token});
      if(!tokenExist){
        const error = new Error("Token not found");
        return res.status(401).json({error: error.message});
      }

      const user = await User.findById(tokenExist.user);
      user.confirmed = true;

      await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
      res.send("Account was confirmed successfully");

    } catch (error) {
      res.status(500).json({error: "Creating account error"});
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({email});
      if(!user){
        const error = new Error("User not found");
        return res.status(404).json({error: error.message});
      }

      if(!user.confirmed){
        const token = new Token();
        token.user = user._id
        token.token = generateToken();
        await token.save();

        //Send email
        AuthEmail.sendConfirmationEmail({
          email: user.email, 
          name: user.name, 
          token: token,
        });

        const error = new Error("User not confirmed, we have sent a confirmation e-mail");
        return res.status(401).json({error: error.message});
      }

      // Check password
      const isPasswordValid = await comparePassword(password, user.password);
      if(!isPasswordValid){
        const error = new Error("Invalid password");
        return res.status(401).json({error: error.message});
      }

      res.send('Successfull...');

    } catch (error) {
      res.status(500).json({error: "Login account error"});
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
        const { email } = req.body

        // When the user exists
        const user = await User.findOne({ email })
        if (!user) {
            const error = new Error('User is not registered')
            return res.status(404).json({ error: error.message })
        }

        if(user.confirmed) {
            const error = new Error('User already confirmed')
            return res.status(403).json({ error: error.message })
        }

        // Generate token
        const token = new Token()
        token.token = generateToken()
        token.user = user._id

        // Send email
        AuthEmail.sendConfirmationEmail({
            email: user.email,
            name: user.name,
            token: token,
        })

        await Promise.allSettled([user.save(), token.save()])
            
        res.send('New tocken was send to your e-mail')

    } catch (error) {
        res.status(500).json({ error: 'Occurred an error' })
    }
  }

  static forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body

        // Usuario existe
        const user = await User.findOne({ email })
        if (!user) {
            const error = new Error('User is not registered')
            return res.status(404).json({ error: error.message })
        }

        // Create token
        const token = new Token()
        token.token = generateToken()
        token.user = user.id
        await token.save()

        // sendemail
        AuthEmail.sendPasswordResetToken({
            email: user.email,
            name: user.name,
            token: token
        })
        res.send('Check your email to see the instructions')
    } catch (error) {
        res.status(500).json({ error: 'Occurred an error' })
    }
  }

  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExist = await Token.findOne({token});
      if(!tokenExist){
        const error = new Error("Token not found");
        return res.status(401).json({error: error.message});
      }

      res.send("Valid token. Create a new password");

    } catch (error) {
      res.status(500).json({error: "Creating account error"});
    }
  };

  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params
      const { password } = req.body

      const tokenExists = await Token.findOne({ token })
      if (!tokenExists) {
          const error = new Error('Token no válido')
          return res.status(404).json({ error: error.message })
      }

      const user = await User.findById(tokenExists.user)
      user.password = await hashPassword(password)

      await Promise.allSettled([user.save(), tokenExists.deleteOne()])

      res.send('El password se modificó correctamente')
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }
};