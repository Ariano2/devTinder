const express = require('express');
const app = express();
const { connectDB } = require('./config/database');

const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

const { authRouter } = require('./routers/authRouter');
const { profileRouter } = require('./routers/profileRouter');
const { requestRouter } = require('./routers/connectionRequestRouter');
const { userRouter } = require('./routers/userRouter');

app.use(authRouter);
app.use(profileRouter);
app.use(requestRouter);
app.use(userRouter);

connectDB()
  .then(() => {
    console.log('Connected to DB');
    app.listen(7777, () => {
      console.log('Server Running at Port 7777');
    });
  })
  .catch((err) => {
    console.error('Error Connection to DB could not be Established!');
  });
