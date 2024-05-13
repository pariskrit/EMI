import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import TableStyle from "styles/application/TableStyle";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import ColourConstants from "helpers/colourConstants";
import PopupMenu from "components/Elements/PopupMenu";
import { handleSort } from "helpers/utils";

// Icon imports
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";
import { CircularProgress } from "@mui/material";

// Init styled components
const AT = TableStyle();

const useStyles = makeStyles()((theme) => ({
	tableHeadRow: {
		borderBottomColor: ColourConstants.tableBorder,
		borderBottomStyle: "solid",
		borderBottomWidth: 1,
		backgroundColor: ColourConstants.tableBackground,
		fontWeight: "bold",
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
		width: "20%",
	},
	publishRow: {
		width: "20%",
	},

	yesText: {
		color: ColourConstants.yesText,
		fontFamily: "Roboto Condensed",
		fontSize: 14,
	},
	noText: {
		color: ColourConstants.commonText,
		fontFamily: "Roboto Condensed",
		fontSize: 14,
	},
}));

const UserRolesTable = ({
	data,
	setData,
	setSearch,
	searchQuery,
	onEdit,
	onDelete,
	isLoading,
	defectPlural,
	isReadOnly,
}) => {
	// Init hooks
	const { classes, cx } = useStyles();

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

		// Sorting table
		if (searchQuery.length === 0) handleSort(data, setData, field, newMethod);
		else handleSort(data, setSearch, field, newMethod);

		// Updating header state
		setCurrentTableSort([field, newMethod]);
	};

	if (isLoading) {
		return <CircularProgress />;
	}

	return (
		<div>
			<AT.TableContainer component={Paper} elevation={0}>
				<Table aria-label="User Roles Table">
					<AT.TableHead>
						<TableRow>
							<TableCell
								onClick={() => {
									handleSortClick("name");
								}}
								className={cx(classes.nameRow, {
									[classes.selectedTableHeadRow]:
										currentTableSort[0] === "name",
									[classes.tableHeadRow]: currentTableSort[0] !== "name",
								})}
							>
								<AT.CellContainer>
									Name
									{currentTableSort[0] === "name" &&
									currentTableSort[1] === "desc" ? (
										<AT.DefaultArrow fill="#FFFFFF" />
									) : (
										<AT.DescArrow fill="#FFFFFF" />
									)}
								</AT.CellContainer>
							</TableCell>
							<TableCell
								onClick={() => {
									handleSortClick("canRegisterDefects");
								}}
								className={cx(classes.publishRow, {
									[classes.selectedTableHeadRow]:
										currentTableSort[0] === "canRegisterDefects",
									[classes.tableHeadRow]:
										currentTableSort[0] !== "canRegisterDefects",
								})}
							>
								<AT.CellContainer>
									Can Raise {defectPlural}?
									{currentTableSort[0] === "canRegisterDefects" &&
									currentTableSort[1] === "desc" ? (
										<AT.DefaultArrow fill="#FFFFFF" />
									) : (
										<AT.DescArrow fill="#FFFFFF" />
									)}
								</AT.CellContainer>
							</TableCell>
						</TableRow>
					</AT.TableHead>
					<TableBody>
						{data.map((d, index) => (
							<TableRow key={d.id}>
								<AT.DataCell>
									<AT.TableBodyText>{d.name}</AT.TableBodyText>
								</AT.DataCell>
								<AT.DataCell>
									<AT.CellContainer>
										<Typography
											className={cx({
												[classes.yesText]: d.canRegisterDefects,
												[classes.noText]: !d.canRegisterDefects,
											})}
										>
											{d.canRegisterDefects ? "Yes" : "No"}
										</Typography>

										{!isReadOnly && (
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
													// isLast={
													// 	searchQuery === ""
													// 		? index === data.length - 1
													// 		: index === searchedData.length - 1
													// }
													id={d.id}
													clickAwayHandler={() => {
														setAnchorEl(null);
														setSelectedData(null);
													}}
													canRegisterDefects={d.canRegisterDefects}
													name={d.name}
													menuData={[
														{
															name: "Edit",
															handler: () => onEdit(d.id),
															isDelete: false,
														},
														{
															name: "Delete",
															handler: () => onDelete(d.id),
															isDelete: true,
														},
													]}
												/>
											</AT.DotMenu>
										)}
									</AT.CellContainer>
								</AT.DataCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</AT.TableContainer>
		</div>
	);
};

export default UserRolesTable;
