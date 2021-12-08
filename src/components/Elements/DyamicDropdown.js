import Typography from "@material-ui/core/Typography";
import CheckIcon from "@material-ui/icons/Check";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import ArrowIcon from "assets/icons/arrowIcon.svg";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import ColourConstants from "helpers/colourConstants";
import useInfiniteScroll from "hooks/useInfiniteScroll";
import TableStyle from "styles/application/TableStyle";

const AT = TableStyle();

const media = "@media (max-width: 414px)";

const useStyles = makeStyles({
	tableHeadRow: {
		borderBottomColor: ColourConstants.tableBorder,
		borderBottomStyle: "solid",
		borderBottomWidth: 1,
		backgroundColor: ColourConstants.tableBackground,
		fontWeight: "bold",
		borderRightColor: "#979797",
		borderRightStyle: "solid",
		borderRightWidth: "1px",
	},
	tableBody: {
		whiteSpace: "noWrap",
	},
	selectedTableHeadRow: {
		borderBottomColor: ColourConstants.tableBorder,
		borderBottomStyle: "solid",
		borderBottomWidth: 1,
		backgroundColor: ColourConstants.tableBackgroundSelected,
		fontWeight: "bold",
		color: "#FFFFFF",
	},
	nameRow: {
		minWidth: 130,
		padding: "15px",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",

		[media]: {
			width: 130,
		},
		flexGrow: "1",
		cursor: "pointer",
	},
	header: {
		display: "flex",
		width: "100%",
	},
	clear: {
		cursor: "pointer",
	},
	droplistitem: {
		maxWidth: "130px",
	},
});

