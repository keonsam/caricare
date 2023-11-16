import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../middleware/validation';
import UserService from '../services/user.service';
import { userDoctorSchema, userPatientSchema } from '../utils/schema';
import { authenticate } from '../middleware/authentication';
import { authorization } from '../middleware/authorization';
import { UserRole } from '../types/Auth';
import { UserInfoData } from '../types/User';

class UserController {
  userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  // used by the patient api to find doctors
  // leave simple for now
  findAllDoctor = async (req: Request, res: Response, next: NextFunction) => {
    req.log.info('find All Doctors Request');
    try {
      const result = await this.userService.findAllDoctor();
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  findProfile = async (req: Request, res: Response, next: NextFunction) => {
    req.log.info('find User Profile');
    try {
      const { user } = req;
      const result = await this.userService.findProfile(
        user.info.id as string,
        user.role,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    req.log.info('Create User Request');

    try {
      const { user, body, ip } = req;

      const userInfo: UserInfoData = {
        ...body,
        ipAddress: ip,
      };

      const result = await this.userService.create(user, userInfo);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
}

const userController = new UserController();

const userRouter = Router();

// get user profile info
userRouter.get('/users/profile', authenticate, userController.findProfile);

// get doctors profile for use in appointment select doctor.
userRouter.get(
  '/doctors',
  authenticate,
  authorization([UserRole.PATIENT]),
  userController.findAllDoctor,
);

// adds doctor profile information.
userRouter.post(
  '/doctors',
  authenticate,
  authorization([UserRole.DOCTOR], false),
  validate(userDoctorSchema, 'body'),
  userController.create,
);

// adds patient profile information.
userRouter.post(
  '/patients',
  authenticate,
  authorization([UserRole.PATIENT], false),
  validate(userPatientSchema, 'body'),
  userController.create,
);

export default userRouter;
