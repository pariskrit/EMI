import React from "react";
import ServiceContent from "./ServiceContent";

function index() {
	// get service list filters from local storage for memorized dropdown filter
	const statusFromMemory = JSON.parse(sessionStorage.getItem("service-status"));
	const departmentFromMemory = JSON.parse(
		sessionStorage.getItem("service-department")
	);
	const timeFrameFromMemory = JSON.parse(
		sessionStorage.getItem("service-timeFrame")
	);

	return (
		<ServiceContent
			statusFromMemory={statusFromMemory}
			departmentFromMemory={departmentFromMemory}
			timeFrameFromMemory={timeFrameFromMemory}
		/>
	);
}

export default index;
