import Header from "../../components/global/header.jsx";
import {CircularProgress, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {LoadingButton} from "@mui/lab";
import axios from "axios";
import {closeAlert, setAlert} from "../../stores/alert.jsx";
import {useDispatch} from "react-redux";
import {useParams} from "react-router-dom";

export default function ProductEdit() {
    const {id} = useParams()
    const dispatch = useDispatch()

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)

    const [name, setName] = useState(null)
    const [desc, setDesc] = useState(null)
    const [code, setCode] = useState(null)
    const [stock, setStock] = useState(0)

    const getProduct = async () => {
        setLoading(true)
        try {
            const fetch = await axios.get(import.meta.env.VITE_API_URL + "/product/" + id)
            if (fetch.data) {
                setData(fetch.data)
                setName(fetch.data.name)
                setDesc(fetch.data.desc)
                setCode(fetch.data.code)
                setStock(fetch.data.stock)
            } else {
                dispatch(setAlert({
                    type: "error",
                    content: "Fetch error"
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
    const submitHandle = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await axios.put(import.meta.env.VITE_API_URL + "/product/" + id, {
                name,
                desc,
                code,
                stock
            })
            dispatch(setAlert({
                type: "success",
                content: "Edited successfully"
            }))
        } catch (e) {
            dispatch(setAlert({
                type: "error",
                content: e.response.data.error
            }))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getProduct()
    }, []);

    return <>
        <Header/>
        <div className="w-1/6 h-full py-10 m-auto">
            <div className="w-full">
                <Typography variant="h4" gutterBottom align="left">
                    Product Edit
                </Typography>
            </div>
            {
                !data ? <div className="flex justify-center items-center"><CircularProgress/></div>
                    :
                    <form onSubmit={submitHandle} className="flex flex-col gap-3">
                        <TextField sx={{width: '100%'}} onChange={e => setName(e.target.value)}
                                   type="text"
                                   label="Name" value={name} required/>
                        <TextField sx={{width: '100%'}} onChange={e => setDesc(e.target.value)} type="text"
                                   multiline
                                   rows={3}
                                   label="Description" value={desc} required/>
                        <TextField sx={{width: '100%'}} onChange={e => setCode(e.target.value)} type="text"
                                   label="Product Code" value={code} required/>
                        <TextField sx={{width: '100%'}} onChange={e => setStock(e.target.value)}
                                   value={stock}
                                   type="number"
                                   label="Stock" required/>
                        <LoadingButton loading={loading} type="submit" variant="contained">Update</LoadingButton>
                    </form>
            }
        </div>
    </>
}