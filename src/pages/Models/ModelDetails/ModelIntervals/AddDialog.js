import React, { useEffect, useState } from "react";
import AddDialogStyle from "styles/application/AddDialogStyle";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import * as yup from "yup";
import { handleValidateObj, generateErrorState } from "helpers/utils";

import PauseDialogStyle from "styles/application/PauseDialogStyle";
import NewSubCategoryField from "./NewSubCategoryField";
import SubCategory from "./Subcategory";
import DynamicDropdown from "components/Elements/DyamicDropdown";

// Init styled components
const ADD = AddDialogStyle();
const APD = PauseDialogStyle();

// Yup validation schema
const schema = yup.object({
	name: yup
		.string("This field must be a string")
		.required("This field is required"),
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
			console.log(err);
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
			allCategories: [...input.allCategories, { name: newCategory }],
		});
	};

	const handleEditCategory = () => {
		setIsCategoryEditable({});
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
			],
		});
	};

	const onCheckboxInputChange = (id, name) =>
		setInput({
			...input,
			autoIncludeIntervals: input.autoIncludeIntervals.map((data) =>
				data.id === id ? { ...data, checked: !data.checked } : data
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
					<ADD.HeaderText>Add New {captions.interval}</ADD.HeaderText>
				</DialogTitle>
				<ADD.ButtonContainer>
					<ADD.CancelButton onClick={closeOverride} variant="contained">
						Cancel
					</ADD.CancelButton>
					<ADD.ConfirmButton variant="contained" onClick={handleAddClick}>
						Add New
					</ADD.ConfirmButton>
				</ADD.ButtonContainer>
			</ADD.ActionContainer>

			<ADD.DialogContent>
				<div>
					<ADD.InputContainer>
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
									onKeyDown={handleEnterPress}
									onChange={(e) => {
										setInput({ ...input, name: e.target.value });
									}}
								/>
							</ADD.FullWidthContainer>
							<APD.DividerGutter />

							<ADD.InputContainer>
								<APD.SecondaryHeaderContainer>
									<ADD.HeaderText>
										{captions.taskListNoPlural}({input.allCategories.length})
									</ADD.HeaderText>

									<ADD.InfoText>Add additional task list number</ADD.InfoText>
								</APD.SecondaryHeaderContainer>
							</ADD.InputContainer>
							{/* Field to add new subcat */}
							{showAddNewField ? (
								<NewSubCategoryField
									name={newCategory}
									onChange={onNewCategoryInputChange}
									handleSave={handleAddCategory}
									onClose={onNewSubCategoryFieldHide}
								/>
							) : null}
							{!input.allCategories.length
								? null
								: input.allCategories.map((category, index) => {
										return (
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
										);
								  })}
							<APD.NewButtonContainer>
								<APD.NewButton
									variant="contained"
									onClick={onNewSubCategoryFieldShow}
								>
									Add new
								</APD.NewButton>
							</APD.NewButtonContainer>
						</ADD.LeftInputContainer>

						{enableAutoIncludeIntervals ? (
							<ADD.RightInputContainer>
								<DynamicDropdown
									isServerSide={false}
									width="100%"
									placeholder={`Select Auto-Include ${captions.intervalPlural}`}
									label={`Auto-Include ${captions.intervalPlural}`}
									columns={[{ id: 1, name: "name" }]}
									dataSource={input.autoIncludeIntervals}
									selectedValue={input.autoIncludeIntervals
										.filter((interval) => interval.checked)
										.map((r) => r.name)
										.join(", ")}
									rolesChecklist={input.autoIncludeIntervals.filter(
										(interval) => interval.checked
									)}
									selectdValueToshow="name"
									hasCheckBoxList={true}
									checklistChangeHandler={onCheckboxInputChange}
								/>
							</ADD.RightInputContainer>
						) : null}
					</ADD.InputContainer>
				</div>
			</ADD.DialogContent>
		</Dialog>
	);
};

export default AddDialog;
