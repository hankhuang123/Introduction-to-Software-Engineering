import jwt from "jsonwebtoken";
import { check_is_admin } from "./adminRoutes.js";
import express from 'express';
import { db } from './db.js';
const router = express.Router();
const COLLECTIONS = {
    users: "users",
    sponsors: "sponsors",
};
export async function addSponsor(name, amount, res) {
    const sponsorCollection = db.collection(COLLECTIONS.sponsors);
    //check if sponsor already exists
    const existingSponsor = await sponsorCollection.findOne({ name });
    if (existingSponsor) {
        return res.status(400).json({ error: "Sponsor already exists." });
    }
    //insert sponsor
    const data = await sponsorCollection.insertOne({
        name: name,
        amount: amount
    });
    if (!data) {
        return res
        .status(404)
        .json({ error: "Unable to add sponsor." });
    }

    return res.json({ response: `Sponsor ${name} added successfully.` });

}
async function deleteSponsor(name,res) {
    const sponsorCollection = db.collection(COLLECTIONS.sponsors);
    const data = await sponsorCollection.deleteOne({
        name: name
    });
    if (!data) {
        return res
        .status(404)
        .json({ error: "Unable to delete sponsor." });
    }
    else if(data.deletedCount === 0){
        return res.status(404).json({ error: "Sponsor not found" });
    }
    else if(data.deletedCount > 1){
        return res.status(500).json({ error: "More than one sponsor deleted, should not be possible"});
    }
    return res.json({ response: `Sponsor ${name} deleted successfully.` });
}
export async function updateSponsor(name, amount, res){
    const sponsorCollection = db.collection(COLLECTIONS.sponsors);
    const existingSponsor = name ? await sponsorCollection.findOne({ name }) : null;
    if (!existingSponsor) {
        return res.status(400).json({ error: "Sponsor does not exist." });
    }
    //get old amount
    const newAmount = existingSponsor.amount + amount;
    const data = await sponsorCollection.updateOne({
        name: name,
    }, {
        $set: {
            ...(name && { name }),
            ...(newAmount && { amount: newAmount })
        }
    });
    if (!data) {
        return res
        .status(404)
        .json({ error: "Unable to update sponsor." });
    }
    else if(data.matchedCount === 0){
        return res.status(404).json({ error: "Sponsor not found" });
    }
    else if(data.modifiedCount === 0){
        return res.status(500).json({ error: "Sponsor found, but not updated" });
    }
    return res.json({ response: `Sponsor ${name} updated successfully.` });
}
export async function check_is_sponsor(name){
    const sponsorCollection = db.collection(COLLECTIONS.sponsors);
    const existingSponsor = name ? await sponsorCollection.findOne({ name }) : null;
    if (!existingSponsor) {
        return false;
    }
    else {
        return true
    }
}
async function addToSponsor(name,amount,res){
    const isSponsor = await check_is_sponsor(name);
    var returnVal;
    if(isSponsor){
        updateSponsor(name,amount,res);
    }
    else{
        addSponsor(name,amount,res);
    }
    if (res.statusCode !== 200) {
        return res.status(500).json({ error: "Internal server error." });
    }
}
router.post("/addSponsor", express.json(), async (req, res) => {
    try {
        const { name, amount, id } = req.body;
        if (!amount || typeof amount !== "number" || amount <= 0) {
            return res.status(400).json({ errorMessage: "Invalid donation amount." });
          }
        if(!name && !id){
            return res
                .status(400)
                .json({ error:"Both name and id is required."});
        }
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret-key", async (err, decoded) => {
        if (err || !check_is_admin(decoded.username)) {
            return res.status(401).send("Unauthorized.");
        }
        return addSponsor(name,amount,res);
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.post("/admin/addSponsor", express.json(), async (req, res) => {
    try {
        const { name, amount } = req.body;
        if (!amount || typeof amount !== "number" || amount <= 0) {
            return res.status(400).json({ errorMessage: "Invalid donation amount." });
          }
        if(!name){
            return res
                .status(400)
                .json({ error:"Both name is required."});
        }
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret-key", async (err, decoded) => {
        if (err || !check_is_admin(decoded.username)) {
            return res.status(401).send("Unauthorized.");
        }
        return addSponsor(name,amount,res);
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.delete("/admin/deleteSponsor", express.json(), async (req, res) => {
    try{
        const { name } = req.body;
        if (!name) {
        return res
            .status(400)
            .json({ error:"Name is required."});
        }
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret-key", async (err, decoded) => {
        if (err || !check_is_admin(decoded.username)) {
            return res.status(401).send("Unauthorized.");
        }
        return deleteSponsor(name,res);
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.patch("/admin/updateSponsor", express.json(), async (req, res) => {
    try {
        const { name, amount } = req.body;
        if (!(name || amount)) {
          return res
            .status(400)
            .json({ error: "Must have at least one of name or amount." });
        }
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret-key", async (err, decoded) => {
        if (err || !check_is_admin(decoded.username)) {
            return res.status(401).send("Unauthorized.");
        }
        return updateSponsor(name,amount,res);
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.patch("/admin/addLogo", express.json(), async (req, res) => {
    try {
        const { name, imgURL } = req.body;
        if (!(name && imgURL)) {
          return res
            .status(400)
            .json({ error: "Must have at both name and amount." });
        }
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret-key", async (err, decoded) => {
        if (err || !check_is_admin(decoded.username)) {
            return res.status(401).send("Unauthorized.");
        }

        const sponsorCollection = db.collection(COLLECTIONS.sponsors);
        const data = await sponsorCollection.updateOne({
            name: name
        }, {
            $set: {
                imgURL: imgURL
            }
        });

        if (data.matchedCount === 0) {
            return res
            .status(404)
            .json({ error: "Unable to find sponsor." });
        }

        return res.json({ response: `Added image URL ${imgURL} for sponsor ${name}` });
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.get("/getSponsors", express.json(), async (req,res) => {
    try{
        const sponsors = await db
      .collection(COLLECTIONS.sponsors)
      .find({ })
      .toArray();
      res.json(sponsors);
    } catch(error){
        return res.status(500).json({ error: error.message });
    }
});
export default router;