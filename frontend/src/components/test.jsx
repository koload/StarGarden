import React, { useState, useEffect } from 'react';
import api from '../api';

function Store() {
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
            const response = await api.get("space_object/");
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

    return (
        <div>
            <div>
                {storeData ? (
                    <ul>
                        {storeData.map((item, index) => {
                            const spaceObject = getSpaceObjectById(item.spaceObject_id);
                            return (
                                <li key={index}>
                                    Resource ID: {item.resource_id}, Quantity: {item.quantity}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}

export default Store;