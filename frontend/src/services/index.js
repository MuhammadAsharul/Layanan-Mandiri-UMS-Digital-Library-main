import Post from "./Post";
import Get from "./Get";
import Put from "./Put";
import Delete from "./Delete";



// Post
const login = (data) => Post("/login/index", data ?? {});
const loginUser = (data) => Post("/login", data ?? {});
const loginAdmin = (data) => Post("/login/admin", data ?? {});
const logout = (data) => Post("/login/logout", data ?? {});
const addIssues = (data) => Post("/issues/add", data ?? {});
const addStatisticRenew = (data) => Post("/renew/statistics", data ?? {});
const addSuggest = (data) => Post("/suggest", data ?? {});
const addChekin = (data) => Post("/checkin/user/add", data ?? {});
const addpayFines = () => Post("/fines/charge");
const getNotification = () => Post("/notification");
const updateCheckDropbox = (data) => Post("/checkin/admin/checkbook", data ?? {});





// Get
const getIssues = () => Get("/issues");
const getListCheckoutIssues = (id) => Get(`/issues/${id}`);
const getDetailRenew = (id) => Get(`/renew/${id}`);
const getMySuggest = () => Get("/suggest/list");
const getDetailSuggest = (id) => Get(`/suggest/list/${id}`);
const getPhotoProfile = () => Get("/login/user/image");
const getDataUser = () => Get("/login/user/list");
const getListMyCheckin = () => Get("/checkin/user/list");
const checkIssues = (id) => Get(`/checkin/mylist/${id}`)
const totalMyFines = () => Get("/fines/user/total");
const listMyFines = () => Get("/fines/user/list");
const listCheckinPending = () => Get("/checkin/admin/list");
const listCheckinSuccess = () => Get("/checkin/admin/list/success");
const getListCheckinPending = (id) => Get(`/checkin/admin/list/${id}`); 




//Put
const updateIssues = (data) => Put("/issues/update", data ?? {});
const updateRenew = (data) => Put("/renew/update", data ?? {});
const updateSuggest = (data) => Put("/suggest/update", data ?? {});
const updateProfile = (data) => Put("/login/user/update", data ?? {});
const updateChekin = (data) => Put("/checkin/user/update", data ?? {});

//Delete
const deleteSuggest = (id) => Delete(`/suggest/delete/${id}`);
const deleteChekin = (data) => Delete("/checkin/user/delete", data ?? {});


const API = {
    login,
    loginUser,
    loginAdmin, 
    logout,
    getIssues,
    checkIssues,
    getListCheckoutIssues,
    addIssues,
    updateIssues,
    getDetailRenew,
    updateRenew,
    addStatisticRenew,
    getMySuggest,
    addSuggest,
    updateSuggest,
    deleteSuggest,
    getDetailSuggest,
    getPhotoProfile,
    updateProfile,
    getDataUser,
    getListMyCheckin,
    addChekin,
    updateChekin,
    deleteChekin,
    totalMyFines,
    listMyFines,
    listCheckinPending,
    listCheckinSuccess,
    getListCheckinPending,
    addpayFines,
    getNotification,
    updateCheckDropbox,

}

export default API;