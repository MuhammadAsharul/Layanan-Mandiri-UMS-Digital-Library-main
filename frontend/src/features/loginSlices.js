import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../services/index";
import Cookies from "../utils/cookies";
import parseISO from "date-fns/parseISO";
import parseJwt from "../utils/parseJwt";


export const loginIndex = createAsyncThunk(
    "loginIndex",
    async (args, thunkAPI) => {
        try {
            const res = await API.login(args);        
            args = {
                ...args,
                token: res.data.token,
            }
            return res.data;
        }catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);

export const adminLogin = createAsyncThunk(
    "adminLogin",
    async (args, thunkAPI) => {

        try {
            const res = await API.loginAdmin(args);
            console.log('res data admin: ', res);
            args = {
                ...args,
                token: res.data.token,
            }
            return res.data;
        }catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
)

export const loginUser = createAsyncThunk(
    "loginUser",
    async (args, thunkAPI) => {
        const value = {
            cardnumber: args.payload.cardnumber,
        }
        try {
            if(args.type === "LOGIN") {
                const res = await API.loginUser(value);
                args = {
                    ...args,
                    token: res.data.token,
                }
                return res.data;
            }

        }catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);

export const logout = createAsyncThunk(
    "logout",
    async (args, thunkAPI) => {
        console.log('args: ', args);
        const value = {
            password: args.payload.password,
            userid: args.payload.userid,
        }
        try {
            const res = await API.logout(value);
            console.log('res: ', res);
            return res.data.data;
        }catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
);


export const updateUser = createAsyncThunk(
    "updateUser",
    async (args,thunkAPI) => {
        console.log('args updaetUser:',args)

        try {
            const res = await API.updateProfile(args);
            console.log('res updateUser: ', res);
            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
)


export const loginReducer = createSlice({
    name: "login",
    initialState: {
        users: [],
        admin:[],
        automaticLogout: null,
        isAutomaticLogout: false,
        token: null,
        loading: false,
        error: null,
        triggerLogin: false,
    },
    reducers: {
        // setTriggerLogin: (state, action) => {
        //     state.trigger = action.payload;
        //     // console.log('state login: ', state.trigger);
        // },
        setAutomaticLogout: (state, action) => {
            Cookies.delCookies('CERT')
        },
        setLogoutUser: (state, action) => {
            state.users.length = 0;
            state.token = null;
            state.loading = false;
            state.error = null;
            // state.triggerLogin = !state.triggerLogin;
            Cookies.delCookies('CERT')
        },

        setTriggerUpdateProfile: (state, action) => {
            state.triggerLogin = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginIndex.pending, (state, action) => {
            state.loading = true;
        }),
        builder.addCase(loginIndex.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }),
        builder.addCase(loginIndex.fulfilled, (state, action) => {
            state.users = action.meta.arg.payload;
            state.loading = false;
            state.error = null;
            localStorage.setItem("token", action.payload.token);
        }),


        builder.addCase(loginUser.pending, (state, action) => {
            state.loading = true;
        }),
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }),
        builder.addCase(loginUser.fulfilled, (state, action) => {
                state.users = parseJwt(action.payload.token);
                console.log('state.users fullfiled: ', state.users);
                state.loading = false;
                state.error = null;
                Cookies.setCookies ("CERT", action.payload.token, {datetime: parseISO(action.payload.expiredAt)});
                // state.triggerLogin = !state.triggerLogin;
        }),


        builder.addCase(adminLogin.pending, (state, action) => {
            state.loading = true;
        }),
        builder.addCase(adminLogin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }),
        builder.addCase(adminLogin.fulfilled, (state, action) => {
            state.admin = parseJwt(action.payload.token);
            console.log('state.admin fullfiled: ', state.admin);
            state.loading = false;
            state.error = null;
            Cookies.setCookies ("CERT", action.payload.token, {datetime: parseISO(action.payload.expiredAt)});
            // state.triggerLogin = !state.triggerLogin;
        }),

        
        builder.addCase(logout.pending, (state, action) => {
            state.loading = true;
            state.type = action.meta.requestStatus;
        }),
        builder.addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.type = action.meta.requestStatus;
        }),
        builder.addCase(logout.fulfilled, (state, action) => {
            switch (action.meta.arg.type) {
                case "LOGOUT":
                    state.users = action.meta.arg.payload;
                    state.loading = false;
                    state.error = null;
                    state.type = action.meta.requestStatus;
                    localStorage.removeItem("token");
                    break;
                default:
                    break;
            }
        }),


        builder.addCase(updateUser.pending, (state, action) => {
            state.loading = true;
        }),

        builder.addCase(updateUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }),

        builder.addCase(updateUser.fulfilled, (state, action) => {
            state.users = action.payload;
            state.loading = false;
            state.error = null;
        })
    }

});


export const { setTriggerLogin, setAutomaticLogout, setLogoutUser, setTriggerUpdateProfile } = loginReducer.actions;
export default loginReducer.reducer;