import React from "react";
import { Redirect, Switch } from "react-router";
// import { connect } from "react-redux";
import NavbarWrapper from "components/Layouts/NavbarWrapper";
import ApplicationPage from "pages/Applications/Links/ApplicationPage";
import ClientPage from "pages/Clients/Links/ClientPage";
import SitePage from "pages/Clients/Sites/Links/SitePage";
import SiteAppPage from "./Clients/Sites/SiteApplication/Links/SiteAppPage";
import UsersPage from "pages/Users/Links/UsersPage";
import ApplicationPortal from "./ApplicationPortal";
import { applicationPortalPath } from "helpers/routePaths";
import AccessRoute from "components/HOC/AccessRoute";
import Services from "./Services";
import access from "helpers/access";
import Defects from "./Defects";
import Analysis from "./Analysis";
import Feedback from "./Feedback";
import Noticeboards from "./Noticeboards";

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
				<AccessRoute
					path="/app/services"
					exact
					component={Services}
					access={access.serviceAccess}
				/>
				<AccessRoute
					path="/app/defects"
					exact
					component={Defects}
					access={access.defectAccess}
				/>
				<AccessRoute
					path="/app/analysis"
					exact
					component={Analysis}
					access={access.analysisAccess}
				/>
				<AccessRoute
					path="/app/feedback"
					exact
					component={Feedback}
					access={access.feedbackAccess}
				/>
				<AccessRoute
					path="/app/noticeboards"
					exact
					component={Noticeboards}
					access={access.noticeboardAccess}
				/>
			</NavbarWrapper>
		</Switch>
	);
};

export default MainApp;
