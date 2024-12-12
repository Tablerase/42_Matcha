const express = require("express");
const userRoutes = require('./routes/users');
const bodyParser = require("body-parser");
const app = express();
const serverPort = require("../settings").serverPort;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Welcome to Matcha API" });
});

app.use('/users', userRoutes);

app.listen(serverPort, () => {
  console.log(`Example app listening on port ${serverPort}`);
});
