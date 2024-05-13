import { styled } from "@mui/styles";
import ColourConstants from "helpers/colourConstants";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

const PauseDialogStyle = () => {
	return {
		NameInputContainer: styled("div")({
			width: "100%",
		}),
		DividerGutter: styled(Divider)({
			marginTop: 30,
			marginBottom: 30,
		}),
		SecondaryHeaderContainer: styled("div")({
			width: "100%",
		}),
		NewButtonContainer: styled("div")({
			display: "flex",
		}),
		NewButton: styled(Button)({
			marginLeft: "auto",
			width: 114,
			borderRadius: 25,
			backgroundColor: ColourConstants.confirmButton,
			color: "#FFFFFF",
			fontFamily: "Roboto Condensed",
			"&.MuiButton-root:hover": {
				backgroundColor: ColourConstants.deleteDialogHover,
				color: "#ffffff",
			},
		}),
	};
};

export default PauseDialogStyle;
