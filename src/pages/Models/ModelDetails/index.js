import React from "react";
function ModelDetails({ history }) {
	const { position } = JSON.parse(localStorage.getItem("me"));
	const access = position?.modelAccess;
	if (position === null || access !== "F" || access !== "E" || access !== "R") {
		history.goBack();
	}
	return (
		<div>
			<h1>This is ModelDetails</h1>
		</div>
	);
}

export default ModelDetails;
