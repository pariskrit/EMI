import React from "react";
import { ModelContext } from "contexts/ModelDetailContext";
import ModelWrapper from "pages/Models/ModelDetails/commonModelHeader";
import ModelDetailNavigation from "constants/navigation/modelDetailNavigation";
import { modelServiceLayout } from "helpers/routePaths";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const SingleComponent = ({
	access,
	customCaptions,
	showArrangements,
	position,
	...route
}) => {
	const [state, dispatch] = React.useContext(ModelContext);
	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams();
	const [currentTaskTableSort, setCurrenTaskTableSort] = React.useState([
		"scheduledDate",
		"asc",
	]);
	const [taskListImportSuccess, setTaskListImportSuccess] =
		React.useState(false);
	const navigation = ModelDetailNavigation(
		id,
		state.modelDetail,
		customCaptions,
		showArrangements
	);
	if (state?.modelDetail?.modelType === "F") {
		navigation.splice(1, 1);
	}

	if (state?.modelDetail?.modelType === "F") {
		navigation.splice(1, 1);
	} else {
		if (!showArrangements) {
			navigation.splice(2, 1);
		}
	}

	const openAddModel = () => dispatch({ type: "TOGGLE_ADD", payload: true });

	const openSaveModel = () => dispatch({ type: "TOGGLE_SAVE", payload: true });

	const openConfirmationPopup = () =>
		dispatch({ type: "TOGGLE_CONFIRMATION_POPUP", payload: true });

	const openClickSaveChanges = () =>
		dispatch({ type: "TOGGLE_SAVE_CHANGES", payload: true });

	const openPasteTaskModel = () =>
		dispatch({ type: "TOGGLE_PASTE_TASK", payload: true });

	const openChangeStatusModel = () =>
		dispatch({ type: "TOGGLE_CHANGE_STATUS", payload: true });

	const openClickVersion = () => {
		dispatch({ type: "TOOGLE_VERSION", payload: true });
	};

	const showAdd = [route.showAdd, access === "F"].every((x) => x === true);
	const showPaste = [
		route.showPasteTask,
		access === "F",
		!state?.modelDetail?.isPublished,
	].every((x) => x === true);
	const showAddButton =
		route.id === 3
			? showAdd
			: [route.showAdd, access === "F", !state?.modelDetail?.isPublished].every(
					(x) => x === true
			  );

	const showRevert =
		state.modelDetail?.isPublished &&
		state.modelDetail?.version !== state.modelDetail?.activeModelVersion;

	const showPrint = route.path === modelServiceLayout;

	return (
		<div>
			<ModelWrapper
				state={state.modelDetail}
				ModelName={route.ModelName}
				current={route.name}
				navigation={navigation}
				applicationName="Stage"
				showAdd={showAddButton}
				onClickAdd={openAddModel}
				showSave={route.showSave}
				showPasteTask={showPaste}
				showChangeStatus={
					(access === "E" || access === "F") && !showRevert
						? route.showChangeStatus
						: false
				}
				showRevert={showRevert}
				showSaveChanges={route.showSaveChanges}
				showVersion={route.showVersion && position?.modelAccess !== "R"}
				showSwitch={route?.showSwitch}
				onClickSave={openSaveModel}
				onClickVersion={openClickVersion}
				onCLickedSaveChanges={openClickSaveChanges}
				onClickPasteTask={openPasteTaskModel}
				onClickShowChangeStatus={openChangeStatusModel}
				onClickRevert={openConfirmationPopup}
				onNavClick={(path) => navigate(path)}
				isPasteTaskDisabled={state.isPasteTaskDisabled}
				isQuestionTaskDisabled={state.isQuestionTaskDisabled}
				customCaptions={customCaptions}
				showPrint={showPrint}
				modelID={id}
				currentTaskTableSort={currentTaskTableSort}
				onTaskListImportSuccess={setTaskListImportSuccess}
			/>
			{
				<route.component
					state={state}
					dispatch={dispatch}
					modelId={id}
					access={access}
					history={location}
					modelDefaultId={state?.modelDetail?.modelID}
					isPublished={state?.modelDetail?.isPublished}
					getCurrentTaskTableSort={setCurrenTaskTableSort}
					isTaskListImportSuccess={taskListImportSuccess}
				/>
			}
		</div>
	);
};
export default SingleComponent;
