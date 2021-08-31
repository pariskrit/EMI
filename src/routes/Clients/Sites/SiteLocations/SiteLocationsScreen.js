import React, { useState } from "react";
import Navbar from "components/Navbar";
import SiteLocationsContent from "./SiteLocationsContent";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

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

const SiteLocationsScreen = () => {
	const [is404, setIs404] = useState(false);

	return (
		<ThemeProvider theme={theme}>
			<Navbar
				Content={() => {
					return <SiteLocationsContent setIs404={setIs404} />;
				}}
			/>
		</ThemeProvider>
	);
};

export default SiteLocationsScreen;