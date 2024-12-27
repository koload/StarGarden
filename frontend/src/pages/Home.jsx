import "../styles/HomeStyle.css";
import BackgroundColorChange from "../components/BackgroundColorChange";
import { color } from "../styles/colors";
import Sidebar from "../components/Sidebar";
import Grid from "../components/Grid";
import api from "../api";
import { useState, useEffect } from "react";


function Home() {
    const [userData, setUserData] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [resources, setResources] = useState([]);

    const fetchCurrentUser = async () => {
        try {
            const response = await api.get("current_user/")
            return response.data
        } catch (error) {
            console.error("Error fetching the current user:", error)
            throw error
        }
    };

    const fetchUserResources = async () => {
        try {
            const response = await api.get("user_resources/");
            console.log("User Resources Data:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching user resources:", error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await fetchCurrentUser();
                setUserData(data);
            } catch (error) {
                console.error("Error fetching the current user:", error);
            }
        };
        fetchUserData();
    }, []);

    return (
        <>
            <BackgroundColorChange color_to_set={color.dark_background} />
            <div>
                <Sidebar onSelectItem={setSelectedItem} resources={resources} setResources={setResources} fetchUserResources={fetchUserResources}/>
                <Grid rows={9} columns={16} selectedItem={selectedItem} onSelectItem={setSelectedItem} setResources={setResources} fetchUserResources={fetchUserResources}/>
            </div>
        </>
    );
}

export default Home;