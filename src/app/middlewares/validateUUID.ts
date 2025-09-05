import { NextFunction, Request, Response } from "express";
import { isUUID } from "validator";

const validateUUID = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;

  if (!isUUID(id)) {
    res.status(400).json({
      error: true,
      details: "INVALID_ID"
    });
    return;
  }

  next();
};

export { validateUUID };
