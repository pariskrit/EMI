import {
	DEFECTS_STORAGE_DEPARTMENT,
	DEFECTS_STORAGE_STATUS,
	DEFECTS_STORAGE_TIMEFRAME,
} from "helpers/constants";
import React from "react";
import DefectContent from "./DefectContent";

function index() {
	// get defects list filters from local storage for memorized dropdown filter
	const statusFromMemory = JSON.parse(
		sessionStorage.getItem(DEFECTS_STORAGE_STATUS)
	);
	const departmentFromMemory = JSON.parse(
		sessionStorage.getItem(DEFECTS_STORAGE_DEPARTMENT)
	);
	const timeFrameFromMemory = JSON.parse(
		sessionStorage.getItem(DEFECTS_STORAGE_TIMEFRAME)
	);

	return (
		<DefectContent
			statusFromMemory={statusFromMemory}
			departmentFromMemory={departmentFromMemory}
			timeFrameFromMemory={timeFrameFromMemory}
		/>
	);
}

export default index;
