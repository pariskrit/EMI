import { CircularProgress, LinearProgress, Link } from "@mui/material";
import DetailsPanel from "components/Elements/DetailsPanel";
import SearchField from "components/Elements/SearchField/SearchField";
import {
	isoDateWithoutTimeZone,
	debounce,
	getLocalStorageData,
	getFormattedLink,
} from "helpers/utils";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showError } from "redux/common/actions";
import AddNewNoticeBoardDetail from "./AddNoticeBoard";
import Header from "./Header";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import NoticeBoardListTable from "./NoticeBoardListTable";

import { defaultPageSize } from "helpers/utils";
import ColourConstants from "helpers/colourConstants";
import { useUserSearch } from "hooks/useUserSearch";
import DeleteDialog from "components/Elements/DeleteDialog";
import {
	getCountOfNoticeBoardsList,
	getNoticeBoardsList,
	postNewNoticeBoards,
	postNewNoticeBoardsFile,
} from "services/noticeboards/noticeBoardsList";
import {
	NoticeBoardsTableColumns,
	NoticeBoardsTableHeader,
} from "constants/NoticeBoards";
import TabTitle from "components/Elements/TabTitle";
import HistoryBar from "components/Modules/HistorySidebar/HistoryBar";
import { noticeBoardsPage } from "services/History/models";
import { HistoryCaptions } from "helpers/constants";

const useStyles = makeStyles()((theme) => ({
	loading: {
		position: "absolute",
		width: "100%",
		left: 0,
		top: 0,
		right: 0,
	},
}));

const formattedData = (data) => {
	return data.map((x) => ({
		...x,
		name: (
			<Link
				style={{
					color: ColourConstants.activeLink,
					cursor: "pointer",
					textDecoration: "underline",
				}}
				href={
					x?.documentURL !== null ? x?.documentURL : getFormattedLink(x?.link)
				}
				download={x?.name}
				target="_blank"
				rel="noopener"
			>
				{x.name}
			</Link>
		),
		// expiryDate: x.expiryDate ? isoDateWithoutTimeZone(x.expiryDate + "Z") : "",
	}));
};

