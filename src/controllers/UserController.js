import express from "express";
import { get, remove, add, getOne } from "../dao/CrudDao.js";
import User from "../models/User.js";
import { USERS_DB } from "../constants/databaseNames.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const { ids } = req.body;
    try {
        const users = await get(ids, USERS_DB);
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await getOne(userId, USERS_DB);
        if (user === null || user === undefined) {
            res.status(404).json({ message: `No entity with id ${userId} found` });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const userId = req.params.id;
    try {
        const hash = await remove(userId, USERS_DB);
        res.json({ id: userId, hash: hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/", async (req, res) => {
    const { id, fullName, email, role } = req.body;
    const user = await add(new User(id, fullName, email, role), USERS_DB);
    res.json({ hash: user, id: id });
});

export default router;
