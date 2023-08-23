import {useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import Header from "../../components/global/header.jsx";
import {CircularProgress, Pagination, TextField, Typography} from "@mui/material";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from "react";
import axios from "axios";
import {setAlert} from "../../stores/alert.jsx";
import {LoadingButton} from "@mui/lab";

export default function ProductShow() {
    const {id} = useParams()
    const dispatch = useDispatch()

    const [data, setData] = useState(null)
    const [movements, setMovements] = useState(null)

    const [productLoading, setProductLoading] = useState(false)
    const [movementsLoading, setMovementsLoading] = useState(false)
    const [loading, setLoading] = useState(false)

    const [desc, setDesc] = useState(null)
    const [amount, setAmount] = useState(1)
    const [type, setType] = useState(null)

    const [pageCount, setPageCount] = useState(null)
    const [page, setPage] = useState(1)

    const paginationHandle = (e, value) => {
        setPage(value)
    }

    const getProduct = async () => {
        setProductLoading(true)
        try {
            const fetch = await axios.get(import.meta.env.VITE_API_URL + "/product/" + id)
            if (fetch.data) {
                setData(fetch.data)
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
            setProductLoading(false)
        }
    }

    const getMovements = async () => {
        setMovementsLoading(true)
        try {
            const fetch = await axios.get(import.meta.env.VITE_API_URL + "/product/" + id + "/movement?page=" + page)
            if (fetch.data) {
                setMovements(fetch.data.data)
                setPageCount(fetch.data.pageCount)
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
            setMovementsLoading(false)
        }
    }

    useEffect(() => {
        getProduct()
    }, []);

    useEffect(() => {
        getMovements()
    }, [page]);

    const submitHandle = async (e) => {
        e.preventDefault()

        try {
            await axios.post(import.meta.env.VITE_API_URL + "/product/movement", {
                id,
                desc,
                amount,
                type
            })
            dispatch(setAlert({
                type: "success",
                content: "Created successfully"
            }))
            getProduct()
            getMovements()
        } catch (e) {
            dispatch(setAlert({
                type: "error",
                content: e.response.data.error
            }))
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (isoDateString) => {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };

        const date = new Date(isoDateString);

        return date.toLocaleString('tr-TR', options);
    }

    return <>
        <Header/>
        <div className="w-2/6 h-full py-10 m-auto">
            <div className="w-full">
                <Typography variant="h4" gutterBottom align="left">
                    Product Detail
                </Typography>
                {
                    !data ? <div className="flex justify-center items-center"><CircularProgress/></div>
                        :
                        <TableContainer component={Paper}>
                            <Table aria-label="a dense table">
                                <TableBody>
                                    <TableRow>
                                        <TableCell component="th" scope="row">ID</TableCell>
                                        <TableCell>{data._id}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">Name</TableCell>
                                        <TableCell>{data.name}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">Description</TableCell>
                                        <TableCell>{data.desc}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">Product Code</TableCell>
                                        <TableCell>{data.code}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell component="th" scope="row">Stock</TableCell>
                                        <TableCell>{data.stock}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <br/>
                <Typography variant="h4" gutterBottom align="left">
                    Product Movement Add
                </Typography>
                <form onSubmit={submitHandle} className="flex flex-col gap-3">
                    <TextField onChange={e => setDesc(e.target.value)}
                               type="text"
                               label="Movement Description" required/>
                    <TextField onChange={e => setAmount(e.target.value)}
                               value={amount}
                               type="number"
                               label="Product Amount" InputProps={{inputProps: {min: 1}}} required/>
                    <div className="grid grid-cols-2 gap-2">
                        <LoadingButton onClick={() => setType("increase")} loading={loading} type="submit"
                                       color="success"
                                       variant="contained">Increase</LoadingButton>
                        <LoadingButton onClick={() => setType("decrease")} loading={loading} type="submit" color="error"
                                       variant="contained">Decrease</LoadingButton>
                    </div>
                </form>
                <br/>
                <Typography variant="h4" gutterBottom align="left">
                    Product Movements
                </Typography>
                {
                    !movements ? <div className="flex justify-center items-center"><CircularProgress/></div>
                        :
                        <TableContainer component={Paper}>
                            <Table aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Created At</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Type</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        movements.map((value, index) =>
                                            <TableRow key={index}>
                                                <TableCell>{formatDate(value.createdAt)}</TableCell>
                                                <TableCell>{value.desc}</TableCell>
                                                <TableCell>{value.amount}</TableCell>
                                                <TableCell>{value.type}</TableCell>
                                            </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
                <div className="mt-5 flex justify-center">
                    {pageCount && <Pagination count={pageCount} page={page} onChange={paginationHandle}/>}
                </div>
            </div>
            <br/><br/>
        </div>
    </>
}