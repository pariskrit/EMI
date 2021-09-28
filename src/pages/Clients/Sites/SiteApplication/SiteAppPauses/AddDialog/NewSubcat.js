import React, { useState } from "react";
import SubcatStyle from "styles/application/SubcatStyle";

// Init styled components
const AS = SubcatStyle();

// Default state schemas
//const defaultErrorSchema = { name: null };

const NewSubcat = ({ handleAddSubcat, setIsAddNew }) => {
	// Init state
	const [subcatName, setSubcatName] = useState("");
	//const [errors, setErrors] = useState(defaultErrorSchema);

	// Handlers
	const saveSubcat = () => {
		// Clearning past errors
		//setErrors(defaultErrorSchema);

		// If subcat null, removing input
		if (subcatName === null || subcatName === "") {
			setIsAddNew(false);

			return true;
		}

		// Removing input
		setIsAddNew(false);

		// Validating input to ensure no dupes
		/*if (subcats.find((el) => el === subcatName) !== undefined) {
			// Adding error
			//setErrors({ name: "Each subcategory must be unique" });

			// Re-enabling input
			setIsAddNew(true);
		} else {*/
		// Adding subcat to parent state
		handleAddSubcat(subcatName);

		// Clearing local state
		setSubcatName("");

		return true;
		//}
	};
	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			saveSubcat();
		}
	};
	const handleCloseInput = () => {
		//setErrors(defaultErrorSchema);
		setSubcatName("");
		setIsAddNew(false);
	};

	return (
		<AS.SubcatContainer>
			<AS.NameInput
				//error={errors.name === null ? false : true}
				//helperText={errors.name === null ? null : errors.name}
				autoFocus
				onKeyDown={handleEnterPress}
				value={subcatName}
				onBlur={saveSubcat}
				onChange={(e) => {
					setSubcatName(e.target.value);
				}}
			/>
			<AS.ButtonContainer>
				<AS.DeleteIcon onClick={handleCloseInput} />
			</AS.ButtonContainer>
		</AS.SubcatContainer>
	);
};

export default NewSubcat;
