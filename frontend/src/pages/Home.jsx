import "../styles/HomeStyle.css";
import BackgroundColorChange from "../components/BackgroundColorChange";
import { color } from "../styles/colors";

function Home() {
    return(
        <>
            <BackgroundColorChange color_to_set={color.dark_background} />
            <div>Home Page</div>
        </>
    );
}

export default Home