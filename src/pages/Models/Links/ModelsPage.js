import React from "react";
import AccessRoute from "components/HOC/AccessRoute";
import { modelsPath } from "helpers/routePaths";
import access from "helpers/access";
import ModelMapData from "../ModelMapData";
import ModelLists from "../ModelLists";
import Models from "..";

const ModelsPage = () => {
	return (
		<Models>
			<AccessRoute
				path={modelsPath + "/:modelId/import"}
				exact
				component={ModelMapData}
				access={access.modelAccess}
			/>
			<AccessRoute
				path={modelsPath}
				exact
				component={ModelLists}
				access={access.modelAccess}
			/>
			<AccessRoute
				path={modelsPath + "/:modelId"}
				exact
				component={() => <h1>Model Detail Page</h1>}
				access={access.modelAccess}
			/>
		</Models>
	);
};

export default ModelsPage;
