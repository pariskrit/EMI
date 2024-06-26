import { CircularProgress, LinearProgress } from "@mui/material";
import DetailsPanel from "components/Elements/DetailsPanel";
import DragAndDropTable from "components/Modules/DragAndDropTable";
import DeleteDialog from "components/Elements/DeleteDialog";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { Apis } from "services/api";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import AddOrEditTool from "./AddEditTool";
import {
	addModelTaskTool,
	getModelTaskTools,
	patchModelTaskTool,
} from "services/models/modelDetails/modelTaskTools";
import withMount from "components/HOC/withMount";
import { TaskContext } from "contexts/TaskDetailContext";
import { setPositionForPayload } from "helpers/setPositionForPayload";
import { ModelContext } from "contexts/ModelDetailContext";
import { pasteModelTaskTool } from "services/models/modelDetails/modelTasks/pasteApi";
import GeneralButton from "components/Elements/GeneralButton";

const AT = ActionButtonStyle();

const Tools = ({ taskInfo, access, isMounted }) => {
	const [tools, setTools] = useState([]);
	const [originalTools, setOriginalTools] = useState([]);
	const [selectedID, setSelectedID] = useState(null);
	const [openAddTool, setOpenAddTool] = useState(false);
	const [openEditTool, setOpenEditTool] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [loading, setLoading] = useState(true);
	// const [pastePart, setPastePart] = useState(false);
	const [isPasting, setIsPasting] = useState(false);
	const [, CtxDispatch] = useContext(TaskContext);
	const [state, MdxDispatch] = useContext(ModelContext);

	const dispatch = useDispatch();

	const { customCaptions } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const fetchTools = async (showLoading = true) => {
		!isMounted.aborted && showLoading && setLoading(true);
		try {
			const response = await getModelTaskTools(taskInfo.id);
			if (response.status) {
				if (!isMounted.aborted) {
					setTools(response?.data);
					setOriginalTools(response?.data);
				}
				CtxDispatch({
					type: "TAB_COUNT",
					payload: {
						countTab: "toolCount",
						data: response?.data?.length,
					},
				});
				if (response.data.length > 0) {
					CtxDispatch({
						type: "SET_TOOLS",
						payload: true,
					});
				} else {
					CtxDispatch({
						type: "SET_TOOLS",
						payload: false,
					});
				}
			} else {
				dispatch(
					showError(
						response?.data?.title ||
							response?.data ||
							"Could not fetch task tools"
					)
				);
			}
		} catch (error) {
			dispatch(
				showError(
					error?.response?.data ||
						error?.response ||
						"Could not fetch task tools"
				)
			);
		} finally {
			!isMounted.aborted && showLoading && setLoading(false);
		}
	};

	useEffect(() => {
		fetchTools();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// handle dragging of tool

	const handleDragEnd = async (e) => {
		if (!e.destination) {
			return;
		}

		if (e.destination.index === e.source.index) return;

		const result = [...tools];
		const [removed] = result.splice(e.source.index, 1);
		result.splice(e.destination.index, 0, removed);
		setTools(result);

		try {
			let payloadBody = [
				{
					path: "pos",
					op: "replace",
					value: setPositionForPayload(e, originalTools),
				},
			];
			const response = await patchModelTaskTool(e.draggableId, payloadBody);
			if (response.status) {
				const newDate = result.map((x, i) =>
					i === e.destination.index ? { ...x, pos: response.data.pos } : x
				);
				setTools(newDate);
				setOriginalTools(newDate);
			} else {
				setTools(originalTools);
			}
		} catch (error) {
			setTools(originalTools);
		}
	};

	// show popup for deletion of tool
	const showDeleteToolPopUp = (TaskPartID) => {
		setOpenDeleteDialog(true);
		setSelectedID(TaskPartID);
	};

	// remove zone from tool list
	const handleRemoveData = (id) => {
		const newData = [...tools].filter(function (item) {
			return item.id !== id;
		});
		setTools(newData);
		setOriginalTools(newData);
		CtxDispatch({
			type: "TAB_COUNT",
			payload: {
				countTab: "toolCount",
				data: newData.length,
			},
		});
		if (newData.length === 0) {
			CtxDispatch({
				type: "SET_TOOLS",
				payload: false,
			});
		}
	};

	const createTool = async (newTool) => {
		return await addModelTaskTool({
			ModelVersionTaskID: taskInfo.id,
			...newTool,
		});
	};

	// show popUp for edit of tools
	const showEditToolPopUp = (row) => {
		row = tools.find((r) => r.id === row);
		setOpenEditTool(true);
		setSelectedID(row);
	};

	const editTool = async (payload) => {
		return await patchModelTaskTool(selectedID.id, [
			{ op: "replace", path: "name", value: payload.name },
			{ op: "replace", path: "qty", value: payload.qty },
		]);
	};

	const handleCopy = (id) => {
		MdxDispatch({
			type: "DISABLE_TOOL_TASK",
			payload: false,
		});
		localStorage.setItem("tasktool", id);
	};

	const handlePaste = async () => {
		setIsPasting(true);
		try {
			const taskPartId = localStorage.getItem("tasktool");
			let result = await pasteModelTaskTool(taskInfo.id, {
				modelVersionTaskToolID: taskPartId,
			});

			if (!isMounted.aborted) {
				if (result.status) {
					await fetchTools(false);
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
			const taskId = localStorage.getItem("tasktool");

			if (taskId) {
				MdxDispatch({
					type: "DISABLE_TOOL_TASK",
					payload: false,
				});
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
			<AddOrEditTool
				open={openAddTool}
				title={`Add ${customCaptions.tool}`}
				closeHandler={() => {
					setOpenAddTool(false);
				}}
				data={null}
				createProcessHandler={createTool}
				fetchData={() => fetchTools(false)}
				customCaptions={customCaptions}
			/>
			<AddOrEditTool
				open={openEditTool}
				title={`${customCaptions.tool}`}
				closeHandler={() => {
					setOpenEditTool(false);
				}}
				data={{
					name: selectedID?.name,
					qty: selectedID?.qty,
				}}
				createProcessHandler={editTool}
				fetchData={() => fetchTools(false)}
				customCaptions={customCaptions}
				isEdit
			/>
			<DeleteDialog
				entityName={`${customCaptions.tool}`}
				open={openDeleteDialog}
				closeHandler={() => setOpenDeleteDialog(false)}
				deleteEndpoint={Apis.ModelVersionTaskTools}
				deleteID={selectedID}
				handleRemoveData={handleRemoveData}
			/>
			<div
				className="detailsContainer topContainerCustomCaptions"
				style={{ alignItems: "center" }}
			>
				<DetailsPanel
					header={`${customCaptions.toolPlural}`}
					dataCount={tools.length}
				/>
				{access === "F" && !state?.modelDetail?.isPublished && (
					<>
						<GeneralButton
							style={{ background: "#ED8738" }}
							onClick={handlePaste}
							disabled={state.isToolTaskDisabled}
						>
							Paste {customCaptions.tool}
						</GeneralButton>
						<AT.GeneralButton
							onClick={() => {
								setOpenAddTool(true);
							}}
						>
							Add {customCaptions.tool}
						</AT.GeneralButton>
					</>
				)}
			</div>
			{isPasting ? <LinearProgress /> : null}
			<DragAndDropTable
				data={tools}
				headers={[
					customCaptions?.toolQuantity,
					customCaptions?.toolDescription,
				]}
				columns={[
					{ id: 1, name: "qty", style: { width: "12vw" } },
					{ id: 2, name: "name", style: { width: "88vw" } },
				]}
				handleDragEnd={handleDragEnd}
				menuData={[
					{
						name: "Edit",
						handler: showEditToolPopUp,
						isDelete: false,
					},
					{
						name: "Copy",
						handler: handleCopy,
					},
					{
						name: "Delete",
						handler: showDeleteToolPopUp,
						isDelete: true,
					},
				].filter((x) => {
					if (state.modelDetail?.isPublished) {
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

export default withMount(Tools);
