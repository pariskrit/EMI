import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
	getModelQuestions,
	patchModelQuestions,
	duplicateModelQuestions,
	pasteModelQuestions,
} from "services/models/modelDetails/modelQuestions";
import DeleteDialog from "components/Elements/DeleteDialog";
import { CircularProgress, LinearProgress } from "@material-ui/core";
import DetailsPanel from "components/Elements/DetailsPanel";
import { showError } from "redux/common/actions";
import {
	questionTimingOptions,
	questionTypeOptions,
} from "constants/modelDetail";
import { modelServiceLayout, modelsPath } from "helpers/routePaths";
import { getModelRolesList } from "services/models/modelDetails/modelRoles";
import QuestionTable from "./QuestionTable";
import withMount from "components/HOC/withMount";
import AddEditModel from "./AddEditModel";
// import useLazyLoad from "hooks/useLazyLoad";

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
		customCaptions: { question, questionPlural },
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const triggerRef = useRef(null);

	// INITIAL STATES
	const [data, setData] = useState([]);
	const [roleOptions, setRoleOptions] = useState([]);
	const [originalQuestionList, setOriginalQuestionList] = useState([]);
	const [deleteModel, setDeleteModel] = useState(false);
	const [questionId, setQuestionId] = useState(null);
	const [loading, setLoading] = useState(false);
	const [duplicating, setDuplicating] = useState(false);
	const [editMode, setEditMode] = useState(false);

	// HANDLING OPERATIONS
	function apiResponse(x) {
		const type = x.type;
		const timing = x.timing;
		const questionType = questionTypeOptions.find((x) => x.value === type);
		const timingType = questionTimingOptions.find((x) => x.value === timing);
		return {
			...x,
			compulsory: x.isCompulsory ? "Yes" : "No",
			modelRoles: x.roles.map((x) => x.name).join(","),
			modelType: questionType.label,
			modelTiming: timingType.label,
			additional:
				type === "B" ? (
					<>
						<strong>Checkbox Caption : </strong>&nbsp;{x.checkboxCaption}
					</>
				) : type === "O" || type === "C" ? (
					<>
						<strong>Options : </strong>&nbsp;
						{x.options.map((a) => a.name).join(", ")}
					</>
				) : type === "N" ? (
					<>
						<strong>Decimal Places : </strong>&nbsp;{x.decimalPlaces}
					</>
				) : (
					""
				),
		};
	}

	const fetchQuestions = async () => {
		try {
			let result = await getModelQuestions(modelId);
			if (result.status) {
				if (!isMounted.aborted) {
					result = result.data.map((x) => apiResponse(x));
					setData(result);
					setOriginalQuestionList(result);
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
		setLoading(true);
		await Promise.all([fetchQuestions(), fetchRoles()]);
		setLoading(false);
	};

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (state.showPasteTask) {
			const handlePaste = async () => {
				setDuplicating(true);
				try {
					const questionText = await navigator.clipboard.readText();

					const question = JSON.parse(questionText);

					let result = await pasteModelQuestions(modelId, {
						modelVersionQuestionID: question.id,
					});

					if (result.status) {
						if (!isMounted.aborted) await fetchQuestions();
					} else {
						if (result.data.detail) getError(result.data.detail);
						else getError("Something went wrong");
					}
				} catch (e) {
					return;
				} finally {
					if (!isMounted.aborted) {
						dispatch({ type: "DISABLE_PASTE_TASK", payload: true });
						dispatch({ type: "TOGGLE_PASTE_TASK", payload: false });
						setDuplicating(false);
					}
				}
			};
			handlePaste();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.showPasteTask]);

	// handle dragging of questions
	const setPositionForPayload = (e, listLength) => {
		const { destination, source } = e;
		if (destination.index === listLength - 1) {
			return originalQuestionList[destination.index]?.pos + 1;
		}
		if (destination.index === 0) {
			return originalQuestionList[destination.index]?.pos - 1;
		}

		if (destination.index > source.index) {
			return (
				(+originalQuestionList[destination.index]?.pos +
					+originalQuestionList[e.destination.index + 1]?.pos) /
				2
			);
		}
		return (
			(+originalQuestionList[destination.index]?.pos +
				+originalQuestionList[e.destination.index - 1]?.pos) /
			2
		);
	};

	const handleDragEnd = async (e) => {
		if (!e.destination) {
			return;
		}

		if (e.destination.index === e.source.index) return;

		const result = [...data];
		const [removed] = result.splice(e.source.index, 1);
		result.splice(e.destination.index, 0, removed);
		setData(result);

		try {
			let payloadBody = [
				{
					path: "pos",
					op: "replace",
					value: setPositionForPayload(e, originalQuestionList.length),
				},
			];
			const response = await patchModelQuestions(e.draggableId, payloadBody);
			if (!isMounted.aborted) {
				if (response.status) {
					setOriginalQuestionList(data);
				} else {
					setData(originalQuestionList);
				}
			}
		} catch (error) {
			if (!isMounted.aborted) setData(originalQuestionList);
		}
	};

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
					await fetchQuestions();
					triggerRef.current.scrollIntoView({
						behavior: "smooth",
						block: "end",
						inline: "nearest",
					});
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
		navigator.clipboard.writeText(JSON.stringify(copiedData));
		dispatch({ type: "DISABLE_PASTE_TASK", payload: false });
	};

	// Handle Delete Question
	const handleDelete = (id) => {
		setDeleteModel(true);
		setQuestionId(id);
	};

	const handleRemoveData = (id) => {
		const filteredData = data.filter((x) => x.id !== id);
		setData(filteredData);
		setOriginalQuestionList(filteredData);
		dispatch({
			type: "TAB_COUNT",
			payload: { countTab: "questionCount", data: filteredData.length },
		});
	};

	const handleDeleteDialogClose = () => {
		setDeleteModel(false);
		setQuestionId(null);
	};

	const handleAddEditComplete = () => {
		fetchQuestions();
	};

	const handleOptions = (responseData) => {
		const d = data.map((x) => (x.id === responseData.id ? responseData : x));
		setData(d);
	};

	const handleSwitchToServiceLayout = (id) => {
		history.push(`${modelsPath}/${modelId}${modelServiceLayout}`, {
			state: { ModelVersionQuestionID: id },
		});
	};

	// const onGrabData = (currentPage) =>
	// 	new Promise((res) => {
	// 		const NUM_PER_PAGE = 10;
	// 		const TOTAL_PAGES = Math.floor(data.length / NUM_PER_PAGE);
	// 		setTimeout(() => {
	// 			const slicedData = data.slice(
	// 				((currentPage - 1) % TOTAL_PAGES) * NUM_PER_PAGE,
	// 				NUM_PER_PAGE * (currentPage % TOTAL_PAGES)
	// 			);
	// 			res(slicedData);
	// 		}, 100);
	// 	});

	// const { lazyData } = useLazyLoad({ triggerRef, onGrabData });

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<>
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
			/>
			<DeleteDialog
				open={deleteModel}
				entityName={`Model ${question}`}
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
						description="Questions managed to this question model"
					/>
				</div>
				{duplicating ? <LinearProgress /> : null}

				<QuestionTable
					data={data}
					handleDragEnd={handleDragEnd}
					isModelEditable={access === "F" || access === "E"}
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
							name: "Switch To Service Layout",
							handler: handleSwitchToServiceLayout,
							isDelete: false,
						},
						{
							name: "Delete",
							handler: handleDelete,
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

				<div ref={triggerRef} />
			</div>
		</>
	);
};
const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});
export default connect(null, mapDispatchToProps)(withMount(ModelQuestion));
