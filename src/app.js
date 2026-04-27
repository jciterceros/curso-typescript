import express from 'express';
import ticketsRoutes from './routes/tickets.routes.js';
import usersRoutes from './routes/users.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());

app.use('/tickets', ticketsRoutes);
app.use('/users', usersRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Helpdesk API (JS) running on http://localhost:${PORT}`);
});
