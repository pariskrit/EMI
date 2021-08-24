import { combineReducers } from "@reduxjs/toolkit";
import { testSlice } from "./test";

export default combineReducers({
	[testSlice.name]: testSlice.reducer,
});
