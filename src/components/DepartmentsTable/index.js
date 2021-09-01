import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";
import DeleteDialog from "components/DeleteDialog";
import PopupMenu from "components/PopupMenu";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ColourConstants from "../../helpers/colourConstants";
import TableStyle from "../../styles/application/TableStyle";
import "./arrowStyle.scss";
import { useParams } from "react-router-dom";

import EditDialog from "routes/Clients/Sites/SiteDepartment/EditModal";

// import API from "helpers/api";

const AT = TableStyle();

const useStyles = makeStyles({
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
		width: "40%",
	},
	clientsRow: {
		width: "20%",
	},
	dataCell: {
		height: 85,
	},
});

const DepartmentsTable = ({
	data,
	setData,
	handleSort,
	searchQuery,
	searchedData,
	setSearchedData,
	setCurrentTableSort,
	currentTableSort,
	setDataChanged,
}) => {
	const { id } = useParams();

	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod = currentTableSort[1] === "asc" ? "desc" : "asc";

		// Sorting table
		handleSort(data, setData, field, newMethod);

		// Sorting searched table if present
		if (searchQuery !== "") {
			handleSort(searchedData, setSearchedData, field, newMethod);
		}

		// Updating header state
		setCurrentTableSort([field, newMethod]);
	};

	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [selectedID, setSelectedID] = useState(null);
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const [editData, setEditData] = useState(null);


	const classes = useStyles();

	//Delete Modal
	const handleDeleteDialogOpen = (id) => {
		setSelectedID(id);
		setOpenDeleteDialog(true);
	};

	const handleDeleteDialogClose = () => {
		setSelectedID(null);
		setOpenDeleteDialog(false);
	};

	const handleRemoveData = (id) => {
		const newData = [...data].filter(function (item) {
			return item.id !== id;
		});

		// Updating state
		setData(newData);
	};

	// Edit Modal
	const handleEditData = (d) => {
		const newData = [...data];

		let index = newData.findIndex((el) => el.id === d.id);
		newData[index] = d;

		// Updating state
		setData(newData);

		setDataChanged(true);
	};

	const handleEditDialogClose = () => {
		setOpenEditDialog(false);
	};

	const handleEditDialogOpen = (id) => {
		let index = data.findIndex((el) => el.id === id);

		if (index >= 0) {
			setEditData(data[index]);
			setOpenEditDialog(true);
		}
	};

	return (
		<>
			<DeleteDialog
				entityName="Department"
				open={openDeleteDialog}
				closeHandler={handleDeleteDialogClose}
				deleteEndpoint="/api/SiteDepartments"
				deleteID={selectedID}
				handleRemoveData={handleRemoveData}
			/>

			<EditDialog
				open={openEditDialog}
				closeHandler={handleEditDialogClose}
				data={editData}
				handleEditData={handleEditData}
			/>

			<AT.TableContainer
				component={Paper}
				elevation={0}
				// className="applicationTableContainer"
			>
				<Table aria-label="Table">
					<AT.TableHead>
						<TableRow>
							<TableCell className={classes.tableHeadRow}>
								<AT.CellContainer className="flex justify-between">
									Name
									<div className="arrow">
										<AT.DescArrow fill="#F9F9FC" className="arrowUp" />
										<AT.DefaultArrow fill="#F9F9FC" className="arrowDown" />
									</div>
								</AT.CellContainer>
							</TableCell>
							<TableCell className={classes.tableHeadRow}>
								<AT.CellContainer className="flex justify-between">
									Description
									<div className="arrow">
										<AT.DescArrow fill="#F9F9FC" className="arrowUp" />
										<AT.DefaultArrow fill="#F9F9FC" className="arrowDown" />
									</div>
								</AT.CellContainer>
							</TableCell>
						</TableRow>
					</AT.TableHead>
					<TableBody>
						{(searchQuery === "" ? data : searchedData).map((d, index) => (
							<TableRow key={index}>
								<TableCell>{d.name}</TableCell>
								<TableCell>
									<AT.CellContainer>
										<AT.TableBodyText>{d.description}</AT.TableBodyText>

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
									</AT.CellContainer>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</AT.TableContainer>
		</>
	);
};

export default DepartmentsTable;
