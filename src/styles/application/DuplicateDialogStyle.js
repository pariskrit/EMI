import { styled } from "@mui/styles";
import ColourConstants from "helpers/colourConstants";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";

const DuplicateDialogStyle = () => {
	return {
		ActionContainer: styled("div")({
			display: "inline-flex",
		}),
		HeaderText: styled(Typography)({
			marginRight: "auto",
			fontFamily: "Roboto Condensed",
			fontWeight: "bold",
			fontSize: 21,
			color: ColourConstants.commonText,
		}),
		ButtonContainer: styled(DialogActions)({
			marginLeft: "auto",
		}),
		CancelButton: styled(Button)({
			height: 43,
			width: 160,
			fontSize: 15,
			backgroundColor: ColourConstants.cancelButton,
			color: "#FFFFFF",
			fontFamily: "Roboto Condensed",
			"&.MuiButton-root:hover": {
				backgroundColor: ColourConstants.deleteDialogHover,
				color: "#ffffff",
			},
		}),
		ConfirmButton: styled(Button)({
			height: 43,
			width: 160,
			fontSize: 15,
			backgroundColor: ColourConstants.confirmButton,
			color: "#FFFFFF",
			fontFamily: "Roboto Condensed",
			"&.MuiButton-root:hover": {
				backgroundColor: ColourConstants.deleteDialogHover,
				color: "#ffffff",
			},
		}),
		DialogContent: styled(DialogContent)({
			marginBottom: 15,
		}),
		InputContainer: styled(DialogContentText)({
			width: "100%",
			display: "flex",
			marginBottom: 20,
		}),
		NameInputContainer: styled("div")({
			width: "50%",
		}),
		InfoText: styled(Typography)({
			marginTop: 10,
			marginBottom: 10,
			fontFamily: "Roboto",
			color: ColourConstants.commonText,
			fontSize: 15,
		}),
		InputLabel: styled(Typography)({
			fontFamily: "Roboto Condensed",
			fontSize: 14,
			fontWeight: "bold",
			color: ColourConstants.commonText,
			paddingBottom: 5,
			width: "100%",
		}),
		LeftInputContainer: styled("div")({
			paddingRight: 15,
			width: "50%",
		}),
		NameLabel: styled(Typography)({
			fontFamily: "Roboto Condensed",
			fontSize: 14,
			fontWeight: "bold",
			color: ColourConstants.commonText,
			paddingBottom: 5,
			width: "100%",
		}),
		RequiredStar: styled("span")({
			color: ColourConstants.requiredStar,
		}),
		RightInputContainer: styled("div")({
			paddingLeft: 15,
			width: "50%",
		}),
		NameInput: styled(TextField)({
			width: "100%",
		}),
		CheckboxContainer: styled("div")({
			width: "50%",
			paddingLeft: "7%",
			paddingTop: 17,
		}),
		CheckboxLabel: styled(Typography)({
			fontFamily: "Roboto",
			fontSize: 14,
			color: ColourConstants.commonText,
		}),
	};
};

export default DuplicateDialogStyle;
