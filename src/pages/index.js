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
	clientSettingPath,
	defectExportPath,
	defectsPath,
	feedbackPath,
	noticeboardPath,
	servicesPath,
	settingPath,
} from "helpers/routePaths";
import AccessRoute from "components/HOC/AccessRoute";
import Services from "./Services";
import access from "helpers/access";
import role from "helpers/roles";
import Defects from "./Defects";
import Analysis from "./Analysis";
import Feedback from "./Feedback";
import Noticeboards from "./Noticeboards";
import ClientSetting from "./ClientSetting";
import AccessRoleRoute from "components/HOC/AccessRoleRoute";

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
				<AccessRoleRoute
					type={"role"}
					path={clientSettingPath}
					exact
					component={ClientSetting}
					roles={[role.clientAdmin]}
				/>

				<AccessRoleRoute
					type={localStorage.getItem("clientAdminMode") ? "role" : "access"}
					roles={[role.clientAdmin, role.superAdmin]}
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
					path={defectExportPath}
					exact
					component={() => <h1>Defect Export</h1>}
					access={access.defectExportAccess}
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
				<AccessRoute
					path={settingPath}
					exact
					component={() => <h1>Settings</h1>}
					access={access.settingsAccess}
				/>
			</NavbarWrapper>
		</Switch>
	);
};

export default MainApp;
