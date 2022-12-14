import React from "react";
import RestoreIcon from "@material-ui/icons/Restore";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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
import { showError } from "redux/common/actions";
import "./style.scss";
import { clientsPath } from "helpers/routePaths";
import License from "./License";
import TabTitle from "components/Elements/TabTitle";

const useStyles = makeStyles((theme) => ({
	detailContainer: {
		marginTop: 25,
		display: "flex",
		justifyContent: "center",
	},
}));

const ClientDetails = ({
	clientDetail,
	fetchClientData,
	getError,
	resetPage,
	clientDetailLoading,
}) => {
	const classes = useStyles();
	const { id } = useParams();

	React.useEffect(
		() => {
			fetchClientData(id);
			return () => resetPage();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);
	return (
		<div className="client-details">
			<TabTitle title={clientDetail.name} />
			<div className="flex justify-between">
				<NavDetails
					staticCrumbs={[
						{ id: 1, name: "Clients", url: clientsPath },
						{ id: 2, name: clientDetail.name },
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

				<div className="right-section">
					<div className="restore">
						<RestoreIcon />
					</div>
				</div>
			</div>
			<div className={classes.detailContainer}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<ClientDetail
							loading={clientDetailLoading}
							clientId={+id}
							clientData={clientDetail}
							getError={getError}
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
								licenseType: clientDetail.licenseType,
								licenses: clientDetail.licenses,
							}}
							getError={getError}
							clientId={+id}
							isLoading={clientDetailLoading}
						/>
						<ClientApplication clientId={+id} getError={getError} />
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
