import { EXAMS_DB, EXAM_RESULTS_DB, USERS_DB } from "../constants/databaseNames.js";
import { add, get } from "./CrudDao.js";
import { getExamResultsDetailed } from "./ExamResultDao.js";

async function getExamResultsForProfessor(userId, userRole, examResults, getGraded) {
    try {
        const examResultsDetailed = await getExamResultsDetailed(examResults);
        return examResultsDetailed.filter((examResult) => {
            return examResult.professorId == id && (getGraded ? examResult.grade !== 0 : examResult.grade === 0);
        });
    } catch (error) {
        throw new Error(error.message);
    }
}

async function gradeExam(professorId, examResultId, grade) {
    try {
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
        const hash = await add(
            { id: examResultToGrade.id, professorId: examResultToGrade.professorId, grade: grade, examId: examResultToGrade.examId },
            EXAM_RESULTS_DB
        );
        return { hash: hash, id: examResultToGrade.id };
    } catch (error) {
        throw new Error(error.message);
    }
}

export { getExamResultsForProfessor, gradeExam };
