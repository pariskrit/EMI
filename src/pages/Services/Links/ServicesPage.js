import React from "react";
import AccessRoute from "components/HOC/AccessRoute";
import { serviceDetailsPath, servicesPath } from "helpers/routePaths";
import access from "helpers/access";
import Services from "..";
import ServiceLists from "../ServiceLists";
import ServiceDetailPage from "../ServiceDetails/Links/ServiceDetailPage";

const ServicesPage = () => {
	return (
		<Services>
			<AccessRoute
				path={servicesPath}
				exact
				component={ServiceLists}
				access={access.serviceAccess}
			/>
			<AccessRoute
				path={serviceDetailsPath}
				component={ServiceDetailPage}
				access={access.serviceAccess}
			/>
		</Services>
	);
};

export default ServicesPage;
