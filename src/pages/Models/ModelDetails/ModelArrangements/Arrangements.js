import React, { useState } from "react";
import { makeStyles } from "tss-react/mui";

import { CircularProgress, LinearProgress } from "@mui/material";
import ArrangementListTable from "./ArrangementListTable";
import DetailsPanel from "components/Elements/DetailsPanel";
import { connect } from "react-redux";
import { showError } from "redux/common/actions";
import AddModelArragementDialog from "./AddModelArrangementDialog";
import DeleteDialog from "components/Elements/DeleteDialog";
import TabTitle from "components/Elements/TabTitle";
import { coalesc, commonScrollElementIntoView } from "helpers/utils";
import { useParams, useNavigate } from "react-router-dom";
import { useLayoutEffect } from "react";
import {
	editModelVersionArrangements,
	getModelVersionArrangements,
} from "services/models/modelDetails/modelIntervals";
import withMount from "components/HOC/withMount";
import HistoryBar from "components/Modules/HistorySidebar/HistoryBar";
import { ArrangementPage } from "services/History/models";
import { HistoryCaptions } from "helpers/constants";

const useStyles = makeStyles()((theme) => ({
	loading: {
		position: "absolute",
		width: "100%",
		left: 0,
		top: 0,
	},
}));

const ModelArrangements = ({
	state,
	dispatch,
	modelId,
	isMounted,
	getError,
	access,
	history,
}) => {
	const {
		customCaptions: { arrangement, arrangementPlural, modelTemplate },
		application,
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));
	const navigate = useNavigate();
	const { classes, cx } = useStyles();

	const [data, setData] = useState([]);
	const [openEditModelArrangementDialog, setopenEditModelArrangementDialog] =
		useState(false);
	const [loading, setLoading] = useState(false);
	const [deleteArrangement, setDeleteArrangement] = useState({
		open: false,
		id: null,
	});
	const [arrangementToEditData, setArrangementToEditData] = useState(null);
	const [isEditingActive] = useState(false);

	const { id } = useParams();

	useLayoutEffect(() => {
		if (!application?.showArrangements) {
			navigate(-1);
		}
	}, []);

	const fetchModelArrangement = async (showLoading = false) => {
		!isMounted.aborted && showLoading && setLoading(true);
		try {
			let result = await getModelVersionArrangements(id);

			if (result.status) {
				if (!isMounted.aborted) {
					setData(result.data);
					setLoading(false);
				}
				dispatch({
					type: "TAB_COUNT",
					payload: { countTab: "arrangementCount", data: result.data.length },
				});
			} else {
				if (result?.data?.detail) getError(result.data.detail);
				!isMounted.aborted && showLoading && setLoading(false);
			}
		} catch (e) {
			return;
		}
	};

	React.useEffect(() => {
		fetchModelArrangement(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleAddComplete = (responseData) => {
		const main = data;
		main.push({
			...responseData,
		});
		setData(main);
		dispatch({
			type: "TAB_COUNT",
			payload: { countTab: "arrangementCount", data: main.length },
		});
	};

	const handleClose = () => {
		dispatch({ type: "TOGGLE_ADD", payload: false });
	};

	const handleDelete = (id) => {
		setDeleteArrangement({ id, open: true });
	};
	const handleRemoveData = (id) => {
		const newData = [...data.filter((d) => d.id !== id)];
		setData(newData);
		dispatch({
			type: "TAB_COUNT",
			payload: { countTab: "arrangementCount", data: data.length - 1 },
		});
	};
	const handleDeleteDialogClose = () => {
		setDeleteArrangement({ id: null, open: false });
	};

	const handleEdit = async (arrangementToEdit) => {
		setArrangementToEditData({
			name: arrangementToEdit?.name,
			id: arrangementToEdit?.id,
		});
		setopenEditModelArrangementDialog(true);
	};
	const PatchModelArrangement = async (payload) => {
		payload = [{ op: "replace", path: "name", value: payload?.name }];
		return await editModelVersionArrangements(
			arrangementToEditData?.id,
			payload
		);
	};

	const mainData = data;

	if (loading) {
		return <CircularProgress />;
	}

	const handleItemClick = (id) => {
		dispatch({ type: "TOGGLE_HISTORYBAR" });

		commonScrollElementIntoView(`arrangement-${id}`, "arrangementEl");
	};
	return (
		<>
			<HistoryBar
				id={id}
				showhistorybar={state.showhistorybar}
				dispatch={dispatch}
				fetchdata={(id, pageNumber, pageSize) =>
					ArrangementPage(id, pageNumber, pageSize)
				}
				OnAddItemClick={handleItemClick}
				origin={HistoryCaptions.modelVersionArrangements}
			/>

			<TabTitle
				title={`${state?.modelDetail?.name} ${coalesc(
					state?.modelDetail?.modelName
				)} ${arrangementPlural} | ${application.name}`}
			/>
			{isEditingActive && <LinearProgress className={classes.loading} />}
			<AddModelArragementDialog
				open={state.showAdd}
				handleClose={handleClose}
				modelId={id}
				getError={getError}
				title={arrangement}
				dispatchCount={handleAddComplete}
				fetchModelArrangement={fetchModelArrangement}
			/>
			<AddModelArragementDialog
				open={openEditModelArrangementDialog}
				handleClose={() => setopenEditModelArrangementDialog(false)}
				editData={arrangementToEditData}
				title={`${arrangement}`}
				isEdit={true}
				fetchModelArrangement={() => fetchModelArrangement(false)}
				createProcessHandler={PatchModelArrangement}
				modelId={id}
			/>

			<DeleteDialog
				open={deleteArrangement.open}
				entityName={`${arrangement}`}
				deleteID={deleteArrangement.id}
				deleteEndpoint={`/api/modelVersionArrangements`}
				handleRemoveData={handleRemoveData}
				closeHandler={handleDeleteDialogClose}
			/>
			<div style={{ display: "flex", alignItems: "center" }}>
				<DetailsPanel
					header={`${arrangementPlural}`}
					dataCount={state?.modelDetail?.arrangementCount}
					description={`${arrangementPlural} to be used for this ${modelTemplate}`}
				/>
			</div>
			<ArrangementListTable
				data={mainData}
				setData={setData}
				headers={[`Name`]}
				columns={["name"]}
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
					if (state?.modelDetail?.isPublished) return false;
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

export default connect(null, mapDispatchToProps)(withMount(ModelArrangements));
