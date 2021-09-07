import React from "react";
import SiteWrapper from "components/SiteWrapper";
import { useHistory } from "react-router-dom";
import SiteDetailsContent from "./SiteDetailsContent";

const SiteDetail = () => {
	const history = useHistory();

	return (
		<SiteWrapper
			current="Details"
			onNavClick={(data) => history.push(data)}
			Component={() => <SiteDetailsContent />}
		/>
	);
};

export default SiteDetail;
