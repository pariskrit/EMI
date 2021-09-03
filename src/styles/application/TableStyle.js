import { styled } from "@material-ui/core/styles";
import ColourConstants from "../../helpers/colourConstants";
import TableContainer from "@material-ui/core/TableContainer";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import Typography from "@material-ui/core/Typography";
import { ReactComponent as ArrowIcon } from "../../assets/icons/Arrow-nocolour.svg";
import IconButton from "@material-ui/core/IconButton";

// Constants
const MAX_ROW_HEIGHT = 51;

const TableStyle = () => {
	return {
		TableContainer: styled(TableContainer)({
			borderStyle: "solid",
			fontFamily: "Roboto Condensed",
			fontSize: 14,
			borderColor: ColourConstants.tableBorder,
			borderWidth: 1,
			borderRadius: 0,
			["@media (max-width: 414px)"]: {
				maxWidth: "87vw",
				overflowX: "auto",
			},
		}),
		TableHead: styled(TableHead)({
			userSelect: "none",
			["@media (max-width: 414px)"]: {
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
