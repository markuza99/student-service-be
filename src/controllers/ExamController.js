import express from "express";
import { get, remove, add, getOne } from "../dao/CrudDao.js";
import { v4 as uuidv4 } from "uuid";
import { EXAMS_DB } from "../constants/databaseNames.js";
import Exam from "../models/Exam.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const { ids } = req.body;
    try {
        const exam = await get(ids, EXAMS_DB);
        res.json(exam);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    const examId = req.params.id;
    try {
        const exam = await getOne(examId, EXAMS_DB);
        if (exam == null) {
            res.status(404).json({ message: `No entity with id ${examId} found` });
        }
        res.json(exam);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const examId = req.params.id;
    try {
        const hash = await remove(examId, EXAMS_DB);
        res.json({ id: examId, hash: hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    const { name, professorId, examDate } = req.body;

    const id = uuidv4().toString();

    const exam = await add(new Exam(id, name, professorId, examDate), EXAMS_DB);
    res.json({ hash: exam, id: id });
});

export default router;
