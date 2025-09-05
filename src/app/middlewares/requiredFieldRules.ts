import { body } from "express-validator";

const requiredFieldRules = [
  body("title")
    .exists({ checkFalsy: true })
    .withMessage("TITLE_REQUIRED")
    .isString()
    .withMessage("TITLE_INVALID")
    .isLength({ min: 5 })
    .withMessage("TITLE_MIN_LENGTH")
    .isLength({ max: 150 })
    .withMessage("TITLE_MAX_LENGTH"),
  body("description")
    .exists({ checkFalsy: true })
    .withMessage("DESCRIPTION_REQUIRED")
    .isString()
    .withMessage("DESCRIPTION_INVALID")
    .isLength({ max: 550 })
    .withMessage("DESCRIPTION_MAX_LENGTH")
];

export { requiredFieldRules };
