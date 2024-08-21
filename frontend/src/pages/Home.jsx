import "../styles/HomeStyle.css";
import BackgroundColorChange from "../components/BackgroundColorChange";
import { color } from "../styles/colors";
import Sidebar from "../components/Sidebar";

function Home() {
    return(
        <>
            <BackgroundColorChange color_to_set={color.dark_background} />
            <div>
                <Sidebar />
            </div>
        </>
    );
}

export default Home