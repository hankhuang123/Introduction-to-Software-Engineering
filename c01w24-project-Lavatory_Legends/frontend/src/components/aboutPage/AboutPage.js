import React from 'react';
import { Platform, Linking } from 'react-native';
import { useHistory } from 'react-router-dom';
import NavBar from '../navComponents/NavBar';
import BackButton from '../navComponents/BackButton';
import briefCaseImg from "../../res/image/Briefcase.svg";
import targetImg from "../../res/image/target.svg";
import moneyImg from "../../res/image/money-bag.svg";
import Sponsors from '../sponsors/Sponsors';

const AboutPage = () => {
    let history = useHistory();
    const footnotes = "Crohn's and Colitis Canada's GoHere program helps create understanding, supportive, and accessible communities by improving washroom access.";

    return (
        <div className='content-container'>
            <div style={PageStyle.formStyle}>
                <BackButton />
                <div>
                    <div className='home-header'>About GoHere</div>
                    <div className='home-footnotes'>{footnotes}</div>
                </div>
                <div>
                    <div style={PageStyle.subHeaders}>
                        <img src={briefCaseImg} style={PageStyle.imgStyle} alt='briefcase'/>
                            <h2>Our Partners</h2>
                    </div>
                    <Sponsors />
                </div>
                <div>
                    <div style={PageStyle.subHeaders}>
                        <img src={targetImg} style={PageStyle.imgStyle} alt='briefcase'/>
                        <h2>Rate Us</h2>
                        
                    </div>
                    <button style={PageStyle.button} onClick={openStore}>
                            Go to Google play/Apple app store page
                        </button>
                </div>
                <div>
                    <div style={PageStyle.subHeaders}>
                        <img src={moneyImg} style={PageStyle.imgStyle} alt='briefcase'/>
                        <h2>Help Us!</h2>
                    </div>
                    <button onClick={()=> history.push("/donate")} style={PageStyle.button}>
                        Donation
                    </button>
                </div>
                <NavBar />
            </div>
        </div>
    );
};
const GOOGLE_PACKAGE_NAME = "com.facebook.katana";
const APPLE_STORE_ID = "id284882215"
const openStore = () => {
    if(Platform.OS !== 'ios'){
        Linking.openURL(`https://play.google.com/store/apps/details?id=${GOOGLE_PACKAGE_NAME}`).catch(err =>
            alert('Please check for the Google Play Store')
        );
    } else {
        Linking.openURL(
            `https://itunes.apple.com/in/app/apple-store/${APPLE_STORE_ID}`
          ).catch(err => alert('Please check for the App Store'));
    }
}
export default AboutPage;

const PageStyle = {
    formStyle: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        width: "100%",
        height: "100%",
    },
    buttonsContainer: {
        display: "flex",
        flexDirection: "column"
    },
    subHeaders: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    imgStyle: {
        height: "5%",
        width: "5%",
        padding: "5%"
    },
    button: {
        width: "60%",
        backgroundColor: "red",
        color: "white",
        margin: "8px 8px",
        border: "none",
        borderRadius: "16px",
    },
    rateButton:{
        width: "20%",
        backgroundColor: "red",
        color: "white",
        margin: "8px 8px",
        border: "none",
        borderRadius: "16px",
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
        width: "25%",
    },
    partnerBronzeBox: {
        width: "10%",
    }
}