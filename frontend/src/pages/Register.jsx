import Form from "../components/LoginRegisterForm";
import BackgroundColorChange from "../components/BackgroundColorChange";
import { color } from "../styles/colors";

function Register() {
    return (
        <>
    <BackgroundColorChange color_to_set={color.dark_background} />
    <Form route="/main/user/register/" method="register" />
    </>
);
}

export default Register;