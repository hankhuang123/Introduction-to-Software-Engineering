import React from 'react';
import { useHistory } from 'react-router-dom'
import {ReactComponent as BackImage} from '../../res/image/arrow.svg'

const BackButton = () => {
    let history = useHistory();

    return (
        <div style={BackButtonStyle.bar}>
            <button onClick={history.goBack} style={BackButtonStyle.buttonStyle}>
                <BackImage style={BackButtonStyle.buttonImage}/>
            </button>
        </div>
    );
};

export default BackButton;

const BackButtonStyle = {
    bar: {
        display: "flex",
        flexDirection: "row",
        alignContent: "flex-start",
        backgroundColor: "white",
        paddingTop: "4%"
    },
    buttonStyle: {
        fontSize: "20px",
        maxWidth: "20px",
        maxHeight: "20px",
        color: 'black',
        backgroundColor: "white",
        paddingBottom: "5%"
    },
    buttonImage: { 
        maxWidth: "20px",
        maxHeight: "20px",
        backgroundColor: "white",
        margin: "0px",
        padding: "0px",
        borderWidth: "0px",
    }
}