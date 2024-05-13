import { styled } from "@mui/styles";
import ColourConstants from "helpers/colourConstants";
import Button from "@mui/material/Button";

const ActionButtonStyle = () => {
	const media = "@media (max-width: 414px)";

	return {
		ButtonContainer: styled("div")({
			marginLeft: "auto",
			[media]: {
				marginTop: "10px",
			},
		}),
		GeneralButton: styled(Button)(({ theme }) => ({
			color: "#FFFFFF",
			fontFamily: "Roboto Condensed",
			backgroundColor: ColourConstants.confirmButton,
			fontWeight: "bold",
			fontSize: "13.5px",
			marginRight: 10,
			width: 150,
			height: "37px",
			[media]: {
				width: 130,
				height: "35px",
			},
			"&.MuiButton-root:hover": {
				backgroundColor: "#d5d5d5",
			},
		})),
	};
};

export default ActionButtonStyle;
