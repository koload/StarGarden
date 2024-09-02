import React from 'react';

function Grid({ rows, columns }) {   
        const gridCells = [];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                gridCells.push(<div key={`${i}-${j}`} className="grid-cell"></div>);
            }
        }
}

export default Grid;