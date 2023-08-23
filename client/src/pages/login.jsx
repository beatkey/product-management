import {useState} from "react";
import {Box, Tab, Tabs, TextField} from "@mui/material";
import axios from "axios";
import {Navigate, useNavigate} from "react-router-dom";
import {LoadingButton} from "@mui/lab";
import {useDispatch} from "react-redux";
import {closeAlert, setAlert} from "../stores/alert.jsx";

const CustomTab = (props) => {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function Login() {
    const dispatch = useDispatch()
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [tab, setTab] = useState(0)
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()
    const accessToken = localStorage.getItem("accessToken")

    const tabHandle = (e, value) => {
        setTab(value);
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const submitHandle = async (e) => {
        e.preventDefault()

        setLoading(true)
        try {
            const fetch = await axios.post(import.meta.env.VITE_API_URL + "/auth/login", {
                email: tab === 0 ? email : username,
                password
            })
            if (fetch.data.accessToken) {
                await localStorage.setItem("accessToken", fetch.data.accessToken);
                dispatch(closeAlert())
                nav("/products")
            } else {
                dispatch(setAlert({
                    type: "error",
                    content: "Token error"
                }))
            }
        } catch (e) {
            dispatch(setAlert({
                type: "error",
                content: e.response.data.error
            }))
        } finally {
            setLoading(false)
        }
    }

    return accessToken ? <Navigate to={"/products"}/> : <div className="flex items-center justify-center w-full h-full">
        <form onSubmit={submitHandle} className="flex flex-col gap-3 w-1/6">
            <Tabs value={tab} onChange={tabHandle} className="mx-auto">
                <Tab label="Email" {...a11yProps(0)} />
                <Tab label="Username" {...a11yProps(1)} />
            </Tabs>
            <CustomTab value={tab} index={0}>
                <TextField sx={{width: '100%'}} onChange={e => setEmail(e.target.value)} value={email} type="email"
                           label="Email (test@gmail.com)"/>
            </CustomTab>
            <CustomTab value={tab} index={1}>
                <TextField sx={{width: '100%'}} onChange={e => setUsername(e.target.value)} value={username} type="text"
                           label="Username (test)"
                           required/>
            </CustomTab>
            <TextField onChange={e => setPassword(e.target.value)} type="password" label="Password (123123)" required/>
            <LoadingButton loading={loading} type="submit" variant="contained">Login</LoadingButton>
        </form>
    </div>
}