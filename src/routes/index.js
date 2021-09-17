import NavbarWrapper from "components/NavbarWrapper";
import React from "react";
import ApplicationPage from "routes/Applications/Links/ApplicationPage";
import ClientPage from "routes/Clients/Links/ClientPage";
import SitePage from "routes/Clients/Sites/Links/SitePage";

const MainApp = () => {
	return (
		<NavbarWrapper>
			<ApplicationPage />
			<ClientPage />
			<SitePage />
		</NavbarWrapper>
	);
};

export default MainApp;
