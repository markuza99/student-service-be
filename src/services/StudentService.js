import { EXAMS_DB, EXAM_RESULTS_DB, USERS_DB } from "../constants/databaseNames.js";
import { add, get, getOne } from "../dao/CrudDao.js";
import { getExamsDetailed } from "../dao/ExamDao.js";
import ExamResult from "../models/ExamResult.js";
import { getExamResults } from "./ExamResultService.js";
import { v4 as uuidv4 } from "uuid";

async function getExamResultsForStudent(userId, examResults, getGraded) {
    try {
        const examResultsDetailed = await getExamResults(userId, "STUDENT", examResults, getGraded);
        return examResultsDetailed;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getUnregisteredExamsForStudent(studentId, examResults) {
    const student = await getOne(studentId, USERS_DB);
    if (student == null) {
        throw new Error(`No student with id ${studentId} exists`);
    }
    if (student.value.role !== "STUDENT") {
        throw new Error(`To grade exams, user must have role PROFESSOR`);
    }
    const registeredExams = await getExamResultsForStudent(studentId, examResults, true);
    const exams = await get(null, EXAMS_DB);

    const filteredExams = exams.filter((exam) => !registeredExams.some((registeredExam) => registeredExam.examId === exam.key));
    return await getExamsDetailed(filteredExams);
}

async function registerExam(studentId, examId, examResults) {
    const student = await getOne(studentId, USERS_DB);
    if (student == null) {
        throw new Error(`No student with id ${studentId} exists`);
    }
    if (student.value.role !== "STUDENT") {
        throw new Error(`To grade exams, user must have role PROFESSOR`);
    }
    const exam = await getOne(examId, EXAMS_DB);
    if (exam == null) {
        throw new Error(`No exam with id ${examId} exists`);
    }
    const unregisteredExams = await getUnregisteredExamsForStudent(studentId, examResults);
    if (unregisteredExams == null) {
        throw new Error(`Student doesn't have any available exams to register`);
    }
    if (unregisteredExams.length == 0) {
        throw new Error(`Student doesn't have any available exams to register`);
    }

    if (!unregisteredExams.some((unregisteredExam) => unregisteredExam.id === examId)) {
        throw new Error(`The following exam with id ${examId} can't be registered`);
    }
    if (exam.examDate - new Date().getTime() < 259200000) {
        throw new Error(`Exam must be registered atleast 3 days before `);
    }

    const id = uuidv4().toString();
    await add(new ExamResult(id, studentId, examId, 0), EXAM_RESULTS_DB);
}

export { getUnregisteredExamsForStudent, getExamResultsForStudent, registerExam };
