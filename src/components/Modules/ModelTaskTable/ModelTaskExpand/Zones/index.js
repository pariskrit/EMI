import { CircularProgress } from "@material-ui/core";
import DetailsPanel from "components/Elements/DetailsPanel";
import withMount from "components/HOC/withMount";
import { ModelContext } from "contexts/ModelDetailContext";
import { TaskContext } from "contexts/TaskDetailContext";
import useDidMountEffect from "hooks/useDidMountEffect";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showError } from "redux/common/actions";
import { getSiteAssetsCount } from "services/clients/sites/siteAssets";
import {
	addModelTaskZone,
	getModelTaskZonesList,
	getSiteAssetsForZones,
	removeModelTaskZone,
} from "services/models/modelDetails/modelTaskZones";
import TaskZoneListTable from "./TaskZoneListTable";

const Zones = ({ taskInfo, access, isMounted }) => {
	const { id } = taskInfo;
	const dispatch = useDispatch();

	const [zones, setZones] = useState([]);
	const [originalZones, setOriginalZones] = useState([]);
	const [loading, setLoading] = useState(true);
	const [siteAssset, setSiteAssest] = useState([]);
	const [assestCount, setAssestCount] = useState(null);
	const [, CtxDispatch] = useContext(TaskContext);
	const [state] = useContext(ModelContext);

	const {
		customCaptions,
		position: { siteAppID },
		siteID,
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	// checking the access of the user to allow or disallow edit add.
	const isReadOnly = access === "R";

	const fetchModelTaskZones = useCallback(
		async (showLoading = true) => {
			!isMounted.aborted && showLoading && setLoading(true);
			try {
				const response = await getModelTaskZonesList(id);
				if (response.status) {
					if (!isMounted.aborted) {
						setZones(response.data);
						setOriginalZones(response.data);
					}
				} else {
					dispatch(
						showError(
							response?.data?.detail ||
								response?.data ||
								"Could not fetch task detail"
						)
					);
				}
			} catch (error) {
				dispatch(
					showError(
						error?.response?.data ||
							error?.response ||
							"Could not fetch task detail"
					)
				);
			} finally {
				!isMounted.aborted && showLoading && setLoading(false);
			}
		},
		[dispatch, isMounted.aborted, id]
	);

	const fetchCountAssest = async () => {
		const response = await getSiteAssetsCount(siteID);
		if (response.status) {
			if (!isMounted.aborted) {
				setAssestCount(response.data);
			}
		}
	};

	useEffect(() => {
		fetchModelTaskZones();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const fetchSiteAssest = async (
		siteAppID,
		pageNo,
		perPage = 10,
		search = ""
	) => {
		try {
			const response = await getSiteAssetsForZones(
				siteAppID,
				pageNo,
				perPage,
				search
			);
			if (!isMounted.aborted) {
				setSiteAssest((prev) =>
					[...prev, ...(response?.data || [])].reduce((acc, current) => {
						const x = acc.find((item) => item.id === current.id);
						if (!x) {
							return acc.concat([current]);
						} else {
							return acc;
						}
					}, [])
				);
			}
		} catch (error) {
			dispatch(error?.response?.data || "Coulnd not fetch site asset");
		}
	};
	useEffect(() => {
		!isReadOnly && Promise.all([fetchCountAssest()]);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [siteAppID, isReadOnly]);

	const fetchSiteFromDropDown = async (searchTxt) => {
		return await Promise.all([
			fetchSiteAssest(siteAppID, 1, 10, searchTxt),
			fetchCountAssest(),
		]);
	};

	const handleSelectZone = useCallback(
		async (modelVersionZoneID, setSelected) => {
			setSelected(true);
			const toFindSelectZone = zones.find(
				(z) => z.modelVersionZoneID === modelVersionZoneID
			);
			if (toFindSelectZone?.id === null) {
				setZones(
					zones.map((z) =>
						z.modelVersionZoneID === modelVersionZoneID ? { ...z, id: true } : z
					)
				);
				try {
					const response = await addModelTaskZone({
						ModelVersionTaskID: id,
						ModelVersionZoneID: modelVersionZoneID,
						SiteAssetID: toFindSelectZone?.siteAssetID || null,
					});
					if (response.status) {
						setOriginalZones(
							originalZones.map((z) =>
								z.modelVersionZoneID === modelVersionZoneID
									? { ...z, id: response.data }
									: z
							)
						);
						setZones((prev) =>
							prev.map((z) =>
								z.modelVersionZoneID === modelVersionZoneID
									? { ...z, id: response.data }
									: z
							)
						);
						fetchModelTaskZones(false);
						document
							.getElementById(`taskExpandable${taskInfo.id}`)
							.querySelector(`#dataCellzones > div >p`).innerHTML = zones
							.map((z) =>
								z.modelVersionZoneID === modelVersionZoneID
									? { ...z, id: true }
									: z
							)
							.filter((x) => Boolean(x.id))
							.map((x) => x.name)
							.join(",");
						return;
					} else {
						setZones(originalZones);
						dispatch(
							showError(
								response?.data?.title ||
									response?.data ||
									"Could not update task detail"
							)
						);
					}
				} catch (error) {
					setZones(originalZones);
					dispatch(
						showError(
							error?.response?.data ||
								error?.response ||
								"Could not update task detail"
						)
					);
				} finally {
					setSelected(false);
				}
			} else {
				setZones(
					zones.map((z) =>
						z.modelVersionZoneID === modelVersionZoneID
							? { ...z, id: null, siteAssetID: null }
							: z
					)
				);
				try {
					const response = await removeModelTaskZone(toFindSelectZone.id);
					if (response.status) {
						setOriginalZones(
							originalZones.map((z) =>
								z.modelVersionZoneID === modelVersionZoneID
									? { ...z, id: null, siteAssetID: null }
									: z
							)
						);
						fetchModelTaskZones(false);

						document
							.getElementById(`taskExpandable${taskInfo.id}`)
							.querySelector(`#dataCellzones > div >p`).innerHTML = zones
							.map((z) =>
								z.modelVersionZoneID === modelVersionZoneID
									? { ...z, id: null }
									: z
							)
							.filter((x) => Boolean(x.id))
							.map((x) => x.name)
							.join(",");
						return;
					} else {
						setZones(originalZones);
						dispatch(
							showError(
								response?.data?.title ||
									response?.data ||
									"Could not update task detail"
							)
						);
					}
				} catch (error) {
					setZones(originalZones);
					dispatch(
						showError(
							error?.response?.data ||
								error?.response ||
								"Could not update task detail"
						)
					);
				} finally {
					setSelected(false);
				}
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[dispatch, zones, originalZones, id]
	);

	useDidMountEffect(() => {
		CtxDispatch({
			type: "TAB_COUNT",
			payload: {
				countTab: "zoneCount",
				data: zones.filter((z) => Boolean(z.id)).length,
			},
		});
	}, [zones]);

	if (loading) return <CircularProgress />;
	return (
		<div style={{ marginBottom: "20px" }}>
			<div className="detailsContainer" style={{ alignItems: "center" }}>
				<DetailsPanel
					header={customCaptions?.zonePlural}
					dataCount={zones.filter((z) => Boolean(z.id)).length}
				/>
			</div>
			<TaskZoneListTable
				data={zones}
				handleSelectZone={handleSelectZone}
				siteAssset={siteAssset}
				fetchSiteAssest={fetchSiteAssest}
				siteAppId={siteAppID}
				setSiteAssest={setSiteAssest}
				assestCount={assestCount}
				taskId={id}
				setZones={setZones}
				setOriginalZones={setOriginalZones}
				originalZones={originalZones}
				customCaptions={customCaptions}
				isReadOnly={isReadOnly || state?.modelDetail?.isPublished}
				fetchSiteFromDropDown={fetchSiteFromDropDown}
				fetchModelTaskZones={fetchModelTaskZones}
			/>
		</div>
	);
};

export default withMount(Zones);
