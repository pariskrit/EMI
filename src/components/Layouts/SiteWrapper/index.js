import { makeStyles } from "tss-react/mui";
import NavDetails from "components/Elements/NavDetails";
import NavButtons from "components/Elements/NavButtons";
import PropTypes from "prop-types";
import React from "react";
import "pages/Applications/CustomCaptions/customCaptions.css";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import RestoreIcon from "@mui/icons-material/Restore";
import { getLocalStorageData } from "helpers/utils";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setHistoryDrawerState } from "redux/common/actions";
import HistoryBar from "components/Modules/HistorySidebar/HistoryBar";
import { ASSETS, DETAILS } from "helpers/constants";
import {
	getSiteAssetsHistory,
	getSiteDepartmentsHistory,
	getSiteSettingsHistory,
} from "services/History/siteSettings";
const AT = ActionButtonStyle();

const media = "@media (max-width: 414px)";

const useStyles = makeStyles()((theme) => ({
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
}));

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
	const { classes, cx } = useStyles();
	const dispatch = useDispatch();
	const { isHistoryDrawerOpen } = useSelector((state) => state.commonData);

	const importButton = {
		"&.MuiButton-root": {
			backgroundColor: "#ED8738",
		},
	};

	const { customCaptions, siteID } = getLocalStorageData("me");

	let HistoryBarApi = undefined;
	if (current === DETAILS) HistoryBarApi = getSiteSettingsHistory;
	else if ([current === ASSETS, customCaptions?.assetPlural].includes(current))
		HistoryBarApi = getSiteAssetsHistory;
	else HistoryBarApi = getSiteDepartmentsHistory;

	return (
		<div className="container">
			<div className={"topContainerCustomCaptions"}>
				<NavDetails status={true} lastSaved={lastSaved} />
				{siteID && (
					<HistoryBar
						id={siteID}
						showhistorybar={isHistoryDrawerOpen}
						dispatch={dispatch}
						fetchdata={(id, pageNumber, pageSize) =>
							HistoryBarApi(id, pageNumber, pageSize)
						}
					/>
				)}
				<div className={showAdd || showImport ? classes.wrapper : ""}>
					<div className={classes.buttons}>
						{showImport && (
							<AT.GeneralButton onClick={onClickImport} sx={importButton}>
								Import from list
							</AT.GeneralButton>
						)}
						{showAdd && (
							<AT.GeneralButton onClick={onClickAdd}>Add New</AT.GeneralButton>
						)}

						{siteID && (
							<div
								className="restore"
								onClick={() => dispatch(setHistoryDrawerState(true))}
							>
								<RestoreIcon className={classes.restore} />
							</div>
						)}
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
