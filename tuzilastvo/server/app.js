require('dotenv').config();
const express = require("express");
const app = express();
const { auth } = require('express-openid-connect');
const fs = require("fs");
const path = require("path");
const cors = require('cors');
const logger = require('morgan');


const corsOptions = {
  origin: "http://localhost:8015",
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));
app.use(logger('common'));

// const config = {
//   authRequired: false,
//   auth0Logout: true,
//   secret: process.env.SECRET,
//   baseURL: 'http://localhost:8010', 
//   clientID: process.env.CLIENT_ID,
//   issuerBaseURL: process.env.ISSUER_BASE_URL,
// };
// app.use(auth(config));

// app.get('/', (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? 'Ulogovani ste' : 'Niste ulogovani');
// });

// app.get('/notification', (req, res) => {
//   if (req.oidc.isAuthenticated()) {
//     const userInfo = req.oidc.user;
//     const message = `Dobrodošli, ${userInfo.name}!`;
//     res.send(message);
//   } else {
//     res.send('Niste autentifikovani.');
//   }
// });
// const items = [
//     { description: "Opis1" },
//     { description: "Opis2" },
//     { description: "Opis3" },
//     { description: "Opiaaaaaaaaadfvsdaaaaaaaaas4" }
// ];
// app.get("/api/items", (req, res) => {
//     res.send(items);
// });

// const DOMAIN = process.env.ISSUER_BASE_URL || 'https://dev-euprava.eu.auth0.com';
// app.get('/login', (req, res) => {
//     res.redirect(`https://${DOMAIN}/login`);
// });
// app.get('/register', (req, res) => {
//     res.redirect(`https://${DOMAIN}/REGISTER`);
// });

app.get("/translations/:lang", (req, res) => {
  const lang = req.params.lang;
  const filePath = path.join(__dirname, "translations", `${lang.split('-')[0]}.json`)
  fs.readFile(filePath, "utf-8", (err, data) => {
    if(err){
      return res.status(404).json({ error: "Translation file not found."});
    }
    try {
        const jsonData = JSON.parse(data);
        res.set("Cache-control", "public, max-age=3600");
        res.json(jsonData);
    } catch(parseError) {
        res.status(500).json({ error: "Error parsing translation file." })
    }
  })
})


module.exports = app;
