import { CircularProgress } from "@material-ui/core";
import DetailsPanel from "components/Elements/DetailsPanel";
import DragAndDropTable from "components/Modules/DragAndDropTable";
import DeleteDialog from "components/Elements/DeleteDialog";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import {
	getModelTaskParts,
	addModelTaskPart,
	patchModelTaskPart,
} from "services/models/modelDetails/modelTaskParts";
import { Apis } from "services/api";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import AddOrEditPart from "./AddOrEditPart";
import withMount from "components/HOC/withMount";
import { TaskContext } from "contexts/TaskDetailContext";
import { setPositionForPayload } from "helpers/setPositionForPayload";

const AT = ActionButtonStyle();

const Parts = ({ taskInfo, access, isMounted }) => {
	const [parts, setParts] = useState([]);
	const [originalParts, setOriginalParts] = useState([]);
	const [selectedID, setSelectedID] = useState(null);

	const [openAddPart, setOpenAddPart] = useState(false);
	const [openEditPart, setOpenEditPart] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [loading, setLoading] = useState(false);

	const [, CtxDispatch] = useContext(TaskContext);

	const dispatch = useDispatch();

	const { customCaptions } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const fetchParts = async (showLoading = true) => {
		!isMounted.aborted && showLoading && setLoading(true);
		try {
			const response = await getModelTaskParts(taskInfo.id);
			if (response.status) {
				if (!isMounted.aborted) {
					setParts(response?.data);
					setOriginalParts(response?.data);
				}
				CtxDispatch({
					type: "TAB_COUNT",
					payload: {
						countTab: "partCount",
						data: response?.data?.length,
					},
				});
			} else {
				dispatch(
					showError(
						response?.data?.title ||
							response?.data ||
							"Could not fetch task parts"
					)
				);
			}
		} catch (error) {
			dispatch(
				showError(
					error?.response?.data ||
						error?.response ||
						"Could not update task detail"
				)
			);
		} finally {
			!isMounted.aborted && showLoading && setLoading(false);
		}
	};

	useEffect(() => {
		fetchParts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// handle dragging of part

	const handleDragEnd = async (e) => {
		if (!e.destination) {
			return;
		}

		if (e.destination.index === e.source.index) return;

		const result = [...parts];
		const [removed] = result.splice(e.source.index, 1);
		result.splice(e.destination.index, 0, removed);
		setParts(result);

		try {
			let payloadBody = [
				{
					path: "pos",
					op: "replace",
					value: setPositionForPayload(e, originalParts),
				},
			];
			const response = await patchModelTaskPart(e.draggableId, payloadBody);
			if (response.status) {
				const newDate = result.map((x, i) =>
					i === e.destination.index ? { ...x, pos: response.data.pos } : x
				);
				setOriginalParts(newDate);
				setParts(newDate);
			} else {
				setParts(originalParts);
			}
		} catch (error) {
			setParts(originalParts);
		}
	};

	// show popup for deletion of part
	const showDeleteZonePopUp = (TaskPartID) => {
		setOpenDeleteDialog(true);
		setSelectedID(TaskPartID);
	};

	// remove zone from part list
	const handleRemoveData = (id) => {
		const newData = [...parts].filter(function (item) {
			return item.id !== id;
		});
		setParts(newData);
		setOriginalParts(newData);
		CtxDispatch({
			type: "TAB_COUNT",
			payload: {
				countTab: "partCount",
				data: newData.length,
			},
		});
	};

	const createPart = async (newPart) => {
		return await addModelTaskPart({
			modelVersionTaskID: taskInfo.id,
			...newPart,
		});
	};

	// show popUp for edit of parts
	const showEditPartPopUp = (row) => {
		row = parts.find((r) => r.id === row);
		setOpenEditPart(true);
		setSelectedID(row);
	};

	const editPart = async (payload) => {
		return await patchModelTaskPart(selectedID.id, [
			{ op: "replace", path: "name", value: payload.name },
			{ op: "replace", path: "description", value: payload.description },
			{ op: "replace", path: "stockNumber", value: payload.stockNumber },
			{ op: "replace", path: "qty", value: payload.qty },
		]);
	};

	if (loading) return <CircularProgress />;
	return (
		<div style={{ marginBottom: "20px" }}>
			<AddOrEditPart
				open={openAddPart}
				title={`Add ${customCaptions.part}`}
				closeHandler={() => {
					setOpenAddPart(false);
				}}
				data={null}
				createProcessHandler={createPart}
				fetchData={() => fetchParts(false)}
				customCaptions={customCaptions}
			/>
			<AddOrEditPart
				open={openEditPart}
				title={`${customCaptions.part}`}
				closeHandler={() => {
					setOpenEditPart(false);
				}}
				isEdit
				data={{
					name: selectedID?.name,
					stockNumber: selectedID?.stockNumber,
					description: selectedID?.description,
					qty: selectedID?.qty,
				}}
				createProcessHandler={editPart}
				fetchData={() => fetchParts(false)}
				customCaptions={customCaptions}
			/>
			<DeleteDialog
				entityName={`${customCaptions.part}`}
				open={openDeleteDialog}
				closeHandler={() => setOpenDeleteDialog(false)}
				deleteEndpoint={Apis.ModelVersionTaskParts}
				deleteID={selectedID}
				handleRemoveData={handleRemoveData}
			/>
			<div
				className="detailsContainer topContainerCustomCaptions"
				style={{ alignItems: "center" }}
			>
				<DetailsPanel
					header={`${customCaptions.partPlural}`}
					dataCount={parts.length}
				/>
				{access === "F" && (
					<AT.GeneralButton
						onClick={() => {
							setOpenAddPart(true);
						}}
					>
						Add {customCaptions.part}
					</AT.GeneralButton>
				)}
			</div>
			<DragAndDropTable
				data={parts}
				headers={[
					customCaptions?.partQuantity,
					customCaptions?.partName,
					customCaptions?.partStockNumber,
					customCaptions?.partDescription,
				]}
				columns={[
					{ id: 1, name: "qty", style: { width: "12vw" } },
					{ id: 2, name: "name", style: { width: "30vw" } },
					{ id: 3, name: "stockNumber", style: { width: "30vw" } },
					{ id: 4, name: "description", style: { width: "30vw" } },
				]}
				handleDragEnd={handleDragEnd}
				menuData={[
					{
						name: "Edit",
						handler: showEditPartPopUp,
						isDelete: false,
					},
					{
						name: "Delete",
						handler: showDeleteZonePopUp,
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
				isModelEditable
				disableDnd={access === "R"}
			/>
		</div>
	);
};

export default withMount(Parts);
