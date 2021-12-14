import React from "react";
import { Route } from "react-router-dom";
import { modelsPath } from "helpers/routePaths";
import ModelLists from "..";

export default function ModelsPage() {
	return (
		<>
			<Route path={modelsPath} exact>
				<ModelLists />
			</Route>
		</>
	);
}
