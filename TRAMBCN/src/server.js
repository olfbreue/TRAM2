import express from 'express';
import axios from 'axios';

const app = express();

const clientId = 'info@olafbreuer.com';
const clientSecret = '67ec4ef6-fadd-4337-a6b0-e6a36c465e47';
const tokenEndpoint = 'https://opendata.tram.cat/connect/token';
const apiEndpoint = 'https://opendata.tram.cat/api/v1';

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

app.get('/connect/token', (req, res) => {
  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('grant_type', 'client_credentials');

  axios.post(tokenEndpoint, params.toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    .then(response => {
      const accessToken = response.data.access_token;
      res.json({ accessToken });
      
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to obtain access token' });
    });
});


app.get('/activevehicles', (req, res) => {
  const accessToken = req.query.accessToken;
  const networkId = req.query.networkId;
  const lineId = req.query.lineId;

  const headers = {
    'Authorization': `Bearer ${accessToken}`
  };

  axios.get(`${apiEndpoint}/activevehicles`, { headers, params: { networkId, lineId } })
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve data' });
    });
});





app.get('/', (req, res) => {
  res.send('Welcome to the TRAM API!');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
