import { styled } from "@mui/styles";
import ColourConstants from "helpers/colourConstants";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DialogContentText from "@mui/material/DialogContentText";

const DeleteDialogStyle = () => {
	const media = "@media (max-width: 414px)";

	return {
		ActionContainer: styled("div")({
			display: "inline-flex",
			[media]: {
				display: "inline-flex",
				flexWrap: "wrap",
			},
		}),
		DialogContent: styled(DialogContent)({
			width: 500,
			[media]: {
				width: "100%",
			},
		}),
		HeaderText: styled(Typography)({
			marginRight: "auto",
			fontFamily: "Roboto Condensed",
			fontWeight: "bold",
			fontSize: 21,
			[media]: {
				fontSize: 18,
			},
		}),
		ButtonContainer: styled(DialogActions)({
			marginLeft: "auto",
			[media]: {
				marginLeft: 0,
				paddingLeft: "20px",
			},
		}),
		CancelButton: styled(Button)({
			height: 43,
			fontSize: 15,
			backgroundColor: ColourConstants.deleteCancelButton,
			color: "#FFFFFF",
			fontFamily: "Roboto Condensed",
			"&.MuiButton-root:hover": {
				backgroundColor: ColourConstants.deleteDialogHover,
				color: "#ffffff",
			},
		}),
		DeleteButton: styled(Button)({
			height: 43,
			fontSize: 15,
			backgroundColor: ColourConstants.deleteButton,
			color: "#FFFFFF",
			fontFamily: "Roboto Condensed",
			"&.MuiButton-root:hover": {
				backgroundColor: ColourConstants.deleteDialogHover,
				color: "#ffffff",
			},
		}),
		InputContainer: styled(DialogContentText)({
			width: "100%",
		}),
	};
};

export default DeleteDialogStyle;
