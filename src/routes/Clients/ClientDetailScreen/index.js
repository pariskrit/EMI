import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Navbar from "components/Navbar";
import React from "react";
import ClientDetails from "./ClientDetails";
import "./style.css";
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
const Rujal = () => {
	return (
		<ThemeProvider theme={theme}>
			<Navbar Content={() => <ClientDetails />} />
		</ThemeProvider>
	);
};

export default Rujal;
