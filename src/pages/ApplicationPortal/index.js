import NavbarWrapper from "components/Layouts/NavbarWrapper";
import React from "react";
import Portal from "./Portal";

function ApplicationPortal() {
	return (
		<NavbarWrapper isApplicationPortal>
			<Portal />
		</NavbarWrapper>
	);
}

export default ApplicationPortal;
