import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validation';
import UserService from '../services/user.service';
import { userDoctorSchema, userPatientSchema } from '../utils/schema';
import { authenticate } from '../middleware/authentication';

class UserController {
  userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, body: userInfo } = req;
      req.log.info(`Create User /${user.role} Request`);

      const token = await this.userService.create(user, userInfo);
      res.status(200).json(token);
    } catch (error) {
      next(error);
    }
  };
}

const userController = new UserController();

const userRouter = Router();

userRouter.post(
  '/users/doctor',
  authenticate,
  validate(userDoctorSchema, 'body'),
  userController.create,
);

userRouter.post(
  '/users/patient',
  authenticate,
  validate(userPatientSchema, 'body'),
  userController.create,
);

export default userRouter;
