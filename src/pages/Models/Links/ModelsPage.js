import React from "react";
import AccessRoute from "components/HOC/AccessRoute";
import { modelsPath, modelDetailsPath } from "helpers/routePaths";
import access from "helpers/access";
import ModelMapData from "../ModelMapData";
import ModelLists from "../ModelLists";
import ModelDetails from "../ModelDetails";
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
				path={modelDetailsPath}
				exact
				component={ModelDetails}
				access={access.modelAccess}
			/>
		</Models>
	);
};

export default ModelsPage;
