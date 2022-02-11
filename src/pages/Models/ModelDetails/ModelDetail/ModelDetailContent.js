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

function ModelDetailContent({ modelId, state, dispatch, access }) {
	const classes = useStyles();
	const [isLoading, setIsLoading] = useState(true);
	const [modelDetailsData, setModelDetailsData] = useState({});
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
			getModelDeparments(modelId),
			getModelNotes(modelId),
			getModelDocuments(modelId),
			getModelTypes(position.siteAppID),
			getSiteDepartments(position.siteAppID),
		]);
		const isResponseError = res.some((data) => !data.status);

		if (isResponseError) {
			reduxDispatch(showError("Error: Could not fetch model details"));
			setModelDetailsData({
				modelDepartments: [],
				modelNotes: [],
				modelDocuments: [],
				modelTypes: [],
				detailDepartments: [],
				details: [],
			});
		} else {
			const changedDocuments = await changeDocumentUrl(res[2].data);
			setModelDetailsData({
				modelDepartments: res[0].data,
				modelNotes: res[1].data,
				modelDocuments: changedDocuments,
				modelTypes: res[3].data,
				detailDepartments: res[4].data,
				details: state.modelDetail,
			});
		}

		setIsLoading(false);
	}, [
		modelId,
		position.siteAppID,
		reduxDispatch,
		changeDocumentUrl,
		state.modelDetail,
	]);

	useEffect(() => {
		fetchAllData();
	}, [fetchAllData]);

	if (isLoading) {
		return <CircularProgress />;
	}

	// checking the access of the user to allow or disallow edit add.
	const isReadOnly = access === "R" || state.modelDetail.isPublished;
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
							isReadOnly={isReadOnly}
						/>
						<Departments
							listOfDepartment={modelDetailsData.modelDepartments}
							customCaptions={customCaptions}
							modelId={modelId}
							isReadOnly={isReadOnly}
						/>
						<Notes
							data={modelDetailsData.modelNotes}
							modelId={modelId}
							isReadOnly={isReadOnly || isEditOnly}
						/>
					</Grid>
					<Grid item lg={6} md={6} xs={12}>
						<Settings
							data={modelDetailsData?.details}
							customCaptions={customCaptions}
							isReadOnly={isReadOnly}
						/>
						<ModelImage
							imageUrl={modelDetailsData?.details?.imageURL}
							modelId={modelId}
							isReadOnly={isReadOnly || isEditOnly}
						/>
						<Documents
							classes={classes}
							modelId={modelId}
							documents={modelDetailsData.modelDocuments}
							isReadOnly={isReadOnly || isEditOnly}
						/>
					</Grid>
				</Grid>
			</div>
		</>
	);
}

export default ModelDetailContent;
