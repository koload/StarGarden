import React, { useState, useEffect } from 'react';
import api from "../api";
import "../styles/InventoryStyle.css";

const fetchSpaceObjectUpgrades = async () => {
    try {
        const response = await api.get()
    } catch (error) {
        console.log(error)
        throw error
    }
}

function SpaceObjectMenu({spaceObjectMenuData}) {
    console.log(spaceObjectMenuData)
    return (
        <div>
            <img src={spaceObjectMenuData.image_path}></img>
            <p>{spaceObjectMenuData.description}</p>
        </div>
    );
}

export default SpaceObjectMenu;