import React from "react";
import { Route } from "react-router-dom";
import Site from "pages/Clients/Sites";
import { routeList } from "./routeList";

export default function SitePage() {
	return (
		<Site>
			{routeList.map(({ id, ...route }) => (
				<Route key={id} {...route} exact />
			))}
		</Site>
	);
}
