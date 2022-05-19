import React, { useState } from "react";
import { CircularProgress } from "@material-ui/core";
import DetailsPanel from "components/Elements/DetailsPanel";
import DragAndDropTable from "components/Modules/DragAndDropTable";
import AddEditModel from "./AddEditModel";
import {
	editModelStage,
	getModelStage,
} from "services/models/modelDetails/modelStages";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import DeleteDialog from "components/Elements/DeleteDialog";
import withMount from "components/HOC/withMount";
import TabelRowImage from "components/Elements/TabelRowImage";
import { setPositionForPayload } from "helpers/setPositionForPayload";
import ImageViewer from "components/Elements/ImageViewer";
import AutoFitContentInScreen from "components/Layouts/AutoFitContentInScreen";
import {
	ModelStageTableColumn,
	ModelStageTableHeader,
} from "constants/modelDetails";

const modelState = { id: null, open: false };

const ModelStage = ({ state, dispatch, getError, modelId, access }) => {
	const {
		customCaptions: { stage, stagePlural, modelTemplate, asset },
		siteAppID,
		siteID,
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const [data, setData] = useState([]);
	const [stageId, setStageId] = useState(null);
	const [deleteModel, setDeleteModel] = useState(modelState);
	const [loading, setLoading] = useState(false);
	const [originalStageList, setOriginalStageList] = useState([]);
	const [openImage, setOPenImage] = useState(false);
	const [ImageToOpen, setImageToOpen] = useState(null);

	const fetchData = async (showLoading = false) => {
		showLoading && setLoading(true);
		try {
			let res = await getModelStage(modelId);
			if (res.status) {
				const mainData = res.data.map((response) => ({
					...response,
					image: response.imageURL ? (
						<TabelRowImage
							imageURL={response.thumbnailURL}
							imageWrapperHeight="50px"
							onClickImage={() => {
								setOPenImage(true);
								setImageToOpen(response?.imageURL);
							}}
						/>
					) : (
						""
					),
					hasZones: response.hasZones === true ? "Yes" : "",
				}));
				setData(mainData);
				setOriginalStageList(mainData);
				dispatch({
					type: "TAB_COUNT",
					payload: { countTab: "stageCount", data: res.data.length },
				});
			} else {
				if (res.data.detail) getError(res.data.detail);
				else getError("Something went wrong");
			}
		} catch (err) {
			return;
		} finally {
			showLoading && setLoading(false);
		}
	};

	React.useEffect(() => {
		fetchData(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleEdit = (id) => {
		setStageId(id);
		dispatch({ type: "TOGGLE_ADD", payload: true });
	};

	const handleDelete = (id) => setDeleteModel({ id, open: true });

	const handleRemoveData = (id) => {
		const d = [...data].filter((x) => x.id !== id);
		setData(d);
		dispatch({
			type: "TAB_COUNT",
			payload: { countTab: "stageCount", data: d.length },
		});
	};

	const handleDeleteDialogClose = () => {
		setDeleteModel(modelState);
	};

	const handleComplete = async () => {
		await fetchData();
	};

	// handle dragging of zone

	const handleDragEnd = async (e) => {
		if (!e.destination) {
			return;
		}
		if (e.destination.index === e.source.index) return;
		const result = [...data];
		const [removed] = result.splice(e.source.index, 1);
		result.splice(e.destination.index, 0, removed);
		setData(result);

		try {
			let payloadBody = [
				{
					path: "pos",
					op: "replace",
					value: setPositionForPayload(e, originalStageList),
				},
			];
			const response = await editModelStage(e.draggableId, payloadBody);
			if (response.status) {
				const newDate = result.map((x, i) =>
					i === e.destination.index ? { ...x, pos: response.data.pos } : x
				);
				setOriginalStageList(newDate);
				setData(newDate);
			} else {
				setData(originalStageList);
			}
		} catch (error) {
			return;
		}
	};

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<>
			<ImageViewer
				open={openImage}
				onClose={() => {
					setOPenImage(false);
					setImageToOpen(null);
				}}
				imgSource={ImageToOpen}
			/>
			<AddEditModel
				open={state.showAdd}
				handleClose={() => {
					setStageId(null);
					dispatch({ type: "TOGGLE_ADD", payload: false });
				}}
				detailData={[...data].find((x) => x.id === stageId)}
				getError={getError}
				modelVersionID={modelId}
				handleAddEditComplete={handleComplete}
				title={stage}
				siteAppId={siteAppID}
				siteID={siteID}
				modelType={state?.modelDetail?.modelType}
				customCaptionsAsset={asset}
			/>
			<DeleteDialog
				open={deleteModel.open}
				entityName={`Model ${stage}`}
				deleteID={deleteModel.id}
				deleteEndpoint={`/api/modelversionstages`}
				handleRemoveData={handleRemoveData}
				closeHandler={handleDeleteDialogClose}
			/>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div style={{ display: "flex", alignItems: "center" }}>
					<DetailsPanel
						header={`${stagePlural}`}
						dataCount={data.length}
						description={`${stagePlural} used for this ${modelTemplate}`}
					/>
				</div>
				<AutoFitContentInScreen containsTable>
					<DragAndDropTable
						data={data}
						isModelEditable
						disableDnd={access === "R" || state?.modelDetail?.isPublished}
						headers={ModelStageTableHeader(
							state?.modelDetail?.modelType,
							asset
						)}
						columns={ModelStageTableColumn(state?.modelDetail?.modelType)}
						onClickImage={() => setOPenImage(true)}
						handleDragEnd={handleDragEnd}
						menuData={[
							{
								name: "Edit",
								handler: handleEdit,
								isDelete: false,
							},
							{
								name: "Delete",
								handler: handleDelete,
								isDelete: true,
							},
						].filter((x) => {
							if (state?.modelDetail?.isPublished) return false;
							if (access === "F") return true;
							if (access === "E") {
								if (x.name === "Edit") return true;
								else return false;
							}
							return false;
						})}
					/>
				</AutoFitContentInScreen>
			</div>
		</>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(null, mapDispatchToProps)(withMount(ModelStage));
