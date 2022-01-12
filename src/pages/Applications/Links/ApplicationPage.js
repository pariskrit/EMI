import React from "react";
import Applications from "..";
import AccessRoute from "components/HOC/AccessRoute";
import { routeList } from "./routeList";

export default function ApplicationPage() {
	return (
		<Applications>
			{routeList.map(({ id, ...route }) => (
				<AccessRoute key={id} {...route} exact />
			))}
		</Applications>
	);
}
