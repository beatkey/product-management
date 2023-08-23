import {Button} from "@mui/material";
import {NavLink, useNavigate} from "react-router-dom";

export default function Header() {
    const accessToken = localStorage.getItem("accessToken")
    const nav = useNavigate()
    const logoutHandle = async () => {
        await localStorage.removeItem("accessToken")
        nav("/")
    }

    return <div className="p-3 flex justify-end gap-2">
        <NavLink to="/products">
            <Button variant="contained">
                Products
            </Button>
        </NavLink>
        {accessToken && <Button onClick={logoutHandle} variant="contained">Logout</Button>}
    </div>
}