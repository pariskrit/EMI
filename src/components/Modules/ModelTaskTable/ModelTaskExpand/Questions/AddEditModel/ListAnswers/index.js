import React, { useState, useRef } from "react";
import {
	makeStyles,
	TextField,
	FormGroup,
	FormControlLabel,
	Typography,
	CircularProgress,
	Button,
	Grid,
} from "@material-ui/core";
import * as yup from "yup";
import EMICheckbox from "components/Elements/EMICheckbox";
import DetailsPanel from "components/Elements/DetailsPanel";
import CurveButton from "components/Elements/CurveButton";
import IndividualList from "./IndividualList";
import ColourConstants from "helpers/colourConstants";
import useOutsideClick from "hooks/useOutsideClick";
import {
	getQuestionOptions,
	postQuestionOptions,
	patchQuestionOptions,
} from "services/models/modelDetails/modelTasks/questions";
import DeleteDialog from "components/Elements/DeleteDialog";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import { DragDropContext } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import { setPositionForPayload } from "helpers/setPositionForPayload";
import SubcatStyle from "styles/application/SubcatStyle";
import ErrorInputFieldWrapper from "components/Layouts/ErrorInputFieldWrapper";

const AT = SubcatStyle();

const schema = yup.object({
	name: yup.string().required("Please Provide Name"),
	raiseDefect: yup.bool(),
});

const me =
	JSON.parse(sessionStorage.getItem("me")) ||
	JSON.parse(localStorage.getItem("me"));

const useStyles = makeStyles({
	add: {
		marginBottom: 12,
		display: "flex",
		justifyContent: "space-between",
	},
	options: { width: "100%" },
	list: { display: "flex", flexDirection: "column" },
	individualList: {
		display: "flex",
		flexDirection: "column",
		gap: 12,
		overflowY: "unset",
	},
	individualRow: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		border: "1px solid #8F8F8F",
		padding: "8px",
		background: "#D2D2D9",
		width: "100%",
		borderRadius: 2,
	},
	text: {
		width: "74%",
		border: "1px solid white",
		background: "white",
		padding: "10px 8px",
		borderRadius: 5,
	},
	deleteIcon: {
		transform: "scale(0.7)",
		color: ColourConstants.deleteButton,
		"&:hover": {
			cursor: "pointer",
		},
	},
	checkboxText: {
		fontSize: "0.8rem",
		whiteSpace: "nowrap",
	},
	button: {
		fontSize: 15,
		backgroundColor: ColourConstants.confirmButton,
		color: "#FFFFFF",
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		height: 35,
		padding: "6px 26px",
	},
	labelGrp: {
		marginRight: 0,
	},
	inputText: {
		color: "black",
		fontSize: 14,
		padding: "13px 10px",
	},
});

const defaultInput = { raiseDefect: false, name: "" };
const defaultError = { raiseDefect: null, name: null };
const defaultDelete = {
	id: null,
	open: false,
};

