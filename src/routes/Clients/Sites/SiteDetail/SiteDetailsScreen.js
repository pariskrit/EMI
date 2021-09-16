import React from "react";
import SiteWrapper from "components/SiteWrapper";
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
				history.push(`/clients/${clientId}/sites/${id}${urlToGo}`)
			}
			current="Details"
			Component={() => <SiteDetailsContent />}
		/>
	);
};

export default SiteDetail;
