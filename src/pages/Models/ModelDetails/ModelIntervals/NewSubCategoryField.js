import React from "react";
import SubcatStyle from "styles/application/SubcatStyle";

// Init styled components
const AS = SubcatStyle();

const NewSubCategoryField = ({ handleSave, onChange, name, onClose }) => {
	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			handleSave();
		}
	};

	return (
		<AS.SubcatContainer>
			<AS.NameInput
				autoFocus
				onKeyDown={handleEnterPress}
				value={name}
				onBlur={handleSave}
				onChange={onChange}
			/>
			<AS.ButtonContainer>
				<AS.DeleteIcon onClick={onClose} />
			</AS.ButtonContainer>
		</AS.SubcatContainer>
	);
};

export default NewSubCategoryField;
