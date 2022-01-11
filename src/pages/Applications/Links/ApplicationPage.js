import React from "react";
import Applications from "..";
import AccessRoute from "components/HOC/AccessRoute";
import { routeList } from "./routeList";
import roles from "helpers/roles";

export default function ApplicationPage() {
	return (
		<Applications>
			{routeList.map(({ id, ...route }) => (
				<AccessRoute key={id} {...route} exact user={roles.superAdmin} />
			))}
		</Applications>
	);
}
