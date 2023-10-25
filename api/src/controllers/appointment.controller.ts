import { Router, Request, Response, NextFunction } from 'express';
import { appointmentSchema, idSchema } from '../utils/schema';
import { validate } from '../middleware/validation';
import { authenticate } from '../middleware/authentication';
import { authorization } from '../middleware/authorization';
import { UserRole } from '../types/Auth';
import AppointmentService from '../services/appointment.service';

class AppointmentController {
  appointmentService: AppointmentService;
  constructor() {
    this.appointmentService = new AppointmentService();
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    req.log.info('find All Appointment Request');
    try {
      const { user, params } = req;
      const { id } = params;

      const result = await this.appointmentService.findOne(user, id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  findOne = async (req: Request, res: Response, next: NextFunction) => {
    req.log.info('find one Appointment Request');
    try {
      const { user, params } = req;
      const { id } = params;

      const result = await this.appointmentService.findOne(user, id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    req.log.info('Create Appointment Request');
    try {
      const { user, body: appointment } = req;

      appointment.patientId = user.info?.id;
      appointment.credentialId = user.credentialId;

      const result = await this.appointmentService.create(appointment);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    req.log.info('Update Appointment Request');
    try {
      const { body: appointment, params } = req;
      const { id } = params;

      const result = await this.appointmentService.update(id, appointment);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}

const appointmentController = new AppointmentController();

const appointmentRouter = Router();

appointmentRouter.get(
  '/appointments/',
  authenticate,
  validate(idSchema, 'params'),
  appointmentController.create,
);

appointmentRouter.get(
  '/appointments/:id',
  authenticate,
  validate(idSchema, 'params'),
  appointmentController.create,
);

appointmentRouter.post(
  '/appointments',
  authenticate,
  authorization([UserRole.PATIENT]),
  validate(appointmentSchema, 'body'),
  appointmentController.create,
);

appointmentRouter.put(
  '/appointments/:id',
  authenticate,
  validate(appointmentSchema, 'body'),
  validate(idSchema, 'params'),
  appointmentController.update,
);

export default appointmentRouter;
