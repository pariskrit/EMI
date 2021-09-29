import React, { useState } from "react";
import SubcatStyle from "styles/application/SubcatStyle";

// Init styled components
const AS = SubcatStyle();

// Default state schemas
//const defaultErrorSchema = { name: null };

const Subcat = ({
	id,
	setIsUpdating,
	sub,
	handleRemoveSubcat,
	handleUpdateSubcatStateName,
}) => {
	// Init state
	const [attemptDelete, setAttemptDelete] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [subcatName, setSubcatName] = useState("");
	//const [errors, setErrors] = useState(defaultErrorSchema);

	// Handlers
	const deleteSubcat = () => {
		setAttemptDelete(true);
		// Adding progress indicator
		setIsUpdating(true);

		// Removing subcat
		handleRemoveSubcat(id);

		// Removing progress indicator
		setIsUpdating(false);

		return true;
	};
	const handleShowEdit = () => {
		setSubcatName(sub);
		setIsEdit(true);

		return true;
	};
	const handleEditSubcatName = () => {
		setIsUpdating(true);

		// Clearning existing error
		//setErrors(defaultErrorSchema);

		// Returning if name unchanged or empty
		if (sub === subcatName || subcatName === "") {
			setIsEdit(false);

			setIsUpdating(false);

			return false;
		}
		// Catching duplicate error
		/*else if (subcats.find((el) => el === subcatName) !== undefined) {
			//setErrors({ name: "Each subcategory must be unique" });

			setIsUpdating(false);

			setIsEdit(true);

			return false;
		}*/
		// Updating subcat if no local val errors
		else {
			handleUpdateSubcatStateName(id, subcatName);

			setIsEdit(false);

			setIsUpdating(false);

			return true;
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
						//error={errors.name === null ? false : true}
						//helperText={errors.name === null ? null : errors.name}
						onKeyDown={handleEnterPress}
						value={subcatName}
						onBlur={handleEditSubcatName}
						autoFocus
						onChange={(e) => {
							setSubcatName(e.target.value);
						}}
					/>
				</AS.SubcatContainer>
			) : (
				<>
					<AS.SubcatContainer onClick={handleShowEdit}>
						<AS.NameText>{sub}</AS.NameText>
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
