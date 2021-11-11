import React from "react";
import SiteWrapper from "components/Layouts/SiteWrapper";
import { useHistory } from "react-router-dom";
import SiteDetailsContent from "./SiteDetailsContent";
import { useParams } from "react-router-dom";
import { siteScreenNavigation } from "helpers/constants";

const SiteDetail = () => {
	const history = useHistory();
	const { id, clientId } = useParams();

	return (
		<SiteWrapper
			navigation={siteScreenNavigation}
			onNavClick={(urlToGo) =>
				history.push(`/app/clients/${clientId}/sites/${id}${urlToGo}`)
			}
			current="Details"
			Component={() => <SiteDetailsContent />}
		/>
	);
};

export default SiteDetail;
