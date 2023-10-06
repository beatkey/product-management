import {Navigate, Route, Routes, useNavigate, useOutlet} from "react-router-dom";

import Login from "./pages/login.jsx";
import Products from "./pages/products";
import axios from "axios";
import {Alert, Snackbar} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {closeAlert} from "./stores/alert.jsx";
import ProductCreate from "./pages/products/create.jsx";
import ProductEdit from "./pages/products/edit.jsx";
import ProductShow from "./pages/products/show.jsx";

export const ProtectedLayout = () => {
    const accessToken = localStorage.getItem("accessToken");
    const outlet = useOutlet();

    if (!accessToken) {
        return <Navigate to={"/"}/>;
    }

    axios.defaults.headers.common['x-access-token'] = accessToken;

    return <>{outlet}</>
};

export const GuestLayout = () => {
    const accessToken = localStorage.getItem("accessToken");
    const outlet = useOutlet();

    if (accessToken) {
        return <Navigate to={"/products"}/>;
    }

    return <>{outlet}</>
};


function App() {
    const dispatch = useDispatch()
    const nav = useNavigate()
    const {type, content} = useSelector(state => state.alert)

    const closeHandle = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        dispatch(closeAlert())
    };

    axios.interceptors.response.use(res => {
        return res
    }, err => {
        if (err.response.status === 401) {
            localStorage.removeItem("accessToken")
            nav("/")
        }
        return err
    })

    return <div className="bg-[#fff] h-screen w-full">
        <Snackbar anchorOrigin={{vertical: "top", horizontal: "right"}} open={content !== null}
                  autoHideDuration={4000} onClose={closeHandle}>
            <Alert severity={type} sx={{width: '100%'}}>
                {content}
            </Alert>
        </Snackbar>
        <Routes>
            <Route element={<GuestLayout/>}>
                <Route path="/" element={<Login/>}/>
            </Route>

            <Route element={<ProtectedLayout/>}>
                <Route path="/products" element={<Products/>}/>
                <Route path="/products/create" element={<ProductCreate/>}/>
                <Route path="/products/edit/:id" element={<ProductEdit/>}/>
                <Route path="/products/:id" element={<ProductShow/>}/>
            </Route>
        </Routes>
    </div>
}

export default App
