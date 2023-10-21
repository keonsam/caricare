import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

type Property = "body" | "query" | "params";

export const validate =
  (schema: ObjectSchema, property: Property) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (!error) {
      next();
    } else {
      res.status(422).json(error.details);
    }
  };
