import { handleSort } from "helpers/utils";
import { CircularProgress, LinearProgress } from "@material-ui/core";
import ColourConstants from "helpers/colourConstants";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {
	addModal,
	duplicateModal,
	getListOfModelVersions,
	getModelImports,
	getModelList,
} from "services/models/modelList";
import React, { useState, useCallback, useEffect } from "react";
import ContentStyle from "styles/application/ContentStyle";
import { Grid } from "@material-ui/core";
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
});

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

const ModelLists = ({ getError, isMounted, access }) => {
	const classes = useStyles();
	useSuperAdminExclude();
	//Init State
	const [isLoading, setIsLoading] = useState(true);
	const dispatch = useDispatch();

	const [deleteID, setDeleteID] = useState(null);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openVersionTableDialog, setOpenVersionTableDialog] = useState(false);
	const [openAddNewModal, setOpenAddNewModal] = useState(false);
	const [openDuplicateModal, setOpenDuplicateModal] = useState(false);
	const [duplicateModalData, setDuplicateModalData] = useState({});
	const [modelVersions, setModelVersions] = useState([]);
	const [allData, setAllData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [isVersionTableLoading, setVersionTableLoading] = useState(false);
	const [openImportFile, setOpenImportFile] = useState(false);
	const [modelImportData, setModelImportData] = useState([]);
	const [searching, setSearching] = useState(false);
	const [uploadPercentCompleted, setUploadPercentCompleted] = useState(0);

	const { position, application, customCaptions } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

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
			await fetchModelList(searchValue);
			setSearching(false);
		},
		[1000]
	);

	const onDuplicateModalOpen = (modalToDuplicate) => {
		setDuplicateModalData(modalToDuplicate);
		setOpenDuplicateModal(true);
	};

	const fetchModelList = async (searchTxt = "") => {
		const response = await getModelList(position?.siteAppID || 24, searchTxt);
		if (!isMounted.aborted) {
			if (response.status) {
				setAllData(response.data);
				setFilteredData(response.data);
			} else {
				displayError(response?.data?.errors?.siteAppId[0], response);
			}

			setIsLoading(false);
		}
	};

	const createModal = async (payload) => {
		return await addModal(payload);
	};

	const onDuplicateModal = async () => {
		return await duplicateModal({
			modelId: duplicateModalData.id,
			modelVersionId: duplicateModalData.devModelVersionID,
		});
	};

	const onViewVersionTableOpen = async (id) => {
		setOpenVersionTableDialog(true);
		setVersionTableLoading(true);

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
				setModelImportData(response.data);
			} else {
				displayError(response?.data?.errors?.siteAppId[0], response);
			}
		} else {
			return;
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		Promise.all([fetchModelList(), fetchModelImports()]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className="container">
			{searching && <LinearProgress className={classes.loading} />}
			<CommonModal
				open={openAddNewModal}
				closeHandler={() => setOpenAddNewModal(false)}
				siteId={position?.siteAppID}
				data={null}
				title="Add Model"
				createProcessHandler={createModal}
			/>
			<CommonModal
				open={openDuplicateModal}
				closeHandler={() => setOpenDuplicateModal(false)}
				siteId={position?.siteAppID}
				data={duplicateModalData}
				title={"Duplicate " + customCaptions?.modelTemplate}
				createProcessHandler={onDuplicateModal}
				isDuplicate
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
			/>
			<ImportFileDialouge
				open={openImportFile}
				handleClose={() => setOpenImportFile(false)}
				importSuccess={fetchModelImports}
				getError={getError}
				siteAppID={position?.siteAppID}
				uploadPercentCompleted={uploadPercentCompleted}
				setUploadPercentCompleted={setUploadPercentCompleted}
			/>

			<div className={classes.listActions}>
				<div className={classes.headerContainer}>
					<Typography
						className={classes.headerText}
						component="h1"
						gutterBottom
					>
						{allData.length === 0 ? (
							<strong>{"Model List"}</strong>
						) : (
							<strong>{`Model List (${allData.length})`}</strong>
						)}
					</Typography>

					<div className={classes.buttonContainer}>
						<RoleWrapper roles={[roles.clientAdmin]}>
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
				<ModalAwaitingImports modelImportData={modelImportData} />

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
			</div>
			{isLoading ? (
				<CircularProgress />
			) : (
				<ModelsListTable
					data={filteredData}
					access={access}
					headers={
						application?.showModel
							? [
									// customCaptions?.make,
									// customCaptions?.model,
									customCaptions?.modelTemplate,
									customCaptions?.modelType,
									"Status",
									"Serial Number Range",
									"Latest Version",
									"Active Version",
							  ]
							: [
									// customCaptions?.make,
									customCaptions?.modelTemplate,
									customCaptions?.modelType,
									"Status",
									"Serial Number Range",
									"Latest Version",
									"Active Version",
							  ]
					}
					columns={
						application?.showModel
							? [
									["name", "modelName"],
									"modelType",
									"status",
									"serialNumberRange",
									"devModelVersion",
									"activeModelVersion",
							  ]
							: [
									["name"],
									"modelType",
									"status",
									"serialNumberRange",
									"devModelVersion",
									"activeModelVersion",
							  ]
					}
					setData={setFilteredData}
					handleSort={handleSort}
					handleDeleteDialogOpen={handleDeleteDialogOpen}
					handleDuplicateModalOpen={onDuplicateModalOpen}
					handleViewVersionModalOpen={onViewVersionTableOpen}
				/>
			)}
		</div>
	);
};

export default withMount(ModelLists);
