import React from "react";
import ModelDetailContext from "contexts/ModelDetailContext";
import ModelDetails from "..";
import AccessRoute from "components/HOC/AccessRoute";
import routeList from "./routeList";
import SingleComponent from "./SingleComponent";
import access from "helpers/access";
import { modelDetailsPath } from "helpers/routePaths";

const ModelDetailPage = () => {
	return (
		<ModelDetailContext>
			<ModelDetails>
				{routeList.map((route) => (
					<AccessRoute
						key={route.id}
						component={(props) => <SingleComponent {...route} {...props} />}
						access={access.modelAccess}
						exact
						path={modelDetailsPath + route.path}
					/>
				))}
			</ModelDetails>
		</ModelDetailContext>
	);
};

export default ModelDetailPage;
