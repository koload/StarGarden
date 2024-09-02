import "../styles/HomeStyle.css";
import BackgroundColorChange from "../components/BackgroundColorChange";
import { color } from "../styles/colors";
import Sidebar from "../components/Sidebar";
import Grid from "../components/Grid";
import api from "../api";
import { useState, useEffect } from "react";

import Forge from "../components/Forge";

function Home() {
    const [userData, setUserData] = useState(null);

    const fetchCurrentUser = async (userId) => {
        try {
            const response = await api.get("current_user/")
            return response.data
        } catch (error) {
            console.error("Error fetching the cucrent user:", error)
            throw error
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



    return(
        <>
            <BackgroundColorChange color_to_set={color.dark_background} />
            <div>
                <Sidebar />
            </div>
            <div>
                <p>TEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEST {userData ? userData.username : "Loading..."}</p>
            </div>
        </>
    );
}

export default Home