import { EXAMS_DB, USERS_DB } from "../constants/databaseNames.js";
import { openDatabase } from "./CrudDao.js";

async function getExamsDetailed(exams) {
    const userDb = await openDatabase(USERS_DB);
    try {
        const examsDetailed = await Promise.all(
            exams.map(async (exam) => {
                const professor = await userDb.get(exam.value.professorId);

                const result = {
                    id: exam.key,
                    professorId: exam.value.professorId,
                    professorName: professor.value.fullName,
                    examDate: new Date(exam.value.examDate),
                    name: exam.value.name,
                };
                return result;
            })
        );
        return examsDetailed;
    } catch (error) {
        throw new Error(error.message);
    } finally {
        await userDb.close();
    }
}

export { getExamsDetailed };
