import React, { useCallback, useEffect, useState } from "react";
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
import DeleteDialog from "components/Elements/DeleteDialog";
import {
	addModelTask,
	getLengthOfModelTasks,
	getModelTasksList,
	pasteModelTask,
} from "services/models/modelDetails/modelTasks";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { Apis } from "services/api";
import SearchField from "components/Elements/SearchField/SearchField";
import TablePagination from "components/Elements/TablePagination";
import { makeStyles } from "@material-ui/core/styles";
import withMount from "components/HOC/withMount";

const useStyles = makeStyles({
	loading: {
		position: "absolute",
		width: "100%",
		left: 0,
		top: 0,
	},
});

const debounce = (func, delay) => {
	let timer;
	return function () {
		let self = this;
		let args = arguments;
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(self, args);
		}, delay);
	};
};

function Task({ modelId, state, dispatch, access, isMounted }) {
	const [isLoading, setLoading] = useState(false);
	const [taskList, setTaskList] = useState([]);

	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [taskToDeleteId, setTaskToDeleteId] = useState(null);
	const [isPasting, setPasting] = useState(false);
	const [searchTxt, setSearchTxt] = useState("");

	const [perPage] = useState(10);
	const [pageNumber, setPageNumber] = useState(1);
	const [totalTaskCount, setTotalTaskCount] = useState(null);
	const [isSearching, setIsSearching] = useState(false);

	const [enablePasteTask, setPasteTask] = useState(false);

	const reduxDispatch = useDispatch();

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
			pageNumber = 1,
			pageSize = 10,
			callCount = true
		) => {
			!isMounted.aborted && showLoading && setLoading(true);
			try {
				const response = await Promise.all([
					getModelTasksList(modelVersionId, search, pageNumber, pageSize),
					callCount ? getLengthOfModelTasks(modelId) : null,
				]);
				if (response[0].status) {
					if (!isMounted.aborted) {
						setTaskList(
							response[0].data.map((t) => ({
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
							}))
						);
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
		[reduxDispatch, modelId]
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
					const taskId = await navigator.clipboard.readText();
					const response = await pasteModelTask(modelId, {
						ModelVersionTaskID: +taskId,
					});
					if (response.status) {
						fetchData(modelId, false, searchTxt, pageNumber, perPage);
					} else {
						reduxDispatch(
							showError(response?.data?.title || "something went wrong")
						);
					}
				} catch (error) {
					reduxDispatch(
						showError(error?.response?.data || "something went wrong")
					);
				} finally {
					dispatch({ type: "DISABLE_PASTE_TASK", payload: true });
					dispatch({ type: "TOGGLE_PASTE_TASK", payload: false });
					setPasteTask(false);
					setPasting(false);
				}
			};
			pasteTask();
		}
	}, [
		state.showPasteTask,
		modelId,
		dispatch,
		reduxDispatch,
		fetchData,
		pageNumber,
		perPage,
		searchTxt,
	]);

	const handleSearch = useCallback(
		debounce(async (value) => {
			setIsSearching(true);
			if (value) await fetchData(modelId, false, value, 1, 100, false);
			else await fetchData(modelId, false, "", pageNumber, perPage, false);
			setIsSearching(false);
		}, 1500),
		[]
	);

	const createModelTask = async (payload) => {
		return await addModelTask({ ...payload, modelVersionID: modelId });
	};

	const handleDeleteTask = (taskId) => {
		setTaskToDeleteId(taskId);
		setOpenDeleteDialog(true);
	};

	const handleRemoveData = (id) => {
		const newData = [...taskList].filter(function (item) {
			return item.id !== id;
		});
		setTaskList(newData);
		setTotalTaskCount(totalTaskCount - 1);
	};

	const handleCopy = (modelTaskId) => {
		navigator.clipboard.writeText(modelTaskId);
		setPasteTask(true);
	};

	const handleCopyTaskQuestion = (modelTaskId) => {
		navigator.clipboard.writeText(modelTaskId);
	};

	const handlePageChange = async (page) => {
		setPageNumber(page);
		setIsSearching(false);
		await fetchData(modelId, false, "", page, perPage, false);
		setIsSearching(true);
	};

	if (isLoading) return <CircularProgress />;
	return (
		<div>
			{isPasting || isSearching ? (
				<LinearProgress className={classes.loading} />
			) : null}
			<AddNewModelTask
				open={state.showAdd}
				closeHandler={() => dispatch({ type: "TOGGLE_ADD", payload: false })}
				siteId={position?.siteAppID}
				data={null}
				title={`Add Model ${customCaptions?.task}`}
				modelId={modelId}
				createProcessHandler={createModelTask}
				fetchData={() =>
					fetchData(modelId, false, searchTxt, pageNumber, perPage)
				}
				pageSize={perPage}
				pageNo={pageNumber}
				customCaptions={customCaptions}
			/>
			<DeleteDialog
				entityName={`Model ${customCaptions?.task}`}
				open={openDeleteDialog}
				closeHandler={() => setOpenDeleteDialog(false)}
				deleteEndpoint={Apis.ModelTasks}
				deleteID={taskToDeleteId}
				handleRemoveData={handleRemoveData}
			/>
			<div className="detailsContainer" style={{ alignItems: "center" }}>
				<DetailsPanel
					header={customCaptions?.taskPlural}
					dataCount={searchTxt === "" ? totalTaskCount : taskList.length}
					description={`${customCaptions?.task} assigned in this asset model`}
				/>
				<SearchField
					searchQuery={searchTxt}
					setSearchQuery={(e) => {
						setSearchTxt(e.target.value);
						handleSearch(e.target.value);
					}}
				/>
			</div>

			<ModelTaskTable
				handleEdit={() => {}}
				handleDelete={handleDeleteTask}
				handleCopy={handleCopy}
				handleCopyTaskQuestion={handleCopyTaskQuestion}
				setData={setTaskList}
				headers={dymanicTableHeader(showOperatingMode, customCaptions).header}
				columns={dymanicTableHeader(showOperatingMode, customCaptions).columns}
				data={taskList}
				modelId={modelId}
				fetchData={() =>
					fetchData(modelId, false, searchTxt, pageNumber, perPage)
				}
				pageSize={perPage}
				pageNo={pageNumber}
				customCaptions={customCaptions}
				access={access}
			/>
			{searchTxt === "" && (
				<TablePagination
					page={pageNumber}
					rowsPerPage={perPage}
					onPageChange={handlePageChange}
					count={totalTaskCount}
				/>
			)}
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
				{ id: 3, name: "Name", isSort: true },
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
