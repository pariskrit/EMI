import SiteWrapper from "components/SiteWrapper";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { addSiteAsset, getSiteAssets } from "services/clients/sites/siteAssets";
import AddAssetDialog from "./AddAssetDialog";
import Assets from "./Assets";

const SiteAsset = () => {
	const history = useHistory();
	const { id } = useParams();
	const [modal, setModal] = useState({ import: false, add: false });
	const [data, setData] = useState([]);

	const fetchSiteAssets = async () => {
		try {
			const response = await getSiteAssets(id);
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
		fetchSiteAssets();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const addAsset = async (input) => {
		try {
			const response = await addSiteAsset({
				siteId: +id,
				...input,
			});
			if (response.status) {
				await fetchSiteAssets();
				return { success: true };
			} else {
				if (response.data.detail) {
					return {
						success: false,
						errors: {
							name: response.data.detail,
							description: response.data.detail,
						},
					};
				} else {
					return { success: false, errors: { ...response.data.errors } };
				}
			}
		} catch (error) {
			throw new Error(error.response);
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
