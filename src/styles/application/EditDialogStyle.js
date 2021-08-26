import { styled } from "@material-ui/core/styles";
import ColourConstants from "../../helpers/colourConstants";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";

const EditDialogStyle = () => {
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
		ConfirmButton: styled(Button)({
			height: 43,
			width: 160,
			fontSize: 15,
			backgroundColor: ColourConstants.confirmButton,
			color: "#FFFFFF",
			fontFamily: "Roboto Condensed",
		}),
		CancelButton: styled(Button)({
			height: 43,
			width: 160,
			fontSize: 15,
			backgroundColor: ColourConstants.cancelButton,
			color: "#FFFFFF",
			fontFamily: "Roboto Condensed",
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

		FieldInputContainer: styled("div")({
			width: "50%",
			paddingRight: 15,
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
		InfoText: styled(Typography)({
			marginTop: 10,
			marginBottom: 10,
			fontFamily: "Roboto",
			color: ColourConstants.commonText,
			fontSize: 15,
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

export default EditDialogStyle;
