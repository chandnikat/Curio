const path = require('path');
const express = require('express');
const port = process.env.PORT || 3000;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../src/index.html"));
  });
  
  app.listen(3000, () => console.log("Server Running On Port " + PORT));