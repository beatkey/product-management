import {forwardRef, useEffect, useState} from "react";
import axios from "axios";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Button, CircularProgress, Pagination, Typography} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {LoadingButton} from '@mui/lab';
import Header from "../../components/global/header.jsx";
import {useDispatch} from "react-redux";
import {setAlert} from "../../stores/alert.jsx";
import {NavLink} from "react-router-dom";
import {RemoveRedEye} from "@mui/icons-material";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Products() {
    const dispatch = useDispatch()
    const [pageCount, setPageCount] = useState(null)
    const [page, setPage] = useState(1)
    const [rows, setRows] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [loading, setLoading] = useState(false)

    const paginationHandle = (e, value) => {
        setPage(value)
    }

    const getData = async () => {
        try {
            const fetch = await axios.get(import.meta.env.VITE_API_URL + "/product?page=" + page)
            const formattedData = fetch.data.data.map((item) => ({
                id: item._id,
                ...item,
            }));
            setRows(formattedData);
            setPageCount(fetch.data.pageCount)
        } catch (e) {
            dispatch(setAlert({
                type: "error",
                content: "Fetch error"
            }))
        }
    }

    const clickOpenHandle = (value) => {
        setSelectedRow(value)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteHandle = async () => {
        setLoading(true)
        try {
            await axios.delete(import.meta.env.VITE_API_URL + "/product/" + selectedRow)
            dispatch(setAlert({
                type: "success",
                content: "Deleted successfully"
            }))
            getData()
        } catch (e) {
            dispatch(setAlert({
                type: "error",
                content: e.message
            }))
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    useEffect(() => {
        getData()
    }, [page]);

    return <>
        <Header/>
        <div className="container h-full py-10 m-auto">
            <Typography variant="h4" gutterBottom>
                Product List
            </Typography>
            <div className="py-3 flex justify-end">
                <NavLink to={"/products/create"}>
                    <Button color={"success"} variant="contained">Create</Button>
                </NavLink>
            </div>
            {
                !rows ? <div className="flex justify-center items-center"><CircularProgress/></div>
                    :
                    <TableContainer component={Paper}>
                        <Table sx={{minWidth: 650}} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell width={50}>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Product Code</TableCell>
                                    <TableCell>Stock</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                    >
                                        <TableCell component="th" scope="row">{row.id}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.desc}</TableCell>
                                        <TableCell>{row.code}</TableCell>
                                        <TableCell>{row.stock}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <NavLink to={`/products/${row.id}`}>
                                                    <Button variant="contained"
                                                            startIcon={<RemoveRedEye/>}>
                                                        View
                                                    </Button>
                                                </NavLink>
                                                <NavLink to={`/products/edit/${row.id}`}>
                                                    <Button color="warning" variant="contained"
                                                            startIcon={<EditIcon/>}>
                                                        Edit
                                                    </Button>
                                                </NavLink>
                                                <Button onClick={() => clickOpenHandle(row.id)} color="error"
                                                        variant="contained"
                                                        startIcon={<EditIcon/>}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
            }
            <div className="mt-5 flex justify-center">
                {pageCount && <Pagination count={pageCount} page={page} onChange={paginationHandle}/>}
            </div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Are you sure to delete this product?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <LoadingButton loading={loading} color="error" variant="contained"
                                   onClick={deleteHandle}>Delete</LoadingButton>
                </DialogActions>
            </Dialog>
        </div>
    </>
}