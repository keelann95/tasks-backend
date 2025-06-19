const { log, error } = require("console");
const express = require("express");
const { json } = require("stream/consumers");
const app = express();
const port = 3000;
const fs = require("fs").promises;

const tasksRouter = require('./routes/tasks')
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use('/tasks', tasksRouter)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
