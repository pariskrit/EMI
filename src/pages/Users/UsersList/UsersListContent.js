import { handleSort } from "helpers/utils";
import UsersListTable from "./UsersListTable";
import Button from "@material-ui/core/Button";
import { useUserSearch } from "hooks/useUserSearch";
import { CircularProgress } from "@material-ui/core";
import ColourConstants from "helpers/colourConstants";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { getUsersList } from "services/users/usersList";
import ActionButtonStyle from "styles/application/ActionButtonStyle";
import React, { useState, useEffect, useCallback, useRef } from "react";

import SearchField from "components/Elements/SearchField/SearchField";
import MobileSearchField from "components/Elements/SearchField/MobileSearchField";

import AddUserDialog from "./AddUserDialog";
import ImportListDialog from "./ImportListDialog";
import DeleteDialog from "components/Elements/DeleteDialog";

import { DefaultPageSize } from "helpers/constants";
import DragAndDropTable from "components/HOC/DragAndDropTable";

const AT = ActionButtonStyle();

const media = "@media(max-width: 414px)";

const useStyles = makeStyles({
	listActions: {
		marginBottom: 30,
	},
	headerContainer: {
		display: "flex",
		[media]: {
			flexDirection: "column",
		},
	},
	headerText: {
		fontSize: 21,
	},
	buttonContainer: {
		display: "flex",
		marginLeft: "auto",
		[media]: {
			marginLeft: 0,
		},
	},
	importButton: {
		background: "#ED8738",
	},
	productButton: {
		backgroundColor: ColourConstants.confirmButton,
		color: "#FFFFFF",
		fontSize: 15,
		fontFamily: "Roboto Condensed",
		width: 150,
	},
});

const UsersListContent = ({ getError }) => {
	const classes = useStyles();

	//Init State
	const [haveData, setHaveData] = useState(false);

	const [dataCount, setDataCount] = useState(null);
	const [modal, setModal] = useState({ import: false, add: false });

	const [deleteID, setDeleteID] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	const [page, setPage] = useState({ pageNo: 1, perPage: DefaultPageSize });

	const searchRef = useRef("");

	const {
		allData,
		setAllData,
		handleSearch,
		searchedData,
		searchQuery,
		setSearchData,
		setSearchQuery,
	} = useUserSearch();

	const fetchData = useCallback(
		async (pNo) => {
			try {
				let result = await getUsersList(pNo, DefaultPageSize, "");

				if (result.status) {
					result = result.data;

					setAllData(result);
					setDataCount(result.length);
					return true;
				} else {
					// Throwing error if failed
					throw new Error(`Error: Status ${result.status}`);
				}
			} catch (err) {
				console.log(err);
				return err;
			}
		},
		[setAllData]
	);

	useEffect(() => {
		fetchData(1)
			.then(() => {
				setHaveData(true);
			})
			.catch((err) => console.log("ERROR : ", err));
	}, [fetchData]);

	const mainData = searchQuery.length === 0 ? allData : searchedData;

	//Handler
	//Add
	const handleAddData = (d) => {
		const newData = [...allData];

		newData.push(d);

		setAllData(newData);
	};

	//DELETE
	const handleDeleteDialogOpen = (id) => {
		setDeleteID(id);

		setOpenDeleteDialog(true);
	};

	const closeDeleteDialog = () => setOpenDeleteDialog(false);

	const handleRemoveData = (id) =>
		setAllData([...allData.filter((d) => d.id !== id)]);

	//Pagination
	const handlePage = async (p, prevData) => {
		try {
			const response = await getUsersList(
				p,
				DefaultPageSize,
				searchRef.current
			);
			if (response.status) {
				setPage({ pageNo: p, rowsPerPage: DefaultPageSize });
				setAllData([...prevData, ...response.data]);
				response.data = [...prevData, ...response.data];
				return response;
			} else {
				throw new Error(response);
			}
		} catch (err) {
			console.log(err);
			return err;
		}
	};

	const importSuccess = () => {
		fetchData(1);
	};

	return (
		<div className="container">
			<ImportListDialog
				open={modal.import}
				handleClose={() => setModal((th) => ({ ...th, import: false }))}
				importSuccess={importSuccess}
				getError={getError}
			/>

			<AddUserDialog
				open={modal.add}
				handleClose={() => setModal((th) => ({ ...th, add: false }))}
				handleAddData={handleAddData}
				setSearchQuery={setSearchQuery}
				getError={getError}
			/>

			<DeleteDialog
				entityName="User"
				open={openDeleteDialog}
				closeHandler={closeDeleteDialog}
				deleteID={deleteID}
				deleteEndpoint="/api/users"
				handleRemoveData={handleRemoveData}
			/>

			<div className={classes.listActions}>
				<div className={classes.headerContainer}>
					<Typography
						className={classes.headerText}
						component="h1"
						gutterBottom
					>
						{allData.length === 0 ? (
							<strong>{"Users List"}</strong>
						) : (
							<strong>{`Users List (${allData.length})`}</strong>
						)}
					</Typography>
					{haveData ? (
						<div className={classes.buttonContainer}>
							<AT.GeneralButton
								onClick={() => setModal((th) => ({ ...th, import: true }))}
								className={classes.importButton}
							>
								Import from list
							</AT.GeneralButton>

							<Button
								variant="contained"
								className={classes.productButton}
								onClick={() => setModal((th) => ({ ...th, add: true }))}
							>
								Add New
							</Button>
						</div>
					) : null}
				</div>

				{haveData ? (
					<>
						<SearchField
							searchQuery={searchQuery}
							setSearchQuery={handleSearch}
							header="users"
						/>
						<MobileSearchField
							searchQuery={searchQuery}
							setSearchQuery={handleSearch}
							header="users"
						/>
					</>
				) : null}
			</div>
			{haveData ? (
				<DragAndDropTable
					data={mainData}
					headers={["First Name", "Surname", "Email Address", "Phone"]}
					columns={["firstName", "lastName", "email", "phone"]}
					handleDelete={handleDeleteDialogOpen}
					handleEdit={(id) => console.log(id)}
					handleDragEnd={(e) => console.log(e)}
				/>
			) : (
				<CircularProgress />
			)}
		</div>
	);
};

export default UsersListContent;
