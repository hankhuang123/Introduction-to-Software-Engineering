import React,{ useState } from 'react'
import NavBar from '../navComponents/NavBar'
import BackButton from '../navComponents/BackButton'
import { LOCALHOST } from '../../Constants'

const SponsorPage = () => {
    const [name, setName] = useState('');
    const [deleteName, setDeleteName] = useState('');
    const [logoName, setLogoName] = useState('');
    const [amount, setAmount] = useState('');
    const [imgURL, setImgURL] = useState('');
    const [status, setStatus] = useState("");

    const handleAddSponsor = async (e) => {
        e.preventDefault();
        const userToken = localStorage.getItem("userToken");
        setStatus("Loading...");
    
        try {
            const amountNum = parseFloat(amount);
            if (isNaN(amountNum)) {
                console.log("Invalid amount input");
                setStatus("Please input a valid amount.");
                return;
            }

            await fetch(`${LOCALHOST}/sponsor/admin/addSponsor`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${ userToken }`
                },
                body: JSON.stringify({
                    name: name,
                    amount: amountNum
                }),
            }).then(async (response) => {
                if (!response.ok) {
                    console.log("Unable to add sponsor:", response.status);
                    setStatus("Unable to add sponsor.");
                } else {
                    console.log(`Sponsor ${name} added.`);
                    setStatus(`Sponsor ${name} added.`);
                };
            });
        } catch (error) {
            console.error(`Adding sponsors failed: `, error);
            setStatus(`Error trying to add sponsor ${name}`);
        }
    };

    const handleAddLogo = async (e) => {
        e.preventDefault();
        const userToken = localStorage.getItem("userToken");
        setStatus("Loading...");
    
        try {
            await fetch(`${LOCALHOST}/sponsor/admin/addLogo`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${ userToken }`
                },
                body: JSON.stringify({
                    name: logoName,
                    imgURL: imgURL
                }),
            }).then(async (response) => {
                if (!response.ok) {
                    console.log("Unable to add logo to sponsor:", response.status);
                    setStatus("Unable to add logo to sponsor.");
                } else {
                    console.log(`Sponsor ${logoName} now has logo at URL: ${imgURL}`);
                    setStatus(`Sponsor ${logoName} now has logo.`);
                };
            });
        } catch (error) {
            console.error(`Adding sponsors logo failed: `, error);
            setStatus(`Error trying to add sponsor logo`);
        }
    };
    
    const handleDeleteSponsor = async (e) => {
        e.preventDefault();
        const userToken = localStorage.getItem("userToken");
        setStatus("Loading...");
    
        try {
            await fetch(`${LOCALHOST}/sponsor/admin/deleteSponsor`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${ userToken }`
                },
                body: JSON.stringify({
                    name: deleteName
                }),
            }).then(async (response) => {
                if (!response.ok) {
                    console.log(`Unable to delete sponsor ${deleteName}: `, response.status);
                    setStatus(`Unable to delete sponsor ${deleteName}`);
                } else {
                    console.log(`Sponsor ${deleteName} deleted.`);
                    setStatus(`Sponsor ${deleteName} deleted.`);
                };
            });
        } catch (error) {
            console.error(`Deleting sponsors failed: `, error);
            setStatus(`Error trying to delete sponsor ${deleteName}`);
        }
    };
    
    return (
        <div className='content-container'>
            <BackButton />
            {status}
            <div>
                <h1>Add A Sponsor</h1>
                <form onSubmit={handleAddSponsor} style={PageStyle.formStyle}>
                    <label style={ PageStyle.userInput }>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                    <label style={ PageStyle.userInput }>
                        <input
                            type="text"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </label>
                    <div style={PageStyle.buttonWrapper}>
                        <button type="submit" style={PageStyle.buttonStyle}>
                            Add Sponsor
                        </button>
                    </div>
                </form>

                <h1>Add A Logo to a Sponsor</h1>
                <form onSubmit={handleAddLogo} style={PageStyle.formStyle}>
                    <label style={ PageStyle.userInput }>
                        <input
                            type="text"
                            placeholder="Name"
                            value={logoName}
                            onChange={(e) => setLogoName(e.target.value)}
                        />
                    </label>
                    <label style={ PageStyle.userInput }>
                        <input
                            type="text"
                            placeholder="e.g. /imageName.png"
                            value={imgURL}
                            onChange={(e) => setImgURL(e.target.value)}
                        />
                    </label>
                    <div style={PageStyle.buttonWrapper}>
                        <button type="submit" style={PageStyle.buttonStyle}>
                            Add Logo
                        </button>
                    </div>
                </form>

                <h1>Remove A Sponsor</h1>
                <form onSubmit={handleDeleteSponsor} style={PageStyle.formStyle}>
                    <label style={ PageStyle.userInput }>
                        <input
                            type="text"
                            placeholder="Name"
                            value={deleteName}
                            onChange={(e) => setDeleteName(e.target.value)}
                        />
                    </label>
                    <div style={PageStyle.buttonWrapper}>
                        <button type="submit" style={PageStyle.buttonStyle}>
                            Delete Sponsor
                        </button>
                    </div>
                </form>
            </div>
            <NavBar />
        </div>
    )
}

export default SponsorPage;

const PageStyle = {
    formStyle: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "fit-content",
        width: "100%",
    },
    buttonWrapper: {
        display: "flex",
        flexDirection: "row-reverse",
        alignContent: "flex-end",
    },
    buttonStyle: {
        backgroundColor: "red",
        color: "white",
        margin: "8px 8px",
        border: "none",
        width: "100%",
        borderRadius: "16px",
    },
    userInput: {
        width: "80%",
        display: "flex",
        justifyContent: "center"
    },
    amountInput: {
        width: "80%",
        display: "flex",
        justifyContent: "center",
        height: "70%"
    },
    clearContainer: {
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
    },
    clearButton: {
        width: "60%",
        backgroundColor: "red",
        color: "white",
        margin: "8px 8px",
        border: "none",
        borderRadius: "16px",
    }
}