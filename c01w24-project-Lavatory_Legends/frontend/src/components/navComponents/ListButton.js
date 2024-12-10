const ListButton = (props) => {
    return (
        <div key={props.name}>
            <button 
                style={ ListButtonStyle.buttonStyle }
                onClick={props.handleClick}
            >
                {props.name}
            </button>
        </div>
    );
}

export default ListButton;

const ListButtonStyle = {
    buttonStyle : {
        backgroundColor: "transparent",
        textAlign: "left"
    }
};
