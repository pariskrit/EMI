import { styled } from "@material-ui/core/styles";
import ColourConstants from "../../helpers/colourConstants";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";

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
		}),
	};
};

export default PauseDialogStyle;
