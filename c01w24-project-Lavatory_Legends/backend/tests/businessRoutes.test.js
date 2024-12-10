const SERVER_URL = "http://localhost:4000";
const fetch = require('node-fetch');
const usernameglobal = "testUser1";
const passwordglobal = "testPassword";
const emailglobal = "test@gmail.com";
test("/business/register - Register a business", async () => 
{
    //create a new user
    const username = usernameglobal;
    const password = passwordglobal;
    const email = emailglobal;
    const newUser = await registerUser(username, password, email);
    const newUserRes = await newUser.json();
    expect(newUser.status).toBe(201);
    expect(newUserRes.response).toBe("User registered successfully.");
    const token = newUserRes.token;
    // create a new business
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
}); 
test("/business/register - Register a business that already exists", async () => 
{
    //login with global user
    const username = usernameglobal;
    const password = passwordglobal;
    newLogin = await loginUser(username, password);
    const userLoginRes = await newLogin.json();
    const token = userLoginRes.token;
    // create a new business
    const newBusiness = await registerBusiness("testBusiness", "testAddress", token);
    const newBusinessRes = await newBusiness.json();
    expect(newBusiness.status).toBe(400);
    expect(newBusinessRes.error).toBe("Business already exists.");
});
test("/business/register - Register a business when user already has a business", async () => 
{
    //login with global user
    const username = usernameglobal;
    const password = passwordglobal;
    newLogin = await loginUser(username, password);
    const userLoginRes = await newLogin.json();
    const token = userLoginRes.token;
    // create a new business
    const newBusiness = await registerBusiness("testBusiness2", "testAddress2", token);
    const newBusinessRes = await newBusiness.json();
    expect(newBusiness.status).toBe(400);
    expect(newBusinessRes.error).toBe("User already has a business.");
});
test("/business/delete - Delete a business", async () =>
{
    //login with global user
    const username = usernameglobal;
    const password = passwordglobal;
    newLogin = await loginUser(username, password);
    const userLoginRes = await newLogin.json();
    const token = userLoginRes.token;
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

});
test("/business/delete - Delete a business that does not exist", async () =>
{
    //login with global user
    const username = usernameglobal;
    const password = passwordglobal;
    newLogin = await loginUser(username, password);
    const userLoginRes = await newLogin.json();
    const token = userLoginRes.token;
    // delete a business
    const deleteBusiness = await fetch(`${SERVER_URL}/business/delete`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
    });
    const deleteBusinessRes = await deleteBusiness.json();
    expect(deleteBusiness.status).toBe(404);
    expect(deleteBusinessRes.error).toBe("User does not have a business.");

});
test("/business/update - Update a business", async () =>
{
    //login with global user
    const username = usernameglobal;
    const password = passwordglobal;
    newLogin = await loginUser(username, password);
    const userLoginRes = await newLogin.json();
    const token = userLoginRes.token;
    //register a business
    const newBusiness = await registerBusiness("testBusiness3", "testAddress3", token);
    const newBusinessRes = await newBusiness.json();
    expect(newBusiness.status).toBe(200);

    // update a business
    const updateBusiness = await fetch(`${SERVER_URL}/business/update`, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            bname: "newtestBusiness3",
            address: "newtestAddress3",
        }),
    });
    const updateBusinessRes = await updateBusiness.json();
    expect(updateBusiness.status).toBe(200);
    expect(updateBusinessRes.response).toBe("Business updated.");
});
test("/business/update - Update only the business address", async () =>{
    //login with global user
    const username = usernameglobal;
    const password = passwordglobal;
    newLogin = await loginUser(username, password);
    const userLoginRes = await newLogin.json();
    const token = userLoginRes.token;
    // update a business
    const updateBusiness = await fetch(`${SERVER_URL}/business/update`, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            address: "newtestAddress4",
        }),
    });
    const updateBusinessRes = await updateBusiness.json();
    expect(updateBusiness.status).toBe(200);
    expect(updateBusinessRes.response).toBe("Business updated.");

});
test("/business/update - Update only the business name", async () =>{
    //login with global user
    const username = usernameglobal;
    const password = passwordglobal;
    newLogin = await loginUser(username, password);
    const userLoginRes = await newLogin.json();
    const token = userLoginRes.token;
    // update a business
    const updateBusiness = await fetch(`${SERVER_URL}/business/update`, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            bname: "wackyBusiness5",
        }),
    });
    const updateBusinessRes = await updateBusiness.json();
    expect(updateBusiness.status).toBe(200);
    expect(updateBusinessRes.response).toBe("Business updated.");
    
    //delete user
    await deleteUser(username, password);
});
test("/business/update - Update a business that does not exist", async () =>
{
    //create a new user
    const username = "testUser2";
    const password = "testPassword";
    const email = "test@email2.com";
    const newUser = await registerUser(username, password, email);
    const newUserRes = await newUser.json();
    const token = newUserRes.token;
    expect(newUser.status).toBe(201);
    
    // update a business
    const updateBusiness = await fetch(`${SERVER_URL}/business/update`, {
        method: "PATCH",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            bname: "newtestBusiness3",
            address: "newtestAddress3",
        }),
    });
    const updateBusinessRes = await updateBusiness.json();
    expect(updateBusiness.status).toBe(404);
    expect(updateBusinessRes.error).toBe("User does not have a business.");
    //delete user
    const deleteUserAnswer = await deleteUser(username, password);
    const deleteUserRes = await deleteUserAnswer.json();

    expect(deleteUserAnswer.status).toBe(200);
    expect(deleteUserRes.response).toBe("User testUser2 properly deleted");
});
test("/business/admin/delete - Delete a business as an admin", async () =>{
    //create admin data
    const createData = await fetch(`${SERVER_URL}/user/create-test-data`, {
        method: "POST",
    }); 
    expect(createData.status).toBe(200);
    //login as admin
    const adminUsername = "admin1";
    const adminPassword = "password1";
    const adminLogin = await loginUser(adminUsername, adminPassword);
    const adminLoginRes = await adminLogin.json();
    const token = adminLoginRes.token;
    //delete a business
    const deleteBusiness = await fetch(`${SERVER_URL}/business/admin/delete`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            bname: "wackyBusiness5",
        }),
    }); 
});
deleteUser(usernameglobal,passwordglobal);
async function registerUser(username, password, email) {
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
    return newUser;
}
async function loginUser(username, password) {
    const newLogin = await fetch(`${SERVER_URL}/user/login`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    });
    return newLogin;
}
async function deleteUser(username, password) {
    const userLogin = await fetch(`${SERVER_URL}/user/login`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    });
    const userLoginRes = await userLogin.json();
    const token = userLoginRes.token;
    const deleteUser = await fetch(`${SERVER_URL}/user/delete`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
    });
    return deleteUser;
}
async function registerBusiness(bname, address, token) {
    const newBusiness = await fetch(`${SERVER_URL}/business/register`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
            bname,
            address,
        }),
    });
    return newBusiness;
}