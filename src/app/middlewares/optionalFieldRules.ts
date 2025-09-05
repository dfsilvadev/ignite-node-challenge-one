import { body } from "express-validator";

const optionalFieldRules = [
  body("title")
    .optional()
    .isString()
    .isLength({ min: 5 })
    .withMessage("TITLE_MIN_LENGTH"),
  body("description")
    .optional()
    .isString()
    .isLength({ max: 550 })
    .withMessage("DESCRIPTION_MAX_LENGTH")
];

export { optionalFieldRules };
