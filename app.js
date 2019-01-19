const express = require('express')
const app = express();

app.get('/', (req, res) => {
  res.sendFile(__dirname +'/index.html');
});

app.listen(process.env.PORT || 8888, () => {
  console.log('Example app listening on port 8000!')
});