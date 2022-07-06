import React from 'react';
import { NavLink } from 'react-router-dom'
import image from '../assets/img/icon-left-font-monochrome-white.svg'

const footer = () => {
    return (
        <div className="footer_container">
            <div className="logo_footer">
                <img src={image} alt="" />
            </div>
            <ul className='ul_footer'>
                <NavLink to="/Home" className="navlink">
                    <li>Accueil</li>
                </NavLink>
                <NavLink to="/Portal" className="navlink">
                    <li>Portail</li>
                </NavLink>
                <NavLink to="/Portal" className="navlink">
                    <li>Deconnexion</li>
                </NavLink>
            </ul>
        </div>
    );
};

export default footer;