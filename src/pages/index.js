import React from "react";
import { Redirect, Switch } from "react-router";
import NavbarWrapper from "components/Layouts/NavbarWrapper";
import ApplicationPage from "pages/Applications/Links/ApplicationPage";
import ClientPage from "pages/Clients/Links/ClientPage";
import SitePage from "pages/Clients/Sites/Links/SitePage";
import SiteAppPage from "./Clients/Sites/SiteApplication/Links/SiteAppPage";
import UsersPage from "pages/Users/Links/UsersPage";
import ModelsPage from "./Models/Links/ModelsPage";
import ServicesPage from "./Services/Links/ServicesPage";
import DefectsPage from "./Defects/Links/DefectsPage";
import FeedbackPage from "./Feedback/Links/FeedbackPage";
import NoticeBoards from "./Noticeboards/Links/NoticeBoards";
import ApplicationPortal from "./ApplicationPortal";
import {
	analysisPath,
	analyticsPath,
	applicationPortalPath,
	defectExportPath,
	settingPath,
} from "helpers/routePaths";
import AccessRoute from "components/HOC/AccessRoute";
import access from "helpers/access";
import role from "helpers/roles";
import Analysis from "./Analysis";
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
				<ServicesPage />
				<DefectsPage />
				<FeedbackPage />
				<NoticeBoards />

				<AccessRoleRoute
					type={"access"}
					roles={[role.clientAdmin, role.superAdmin]}
					path={analyticsPath}
					exact
					component={(props) => <h1>Analytics Path</h1>}
					access={access.analyticsAccess}
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
