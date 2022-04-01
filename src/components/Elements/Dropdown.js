import Typography from "@material-ui/core/Typography";
import CheckIcon from "@material-ui/icons/Check";
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import ArrowIcon from "assets/icons/arrowIcon.svg";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import clsx from "clsx";
import {
	DROPDOWN_LEFT_OFFSET,
	DROPDOWN_RIGHT_OFFSET,
	DROPDOWN_TOP_OFFSET,
} from "helpers/constants";

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

	useEffect(() => {
		setFilteredList(options);
		setOriginalFilteredList(options);
	}, [options]);

	useEffect(() => {
		window.addEventListener("click", handleOutsideClick);
		window.addEventListener("scroll", handleWindowScroll);
		return () => {
			window.removeEventListener("click", handleOutsideClick);
			window.removeEventListener("scroll", handleWindowScroll);
		};
	}, []);

	const handleOutsideClick = (event) => {
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
		}
	};

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
	const onFilter = (val) => {
		let filteredSearchList = [];
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
		//setDropActive(true);
		focusRef.current.focus();

		onFilter("");

		// setDropUpward(
		// 	window.innerHeight - el.getBoundingClientRect().bottom < 300
		// 		? false
		// 		: true
		// );
		// setDropSideway(
		// 	window.innerWidth - el.getBoundingClientRect().right < 150 ? false : true
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
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};
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
						: (event) => {
								handleDrpdwnClick(event);
								!isReadOnly &&
									originalFilteredList.length === 0 &&
									handleApiCall();
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
					className={clsx("inputbox flex justify-between", [
						isError && "error",
					])}
					style={{ width }}
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
				className={clsx({
					"dropdown-expand": true,
					//active: dropActive,
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
							id="dropdown-search-input"
							ref={focusRef}
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
