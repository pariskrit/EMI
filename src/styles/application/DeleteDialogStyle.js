import { styled } from "@material-ui/core/styles";
import ColourConstants from "../../helpers/colourConstants";
import DialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";

const DeleteDialogStyle = () => {
	return {
		ActionContainer: styled("div")({
			display: "inline-flex",
			["@media (max-width: 414px)"]: {
				display: "inline-flex",
				flexWrap: "wrap",
			},
		}),
		DialogContent: styled(DialogContent)({
			width: 500,
			["@media (max-width: 414px)"]: {
				width: "100%",
			},
		}),
		HeaderText: styled(Typography)({
			marginRight: "auto",
			fontFamily: "Roboto Condensed",
			fontWeight: "bold",
			fontSize: 21,
			["@media (max-width: 414px)"]: {
				fontSize: 18,
			},
		}),
		ButtonContainer: styled(DialogActions)({
			marginLeft: "auto",
			["@media (max-width: 414px)"]: {
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
		}),
		DeleteButton: styled(Button)({
			height: 43,
			fontSize: 15,
			backgroundColor: ColourConstants.deleteButton,
			color: "#FFFFFF",
			fontFamily: "Roboto Condensed",
		}),
		InputContainer: styled(DialogContentText)({
			width: "100%",
		}),
	};
};

export default DeleteDialogStyle;
