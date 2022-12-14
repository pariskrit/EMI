import React from "react";
import AccessRoute from "components/HOC/AccessRoute";
import { modelDetailsPath, modelImport, modelsPath } from "helpers/routePaths";
import access from "helpers/access";
import ModelMapData from "../ModelMapData";
import ModelLists from "../ModelLists";
import Models from "..";
import ModelDetailPage from "../ModelDetails/Links/ModelDetailPage";

const ModelsPage = () => {
	return (
		<Models>
			<AccessRoute
				path={modelsPath}
				exact
				component={ModelLists}
				access={access.modelAccess}
			/>
			<AccessRoute
				path={modelDetailsPath}
				component={ModelDetailPage}
				access={access.modelAccess}
			/>
			<AccessRoute
				path={`${modelImport}/:modelId`}
				exact
				component={ModelMapData}
				access={access.modelAccess}
			/>
		</Models>
	);
};

export default ModelsPage;
