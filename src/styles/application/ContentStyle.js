import { styled } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const ContentStyle = () => {
	return {
		TopContainer: styled("div")({
			display: "flex",
		}),
		SpinnerContainer: styled("div")({
			marginTop: 10,
		}),
		DetailsContainer: styled("div")({
			display: "flex",
		}),
		SearchContainer: styled("div")({
			display: "flex",
			width: "100%",
			marginTop: 10,
			alignItems: "center",
		}),
		SearchInner: styled("div")({
			marginLeft: "auto",
		}),
		SearchInput: styled(TextField)({
			width: 284,
		}),
	};
};

export default ContentStyle;
