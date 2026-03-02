const express = require('express');
const ticketsRoutes = require('./routes/tickets.routes');
const usersRoutes = require('./routes/users.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());

app.use('/tickets', ticketsRoutes);
app.use('/users', usersRoutes);

app.use(errorMiddleware);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Helpdesk API (JS) running on http://localhost:${PORT}`);
});