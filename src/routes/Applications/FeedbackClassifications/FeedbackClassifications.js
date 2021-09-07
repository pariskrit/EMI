import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import FeedbackClassificationsContent from "./FeedbackClassificationsContent";
import ApplicationNavigation from "../../../helpers/applicationNavigation";

const FeedbackClassifications = () => {
	// Init params
	const { id } = useParams();

	// Init hooks
	const location = useLocation();

	// Init state
	const [is404, setIs404] = useState(false);
	const navigation = ApplicationNavigation(id);

	// Rendering data content with Navbar. Otherwise, 404 error
	if (is404 === false) {
		return (
			<Navbar
				Content={() => {
					return (
						<FeedbackClassificationsContent
							navigation={navigation}
							id={id}
							setIs404={setIs404}
							state={location.state}
						/>
					);
				}}
			/>
		);
	} else {
		return <p>404: Application id {id} does not exist.</p>;
	}
};

export default FeedbackClassifications;
