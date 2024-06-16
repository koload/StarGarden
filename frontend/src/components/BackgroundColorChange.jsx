import { useState, useEffect } from "react";

function BackgroundColorChange({ color_to_set }) {
    const [color, setColor] = useState(color_to_set)

    useEffect(() => {
        setColor(color_to_set);
    }, [color_to_set]);
    
    useEffect(() => {
        document.body.style.backgroundColor = color;
    }, [color]);

    return null;
}

export default BackgroundColorChange;