/* eslint-disable no-unused-expressions */
import React, { useState, useContext, memo, useMemo, useEffect } from "react";
import TableRow from "@mui/material/TableRow";
import { Collapse, LinearProgress, TableCell } from "@mui/material";
import TableStyle from "styles/application/TableStyle";
import PopupMenu from "components/Elements/PopupMenu";
import { ReactComponent as BlueMenuIcon } from "assets/icons/3dot-icon.svg";
import { ReactComponent as WhiteMenuIcon } from "assets/icons/3dot-white-icon.svg";
import { Tooltip } from "@mui/material";
import { makeStyles, withStyles } from "tss-react/mui";
import { useNavigate } from "react-router-dom";
import { appPath, modelServiceLayout, modelsPath } from "helpers/routePaths";
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

import ErrorMessageWithErrorIcon from "components/Elements/ErrorMessageWithErrorIcon";
import HasImages from "assets/icons/images.svg";
import HasDocuments from "assets/icons/documents.svg";
import HasQuestion from "assets/icons/question_dark.svg";
import HasTools from "assets/icons/tools.svg";
import HasParts from "assets/icons/parts.svg";
import HasPermits from "assets/icons/permit.svg";
import SafteryCritical from "assets/icons/safety-critical.svg";
import ColourConstants from "helpers/colourConstants";
const useStyles = makeStyles()((theme) => ({
	loading: {
		position: "absolute",
		width: "100%",
		left: 0,
		top: 0,
	},
	widthSpan: {
		width: "15px",
	},
	logoContainer: {
		display: "flex",
		gap: "5px",
		alignItems: "center",
		alignContent: "center",
	},
	iconSize: {
		width: "20px",
	},
}));

const AT = TableStyle();

const HtmlTooltip = withStyles(Tooltip, (theme) => ({
	tooltip: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9",
	},
}));

