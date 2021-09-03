import SiteWrapper from "components/SiteWrapper";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import SiteLocationsContent from "./SiteLocationsContent";
import { getSiteLocations } from "services/clients/sites/siteLocations";
import AddSiteLocationsDialog from "components/SiteLocations/AddSiteLocationsDialog";

const SiteLocationsScreen = () => {
	const { id } = useParams();
	const history = useHistory();
	const [data, setData] = useState([]);
	const [modal, setModal] = useState({ add: false });

	const fetchSiteDepartments = async () => {
		try {
			const response = await getSiteLocations(id);
			if (response.status) {
				setData(response.data);
				return response;
			} else {
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
				onNavClick={(path) => history.push(path)}
				status=""
				lastSaved=""
				showAdd
				onClickAdd={() => setModal((th) => ({ add: true }))}
				Component={() => <SiteLocationsContent data={data} setData={setData} />}
			/>
		</>
	);
};

export default SiteLocationsScreen;
