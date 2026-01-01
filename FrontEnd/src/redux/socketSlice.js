import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name:"socktio",
    initialState:{
        socket:null
    },
    reducers:{
        setSocket:(state,action)=>{
            state.socket = action.payload;
        }
    }
});

export const {setSocket} = socketSlice.actions;
export default socketSlice.reducer;