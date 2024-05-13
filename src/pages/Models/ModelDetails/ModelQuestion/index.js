import React, {
	useState,
	useEffect,
	useRef,
	useMemo,
	useCallback,
} from "react";
import { connect } from "react-redux";
import {
	getModelQuestions,
	duplicateModelQuestions,
	pasteModelQuestions,
} from "services/models/modelDetails/modelQuestions";
import DeleteDialog from "components/Elements/DeleteDialog";
import { CircularProgress, LinearProgress } from "@mui/material";
import DetailsPanel from "components/Elements/DetailsPanel";
import { showError } from "redux/common/actions";
import {
	questionTimingOptions,
	questionTypeOptions,
} from "constants/modelDetail";
import { appPath, modelServiceLayout, modelsPath } from "helpers/routePaths";
import { getModelRolesList } from "services/models/modelDetails/modelRoles";
import QuestionTable from "./QuestionTable";
import withMount from "components/HOC/withMount";
import AddEditModel from "./AddEditModel";
import { Tooltip } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import { withStyles } from "@mui/styles";
import ErrorMessageWithErrorIcon from "components/Elements/ErrorMessageWithErrorIcon";
import AutoFitContentInScreen from "components/Layouts/AutoFitContentInScreen";
import SearchField from "components/Elements/SearchField/SearchField";
import TabTitle from "components/Elements/TabTitle";
import { coalesc, commonScrollElementIntoView } from "helpers/utils";
import HistoryBar from "components/Modules/HistorySidebar/HistoryBar";
import { QuestionsPage } from "services/History/models";
import { useNavigate } from "react-router-dom";
import { HistoryCaptions } from "helpers/constants";
// import useLazyLoad from "hooks/useLazyLoad";

const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9",
	},
}))(Tooltip);

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
const useStyles = makeStyles()((theme) => ({
	loading: {
		position: "absolute",
		width: "100%",
		left: 0,
		top: 0,
	},
}));

