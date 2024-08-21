// Sidebar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import "../styles/SidebarStyle.css";
import Modal from './Modal';
import Store from './Store';
import Friends from './Friends';
import OpenStoreButton from "../images/Buttons/StoreButton.svg";
import OpenFriendsWindowButton from "../images/Buttons/FriendsButton.svg";
import LogoutButton from "../images/Buttons/LogoutButton.svg";

function Sidebar() {
    const [isStoreOpen, setIsStoreOpen] = useState(false);
    const [isFriendsWindowOpen, setisFriendsWindowOpen] = useState(false);
    const navigate = useNavigate()

    const openStore = () => {
        if (isFriendsWindowOpen) {
            setisFriendsWindowOpen(false)
        };
        setIsStoreOpen(true);}
        
    const closeStore = () => setIsStoreOpen(false);

    const openFriendsWindow = () => {
        if (isStoreOpen) {
            setIsStoreOpen(false)
        };
        setisFriendsWindowOpen(true)}
    const closeFriendsWindow = () => setisFriendsWindowOpen(false);

    return (
        <div className="sidebar">
            <ul className="button-list">            
                <li><img className="svg-button" src={OpenStoreButton} onClick={openStore}></img></li>
                <li><img className="svg-button" src={OpenFriendsWindowButton} onClick={openFriendsWindow}></img></li>
                <li><img className="svg-button" src={LogoutButton} onClick={() => navigate("/logout")}></img></li>
            </ul>
            {isStoreOpen && (
                <Modal onClose={closeStore}>
                    <Store />
                </Modal>
            )}
            {isFriendsWindowOpen && (
                <Modal onClose={closeFriendsWindow}>
                    <Friends />
                </Modal>
            )}
        </div>
    );
}

export default Sidebar;