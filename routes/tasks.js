const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs').promises

//get tasks
router.get('/', async(req, res)=>{
    try{
        const pathName = path.join(__dirname, '../tasks.json')
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

        const tasks = req.body

        const pathName = path.join(__dirname, '../tasks.json')
        const data = await fs.readFile(pathName, 'utf-8')
        return JSON.parse(data)
    }
})

module.exports = router;