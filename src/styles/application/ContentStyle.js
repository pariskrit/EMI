import { styled } from "@mui/styles";
import TextField from "@mui/material/TextField";

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
		SearchContainerMobile: styled("div")({
			width: "100%",
			marginTop: 10,
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
