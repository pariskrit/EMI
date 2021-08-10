import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Navbar from "../../../components/Navbar";
import ClientContent from "./ClientContent";

// Overriding Material UI components for this parent component
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

const Client = () => {
	// Init params
	const { id } = useParams();

	// Init state
	const [is404, setIs404] = useState(false);

	// Getting navigation details on initial load
	useEffect(() => {
		// eslint-disable-next-line
	}, []);

	// Rendering client content with Navbar. Otherwise, 404 error
	if (is404 === false) {
		return (
			<ThemeProvider theme={theme}>
				<Navbar
					Content={() => {
						return (
							<ClientContent
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

export default Client;
