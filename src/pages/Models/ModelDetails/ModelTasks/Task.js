import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import ModelTaskTable from "components/Modules/ModelTaskTable";
import ErrorIcon from "@material-ui/icons/Error";
import DetailsPanel from "components/Elements/DetailsPanel";
import HasImages from "assets/icons/images.svg";
import HasDocuments from "assets/icons/documents.svg";
import HasTools from "assets/icons/tools.svg";
import HasParts from "assets/icons/parts.svg";
import SafteryCritical from "assets/icons/safety-critical.svg";
import { CircularProgress, LinearProgress } from "@material-ui/core";
import AddNewModelTask from "./AddNewModelTask";
import {
	addModelTask,
	getLengthOfModelTasks,
	getModelTasksList,
	pasteModelTask,
} from "services/models/modelDetails/modelTasks";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { makeStyles } from "@material-ui/core/styles";
import withMount from "components/HOC/withMount";
import { useHistory } from "react-router-dom";
import SearchTask from "./SearchTask";
import { checkIfVisibleInViewPort } from "helpers/utils";
import useDidMountEffect from "hooks/useDidMountEffect";

const useStyles = makeStyles({
	loading: {
		position: "absolute",
		width: "100%",
		left: 0,
		top: 0,
	},
});

function Task({ modelId, state, dispatch, access, isMounted }) {
	const [isLoading, setLoading] = useState(true);
	const [isDataLoading, setDataLoading] = useState(true);
	const [taskList, setTaskList] = useState([]);
	const [originalTaskList, setOriginalTaskList] = useState([]);

	const [isPasting, setPasting] = useState(false);

	const [perPage] = useState(10);
	const [pageNumber] = useState(1);
	const [totalTaskCount, setTotalTaskCount] = useState(null);
	const [enablePasteTask, setPasteTask] = useState(false);
	const [tableHeight, setTableHeight] = useState(0);
	const shouldExpandRef = useRef(false);
	const isScrolledOnLoad = useRef(false);

	const history = useHistory();

	const reduxDispatch = useDispatch();

	const fromSeriveLayoutId = 24102;
	// const fromSeriveLayoutId = history?.location?.state?.modelVersionTaskID;

	useEffect(() => {
		if (
			taskList.length !== 0 &&
			isLoading === false &&
			shouldExpandRef.current === false &&
			fromSeriveLayoutId
		) {
			setTimeout(() => {
				if (document.getElementById(`taskExpandable${fromSeriveLayoutId}`)) {
					document
						.getElementById(`taskExpandable${fromSeriveLayoutId}`)
						.scrollIntoView({
							behavior: "smooth",
							block: "start",
							inline: "start",
							// top:
							// 	document
							// 		.getElementById(`taskExpandable${fromSeriveLayoutId}`)
							// 		.getBoundingClientRect().bottom + window.pageYOffset,
						});

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
					// console.log("scrolled", isScrolledOnLoad);
					isScrolledOnLoad.current = true;
					setTimeout(() => {
						document
							.getElementById(`taskExpandable${fromSeriveLayoutId}`)
							.click();
						setTimeout(() => {
							document
								.getElementById(`taskExpandable${fromSeriveLayoutId}`)
								.scrollIntoView({
									behavior: "smooth",
									block: "start",
									inline: "start",
								});
						}, 1000);
					}, 500);
				}
			};
			handleScroll();

			const tableWrapper = document.getElementsByClassName(
				"table-scroll-wrapper"
			)[0];
			if (tableWrapper) tableWrapper.addEventListener("scroll", handleScroll);
		}
	}, [fromSeriveLayoutId, isLoading]);

	useEffect(() => {
		document.body.style.overflowY = "hidden";
		return () => {
			window.removeEventListener("scroll", () => {});
			document.body.style.overflowY = "auto";
		};
	}, []);

	const classes = useStyles();

	const {
		position,
		application: { showOperatingMode },
		customCaptions,
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const fetchData = useCallback(
		async (
			modelVersionId,
			showLoading = true,
			search = "",
			pageNumber,
			pageSize,
			callCount = true
		) => {
			// !isMounted.aborted && showLoading && setLoading(true);
			try {
				const response = await Promise.all([
					getModelTasksList(modelVersionId, search, pageNumber, pageSize),
					callCount ? getLengthOfModelTasks(modelId) : null,
				]);
				if (response[0].status) {
					if (!isMounted.aborted) {
						const taskList = response[0].data.map((t) => ({
							...t,
							hasTaskImages: t?.hasTaskImages ? (
								<img src={HasImages} alt="" />
							) : (
								""
							),
							hasTools: t?.hasTools ? <img src={HasTools} alt="" /> : "",
							hasParts: t?.hasParts ? <img src={HasParts} alt="" /> : "",
							hasDocuments: t?.hasDocuments ? (
								<img src={HasDocuments} alt="" />
							) : (
								""
							),
							safetyCritical: t?.safetyCritical ? (
								<img src={SafteryCritical} alt="" />
							) : (
								""
							),
							errors: t?.hasErrors ? t?.hasErrors : "",
							intervals: t?.intervals
								?.map((interval) => interval?.name)
								?.join(", "),
							zones: t?.zones?.map((zone) => zone?.name)?.join(", "),
							roles: t?.roles?.map((role) => role?.name)?.join(", "),
							stages: t?.stages?.map((stage) => stage?.name)?.join(", "),
						}));
						setLoading(false);
						setDataLoading(true);
						setTimeout(() => {
							setTaskList(taskList);
							setOriginalTaskList(response[0].data);
							setDataLoading(false);
						}, 1);
					}
				} else {
					reduxDispatch(
						showError(response[0]?.data?.title || "something went wrong")
					);
				}

				if (callCount) {
					if (response[1].status) {
						if (!isMounted.aborted) {
							setTotalTaskCount(response[1].data);
						}
					} else {
						reduxDispatch(
							showError(response[1]?.data?.title || "something went wrong")
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
		fetchData(modelId, true, "", pageNumber, perPage);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [modelId]);

	useEffect(() => {
		if (enablePasteTask) {
			dispatch({ type: "DISABLE_PASTE_TASK", payload: false });
		}
	}, [enablePasteTask, dispatch]);

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
						await fetchData(modelId, false, "", pageNumber, perPage);
						dispatch({
							type: "TAB_COUNT",
							payload: { countTab: "taskCount", data: totalTaskCount + 1 },
						});

						// scroll down to new pasted task
						setTimeout(() => {
							if (document.getElementById(`taskExpandable${response.data}`)) {
								document
									.getElementById(`taskExpandable${response.data}`)
									.scrollIntoView({
										behavior: "smooth",
										block: "start",
										top:
											document
												.getElementById(`taskExpandable${response.data}`)
												.getBoundingClientRect().bottom + window.pageYOffset,
									});

								setTimeout(() => {
									document
										.getElementById(`taskExpandable${response.data}`)
										.click();
									setTimeout(() => {
										document
											.getElementById(`taskExpandable${response.data}`)
											.scrollIntoView({
												behavior: "smooth",
												block: "start",
												inline: "center",
											});
									}, 1000);
								}, 500);
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
					console.log(error);
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
	};

	const handleTableHeight = () => {
		const tableContainer = document.getElementById(
			"table-scroll-wrapper-container"
		);
		if (tableContainer) {
			let tableContainerTop = tableContainer.getBoundingClientRect().top;
			setTableHeight(window.innerHeight - tableContainerTop - 25);
		}
	};

	useDidMountEffect(() => {
		handleTableHeight();
	}, [isLoading]);

	useEffect(() => {
		window.addEventListener("resize", handleTableHeight);
		return () => window.removeEventListener("resize", handleTableHeight);
	}, []);

	const modelTaskTable = useMemo(() => {
		return (
			<ModelTaskTable
				handleEdit={() => {}}
				handleDelete={handleRemoveData}
				handleCopy={handleCopy}
				handleCopyTaskQuestion={handleCopyTaskQuestion}
				setData={setTaskList}
				headers={dymanicTableHeader(showOperatingMode, customCaptions).header}
				columns={dymanicTableHeader(showOperatingMode, customCaptions).columns}
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
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [taskList, totalTaskCount, isDataLoading]);

	if (isLoading) return <CircularProgress />;
	return (
		<div>
			{isPasting ? <LinearProgress className={classes.loading} /> : null}
			<AddNewModelTask
				open={state.showAdd}
				closeHandler={() => dispatch({ type: "TOGGLE_ADD", payload: false })}
				siteId={position?.siteAppID}
				data={null}
				title={`Add ${customCaptions?.task}`}
				modelId={modelId}
				createProcessHandler={createModelTask}
				fetchData={() => fetchData(modelId, false, "", pageNumber, perPage)}
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
					description={`${customCaptions?.task} assigned in this asset model`}
				/>
				<SearchTask fetchData={fetchData} modelId={modelId} classes={classes} />
			</div>
			<div
				className="table-scroll-wrapper"
				id="table-scroll-wrapper-container"
				style={{ maxHeight: tableHeight + "px" }}
			>
				{modelTaskTable}
			</div>
		</div>
	);
}

const dymanicTableHeader = (operatingModeShown, customCaptions) => {
	if (operatingModeShown)
		return {
			header: [
				{
					id: 16,
					name: <img src={HasImages} alt="" />,
					isSort: false,
				},
				{
					id: 15,
					name: <img src={HasTools} alt="" />,
					isSort: false,
				},
				{ id: 1, name: <img src={HasParts} alt="" />, isSort: false },
				{
					id: 17,
					name: <img src={HasDocuments} alt="" />,
					isSort: false,
				},
				{
					id: 13,
					name: <img src={SafteryCritical} alt="" />,
					isSort: false,
				},
				{
					id: 14,
					name: <ErrorIcon style={{ color: "red" }} />,
					isSort: false,
				},
				{ id: 2, name: customCaptions?.actionRequired, isSort: true },
				{ id: 3, name: "Name", isSort: true, uuid: "name" },
				{ id: 4, name: customCaptions?.operatingMode, isSort: true },
				{ id: 5, name: customCaptions?.system, isSort: true },
				{ id: 6, name: customCaptions?.rolePlural, isSort: true },
				{ id: 7, name: "Est Mins", isSort: true },
				{ id: 9, name: "Order Added", isSort: true },
				{
					id: 10,
					name: customCaptions?.intervalPlural,
					isSort: true,
					width: "100px",
				},
				{ id: 11, name: customCaptions?.stagePlural, isSort: true },
				{ id: 12, name: customCaptions?.zonePlural, isSort: true },
			],
			columns: [
				"hasTaskImages",
				"hasTools",
				"hasParts",
				"hasDocuments",
				"safetyCritical",
				"errors",
				"actionName",
				"name",
				"operatingModeName",
				"systemName",
				"roles",
				"estimatedMinutes",
				"taskGroupID",
				"intervals",
				"stages",
				"zones",
			],
		};
	return {
		header: [
			{ id: 16, name: <img src={HasImages} alt="" />, isSort: false },
			{ id: 15, name: <img src={HasTools} alt="" />, isSort: false },
			{ id: 1, name: <img src={HasParts} alt="" />, isSort: false },
			{
				id: 17,
				name: <img src={HasDocuments} alt="" />,
				isSort: false,
			},
			{
				id: 13,
				name: <img src={SafteryCritical} alt="" />,
				isSort: false,
			},
			{
				id: 14,
				name: <ErrorIcon style={{ color: "red" }} />,
				isSort: false,
			},
			{ id: 2, name: customCaptions?.actionRequired, isSort: true },
			{ id: 3, name: "Name", isSort: true },
			{ id: 5, name: customCaptions?.system, isSort: true },
			{ id: 6, name: customCaptions?.rolePlural, isSort: true },
			{ id: 7, name: "Est Mins", isSort: true },
			{ id: 9, name: "Order Added", isSort: true },
			{
				id: 10,
				name: customCaptions?.intervalPlural,
				isSort: true,
				width: "100px",
			},
			{ id: 11, name: customCaptions?.stagePlural, isSort: true },
			{ id: 12, name: customCaptions?.zonePlural, isSort: true },
		],
		columns: [
			"hasTaskImages",
			"hasTools",
			"hasParts",
			"hasDocuments",
			"safetyCritical",
			"errors",
			"actionName",
			"name",
			"systemName",
			"roles",
			"estimatedMinutes",
			"taskGroupID",
			"intervals",
			"stages",
			"zones",
		],
	};
};

export default withMount(Task);
