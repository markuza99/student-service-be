import { Documents, IPFSAccessController } from "@orbitdb/core";
import { EXAMS_DB, EXAM_RESULTS_DB, USERS_DB } from "../constants/databaseNames.js";
import { orbitdb } from "./database/Database.js";
import { add, get } from "./CrudDao.js";

async function getExamResultsForProfessor(id, examResults, getGraded) {
    const examDb = await orbitdb.open(EXAMS_DB, {
        AccessController: IPFSAccessController({ write: ["*"] }),
        Database: Documents({ indexBy: "id" }),
    });
    const userDb = await orbitdb.open(USERS_DB, {
        AccessController: IPFSAccessController({ write: ["*"] }),
        Database: Documents({ indexBy: "id" }),
    });
    try {
        const examResultsDetailed = await Promise.all(
            examResults.map(async (examResult) => {
                const exam = await examDb.get(examResult.value.examId);
                const professor = await userDb.get(exam.value.professorId);
                const result = {
                    id: examResult.value.id,
                    professorId: exam.value.professorId,
                    professorName: professor.value.fullName,
                    grade: examResult.value.grade,
                    examDate: new Date(exam.value.examDate),
                    name: exam.value.name,
                    examId: exam.value.id,
                };
                return result;
            })
        );
        return examResultsDetailed.filter((examResult) => {
            return examResult.professorId == id && (getGraded ? examResult.grade !== 0 : examResult.grade === 0);
        });
    } catch (error) {
        throw new Error(error.message);
    } finally {
        await userDb.close();
        await examDb.close();
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
