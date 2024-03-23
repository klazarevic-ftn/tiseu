const express = require("express");
const app = express();

// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });

//build folder
// app.use(express.static("build"));

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
