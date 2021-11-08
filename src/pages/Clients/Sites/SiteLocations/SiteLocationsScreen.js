import SiteWrapper from "components/Layouts/SiteWrapper";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import SiteLocationsContent from "./SiteLocationsContent";
import { getSiteLocations } from "services/clients/sites/siteLocations";
import AddSiteLocationsDialog from "./SiteLocations/AddSiteLocationsDialog";
import { useRef } from "react";
import { connect } from "react-redux";
import { fetchSiteDetail } from "redux/siteDetail/actions";
import { siteScreenNavigation } from "helpers/constants";
import { showError } from "redux/common/actions";

const SiteLocationsScreen = ({ handlefetchSiteDetail, getError }) => {
	const { id, clientId } = useParams();
	const history = useHistory();
	const [data, setData] = useState([]);
	const [modal, setModal] = useState({ add: false });
	const cancelFetch = useRef(false);
	const [isLoading, setIsloading] = useState(true);

	const fetchSiteDepartments = async () => {
		try {
			const response = await getSiteLocations(id);

			if (cancelFetch.current) {
				return;
			}
			if (response.status) {
				setData(response.data);
				setIsloading(false);
				return response;
			} else {
				setIsloading(false);
				throw new Error(response);
			}
		} catch (err) {
			console.log(err);
			return err;
		}
	};

	useEffect(() => {
		fetchSiteDepartments();
		// eslint-disable-next-line react-hooks/exhaustive-deps
		handlefetchSiteDetail(id);
		return () => {
			cancelFetch.current = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleCreateData = (item) => {
		const newData = [...data];

		newData.push(item);

		setData(newData);
	};

	return (
		<>
			<AddSiteLocationsDialog
				open={modal.add}
				closeHandler={() => setModal(() => ({ add: false }))}
				createHandler={handleCreateData}
				siteID={id}
				getError={getError}
			/>

			<SiteWrapper
				current="Locations"
				navigation={siteScreenNavigation}
				onNavClick={(urlToGo) =>
					history.push(`/app/clients/${clientId}/sites/${id}${urlToGo}`)
				}
				status=""
				lastSaved=""
				showAdd
				onClickAdd={() => setModal((th) => ({ add: true }))}
				Component={() => (
					<SiteLocationsContent
						data={data}
						setData={setData}
						isLoading={isLoading}
						getError={getError}
					/>
				)}
			/>
		</>
	);
};

const mapStateToProps = ({ siteDetailData: { siteDetails } }) => ({
	siteDetails,
});

const mapDispatchToProps = (dispatch) => ({
	handlefetchSiteDetail: (siteId) => dispatch(fetchSiteDetail(siteId)),
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SiteLocationsScreen);
