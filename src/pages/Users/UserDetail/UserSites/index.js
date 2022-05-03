import { CircularProgress } from "@material-ui/core";
import DetailsPanel from "components/Elements/DetailsPanel";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { showError } from "redux/common/actions";
import { getUserSites } from "services/users/userSites";
import UserSiteListTable from "./userSiteListTable";

function UserSite() {
	const { id } = useParams();

	const [sites, setSites] = useState([]);
	const [loading, setLoading] = useState(true);

	const dispatch = useDispatch();

	const fetchUserSites = useCallback(async () => {
		try {
			const response = await getUserSites(id);
			if (response.status) {
				setSites(
					response.data.reduce((sites, item, index) => {
						const mappedSites = item.sites;
						return [...mappedSites, ...sites];
					}, [])
				);
			} else {
				dispatch(
					showError(response?.data?.title || "Could not fetch user sites")
				);
			}
		} catch (error) {
			showError(error?.response?.detail || "Could not fetch user sites");
		} finally {
			setLoading(false);
		}
	}, [id, dispatch]);

	useEffect(() => {
		fetchUserSites();
	}, [fetchUserSites]);

	if (loading) return <CircularProgress />;

	return (
		<div>
			<div className="detailsContainer">
				<DetailsPanel
					header={`Sites`}
					description={`Manage the Sites this user has access to`}
					dataCount={null}
				/>
			</div>
			<UserSiteListTable
				data={sites}
				clientUserID={id}
				fetchUserSites={fetchUserSites}
				columns={["name", "Department", "Active"]}
				headers={[
					{ id: 1, name: "Site Name", width: "33.33vw" },
					{
						width: "33.33vw",
						id: 2,
						name: `Department`,
					},
					{
						id: 3,
						name: `Active`,
						width: "33.33vw",
					},
				]}
			/>
		</div>
	);
}

export default UserSite;
