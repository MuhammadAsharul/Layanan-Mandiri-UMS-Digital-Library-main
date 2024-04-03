import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/index";


export const addChekin = createAsyncThunk(
    "addChekin",
    async (args, thunkAPI) => {
        console.log("args addChekin", args);
        try {
            const res = await API.addChekin(args);    
            console.log('res addChekin: ', res);           
            return res.data;
        }catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);


export const updateChekin = createAsyncThunk(
    "updateChekin",
    async (args, thunkAPI) => {
        console.log("args updateChekin", args);
        try {
            const res = await API.updateChekin(args);
            return res.data;
        }catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);


export const deleteChekin = createAsyncThunk(
    "deleteChekin",
    async (args, thunkAPI) => {
        console.log("args deleteChekin", args);
        try {
            const res = await API.deleteChekin(args);
            return res.data;
        }catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);


export const checkMyIssues = createAsyncThunk(
    "checkMyIssues",
    async (args, thunkAPI) => {
        console.log("args checkMyIssues", args);
        try {
            const res = await API.checkIssues(args);
            // console.log('res checkMyIssues: ', res);
            return res.data;
        }catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);

export const checkDropboxBuku = createAsyncThunk(
    "checkDropboxBuku",
    async (args, thunkAPI) => {
        console.log("args checkDropboxBuku", args);
        try {
            const res = await API.getListCheckinPending(args)
            return res.data;
        }catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);

export const updateCheckDropbox = createAsyncThunk(
    "updateCheckDropbox",
    async (args, thunkAPI) => {
        console.log("args updateCheckDropbox", args);
        try {
            const res = await API.updateCheckDropbox(args)
            return res.data;
        }catch (err) {
            return thunkAPI.rejectedWithValue(err);
        }
    }
);


const chekinReducer = createSlice({

    name: "chekin",
    initialState: {
        checkIssue: {},
        checkDropboxBuku: {},
        listBookCheckIn: [],
        listDropboxBookPending: [],
        triggerChekin: false,
        selectedValue: null,
        loading: false,
        error: null,
    },

    reducers: {
        setChekinFromModal: (state, action) => {
            state.chekinFromModal = action.payload;
        },
        setTriggerChekin: (state, action) => {
            state.triggerChekin = action.payload;
            console.log('state trigeer chekin: ', state.triggerChekin);
        },
        setDeleteCheckIssue: (state, action) => {
            state.listBookCheckIn = action.payload;
            state.checkIssue = ""
            console.log('state checkIssue update: ', state.checkIssue);
        },
        setDeleteCheckin : (state, action) => {
            state.listDropboxBookPending = action.payload;
            state.checkDropboxBuku = ""
            // console.log('state checkDropboxBuku update: ', state.checkDropboxBuku);
        }
    },

    extraReducers: (builder) => {

        builder.addCase(addChekin.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(addChekin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(addChekin.fulfilled, (state, action) => {
            state.loading = false;
            console.log('state Add Chekin fullfiled')
        });


        builder.addCase(updateChekin.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(updateChekin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(updateChekin.fulfilled, (state, action) => {
            state.loading = false;
            console.log('state update Chekin fullfiled')
        });


        builder.addCase(deleteChekin.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(deleteChekin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(deleteChekin.fulfilled, (state, action) => {
            state.loading = false;
            console.log('state delete Chekin fullfiled')
        });

        
        builder.addCase(checkMyIssues.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(checkMyIssues.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(checkMyIssues.fulfilled, (state, action) => {
            state.loading = false;
            state.checkIssue = action.payload;
            if (action.payload.length > 0) {
                state.listBookCheckIn = [...state.listBookCheckIn, action.payload[0]];
            }
        });


        builder.addCase(checkDropboxBuku.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(checkDropboxBuku.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(checkDropboxBuku.fulfilled, (state, action) => {
            state.loading = false;
            state.checkDropboxBuku = action.payload;
            if(action.payload) {
                state.listDropboxBookPending = [...state.listDropboxBookPending, action.payload]
            }
        });

        builder.addCase(updateCheckDropbox.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(updateCheckDropbox.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(updateCheckDropbox.fulfilled, (state, action) => {
            state.loading = false;
            console.log('state updateCheckDropbox fullfiled')
        });

    }
})


export const { setChekinFromModal, setTriggerChekin, setDeleteCheckIssue, setDeleteCheckin } = chekinReducer.actions;
export default chekinReducer.reducer;

