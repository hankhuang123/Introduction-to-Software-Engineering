const SERVER_URL = "http://localhost:4000";
const fetch = require('node-fetch');

test("/admin/register - Register a user as an admin", async () => 
{
    // create the test admin (this will be used for all tests)
    const createData = await fetch(`${SERVER_URL}/user/create-test-data`, {
        method: "POST",
    }); 
    expect(createData.status).toBe(200);

    // create a new user
    const username = "testUser1";
    const password = "testPassword";
    const email = "test@gmail.com";

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

    expect(newUser.status).toBe(201);

    // login as an admin
    const adminUsername = "admin1";
    const adminPassword = "password1";

    const loginAdmin = await fetch(`${SERVER_URL}/user/login`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: adminUsername,
            password: adminPassword,
        }),
    });

    const loginAdminRes = await loginAdmin.json();
    expect(loginAdmin.status).toBe(200);
    expect(loginAdminRes.token).toBeDefined();

    // give the new user admin permission
    const adminRegister = await fetch(`${SERVER_URL}/admin/register`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${loginAdminRes.token}`
        },
        body: JSON.stringify({
        username: username
        }),
    });

    const adminResult = await adminRegister.json();
    expect(adminRegister.status).toBe(200);
    expect(adminResult.response).toBe(`User ${username} is now an admin.`);

    // login as new user
    const userLogin = await fetch(`${SERVER_URL}/user/login`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
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

    expect(deleteUser.status).toBe(200);
});

test("/admin/delete - Remove a user as an admin", async () => 
{
    // create a new user
    const username = "testUser2";
    const password = "testPassword2";
    const email = "test@gmail.com";

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

    expect(newUser.status).toBe(201);

    // login as an admin
    const adminUsername = "admin1";
    const adminPassword = "password1";

    const loginAdmin = await fetch(`${SERVER_URL}/user/login`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: adminUsername,
            password: adminPassword,
        }),
    });

    const loginAdminRes = await loginAdmin.json();
    expect(loginAdmin.status).toBe(200);
    expect(loginAdminRes.token).toBeDefined();

    // give the new user admin permission
    const adminRegister = await fetch(`${SERVER_URL}/admin/register`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${loginAdminRes.token}`
        },
        body: JSON.stringify({
        username: username
        }),
    });

    const adminResult = await adminRegister.json();
    expect(adminRegister.status).toBe(200);
    expect(adminResult.response).toBe(`User ${username} is now an admin.`);

    // remove the new user's admin permission
    const adminDelete = await fetch(`${SERVER_URL}/admin/delete`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${loginAdminRes.token}`
        },
        body: JSON.stringify({
        username: username
        }),
    });

    const adminDeleteRes = await adminDelete.json();
    expect(adminDelete.status).toBe(200);
    expect(adminDeleteRes.response).toBe(`User ${username} is now removed as an admin.`);
    
    // login as new user
    const userLogin = await fetch(`${SERVER_URL}/user/login`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
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

    expect(deleteUser.status).toBe(200);
});


test("/admin/isadmin - Check if a user is an admin - true", async () => 
{
    // login as an admin
    const adminUsername = "admin1";
    const adminPassword = "password1";

    const loginAdmin = await fetch(`${SERVER_URL}/user/login`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: adminUsername,
            password: adminPassword,
        }),
    });

    const loginAdminRes = await loginAdmin.json();
    expect(loginAdmin.status).toBe(200);
    expect(loginAdminRes.token).toBeDefined();

    // check if current user is an admin
    const isAdminResponse = await fetch(`${SERVER_URL}/admin/isadmin`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${loginAdminRes.token}`
        }
    });

    const isAdminContent = await isAdminResponse.json();
    expect(isAdminResponse.status).toBe(200);
    expect(isAdminContent.value).toBe(true);
});


test("/admin/isadmin - Check if a user is an admin - false", async () => 
{
    // create a new user
    const username = "testUser5";
    const password = "testPassword5";
    const email = "test@gmail.com";

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

    const newUserContent = await newUser.json();
    expect(newUser.status).toBe(201);
    expect(newUserContent.token).toBeDefined();

    // check if current user is an admin
    const isAdminResponse = await fetch(`${SERVER_URL}/admin/isadmin`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${newUserContent.token}`
        }
    });

    const isAdminContent = await isAdminResponse.json();
    expect(isAdminResponse.status).toBe(200);
    expect(isAdminContent.value).toBe(false);

    // delete user
    const deleteUser = await fetch(`${SERVER_URL}/user/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${newUserContent.token}`
        },
    });

    expect(deleteUser.status).toBe(200);
});
