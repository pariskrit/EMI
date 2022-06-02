import { handleSort } from "helpers/utils";
import UsersListTable from "./UsersListTable";
import { useUserSearch } from "hooks/useUserSearch";
import { CircularProgress } from "@material-ui/core";
import ColourConstants from "helpers/colourConstants";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
	downloadUserCSVTemplate,
	getClientAdminUserList,
	getClientAdminUserListCount,
	getSiteAppUserList,
	getSiteAppUserListCount,
	getUsersList,
	getUsersListCount,
} from "services/users/usersList";
import React, { useState, useEffect, useCallback, useRef } from "react";
import ContentStyle from "styles/application/ContentStyle";
import { Grid } from "@material-ui/core";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";

import AddUserDialog from "./AddUserDialog";
import DeleteDialog from "components/Elements/DeleteDialog";

import { DefaultPageSize } from "helpers/constants";
import GeneralButton from "components/Elements/GeneralButton";
import mainAccess from "helpers/access";
import ImportContainer from "components/Modules/ImportContainer";
import { Apis } from "services/api";

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

const defaultPageProperties = { pageNo: 1, perPage: DefaultPageSize };

const UsersListContent = ({ getError }) => {
	const classes = useStyles();
	const { position, role, siteAppID, siteID, isSiteUser, customCaptions } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const clientUserId =
		JSON.parse(sessionStorage.getItem("clientUserId")) ||
		JSON.parse(localStorage.getItem("clientUserId"));

	const access = position?.[mainAccess.userAccess];

	//Init State
	const [haveData, setHaveData] = useState(false);

	const [modal, setModal] = useState({ import: false, add: false });

	const [deleteID, setDeleteID] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	const [page, setPage] = useState(defaultPageProperties);
	const [count, setCount] = useState(null);

	const searchRef = useRef("");

	const {
		allData,
		setAllData,
		searchedData,
		searchQuery,
		setSearchData,
		setSearchQuery,
	} = useUserSearch();

	// Csv import and delete Apis for site user, client admin and super admin
	const apis = {
		SiteUser: {
			downloadTemplate: Apis.Applications,
			upload: `${Apis.Applications}/${siteAppID}/uploadUserList`,
			import: `${Apis.Applications}/${siteAppID}/importusers`,
			delete: Apis.ClientUserSiteApps,
		},
		ClientAdmin: {
			downloadTemplate: Apis.Clients,
			upload: `${Apis.Clients}/${clientUserId}/uploadUserList`,
			import: `${Apis.Clients}/${clientUserId}/importusers`,
			delete: Apis.userDetailSites,
		},
		SuperAdmin: {
			downloadTemplate: Apis.UsersList,
			upload: `${Apis.UsersList}/uploadUserList`,
			import: `${Apis.UsersList}/importusers`,
			delete: Apis.UsersList,
		},
	};

	const fetchData = useCallback(
		async (pNo, numberOfDataToGet = null, searchText) => {
			try {
				let result = null,
					count = null;

				// user is Site Application User
				if (siteAppID) {
					result = await getSiteAppUserList(
						siteAppID,
						pNo,
						numberOfDataToGet ?? DefaultPageSize,
						searchText
					);
					count = await getSiteAppUserListCount(siteAppID, searchText);
				}
				// user is Client Admin
				if (role === "ClientAdmin" && !siteAppID) {
					result = await getClientAdminUserList(
						clientUserId,
						pNo,
						numberOfDataToGet ?? DefaultPageSize,
						searchText
					);
					count = await getClientAdminUserListCount(clientUserId, searchText);
				}

				// user is Super Admin
				if (role === "SuperAdmin") {
					result = await getUsersList(
						pNo,
						numberOfDataToGet ?? DefaultPageSize,
						searchText
					);
					count = await getUsersListCount(searchText);
				}

				if (result.status) {
					result = result.data;

					setAllData(result);
					setCount(count.data);
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
	const handleDeleteDialogOpen = (rowData) => {
		if (role === "ClientAdmin" && !isSiteUser)
			setDeleteID(rowData.clientUserID);

		if (role === "SuperAdmin") setDeleteID(rowData.id);
		if (role === "SiteUser" || isSiteUser)
			setDeleteID(rowData.clientUserSiteAppID);

		setOpenDeleteDialog(true);
	};

	const closeDeleteDialog = () => setOpenDeleteDialog(false);

	const handleRemoveData = () => {
		let totalData = null;
		if (role === "ClientAdmin" && !isSiteUser)
			totalData = [...allData.filter((data) => data.clientUserID !== deleteID)];

		if (role === "SuperAdmin")
			totalData = [...allData.filter((data) => data.id !== deleteID)];
		if (role === "SiteUser" || isSiteUser)
			totalData = [
				...allData.filter((data) => data.clientUserSiteAppID !== deleteID),
			];
		setAllData(totalData);
		setPage(defaultPageProperties);

		fetchData(1);
	};

	//Pagination
	const handlePage = async (p, prevData) => {
		try {
			let response = null;

			if (role === "SiteUser" || isSiteUser)
				response = await getSiteAppUserList(
					siteAppID,
					p,
					DefaultPageSize,
					searchRef.current
				);

			if (role === "SuperAdmin")
				response = await getUsersList(p, DefaultPageSize, searchRef.current);

			if (role === "ClientAdmin" && !isSiteUser)
				response = await getClientAdminUserList(
					clientUserId,
					p,
					DefaultPageSize,
					searchRef.current
				);

			if (response.status) {
				let response2 = { data: [...prevData, ...response.data] };
				setPage({ pageNo: p, rowsPerPage: DefaultPageSize });
				setAllData([...prevData, ...response.data]);
				return response2;
			} else {
				throw new Error(response);
			}
		} catch (err) {
			console.log(err);
			return err;
		}
	};
	const importSuccess = () => {
		setPage(defaultPageProperties);
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
			if (value === "") setPage(defaultPageProperties);

			searchRef.current = value;
			fetchData(1, null, value);
		}, 500),
		[]
	);

	const handleDownloadCsvTemplate = () => {
		return downloadUserCSVTemplate(apis[role].downloadTemplate);
	};

	const apiByRole =
		role === "SiteUser" || (role === "ClientAdmin" && isSiteUser)
			? apis["SiteUser"]
			: role === "ClientAdmin" && !isSiteUser
			? apis["ClientAdmin"]
			: apis["SuperAdmin"];
	return (
		<div className="container">
			<ImportContainer
				open={modal.import}
				handleClose={() => setModal((th) => ({ ...th, import: false }))}
				importSuccess={importSuccess}
				siteAppID={siteAppID}
				importApi={apis[role].import}
				uploadApi={apis[role].upload}
				handleDownloadTemplate={handleDownloadCsvTemplate}
			/>

			<AddUserDialog
				open={modal.add}
				handleClose={() => setModal((th) => ({ ...th, add: false }))}
				handleAddData={handleAddData}
				setSearchQuery={setSearchQuery}
				getError={getError}
				role={role}
				isSiteUser={isSiteUser}
				siteID={siteID}
				siteAppID={siteAppID}
				customCaptions={customCaptions}
			/>

			<DeleteDialog
				entityName="User"
				open={openDeleteDialog}
				closeHandler={closeDeleteDialog}
				deleteID={deleteID}
				deleteEndpoint={apiByRole.delete}
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
			{haveData ? (
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
					count={count}
					position={position}
					access={access}
				/>
			) : (
				<CircularProgress />
			)}
		</div>
	);
};

export default UsersListContent;
