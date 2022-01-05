import React from "react";
import AccessRoute from "components/HOC/AccessRoute";
import { modelsPath } from "helpers/routePaths";
import access from "helpers/access";
import ModelMapData from "../ModelMapData";
import ModelLists from "../ModelLists";
import ModelDetailsPage from "../ModelDetails/Links/modelDetailsPage";
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
			{/* <AccessRoute
				path={modelDetailsPath}
				exact
				component={ModelDetailsPage}
				access={access.modelAccess}
			/> */}
			<ModelDetailsPage />
		</Models>
	);
};

export default ModelsPage;
