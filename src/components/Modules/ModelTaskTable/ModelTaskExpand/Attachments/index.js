import React, { useContext, useEffect, useState } from "react";
import { CircularProgress } from "@material-ui/core";
import DetailsPanel from "components/Elements/DetailsPanel";
import DragAndDropTable from "components/Modules/DragAndDropTable";
import DeleteDialog from "components/Elements/DeleteDialog";
import Link from "@material-ui/core/Link";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { Apis } from "services/api";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import AddOrEditAttachments from "./AddOrEditAttachments";
import {
	addModelTaskAttachment,
	getModelTaskAttachments,
	patchModelTaskAttachment,
	uploadModelTaskAttachmentDocument,
} from "services/models/modelDetails/modelTaskAttachments";
import ColourConstants from "helpers/colourConstants";
import withMount from "components/HOC/withMount";
import { TaskContext } from "contexts/TaskDetailContext";

const AT = ActionButtonStyle();

const Attachments = ({ taskInfo, access, isMounted }) => {
	const [permits, setPermits] = useState([]);
	const [originalPermits, setOriginalPermits] = useState([]);
	const [selectedID, setSelectedID] = useState(null);

	const [openAddPermit, setOpenAddPermit] = useState(false);
	const [openEditPermit, setOpenEditPermit] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [loading, setLoading] = useState(false);

	const [, CtxDispatch] = useContext(TaskContext);

	const dispatch = useDispatch();

	const fetchAttachments = async (showLoading = true) => {
		!isMounted.aborted && showLoading && setLoading(true);
		try {
			const response = await getModelTaskAttachments(taskInfo.id);
			if (response.status) {
				if (!isMounted.aborted) {
					setPermits(
						response?.data?.map((a) => ({
							...a,
							name: (
								<Link
									style={{ color: ColourConstants.activeLink }}
									href={a?.documentURL || a?.link}
									download={a?.name}
									target="_blank"
									rel="noopener"
								>
									{a?.name}
								</Link>
							),
						}))
					);
					setOriginalPermits(
						response?.data?.map((a) => ({
							...a,
							name: (
								<Link
									style={{ color: ColourConstants.activeLink }}
									href={a?.documentURL || a?.link}
									download={a?.name}
									target="_blank"
									rel="noopener"
								>
									{a?.name}
								</Link>
							),
						}))
					);
				}
				CtxDispatch({
					type: "TAB_COUNT",
					payload: {
						countTab: "documentCount",
						data: response?.data?.length,
					},
				});
			} else {
				dispatch(
					showError(
						response?.data?.title ||
							response?.data ||
							"Could not fetch task Attachments"
					)
				);
			}
		} catch (error) {
			dispatch(
				showError(
					error?.response?.data ||
						error?.response ||
						"Could not fetch task Attachments"
				)
			);
		} finally {
			!isMounted.aborted && showLoading && setLoading(false);
		}
	};

	useEffect(() => {
		fetchAttachments();
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
			const response = await patchModelTaskAttachment(
				e.draggableId,
				payloadBody
			);
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
		CtxDispatch({
			type: "TAB_COUNT",
			payload: {
				countTab: "documentCount",
				data: newData?.length,
			},
		});
	};

	const createPermit = async (newPermit) => {
		let response, callApi;
		if (newPermit.file) {
			response = await uploadModelTaskAttachmentDocument(
				taskInfo.id,
				newPermit.file.type.split("/")[1],
				{ Filename: newPermit.file.name }
			);
			if (response.status) {
				try {
					await fetch(response.data.url, {
						method: "PUT",
						body: newPermit.file,
					});
					callApi = true;
				} catch (error) {
					callApi = false;
				}
			} else {
				callApi = false;
			}
		} else {
			callApi = true;
		}

		if (callApi) {
			return await addModelTaskAttachment({
				ModelVersionTaskID: taskInfo.id,
				name: newPermit.name,
				documentKey: response?.data?.key ?? null,
				link: newPermit?.link !== "" ? newPermit.link : null,
			});
		} else {
			return { status: false, data: { detail: "File Upload Failed" } };
		}
	};

	// show popUp for edit of permit
	const showEditPermitPopUp = (row) => {
		row = permits.find((r) => r.id === row);
		setOpenEditPermit(true);
		setSelectedID(row);
	};

	const editPermit = async (payload) => {
		let response;
		if (payload.file?.name) {
			response = await uploadModelTaskAttachmentDocument(
				taskInfo.id,
				payload.file.type.split("/")[1],
				{ Filename: payload.file.name }
			);
			if (response.status) {
				try {
					await fetch(response.data.url, {
						method: "PUT",
						body: payload.file,
					});
				} catch (error) {
					response = false;
					return { status: false, data: { detail: "File Upload Failed" } };
				}
			} else {
				response = false;
				return { status: false, data: { detail: "File Upload Failed" } };
			}
		} else {
			response = false;
		}
		return await patchModelTaskAttachment(selectedID.id, [
			{
				op: "replace",
				path: "name",
				value: payload?.name,
			},
			{
				op: "replace",
				path: "link",
				value: payload?.link === "" ? null : payload?.link,
			},
			{
				op: "replace",
				path: "documentKey",
				value: response?.data?.key ?? payload?.file,
			},
		]);
	};

	if (loading) return <CircularProgress />;
	return (
		<div style={{ marginBottom: "20px" }}>
			<AddOrEditAttachments
				open={openAddPermit}
				title={`Add Attachment`}
				closeHandler={() => {
					setOpenAddPermit(false);
				}}
				data={null}
				createProcessHandler={createPermit}
				fetchData={() => fetchAttachments(false)}
			/>
			<AddOrEditAttachments
				open={openEditPermit}
				title={`Edit Attachment`}
				closeHandler={() => {
					setOpenEditPermit(false);
				}}
				data={{
					name: selectedID?.name?.props?.children,
					link: selectedID?.link === null ? "" : selectedID?.link,
					file: selectedID?.documentKey,
				}}
				createProcessHandler={editPermit}
				fetchData={() => fetchAttachments(false)}
			/>
			<DeleteDialog
				entityName={`Model Attachment`}
				open={openDeleteDialog}
				closeHandler={() => setOpenDeleteDialog(false)}
				deleteEndpoint={Apis.ModelVersionTaskAttachments}
				deleteID={selectedID}
				handleRemoveData={handleRemoveData}
			/>
			<div
				className="detailsContainer topContainerCustomCaptions"
				style={{ alignItems: "center" }}
			>
				<DetailsPanel header={`Attachments`} dataCount={permits.length} />
				{access === "F" && (
					<AT.GeneralButton
						onClick={() => {
							setOpenAddPermit(true);
						}}
					>
						Add Attachment
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

export default withMount(Attachments);
