const SERVER_URL = "http://localhost:4000";
const fetch = require('node-fetch');
const usernameglobal = "testUser1";
const passwordglobal = "testPassword";
const emailglobal = "test@gmail.com";

test("/user/register - Register a user", async () => 
{
    // create a new user
    const username = usernameglobal;
    const password = passwordglobal;
    const email = emailglobal;

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
});
test("/user/login - Login as a user", async () =>
{
    const username = usernameglobal;
    const password = passwordglobal;

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
    const userLoginRes = await newLogin.json();
    expect(newLogin.status).toBe(200);
    expect(userLoginRes.token).toBeDefined();
});
test("/user/delete - Delete a user", async () => 
{
    const username = usernameglobal;
    const password = passwordglobal;
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
    expect(userLogin.status).toBe(200);
    expect(userLoginRes.token).toBeDefined();

    // delete user
    const deleteUser = await fetch(`${SERVER_URL}/user/delete`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userLoginRes.token}`
        },
    });
    const deleteUserRes = await deleteUser.json();
    expect(deleteUser.status).toBe(200);
    expect(deleteUserRes.response).toBe("User testUser1 properly deleted");

});