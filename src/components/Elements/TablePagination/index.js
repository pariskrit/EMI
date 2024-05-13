import React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/styles";
import { makeStyles } from "tss-react/mui";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

const useStyles = makeStyles()((theme) => ({
	main: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		background: "#d2d2d9",
		padding: "0 10px",
		fontFamily: "Roboto Condensed",
		fontSize: "14px",
	},
}));
const TablePagination = (props) => {
	const { classes, cx } = useStyles();
	const theme = useTheme();
	const { page, rowsPerPage, onPageChange, count, title } = props;
	const handleFirstPageButtonClick = () => {
		onPageChange(1);
	};

	const handleBackButtonClick = () => {
		onPageChange(page - 1);
	};

	const handleNextButtonClick = () => {
		onPageChange(page + 1);
	};

	const handleLastPageButtonClick = () => {
		onPageChange(Math.max(0, Math.ceil(count / rowsPerPage) - 1) + 1);
	};

	return (
		<div className={classes.main}>
			<div>
				{title}{" "}
				<b>
					{page}-{Math.ceil(count / rowsPerPage)}
				</b>{" "}
				of <b>{count}</b>
			</div>
			<div>
				<IconButton
					aria-label="first page"
					onClick={handleFirstPageButtonClick}
					disabled={page === 1}
				>
					{theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
				</IconButton>
				<IconButton
					aria-label="previous page"
					onClick={handleBackButtonClick}
					disabled={page === 1}
				>
					{theme.direction === "rtl" ? (
						<KeyboardArrowRight />
					) : (
						<KeyboardArrowLeft />
					)}
				</IconButton>
				<IconButton
					aria-label="next page"
					onClick={handleNextButtonClick}
					disabled={page >= Math.ceil(count / rowsPerPage)}
				>
					{theme.direction === "rtl" ? (
						<KeyboardArrowLeft />
					) : (
						<KeyboardArrowRight />
					)}
				</IconButton>
				<IconButton
					aria-label="last page"
					onClick={handleLastPageButtonClick}
					disabled={page >= Math.ceil(count / rowsPerPage)}
				>
					{theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
				</IconButton>
			</div>
		</div>
	);
};

TablePagination.defaultProps = {
	page: 1,
	rowsPerPage: 12,
	onPageChange: () => {},
	count: 100,
	title: "Default",
};

TablePagination.propTypes = {
	page: PropTypes.number,
	rowsPerPage: PropTypes.number,
	onPageChange: PropTypes.func,
	title: PropTypes.string,
};

export default TablePagination;
