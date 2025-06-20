// const { data } = require("@remix-run/router/dist/utils");
// const { error } = require("console");
const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs").promises;

// finds the exact location of tasks.json even when running from different file
const pathName = path.join(__dirname, "../tasks.json");

const readTasks = async () => {
  const data = await fs.readFile(pathName, "utf-8");
  return JSON.parse(data);
};

const writeTasks = async (tasks) => {
  await fs.writeFile(pathName, JSON.stringify(tasks, null, 2));
};

//get tasks
router.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(pathName, "utf-8");
    console.log("hii there", data);
    const tasks = JSON.parse(data);
    res.send(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to load tasks" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await fs.readFile(pathName, "utf-8");
    const tasks = JSON.parse(data);

    const aTask = tasks.find((task) => task.id === id);
    if (!aTask) {
      return res.status(404).send({ error: `task with id ${id} not found` });
    }

    res.send(aTask);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to load tasks" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newTask = req.body; //we grab the body the sender sends from frontend
    if (!newTask.title) {
      return res.status(400).send({ error: "task must have a title" });
    }

    const data = await fs.readFile(pathName, "utf-8"); // it reads the file as  string
    const tasks = JSON.parse(data);
    newTask.id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
    newTask.completed = false;

    tasks.push(newTask);

    await fs.writeFile(pathName, JSON.stringify(tasks, null, 2));
    res.status(201).send(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "error in saving the task" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    //getting the url id which must be a number
    const id = parseInt(req.params.id);

    //read the existing tasks
    const tasks = await readTasks();

    //filter out the task with the id

    const filteredTasks = tasks.filter((task) => task.id !== id);

    //if the task is not deleted( length the same), return error

    if (filteredTasks.length === tasks.length) {
      return res.status(404).send({ error: "task not found" });
    }

    //write the new tasks to the file

    await writeTasks(filteredTasks);

    res.send({ message: `Task ${id} deleted successfully.` });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ error: "Something went wrong while deleting the task." });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const data = await fs.readFile(pathName, "utf-8");
    const tasks = JSON.parse(data);

    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (!taskIndex === -1) {
      return res.status(404).send({ error: `Task with ID ${id} not found` });
    }
    tasks[taskIndex].completed = true;
    tasks[taskIndex].updated_at = new Date().toISOString(); //indicate when last updated

    await fs.writeFile(pathName, JSON.stringify(tasks, null, 2));

    res.send({
      message: `Task ${id} marked as completed`,
      task: tasks[taskIndex],
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to update task" });
  }
});

module.exports = router;
