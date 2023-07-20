import express, { Request, Response } from "express";
import winston from "winston";
import db from "./database";
import StorageSpace from "./routes/StorageSpace";
import Item from "./routes/ItemType"
import ItemTypeRouter from "./routes/Items"
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
const app = express();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

db();
app.use(express.json());
app.use(express.json());
const router = express.Router();
// Define options for swagger-jsdoc
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
      description: 'Your API documentation using Swagger',
    },
  },
  // Path to the API docs
  apis: ['./src/controllers/*.ts'], // Assuming your route files are in the 'routes' folder
};

// Initialize swagger-jsdoc
const specs = swaggerJsdoc(options);

// Serve the Swagger UI at /api-docs
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(specs));
app.use(router);
// Mount the router middleware
app.use("/api", StorageSpace);
app.use("/api", Item);
app.use("/api", ItemTypeRouter);


app.get("/", (req: Request, res: Response) => {
  return res.json({
    status: "success",
  });
});

app.listen(3000, () => logger.info("Listening on port 3000"));
