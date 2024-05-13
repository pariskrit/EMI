import {
	CircularProgress,
	Grid,
	LinearProgress,
	Link,
	Tooltip,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import DetailsPanel from "components/Elements/DetailsPanel";
import {
	isoDateWithoutTimeZone,
	debounce,
	MuiFormatDate,
	getLocalStorageData,
	defaultPageSize,
	customFromattedDate,
} from "helpers/utils";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAnalyticsShowData, showError } from "redux/common/actions";
import { getSiteDepartmentsInService } from "services/services/serviceLists";
import Header from "./Header";
import FilterListIcon from "@mui/icons-material/FilterList";
import { makeStyles } from "tss-react/mui";

import SafteryCritical from "assets/icons/safety-critical.svg";
import DefectListTable from "./DefectsListTable";
import {
	defaultTimeframe,
	filterByDateOptions,
} from "constants/serviceDetails";

import { appPath, defectsPath } from "helpers/routePaths";
import {
	DEFECTS_STORAGE_DEPARTMENT,
	DEFECTS_STORAGE_STATUS,
	DEFECTS_STORAGE_TIMEFRAME,
} from "helpers/constants";

import ColourConstants from "helpers/colourConstants";
import CustomDateRange from "./CustomDateRange";
import { useUserSearch } from "hooks/useUserSearch";
import DeleteDialog from "components/Elements/DeleteDialog";
import { changeDate } from "helpers/date";
import { getDefectStatuses } from "services/clients/sites/siteApplications/defectStatuses";
import {
	getCountOfDefectsList,
	getDefectAutocompleteSearch,
	getDefectsList,
} from "services/defects/defectsList";
import { DefectTableColumns, DefectTableHeader } from "constants/DefectDetails";
import TabTitle from "components/Elements/TabTitle";
import mainAccess from "helpers/access";
import AutoCompleteBox from "components/Elements/EMIChip/AutoCompleteBox";
import EMIChip from "components/Elements/EMIChip/EMIChip";
const HtmlTooltip = withStyles((theme) => ({
	tooltip: {
		backgroundColor: "#f5f5f9",
		color: "rgba(0, 0, 0, 0.87)",
		maxWidth: 220,
		fontSize: theme.typography.pxToRem(12),
		border: "1px solid #dadde9",
	},
}))(Tooltip);

const useStyles = makeStyles()((theme) => ({
	loading: {
		position: "absolute",
		width: "100%",
		left: 0,
		top: 0,
		right: 0,
	},
}));

const formattedData = (data, navigate) => {
	return data.map((x) => ({
		...x,
		modelName: x.modelModel ? x.modelName + " " + x.modelModel : x.modelName,
		taskName: x?.actionName ? x?.actionName + " " + x?.taskName : x?.taskName,
		defectStatusName: (
			<span
				style={{
					color: x?.defectStatusType === "C" ? ColourConstants.green : "",
				}}
			>
				{x?.defectStatusName}
			</span>
		),
		riskRatingName: (
			<span
				style={{
					color: x?.safetyCritical === true ? ColourConstants.red : "",
				}}
			>
				{x?.riskRatingName}
			</span>
		),
		number: (
			<Link
				onClick={() => navigate(`${appPath}${defectsPath}/${x.id}`)}
				style={{
					color: ColourConstants.activeLink,
					cursor: "pointer",
					textDecoration: "none",
				}}
			>
				{x.number}
			</Link>
		),
		safetyCritical:
			x.safetyCritical === true ? (
				<img src={SafteryCritical} alt="saftey critical" />
			) : (
				""
			),

		createdDateTime: isoDateWithoutTimeZone(x.createdDateTime + "Z"),
		details: (
			<HtmlTooltip title={x.details}>
				<p className="max-two-line">
					<Link
						onClick={() => navigate(`${appPath}${defectsPath}/${x.id}`)}
						style={{
							color: ColourConstants.commonText,
							cursor: "pointer",
							textDecoration: "none",
						}}
					>
						{x.details}
					</Link>
				</p>
			</HtmlTooltip>
		),
	}));
};

