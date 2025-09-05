import { parse } from "csv-parse";
import { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";

import taskRepository from "../repositories/taskRepository";

import { DATABASE_TABLE, Task } from "../models/tasks";

class TaskController {
  listTasks(_req: Request, res: Response) {
    try {
      const tasks = taskRepository.list(DATABASE_TABLE);
      res.status(200).json({ status: "Ok", details: tasks });
    } catch (err) {
      res.status(500).json({
        status: "Error",
        details: err instanceof Error ? err.message : "UNKNOWN_ERROR"
      });
    }
  }

  createTask(req: Request, res: Response) {
    const { title, description } = req.body;

    try {
      const createdTask = taskRepository.create(DATABASE_TABLE, {
        title,
        description
      });

      res.status(201).json({
        status: "OK",
        details: createdTask
      });
    } catch (err) {
      res.status(500).json({
        status: "Error",
        details: err instanceof Error ? err.message : "UNKNOWN_ERROR"
      });
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
        res.status(201).json({
          status: "OK",
          message: "IMPORTED_SUCCESSFULLY",
          imported: tasks.length
        });
      } catch (err) {
        res.status(500).json({
          status: "Error",
          details: err instanceof Error ? err.message : "UNKNOWN_ERROR"
        });
      }
    });

    parser.on("error", () => {
      res
        .status(500)
        .json({ status: "Error", details: "ERROR_PARSING_CSV_FILE" });
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

      if (!updatedTask)
        return res
          .status(404)
          .json({ status: "Error", message: "TASK_NOT_FOUND" });

      res.status(200).json({
        status: "OK",
        details: updatedTask
      });
    } catch (err) {
      res.status(500).json({
        status: "Error",
        details: err instanceof Error ? err.message : "UNKNOWN_ERROR"
      });
    }
  }

  markAsCompleted(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const completedTask = taskRepository.asCompleted(DATABASE_TABLE, id);

      if (!completedTask)
        return res
          .status(404)
          .json({ status: "Error", message: "TASK_NOT_FOUND" });

      res.status(200).json({ status: "OK", details: completedTask });
    } catch (err) {
      res.status(500).json({
        status: "Error",
        details: err instanceof Error ? err.message : "UNKNOWN_ERROR"
      });
    }
  }

  deleteTask(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deletedTask = taskRepository.remove(DATABASE_TABLE, id);

      if (!deletedTask)
        return res
          .status(404)
          .json({ status: "Error", message: "TASK_NOT_FOUND" });

      res.status(200).json({
        status: "OK",
        details: deletedTask
      });
    } catch (err) {
      res.status(500).json({
        status: "Error",
        details: err instanceof Error ? err.message : "UNKNOWN_ERROR"
      });
    }
  }
}

export default new TaskController();
