import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import ColourConstants from "helpers/colourConstants";
import PopupMenu from "components/Elements/PopupMenu";
import { makeStyles } from "tss-react/mui";
import TableStyle from "styles/application/TableStyle";
import { appPath, modelsPath } from "helpers/routePaths";
// Icon imports
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";
import { Link } from "@mui/material";
import { NumericSort, isoDateWithoutTimeZone } from "helpers/utils";
import { useOutletContext } from "react-router-dom";
// Init styled components
const AT = TableStyle();
// Size constant
const MAX_LOGO_HEIGHT = 47;

const media = "@media (max-width: 414px)";

const useStyles = makeStyles()((theme) => ({
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
		color: ColourConstants.red,
	},
}));

const UserTable = ({
	isSharableModel,
	data,
	setData,
	columns,
	headers,
	handleSort,
	handleDeleteDialogOpen,
	handleDuplicateModalOpen,
	handleViewVersionModalOpen,
	handleShareModelOpen,
}) => {
	// Init hooks
	const { classes, cx } = useStyles();
	const [convertedData, setConvertedData] = useState([]);
	const { access } = useOutletContext();
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
				status: `${item?.status} ${
					item?.activeModelVersion
						? item?.active
							? " (Active)"
							: " (Inactive)"
						: ""
				}`,
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

		const newMethod =
			currentTableSort[0] === field && currentTableSort[1] === "asc"
				? "desc"
				: "asc";

		if (field === "devModelVersion" || field === "activeModelVersion") {
			NumericSort(data, setData, field, newMethod);
		} else {
			handleSort(data, setData, field, newMethod);
		}

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
								className={cx(classes.nameRow, {
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
													{col === "fullName" ? (
														<Link
															underline="none"
															onClick={() => {
																window.open(
																	`${appPath}${modelsPath}/${row.devModelVersionID}`
																);
															}}
															style={{
																color: "rgb(17, 100, 206)",
																cursor: "pointer",
															}}
														>
															{row[col]}
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
																			`${appPath}${modelsPath}/${row.devModelVersionID}`
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
																	name: "Share",
																	handler: () => {
																		handleShareModelOpen(row);
																	},
																	isDelete: false,
																	ShouldHide: !(
																		isSharableModel &&
																		row.isSharable &&
																		row.isPublish
																	),
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
