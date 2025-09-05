import crypto from "crypto";
import multer from "multer";
import path from "node:path";

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, "..", "..", "tmp"),
  filename: (req, file, cb) => {
    const filename =
      crypto.randomBytes(8).toString("hex") + "-" + file.originalname;
    cb(null, filename);
  }
});

export const upload = multer({ storage });
