import React, { useState } from "react";
import API from "helpers/api";
import SubcatStyle from "styles/application/SubcatStyle";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";

// Init styled components
const AS = SubcatStyle();

// Default state schemas
const defaultErrorSchema = { name: null };

const Subcat = ({
	setIsUpdating,
	sub,
	handleUpdateSubcatStateName,
	getError,
	handleDelete,
}) => {
	// Init state
	const [isEdit, setIsEdit] = useState(false);
	const [subcatName, setSubcatName] = useState("");
	const [errors, setErrors] = useState(defaultErrorSchema);
	const dispatch = useDispatch();

	// Handlers

	const handleShowEdit = () => {
		setSubcatName(sub.name);
		setIsEdit(true);
	};
	const handleEditSubcatName = async () => {
		// Setting load indicator
		setIsUpdating(true);

		// Validating that subcat name has changed
		if (subcatName === sub.name || subcatName === "") {
			// Removing edit box
			setIsEdit(false);
			// Removing load indicator
			setIsUpdating(false);

			return true;
		}

		// Attempting to update name
		try {
			const result = await API.patch(`/api/PauseSubcategories/${sub.id}`, [
				{
					op: "replace",
					path: "name",
					value: subcatName,
				},
			]);

			// Handling succesful update
			if (result.status === 200 || result.status === 204) {
				// Updating name in parent state
				handleUpdateSubcatStateName(sub.pauseID, sub.id, subcatName);

				// Removing edit box
				setIsEdit(false);
				// Removing load indicator
				setIsUpdating(false);

				return true;
			} else {
				// Throwing error if not success
				throw new Error(result);
			}
		} catch (err) {
			// Handling duplicate subcat error
			if (
				err.response.data.detail !== undefined ||
				err.response.data.detail !== null
			) {
				//setErrors({ ...errors, ...{ name: err.response.data.detail } });
				getError(err.response.data.detail ?? `Failed to edit sub-category.`);

				setIsUpdating(false);
				return false;
			}

			// Handling other errors
			if (err.response.data.errors !== undefined) {
				setErrors({ ...errors, ...err.response.data.errors });

				setIsUpdating(false);
				dispatch(showError(`Failed to edit sub-category.`));
				return false;
			} else {
				// TODO: handle non validation errors here

				setIsEdit(false);
				setIsUpdating(false);
				dispatch(showError(`Failed to edit sub-category.`));
			}
		}
	};

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			handleEditSubcatName();
		}
	};

	return (
		<>
			{isEdit ? (
				<AS.SubcatContainer>
					<AS.NameInput
						type="text"
						error={errors.name === null ? false : true}
						helperText={errors.name === null ? null : errors.name}
						onKeyDown={handleEnterPress}
						value={subcatName}
						autoFocus
						onBlur={handleEditSubcatName}
						onChange={(e) => {
							setSubcatName(e.target.value);
						}}
					/>
					<AS.ButtonContainer>
						<AS.DeleteIcon onClick={handleDelete} />
					</AS.ButtonContainer>
				</AS.SubcatContainer>
			) : (
				<>
					<AS.SubcatContainer onClick={handleShowEdit}>
						<AS.NameText>{sub.name}</AS.NameText>
						<AS.ButtonContainer>
							<AS.DeleteIcon onClick={handleDelete} />
						</AS.ButtonContainer>
					</AS.SubcatContainer>
				</>
			)}
		</>
	);
};

export default Subcat;
