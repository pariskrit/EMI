import SiteWrapper from "components/SiteWrapper";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { fetchSiteDetail } from "redux/siteDetail/actions";
import {
	addSiteAsset,
	getSiteAssets,
	getSiteAssetsCount,
} from "services/clients/sites/siteAssets";
import AddAssetDialog from "./AddAssetDialog";
import Assets from "./Assets";
const SiteAsset = ({ fetchCrumbs }) => {
	const history = useHistory();
	const { id } = useParams();
	const [modal, setModal] = useState({ import: false, add: false });
	const [data, setData] = useState([]);
	const [count, setCount] = useState(null);
	const cancelFetch = useRef(false);

	const fetchSiteAssets = async (pNo) => {
		try {
			const response = await getSiteAssets(id, pNo);

			if (cancelFetch.current) {
				return;
			}
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

	const getTotalPage = async () => {
		try {
			const response = await getSiteAssetsCount(id);
			if (response.status) {
				setCount(response.data);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const fetchAset = async (pageNo) => {
		await getTotalPage();
		await fetchSiteAssets(pageNo);
	};

	useEffect(() => {
		fetchCrumbs(id);
		fetchAset(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps

		return () => {
			cancelFetch.current = true;
		};
	}, []);

	const addAsset = async (input) => {
		try {
			const response = await addSiteAsset({
				siteId: +id,
				...input,
			});
			if (response.status) {
				await fetchAset(1);
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
				Component={() => <Assets data={data} count={count} siteId={id} />}
			/>
		</>
	);
};

const mapDispatchToProps = (dispatch) => ({
	fetchCrumbs: (id) => dispatch(fetchSiteDetail(id)),
});

export default connect(null, mapDispatchToProps)(SiteAsset);
