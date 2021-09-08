import React from "react";

function Site(props) {
	return (
		<div>
			{/* In future we can use this component for wrapping the page with common layout */}
			{props.children}
		</div>
	);
}

export default Site;
