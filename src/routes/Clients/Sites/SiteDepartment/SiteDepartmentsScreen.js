import AddSiteDepartmentDialog from "components/SiteDepartment/AddSiteDepartmentDialog";
import SiteWrapper from "components/SiteWrapper";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { fetchSiteDetail } from "redux/siteDetail/actions";
import { getSiteDepartments } from "services/clients/sites/siteDepartments";
import SiteDepartmentsContent from "./SiteDepartmentsContent";

const SiteDepartmentsScreen = ({ handlefetchSiteDetail }) => {
	const { id, clientId } = useParams();
	const history = useHistory();
	const [data, setData] = useState([]);
	const [modal, setModal] = useState({ add: false });
	const cancelFetch = useRef(false);
	const [isLoading, setIsLoading] = useState(true);

	const fetchSiteDepartments = async () => {
		try {
			const response = await getSiteDepartments(id);
			if (cancelFetch.current) {
				return;
			}
			if (response.status) {
				setData(response.data);
				setIsLoading(false);
				return response;
			} else {
				throw new Error(response);
			}
		} catch (err) {
			console.log(err);
			setIsLoading(false);
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
			<AddSiteDepartmentDialog
				open={modal.add}
				closeHandler={() => setModal(() => ({ add: false }))}
				createHandler={handleCreateData}
				siteID={id}
			/>
			<SiteWrapper
				current="Departments"
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
					<SiteDepartmentsContent
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
)(SiteDepartmentsScreen);
