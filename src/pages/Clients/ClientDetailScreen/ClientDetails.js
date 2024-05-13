import React from "react";
import { Grid } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import { connect } from "react-redux";
import ClientApplication from "./Applications/ClientApplication";
import ClientDetail from "./ClientDetail";
import KeyContacts from "./KeyContacts/ClientKeyContacts";
import ClientNotes from "./Notes/ClientNotes";
import CompanyLogo from "./CompanyLogo";
import ClientDocuments from "./ClientDocuments";
import RegionAndSites from "./RegionAndSites";
import { useParams } from "react-router-dom";
import NavDetails from "components/Elements/NavDetails";
import { fetchClientDetail, resetClient } from "redux/clientDetail/actions";
import { setHistoryDrawerState, showError } from "redux/common/actions";
import "./style.scss";
import { appPath, clientsPath } from "helpers/routePaths";
import License from "./License";
import TabTitle from "components/Elements/TabTitle";
import ColourConstants from "helpers/colourConstants";
import RestoreIcon from "@mui/icons-material/Restore";
import { useDispatch } from "react-redux";
import HistoryBar from "components/Modules/HistorySidebar/HistoryBar";
import { useSelector } from "react-redux";
import { getClientDetailHistory } from "services/History/clients";
import roles from "helpers/roles";

const useStyles = makeStyles()((theme) => ({
	detailContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
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

const ClientDetails = ({
	clientDetail,
	fetchClientData,
	getError,
	resetPage,
	clientDetailLoading,
}) => {
	const { classes, cx } = useStyles();
	const { id } = useParams();
	const dispatch = useDispatch();
	const { isHistoryDrawerOpen } = useSelector((state) => state.commonData);

	const { adminType, role } =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	React.useEffect(
		() => {
			fetchClientData(id);
			return () => resetPage();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);
	const clientState = {
		statusColor: clientDetail[0]?.isActive
			? ColourConstants.green
			: ColourConstants.red,
		modelStatusName: clientDetail?.[0]?.isActive ? "Active" : "Inactive",
	};

	return (
		<div className="client-details">
			<TabTitle title={clientDetail.name ?? clientDetail?.[0]?.name} />
			<div className="flex justify-between">
				<NavDetails
					state={clientState}
					staticCrumbs={[
						{ id: 1, name: "Clients", url: appPath + clientsPath },
						{ id: 2, name: clientDetail?.name ?? clientDetail[0]?.name },
					].filter((x) => {
						if (x.id === 1) {
							if (localStorage.getItem("clientAdminMode")) {
								return false;
							} else {
								return true;
							}
						} else {
							return true;
						}
					})}
					status={true}
					lastSaved=""
				/>
				{role !== roles.clientAdmin && (
					<div
						className="restore"
						style={{ alignSelf: "flex-start" }}
						onClick={() => dispatch(setHistoryDrawerState(true))}
					>
						<RestoreIcon className={classes.restore} />
					</div>
				)}
			</div>
			<div className={classes.detailContainer}>
				{role !== roles.clientAdmin && (
					<HistoryBar
						id={id}
						showhistorybar={isHistoryDrawerOpen}
						dispatch={dispatch}
						fetchdata={(id, pageNumber, pageSize) =>
							getClientDetailHistory(id, pageNumber, pageSize)
						}
					/>
				)}
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<ClientDetail
							loading={clientDetailLoading}
							clientId={+id}
							clientData={clientDetail}
							getError={getError}
							role={role}
							adminType={adminType}
						/>
					</Grid>
					<Grid item lg={6} xs={12}>
						<CompanyLogo
							clientDetail={clientDetail}
							clientId={+id}
							fetchClientDetail={fetchClientData}
							getError={getError}
						/>
						<RegionAndSites clientId={+id} getError={getError} />
						<ClientDocuments clientId={+id} getError={getError} />
					</Grid>
					<Grid item lg={6} xs={12}>
						<License
							data={{
								licenseType:
									clientDetail?.licenseType ?? clientDetail[0]?.licenseType,
								licenses: clientDetail?.licenses ?? clientDetail[0]?.licenses,
							}}
							getError={getError}
							clientId={+id}
							isLoading={clientDetailLoading}
							adminType={adminType}
							role={role}
						/>
						<ClientApplication clientId={+id} getError={getError} role={role} />
						<KeyContacts clientId={+id} />
						<ClientNotes clientId={+id} getError={getError} />
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

const mapStateToProps = ({
	clientDetailData: { clientDetail, clientDetailLoading },
}) => ({ clientDetail, clientDetailLoading });

const mapDispatchToProps = (dispatch) => ({
	getError: (message) => dispatch(showError(message)),
	fetchClientData: (id) => dispatch(fetchClientDetail(id)),
	resetPage: () => dispatch(resetClient()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientDetails);
