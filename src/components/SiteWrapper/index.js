import React from "react";
import PropTypes from "prop-types";
import RestoreIcon from "@material-ui/icons/Restore";
import { makeStyles, createMuiTheme, ThemeProvider } from "@material-ui/core";
import Navcrumbs from "components/Navcrumbs";
import Navbar from "components/Navbar";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import NavButtons from "components/NavButtons";
import { useParams } from "react-router-dom";

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
	importButton: {
		background: "#ED8738",
	},
	buttons: {
		display: "flex",
		marginLeft: "auto",
	},
});
const SiteWrapper = ({
	crumbs,
	status,
	lastSaved,
	onClickAdd,
	onClickImport,
	showAdd,
	showImport,
	current,
	onNavClick,
	Component,
}) => {
	const classes = useStyles();
	const { id } = useParams();
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
							<div className={classes.buttons}>
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
							</div>
							<div className="restore">
								<RestoreIcon className={classes.restore} />
							</div>
						</div>
						<NavButtons
							navigation={[
								{ name: "Details", url: "" },
								{ name: "Assets", url: "/assets" },
								{ name: "Departments", url: "/department" },
								{ name: "Locations", url: "/locations" },
							]}
							current={current}
							onClick={(nam) => onNavClick(`/site/${id}${nam}`)}
						/>
						<Component />
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
	current: "Details",
	onClickAdd: () => {},
	onClickImport: () => {},
	onNavClick: () => {},
	Component: () => <div>Provide Component</div>,
};

SiteWrapper.propTypes = {
	crumbs: PropTypes.array,
	status: PropTypes.string,
	lastSaved: PropTypes.string,
	onClickAdd: PropTypes.func,
	onClickImport: PropTypes.func,
	onNavClick: PropTypes.func,
	showAdd: PropTypes.bool,
	showImport: PropTypes.bool,
	Component: PropTypes.elementType,
};

export default SiteWrapper;
