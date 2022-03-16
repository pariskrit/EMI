import { CircularProgress } from "@material-ui/core";
import DetailsPanel from "components/Elements/DetailsPanel";
import DragAndDropTable from "components/Modules/DragAndDropTable";
import React, { useCallback, useEffect, useState } from "react";
import {
	deleteModelIntervals,
	getModelIntervals,
	addModelIntervals,
	dragAndDropModelIntervals,
} from "services/models/modelDetails/modelIntervals";
import { useDispatch } from "react-redux";
import AddDialog from "./AddDialog";
import { showError } from "redux/common/actions";
import DeleteDialog from "./DeleteDialog";
import EMICheckbox from "components/Elements/EMICheckbox";
import EditDialog from "./EditDialog";

function ModelInterval({ state, dispatch, modelId, access }) {
	const [isLoading, setIsLoading] = useState(true);
	const [enableAutoIncludeIntervals, setEnableAutoIncludeIntervals] = useState(
		false
	);
	const [modelIntervals, setModelIntervals] = useState([]);
	const [originalModelIntervals, setOriginalModelIntervals] = useState([]);
	const [openDeleteDialog, setOpenDeleteDialog] = useState({
		id: null,
		open: false,
	});
	const [openEditDialog, setOpenEditDialog] = useState({
		isEdit: false,
		dataToEdit: null,
		open: false,
	});
	const [isDeleting, setIsDeleting] = useState(false);
	const reduxDispatch = useDispatch();
	const {
		customCaptions: { interval, intervalPlural, taskListNo, taskListNoPlural },
	} = JSON.parse(localStorage.getItem("me"));

	const onCloseAddDialog = () =>
		dispatch({ type: "TOGGLE_ADD", payload: false });

	const onOpenDeleteDialog = (id) => setOpenDeleteDialog({ id, open: true });

	const onOpenEditDialog = (id) =>
		setOpenEditDialog({
			isEdit: true,
			id: modelIntervals.find((interval) => interval.id === id).id,
			open: true,
		});
	const onCloseEditDialog = (id) =>
		setOpenEditDialog({ isEdit: false, dataToEdit: null, open: false });

	const onCloseDeleteDialog = () =>
		setOpenDeleteDialog({ id: null, open: false });

	const onCheckboxInputChange = () =>
		setEnableAutoIncludeIntervals(!enableAutoIncludeIntervals);

	const setPositionForPayload = (e, listLength) => {
		const { destination, source } = e;
		if (destination.index === listLength - 1) {
			return originalModelIntervals[destination.index]?.pos + 1;
		}
		if (destination.index === 0) {
			return originalModelIntervals[destination.index]?.pos - 1;
		}

		if (destination.index > source.index) {
			return (
				(+originalModelIntervals[destination.index]?.pos +
					+originalModelIntervals[e.destination.index + 1]?.pos) /
				2
			);
		}
		return (
			(+originalModelIntervals[destination.index]?.pos +
				+originalModelIntervals[e.destination.index - 1]?.pos) /
			2
		);
	};

	const handleDragEnd = async (e) => {
		if (!e.destination) {
			return;
		}

		if (e.destination.index === e.source.index) return;

		const result = [...modelIntervals];
		const [removed] = result.splice(e.source.index, 1);
		result.splice(e.destination.index, 0, removed);
		setModelIntervals(result);

		let payloadBody = [
			{
				path: "pos",
				op: "replace",
				value: setPositionForPayload(e, originalModelIntervals.length),
			},
		];
		const response = await dragAndDropModelIntervals(
			e.draggableId,
			payloadBody
		);
		if (response.status) {
			setOriginalModelIntervals(result);
		} else {
			setModelIntervals(originalModelIntervals);
			reduxDispatch(showError(response.data || "Could not drag interval"));
		}
	};

	const handleDelete = async () => {
		const { id } = openDeleteDialog;

		setIsDeleting(true);

		const response = await deleteModelIntervals(id);

		if (response.status) {
			const latestIntervals = modelIntervals.filter(
				(interval) => interval.id !== id
			);
			setModelIntervals([...latestIntervals]);
			dispatch({
				type: "TAB_COUNT",
				payload: { countTab: "intervalCount", data: latestIntervals.length },
			});
		} else {
			reduxDispatch(showError(response.data || "Could not delete intervals"));
		}

		setIsDeleting(false);
		onCloseDeleteDialog();
	};

	const handleAddClick = async (data) => {
		const response = await addModelIntervals({
			modelVersionID: modelId,
			...data,
		});

		if (response.status) {
			await fetchModelIntervals();
		} else {
			reduxDispatch(
				showError(response.data.detail || "Could not add Interval")
			);
		}
	};

	const fetchModelIntervals = useCallback(async () => {
		const response = await getModelIntervals(modelId);

		if (response.status) {
			const tempModelIntervals = response.data.map((interval) => ({
				...interval,
				originalTaskList: interval.taskListNos,
				originalAutoIncludeIntervals: interval.autoIncludeIntervals,
				taskListNos: interval.taskListNos.map((task) => task.name).join(", "),
				autoIncludeIntervals: interval.autoIncludeIntervals
					.map((interval) => interval.name)
					.join(", "),
			}));
			setModelIntervals(tempModelIntervals);
			setOriginalModelIntervals(tempModelIntervals);
			dispatch({
				type: "TAB_COUNT",
				payload: { countTab: "intervalCount", data: response.data.length },
			});
		} else {
			reduxDispatch(showError("Could not fetch intervals"));
		}

		setIsLoading(false);
	}, [modelId, reduxDispatch]);

	useEffect(() => {
		fetchModelIntervals();
	}, [fetchModelIntervals]);
	const isReadOnly = access === "R";
	const isEditOnly = access === "E";
	return (
		<div>
			<AddDialog
				open={state.showAdd}
				closeHandler={onCloseAddDialog}
				autoIncludeIntervals={modelIntervals}
				handleAddData={handleAddClick}
				enableAutoIncludeIntervals={enableAutoIncludeIntervals}
				captions={{ interval, intervalPlural, taskListNo, taskListNoPlural }}
			/>
			<EditDialog
				open={openEditDialog.open}
				closeHandler={onCloseEditDialog}
				enableAutoIncludeIntervals={enableAutoIncludeIntervals}
				intervalId={openEditDialog.id}
				fetchModelIntervals={fetchModelIntervals}
				modelId={modelId}
				captions={{ interval, intervalPlural, taskListNo, taskListNoPlural }}
			/>
			<DeleteDialog
				entityName={interval}
				open={openDeleteDialog.open}
				closeHandler={onCloseDeleteDialog}
				handleDelete={handleDelete}
				isDeleting={isDeleting}
			/>
			<div className="detailsContainer">
				<DetailsPanel
					header={intervalPlural}
					dataCount={state?.modelDetail?.intervalCount}
					description={`Allocate ${intervalPlural} for this asset model`}
				/>
				{isReadOnly ? null : (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							width: "50%",
							justifyContent: "end",
						}}
					>
						<EMICheckbox
							state={enableAutoIncludeIntervals}
							changeHandler={onCheckboxInputChange}
						/>
						<p>Enable Auto-Include of {intervalPlural}</p>
					</div>
				)}
			</div>

			{isLoading ? (
				<CircularProgress />
			) : (
				<DragAndDropTable
					data={modelIntervals}
					headers={["Name", taskListNoPlural, `Auto-Include ${intervalPlural}`]}
					columns={[
						{ id: 1, name: "name", style: { width: "33vw" } },
						{ id: 2, name: "taskListNos", style: { width: "33vw" } },
						{ id: 3, name: "autoIncludeIntervals", style: { width: "33vw" } },
					]}
					handleDragEnd={handleDragEnd}
					isModelEditable={true}
					disableDnd={isReadOnly}
					menuData={[
						{
							name: "Edit",
							handler: onOpenEditDialog,
							isDelete: false,
						},
						{
							name: "Delete",
							handler: onOpenDeleteDialog,
							isDelete: true,
						},
					].filter((x) => {
						if (isReadOnly) return false;
						if (isEditOnly) {
							if (x.name === "Edit") return true;
							else return false;
						}
						return true;
					})}
				/>
			)}
		</div>
	);
}

export default ModelInterval;
