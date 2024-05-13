import React, { useEffect, useState } from "react";
import {
	CircularProgress,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import AccordionBox from "components/Layouts/AccordionBox";
import ColourConstants from "helpers/colourConstants";
import KeyContactRow from "./KeyContactRow";
import AddKeyContactDialog from "./AddKeyContactDialog";
import DeleteDialog from "./DeleteDialog";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import {
	addSiteAppKeyContact,
	deleteSiteAppKeyContact,
	getSiteAppKeyContacts,
} from "services/clients/sites/siteApplications/siteApplicationDetails";

const useStyles = makeStyles()((theme) => ({
	noteContainer: {
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

const KeyContacts = ({ data, details, loading, isReadOnly }) => {
	const { classes, cx } = useStyles();
	const [modal, setModal] = useState({
		openAddModal: false,
		openDeleteModal: false,
		openContentModal: false,
	});
	const [keyContact, setKeyContacts] = useState([]);
	const [isDeleting, setIsDeleting] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		if (Array.isArray(data)) {
			setKeyContacts(data);
		}
	}, [data]);

	const handleAddKeyContact = async (userID) => {
		const response = await addSiteAppKeyContact({
			siteAppID: details.data.id,
			userID,
		});

		if (response.status) {
			const result = await getSiteAppKeyContacts(details.data.id);
			if (result.status) {
				setKeyContacts(result.data);
			}
		} else {
			dispatch(
				showError(
					response?.data?.detail ||
						response?.data?.error ||
						"Could not add key contact"
				)
			);
		}
	};

	const handleDelete = async () => {
		const {
			openDeleteModal: { id },
		} = modal;
		setIsDeleting(true);
		const response = await deleteSiteAppKeyContact(id);

		if (response.status) {
			setKeyContacts([...keyContact.filter((note) => note.id !== id)]);
		} else {
			dispatch(
				showError(
					response?.data?.detail ||
						response?.data?.error ||
						"Could not delete key contact"
				)
			);
		}

		setIsDeleting(false);
		onCloseDeleteDialog();
	};

	const onOpenDeleteDialog = (id) =>
		setModal({ ...modal, openDeleteModal: { id, open: true } });

	const onCloseDeleteDialog = () =>
		setModal({ ...modal, openDeleteModal: false });

	const onOpenAddDialog = () =>
		setModal((prev) => ({ ...prev, openAddModal: true }));

	const onCloseAddDialog = () =>
		setModal((prev) => ({ ...prev, openAddModal: false }));

	return (
		<div className={classes.noteContainer}>
			<AddKeyContactDialog
				open={modal.openAddModal}
				handleClose={onCloseAddDialog}
				createHandler={handleAddKeyContact}
				siteAppId={details.data?.id}
				setKeyContacts={setKeyContacts}
			/>
			<DeleteDialog
				entityName="Key Contact"
				open={modal?.openDeleteModal?.open ?? false}
				closeHandler={onCloseDeleteDialog}
				handleDelete={handleDelete}
				isDeleting={isDeleting}
			/>

			<AccordionBox
				title={`Key Contacts (${keyContact?.length})`}
				isActionsPresent={true && !isReadOnly}
				buttonName="Add Key Contacts"
				buttonAction={onOpenAddDialog}
				accordianDetailsCss="table-container"
			>
				{loading ? (
					<CircularProgress />
				) : (
					<Table>
						<TableHead className={classes.tableHead}>
							<TableRow>
								<TableCell style={{ width: "170px" }}>Name</TableCell>
								<TableCell>Email</TableCell>
								<TableCell></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{keyContact?.map((row) => (
								<KeyContactRow
									key={row.id}
									row={row}
									classes={classes}
									isReadOnly={isReadOnly}
									onDeleteNote={onOpenDeleteDialog}
								/>
							))}
						</TableBody>
					</Table>
				)}
			</AccordionBox>
		</div>
	);
};

export default KeyContacts;
