import express from "express";
import morgan from "morgan";
import ticketsRoutes from "./routes/tickets.routes.js";
import usersRoutes from "./routes/users.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

const httpLogFormat = process.env.NODE_ENV === "test" ? "tiny" : "combined";

app.use(morgan(httpLogFormat));
app.use(express.json());

app.use("/tickets", ticketsRoutes);
app.use("/users", usersRoutes);

app.use(errorMiddleware);

export default app;
