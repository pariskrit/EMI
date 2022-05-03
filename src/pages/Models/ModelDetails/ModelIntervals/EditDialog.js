import React, { useCallback, useEffect, useState } from "react";
import AddDialogStyle from "styles/application/AddDialogStyle";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";

import PauseDialogStyle from "styles/application/PauseDialogStyle";
import NewSubCategoryField from "./NewSubCategoryField";
import SubCategory from "./Subcategory";
import {
	addModelIntervalsTaskList,
	getModelIntervalsToEdit,
	updateModelIntervals,
	deleteModelIntervalsTaskList,
	updateModelIntervalsTaskList,
	deleteModelIntervalsInclude,
	addModelIntervalsInclude,
} from "services/models/modelDetails/modelIntervals";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { DialogContent, Grid } from "@material-ui/core";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "helpers/utils";
import CheckboxContainer from "components/Modules/CheckboxContainer";

// Init styled components
const ADD = AddDialogStyle();
const APD = PauseDialogStyle();

// Yup validation schema
const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required")
		.max(100, "The field Name must be a string with a maximum length of 100."),
	allCategories: yup.array("This field must be an array"),
	autoIncludeIntervals: yup.array("This field must be an array"),
});

// Default state schemas
const defaultErrorSchema = { name: null };
const defaultStateSchema = {
	name: "",
	allCategories: [],
	autoIncludeIntervals: [],
};

