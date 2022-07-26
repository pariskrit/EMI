import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress, Grid, LinearProgress } from "@material-ui/core";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import CommonApplicationTable from "./AssestTable";
import DetailsPanel from "components/Elements/DetailsPanel";
import ContentStyle from "styles/application/ContentStyle";
import {
	getModelAsset,
	patchmodelAssest,
} from "services/models/modelDetails/modelAsset";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import AddModel from "./AddModel";
import DeleteDialog from "components/Elements/DeleteDialog";
import TabTitle from "components/Elements/TabTitle";

const AC = ContentStyle();

const useStyles = makeStyles({
	loading: {
		position: "absolute",
		width: "100%",
		left: 0,
		top: 0,
	},
});

const ModelAsset = ({
	state,
	dispatch,
	modelId,
	getError,
	access,
	history,
	modelDefaultId,
}) => {
	const {
		customCaptions: { asset, assetPlural, modelTemplate },
		position: { serviceAccess },
		application,
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	const classes = useStyles();

	const [data, setData] = useState([]);
	const [searchedData, setSearchedData] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [deleteAsset, setDelete] = useState({ open: false, id: null });
	const [isEditingActive, setIsEditingActive] = useState(false);

	const fetchModelAsset = async (showLoading = true) => {
		showLoading && setLoading(true);
		try {
			let result = await getModelAsset(modelDefaultId);

			if (result.status) {
				setData(
					result.data.map((x) => ({
						...x,
						status: x.isActive ? "Active" : "Inactive",
					}))
				);
				setLoading(false);
			} else {
				if (result?.data?.detail) getError(result.data.detail);
				showLoading && setLoading(false);
			}
		} catch (e) {
			return;
		}
	};

	React.useEffect(() => {
		fetchModelAsset();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSearch = (v) => {
		setSearchQuery(v);
		const d = data.filter((x) => {
			const regex = new RegExp(v, "gi");
			return x.name.match(regex);
		});
		setSearchedData(d);
	};

	const handleAddComplete = (responseData) => {
		const main = data;
		main.push({
			...responseData,
			status: responseData.isActive ? "Active" : "Inactive",
		});

		setData(main);
		dispatch({
			type: "TAB_COUNT",
			payload: { countTab: "assetCount", data: main.length },
		});
	};

	const handleClose = () => {
		dispatch({ type: "TOGGLE_ADD", payload: false });
	};

	const handleDelete = (id) => {
		setDelete({ id, open: true });
	};
	const handleRemoveData = (id) => {
		setData((th) => [...th].filter((x) => x.id !== id));
		dispatch({
			type: "TAB_COUNT",
			payload: { countTab: "assetCount", data: data.length - 1 },
		});
	};
	const handleDeleteDialogClose = () => {
		setDelete({ id: null, open: false });
	};

	const handleEdit = async (id) => {
		setIsEditingActive(true);
		try {
			const editData = data?.find((x) => x.id === id);
			let result = await patchmodelAssest(editData?.id, [
				{
					op: "replace",
					path: "isActive",
					value: !editData?.isActive,
				},
			]);
			if (result.status) {
				await fetchModelAsset(false);
			} else {
				getError(result.data.detail);
			}
		} catch (error) {
			getError(error.data.detail || "Could not change status");
		}
		setIsEditingActive(false);
	};

	const mainData = searchQuery === "" ? data : searchedData;

	if (loading) {
		return <CircularProgress />;
	}

	if (state?.modelDetail?.modelType === "F") {
		history.goBack();
	}

	return (
		<>
			<TabTitle
				title={`${state?.modelDetail?.name} ${state?.modelDetail?.modelName} ${asset} | ${application.name}`}
			/>
			{isEditingActive && <LinearProgress className={classes.loading} />}
			<AddModel
				open={state.showAdd}
				handleClose={handleClose}
				modelId={modelDefaultId}
				getError={getError}
				title={asset}
				handleAddComplete={handleAddComplete}
				serviceAccess={serviceAccess}
				fetchModelAsset={fetchModelAsset}
			/>

			<DeleteDialog
				open={deleteAsset.open}
				entityName={`${asset}`}
				deleteID={deleteAsset.id}
				deleteEndpoint={`/api/modelassets`}
				handleRemoveData={handleRemoveData}
				closeHandler={handleDeleteDialogClose}
			/>
			<div style={{ display: "flex", alignItems: "center" }}>
				<DetailsPanel
					header={`${assetPlural}`}
					dataCount={data.length}
					description={`Manage ${assetPlural} this ${modelTemplate} can be assigned to`}
				/>
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
			<CommonApplicationTable
				data={mainData}
				setData={setData}
				searchedData={searchedData}
				searchQuery={searchQuery}
				headers={[`${asset}`, "Description", "Status"]}
				columns={["name", "description", "status"]}
				access={access}
				handleEdit={handleEdit}
				handleDelete={handleDelete}
				menuData={[
					{
						name: "Edit",
						handler: handleEdit,
						isDelete: false,
					},
					{
						name: "Delete",
						handler: handleDelete,
						isDelete: true,
					},
				].filter((x) => {
					if (access === "F") return true;
					if (access === "E") {
						if (x.name === "Edit") return true;
						else return false;
					}
					return false;
				})}
			/>
		</>
	);
};

const mapDispatchToProps = (reduxDispatch) => ({
	getError: (msg) => reduxDispatch(showError(msg)),
});

export default connect(null, mapDispatchToProps)(ModelAsset);
