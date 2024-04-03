import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/index";
import Cookies from "../utils/cookies";
import parseISO from "date-fns/parseISO";
import parseJwt from "../utils/parseJwt";
import { useSelector } from "react-redux";


export const getIssues = createAsyncThunk(
    "getIssues",
    async (args, thunkAPI) => {
        // console.log("args getIssues", args);
        try {
            const res = await API.getListCheckoutIssues(args);
            // console.log('res getIssues: ', res);
            return res.data;
        }catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);


export const addIssues = createAsyncThunk(
    "addIssues",
    async (args, thunkAPI) => {
        // console.log("args addIssues", args);
        try {
            const res = await API.addIssues(args);    
            console.log('res addIssues: ', res);           
            return res.data;
        }catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);

export const updateIssues = createAsyncThunk(
    "updateIssues",
    async (args, thunkAPI) => {
        console.log("args updateIssues", args);
        try {
            const res = await API.updateIssues(args);
            return res.data;
        }catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);


const issueReducer = createSlice({
    name: "issue",
    initialState: {
        // issue: {},
        checkIssue: {},
        listBookCheckIn: [],
        listBarcodeIssue: [],
        triggerIssue: false,
        loading: false,
        error: null,
    },
    reducers: {
        setTriggerIssue: (state, action) => {
            state.triggerIssue = action.payload;
            console.log('state issue: ', state.triggerIssue);
        },
        setDeleteIssue: (state, action) => {
            state.listBarcodeIssue = action.payload;
            console.log('state listBarcodeIssue update: ', state.listBarcodeIssue);
        },
        setRefreshListIssue: (state, action) => {
            if (action.payload === true) {
                state.listBarcodeIssue.length = 0;
            }
            console.log('state listBarcodeIssue update: ', state.listBarcodeIssue);
        },
    },
    extraReducers: {
        [getIssues.pending]: (state, action) => {
            state.loading = true;
        },
        [getIssues.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        [getIssues.fulfilled]: (state, action) => {
            state.loading = false;
            // console.log('Payload:', action.payload);
            if(action.payload.length > 0){
                state.listBarcodeIssue =[...state.listBarcodeIssue, action.payload[0]];
                console.log('listBarcodeIssue: ', state.listBarcodeIssue);
            }
        },

        [addIssues.pending]: (state, action) => {
            state.loading = true;
        },
        [addIssues.rejected]: (state, action) => {
            state.loading = false;
            // state.error = action.payload;
        },
        [addIssues.fulfilled]: (state, action) => {
            state.loading = false;
            // state.issue = action.payload;
            // state.listBarcodeIssue.length = 0;
            console.log('state Add issue fulffiled: ');
        },


        [updateIssues.pending]: (state, action) => {
            state.loading = true;
        },
        [updateIssues.rejected]: (state, action) => {
            state.loading = false;
            // state.error = action.payload;
        },
        [updateIssues.fulfilled]: (state, action) => {
            state.loading = false;
            // state.issue = action.payload;
            console.log('state issue update fulffiled: ');
        }
    }
})

export const { setTriggerIssue, setDeleteIssue, setRefreshListIssue, setDeleteCheckIssue } = issueReducer.actions;
export default issueReducer.reducer;