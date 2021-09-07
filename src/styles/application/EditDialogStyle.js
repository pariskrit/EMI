import { styled } from "@material-ui/core/styles";
import ColourConstants from "../../helpers/colourConstants";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";

const EditDialogStyle = () => {
	const media = "@media (max-width: 414px)";
	return {
		ActionContainer: styled("div")({
			display: "inline-flex",
			[media]: {
				flexWrap: "wrap",
			},
		}),
		HeaderText: styled(Typography)({
			marginRight: "auto",
			fontFamily: "Roboto Condensed",
			fontWeight: "bold",
			fontSize: 21,
			color: ColourConstants.commonText,
			[media]: {
				fontSize: 18,
			},
		}),
		ButtonContainer: styled(DialogActions)({
			marginLeft: "auto",
			[media]: {
				marginLeft: "18px",
			},
		}),
		ConfirmButton: styled(Button)({
			height: 43,
			width: 160,
			fontSize: 15,
			backgroundColor: ColourConstants.confirmButton,
			color: "#FFFFFF",
			fontFamily: "Roboto Condensed",
			[media]: {
				width: "100px",
			},
		}),
		CancelButton: styled(Button)({
			height: 43,
			width: 160,
			fontSize: 15,
			backgroundColor: ColourConstants.cancelButton,
			color: "#FFFFFF",
			fontFamily: "Roboto Condensed",
			[media]: {
				width: "100px",
			},
		}),
		DialogContent: styled(DialogContent)({
			marginBottom: 15,
		}),
		InputContainer: styled("div")({
			width: "100%",
			display: "flex",
			marginBottom: 20,
			[media]: {
				flexDirection: "column",
			},
		}),

		NameInputContainer: styled("div")({
			width: "50%",
			[media]: {
				width: "100%",
			},
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
			[media]: {
				paddingRight: 0,
				width: "100%",
				marginBottom: "20px",
			},
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
			[media]: {
				paddingLeft: 0,
				width: "100%",
			},
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
			[media]: {
				width: "100%",
				paddingLeft: "0px",
			},
		}),
		CheckboxLabel: styled(Typography)({
			fontFamily: "Roboto",
			fontSize: 14,
			color: ColourConstants.commonText,
		}),
	};
};

export default EditDialogStyle;
