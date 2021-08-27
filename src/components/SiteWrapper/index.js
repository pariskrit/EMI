import React from "react";
import PropTypes from "prop-types";
import RestoreIcon from "@material-ui/icons/Restore";
import { makeStyles, createMuiTheme, ThemeProvider } from "@material-ui/core";
import Navcrumbs from "components/Navcrumbs";
import Navbar from "components/Navbar";

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
const useStyles = makeStyles({
	restore: {
		border: "2px solid",
		borderRadius: "100%",
		height: "35px",
		width: "35px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "#307ad6",
	},
});
const SiteWrapper = ({ crumbs, status, lastSaved, children }) => {
	const classes = useStyles();
	return (
		<ThemeProvider theme={theme}>
			<Navbar
				Content={() => (
					<div>
						<div className="flex justify-between">
							<Navcrumbs
								crumbs={crumbs}
								status={status}
								lastSaved={lastSaved}
							/>
							<div className="right-section">
								<div className="restore">
									<RestoreIcon className={classes.restore} />
								</div>
							</div>
						</div>
						{children}
					</div>
				)}
			/>
		</ThemeProvider>
	);
};

SiteWrapper.defaultProps = {
	crumbs: ["Client", "Region", "Site"],
	status: "",
	lastSaved: "",
};

SiteWrapper.propTypes = {
	crumbs: PropTypes.array,
	status: PropTypes.string,
	lastSaved: PropTypes.string,
	children: PropTypes.element.isRequired,
};

export default SiteWrapper;
