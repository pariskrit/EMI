import API from "helpers/api";
import SiteWrapper from "components/SiteWrapper";
import { BASE_API_PATH } from "helpers/constants";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import SiteDepartmentsContent from "./SiteDepartmentsContent";
import { getSiteDepartments } from "services/clients/sites/siteDepartments";
import AddSiteDepartmentDialog from "components/SiteDepartment/AddSiteDepartmentDialog";

const SiteDepartmentsScreen = () => {
	const { id } = useParams();
	const history = useHistory();
	const [data, setData] = useState([]);
	const [modal, setModal] = useState({ add: false });

	const fetchSiteDepartments = async () => {
		try {
			const response = await getSiteDepartments(id);
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

		// setDataChanged(true);
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
				onNavClick={(path) => history.push(path)}
				status=""
				lastSaved=""
				showAdd
				onClickAdd={() => setModal((th) => ({ add: true }))}
				Component={() => (
					<SiteDepartmentsContent data={data} setData={setData} />
				)}
			/>
		</>
	);
};

export default SiteDepartmentsScreen;
