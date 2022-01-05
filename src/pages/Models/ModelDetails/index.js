import React from "react";
import useModelAccess from "../useModelAccess";
function ModelDetails({ history }) {
	useModelAccess();
	return (
		<div>
			<h1>This is ModelDetails</h1>
		</div>
	);
}

export default ModelDetails;
