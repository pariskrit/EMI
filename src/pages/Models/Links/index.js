import React from "react";
import { Route } from "react-router-dom";
import { modelDetailsPath, modelsPath } from "helpers/routePaths";
import ModelLists from "../ModelLists";
import ModelDetails from "../ModelDetails";

export default function ModelsPage() {
	return (
		<>
			<Route path={modelsPath} exact>
				<ModelLists />
			</Route>
			<Route path={modelDetailsPath} exact>
				<ModelDetails />
			</Route>
		</>
	);
}
