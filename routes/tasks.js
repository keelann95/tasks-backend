const { error } = require('console');
const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs').promises



// finds the exact location of tasks.json even when running from different file
const pathName = path.join(__dirname, '../tasks.json') 
//get tasks
router.get('/', async(req, res)=>{
    try{
        const data = await  fs.readFile( pathName, 'utf-8')
        console.log("hii there", data);
        res.send(JSON.parse(data))
        
    }catch(err){
        console.error(err);
        res.status(500).send({error:"Failed to load tasks"})
    }
})


router.post('/', async (req, res) =>{
    try{

        const newTask = req.body //we grab the body the sender sends from frontend
        if (!newTask.title) {
             
         return res.status(400).send({error : 'task must have a title'})
        } 

        const data = await fs.readFile(pathName, 'utf-8') // it reads the file as  string
        return JSON.parse(data) //enables it to parse it to usable array
    
        newTask.id = tasks.length ? tasks[tasks.length -1 ].id + 1 : 1
        newTask.completed = false

        tasks.push(newTask)

        await fs.writeFile(pathName, JSON.stringify(tasks, null, 2))
        res.status().send(newTask)
    } catch(err){
        console.error(err);
        res.status(500).send({error : 'error in saving the task'})
        
    }
})

module.exports = router;