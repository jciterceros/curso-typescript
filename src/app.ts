import express from "express";
import swaggerUi from "swagger-ui-express";
import ticketsRoutes from "./routes/tickets.routes.js";
import usersRoutes from "./routes/users.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import requestIdMiddleware from "./middlewares/request-id.middleware.js";
import requestLoggerMiddleware from "./middlewares/request-logger.middleware.js";
import openApiSpec from "./docs/openapi.js";

const app = express();
const API_V1_PREFIX = "/api/v1";

app.use(requestIdMiddleware);
app.use(express.json());
app.use(requestLoggerMiddleware);

app.get("/api-docs.json", (_req, res) => {
  res.json(openApiSpec);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use(`${API_V1_PREFIX}/tickets`, ticketsRoutes);
app.use(`${API_V1_PREFIX}/users`, usersRoutes);

app.use("/tickets", ticketsRoutes);
app.use("/users", usersRoutes);

app.use(errorMiddleware);

export default app;
