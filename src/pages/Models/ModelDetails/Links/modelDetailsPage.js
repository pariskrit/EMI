import React from "react";
import AccessRoute from "components/HOC/AccessRoute";
import { routeList } from "./routeList";
import ModelDetails from "..";
import access from "helpers/access";

export default function ModelDetailsPage() {
	return (
		<ModelDetails>
			{routeList.map(({ id, ...route }) => (
				<AccessRoute key={id} {...route} exact access={access.modelAccess} />
			))}
		</ModelDetails>
	);
}