const defaultCustomDate = { from: "", to: "" };

function DefectsLists({
	statusFromMemory,
	departmentFromMemory,
	timeFrameFromMemory,
}) {
	// init hooks
	const dispatch = useDispatch();
	const { classes, cx } = useStyles();
	const { allData, setAllData, searchedData, searchQuery, setSearchData } =
		useUserSearch();

	// gets localstoarge || sessionStorage data
	const {
		customCaptions,
		position,
		siteAppID,
		siteID,
		application,
		site: { siteDepartmentID, siteDepartmentName },
	} = getLocalStorageData("me");
	//data from analytics page
	// let analyticsData = useSelector((state) => state?.commonData?.showData);
	let analyticsData = JSON.parse(localStorage.getItem("analyticaData"));
	//to manipulate the dropdown data when its redirected from the analytics page
	// const showDataKeys = Object.keys(analyticsData?.data);
	const showData = analyticsData?.data;

	// init state
	const [currentTableSort, setCurrentTableSort] = useState(["", "asc"]);
	const [countOFDefects, setCountOfDefect] = useState(0);
	const [loading, setLoading] = useState(true);
	const [isSearching, setSearching] = useState(false);
	const [isDropDownChanging, setDropDownChange] = useState(false);
	const [deleteID, setDeleteID] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [siteDepartments, setSiteDepartments] = useState([]);
	const [defectsStatus, setDefectsStatus] = useState([]);
	const [selectedTimeframe, setSelectedTimeframe] = useState(
		timeFrameFromMemory === null ? defaultTimeframe : timeFrameFromMemory
	);

	const [customDate, setCustomDate] = useState(
		timeFrameFromMemory !== null && timeFrameFromMemory.id === 7
			? {
					from: MuiFormatDate(timeFrameFromMemory.fromDate),
					to: MuiFormatDate(timeFrameFromMemory.toDate),
			  }
			: defaultCustomDate
	);
	const [openCustomDatePopup, setOpenCustomDatePopup] = useState(false);
	const [isCustomDateRangeError, setCustomDateRangeError] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState(
		statusFromMemory === null
			? { id: "O", name: "All Outstanding", statusType: "O" }
			: statusFromMemory
	);
	const [selectedDepartment, setSelectedDepartment] = useState(
		departmentFromMemory === null
			? { id: siteDepartmentID, name: siteDepartmentName }
			: departmentFromMemory
	);
	const [dataForFetchingDefect, setDataForFetchingDefect] = useState({
		pageNumber: 1,
		pageSize: defaultPageSize(),
		search: "",
		sortField: "",
		sort: "",
	});

	//autocomplete data from search query
	const [autocompleteData, setAutocompleteData] = useState([]);
	//chips
	const chipsArray = [];

	if (!analyticsData?.isRedirected && departmentFromMemory === null) {
		const departmentChip = {
			chipType: 3,
			id: siteDepartmentID,
			value: "",
		};
		chipsArray.push(departmentChip);
	}

	if (
		!analyticsData?.isRedirected &&
		departmentFromMemory !== null &&
		typeof departmentFromMemory?.id !== "string"
	) {
		const departmentChip = {
			chipType: 3,
			id: departmentFromMemory?.id,
			value: "",
		};
		chipsArray.push(departmentChip);
	}
	if (!analyticsData?.isRedirected && statusFromMemory === null) {
		const statusChip = {
			chipType: 1,
			id: 0,
			value: "O",
		};
		chipsArray.push(statusChip);
	}
	if (
		!analyticsData?.isRedirected &&
		statusFromMemory !== null &&
		typeof statusFromMemory?.id !== "string" &&
		!statusFromMemory.groupBy
	) {
		const statusChip = {
			chipType: 2,
			id: statusFromMemory?.id,
			value: "",
		};
		chipsArray.push(statusChip);
	}

	if (!analyticsData?.isRedirected && selectedStatus.id !== "") {
		const statusChip = {
			chipType: ["C", "N", "O"].includes(selectedStatus?.id) ? 1 : 2,
			id: ["C", "N", "O"].includes(selectedStatus?.id) ? 0 : selectedStatus.id,
			value: ["C", "N", "O"].includes(selectedStatus?.id)
				? selectedStatus?.id
				: "",
		};
		chipsArray.push(statusChip);
	}
	const [chips, setChips] = useState(chipsArray);

	const searchRef = useRef("");
	const apiRef = useRef({});

	// handling onChange for the 3 dropdowns
	const onDropdownChange = async (type, selectedItem) => {
		setSearching(true);
		setDropDownChange(true);
		// is a department dropdown and the selectedItem is different from the previously selected
		if (type === "department" && selectedItem.id !== selectedDepartment.id) {
			sessionStorage.setItem(
				DEFECTS_STORAGE_DEPARTMENT,
				JSON.stringify(selectedItem)
			);
			setSelectedDepartment(selectedItem);

			let departmentChip1 = chips.filter((item) => item.chipType !== 3);

			if (selectedItem?.id !== "") {
				const departmentChip2 = {
					chipType: 3,
					id: selectedItem?.id,
					value: "",
				};
				departmentChip1 = [...departmentChip1, departmentChip2];
			}
			setChips(departmentChip1);

			await fetchDefectList({
				chips: departmentChip1,
				search: searchRef.current,
				siteDepartmentID: selectedItem?.id,
				defectStatusID: selectedStatus.id,
				fromDate: selectedTimeframe.fromDate,
				toDate: selectedTimeframe.toDate,
				sortField: currentTableSort[0],
				sortOrder: currentTableSort[1],
			});
		}
		// is a status dropdown and the selectedItem is different from the previously selected
		if (type === "status" && selectedItem.id !== selectedStatus.id) {
			sessionStorage.setItem(
				DEFECTS_STORAGE_STATUS,
				JSON.stringify(selectedItem)
			);
			setSelectedStatus(selectedItem);
			let statusChip1 = chips.filter(
				(item) => item.chipType !== 2 && item.chipType !== 1
			);

			if (
				selectedItem?.id !== "" &&
				!["C", "O", "N"].includes(selectedItem?.id)
			) {
				const statusChip2 = {
					chipType: 2,
					id: selectedItem?.id,
					value: "",
				};
				statusChip1 = [...statusChip1, statusChip2];
			}
			if (
				selectedItem?.id !== "" &&
				["C", "O", "N"].includes(selectedItem?.id)
			) {
				const statusChip2 = {
					chipType: 1,
					id: 0,
					value: selectedItem?.id,
				};
				statusChip1 = [...statusChip1, statusChip2];
			}
			setChips(statusChip1);
			await fetchDefectList({
				chips: statusChip1,
				search: searchRef.current,
				defectStatusID: selectedItem?.id,
				siteDepartmentID: selectedDepartment?.id,
				fromDate: selectedTimeframe.fromDate,
				toDate: selectedTimeframe.toDate,
				sortField: currentTableSort[0],
				sortOrder: currentTableSort[1],
			});
		}
		// is a timeframe dropdown
		if (type === "timeframe") {
			// for Custom Range option open pop up

			if (selectedItem.id === 7) {
				setOpenCustomDatePopup(true);
			} else {
				setSelectedTimeframe(selectedItem);
				sessionStorage.setItem(
					DEFECTS_STORAGE_TIMEFRAME,
					JSON.stringify(selectedItem)
				);
				await fetchDefectList({
					chips,
					search: searchRef.current,
					siteDepartmentID: selectedDepartment?.id,
					defectStatusID: selectedStatus.id,
					fromDate: selectedItem.fromDate,
					toDate: selectedItem.toDate,
					sortField: currentTableSort[0],
					sortOrder: currentTableSort[1],
				});
			}
		}
		setSearching(false);
		setDropDownChange(false);
	};

	// handling Custom Date input change
	const handleCustomDateChange = (type, e) => {
		setCustomDate({ ...customDate, [type]: e.target.value });
	};

	// close Custom Date popup
	const handleCloseCustomDate = () => {
		setOpenCustomDatePopup(false);
		setCustomDateRangeError(defaultCustomDate);
	};

	// when the Custom Date popup is submitted
	const handleCustomDateSubmit = async (e) => {
		e.preventDefault();

		const isFromDateEmpty = customDate.from === "";
		const isToDateEmpty = customDate.to === "";
		// show error if date fields are empty
		if (isFromDateEmpty || isToDateEmpty) {
			setCustomDateRangeError({ from: isFromDateEmpty, to: isToDateEmpty });
			return;
		}

		setSearching(true);

		const formattedCustomDate = customFromattedDate(customDate);

		// setting the custom date values to selectedTimeFrame state and checking if From date is greater than To date and managing accordingly
		setSelectedTimeframe({
			...selectedTimeframe,
			...formattedCustomDate,
			name: "Customized Date",
			id: 7,
		});
		sessionStorage.setItem(
			DEFECTS_STORAGE_TIMEFRAME,
			JSON.stringify({
				...selectedTimeframe,
				...formattedCustomDate,
				name: "Customized Date",
				id: 7,
			})
		);

		await fetchDefectList({
			chips,
			search: searchRef.current,
			siteDepartmentID: selectedDepartment?.id,
			defectStatusID: selectedStatus.id,
			fromDate: formattedCustomDate.fromDate,
			toDate: formattedCustomDate.toDate,
			sortField: currentTableSort[0],
			sortOrder: currentTableSort[1],
		});
		setSearching(false);

		handleCloseCustomDate();
	};
	//
	// calling defect list api after mounting
	const fetchDataFromEffect = async () => {
		setSearching(true);
		const [response2, response3] = await Promise.all([
			getSiteDepartmentsInService(siteID),
			getDefectStatuses(siteAppID),
		]);

		if (response2.status) {
			setSiteDepartments([{ id: "", name: "Show All" }, ...response2.data]);
		}

		if (response3.status) {
			setDefectsStatus([
				{ id: "", name: "Show All" },
				...response3.data.map((x) => {
					if (x.type === "C") return { ...x, groupBy: "All Complete" };
					else if (x.type === "N")
						return { ...x, groupBy: "All Notification Raised" };
					return { ...x, groupBy: "All Outstanding" };
				}),
			]);
		}

		setSearching(false);
		setLoading(false);
	};

	// searching for services
	const handleSearch = useCallback(
		debounce(async (value) => {
			setSearching(true);
			searchRef.current = value;
			const autoCompleteRes = await getDefectAutocompleteSearch({
				search: value,
			});

			setAutocompleteData(autoCompleteRes?.data);
			if (!value || value === "")
				setDataForFetchingDefect({
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

	//Filter by Timeframe dropdown options
	const timeframeOptions = (customCaptions) => {
		return filterByDateOptions(new Date(), customCaptions);
	};

	// opens DELETE defect  popup
	const handleDeleteDialogOpen = (id) => {
		setDeleteID(id);
		setOpenDeleteDialog(true);
	};

	//for fetching the chips
	useEffect(() => {
		if (dataForFetchingDefect?.search.length >= 3) {
			handleSearch(
				dataForFetchingDefect?.search,
				selectedDepartment.id,
				selectedStatus.id,
				selectedTimeframe.fromDate,
				selectedTimeframe.toDate,
				currentTableSort[0],
				currentTableSort[1]
			);
		} else {
			setAutocompleteData([]);
		}
	}, [dataForFetchingDefect?.search]);

	// remove defect from client table list after successfull deletion of defect
	const handleRemoveData = (id) => {
		setAllData([...allData.filter((d) => d.id !== id)]);
		setCountOfDefect((prev) => prev - 1);
	};

	//handle autocomplete contents
	const handleAutoCompleteContent = async (item) => {
		setDropDownChange(false);
		setChips((prev) => {
			const isDuplicate = prev?.some(
				(existingItem) =>
					existingItem.id === item.id &&
					existingItem.type === item.type &&
					existingItem.value === item.value
			);
			if (!isDuplicate) {
				return [...prev, item];
			}

			return prev;
		});
		setAutocompleteData([]);
		setDataForFetchingDefect({
			pageNumber: 1,
			pageSize: defaultPageSize(),
			search: "",
			sortField: "",
			sort: "",
		});
	};

	//remove Chip
	const handleRemoveChip = async (removedChip) => {
		setDropDownChange(false);
		setChips((prev) => {
			return prev.filter(
				(item, index) =>
					(item.id !== removedChip.id && index !== removedChip.index) ||
					(item.value.length !== removedChip.value.length &&
						index !== removedChip.index) ||
					(item.value !== removedChip.value && index !== removedChip.index)
			);
		});
	};

	// attemp to fetch defects list
	const fetchDefectList = useCallback(
		async ({
			chips = "",
			defectStatusID = "",
			siteDepartmentID = "",
			fromDate = "",
			toDate = "",
			sortField = "",
			sortOrder = "",
			shouldCount = true,
			search = "",
		}) => {
			try {
				const response = await Promise.all([
					getDefectsList({
						siteAppId: siteAppID,
						chips,
						siteDepartmentID,
						fromDate,
						toDate,
						sortField,
						sortOrder,
					}),
					shouldCount &&
						getCountOfDefectsList({
							defectStatusType: ["C", "N", "O"].includes(defectStatusID)
								? defectStatusID
								: "",
							defectStatusID: ["C", "N", "O"].includes(defectStatusID)
								? ""
								: defectStatusID,
							siteAppId: siteAppID,
							search,
							siteDepartmentID,
							fromDate,
							toDate,
						}),
				]);

				if (response[0].status) {
					setAllData(response[0].data);
					response[1].status && setCountOfDefect(response[1].data);
					setDataForFetchingDefect((prev) => ({ ...prev, pageNumber: 1 }));
				} else {
					dispatch(
						showError(
							response?.data?.detail ||
								`Failed to fetch ${customCaptions?.defect} list`
						)
					);
				}
			} catch (error) {
				dispatch(
					showError(
						error?.response?.detail ||
							`Failed to fetch ${customCaptions?.defect} list`
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
			selectedDepartment?.id,
			// eslint-disable-next-line react-hooks/exhaustive-deps
			selectedStatus?.id,
			selectedTimeframe.fromDate,
			selectedTimeframe.toDate,
			dataForFetchingDefect.pageNumber,
			analyticsData?.data,
		]
	);
	const mainData = searchQuery.length === 0 ? allData : allData;

	//effect for redirected url from analytics page
	useEffect(() => {
		const fetchData = async () => {
			if (analyticsData?.isRedirected) {
				const chipsToUpdate = [];

				if (
					showData["riskRatings"]?.siteDepartmentID !== selectedDepartment.id
				) {
					let riskRatingsData = showData["riskRatings"];
					if (riskRatingsData?.id) {
						const newChipContent = {
							chipType: 4,
							id: riskRatingsData.id,
							value: riskRatingsData.name,
						};
						chipsToUpdate.push(newChipContent);
					}
				}
				if (
					// showDataKeys.includes("model") &&
					showData["model"]?.siteDepartmentID !== selectedDepartment.id
					// &&
					// showData["model"]
				) {
					let modelData = showData["model"];

					if (modelData?.id) {
						const newChipContent = {
							chipType: 5,
							id: modelData.id,
							value: modelData.name,
						};

						chipsToUpdate.push(newChipContent);
					}
				}
				if (
					showData["defectType"]?.siteDepartmentID !== selectedDepartment.id
				) {
					let defectTypeData = showData["defectType"];
					if (defectTypeData?.id) {
						const newChipContent = {
							chipType: 7,
							id: defectTypeData.id,
							value: defectTypeData.name,
						};
						chipsToUpdate.push(newChipContent);
					}
				}
				if (
					showData["defectSystem"]?.siteDepartmentID !== selectedDepartment.id
				) {
					let defectTypeData = showData["defectSystem"];
					if (defectTypeData?.id) {
						const newChipContent = {
							chipType: 6,
							id: defectTypeData.id,
							value: defectTypeData.name,
						};
						chipsToUpdate.push(newChipContent);
					}
				}
				if (
					showData["defectWorkOrder"]?.siteDepartmentID !==
					selectedDepartment.id
				) {
					let defectWorkOrderData = showData["defectWorkOrder"];
					if (
						defectWorkOrderData?.name &&
						typeof defectWorkOrderData?.id === "boolean"
					) {
						const newChipContent = {
							chipType: 8,
							id: 0,
							value: defectWorkOrderData.id,
						};

						chipsToUpdate.push(newChipContent);
					}
				}
				if (
					showData["department"]?.siteDepartmentID !== selectedDepartment.id
				) {
					sessionStorage.setItem(
						DEFECTS_STORAGE_DEPARTMENT,
						JSON.stringify(showData["department"])
					);
					if (showData["department"].id !== "") {
						const newChipContent = {
							chipType: 3,
							id: showData["department"].id,
							value: "",
						};
						chipsToUpdate.push(newChipContent);
					}
					sessionStorage.setItem(
						DEFECTS_STORAGE_DEPARTMENT,
						JSON.stringify(showData["department"])
					);
					setSelectedDepartment(showData["department"]);
				}
				if (showData["timeframe"]?.siteDepartmentID !== selectedDepartment.id) {
					if (showData["timeframe"].id !== 7 && showData["timeframe"].id >= 3) {
						sessionStorage.setItem(
							DEFECTS_STORAGE_TIMEFRAME,
							JSON.stringify({
								...showData["timeframe"],
								id: showData["timeframe"].id + 1,
							})
						);
						setSelectedTimeframe({
							...showData["timeframe"],
							id: showData["timeframe"].id + 1,
						});
					} else {
						sessionStorage.setItem(
							DEFECTS_STORAGE_TIMEFRAME,
							JSON.stringify(showData["timeframe"])
						);
						setSelectedTimeframe(showData["timeframe"]);
						if (showData["timeframe"].id === 7) {
							setCustomDate({
								from: MuiFormatDate(showData["timeframe"].fromDate),
								to: MuiFormatDate(showData["timeframe"].toDate),
							});
						}
					}
				}

				if (
					showData["defectStatus"]?.siteDepartmentID !== selectedDepartment.id
				) {
					if (showData["defectStatus"].id !== "") {
						const newChipContent = {
							chipType: 1,
							id: 0,
							value: showData["defectStatus"].id,
						};
						chipsToUpdate.push(newChipContent);
					}
					const defectStatus = showData["defectStatus"];
					const id = defectStatus?.id || "";
					const name = defectStatus?.id
						? ` All ${defectStatus?.name}`
						: "Show All";
					sessionStorage.setItem(
						DEFECTS_STORAGE_STATUS,
						JSON.stringify({ id, name })
					);
					setSelectedStatus({ id, name });
				}
				await Promise.all(chipsToUpdate.map(handleAutoCompleteContent));
			}
		};
		fetchData();
		return () => {
			// dispatch(
			// 	setAnalyticsShowData({ data: analyticsData.data, state: false })
			// );
			localStorage.setItem(
				"analyticaData",
				JSON.stringify({ data: showData, isRedirected: false })
			);
		};
	}, [analyticsData?.data]);

	const shouldFetchData = (siteID, chips, apiRef) => {
		return (
			siteID !== apiRef.current.siteID &&
			JSON.stringify(chips) !== JSON.stringify(apiRef.current.chips)
		);
	};
	useEffect(() => {
		if (shouldFetchData(siteID, chips, apiRef)) {
			setDropDownChange(true);
			let time = !analyticsData?.isRedirected ? 0 : chips.length ? 1000 : 0;
			setTimeout(() => {
				fetchDefectList({
					chips,
					siteDepartmentID: selectedDepartment?.id,
					defectStatusID: selectedStatus.id,
					fromDate: selectedTimeframe.fromDate,
					toDate: selectedTimeframe.toDate,
					sortField: currentTableSort[0],
					sortOrder: currentTableSort[1],
				})
					.then((response) => {
						apiRef.current = { siteID, chips, call: 1 };
					})
					.catch((error) => {
						dispatch(
							showError(
								error?.response?.detail ||
									`Failed to fetch ${customCaptions?.defect} list`
							)
						);
					});
			}, time);
		} else {
			if (
				JSON.stringify(chips) !== JSON.stringify(apiRef.current.chips) &&
				!isDropDownChanging
			) {
				fetchDefectList({
					chips,
					siteDepartmentID: selectedDepartment?.id,
					defectStatusID: selectedStatus.id,
					fromDate: selectedTimeframe.fromDate,
					toDate: selectedTimeframe.toDate,
					sortField: currentTableSort[0],
					sortOrder: currentTableSort[1],
				});
				apiRef.current = { siteID, chips, call: 1 };
				setDropDownChange(false);
			}
		}

		document.body.style.overflowX = "hidden";
		document.body.style.maxWidth = "100%";
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		siteID,
		apiRef.current.chips,
		selectedTimeframe,
		selectedDepartment.id,
		selectedStatus.id,
		chips.length,
	]);

	useEffect(() => {
		if (siteID) {
			fetchDataFromEffect();
		}
	}, [siteID]);
	if (loading) return <CircularProgress />;

	return (
		<>
			<TabTitle
				title={`${customCaptions.defectPlural} | ${application.name}`}
			/>
			{isSearching && <LinearProgress className={classes.loading} />}

			<DeleteDialog
				entityName={customCaptions?.defect}
				open={openDeleteDialog}
				closeHandler={() => setOpenDeleteDialog(false)}
				deleteID={deleteID}
				deleteEndpoint={"/api/defects"}
				handleRemoveData={handleRemoveData}
			/>
			<CustomDateRange
				open={openCustomDatePopup}
				handleChange={handleCustomDateChange}
				customDate={customDate}
				closeHandler={handleCloseCustomDate}
				onSubmit={handleCustomDateSubmit}
				isError={isCustomDateRangeError}
				isLoading={isSearching}
			/>
			<div className="container">
				<Header
					dataLength={countOFDefects}
					defectsCC={customCaptions?.defectPlural}
					customCaptions={customCaptions}
					fromDate={selectedTimeframe.fromDate}
					toDate={selectedTimeframe.toDate}
					chips={chips}
					page={dataForFetchingDefect.pageNumber}
					currentTableSort={currentTableSort}
					pageSize={defaultPageSize()}
				/>
				<div
					className="detailsContainer"
					style={{ alignItems: "center", marginTop: "-15px" }}
				>
					<DetailsPanel
						showHeader={false}
						description={`View all ${customCaptions?.defectPlural} across your operations`}
					/>
					<AutoCompleteBox
						searchQuery={dataForFetchingDefect?.search}
						setSearchQuery={(e) => {
							e.persist();
							setDataForFetchingDefect((prev) => ({
								...prev,
								search: e.target.value,
							}));
						}}
						width="100%"
						required
						label="Services Access"
						setSelectedValue={handleAutoCompleteContent}
						selectdValueToshow="name"
						dataSource={autocompleteData}
						isSearching={isSearching}
						chips={chips}
					/>
				</div>

				<Grid container spacing={2}>
					<Grid item lg={3} md={6} xs={12}>
						<DyanamicDropdown
							dataSource={defectsStatus}
							columns={[{ name: "name", id: 1, minWidth: "130px" }]}
							columnsMinWidths={[140, 140, 140, 140, 140]}
							showHeader={false}
							width="100%"
							placeholder={`Select Status`}
							onChange={(item) => onDropdownChange("status", item)}
							selectdValueToshow="name"
							selectedValue={selectedStatus}
							label={`Filter by Status`}
							isServerSide={false}
							icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
							required={false}
							showBorderColor
							groupBy={[
								{ id: "", name: "Show All", statusType: "" },
								{ id: "C", name: "All Complete", statusType: "C" },
								{ id: "O", name: "All Outstanding", statusType: "O" },
							]}
							hasGroup
						/>
					</Grid>
					<Grid item lg={3} md={6} xs={12}>
						<DyanamicDropdown
							dataSource={timeframeOptions(customCaptions)}
							columns={[{ name: "name", id: 1, minWidth: "130px" }]}
							columnsMinWidths={[140, 140, 140, 140, 140]}
							showHeader={false}
							width="100%"
							placeholder={`Select Timeframe`}
							onChange={(list) => onDropdownChange("timeframe", list)}
							selectdValueToshow="name"
							selectedValue={{
								...selectedTimeframe,
								name:
									selectedTimeframe.id === 7
										? selectedTimeframe.fromDate
											? changeDate(selectedTimeframe.fromDate) +
											  " - " +
											  changeDate(selectedTimeframe.toDate)
											: selectedTimeframe.name
										: selectedTimeframe.name,
							}}
							label={`Filter by Timeframe`}
							isServerSide={false}
							icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
							required={false}
							showBorderColor
						/>
					</Grid>
					<Grid item lg={3} md={6} xs={12}>
						<DyanamicDropdown
							dataSource={siteDepartments}
							columnsMinWidths={[140, 140, 140, 140, 140]}
							dataHeader={[
								{
									id: 1,
									name: `${customCaptions?.department ?? "Department"}`,
								},
								{
									id: 2,
									name: `${customCaptions?.location ?? "Location"}`,
								},
							]}
							showHeader
							columns={[
								{ id: 1, name: "name" },
								{ id: 2, name: "description" },
							]}
							placeholder={`Select Department`}
							width="100%"
							onChange={(item) => onDropdownChange("department", item)}
							selectdValueToshow="name"
							selectedValue={selectedDepartment}
							label={`Filter by ${customCaptions.department}`}
							isServerSide={false}
							icon={<FilterListIcon style={{ color: "rgb(48, 122, 215)" }} />}
							required={false}
							showBorderColor
						/>
					</Grid>
				</Grid>
				<div style={{ height: 20 }}></div>
				<div>
					<EMIChip data={chips} deleteHandler={handleRemoveChip} />
				</div>

				<div className="dynamic-width-table">
					<DefectListTable
						data={mainData}
						headers={DefectTableHeader(customCaptions)}
						columns={DefectTableColumns()}
						setData={setAllData}
						handleSort={async (sortField, sortOrder) => {
							setSearching(true);
							await fetchDefectList({
								chips,
								search: searchRef.current,
								siteDepartmentID: selectedDepartment?.id,
								defectStatusID: selectedStatus.id,
								fromDate: selectedTimeframe.fromDate,
								toDate: selectedTimeframe.toDate,
								sortField: sortField,
								sortOrder: sortOrder,
								shouldCount: false,
							});
							setSearching(false);
						}}
						searchQuery={searchRef.current}
						formattedData={formattedData}
						searchedData={searchedData}
						setSearchData={setSearchData}
						handleDeleteDialogOpen={handleDeleteDialogOpen}
						searchText={searchRef.current}
						page={dataForFetchingDefect.pageNumber}
						countOFDefects={countOFDefects}
						department={selectedDepartment.id}
						status={selectedStatus.id}
						date={{
							fromDate: selectedTimeframe.fromDate,
							toDate: selectedTimeframe.toDate,
						}}
						setDataForFetchingDefect={setDataForFetchingDefect}
						currentTableSort={currentTableSort}
						setCurrentTableSort={setCurrentTableSort}
						siteAppID={siteAppID}
						content={customCaptions?.defectPlural}
						isReadOnly={position?.[mainAccess.defectAccess] === "R"}
						chips={chips}
					/>
				</div>
			</div>
		</>
	);
}

export default DefectsLists;
