import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/index";
import Cookies from "../utils/cookies";
import parseISO from "date-fns/parseISO";
import parseJwt from "../utils/parseJwt";
import { useSelector } from "react-redux";


export const renewBook = createAsyncThunk(
    "renewBook",
    async (args, thunkAPI) => {
        console.log("args renew", args);
        try {
            const res = await API.getDetailRenew(args);    
            console.log('res renew: ', res);           
            return res.data;
        }catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);

export const updateRenew = createAsyncThunk(
    "updateRenew",
    async (args, thunkAPI) => {
        console.log("args updateRenew", args);
        try {
            const res = await API.updateRenew(args);
            return res.data;
        }catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);

export const addStatisticRenew = createAsyncThunk(
    "addStatisticRenew",
    async (args, thunkAPI) => {
        console.log("args addStatisticRenew", args);
        try {
            const res = await API.addStatisticRenew(args);
            return res.data;
        }catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);


const renewReducer = createSlice({
    name: "renew",
    initialState: {
        renew: {},
        renewFromModal: {},
        triggerRenew: false,
        selectedValue: null,
        loading: false,
        error: null,
    },
    reducers: {
        setTriggerRenew: (state, action) => {
            state.triggerRenew = action.payload;
            console.log('state trigeer renew: ', state.triggerRenew);
        },
        setRefreshRenew: (state, action) => {
            state.selectedValue = action.payload;
            console.log('state refresh renew: ', state.selectedValue);
        },
        setDataFromModal: (state, action) => {
            // state.renew = {}
            console.log('state renew from modal: ', state.renewFromModal);
        },

    },
    extraReducers: (builder) => {

        builder.addCase(renewBook.pending, (state, action) => {
            state.loading = true;
        }),
        builder.addCase(renewBook.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }),
        builder.addCase(renewBook.fulfilled, (state, action) => {
            state.loading = false;
            state.renew = action.payload;
            console.log('state renew fulffiled: ', state.renew[0].itemnumber);
        }),


        builder.addCase(updateRenew.pending, (state, action) => {
            state.loading = true;
        }),
        builder.addCase(updateRenew.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }),
        builder.addCase(updateRenew.fulfilled, (state, action) => {
            state.loading = false;
            // state.renew = action.payload;
            console.log('state update renew fulffiled: ');
        }),


        builder.addCase(addStatisticRenew.pending, (state, action) => {
            state.loading = true;
        }),
        builder.addCase(addStatisticRenew.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }),
        builder.addCase(addStatisticRenew.fulfilled, (state, action) => {
            state.loading = false;
            // state.renew = action.payload;
            console.log('state add statistic renew fulffiled: ');
        })
    }
})

export const { setTriggerRenew, setRefreshRenew, setDataFromModal } = renewReducer.actions;
export default renewReducer.reducer;