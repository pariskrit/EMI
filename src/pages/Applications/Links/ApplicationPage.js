import React from "react";
import Applications from "..";
import { routeList } from "./routeList";
import RoleRoute from "components/HOC/RoleRoute";
import roles from "helpers/roles";

export default function ApplicationPage() {
	return (
		<Applications>
			{routeList.map(({ id, ...route }) => (
				<RoleRoute key={id} {...route} exact roles={[roles.superAdmin]} />
			))}
		</Applications>
	);
}
