import React from "react";
import AccessRoute from "components/HOC/AccessRoute";
import { serviceGraph } from "helpers/routePaths";
import access from "helpers/access";
import Services from "pages/Services";
import ServiceLists from "pages/Services/ServiceLists";
import AlternativeView from "pages/Services/AlternateView/AlternativeView";
import { Route, Routes } from "react-router-dom";
import ServiceDetailPage from "pages/Services/ServiceDetails/Links/ServiceDetailPage";

const ServicesPage = () => {
	return (
		<Services>
			<Routes>
				<Route element={<AccessRoute access={access.serviceAccess} />}>
					<Route path={`:id/*`} element={<ServiceDetailPage />} />
					<Route path={serviceGraph} element={<AlternativeView />} />
					<Route index element={<ServiceLists />} />
				</Route>

				{/* <AccessRoute
					path={servicesPath}
					exact
					component={ServiceLists}
					access={access.serviceAccess}
				/>
				<AccessRoute
					path={serviceGraph}
					exact
					component={AlternativeView}
					access={access.serviceAccess}
				/>
				<AccessRoute
					path={serviceDetailsPath}
					component={ServiceDetailPage}
					access={access.serviceAccess}
				/> */}
			</Routes>
		</Services>
	);
};

export default ServicesPage;
