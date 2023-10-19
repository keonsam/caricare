import express, { Request, Response } from "express";
import cors from "cors";
// import { httpLogger } from "./middleware/logger";
// import sequelize from "./db/sequelize";
// import routes from "./controllers";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// add logger to request object
// app.use(httpLogger);

// Transforms the raw string of req.body into json
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to CariCare!");
});

// app.use(routes);

// async function startUp() {

//   try {
//     await sequelize.authenticate();
//     await sequelize.sync({ force: true });
//     console.log("Sync completed.");
//   } catch (error) {
//     console.error("Failed to initialized database:", error);
//     process.exit(1);
//   }

// }

// startUp();

 app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`);
 });