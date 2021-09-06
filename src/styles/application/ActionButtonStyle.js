import { styled } from "@material-ui/core/styles";
import ColourConstants from "../../helpers/colourConstants";
import Button from "@material-ui/core/Button";

const ActionButtonStyle = () => {
	const media = "@media (max-width: 414px)";

	return {
		ButtonContainer: styled("div")({
			marginLeft: "auto",
			[media]: {
				marginTop: "10px",
			},
		}),
		GeneralButton: styled(Button)({
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
		}),
	};
};

export default ActionButtonStyle;
