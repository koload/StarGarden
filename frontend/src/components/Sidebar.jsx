import React, { useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/SidebarStyle.css";
import Modal from './Modal';
import Store from './Store';
import Friends from './Friends';
import Inventory from './Inventory';
import Forge from './Forge';

function Sidebar() {
    const [isStoreWindowOpen, setIsStoreWindowOpen] = useState(false);
    const [isInventoryWindowOpen, setIsInventoryWindowOpen] = useState(false);
    const [isFriendsWindowOpen, setIsFriendsWindowOpen] = useState(false);
    const [isForgeWindowOpen, setIsForgeWindowOpen] = useState(false);

    const navigate = useNavigate();

    const closeAllWindows = useCallback(() => {
        setIsStoreWindowOpen(false);
        setIsInventoryWindowOpen(false);
        setIsFriendsWindowOpen(false);
        setIsForgeWindowOpen(false);
    }, []);

    const openStore = useCallback(() => {
        closeAllWindows();
        setIsStoreWindowOpen(true);
    }, [closeAllWindows]);

    const openFriendsWindow = useCallback(() => {
        closeAllWindows();
        setIsFriendsWindowOpen(true);
    }, [closeAllWindows]);

    const openInventoryWindow = useCallback(() => {
        closeAllWindows();
        setIsInventoryWindowOpen(true);
    }, [closeAllWindows]);

    const openForgeWindow = useCallback(() => {
        closeAllWindows();
        setIsForgeWindowOpen(true);
    }, [closeAllWindows]);

    return (
        <div className="sidebar">
            <ul className="button-list">
                <li><img className="svg-button" src="/images/Buttons/InventoryButton.svg" onClick={openInventoryWindow} alt="Open Inventory" /></li>
                <li><img className="svg-button" src="/images/Buttons/ForgeButton.svg" onClick={openForgeWindow} alt="Open Forge" /></li>
                <li><img className="svg-button" src="/images/Buttons/StoreButton.svg" onClick={openStore} alt="Open Store" /></li>
                <li><img className="svg-button" src="/images/Buttons/FriendsButton.svg" onClick={openFriendsWindow} alt="Open Friends" /></li>
                <li><img className="svg-button" src="/images/Buttons/LogoutButton.svg" onClick={() => navigate("/logout")} alt="Logout" /></li>
            </ul>
            {isStoreWindowOpen && (
                <Modal onClose={() => setIsStoreWindowOpen(false)}>
                    <Store />
                </Modal>
            )}
            {isFriendsWindowOpen && (
                <Modal onClose={() => setIsFriendsWindowOpen(false)}>
                    <Friends />
                </Modal>
            )}
            {isInventoryWindowOpen && (
                <Modal onClose={() => setIsInventoryWindowOpen(false)}>
                    <Inventory />
                </Modal>
            )}
            {isForgeWindowOpen && (
                <Modal onClose={() => setIsForgeWindowOpen(false)}>
                    <Forge />
                </Modal>
            )}
        </div>
    );
}

export default React.memo(Sidebar);