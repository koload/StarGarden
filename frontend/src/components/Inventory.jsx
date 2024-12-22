import React, { useState, useEffect } from 'react';
import api from "../api";
import "../styles/InventoryStyle.css";


function Inventory( { onClose, onSelectItem } ) {
    const [userData, setUserData] = useState(null);
    const [userSpaceObjects, setUserSpaceObjects] = useState(null);
    const [spaceObjects, setSpaceObjects] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    

    const fetchCurrentUser = async () => {
        try {
            const response = await api.get("current_user/");
            console.log("Current User Data:", response.data); // for debugging
            return response.data;
        } catch (error) {
            console.error("Error fetching the current user:", error);
            throw error;
        }
    };

    const fetchUserSpaceObjects = async () => {
        try {
            const response = await api.get("user_space_objects/");
            console.log("User Space Objects Data:", response.data); // for debugging
            return response.data;
        } catch (error) {
            console.error("Error fetching user space objects:", error);
            throw error;
        }
    };

    const fetchSpaceObjects = async () => {
        try {
            const response = await api.get("space_objects/");
            console.log("Space Objects Data:", response.data); // for debugging
            return response.data;
        } catch (error) {
            console.error("Error fetching space objects:", error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user_data = await fetchCurrentUser();
                setUserData(user_data);
            } catch (error) {
                console.error("Error fetching the current user:", error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (userData) {
            const fetchData = async () => {
                try {
                    const user_space_object_data = await fetchUserSpaceObjects(userData.id);
                    setUserSpaceObjects(user_space_object_data);
                    const space_object_data = await fetchSpaceObjects();
                    setSpaceObjects(space_object_data);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };

            fetchData();
        }
    }, [userData]);

    const getSpaceObjectById = (id) => {
        return spaceObjects ? spaceObjects.find(obj => obj.id === id) : null;
    };

    const groupUserSpaceObjectsBySpaceObject = () => {
        if (!userSpaceObjects || !spaceObjects) return [];

        const groupedData = new Map();

        userSpaceObjects.forEach(item => {
            const spaceObject = getSpaceObjectById(item.spaceObject_id);
            if (spaceObject) {
                if (!groupedData.has(spaceObject.id)) {
                    groupedData.set(spaceObject.id, {
                        spaceObject,
                        quantity: 0
                    });
                }
                groupedData.get(spaceObject.id).quantity += parseFloat(item.quantity);
            }
        });

        const result = Array.from(groupedData.values());
        console.log("Grouped Data:", result); // for debugging
        return result;
    };

    const groupedData = groupUserSpaceObjectsBySpaceObject();

    const selectInventoryItem = (item) => {
        setSelectedItem(item);
        onSelectItem(item);
        onClose();
        console.log("Selected Item:", item); // for debugging
    };

    return (
        <div className="inventory-container">
            {userSpaceObjects && spaceObjects ? (
                <ul>
                    {groupedData.map((group, index) => (
                        <li key={index} onClick={() => selectInventoryItem(group)} className="inventory-list">
                            <div className="inventory-list-item-top">
                                <img className="svg" src={group.spaceObject.image_path} alt={group.spaceObject.name}/>
                                <p className='space-object-name'>{group.spaceObject.name}</p>
                                <p>{group.spaceObject.description}</p>
                            </div>
                            <div className="inventory-list-item-bottom">
                            <p>Quantity: {group.quantity}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Inventory;