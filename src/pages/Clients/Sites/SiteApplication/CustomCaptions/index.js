import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CustomCaptionsContent from "./CustomCaptionsContent";

const CustomCaptions = ({ state }) => {
	// Init params
	const { appId } = useParams();

	// Init state
	const [is404, setIs404] = useState(false);

	// Rendering positions content with Navbar. Otherwise, 404 error
	if (is404 === false) {
		return (
			<CustomCaptionsContent id={appId} setIs404={setIs404} state={state} />
		);
	} else {
		return <p>404: Application id {appId} does not exist.</p>;
	}
};

export default CustomCaptions;
