import React from "react";
import SiteWrapper from "components/Layouts/SiteWrapper";
import { useNavigate } from "react-router-dom";
import SiteDetailsContent from "./SiteDetailsContent";
import { useParams } from "react-router-dom";
import { AccessTypes, siteScreenNavigation } from "helpers/constants";
import { getLocalStorageData } from "helpers/utils";
import roles from "helpers/roles";

const SiteDetail = () => {
	const navigate = useNavigate();
	const { id, clientId } = useParams();
	const { role, isSiteUser, customCaptions, position } = getLocalStorageData(
		"me"
	);
	let navigation = siteScreenNavigation;

	if (role === roles.superAdmin) {
		navigation = navigation.filter((d) => d.name !== "Assets");
	}

	// User is Site User
	if (role === roles.siteUser || isSiteUser)
		navigation =
			position?.assetAccess !== AccessTypes.None
				? [
						{ name: "Details", url: siteScreenNavigation[0].url },
						{
							name: customCaptions?.assetPlural,
							url: siteScreenNavigation[1].url,
						},
						{
							name: customCaptions?.departmentPlural,
							url: siteScreenNavigation[2].url,
						},
				  ]
				: [
						{ name: "Details", url: siteScreenNavigation[0].url },
						{
							name: customCaptions?.departmentPlural,
							url: siteScreenNavigation[2].url,
						},
				  ];

	return (
		<SiteWrapper
			navigation={navigation}
			onNavClick={(urlToGo) =>
				navigate(`/app/clients/${clientId}/sites/${id}${urlToGo}`)
			}
			current="Details"
			Component={() => <SiteDetailsContent />}
		/>
	);
};

export default SiteDetail;
