import React from "react";

function SiteApplication(props) {
	/* In future we can use this component for wrapping the page with common layout */
	return <div>{props.children}</div>;
}

export default SiteApplication;
