const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./db/db');
const errorMiddleware = require('./middlewares/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const entryRoutes = require('./routes/entryRoutes');
dotenv.config();

const app = express();
connectDB().then((conn) => {
  console.log(`DB Connection successful ; ${conn.connection.host}`);
});
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception!! Shutting Down');
  console.log({ name: err.name, message: err.message });
  process.exit(1);
});

const PORT = process.env.PORT || 7000;
app.use(express.json());
app.set('trust proxy', true);
// Use Mogan to log api request in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.get('/ip-test', async (req, res, next) => {
  res.send(req.socket.remoteAddress);
});
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/entrys', entryRoutes);

app.all('*', (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Invalid Route',
  });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!! Closing Server then shutting down');
  console.log({ name: err.name, message: err.message });
  app.close(() => {
    process.exit(1);
  });
});
