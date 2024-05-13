import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { makeStyles } from "tss-react/mui";
import ContentStyle from "styles/application/ContentStyle";
import Grid from "@mui/material/Grid";

// Icon Import
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import TextField from "@mui/material/TextField";
import { debounce } from "helpers/utils";
import { DefectChipTypes } from "helpers/getDefectChipTypesCc";
const AC = ContentStyle();
const useStyles = makeStyles()((theme) => ({
	searchContainer: {
		display: "flex",
		width: "100%",
		marginTop: 10,
		alignItems: "center",
		userSelect: "none",
	},

	paper: {
		userSelect: "none",
		boxShadow: "2px 2px 5px #7d7d7d;",
		display: "grid",
		width: "100%",
		maxHeight: "32vh",

		overflow: "auto",
		"&::-webkit-scrollbar": {
			width: "14px",
			height: "14px",
		},
		"&::-webkit-scrollbar-track": {
			background: "#f1f1f1",
		},
		"&::-webkit-scrollbar-thumb": {
			background: "#bebebe",
			borderRadius: "12px",
		},
		"&::-webkit-scrollbar-thumb:hover": {
			background: "#555",
		},

		borderRadius: "0 0 5px 5px",
		border: "1px solid #c1c1c1",
		borderTop: 0,
		fontSize: "25px",
		gap: "0",
		padding: "1px 0 5px 0",
		"& .MuiAutocomplete-option": {
			height: "100px",
		},
	},
	content: {
		color: " #404149",
		borderBottom: "1px solid #c1c1c1",
		width: "100%",
		display: "flex",
		flex: "1",
		flexDirection: "column",
		padding: "13px 10px",
		cursor: "pointer",
		gap: "5px",
		"&:hover": {
			background: "#307ad6",
			color: "#fff",
		},
		"&:last-child": { borderBottom: "0" },
	},

	contentTitle: {
		whiteSpace: "wrap",
		fontSize: "15px",
		fontWeight: "700",
	},
	contentEntity: {
		fontSize: "12px",
		fontStyle: "italic",
		whiteSpace: "wrap",
	},
	// noRecord: {
	// 	color: "#c1c1c1",
	// 	justifyContent: "center",
	// 	display: "flex",
	// 	fontSize: "14px",
	// 	// overflow: "hidden",
	// 	whiteSpace: "wrap",
	// 	// textOverflow: "ellipsis",
	// 	alignItems: "center",
	// 	padding: "5px",
	// },
}));
function AutoCompleteBox(props) {
	const { classes, cx } = useStyles();
	const {
		setSearchQuery,
		searchQuery,
		width,
		dropDownActiveWidth = "304px",
		dataSource,
		setSelectedValue,
		chips,

		isSearching = true,
	} = props;

	const [uniqueId] = useState(Math.random() * Date.now());
	const [boxActive, setBoxActive] = useState(true);
	const [currentValue, setCurrentValue] = useState({});

	const autoBoxRef = useRef();

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (autoBoxRef.current && !autoBoxRef.current.contains(event.target)) {
				setBoxActive(false);
				setCurrentValue({});
			}
		};
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [autoBoxRef]);

	const onKeyPress = debounce((e) => {
		const {
			target: { value },
			key,
		} = e;
		if (key === "Enter" && !isSearching && value.length >= 3) {
			setSelectedValue({ chipType: 0, id: 0, value: value });
			e.preventDefault();
		}
	}, 500);

	const filteredDataSource = dataSource?.filter(
		(item) =>
			!chips?.some(
				(chipData) =>
					item.id === chipData.id &&
					item.chipType === chipData.chipType &&
					item.value === chipData.value
			)
	);
	return (
		<div
			className="autocompletebox"
			style={{ width: width, position: "relative" }}
		>
			<div
				className={cx({
					"autocompletebox-expand.active": true,
				})}
				style={{
					width: "100%",
					position: "relative",
				}}
				tabIndex={"0"}
				role="button"
			>
				<div className="desktopSearchCustomCaptions">
					<AC.SearchContainer>
						<AC.SearchInner>
							<Grid container spacing={1} alignItems="flex-end">
								<div className="flex" style={{ position: "relative" }}>
									<Grid item>
										<SearchIcon
											style={{ marginTop: "20px", marginRight: "5px" }}
										/>
									</Grid>
									<Grid item>
										<TextField
											onClick={() => setBoxActive(true)}
											sx={{ width: 284 }}
											variant="standard"
											value={searchQuery}
											onChange={setSearchQuery}
											label={"Search"}
											onKeyDown={onKeyPress}
											ref={autoBoxRef}
										/>
									</Grid>
								</div>
							</Grid>
						</AC.SearchInner>
					</AC.SearchContainer>
				</div>

				<div
					className="autocompletebox-content"
					style={{
						right: "0",
						width: dropDownActiveWidth,
						backgroundColor: "white",
						position: "absolute",
						zIndex: "101",
					}}
				>
					{boxActive && filteredDataSource?.length > 0 && (
						<div className={classes.paper} id={uniqueId}>
							{filteredDataSource?.map((item) => (
								<div
									className={classes.content}
									onClick={() => {
										setSelectedValue(item);
										setCurrentValue({ id: item?.id, value: item.value });
										setBoxActive(false);
									}}
									style={{
										backgroundColor:
											currentValue?.id === item.id &&
											currentValue?.value === item.value
												? "#307ad6"
												: "",
										color:
											currentValue?.id === item.id &&
											currentValue?.value === item.value
												? "white"
												: "",
									}}
								>
									<span className={classes.contentTitle}>{item.value}</span>
									<span className={classes.contentEntity}>
										In : {DefectChipTypes(item.chipType)[0]?.caption}
									</span>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default AutoCompleteBox;
AutoCompleteBox.defaultProps = {
	width: "284px",
	dataSource: [],
	setSelectedValue: {},
	onChange: () => {},
	disabled: false,
	isSearching: false,
	placeholder: "Select Item",
	label: "",
	selectdValue: "",
	fetchData: () => {},
	dropDownActiveWidth: "304px",
	cacheDropDownData: true,
};

AutoCompleteBox.propTypes = {
	width: PropTypes.string,
	dataSource: PropTypes.array,
	setSelectedValue: PropTypes.func,
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
	isSearching: PropTypes.bool,
	cacheDropDownData: PropTypes.bool,
	placeholder: PropTypes.string,
	label: PropTypes.string,
	selectdValue: PropTypes.string,
	fetchData: PropTypes.func,
	dropDownActiveWidth: PropTypes.string,
};