const ModelQuestion = ({
	state,
	dispatch,
	modelId,
	getError,
	isMounted,
	access,
	history,
}) => {
	const {
		customCaptions: {
			question,
			questionPlural,
			rolePlural,
			modelTemplate,
			service,
			zone,
			stage,
		},
		application,
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const { classes, cx } = useStyles();

	const triggerRef = useRef(null);
	const pasteQuestionRef = useRef(false);

	// INITIAL STATES
	const [data, setData] = useState([]);
	const [roleOptions, setRoleOptions] = useState([]);
	const [deleteModel, setDeleteModel] = useState(false);
	const [questionId, setQuestionId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [duplicating, setDuplicating] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [isSearching, setIsSearching] = useState(false);
	const fromSeriveLayoutId = history?.state?.modelVersionQuestionID;
	const [searchTxt, setSearchTxt] = useState("");

	useEffect(() => {
		if (roleOptions.length === 1) {
			const res = data.map((x) => apiResponse(x, roleOptions));
			setData(res);
		}
	}, [roleOptions.length]);
	// HANDLING OPERATIONS
	function apiResponse(x, options) {
		const type = x.type;
		const timing = x.timing;
		const questionType = questionTypeOptions.find((x) => x.value === type);
		const timingType = questionTimingOptions.find((x) => x.value === timing);

		return {
			...x,
			compulsory: x.isCompulsory ? "Yes" : "No",
			modelRoles:
				roleOptions.length === 1 ? (
					options[0]?.name
				) : x.roles === null || x.roles?.length === 0 ? (
					<ErrorMessageWithErrorIcon message={`No ${rolePlural} Assigned`} />
				) : (
					x.roles.map((x) => x.name).join(", ")
				),
			roles: roleOptions.length === 1 ? [options[0]] : [],
			modelType: questionType.label,
			modelTiming: timingType.label,
			additional:
				type === "B" ? (
					<>
						<span>
							<strong>Checkbox Caption : </strong>&nbsp;{x.checkboxCaption}
						</span>
					</>
				) : type === "O" || type === "C" ? (
					<>
						{x?.options === null || x?.options?.length === 0 ? (
							<ErrorMessageWithErrorIcon message="No Options Assigned" />
						) : (
							<HtmlTooltip
								title={x.options
									.sort((a, b) => a.name.localeCompare(b.name))
									.map((a) => a.name)
									.join(", ")}
								className="max-two-line"
							>
								<span>
									{" "}
									<strong>Options : </strong>&nbsp;
									{x.options
										.sort((a, b) => a.name.localeCompare(b.name))
										.map((a) => a.name)
										.join(", ")}
								</span>
							</HtmlTooltip>
						)}
					</>
				) : type === "N" ? (
					<>
						<span>
							<strong>Decimal Places : </strong>&nbsp;{x.decimalPlaces}
						</span>
					</>
				) : (
					""
				),
		};
	}

	const fetchQuestions = async (seachTxt = "") => {
		try {
			let result = await getModelQuestions(modelId, seachTxt);
			if (result.status) {
				if (!isMounted.aborted) {
					result = result.data.map((x) => apiResponse(x, roleOptions));
					setData(result);
				}
				dispatch({
					type: "TAB_COUNT",
					payload: { countTab: "questionCount", data: result.length },
				});
			} else {
				if (result.data?.detail) getError(result.data.detail);
				else {
					if (result.data.title) {
						getError(result.data.title);
					} else {
						getError("Something went wrong");
					}
				}
			}
		} catch (e) {
			return;
		}
	};
	const fetchRoles = async () => {
		try {
			let result = await getModelRolesList(modelId);
			if (result.status) {
				if (!isMounted.aborted) setRoleOptions(result.data);
			}
		} catch (e) {
			return;
		}
	};

	const fetchData = async () => {
		await Promise.all([fetchRoles(), fetchQuestions()]);
		setLoading(false);
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// searching questions
	const handleSearch = useCallback(
		debounce(async (value) => {
			setIsSearching(true);
			await fetchQuestions(value + "");
			setIsSearching(false);
		}, 1500),
		[]
	);

	useEffect(() => {
		if (fromSeriveLayoutId && !loading) {
			const element = document.getElementById(`row${fromSeriveLayoutId}`);
			const tableElement = document.getElementById(
				"table-scroll-wrapper-container"
			);

			element &&
				tableElement.scroll({
					behavior: "smooth",
					top:
						element.getBoundingClientRect().top -
						tableElement.getBoundingClientRect().top -
						56,
				});
			element && (element.style.background = "#ffeb3b");
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loading]);

	useEffect(() => {
		if (state.showPasteTask) {
			const handlePaste = async () => {
				setDuplicating(true);
				try {
					const questionText = localStorage.getItem("question");

					const question = JSON.parse(questionText);

					let result = await pasteModelQuestions(modelId, {
						modelVersionQuestionID: question.copiedData.id,
						roles: roleOptions[0],
					});

					if (result.status) {
						if (!isMounted.aborted) {
							await fetchQuestions();

							// scroll to pasted question
							setTimeout(() => {
								const element = document.getElementById(`row${result.data}`);
								element &&
									element.scrollIntoView({
										behavior: "smooth",
										block: "end",
									});
							}, 1000);
						}
					} else {
						if (result.data.detail) getError(result.data.detail);
						else getError("Something went wrong");
					}
				} catch (e) {
					return;
				} finally {
					if (!isMounted.aborted) {
						// dispatch({ type: "DISABLE_QUESTION_TASK", payload: true });
						dispatch({ type: "TOGGLE_PASTE_TASK", payload: false });
						setDuplicating(false);
					}
				}
			};
			handlePaste();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.showPasteTask]);
	//navigate
	const navigate = useNavigate();
	// Handle Edit Question
	const handleEdit = (id) => {
		setQuestionId(id);
		setEditMode(true);
		dispatch({ type: "TOGGLE_ADD", payload: true });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	};

	//Handle Duplicate Question
	const handleDuplicate = async (id) => {
		setDuplicating(true);
		try {
			let result = await duplicateModelQuestions(id);
			if (result.status) {
				if (!isMounted.aborted) {
					setSearchTxt("");
					await fetchQuestions();

					// scroll to duplicated question
					setTimeout(() => {
						const element = document.getElementById(`row${result.data}`);
						element &&
							element.scrollIntoView({
								behavior: "smooth",
								block: "end",
							});
					}, 1000);
				}
			} else {
				if (result.data.detail) getError(result.data.detail);
				else getError("Error Duplicating");
			}
		} catch (e) {
			return;
		} finally {
			if (!isMounted.aborted) setDuplicating(false);
		}
	};

	const handleCopy = (id) => {
		const copiedData = data.find((x) => x.id === id);

		localStorage.setItem(
			"question",
			JSON.stringify({ fromQuestion: true, copiedData })
		);
		pasteQuestionRef.current = true;
		dispatch({ type: "DISABLE_QUESTION_TASK", payload: false });
	};

	const checkcopyQuestionStatus = async () => {
		try {
			const questionText = localStorage.getItem("question");

			if (JSON.parse(questionText).fromQuestion) {
				dispatch({ type: "DISABLE_QUESTION_TASK", payload: false });
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

	// Handle Delete Question
	const handleDelete = (id) => {
		setDeleteModel(true);
		setQuestionId(id);
	};

	const handleRemoveData = (id) => {
		const filteredData = data.filter((x) => x.id !== id);
		setData(filteredData);
		dispatch({
			type: "TAB_COUNT",
			payload: { countTab: "questionCount", data: filteredData.length },
		});
	};

	const handleDeleteDialogClose = () => {
		setDeleteModel(false);
		setQuestionId(null);
	};

	const handleAddEditComplete = async (addedquestionId) => {
		setSearchTxt("");
		await fetchQuestions();

		// scroll to added question
		setTimeout(() => {
			const element = document.getElementById(`row${addedquestionId}`);
			element &&
				element.scrollIntoView({
					behavior: "smooth",
					block: "end",
				});
		}, 1000);
	};

	const handleOptions = (responseData) => {
		const d = data.map((x) => (x.id === responseData.id ? responseData : x));
		setData(d);
	};

	const handleSwitchToServiceLayout = (id) => {
		navigate(`${appPath}${modelsPath}/${modelId}${modelServiceLayout}`, {
			state: { ModelVersionQuestionID: id },
		});
	};

	const questionTable = useMemo(() => {
		return (
			<AutoFitContentInScreen containsTable>
				<QuestionTable
					data={data}
					setData={setData}
					rolePlural={rolePlural}
					menuData={[
						{
							name: "Edit",
							handler: handleEdit,
							isDelete: false,
						},
						{
							name: "Duplicate",
							handler: handleDuplicate,
							isDelete: false,
						},
						{
							name: "Copy",
							handler: handleCopy,
							isDelete: false,
						},
						{
							name: `Switch To ${service} Layout`,
							handler: handleSwitchToServiceLayout,
							isDelete: false,
						},
						{
							name: "Delete",
							handler: handleDelete,
							isDelete: true,
						},
					].filter((x) => {
						if (state?.modelDetail?.isPublished) {
							return (
								x?.name === "Copy" || x?.name === `Switch To ${service} Layout`
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
				<div ref={triggerRef} />
			</AutoFitContentInScreen>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, rolePlural, access, triggerRef]);

	if (loading) {
		return <CircularProgress />;
	}

	const handleItemClick = (id) => {
		dispatch({ type: "TOGGLE_HISTORYBAR" });

		commonScrollElementIntoView(`row${id}`, "rowEl");
	};

	return (
		<>
			<TabTitle
				title={`${state?.modelDetail?.name} ${coalesc(
					state?.modelDetail?.modelName
				)} ${questionPlural} | ${application.name}`}
			/>
			<HistoryBar
				id={modelId}
				showhistorybar={state.showhistorybar}
				dispatch={dispatch}
				fetchdata={(id, pageNumber, pageSize) =>
					QuestionsPage(id, pageNumber, pageSize)
				}
				OnAddItemClick={handleItemClick}
				isQuestion={true}
				origin={HistoryCaptions.modelVersionQuestions}
			/>
			{isSearching && <LinearProgress className={classes.loading} />}
			<AddEditModel
				open={state.showAdd}
				handleClose={() => {
					setEditMode(false);
					dispatch({ type: "TOGGLE_ADD", payload: false });
					setQuestionId(null);
				}}
				questionDetail={data.find((x) => x.id === questionId)}
				title={question}
				modelId={modelId}
				getError={getError}
				roleOptions={roleOptions}
				handleAddEditComplete={handleAddEditComplete}
				handleOptions={handleOptions}
				editMode={editMode}
				customCaptions={{ rolePlural, zone, stage }}
			/>
			<DeleteDialog
				open={deleteModel}
				entityName={`${question}`}
				deleteID={questionId}
				deleteEndpoint={`/api/modelversionquestions`}
				handleRemoveData={handleRemoveData}
				closeHandler={handleDeleteDialogClose}
			/>

			<div style={{ display: "flex", flexDirection: "column" }}>
				<div style={{ display: "flex", alignItems: "center" }}>
					<DetailsPanel
						header={`${questionPlural}`}
						dataCount={data.length}
						description={`${questionPlural} that will appear for this ${modelTemplate}`}
					/>
					<SearchField
						searchQuery={searchTxt}
						setSearchQuery={(e) => {
							setSearchTxt(e.target.value);
							handleSearch(e.target.value);
						}}
					/>
				</div>
				{duplicating ? <LinearProgress /> : null}
				{questionTable}
			</div>
		</>
	);
};
const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});
export default connect(null, mapDispatchToProps)(withMount(ModelQuestion));
