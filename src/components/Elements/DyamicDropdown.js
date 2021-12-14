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
		borderTopColor: ColourConstants.tableBorder,
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
		minWidth: "150px",
		width: "100%",
		// maxWidth: "250px",
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
		// maxWidth: "250px",
		minWidth: "150px",
		width: "100%",

		overflow: "hidden",
		wordBreak: "break-word",
		padding: "0 15px",
	},
	firstdroplistItem: {
		display: "flex",
		alignItems: "center",
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
		disabled,
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

	// scroll event of dropdown when mapped to DOM
	useEffect(() => {
		if (dropActive) {
			if (scrollRef.current === true) {
				document
					.getElementsByClassName("dropdown-content")[0]
					.addEventListener("scroll", handleScroll);
				setdropdownlistner(
					document.getElementsByClassName("dropdown-content")[0]
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

	// search
	const onFilter = (val) => {
		setsearchText(val);
		if (isServerSide) {
			// server side search
			handleServierSideSearch(val);
		} else {
			// client side search
			if (val !== "") {
				const searchedList = dataSource.filter((item) =>
					columns
						.map((i) => i.name)
						.some((col) => {
							return item[col].match(new RegExp(val, "gi"));
						})
				);
				setFilteredList(searchedList);
			} else {
				setFilteredList(dataSource);
			}
		}
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

	const handleDrpdwnClick = (event) => {
		setDropActive(true);
		setDropUpward(
			window.innerHeight - event.target.getBoundingClientRect().bottom < 120
				? false
				: true
		);
	};

	// clear and reset dropdown content
	const handleClear = (e) => {
		setCurrentTableSort(["name", "asc"]);
		onChange({});
		setsearchText("");
		setFilteredList(dataSource);
		onClear();
		e.stopPropagation();
	};

	return (
		<div
			className="dropdown"
			style={disabled ? { pointerEvents: "none", opacity: "0.4" } : {}}
		>
			<div
				className={`dropbox ${dropActive ? "active" : ""}`}
				style={{ width }}
				onClick={(event) => handleDrpdwnClick(event)}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
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
							onClick={handleClear}
							style={{ color: "#E31212", textAlign: "right" }}
						>
							Clear
						</Typography>
					)}
				</div>

				<div className="inputbox flex justify-between">
					<span className="flex" style={{ gap: "10px" }}>
						{icon && icon}
						{selectedValue && selectedValue[selectdValueToshow]
							? selectedValue[selectdValueToshow]
							: placeholder}
					</span>
					<img alt="Expand icon" src={ArrowIcon} className="arrow-down" />
				</div>
			</div>
			{dropActive && (
				<div
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
					<div className="dropdown-content">
						{showHeader && (
							<div className={classes.header}>
								{dataHeader.map((header, i) => (
									<div
										key={header.id}
										onClick={() => {
											handleSortClick(columns[i].name);
										}}
										className={clsx(classes.nameRow, classes.tableHeadRow, {
											[classes.selectedTableHeadRow]:
												currentTableSort[0] === columns[i].name,
											[classes.tableHeadRow]:
												currentTableSort[0] !== columns[i].name,
										})}
										style={{
											minWidth: header.minWidth || "150px",
										}}
									>
										<span>{header.name}</span>
										<div className="arrow">
											<AT.DescArrow
												fill={
													currentTableSort[0] === columns[i].name &&
													currentTableSort[1] === "asc"
														? "#D2D2D9"
														: "#F9F9FC"
												}
												className="arrowUp"
											/>
											<AT.DefaultArrow
												fill={
													currentTableSort[0] === columns[i].name &&
													currentTableSort[1] === "desc"
														? "#D2D2D9"
														: "#F9F9FC"
												}
												className="arrowDown"
											/>
										</div>
									</div>
								))}
							</div>
						)}
						<div className="dynamic-drop-list">
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
										{columns.map((col, i) => (
											<span
												style={{
													flexGrow: "1",
													minWidth: col.minWidth || "150px",
												}}
												className={clsx(classes.droplistitem, {
													[classes.firstdroplistItem]: i === 0,
												})}
												key={i}
											>
												{i === 0 && <CheckIcon className="check mr-sm" />}
												{list[col.name]}
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
	disabled: false,
	placeholder: "Select Item",
	label: "",
	dataHeader: [],
	page: 10,
	columns: [],
	required: false,
	showHeader: false,
	showClear: false,
	isServerSide: false,
	selectdValueToshow: "",
	onClear: () => {},
	handleServierSideSearch: () => {},
	handleServerSideSort: () => {},
	onPageChange: () => {},
};

DyanamicDropdown.propTypes = {
	width: PropTypes.string,
	dataSource: PropTypes.array,
	selectedValue: PropTypes.object,
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
	placeholder: PropTypes.string,
	hasLabel: PropTypes.bool,
	label: PropTypes.string,
	page: PropTypes.number,
	dataHeader: PropTypes.array,
	required: PropTypes.bool,
	showHeader: PropTypes.bool,
	columns: PropTypes.array,
	showClear: PropTypes.bool,
	icon: PropTypes.node,
	isServerSide: PropTypes.bool,
	selectdValueToshow: PropTypes.string,
	onClear: PropTypes.func,
	handleServierSideSearch: PropTypes.func,
	handleServerSideSort: PropTypes.func,
	onPageChange: PropTypes.func,
};