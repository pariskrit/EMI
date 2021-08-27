import React from "react";
import PropTypes from "prop-types";
import RestoreIcon from "@material-ui/icons/Restore";
import { makeStyles, createMuiTheme, ThemeProvider } from "@material-ui/core";
import Navcrumbs from "components/Navcrumbs";
import Navbar from "components/Navbar";
import ActionButtonStyle from "styles/application/ActionButtonStyle";

const AT = ActionButtonStyle();
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
	rightSection: {
		display: "flex",
		textTransform: "uppercase",
	},
	importButton: {
		background: "#ED8738",
	},
});
const SiteWrapper = ({
	crumbs,
	status,
	lastSaved,
	children,
	onClickAdd,
	onClickImport,
	showAdd,
	showImport,
}) => {
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
							<div className={classes.rightSection}>
								{showImport && (
									<AT.GeneralButton
										onClick={onClickImport}
										className={classes.importButton}
									>
										Import from list
									</AT.GeneralButton>
								)}
								{showAdd && (
									<AT.GeneralButton onClick={onClickAdd}>
										Add New
									</AT.GeneralButton>
								)}
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
	crumbs: ["Parent", "Child", "so on.."],
	status: "",
	lastSaved: "",
	showAdd: false,
	showImport: false,
	onClickAdd: () => {},
	onClickImport: () => {},
};

SiteWrapper.propTypes = {
	crumbs: PropTypes.array,
	status: PropTypes.string,
	lastSaved: PropTypes.string,
	children: PropTypes.element.isRequired,
	onClickAdd: PropTypes.func,
	onClickImport: PropTypes.func,
	showAdd: PropTypes.bool,
	showImport: PropTypes.bool,
};

export default SiteWrapper;
