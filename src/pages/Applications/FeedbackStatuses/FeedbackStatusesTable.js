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
import FeedbackStatusTypes from "helpers/feedbackStatusTypes";

// Icon imports
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";

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
	defaultText: {
		fontFamily: "Roboto Condensed",
		fontSize: 14,
		color: ColourConstants.tableBorder,
		fontStyle: "italic",
		paddingLeft: 5,
		display: "inline-flex",
	},
	defaultNameText: {
		fontWeight: "bold",
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

const FeedbackStatusesTable = ({
	data,
	setData,
	handleSort,
	defaultID,
	searchQuery,
	openDefaultDialog,
	handleEditDialogOpen,
	handleDeleteDialogOpen,
	currentTableSort,
	setCurrentTableSort,
	searchedData,
	setSearchedData,
	isReadOnly = false,
}) => {
	// Init hooks
	const { classes, cx } = useStyles();

	// Init State
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
		handleSort(data, setData, field, newMethod);

		// Sorting searched table if present
		if (searchQuery !== "") {
			handleSort(searchedData, setSearchedData, field, newMethod);
		}

		// Updating header state
		setCurrentTableSort([field, newMethod]);
	};

	return (
		<div>
			<AT.TableContainer component={Paper} elevation={0}>
				<Table aria-label="Table">
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
									handleSortClick("type");
								}}
								className={cx(classes.publishRow, {
									[classes.selectedTableHeadRow]:
										currentTableSort[0] === "type",
									[classes.tableHeadRow]: currentTableSort[0] !== "type",
								})}
							>
								<AT.CellContainer>
									Type
									{currentTableSort[0] === "type" &&
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
						{(searchQuery === "" ? data : searchedData).map((d, index) => (
							<TableRow key={d.id}>
								<AT.DataCell>
									<AT.TableBodyText
										className={cx({
											[classes.defaultNameText]: d.id === defaultID,
										})}
									>
										{d.name}
									</AT.TableBodyText>
									{d.id === defaultID ? (
										<Typography className={classes.defaultText}>
											(Default)
										</Typography>
									) : null}
								</AT.DataCell>
								<AT.DataCell>
									<AT.CellContainer>
										<AT.TableBodyText>
											{FeedbackStatusTypes[d.type]}
										</AT.TableBodyText>

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
													publish={d.publish}
													name={d.name}
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
														{
															name: "Make Default",
															handler: openDefaultDialog,
															isDelete: false,
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

export default FeedbackStatusesTable;
