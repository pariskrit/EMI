import React, { useState } from "react";
import { CircularProgress } from "@material-ui/core";
import DetailsPanel from "components/Elements/DetailsPanel";
import DragAndDropTable from "components/Modules/DragAndDropTable";
import AddEditModel from "./AddEditModel";
import { editModelStatus, getModelStatus } from "services/models/modelStages";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import DeleteDialog from "components/Elements/DeleteDialog";

const modelState = { id: null, open: false };

const ModelStage = ({ state, dispatch, getError, modelId, access }) => {
	const [data, setData] = useState([]);
	const [stageId, setStageId] = useState(null);
	const [deleteModel, setDeleteModel] = useState(modelState);
	const [loading, setLoading] = useState(false);

	const fetchData = async () => {
		setLoading(true);
		try {
			let res = await getModelStatus(modelId);
			if (res.status) {
				const mainData = res.data.map((response) => ({
					...response,
					image: (
						<img src={response.imageURL} alt="" style={{ width: "20%" }} />
					),
					hasZones: response.hasZones === true ? "Yes" : "",
				}));
				setLoading(false);
				setData(mainData);
			} else {
				setLoading(false);
				getError(res.data.detail);
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
	};

	const handleDeleteDialogClose = () => {
		setDeleteModel(modelState);
	};

	const handleComplete = (response) => {
		const res = {
			...response,
			image: <img src={response.imageURL} alt="" style={{ width: "20%" }} />,
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
		}
	};

	const handleDragEnd = async (e) => {
		if (!e.destination) {
			return;
		}
		const originalStages = [...data];
		const result = [...data];
		const [removed] = result.splice(e.source.index, 1);
		result.splice(e.destination.index, 0, removed);
		setData(result);

		try {
			let payloadBody = [
				{
					path: "pos",
					op: "replace",
					value:
						e.destination.index > e.source.index
							? +originalStages[e.destination.index]?.pos + 1
							: +originalStages[e.destination.index]?.pos - 1,
				},
			];
			const response = await editModelStatus(e.draggableId, payloadBody);
			if (response.status) {
				return true;
			} else {
				setData(originalStages);
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
			/>
			<DeleteDialog
				open={deleteModel.open}
				entityName="Model Stage"
				deleteID={deleteModel.id}
				deleteEndpoint={`/api/modelversionstages`}
				handleRemoveData={handleRemoveData}
				closeHandler={handleDeleteDialogClose}
			/>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div style={{ display: "flex", alignItems: "center" }}>
					<DetailsPanel
						header={"Model Stage"}
						dataCount={data.length}
						description="Stages managed to this asset model"
					/>
				</div>

				<DragAndDropTable
					data={data}
					headers={["Name", "Image", "HasZones"]}
					columns={[
						{ id: 1, name: "name", style: {} },
						{ id: 2, name: "image", style: {} },
						{ id: 3, name: "hasZones", style: {} },
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

export default connect(null, mapDispatchToProps)(ModelStage);
