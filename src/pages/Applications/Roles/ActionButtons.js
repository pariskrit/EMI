import ColourConstants from "helpers/colourConstants";
import React from "react";
import ActionButtonStyle from "styles/application/ActionButtonStyle";

// Init styled components
const AAD = ActionButtonStyle();

const ActionButtons = ({ handleAddDialogOpen }) => {
	return (
		<AAD.ButtonContainer>
			<AAD.GeneralButton
				disableElevation
				variant="contained"
				onClick={handleAddDialogOpen}
				sx={{
					"&.MuiButton-root:hover": {
						backgroundColor: ColourConstants.deleteDialogHover,
						color: "#ffffff",
					},
				}}
			>
				Add New
			</AAD.GeneralButton>
		</AAD.ButtonContainer>
	);
};

export default ActionButtons;
