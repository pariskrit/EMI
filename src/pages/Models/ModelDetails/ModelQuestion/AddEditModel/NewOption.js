import React from "react";
import SubcatStyle from "styles/application/SubcatStyle";

const AT = SubcatStyle();

const NewOption = ({ addNewOption, setIsAdd }) => {
	const [text, setText] = React.useState("");

	const handleChange = (e) => {
		const { value } = e.target;
		setText(value);
	};

	const handleSave = () => {
		if (text === "" || text === null) {
			return false;
		}
		addNewOption(text);
	};

	const onKeyPress = (e) => {
		if (e.keyCode === 13) {
			handleSave();
		}
	};

	return (
		<AT.SubcatContainer style={{ width: "48%" }}>
			<AT.NameInput
				autoFocus
				onChange={handleChange}
				onKeyDown={onKeyPress}
				onBlur={() => {
					if (text === "" || text === null) setIsAdd(false);
					else addNewOption(text);
				}}
				value={text}
			/>
		</AT.SubcatContainer>
	);
};
export default NewOption;
