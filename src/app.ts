import express from "express";
import ticketsRoutes from "./routes/tickets.routes.js";
import usersRoutes from "./routes/users.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import requestIdMiddleware from "./middlewares/request-id.middleware.js";
import requestLoggerMiddleware from "./middlewares/request-logger.middleware.js";

const app = express();

app.use(requestIdMiddleware);
app.use(express.json());
app.use(requestLoggerMiddleware);

app.use("/tickets", ticketsRoutes);
app.use("/users", usersRoutes);

app.use(errorMiddleware);

export default app;
