import { handleSort } from "helpers/utils";
import { CircularProgress, LinearProgress } from "@mui/material";
import ColourConstants from "helpers/colourConstants";
import { makeStyles } from "tss-react/mui";
import Typography from "@mui/material/Typography";
import {
	addModal,
	duplicateModal,
	getClientDetail,
	getListOfModelVersions,
	getModelImports,
	getModelList,
	getModelStatuses,
	transferModel,
} from "services/models/modelList";
import React, { useState, useCallback, useEffect } from "react";
import ContentStyle from "styles/application/ContentStyle";
import { Grid } from "@mui/material";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import ModelsListTable from "./ModelsListTable";
import DeleteDialog from "components/Elements/DeleteDialog";
import { Apis } from "services/api";
import CommonModal from "./CommonModal";
import ModalAwaitingImports from "./ModalAwaitingImports";
import VersionListTable from "./VersionListTable";
import ImportFileDialouge from "./ImportFileDialog";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import withMount from "components/HOC/withMount";
import GeneralButton from "components/Elements/GeneralButton";
import useSuperAdminExclude from "hooks/useSuperAdminExclude";
import RoleWrapper from "components/Modules/RoleWrapper";
import AccessWrapper from "components/Modules/AccessWrapper";
import roles from "helpers/roles";
import TabTitle from "components/Elements/TabTitle";
import DyanamicDropdown from "components/Elements/DyamicDropdown";
import { getSiteDepartmentsInService } from "services/services/serviceLists";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useRef } from "react";
import mainAccess from "helpers/access";

import {
	MODEL_STORAGE_DEPARTMENT,
	MODEL_STORAGE_STATUS,
} from "helpers/constants";
import { getSiteApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";
import { useOutletContext } from "react-router-dom";
import ShareModal from "./ShareModal";
import { handleSiteAppClick } from "helpers/handleSiteAppClick";

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
		width: "50%",
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
	loading: {
		position: "absolute",
		width: "100%",
		left: 0,
		top: 0,
	},
	filter: {
		display: "flex",
	},
}));

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

