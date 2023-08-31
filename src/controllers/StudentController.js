import express from "express";
import { get } from "../dao/CrudDao.js";
import { EXAM_RESULTS_DB } from "../constants/databaseNames.js";
import { getUnregisteredExamsForStudent, registerExam } from "../services/StudentService.js";

const router = express.Router();

router.get("/unregistered/:studentId", async (req, res) => {
    const studentId = req.params.studentId;
    try {
        let examResults = await get(null, EXAM_RESULTS_DB);

        const unregisteredExams = await getUnregisteredExamsForStudent(studentId, examResults);
        res.json(unregisteredExams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/graded/:studentId", async (req, res) => {
    const studentId = req.params.studentId;
    try {
        let examResults = await get(null, EXAM_RESULTS_DB);

        const unregisteredExams = await getUnregisteredExamsForStudent(studentId, examResults);
        res.json(unregisteredExams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/register/:studentId/:examId", async (req, res) => {
    const studentId = req.params.studentId;
    const examId = req.params.examId;
    try {
        let examResults = await get(null, EXAM_RESULTS_DB);

        const registeredExam = await registerExam(studentId, examId, examResults);
        res.json(registeredExam);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
