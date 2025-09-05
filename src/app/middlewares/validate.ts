import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  const extractedErrors: string[] = [];

  errors.array().forEach((err) => extractedErrors.push(err.msg));

  return res.status(422).json({
    error: true,
    details: extractedErrors
  });
};

export { validate };
