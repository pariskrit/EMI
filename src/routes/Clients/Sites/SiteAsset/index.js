import React from "react";
import SiteWrapper from "components/SiteWrapper";
import { useHistory } from "react-router-dom";
import Assets from "./Assets";

const SiteAsset = () => {
	const history = useHistory();

	return (
		<SiteWrapper
			current="Assets"
			onNavClick={(path) => history.push(path)}
			status=""
			lastSaved=""
			Component={() => <Assets />}
		/>
	);
};

export default SiteAsset;
