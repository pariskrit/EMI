import React, { useState } from "react";
import API from "../../../../helpers/api";
import SubcatStyle from "../../../../styles/application/SubcatStyle";

// Init styled components
const AS = SubcatStyle();

// Default state schemas
const defaultErrorSchema = { name: null };

const Subcat = ({
	setIsUpdating,
	sub,
	handleRemoveSubcat,
	handleUpdateSubcatStateName,
}) => {
	// Init state
	const [attemptDelete, setAttemptDelete] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [subcatName, setSubcatName] = useState("");
	const [errors, setErrors] = useState(defaultErrorSchema);

	// Handlers
	const deleteSubcat = async () => {
		setAttemptDelete(true);
		// Adding progress indicator
		setIsUpdating(true);

		// Attemptint to delete subcat
		try {
			// Making patch to backend
			const result = await API.delete(
				`/api/ApplicationPauseSubcategories/${sub.id}`
			);

			// Handling success
			if (result.status === 200) {
				// Updating state
				handleRemoveSubcat(sub);

				// Removing indicator
				setIsUpdating(false);

				return true;
			} else {
				// Throwing error if not 200
				throw new Error(result);
			}
		} catch (err) {
			// TODO: real error handling
			console.log(err);

			// Updating delete state
			setAttemptDelete(false);

			// Removing indicator
			setIsUpdating(false);

			return false;
		}
	};
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
			const result = await API.patch(
				`/api/ApplicationPauseSubcategories/${sub.id}`,
				[
					{
						op: "replace",
						path: "name",
						value: subcatName,
					},
				]
			);

			// Handling succesful update
			if (result.status === 200) {
				// Updating name in parent state
				handleUpdateSubcatStateName(sub.applicationPauseID, sub.id, subcatName);

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
				setErrors({ ...errors, ...{ name: err.response.data.detail } });

				setIsUpdating(false);
				return false;
			}

			// Handling other errors
			if (err.response.data.errors !== undefined) {
				setErrors({ ...errors, ...err.response.data.errors });

				setIsUpdating(false);
				return false;
			} else {
				// TODO: handle non validation errors here
				console.log(err);

				setIsEdit(false);
				setIsUpdating(false);
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
			{isEdit && !attemptDelete ? (
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
						<AS.DeleteIcon onClick={deleteSubcat} />
					</AS.ButtonContainer>
				</AS.SubcatContainer>
			) : (
				<>
					<AS.SubcatContainer onClick={handleShowEdit}>
						<AS.NameText>{sub.name}</AS.NameText>
						<AS.ButtonContainer>
							<AS.DeleteIcon onClick={deleteSubcat} />
						</AS.ButtonContainer>
					</AS.SubcatContainer>
				</>
			)}
		</>
	);
};

export default Subcat;
