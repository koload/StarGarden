import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/SidebarStyle.css";
import Modal from './Modal';
import Store from './Store';
import Friends from './Friends';
import Inventory from './Inventory';
import Forge from './Forge';
import api from "../api";

const claimResources = async (userGridSpaceObjects) => {
    try {
        console.log("claiming resources:", userGridSpaceObjects)
        const responce = await api.post("claim_resources/", {
            userGridSpaceObjects: userGridSpaceObjects
        });
        console.log("Claimed resources:", responce.data); // for debugging
        return responce.data;
    } catch (error) {
        console.error("Error claiming resources:", error);
        throw error;
    }
};

const fetchUserSpaceObjectsFromGrid = async (setUserGridSpaceObjects) => {
    try {
        const response = await api.get("get_user_space_objects_from_grid/")
        setUserGridSpaceObjects(response.data);
        console.log("Fetched space objects from users grid:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching space objects from users grid")
        throw error;
    }
}

const fetchUserResources = async () => {
    try {
        const response = await api.get("user_resources/");
        console.log("User Resources Data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching user resources:", error);
        throw error;
    }
};

const fetchResourceNames = async (resourceIds) => {
    try {
        const response = await api.post("get_resources_by_id/", {
            resource_ids: resourceIds,
        });
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
    const [resourceNames, setResourceNames] = useState([]);
    const [userGridSpaceObjects, setUserGridSpaceObjects] = useState([]);

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
                setResources(resources);
                
                const resourceIds = resources.map(resource => resource.resource_id);
                const resourceNames = await fetchResourceNames(resourceIds);
                setResourceNames(resourceNames);
                console.log("Resources:", resourceIds); // for debugging
                
            } catch (error) {
                console.error("Failed to fetch resources:", error);
            }
        };
        getResources();
    }, []);

    useEffect(() => {
        const updateResourceNames = async () => {
            const resourceIds = resources.map(resource => resource.resource_id);
            const resourceNames = await fetchResourceNames(resourceIds);
            setResourceNames(resourceNames);
        };
        if (resources.length > 0) {
            updateResourceNames();
        }
    }, [resources]);

    const getResourceNameById = (resourceId) => {
        return resourceNames[resourceId] || "Unknown";    
    };

    useEffect( () => {
        if (userGridSpaceObjects.length > 0) {
            const callClaimResources = async () => {
                await claimResources(userGridSpaceObjects)
                const updatedResources = await fetchUserResources();
                setResources(updatedResources);
            }
            callClaimResources();
        }
    }, [userGridSpaceObjects]);

    return (
        <div className="sidebar">
            <div className="sidebar-resources">
                <ul>
                    {resources.map((resource, index) => (
                        <li>
                            <p>{getResourceNameById(resource.resource_id)}: {resource.quantity}</p>
                        </li>
                        ))}
                </ul>
            </div>
            <div className="button-container">
                <ul className="button-list">
                    <li><img className="svg-button" src="/images/Buttons/InventoryButton.svg" onClick={openInventoryWindow} alt="Open Inventory" /></li>
                    <li><img className="svg-button" src="/images/Buttons/ClaimButton.svg" onClick={async () => {await fetchUserSpaceObjectsFromGrid(setUserGridSpaceObjects)}} alt="Claim" /></li>
                    <li><img className="svg-button" src="/images/Buttons/ForgeButton.svg" onClick={openForgeWindow} alt="Open Forge" /></li>
                    <li><img className="svg-button" src="/images/Buttons/StoreButton.svg" onClick={openStore} alt="Open Store" /></li>
                    <li><img className="svg-button" src="/images/Buttons/FriendsButton.svg" onClick={openFriendsWindow} alt="Open Friends" /></li>
                    <li><img className="svg-button" src="/images/Buttons/LogoutButton.svg" onClick={() => navigate("/logout")} alt="Logout" /></li>
                </ul>
            </div>
            {isStoreWindowOpen && (
                <Modal onClose={() => setIsStoreWindowOpen(false)}>
                    <Store setResources={setResources} />
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
                    <Forge resources={resources} setResources={setResources}/>
                </Modal>
            )}
        </div>
    );
}

export default React.memo(Sidebar);