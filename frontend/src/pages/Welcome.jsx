import { useNavigate } from "react-router-dom";
import BackgroundColorChange from "../components/BackgroundColorChange";
import { color } from "../styles/colors";
import "../styles/WelcomeStyle.css";

function Welcome() {
    const navigate = useNavigate();
    return (
        <div>
            <BackgroundColorChange color_to_set={color.dark_background_light} />
            <div>
                <div className="center">
                    <img id="StarGarden-logo" src="/images/Texts/StarGardenLogoType12-purple_overgrown-export.svg" alt="StarGarden Logo"></img>
                    <img id="BeginButton" src="/images/Buttons/BeginButton.svg" onClick={() => navigate('/login')} alt="Begin Button"></img>
                    {/* <button id="button-begin" onClick={() => navigate('/login')}>Begin.</button> */}
                </div>
            </div>
        </div>
    );
}

export default Welcome;