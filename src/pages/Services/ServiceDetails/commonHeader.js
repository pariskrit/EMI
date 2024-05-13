import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import RestoreIcon from "@mui/icons-material/Restore";
import NavDetails from "components/Elements/NavDetails";
import NavButtons from "components/Elements/NavButtons";
import PropTypes from "prop-types";
import React, { useContext } from "react";
import "pages/Applications/CustomCaptions/customCaptions.css";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import { ServiceContext } from "contexts/ServiceDetailContext";
import { appPath, servicesPath } from "helpers/routePaths";
import { redService, serviceStatus } from "constants/serviceDetails";
import PrintIcon from "assets/printer.svg";
import { useParams } from "react-router-dom";
import AccessWrapper from "components/Modules/AccessWrapper";
import { NoReadOnly } from "helpers/constants";
import { useDispatch } from "react-redux";
import { setHistoryDrawerState } from "redux/common/actions";

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
	printIcon: {
		"&:hover": {
			cursor: "pointer",
		},
	},
	importButton: {
		background: "#ED8738",
	},
	buttons: {
		display: "flex",
		marginLeft: "auto",
		marginRight: "18px",
		[media]: {
			marginLeft: "0px",
			flexDirection: "column",
			marginBottom: "10px",
			gap: "10px",
		},
	},
	wrapper: {
		display: "flex",
		[media]: {
			marginTop: "10px",
			justifyContent: "space-between",
			flexDirection: "column",
		},
	},
}));
const importButton = {
	"&.MuiButton-root": {
		backgroundColor: "#ED8738",
	},
};

const ServicesWrapper = ({
	state,
	lastSaved,
	onClickAdd,
	showAdd,
	current,
	applicationName,
	navigation,
	ModelName,
	showSave,
	showPasteTask,
	showChangeStatus,
	showSaveChanges,
	showPrint,
	showVersion,
	onClickSave,
	onCLickedSaveChanges,
	onClickPasteTask,
	onClickShowChangeStatus,
	onClickVersion,
	onNavClick,
	isPasteTaskDisabled,
	isQuestionTaskDisabled,
	customCaptions,
}) => {
	const { classes, cx } = useStyles();
	const dispatch = useDispatch();
	const { id } = useParams();

	let name = "Task";

	const {
		position: { serviceAccess },
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	if (ModelName === customCaptions.questionPlural) {
		name = customCaptions.question;
	}

	const [serviceDetail] = useContext(ServiceContext);
	return (
		<div className="container">
			<div className={"topContainerCustomCaptions"}>
				<NavDetails
					status={true}
					lastSaved={lastSaved}
					staticCrumbs={[
						{
							id: 1,
							name: customCaptions?.servicePlural,
							url: appPath + servicesPath,
						},
						{
							id: 2,
							name: serviceDetail?.serviceDetail?.workOrder,
						},
					]}
					hideLastLogin
					state={{
						...state?.serviceDetail,
						statusColor: redService.includes(state?.status) ? "red" : "#24BA78",
						modelStatusName: serviceStatus[state?.status],
					}}
					hideVersion={true}
				/>
				<div
					className={
						showAdd ||
						showSave ||
						showPasteTask ||
						showSaveChanges ||
						showChangeStatus
							? classes.wrapper
							: ""
					}
				>
					<div className={classes.buttons}>
						{showPasteTask && (
							<AT.GeneralButton
								sx={importButton}
								onClick={onClickPasteTask}
								className={classes.importButton}
								disabled={
									ModelName === customCaptions.questionPlural
										? isQuestionTaskDisabled
										: isPasteTaskDisabled
								}
							>
								Paste {name}
							</AT.GeneralButton>
						)}
						{showVersion && (
							<AT.GeneralButton
								sx={importButton}
								onClick={onClickVersion}
								className={classes.importButton}
							>
								New Version
							</AT.GeneralButton>
						)}
						<AccessWrapper access={serviceAccess} accessList={NoReadOnly}>
							{showChangeStatus && (
								<AT.GeneralButton
									sx={importButton}
									onClick={onClickShowChangeStatus}
									className={classes.importButton}
								>
									Change Status
								</AT.GeneralButton>
							)}
						</AccessWrapper>
						{showSaveChanges && (
							<AT.GeneralButton onClick={onCLickedSaveChanges}>
								Save Changes
							</AT.GeneralButton>
						)}
						{showAdd && (
							<AT.GeneralButton onClick={onClickAdd}>Add New</AT.GeneralButton>
						)}
						{showSave && (
							<AT.GeneralButton onClick={onClickSave}>Save</AT.GeneralButton>
						)}
						{showPrint && (
							<img
								alt="Print"
								src={PrintIcon}
								style={{ marginRight: "10px" }}
								className={classes.printIcon}
								onClick={() => {
									localStorage.setItem("state", JSON.stringify(state));
									window.open(`/report/${id}/print`);
								}}
							/>
						)}

						{current === "Details" && (
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
				applicationName={applicationName}
				current={current}
				onClick={onNavClick}
				hideMobileViewBackground
			/>
		</div>
	);
};

ServicesWrapper.defaultProps = {
	crumbs: ["Parent", "Child", "so on.."],
	status: "",
	lastSaved: "",
	showAdd: false,
	showSave: false,
	showPasteTask: false,
	showSaveChanges: false,
	showChangeStatus: false,
	current: "Details",
	onClickAdd: () => {},
	onClickSave: () => {},
	onCLickedSaveChanges: () => {},
	onClickPasteTask: () => {},
	onClickShowChangeStatus: () => {},
	onNavClick: () => {},
	Component: () => <div>Provide Component</div>,
	onClickVersion: () => {},
};

ServicesWrapper.propTypes = {
	crumbs: PropTypes.array,
	status: PropTypes.string,
	lastSaved: PropTypes.string,
	onClickAdd: PropTypes.func,
	onClickSave: PropTypes.func,
	onCLickedSaveChanges: PropTypes.func,
	onClickPasteTask: PropTypes.func,
	onClickShowChangeStatus: PropTypes.func,
	onNavClick: PropTypes.func,
	showAdd: PropTypes.bool,
	Component: PropTypes.elementType,
	ModelName: PropTypes.string.isRequired,
	showSave: PropTypes.bool,
	showChangeStatus: PropTypes.bool,
	showPasteTask: PropTypes.bool,
	showSaveChanges: PropTypes.bool,
	onClickVersion: PropTypes.func,
};

export default ServicesWrapper;
