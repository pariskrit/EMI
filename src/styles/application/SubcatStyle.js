import { styled } from "@mui/styles";
import ColourConstants from "helpers/colourConstants";
// import TextField from "@mui/material/TextField";
import { ReactComponent as DeleteIcon } from "assets/icons/deleteIcon.svg";
import Typography from "@mui/material/Typography";
import { Input } from "@mui/material";

const SubcatStyle = () => {
	const media = "@media (max-width: 414px)";

	return {
		SubcatContainer: styled("div")({
			display: "flex",
			alignItems: "center",
			width: "100%",
			marginBottom: 10,
			borderWidth: 1,
			borderStyle: "solid",
			borderColor: ColourConstants.commonBorder,
			borderRadius: 5,
			paddingLeft: 10,
			paddingTop: 12,
			paddingBottom: 12,
		}),
		NameInput: styled(Input)({
			marginTop: 2,
			marginBottom: 2,
			color: ColourConstants.commonText,
			width: "80%",
			fontFamily: "Roboto",
			fontSize: 14,
			border: "none",
			boxShadow: "none",
			[media]: {
				width: "75%",
				overflow: "hidden",
			},
			"&:focus": {
				border: "none",
				boxShadow: "none",
				outline: "none",
			},
		}),
		NameText: styled(Typography)({
			color: ColourConstants.commonText,
			fontFamily: "Roboto",
			fontSize: 14,
		}),
		ButtonContainer: styled("div")({
			display: "flex",
			paddingRight: 10,
			alignItems: "center",
			marginLeft: "auto",
		}),
		DeleteIcon: styled(DeleteIcon)({
			transform: "scale(0.9)",
			color: ColourConstants.deleteIcon,
			"&:hover": {
				cursor: "pointer",
			},
		}),
	};
};

export default SubcatStyle;
