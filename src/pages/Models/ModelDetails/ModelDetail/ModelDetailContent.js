import React, { useCallback, useEffect, useState } from "react";
import { CircularProgress, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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
} from "services/models/modelDetails/details";
import { getModelTypes } from "services/clients/sites/siteApplications/modelTypes";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import ColourConstants from "helpers/colourConstants";
import ChangeStatusPopup from "./ChangeStatusPopup";
import withMount from "components/HOC/withMount";

const useStyles = makeStyles((theme) => ({
	detailContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
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
	const classes = useStyles();
	const [isLoading, setIsLoading] = useState(true);
	const [modelDetailsData, setModelDetailsData] = useState({
		modelDepartments: [],
		modelNotes: [],
		modelDocuments: [],
		modelTypes: [],
		detailDepartments: [],
		details: [],
	});

	const { position, customCaptions } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const reduxDispatch = useDispatch();

	// For downloading the document into the computer.
	const changeDocumentUrl = useCallback(async (documents) => {
		let tempDocuments = [];

		for (const document of documents) {
			try {
				let res = await fetch(document.documentURL);
				let blob = await res?.blob();
				tempDocuments.push({
					...document,
					documentURL: URL.createObjectURL(blob),
				});
			} catch (error) {
				reduxDispatch(showError("Error: Could not change model documents"));
			}
		}

		return Promise.resolve(tempDocuments);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchAllData = useCallback(async () => {
		const res = await Promise.all([
			getModelDeparments(modelDefaultId),
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
				const changedDocuments = res[2].status
					? await changeDocumentUrl(res[2].data)
					: [];
				setModelDetailsData({
					modelDepartments: res[0].data,
					modelNotes: res[1].data || [],
					modelDocuments: changedDocuments,
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
		changeDocumentUrl,
		state.modelDetail,
		isMounted,
		modelDefaultId,
	]);

	useEffect(() => {
		if (
			Object.keys(modelDetailsData).every(
				(prop) => modelDetailsData[prop].length === 0
			)
		)
			fetchAllData();
	}, [fetchAllData, modelDetailsData]);

	if (isLoading) {
		return <CircularProgress />;
	}

	// checking the access of the user to allow or disallow edit add.
	const isReadOnly = access === "R";
	const isEditOnly = access === "E";

	return (
		<>
			<ChangeStatusPopup
				open={state.showChangeStatus}
				onClose={() =>
					dispatch({ type: "TOGGLE_CHANGE_STATUS", payload: false })
				}
			/>
			<div className={classes.detailContainer}>
				<Grid container spacing={2}>
					<Grid item lg={6} md={6} xs={12}>
						<Details
							classes={classes}
							data={modelDetailsData}
							position={position}
							customCaptions={customCaptions}
							isReadOnly={isReadOnly || state?.modelDetail?.isPublished}
							Ctxdispatch={dispatch}
						/>
						<Departments
							listOfDepartment={modelDetailsData.modelDepartments}
							customCaptions={customCaptions}
							modelId={modelDefaultId}
							isReadOnly={isReadOnly}
						/>
						<Notes
							data={modelDetailsData.modelNotes}
							modelId={modelDefaultId}
							isReadOnly={
								isReadOnly || state?.modelDetail?.isPublished || isEditOnly
							}
						/>
					</Grid>
					<Grid item lg={6} md={6} xs={12}>
						<Settings
							data={modelDetailsData?.details}
							customCaptions={customCaptions}
							isReadOnly={isReadOnly || state?.modelDetail?.isPublished}
						/>
						<ModelImage
							imageUrl={modelDetailsData?.details?.imageURL}
							modelId={modelId}
							isReadOnly={
								isReadOnly || state?.modelDetail?.isPublished || isEditOnly
							}
						/>
						<Documents
							classes={classes}
							modelId={modelDefaultId}
							documents={modelDetailsData.modelDocuments}
							isReadOnly={
								isReadOnly || state?.modelDetail?.isPublished || isEditOnly
							}
						/>
					</Grid>
				</Grid>
			</div>
		</>
	);
}

export default withMount(ModelDetailContent);
