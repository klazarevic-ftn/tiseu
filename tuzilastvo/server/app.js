require('dotenv').config();
const express = require("express");
const app = express();
const { auth } = require('express-openid-connect');
const fs = require("fs");
const path = require("path");
const paths = require('./common/paths/paths');

const authentication = require(paths.mw.at);
const cors = require(paths.mw.cr);
const logger = require(paths.mw.lg); 
const bodyParser = require('body-parser');

app.use(authentication); 
app.use(cors); 
app.use(logger);
app.use(bodyParser.json());

// app.use('/users', require('./modules/user'));
// const userModule = require('./modules/user');
// app.use('/users', userModule);



////////////////////////
// app.get('/', (req, res) => {
//   res.send(req.oidc.isAuthenticated() ? 'Ulogovani ste' : 'Niste ulogovani');
// });
///////////////////////////
const userRoutes = require('./modules/user/routes/user.routes');
app.use('/users', userRoutes);

// mongoose.connect("mongodb+srv://admin:" + process.env.MONGO_PASS + "@backenddb.asaeiqd.mongodb.net/Node-API?retryWrites=true&w=majority&appName=BackendDB")
// .then(() => {
//     console.log('Connected to MongoDB');
// })
// .catch((err) => {
//     console.error('Error connecting to MongoDB:', err);
// });

// app.get('/', (req, res) => {
//   // Dekodiranje JWT tokena
//   const token = req.oidc.accessToken;
//   const decodedToken = req.oidc.user;

//   console.log('Dekodirani podaci korisnika:', decodedToken);

//   res.send(`Dekodirani podaci korisnika: ${JSON.stringify(decodedToken)}`);
// });



// app.get('/check-auth', async (req, res) => {
//   try {
//     if (!req.oidc.user) {
//       console.error('Error while checking authentication:');

//       return res.status(401).json({ isAuthenticated: false, message: "User is not authenticated." });
//     }
//     console.error('Error while checking authentication:');

//     res.status(200).json({ isAuthenticated: true, user: req.oidc.user });
//   } catch (error) {
//     console.error('Error while checking authentication:', error);
//     res.status(500).json({ isAuthenticated: false, message: "Error while checking authentication." });
//   }
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




// const PORT = process.env.PORT || 8010;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });

module.exports = app;

