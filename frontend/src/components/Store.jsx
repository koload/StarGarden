import React, { useState, useEffect } from 'react';
import api from '../api';
import "../styles/StoreStyle.css";

function Store({setResources}) {
    const [storeData, setStoreData] = useState(null);
    const [spaceObjectData, setSpaceObjectData] = useState(null);
    const [storeInfo, setStoreInfo] = useState("");

    const fetchSpaceObjectPrices = async () => {
        try {
            const response = await api.get("space_object_prices/");
            const storeData = response.data;
            setStoreData(storeData);
            console.log("Store data loaded:", storeData);
            return storeData;
        } catch (error) {
            console.error("Error loading the store:", error);
            throw error;
        }
    };

    const fetchSpaceObjects = async () => {
        try {
            const response = await api.get("space_objects/");
            const spaceObjectData = response.data;
            setSpaceObjectData(spaceObjectData);
            return spaceObjectData;
        } catch (error) {
            console.error("Error loading the store:", error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchSpaceObjectPrices();
                await fetchSpaceObjects();
            } catch (error) {
                console.error("Error loading the store:", error);
            }
        };

        fetchData();
    }, []);

    const getSpaceObjectById = (id) => {
        return spaceObjectData ? spaceObjectData.find(obj => obj.id === id) : null;
    };

    const groupStoreDataBySpaceObject = () => {
        if (!storeData || !spaceObjectData) return [];

        const groupedData = new Map();

        storeData.forEach(item => {
            const spaceObject = getSpaceObjectById(item.spaceObject_id);
            if (spaceObject) {
                if (!groupedData.has(spaceObject.id)) {
                    groupedData.set(spaceObject.id, {
                        spaceObject,
                        items: []
                    });
                }
                groupedData.get(spaceObject.id).items.push(item);
            }
        });
        return Array.from(groupedData.values());
    };

    const groupedData = groupStoreDataBySpaceObject();

    const handleClick = async (spaceObject_id, resources) => {
        console.log("Double clicked on space object:", spaceObject_id);
        try {
            console.log("Sending request to buy space object:", { spaceObject_id, resources });
            const response = await api.post("buy_space_object/", {
                spaceObject_id: spaceObject_id,
                resources: resources
            });

            const updated_resources = await api.get("user_resources/");
            setResources(updated_resources.data)
            setStoreInfo("Added " + getSpaceObjectById(spaceObject_id).name + " to inventory!");
            console.log("User resources updated:", updated_resources.data);
            console.log("Space object bought:", response.data);
        } catch (error) {
            setStoreInfo("Not enough resources!");
            console.error("Error buying space object:", error);
        }
    }
    
    return (
        <div className="main-container">
            <div className='store-container'>
                {groupedData.length > 0 ? (
                    <ul>
                        {groupedData.map((group, index) => (
                            <li key={index} className="store-list" onClick={() => handleClick(group.spaceObject.id, group.items.map(item => ({ type: item.resource_id, quantity: item.quantity })))}>
                                <img className='svg' src={group.spaceObject.image_path} alt={group.spaceObject.name}/>
                                <p>{group.spaceObject.name}</p>
                                <ul className='item-price'>
                                    {group.items.map((item, idx) => (
                                        <li key={idx} className='price-record'>
                                            {item.resource_name}: {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Loading...</p>
                )}
                <p className="store-footer">{storeInfo}</p>
            </div>
        </div>
    );
}

export default Store;