import React from "react";
import { Route, Switch } from "react-router-dom";
import ServicesDetailsPage from "..";
import routeList from "./routeList";
import SingleComponent from "./SingleComponent";
import { serviceDetailsPath } from "helpers/routePaths";
import ServiceDetailContext from "contexts/ServiceDetailContext";

const ServicesDetails = ({ access }) => {
	const { customCaptions, siteAppID } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	return (
		<ServiceDetailContext>
			<ServicesDetailsPage>
				{(serviceDetail) => (
					<Switch>
						{routeList(serviceDetail, customCaptions).map((route) => (
							<Route
								key={route.id}
								render={(props) => (
									<SingleComponent
										{...route}
										{...props}
										access={access}
										customCaptions={customCaptions}
										siteAppID={siteAppID}
									/>
								)}
								exact
								path={serviceDetailsPath + route.path}
							/>
						))}
					</Switch>
				)}
			</ServicesDetailsPage>
		</ServiceDetailContext>
	);
};

export default ServicesDetails;
