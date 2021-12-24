import React from "react";
import AccessRoute from "components/HOC/AccessRoute";
import { modelPath } from "helpers/routePaths";
import access from "helpers/access";
import ModelMapData from "../ModelMapData";
import Models from "..";

const ModelsPage = () => {
	return (
		<Models>
			<AccessRoute
				path={modelPath + "/:modelId/import"}
				exact
				component={ModelMapData}
				access={access.modelAccess}
			/>{" "}
		</Models>
	);
};

export default ModelsPage;
