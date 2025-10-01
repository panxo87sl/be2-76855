import dotenv from "dotenv";
dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3000", 10),
  MONGO_TARGET: process.env.MONGO_TARGET || "LOCAL",
  MONGO_URI_LOCAL: process.env.MONGO_URI_LOCAL || "",
  MONGO_URI_ATLAS: process.env.MONGO_URI_ATLAS || "",
  MONGO_URL_ATLAS: process.env.MONGO_URL_ATLAS || "",
  SESSION_SECRET: process.env.SESSION_SECRET || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
};

export function validateEnv() {
  const missing = [];
  if (!env.SESSION_SECRET) missing.push("SESSION_SECRET");
  if (!env.JWT_SECRET) missing.push("JWT_SECRET");
  if (env.MONGO_TARGET === "LOCAL" && !env.MONGO_URI_LOCAL) missing.push("MONGO_URI_LOCAL");
  if (env.MONGO_TARGET === "ATLAS") {
    if (!env.MONGO_URL_ATLAS) missing.push("MONGO_URL_ATLAS");
    if (!env.MONGO_URI_ATLAS) missing.push("MONGO_URI_ATLAS");
  }
  if (missing.length) {
    console.error("[ENV] Faltan variables de entorno: ", missing.join(", "));
    process.exit(1);
  }
}

export function getPublicEnv() {
  return {
    NODE_ENV: env.NODE_ENV,
    PORT: env.PORT,
    MONGO_TARGET: env.MONGO_TARGET,
  };
}

export default env;
