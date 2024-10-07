import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/SidebarStyle.css";
import Modal from './Modal';
import Store from './Store';
import Friends from './Friends';
import Inventory from './Inventory';
import Forge from './Forge';
import api from "../api";

const fetchUserResources = async () => {
    try {
        const response = await api.get("user_resources/" , {});
        console.log("User Resources Data:", response.data); // for debugging
        return response.data;
    } catch (error) {
        console.error("Error fetching user resources:", error);
        throw error;
    }
};

const fetchResourceNames = async (resourceIds) => {
    try {
        const response = await api.get("get_resources_by_id/", {
            params: { resource_ids: resourceIds },
        });
        console.log("Resource Names Data:", response.data); // for debugging
        return response.data;
    } catch (error) {
        console.error("Error fetching resource names:", error);
        throw error;
    }
};

function Sidebar({ onSelectItem }) {
    const [isStoreWindowOpen, setIsStoreWindowOpen] = useState(false);
    const [isInventoryWindowOpen, setIsInventoryWindowOpen] = useState(false);
    const [isFriendsWindowOpen, setIsFriendsWindowOpen] = useState(false);
    const [isForgeWindowOpen, setIsForgeWindowOpen] = useState(false);
    const [resources, setResources] = useState([]);

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

    useEffect(() => {
        const getResources = async () => {
            try {
                const resources = await fetchUserResources();
                setResources(resources); // Set the state with fetched data

                const resourceIds = resources.map(resource => resource.resource_id);
                const resourceNames = await fetchResourceNames(resourceIds);
                console.log("Resources:", resourceIds); // for debugging
                
            } catch (error) {
                console.error("Failed to fetch resources:", error);
            }
        };
        getResources();
    }, []);

    return (
        <div className="sidebar">
            <div className="sidebar-resources">
                <ul>

                </ul>
            </div>
            <div className="button-container">
                <ul className="button-list">
                    <li><img className="svg-button" src="/images/Buttons/InventoryButton.svg" onClick={openInventoryWindow} alt="Open Inventory" /></li>
                    <li><img className="svg-button" src="/images/Buttons/ForgeButton.svg" onClick={openForgeWindow} alt="Open Forge" /></li>
                    <li><img className="svg-button" src="/images/Buttons/StoreButton.svg" onClick={openStore} alt="Open Store" /></li>
                    <li><img className="svg-button" src="/images/Buttons/FriendsButton.svg" onClick={openFriendsWindow} alt="Open Friends" /></li>
                    <li><img className="svg-button" src="/images/Buttons/LogoutButton.svg" onClick={() => navigate("/logout")} alt="Logout" /></li>
                </ul>
            </div>
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
                    <Inventory onClose={() => setIsInventoryWindowOpen(false)} onSelectItem={onSelectItem} />
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