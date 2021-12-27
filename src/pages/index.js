import React from "react";
import { Redirect, Switch } from "react-router";
import NavbarWrapper from "components/Layouts/NavbarWrapper";
import ApplicationPage from "pages/Applications/Links/ApplicationPage";
import ClientPage from "pages/Clients/Links/ClientPage";
import SitePage from "pages/Clients/Sites/Links/SitePage";
import SiteAppPage from "./Clients/Sites/SiteApplication/Links/SiteAppPage";
import UsersPage from "pages/Users/Links/UsersPage";
import ModelsPage from "./Models/Links/ModelsPage";
import ApplicationPortal from "./ApplicationPortal";
import {
	analysisPath,
	analyticsPath,
	applicationPortalPath,
	defectsPath,
	feedbackPath,
	noticeboardPath,
	servicesPath,
} from "helpers/routePaths";
import AccessRoute from "components/HOC/AccessRoute";
import Services from "./Services";
import access from "helpers/access";
import Defects from "./Defects";
import Analysis from "./Analysis";
import Feedback from "./Feedback";
import Noticeboards from "./Noticeboards";
import CommonApplicationTable from "components/Modules/CommonApplicationTable";

const MainApp = ({ location }) => {
	if (!location.pathname.split("/").includes("app")) {
		return <Redirect to="/login" />;
	}

	return (
		<Switch>
			<NavbarWrapper
				isApplicationPortal={location.pathname === applicationPortalPath}
			>
				<ApplicationPortal />
				<ApplicationPage />
				<ClientPage />
				<SitePage />
				<SiteAppPage />
				<UsersPage />
				<ModelsPage />
				<AccessRoute
					path="/app/models/:id/asset"
					exact
					component={(props) => {
						return (
							<CommonApplicationTable
								headers={["Name", "Age"]}
								data={[]}
								isLoading={false}
							/>
						);
					}}
					access={access.analyticsAccess}
				/>

				<AccessRoute
					path={analyticsPath}
					exact
					component={(props) => <h1>Analytics Path</h1>}
					access={access.analyticsAccess}
				/>
				<AccessRoute
					path={servicesPath}
					exact
					component={Services}
					access={access.serviceAccess}
				/>
				<AccessRoute
					path={defectsPath}
					exact
					component={Defects}
					access={access.defectAccess}
				/>
				<AccessRoute
					path={analysisPath}
					exact
					component={Analysis}
					access={access.analysisAccess}
				/>
				<AccessRoute
					path={feedbackPath}
					exact
					component={Feedback}
					access={access.feedbackAccess}
				/>
				<AccessRoute
					path={noticeboardPath}
					exact
					component={Noticeboards}
					access={access.noticeboardAccess}
				/>
			</NavbarWrapper>
		</Switch>
	);
};

export default MainApp;
