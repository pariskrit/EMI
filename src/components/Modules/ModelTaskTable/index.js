import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import TableStyle from "styles/application/TableStyle";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import ColourConstants from "helpers/colourConstants";
import { handleSort } from "helpers/utils";
import ModelTaskRow from "./ModelTaskRow";
import AddNewModelTask from "pages/Models/ModelDetails/ModelTasks/AddNewModelTask";
import { duplicateTask } from "services/models/modelDetails/modelTasks";

// Init styled components
const AT = TableStyle();

// Size constant
const MAX_LOGO_HEIGHT = 47;

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
	selectedTableHeadRow: {
		borderBottomColor: ColourConstants.tableBorder,
		borderBottomStyle: "solid",
		borderBottomWidth: 1,
		backgroundColor: ColourConstants.tableBackgroundSelected,
		fontWeight: "bold",
		color: "#FFFFFF",
	},
	nameRow: {
		width: "200px",
		height: "10px",
		lineHeight: "1rem",
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
});

const ModelTaskTable = ({
	data,
	handleDelete,
	handleEdit,
	setData,
	headers,
	columns,
	modelId,
	fetchData,
	handleCopy,
	handleCopyTaskQuestion,
	customCaptions,
	access,
}) => {
	const classes = useStyles();
	const [currentTableSort, setCurrentTableSort] = useState([]);
	const [selectedData, setSelectedData] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const [dupicateTask, setDuplicateTask] = useState(null);
	const [openDuplicate, setOPenDuplicate] = useState(false);

	const handleDuplicate = (toDuplicateTask) => {
		setDuplicateTask(toDuplicateTask);
		setOPenDuplicate(true);
	};

	const handleSortClick = (field) => {
		// Flipping current method
		const newMethod = currentTableSort[1] === "asc" ? "desc" : "asc";

		// Sorting table
		handleSort(data, setData, field, newMethod);

		// Updating header state
		setCurrentTableSort([field, newMethod]);
	};

	const dupliacteModelTask = async () => {
		return await duplicateTask(dupicateTask?.id);
	};

	return (
		<>
			<AddNewModelTask
				open={openDuplicate}
				closeHandler={() => setOPenDuplicate(false)}
				data={{
					name: dupicateTask?.name,
					actionID: {
						label: dupicateTask?.actionName,
						value: dupicateTask?.actionID,
					},
					operatingModeID: { label: dupicateTask?.operatingModeName },
					systemID: { label: dupicateTask?.systemName },
					roles: { label: dupicateTask?.roles },
					estimatedMinutes: dupicateTask?.estimatedMinutes,
					safetyCritical: dupicateTask?.safetyCritical ? true : false,
				}}
				title={`Duplicate Model ${customCaptions?.task}`}
				modelId={modelId}
				createProcessHandler={dupliacteModelTask}
				fetchData={fetchData}
				isDuplicate={true}
				customCaptions={customCaptions}
			/>
			<AT.TableContainer component={Paper} elevation={0}>
				<Table aria-label="Table">
					<AT.TableHead>
						<TableRow className={classes.tableHead}>
							{headers.map((header, index) => (
								<TableCell
									key={header.id}
									onClick={() => {
										header?.isSort && handleSortClick(columns[index]);
									}}
									style={{ width: header?.width || "auto" }}
									className={clsx(classes.nameRow, {
										[classes.selectedTableHeadRow]:
											currentTableSort[0] === columns[index],
										[classes.tableHeadRow]:
											currentTableSort[0] !== columns[index],
									})}
								>
									<AT.CellContainer className="flex justify-between">
										{header.name}
										{header.isSort && (
											<div className="arrow">
												<AT.DescArrow
													fill={
														currentTableSort[0] === columns[index] &&
														currentTableSort[1] === "asc"
															? "#D2D2D9"
															: "#F9F9FC"
													}
													className="arrowUp"
												/>
												<AT.DefaultArrow
													fill={
														currentTableSort[0] === columns[index] &&
														currentTableSort[1] === "desc"
															? "#D2D2D9"
															: "#F9F9FC"
													}
													className="arrowDown"
												/>
											</div>
										)}
									</AT.CellContainer>
								</TableCell>
							))}
						</TableRow>
					</AT.TableHead>
					<TableBody>
						{data.length !== 0 ? (
							data.map((row, index) => (
								<ModelTaskRow
									key={row.id}
									row={row}
									index={index}
									setAnchorEl={setAnchorEl}
									anchorEl={anchorEl}
									selectedData={selectedData}
									setSelectedData={setSelectedData}
									handleEdit={handleEdit}
									handleDelete={handleDelete}
									handleDuplicate={handleDuplicate}
									handleCopy={handleCopy}
									handleCopyTaskQuestion={handleCopyTaskQuestion}
									classes={classes}
									columns={columns}
									data={data}
									modelId={modelId}
									customCaptions={customCaptions}
									access={access}
								/>
							))
						) : (
							<TableRow>
								{headers.map((head, i) => {
									if (i === 0) {
										return <TableCell key={head.id}>No Record Found</TableCell>;
									} else {
										return <TableCell key={head.id}></TableCell>;
									}
								})}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</AT.TableContainer>
		</>
	);
};

ModelTaskTable.propTypes = {
	data: PropTypes.array.isRequired,
	headers: PropTypes.arrayOf(PropTypes.object).isRequired,
	columns: PropTypes.arrayOf(PropTypes.string).isRequired,
	handleEdit: PropTypes.func.isRequired,
	handleDelete: PropTypes.func.isRequired,
};

export default ModelTaskTable;
