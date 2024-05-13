import React from "react";
import ActionButtonStyle from "styles/application/ActionButtonStyle";

// Init styled components
const AAD = ActionButtonStyle();

const ActionButtons = ({ handleAddDialogOpen, disabled }) => {
	return (
		<AAD.ButtonContainer>
			<AAD.GeneralButton
				disableElevation
				variant="contained"
				disabled={disabled}
				onClick={handleAddDialogOpen}
			>
				Add New
			</AAD.GeneralButton>
		</AAD.ButtonContainer>
	);
};

export default ActionButtons;
