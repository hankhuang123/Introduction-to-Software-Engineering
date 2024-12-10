const SERVER_URL = "http://localhost:4000";
const fetch = require('node-fetch');
const globalname = "Spons Oer";
const globalamount = 10;
var globaltoken;
test("/admin/addSponsor - Add a sponsor as an admin", async () => 
{
    //make sure admin exists
    const createData = await fetch(`${SERVER_URL}/user/create-test-data`, {
        method: "POST",
    }); 
    expect(createData.status).toBe(200);
    //login as admin
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
    
    globaltoken = loginAdminRes.token;
    //create a sponsor
    const sponsorCreate = await fetch(`${SERVER_URL}/sponsor/admin/addSponsor`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${globaltoken}`
            },
            body: JSON.stringify({
                name: globalname,
                amount: globalamount,
            }),
    });
    //check return values
    expect(sponsorCreate.status).toBe(200);
    const sponsorCreateResult = await sponsorCreate.json();
    expect(sponsorCreateResult.response).toBe("Sponsor "+ globalname +" added successfully.");
    
    //use get to make sure it is in the sponsor list 
    const sponsorList = await fetch(`${SERVER_URL}/sponsor/getSponsors`);
    const sponsorListRes = await sponsorList.json();
    expect(sponsorList.status).toBe(200);
    expect(sponsorListRes).toBeInstanceOf(Array);
    expect(sponsorListRes.length).toBe(1);
    expect(sponsorListRes.find(
        item => item.name === globalname &&
        item.amount === globalamount
        )).toBeDefined();
});
test("/admin/deleteSponsor - Delete a sponsor as an admin", async () => 
{
    //delete sponsor
    const sponsorDelete = await fetch(`${SERVER_URL}/sponsor/admin/deleteSponsor`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${globaltoken}`
            },
            body: JSON.stringify({
                name: globalname
            }),
    }); 
    expect(sponsorDelete.status).toBe(200);
    sponsorDeleteres = await sponsorDelete.json();
    expect(sponsorDeleteres.response).toBe("Sponsor "+ globalname +" deleted successfully.")
    //get list to check that sponsor has been deleted
    const sponsorList = await fetch(`${SERVER_URL}/admin/washrooms/pendingWashrooms`);
    const sponsorListres = await sponsorList.json();
    expect(sponsorList.status).toBe(200);
    expect(sponsorListres).toBeInstanceOf(Array);
    expect(sponsorListres.length).toBe(0);
});
test("/admin/deleteSponsor - Delete a sponsor that does not exist", async () => 
{
    const sponsorDelete = await deleteSponsor(globalname,globaltoken);
    expect(sponsorDelete.status).toBe(404);
    const sponsorDeleteres = await sponsorDelete.json();
    expect(sponsorDeleteres.error).toBe("Sponsor not found");
});
test("/admin/updateSponsor - Update a sponsor as an admin", async () => 
{
    const name = "Guy Sponsoar"
    const amount = 1000;
    const sponsor = await addSponsor(name,amount,globaltoken);
    expect(sponsor.status).toBe(200);
    const newAmount = 15;
    const sponsorUpdate = await fetch(`${SERVER_URL}/sponsor/admin/updateSponsor`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${globaltoken}`
            },
            body: JSON.stringify({
                name: name,
                amount: newAmount,
            }),
    });
    expect(sponsorUpdate.status).toBe(200) //check the status here
    
});
async function addSponsor(name, amount, token) {
    const sponsorCreate = await fetch(`${SERVER_URL}/sponsor/admin/addSponsor`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                amount,
            }),
    });
    return sponsorCreate;
}
async function deleteSponsor(name,token) {
    const sponsorDelete = await fetch(`${SERVER_URL}/sponsor/admin/deleteSponsor`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name
            }),
    });
    return sponsorDelete;
}