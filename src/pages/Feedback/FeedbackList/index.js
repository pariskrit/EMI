import {
	FEEDBACK_STORAGE_DEPARTMENT,
	FEEDBACK_STORAGE_MY_FEEDBACK,
	FEEDBACK_STORAGE_STATUS,
	FEEDBACK_STORAGE_TIMEFRAME,
} from "helpers/constants";
import React from "react";
import FeedbackContent from "./FeedbackContent";

function index() {
	// get feedback list filters from local storage for memorized dropdown filter
	const statusFromMemory = JSON.parse(
		sessionStorage.getItem(FEEDBACK_STORAGE_STATUS)
	);
	const departmentFromMemory = JSON.parse(
		sessionStorage.getItem(FEEDBACK_STORAGE_DEPARTMENT)
	);
	const timeFrameFromMemory = JSON.parse(
		sessionStorage.getItem(FEEDBACK_STORAGE_TIMEFRAME)
	);
	const myFeedbackFromMemory = JSON.parse(
		sessionStorage.getItem(FEEDBACK_STORAGE_MY_FEEDBACK)
	);

	return (
		<FeedbackContent
			statusFromMemory={statusFromMemory}
			departmentFromMemory={departmentFromMemory}
			timeFrameFromMemory={timeFrameFromMemory}
			myFeedbackFromMemory={myFeedbackFromMemory}
		/>
	);
}

export default index;
