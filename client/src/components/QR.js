import React from "react";

//beste als address een global var wordt. Zag dat je context gebruikte, maar geen zin om te implementeren
const QRFromAddress = props => {
    console.log(`https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=${props.address}&choe=UTF-8`);
    return <img 
            src={`https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=${props.address}&choe=UTF-8`}
            />;
};

export default QRFromAddress;