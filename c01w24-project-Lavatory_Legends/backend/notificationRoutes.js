import jwt from "jsonwebtoken";
import express from 'express';
import { db } from './db.js';
import { check_is_admin } from './adminRoutes.js';
const router = express.Router();
const COLLECTIONS = {
    notifications: "notifications"
};

router.post("/postNotification", express.json(), async (req, res) => {
    try{
        const { title, content } = req.body;
        if (!title || !content) {
        return res
            .status(400)
            .json({ error:"Title and content both needed." });
        }

        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret-key", async (err, decoded) => {
            if (err || !check_is_admin(decoded.username)) {
                return res.status(401).send("Unauthorized.");
            }

            const collection = db.collection(COLLECTIONS.notifications);
            await collection.insertOne({
                title: title,
                content: content,
                postedDate: new Date()
            });

            res.json({ response: `Notification ${title} posted successfully.` });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/latestNotification", express.json(), async (req, res) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret-key", async (err, decoded) => {
            if (err) {
                return res.status(401).send("Unauthorized.");
            }

            const collection = db.collection(COLLECTIONS.notifications);
            const data = await collection.find({}).sort({ postedDate: -1 }).limit(1).toArray();

            res.json({ response: data });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/hasNotification", express.json(), async (req, res) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret-key", async (err, decoded) => {
            if (err) {
                return res.status(401).send("Unauthorized.");
            }

            const collection = db.collection(COLLECTIONS.notifications);
            const data = await collection.count();
            res.json({ value: data > 0 });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/clearNotifications", express.json(), async (req, res) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret-key", async (err, decoded) => {
            if (err || !check_is_admin(decoded.username)) {
                return res.status(401).send("Unauthorized.");
            }

            const collection = db.collection(COLLECTIONS.notifications);
            await collection.deleteMany({});
            const data = await collection.count();
            if (data == 0) {
                res.json({ response: `All notifications cleared successfully.` });
            } else {
                res.json({ response: `All notifications cleared unsuccessfully.` });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;