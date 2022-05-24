import Typography from "@material-ui/core/Typography";
import CheckIcon from "@material-ui/icons/Check";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ArrowIcon from "assets/icons/arrowIcon.svg";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import ColourConstants from "helpers/colourConstants";
import useInfiniteScroll from "hooks/useDropdownInfiniteScroll";
import TableStyle from "styles/application/TableStyle";
import AddDialogStyle from "styles/application/AddDialogStyle";

import EMICheckbox from "./EMICheckbox";
import {
	DROPDOWN_LEFT_OFFSET,
	DROPDOWN_RIGHT_OFFSET,
	DROPDOWN_TOP_OFFSET,
} from "helpers/constants";
import ErrorMessageWithErrorIcon from "./ErrorMessageWithErrorIcon";

const ADD = AddDialogStyle();
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
		marginLeft: "auto",
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
		hasCheckBoxList,
		checklistChangeHandler,
		rolesChecklist,
		count,
		isReadOnly,
		showBorderColor,
		isError,
		fetchData,
		showErrorIcon = false,
		errorMessage = "",
		hasGroup,
		groupBy,
	} = props;
	const [dropActive, setDropActive] = useState(false);
	const [filteredList, setFilteredList] = useState([]);
	const [originalFilteredList, setOriginalFilteredList] = useState([]);
	const [searchtext, setsearchText] = useState("");
	const [currentTableSort, setCurrentTableSort] = useState(["name", "asc"]);
	const [dropdownlistner, setdropdownlistner] = useState(window);
	const [isLoading, setLoading] = useState(false);
	const [uniqueId] = useState(Math.random() * Date.now());
	const scrollRef = useRef(true);
	const focusRef = useRef(false);

	useEffect(() => {
		setFilteredList(dataSource);
		setOriginalFilteredList(dataSource);

		if (isLoading) {
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataSource]);

	const handleOutsideClick = useCallback((event) => {
		let specifiedElement = document.getElementsByClassName(
			"dropdown-expand active"
		)[0];
		let dropbox = document.getElementsByClassName("dropbox active")[0];
		let isClickInside =
			specifiedElement?.contains(event.target) ||
			dropbox?.contains(event.target);
		let parentEl = document.getElementsByClassName("dropdown active")[0];
		if (!isClickInside) {
			//setDropActive(false);
			if (dropbox) dropbox.classList.remove("active");
			if (parentEl) parentEl.classList.remove("active");
			if (specifiedElement) {
				specifiedElement.classList.remove("active");

				specifiedElement.style.position = "fixed";
			}
			const dailogContent = document.getElementsByClassName(
				"MuiDialogContent-root"
			)[0];
			if (dailogContent) dailogContent.style.overflow = "auto";
		}
	}, []);

	const handleWindowScroll = () => {
		let specifiedElement = document.getElementsByClassName(
			"dropdown-expand active"
		)[0];
		if (specifiedElement) {
			//specifiedElement.style.left = `${DROPDOWN_LEFT_OFFSET}px`;
			if (
				window.innerWidth - specifiedElement.getBoundingClientRect().right <
				150
			) {
				specifiedElement.style.left = "unset";
				specifiedElement.style.right = `${DROPDOWN_RIGHT_OFFSET}px`;
			} else {
				specifiedElement.style.right = "unset";
				specifiedElement.style.left = `${DROPDOWN_LEFT_OFFSET}px`;
			}

			let parentEl = document.getElementsByClassName("dropdown active")[0];
			if (window.innerHeight - parentEl.getBoundingClientRect().bottom < 300) {
				specifiedElement.style.top = "unset";
				specifiedElement.style.bottom = `${DROPDOWN_TOP_OFFSET}px`;
			} else {
				specifiedElement.style.bottom = "unset";
				specifiedElement.style.top = `-${DROPDOWN_TOP_OFFSET}px`;
			}
			specifiedElement.style.position = "absolute";
		}
	};
	useEffect(() => {
		window.addEventListener("click", handleOutsideClick);
		window.addEventListener("scroll", handleWindowScroll);
		return () => {
			window.removeEventListener("click", handleOutsideClick);
			window.removeEventListener("scroll", handleWindowScroll);
		};
	}, [handleOutsideClick]);

	// scroll event of dropdown when mapped to DOM
	useEffect(() => {
		if (dropActive) {
			if (scrollRef.current === true) {
				document
					.getElementById(uniqueId)
					.addEventListener("scroll", (e) => handleScroll(e, uniqueId));
				setdropdownlistner(document.getElementById(uniqueId));
				scrollRef.current = false;
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dropActive]);

	const { hasMore, loading, gotoTop, handleScroll } = useInfiniteScroll(
		dataSource,
		count,
		async (pageSize, prevData) => await onPageChange(pageSize + 1, prevData),
		page,
		searchtext,
		dropdownlistner
	);

	// search
	const onFilter = async (val) => {
		setsearchText(val);
		setLoading(true);
		if (isServerSide) {
			// server side search
			await handleServierSideSearch(val);
		} else {
			// client side search
			if (val !== "") {
				const searchedList = originalFilteredList.filter((item) =>
					columns
						.map((i) => i.name)
						.some((col) => {
							return item[col].match(new RegExp(val, "gi"));
						})
				);
				setFilteredList(searchedList);
			} else {
				setFilteredList(originalFilteredList);
			}

			setLoading(false);
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

	const handleDrpdwnClick = (event) => {
		if (isReadOnly) return;
		removeActiveDropdown();
		let el = event.target.closest(".dropbox");
		if (el) el.classList.add("active");
		const parentEl = event.target.closest(".dropdown");
		if (parentEl) parentEl.classList.add("active");
		const dropdownExpandEl = parentEl.querySelector(".dropdown-expand");
		if (dropdownExpandEl) dropdownExpandEl.classList.add("active");
		focusRef.current.focus();
		setDropActive(true);

		// setDropUpward(
		// 	window.innerHeight - event.target.getBoundingClientRect().bottom < 300
		// 		? false
		// 		: true
		// );
		// setDropSideway(
		// 	window.innerWidth - event.target.getBoundingClientRect().right < 150
		// 		? false
		// 		: true
		// );
		if (dropdownExpandEl) {
			dropdownExpandEl.style.position = "fixed";
			const dropdownPos = parentEl?.getBoundingClientRect();
			dropdownExpandEl.style.bottom = "unset";
			dropdownExpandEl.style.top =
				window.innerHeight - el?.getBoundingClientRect().bottom < 300
					? `${
							dropdownPos.top -
							dropdownExpandEl.scrollHeight +
							DROPDOWN_TOP_OFFSET
					  }px`
					: `${dropdownPos.top - DROPDOWN_TOP_OFFSET}px`;

			if (
				parentEl.scrollWidth < dropdownExpandEl.scrollWidth &&
				window.innerWidth - el.getBoundingClientRect().right < 150
			) {
				const isScrollbarActive =
					document.body.scrollHeight > window.innerHeight;
				dropdownExpandEl.style.right = `${
					window.innerWidth -
					dropdownPos.right +
					(isScrollbarActive
						? DROPDOWN_RIGHT_OFFSET / 2
						: DROPDOWN_RIGHT_OFFSET)
				}px`;
			} else {
				dropdownExpandEl.style.left = `${
					dropdownPos.left + DROPDOWN_LEFT_OFFSET
				}px`;
			}
		}
		if (scrollRef.current === true) {
			document
				.getElementById(uniqueId)
				.addEventListener("scroll", (e) => handleScroll(e, uniqueId));
			setdropdownlistner(document.getElementById(uniqueId));
			scrollRef.current = false;
		}
		const dailogContent = document.getElementsByClassName(
			"MuiDialogContent-root"
		)[0];
		if (dailogContent) dailogContent.style.overflow = "visible";
	};

	const removeActiveDropdown = () => {
		let specifiedElement = document.getElementsByClassName(
			"dropdown-expand active"
		)[0];
		let dropbox = document.getElementsByClassName("dropbox active")[0];

		if (dropbox) dropbox.classList.remove("active");
		let parentEl = document.getElementsByClassName("dropdown active")[0];
		if (parentEl) parentEl.classList.remove("active");
		if (specifiedElement) specifiedElement.classList.remove("active");
	};

	// clear and reset dropdown content
	const handleClear = (e) => {
		if (isReadOnly) return;
		setCurrentTableSort(["name", "asc"]);
		onChange({});
		setsearchText("");
		setFilteredList(dataSource);
		onClear();
		e.stopPropagation();
	};

	const isValueSelected = () => {
		if (typeof selectedValue === "object") {
			return Boolean(selectedValue.name);
		}
		return Boolean(selectedValue);
	};

	const handleApiCall = async () => {
		// console.log("originalFilteredList", originalFilteredList);
		if (isReadOnly || originalFilteredList?.length !== 0) return;
		setLoading(true);
		try {
			const response = await fetchData();
			setFilteredList((prev) =>
				[
					...prev,
					...(Array.isArray(response?.data) ? response?.data ?? [] : []),
					...(dataSource ?? []),
				]
					.filter((x) => Boolean(x))
					.reduce((acc, current) => {
						const x = acc.find((item) => item.id === current.id);
						if (!x) {
							return acc.concat([current]);
						} else {
							return acc;
						}
					}, [])
			);
			setOriginalFilteredList((prev) =>
				[
					...prev,
					...(Array.isArray(response?.data) ? response?.data ?? [] : []),
					...(dataSource || []),
				]
					.filter((x) => Boolean(x))
					.reduce((acc, current) => {
						const x = acc.find((item) => item.id === current.id);
						if (!x) {
							return acc.concat([current]);
						} else {
							return acc;
						}
					}, [])
			);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			className="dropdown"
			style={
				disabled
					? { pointerEvents: "none", opacity: hasCheckBoxList ? "1" : "0.4" }
					: { width: width }
			}
		>
			<div
				className={`dropbox ${dropActive ? "active" : ""}`}
				style={{ width: "100%" }}
				onClick={(event) => {
					handleDrpdwnClick(event);
					handleApiCall();
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						fontFamily: "Roboto Condensed",
						fontWeight: "bold",
						fontSize: "14px",
					}}
				>
					<div className="caption-label">
						<Typography className="label">
							<span>
								{label}
								{required && <span className="required">*</span>}
							</span>
							{showErrorIcon && (
								<ErrorMessageWithErrorIcon message={errorMessage} />
							)}
						</Typography>
					</div>

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

				<div
					className={clsx({
						"inputbox flex justify-between": true,
						"icon-box": icon,
						error: isError,
					})}
					style={{
						border:
							showBorderColor && isValueSelected()
								? "2px solid rgb(48, 122, 215)"
								: "0.9px solid #b9b9b9",
					}}
				>
					<span className="flex" style={{ gap: "10px" }}>
						{icon && icon}
						{hasCheckBoxList ? (
							selectedValue ? (
								selectedValue
							) : (
								<em style={{ opacity: "0.7" }}>{placeholder}</em>
							)
						) : selectedValue && selectedValue[selectdValueToshow] ? (
							selectedValue[selectdValueToshow]
						) : (
							<em style={{ opacity: "0.7" }}>{placeholder}</em>
						)}
					</span>
					<img alt="Expand icon" src={ArrowIcon} className="arrow-down" />
				</div>
			</div>
			{/* {dropActive && ( */}
			<div
				className={clsx({
					"dropdown-expand": true,
					// active: dropActive,
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
							id="dynamic-dropdown-search-input"
							ref={focusRef}
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
					<div className="dynamic-drop-list" id={uniqueId}>
						{isLoading ? null : filteredList?.length > 0 ? (
							<>
								{hasCheckBoxList
									? filteredList?.map((list) => (
											<div className="checklist-item flex" key={list?.id}>
												{columns.map((col) => (
													<ADD.CheckboxLabel key={col?.id}>
														<EMICheckbox
															state={
																rolesChecklist.filter((r) => r.id === list.id)
																	.length === 1
															}
															changeHandler={() => {
																checklistChangeHandler(list.id, list[col.name]);
																// removeActiveDropdown();
																// setDropActive(false);
															}}
															disabled={disabled}
														/>
														{list[col.name]}
													</ADD.CheckboxLabel>
												))}
											</div>
									  ))
									: hasGroup
									? groupBy.map((group) => {
											return (
												<div key={group.id} style={{}}>
													<div
														style={{
															padding: "15px 10px 15px 5px",
															backgroundColor: "#D8D8D8",
															cursor: "pointer",
														}}
														onClick={() => {
															onChange(group);
															setDropActive(false);
															removeActiveDropdown();
														}}
													>
														<span
															style={{
																marginLeft: 5,
																fontWeight: "500",
																display: "flex",
																alignItems: "center",
																gap: "5px",
																color:
																	group.id === selectedValue.id
																		? "rgb(35, 187, 121)"
																		: "",
															}}
														>
															{group.id === selectedValue.id && (
																<CheckIcon className="check mr-sm" />
															)}
															{group.name}
														</span>
													</div>
													{filteredList
														?.filter((x) => x.groupBy === group.name)
														?.map((list) => (
															<div
																className={
																	"list-item flex " +
																	(list.id === selectedValue.id
																		? "selected"
																		: "")
																}
																style={{ paddingLeft: "10px" }}
																key={list.id}
																onClick={() => {
																	onChange(list);
																	setDropActive(false);
																	removeActiveDropdown();
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
																		{i === 0 && (
																			<CheckIcon className="check mr-sm" />
																		)}
																		{list[col.name]}
																	</span>
																))}
															</div>
														))}
												</div>
											);
									  })
									: filteredList?.map((list) => (
											<div
												className={
													"list-item flex " +
													(list.id === selectedValue.id ? "selected" : "")
												}
												key={list.id}
												onClick={() => {
													onChange(list);
													setDropActive(false);
													removeActiveDropdown();
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
									  ))}
							</>
						) : !isLoading ? (
							<span className="no-record">No records found</span>
						) : (
							""
						)}
						{/* scroll to load */}
						{loading || isLoading ? (
							<div style={{ padding: "16px 10px" }}>
								<b>Loading...</b>
							</div>
						) : (
							""
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
			{/* )} */}
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
	isReadOnly: false,
	onClear: () => {},
	handleServierSideSearch: () => {},
	handleServerSideSort: () => {},
	onPageChange: () => {},
	fetchData: () => {},
	showBorderColor: false,
};

DyanamicDropdown.propTypes = {
	width: PropTypes.string,
	dataSource: PropTypes.array,
	selectedValue: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
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
	isReadOnly: PropTypes.bool,
	showClear: PropTypes.bool,
	icon: PropTypes.node,
	isServerSide: PropTypes.bool,
	selectdValueToshow: PropTypes.string,
	onClear: PropTypes.func,
	handleServierSideSearch: PropTypes.func,
	handleServerSideSort: PropTypes.func,
	onPageChange: PropTypes.func,
	showBorderColor: PropTypes.bool,
	fetchData: PropTypes.func,
};
