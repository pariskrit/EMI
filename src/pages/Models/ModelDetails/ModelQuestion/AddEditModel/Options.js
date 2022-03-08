import React, { useState } from "react";
import SubcatStyle from "styles/application/SubcatStyle";

const AS = SubcatStyle();

const Options = ({ x, id, handleRemoveOption, handleUpdateOption }) => {
	const [isEdit, setIsEdit] = useState(false);
	const [text, setText] = useState("");

	const handleDeleteOption = (e) => {
		e.stopPropagation();
		handleRemoveOption(id);
	};

	const handleShowEdit = () => {
		setIsEdit(true);
		setText(x);
	};

	const handleEditSubcatName = async () => {
		// Returning if name unchanged or empty
		if (x === text || text === "") {
			setIsEdit(false);
			return false;
		} else {
			await handleUpdateOption(id, text);

			setIsEdit(false);

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
		<div style={{ flex: "48%" }}>
			{isEdit ? (
				<AS.SubcatContainer>
					<AS.NameInput
						type="text"
						onKeyDown={handleEnterPress}
						value={text}
						onBlur={handleEditSubcatName}
						autoFocus
						onChange={(e) => {
							setText(e.target.value);
						}}
					/>
				</AS.SubcatContainer>
			) : (
				<>
					<AS.SubcatContainer onClick={handleShowEdit}>
						<AS.NameText>{x}</AS.NameText>
						<AS.ButtonContainer>
							<AS.DeleteIcon onClick={handleDeleteOption} />
						</AS.ButtonContainer>
					</AS.SubcatContainer>
				</>
			)}
		</div>
	);
};
export default Options;
