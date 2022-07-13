/* eslint-disable no-unused-expressions */
import React, { useState, useContext, memo, useMemo, useEffect } from "react";
import TableRow from "@material-ui/core/TableRow";
import { Collapse, LinearProgress, TableCell } from "@material-ui/core";
import TableStyle from "styles/application/TableStyle";
import PopupMenu from "components/Elements/PopupMenu";
import { ReactComponent as BlueMenuIcon } from "assets/icons/3dot-icon.svg";
import { ReactComponent as WhiteMenuIcon } from "assets/icons/3dot-white-icon.svg";
import { Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { modelServiceLayout, modelsPath } from "helpers/routePaths";
import ModelTaskExpand from "./ModelTaskExpand";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import {
	duplicateTask,
	getSingleModelTask,
} from "services/models/modelDetails/modelTasks";
import useDidMountEffect from "hooks/useDidMountEffect";
import withMount from "components/HOC/withMount";
import { TaskContext } from "contexts/TaskDetailContext";
import { ModelContext } from "contexts/ModelDetailContext";
import DeleteDialog from "components/Elements/DeleteDialog";
import { Apis } from "services/api";
import { makeStyles } from "@material-ui/core/styles";
import ErrorMessageWithErrorIcon from "components/Elements/ErrorMessageWithErrorIcon";

const useStyles = makeStyles({
	loading: {
		position: "absolute",
		width: "100%",
		left: 0,
		top: 0,
	},
});

const AT = TableStyle();

const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9",
	},
}))(Tooltip);

