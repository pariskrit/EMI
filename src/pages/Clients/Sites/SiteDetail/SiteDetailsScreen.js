import React from "react";
import SiteWrapper from "components/Layouts/SiteWrapper";
import { useHistory } from "react-router-dom";
import SiteDetailsContent from "./SiteDetailsContent";
import { useParams } from "react-router-dom";
import { siteScreenNavigation } from "helpers/constants";
import { getLocalStorageData } from "helpers/utils";

const SiteDetail = () => {
	const history = useHistory();
	const { id, clientId } = useParams();
	const { role, isSiteUser, customCaptions } = getLocalStorageData("me");
	let navigation = siteScreenNavigation;

	// User is Site User
	if (role === "SiteUser" || isSiteUser)
		navigation = [
			{ name: "Details", url: siteScreenNavigation[0].url },
			{ name: customCaptions?.assetPlural, url: siteScreenNavigation[1].url },
			{
				name: customCaptions?.departmentPlural,
				url: siteScreenNavigation[2].url,
			},
			{
				name: customCaptions?.locationPlural,
				url: siteScreenNavigation[3].url,
			},
		];

	return (
		<SiteWrapper
			navigation={navigation}
			onNavClick={(urlToGo) =>
				history.push(`/app/clients/${clientId}/sites/${id}${urlToGo}`)
			}
			current="Details"
			Component={() => <SiteDetailsContent />}
		/>
	);
};

export default SiteDetail;
