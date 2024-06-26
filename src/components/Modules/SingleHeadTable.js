import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import TableStyle from "styles/application/TableStyle";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import ColourConstants from "helpers/colourConstants";
import PopupMenu from "components/Elements/PopupMenu";
// Icon imports
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";

// Init styled components
const AT = TableStyle();

const useStyles = makeStyles()((theme) => ({
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
}));

function SingleHeadTable({
	data,
	setData,
	handleSort,
	searchQuery,
	handleDeleteDialogOpen,
	handleEditDialogOpen,
	currentTableSort,
	setCurrentTableSort,
	searchedData,
	setSearchedData,
	isReadOnly = false,
}) {
	// Init hooks
	const { classes, cx } = useStyles();

	// Init State
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	// Handlers
	const handleSortClick = () => {
		// Flipping current method
		const newMethod = currentTableSort[1] === "asc" ? "desc" : "asc";

		// Sorting table
		handleSort(data, setData, "name", newMethod);

		// Sorting searched table if present
		if (searchQuery !== "") {
			handleSort(searchedData, setSearchedData, "name", newMethod);
		}

		// Updating sort state
		setCurrentTableSort(["name", newMethod]);
	};

	return (
		<AT.TableContainer component={Paper} elevation={0}>
			<Table aria-label="Table">
				<AT.TableHead>
					<TableRow>
						<TableCell
							onClick={() => {
								handleSortClick();
							}}
							className={cx(classes.nameRow, classes.selectedTableHeadRow)}
						>
							<AT.CellContainer>
								Name
								{currentTableSort[1] === "desc" ? (
									<AT.DefaultArrow fill="#FFFFFF" />
								) : (
									<AT.DescArrow fill="#FFFFFF" />
								)}
							</AT.CellContainer>
						</TableCell>
					</TableRow>
				</AT.TableHead>
				<TableBody>
					{(searchQuery === "" ? data : searchedData).map((d, index) => (
						<TableRow key={d.id}>
							<AT.DataCell>
								<AT.CellContainer>
									<AT.TableBodyText>{d.name}</AT.TableBodyText>

									{!isReadOnly && (
										<AT.DotMenu
											onClick={(e) => {
												setAnchorEl(
													anchorEl === e.currentTarget ? null : e.currentTarget
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
												id={d.id}
												clickAwayHandler={() => {
													setAnchorEl(null);
													setSelectedData(null);
												}}
												menuData={[
													{
														name: "Edit",
														handler: handleEditDialogOpen,
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
									)}
								</AT.CellContainer>
							</AT.DataCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</AT.TableContainer>
	);
}

export default SingleHeadTable;
