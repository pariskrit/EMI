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
import { getLocalStorageData } from "helpers/utils";

const SiteLocationsScreen = ({
	handlefetchSiteDetail,
	getError,
	siteDetails,
}) => {
	const { id, clientId } = useParams();
	const history = useHistory();
	const [data, setData] = useState([]);
	const [modal, setModal] = useState({ add: false });
	const cancelFetch = useRef(false);
	const [isLoading, setIsloading] = useState(true);
	const { role, isSiteUser, customCaptions } = getLocalStorageData("me");
	let navigation = siteScreenNavigation;

	// User is Site User
	if (role === "SiteUser" || isSiteUser)
		navigation = [
			{ name: "Details", url: siteScreenNavigation[0].url },
			{ name: customCaptions?.assetPlural, url: siteScreenNavigation[1].url },
			{
				name: customCaptions?.departmentPlural,
				url: siteScreenNavigation[2].url,
			},
			{
				name: customCaptions?.locationPlural,
				url: siteScreenNavigation[3].url,
			},
		];

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
		handlefetchSiteDetail(id, clientId);
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
				current={customCaptions?.locationPlural ?? "Locations"}
				navigation={navigation}
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
	handlefetchSiteDetail: (siteId, clientId) =>
		dispatch(fetchSiteDetail(siteId, clientId)),
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SiteLocationsScreen);
