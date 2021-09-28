import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import CustomCaptionsContent from "./CustomCaptionsContent";

const CustomCaptions = ({ state, dispatch }) => {
	// Init params
	const { appId } = useParams();

	// Init hooks
	const location = useLocation();

	// Init state
	const [is404, setIs404] = useState(false);

	// Rendering positions content with Navbar. Otherwise, 404 error
	if (is404 === false) {
		return (
			<CustomCaptionsContent
				id={appId}
				setIs404={setIs404}
				state={location.state}
			/>
		);
	} else {
		return <p>404: Application id {appId} does not exist.</p>;
	}
};

export default CustomCaptions;
