import React from "react";
import { Route, Switch } from "react-router-dom";
import ModelDetailContext from "contexts/ModelDetailContext";
import ModelDetails from "..";
import routeList from "./routeList";
import SingleComponent from "./SingleComponent";
import { modelDetailsPath } from "helpers/routePaths";

const ModelDetailPage = ({ access }) => {
	const { customCaptions } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	return (
		<ModelDetailContext>
			<ModelDetails>
				{(modelDetail) => (
					<Switch>
						{routeList(modelDetail, customCaptions).map((route) => (
							<Route
								key={route.id}
								render={(props) => (
									<SingleComponent
										{...route}
										{...props}
										access={access}
										customCaptions={customCaptions}
									/>
								)}
								exact
								path={modelDetailsPath + route.path}
							/>
						))}
					</Switch>
				)}
			</ModelDetails>
		</ModelDetailContext>
	);
};

export default ModelDetailPage;
