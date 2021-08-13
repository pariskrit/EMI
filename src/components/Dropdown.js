import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CheckIcon from "@material-ui/icons/Check";
import ArrowIcon from "../assets/icons/arrowIcon.svg";
import { ReactComponent as SearchIcon } from "../assets/icons/search.svg";
import Typography from "@material-ui/core/Typography";

function Dropdown(props) {
	const {
		width,
		selectedValue,
		options,
		onChange,
		placeholder,
		label,
		required,
	} = props;
	const [dropActive, setDropActive] = useState(false);
	const [filteredList, setFilteredList] = useState([]);

	useEffect(() => {
		// document.addEventListener("click", function (event) {
		// 	let specifiedElement =
		// 		document.getElementsByClassName("dropdown-expand")[0];
		// 	let dropbox = document.getElementsByClassName("dropbox")[0];
		// 	let isClickInside =
		// 		specifiedElement?.contains(event.target) ||
		// 		dropbox?.contains(event.target);
		// 	if (!isClickInside) {
		// 		setDropActive(false);
		// 	}
		// });
		setFilteredList(options);
	}, [options]);

	const onFilter = (val) => {
		let filteredSearchList = [];
		options.map((x) => {
			if (x.label.toLowerCase().startsWith(val.toLowerCase()))
				filteredSearchList.push(x);
		});
		setFilteredList(filteredSearchList);
	};
	return (
		<div className="dropdown">
			<div className="dropbox" onClick={() => setDropActive(true)}>
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
					<img alt="Expand icon" src={ArrowIcon} className="arrow" />
				</div>
			</div>
			{dropActive && (
				<div className="dropdown-expand">
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

						<img alt="Expand icon" src={ArrowIcon} className="arrow" />
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
