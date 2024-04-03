import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/index";



export const listMyfines = createAsyncThunk(
    "listMyfines",
    async (args, thunkAPI) => {
        console.log("args listMyfines", args);
        try {
            const res = await API.listMyFines(args);
            // console.log('res listMyfines: ', res);
            return res.data;
        }catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
)

export const totalMyFines = createAsyncThunk(
    "totalMyFines",
    async(args, thunkAPI) => {
        console.log("args totalMyFines", args);
        try {
            const res = await API.totalMyFines(args);
            // console.log('res totalMyFines: ', res);
            return res.data;
        }catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
)

// export const payFines = createAsyncThunk(
//     "payFines",
//     async(args, thunkAPI) => {
//         try {
//             const res = await API.addpayFines();
//             return res.data;
//         } catch (err) {
//             return thunkAPI.rejectWithValue(err);
//         }
//     }
// )


const finesReducer = createSlice({
    name: "fines",
    initialState: {
        listMyFines: [],
        totalMyFines: 0,
        payFines: [],
        loading: false,
        error: null,
        triggerFinesNotification: false,
    },
    reducers: {
        triggerFinesNotification: (state, action) => {
            state.triggerFinesNotification = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(listMyfines.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(listMyfines.fulfilled, (state, action) => {
            state.loading = false;
            state.listMyFines = action.payload;
        });
        builder.addCase(listMyfines.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(totalMyFines.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(totalMyFines.fulfilled, (state, action) => {
            state.loading = false;
            state.totalMyFines = action.payload;
        });
        builder.addCase(totalMyFines.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        // builder.addCase(payFines.pending, (state, action) => {
        //     state.loading = true;
        // });
        // builder.addCase(payFines.fulfilled, (state, action) => {
        //     state.loading = false;
        //     state.payFines = action.payload;
        // });
        // builder.addCase(payFines.rejected, (state, action) => {
        //     state.loading = false;
        //     state.error = action.payload;
        // });

    }
})


export default finesReducer.reducer;
export const { triggerFinesNotification } = finesReducer.actions;