import React, { useEffect, useState, useContext } from "react";
import { connect } from "react-redux";
import { CircularProgress, makeStyles } from "@material-ui/core";
import ColourConstants from "helpers/colourConstants";
import {
	deleteStages,
	getStages,
	patchStages,
	postStages,
} from "services/models/modelDetails/modelTasks/stages";
import {
	getSiteAssets,
	getSiteAssetsCount,
} from "services/clients/sites/siteAssets";
import { showError } from "redux/common/actions";
import ListStages from "./ListStages";
import withMount from "components/HOC/withMount";
import { ModelContext } from "contexts/ModelDetailContext";
import DetailsPanel from "components/Elements/DetailsPanel";

const useStyles = makeStyles({
	stages: { display: "flex", flexDirection: "column", marginBottom: 12 },
	tableHeadRow: {
		borderBottomColor: ColourConstants.tableBorder,
		borderBottomStyle: "solid",
		borderBottomWidth: 1,
		backgroundColor: ColourConstants.tableBackground,
		fontWeight: "bold",
		borderRightColor: "#979797",
		borderRightStyle: "solid",
		borderRightWidth: "1px",
	},
	table: {
		borderStyle: "solid",
		fontFamily: "Roboto Condensed",
		fontSize: 14,
		overflowX: "auto",
		borderColor: ColourConstants.tableBorder,
		borderWidth: 1,
		borderRadius: 0,
	},
});

const Stages = ({ taskInfo, getError, isMounted }) => {
	const me =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const classes = useStyles();
	const [
		{
			modelDetail: { modelType },
		},
	] = useContext(ModelContext);
	const [stages, setStages] = useState({
		loading: false,
		data: [],
		assets: [],
		assetCount: 0,
		stageCount: taskInfo.stageCount,
	});

	// const setState = (state) => setStages((th) => ({ ...th, ...state }));

	const errorResponse = (result) => {
		if (result.data.detail) getError(result.data.detail);
		else getError("Something went wrong");
	};

	const fetchTaskStages = async () => {
		try {
			let result = await getStages(taskInfo.id);
			if (result.status) {
				if (!isMounted.aborted)
					setStages((th) => ({ ...th, data: result.data }));
			} else {
				errorResponse(result);
			}
		} catch (e) {
			return;
		}
	};

	const fetchAssets = async (p = {}, prevData = []) => {
		try {
			let result = await getSiteAssets(me?.siteID, p.pNo, p.pSize, p.search);
			if (result.status) {
				if (!isMounted.aborted)
					setStages((th) => ({ ...th, assets: [...prevData, ...result.data] }));
			} else {
				errorResponse(result);
			}
		} catch (e) {
			return;
		}
	};

	const getAssetsCount = async () => {
		try {
			let result = await getSiteAssetsCount(me?.siteID);
			if (result.status) {
				if (!isMounted.aborted)
					setStages((th) => ({ ...th, assetCount: result.data }));
			} else {
				errorResponse(result);
			}
		} catch (e) {
			return;
		}
	};

	const fetchAll = async () => {
		setStages((th) => ({ ...th, loading: true }));
		await fetchTaskStages();
		if (modelType === "F") {
			await Promise.all([
				fetchAssets({ pNo: 1, pSize: 10, search: "" }),
				getAssetsCount(),
			]);
		}
		setStages((th) => ({ ...th, loading: false }));
	};

	useEffect(() => {
		fetchAll();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handlePatch = async (id, asset) => {
		try {
			let result = await patchStages(id, [
				{ op: "replace", path: "siteAssetID", value: asset.id || null },
			]);
			if (!isMounted.isAborted) {
				if (result.status) {
					const mainData = stages.data.map((x) =>
						x.id === id
							? { ...x, siteAssetName: asset.name, siteAssetID: asset.id }
							: x
					);
					setStages((th) => ({ ...th, data: mainData }));
					return { success: true };
				} else {
					// For asset change so if error, then selected will have current asset instead of new updated
					const stageAsset = stages.data.find((x) => x.id === id);
					errorResponse(result);
					return {
						success: false,
						data: {
							id: stageAsset.siteAssetID,
							name: stageAsset.siteAssetName,
						},
					};
				}
			}
		} catch (e) {
			return;
		}
	};

	const handlePost = async (data) => {
		data["ModelVersionTaskID"] = taskInfo.id;
		try {
			let res = await postStages(data);
			if (!isMounted.aborted) {
				if (res.status) {
					const updated = stages.data.map((x) =>
						x.modelVersionStageID === data.ModelVersionStageID
							? {
									...x,
									id: res.data,
							  }
							: x
					);
					setStages((th) => ({
						...th,
						data: updated,
						stageCount: stages.stageCount + 1,
					}));
					return { success: true };
				} else {
					// Post is for selected so if error, then selected will be deselected
					return { success: false, data: false };
				}
			}
		} catch (e) {
			return;
		}
	};

	const handleDelete = async (stageId) => {
		try {
			let res = await deleteStages(stageId);
			if (!isMounted.aborted) {
				if (res.status) {
					const updated = stages.data.map((x) =>
						x.id === stageId
							? {
									...x,
									id: null,
									siteAssetID: null,
									siteAssetName: null,
							  }
							: x
					);
					setStages((th) => ({
						...th,
						data: updated,
						stageCount: stages.stageCount - 1,
					}));
					return { success: true };
				} else {
					// Delete is for deselected so if error, then deselected will be selected
					return { success: false, data: true };
				}
			}
		} catch (e) {
			return;
		}
	};

	if (stages.loading) {
		return <CircularProgress />;
	}

	return (
		<div className={classes.stages}>
			<DetailsPanel
				header={me.customCaptions.stagePlural}
				dataCount={stages.stageCount}
			/>
			<ListStages
				classes={classes}
				data={stages.data}
				assets={stages.assets}
				count={stages.assetCount}
				patchStage={handlePatch}
				postStage={handlePost}
				deleteStage={handleDelete}
				modelType={modelType}
				pageChange={fetchAssets}
				modelAccess={me?.position?.modelAccess}
			/>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(null, mapDispatchToProps)(withMount(Stages));
