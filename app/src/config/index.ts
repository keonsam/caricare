type NodeEnv = "test" | "dev" | "prod";

type Config = {
  apiUrl: string;
  env: NodeEnv;
};

const env: NodeEnv = (() => {
  switch (import.meta.env.MODE) {
    case "prod":
    case "production":
      return "prod";
    case "test":
      return "test";
    default:
      return "dev";
  }
})();

export default {
  apiUrl: import.meta.env.VITE_API_URL,
  env,
} as Config;
