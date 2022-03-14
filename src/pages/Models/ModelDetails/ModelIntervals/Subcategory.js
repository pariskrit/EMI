import React from "react";
import SubcatStyle from "styles/application/SubcatStyle";

// Init styled components
const AS = SubcatStyle();

const SubCategory = ({
	id,
	category,
	onChange,
	onDelete,
	isEditable,
	onEditClick,
	handleEdit,
	isDeleteClick,
}) => {
	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			handleEdit();
		}
	};

	return (
		<>
			{isEditable && !isDeleteClick ? (
				<AS.SubcatContainer>
					<AS.NameInput
						type="text"
						onKeyDown={handleEnterPress}
						value={category.name}
						onBlur={handleEdit}
						autoFocus
						onChange={(e) => onChange(e, id)}
					/>
				</AS.SubcatContainer>
			) : (
				<AS.SubcatContainer onClick={() => onEditClick(id)}>
					<AS.NameText>{category.name}</AS.NameText>
					<AS.ButtonContainer>
						<AS.DeleteIcon onClick={() => onDelete(id)} />
					</AS.ButtonContainer>
				</AS.SubcatContainer>
			)}
		</>
	);
};

export default SubCategory;
