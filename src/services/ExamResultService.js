import { EXAMS_DB, EXAM_RESULTS_DB, USERS_DB } from "../constants/databaseNames.js";
import { getOne } from "../dao/CrudDao.js";
import { getExamResultsDetailed } from "../dao/ExamResultDao.js";

async function getExamResults(userId, userRole, examResults, getGraded) {
    try {
        const user = await getOne(userId, USERS_DB);
        if (user == null) {
            throw new Error(`User with id ${userId} does not exist`);
        }
        if (user.value.role !== userRole) {
            throw new Error(`User with id ${userId} has role ${user.value.role}, the expected role was ${userRole}`);
        }

        const examResultsDetailed = await getExamResultsDetailed(examResults);

        return examResultsDetailed.filter((examResult) => {
            return belongsToUser(userId, userRole, examResult) && retrieveGraded(getGraded, examResult.grade);
        });
    } catch (error) {
        throw new Error(error.message);
    }
}

function belongsToUser(userId, userRole, examResult) {
    return userRole == "PROFESSOR" ? examResult.professorId == userId : examResult.studentId == userId;
}

function retrieveGraded(getGraded, grade) {
    return getGraded ? grade !== 0 : grade === 0;
}

export { getExamResults };
