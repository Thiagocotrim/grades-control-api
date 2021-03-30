import express from "express";
import winston from "winston";
import gradesRouter from "./routes/grades.js"
import {promises as fs} from "fs";

const { readFile, writeFile} = fs;

global.fileName = "grades.json";

const app = express();
app.use(express.json());

app.use("/grade", gradesRouter);

app.listen(3000, async () => {    
    // try {
    //     await readFile(global.fileName);
    //     // logger.info("API Started!");
    // } catch (err) {
    //     const initialJson = {
    //         nextId: 1,
    //         grades: []
    //     }        
    //     writeFile(global.fileName, JSON.stringify(initialJson, null, 2)).then(() => {
    //         // logger.info("API Started and File Created!");
    //     }).catch(err => {
    //         // logger.error(err);
    //     });
    // }

    try{  
        await readFile(global.fileName);
    } catch (err){
        const initialJson = {  
            nextId: 1,
            grades: []
        }
        writeFile(global.fileName, JSON.stringify(initialJson, null, 2)).then(() => {
                    console.log("API Started and File Created!");
                }).catch(err => {
                    console.log(err);
                });
    }

    console.log("API Started");
});
