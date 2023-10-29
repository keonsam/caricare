import { Router, Request, Response, NextFunction } from 'express';
import {
  appointmentSchema,
  getSchema,
  idSchema,
  updateAppointmentSchema,
} from '../utils/schema';
import { validate } from '../middleware/validation';
import { authenticate } from '../middleware/authentication';
import { authorization } from '../middleware/authorization';
import { UserRole } from '../types/Auth';
import AppointmentService from '../services/appointment.service';
import { Pagination, Sort } from '../types/Pagination';
import { Appointment } from '../types/Appointment';

class AppointmentController {
  appointmentService: AppointmentService;
  constructor() {
    this.appointmentService = new AppointmentService();
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    req.log.info('find All Appointment Request');
    try {
      const { user, query } = req;

      const pagination: Pagination = {
        pageNumber: Number(query.pageNumber || 0),
        pageSize: Number(query.pageSize || 5),
        sort: (query.sort as Sort) || 'DESC',
      };

      const result = await this.appointmentService.findAll(user, pagination);
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
      const { user, body, ip } = req;

      const appointment: Appointment = {
        ...body,
        patientId: user.info?.id,
        credentialId: user.credentialId,
        ipAddress: ip,
      };

      const result = await this.appointmentService.create(user, appointment);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    req.log.info('Update Appointment Request');
    try {
      const { body, params, ip } = req;
      const { id } = params;

      const appointment: Appointment = {
        ...body,
        ipAddress: ip,
      };

      const result = await this.appointmentService.update(id, appointment);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    req.log.info('Delete Appointment Request');
    try {
      const { params, user } = req;
      const { id } = params;

      const result = await this.appointmentService.delete(user, id);
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
  validate(getSchema, 'params'),
  appointmentController.findAll,
);

appointmentRouter.get(
  '/appointments/:id',
  authenticate,
  validate(idSchema, 'params'),
  appointmentController.findOne,
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
  validate(updateAppointmentSchema, 'body'),
  validate(idSchema, 'params'),
  appointmentController.update,
);

appointmentRouter.delete(
  '/appointments/:id',
  authenticate,
  validate(idSchema, 'params'),
  appointmentController.delete,
);

export default appointmentRouter;