const ModelTaskRow = ({
	data,
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
	updatedFieldFunc,
}) => {
	const [toggle, setToggle] = useState(false);
	const [singleTask, setSingleTask] = useState({});
	const [loading, setLoading] = useState(false);

	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [taskToDeleteId, setTaskToDeleteId] = useState(null);
	const [duplicating, setDuplicating] = useState(false);
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	let shouldHandleClick = true;
	const dispatch = useDispatch();
	const { classes: rowClasses, cx } = useStyles();

	const [taskState, CtxDispatch] = useContext(TaskContext);
	const [state, ModelCtxDispatch] = useContext(ModelContext);
	const {
		taskError,
		taskInfo,
		stageList,
		hasTools,
		hasPermits,
		hasImages,
		hasParts,
		hasDocuments,
		hasSafetyCritical,
		hasQuestions,
	} = taskState;
	const toolTipColumn = ["intervals", "zones", "stages", "roles", "notes"];

	const {
		customCaptions: { toolPlural, partPlural, questionPlural, safetyCritical },
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	let rows = {
		...row,
		logo: (
			<div className={rowClasses.logoContainer}>
				{Object.values(taskError)?.filter(Boolean).length === 0 ? (
					""
				) : (
					<span>
						<ErrorMessageWithErrorIcon
							message={Object.values(taskError)?.filter(Boolean)}
						/>
					</span>
				)}
				{hasSafetyCritical ? (
					<HtmlTooltip title={`Is ${safetyCritical}`}>
						<span>
							<img
								className={cx({
									"white-filter": toggle,
								})}
								src={SafteryCritical}
								alt=""
							/>
						</span>
					</HtmlTooltip>
				) : (
					""
				)}
				{hasParts ? (
					<HtmlTooltip title={`Has ${partPlural}`}>
						<span>
							<img
								className={cx({
									"white-filter": toggle,
								})}
								src={HasParts}
								alt=""
							/>
						</span>
					</HtmlTooltip>
				) : (
					""
				)}
				{hasTools ? (
					<span>
						<HtmlTooltip title={`Has ${toolPlural}`}>
							<img
								className={cx({
									"white-filter": toggle,
								})}
								src={HasTools}
								alt=""
							/>
						</HtmlTooltip>
					</span>
				) : (
					""
				)}
				{hasPermits ? (
					<HtmlTooltip title={"Has Permits"}>
						<span>
							<img
								className={cx({
									"white-filter": toggle,
								})}
								src={HasPermits}
								alt=""
							/>
						</span>
					</HtmlTooltip>
				) : (
					""
				)}
				{hasImages ? (
					<span>
						<HtmlTooltip title={"Has Images"}>
							<img
								className={cx({
									"white-filter": toggle,
								})}
								src={HasImages}
								alt=""
							/>
						</HtmlTooltip>
					</span>
				) : (
					""
				)}

				{hasQuestions ? (
					<HtmlTooltip title={`Has ${questionPlural}`}>
						<span>
							<img
								className={cx(rowClasses.iconSize, {
									"white-filter": toggle,
								})}
								src={HasQuestion}
								alt=""
							/>
						</span>
					</HtmlTooltip>
				) : (
					""
				)}
				{hasDocuments ? (
					<HtmlTooltip title={"Has Attachments"}>
						<span>
							<img
								className={cx({
									"white-filter": toggle,
								})}
								src={HasDocuments}
								alt=""
							/>
						</span>
					</HtmlTooltip>
				) : (
					""
				)}
			</div>
		),
	};

	const navigate = useNavigate();

	const onHandleTableExpand = async (tg, rowId, e) => {
		setToggle(tg);
		shouldHandleClick = true;
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
			await fetchData("", modelId, false, "");
			ModelCtxDispatch({
				type: "TAB_COUNT",
				payload: { countTab: "taskCount", data: totalTaskCount + 1 },
			});
			updatedFieldFunc({ data: response.data });
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
		CtxDispatch({ type: "SET_TOOLS", payload: row.hasTools });
		CtxDispatch({ type: "SET_PERMITS", payload: row.hasPermits });
		CtxDispatch({ type: "SET_IMAGES", payload: row.hasTaskImages });
		CtxDispatch({ type: "SET_QUESTIONS", payload: row.hasQuestions });
		CtxDispatch({ type: "SET_SAFETY", payload: row.safetyCritical });
		CtxDispatch({ type: "SET_DOCUMENTS", payload: row.hasDocuments });
		CtxDispatch({ type: "SET_PARTS", payload: row.hasParts });
	}, [row]);

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
		if (!row?.intervals) {
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
		if (!row?.stages) {
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
		if (!row?.roles) {
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

		if (!originalRow?.stages && !row?.zones && row?.stages) {
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

	// useEffect(() => {
	// 	const newElement = document.getElementById(
	// 		`taskExpandable${updatedField.data}`
	// 	);
	// 	if (updatedField.data && newElement) {
	// 		// setUpdatedField({});
	// 		newElement.scrollIntoView({
	// 			behavior: "smooth",
	// 			block: "center",
	// 			inline: "center",
	// 			top: newElement.getBoundingClientRect().bottom + window.pageYOffset,
	// 		});

	// 		const observer = new IntersectionObserver(
	// 			(entries) => {
	// 				entries.forEach((entry) => {
	// 					if (entry.isIntersecting) {
	// 						entry.target.style.backgroundColor = "red";
	// 						entry.target.click();
	// 						setTimeout(() => {
	// 							entry.target.scrollIntoView({
	// 								behavior: "smooth",
	// 								block: "center",
	// 							});
	// 						}, 500);

	// 						observer.unobserve(entry.target);
	// 					}
	// 				});
	// 			},
	// 			{ threshold: 1 }
	// 		);
	// 		observer.observe(newElement);
	// 	}
	// 	return () => {
	// 		setUpdatedField({});
	// 	};
	// }, [data]);

	const handleTooltip = (col) => {
		//the query selector is not getting the repective ID . Returns null.
		const tooltipElement = document.querySelector(`#tooltip-${col} > div`);

		if (tooltipElement) {
			if (col === "roles") {
				const roleData = document.querySelector(
					`#taskExpandable${rows.id} > #dataCellroles > div > p `
				).textContent;
				document.querySelector(`#tooltip-roles > div `).innerHTML = roleData;
			} else if (col === "zones") {
				const zoneData = document.querySelector(
					`#taskExpandable${rows.id} > #dataCellzones > div > p `
				).textContent;
				document.querySelector(`#tooltip-zones > div `).innerHTML = zoneData;
			} else if (col === "stages") {
				const stageData = document.querySelector(
					`#taskExpandable${rows.id} > #dataCellstages > div > p `
				).textContent;
				document.querySelector(`#tooltip-stages > div `).innerHTML = stageData;
			} else if (col === "intervals") {
				const intervalData = document.querySelector(
					`#taskExpandable${rows.id} > #dataCellintervals > div > p `
				).textContent;
				document.querySelector(`#tooltip-intervals > div `).innerHTML =
					intervalData;
			}
		}
	};

	const handleDotMenuClick = (e) => {
		// e.stopPropagation();
		shouldHandleClick = false;
		setAnchorEl(anchorEl === e.currentTarget ? null : e.currentTarget);
		setSelectedData(anchorEl === e.currentTarget ? null : index);
	};

	const disableLink =
		typeof taskInfo?.stageCount === "number"
			? taskInfo.stageCount === 0
			: !row?.stages;

	const taskRow = useMemo(() => {
		return (
			<>
				<TableRow
					onClick={(e) => {
						if (!shouldHandleClick) {
							return;
						} else onHandleTableExpand(!toggle, rows?.id, e);
					}}
					style={{
						background: toggle
							? ColourConstants.tableRowExpand
							: ColourConstants.tableRowNormal,
						borderBottom: "hidden",
						color: toggle ? ColourConstants.tableRowNormal : "",
					}}
					id={`taskExpandable${rows.id}`}
				>
					{columns.map((col, i, arr) => (
						<TableCell
							key={col}
							className={classes.dataCell}
							style={{
								padding: "0 10px",
								maxWidth: "220px",
								color: toggle ? ColourConstants.tableRowNormal : "",
								height: "30px",
							}}
							id={`dataCell${col}`}
						>
							<AT.CellContainer key={col}>
								{/* <AT.TableBodyText style={{ color: toggle ?ColourConstants.tableRowNormal : "" }}> */}
								{toolTipColumn.includes(col) ? (
									<HtmlTooltip
										id={`tooltip-${col}`}
										title={rows[col]}
										onOpen={() => handleTooltip(col)}
									>
										<p
											className="max-two-line"
											style={{
												color: toggle ? ColourConstants.tableRowNormal : "",
											}}
											draggable="true"
										>
											{rows[col]}
										</p>
									</HtmlTooltip>
								) : (
									<span
										className="lastSpan"
										draggable="true"
										style={
											col === "name" && !disableLink
												? toggle
													? { cursor: "pointer", color: "white" }
													: { color: "rgb(17, 100, 206)", cursor: "pointer" }
												: {}
										}
										onClick={(e) => {
											if (col === "name" && !disableLink) {
												navigate(
													`${appPath}${modelsPath}/${modelId}${modelServiceLayout}`,
													{ state: { ModelVersionTaskID: rows.id } }
												);
											}
										}}
									>
										{rows[col]}
									</span>
								)}
								{/* </AT.TableBodyText> */}

								{arr.length === i + 1 ? (
									<AT.DotMenu
										onClick={handleDotMenuClick}
										className="taskdotmenu"
									>
										{access === "F" || access === "E" ? (
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
											isLast={
												index === data.length - 1 || index === data.length - 2
											}
											id={rows.id}
											clickAwayHandler={() => {
												setAnchorEl(null);
												setSelectedData(null);
											}}
											menuData={[
												{
													name: "Edit",
													handler: () => onHandleTableExpand(!toggle, rows?.id),
													isDelete: false,
												},
												{
													name: "Duplicate",
													handler: () => handleDuplicate(rows),
													isDelete: false,
												},
												{
													name: "Copy",
													handler: () => handleCopy(rows.id),
													isDelete: false,
												},
												{
													name: `Copy ${customCaptions?.task} ${customCaptions?.questionPlural}`,
													handler: () => handleCopyTaskQuestion(rows.id),
													isDelete: false,
												},
												{
													name: `Switch To ${customCaptions?.service} Layout`,
													handler: () =>
														navigate(
															`${appPath}${modelsPath}/${modelId}${modelServiceLayout}`,
															{ state: { ModelVersionTaskID: rows.id } }
														),
													isDelete: false,
													disabled: disableLink,
												},
												{
													name: "Delete",
													handler: () => handleDeleteTask(rows.id),
													isDelete: true,
												},
											].filter((x) => {
												if (state?.modelDetail?.isPublished) {
													return (
														x?.name.includes("Copy") ||
														x?.name ===
															`Switch To ${customCaptions?.service} Layout`
													);
												}
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
						style={{
							paddingBottom: 0,
							paddingTop: 0,
							background: ColourConstants.tableRowExpand,
						}}
						colSpan={18}
					>
						<Collapse in={toggle} timeout="auto" unmountOnExit>
							<ModelTaskExpand
								state={state}
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
		columns,
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
