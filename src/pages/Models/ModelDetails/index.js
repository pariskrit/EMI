import React from "react";
function ModelDetails({ history }) {
	const { position } = JSON.parse(localStorage.getItem("me"));
	if (position === null) {
		history.goBack();
	}
	return (
		<div>
			<h1>This is ModelDetails</h1>
		</div>
	);
}

export default ModelDetails;
