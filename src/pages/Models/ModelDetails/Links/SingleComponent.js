import React from "react";
import { ModelContext } from "contexts/ModelDetailContext";
import ModelWrapper from "../commonModelHeader";
import ModelDetailNavigation from "constants/navigation/modelDetailNavigation";

const SingleComponent = ({ access, ...route }) => {
	const [state, dispatch] = React.useContext(ModelContext);
	const {
		match: {
			params: { id },
		},
	} = route;

	const navigation = ModelDetailNavigation(id, state.modelDetail);
	if (state.modelDetail.modelType === "F") {
		navigation.splice(1, 1);
	}

	const openAddModel = () => dispatch({ type: "TOGGLE_ADD", payload: true });

	const openSaveModel = () => dispatch({ type: "TOGGLE_SAVE", payload: true });

	const openClickSaveChanges = () =>
		dispatch({ type: "TOGGLE_SAVE_CHANGES", payload: true });

	const openPasteTaskModel = () =>
		dispatch({ type: "TOGGLE_PASTE_TASK", payload: true });

	const openChangeStatusModel = () =>
		dispatch({ type: "TOGGLE_CHANGE_STATUS", payload: true });

	const addAccess = access === "F";
	const showAdd = [route.showAdd, addAccess].every((x) => x === true);

	return (
		<div>
			<ModelWrapper
				ModelName={route.name}
				current={route.name}
				navigation={navigation}
				applicationName="Stage"
				showAdd={showAdd}
				onClickAdd={openAddModel}
				showSave={route.showSave}
				showPasteTask={route.showPasteTask}
				showChangeStatus={
					access === "E" || access === "F" ? route.showChangeStatus : false
				}
				showSaveChanges={route.showSaveChanges}
				onClickSave={openSaveModel}
				onCLickedSaveChanges={openClickSaveChanges}
				onClickPasteTask={openPasteTaskModel}
				onClickShowChangeStatus={openChangeStatusModel}
				onNavClick={(path) => route.history.push(path)}
				isPasteTaskDisabled={state.isPasteTaskDisabled}
			/>
			{
				<route.component
					state={state}
					dispatch={dispatch}
					modelId={id}
					access={access}
					history={route.history}
				/>
			}
		</div>
	);
};
export default SingleComponent;
