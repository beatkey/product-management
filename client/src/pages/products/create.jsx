import Header from "../../components/global/header.jsx";
import {TextField, Typography} from "@mui/material";
import {useState} from "react";
import {LoadingButton} from "@mui/lab";
import axios from "axios";
import {setAlert} from "../../stores/alert.jsx";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

export default function ProductCreate() {
    const nav = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState(null)
    const [desc, setDesc] = useState(null)
    const [code, setCode] = useState(null)
    const [stock, setStock] = useState(0)

    const submitHandle = async (e) => {
        e.preventDefault()

        setLoading(true)
        try {
            await axios.post(import.meta.env.VITE_API_URL + "/product", {
                name,
                desc,
                code,
                stock
            })
            dispatch(setAlert({
                type: "success",
                content: "Created successfully"
            }))
            nav("/products")
        } catch (e) {
            dispatch(setAlert({
                type: "error",
                content: e.response.data.error
            }))
        } finally {
            setLoading(false)
        }
    }

    return <>
        <Header/>
        <div className="w-1/6 h-full py-10 m-auto">
            <div className="w-full">
                <Typography variant="h4" gutterBottom align="left">
                    Product Create
                </Typography>
            </div>
            <form onSubmit={submitHandle} className="flex flex-col gap-3">
                <TextField sx={{width: '100%'}} onChange={e => setName(e.target.value)}
                           type="text"
                           label="Name" required/>
                <TextField sx={{width: '100%'}} onChange={e => setDesc(e.target.value)} type="text"
                           multiline
                           rows={3}
                           label="Description" required/>
                <TextField sx={{width: '100%'}} onChange={e => setCode(e.target.value)} type="text"
                           label="Product Code" required/>
                <TextField sx={{width: '100%'}} onChange={e => setStock(e.target.value)}
                           value={stock}
                           type="number"
                           label="Stock" required/>
                <LoadingButton loading={loading} type="submit" variant="contained">Create</LoadingButton>
            </form>
        </div>
    </>
}