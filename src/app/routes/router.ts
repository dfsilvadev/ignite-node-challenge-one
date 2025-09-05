import { Router } from "express";

import tasksController from "../controllers/taskController";

import { optionalFieldRules } from "../middlewares/optionalFieldRules";
import { validateCsvFile } from "../middlewares/requiredCSVFile";
import { requiredFieldRules } from "../middlewares/requiredFieldRules";
import { upload } from "../middlewares/uploadCSV";
import { validate } from "../middlewares/validate";
import { validateUUID } from "../middlewares/validateUUID";

const router = Router();

router.get("/tasks", tasksController.listTasks);
router.post("/tasks", requiredFieldRules, validate, tasksController.createTask);
router.post(
  "/tasks/create-many",
  upload.single("file"),
  validateCsvFile,
  tasksController.createManyTasks
);
router.put(
  "/tasks/:id",
  validateUUID,
  validate,
  optionalFieldRules,
  tasksController.updateTask
);
router.patch(
  "/tasks/:id/completed",
  validateUUID,
  validate,
  tasksController.markAsCompleted
);
router.delete("/tasks/:id", validateUUID, validate, tasksController.deleteTask);

export default router;
