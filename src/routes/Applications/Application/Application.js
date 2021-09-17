import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ApplicationContent from "./ApplicationContent";
import applicationNavigation from "../../../helpers/applicationNavigation";

const Application = () => {
	// Init params
	const { id } = useParams();

	// Init state
	const [is404, setIs404] = useState(false);
	const navigation = applicationNavigation(id);

	// Rendering application content with Navbar. Otherwise, 404 error
	if (is404 === false) {
		return (
			<ApplicationContent navigation={navigation} id={id} setIs404={setIs404} />
		);
	} else {
		return <p>404: Application id {id} does not exist.</p>;
	}
};

export default Application;
