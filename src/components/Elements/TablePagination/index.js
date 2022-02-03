import React from "react";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

const useStyles = makeStyles({
	main: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		background: "#d2d2d9",
		padding: "0 10px",
		fontFamily: "Roboto Condensed",
		fontSize: "14px",
	},
});
const TablePagination = (props) => {
	const classes = useStyles();
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
					{page}-{rowsPerPage}
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
