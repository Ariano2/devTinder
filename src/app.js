const express = require('express');
const app = express();
const http = require('http');
const { connectDB } = require('./config/database');
const cors = require('cors');
require('dotenv').config();
const initializeSocket = require('./utils/socket');

const cookieParser = require('cookie-parser');

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const { authRouter } = require('./routers/authRouter');
const { profileRouter } = require('./routers/profileRouter');
const { followRouter } = require('./routers/followRouter');
const { userRouter } = require('./routers/userRouter');
const { chatRouter } = require('./routers/chatRouter');
const { postRouter } = require('./routers/postRouter');
const { commentRouter } = require('./routers/commentRouter');

app.use(authRouter);
app.use(profileRouter);
app.use(followRouter);
app.use(userRouter);
app.use(chatRouter);
app.use(postRouter);
app.use(commentRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log('Connected to DB');
    server.listen(7777, () => {
      console.log('Server Running at Port 7777');
    });
  })
  .catch((err) => {
    console.error('Error Connection to DB could not be Established!');
  });
