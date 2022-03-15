import clsx from "clsx";
import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import { useHistory } from "react-router-dom";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import ColourConstants from "helpers/colourConstants";
import PopupMenu from "components/Elements/PopupMenu";
import { makeStyles } from "@material-ui/core/styles";
import TableStyle from "styles/application/TableStyle";

import useInfiniteScroll from "hooks/useInfiniteScroll";
import { usersPath } from "helpers/routePaths";

// Icon imports
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";
import NavButtons from "components/Elements/NavButtons";
import { siteScreenNavigation } from "helpers/constants";
import { Grid, TextField, Typography } from "@material-ui/core";
import Dropdown from "components/Elements/Dropdown";

// Init styled components
const AT = TableStyle();

// Size constant
const MAX_LOGO_HEIGHT = 47;

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
		width: 130,
		[media]: {
			width: 130,
			// width: "auto",
		},
	},
	clientsRow: {
		width: "20%",
	},
	dataCell: {
		height: 85,
	},
	nameLink: {
		color: ColourConstants.activeLink,
	},
	clientLogo: {
		maxHeight: MAX_LOGO_HEIGHT,
	},
	noImage: {
		color: ColourConstants.commonText,
		opacity: "50%",
	},
	lastCell: {
		borderBottom: "none",
	},
	row: {
		cursor: "pointer",
	},
});

const UserTable = ({
	data,
	page,
	setData,
	columns,
	headers,
	searchText,
	handleSort,
	searchQuery,
	onPageChange,
	searchedData,
	setSearchData,
	handleDeleteDialogOpen,
}) => {
	// Init hooks
	const classes = useStyles();
	const history = useHistory();

	// Init State
	const [currentTableSort, setCurrentTableSort] = useState(["name", "asc"]);
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [showNestedTable, setShowNestedTable] = useState([]);

	const { hasMore, loading, gotoTop } = useInfiniteScroll(
		data,
		17,
		async (pageSize, prevData) => await onPageChange(pageSize + 1, prevData),
		page,
		searchText
	);

	// Handlers
	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod = currentTableSort[1] === "asc" ? "desc" : "asc";

		// Sorting table
		if (searchQuery.length === 0) handleSort(data, setData, field, newMethod);
		else handleSort(searchedData, setSearchData, field, newMethod);

		// Sorting searched table if present
		if (searchQuery !== "") {
			handleSort(searchedData, setSearchData, field, newMethod);
		}

		// Updating header state
		setCurrentTableSort([field, newMethod]);
	};

	const onRowClick = (index) => {
		const tempArray = (showNestedTable.length > 0
			? [...showNestedTable]
			: [...searchedData].fill(false)
		).map((data, i) => (i === index ? !data : data));
		setShowNestedTable(tempArray);
	};

	return (
		<AT.TableContainer component={Paper} elevation={0}>
			<Table aria-label="Table">
				<AT.TableHead>
					<TableRow>
						{headers.map((header, i) => (
							<TableCell
								key={header}
								onClick={() => {
									handleSortClick(columns[i]);
								}}
								className={clsx(classes.nameRow, {
									[classes.selectedTableHeadRow]:
										currentTableSort[0] === columns[i],
									[classes.tableHeadRow]: currentTableSort[0] !== columns[i],
								})}
							>
								<AT.CellContainer>
									{header}
									{currentTableSort[0] === columns[i] &&
									currentTableSort[1] === "desc" ? (
										<AT.DefaultArrow fill="#FFFFFF" />
									) : (
										<AT.DescArrow fill="#FFFFFF" />
									)}
								</AT.CellContainer>
							</TableCell>
						))}
					</TableRow>
				</AT.TableHead>
				<TableBody className={classes.tableBody}>
					{(searchQuery === "" ? data : searchedData).map((row, index) => (
						<>
							<TableRow
								key={index}
								onClick={() => onRowClick(index)}
								className={classes.row}
							>
								{columns.map((col, i, arr) => (
									<AT.DataCell key={col}>
										<AT.CellContainer key={col}>
											<AT.TableBodyText>
												{/* <Link
												className={classes.nameLink}
												to={`${usersPath}/${row.id}`}
											> */}
												{row[col]}
												{/* </Link> */}
											</AT.TableBodyText>

											{arr.length === i + 1 ? (
												<AT.DotMenu
													onClick={(e) => {
														setAnchorEl(
															anchorEl === e.currentTarget
																? null
																: e.currentTarget
														);
														setSelectedData(
															anchorEl === e.currentTarget ? null : index
														);
													}}
												>
													<AT.TableMenuButton>
														<MenuIcon />
													</AT.TableMenuButton>

													<PopupMenu
														index={index}
														selectedData={selectedData}
														anchorEl={anchorEl}
														isLast={
															searchQuery === ""
																? index === data.length - 1
																: index === searchedData.length - 1
														}
														id={row.id}
														clickAwayHandler={() => {
															setAnchorEl(null);
															setSelectedData(null);
														}}
														menuData={[
															{
																name: "Edit",
																handler: () => {
																	history.push(`${usersPath}/${row.id}`);
																},
																isDelete: false,
															},
															{
																name: "Delete",
																handler: handleDeleteDialogOpen,
																isDelete: true,
															},
														]}
													/>
												</AT.DotMenu>
											) : null}
										</AT.CellContainer>
									</AT.DataCell>
								))}
							</TableRow>
							{showNestedTable[index] ? (
								<TableRow>
									<td>
										<InnerTable />
									</td>
								</TableRow>
							) : null}
						</>
					))}
				</TableBody>
			</Table>

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
		</AT.TableContainer>
	);
};

