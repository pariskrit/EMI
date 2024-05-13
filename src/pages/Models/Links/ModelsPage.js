import React from "react";
import AccessRoute from "components/HOC/AccessRoute";
import { modelDetailsPath, modelImport, modelsPath } from "helpers/routePaths";
import access from "helpers/access";
import ModelMapData from "pages/Models/ModelMapData";
import ModelLists from "pages/Models/ModelLists";
import Models from "pages/Models";
import ModelDetailPage from "pages/Models/ModelDetails/Links/ModelDetailPage";
import { Route, Routes } from "react-router-dom";

const ModelsPage = () => {
	return (
		<Models>
			<Routes>
				<Route element={<AccessRoute access={access.modelAccess} />}>
					<Route index element={<ModelLists />} />
					<Route path={`:id/*`} element={<ModelDetailPage />} />
				</Route>
				{/* <AccessRoute
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
				/> */}
			</Routes>
		</Models>
	);
};

export default ModelsPage;
