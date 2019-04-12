const port = 8000;

const express = require('express');
const body = require('body-parser');
const morgan = require('morgan');
const ws = require('express-ws');
const app = express();

ws(app);

app.use(morgan('dev'));
app.use(body.json());
app.use(express.static('./public'));

app.ws('/ws', (ws) => {
  ws.on('message', function (msg) {
    const { name } = JSON.parse(msg);

    const mail = JSON.stringify({
      action: 'get-data',
      name
    });
    console.log(mail);
    ws.send(mail);
  });
});

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
});
