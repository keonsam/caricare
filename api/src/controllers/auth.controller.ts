import { Router, Request, Response, NextFunction } from 'express';
import { confirmSchema, loginSchema, registerSchema } from '../utils/schema';
import { validate } from '../middleware/validation';
import { Register } from '../types/Auth';
import { AuthService } from '../services/auth.service';
import { authenticate } from '../middleware/authentication';

class AuthController {
  authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    req.log.info('Login Request');

    try {
      const { body, ip } = req;

      const token = await this.authService.login(ip, body);
      res.status(200).json(token);
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    req.log.info('Register Request');

    try {
      const { body, ip } = req;

      const auth: Register = {
        ...body,
        ipAddress: ip,
      };

      const confirmation = await this.authService.register(auth);
      res.status(201).json(confirmation);
    } catch (error) {
      next(error);
    }
  };

  confirm = async (req: Request, res: Response, next: NextFunction) => {
    req.log.info('Confirm code Request');

    try {
      const { body, ip } = req;

      const token = await this.authService.confirm(ip, body);
      res.status(200).json(token);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    req.log.info('Delete Account Request');
    try {
      const { user } = req;

      console.log({ user });

      const result = await this.authService.delete(user.credentialId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
}

const authController = new AuthController();

const authRouter = Router();

authRouter.post(
  '/register',
  validate(registerSchema, 'body'),
  authController.register,
);

authRouter.post('/login', validate(loginSchema, 'body'), authController.login);

authRouter.post(
  '/confirm-code',
  validate(confirmSchema, 'body'),
  authController.confirm,
);

authRouter.delete('/account', authenticate, authController.delete);

export default authRouter;
