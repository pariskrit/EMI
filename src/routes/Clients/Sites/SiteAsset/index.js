import React, { useState } from "react";
import SiteWrapper from "components/SiteWrapper";
import { useHistory, useParams } from "react-router-dom";
import Assets from "./Assets";
import API from "helpers/api";
import AddAssetDialog from "./AddAssetDialog";
import { BASE_API_PATH } from "helpers/constants";
import { useEffect } from "react";

const SiteAsset = () => {
	const history = useHistory();
	const { id } = useParams();
	const [modal, setModal] = useState({ import: false, add: false });
	const [data, setData] = useState([]);

	const fetchSiteAssets = async () => {
		try {
			const response = await API.get(`${BASE_API_PATH}SiteAssets?siteId=${id}`);
			if (response.status === 200) {
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
		fetchSiteAssets();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const addAsset = async (input) => {
		try {
			const response = await API.post(`${BASE_API_PATH}SiteAssets`, {
				siteId: +id,
				...input,
			});
			if (response.status === 200 || response.status === 201) {
				await fetchSiteAssets();
				return { success: true };
			} else {
				throw new Error(response);
			}
		} catch (error) {
			if (error.response.data.detail) {
				return {
					success: false,
					errors: {
						name: error.response.data.detail,
						description: error.response.data.detail,
					},
				};
			} else {
				return { success: false, errors: { ...error.response.data.errors } };
			}
		}
	};

	return (
		<>
			<AddAssetDialog
				open={modal.add}
				handleClose={() => setModal((th) => ({ ...th, add: false }))}
				createHandler={addAsset}
			/>
			<SiteWrapper
				current="Assets"
				onNavClick={(path) => history.push(path)}
				status=""
				lastSaved=""
				showAdd
				showImport
				onClickAdd={() => setModal((th) => ({ ...th, add: true }))}
				Component={() => (
					<Assets fetchSiteAssets={fetchSiteAssets} data={data} />
				)}
			/>
		</>
	);
};

export default SiteAsset;
