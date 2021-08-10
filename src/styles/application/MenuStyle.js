import { styled } from "@material-ui/core/styles";
import ColourConstants from "../../helpers/colourConstants";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const MenuStyle = () => {
	return {
		PopperPaper: styled(Paper)({
			borderRadius: "9px",
			paddingLeft: 5,
			paddingRight: 5,
			minWidth: 220,
			maxWidth: 500,
		}),
		LinkText: styled(Typography)({
			fontFamily: "Roboto Condensed",
			fontWeight: "bold",
			fontSize: 15,
			color: ColourConstants.activeLink,
		}),
		DeleteLink: styled(Typography)({
			fontFamily: "Roboto Condensed",
			fontWeight: "bold",
			fontSize: 15,
			color: ColourConstants.deleteLink,
		}),
	};
};

export default MenuStyle;
