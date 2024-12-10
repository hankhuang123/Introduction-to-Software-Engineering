const SERVER_URL = "http://localhost:4000";
const e = require("express");
const fetch = require("node-fetch");
const usernameglobal = "testUser1";
const passwordglobal = "testPassword";
const emailglobal = "test@gmail.com";

async function addPendingWashroom(token, location) {
  const openingSchedule = {
    Monday: { open: "08:00", close: "18:00" },
    Tuesday: { open: "08:00", close: "18:00" },
    Wednesday: { open: "08:00", close: "18:00" },
    Thursday: { open: "08:00", close: "18:00" },
    Friday: { open: "08:00", close: "18:00" },
    Saturday: { open: "08:00", close: "18:00" },
    Sunday: { open: "08:00", close: "18:00" },
  };
  const additionalInfo = "testInfo";

  const response = await fetch(`${SERVER_URL}/post/addWashroom`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      location,
      openingSchedule,
      additionalInfo,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add test washroom");
  }

  const data = await response.json();
  return data.washroomID;
}

test("/admin/washrooms/pendingWashrooms - Get all pending washrooms", async () => {
  // Create a new user
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
  // Login as the new user
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
  const token = userLoginRes.token;

  // Add a pending washroom
  const washroomID = await addPendingWashroom(token, "testLocation");

  // Get all pending washrooms
  const response = await fetch(
    `${SERVER_URL}/admin/washrooms/pendingWashrooms`
  );
  const washrooms = await response.json();
  expect(response.status).toBe(200);
  expect(washrooms).toHaveLength(1);
  expect(washrooms[0].location).toBe("testLocation");
  expect(washrooms[0]._id).toBe(washroomID);

  //delete the washroom
  const deleteWashroom = await fetch(`${SERVER_URL}/post/deleteWashroom`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      washroomID,
    }),
  });
  const deleteWashroomRes = await deleteWashroom.json();
  expect(deleteWashroom.status).toBe(200);
  expect(deleteWashroomRes.response).toBe("Washroom deleted");

  //delete the user
  const deleteUser = await fetch(`${SERVER_URL}/user/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  expect(deleteUser.status).toBe(200);
});

test("/admin/washrooms/:washroomId - Get washroom by ID", async () => {
  // Create a new user
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
  // Login as the new user
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
  const token = userLoginRes.token;

  // Add a pending washroom
  const washroomID = await addPendingWashroom(token, "testLocation");

  // Get the washroom by ID
  const response = await fetch(`${SERVER_URL}/admin/washrooms/${washroomID}`);
  const washroom = await response.json();
  expect(response.status).toBe(200);
  expect(washroom.location).toBe("testLocation");
  expect(washroom._id).toBe(washroomID);

  //delete the washroom
  const deleteWashroom = await fetch(`${SERVER_URL}/post/deleteWashroom`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      washroomID,
    }),
  });
  const deleteWashroomRes = await deleteWashroom.json();
  expect(deleteWashroom.status).toBe(200);
  expect(deleteWashroomRes.response).toBe("Washroom deleted");

  //delete the user
  const deleteUser = await fetch(`${SERVER_URL}/user/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  expect(deleteUser.status).toBe(200);
});

test("/admin/washrooms/approveWashroom - Approve a washroom", async () => {
  // Create a new user
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
  // Login as the new user
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
  const token = userLoginRes.token;

  // Add a pending washroom
  const washroomID = await addPendingWashroom(token, "testLocation");

  // Approve the washroom
  const response = await fetch(
    `${SERVER_URL}/admin/washrooms/approveWashroom/${washroomID}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  expect(response.status).toBe(200);

  // Check that the washroom was approved
  // Get the washroom by ID
  const washroomRes = await fetch(
    `${SERVER_URL}/admin/washrooms/${washroomID}`
  );
  const washroom = await washroomRes.json();
  expect(washroom.status).toBe("approved");

  //delete the washroom
  const deleteWashroom = await fetch(`${SERVER_URL}/post/deleteWashroom`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      washroomID,
    }),
  });
  const deleteWashroomRes = await deleteWashroom.json();
  expect(deleteWashroom.status).toBe(200);
  expect(deleteWashroomRes.response).toBe("Washroom deleted");

  //delete the user
  const deleteUser = await fetch(`${SERVER_URL}/user/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  expect(deleteUser.status).toBe(200);
});

test("/admin/washrooms/denyWashroom - Deny a washroom", async () => {
  // Create a new user
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
  // Login as the new user
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
  const token = userLoginRes.token;

  // Add a pending washroom
  const washroomID = await addPendingWashroom(token, "testLocation");

  // Deny the washroom
  const response = await fetch(
    `${SERVER_URL}/admin/washrooms/denyWashroom/${washroomID}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  expect(response.status).toBe(200);

  // Check that the washroom was denied
  // Get the washroom by ID
  const washroomRes = await fetch(
    `${SERVER_URL}/admin/washrooms/${washroomID}`
  );
  const washroom = await washroomRes.json();
  expect(washroom.status).toBe("denied");

  //delete the washroom
  const deleteWashroom = await fetch(`${SERVER_URL}/post/deleteWashroom`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      washroomID,
    }),
  });
  const deleteWashroomRes = await deleteWashroom.json();
  expect(deleteWashroom.status).toBe(200);
  expect(deleteWashroomRes.response).toBe("Washroom deleted");

  //delete the user
  const deleteUser = await fetch(`${SERVER_URL}/user/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  expect(deleteUser.status).toBe(200);
});

test("/admin/washrooms/approvedWashrooms - Get list of all washrooms with approved status", async () => {
  // Create a new user
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
  // Login as the new user
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
  const token = userLoginRes.token;

  // Add a pending washroom
  const washroomID = await addPendingWashroom(token, "testLocation");

  // Approve the washroom
  const approveResponse = await fetch(
    `${SERVER_URL}/admin/washrooms/approveWashroom/${washroomID}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const approveData = await approveResponse.json();
  expect(approveResponse.status).toBe(200);

  // Get all approved washrooms
  const response = await fetch(
    `${SERVER_URL}/admin/washrooms/approvedWashrooms`
  );
  const washrooms = await response.json();
  expect(response.status).toBe(200);
  expect(washrooms).toHaveLength(1);
  expect(washrooms[0].location).toBe("testLocation");
  expect(washrooms[0]._id).toBe(washroomID);

  //delete the washroom
  const deleteWashroom = await fetch(`${SERVER_URL}/post/deleteWashroom`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      washroomID,
    }),
  });
  const deleteWashroomRes = await deleteWashroom.json();
  expect(deleteWashroom.status).toBe(200);
  expect(deleteWashroomRes.response).toBe("Washroom deleted");

  //delete the user
  const deleteUser = await fetch(`${SERVER_URL}/user/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  expect(deleteUser.status).toBe(200);
});
