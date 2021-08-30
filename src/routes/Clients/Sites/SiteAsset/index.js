import React from "react";
import SiteWrapper from "components/SiteWrapper";
import { useHistory, useParams } from "react-router-dom";
import Assets from "./Assets";
import API from "helpers/api";

const SiteAsset = () => {
	const history = useHistory();
	const { id } = useParams();

	const fetchSiteAssets = async () => {
		try {
			const response = await API.get(`/api/siteassets?site=${id}`);
			if (response.status === 200) {
				return response;
			} else {
				throw new Error(response);
			}
		} catch (err) {
			console.log(err);
			return err;
		}
	};

	return (
		<SiteWrapper
			current="Assets"
			onNavClick={(path) => history.push(path)}
			status=""
			lastSaved=""
			showAdd
			showImport
			onClickAdd={() => alert("Add")}
			Component={() => <Assets fetchSiteAssets={fetchSiteAssets} />}
		/>
	);
};

export default SiteAsset;
