import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import ModelTaskTable from "components/Modules/ModelTaskTable";
import DetailsPanel from "components/Elements/DetailsPanel";

import { CircularProgress, LinearProgress } from "@mui/material";
import AddNewModelTask from "./AddNewModelTask";
import {
	addModelTask,
	getLengthOfModelTasks,
	getModelTasksList,
	pasteModelTask,
} from "services/models/modelDetails/modelTasks";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import withMount from "components/HOC/withMount";
import { useLocation } from "react-router-dom";
import SearchTask from "./SearchTask";
import {
	NumericSort,
	checkIfVisibleInViewPort,
	coalesc,
	handleSort,
} from "helpers/utils";
import AutoFitContentInScreen from "components/Layouts/AutoFitContentInScreen";
import TabTitle from "components/Elements/TabTitle";
import HistoryBar from "components/Modules/HistorySidebar/HistoryBar";
import { TasksPage } from "services/History/models";
import { getSiteApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";
import { HistoryCaptions } from "helpers/constants";
import modelTaskScroller from "helpers/modelTaskScroller";
import { ModelContext } from "contexts/ModelDetailContext";

const useStyles = makeStyles()((theme) => ({
	loading: {
		position: "absolute",
		width: "100%",
		left: 0,
		top: 0,
	},
}));

function Task({
	modelId,
	state,
	dispatch,
	access,
	isMounted,
	getCurrentTaskTableSort,
	isTaskListImportSuccess,
}) {
	const [isLoading, setLoading] = useState(true);
	const [isDataLoading, setDataLoading] = useState(true);
	const [taskList, setTaskList] = useState([]);
	const [originalTaskList, setOriginalTaskList] = useState([]);
	const [currentTableSort, setCurrentTableSort] = useState([
		"actionName",
		"asc",
	]);

	const [isPasting, setPasting] = useState(false);

	const [perPage] = useState(10);
	const [pageNumber] = useState(1);
	const [totalTaskCount, setTotalTaskCount] = useState(null);
	const [enablePasteTask, setPasteTask] = useState(false);
	const shouldExpandRef = useRef(false);
	const isScrolledOnLoad = useRef(false);
	const [siteAppState, setSiteAppState] = useState(null);

	const location = useLocation();

	const reduxDispatch = useDispatch();
	let sortField = currentTableSort[0];
	let sort = currentTableSort[1];
	// const fromSeriveLayoutId = 24102;
	const fromSeriveLayoutId = location?.state?.modelVersionTaskID;
	const [
		{
			modelDetail: { modelType },
		},
	] = useContext(ModelContext);

	useEffect(() => {
		if (
			taskList.length !== 0 &&
			!isLoading &&
			!shouldExpandRef.current &&
			fromSeriveLayoutId
		) {
			setTimeout(() => {
				if (document.getElementById(`taskExpandable${fromSeriveLayoutId}`)) {
					if (
						!isScrolledOnLoad.current &&
						checkIfVisibleInViewPort(
							document.getElementById(`taskExpandable${fromSeriveLayoutId}`)
						)
					) {
						document
							.getElementById(`taskExpandable${fromSeriveLayoutId}`)
							.scrollIntoView({
								behavior: "smooth",
								block: "center",
								inline: "center",
							});

						document
							.getElementById(`taskExpandable${fromSeriveLayoutId}`)
							.click();
						isScrolledOnLoad.current = true;
					} else {
						document
							.getElementById(`taskExpandable${fromSeriveLayoutId}`)
							.scrollIntoView({
								behavior: "smooth",
								block: "center",
								inline: "center",
								// top:
								// 	document
								// 		.getElementById(`taskExpandable${fromSeriveLayoutId}`)
								// 		.getBoundingClientRect().bottom + window.pageYOffset,
							});
					}

					shouldExpandRef.current = true;
				}
			}, 1000);
		}
	}, [taskList, isLoading, fromSeriveLayoutId]);

	useEffect(() => {
		if (fromSeriveLayoutId && !isLoading) {
			const handleScroll = () => {
				if (
					!isScrolledOnLoad.current &&
					checkIfVisibleInViewPort(
						document.getElementById(`taskExpandable${fromSeriveLayoutId}`)
					)
				) {
					isScrolledOnLoad.current = true;

					setTimeout(() => {
						document
							.getElementById(`taskExpandable${fromSeriveLayoutId}`)
							.scrollIntoView(
								{
									behavior: "smooth",
									block: "start",
									inline: "start",
								},
								true
							);

						document
							.getElementById("table-scroll-wrapper-container")
							.scrollBy(0, -60);

						document
							.getElementById(`taskExpandable${fromSeriveLayoutId}`)
							.click();
					}, 1000);
				}
			};
			handleScroll();

			const tableWrapper = document.getElementsByClassName(
				"table-scroll-wrapper"
			)[0];
			if (tableWrapper) tableWrapper.addEventListener("scroll", handleScroll);
		}
	}, [fromSeriveLayoutId, isLoading]);

	const { classes } = useStyles();

	const {
		position,
		application: { name },
		customCaptions,
		siteAppID,
	} = JSON.parse(sessionStorage.getItem("me")) ||
	JSON.parse(localStorage.getItem("me"));

	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod =
			currentTableSort[0] === field && currentTableSort[1] === "asc"
				? "desc"
				: "asc";

		if (field === "taskGroupID" || field === "estimatedMinutes") {
			NumericSort(taskList, setTaskList, field, newMethod);
		} else {
			handleSort(taskList, setTaskList, field, newMethod);
		}

		// Sorting table

		// Updating header state
		setCurrentTableSort([field, newMethod]);
		getCurrentTaskTableSort([field, newMethod]);
	};

	const sortData = (data) => {
		if (currentTableSort[1] === "asc") {
			data.sort((a, b) =>
				a[currentTableSort[0]]
					?.toString()
					.localeCompare(b[currentTableSort[0]]?.toString())
			);
		}

		if (currentTableSort[0] === "desc") {
			data.sort((a, b) =>
				b[currentTableSort[0]]
					?.toString()
					.localeCompare(a[currentTableSort[0]]?.toString())
			);
		}
		return data;
	};

	const fetchData = useCallback(
		async (
			sortField = "actionName",
			modelVersionId,
			showLoading = true,
			search = "",
			pageNumber,
			pageSize,
			callCount = true,
			sort = "asc"
		) => {
			// !isMounted.aborted && showLoading && setLoading(true);
			setDataLoading(true);

			try {
				const response = await Promise.all([
					getModelTasksList(
						sortField,
						modelVersionId,
						search,
						pageNumber,
						pageSize,
						sort
					),
					callCount ? getLengthOfModelTasks(modelId) : null,
				]);

				if (response[0].status) {
					if (!isMounted.aborted) {
						const taskList = response[0].data.map((t) => ({
							...t,
							hasTaskImages: t?.hasTaskImages,
							hasTools: t?.hasTools,
							hasParts: t?.hasParts,
							hasDocuments: t?.hasDocuments,
							safetyCritical: t?.safetyCritical,
							hasQuestion: t?.hasQuestion,
							errors: t?.hasErrors,
							systemName: t?.systemName ?? "",
							intervals: t?.intervals,

							zones: t?.zones,
							roles: t?.roles,
							stages: t?.stages,
						}));

						setLoading(false);
						setOriginalTaskList(sortData(response[0].data));
						setTaskList(sortData(taskList));
						setTotalTaskCount(taskList?.length);
						setTimeout(() => {
							setDataLoading(false);
						}, 1);
					}
				} else {
					reduxDispatch(
						showError(response?.[0]?.data?.title || "something went wrong")
					);
				}

				if (callCount) {
					if (response[1].status) {
						if (!isMounted.aborted) {
							setTotalTaskCount(response[1].data);
						}
					} else {
						reduxDispatch(
							showError(response?.[1]?.data?.title || "something went wrong")
						);
					}
				}
			} catch (error) {
				reduxDispatch(
					showError(error?.response?.data || "something went wrong")
				);
			} finally {
				!isMounted.aborted && showLoading && setLoading(false);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[reduxDispatch, modelId, pageNumber, perPage]
	);

	useEffect(() => {
		fetchData(sortField, modelId, true, "", pageNumber, perPage, false, sort);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modelId, isTaskListImportSuccess]);

	useEffect(() => {
		if (enablePasteTask) {
			dispatch({ type: "DISABLE_PASTE_TASK", payload: false });
		}
	}, [enablePasteTask, dispatch]);

	const fetchSiteApplicationDetails = async () => {
		try {
			const result = await getSiteApplicationDetail(siteAppID);
			setSiteAppState(result?.data);
		} catch (error) {
			reduxDispatch(showError(error?.response?.data || "something went wrong"));
		}
	};
	useEffect(() => {
		if (
			currentTableSort[0] === "taskGroupID" ||
			currentTableSort[0] === "estimatedMinutes"
		) {
			NumericSort(
				taskList,
				setTaskList,
				currentTableSort[0],
				currentTableSort[1]
			);
		} else {
			handleSort(
				taskList,
				setTaskList,
				currentTableSort[0],
				currentTableSort[1]
			);
		}
	}, [taskList?.length]);

	useEffect(() => {
		if (state.showPasteTask) {
			setPasting(true);
			const pasteTask = async () => {
				try {
					const taskId = localStorage.getItem("task");
					const task = JSON.parse(taskId);
					const response = await pasteModelTask(modelId, {
						ModelVersionTaskID: +task.modelTaskId,
					});
					if (response.status) {
						await fetchData(
							"",
							modelId,
							false,
							"",
							pageNumber,
							perPage,
							sortField,
							sort
						);
						dispatch({
							type: "TAB_COUNT",
							payload: { countTab: "taskCount", data: totalTaskCount + 1 },
						});

						// scroll down to new pasted task
						setTimeout(() => {
							if (document.getElementById(`taskExpandable${response.data}`)) {
								modelTaskScroller(
									document.getElementById(`taskExpandable${response.data}`)
								);
							}
						}, 500);
					} else {
						reduxDispatch(
							showError(response?.data?.detail || "something went wrong")
						);
					}
				} catch (error) {
					reduxDispatch(
						showError(error?.response?.data || "something went wrong")
					);
				} finally {
					dispatch({ type: "TOGGLE_PASTE_TASK", payload: false });
					setPasteTask(false);
					setPasting(false);
				}
			};
			pasteTask();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		state.showPasteTask,
		modelId,
		dispatch,
		reduxDispatch,
		fetchData,
		pageNumber,
		perPage,
	]);

	const checkcopyQuestionStatus = async () => {
		try {
			const taskId = localStorage.getItem("task");

			if (JSON.parse(taskId).fromTask) {
				dispatch({ type: "DISABLE_PASTE_TASK", payload: false });
			}
		} catch (error) {
			return;
		}
	};

	const visibilitychangeCheck = function () {
		if (!document.hidden) {
			checkcopyQuestionStatus();
		}
	};

	useEffect(() => {
		fetchSiteApplicationDetails();
		checkcopyQuestionStatus();
		document.addEventListener("visibilitychange", visibilitychangeCheck);
		return () =>
			document.removeEventListener("visibilitychange", visibilitychangeCheck);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const createModelTask = async (payload) => {
		return await addModelTask({ ...payload, modelVersionID: modelId });
	};

	const handleRemoveData = (id) => {
		const newData = [...taskList].filter(function (item) {
			return item.id !== id;
		});
		setTaskList(newData);
		dispatch({
			type: "TAB_COUNT",
			payload: { countTab: "taskCount", data: totalTaskCount - 1 },
		});
		setTotalTaskCount(totalTaskCount - 1);
	};

	const handleCopy = (modelTaskId) => {
		localStorage.setItem(
			"task",
			JSON.stringify({ fromTask: true, modelTaskId })
		);
		setPasteTask(true);
	};

	const handleCopyTaskQuestion = (modelTaskId) => {
		navigator.clipboard.writeText(modelTaskId);
		dispatch({ type: "DISABLE_QUESTIONS_TASKS", payload: false });
		localStorage.setItem("tasksquestions", modelTaskId);
	};

	const modelTaskTable = useMemo(() => {
		return (
			<AutoFitContentInScreen containsTable>
				<ModelTaskTable
					currentTableSort={currentTableSort}
					setCurrentTableSort={setCurrentTableSort}
					handleSortClick={handleSortClick}
					handleEdit={() => {}}
					handleDelete={handleRemoveData}
					handleCopy={handleCopy}
					handleCopyTaskQuestion={handleCopyTaskQuestion}
					setData={setTaskList}
					headers={
						dymanicTableHeader(
							siteAppState?.application?.showOperatingMode,
							siteAppState?.application?.showSystem,
							customCaptions,
							modelType
						).header
					}
					columns={
						dymanicTableHeader(
							siteAppState?.application?.showOperatingMode,
							siteAppState?.application?.showSystem,
							customCaptions,
							modelType
						).columns
					}
					data={taskList}
					originalData={originalTaskList}
					modelId={modelId}
					pageSize={perPage}
					pageNo={pageNumber}
					customCaptions={customCaptions}
					access={access}
					totalTaskCount={totalTaskCount}
					fetchData={fetchData}
					isDataLoading={isDataLoading}
				/>
			</AutoFitContentInScreen>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		taskList,
		totalTaskCount,
		isDataLoading,
		siteAppState?.application?.showOperatingMode,
		siteAppState?.application?.showSystem,
	]);

	const handleItemClick = (id) => {
		dispatch({ type: "TOGGLE_HISTORYBAR" });

		// commonScrollElementIntoView(`interval-${id}`);
		setTimeout(() => {
			if (document.getElementById(`taskExpandable${id}`)) {
				modelTaskScroller(document.getElementById(`taskExpandable${id}`));
			}
		}, 500);
	};

	if (isLoading) return <CircularProgress />;
	return (
		<div>
			<TabTitle
				title={`${state?.modelDetail?.name} ${coalesc(
					state?.modelDetail?.modelName
				)} ${customCaptions.taskPlural} | ${name}`}
			/>
			<HistoryBar
				id={modelId}
				showhistorybar={state.showhistorybar}
				dispatch={dispatch}
				fetchdata={(id, pageNumber, pageSize) =>
					TasksPage(id, pageNumber, pageSize)
				}
				OnAddItemClick={handleItemClick}
				hasSubTable={true}
				origin={HistoryCaptions.modelVersionTasks}
			/>
			{isPasting ? <LinearProgress className={classes.loading} /> : null}
			<AddNewModelTask
				open={state.showAdd}
				closeHandler={() => dispatch({ type: "TOGGLE_ADD", payload: false })}
				siteId={position?.siteAppID}
				data={null}
				title={`Add ${customCaptions?.task}`}
				modelId={modelId}
				createProcessHandler={createModelTask}
				fetchData={() =>
					fetchData(
						"",
						modelId,
						false,
						"",
						pageNumber,
						perPage,
						sortField,
						sort
					)
				}
				pageSize={perPage}
				pageNo={pageNumber}
				customCaptions={customCaptions}
				totalTaskCount={totalTaskCount}
				showSave
			/>

			<div className="detailsContainer" style={{ alignItems: "center" }}>
				<DetailsPanel
					header={customCaptions?.taskPlural}
					dataCount={taskList.length}
					description={`${customCaptions?.taskPlural} assigned in this ${customCaptions?.modelTemplate}`}
				/>
				<SearchTask fetchData={fetchData} modelId={modelId} classes={classes} />
			</div>

			{modelTaskTable}
		</div>
	);
}

const dymanicTableHeader = (
	operatingModeShown,
	showSystem,
	customCaptions,
	modelType
) => {
	let header = [
		{ id: 16, name: "", isSort: false },
		{ id: 9, name: "Order Added", isSort: true },
		{ id: 2, name: customCaptions?.actionRequired, isSort: true },
		{ id: 3, name: "Name", isSort: true },
		{ id: 6, name: customCaptions?.rolePlural, isSort: true },
		{ id: 7, name: "Est Mins", isSort: true },
		{
			id: 11,
			name: customCaptions?.intervalPlural,
			isSort: true,
			width: "100px",
		},
		{ id: 12, name: customCaptions?.stagePlural, isSort: true },
		{ id: 13, name: customCaptions?.zonePlural, isSort: true },
		{ id: 10, name: "Notes", isSort: true },
	];

	// insert indexes for show system and operating mode
	let insertIndexOperatingMode = 4;
	let insertIndexShowSystem = 5;

	// Updating the insert index
	if (modelType === "F") {
		insertIndexOperatingMode = 5;
		insertIndexShowSystem = 6;
	}

	// for modelType "F"
	if (modelType === "F") {
		header.splice(4, 0, {
			id: 14,
			name: customCaptions?.asset,
			isSort: true,
		});
	}

	// for operatingModeShown
	if (operatingModeShown) {
		header.splice(insertIndexOperatingMode, 0, {
			id: 4,
			name: customCaptions?.operatingMode,
			isSort: true,
		});
	}

	//for operatingModeShown and showSystem

	if (operatingModeShown && showSystem) {
		header.splice(insertIndexShowSystem, 0, {
			id: 5,
			name: customCaptions?.system,
			isSort: true,
		});
	}
	// for only showSystem
	if (modelType !== "F" && !operatingModeShown && showSystem) {
		header.splice(4, 0, {
			id: 5,
			name: customCaptions?.system,
			isSort: true,
		});
	}

	return {
		header,
		columns: [
			"logo",
			"taskGroupID",
			"actionName",
			"name",
			...(modelType === "F" ? ["assets"] : []),
			...(operatingModeShown ? ["operatingModeName"] : []),
			...(showSystem ? ["systemName"] : []),
			"roles",
			"estimatedMinutes",
			"intervals",
			"stages",
			"zones",
			"notes",
		],
	};
};

export default withMount(Task);
