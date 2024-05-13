import React from "react";
import { ServiceContext } from "contexts/ServiceDetailContext";
import ServiceWrapper from "pages/Services/ServiceDetails/commonHeader";
import { serviceReport } from "helpers/routePaths";
import ServiceDetailNavigation from "constants/navigation/serviceDetailNavigation";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const SingleComponent = ({ access, customCaptions, siteAppID, ...route }) => {
	const [state, dispatch] = React.useContext(ServiceContext);
	const { id } = useParams();
	const navigate = useNavigate();

	const navigation = ServiceDetailNavigation(
		id,
		state.serviceDetail,
		customCaptions
	);
	if (state?.modelDetail?.modelType === "F") {
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

	const showPrint = route.path === serviceReport;

	return (
		<div>
			<ServiceWrapper
				state={state}
				ModelName={route.ModelName}
				current={route.name}
				navigation={navigation}
				applicationName="Stage"
				showAdd={showAddButton}
				onClickAdd={openAddModel}
				showSave={route.showSave}
				showPasteTask={showPaste}
				showPrint={showPrint}
				showChangeStatus={
					(route.showChangeStatus && state.serviceDetail.status === "S") ||
					(route.showChangeStatus && state.serviceDetail.status === "T")
						? true
						: false
				}
				showSaveChanges={route.showSaveChanges}
				showVersion={route.showVersion}
				onClickSave={openSaveModel}
				onClickVersion={openClickVersion}
				onCLickedSaveChanges={openClickSaveChanges}
				onClickPasteTask={openPasteTaskModel}
				onClickShowChangeStatus={openChangeStatusModel}
				onNavClick={(path) => navigate(path)}
				isPasteTaskDisabled={state.isPasteTaskDisabled}
				isQuestionTaskDisabled={state.isQuestionTaskDisabled}
				customCaptions={customCaptions}
			/>
			{
				<route.component
					state={state}
					dispatch={dispatch}
					serviceId={id}
					access={access}
					history={route.history}
					modelDefaultId={state?.modelDetail?.modelID}
					customCaptions={customCaptions}
					siteAppID={siteAppID}
				/>
			}
		</div>
	);
};
export default SingleComponent;
