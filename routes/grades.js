import express from "express";
import { promises as fs } from "fs";

const { readFile, writeFile} = fs;

const router = express.Router();

router.post("/", async (req, res, next) => {
    try {
        let grade = req.body;

        // if (!grade.name || grade.balance == null) {
        //     throw new Error("Name e Balance são obrigatórios.");
        // }

        const data = JSON.parse(await readFile(global.fileName));

        grade = { 
            id: data.nextId++, 
            student: grade.student,
            subject: grade.subject,
            type: grade.type,
            value: grade.value,
            timestamp: new Date()
        };
        data.grades.push(grade);

        await writeFile(global.fileName, JSON.stringify(data, null, 2));

        res.send(grade);

        logger.info(`POST /grade - ${JSON.stringify(grade)}`);
       
    } catch (err) {        
        next(err);
    }
    console.log(grade)

    // console.log(req.body);
    // res.end();
});

router.post("/total", async (req, res, next) => {
    try {
        let data = JSON.parse(await readFile(global.fileName));    
        data = data.grades.filter(
            grade => (grade.student === req.body.student) && (grade.subject === req.body.subject))
        .reduce((accumulator, current) => {
            return accumulator + current.value
        }, 0)            
        console.log(data)       
        res.end();
        // logger.info()
    } catch (err) {
        next(err);  
    }
});

router.post("/media", async (req, res, next) => {
    try {
        let data = JSON.parse(await readFile(global.fileName));    
        data = data.grades.filter(grade => (grade.subject === req.body.subject) && (grade.type === req.body.type))
    
        let filtro = data;

        let total = data.reduce((accumulator, current) => {
            return accumulator + current.value 
        }, 0)    
        
        let media = total / filtro.length
        console.log(media)       
        res.end();
        // logger.info()
    } catch (err) {
        next(err);  
    }
});

router.get("/", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        // delete data.nextId;
        res.send(data);
        // logger.info("GET /grade");
    } catch (err) {
        // next(err);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const grade = data.grades.find(
            grade => grade.id === parseInt(req.params.id));
        res.send(grade);
        // logger.info("GET /grade/:id")
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(global.fileName));    
        data.grades = data.grades.filter(
            grade => grade.id !== parseInt(req.params.id));        
        await writeFile(global.fileName, JSON.stringify(data, null, 2));        
        res.end();
        logger.info(`DELETE /grade/:id - ${req.params.id}`)
    } catch (err) {
        next(err);  
    }
});

router.put("/", async (req, res, next) => {
    try {
        const grade = req.body;

        // if (!grade.id || !grade.name || grade.balance == null) {
        //     throw new Error("Id, Name e Balance são obrigatórios.");
        // }

        const data = JSON.parse(await readFile(global.fileName));
        const index = data.grades.findIndex(a => a.id === grade.id);

        if (index === -1) {
            throw new Error("Registro não encontrado.");
        }

        data.grades[index].student = grade.student;
        data.grades[index].subject = grade.subject;
        data.grades[index].type = grade.type;
        data.grades[index].value = grade.value;
        data.grades[index].timestamp = grade.timestamp;

        await writeFile(global.fileName, JSON.stringify(data, null, 2));

        res.send(grade);

        // logger.info(`PUT /grade - ${JSON.stringify(grade)}`);
    } catch (err) {
        next(err);               
    }
});

export default router;