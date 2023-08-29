import express from "express";
import { get, remove, add, getOne } from "../dao/CrudDao.js";
import { v4 as uuidv4 } from "uuid";
import { EXAM_RESULTS_DB } from "../constants/databaseNames.js";
import ExamResult from "../models/ExamResult.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const { ids } = req.body;
    try {
        const examResult = await get(ids, EXAM_RESULTS_DB);
        res.json(examResult);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    const examResultId = req.params.id;
    try {
        const examResult = await getOne(examResultId, EXAM_RESULTS_DB);
        if (examResult === null || examResult === undefined) {
            res.status(404).json({ message: `No entity with id ${examResult} found` });
        }
        res.json(examResult);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const examResultId = req.params.id;
    try {
        const hash = await remove(examResultId, EXAM_RESULTS_DB);
        res.json({ id: examResultId, hash: hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    const { studentId, examId, grade } = req.body;
    const id = uuidv4().toString();
    const examResult = await add(new ExamResult(id, studentId, examId, grade), EXAM_RESULTS_DB);
    res.json({ hash: examResult, id: id });
});

export default router;
