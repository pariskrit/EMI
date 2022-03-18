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

const modelState = { id: null, open: false };

const ModelStage = ({ state, dispatch, getError, modelId, access }) => {
	const {
		customCaptions: { stage, stagePlural },
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const [data, setData] = useState([]);
	const [stageId, setStageId] = useState(null);
	const [deleteModel, setDeleteModel] = useState(modelState);
	const [loading, setLoading] = useState(false);
	const [originalStageList, setOriginalStageList] = useState([]);

	const fetchData = async () => {
		setLoading(true);
		try {
			let res = await getModelStage(modelId);
			if (res.status) {
				const mainData = res.data.map((response) => ({
					...response,
					image: (
						<TabelRowImage
							imageURL={response.imageURL}
							imageWrapperHeight="50px"
						/>
					),
					hasZones: response.hasZones === true ? "Yes" : "",
				}));
				setLoading(false);
				setData(mainData);
				setOriginalStageList(mainData);
			} else {
				setLoading(false);
				if (res.data.detail) getError(res.data.detail);
				else getError("Something went wrong");
			}
		} catch (err) {
			return;
		}
	};

	React.useEffect(() => {
		fetchData();
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

	const handleComplete = (response) => {
		const res = {
			...response,
			image: (
				<TabelRowImage imageURL={response.imageURL} imageWrapperHeight="50px" />
			),
			hasZones: response.hasZones === true ? "Yes" : "",
		};
		// if Edit Mode
		if (stageId) {
			let d = data.map((x) => (x.id === response.id ? res : x));
			setData(d);
		} else {
			let d = data;
			d.push(res);
			setData(d);
			dispatch({
				type: "TAB_COUNT",
				payload: { countTab: "stageCount", data: d.length },
			});
		}
	};

	// handle dragging of zone
	const setPositionForPayload = (e, listLength) => {
		const { destination, source } = e;
		if (destination.index === listLength - 1) {
			return originalStageList[destination.index]?.pos + 1;
		}
		if (destination.index === 0) {
			return originalStageList[destination.index]?.pos - 1;
		}

		if (destination.index > source.index) {
			return (
				(+originalStageList[destination.index]?.pos +
					+originalStageList[e.destination.index + 1]?.pos) /
				2
			);
		}
		return (
			(+originalStageList[destination.index]?.pos +
				+originalStageList[e.destination.index - 1]?.pos) /
			2
		);
	};

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
					value: setPositionForPayload(e, originalStageList.length),
				},
			];
			const response = await editModelStage(e.draggableId, payloadBody);
			if (response.status) {
				setOriginalStageList(result);
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
						header={`Model ${stagePlural}`}
						dataCount={data.length}
						description={`${stagePlural} managed to this asset model`}
					/>
				</div>

				<DragAndDropTable
					data={data}
					isModelEditable
					disableDnd={access === "R"}
					headers={["Name", "Image", "HasZones"]}
					columns={[
						{ id: 1, name: "name", style: { width: "40vw" } },
						{ id: 2, name: "image", style: { width: "40vw" } },
						{ id: 3, name: "hasZones", style: { width: "20vw" } },
					]}
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
						if (access === "F") return true;
						if (access === "E") {
							if (x.name === "Edit") return true;
							else return false;
						}
						return false;
					})}
				/>
			</div>
		</>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(null, mapDispatchToProps)(withMount(ModelStage));
