import { useNavigate } from "react-router-dom";
import BackgroundColorChange from "../components/BackgroundColorChange";
import { color } from "../styles/colors";
import "../styles/WelcomeStyle.css";
import StarGardenLogo from "../images//Texts/StarGardenLogoType12-purple_overgrown-export.svg";
import BeginButton from "../images/Buttons/BeginButton.svg";

function Welcome() {
    const navigate = useNavigate();
    return (
        <div>
            <BackgroundColorChange color_to_set={color.dark_background} />
            <div>
                <div className="center">
                    <img id="StarGarden-logo" src={StarGardenLogo}></img>
                    <img id="BeginButton" src={BeginButton} onClick={() => navigate('/login')}></img>
                    {/* <button id="button-begin" onClick={() => navigate('/login')}>Begin.</button> */}
                </div>
            </div>
        </div>
    );
}

export default Welcome