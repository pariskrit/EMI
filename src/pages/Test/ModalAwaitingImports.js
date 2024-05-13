import React, { useEffect, useState } from "react";
import API from "helpers/api";
import ColourConstants from "helpers/colourConstants";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import TableStyle from "styles/application/TableStyle";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import PopupMenu from "components/Elements/PopupMenu";

import DeleteDialog from "components/Elements/DeleteDialog";
import { ReactComponent as MenuIcon } from "assets/icons/3dot-icon.svg";
import { Typography } from "@mui/material";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";

// Init styled components
const AT = TableStyle();

// Size constant
const MAX_LOGO_HEIGHT = 47;

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
	selectedTableHeadRow: {
		borderBottomColor: ColourConstants.tableBorder,
		borderBottomStyle: "solid",
		borderBottomWidth: 1,
		backgroundColor: ColourConstants.tableBackgroundSelected,
		fontWeight: "bold",
		color: "#FFFFFF",
	},
	headerText: {
		fontSize: 21,
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
}));

function ModalAwaitingImports({ siteAppId }) {
	// Init hooks
	const { classes, cx } = useStyles();

	// Init State
	const [modelsToImport, setModelsToImport] = useState([]);
	const [selectedData, setSelectedData] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [selectedID, setSelectedID] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const dispatch = useDispatch();

	// determine if there are any models to be imported by calling model imports api
	useEffect(() => {
		const FetchModelsToImport = async () => {
			try {
				const response = await API.get(
					`/api/ModelImports?siteAppId=${siteAppId}`
				);
				if (response.status === 200) {
					setModelsToImport(response.data);
				}
			} catch (error) {
				dispatch(showError(`Failed to fetch models to import `));
			}
		};
		FetchModelsToImport();
	}, [siteAppId]);

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
				<>
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
						Models To Import
					</Typography>
					<AT.TableContainer component={Paper} elevation={0}>
						<Table aria-label="Table">
							<AT.TableHead>
								<TableRow className={classes.tableHead}>
									<TableCell
										className={cx(classes.nameRow, {
											[classes.tableHeadRow]: true,
										})}
									>
										<AT.CellContainer>Make</AT.CellContainer>
									</TableCell>
									<TableCell
										className={cx(classes.nameRow, {
											[classes.tableHeadRow]: true,
										})}
									>
										<AT.CellContainer>Model</AT.CellContainer>
									</TableCell>
								</TableRow>
							</AT.TableHead>
							<TableBody>
								{modelsToImport.map((row, index) => (
									<TableRow key={index}>
										<TableCell
											component="th"
											scope="row"
											className={cx(classes.dataCell, classes.nameRow, {
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
											className={cx(classes.dataCell, classes.nameRow, {
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
																handler: () => {},
																isDelete: false,
															},
															{
																name: "Delete",
																handler: () => {
																	handleDeleteDialogOpen(1);
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
				</>
			)}
		</div>
	);
}

export default ModalAwaitingImports;