function DyanamicDropdown(props) {
	const classes = useStyles();
	const {
		width,
		selectedValue,
		selectdValueToshow,
		dataSource,
		columns,
		dataHeader,
		showHeader,
		onChange,
		placeholder,
		label,
		required,
		disabled = false,
		page,
		onPageChange,
		handleSort,
		handleServerSideSort,
		isServerSide,
		showClear,
		onClear,
		handleServierSideSearch,
		icon,
	} = props;
	const [dropActive, setDropActive] = useState(false);
	const [filteredList, setFilteredList] = useState([]);
	const [dropUpward, setDropUpward] = useState(true);
	const [searchtext, setsearchText] = useState("");
	const [currentTableSort, setCurrentTableSort] = useState(["name", "asc"]);
	const [dropdownlistner, setdropdownlistner] = useState(window);
	const scrollRef = useRef(true);

	useEffect(() => {
		setFilteredList(dataSource);
	}, [dataSource]);

	useEffect(() => {
		window.addEventListener("click", handleOutsideClick);
		return () => {
			window.removeEventListener("click", handleOutsideClick);
		};
	}, []);

	useEffect(() => {
		if (dropActive) {
			if (scrollRef.current === true) {
				document
					.getElementsByClassName("dropdown-expand")[0]
					.addEventListener("scroll", handleScroll);
				setdropdownlistner(
					document.getElementsByClassName("dropdown-expand")[0]
				);
				scrollRef.current = false;
			}
		}
	}, [dropActive]);

	const { hasMore, loading, gotoTop, handleScroll } = useInfiniteScroll(
		dataSource,
		17,
		async (pageSize, prevData) => await onPageChange(pageSize + 1, prevData),
		page,
		searchtext,
		dropdownlistner
	);

	const handleOutsideClick = (event) => {
		let specifiedElement = document.getElementsByClassName(
			"dropdown-expand active"
		)[0];
		let dropbox = document.getElementsByClassName("dropbox active")[0];
		let isClickInside =
			specifiedElement?.contains(event.target) ||
			dropbox?.contains(event.target);
		if (!isClickInside) {
			setDropActive(false);
		}
	};

	const onFilter = (val) => {
		if (isServerSide) {
			handleServierSideSearch(val);
		} else {
			setsearchText(val);
		}
	};
	const handleDrpdwnClick = (event) => {
		setDropActive(true);
		setDropUpward(
			window.innerHeight - event.target.getBoundingClientRect().bottom < 120
				? false
				: true
		);
	};

	// Handlers
	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod = currentTableSort[1] === "asc" ? "desc" : "asc";
		if (isServerSide) {
			handleServerSideSort(field, newMethod);
		} else {
			handleSort(filteredList, setFilteredList, field, newMethod);
		}

		// Updating header state
		setCurrentTableSort([field, newMethod]);
	};

	return (
		<div
			className="dropdown"
			style={disabled ? { pointerEvents: "none", opacity: "0.4" } : {}}
		>
			<div
				className={`dropbox ${dropActive ? "active" : ""}`}
				onClick={(event) => handleDrpdwnClick(event)}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						padding: "0 14px",
						width: width,
					}}
				>
					{label.length > 0 && (
						<Typography className="label">
							{label}
							{required && <span className="required">*</span>}
						</Typography>
					)}
					{showClear && (
						<Typography
							className={clsx("label", classes.clear)}
							onClick={onClear}
							style={{ color: "red" }}
						>
							Clear
						</Typography>
					)}
				</div>

				<div className="inputbox flex justify-between" style={{ width }}>
					<span className="flex">
						{icon && icon}
						{required && <span className="required">*</span>}
						{selectedValue && selectedValue[selectdValueToshow]
							? selectedValue[selectdValueToshow]
							: placeholder}
					</span>
					<img alt="Expand icon" src={ArrowIcon} className="arrow-down" />
				</div>
			</div>
			{dropActive && (
				<div
					id="dropdown-expand-id"
					className={clsx({
						"dropdown-expand": true,
						active: dropActive,
						upward: dropUpward,
						downward: !dropUpward,
					})}
				>
					<div className="search-box flex justify-between">
						<div className="input-field flex">
							<SearchIcon style={{ width: "20px" }} />
							<input
								type="text"
								className="search-box__text"
								placeholder="Search"
								onChange={(e) => onFilter(e.target.value)}
							/>
						</div>

						<img alt="Expand icon" src={ArrowIcon} className="arrow-down" />
					</div>
					{showHeader && (
						<div className={classes.header}>
							{dataHeader.map((header, i) => (
								<div
									key={header}
									onClick={() => {
										handleSortClick(columns[i]);
									}}
									className={clsx(classes.nameRow, classes.tableHeadRow, {
										[classes.selectedTableHeadRow]:
											currentTableSort[0] === columns[i],
										[classes.tableHeadRow]: currentTableSort[0] !== columns[i],
									})}
								>
									<span>{header}</span>
									{currentTableSort[0] === columns[i] &&
									currentTableSort[1] === "desc" ? (
										<AT.DefaultArrow fill="#FFFFFF" />
									) : (
										<AT.DescArrow fill="#FFFFFF" />
									)}
								</div>
							))}
						</div>
					)}
					<div className="drop-list">
						{filteredList.length > 0 ? (
							filteredList?.map((list) => (
								<div
									className={
										"list-item flex " +
										(list.id === selectedValue.id ? "selected" : "")
									}
									key={list.id}
									onClick={() => {
										onChange(list);
										setDropActive(false);
									}}
								>
									<CheckIcon className="check mr-sm" />
									{columns.map((col, i) => (
										<span
											style={{ flexGrow: "1" }}
											className={classes.droplistitem}
											key={i}
										>
											{list[col]}
										</span>
									))}
								</div>
							))
						) : (
							<span className="no-record">No records found</span>
						)}
						{/* scroll to load */}
						{loading && (
							<div style={{ padding: "16px 10px" }}>
								<b>Loading...</b>
							</div>
						)}

						{!hasMore && (
							<div
								style={{ textAlign: "center", padding: "16px 10px" }}
								className="flex justify-center"
							>
								<b>Yay! You have seen it all</b>
								<span
									className="link-color ml-md cursor-pointer"
									onClick={() => gotoTop()}
								>
									Go to top
								</span>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default DyanamicDropdown;
DyanamicDropdown.defaultProps = {
	width: "300px",
	dataSource: [],
	selectedValue: {},
	onChange: () => {},
	placeholder: "Select Item",
	label: "",
	dataHeader: [],
	columns: [],
	required: false,
	showHeader: false,
};

DyanamicDropdown.propTypes = {
	width: PropTypes.string,
	dataSource: PropTypes.array,
	selectedValue: PropTypes.object,
	onChange: PropTypes.func,
	placeholder: PropTypes.string,
	hasLabel: PropTypes.bool,
	label: PropTypes.string,
	dataHeader: PropTypes.array,
	required: PropTypes.bool,
	showHeader: PropTypes.bool,
	columns: PropTypes.array,
};
