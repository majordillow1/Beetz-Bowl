const express = require('express')
const app = express();
var http = require('http');
var fs = require('fs');
app.get('/', (req, res) => {
  fs.readFile('demofile1.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});

app.listen(process.env.PORT || 8888, () => {
  console.log('Example app listening on port 8000!')
});

