import { styled } from "@material-ui/core/styles";
import ColourConstants from "../../helpers/colourConstants";
import Typography from "@material-ui/core/Typography";

const DetailsStyle = () => {
	return {
		ParentContainer: styled("div")({
			width: "100%",
			marginTop: 15,
			paddingLeft: 2,
			marginBottom: 15,
		}),
		HeaderText: styled(Typography)({
			color: ColourConstants.commonText,
			fontSize: 20,
			fontWeight: "bold",
			fontFamily: "Roboto",
			marginBottom: 7,
		}),
		InfoText: styled(Typography)({
			color: ColourConstants.commonText,
			fontSize: 14,
			fontFamily: "Roboto Condensed",
		}),
	};
};

export default DetailsStyle;
