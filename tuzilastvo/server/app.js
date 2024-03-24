require('dotenv').config();
const express = require("express");
const app = express();
const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: 'http://localhost:8080', 
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

app.use(auth(config));

app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Ulogovani ste' : 'Niste ulogovani');
});

app.get('/notification', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    const userInfo = req.oidc.user;
    const message = `Dobrodošli, ${userInfo.name}!`;
    res.send(message);
  } else {
    res.send('Niste autentifikovani.');
  }
});

const items = [
    { description: "Opis1" },
    { description: "Opis2" },
    { description: "Opis3" },
    { description: "Opiaaaaaaaaadfvsdaaaaaaaaas4" }
];

app.get("/api/items", (req, res) => {
    res.send(items);
});

const DOMAIN = process.env.ISSUER_BASE_URL || 'https://dev-euprava.eu.auth0.com';
app.get('/login', (req, res) => {
    res.redirect(`https://${DOMAIN}/login`);
});
app.get('/register', (req, res) => {
    res.redirect(`https://${DOMAIN}/REGISTER`);
});



module.exports = app;
