import express from "express";
import { get } from "../dao/CrudDao.js";
import { EXAM_RESULTS_DB } from "../constants/databaseNames.js";
import { getExamResultsForProfessor, gradeExam } from "../services/ProfessorService.js";

const router = express.Router();

router.get("/pending/:id", async (req, res) => {
    const id = req.params.id;
    try {
        let examResults = await get(null, EXAM_RESULTS_DB);

        const professorExamResults = await getExamResultsForProfessor(id, examResults, false);
        res.json(professorExamResults);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/graded/:id", async (req, res) => {
    const id = req.params.id;
    try {
        let examResults = await get(null, EXAM_RESULTS_DB);

        const professorExamResults = await getExamResultsForProfessor(id, examResults, true);
        res.json(professorExamResults);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/grade/:professorId/:examResultId/:grade", async (req, res) => {
    const professorId = req.params.professorId;
    const examResultId = req.params.examResultId;
    const grade = parseInt(req.params.grade);

    try {
        let gradedExam = await gradeExam(professorId, examResultId, grade);
        res.json(gradedExam);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
