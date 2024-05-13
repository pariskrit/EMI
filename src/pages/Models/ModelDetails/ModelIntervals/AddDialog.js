import React, { useEffect, useState } from "react";
import AddDialogStyle from "styles/application/AddDialogStyle";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "helpers/utils";

import PauseDialogStyle from "styles/application/PauseDialogStyle";
import NewSubCategoryField from "./NewSubCategoryField";
import SubCategory from "./Subcategory";
import { DialogContent, Grid } from "@mui/material";
import CheckboxContainer from "components/Modules/CheckboxContainer";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";

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

const AddDialog = ({
	open,
	closeHandler,
	handleAddData,
	autoIncludeIntervals,
	enableAutoIncludeIntervals,
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
	const handleAddClick = async () => {
		// Adding progress indicator
		setIsUpdating(true);

		try {
			const localChecker = await handleValidateObj(schema, input);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				// Creating new data
				await handleAddData({
					name: input.name,
					taskListNos: input.allCategories,
					includes: input.autoIncludeIntervals
						.filter((item) => item.checked)
						.map((filtered) => ({ modelVersionIntervalID: filtered.id })),
				});

				closeOverride();
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
			}
		} catch (err) {
			// TODO: handle non validation errors here
			dispatch(showError(`Failed to add ${captions?.interval}`));
		}
		setIsUpdating(false);
	};

	const handleAddCategory = () => {
		onNewSubCategoryFieldHide();

		if (!newCategory) {
			return;
		}
		setInput({
			...input,
			allCategories: [...input.allCategories, { name: newCategory }].sort(
				(a, b) => a.name.localeCompare(b.name)
			),
		});
	};

	const handleEditCategory = () => {
		setIsCategoryEditable({});
		setInput({
			...input,
			allCategories: [
				...input.allCategories.sort((a, b) => a.name.localeCompare(b.name)),
			],
		});
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

	const onCategoryChange = (e, id) =>
		setInput({
			...input,
			allCategories: [
				...input.allCategories.map((category, index) =>
					index === id ? { ...category, name: e.target.value } : category
				),
			],
		});

	const onDeleteCategory = (id) => {
		setIsDeleteClick(true);
		setInput({
			...input,
			allCategories: [
				...input.allCategories.filter((category, index) => index !== id),
			].sort((a, b) => a.name.localeCompare(b.name)),
		});
	};

	const onCheckboxInputChange = (checkBoxData) =>
		setInput({
			...input,
			autoIncludeIntervals: input.autoIncludeIntervals.map((data) =>
				data.id === checkBoxData.id ? { ...data, checked: !data.checked } : data
			),
		});

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			handleAddClick();
		}
	};

	useEffect(() => {
		if (open) {
			setInput((prev) => ({
				...prev,
				autoIncludeIntervals: autoIncludeIntervals.map((interval) => ({
					checked: false,
					id: interval.id,
					name: interval.name,
					isDisabled: false,
				})),
			}));
		}
	}, [open, autoIncludeIntervals]);
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
					<ADD.HeaderText>Add {captions.interval}</ADD.HeaderText>
				</DialogTitle>
				<ADD.ButtonContainer>
					<ADD.CancelButton onClick={closeOverride} variant="contained">
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton variant="contained" onClick={handleAddClick}>
						Add {captions.interval}
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
								autoFocus
								onKeyDown={handleEnterPress}
								onChange={(e) => {
									setInput({ ...input, name: e.target.value });
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
				{/* Field to add new subcat */}
				<Grid container spacing={2}>
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
						: input.allCategories.map((category, index) => {
								return (
									<Grid item xs={6}>
										<SubCategory
											key={category.name}
											id={index}
											category={category}
											isEditable={isCategoryEditable[index]}
											onChange={onCategoryChange}
											onEditClick={onCategoryEdit}
											handleEdit={handleEditCategory}
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

export default AddDialog;
