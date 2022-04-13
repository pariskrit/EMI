import React, { useState, useEffect, useRef, useContext } from "react";
import {
	CircularProgress,
	LinearProgress,
	makeStyles,
} from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import GeneralButton from "components/Elements/GeneralButton";
import ListTable from "./ListTable";
import DeleteDialog from "components/Elements/DeleteDialog";
import {
	duplicateQuestions,
	getQuestions,
	pasteModelTaskQuestion,
	patchQuestions,
} from "services/models/modelDetails/modelTasks/questions";
import AddEditModel from "./AddEditModel";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import { modelServiceLayout, modelsPath } from "helpers/routePaths";
import DetailsPanel from "components/Elements/DetailsPanel";
import withMount from "components/HOC/withMount";
import { TaskContext } from "contexts/TaskDetailContext";
import { setPositionForPayload } from "helpers/setPositionForPayload";
import { Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ModelContext } from "contexts/ModelDetailContext";

const questionTypeOptions = [
	{ label: "Checkbox", value: "B" },
	{ label: "Checkbox List", value: "C" },
	{ label: "Date", value: "D" },
	{ label: "Dropdown", value: "O" },
	{ label: "Long Text", value: "L" },
	{ label: "Number", value: "N" },
	{ label: "Short Text", value: "S" },
	{ label: "Time", value: "T" },
];

const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9",
	},
}))(Tooltip);

// Styling Task Question
const useStyles = makeStyles({
	question: { display: "flex", flexDirection: "column" },
	header: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
	},
	pasteTask: { background: "#ED8738" },
	buttons: { display: "flex", justifyContent: "space-around" },
});

function apiResponse(d) {
	const question = questionTypeOptions.find((a) => a.value === d.type);
	const res = {
		...d,
		questionType: question.label,
		compulsory: d.isCompulsory ? "Yes" : "No",
		additional:
			d.type === "B" ? (
				<span>
					<strong>Checkbox Caption : </strong>&nbsp;{d.checkboxCaption}
				</span>
			) : d.type === "N" ? (
				<span style={{ display: "flex", gap: 10 }}>
					<span>
						<strong>Decimal Places : </strong>
						{d.decimalPlaces}
					</span>
					{d.minValue !== null ? (
						<span>
							<strong>Minimum Value : </strong>
							{d.minValue}
						</span>
					) : (
						""
					)}
					{d.maxValue !== null ? (
						<span>
							<strong>Maximum Value : </strong>
							{d.maxValue}
						</span>
					) : (
						""
					)}
				</span>
			) : d.type === "C" || d.type === "O" ? (
				<>
					<HtmlTooltip title={d?.options.map((a) => a.name).join(", ")}>
						<p className="max-two-line">
							<span>
								{" "}
								<strong>Options : </strong>&nbsp;
								{d?.options.map((a) => a.name).join(", ")}
							</span>
						</p>
					</HtmlTooltip>
				</>
			) : (
				""
			),
	};
	return res;
}

