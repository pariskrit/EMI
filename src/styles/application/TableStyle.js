import { styled } from "@mui/styles";
import ColourConstants from "helpers/colourConstants";
import TableContainer from "@mui/material/TableContainer";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import Typography from "@mui/material/Typography";
import { ReactComponent as ArrowIcon } from "assets/icons/Arrow-nocolour.svg";
import IconButton from "@mui/material/IconButton";

// Constants
const MAX_ROW_HEIGHT = 51;

const TableStyle = () => {
	const mediaMobile = "@media (max-width: 414px)";
	const mediaIpadpro = "@media (max-width: 1024px)";
	const mediaIpad = "@media (max-width: 768px)";

	return {
		TableContainer: styled(TableContainer)({
			borderStyle: "solid",
			fontFamily: "Roboto Condensed",
			fontSize: 14,
			overflowX: "auto",
			borderColor: ColourConstants.tableBorder,
			border: 1,
			borderRadius: 0,
			[mediaMobile]: {
				maxWidth: "87vw",
				overflowX: "auto",
			},
			[mediaIpadpro]: {
				maxWidth: "87vw",
				overflowX: "auto",
			},
			[mediaIpad]: {
				maxWidth: "85vw",
				overflowX: "auto",
			},
		}),
		TableHead: styled(TableHead)({
			userSelect: "none",
			[mediaMobile]: {
				whiteSpace: "nowrap",
			},
		}),
		CellContainer: styled("div")({
			display: "flex",
			alignItems: "center",
		}),
		TableBodyText: styled(Typography)({
			fontSize: 14,
			fontFamily: "Roboto Condensed",
			color: ColourConstants.commonText,
			display: "inline-flex",
		}),
		MiddleTableRow: styled(TableCell)({
			borderRightColor: ColourConstants.tableBorder,
			borderRightStyle: "solid",
			borderRightWidth: 1,
			borderLeftColor: ColourConstants.tableBorder,
			borderLeftStyle: "solid",
			borderLeftWidth: 1,
		}),
		DataCell: styled(TableCell)({
			height: MAX_ROW_HEIGHT,
			paddingTop: 5,
			paddingBottom: 5,
			paddingRight: 0,
		}),
		DotMenu: styled("div")({
			marginLeft: "auto",
			"&:hover": {
				cursor: "pointer",
			},
		}),
		TableMenuButton: styled(IconButton)({
			paddingLeft: 20,
			paddingRight: 20,
			marginRight: 3,
		}),
		DefaultArrow: styled(ArrowIcon)({
			marginLeft: "auto",
			transform: "scale(0.8)",
		}),
		DescArrow: styled(ArrowIcon)({
			marginLeft: "auto",
			transform: "scale(0.8) rotate(180deg)",
		}),
	};
};

export default TableStyle;
