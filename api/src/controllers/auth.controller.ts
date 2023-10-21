import { Router, Request, Response, NextFunction } from 'express';
import { authSchema, confirmSchema, loginSchema } from '../utils/schema';
import { validate } from '../middleware/validation';
import { Register, Confirmation, Login } from '../types/Auth';
import { AuthService } from '../services/auth.service';

class AuthController {
  authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    req.log.info('Login Request');

    try {
      const login: Login = req.body;

      const token = await this.authService.login(login);
      res.status(200).json(token);
    } catch (error) {
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    req.log.info('Register Request');

    try {
      const auth: Register = req.body;

      const confirmation = await this.authService.register(auth);
      res.status(201).json(confirmation);
    } catch (error) {
      next(error);
    }
  };

  confirm = async (req: Request, res: Response, next: NextFunction) => {
    req.log.info('Confirm code Request');

    try {
      const confirm: Confirmation = req.body;

      const token = await this.authService.confirm(confirm);
      res.status(200).json(token);
    } catch (error) {
      next(error);
    }
  };
}

const authController = new AuthController();

const authRouter = Router();

authRouter.post(
  '/register',
  validate(authSchema, 'body'),
  authController.register,
);

authRouter.post(
  '/confirm-code',
  validate(confirmSchema, 'body'),
  authController.confirm,
);

authRouter.post('/login', validate(loginSchema, 'body'), authController.login);

export default authRouter;
