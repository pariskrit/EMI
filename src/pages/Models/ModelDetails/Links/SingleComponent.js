import React from "react";
import { ModelContext } from "contexts/ModelDetailContext";
import ModelWrapper from "../commonModelHeader";
import ModelDetailNavigation from "constants/navigation/modelDetailNavigation";

const SingleComponent = ({ access, customCaptions, ...route }) => {
	const [state, dispatch] = React.useContext(ModelContext);
	const {
		match: {
			params: { id },
		},
	} = route;

	const navigation = ModelDetailNavigation(
		id,
		state.modelDetail,
		customCaptions
	);
	if (state?.modelDetail?.modelType === "F") {
		navigation.splice(1, 1);
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
				showVersion={route.showVersion}
				onClickSave={openSaveModel}
				onClickVersion={openClickVersion}
				onCLickedSaveChanges={openClickSaveChanges}
				onClickPasteTask={openPasteTaskModel}
				onClickShowChangeStatus={openChangeStatusModel}
				onClickRevert={openConfirmationPopup}
				onNavClick={(path) => route.history.push(path)}
				isPasteTaskDisabled={state.isPasteTaskDisabled}
				isQuestionTaskDisabled={state.isQuestionTaskDisabled}
				customCaptions={customCaptions}
			/>
			{
				<route.component
					state={state}
					dispatch={dispatch}
					modelId={id}
					access={access}
					history={route.history}
					modelDefaultId={state?.modelDetail?.modelID}
					isPublished={state?.modelDetail?.isPublished}
				/>
			}
		</div>
	);
};
export default SingleComponent;
