import SiteWrapper from "components/Layouts/SiteWrapper";
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
import { siteScreenNavigation } from "helpers/constants";
import ImportListDialog from "./ImportListDialog";
import { showError } from "redux/common/actions";
import { DefaultPageSize } from "helpers/constants";
import { getLocalStorageData } from "helpers/utils";
import TabTitle from "components/Elements/TabTitle";

const SiteAsset = ({ fetchCrumbs, getError, siteDetails }) => {
	const history = useHistory();
	const { id, clientId } = useParams();
	const [modal, setModal] = useState({ import: false, add: false });
	const [data, setData] = useState([]);
	const [count, setCount] = useState(null);
	const cancelFetch = useRef(false);
	const [isLoading, setIsLoading] = useState(true);

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

	const fetchSiteAssets = async (pNo) => {
		try {
			const response = await getSiteAssets(id, pNo, DefaultPageSize, "");

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
		setIsLoading(false);
	};

	useEffect(() => {
		fetchCrumbs(id, clientId);
		fetchAset(1);

		return () => {
			cancelFetch.current = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
					getError(response.data.detail);
					return { success: false };
				} else {
					return { success: false, errors: { ...response.data.errors } };
				}
			}
		} catch (error) {
			throw new Error(error.response);
		}
	};

	const importSuccess = () => {
		fetchAset(1);
	};

	return (
		<>
			<TabTitle title={`${siteDetails?.name} Assets`} />
			<AddAssetDialog
				open={modal.add}
				handleClose={() => setModal((th) => ({ ...th, add: false }))}
				createHandler={addAsset}
			/>
			<ImportListDialog
				open={modal.import}
				handleClose={() => setModal((th) => ({ ...th, import: false }))}
				siteId={+id}
				importSuccess={importSuccess}
				getError={getError}
				fetchSiteAssets={fetchSiteAssets}
			/>

			<SiteWrapper
				current={customCaptions?.assetPlural ?? "Assets"}
				navigation={navigation}
				onNavClick={(urlToGo) =>
					history.push(`/app/clients/${clientId}/sites/${id}${urlToGo}`)
				}
				status=""
				lastSaved=""
				showAdd
				showImport
				onClickImport={() => setModal((th) => ({ ...th, import: true }))}
				onClickAdd={() => setModal((th) => ({ ...th, add: true }))}
				Component={() => (
					<Assets
						data={data}
						count={count}
						siteId={id}
						isLoading={isLoading}
						fetchAsset={fetchAset}
						getError={getError}
						isSiteUser={role === "SiteUser" || isSiteUser}
						customCaptions={customCaptions}
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
	fetchCrumbs: (id, clientId) => dispatch(fetchSiteDetail(id, clientId)),
	getError: (msg) => dispatch(showError(msg)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SiteAsset);
