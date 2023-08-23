import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    type: null,
    content: null
}

const slice = createSlice({
    name: "alert",
    initialState,
    reducers: {
        setAlert: (state, action) => {
            state.type = action.payload.type
            state.content = action.payload.content
        },
        closeAlert: (state, action) => {
            state.content = null
        }
    }
})

export const {setAlert, closeAlert} = slice.actions
export default slice.reducer