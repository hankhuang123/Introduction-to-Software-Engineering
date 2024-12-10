import { LOCALHOST } from "./Constants";

const sleep = ms => new Promise(r => setTimeout(r, ms));

const isAdmin = async () => {
    const userToken = localStorage.getItem("userToken");
    let userIsAdmin = false;

    try {
        await fetch(`${LOCALHOST}/admin/isadmin`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ userToken }`
            }
        }).then(async (response) => {
            if (!response.ok) {
                console.log("Served failed:", response.status);
            } else {
                await response.json().then((data) => {
                    if (data.value !== null){
                        userIsAdmin = data.value;
                        return userIsAdmin;
                    }
            })};
        });

        return userIsAdmin;
    } catch (error) {
        console.error("Checking if user is an admin failed:", error);
    }
}

const isBusinessOwner = async () => {
    const userToken = localStorage.getItem("userToken");
    let userHasBusiness = false;

    try {
        await fetch(`${LOCALHOST}/business/userHasBusiness`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ userToken }`
            }
        }).then(async (response) => {
            if (!response.ok) {
                console.log("Served failed:", response.status);
            } else {
                await response.json().then((data) => {
                    if (data.value !== null){
                        userHasBusiness = data.value;
                        return userHasBusiness;
                    }
            })};
        });

        return userHasBusiness;
    } catch (error) {
        console.error("Checking if user is an admin failed:", error);
    }
}

export { sleep, isAdmin, isBusinessOwner };
