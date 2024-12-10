const SERVER_URL = "http://localhost:4000";
const fetch = require('node-fetch');

test("/post/addWashroom - add a business washroom", async () => {
    //create a new user
    const username = "businessuser1";
    const password = "password1";
    const email = "business@user.com";
    const newUser = await fetch(`${SERVER_URL}/user/register`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
            email,
        }),
    });
    const newUserRes = await newUser.json();
    expect(newUser.status).toBe(201);
    expect(newUserRes.response).toBe("User registered successfully.");
    const token = newUserRes.token;

    // add a business to the user
    const businessName = "testBusiness";
    const address = "testAddress";
    const newBusiness = await fetch(`${SERVER_URL}/business/register`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            bname: businessName,
            address,
        }),
    });
    const newBusinessRes = await newBusiness.json();
    expect(newBusiness.status).toBe(200);
    expect(newBusinessRes.response).toBe("Business added");

    //add a washroom
    const location = "testLocation";
    const openingSchedule = {
        Monday: { open: '08:00', close: '18:00' }, 
        Tuesday: { open: '08:00', close: '18:00' },
        Wednesday: { open: '08:00', close: '18:00' },
        Thursday: { open: '08:00', close: '18:00' },
        Friday: { open: '08:00', close: '18:00' },
        Saturday: { open: '08:00', close: '18:00' },
        Sunday: { open: '08:00', close: '18:00' },
    };
    const additionalInfo = "testInfo";
    const addWashroom = await fetch(`${SERVER_URL}/post/addWashroom`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            location,
            openingSchedule,
            additionalInfo,
        }),
    });
    const addWashroomRes = await addWashroom.json();
    expect(addWashroom.status).toBe(201);
    expect(addWashroomRes.message).toBe("Washroom added successfully");
    expect(addWashroomRes.washroomID).toBeDefined();
    const washroomID = addWashroomRes.washroomID;

    //get the list of washrooms and check to see that it was added
    const washrooms = await fetch(`${SERVER_URL}/admin/washrooms/pendingWashrooms`);
    const washroomsRes = await washrooms.json();
    expect(washrooms.status).toBe(200);
    expect(washroomsRes).toBeInstanceOf(Array);
    expect(washroomsRes.length).toBe(1);
    expect(washroomsRes.find(
        item => item._id === washroomID &&
        item.location === location &&
        item.additionalInfo === additionalInfo &&
        item.business === businessName &&
        item.createdBy === username
        )).toBeDefined();

    //delete the washroom
    const deleteWashroom = await fetch(`${SERVER_URL}/post/deleteWashroom`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            washroomID,
        }),
    });
    const deleteWashroomRes = await deleteWashroom.json();
    console.log(deleteWashroomRes.error);
    expect(deleteWashroom.status).toBe(200);
    expect(deleteWashroomRes.response).toBe("Washroom deleted");

    //check the list of washrooms to see that it was deleted
    const washrooms2 = await fetch(`${SERVER_URL}/admin/washrooms/pendingWashrooms`);
    const washroomsRes2 = await washrooms2.json();
    expect(washrooms2.status).toBe(200);
    expect(washroomsRes2).toBeInstanceOf(Array);
    expect(washroomsRes2.length).toBe(0);

    // delete a business
    const deleteBusiness = await fetch(`${SERVER_URL}/business/delete`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
    });
    const deleteBusinessRes = await deleteBusiness.json();
    expect(deleteBusiness.status).toBe(200);
    expect(deleteBusinessRes.response).toBe("Business properly deleted");

    //delete the user
    const deleteUser = await fetch(`${SERVER_URL}/user/delete`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
    });
    expect(deleteUser.status).toBe(200);
});
