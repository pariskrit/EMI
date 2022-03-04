import React from "react";
import SubcatStyle from "styles/application/SubcatStyle";

const AT = SubcatStyle();

const NewOption = ({ addNewOption }) => {
	const [text, setText] = React.useState("");

	const handleChange = (e) => {
		const { value } = e.target;
		setText(value);
	};

	const handleSave = async () => {
		if (text === "" || text === null) {
			return false;
		}
		await addNewOption(text);
		setText("");
	};

	const onKeyPress = (e) => {
		if (e.keyCode === 13) {
			handleSave();
		}
	};

	return (
		<AT.SubcatContainer>
			<AT.NameInput
				onChange={handleChange}
				onKeyDown={onKeyPress}
				onBlur={handleSave}
				value={text}
			/>
		</AT.SubcatContainer>
	);
};
export default NewOption;
