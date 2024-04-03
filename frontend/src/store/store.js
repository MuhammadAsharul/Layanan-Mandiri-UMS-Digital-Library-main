import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../features/loginSlices";
import renewReducer from "../features/renewSlices";
import issueReducer from "../features/issueSlices";
import suggestReducer from "../features/suggestSlices";
import chekinReducer from "../features/chekinSlices";

export const store = configureStore({
    reducer: {
        login: loginReducer,
        renew: renewReducer,
        issue: issueReducer,
        suggest: suggestReducer,
        chekin: chekinReducer,
    },
    
    // middleware: (getDefaultMiddleware) =>
    // getDefaultMiddleware({
    //   serializableCheck: {
    //     // Ignore these action types
    //     ignoredActions: ['addChekin/rejected', 'updateChekin/rejected', 'deleteChekin/rejected'],
    //     // Ignore these field paths in all actions
    //     ignoredActionPaths: ['payload'],
    //   },
    // }),
});

