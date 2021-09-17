import React from "react";
import NavbarWrapper from "components/Layouts/NavbarWrapper";
import ApplicationPage from "pages/Applications/Links/ApplicationPage";
import ClientPage from "pages/Clients/Links/ClientPage";
import SitePage from "pages/Clients/Sites/Links/SitePage";
import SiteAppPage from "./Clients/Sites/SiteApplication/Links/SiteAppPage";

const MainApp = () => {
	return (
		<NavbarWrapper>
			<ApplicationPage />
			<ClientPage />
			<SitePage />
			<SiteAppPage />
		</NavbarWrapper>
	);
};

export default MainApp;
