import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import express from "express";
import { db } from "./db.js";
const router = express.Router();

const COLLECTIONS = {
  users: "users",
  washrooms: "washrooms", // New collection for washrooms
};

function isValidOpeningSchedule(schedule) {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Matches HH:MM format

  // Check if every key in the schedule is a valid day and has valid open and close times
  return daysOfWeek.every(
    (day) =>
      schedule.hasOwnProperty(day) &&
      timeRegex.test(schedule[day].open) &&
      timeRegex.test(schedule[day].close)
  );
}

router.post("/addWashroom", express.json(), async (req, res) => {
  try {
    // Authentication check
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    // Verify token
    const decoded = jwt.verify(token, "secret-key");
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Extract washroom details from the request body
    const { location, openingSchedule, additionalInfo } = req.body;
    if (!location || !openingSchedule) {
      // Assuming these two are mandatory
      return res
        .status(400)
        .json({ error: "Location and opening schedule are required" });
    }

    if (!isValidOpeningSchedule(openingSchedule)) {
      return res.status(400).json({ error: "Invalid opening schedule format" });
    }

    // Check to see if the user has a business account
    const userCollection = db.collection(COLLECTIONS.users);
    const user = await userCollection.findOne({ username: decoded.username });
    if (!user){
      return res.status(401).json({ error: "Could not find user when add washroom" });
    } 

    // Insert washroom details into the database
    const washroomCollection = db.collection(COLLECTIONS.washrooms);
    let newWashroom = {
      location,
      openingSchedule,
      additionalInfo,
      createdBy: decoded.username, // Associate washroom with the user
      status: "pending",
    }
    if(user.business){
      newWashroom.business = user.business;
    }
    const result = await washroomCollection.insertOne(newWashroom);

    res.status(201).json({
      message: "Washroom added successfully",
      washroomID: result.insertedId,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.status(500).json({ error: error.message });
  }
});

// Helper function to validate ObjectId
function isValidObjectId(id) {
  return ObjectId.isValid(id);
}

// Endpoint to post a comment on a washroom
router.post("/postComment/:washroomId", express.json(), async (req, res) => {
  try {
    const washroomId = req.params.washroomId;
    if (!isValidObjectId(washroomId)) return res.status(400).json({ error: "Invalid washroom ID" });

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Authentication required" });

    const decoded = jwt.verify(token, "secret-key");
    if (!decoded) return res.status(401).json({ error: "Invalid token" });

    const { commentText } = req.body;
    if (!commentText) return res.status(400).json({ error: "Comment text is required" });

    const washroomCollection = db.collection(COLLECTIONS.washrooms);
    const currentTime = new Date().toISOString();
    const updateResult = await washroomCollection.updateOne(
      { _id: new ObjectId(washroomId) },
      {
        $push: {
          comments: {
            _id: new ObjectId(),
            username: decoded.username,
            text: commentText,
            timestamp: currentTime
          }
        }
      }
    );

    if (updateResult.matchedCount === 0) return res.status(404).json({ error: "Washroom not found" });

    res.status(201).json({ message: "Comment posted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to get comments for a washroom
router.get("/getComments/:washroomId", async (req, res) => {
  try {
    const washroomId = req.params.washroomId;
    if (!isValidObjectId(washroomId)) return res.status(400).json({ error: "Invalid washroom ID" });

    const washroomCollection = db.collection(COLLECTIONS.washrooms);
    const washroom = await washroomCollection.findOne(
      { _id: new ObjectId(washroomId) },
      { projection: { comments: 1 } }
    );

    if (!washroom) return res.status(404).json({ error: "Washroom not found" });

    res.status(200).json(washroom.comments || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to delete a comment from a washroom
router.delete("/deleteComment/:washroomId/:commentId", async (req, res) => {
  try {
    const { washroomId, commentId } = req.params;
    if (!isValidObjectId(washroomId) || !isValidObjectId(commentId)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const washroomCollection = db.collection(COLLECTIONS.washrooms);
    const deleteResult = await washroomCollection.updateOne(
      { _id: new ObjectId(washroomId) },
      { $pull: { comments: { _id: new ObjectId(commentId) } } }
    );

    if (deleteResult.modifiedCount === 0) return res.status(404).json({ error: "Comment not found" });

    res.status(200).json({ message
: "Comment deleted successfully" });
} catch (error) {
res.status(500).json({ error: error.message });
}
});

router.delete("/deleteWashroom", express.json(), async (req, res) => {
  try{
    // Get token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }
    // Verify token
    const decoded = jwt.verify(token, "secret-key");
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const { washroomID } = req.body;
    if (!washroomID) {
      return res.status(400).json({ error: "Washroom ID is required" });
    }
    const washroomCollection = db.collection(COLLECTIONS.washrooms);
    const data = await washroomCollection.deleteOne({
       _id: new ObjectId(washroomID),
      createdBy: decoded.username, 
      });
    if(data.deletedCount === 0){
      return res.status(404).json({ error: "Washroom not found" });
    }
    else if(data.deletedCount > 1){
      return res.status(500).json({ error: "More than one washroom deleted, should not be possible"});
    }
    return res.json({ response: "Washroom deleted" });
  }
  catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.status(500).json({ error: error.message });
  }
});

router.post('/reportIssue/:washroomId', express.json(), async (req, res) => {
  try {
    const washroomId = req.params.washroomId;
    if (!isValidObjectId(washroomId)) return res.status(400).json({ error: 'Invalid washroom ID' });

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Authentication required' });

    const decoded = jwt.verify(token, 'secret-key'); // Replace 'secret-key' with your actual secret
    if (!decoded) return res.status(401).json({ error: 'Invalid token' });

    const { issueType, location, schedule, comment } = req.body;

    const issue = {
      _id: new ObjectId(),
      username: decoded.username, // Assuming the decoded token contains the username
      timestamp: new Date().toISOString(),
      issueStatus: 'pending' // Default status when the issue is created
    };

    if (issueType.includes('Location Wrong') && location) {
      issue['Location Wrong'] = location;
    }
    if (issueType.includes('Opening Schedule Wrong') && schedule) {
      issue['Opening Schedule Wrong'] = schedule;
    }
    if (issueType.includes('Other Issue') && comment) {
      issue['Other Issue'] = comment;
    }

    const washroomCollection = db.collection(COLLECTIONS.washrooms);
    const updateResult = await washroomCollection.updateOne(
      { _id: new ObjectId(washroomId) },
      { $push: { issues: issue } }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: 'Washroom not found' });
    }

    res.status(201).json({ message: 'Issue reported successfully', issueId: issue._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
