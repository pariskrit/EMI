import React from "react";
import SiteWrapper from "components/SiteWrapper";
import { useHistory } from "react-router-dom";
import Details from "./Details";

const SiteDetail = () => {
	const history = useHistory();
	return (
		<SiteWrapper
			current="Details"
			onNavClick={(data) => history.push(data)}
			Component={() => <Details />}
		/>
	);
};

export default SiteDetail;
