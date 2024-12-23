import React, { useState, useEffect } from 'react';
import api from "../api";
import "../styles/UpgradeStyle.css";

const updateSpaceObject = async (
    baseSpaceObject_id,
    upgradedSpaceObject_id, 
    upgrade_id, 
    x, 
    y, 
    get_space_object_from_grid, 
    setGridCells, 
    setSpaceObjectMenuData,
    setResources,
    fetchUserResources) => {
    try {
        const response = await api.post("update_space_object/", {
            baseSpaceObject_id: baseSpaceObject_id,
            upgradedSpaceObject_id: upgradedSpaceObject_id,
            upgrade_id: upgrade_id,
            x: x,
            y: y
        });
        let spaceObject = await get_space_object_from_grid(x, y);
        setGridCells(prevCells => prevCells.map(cell =>
            cell.row == x && cell.col == y ? {...cell, spaceObject: spaceObject} : cell
        ))
        setSpaceObjectMenuData(spaceObject)
        let updatedresources = await fetchUserResources();
        console.log(updatedresources)
        setResources(updatedresources);
        return response.data;
    } catch (error) {
        console.error("Error updating space object:", error);
        throw error;
    }
}

function SpaceObjectMenu({spaceObjectMenuData, setSpaceObjectMenuData, x, y, setGridCells, get_space_object_from_grid, gridCells, setResources, fetchUserResources}) {
    const [spaceObjectUpgrades, setSpaceObjectUpgrades] = useState([]);
    const [upgradeCosts, setUpgradeCosts] = useState({});
    const [upgradeHoverData, setUpgradeHoverData] = useState("");

    useEffect(() => {
        const fetchSpaceObjectUpgrades = async (spaceObjectMenuData) => {
            try {
                const response = await api.get("get_space_object_upgrades/", {
                    params: {baseSpaceObject_id: spaceObjectMenuData.id}
                });
                setSpaceObjectUpgrades(response.data)
                console.log(response.data)
            } catch (error) {
                console.log(error)
                throw error
            }
        }
        fetchSpaceObjectUpgrades(spaceObjectMenuData)
    }, [gridCells]);

    useEffect(() => {
        const fetchUpgradeCost = async (upgrade_id) => {
            console.log(spaceObjectUpgrades)
            if (spaceObjectUpgrades.length == 0) return;
            try {
                const response = await api.get(`upgrade_cost/${upgrade_id}/`);
                setUpgradeCosts(prevCosts => ({...prevCosts, [upgrade_id]: response.data}))
            } catch (error) {
                console.log(error)
                throw error
            }
        }
        for (let upgrade of spaceObjectUpgrades) {
            fetchUpgradeCost(upgrade.id)
        }
    }, [spaceObjectUpgrades]);

    const displayCostInformation = (upgrade_id) => {
        let costData = upgradeCosts[upgrade_id]
        setUpgradeHoverData(`${costData.resource_name}: ${costData.quantity}`)
    }

    return (
        <div className='main-container'>
            <div className='upgrade-container'>
                <img src={spaceObjectMenuData.image_path} alt={spaceObjectMenuData.name}></img>
                <p>{spaceObjectMenuData.description}</p>
                <ul>
                    {spaceObjectUpgrades.map((upgrade, index) => (
                        <li key={index}>
                            <p onClick={() => updateSpaceObject(
                                upgrade.baseSpaceObject_id,
                                upgrade.upgradedSpaceObject_id,
                                upgrade.id,
                                x,
                                y, 
                                get_space_object_from_grid, 
                                setGridCells, 
                                setSpaceObjectMenuData,
                                setResources,
                                fetchUserResources
                                )}
                                onMouseEnter={() => displayCostInformation(upgrade.id)}>{upgrade.upgradeDescription}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
            <p>{upgradeHoverData}</p>
        </div>
    );
}

export default SpaceObjectMenu;