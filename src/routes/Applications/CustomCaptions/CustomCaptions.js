import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import applicationNavigation from "../../../helpers/applicationNavigation";
import CustomCaptionsContent from "./CustomCaptionsContent";

const CustomCaptions = () => {
	// Init params
	const { id } = useParams();

	// Init hooks
	const location = useLocation();

	// Init state
	const [is404, setIs404] = useState(false);
	const navigation = applicationNavigation(id);

	// Rendering positions content with Navbar. Otherwise, 404 error
	if (is404 === false) {
		return (
			<Navbar
				Content={() => {
					return (
						<div>
							<CustomCaptionsContent
								navigation={navigation}
								id={id}
								setIs404={setIs404}
								state={location.state}
							/>
						</div>
					);
				}}
			/>
		);
	} else {
		return <p>404: Application id {id} does not exist.</p>;
	}
};

export default CustomCaptions;
