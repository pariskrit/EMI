import { styled } from "@mui/styles";
import ColourConstants from "helpers/colourConstants";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

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
