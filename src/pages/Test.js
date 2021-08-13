import React, { useState } from "react";
import Dropdown from "../components/Dropdown";

let options = [
	{ value: 1, label: "Bus" },
	{ value: 2, label: "Crane" },
	{ value: 3, label: "Dozer" },
	{ value: 4, label: "Grader" },
	{ value: 5, label: "IT" },
	{ value: 6, label: "Jumbo" },
	{ value: 7, label: "Light Vehicle" },
	{ value: 8, label: "Loader" },
	{ value: 9, label: "Solo" },
	{ value: 10, label: "Service truck" },
	{ value: 11, label: "Other" },
];
function Test(props) {
	const [value, setValue] = useState({});
	return (
		<div className="flex justify-center wd-100" style={{ height: "100vh" }}>
			<Dropdown
				options={options}
				selectedValue={value}
				onChange={(selectedValue) => setValue(selectedValue)}
				label="Type"
				required={true}
			/>
		</div>
	);
}

export default Test;
