import {
	createMuiTheme,
	makeStyles,
	ThemeProvider,
} from "@material-ui/core/styles";
import RestoreIcon from "@material-ui/icons/Restore";
import Navbar from "components/Navbar";
import NavButtons from "components/Modules/NavButtons";
import NavDetails from "components/Elements/NavDetails";
import PropTypes from "prop-types";
import React from "react";
import "routes/Applications/CustomCaptions/customCaptions.css";
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

const media = "@media (max-width: 414px)";

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
		[media]: {
			marginLeft: "0px",
		},
	},
	wrapper: {
		display: "flex",
		[media]: {
			marginTop: "10px",
			justifyContent: "space-between",
		},
	},
});

const SiteWrapper = ({
	lastSaved,
	onClickAdd,
	onClickImport,
	showAdd,
	showImport,
	current,
	onNavClick,
	Component,
	navigation,
}) => {
	const classes = useStyles();

	return (
		<ThemeProvider theme={theme}>
			<Navbar
				Content={() => (
					<div className="container">
						<div className={"topContainerCustomCaptions"}>
							<NavDetails status={true} lastSaved={lastSaved} />
							<div className={showAdd || showImport ? classes.wrapper : ""}>
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
						</div>

						<NavButtons
							navigation={navigation}
							current={current}
							onClick={onNavClick}
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
