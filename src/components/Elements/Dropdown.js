import Typography from "@material-ui/core/Typography";
import CheckIcon from "@material-ui/icons/Check";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import ArrowIcon from "assets/icons/arrowIcon.svg";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";

function Dropdown(props) {
	const {
		width,
		selectedValue,
		options,
		onChange,
		placeholder,
		label,
		required,
		disabled = false,
	} = props;
	const [dropActive, setDropActive] = useState(false);
	const [filteredList, setFilteredList] = useState([]);

	useEffect(() => {
		setFilteredList(options);
	}, [options]);

	useEffect(() => {
		window.addEventListener("click", handleOutsideClick);
		return () => {
			window.removeEventListener("click", handleOutsideClick);
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
		if (!isClickInside) {
			setDropActive(false);
		}
	};
	const onFilter = (val) => {
		let filteredSearchList = [];
		options.map((x) => {
			if (x.label.toLowerCase().includes(val.toLowerCase()))
				filteredSearchList.push(x);
			return x;
		});
		setFilteredList(filteredSearchList);
	};
	return (
		<div
			className="dropdown"
			style={disabled ? { pointerEvents: "none", opacity: "0.4" } : {}}
		>
			<div
				className={`dropbox ${dropActive ? "active" : ""}`}
				onClick={() => {
					setDropActive(true);
					onFilter("");
				}}
			>
				{label.length > 0 && (
					<Typography className="label">
						{label}
						{required && <span className="required">*</span>}
					</Typography>
				)}

				<div className="inputbox flex justify-between" style={{ width }}>
					<span>
						{selectedValue && selectedValue.label
							? selectedValue.label
							: placeholder}
					</span>
					<img alt="Expand icon" src={ArrowIcon} className="arrow-down" />
				</div>
			</div>
			{dropActive && (
				<div className={`dropdown-expand ${dropActive ? "active" : ""}`}>
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
					<div className="drop-list">
						{filteredList.length > 0 ? (
							filteredList?.map((list) => (
								<div
									className={
										"list-item flex " +
										(list.value === selectedValue.value ? "selected" : "")
									}
									key={list.value}
									onClick={() => {
										onChange(list);
										setDropActive(false);
									}}
								>
									<CheckIcon className="check mr-sm" />
									<span>{list.label}</span>
								</div>
							))
						) : (
							<span className="no-record">No records found</span>
						)}
					</div>
				</div>
			)}
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
	label: "Label",
	required: false,
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
};
