import { makeStyles } from "tss-react/mui";
import { NoReadOnly } from "helpers/constants";
import ImportCSVFile from "components/Elements/ImportCSV/ImportCSV";
import RestoreIcon from "@mui/icons-material/Restore";
import NavDetails from "components/Elements/NavDetails";
import NavButtons from "components/Elements/NavButtons";
import PropTypes from "prop-types";
import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import "pages/Applications/CustomCaptions/customCaptions.css";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import { appPath, modelsPath } from "helpers/routePaths";
import { ModelContext } from "contexts/ModelDetailContext";
import ReportDropdowns from "./ReportDropdowns";
import AccessWrapper from "components/Modules/AccessWrapper";
import { useLocation } from "react-router-dom";
import {
	DownloadCSVTemplateforModalTask,
	getCountOfModelTaskList,
	getModelTaskList,
} from "services/services/serviceLists";
import { showError } from "redux/common/actions";
import { useUserSearch } from "hooks/useUserSearch";
import { defaultPageSize } from "helpers/utils";
import { getLengthOfModelTasks } from "services/models/modelDetails/modelTasks";
import IOSSwitch from "components/Elements/IOSSwitch";
import { patchModelChange } from "services/models/modelDetails/details";
import { useDispatch } from "react-redux";
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
const ModelWrapper = ({
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
	showRevert,
	showSaveChanges,
	showVersion,
	showSwitch,
	onClickSave,
	onCLickedSaveChanges,
	onClickPasteTask,
	onClickShowChangeStatus,
	onClickRevert,
	onClickVersion,
	onNavClick,
	isPasteTaskDisabled,
	isQuestionTaskDisabled,
	customCaptions,
	showPrint,
	modelID,
	currentTaskTableSort,
	onTaskListImportSuccess,
}) => {
	const { classes } = useStyles();
	let name = "Task";
	const searchRef = useRef("");
	const dispatchx = useDispatch();
	const location = useLocation();
	const isModelTaskPage = location.pathname.includes("tasks");
	const handleSwitchChange = async () => {
		try {
			const res = await patchModelChange(state?.modelID, [
				{
					path: "active",
					op: "replace",
					value: !state?.active,
				},
			]);
			if (res?.status) {
				dispatch({
					type: "UPDATE_SWITCH",
					payload: { active: !state?.active },
				});
			} else {
				dispatchx(showError(res?.data?.detail || "Failed to change status."));
			}
		} catch (err) {
			dispatchx(showError(err?.response?.detail || "Failed to change status."));
		}
	};

	if (ModelName === customCaptions.questionPlural) {
		name = customCaptions.question;
	}

	const [modelDetail, dispatch] = useContext(ModelContext);
	const [importCSV, setImportCSV] = useState(false);
	const [totalTaskCount, setTotalTaskCount] = useState(modelDetail?.taskCount);
	const { position } = sessionStorage.getItem("me")
		? JSON.parse(sessionStorage.getItem("me"))
		: {};
	const { setAllData } = useUserSearch();
	const [countOFTask, setCountOfTask] = useState(0);
	const [dataForFetchingModelTask, setDataForFetchingModelTask] = useState({
		pageNumber: 1,
		pageSize: defaultPageSize(),
		search: "",
		sortField: "",
		sort: "",
	});
	// attemp to fetch task list
	const fetchModelTaskList = useCallback(
		async ({ search = "", sortField = "", sort = "", shouldCount = true }) => {
			try {
				const response = await Promise.all([
					getModelTaskList({
						siteAppId: modelID,
						search,
						sortField,
						sort,
					}),
				]);
				if (response[0].status) {
					setAllData(response?.[0]?.data);
					const modelTaskLength = await getLengthOfModelTasks(modelID);
					dispatch({
						type: "TAB_COUNT",
						payload: {
							countTab: "taskCount",
							data: modelTaskLength?.data,
						},
					});
					response?.[1].status && setCountOfTask(response?.[1]?.data);
					setDataForFetchingModelTask((prev) => ({ ...prev, pageNumber: 1 }));
				} else {
					dispatch(
						showError(response?.data?.detail || "Failed to fetch service list")
					);
				}
			} catch (error) {
				dispatch(
					showError(error?.response?.detail || "Failed to fetch service list")
				);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			modelID,
			dispatch,
			setAllData,
			searchRef.current,
			dataForFetchingModelTask.pageNumber,
		]
	);
	return (
		<div className="container">
			<div className={"topContainerCustomCaptions"}>
				<NavDetails
					status={true}
					lastSaved={lastSaved}
					staticCrumbs={[
						{
							id: 1,
							name: `${customCaptions?.modelPlural}`,
							url: appPath + modelsPath,
						},
						{
							id: 2,
							name:
								modelDetail.modelDetail?.modelName !== null
									? modelDetail?.modelDetail?.name +
									  " " +
									  modelDetail.modelDetail?.modelName
									: modelDetail?.modelDetail?.name + " ",
						},
					]}
					hideLastLogin
					state={state}
					hideVersion={false}
				/>
				<ImportCSVFile
					siteAppID={modelID}
					open={importCSV}
					uploadApiEndPoint={"ModelVersionTasks/upload"}
					apiEndPoints={"ModelVersionTasks/import"}
					handleClose={() => {
						setImportCSV(false);
					}}
					importSuccess={async () => {
						await fetchModelTaskList({
							search: "",
							sortField: currentTaskTableSort[0],
							sort: currentTaskTableSort[1],
						});
						setDataForFetchingModelTask({
							pageNumber: 1,
							pageSize: defaultPageSize(),
							search: "",
							sortField: "",
							sort: "",
						});
					}}
					downloadCSVTemplate={DownloadCSVTemplateforModalTask}
					setTaskListImportSuccess={onTaskListImportSuccess}
				/>
				<div className={classes.wrapper}>
					<div className={classes.buttons}>
						{!state?.isPublished && isModelTaskPage && (
							<AccessWrapper
								access={position?.serviceAccess}
								accessList={NoReadOnly}
							>
								<AT.GeneralButton
									sx={importButton}
									className={classes.importButton}
									onClick={() => setImportCSV(true)}
								>
									Import {customCaptions?.taskPlural ?? "Tasks"}
								</AT.GeneralButton>
							</AccessWrapper>
						)}
						{showPasteTask && (
							<AT.GeneralButton
								sx={importButton}
								onClick={onClickPasteTask}
								disabled={
									ModelName === customCaptions.questionPlural
										? isQuestionTaskDisabled
										: isPasteTaskDisabled
								}
							>
								Paste {name}
							</AT.GeneralButton>
						)}
						{showSwitch && (
							<div>
								<IOSSwitch
									currentStatus={state?.active}
									onChange={handleSwitchChange}
									name="status"
									disable={position?.modelAccess === "R"}
								/>
							</div>
						)}
						{showVersion && (
							<AT.GeneralButton sx={importButton} onClick={onClickVersion}>
								New Version
							</AT.GeneralButton>
						)}
						{showChangeStatus && (
							<AT.GeneralButton
								sx={importButton}
								onClick={onClickShowChangeStatus}
								disabled={
									modelDetail?.modelDetail?.isPublished ||
									modelDetail?.showVersion
								}
							>
								Change Status
							</AT.GeneralButton>
						)}
						{showRevert && (
							<AT.GeneralButton sx={importButton} onClick={onClickRevert}>
								Revert
							</AT.GeneralButton>
						)}
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
					</div>

					{current !== `${customCaptions?.service} Layout` && (
						<button
							className="restore"
							onClick={() => dispatch({ type: "TOGGLE_HISTORYBAR" })}
						>
							<RestoreIcon className={classes.restore} />
						</button>
					)}
				</div>
				{showPrint && <ReportDropdowns customCaptions={customCaptions} />}
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

ModelWrapper.defaultProps = {
	crumbs: ["Parent", "Child", "so on.."],
	status: "",
	lastSaved: "",
	showAdd: false,
	showSave: false,
	showPasteTask: false,
	showSaveChanges: false,
	showChangeStatus: false,
	showRevert: false,
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

ModelWrapper.propTypes = {
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
	showRevert: PropTypes.bool,
	showPasteTask: PropTypes.bool,
	showSaveChanges: PropTypes.bool,
	onClickVersion: PropTypes.func,
};

export default ModelWrapper;
