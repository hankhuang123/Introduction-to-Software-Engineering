import jwt from "jsonwebtoken";
import express from 'express';
import { db } from './db.js';
const router = express.Router();
const COLLECTIONS = {
    users: "users"
};

router.post("/register", express.json(), async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
        return res
            .status(400)
            .json({ error:"A username is required to register a user as an admin."});
        }

        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret-key", async (err, decoded) => {
            if (err || !check_is_admin(decoded.username)) {
                return res.status(401).send("Unauthorized.");
            }

            const userCollection = db.collection(COLLECTIONS.users);
            const data = await userCollection.updateOne({
                username: username,
            }, {
                $set: {
                    is_admin: true
                }
            });
            
            if (data.matchedCount === 0) {
                return res
                .status(404)
                .json({ error: "Unable to find user." });
            }

            res.json({ response: `User ${username} is now an admin.` });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  });

router.post("/delete", express.json(), async (req, res) => {
    try{
        const { username } = req.body;
        if (!username) {
        return res
            .status(400)
            .json({ error:"A username is required to remove a user as an admin."});
        }

        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret-key", async (err, decoded) => {
            if (err || !check_is_admin(decoded.username)) {
                return res.status(401).send("Unauthorized.");
            }

            const userCollection = db.collection(COLLECTIONS.users);
            const data = await userCollection.updateOne({
                username: username,
            }, {
                $set: {
                    is_admin: false
                }
            });
            
            if (data.matchedCount === 0) {
                return res
                .status(404)
                .json({ error: "Unable to find user." });
            }

            res.json({ response: `User ${username} is now removed as an admin.` });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/isadmin", async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret-key", async (err, decoded) => {
            if (err) {
                return res.status(401).send("Unauthorized.");
            }

            if (await check_is_admin(decoded.username)) {
                res.json({ 
                    response: "User is an admin.",
                    value: true
                });
            } else {
                res.json({ 
                    response: "User is not an admin.",
                    value: false
                });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export const check_is_admin = async (username) => {
    const userCollection = db.collection(COLLECTIONS.users);
    const data = await userCollection.findOne({ 
        username: username,
        is_admin: true
    });

    if (data) {
        return true;
    } 
    return false;
}

export default router;