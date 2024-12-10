const SERVER_URL = "http://localhost:4000";
const fetch = require('node-fetch');

test("/notification/postNotification- successful notification", async () => 
{
    // create the test admin (this will be used for all tests)
    const createData = await fetch(`${SERVER_URL}/user/create-test-data`, {
        method: "POST",
    }); 
    expect(createData.status).toBe(200);

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

    // post notification
    const title = "testTitle1";
    const content = "testContent1";
    const postResponse = await fetch(`${SERVER_URL}/notification/postNotification`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${loginAdminRes.token}`
        },
        body: JSON.stringify({
            title: title,
            content: content,
        }),
    });

    expect(postResponse.status).toBe(200);

    const postContent = await postResponse.json();
    expect(postContent.response).toBe(`Notification ${title} posted successfully.`);
});

test("/notification/postNotification- failing notification no content", async () => 
{
    // create the test admin (this will be used for all tests)
    const createData = await fetch(`${SERVER_URL}/user/create-test-data`, {
        method: "POST",
    }); 
    expect(createData.status).toBe(200);

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

    // post notification
    const title = "testTitle2";
    const postResponse = await fetch(`${SERVER_URL}/notification/postNotification`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${loginAdminRes.token}`
        },
        body: {
            title: title
        }
    });

    expect(postResponse.status).toBe(400);
});

test("/notification/postNotification- failing notification no title", async () => 
{
    // create the test admin (this will be used for all tests)
    const createData = await fetch(`${SERVER_URL}/user/create-test-data`, {
        method: "POST",
    }); 
    expect(createData.status).toBe(200);
    
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

    // post notification
    const content = "testContent2";
    const postResponse = await fetch(`${SERVER_URL}/notification/postNotification`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${loginAdminRes.token}`
        },
        body: {
            content: content
        }
    });

    expect(postResponse.status).toBe(400);
});
