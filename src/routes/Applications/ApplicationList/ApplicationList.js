import React from "react";
import Navbar from "../../../components/Navbar";
import ApplicationListContent from "./ApplicationListContent";

const ApplicationList = () => {
	return (
		<div>
			<Navbar Content={ApplicationListContent} />
		</div>
	);
};

export default ApplicationList;
