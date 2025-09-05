import { parse } from "csv-parse";
import { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";

import taskRepository from "../repositories/taskRepository";

import { ApiResponse, DATABASE_TABLE, Task } from "../models/tasks";

class TaskController {
  #sendSuccess<T>(res: Response, statusCode: number, data: T): void {
    const response: ApiResponse<T> = {
      status: "Ok",
      details: data
    };
    res.status(statusCode).json(response);
  }

  #sendError(res: Response, statusCode: number, message: string): void {
    const response: ApiResponse = {
      status: "Error",
      message
    };
    res.status(statusCode).json(response);
  }

  #sendImportSuccess(
    res: Response,
    statusCode: number,
    message: string,
    imported: number
  ): void {
    const response: ApiResponse = {
      status: "Ok",
      message,
      imported
    };
    res.status(statusCode).json(response);
  }

  listTasks(_req: Request, res: Response) {
    try {
      const tasks = taskRepository.list(DATABASE_TABLE);
      this.#sendSuccess<Task[]>(res, 200, tasks);
    } catch (err) {
      this.#sendError(
        res,
        500,
        err instanceof Error ? err.message : "UNKNOWN_ERROR"
      );
    }
  }

  createTask(req: Request, res: Response) {
    const { title, description } = req.body;

    try {
      const createdTask = taskRepository.create(DATABASE_TABLE, {
        title,
        description
      });

      this.#sendSuccess<Task>(res, 201, createdTask as Task);
    } catch (err) {
      this.#sendError(
        res,
        500,
        err instanceof Error ? err.message : "UNKNOWN_ERROR"
      );
    }
  }

  createManyTasks(req: Request, res: Response) {
    const { file } = req;

    const filePath = path.resolve(file?.path ?? "");
    const stream = fs.createReadStream(filePath);
    const parser = parse({
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const tasks: Task[] = [];

    stream.pipe(parser);

    parser.on("data", (record) => {
      const { title, description } = record;
      taskRepository.create(DATABASE_TABLE, {
        title,
        description
      });
      tasks.push(record);
    });

    parser.on("end", async () => {
      try {
        fs.unlinkSync(filePath);
        this.#sendImportSuccess(
          res,
          201,
          "IMPORTED_SUCCESSFULLY",
          tasks.length
        );
      } catch (err) {
        this.#sendError(
          res,
          500,
          err instanceof Error ? err.message : "UNKNOWN_ERROR"
        );
      }
    });

    parser.on("error", () => {
      this.#sendError(res, 500, "ERROR_PARSING_CSV_FILE");
    });
  }

  updateTask(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
      const updatedTask = taskRepository.update(DATABASE_TABLE, id, {
        ...(title && { title }),
        ...(description && { description })
      });

      if (!updatedTask) {
        return this.#sendError(res, 404, "TASK_NOT_FOUND");
      }

      this.#sendSuccess<Task>(res, 200, updatedTask);
    } catch (err) {
      this.#sendError(
        res,
        500,
        err instanceof Error ? err.message : "UNKNOWN_ERROR"
      );
    }
  }

  markAsCompleted(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const completedTask = taskRepository.asCompleted(DATABASE_TABLE, id);

      if (!completedTask) {
        return this.#sendError(res, 404, "TASK_NOT_FOUND");
      }

      this.#sendSuccess<Task>(res, 200, completedTask);
    } catch (err) {
      this.#sendError(
        res,
        500,
        err instanceof Error ? err.message : "UNKNOWN_ERROR"
      );
    }
  }

  deleteTask(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deletedTask = taskRepository.remove(DATABASE_TABLE, id);

      if (!deletedTask) {
        return this.#sendError(res, 404, "TASK_NOT_FOUND");
      }

      this.#sendSuccess<Task[]>(res, 200, deletedTask);
    } catch (err) {
      this.#sendError(
        res,
        500,
        err instanceof Error ? err.message : "UNKNOWN_ERROR"
      );
    }
  }
}

export default new TaskController();
