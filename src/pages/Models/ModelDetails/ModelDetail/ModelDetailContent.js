import React, { useCallback, useEffect, useState } from "react";
import { CircularProgress, Grid } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import Details from "./Details";
import Notes from "./Notes";
import Settings from "./Settings";
import Departments from "./Departments";
import ModelImage from "./ModelImage";
import Documents from "./Documents";
import {
	getModelDeparments,
	getModelDocuments,
	getModelNotes,
	getSiteDepartments,
	revertVersion,
} from "services/models/modelDetails/details";
import { getModelTypes } from "services/clients/sites/siteApplications/modelTypes";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import ColourConstants from "helpers/colourConstants";
import ChangeStatusPopup from "./ChangeStatusPopup";
import withMount from "components/HOC/withMount";
import NewVersionPopUp from "./NewVersionPopUp";
import AutoFitContentInScreen from "components/Layouts/AutoFitContentInScreen";
import ConfirmChangeDialog from "components/Elements/ConfirmChangeDialog";
import TabTitle from "components/Elements/TabTitle";
import { coalesc } from "helpers/utils";
import HistoryBar from "components/Modules/HistorySidebar/HistoryBar";
import { DetailPage } from "services/History/models";
import { HistoryCaptions } from "helpers/constants";

const useStyles = makeStyles()((theme) => ({
	detailContainer: {
		marginTop: 25,
	},

	logoContentParent: {
		width: "100%",
	},
	uploaderContainer: {
		marginTop: "2%",
	},
	tableHead: {
		backgroundColor: "#D2D2D9",
		border: "1px solid",
	},
	deleteIcon: {
		transform: "scale(0.7)",
		color: ColourConstants.deleteButton,
		"&:hover": {
			cursor: "pointer",
		},
	},
	inputContainer: {
		display: "flex",
		flexDirection: "column",
		width: "100%",
	},
	documentError: {
		color: "#E21313",
		margin: "8px 0",
	},
}));

function ModelDetailContent({
	modelId,
	modelDefaultId,
	state,
	dispatch,
	access,
	isMounted,
}) {
	const { classes, cx } = useStyles();
	const [isLoading, setIsLoading] = useState(true);
	const [modelDetailsData, setModelDetailsData] = useState({
		modelDepartments: [],
		modelNotes: [],
		modelDocuments: [],
		modelTypes: [],
		detailDepartments: [],
		details: [],
	});
	const [revertingVersion, setRevertingVersion] = useState(false);

	const { position, customCaptions, application } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const reduxDispatch = useDispatch();

	const handleRevertVersion = async () => {
		setRevertingVersion(true);
		const response = await revertVersion(modelId);

		if (response.status) {
			dispatch({
				type: "REVERT_VERSION",
				payload: modelDetailsData.details.version,
			});
		} else {
			reduxDispatch(
				showError(
					response?.data || response?.data?.detail || "Could not revert version"
				)
			);
		}

		setRevertingVersion(false);
		closeConfirmationPopup();
	};

	const closeConfirmationPopup = () =>
		dispatch({ type: "TOGGLE_CONFIRMATION_POPUP", payload: false });

	const fetchAllData = useCallback(async () => {
		const res = await Promise.all([
			getModelDeparments(modelId),
			getModelNotes(modelDefaultId),
			getModelDocuments(modelDefaultId),
			getModelTypes(position.siteAppID),
			getSiteDepartments(position.siteAppID),
		]);
		const response2 = res.some((data) => data.status);

		if (!response2) {
			reduxDispatch(showError("Error: Could not fetch model details"));
		} else {
			if (!isMounted.aborted) {
				setModelDetailsData({
					modelDepartments: res[0].data,
					modelNotes: res[1].data || [],
					modelDocuments: res[2].data || [],
					modelTypes: res[3].data || [],
					detailDepartments: res[4].data || [],
					details: state.modelDetail,
				});
			}
		}

		if (!isMounted.aborted) setIsLoading(false);
	}, [
		position.siteAppID,
		reduxDispatch,
		state.modelDetail,
		isMounted.aborted,
		modelDefaultId,
		modelId,
	]);

	useEffect(() => {
		// if (
		// 	Object.keys(modelDetailsData).every(
		// 		(prop) => modelDetailsData[prop].length === 0
		// 	)
		// )
		fetchAllData();
	}, [fetchAllData, modelId]);

	useEffect(() => {
		setModelDetailsData({
			...modelDetailsData,
			details: state?.modelDetail,
		});
	}, [state.modelDetail]);

	if (isLoading) {
		return <CircularProgress />;
	}

	// checking the access of the user to allow or disallow edit add.
	const isReadOnly = access === "R";
	const isEditOnly = access === "E";
	return (
		<>
			{state && application.name && (
				<TabTitle
					title={`${state?.modelDetail?.name} ${coalesc(
						state?.modelDetail?.modelName
					)} | ${application.name}`}
				/>
			)}
			<ConfirmChangeDialog
				open={state.showConfirmationPopup}
				closeHandler={closeConfirmationPopup}
				message="Do you want to revert the Active Version to this Version"
				handleChangeConfirm={handleRevertVersion}
				isUpdating={revertingVersion}
			/>
			<ChangeStatusPopup
				open={state.showChangeStatus}
				onClose={() =>
					dispatch({ type: "TOGGLE_CHANGE_STATUS", payload: false })
				}
			/>
			<NewVersionPopUp
				open={state.showVersion}
				onClose={() => dispatch({ type: "TOOGLE_VERSION", payload: false })}
			/>

			<HistoryBar
				id={modelId}
				showhistorybar={state.showhistorybar}
				dispatch={dispatch}
				fetchdata={(id, pageNumber, pageSize) =>
					DetailPage(id, pageNumber, pageSize)
				}
				origin={HistoryCaptions.modelVersions}
			/>
			<div className={classes.detailContainer}>
				<AutoFitContentInScreen loading={isLoading}>
					<Grid container spacing={2}>
						<Grid item lg={6} md={6} xs={12}>
							<Details
								classes={classes}
								data={modelDetailsData}
								position={position}
								customCaptions={customCaptions}
								isReadOnly={isReadOnly || state?.modelDetail?.isPublished}
								Ctxdispatch={dispatch}
								application={application}
							/>
							<Departments
								listOfDepartment={modelDetailsData.modelDepartments}
								customCaptions={customCaptions}
								modelId={modelId}
								isReadOnly={isReadOnly}
								isPublished={state?.modelDetail?.isPublished}
							/>
							<Notes
								data={modelDetailsData.modelNotes}
								modelId={modelDefaultId}
								isReadOnly={isReadOnly || isEditOnly}
							/>
						</Grid>
						<Grid item lg={6} md={6} xs={12}>
							<Settings
								Ctxdispatch={dispatch}
								data={modelDetailsData?.details}
								customCaptions={customCaptions}
								isReadOnly={isReadOnly || state?.modelDetail?.isPublished}
							/>
							<ModelImage
								imageUrl={modelDetailsData?.details?.imageURL}
								thumbnailURL={modelDetailsData?.details?.thumbnailURL}
								modelId={modelId}
								customCaptions={customCaptions}
								isReadOnly={
									isReadOnly || state?.modelDetail?.isPublished || isEditOnly
								}
							/>
							<Documents
								classes={classes}
								modelId={modelDefaultId}
								documents={modelDetailsData.modelDocuments}
								isReadOnly={isReadOnly || isEditOnly}
								customCaptions={customCaptions}
							/>
						</Grid>
					</Grid>
				</AutoFitContentInScreen>
			</div>
		</>
	);
}

export default withMount(ModelDetailContent);