function ListAnswers({
	type,
	modelVersionTaskQuestionID,
	addEditType,
	getError,
	handleUpdateOption,
	inputOptions,
	errors,
}) {
	const ref = useRef();
	const classes = useStyles();

	const [addNew, setAddNew] = useState(false);
	const [input, setInput] = useState(defaultInput);
	const [error, setError] = useState(defaultError);
	const [loader, setLoader] = useState(false);
	const [listOptions, setListOptions] = useState({
		options: [],
		loading: false,
	});
	const [originalList, setOriginalList] = useState([]);
	const [deleteModel, setDeleteModel] = useState(defaultDelete);

	const [optionTxt, setOptionTxt] = useState("");
	const [isEditOptionFromAdd, setisEditOptionFromAdd] = useState(null);

	const setState = (d) => setInput((th) => ({ ...th, ...d }));

	const getOptions = async () => {
		try {
			let result = await getQuestionOptions(modelVersionTaskQuestionID);
			if (result.status) {
				setListOptions({ options: result.data, loading: false });
				setOriginalList(result.data);
			} else {
				if (result.data.detail) getError(result.data.detail);
				setListOptions((th) => ({ ...th, loading: false }));
			}
		} catch (e) {
			return;
		}
	};

	React.useEffect(() => {
		const fetchOptions = async () => {
			if (addEditType === "add") return;
			setListOptions((th) => ({ ...th, loading: true }));
			await getOptions();
		};
		fetchOptions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleAddList = async () => {
		setLoader(true);
		try {
			const localChecker = await handleValidateObj(schema, input);
			if (!localChecker.some((el) => el.valid === false)) {
				let result = await postQuestionOptions({
					modelVersionTaskQuestionID,
					...input,
				});
				setLoader(false);
				if (result.status) {
					setAddNew(false);
					handleUpdateOption((prev) => ({
						...prev,
						options: [...(prev.options || []), input.name],
					}));
					setInput(defaultInput);
					getOptions();
				} else {
					if (result.data.detail) getError(result.data.detail);
				}
			} else {
				const newError = generateErrorState(localChecker);
				setError({ ...error, ...newError });
			}
		} catch (e) {
			return;
		}
	};

	const handleEditList = async (data) => {
		const main = [
			{ op: "replace", path: "name", value: data.name },
			{ op: "replace", path: "raiseDefect", value: data.raiseDefect },
		];
		try {
			let result = await patchQuestionOptions(data.id, main);
			if (result.status) {
				const editedData = listOptions.options.map((x) =>
					x.id === data.id ? { ...x, ...result.data } : x
				);
				setListOptions({ loading: false, options: editedData });
				return true;
			} else {
				if (result.data.detail) getError(result.data.detail);
				return false;
			}
		} catch (e) {
			return;
		}
	};

	const handleDeleteList = (id, index) => {
		setDeleteModel({ id, open: true });
		handleUpdateOption((prev) => ({
			...prev,
			options: [...prev.options?.filter((x, ii) => ii !== index)].sort(),
		}));
	};

	const handleOptionsClose = () => {
		setDeleteModel(defaultDelete);
	};

	const handleRemoveOptions = (id) => {
		const opt = listOptions.options.filter((x) => x.id !== id);
		setListOptions({ loading: false, options: opt });
	};

	const addNewList = () => {
		setAddNew(true);
	};

	const handleDrag = async (e) => {
		if (!e.destination) {
			return;
		}

		if (e.destination.index === e.source.index) return;

		const result = [...listOptions.options];
		const [removed] = result.splice(e.source.index, 1);
		result.splice(e.destination.index, 0, removed);
		setListOptions({ options: result, loading: false });

		try {
			let payloadBody = [
				{
					path: "pos",
					op: "replace",
					value: setPositionForPayload(e, originalList),
				},
			];
			const response = await patchQuestionOptions(e.draggableId, payloadBody);
			if (response.status) {
				const newDate = result.map((x, i) =>
					i === e.destination.index ? { ...x, pos: response.data.pos } : x
				);
				setOriginalList(newDate);
				setListOptions({ options: newDate, loading: false });
			} else {
				setListOptions({ options: originalList, loading: false });
			}
		} catch (error) {
			setListOptions({ options: originalList, loading: false });
		}
	};

	const handleEnterPress = (e) => {
		if (e.keyCode === 13) {
			handleAddList();
		}
	};

	useOutsideClick(ref, () => setAddNew(false));

	const { loading, options } = listOptions;

	if (loading) {
		return <CircularProgress />;
	}

	const handleChange = (e) => {
		const { value } = e.target;
		setOptionTxt(value);
	};

	const handleSave = () => {
		if (optionTxt === "" || optionTxt === null) {
			setAddNew(false);
			return false;
		}
		handleUpdateOption((prev) => ({
			...prev,
			options: [...(prev.options || []), optionTxt].sort(),
		}));
		setAddNew(false);
		setOptionTxt("");
	};

	const onKeyPress = (e) => {
		if (e.keyCode === 13) {
			handleSave();
		}
	};

	return (
		<>
			<DeleteDialog
				open={deleteModel.open}
				entityName={`${me?.customCaptions?.question} Option`}
				deleteEndpoint={"/api/ModelVersionTaskQuestionOptions"}
				deleteID={deleteModel.id}
				closeHandler={handleOptionsClose}
				handleRemoveData={handleRemoveOptions}
			/>
			<div className={classes.options}>
				<DetailsPanel
					header={`${type === "O" ? "Dropdown" : "Checkbox"} List Options`}
					dataCount={
						addEditType === "edit" ? options.length : inputOptions?.length || 0
					}
					description={`Add ${
						type === "O" ? "Dropdown" : "Checkbox"
					}List Options`}
				/>
				{errors.options ? (
					<ErrorInputFieldWrapper errorMessage={errors.options} />
				) : (
					""
				)}
				{addEditType === "edit" && (
					<div className={classes.list}>
						{addNew ? (
							<div ref={ref} className={classes.add}>
								<TextField
									error={error.name === null ? false : true}
									helperText={error.name === null ? null : error.name}
									variant="outlined"
									autoFocus
									size="small"
									onChange={(e) => setState({ name: e.target.value })}
									fullWidth
									onKeyDown={handleEnterPress}
									style={{ marginBottom: 12, width: "76.3%" }}
								/>
								<FormGroup>
									<FormControlLabel
										className={classes.labelGrp}
										control={
											<EMICheckbox
												state={input.raiseDefect}
												changeHandler={() =>
													setState({ raiseDefect: !input.raiseDefect })
												}
											/>
										}
										label={
											<Typography className={classes.checkboxText}>
												Raise {me?.customCaptions.defectPlural}
											</Typography>
										}
									/>
								</FormGroup>
								<Button
									variant="outlined"
									className={classes.button}
									onClick={handleAddList}
								>
									{loader ? (
										<CircularProgress style={{ height: 22, width: 22 }} />
									) : (
										"ADD"
									)}
								</Button>
							</div>
						) : null}
						<DragDropContext onDragEnd={handleDrag}>
							<Droppable droppableId="droppable-2" isCombineEnabled>
								{(pp) => (
									<div
										ref={pp.innerRef}
										{...pp.droppableProps}
										className={classes.individualList}
									>
										{options.map((x, i) => (
											<IndividualList
												key={x.id}
												x={x}
												classes={classes}
												onEdit={(ip) => handleEditList({ ...x, ...ip })}
												onDelete={() => handleDeleteList(x.id, i)}
												index={i}
											/>
										))}
										{pp.placeholder}
									</div>
								)}
							</Droppable>
						</DragDropContext>
					</div>
				)}
				{addEditType === "add" && (
					<div>
						<Grid container spacing={2}>
							{addNew && (
								<Grid item xs={6}>
									<AT.SubcatContainer>
										<AT.NameInput
											autoFocus
											onChange={handleChange}
											onKeyDown={onKeyPress}
											onBlur={() => {
												if (optionTxt === "" || optionTxt === null)
													setAddNew(false);
												else handleSave();
											}}
											value={optionTxt}
										/>
									</AT.SubcatContainer>
								</Grid>
							)}
							{inputOptions?.map((x, i) => (
								<Grid item xs={6} key={i}>
									<div key={i}>
										{i === isEditOptionFromAdd ? (
											<AT.SubcatContainer>
												<AT.NameInput
													type="text"
													onKeyDown={handleEnterPress}
													value={x}
													onBlur={() => setisEditOptionFromAdd(null)}
													autoFocus
													onChange={(e) => {
														e.persist();
														handleUpdateOption((prev) => ({
															...prev,
															options: [
																...prev.options?.map((a, ii) =>
																	ii === i ? e?.target?.value : a
																),
															].sort(),
														}));
													}}
												/>
											</AT.SubcatContainer>
										) : (
											<>
												<AT.SubcatContainer
													onClick={() => {
														setisEditOptionFromAdd(i);
													}}
												>
													<AT.NameText>{x}</AT.NameText>
													<AT.ButtonContainer>
														<AT.DeleteIcon
															onClick={() => {
																handleUpdateOption((prev) => ({
																	...prev,
																	options: [
																		...prev.options?.filter(
																			(x, ii) => ii !== i
																		),
																	].sort(),
																}));
															}}
														/>
													</AT.ButtonContainer>
												</AT.SubcatContainer>
											</>
										)}
									</div>
								</Grid>
							))}
						</Grid>
					</div>
				)}
				<CurveButton
					onClick={addNewList}
					style={{ marginTop: 12, float: "left" }}
				>
					Add New
				</CurveButton>
			</div>
		</>
	);
}
export default ListAnswers;
