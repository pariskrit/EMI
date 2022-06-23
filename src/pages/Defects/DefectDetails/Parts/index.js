import React, { useCallback, useEffect, useState } from "react";
import {
	CircularProgress,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AccordionBox from "components/Layouts/AccordionBox";
import ColourConstants from "helpers/colourConstants";
import Row from "./Row";
import AddDialog from "./AddDialog";
import { addDefectPart, getDefectParts } from "services/defects/details";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import DeleteDialog from "components/Elements/DeleteDialog";
import { Apis } from "services/api";

const useStyles = makeStyles((theme) => ({
	noteContainer: {
		// marginTop: 25,
		display: "flex",
		justifyContent: "flex-end",
	},
	expandIcon: {
		transform: "scale(0.8)",
	},
	sectionHeading: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: "17px",
	},
	noteAccordion: {
		borderColor: ColourConstants.commonBorder,
		borderStyle: "solid",
		borderWidth: 1,
		width: "100%",
	},
	tableHead: {
		backgroundColor: "#D2D2D9",
		border: "1px solid",
	},

	deleteIcon: {
		transform: "scale(0.7)",
		color: ColourConstants.deleteButton,
		"&:hover": {
			cursor: "pointer",
		},
	},
	view: {
		textDecoration: "underline",
		color: "#307ad7",
		cursor: "pointer",
	},

	actionButton: { padding: "0px 13px 12px 6px" },
}));

const Notes = ({ defectId, isReadOnly, captions }) => {
	const classes = useStyles();
	const [modal, setModal] = useState({
		openAddModal: false,
		openDeleteModal: false,
	});
	const [parts, setParts] = useState([]);
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);

	const handleAddPart = async (part) => {
		const response = await addDefectPart({
			defectID: defectId,
			qty: part.quantity,
			name: part.name,
			description: part.description,
		});

		if (response.status) {
			fetchDefects();
		} else {
			dispatch(
				showError(response.data?.errors?.description[0] || "Could not add part")
			);
		}
	};

	const handleDelete = async () => {
		fetchDefects();
		onCloseDeleteDialog();
	};

	const fetchDefects = useCallback(async () => {
		const response = await getDefectParts(defectId);

		if (response.status) {
			setParts(response.data);
		} else {
			dispatch(showError(response.data?.error || "Could not fetch part"));
		}
		setLoading(false);
	}, [defectId, dispatch]);

	const onOpenDeleteDialog = (id) =>
		setModal({ ...modal, openDeleteModal: { id, open: true } });

	const onCloseDeleteDialog = () =>
		setModal({ ...modal, openDeleteModal: false });

	const onOpenAddDialog = () =>
		setModal((prev) => ({ ...prev, openAddModal: true }));

	const onCloseAddDialog = () =>
		setModal((prev) => ({ ...prev, openAddModal: false }));

	useEffect(() => {
		fetchDefects();
	}, [fetchDefects]);

	return (
		<div className={classes.noteContainer}>
			<AddDialog
				open={modal.openAddModal}
				handleClose={onCloseAddDialog}
				createHandler={handleAddPart}
				captions={captions}
			/>
			<DeleteDialog
				entityName={captions?.part}
				open={modal?.openDeleteModal?.open ?? false}
				closeHandler={onCloseDeleteDialog}
				deleteEndpoint={Apis.DefectParts}
				deleteID={modal?.openDeleteModal?.id}
				handleRemoveData={handleDelete}
				getError={(error) =>
					dispatch(showError(error || "Could not delete part"))
				}
			/>

			<AccordionBox
				title={`${captions?.partPlural} (${parts?.length})`}
				isActionsPresent={isReadOnly ? false : true}
				buttonName={`Add ${captions?.part}`}
				buttonAction={onOpenAddDialog}
				accordianDetailsCss="table-container"
			>
				{loading ? (
					<CircularProgress />
				) : (
					<Table>
						<TableHead className={classes.tableHead}>
							<TableRow>
								<TableCell style={{ width: "170px" }}>
									{captions?.partQuantity}
								</TableCell>
								<TableCell>{captions?.partName}</TableCell>
								<TableCell>{captions?.partDescription}</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{parts?.map((row) => (
								<Row
									key={row.id}
									row={row}
									classes={classes}
									onDeleteNote={onOpenDeleteDialog}
									isReadOnly={isReadOnly}
								/>
							))}
						</TableBody>
					</Table>
				)}
			</AccordionBox>
		</div>
	);
};

export default Notes;
