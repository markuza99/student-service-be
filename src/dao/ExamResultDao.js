import { EXAMS_DB, USERS_DB } from "../constants/databaseNames.js";
import { openDatabase } from "./CrudDao.js";

async function getExamResultsDetailed(examResults) {
    const examDb = await openDatabase(EXAMS_DB);
    const userDb = await openDatabase(USERS_DB);
    try {
        const examResultsDetailed = await Promise.all(
            examResults.map(async (examResult) => {
                const exam = await examDb.get(examResult.value.examId);
                const student = await userDb.get(examResult.value.studentId);
                const professor = await userDb.get(exam.value.professorId);

                const result = {
                    id: examResult.value.id,
                    professorId: exam.value.professorId,
                    professorName: professor.value.fullName,
                    studentId: student.value.id,
                    studentName: student.value.fullName,
                    grade: examResult.value.grade,
                    examDate: new Date(exam.value.examDate),
                    name: exam.value.name,
                    examId: exam.value.id,
                };
                return result;
            })
        );
        return examResultsDetailed;
    } catch (error) {
        throw new Error(error.message);
    } finally {
        await userDb.close();
        await examDb.close();
    }
}

export { getExamResultsDetailed };
