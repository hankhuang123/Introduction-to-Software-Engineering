import jwt from "jsonwebtoken";
import express from 'express';
import { db } from './db.js';
import { check_is_admin } from './adminRoutes.js';
const router = express.Router();
const COLLECTIONS = {
    users: "users",
    businesses: "businesses",
};
async function businessExists(businessName, businessCollection) {
    const existingBusiness = await businessCollection.findOne({ businessName });
    return existingBusiness;
}
async function userHasBusiness(username, businessCollection) {
    const hasBusiness = await businessCollection.findOne({ username });
    if (hasBusiness) return true;
    return false;
}
router.get("/userHasBusiness", async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret-key", async (err, decoded) => {
            if (err) {
                return res.status(401).send("Unauthorized.");
            }

            const businessCollection = db.collection(COLLECTIONS.businesses);
            if (await userHasBusiness(decoded.username, businessCollection)) {
                res.json({ 
                    response: "User is a business owner.",
                    value: true
                });
            } else {
                res.json({ 
                    response: "User does not own a business.",
                    value: false
                });
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/register", express.json(), async (req, res) => {
    try{
        const { bname: businessName, address} = req.body;
        if (!businessName || !address) {
            return res
              .status(400)
              .json({ error: "Must have business and address" });
          }
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret-key", async (err, decoded) => {
        if (err) {
            return res.status(401).send("Unauthorized.");
        }
        const userCollection = db.collection(COLLECTIONS.users);
        const businessCollection = db.collection(COLLECTIONS.businesses);
        const username = decoded.username;
        const existingBusiness = await businessExists(businessName, businessCollection);
        if (existingBusiness) {
            return res.status(400).json({ error: "Business already exists." });
        }
        const hasBusiness = await userHasBusiness(username, businessCollection);
        // find if user already has a business
        if (hasBusiness) {
            return res.status(400).json({ error: "User already has a business." });
        }
        const {acknowledged,insertedId} = await businessCollection.insertOne({
            businessName,
            address,
            username,
        }); 
        if (!acknowledged) {
            return res.status(500).json({ error: "Failed to add business." });
        }
        const data = await userCollection.updateOne({ username }, { $set: { business: businessName } });
        if (data.matchedCount === 0) {
            return res.status(404).json({ error: "User not found." });
        }
        return res.json({ response: "Business added" });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
    
});
router.delete("/delete", express.json(), async (req, res) => {
    //deletes business and removes business from user
    try{
        const token = req.headers.authorization.split(" ")[1];
        
        jwt.verify(token, "secret-key", async (err, decoded) => {
        if (err) {
            return res.status(401).send("Unauthorized.");
        }
        const businessCollection = db.collection(COLLECTIONS.businesses);
        const userCollection = db.collection(COLLECTIONS.users);
        const username = decoded.username;
        const hasBusiness = await userHasBusiness(username, businessCollection);
        if (!hasBusiness) {
            return res
            .status(404)
            .json({ error: "User does not have a business." });
        }

        const data = await businessCollection.findOneAndDelete({username});
        if (!data) {
            return res
            .status(404)
            .json({ error: "Business not found." });
        }
        await userCollection.updateOne({ username }, { $unset: { business: "" } });
        return res.json({ response: "Business properly deleted" });
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

/* Needed in case a user can delete their account without the business 
*  going away
*/
router.delete("/admin/delete", express.json(), async (req, res) => {
    //admin deletes business
    try{
        const { bname: businessName} = req.body;
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret-key", async (err, decoded) => {
        if (err) {
            return res.status(401).send("Unauthorized.");
        }
        //check if user is admin
        const userCollection = db.collection(COLLECTIONS.users);
        const username = decoded.username;
        if(!(await check_is_admin(username))){
            return res.status(401).send("Unauthorized.");
        }
        
        //find business
        const businessCollection = db.collection(COLLECTIONS.businesses);
        const business = await businessCollection.findOne({ businessName });
        if (!business) {
            return res
            .status(404)
            .json({ error: "Business not found." });
        }

        //remove business from original user (okay if it doesn't exist)
        await userCollection.updateOne({ username: business.username }, { $unset: { business: "" } });

        //delete business
        const data = await businessCollection.findOneAndDelete({
            businessName
        });
        if (!data) {
            return res
            .status(404)
            .json({ error: "Business not found, but after already finding it." });
        }

        return res.json({ response: "Business deleted." });
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.patch("/update", express.json(), async (req, res) => {
    //update business info such as address and bname
    try {
        const { bname: businessName, address} = req.body;
        if (!businessName && !address) {
          return res
            .status(400)
            .json({ error: "Must have at least one of business or address." });
        }
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret-key", async (err, decoded) => {
        if (err) {
            return res.status(401).send("Unauthorized.");
        }
        const businessCollection = db.collection(COLLECTIONS.businesses);
        const username = decoded.username;
        const hasBusiness = await userHasBusiness(username, businessCollection);
        if (!hasBusiness) {
            return res
            .status(404)
            .json({ error: "User does not have a business." });
        }
        // const bid = userInfo.business;
        const data = await businessCollection.updateOne({
            username
        }, {
            $set: {
                ...(businessName && { businessName }),
                ...(address && { address })
            }
        });
        if (data.matchedCount === 0) {
            return res
            .status(404)
            .json({ error: "Business not found." });
        }
        return res.json({ response: "Business updated." });
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.get("/get", async (req, res) => {
    //get one business given name
    try {
        const businessCollection = db.collection(COLLECTIONS.businesses);
        const { bname: businessName} = req.body;
        const business = await businessCollection.findOne({
            businessName
        });
        if (!business) {
            return res.status(404).json({ error: "Business not found." });
        }
        return res.json(business);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.get("/get-user-business", express.json(), async(req,res) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "secret-key", async (err, decoded) => {
            if (err) {
                return res.status(401).send("Unauthorized.");
            }
        const businessCollection = db.collection(COLLECTIONS.businesses);
        const business = await businessCollection.findOne({ username: decoded.username });
        if(!business){
            return res.status(400).json({error: "No business found"});
        }
        return res.json(business);
    });
    } catch(error){
        return res.status(500).json({ error: error.message });
    }
});
router.get("/get-all", async (req, res) => {
    //get all businesses
    try {
        const businessCollection = db.collection(COLLECTIONS.businesses);
        const businesses = await businessCollection.find({}).toArray();
        return res.json(businesses);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

export default router;