import React from "react";
import { Route, Routes } from "react-router-dom";
import ServicesDetailsPage from "..";
import routeList from "./routeList";
import SingleComponent from "./SingleComponent";
import ServiceDetailContext from "contexts/ServiceDetailContext";

const ServicesDetails = ({ access }) => {
	const { customCaptions, siteAppID } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	return (
		<ServiceDetailContext>
			<ServicesDetailsPage>
				{(serviceDetail) => (
					<Routes>
						{routeList(serviceDetail, customCaptions).map((route) => (
							<Route
								key={route.id}
								element={
									<SingleComponent
										{...route}
										access={access}
										customCaptions={customCaptions}
										siteAppID={siteAppID}
									/>
								}
								path={route.path}
							/>
						))}
					</Routes>
				)}
			</ServicesDetailsPage>
		</ServiceDetailContext>
	);
};

export default ServicesDetails;
