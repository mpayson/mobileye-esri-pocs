import React from 'react';
import MobileyeLogo from '../resources/Basic_Web_White_Logo.png';
import {Link} from "react-router-dom";

export function Logo() {
    const style = {
        height: "40px", 
        margin: "12px"
    };
    return (
        <Link to="/" className="item">
            <img
                src={MobileyeLogo}
                alt="Mobileye Logo"
                style={style}
            />
        </Link>
    );
}