const ModelTaskRow = ({
	classes,
	index,
	columns,
	row,
	handleDelete,
	modelId,
	totalTaskCount,
	handleCopy,
	handleCopyTaskQuestion,
	customCaptions,
	access,
	fetchData,
	isMounted,
	originalRow,
}) => {
	const [toggle, setToggle] = useState(false);
	const [singleTask, setSingleTask] = useState({});
	const [loading, setLoading] = useState(false);
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [taskToDeleteId, setTaskToDeleteId] = useState(null);
	const [duplicating, setDuplicating] = useState(false);

	const dispatch = useDispatch();
	const rowClasses = useStyles();

	const [taskState, CtxDispatch] = useContext(TaskContext);
	const [state, ModelCtxDispatch] = useContext(ModelContext);
	const { taskError, taskInfo, stageList } = taskState;

	const toolTipColumn = ["intervals", "zones", "stages", "roles", "notes"];

	const history = useHistory();

	const onHandleTableExpand = async (tg, rowId, e) => {
		setToggle(tg);

		// call single task detail api only if expand is true
		if (tg) {
			!isMounted.aborted && setLoading(true);
			try {
				const response = await getSingleModelTask(rowId);
				if (response.status) {
					if (!isMounted.aborted) {
						setSingleTask(response.data[0]);
						CtxDispatch({ type: "SET_TASK_DETAIL", payload: response.data[0] });
					}
				} else {
					dispatch(showError(response?.data?.title || "something went wrong"));
				}
			} catch (error) {
				dispatch(showError(error?.response?.data || "something went wrong"));
			} finally {
				!isMounted.aborted && setLoading(false);
			}
		}
	};

	const handleDuplicate = async (toDuplicateTask) => {
		setDuplicating(true);
		try {
			const response = await duplicateTask(toDuplicateTask?.id);
			await fetchData(modelId, false, "");
			ModelCtxDispatch({
				type: "TAB_COUNT",
				payload: { countTab: "taskCount", data: totalTaskCount + 1 },
			});

			// scroll down to duplicated task
			setTimeout(() => {
				if (document.getElementById(`taskExpandable${response.data}`)) {
					document
						.getElementById(`taskExpandable${response.data}`)
						.scrollIntoView({
							behavior: "smooth",
							block: "center",
							top:
								document
									.getElementById(`taskExpandable${response.data}`)
									.getBoundingClientRect().bottom + window.pageYOffset,
						});

					setTimeout(() => {
						document.getElementById(`taskExpandable${response.data}`).click();
						setTimeout(() => {
							document
								.getElementById(`taskExpandable${response.data}`)
								.scrollIntoView({
									behavior: "smooth",
									block: "center",
									inline: "center",
								});
						}, 1000);
					}, 500);
				}
			}, 500);
		} catch (error) {
			dispatch(showError(error?.response?.data || "something went wrong"));
		}
		setDuplicating(false);
	};

	useDidMountEffect(() => {
		if (toggle) {
			document
				.querySelectorAll(`#taskExpandable${row.id}  > td > div > span > img`)
				?.forEach((i) => {
					i.classList.add("white-filter");
				});
		} else {
			// eslint-disable-next-line no-unused-expressions
			document
				.querySelectorAll(`#taskExpandable${row.id}  > td > div > span > img`)
				?.forEach((i) => {
					i.classList.remove("white-filter");
				});
		}
	}, [toggle]);

	const handleDeleteTask = (taskId) => {
		setTaskToDeleteId(taskId);
		setOpenDeleteDialog(true);
	};

	useEffect(() => {
		if (taskInfo?.intervalCount === 0 || 0) {
			CtxDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "interval",
					value: `No ${customCaptions?.intervalPlural} Assigned`,
				},
			});
		} else {
			CtxDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "interval",
					value: "",
				},
			});
		}
		if (taskInfo?.stageCount === 0 || 0) {
			CtxDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "stage",
					value: `No ${customCaptions?.stagePlural} Assigned`,
				},
			});
		} else {
			CtxDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "stage",
					value: "",
				},
			});
		}
		if (
			taskInfo?.roles === null ||
			taskInfo?.roles?.filter((r) => r.id !== null).length === 0
		) {
			CtxDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "role",
					value: `No ${customCaptions?.rolePlural} Assigned`,
				},
			});
		} else {
			CtxDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "role",
					value: "",
				},
			});
		}
		if (+taskInfo.estimatedMinutes <= 0) {
			CtxDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "estimatedMinutes",
					value: `Invalid Estimated Minutes`,
				},
			});
		} else {
			CtxDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "estimatedMinutes",
					value: "",
				},
			});
		}
		if (
			stageList.filter((x) => x.hasZones && x.id !== null).length > 0 &&
			taskInfo.stageCount !== 0 &&
			taskInfo.zoneCount === 0
		) {
			CtxDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "zone",
					value: `No ${customCaptions?.zonePlural} Assigned`,
				},
			});
		} else {
			CtxDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "zone",
					value: "",
				},
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		row,
		CtxDispatch,
		originalRow,
		taskInfo.stageCount,
		taskInfo.estimatedMinutes,
		taskInfo.intervalCount,
		taskInfo.roles,
		stageList,
		taskInfo.stageCount,
		taskInfo.zoneCount,
	]);

	useEffect(() => {
		if (row?.intervals === "") {
			CtxDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "interval",
					value: `No ${customCaptions?.intervalPlural} Assigned`,
				},
			});
		} else {
			CtxDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "interval",
					value: "",
				},
			});
		}
		if (row?.stages === "") {
			CtxDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "stage",
					value: `No ${customCaptions?.stagePlural} Assigned`,
				},
			});
		} else {
			CtxDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "stage",
					value: "",
				},
			});
		}
		if (row?.roles === "") {
			CtxDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "role",
					value: `No ${customCaptions?.rolePlural} Assigned`,
				},
			});
		} else {
			CtxDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "role",
					value: "",
				},
			});
		}
		if (+row?.estimatedMinutes <= 0) {
			CtxDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "estimatedMinutes",
					value: `Invalid Estimated Minutes`,
				},
			});
		} else {
			CtxDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "estimatedMinutes",
					value: "",
				},
			});
		}
		if (
			originalRow?.stages?.filter((x) => x.hasZones)?.length > 0 &&
			row?.zones === "" &&
			row?.stages !== ""
		) {
			CtxDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "zone",
					value: `No ${customCaptions?.zonePlural} Assigned`,
				},
			});
		} else {
			CtxDispatch({
				type: "SET_TASK_ERROR",
				payload: {
					name: "zone",
					value: "",
				},
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		row,
		CtxDispatch,
		originalRow,
		// taskInfo.stageCount,
		// taskInfo.estimatedMinutes,
		// taskInfo.intervalCount,
		// taskInfo.roles,
	]);

	const taskRow = useMemo(() => {
		return (
			<>
				<TableRow
					onClick={(e) => onHandleTableExpand(!toggle, row?.id, e)}
					style={{
						background: toggle ? " #307AD7" : "#FFFFFF",
						borderBottom: "hidden",
						color: toggle ? "#FFFFFF" : "",
					}}
					id={`taskExpandable${row.id}`}
				>
					{columns.map((col, i, arr) => (
						<TableCell
							key={col}
							className={classes.dataCell}
							style={{
								padding: "7px 10px",
								maxWidth: "200px",
								color: toggle ? "#FFFFFF" : "",
							}}
							id={`dataCell${col}`}
						>
							<AT.CellContainer key={col}>
								{/* <AT.TableBodyText style={{ color: toggle ? "#FFFFFF" : "" }}> */}
								{toolTipColumn.includes(col) ? (
									<HtmlTooltip title={row[col]}>
										<p
											className="max-two-line"
											style={{ color: toggle ? "#FFFFFF" : "" }}
											draggable="true"
										>
											{" "}
											{row[col]}
										</p>
									</HtmlTooltip>
								) : col === "errors" ? (
									Object.values(taskError)?.filter(Boolean).length === 0 ? (
										""
									) : (
										<ErrorMessageWithErrorIcon
											message={Object.values(taskError)?.filter(Boolean)}
										/>
									)
								) : (
									<span className="lastSpan" draggable="true">
										{row[col]}
									</span>
								)}
								{/* </AT.TableBodyText> */}

								{arr.length === i + 1 ? (
									<AT.DotMenu
										onClick={(e) => {
											e.stopPropagation();
											setAnchorEl(
												anchorEl === e.currentTarget ? null : e.currentTarget
											);
											setSelectedData(
												anchorEl === e.currentTarget ? null : index
											);
										}}
										className="taskdotmenu"
									>
										{(access === "F" || access === "E") &&
										!state?.modelDetail?.isPublished ? (
											<AT.TableMenuButton className="taskdotmenu">
												{toggle ? (
													<WhiteMenuIcon className="taskdotmenu" />
												) : (
													<BlueMenuIcon className="taskdotmenu" />
												)}
											</AT.TableMenuButton>
										) : null}

										<PopupMenu
											index={index}
											selectedData={selectedData}
											anchorEl={anchorEl}
											id={row.id}
											clickAwayHandler={() => {
												setAnchorEl(null);
												setSelectedData(null);
											}}
											menuData={[
												{
													name: "Edit",
													handler: () => onHandleTableExpand(!toggle, row?.id),
													isDelete: false,
												},
												{
													name: "Duplicate",
													handler: () => handleDuplicate(row),
													isDelete: false,
												},
												{
													name: "Copy",
													handler: () => handleCopy(row.id),
													isDelete: false,
												},
												{
													name: `Copy ${customCaptions?.task} ${customCaptions?.questionPlural}`,
													handler: () => handleCopyTaskQuestion(row.id),
													isDelete: false,
												},
												{
													name: "Switch To Service Layout",
													handler: () =>
														history.push(
															`${modelsPath}/${modelId}${modelServiceLayout}`,
															{ state: { ModelVersionTaskID: row.id } }
														),
													isDelete: false,
													disabled: !row["stages"],
												},
												{
													name: "Delete",
													handler: () => handleDeleteTask(row.id),
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
									</AT.DotMenu>
								) : null}
							</AT.CellContainer>
						</TableCell>
					))}
				</TableRow>
				<TableRow id={`taskExpanded${row.id}`}>
					<TableCell
						style={{ paddingBottom: 0, paddingTop: 0, background: "#307AD7" }}
						colSpan={18}
					>
						<Collapse in={toggle} timeout="auto" unmountOnExit>
							<ModelTaskExpand
								customCaptions={customCaptions}
								taskInfo={singleTask}
								setTaskInfo={setSingleTask}
								taskLoading={loading}
								access={access}
								originalRow={originalRow}
							/>
						</Collapse>
					</TableCell>
				</TableRow>
			</>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		toggle,
		totalTaskCount,
		row,
		anchorEl,
		singleTask,
		selectedData,
		index,
		loading,
		taskState,
	]);

	return (
		<>
			{duplicating && <LinearProgress className={rowClasses.loading} />}

			<DeleteDialog
				entityName={`${customCaptions?.task}`}
				open={openDeleteDialog}
				closeHandler={() => setOpenDeleteDialog(false)}
				deleteEndpoint={Apis.ModelTasks}
				deleteID={taskToDeleteId}
				handleRemoveData={() => handleDelete(taskToDeleteId)}
			/>
			{taskRow}
		</>
	);
};

export default memo(withMount(ModelTaskRow));
