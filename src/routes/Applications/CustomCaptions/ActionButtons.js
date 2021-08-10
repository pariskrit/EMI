import React from "react";
import ActionButtonStyle from "../../../styles/application/ActionButtonStyle";

// Init styled components
const AAD = ActionButtonStyle();

const ActionButtons = () => {
	return (
		<AAD.ButtonContainer>
			<AAD.GeneralButton disableElevation variant="contained">
				Save
			</AAD.GeneralButton>
		</AAD.ButtonContainer>
	);
};

export default ActionButtons;