const EditDialog = ({
	open,
	closeHandler,
	intervalId,
	enableAutoIncludeIntervals,
	modelId,
	fetchModelIntervals,
	captions,
}) => {
	// Init state
	const [isUpdating, setIsUpdating] = useState(false);
	const [input, setInput] = useState(defaultStateSchema);
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [showAddNewField, setShowAddNewField] = useState(false);
	const [newCategory, setNewCategory] = useState("");
	const [isCategoryEditable, setIsCategoryEditable] = useState([]);
	const [isDeleteClick, setIsDeleteClick] = useState(false);
	const dispatch = useDispatch();

	// Handlers
	const closeOverride = () => {
		// Clearing input state and errors
		setInput(defaultStateSchema);
		setErrors(defaultErrorSchema);

		closeHandler();
	};

	const handleAddCategory = async () => {
		if (!newCategory) {
			return;
		}
		const tempInput = { ...input };

		const response = await addModelIntervalsTaskList({
			modelID: modelId,
			name: newCategory,
			intervalGroupID: input.intervalGroupID,
		});

		if (!response.status) {
			setInput(tempInput);
			dispatch(
				showError(response.data.detail || "Could not add task list number")
			);
		} else {
			onNewSubCategoryFieldHide();

			setInput({
				...input,
				allCategories: [
					...input.allCategories,
					{ id: response.data, name: newCategory },
				].sort((a, b) => a.name.localeCompare(b.name)),
			});
			fetchModelIntervals();
		}
	};

	const handleEditCategory = async (intervalList) => {
		setIsCategoryEditable({});
		if (!input.isCategoryChanged) {
			return;
		}

		setIsUpdating(true);

		const response = await updateModelIntervalsTaskList(intervalList.id, [
			{ path: "name", op: "replace", value: intervalList.name },
		]);

		if (!response.status) {
			dispatch(showError("Could not update interval list number"));
		} else {
			setInput({
				...input,
				isCategoryChanged: false,
				allCategories: [
					...input.allCategories.sort((a, b) => a.name.localeCompare(b.name)),
				],
			});
			fetchModelIntervals();
		}
		setIsUpdating(false);
	};

	const onNewSubCategoryFieldHide = () => {
		setNewCategory("");

		setShowAddNewField(false);
	};

	const onNewSubCategoryFieldShow = () =>
		!showAddNewField ? setShowAddNewField(true) : onNewSubCategoryFieldHide();

	const onNewCategoryInputChange = (e) => setNewCategory(e.target.value);

	const onCategoryEdit = (id) => {
		if (isDeleteClick) {
			setIsDeleteClick(false);
		}
		setIsCategoryEditable({ [id]: true });
	};

	const onCategoryChange = (e, id) => {
		setInput({
			...input,
			isCategoryChanged: true,
			allCategories: [
				...input.allCategories.map((category) =>
					category.id === id ? { ...category, name: e.target.value } : category
				),
			],
		});
	};
	const onDeleteCategory = async (id) => {
		setIsDeleteClick(true);

		let tempInput = { ...input };
		setInput({
			...input,
			allCategories: [
				...input.allCategories
					.filter((category) => category.id !== id)
					.sort((a, b) => a.name.localeCompare(b.name)),
			],
		});

		const response = await deleteModelIntervalsTaskList(id);

		if (response.status) {
			fetchModelIntervals();
		} else {
			setInput(tempInput);
			dispatch(
				showError(response.data.detail || "Could not delete task list number")
			);
		}
	};

	const onCheckboxInputChange = async (checkBox) => {
		const tempInput = { ...checkBox };
		const includeId = input.autoIncludeIntervals.find(
			(data) => data.id === checkBox.id
		).includeId;

		setInput({
			...input,
			autoIncludeIntervals: input.autoIncludeIntervals.map((data) =>
				data.id === checkBox.id
					? { ...data, checked: !data.checked, isDisabled: true }
					: data
			),
		});

		let response = null;
		if (!includeId) {
			response = await addModelIntervalsInclude({
				modelVersionIntervalID: input.id,
				includeModelVersionIntervalID: checkBox.id,
			});
			setInput((prev) => ({
				...prev,
				autoIncludeIntervals: prev.autoIncludeIntervals.map((data) =>
					data.id === checkBox.id ? { ...data, includeId: response.data } : data
				),
			}));
		} else {
			response = await deleteModelIntervalsInclude(includeId);
			setInput((prev) => ({
				...prev,
				autoIncludeIntervals: prev.autoIncludeIntervals.map((data) =>
					data.id === checkBox.id ? { ...data, includeId: null } : data
				),
			}));
		}

		if (!response.status) {
			setInput({
				...input,
				autoIncludeIntervals: input.autoIncludeIntervals.map((data) =>
					data.id === checkBox.id ? tempInput : data
				),
			});
		} else {
			fetchModelIntervals();
		}

		setInput((prev) => ({
			...prev,
			autoIncludeIntervals: prev.autoIncludeIntervals.map((data) =>
				data.id === checkBox.id ? { ...data, isDisabled: false } : data
			),
		}));
	};

	const handleEditName = async () => {
		if (!input.isNameChanged) {
			return;
		}
		const localChecker = await handleValidateObj(schema, {
			name: input.name,
			allCategories: input.allCategories,
			autoIncludeIntervals: input.autoIncludeIntervals,
		});
		// Attempting API call if no local validaton errors
		if (!localChecker.some((el) => el.valid === false)) {
			setIsUpdating(true);
			const response = await updateModelIntervals(intervalId, [
				{ path: "name", op: "replace", value: input.name },
			]);

			if (!response.status) {
				dispatch(showError(response.data.detail || "Could not update name"));
			} else {
				setInput({ ...input, isNameChanged: false });
				fetchModelIntervals();
			}

			setIsUpdating(false);
		} else {
			const newErrors = generateErrorState(localChecker);
			setErrors({ ...errors, ...newErrors });
		}
	};

	const fetchModelIntervalsToEdit = useCallback(async () => {
		setIsUpdating(true);

		const response = await getModelIntervalsToEdit(intervalId);

		if (response.status) {
			setInput({
				id: response.data.id,
				intervalGroupID: response.data.intervalGroupID,
				name: response.data.name,
				allCategories: response.data.taskListNos.sort((a, b) =>
					a.name.localeCompare(b.name)
				),
				autoIncludeIntervals: response.data.autoIncludeIntervals.map(
					(interval) => ({
						includeId: interval.id,
						id: interval.modelVersionIntervalID,
						name: interval.name,
						isDisabled: false,
						checked: !!interval.id,
					})
				),
			});
		} else {
			dispatch(showError("Could not get data"));
		}

		setIsUpdating(false);
	}, [intervalId, dispatch]);

	const handleEnterPress = (e) => {
		if (e.keyCode === 13) {
			handleEditName();
		}
	};

	useEffect(() => {
		if (open) {
			fetchModelIntervalsToEdit();
		}
	}, [open, fetchModelIntervalsToEdit]);
	return (
		<Dialog
			fullWidth={true}
			maxWidth="md"
			open={open}
			onClose={closeOverride}
			aria-labelledby="add-title"
			aria-describedby="add-description"
			className="application-dailog"
		>
			{isUpdating ? <LinearProgress /> : null}

			<ADD.ActionContainer>
				<DialogTitle id="add-dialog-title">
					<ADD.HeaderText>Edit {captions.interval}</ADD.HeaderText>
				</DialogTitle>
				<ADD.ButtonContainer>
					<ADD.ConfirmButton onClick={closeOverride} variant="contained">
						Close
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>

			<DialogContent style={{ overflowY: "auto" }}>
				<div style={{ display: "flex" }}>
					<ADD.LeftInputContainer>
						<ADD.FullWidthContainer>
							<ADD.NameLabel>
								Name<ADD.RequiredStar>*</ADD.RequiredStar>
							</ADD.NameLabel>
							<ADD.NameInput
								error={errors.name === null ? false : true}
								helperText={errors.name === null ? null : errors.name}
								variant="outlined"
								value={input.name}
								onBlur={handleEditName}
								onKeyDown={handleEnterPress}
								autoFocus
								onChange={(e) => {
									setInput({
										...input,
										name: e.target.value,
										isNameChanged: true,
									});
								}}
							/>
						</ADD.FullWidthContainer>
						<APD.DividerGutter />
					</ADD.LeftInputContainer>

					{enableAutoIncludeIntervals ? (
						<ADD.RightInputContainer>
							<CheckboxContainer
								header={`Include ${captions?.intervalPlural}`}
								checkBoxes={input.autoIncludeIntervals}
								onCheck={onCheckboxInputChange}
							/>
						</ADD.RightInputContainer>
					) : null}
				</div>
				<div>
					<APD.SecondaryHeaderContainer>
						<ADD.HeaderText>
							{captions.taskListNoPlural}({input.allCategories.length})
						</ADD.HeaderText>

						<ADD.InfoText>
							Add additional {captions.taskListNoPlural}
						</ADD.InfoText>
					</APD.SecondaryHeaderContainer>
				</div>
				<Grid container spacing={2}>
					{/* Field to add new subcat */}

					{showAddNewField ? (
						<Grid item xs={6}>
							<NewSubCategoryField
								name={newCategory}
								onChange={onNewCategoryInputChange}
								handleSave={handleAddCategory}
								onClose={onNewSubCategoryFieldHide}
							/>
						</Grid>
					) : null}
					{!input.allCategories.length
						? null
						: input.allCategories.map((category) => {
								return (
									<Grid item xs={6} key={category.id}>
										<SubCategory
											key={category.name}
											id={category.id}
											category={category}
											isEditable={isCategoryEditable[category.id]}
											onChange={onCategoryChange}
											onEditClick={onCategoryEdit}
											handleEdit={() => handleEditCategory(category)}
											onDelete={onDeleteCategory}
											isDeleteClick={isDeleteClick}
										/>
									</Grid>
								);
						  })}
				</Grid>

				<div style={{ marginTop: "15px" }}>
					<APD.NewButton
						variant="contained"
						onClick={onNewSubCategoryFieldShow}
					>
						Add new
					</APD.NewButton>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default EditDialog;