export default UserTable;

const InnerTable = () => {
	const useStyles = makeStyles((theme) => ({
		required: {
			color: "red",
		},
		siteContainer: {
			display: "flex",
			flexDirection: "column",
			width: "100%",
		},
	}));

	const classes = useStyles();

	return (
		<div>
			<NavButtons
				navigation={siteScreenNavigation}
				current={"Details"}
				// onClick={onNavClick}
			/>
			<Grid container spacing={2}>
				<Grid item sm={6}>
					<div className={classes.siteContainer}>
						<Typography variant="subtitle2">
							Site name<span className={classes.required}>*</span>
						</Typography>
						<Dropdown
							// options={listOfRegions.map((region, index) => ({
							// 	label: region.name,
							// 	value: index,
							// }))}
							// selectedValue={selectedRegion.value}
							label=""
							required={true}
							// onChange={(value) => onRegionInputChange(value)}
							width="auto"
						/>
					</div>
				</Grid>
				<Grid item sm={6}>
					<div className={classes.siteContainer}>
						<Typography variant="subtitle2">
							Region<span className={classes.required}>*</span>
						</Typography>
						<Dropdown
							// options={listOfRegions.map((region, index) => ({
							// 	label: region.name,
							// 	value: index,
							// }))}
							// selectedValue={selectedRegion.value}
							label=""
							required={true}
							// onChange={(value) => onRegionInputChange(value)}
							width="auto"
						/>
					</div>
				</Grid>
				<Grid item sm={6}>
					<div className={classes.siteContainer}>
						<Typography variant="subtitle2">
							Company Name<span className={classes.required}>*</span>
						</Typography>
						<Dropdown
							// options={listOfRegions.map((region, index) => ({
							// 	label: region.name,
							// 	value: index,
							// }))}
							// selectedValue={selectedRegion.value}
							label=""
							required={true}
							// onChange={(value) => onRegionInputChange(value)}
							width="auto"
						/>
					</div>
				</Grid>
				<Grid item sm={6}>
					<div className={classes.siteContainer}>
						<Typography variant="subtitle2">
							Business Number<span className={classes.required}>*</span>
						</Typography>
						<Dropdown
							// options={listOfRegions.map((region, index) => ({
							// 	label: region.name,
							// 	value: index,
							// }))}
							// selectedValue={selectedRegion.value}
							label=""
							required={true}
							// onChange={(value) => onRegionInputChange(value)}
							width="auto"
						/>
					</div>
				</Grid>

				<Grid item sm={6}>
					<div className={classes.siteContainer}>
						<Typography variant="subtitle2">
							Total Licence Count
							<span className={classes.required}>*</span>
						</Typography>
						<TextField
							name="licenses"
							// InputProps={{
							// 	endAdornment: isUpdating["licenses"]?.isUpdating ? (
							// 		<Facebook size={20} color="#A79EB4" />
							// 	) : null,
							// }}
							// disabled={
							// 	(![0, 1].includes(selectedLicenseType.value) &&
							// 		clientLicenseType === 3) ||
							// 	isUpdating["licenses"]?.isUpdating
							// }
							// fullWidth
							// type="number"
							// variant="outlined"
							// value={newSiteDetails?.licenses || ""}
							// onChange={onInputChange}
							// onBlur={onUpdateInput}
							// onFocus={setSelectedInputValue}
							// onKeyDown={onEnterKeyPress}
						/>
					</div>
				</Grid>
			</Grid>
		</div>
	);
};
