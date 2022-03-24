import { CircularProgress } from "@material-ui/core";
import DetailsPanel from "components/Elements/DetailsPanel";
import DragAndDropTable from "components/Modules/DragAndDropTable";
import DeleteDialog from "components/Elements/DeleteDialog";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { Apis } from "services/api";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import AddOrEditPermit from "./AddEditPermit";
import {
	addModelTaskPermit,
	getModelTaskPermits,
	patchModelTaskPermit,
} from "services/models/modelDetails/modelTaskPermits";
import withMount from "components/HOC/withMount";
import { TaskContext } from "contexts/TaskDetailContext";
import { setPositionForPayload } from "helpers/setPositionForPayload";

const AT = ActionButtonStyle();

const Permits = ({ taskInfo, access, isMounted }) => {
	const [permits, setPermits] = useState([]);
	const [originalPermits, setOriginalPermits] = useState([]);
	const [selectedID, setSelectedID] = useState(null);

	const [openAddPermit, setOpenAddPermit] = useState(false);
	const [openEditPermit, setOpenEditPermit] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [loading, setLoading] = useState(false);

	const [, CtxDispatch] = useContext(TaskContext);

	const dispatch = useDispatch();

	const fetchPermits = async (showLoading = true) => {
		!isMounted.aborted && showLoading && setLoading(true);
		try {
			const response = await getModelTaskPermits(taskInfo.id);
			if (response.status) {
				if (!isMounted.aborted) {
					setPermits(response?.data);
					setOriginalPermits(response?.data);
				}
				CtxDispatch({
					type: "TAB_COUNT",
					payload: {
						countTab: "permitCount",
						data: response?.data?.length,
					},
				});
			} else {
				dispatch(
					showError(
						response?.data?.title ||
							response?.data ||
							"Could not fetch task permits"
					)
				);
			}
		} catch (error) {
			dispatch(
				showError(
					error?.response?.data ||
						error?.response ||
						"Could not fetch task permits"
				)
			);
		} finally {
			!isMounted.aborted && showLoading && setLoading(false);
		}
	};

	useEffect(() => {
		fetchPermits();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// handle dragging of permit

	const handleDragEnd = async (e) => {
		if (!e.destination) {
			return;
		}

		if (e.destination.index === e.source.index) return;

		const result = [...permits];
		const [removed] = result.splice(e.source.index, 1);
		result.splice(e.destination.index, 0, removed);
		setPermits(result);

		try {
			let payloadBody = [
				{
					path: "pos",
					op: "replace",
					value: setPositionForPayload(e, originalPermits),
				},
			];
			const response = await patchModelTaskPermit(e.draggableId, payloadBody);
			if (response.status) {
				const newDate = result.map((x, i) =>
					i === e.destination.index ? { ...x, pos: response.data.pos } : x
				);
				setOriginalPermits(newDate);
				setPermits(newDate);
			} else {
				setPermits(originalPermits);
			}
		} catch (error) {
			setPermits(originalPermits);
		}
	};

	// show popup for deletion of permit
	const showDeletePermitPopUp = (TaskPartID) => {
		setOpenDeleteDialog(true);
		setSelectedID(TaskPartID);
	};

	// remove permit from permit list
	const handleRemoveData = (id) => {
		const newData = [...permits].filter(function (item) {
			return item.id !== id;
		});
		setPermits(newData);
		setOriginalPermits(newData);
		CtxDispatch({
			type: "TAB_COUNT",
			payload: {
				countTab: "permitCount",
				data: newData.length,
			},
		});
	};

	const createPermit = async (newPermit) => {
		return await addModelTaskPermit({
			ModelVersionTaskID: taskInfo.id,
			...newPermit,
		});
	};

	// show popUp for edit of permit
	const showEditPermitPopUp = (row) => {
		row = permits.find((r) => r.id === row);
		setOpenEditPermit(true);
		setSelectedID(row);
	};

	const editPermit = async (payload) => {
		return await patchModelTaskPermit(selectedID.id, [
			{ op: "replace", path: "name", value: payload.name },
		]);
	};

	if (loading) return <CircularProgress />;
	return (
		<div style={{ marginBottom: "20px" }}>
			<AddOrEditPermit
				open={openAddPermit}
				title={`Add Permit`}
				closeHandler={() => {
					setOpenAddPermit(false);
				}}
				data={null}
				createProcessHandler={createPermit}
				fetchData={() => fetchPermits(false)}
			/>
			<AddOrEditPermit
				open={openEditPermit}
				title={`Edit Permit`}
				closeHandler={() => {
					setOpenEditPermit(false);
				}}
				data={{
					name: selectedID?.name,
				}}
				createProcessHandler={editPermit}
				fetchData={() => fetchPermits(false)}
			/>
			<DeleteDialog
				entityName={`Permit`}
				open={openDeleteDialog}
				closeHandler={() => setOpenDeleteDialog(false)}
				deleteEndpoint={Apis.ModelVersionTaskPermits}
				deleteID={selectedID}
				handleRemoveData={handleRemoveData}
			/>
			<div
				className="detailsContainer topContainerCustomCaptions"
				style={{ alignItems: "center" }}
			>
				<DetailsPanel header={`Permits`} dataCount={permits.length} />
				{access === "F" && (
					<AT.GeneralButton
						onClick={() => {
							setOpenAddPermit(true);
						}}
					>
						Add Permit
					</AT.GeneralButton>
				)}
			</div>
			<DragAndDropTable
				data={permits}
				headers={["Name"]}
				columns={[{ id: 2, name: "name" }]}
				handleDragEnd={handleDragEnd}
				menuData={[
					{
						name: "Edit",
						handler: showEditPermitPopUp,
						isDelete: false,
					},
					{
						name: "Delete",
						handler: showDeletePermitPopUp,
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

export default withMount(Permits);