const Questions = ({ captions, taskInfo, getError, access, isMounted }) => {
	const classes = useStyles();
	const scrollRef = useRef();
	const history = useHistory();
	const { id } = useParams();
	// Initiate States
	const [data, setData] = useState([]);
	const [originalList, setOriginalList] = useState([]);
	const [questionId, setQuestionId] = useState(null);
	const [model, setModel] = useState({
		delete: false,
		addEdit: false,
		copy: false,
	});
	const [loading, setLoading] = useState({
		fetch: true,
		loader: false,
	});
	const [addEditType, setAddEditType] = useState("add");

	const [, CtxDispatch] = useContext(TaskContext);
	const [state] = useContext(ModelContext);

	// ARRANGING DATA FROM THE API RESPONSE

	// HANDLE ERROR FROM API RESPONSE
	const errorResponse = (result) => {
		if (result.data.detail) getError(result.data.detail);
		else getError("Something went wrong");
	};

	const fetchTaskQuestion = async () => {
		try {
			let result = await getQuestions(taskInfo.id);
			if (result.status) {
				if (!isMounted.aborted) {
					result = result.data.map((x) => apiResponse(x));
					setData(result);
					setOriginalList(result);
				}
				CtxDispatch({
					type: "TAB_COUNT",
					payload: {
						countTab: "questionCount",
						data: result?.length,
					},
				});
			} else {
				errorResponse(result);
			}
		} catch (e) {
			return;
		}
	};

	useEffect(() => {
		const initialFetch = async () => {
			setLoading((th) => ({ ...th, fetch: true }));
			await fetchTaskQuestion();
			setLoading((th) => ({ ...th, fetch: false }));
		};
		initialFetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// HANDLE ADD AND EDIT IN MODEL
	const handleEdit = (id) => {
		setQuestionId(id);
		setModel((th) => ({ ...th, addEdit: true }));
		setAddEditType("edit");
	};

	const handleAddEditClose = () => {
		setModel((th) => ({ ...th, addEdit: false }));
		setQuestionId(null);
	};

	const handleAddEditComplete = () => {
		fetchTaskQuestion();
		handleAddEditClose();
	};

	// HANDLE DUPLICATE
	const handleDuplicate = async (id) => {
		setLoading((th) => ({ ...th, loader: true }));
		try {
			let result = await duplicateQuestions(id);

			setLoading((th) => ({ ...th, loader: false }));

			if (result.status) {
				await fetchTaskQuestion();
				scrollRef.current.scrollIntoView({
					behavior: "smooth",
					block: "nearest",
					inline: "start",
				});
			} else {
				errorResponse(result);
			}
		} catch (e) {
			return;
		}
	};

	// HANDLE COPY AND PASTE
	const handleCopy = (id) => {
		setQuestionId(id);
		localStorage.setItem("taskquestion", id);
		setModel((th) => ({ ...th, copy: true }));
	};

	const handlePaste = async () => {
		setLoading((th) => ({ ...th, loader: true }));
		try {
			const taskQuestionId = localStorage.getItem("taskquestion");
			let result = await pasteModelTaskQuestion(taskInfo.id, {
				modelVersionTaskQuestionID: taskQuestionId,
			});

			if (!isMounted.aborted) {
				setLoading((th) => ({ ...th, loader: false }));
				if (result.status) {
					fetchTaskQuestion();
					setQuestionId(null);
				} else {
					errorResponse(result);
				}
			}
		} catch (e) {
			return;
		}
	};

	useEffect(() => {
		const checkcopyQuestionStatus = async () => {
			try {
				const questionTaskId = localStorage.getItem("taskquestion");

				if (questionTaskId) {
					setModel((th) => ({ ...th, copy: true }));
				}
			} catch (error) {
				return;
			}
		};
		checkcopyQuestionStatus();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// HANDLE SERVICE LAYOUT
	const handleServiceLayout = (modelVersionTaskQuestionID) => {
		history.push({
			pathname: `${modelsPath}/${id}${modelServiceLayout}`,
			state: { modelVersionTaskQuestionID },
		});
	};

	// HANDLE DELETE OPERATIONS
	const handleDelete = (id) => {
		setQuestionId(id);
		setModel((th) => ({ ...th, delete: true }));
	};

	const closeDeleteDialog = () => {
		setQuestionId(null);
		setModel((th) => ({ ...th, delete: false }));
	};

	const handleRemoveData = (id) => {
		const filtered = data.filter((x) => x.id !== id);
		setData(filtered);
		CtxDispatch({
			type: "TAB_COUNT",
			payload: {
				countTab: "questionCount",
				data: filtered?.length,
			},
		});
	};

	// HANDLE DRAG AND DROP

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
					value: setPositionForPayload(e, originalList),
				},
			];
			const response = await patchQuestions(e.draggableId, payloadBody);
			if (!isMounted.aborted) {
				if (response.status) {
					const newDate = result.map((x, i) =>
						i === e.destination.index ? { ...x, pos: response.data.pos } : x
					);
					setOriginalList(newDate);
					setData(newDate);
				} else {
					setData(originalList);
				}
			}
		} catch (error) {
			setData(originalList);
		}
	};

	if (loading.fetch) {
		return <CircularProgress />;
	}

	return (
		<>
			{model.addEdit && (
				<AddEditModel
					open={model.addEdit}
					questionDetail={data.find((x) => x.id === questionId)}
					title={captions.singular}
					handleClose={handleAddEditClose}
					taskId={taskInfo.id}
					handleAddEditComplete={handleAddEditComplete}
					getError={getError}
					addEditType={addEditType}
				/>
			)}
			<DeleteDialog
				open={model.delete}
				entityName={`${captions?.taskCaption} ${captions.singular}`}
				deleteEndpoint={"/api/modelversiontaskquestions"}
				deleteID={questionId}
				closeHandler={closeDeleteDialog}
				handleRemoveData={handleRemoveData}
			/>
			<div className={classes.question}>
				<div className={classes.header}>
					<DetailsPanel header={captions.plural} dataCount={data.length} />
					{access === "F" && !state.modelDetail?.isPublished ? (
						<span className={classes.buttons}>
							<GeneralButton
								className={classes.pasteTask}
								onClick={handlePaste}
								disabled={!model.copy}
							>
								Paste {captions.singular}
							</GeneralButton>
							<GeneralButton
								onClick={() => {
									setModel((th) => ({ ...th, addEdit: true }));
									setAddEditType("add");
								}}
							>
								Add New
							</GeneralButton>
						</span>
					) : null}
				</div>
				{loading.loader ? <LinearProgress /> : null}
				<ListTable
					data={data}
					handleDelete={handleDelete}
					handleEdit={handleEdit}
					handleDuplicate={handleDuplicate}
					handleCopy={handleCopy}
					handleServiceLayout={handleServiceLayout}
					handleDragEnd={handleDragEnd}
					access={access}
					disable={state.modelDetail?.isPublished}
				/>
				<div ref={scrollRef} />
			</div>
		</>
	);
};

const mapDispatchToProps = (dispatch) => ({
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(null, mapDispatchToProps)(withMount(Questions));
