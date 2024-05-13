import React, { useContext, useEffect, useState } from "react";
import { CircularProgress, LinearProgress } from "@mui/material";
import DetailsPanel from "components/Elements/DetailsPanel";
import DragAndDropTable from "components/Modules/DragAndDropTable";
import DeleteDialog from "components/Elements/DeleteDialog";
import Link from "@mui/material/Link";
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
import { setPositionForPayload } from "helpers/setPositionForPayload";
import { ModelContext } from "contexts/ModelDetailContext";
import { formatBytes, getFormattedLink } from "helpers/utils";
import { pasteModelTaskDocument } from "services/models/modelDetails/modelTasks/pasteApi";
import GeneralButton from "components/Elements/GeneralButton";

const AT = ActionButtonStyle();

const Attachments = ({ taskInfo, access, isMounted }) => {
	const [attachments, setAttachments] = useState([]);
	const [originalAttachments, setOriginalAttachments] = useState([]);
	const [selectedID, setSelectedID] = useState(null);

	const [openAddAttachment, setOpenAddAttachment] = useState(false);
	const [openEditAttachment, setOpenEditAttachment] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [loading, setLoading] = useState(true);
	const [pastePart, setPastePart] = useState(true);
	const [isPasting, setIsPasting] = useState(false);

	const [, CtxDispatch] = useContext(TaskContext);
	const [state, MtxDispatch] = useContext(ModelContext);

	const dispatch = useDispatch();

	const fetchAttachments = async (showLoading = true) => {
		!isMounted.aborted && showLoading && setLoading(true);
		try {
			const response = await getModelTaskAttachments(taskInfo.id);
			if (response.status) {
				if (!isMounted.aborted) {
					setAttachments(
						response?.data?.map((a) => {
							return {
								...a,
								filesize: a.filesize > 0 ? formatBytes(a?.filesize) : " ",
								name: (
									<Link
										style={{ color: ColourConstants.activeLink }}
										href={
											a?.documentKey !== null
												? a?.documentURL
												: getFormattedLink(a?.link)
										}
										download={a?.name}
										target="_blank"
										rel="noopener"
									>
										{a?.name}
									</Link>
								),
							};
						})
					);
					setOriginalAttachments(
						response?.data?.map((a) => ({
							...a,
							filesize: formatBytes(a?.filesize),
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
				if (response.data.length > 0) {
					CtxDispatch({
						type: "SET_DOCUMENTS",
						payload: true,
					});
				} else {
					CtxDispatch({
						type: "SET_DOCUMENTS",
						payload: false,
					});
				}
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

	useEffect(() => {
		setPastePart(state.isAttachmentsTaskDisabled);
	}, [state]);

	// handle dragging of attachment

	const handleDragEnd = async (e) => {
		if (!e.destination) {
			return;
		}

		if (e.destination.index === e.source.index) return;

		const result = [...attachments];
		const [removed] = result.splice(e.source.index, 1);
		result.splice(e.destination.index, 0, removed);
		setAttachments(result);

		try {
			let payloadBody = [
				{
					path: "pos",
					op: "replace",
					value: setPositionForPayload(e, originalAttachments),
				},
			];
			const response = await patchModelTaskAttachment(
				e.draggableId,
				payloadBody
			);
			if (response.status) {
				const newDate = result.map((x, i) =>
					i === e.destination.index ? { ...x, pos: response.data.pos } : x
				);
				setOriginalAttachments(newDate);
				setAttachments(newDate);
			} else {
				setAttachments(originalAttachments);
			}
		} catch (error) {
			setAttachments(originalAttachments);
		}
	};

	// show popup for deletion of attachment
	const showDeleteAttachmentPopUp = (TaskPartID) => {
		setOpenDeleteDialog(true);
		setSelectedID(TaskPartID);
	};

	// remove attachment from attachment list
	const handleRemoveData = (id) => {
		const newData = [...attachments].filter(function (item) {
			return item.id !== id;
		});
		setAttachments(newData);
		setOriginalAttachments(newData);
		CtxDispatch({
			type: "TAB_COUNT",
			payload: {
				countTab: "documentCount",
				data: newData?.length,
			},
		});
		if (newData.length > 0) {
			CtxDispatch({
				type: "SET_DOCUMENTS",
				payload: true,
			});
		} else {
			CtxDispatch({
				type: "SET_DOCUMENTS",
				payload: false,
			});
		}
	};

	const createAttachment = async (newPermit) => {
		let response, callApi;
		if (newPermit.file) {
			response = await uploadModelTaskAttachmentDocument({
				Filename: newPermit.file.name,
				ModelVersionTaskId: taskInfo.id,
			});
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
				filename: newPermit?.filename || null,
			});
		} else {
			return {
				status: false,
				data: { detail: response?.data?.detail || "File Upload Failed" },
			};
		}
	};

	// show popUp for edit of attachment
	const showEditAttachmentPopUp = (row) => {
		row = attachments.find((r) => r.id === row);
		setOpenEditAttachment(true);
		setSelectedID(row);
	};

	const editAttachment = async (payload) => {
		let response;
		if (payload.file?.name) {
			response = await uploadModelTaskAttachmentDocument({
				Filename: payload.file.name,
				ModelVersionTaskId: taskInfo.id,
			});
			let errMsg = response?.data?.detail;
			if (response.status) {
				try {
					await fetch(response.data.url, {
						method: "PUT",
						body: payload.file,
					});
				} catch (error) {
					response = false;
					return {
						status: false,
						data: { detail: "File Upload Failed" },
					};
				}
			} else {
				response = false;
				return {
					status: false,
					data: { detail: errMsg || "File Upload Failed" },
				};
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
			{
				op: "replace",
				path: "filename",
				value: payload.filename,
			},
		]);
	};

	const handleCopy = (id) => {
		localStorage.setItem("taskdocument", id);
		MtxDispatch({ type: "DISABLE_ATTACHMENTS_TASK", payload: false });
	};

	const handlePaste = async () => {
		setIsPasting(true);
		try {
			const taskPartId = localStorage.getItem("taskdocument");
			let result = await pasteModelTaskDocument(taskInfo.id, {
				modelVersionTaskDocumentID: taskPartId,
			});

			if (!isMounted.aborted) {
				if (result.status) {
					await fetchAttachments(false);
				} else {
					// errorResponse(result);
					dispatch(showError(result?.data?.detail || "Could not paste"));
				}
			}
		} catch (e) {
			return;
		}
		setIsPasting(false);
	};

	const checkcopyPartStatus = async () => {
		try {
			const taskId = localStorage.getItem("taskdocument");

			if (taskId) {
				setPastePart(false);
			}
		} catch (error) {
			return;
		}
	};

	const visibilitychangeCheck = function () {
		if (!document.hidden) {
			checkcopyPartStatus();
		}
	};

	useEffect(() => {
		checkcopyPartStatus();
		document.addEventListener("visibilitychange", visibilitychangeCheck);
		return () =>
			document.removeEventListener("visibilitychange", visibilitychangeCheck);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (loading) return <CircularProgress />;
	return (
		<div style={{ marginBottom: "20px" }}>
			<AddOrEditAttachments
				open={openAddAttachment}
				title={`Add Attachment`}
				closeHandler={() => {
					setOpenAddAttachment(false);
				}}
				data={null}
				createProcessHandler={createAttachment}
				fetchData={() => fetchAttachments(false)}
			/>
			<AddOrEditAttachments
				open={openEditAttachment}
				title={`Attachment`}
				closeHandler={() => {
					setOpenEditAttachment(false);
				}}
				data={{
					name: selectedID?.name?.props?.children,
					link: selectedID?.link === null ? "" : selectedID?.link,
					file: selectedID?.documentKey,
					filename: selectedID?.filename,
				}}
				createProcessHandler={editAttachment}
				fetchData={() => fetchAttachments(false)}
				isEdit
			/>
			<DeleteDialog
				entityName={`Attachment`}
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
				<DetailsPanel header={`Attachments`} dataCount={attachments.length} />
				{access === "F" && !state?.modelDetail?.isPublished && (
					<>
						<GeneralButton
							style={{ background: "#ED8738", width: "200px" }}
							onClick={handlePaste}
							disabled={pastePart}
						>
							Paste {"Attachment"}
						</GeneralButton>
						<AT.GeneralButton
							onClick={() => {
								setOpenAddAttachment(true);
							}}
							style={{ width: "200px" }}
						>
							Add Attachment
						</AT.GeneralButton>
					</>
				)}
			</div>
			{isPasting ? <LinearProgress /> : null}

			<DragAndDropTable
				data={attachments}
				headers={["Name", "FileSize"]}
				columns={[
					{ id: 2, name: "name", style: { width: "50vw" } },
					{ id: 3, name: "filesize", width: { width: "50vw" } },
				]}
				handleDragEnd={handleDragEnd}
				menuData={[
					{
						name: "Edit",
						handler: showEditAttachmentPopUp,
						isDelete: false,
					},
					{
						name: "Copy",
						handler: handleCopy,
					},
					{
						name: "Delete",
						handler: showDeleteAttachmentPopUp,
						isDelete: true,
					},
				].filter((x) => {
					if (state?.modelDetail?.isPublished) {
						return x?.name === "Copy";
					}
					if (access === "F") return true;
					if (access === "E") {
						if (x.name === "Edit") return true;
						else return false;
					}
					return false;
				})}
				isModelEditable
				disableDnd={access === "R" || state.modelDetail?.isPublished}
			/>
		</div>
	);
};

export default withMount(Attachments);