const ModelLists = ({ getError, isMounted }) => {
	const { classes } = useStyles();
	useSuperAdminExclude();
	//Init State
	const [isLoading, setIsLoading] = useState(true);
	const dispatch = useDispatch();
	const [deleteID, setDeleteID] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openVersionTableDialog, setOpenVersionTableDialog] = useState(false);
	const [openAddNewModal, setOpenAddNewModal] = useState(false);
	const [openDuplicateModal, setOpenDuplicateModal] = useState(false);
	const [openShareModel, setOpenShareModel] = useState(false);
	const [duplicateModalData, setDuplicateModalData] = useState({});
	const [shareModelData, setShareModellData] = useState({});
	const [modelVersions, setModelVersions] = useState([]);
	const [allData, setAllData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [isVersionTableLoading, setVersionTableLoading] = useState(false);
	const [openImportFile, setOpenImportFile] = useState(false);
	const [modelImportData, setModelImportData] = useState([]);
	const [searching, setSearching] = useState(false);
	const [activeModelVersion, setActiveModelVersion] = useState(null);
	const [modelStatuses, setModelStatuses] = useState([]);
	const [siteDepartments, setSiteDepartments] = useState([]);
	const [siteAppState, setSiteAppState] = useState(null);
	const me =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const {
		position,
		application,
		customCaptions,
		siteID,
		siteAppID,
		site: { siteDepartmentID, siteDepartmentName, clientID },
	} = me;

	const [shareModelsFromApi, setShareModelsFromApi] = useState(0);
	useEffect(() => {
		const fetchClient = async () => {
			await dispatch(handleSiteAppClick(siteAppID, true));
			setShareModelsFromApi(application.shareModels);
		};
		fetchClient();
	}, [clientID, application, siteAppID]);

	const isSharableModel = shareModelsFromApi === 1 || shareModelsFromApi === 2;
	const { access } = useOutletContext();

	// get service list filters from local storage for memorized dropdown filter
	const statusFromMemory = JSON.parse(
		sessionStorage.getItem(MODEL_STORAGE_STATUS)
	);
	const departmentFromMemory = JSON.parse(
		sessionStorage.getItem(MODEL_STORAGE_DEPARTMENT)
	);

	const [selectedStatus, setSelectedStatus] = useState(
		statusFromMemory === null ? { id: "", name: "Show All" } : statusFromMemory
	);

	const [selectedDepartment, setSelectedDepartment] = useState(
		departmentFromMemory === null
			? { id: siteDepartmentID, name: siteDepartmentName }
			: departmentFromMemory
	);

	//display error popup
	const displayError = (errorMessage, response) =>
		dispatch(
			showError(
				response?.data?.detail || errorMessage || "Something went wrong"
			)
		);

	//DELETE
	const handleDeleteDialogOpen = (id) => {
		setDeleteID(id);

		setOpenDeleteDialog(true);
	};

	const closeDeleteDialog = () => setOpenDeleteDialog(false);

	const handleRemoveData = (id) => {
		const newData = [...allData.filter((d) => d.id !== id)];

		setFilteredData(newData);
		setAllData(newData);
	};
	//handle search
	const handleSearch = debounce(
		async (searchValue) => {
			setSearching(true);
			searchRef.current = searchValue;
			await fetchModelList(
				searchValue,
				selectedStatus?.id,
				selectedDepartment?.id
			);
			setSearching(false);
		},
		[1000]
	);

	const onDuplicateModalOpen = (modalToDuplicate) => {
		setDuplicateModalData(modalToDuplicate);
		setOpenDuplicateModal(true);
	};
	const onShareModelOpen = (modalToShare) => {
		setShareModellData(modalToShare);
		setOpenShareModel(true);
	};
	const searchRef = useRef("");
	const fetchModelList = async (
		searchTxt = "",
		modelStatusID = selectedStatus.id || "",
		siteDepartmentID = selectedDepartment.id || ""
	) => {
		const response = await getModelList(
			position?.siteAppID || 24,
			searchTxt,
			modelStatusID,
			siteDepartmentID
		);
		if (!isMounted.aborted) {
			if (response.status) {
				const newData = response.data.map((d) => ({
					...d,
					serialNumberRange: d?.serialNumberRange ?? "",
					fullName:
						d?.name +
						" " +
						(d?.modelName === null || d?.modelName === undefined
							? ""
							: d?.modelName),
				}));

				setAllData(newData);
				setFilteredData(newData);
			} else {
				displayError(response?.data?.errors?.siteAppId[0], response);
			}

			setIsLoading(false);
		}
	};

	const createModal = async (payload) => {
		return await addModal(payload);
	};

	const onDuplicateModal = async (payload) => {
		return await duplicateModal({
			modelId: duplicateModalData?.id,
			modelVersionId: duplicateModalData?.devModelVersionID,
			name: payload?.name,
			modelName: payload?.modelName,
			modelTypeId: payload?.modelTypeID,
			type: payload?.type,
			serialNumberRange: payload?.serialNumberRange,
		});
	};
	const onShareModel = async (payload) => {
		return await transferModel(payload);
	};

	const onViewVersionTableOpen = async (id) => {
		setOpenVersionTableDialog(true);
		setVersionTableLoading(true);
		setActiveModelVersion(
			allData.find((model) => model.id === id).activeModelVersion
		);

		const response = await getListOfModelVersions(id);

		if (response.status) {
			setModelVersions(response.data);
		} else {
			displayError(response?.data?.errors?.modelId[0], response);
			setOpenVersionTableDialog(false);
		}

		setVersionTableLoading(false);
	};

	const fetchModelImports = useCallback(async () => {
		const response = await getModelImports(position?.siteAppID || 24);
		if (!isMounted.aborted) {
			if (response.status) {
				setModelImportData(response?.data);
			} else {
				displayError(response?.data?.errors?.siteAppId[0], response);
			}
		} else {
			return;
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// handling onChange for 2 dropdowns
	const onDropdownChange = async (type, selectedItem) => {
		setSearching(true);
		if (type === "department" && selectedItem.id !== selectedDepartment.id) {
			sessionStorage.setItem(
				MODEL_STORAGE_DEPARTMENT,
				JSON.stringify(selectedItem)
			);
			setSelectedDepartment(selectedItem);
			await fetchModelList(
				searchRef.current,
				selectedStatus?.id,
				selectedItem?.id
			);
		}
		// is a status dropdown and the selectedItem is different from the previously selected
		if (type === "status" && selectedItem.id !== selectedStatus.id) {
			sessionStorage.setItem(
				MODEL_STORAGE_STATUS,
				JSON.stringify(selectedItem)
			);
			setSelectedStatus(selectedItem);
			await fetchModelList(
				searchRef.current,
				selectedItem?.id,
				selectedDepartment?.id
			);
		}
		setSearching(false);
	};
	//to get the state of current application--applicatioin.showLubricants and so on.
	const fetchSiteApplicationDetails = async () => {
		const result = await getSiteApplicationDetail(siteAppID);
		setSiteAppState(result);
	};

	useEffect(() => {
		fetchSiteApplicationDetails();
		const fetchData = async () => {
			const [, , modelStats, siteDepts] = await Promise.all([
				fetchModelList(),
				fetchModelImports(),
				getModelStatuses(siteAppID),
				getSiteDepartmentsInService(siteID),
			]);
			if (modelStats.status) {
				setModelStatuses([{ id: "", name: "Show All" }, ...modelStats.data]);
			}
			if (siteDepts.status) {
				setSiteDepartments([{ id: "", name: "Show All" }, ...siteDepts.data]);
			}
		};
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//to set the table header and column
	const ModelListHeader = [
		// customCaptions?.make,
		// customCaptions?.model,
		customCaptions?.modelTemplate,
		customCaptions?.modelType,
		"Status",
		"Latest Version",
		"Active Version",
		"Review Date",
	];

	const ModelListColumn = [
		"fullName",
		"modelType",
		"status",
		"devModelVersion",
		"activeModelVersion",
		"reviewDate",
	];

	//Hide Serial Number Range column of model list if the Application.ShowSerialNumberRange property is false.
	if (siteAppState?.data?.application?.showSerialNumberRange) {
		ModelListHeader.splice(3, 0, customCaptions?.serialNumberRange);
		ModelListColumn.splice(3, 0, "serialNumberRange");
	}
	return (
		<div className="container">
			<TabTitle title={`${customCaptions.model} | ${application.name}`} />
			<CommonModal
				open={openAddNewModal}
				closeHandler={() => setOpenAddNewModal(false)}
				siteId={position?.siteAppID}
				data={null}
				title="Add "
				createProcessHandler={createModal}
			/>
			<CommonModal
				open={openDuplicateModal}
				closeHandler={() => setOpenDuplicateModal(false)}
				siteId={position?.siteAppID}
				data={duplicateModalData}
				title={"Duplicate "}
				createProcessHandler={onDuplicateModal}
				isDuplicate
			/>
			<ShareModal
				open={openShareModel}
				closeHandler={() => setOpenShareModel(false)}
				siteId={position?.siteAppID}
				data={shareModelData}
				title={"Transfer "}
				createProcessHandler={onShareModel}
				isSharableModel={shareModelsFromApi}
			/>

			<DeleteDialog
				entityName="Model"
				open={openDeleteDialog}
				closeHandler={closeDeleteDialog}
				deleteID={deleteID}
				deleteEndpoint={Apis.Models}
				handleRemoveData={handleRemoveData}
			/>
			<VersionListTable
				open={openVersionTableDialog}
				isLoading={isVersionTableLoading}
				closeHandler={() => setOpenVersionTableDialog(false)}
				versions={modelVersions}
				activeModelVersion={activeModelVersion}
			/>
			<ImportFileDialouge
				open={openImportFile}
				handleClose={() => setOpenImportFile(false)}
				importSuccess={fetchModelImports}
				getError={getError}
				siteAppID={position?.siteAppID}
			/>

			<div className={classes.listActions}>
				<div className={classes.headerContainer}>
					<Typography
						className={classes.headerText}
						component="h1"
						gutterBottom
					>
						{allData.length === 0 ? (
							<strong>{` ${customCaptions?.model} List `}</strong>
						) : (
							<strong>{`${customCaptions?.model} List (${allData.length})`}</strong>
						)}
					</Typography>

					<div className={classes.buttonContainer}>
						<RoleWrapper roles={[roles.siteUser]}>
							<AccessWrapper access={access} accessList={["E"]}>
								<GeneralButton
									style={{ backgroundColor: "#ed8738" }}
									onClick={() => setOpenImportFile(true)}
								>
									IMPORT FROM EXISTING
								</GeneralButton>
							</AccessWrapper>
						</RoleWrapper>

						<AccessWrapper access={access} accessList={["E"]}>
							<GeneralButton
								style={{ backgroundColor: "#23bb79" }}
								onClick={() => setOpenAddNewModal(true)}
							>
								ADD NEW
							</GeneralButton>
						</AccessWrapper>
					</div>
				</div>
				<ModalAwaitingImports
					modelImportData={modelImportData}
					customCaptions={customCaptions}
					isReadOnly={position?.[mainAccess.modelAccess] === "R"}
				/>
				<div className={classes.filter}>
					<Grid container spacing={2}>
						<Grid item lg={6} md={6} xs={12}>
							<DyanamicDropdown
								dataSource={modelStatuses}
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
								// hasGroup
							/>
						</Grid>
						<Grid item lg={6} md={6} xs={12}>
							<DyanamicDropdown
								dataSource={siteDepartments}
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
								columnsMinWidths={[140, 140, 140, 140, 140]}
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
				</div>
			</div>
			{searching && <LinearProgress />}
			{isLoading ? (
				<CircularProgress />
			) : (
				<ModelsListTable
					data={filteredData}
					access={access}
					headers={
						application?.allowIndividualAssetModels
							? ModelListHeader
							: ModelListHeader
					}
					columns={ModelListColumn}
					setData={setFilteredData}
					handleSort={handleSort}
					handleDeleteDialogOpen={handleDeleteDialogOpen}
					handleDuplicateModalOpen={onDuplicateModalOpen}
					handleShareModelOpen={onShareModelOpen}
					handleViewVersionModalOpen={onViewVersionTableOpen}
					isSharableModel={isSharableModel}
				/>
			)}
		</div>
	);
};

export default withMount(ModelLists);
