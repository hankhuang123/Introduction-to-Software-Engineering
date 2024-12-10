import express from "express";
import { ObjectId } from "mongodb";
import { db } from "./db.js";

const router = express.Router();

// Assuming the collection name for washrooms
const COLLECTION_NAME = "washrooms";

// Route to list all washrooms with "pending" status
router.get("/pendingWashrooms", async (req, res) => {
  try {
    const washrooms = await db
      .collection(COLLECTION_NAME)
      .find({ status: "pending" })
      .toArray();
    res.json(washrooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to list all washrooms with "approved" status
router.get("/approvedWashrooms", async (req, res) => {
  try {
    const washrooms = await db
      .collection(COLLECTION_NAME)
      .find({ status: "approved" })
      .toArray();
    res.json(washrooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to list all approved washrooms with at least one pending issue
router.get("/pendingIssues", async (req, res) => {
  try {
    const washrooms = await db
      .collection(COLLECTION_NAME)
      .find({ 
        status: "approved",
        issues: { $elemMatch: { issueStatus: "pending" } } // Filter for washrooms with pending issues
      })
      .toArray();
    res.json(washrooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


async function approveWashroom(washroomId) {
  return updateWashroomStatus(washroomId, "approved");
}

async function denyWashroom(washroomId) {
  return updateWashroomStatus(washroomId, "denied");
}

async function updateWashroomStatus(washroomId, status) {
  try {
    const result = await db
      .collection(COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(washroomId) }, { $set: { status } });

    if (result.matchedCount === 0) {
      return { success: false, message: "Washroom not found." };
    }

    return {
      success: true,
      message: `Washroom status updated to '${status}'.`,
    };
  } catch (error) {
    console.error(`Failed to update washroom status: ${error}`);
    return { success: false, message: error.message };
  }
}

// Route to approve a washroom
router.patch(
  "/approveWashroom/:washroomId",
  express.json(),
  async (req, res) => {
    const { washroomId } = req.params;
    const result = await approveWashroom(washroomId);

    if (!result.success) {
      return res.status(404).json({ error: result.message });
    }

    res.json({ message: result.message });
  }
);

// Route to deny a washroom
router.patch("/denyWashroom/:washroomId", express.json(), async (req, res) => {
  const { washroomId } = req.params;
  const result = await denyWashroom(washroomId);

  if (!result.success) {
    return res.status(404).json({ error: result.message });
  }

  res.json({ message: result.message });
});

// Route to get washroom information by ID
router.get("/:washroomId", async (req, res) => {
  const { washroomId } = req.params;
  try {
    const washroom = await db
      .collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(washroomId) });
    if (!washroom) {
      return res.status(404).json({ error: "Washroom not found." });
    }
    res.json(washroom);
  } catch (error) {
    console.error(`Failed to retrieve washroom: ${error}`);
    res.status(500).json({ error: error.message });
  }
});

async function handleIssueResolution(washroomId, issueId, approve) {
  try {
    const washroomCollection = db.collection(COLLECTION_NAME);
    const washroom = await washroomCollection.findOne({ "_id": new ObjectId(washroomId), "issues._id": new ObjectId(issueId) });

    if (!washroom) {
      return { success: false, message: "Washroom or issue not found." };
    }

    const issue = washroom.issues.find(issue => issue._id.equals(new ObjectId(issueId)));

    if (approve) {
      // Apply updates based on the issue type
      let update = {};
      if (issue['Location Wrong']) {
        update.location = issue['Location Wrong'];
      }
      if (issue['Opening Schedule Wrong']) {
        update.openingSchedule = issue['Opening Schedule Wrong'];
      }

      // Update the washroom with new location or opening schedule
      await washroomCollection.updateOne(
        { "_id": new ObjectId(washroomId) },
        { $set: update }
      );
    }

    // Remove the issue from the issues array regardless of approval
    await washroomCollection.updateOne(
      { "_id": new ObjectId(washroomId) },
      { $pull: { "issues": { "_id": new ObjectId(issueId) } } }
    );

    return {
      success: true,
      message: approve ? "Issue approved and resolved." : "Issue denied and removed.",
    };
  } catch (error) {
    console.error(`Failed to resolve issue: ${error}`);
    return { success: false, message: error.message };
  }
}

// Endpoint to approve an issue
router.patch("/approveIssue/:washroomId/:issueId", express.json(), async (req, res) => {
  const { washroomId, issueId } = req.params;
  const result = await handleIssueResolution(washroomId, issueId, true);

  if (!result.success) {
    return res.status(404).json({ error: result.message });
  }

  res.json({ message: result.message });
});

// Endpoint to deny an issue
router.patch("/denyIssue/:washroomId/:issueId", express.json(), async (req, res) => {
  const { washroomId, issueId } = req.params;
  const result = await handleIssueResolution(washroomId, issueId, false);

  if (!result.success) {
    return res.status(404).json({ error: result.message });
  }

  res.json({ message: result.message });
});

// router.delete("/deleteAllWashrooms", async (req, res) => {
//   try {
//     const result = await db.collection(COLLECTION_NAME).deleteMany({});
//     res.status(200).json({
//       message: `${result.deletedCount} washrooms deleted successfully.`,
//     });
//   } catch (error) {
//     console.error(`Failed to delete washrooms: ${error}`);
//     res.status(500).json({ error: error.message });
//   }
// });

export default router;
