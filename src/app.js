import express from "express";
import userController from "./controllers/UserController.js";
import examController from "./controllers/ExamController.js";
import examResultController from "./controllers/ExamResultController.js";
import professorController from "./controllers/ProfessorController.js";
import { ipfs, orbitdb } from "./dao/database/Database.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/exams", examController);
app.use("/exam-results", examResultController);
app.use("/users", userController);
app.use("/professors", professorController);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

process.on("SIGINT", async () => {
    await cleanup();
    process.exit();
});

process.on("SIGTERM", async () => {
    await cleanup();
    process.exit();
});

async function cleanup() {
    await orbitdb.stop();
    await ipfs.stop();
}
