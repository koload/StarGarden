import React, { useState, useEffect } from 'react';
import api from '../api';
import "../styles/StoreStyle.css";

function Store({setResources}) {
    const [storeData, setStoreData] = useState(null);
    const [spaceObjectData, setSpaceObjectData] = useState(null);

    const fetchSpaceObjectPrices = async () => {
        try {
            const response = await api.get("space_object_prices/");
            const storeData = response.data;
            setStoreData(storeData);
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

    const handleDoubleClick = async (spaceObject_id, resources) => {
        console.log("Double clicked on space object:", spaceObject_id);
        try {
            console.log("Sending request to buy space object:", { spaceObject_id, resources });
            const response = await api.post("buy_space_object/", {
                spaceObject_id: spaceObject_id,
                resources: resources
            });

            const updated_resources = await api.get("user_resources/");
            setResources(updated_resources.data)
            console.log("User resources updated:", updated_resources.data);

            console.log("Space object bought:", response.data);
        } catch (error) {
            console.error("Error buying space object:", error);
        }
    }

    return (
        <div>
            <div>
                {groupedData.length > 0 ? (
                    <ul>
                        {groupedData.map((group, index) => (
                            <li key={index}>
                                <img className='svg' src={group.spaceObject.image_path} alt={group.spaceObject.name} onDoubleClick={() => handleDoubleClick(group.spaceObject.id, group.items.map(item => ({ type: item.resource_id, quantity: item.quantity })))}/>
                                <p>{group.spaceObject.name}</p>
                                <ul>
                                    {group.items.map((item, idx) => (
                                        <li key={idx}>
                                            Resource ID: {item.resource_id}, Quantity: {item.quantity}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}

export default Store;