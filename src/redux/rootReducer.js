import { combineReducers } from "@reduxjs/toolkit";
import { clientDetailSlice } from "./clientDetail/reducers";

export default combineReducers({
	[clientDetailSlice.name]: clientDetailSlice.reducer,
});
