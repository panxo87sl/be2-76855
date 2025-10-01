import { request, response, Router } from "express";
import env, { getPublicEnv } from "../config/env.config.js";

const router = Router();

router.get("/info", (request, response) => {
  response.json({
    pid: process.pid,
    node: process.version,
    platform: process.platform,
    cwd: process.cwd(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    argv: process.argv,
    env: getPublicEnv(),
  });
});

router.get("/env", (request, response) => {
  response.json(getPublicEnv());
});

export default router;
