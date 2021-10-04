import { combineReducers } from "@reduxjs/toolkit";
import { authSlice } from "./auth/reducers";
import { clientDetailSlice } from "./clientDetail/reducers";
import { commonSlice } from "./common/reducers";
import { siteDetailSlice } from "./siteDetail/reducers";

export default combineReducers({
	[authSlice.name]: authSlice.reducer,
	[clientDetailSlice.name]: clientDetailSlice.reducer,
	[commonSlice.name]: commonSlice.reducer,
	[siteDetailSlice.name]: siteDetailSlice.reducer,
});
