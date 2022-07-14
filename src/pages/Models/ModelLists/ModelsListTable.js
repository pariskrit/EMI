import clsx from "clsx";
import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import ColourConstants from "helpers/colourConstants";
import PopupMenu from "components/Elements/PopupMenu";
import { makeStyles } from "@material-ui/core/styles";
import TableStyle from "styles/application/TableStyle";
import { modelsPath } from "helpers/routePaths";

// Icon imports
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";
import { Link } from "@material-ui/core";
import { isoDateWithoutTimeZone } from "helpers/utils";

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
	greater: {
		color: "red",
	},
});

const UserTable = ({
	data,
	setData,
	access,
	columns,
	headers,
	handleSort,
	handleDeleteDialogOpen,
	handleDuplicateModalOpen,
	handleViewVersionModalOpen,
}) => {
	// Init hooks
	const classes = useStyles();
	const [convertedData, setConvertedData] = useState([]);

	useEffect(() => {
		let newData = data.map((item) => {
			let currentDate = new Date();
			let apiDate = isoDateWithoutTimeZone(
				item?.reviewDate ? item.reviewDate + "Z" : item.reviewDate
			);
			let isGreater =
				currentDate > new Date(item?.reviewDate ? item?.reviewDate + "Z" : "");
			return {
				...item,
				reviewDate: (
					<span className={`${isGreater ? classes.greater : ""}`}>
						{apiDate?.split(" ")[0]}
					</span>
				),
			};
		});
		setConvertedData(newData);
	}, [data]);

	// Init State
	const [currentTableSort, setCurrentTableSort] = useState(["name", "asc"]);
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	// Handlers
	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod = currentTableSort[1] === "asc" ? "desc" : "asc";

		handleSort(data, setData, field, newMethod);

		// Updating header state
		setCurrentTableSort([field, newMethod]);
	};

	return (
		<AT.TableContainer component={Paper} elevation={0}>
			<Table aria-label="Table">
				<AT.TableHead>
					<TableRow>
						{headers.map((header, i) => (
							<TableCell
								key={i}
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
					{convertedData.length ? (
						convertedData.map((row, index) => (
							<TableRow key={row.id}>
								{columns.map((col, i, arr) => {
									return (
										<AT.DataCell key={col}>
											<AT.CellContainer key={col}>
												<AT.TableBodyText>
													{typeof col === "object" ? (
														<Link
															onClick={() => {
																window.open(
																	`${modelsPath}/${row.devModelVersionID}`
																);
															}}
															style={{
																color: "rgb(17, 100, 206)",
																cursor: "pointer",
															}}
														>
															{row?.[col?.[1]] === undefined ||
															row?.[col?.[1]] === null
																? row[col[0]]
																: row[col[0]] + " " + row?.[col?.[1]]}
														</Link>
													) : (
														row[col]
													)}
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
															isLast={index === data.length - 1}
															id={row.id}
															clickAwayHandler={() => {
																setAnchorEl(null);
																setSelectedData(null);
															}}
															menuData={[
																{
																	name:
																		access === "R" ||
																		row.activeModelVersionID ===
																			row.devModelVersionID
																			? "View"
																			: "Edit",
																	handler: () => {
																		window.open(
																			`${modelsPath}/${row.devModelVersionID}`
																		);
																	},
																	isDelete: false,
																	ShouldHide: false,
																},
																{
																	name: "View Version",
																	handler: handleViewVersionModalOpen,
																	isDelete: false,
																	ShouldHide: false,
																},
																{
																	name: "Duplicate",
																	handler: () => {
																		handleDuplicateModalOpen(row);
																	},
																	isDelete: false,
																	ShouldHide: false,
																},
																{
																	name: "Delete",
																	handler: handleDeleteDialogOpen,
																	isDelete: true,
																	ShouldHide: row.activeModelVersion !== null,
																},
															].filter((x) => {
																if (access === "F" && !x.ShouldHide)
																	return true;
																if (access === "E" && !x.ShouldHide) {
																	if (
																		x.name === "Edit" ||
																		x.name === "View" ||
																		x.name === "View Version"
																	) {
																		return true;
																	} else {
																		return false;
																	}
																}
																if (access === "R" && !x.ShouldHide) {
																	if (
																		x.name === "Edit" ||
																		x.name === "View" ||
																		x.name === "View Version"
																	)
																		return true;
																	else return false;
																}
																return false;
															})}
														/>
													</AT.DotMenu>
												) : null}
											</AT.CellContainer>
										</AT.DataCell>
									);
								})}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell>No any records found</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</AT.TableContainer>
	);
};

export default UserTable;
