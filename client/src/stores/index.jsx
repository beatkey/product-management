import {configureStore} from "@reduxjs/toolkit";

import alert from "./alert.jsx";

const store = configureStore({
    reducer: {
        alert
    }
})

export default store