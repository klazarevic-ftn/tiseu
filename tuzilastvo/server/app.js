const express = require("express");
const app = express();

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });


app.use(express.static("build"));

const items = [
    {
        description: "Opis1",
    },
    {
        description: "Opis2",
    },
    {
        description: "Opis3",
    },
    {
        description: "Opiaaaaaaaaaaaaaaaaaas4",
    },
];

app.get("/api/items", (req, res) => {
    res.send(items);
});

