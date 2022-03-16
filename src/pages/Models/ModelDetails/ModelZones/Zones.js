import { CircularProgress } from "@material-ui/core";
import DetailsPanel from "components/Elements/DetailsPanel";
import DragAndDropTable from "components/Modules/DragAndDropTable";
import React, { useEffect, useState } from "react";
import {
	addNewModelZone,
	EditableModelVersionCheck,
	getModelZonesList,
	patchModelVersionZones,
} from "services/models/modelDetails/modelZones";
import DeleteDialog from "components/Elements/DeleteDialog";
import { Apis } from "services/api";
import AddNewModelZone from "./AddNewModelZone";
import TabelRowImage from "components/Elements/TabelRowImage";
import withMount from "components/HOC/withMount";

function Zones({ modelId, state, dispatch, access, isMounted }) {
	// init states
	const [zoneList, setZonesList] = useState([]);
	const [originalZoneList, setOriginalZoneList] = useState([]);
	const [Zone, setZone] = useState([]);

	const [isModelEditable, setModelEditable] = useState(true);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [selectedID, setSelectedID] = useState(null);
	const [loading, setLoading] = useState([]);
	const [openAddNewZone, setOpenAddNewZone] = useState(false);
	const [zoneToEdit, setZoneToEdit] = useState(null);
	const [zoneToEditData, setZoneToEditData] = useState(null);

	const { customCaptions } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const fetchModelZoneList = async (showLoading) => {
		if (showLoading && !isMounted.aborted) setLoading(true);
		try {
			const response = await Promise.all([
				getModelZonesList(modelId),
				EditableModelVersionCheck(modelId),
			]);
			if (response[0].status) {
				if (!isMounted.aborted) {
					setZonesList(
						response[0].data.map((d) => ({
							...d,
							imageURL: <TabelRowImage imageURL={d?.imageURL} />,
						}))
					);
					setOriginalZoneList(
						response[0].data.map((d) => ({
							...d,
							imageURL: <TabelRowImage imageURL={d?.imageURL} />,
						}))
					);
					setZone(response[0].data);
				}
				dispatch({
					type: "TAB_COUNT",
					payload: { countTab: "zoneCount", data: response[0].data.length },
				});
			}
			if (response[1].status) {
				if (!isMounted.aborted) {
					setModelEditable(!response[1]?.data?.isEMIModel);
				}
			}
		} catch (error) {
			console.log(error);
		} finally {
			if (showLoading && !isMounted.aborted) setLoading(false);
		}
	};

	useEffect(() => {
		// fectch model zone list
		fetchModelZoneList(true);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// handle dragging of zone
	const setPositionForPayload = (e, listLength) => {
		const { destination, source } = e;
		if (destination.index === listLength - 1) {
			return originalZoneList[destination.index]?.pos + 1;
		}
		if (destination.index === 0) {
			return originalZoneList[destination.index]?.pos - 1;
		}

		if (destination.index > source.index) {
			return (
				(+originalZoneList[destination.index]?.pos +
					+originalZoneList[e.destination.index + 1]?.pos) /
				2
			);
		}
		return (
			(+originalZoneList[destination.index]?.pos +
				+originalZoneList[e.destination.index - 1]?.pos) /
			2
		);
	};

	const handleDragEnd = async (e) => {
		if (!e.destination) {
			return;
		}

		if (e.destination.index === e.source.index) return;

		const result = [...zoneList];
		const [removed] = result.splice(e.source.index, 1);
		result.splice(e.destination.index, 0, removed);
		setZonesList(result);

		try {
			let payloadBody = [
				{
					path: "pos",
					op: "replace",
					value: setPositionForPayload(e, originalZoneList.length),
				},
			];
			const response = await patchModelVersionZones(e.draggableId, payloadBody);
			if (response.status) {
				setOriginalZoneList(zoneList);
			} else {
				setZonesList(originalZoneList);
			}
		} catch (error) {
			setZonesList(originalZoneList);
		}
	};

	// show popup for deletion of zone
	const showDeleteZonePopUp = (modelZoneId) => {
		setOpenDeleteDialog(true);
		setSelectedID(modelZoneId);
	};

	// remove zone from zone list
	const handleRemoveData = (id) => {
		const newData = [...zoneList].filter(function (item) {
			return item.id !== id;
		});
		setZonesList(newData);
		setOriginalZoneList(newData);
		dispatch({
			type: "TAB_COUNT",
			payload: { countTab: "zoneCount", data: newData.length },
		});
	};

	const handleEditZone = (row) => {
		row = Zone.find((r) => r.id === row);
		setZoneToEdit({
			Name: row.name,
			imageUrl: row.imageURL,
			imageName: row.imageKey,
		});
		setZoneToEditData(row);
		setOpenAddNewZone(true);
	};

	const editModelZone = async (data) => {
		return await patchModelVersionZones(zoneToEditData.id, [
			{ path: "name", op: "replace", value: data.Name },
		]);
	};

	const createModalZone = async (input) => {
		return await addNewModelZone(input);
	};

	return (
		<div>
			<AddNewModelZone
				open={state.showAdd}
				closeHandler={() => dispatch({ type: "TOGGLE_ADD", payload: false })}
				data={null}
				title={`Add Model ${customCaptions?.zone}`}
				createProcessHandler={createModalZone}
				ModelVersionID={modelId}
				fetchModelZoneList={() => fetchModelZoneList(false)}
			/>
			<AddNewModelZone
				open={openAddNewZone}
				closeHandler={() => setOpenAddNewZone(false)}
				data={zoneToEdit}
				title={`Edit Model ${customCaptions?.zone}`}
				createProcessHandler={editModelZone}
				zoneId={zoneToEditData?.id}
				fetchModelZoneList={() => fetchModelZoneList(false)}
			/>
			<DeleteDialog
				entityName={`Model ${customCaptions?.zone}`}
				open={openDeleteDialog}
				closeHandler={() => setOpenDeleteDialog(false)}
				deleteEndpoint={Apis.ModelZones}
				deleteID={selectedID}
				handleRemoveData={handleRemoveData}
			/>
			{loading ? (
				<CircularProgress />
			) : (
				<>
					<DetailsPanel
						header={customCaptions?.zonePlural}
						dataCount={zoneList.length}
						description={`${customCaptions?.zonePlural} assigned in this asset model`}
					/>
					<DragAndDropTable
						data={zoneList}
						headers={["Name", "Image"]}
						columns={[
							{ id: 1, name: "name", style: { width: "50vw" } },
							{ id: 2, name: "imageURL", style: { width: "50vw" } },
						]}
						handleDragEnd={handleDragEnd}
						isModelEditable={isModelEditable}
						disableDnd={!isModelEditable || access === "R"}
						menuData={[
							{
								name: "Edit",
								handler: handleEditZone,
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
					/>
				</>
			)}
		</div>
	);
}

export default withMount(Zones);
