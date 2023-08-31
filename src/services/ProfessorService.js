import { EXAM_RESULTS_DB, USERS_DB } from "../constants/databaseNames.js";
import { add, get, getOne } from "../dao/CrudDao.js";
import ExamResult from "../models/ExamResult.js";
import { getExamResults } from "./ExamResultService.js";

async function getExamResultsForProfessor(userId, examResults, getGraded) {
    try {
        const examResultsDetailed = await getExamResults(userId, "PROFESSOR", examResults, getGraded);
        return examResultsDetailed;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function gradeExam(professorId, examResultId, grade) {
    try {
        const professor = await getOne(professorId, USERS_DB);
        if (professor == null) {
            throw new Error(`No professor with id ${professorId} exists`);
        }
        if (professor.value.role !== "PROFESSOR") {
            throw new Error(`To grade exams, user must have role PROFESSOR`);
        }
        let examResults = await get(null, EXAM_RESULTS_DB);
        let pendingExamResults = await getExamResultsForProfessor(professorId, examResults, false);
        let examResultToGrade = pendingExamResults.find((examResult) => examResult.id === examResultId);
        if (examResultToGrade == null) {
            throw new Error(`No such pending exam with id ${examResultId}`);
        }
        if (!(typeof grade === "number" && isFinite(grade) && Math.floor(grade) === grade)) {
            throw new Error("Grade must be an integer");
        }
        if (grade < 5 || grade > 10) {
            throw new Error(`Grade must be between 5 and 10`);
        }
        const hash = await add(new ExamResult(examResultToGrade.id, examResultToGrade.studentId, examResultToGrade.examId, grade), EXAM_RESULTS_DB);
        return { hash: hash, id: examResultToGrade.id };
    } catch (error) {
        throw new Error(error.message);
    }
}

export { getExamResultsForProfessor, gradeExam };
