import pino, { Options } from "pino-http";
import config from "../config";

const loggerConfig: Options = (() => {
  const { env } = config;

  const testOptions: Options = {
    // filter out below 'warn' logs
    useLevel: "warn",
  };

  const devOptions: Options = {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: true,
      },
    },
    useLevel: "info",
  };

  const prodOptions = {};

  switch (env) {
    case "prod":
      return prodOptions;
    case "test":
      return testOptions;
    default:
      return devOptions;
  }
})();

export const httpLogger = pino(loggerConfig);

const { logger } = httpLogger;

export default logger;
