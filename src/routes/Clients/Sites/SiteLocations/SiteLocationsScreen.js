import SiteWrapper from "components/SiteWrapper";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import SiteLocationsContent from "./SiteLocationsContent";
import { getSiteLocations } from "services/clients/sites/siteLocations";
import AddSiteLocationsDialog from "components/SiteLocations/AddSiteLocationsDialog";
import { useRef } from "react";
import { connect } from "react-redux";
import { fetchSiteDetail } from "redux/siteDetail/actions";

const SiteLocationsScreen = ({ handlefetchSiteDetail }) => {
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
			/>

			<SiteWrapper
				current="Locations"
				navigation={[
					{ name: "Details", url: "" },
					{ name: "Assets", url: "/assets" },
					{ name: "Departments", url: "/departments" },
					{ name: "Locations", url: "/locations" },
				]}
				onNavClick={(urlToGo) =>
					history.push(`/client/${clientId}/site/${id}${urlToGo}`)
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
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SiteLocationsScreen);
