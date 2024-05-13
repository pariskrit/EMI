import { defaultPageSize, handleSort } from "helpers/utils";
import UsersListTable from "./UsersListTable";
import { useUserSearch } from "hooks/useUserSearch";
import { CircularProgress } from "@mui/material";
import ColourConstants from "helpers/colourConstants";
import { makeStyles } from "tss-react/mui";
import RestoreIcon from "@mui/icons-material/Restore";
import Typography from "@mui/material/Typography";
import {
	downloadUserCSVTemplate,
	getClientAdminUserList,
	getClientAdminUserListCount,
	getSiteAppUserList,
	getSiteAppUserListCount,
	getUsersList,
	getUsersListCount,
	resendInvitation,
} from "services/users/usersList";
import React, { useState, useEffect, useCallback } from "react";
import ContentStyle from "styles/application/ContentStyle";
import { Grid } from "@mui/material";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";

import AddUserDialog from "./AddUserDialog";
import DeleteDialog from "components/Elements/DeleteDialog";

import GeneralButton from "components/Elements/GeneralButton";
import mainAccess from "helpers/access";
import ImportContainer from "components/Modules/ImportContainer";
import { Apis } from "services/api";
import TabTitle from "components/Elements/TabTitle";
import { setHistoryDrawerState, showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import { REMOVE } from "constants/UserConstants/indes";
import roles from "helpers/roles";

const AC = ContentStyle();

const media = "@media(max-width: 414px)";

const useStyles = makeStyles()((theme) => ({
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
	restore: {
		border: "2px solid",
		borderRadius: "100%",
		height: "35px",
		width: "35px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "#307ad6",
	},
}));

const defaultPageProperties = { pageNo: 1, perPage: defaultPageSize() };

const UsersListContent = ({ getError }) => {
	const { classes, cx } = useStyles();
	const {
		position,
		role,
		siteAppID,
		siteID,
		isSiteUser,
		customCaptions,
		application,
		adminType,
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const clientUserId =
		JSON.parse(sessionStorage.getItem("clientUserId")) ||
		JSON.parse(localStorage.getItem("clientUserId"));

	const [currentTableSort, setCurrentTableSort] = useState([
		"firstName",
		"asc",
	]);
	const [searchTxt, setSearchTxt] = useState("");
	const [user, setUser] = useState("");

	const access = position?.[mainAccess.userAccess];
	const dispatch = useDispatch();

	//Init State
	const [haveData, setHaveData] = useState(false);

	const [modal, setModal] = useState({ import: false, add: false });

	const [deleteID, setDeleteID] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	const [page, setPage] = useState(defaultPageProperties);
	const [count, setCount] = useState(null);

	// const searchRef = useRef("");

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
		async (pNo, numberOfDataToGet = null) => {
			try {
				let result = null,
					usercount = null;

				// user is Site Application User
				if (siteAppID) {
					result = await getSiteAppUserList(
						siteAppID,
						pNo,
						numberOfDataToGet ?? defaultPageSize(),
						searchTxt,
						currentTableSort[1],
						currentTableSort[0]
					);
					usercount = await getSiteAppUserListCount(siteAppID, searchTxt);
				}

				// user is Client Admin
				if (role === roles.clientAdmin && !siteAppID) {
					result = await getClientAdminUserList(
						clientUserId,
						pNo,
						numberOfDataToGet ?? defaultPageSize(),
						searchTxt,
						currentTableSort[1],
						currentTableSort[0]
					);
					usercount = await getClientAdminUserListCount(
						clientUserId,
						searchTxt
					);
				}

				// user is Super Admin
				if (role === roles.superAdmin) {
					result = await getUsersList(
						pNo,
						numberOfDataToGet ?? defaultPageSize(),
						searchTxt,
						currentTableSort[1],
						currentTableSort[0]
					);
					usercount = await getUsersListCount(searchTxt);
				}

				if (result.status) {
					result = result.data;

					setAllData(result);
					setCount(usercount.data);
					return true;
				} else {
					// Throwing error if failed
					throw new Error(`Error: Status ${result.status}`);
				}
			} catch (err) {
				dispatch(
					showError(`Failed to load  ${customCaptions?.userPlural || "users"}.`)
				);
				return err;
			}
		},
		[setAllData, clientUserId, role, siteAppID, currentTableSort, searchTxt]
	);

	useEffect(() => {
		fetchData(1)
			.then(() => {
				setHaveData(true);
			})
			.catch((err) =>
				dispatch(
					showError(`Failed to load ${customCaptions?.userPlural || "users"}.`)
				)
			);
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
		setUser(`${rowData?.firstName} ${rowData?.lastName}`);
		if (role === roles.clientAdmin && !isSiteUser)
			setDeleteID(rowData.clientUserID);

		if (role === roles.superAdmin) setDeleteID(rowData.id);
		if (role === roles.siteUser || isSiteUser)
			setDeleteID(rowData.clientUserSiteAppID);

		setOpenDeleteDialog(true);
	};

	const closeDeleteDialog = () => setOpenDeleteDialog(false);

	const handleRemoveData = () => {
		let totalData = null;
		if (role === roles.clientAdmin && !isSiteUser)
			totalData = [...allData.filter((data) => data.clientUserID !== deleteID)];

		if (role === roles.superAdmin)
			totalData = [...allData.filter((data) => data.id !== deleteID)];
		if (role === roles.siteUser || isSiteUser)
			totalData = [
				...allData.filter((data) => data.clientUserSiteAppID !== deleteID),
			];
		setAllData(totalData);
		setPage(defaultPageProperties);

		fetchData(1);
	};

	//Pagination
	const handlePage = async (
		p,
		prevData,
		searchText,
		sort = "",
		sortField = ""
	) => {
		try {
			let response = null;

			if (role === roles.siteUser || isSiteUser)
				response = await getSiteAppUserList(
					siteAppID,
					p,
					defaultPageSize(),
					// searchRef.current
					searchText,
					sort,
					sortField
				);

			if (role === roles.superAdmin)
				response = await getUsersList(
					p,
					defaultPageSize(),
					searchText,
					sort,
					sortField
				);

			if (role === roles.clientAdmin && !isSiteUser)
				response = await getClientAdminUserList(
					clientUserId,
					p,
					defaultPageSize(),
					searchText,
					sort,
					sortField
				);

			if (response.status) {
				let response2 = { data: [...prevData, ...response.data] };
				setPage({ pageNo: p, rowsPerPage: defaultPageSize() });
				setAllData([...prevData, ...response.data]);
				return response2;
			} else {
				throw new Error(response);
			}
		} catch (err) {
			dispatch(
				showError(
					`Failed to load more ${customCaptions?.userPlural || "users"}.`
				)
			);
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
			// if (value === "") setPage(defaultPageProperties);
			if (searchTxt !== value) {
				setPage(defaultPageProperties);
			}
			setSearchTxt(value);
			// fetchData(1, null, value);
		}, 500),
		[]
	);

	const handleResendInvitation = async (val) => {
		try {
			const result = await resendInvitation({ email: val.email });
			if (!result.status) {
				dispatch(showError(result.data || "Failed to send invitation"));
			}
		} catch (err) {
			dispatch(showError(err?.data || "Failed to send invitation"));
		}
	};

	const handleDownloadCsvTemplate = () => {
		return downloadUserCSVTemplate(apis[role].downloadTemplate);
	};
	const apiByRole =
		role === roles.siteUser || (role === roles.clientAdmin && isSiteUser)
			? apis[roles.siteUser]
			: role === roles.clientAdmin && !isSiteUser
			? apis[roles.clientAdmin]
			: apis[roles.superAdmin];

	const userRole =
		role === roles.superAdmin
			? "Superadmin"
			: role === roles.clientAdmin && !siteAppID
			? "Client"
			: "Application";
	return (
		<div className="container">
			{!application ? (
				<TabTitle title="Users" />
			) : (
				<TabTitle
					title={`${customCaptions?.userPlural} | ${application?.name}`}
				/>
			)}

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
				adminType={adminType}
			/>

			<DeleteDialog
				entityName="User"
				open={openDeleteDialog}
				closeHandler={closeDeleteDialog}
				deleteID={deleteID}
				deleteEndpoint={apiByRole.delete}
				handleRemoveData={handleRemoveData}
				deleteButton={REMOVE}
				deleteMsg={`${user} will lose access to this  ${userRole} Account, but they won't be deleted from EMI3.`}
			/>

			<div className={classes.listActions}>
				<div className={classes.headerContainer}>
					<Typography
						className={classes.headerText}
						component="h1"
						gutterBottom
					>
						{!count ? (
							<strong>{`${customCaptions?.userPlural ?? "Users"} List`}</strong>
						) : (
							<strong>{`${
								customCaptions?.userPlural ?? "Users"
							} List (${count})`}</strong>
						)}
					</Typography>
					{haveData && (access === "F" || !siteAppID) ? (
						<div className={classes.buttonContainer}>
							{role !== roles.superAdmin && (
								<GeneralButton
									onClick={() => setModal((th) => ({ ...th, import: true }))}
									style={{ backgroundColor: "#ed8738" }}
								>
									IMPORT FROM LIST
								</GeneralButton>
							)}
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
										variant="standard"
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
					headers={
						siteID
							? [
									"First Name",
									"Surname",
									"Email Address",
									`${customCaptions?.department ?? "Department"}`,
									`${customCaptions?.position ?? "Position"}`,
									"Status",
							  ]
							: role === roles.superAdmin
							? ["First Name", "Surname", "Email Address", "Type", "Status"]
							: [
									"First Name",
									"Surname",
									"Email Address",
									"Status",
									"Client Administrator",
							  ]
					}
					columns={
						siteID
							? [
									"firstName",
									"lastName",
									"email",
									"departmentName",
									"positionName",
									"active",
							  ]
							: role === roles.superAdmin
							? ["firstName", "lastName", "email", "Type", "active"]
							: ["firstName", "lastName", "email", "active", "isAdmin"]
					}
					setData={setAllData}
					handleSort={handleSort}
					searchQuery={searchQuery}
					searchedData={searchedData}
					setSearchData={setSearchData}
					handleDeleteDialogOpen={handleDeleteDialogOpen}
					searchText={searchTxt}
					onPageChange={handlePage}
					page={page.pageNo}
					count={count}
					position={position}
					access={access}
					setCurrentTableSort={setCurrentTableSort}
					currentTableSort={currentTableSort}
					setPage={setPage}
					handleResendInvitation={handleResendInvitation}
				/>
			) : (
				<CircularProgress />
			)}
		</div>
	);
};

export default UsersListContent;
