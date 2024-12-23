import React, { useState, useEffect } from 'react';
import api from '../api';
import "../styles/ForgeStyle.css";

const handleResourceTransformation = async (selectedResourceToGiveId, selectedResourceToGetId, inputInValue, inputOutValue, setResources) => {
    const response = await api.post("handle_resource_transformation/", { 
        inputResource_id: selectedResourceToGiveId,
        outputResource_id: selectedResourceToGetId,
        inputResource_quantity: inputInValue,
        outputResource_quantity: inputOutValue
    });
    console.log("Resource transformation response:", response.data);
    const updatedResources = await api.get("user_resources/");
    setResources(updatedResources.data);
}

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

function Forge({setResources, resources}) {
    const [userResources, setUserResources] = useState([]);
    const [selectedResourceToGiveName, setSelectedResourceToGiveName] = useState(null);
    const [selectedResourceToGiveId, setSelectedResourceToGiveId] = useState(null);
    const [inputInValue, setInputInValue] = useState('');
    const [inputOutValue, setInputOutValue] = useState('');

    // Using the resource transformation table will be better for further development
    const [resourceTransformation, setResourceTransformation] = useState([]);
    const [selectedResourceToGetName, setSelectedResourceToGetName] = useState(null);
    const [selectedResourceToGetId, setSelectedResourceToGetId] = useState(null);
    const [resourceTransfromationNames, setResourceTransformationNames] = useState([]);

    const resourceIds = [...new Set(resourceTransformation.map(resource => resource.inputResource_id))];
    const resourceNames = resourceIds.map(resourceId => resourceTransfromationNames[resourceId]);
    
    useEffect(() => {
        const fetchResourceTransformation = async () => {
            try {
                const response = await api.get("get_resource_transformation/");
                setResourceTransformation(response.data);
                
                // setting default resource to give
                setSelectedResourceToGiveName("Water");
                setSelectedResourceToGiveId(1);

            } catch (error) {
                console.log("Error fetching resource transformation data", error);
            }
        }
        fetchResourceTransformation();
    }, []);

    useEffect(() => {
        const updateResourceTransformation = async () => {
            const outputResourceIds = [...new Set(resourceTransformation.map(resource => resource.inputResource_id))];
            const resourceTransformationOutputNames = await fetchResourceNames(resourceIds);
            setResourceTransformationNames(resourceTransformationOutputNames)

            // setting prime matter as default
            setSelectedResourceToGetName(resourceTransformationOutputNames[4]);
            setSelectedResourceToGetId(4);

        };
        if (resourceTransformation.length > 0) {
            updateResourceTransformation();
        }
    }, [resourceTransformation]);

    const handleArrowClickTop = (direction) => {
        if (selectedResourceToGiveId == null) return;
        const currentIndex = resourceIds.indexOf(selectedResourceToGiveId);
        let newIndex;

        if (direction === 'next') {  
            newIndex = currentIndex + 1 >= resourceIds.length ? 0 : currentIndex + 1;
        }  else {
            newIndex = currentIndex - 1 < 0 ? resourceIds.length - 1 : currentIndex - 1;
        }

        setSelectedResourceToGiveId(resourceIds[newIndex]);
        setSelectedResourceToGiveName(resourceNames[[newIndex]]);
        setInputInValue('');
        setInputOutValue('');

        // handleInputChange({ target: { value: inputInValue } });
    };

    const handleArrowClickBottom = (direction) => {
        if (selectedResourceToGetId == null) return;
        const currentIndex = resourceIds.indexOf(selectedResourceToGetId);
        let newIndex;

        if (direction === 'next') {  
            console.log(resourceIds.length);
            newIndex = currentIndex + 1 >= resourceIds.length ? 0 : currentIndex + 1;

        } else {
            newIndex = currentIndex - 1 < 0 ? resourceIds.length - 1 : currentIndex - 1;
        }
        
        setSelectedResourceToGetId(resourceIds[newIndex]);
        setSelectedResourceToGetName(resourceNames[[newIndex]]);
        setInputInValue('');
        setInputOutValue('');

        // handleInputChange({ target: { value: inputInValue } });
    };

    const handleInputChange = async (e) => {
        let newInputValue = parseFloat(e.target.value);
        const resourceToDeductFrom = resources.find(resource => resource.resource_id === selectedResourceToGiveId);
    
        // If input is invalid or resource is not found, reset values and exit early
        if (isNaN(newInputValue) || !resourceToDeductFrom) {
            setInputInValue('');
            setInputOutValue('');
            return;
        }
    
        // Clamp newInputValue to resource quantity limit
        if (newInputValue > resourceToDeductFrom.quantity) {
            newInputValue = resourceToDeductFrom.quantity;
        }
    
        // Temporary variable for output, to only set on success
        let calculatedOutputValue = '';
    
        try {
            // Make API call to check transformation availability and get output
            const response = await api.get("get_output_transformation_resources/", {
                params: {
                    inputResource_quantity: newInputValue,
                    inputResource_id: selectedResourceToGiveId,
                    outputResource_id: selectedResourceToGetId
                }
            });
    
            // Update output based on the API response if successful
            calculatedOutputValue = response.data.output_resource_quantity || 0;
    
            // Set the input and output states only if transformation is available
            setInputInValue(newInputValue);
            setInputOutValue(calculatedOutputValue);
    
        } catch (error) {
            // Log error and reset values on failure
            console.log("Error fetching resource transformation data", error);
            setInputInValue('');
            setInputOutValue('');
        }
    };

    return (
        <div className="forge-container">
            <ul className="forge-list">
                <li>
                    <div className="column">
                        <img src={"/images/Buttons/arrow.svg"} onClick={() => handleArrowClickTop('prev')} className='arrow-left' alt="Arrow" />
                        <img src={"/images/Buttons/arrow.svg"} onClick={() => handleArrowClickBottom('prev')} className='arrow-left' alt="Arrow" />
                    </div>
                    <div className="text-column">
                        <p>
                            <span className="top-text">You give</span><br />
                            <span className="bottom-text">{selectedResourceToGiveName}</span><br />
                            <input value={inputInValue} onChange={handleInputChange} type='number' className='input-in' />
                        </p>
                        <p>
                            <span className="top-text">You get</span><br />
                            <span className="bottom-text">{selectedResourceToGetName}</span><br />
                            <input value={inputOutValue || ''} readOnly={true}  type='number' className='input-out' />
                        </p>
                    </div>
                    <div className="column-second">
                        <img src={"/images/Buttons/arrow.svg"} onClick={() => handleArrowClickTop('next')} className='arrow-right' alt="Arrow" />
                        <img src={"/images/Buttons/arrow.svg"} onClick={() => handleArrowClickBottom('next')} className='arrow-right' alt="Arrow" />
                    </div>
                </li>
            </ul>
            <img src={"/images/Buttons/TransformButton.svg"} onClick={() => handleResourceTransformation(selectedResourceToGiveId, selectedResourceToGetId, inputInValue, inputOutValue, setResources)} className="transform-button" alt="Transform" />
        </div>
    );
}

export default Forge;