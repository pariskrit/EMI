import Typography from "@mui/material/Typography";
import CheckIcon from "@mui/icons-material/Check";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import ArrowIcon from "assets/icons/arrowIcon.svg";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
//
import { makeStyles } from "tss-react/mui";
import {
	DROPDOWN_LEFT_OFFSET,
	DROPDOWN_RIGHT_OFFSET,
	DROPDOWN_TOP_OFFSET,
} from "helpers/constants";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";

function Dropdown(props) {
	const {
		width,
		selectedValue,
		options,
		onChange,
		placeholder,
		label,
		isError,
		required,
		fetchData = () => {},
		disabled = false,
		isReadOnly = false,
	} = props;
	const [filteredList, setFilteredList] = useState([]);
	const [originalFilteredList, setOriginalFilteredList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const focusRef = useRef(false);
	const [mouseDown, setMouseDown] = useState(false);
	const [dropActive, setDropActive] = useState(false);
	const dispatch = useDispatch();
	const useStyles = makeStyles()((theme) => ({}));
	const { cx } = useStyles();
	useEffect(() => {
		setFilteredList(options);
		setOriginalFilteredList(options);
	}, [options]);

	useEffect(() => {
		window.addEventListener("click", handleOutsideClick);
		window.addEventListener("scroll", handleWindowScroll);
		const dailogContent = document.getElementsByClassName(
			"MuiDialogContent-root"
		)[0];
		if (dailogContent) {
			dailogContent.addEventListener("scroll", handleWindowScroll);
		}
		const tableWrapper = document.getElementById(
			"table-scroll-wrapper-container"
		);
		if (tableWrapper) {
			tableWrapper.addEventListener("scroll", handleWindowScroll);
		}
		return () => {
			window.removeEventListener("click", handleOutsideClick);
			window.removeEventListener("scroll", handleWindowScroll);
			if (dailogContent) {
				dailogContent.removeEventListener("scroll", handleWindowScroll);
			}
			if (tableWrapper) {
				tableWrapper.addEventListener("scroll", handleWindowScroll);
			}
		};
	}, []);

	const handleOutsideClick = (event) => {
		let specifiedElement = document.getElementsByClassName(
			"dropdown-expand active"
		)[0];
		let dropbox = document.getElementsByClassName("dropbox active")[0];
		let isClickInside =
			specifiedElement?.contains(event?.target) ||
			dropbox?.contains(event?.target);
		let parentEl = document.getElementsByClassName("dropdown active")[0];
		if (!isClickInside) {
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
			setDropActive(false);
		}
	};

	const handleWindowScroll = () => {
		let specifiedElement = document.getElementsByClassName(
			"dropdown-expand active"
		)[0];
		if (specifiedElement) {
			if (
				window.innerWidth - specifiedElement.getBoundingClientRect().right <
				50
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
	const onFilter = (val) => {
		let filteredSearchList = [];
		originalFilteredList &&
			originalFilteredList.map((x) => {
				if (x.label.toLowerCase().includes(val.toLowerCase()))
					filteredSearchList.push(x);
				return x;
			});
		setFilteredList(filteredSearchList);
	};
	const handleDrpdwnClick = (event) => {
		removeActiveDropdown();
		let el = event.target.closest(".dropbox");
		if (el) el.classList.add("active");
		const parentEl = event.target.closest(".dropdown");
		if (parentEl) parentEl.classList.add("active");
		const dropdownExpandEl = parentEl.querySelector(".dropdown-expand");
		if (dropdownExpandEl) dropdownExpandEl.classList.add("active");
		setDropActive(true);
		focusRef.current.focus();

		onFilter("");

		if (dropdownExpandEl) {
			dropdownExpandEl.style.position = "fixed";
			const dropdownPos = parentEl?.getBoundingClientRect();
			dropdownExpandEl.style.bottom = "unset";
			dropdownExpandEl.style.top =
				window.innerHeight - el?.getBoundingClientRect().bottom < 300
					? `${dropdownPos.top - dropdownExpandEl.scrollHeight + 53}px`
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

		setDropActive(false);
	};

	const handleApiCall = async () => {
		setIsLoading(true);
		try {
			const response = await fetchData();
			setFilteredList(
				response?.data?.map((x) => ({
					label: x?.name,
					value: x?.id,
				}))
			);
			setOriginalFilteredList(
				response?.data?.map((x) => ({
					label: x?.name,
					value: x?.id,
				}))
			);
		} catch (error) {
			dispatch(showError(`Failed to fetch data.`));
		} finally {
			setIsLoading(false);
		}
	};

	const handleMouseDown = (event) => {
		setMouseDown(true);
	};

	useEffect(() => {
		let active = null;
		// Get the Selected Dropdown Item Element, if any, when dropdown opens
		if (dropActive && !isLoading) {
			active = document.querySelector(".dropdown-expand.active   .selected");
			document.addEventListener("keydown", onKeyPress);
		}

		function onKeyPress(event) {
			// Store the selected dropdown item or hovering dropdown item on every keypress. Required for changing the hovering item when pressing up or down.
			const onHoverPresent =
				active ??
				document.querySelector(".dropdown-expand.active   .hoverOver");

			// If no selected item or hovering item present then set hover state to the first element
			if (!onHoverPresent) {
				const firstChildElement = document.querySelector(
					".dropdown-expand.active  .drop-list"
				)?.firstChild;
				active = firstChildElement;
				active?.classList && active.classList.add("hoverOver");
			}

			// If hover state present then change hover state on up and down key.
			if (active && onHoverPresent) {
				active?.classList && active.classList.remove("hoverOver");
				if (event.keyCode === 40) {
					active = active.nextElementSibling || active;

					active.scrollIntoView({
						behavior: "smooth",
						block: "end",
					});
				} else if (event.keyCode === 38) {
					active = active.previousElementSibling || active;
					active.scrollIntoView({
						behavior: "smooth",
						block: "end",
					});
				} else if (event.keyCode === 13) {
					if (active.classList.contains("list-item")) {
						active.click();
					}
					return;
				}

				active?.classList && active.classList.add("hoverOver");
			}

			setMouseDown(false);
		}

		const onTabPress = (e) => {
			if (e.keyCode === 9) {
				setMouseDown(false);
			}
		};

		document.addEventListener("keydown", onTabPress);
		document.addEventListener("mousedown", handleMouseDown);

		return () => {
			document.removeEventListener("keydown", onKeyPress);
			document.removeEventListener("keydown", onTabPress);
			document.removeEventListener("mousedown", handleMouseDown);

			active?.classList && active.classList.remove("hoverOver");
		};
	}, [dropActive, isLoading]);
	return (
		<div
			className="dropdown"
			style={disabled ? { pointerEvents: "none", opacity: "0.4" } : {}}
		>
			<div
				className="dropbox"
				onClick={
					isReadOnly
						? null
						: async (event) => {
								handleDrpdwnClick(event);
								!isReadOnly &&
									originalFilteredList?.length === 0 &&
									(await handleApiCall());
						  }
				}
			>
				{label.length > 0 && (
					<Typography className="label">
						{label}
						{required && <span className="required">*</span>}
					</Typography>
				)}

				<div
					className={cx("inputbox flex justify-between", [isError && "error"])}
					style={{ width }}
					tabIndex={0}
					onFocus={
						isReadOnly
							? null
							: async (event) => {
									if (!mouseDown) {
										handleDrpdwnClick(event);
										!isReadOnly &&
											originalFilteredList?.length === 0 &&
											(await handleApiCall());
									}
							  }
					}
				>
					<span>
						{selectedValue && selectedValue.label ? (
							selectedValue.label
						) : (
							<em style={{ opacity: "0.7" }}>{placeholder}</em>
						)}
					</span>
					<img alt="Expand icon" src={ArrowIcon} className="arrow-down" />
				</div>
			</div>
			{/* {dropActive && ( */}
			<div
				className={cx({
					"dropdown-expand": true,
					//active: dropActive,
				})}
				onBlur={() => {
					if (!mouseDown) {
						removeActiveDropdown();
					}
					return;
				}}
				tabIndex={"0"}
				role="button"
			>
				<div className="search-box flex justify-between">
					<div className="input-field flex">
						<SearchIcon style={{ width: "20px" }} />
						<input
							type="text"
							className="search-box__text"
							placeholder="Search"
							onChange={(e) => onFilter(e.target.value)}
							id="dropdown-search-input"
							ref={focusRef}
							autoComplete={"off"}
						/>
					</div>

					<img alt="Expand icon" src={ArrowIcon} className="arrow-down" />
				</div>
				<div className="drop-list">
					{filteredList?.length > 0 ? (
						filteredList?.map((list) => (
							<div
								className={
									"list-item flex " +
									(list.value === selectedValue?.value ? "selected" : "")
								}
								key={list.value}
								onClick={() => {
									onChange(list);
									setDropActive(false);

									removeActiveDropdown();
								}}
							>
								<CheckIcon className="check mr-sm" />
								<span>{list.label}</span>
							</div>
						))
					) : isLoading ? (
						""
					) : (
						<span className="no-record">No records found</span>
					)}

					{isLoading && (
						<div style={{ padding: "16px 10px" }}>
							<b>Loading...</b>
						</div>
					)}
				</div>
			</div>
			{/* )} */}
		</div>
	);
}

export default Dropdown;
Dropdown.defaultProps = {
	width: "300px",
	options: [],
	selectedValue: {},
	onChange: () => {},
	placeholder: "Select Item",
	label: "",
	required: false,
	isError: false,
};

Dropdown.propTypes = {
	width: PropTypes.string,
	options: PropTypes.array,
	selectedValue: PropTypes.object,
	onChange: PropTypes.func,
	placeholder: PropTypes.string,
	hasLabel: PropTypes.bool,
	label: PropTypes.string,
	required: PropTypes.bool,
	isError: PropTypes.bool,
};
