import React from "react";
import ModelDetailContext from "contexts/ModelDetailContext";
import ModelDetails from "..";
import routeList from "./routeList";
import SingleComponent from "./SingleComponent";
import { modelDetailsPath } from "helpers/routePaths";
import { Route, Switch } from "react-router-dom";

const ModelDetailPage = ({ access }) => {
	return (
		<ModelDetailContext>
			<ModelDetails>
				<Switch>
					{routeList.map((route) => (
						<Route
							key={route.id}
							render={(props) => (
								<SingleComponent {...route} {...props} access={access} />
							)}
							exact
							path={modelDetailsPath + route.path}
						/>
					))}
				</Switch>
			</ModelDetails>
		</ModelDetailContext>
	);
};

export default ModelDetailPage;
