import { handleSort } from "helpers/utils";
import UsersListTable from "./UsersListTable";
import { useUserSearch } from "hooks/useUserSearch";
import { CircularProgress } from "@material-ui/core";
import ColourConstants from "helpers/colourConstants";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
	getClientAdminUserList,
	getSiteAppUserList,
	getUsersList,
} from "services/users/usersList";
import React, { useState, useEffect, useCallback, useRef } from "react";
import ContentStyle from "styles/application/ContentStyle";
import { Grid } from "@material-ui/core";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";

import AddUserDialog from "./AddUserDialog";
import ImportListDialog from "./ImportListDialog";
import DeleteDialog from "components/Elements/DeleteDialog";

import { DefaultPageSize } from "helpers/constants";
import GeneralButton from "components/Elements/GeneralButton";
import mainAccess from "helpers/access";
import RoleWrapper from "components/Modules/RoleWrapper";
import role from "helpers/roles";

const AC = ContentStyle();

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
		fontFamily: "Roboto Condensed",
		width: 150,
		fontSize: "13.5px",
		fontWeight: "bold",
		marginRight: "10px",
	},
});

const UsersListContent = ({ getError }) => {
	const classes = useStyles();
	const { position, role, siteAppID } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const clientUserId =
		JSON.parse(sessionStorage.getItem("clientUserId")) ||
		JSON.parse(localStorage.getItem("clientUserId"));

	const access = position?.[mainAccess.userAccess];

	//Init State
	const [haveData, setHaveData] = useState(false);

	// const [dataCount, setDataCount] = useState(null);
	const [modal, setModal] = useState({ import: false, add: false });

	const [deleteID, setDeleteID] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	const [page, setPage] = useState({ pageNo: 1, perPage: DefaultPageSize });

	const searchRef = useRef("");

	const {
		allData,
		setAllData,
		searchedData,
		searchQuery,
		setSearchData,
		setSearchQuery,
	} = useUserSearch();

	const fetchData = useCallback(
		async (pNo, searchText) => {
			try {
				let result = null;
				if (role === "ClientAdmin")
					result = await getClientAdminUserList(clientUserId);

				if (role === "SiteUser") result = await getSiteAppUserList(siteAppID);

				if (role === "SuperAdmin")
					result = await getUsersList(pNo, DefaultPageSize, searchText);

				if (result.status) {
					result = result.data;

					setAllData(result);
					// setDataCount(result.length);
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
		[setAllData, clientUserId, role, siteAppID]
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

	const debounce = (func, delay) => {
		let timer;
		return function () {
			let self = this;
			let args = arguments;
			clearTimeout(timer);
			timer = setTimeout(() => {
				func.apply(self, args);
			}, delay);
		};
	};

	//handle search
	const handleSearch = useCallback(
		debounce((value) => {
			searchRef.current = value;
			fetchData(1, value);
		}, 500),
		[]
	);

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
						<RoleWrapper roles={[role.superAdmin]}>
							<div className={classes.buttonContainer}>
								<GeneralButton
									onClick={() => setModal((th) => ({ ...th, import: true }))}
									style={{ backgroundColor: "#ed8738" }}
								>
									IMPORT FROM LIST
								</GeneralButton>
								<GeneralButton
									onClick={() => setModal((th) => ({ ...th, add: true }))}
									style={{ backgroundColor: "#23bb79" }}
								>
									ADD NEW
								</GeneralButton>
							</div>
						</RoleWrapper>
					) : null}
				</div>

				{haveData ? (
					<AC.SearchContainer>
						<AC.SearchInner className="applicationSearchBtn">
							<Grid container spacing={1} alignItems="flex-end">
								<Grid item>
									<SearchIcon />
								</Grid>
								<Grid item>
									<AC.SearchInput
										onChange={(e) => handleSearch(e.target.value)}
										label="Search"
									/>
								</Grid>
							</Grid>
						</AC.SearchInner>
					</AC.SearchContainer>
				) : null}
			</div>
			{
				// position === null || access !== "N" ? (
				haveData ? (
					<UsersListTable
						data={mainData}
						headers={["First Name", "Surname", "Email Address", "Phone"]}
						columns={["firstName", "lastName", "email", "phone"]}
						setData={setAllData}
						handleSort={handleSort}
						searchQuery={searchQuery}
						searchedData={searchedData}
						setSearchData={setSearchData}
						handleDeleteDialogOpen={handleDeleteDialogOpen}
						searchText={searchRef.current}
						onPageChange={handlePage}
						page={page.pageNo}
						position={position}
						access={access}
					/>
				) : (
					<CircularProgress />
				)
				// ) : null
			}
		</div>
	);
};

export default UsersListContent;
