require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('node:dns');


// Basic Configuration
const port = process.env.PORT || 3000;
let map = [];

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

app.post('/api/shorturl', function( req , res ) {
  const originalUrl = req.body.url;
  const domain = getDomainFromUrl(originalUrl);
  if (null === domain) {
    return res.json(
      { error: 'invalid url' }
    );
  }
  dns.lookup(domain, (err, address, family) => {
    if (err) {
      return res.json(
        { error: 'invalid url' }
      );
    }
    map.push({ original_url: originalUrl, short_url: map.length + 1 })

    return res.json(
      map[map.length - 1]
    );
  })
});

function getDomainFromUrl(urlString) {
  try {
    const urlObject = new URL(urlString);
    return urlObject.hostname;
  } catch (error) {
    console.error('Error: La URL proporcionada no es válida.');
    return null; // O puedes lanzar una excepción aquí si prefieres manejar el error más adelante
  }
}
