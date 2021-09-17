import NavbarWrapper from "components/NavbarWrapper";
import React from "react";
import ApplicationPage from "routes/Applications/Links/ApplicationPage";
import ClientPage from "routes/Clients/Links/ClientPage";
import SitePage from "routes/Clients/Sites/Links/SitePage";
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
