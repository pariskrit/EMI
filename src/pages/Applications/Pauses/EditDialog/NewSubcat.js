import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import API from "../../../../helpers/api";
import SubcatStyle from "../../../../styles/application/SubcatStyle";

// Init styled components
const AS = SubcatStyle();

// Default state schemas
const defaultErrorSchema = { name: null };

const NewSubcat = ({
	editData,
	handleAddSubcat,
	setIsAddNew,
	setIsUpdating,
}) => {
	// Init state
	const [subcatName, setSubcatName] = useState("");
	const [errors, setErrors] = useState(defaultErrorSchema);
	const dispatch = useDispatch();

	// Handlers
	const closeOverride = () => {
		setErrors(defaultErrorSchema);
		setSubcatName("");
	};
	const handleCreateSubcat = async () => {
		try {
			// Attempting to create subcat
			let addedSubcat = await API.post(`/api/ApplicationPauseSubcategories`, {
				applicationPauseId: editData.id,
				name: subcatName,
			});

			// if success, adding data to reducer
			if (addedSubcat.status === 201) {
				// On success, adding new subcat to state
				handleAddSubcat(editData.id, addedSubcat.data, subcatName);

				return { success: true };
			} else {
				// If error, throwing to catch
				throw new Error(addedSubcat);
			}
		} catch (err) {
			// Handling duplicate subcat error
			if (
				err.response.data.detail !== undefined ||
				err.response.data.detail !== null
			) {
				setErrors({ ...errors, ...{ name: err.response.data.detail } });
				return { success: false };
			}

			// Handling other errors
			if (err.response.data.errors !== undefined) {
				setErrors({ ...errors, ...err.response.data.errors });
				return { success: false };
			} else {
				// If no explicit errors provided, throws to caller
				throw new Error(err);
			}
		}
	};
	const saveSubcat = async () => {
		if (subcatName === null || subcatName === "") {
			// Removing input box
			setIsAddNew(false);

			// Closing
			closeOverride();
		}
		// Setting progress indicator
		setIsUpdating(true);

		try {
			// Creating subcat
			const newSubcat = await handleCreateSubcat();

			if (newSubcat.success) {
				// Clearning input state
				setSubcatName("");

				// removing indicator
				setIsUpdating(false);

				// Removing input box
				setIsAddNew(false);
			} else {
				// Removing indicator
				setIsUpdating(false);
				dispatch(showError("Failed to add pause reason subcategory."));
			}
		} catch (err) {
			// TODO: handle non validation errors here

			setIsUpdating(false);
			closeOverride();
			dispatch(showError("Failed to add pause reason subcategory."));
		}
	};
	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			saveSubcat();
		}
	};
	const handleCloseInput = () => {
		setErrors(defaultErrorSchema);
		setSubcatName("");
		setIsAddNew(false);
	};

	return (
		<AS.SubcatContainer>
			<AS.NameInput
				error={errors.name === null ? false : true}
				helperText={errors.name === null ? null : errors.name}
				onKeyDown={handleEnterPress}
				value={subcatName}
				onChange={(e) => {
					setSubcatName(e.target.value);
				}}
				onBlur={saveSubcat}
			/>
			<AS.ButtonContainer>
				<AS.DeleteIcon onClick={handleCloseInput} />
			</AS.ButtonContainer>
		</AS.SubcatContainer>
	);
};

export default NewSubcat;
