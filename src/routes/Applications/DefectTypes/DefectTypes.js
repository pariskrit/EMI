import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import ApplicationNavigation from "../../../helpers/applicationNavigation";
import DefectTypesContent from "./DefectTypesContent";

const DefectTypes = () => {
	// Init params
	const { id } = useParams();

	// Init hooks
	const location = useLocation();

	// Init state
	const [is404, setIs404] = useState(false);
	const [navigation, setNavigation] = useState([]);

	// Getting navigation details on initial load
	useEffect(() => {
		setNavigation(ApplicationNavigation(id));
		// eslint-disable-next-line
	}, []);

	// Rendering pauses content with Navbar. Otherwise, 404 error
	if (is404 === false) {
		return (
			<Navbar
				Content={() => {
					return (
						<DefectTypesContent
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

export default DefectTypes;
