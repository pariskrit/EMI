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
import { setPositionForPayload } from "helpers/setPositionForPayload";
import { updateModel } from "services/models/modelDetails/details";

function ModelInterval({ state, dispatch, modelId, access, modelDefaultId }) {
	const [isLoading, setIsLoading] = useState(true);
	const [isDisabled, setDisabled] = useState(false);

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
		customCaptions: {
			interval,
			intervalPlural,
			taskListNo,
			taskListNoPlural,
			modelTemplate,
		},
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

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

	const onCheckboxInputChange = async () => {
		dispatch({ type: "TOGGLE_ENABLE_INTERVALS" });

		setDisabled(true);
		const response = await updateModel(modelId, [
			{
				path: "EnableIntervalAutoInclude",
				op: "replace",
				value: !state?.modelDetail?.enableIntervalAutoInclude,
			},
		]);

		if (!response.status) {
			dispatch({ type: "TOGGLE_ENABLE_INTERVALS" });
		}

		setDisabled(false);
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
				value: setPositionForPayload(e, originalModelIntervals),
			},
		];
		const response = await dragAndDropModelIntervals(
			e.draggableId,
			payloadBody
		);
		if (response.status) {
			const newDate = result.map((x, i) =>
				i === e.destination.index ? { ...x, pos: response.data.pos } : x
			);
			setOriginalModelIntervals(newDate);
			setModelIntervals(newDate);
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
				showError(
					response.data || response.data.detail || "Could not add Interval"
				)
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
				taskListNos: interval.taskListNos
					.sort((a, b) => a.name.localeCompare(b.name))
					.map((task) => task.name)
					.join(", "),
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
	}, [modelId, reduxDispatch, dispatch]);

	useEffect(() => {
		if (modelIntervals.length === 0) fetchModelIntervals();
	}, [fetchModelIntervals, modelIntervals]);
	const isReadOnly = access === "R";
	const isEditOnly = access === "E";

	if (isLoading) {
		return <CircularProgress />;
	}
	return (
		<div>
			<AddDialog
				open={state.showAdd}
				closeHandler={onCloseAddDialog}
				autoIncludeIntervals={modelIntervals}
				handleAddData={handleAddClick}
				enableAutoIncludeIntervals={
					state?.modelDetail?.enableIntervalAutoInclude
				}
				captions={{ interval, intervalPlural, taskListNo, taskListNoPlural }}
			/>
			<EditDialog
				open={openEditDialog.open}
				closeHandler={onCloseEditDialog}
				enableAutoIncludeIntervals={
					state?.modelDetail?.enableIntervalAutoInclude
				}
				intervalId={openEditDialog.id}
				fetchModelIntervals={fetchModelIntervals}
				modelId={modelDefaultId}
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
					description={`Allocate ${intervalPlural} for this ${modelTemplate}`}
				/>
				{isReadOnly || state?.modelDetail?.isPublished ? null : (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							width: "50%",
							justifyContent: "end",
						}}
					>
						<EMICheckbox
							state={state?.modelDetail?.enableIntervalAutoInclude}
							changeHandler={onCheckboxInputChange}
							disabled={isDisabled}
						/>
						<p>Enable Auto-Include of {intervalPlural}</p>
					</div>
				)}
			</div>

			<DragAndDropTable
				data={modelIntervals}
				headers={
					state?.modelDetail?.enableIntervalAutoInclude
						? ["Name", `Auto-Include ${intervalPlural}`, taskListNoPlural]
						: ["Name", taskListNoPlural]
				}
				columns={
					state?.modelDetail?.enableIntervalAutoInclude
						? [
								{ id: 1, name: "name", style: { width: "33vw" } },
								{
									id: 2,
									name: "autoIncludeIntervals",
									style: { width: "33vw" },
								},
								{
									id: 3,
									name: "taskListNos",
									style: { width: "33vw" },
								},
						  ]
						: [
								{ id: 1, name: "name", style: { width: "50vw" } },
								{ id: 2, name: "taskListNos", style: { width: "50vw" } },
						  ]
				}
				handleDragEnd={handleDragEnd}
				isModelEditable={true}
				disableDnd={isReadOnly || state?.modelDetail?.isPublished}
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
					if (state?.modelDetail?.isPublished) return false;

					if (isReadOnly) return false;
					if (isEditOnly) {
						if (x.name === "Edit") return true;
						else return false;
					}
					return true;
				})}
			/>
		</div>
	);
}

export default ModelInterval;
