import { NextFunction, Request, Response } from "express";

export function validateCsvFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.file) {
    return res.status(400).json({
      status: "Error",
      details: "CSV_FILE_REQUIRED"
    });
  }

  if (
    req.file.mimetype !== "text/csv" &&
    req.file.mimetype !== "application/vnd.ms-excel"
  ) {
    return res.status(400).json({
      status: "Error",
      details: "CSV_FILE_INVALID_FORMAT"
    });
  }

  next();
}
