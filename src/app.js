const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.send('Hey its Our Node APP!');
});
app.get('/about', (req, res) => {
  res.send('About Us');
});
app.get('/test', (req, res) => {
  res.send('Testing 1,2,3....');
});
app.listen(3000, () => {
  console.log('Server up and running at port 3000');
});
