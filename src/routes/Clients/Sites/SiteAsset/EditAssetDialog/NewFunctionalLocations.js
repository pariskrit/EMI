import React, { useState } from "react";
import API from "helpers/api";
import SubcatStyle from "styles/application/SubcatStyle";

const AS = SubcatStyle();
const defaultInputSchema = {
	name: "",
	description: "",
	plannerGroup: "",
	workCenter: "",
};
const NewFunctionalLocations = () => {
	const [input, setInput] = useState(defaultInputSchema);
	return <div></div>;
};

export default NewFunctionalLocations;
