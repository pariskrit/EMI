import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";
import DeleteDialog from "components/DeleteDialog";
import PopupMenu from "components/PopupMenu";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ColourConstants from "../../helpers/colourConstants";
import TableStyle from "../../styles/application/TableStyle";
import "../DepartmentsTable/arrowStyle.scss";

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

const LocationsTable = () => {
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	//Delete
	const [datas, setDatas] = useState([
		{ name: "ABC", desc: "Company ABC" },
		{ name: "DEF", desc: "Company DEF" },
		{ name: "XYZ", desc: "Company XYZ" },
	]);

	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [selectedID, setSelectedID] = useState(null);

	const history = useHistory();

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
		const newData = [...datas].filter(function (item) {
			return item.name !== id;
		});

		console.log("sagar", id);

		// Updating state
		setDatas(newData);
	};

	return (
		<>
			<DeleteDialog
				entityName="Location"
				open={openDeleteDialog}
				closeHandler={handleDeleteDialogClose}
				// deleteEndpoint="/api/Applications"
				deleteID={selectedID}
				handleRemoveData={handleRemoveData}
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
								<AT.CellContainer
									style={{ display: "flex", justifyContent: "space-between" }}
								>
									Name
									<div className="arrow">
										<AT.DescArrow fill="#F9F9FC" className="arrowUp" />
										<AT.DefaultArrow fill="#F9F9FC" className="arrowDown" />
									</div>
								</AT.CellContainer>
							</TableCell>
						</TableRow>
					</AT.TableHead>
					<TableBody>
						{datas.map((data, index) => (
							<TableRow key={index}>
								<TableCell>
									<AT.CellContainer>
										<AT.TableBodyText>{data.name}</AT.TableBodyText>

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
												id={data.name}
												clickAwayHandler={() => {
													setAnchorEl(null);
													setSelectedData(null);
												}}
												menuData={[
													{
														name: "Edit",
														handler: () => {
															history.push(`/SiteDepartments/${data.id}`);
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

export default LocationsTable;
