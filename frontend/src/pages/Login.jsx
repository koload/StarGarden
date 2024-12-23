import Form from "../components/LoginRegisterForm"
import BackgroundColorChange from "../components/BackgroundColorChange";
import { color } from "../styles/colors";

function Login() {
    return (
        <>
            <BackgroundColorChange color_to_set={color.dark_background} />
            <Form route="/main/token/" method="login" />
        </>
    );
}

export default Login