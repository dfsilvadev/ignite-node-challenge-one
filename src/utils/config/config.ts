import dotenv from "dotenv";

dotenv.config();

interface Config {
  readonly port: number;
  readonly nodeEnv: string;
  readonly baseURL: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  baseURL: process.env.BASE_URL || "",
};

export default config;
