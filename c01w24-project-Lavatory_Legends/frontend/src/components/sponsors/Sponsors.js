import React, { useEffect, useState } from 'react';
import { LOCALHOST } from "../../Constants";

/* The minimum amount of dollars to reach a sponsor tier. */
const TIERS = {
    gold: 50000.00,
    silver: 25000.00,
    bronze: 1000.00
};

const Sponsors = () => {
    const [loadedSponsors, setLoadedSponsors] = useState(false);
    const [sponsors, setSponsors] = useState(
        {
            gold: [],
            silver: [],
            bronze: []
        }
    );

    const handleGetSponsors = async () => {
        let sponsorList = 
        {
            gold: [],
            silver: [],
            bronze: []
        };

        try {
            await fetch(`${LOCALHOST}/sponsor/getSponsors`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(async (response) => {
                if (!response.ok) {
                    console.log("Unable to get sponsors:", response.status);
                } else {
                    await response.json().then((data) => {
                        data.forEach(result => {
                            for (let [tier, tierAmount] of Object.entries(TIERS)) {
                                if (result.amount >= tierAmount) {
                                    sponsorList[tier].push(result);
                                    break;
                                }
                            }
                        });
                    });
                    setSponsors(sponsorList);
                    setLoadedSponsors(true);
                };
            });
        } catch (error) {
            console.error(`Getting sponsors failed: `, error);
        }
    }; 

    useEffect(() => {
        handleGetSponsors();
    }, []);

    return (
        <>
        { loadedSponsors ? 
            <div style={PageStyle.allPartners}>
            <div style={PageStyle.partnersGrid}>
                {sponsors.gold.map((partner) => (
                    <div style={PageStyle.partnerBox} key={partner.name}>
                        <h3>{partner.name}</h3>
                        {partner.imgURL ? 
                        <img src={partner.imgURL} alt='partnerImg' />
                        : null}
                    </div>
                ))}
            </div>
            <br style={PageStyle.break}/>
            <div style={PageStyle.partnersGrid}>
                {sponsors.silver.map((partner) => (
                    <div style={PageStyle.partnerSilverBox} key={partner.name}>
                        <h4 style={PageStyle.textStyle}>{partner.name}</h4>
                    </div>
                ))}
            </div>
            <br style={PageStyle.break}/>
            <div style={PageStyle.partnersGrid}>
                {sponsors.bronze.map((partner) => (
                    <div style={PageStyle.partnerBronzeBox} key={partner.name}>
                        <h5 style={PageStyle.textStyle}>{partner.name}</h5>
                    </div>
                ))}
            </div>
            </div>
        : null }
        </>
    );
};

export default Sponsors;

const PageStyle = {
    allPartners: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    },
    partnersGrid: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        alignItems: "center"
    },
    partnerBox: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        width: "30%",
    },
    partnerSilverBox: {
        width: "fit-content",
    },
    partnerBronzeBox: {
        width: "fit-content",
    },
    textStyle: {
        whiteSpace: "nowrap",
        marginBottom: "5%",
        marginTop: "2%"
    },
    break: {
        margin: "10px"
    }
}
