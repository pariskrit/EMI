import React from "react";
import ApplicationPage from "routes/Applications/Links/ApplicationPage";
import ClientPage from "routes/Clients/Links/ClientPage";
import SitePage from "routes/Clients/Sites/Links/SitePage";
const MainApp = () => {
	return (
		<div>
			<ApplicationPage />
			<ClientPage />
			<SitePage />
		</div>
	);
};

export default MainApp;
