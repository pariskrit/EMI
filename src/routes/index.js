import React from "react";
import NavbarWrapper from "components/Layouts/NavbarWrapper";
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
