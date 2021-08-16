import React from "react";
import ClientDocuments from "./ClientDocuments";
import ClientLogo from "./ClientLogo";
import ClientRegionAndSites from "./ClientRegionAndSites";

function DevelopmentContent() {
	return (
		<div>
			<ClientLogo />
			<ClientDocuments />
			<ClientRegionAndSites />
		</div>
	);
}

export default DevelopmentContent;
