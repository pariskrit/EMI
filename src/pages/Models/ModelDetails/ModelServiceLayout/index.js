import React from "react";
import ServiceLayoutUI from "components/Modules/ServiceLayoutUI";

function ServiceLayout({ state, dispatch, access, modelId }) {
	return <ServiceLayoutUI modelId={modelId} access={access} />;
}

export default ServiceLayout;
