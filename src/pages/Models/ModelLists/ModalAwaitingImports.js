import React, { useEffect, useState } from "react";
import ColourConstants from "helpers/colourConstants";
import { makeStyles } from "@material-ui/core/styles";
import TableStyle from "styles/application/TableStyle";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import PopupMenu from "components/Elements/PopupMenu";
import clsx from "clsx";
import DeleteDialog from "components/Elements/DeleteDialog";
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";
import { Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { modelImport, modelsPath } from "helpers/routePaths";

// Init styled components
const AT = TableStyle();

// Size constant
const MAX_LOGO_HEIGHT = 47;

const useStyles = makeStyles({
	container: {
		margin: "18px 0",
	},
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
	selectedTableHeadRow: {
		borderBottomColor: ColourConstants.tableBorder,
		borderBottomStyle: "solid",
		borderBottomWidth: 1,
		backgroundColor: ColourConstants.tableBackgroundSelected,
		fontWeight: "bold",
		color: "#FFFFFF",
	},
	headerText: {
		fontSize: 18,
	},
	nameRow: {
		width: "40%",
	},
	clientsRow: {
		width: "20%",
	},
	dataCell: {
		height: 40,
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
});

function ModalAwaitingImports({ modelImportData }) {
	// Init hooks
	const classes = useStyles();
	const history = useHistory();

	// Init State
	const [modelsToImport, setModelsToImport] = useState([]);
	const [selectedData, setSelectedData] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [selectedID, setSelectedID] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	// determine if there are any models to be imported by calling model imports api
	useEffect(() => {
		setModelsToImport(modelImportData);
	}, [modelImportData]);

	//handlers
	const handleDeleteDialogOpen = (modelImportId) => {
		setOpenDeleteDialog(true);
		setSelectedID(modelImportId);
	};

	const handleDeleteDialogClose = () => {
		setSelectedID(null);
		setOpenDeleteDialog(false);
	};

	const handleRemoveData = (id) => {
		const newData = [...modelsToImport].filter(function (item) {
			return item.id !== id;
		});
		setModelsToImport(newData);
	};

	return (
		<div>
			{modelsToImport.length !== 0 && (
				<div className={classes.container}>
					<DeleteDialog
						entityName="Model"
						open={openDeleteDialog}
						closeHandler={handleDeleteDialogClose}
						deleteEndpoint="/api/ModelImports"
						deleteID={selectedID}
						handleRemoveData={handleRemoveData}
					/>
					<Typography
						className={classes.headerText}
						component="h1"
						gutterBottom
					>
						<strong>Models To Import</strong>
					</Typography>
					<AT.TableContainer component={Paper} elevation={0}>
						<Table aria-label="Table">
							<AT.TableHead>
								<TableRow className={classes.tableHead}>
									<TableCell
										className={clsx(classes.nameRow, {
											[classes.tableHeadRow]: true,
										})}
									>
										<AT.CellContainer>Make</AT.CellContainer>
									</TableCell>
									<TableCell
										className={clsx(classes.nameRow, {
											[classes.tableHeadRow]: true,
										})}
									>
										<AT.CellContainer>Model</AT.CellContainer>
									</TableCell>
								</TableRow>
							</AT.TableHead>
							<TableBody>
								{modelsToImport.map((row, index) => (
									<TableRow key={row.id}>
										<TableCell
											component="th"
											scope="row"
											className={clsx(classes.dataCell, classes.nameRow, {
												[classes.lastCell]: index === modelsToImport.length - 1,
											})}
										>
											<AT.CellContainer>
												<AT.TableBodyText>{row.name}</AT.TableBodyText>
											</AT.CellContainer>
										</TableCell>
										<TableCell
											component="th"
											scope="row"
											className={clsx(classes.dataCell, classes.nameRow, {
												[classes.lastCell]: index === modelsToImport.length - 1,
											})}
										>
											<AT.CellContainer>
												<AT.TableBodyText>{row.model}</AT.TableBodyText>

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
														isLast={index === modelsToImport.length - 1}
														id={row.id}
														clickAwayHandler={() => {
															setAnchorEl(null);
															setSelectedData(null);
														}}
														menuData={[
															{
																name: "Import",
																handler: () => {
																	history.push(`${modelImport}/${row.id}`);
																},
																isDelete: false,
															},
															{
																name: "Delete",
																handler: () => {
																	handleDeleteDialogOpen(row.id);
																},
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
				</div>
			)}
		</div>
	);
}

export default ModalAwaitingImports;
