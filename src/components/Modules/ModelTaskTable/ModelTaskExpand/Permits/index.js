import { CircularProgress } from "@material-ui/core";
import DetailsPanel from "components/Elements/DetailsPanel";
import DragAndDropTable from "components/Modules/DragAndDropTable";
import DeleteDialog from "components/Elements/DeleteDialog";
import React, { useEffect, useState } from "react";
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

const AT = ActionButtonStyle();

const Permits = ({ taskInfo, access, isMounted }) => {
	const [permits, setPermits] = useState([]);
	const [originalPermits, setOriginalPermits] = useState([]);
	const [selectedID, setSelectedID] = useState(null);

	const [openAddPermit, setOpenAddPermit] = useState(false);
	const [openEditPermit, setOpenEditPermit] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [loading, setLoading] = useState(false);

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
	const setPositionForPayload = (e, listLength) => {
		const { destination, source } = e;
		if (destination.index === listLength - 1) {
			return originalPermits[destination.index]?.pos + 1;
		}
		if (destination.index === 0) {
			return originalPermits[destination.index]?.pos - 1;
		}

		if (destination.index > source.index) {
			return (
				(+originalPermits[destination.index]?.pos +
					+originalPermits[e.destination.index + 1]?.pos) /
				2
			);
		}
		return (
			(+originalPermits[destination.index]?.pos +
				+originalPermits[e.destination.index - 1]?.pos) /
			2
		);
	};

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
					value: setPositionForPayload(e, originalPermits.length),
				},
			];
			const response = await patchModelTaskPermit(e.draggableId, payloadBody);
			if (response.status) {
				setOriginalPermits(result);
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
				entityName={`Model Permit`}
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
