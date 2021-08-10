import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Navbar from "../../../components/Navbar";
import ApplicationContent from "./ApplicationContent";
import ApplicationNavigation from "../../../helpers/applicationNavigation";

// Overriding Material UI components for this parent component (Applications)
const theme = createMuiTheme({
	overrides: {
		// Accordion override is making the accordion title static vs. default dynamic
		MuiAccordionSummary: {
			root: {
				height: 48,
				"&$expanded": {
					height: 48,
					minHeight: 48,
				},
			},
		},
	},
});

const Application = () => {
	// Init params
	const { id } = useParams();

	// Init state
	const [is404, setIs404] = useState(false);
	const [navigation, setNavigation] = useState([]);

	// Getting navigation details on initial load
	useEffect(() => {
		setNavigation(ApplicationNavigation(id));
		// eslint-disable-next-line
	}, []);

	// Rendering application content with Navbar. Otherwise, 404 error
	if (is404 === false) {
		return (
			<ThemeProvider theme={theme}>
				<Navbar
					Content={() => {
						return (
							<ApplicationContent
								navigation={navigation}
								id={id}
								setIs404={setIs404}
							/>
						);
					}}
				/>
			</ThemeProvider>
		);
	} else {
		return <p>404: Application id {id} does not exist.</p>;
	}
};

export default Application;
