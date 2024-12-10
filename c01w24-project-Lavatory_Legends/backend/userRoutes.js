import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from 'express';
import { db } from './db.js';
const router = express.Router();
const COLLECTIONS = {
    users: "users",
};

router.post("/register", express.json(), async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
        return res
            .status(400)
            .json({ error:"Username, password, and email needed to register."});
        }
        const userCollection = db.collection(COLLECTIONS.users);
        const existingUser = await userCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists." });
        }
        //check if email is valid
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email." });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await userCollection.insertOne({
            username,
            email,
            password: hashedPassword,
        });

        // Returning JSON Web Token (search JWT for more explanation)
        const token = jwt.sign({ username }, "secret-key", { expiresIn: "1h" });
        res.status(201).json({ response: "User registered successfully.", token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  });
  // Log in an existing user
router.post("/login", express.json(), async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
        return res
            .status(400)
            .json({ error: "Username and password both needed to login." });
        }
        const userCollection = db.collection(COLLECTIONS.users);
        const user = await userCollection.findOne({ username });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ username }, "secret-key", { expiresIn: "1h" });
            res.json({ response: "User logged in succesfully.", username: username, token: token });
        } else {
            res.status(401).json({ error: "Authentication failed." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  });
router.delete("/delete", express.json(), async (req, res) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret-key", async (err, decoded) => {
        if (err) {
            return res.status(401).send("Unauthorized.");
        }
        const collection = db.collection(COLLECTIONS.users);
        const data = await collection.findOneAndDelete({
            username: decoded.username
        });
        if (!data) {
            return res
            .status(404)
            .json({ error: "User with username "+ decoded.username +" not found" });
        }
        res.json({ response: "User " + decoded.username + " properly deleted" });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.patch("/update", express.json(), async (req, res) => {
    try {
    
        const { username, password, email } = req.body;
        if (!username && !password && !email) {
          return res
            .status(400)
            .json({ error: "Must have at least one of username, password, or email." });
        }
    
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret-key", async (err, decoded) => {
        if (err) {
            return res.status(401).send("Unauthorized.");
        }
        const userCollection = db.collection(COLLECTIONS.users);
        const existingUser = username ? await userCollection.findOne({ username }) : null;
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists." });
        }
        const emailRegex = /\S+@\S+\.\S+/;
        if (email && !emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email." });
        }
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
        const data = await userCollection.updateOne({
            username: decoded.username,
        }, {
            $set: {
                ...(username && { username }),
                ...(hashedPassword && { password: hashedPassword }),
                ...(email && { email })
            }
        });
    
        if (data.matchedCount === 0) {
          return res
            .status(404)
            .json({ error: "Unable to find user." });
        }
        let responseString = `${decoded.username} .`;
        if(username) responseString += ` Username updated to ${username}.`;
        if(password) responseString += ` Password updated.`;
        if(email) responseString += ` Email updated to ${email}.`;
        res.json({ response: responseString });
        });
      } catch (error) {
        res.status(500).json({error: error.message})
      }
});
router.post("/create-test-data", async (req, res) => {
    try {
        const userCollection = db.collection(COLLECTIONS.users);
        const existingUser = await userCollection.findOne({ username: "admin1" });
        if (existingUser) { 
            return res.json({ response: "Test admin already exists." });
        }

        if (process.env.NODE_ENV !== "test") {
            return res.status(400).json({ error: "This endpoint is for test only." });
        }
        
        const hashedPassword = await bcrypt.hash("password1", 10);
        const data = await userCollection.insertMany([
            {
                username: "admin1",
                password: hashedPassword,
                email: "test@email.com",
                is_admin: true
            }
        ]);
        if (data.insertedCount === 0) {
            return res
            .status(500)
            .json({ error: "Unable to create test data." });
        }
        res.json({ response: "Test data created." });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
export default router;