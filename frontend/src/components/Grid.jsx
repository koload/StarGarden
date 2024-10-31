import React, { useState, useEffect } from 'react';
import "../styles/GridStyle.css";
import api from "../api";
import Modal from './Modal';
import SpaceObjectMenu from './SpaceObjectMenu';

function Grid({ rows, columns, selectedItem, onSelectItem }) {
    const [gridCells, setGridCells] = useState([]);
    const [userData, setUserData] = useState(null);
    const [isSpaceObjectMenuOpen, setIsSpaceObjectMenuOpen] = useState(false);
    const [spaceObjectMenuData, setSpaceObjectMenuData] = useState(null);

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
        const fetchGridSpaceObjects = async () => {
            const cells = [];
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    try {
                        const spaceObject = await get_space_object_from_grid(i, j);
                        cells.push({
                            key: `${i}-${j}`,
                            row: i,
                            col: j,
                            spaceObject: spaceObject,
                        });
                    } catch (error) {
                        console.error("Error fetching space object:", error);
                        cells.push({
                            key: `${i}-${j}`,
                            row: i,
                            col: j,
                            spaceObject: null,
                        });
                    }
                }
            }
            setGridCells(cells);
        };

        fetchGridSpaceObjects();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await api.get("current_user/");
            return response.data;
        } catch (error) {
            console.error("Error fetching the current user:", error);
            throw error;
        }
    };

    const place_space_object = async (user_id, spaceObject_id, x, y) => {
        try {
            console.log("Sending request to place space object:", { user_id, spaceObject_id, x, y });
            const response = await api.post("place_space_object/", {
                user_id: user_id,
                spaceObject_id: spaceObject_id,
                x: x,
                y: y
            });
            console.log("Space object placed:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error placing space object:", error);
            throw error;
        }
    };

    const remove_space_object_from_inventory = async (user_id, spaceObject_id) => {
        try {
            console.log("Sending request to remove space object from inventory:", { user_id, spaceObject_id });
            const response = await api.delete("remove_space_object_from_inventory/", {
                data: {
                    user_id: user_id,
                    spaceObject_id: spaceObject_id
                }
            });
            console.log("Space object deleted from inventory:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error removing space object from inventory:", error);
            throw error;
        }
    };

    const remove_space_object_from_grid = async (x, y, spaceObject_id) => {
        try {
            console.log("Sending request to remove space object from grid:", { x, y, spaceObject_id });
            const response = await api.delete("remove_space_object_from_grid/", {
                data: {
                    x: x,
                    y: y,
                    spaceObject_id: spaceObject_id
                }
            });
            console.log("Space object removed from grid:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error removing space object from grid:", error);
            throw error;
        }
    };

    const get_space_object_from_grid = async (x, y) => {
        try {
            console.log("Sending request to get space object id:", { x, y });
            const response = await api.get("get_space_object_from_grid/", {
                params: {
                    x: x,
                    y: y
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching space object ID:", error);
            throw error;
        }
    };

    useEffect(() => {
        if (spaceObjectMenuData) {
            console.log(spaceObjectMenuData)
            setIsSpaceObjectMenuOpen(true);
        }
    }, [spaceObjectMenuData]);

    const handleCellClick = async (row, col) => {
        console.log(`Cell clicked: Row ${row}, Column ${col}`);
        // open spaceObject menu
        if (selectedItem === null) {
            let spaceObject = await get_space_object_from_grid(row, col);
            if (spaceObject.id) { 
                console.log(spaceObject)
                setSpaceObjectMenuData(spaceObject);
            }
        }
        else if (selectedItem && userData) {
            console.log(`Selected Item: ${selectedItem.spaceObject.id}`);
            await place_space_object(userData.id, selectedItem.spaceObject.id, row, col);
            remove_space_object_from_inventory(userData.id, selectedItem.spaceObject.id);
            setGridCells(prevCells =>
                prevCells.map(cell =>
                    cell.row == row && cell.col == col
                    ? { ...cell, spaceObject: selectedItem.spaceObject }
                    : cell
                )
            )
            onSelectItem(null);
        }

    };

    const handleCellLeftClick = async (event, row, col) => {
        event.preventDefault();
        console.log(`Cell double clicked: Row ${row}, Column ${col}`);
        if (!selectedItem && userData) {
            let spaceObject = await get_space_object_from_grid(row, col);
            if (spaceObject) {
                console.log(`Space object ID: ${spaceObject.id}`);
                await remove_space_object_from_grid(row, col, spaceObject.id);
                // Update the grid cell to reflect the removal
                setGridCells(prevCells =>
                    prevCells.map(cell =>
                        cell.row === row && cell.col === col
                            ? { ...cell, spaceObject: null }
                            : cell
                    )
                );
            } else {
                console.log(`No space object found at Row ${row}, Column ${col}`);
            }
        }
    };

    const grid_colums_rows_style = {
        gridTemplateColumns: `repeat(${columns}, minmax(50px, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(50px, 1fr))`
    };

    return (
        <div className="grid-overlay">
            <div className="grid-container" style={grid_colums_rows_style}>
                {gridCells.map(cell => (
                    <div
                        key={cell.key}
                        className="grid-cell"
                        onClick={() => handleCellClick(cell.row, cell.col)}
                        onContextMenu={(event) => handleCellLeftClick(event, cell.row, cell.col)}
                    >
                        {cell.spaceObject && (
                            <img
                                src={cell.spaceObject.image_path}
                                alt={cell.spaceObject.name}
                                className="grid-image"
                            />
                        )}
                    </div>
                ))}
            </div>
            {isSpaceObjectMenuOpen && (
                <Modal onClose={() => setIsSpaceObjectMenuOpen(false)}> 
                    <SpaceObjectMenu spaceObjectMenuData={spaceObjectMenuData}/>
                </Modal>
            )}
        </div>
    );
}

export default Grid;