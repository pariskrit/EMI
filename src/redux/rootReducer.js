import { combineReducers } from "@reduxjs/toolkit";
import { clientDetailSlice } from "./clientDetail/reducers";
import { commonSlice } from "./common/reducers";

export default combineReducers({
	[clientDetailSlice.name]: clientDetailSlice.reducer,
	[commonSlice.name]: commonSlice.reducer,
});
