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
import Navcrumbs from "components/Navcrumbs";
import { fetchClientDetail, resetClient } from "redux/clientDetail/actions";
import { showError } from "redux/common/actions";

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
			<div className="flex justify-between" className="flex">
				<Navcrumbs
					crumbs={["Client", clientDetail.name]}
					status=""
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
							clientId={+id}
							clientData={clientDetail}
							getError={getError}
						/>
					</Grid>
					<Grid item lg={6} md={6} xs={12}>
						<CompanyLogo
							clientDetail={clientDetail}
							clientId={+id}
							fetchClientDetail={fetchClientData}
							getError={getError}
						/>
						<RegionAndSites clientId={+id} getError={getError} />
						<ClientDocuments clientId={+id} getError={getError} />
					</Grid>
					<Grid item lg={6} md={6} xs={12}>
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