function NoticeBoardsList() {
	// init hooks
	const dispatch = useDispatch();
	const { classes, cx } = useStyles();
	const {
		allData,
		setAllData,
		searchedData,
		searchQuery,
		setSearchData,
		setSearchQuery,
	} = useUserSearch();

	// gets localstoarge || sessionStorage data
	const {
		customCaptions,
		siteAppID,
		siteID,
		application,
		position: { noticeboardAccess },
	} = getLocalStorageData("me");

	// init state
	const [currentTableSort, setCurrentTableSort] = useState(["", "asc"]);
	const [openAddNoticeBoard, setOpenAddNoticeBoard] = useState(false);
	const [countOFNoticeBoard, setCountOfNoticeBoard] = useState(0);
	const [loading, setLoading] = useState(true);
	const [isSearching, setSearching] = useState(false);
	const [deleteID, setDeleteID] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [noticeToEdit, setNoticeTOEdit] = useState({
		openEdit: false,
		notice: {},
	});

	const [dataForFetchingNoticeBoard, setDataForFetchingNoticeBoard] = useState({
		pageNumber: 1,
		pageSize: defaultPageSize(),
		search: "",
		sortField: "",
		sort: "",
	});

	const searchRef = useRef("");

	// attemp to fetch noticeboards list
	const fetchNoticeBoardsList = useCallback(
		async ({ search = "", sortField, sortOrder, shouldCount = true }) => {
			try {
				const response = await Promise.all([
					getNoticeBoardsList({
						siteAppId: siteAppID,
						search,
						sortField,
						sortOrder,
					}),
					shouldCount &&
						getCountOfNoticeBoardsList({
							siteAppId: siteAppID,
							search,
						}),
				]);
				if (response[0].status) {
					setAllData(response[0].data);
					response[1].status && setCountOfNoticeBoard(response[1].data);
					setDataForFetchingNoticeBoard((prev) => ({ ...prev, pageNumber: 1 }));
				} else {
					dispatch(
						showError(
							response?.data?.detail ||
								`Failed to fetch ${customCaptions?.tutorial} list`
						)
					);
				}
			} catch (error) {
				dispatch(
					showError(
						error?.response?.detail ||
							`Failed to fetch ${customCaptions?.tutorial} list`
					)
				);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			siteAppID,
			dispatch,
			setAllData,
			searchRef.current,
			// eslint-disable-next-line react-hooks/exhaustive-deps
			// eslint-disable-next-line react-hooks/exhaustive-deps
			dataForFetchingNoticeBoard.pageNumber,
		]
	);

	// calling noticeboard list api after mounting
	useEffect(() => {
		const fetchData = async () => {
			const [,] = await Promise.all([
				fetchNoticeBoardsList({
					search: "",
					sortField: currentTableSort[0],
					sortOrder: currentTableSort[1],
				}),
			]);

			setLoading(false);
		};
		fetchData();
		document.body.style.overflowX = "hidden";
		document.body.style.maxWidth = "100%";
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [siteID]);

	// searching for noticeboard
	const handleSearch = useCallback(
		debounce(async (value, sortField, sortOrder) => {
			setSearching(true);
			searchRef.current = value;
			await fetchNoticeBoardsList({
				search: value,
				sortField,
				sortOrder,
			});
			if (!value || value === "")
				setDataForFetchingNoticeBoard({
					pageNumber: 1,
					pageSize: defaultPageSize(),
					search: "",
					sortField: "",
					sort: "",
				});
			setSearching(false);
		}, 500),
		[]
	);

	// calling add new noticeBoard api
	const addNewFeedback = async (payload) => {
		let response, callApi;
		if (payload.file) {
			response = await postNewNoticeBoardsFile({ filename: payload.file.name });
			if (response.status) {
				try {
					await fetch(response.data.url, {
						method: "PUT",
						body: payload.file,
					});
					callApi = true;
				} catch (error) {
					callApi = false;
				}
			} else {
				callApi = false;
			}
		} else {
			callApi = true;
		}

		if (callApi) {
			return await postNewNoticeBoards({
				siteAppID: siteAppID,
				name: payload.name,
				documentKey: response?.data?.key ?? null,
				link: payload?.link !== "" ? payload.link : null,
				description: payload.description,
				expiryDate: payload.expiryDate,
				siteDepartments: payload.siteDepartments,
			});
		} else {
			return { status: false, data: { detail: "File Upload Failed" } };
		}
	};

	// opens DELETE noticeboard  popup
	const handleDeleteDialogOpen = (id) => {
		setDeleteID(id);
		setOpenDeleteDialog(true);
	};

	// open EDIT noticeboard popup
	const handleEditDialogOpen = (notice) => {
		const localNoticeToEdit = allData.find((x) => x.id === notice.id);
		setNoticeTOEdit({ openEdit: true, notice: localNoticeToEdit });
	};

	// remove noticeboard from client table list after successfull deletion of noticeboard
	const handleRemoveData = (id) => {
		setAllData([...allData.filter((d) => d.id !== id)]);
		setCountOfNoticeBoard((prev) => prev - 1);
	};

	const mainData = searchQuery.length === 0 ? allData : allData;
	const { isHistoryDrawerOpen } = useSelector((state) => state.commonData);
	if (loading) return <CircularProgress />;

	return (
		<>
			<TabTitle
				title={`${customCaptions.tutorialPlural} | ${application.name}`}
			/>
			{isSearching && <LinearProgress className={classes.loading} />}
			<HistoryBar
				id={siteAppID}
				showhistorybar={isHistoryDrawerOpen}
				dispatch={dispatch}
				fetchdata={(id, pageNumber, pageSize) =>
					noticeBoardsPage(id, pageNumber, pageSize)
				}
				origin={HistoryCaptions.noticeBoard}
			/>
			<DeleteDialog
				entityName={customCaptions?.tutorial}
				open={openDeleteDialog}
				closeHandler={() => setOpenDeleteDialog(false)}
				deleteID={deleteID}
				deleteEndpoint={"/api/Noticeboards"}
				handleRemoveData={handleRemoveData}
			/>
			<AddNewNoticeBoardDetail
				open={openAddNoticeBoard}
				closeHandler={() => setOpenAddNoticeBoard(false)}
				siteAppId={siteAppID}
				title={"Add " + customCaptions?.tutorial}
				createProcessHandler={addNewFeedback}
				customCaptions={customCaptions}
				setSearchQuery={setSearchQuery}
				fetchData={() =>
					fetchNoticeBoardsList({
						search: "",
						sortField: currentTableSort[0],
						sortOrder: currentTableSort[1],
					})
				}
				setDataForFetchingNoticeBoard={setDataForFetchingNoticeBoard}
				siteID={siteID}
			/>
			<AddNewNoticeBoardDetail
				open={noticeToEdit.openEdit}
				closeHandler={() =>
					setNoticeTOEdit({
						openEdit: false,
						notice: {},
					})
				}
				siteAppId={siteAppID}
				title={"Edit " + customCaptions?.tutorial}
				createProcessHandler={addNewFeedback}
				customCaptions={customCaptions}
				setSearchQuery={setSearchQuery}
				fetchData={() =>
					fetchNoticeBoardsList({
						search: "",
						sortField: currentTableSort[0],
						sortOrder: currentTableSort[1],
					})
				}
				setDataForFetchingNoticeBoard={setDataForFetchingNoticeBoard}
				siteID={siteID}
				data={noticeToEdit.notice}
				isEdit={true}
			/>

			<div className="container">
				<Header
					setOpenAddNoticeBoard={setOpenAddNoticeBoard}
					dataLength={countOFNoticeBoard}
					noticeBoardCC={customCaptions?.tutorialPlural}
				/>
				<div
					className="detailsContainer"
					style={{ alignItems: "center", marginTop: "-15px" }}
				>
					<DetailsPanel
						showHeader={false}
						description={`Manage documents available in this application`}
					/>
					<SearchField
						searchQuery={dataForFetchingNoticeBoard?.search}
						setSearchQuery={(e) => {
							e.persist();
							setDataForFetchingNoticeBoard((prev) => ({
								...prev,
								search: e.target.value,
							}));
							handleSearch(
								e.target.value,
								currentTableSort[0],
								currentTableSort[1]
							);
						}}
					/>
				</div>
				<div style={{ height: 30 }}></div>
				<div className="dynamic-width-table">
					<NoticeBoardListTable
						data={mainData}
						headers={NoticeBoardsTableHeader(customCaptions)}
						columns={NoticeBoardsTableColumns()}
						setData={setAllData}
						handleSort={async (sortField, sort) => {
							setSearching(true);
							await fetchNoticeBoardsList({
								search: searchRef.current,
								sortField: sortField,
								sortOrder: sort,
								shouldCount: false,
							});
							setSearching(false);
						}}
						searchQuery={searchRef.current}
						formattedData={formattedData}
						searchedData={searchedData}
						setSearchData={setSearchData}
						handleDeleteDialogOpen={handleDeleteDialogOpen}
						handleEditDialogOpen={handleEditDialogOpen}
						searchText={searchRef.current}
						page={dataForFetchingNoticeBoard.pageNumber}
						countOFNoticeBoard={countOFNoticeBoard}
						setDataForFetchingNoticeBoard={setDataForFetchingNoticeBoard}
						siteAppID={siteAppID}
						currentTableSort={currentTableSort}
						setCurrentTableSort={setCurrentTableSort}
						content={customCaptions?.tutorial}
						isReadOnly={noticeboardAccess === "R"}
					/>
				</div>
			</div>
		</>
	);
}

export default NoticeBoardsList;
