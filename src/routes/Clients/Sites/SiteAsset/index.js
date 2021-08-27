import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Navbar from "components/Navbar";
import Assets from "./Assets";

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
const SiteAsset = () => {
	return (
		<ThemeProvider theme={theme}>
			<Navbar Content={() => <Assets />} />
		</ThemeProvider>
	);
};

export default SiteAsset;
