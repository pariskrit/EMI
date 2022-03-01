import { CircularProgress } from "@material-ui/core";
import DetailsPanel from "components/Elements/DetailsPanel";
import React, { useCallback, useEffect, useState } from "react";
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

const Zones = ({ taskInfo, access }) => {
	const { id } = taskInfo;
	const dispatch = useDispatch();

	const [zones, setZones] = useState([]);
	const [originalZones, setOriginalZones] = useState([]);
	const [loading, setLoading] = useState(false);
	const [siteAssset, setSiteAssest] = useState([]);
	const [assestCount, setAssestCount] = useState(null);

	const {
		customCaptions,
		position: { siteAppID },
		siteID,
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me"));

	// checking the access of the user to allow or disallow edit add.
	const isReadOnly = access === "R";

	const fetchModelTaskZones = async (taskId) => {
		setLoading(true);
		try {
			const response = await getModelTaskZonesList(taskId);
			if (response.status) {
				setZones(response.data);
				setOriginalZones(response.data);
			} else {
				dispatch(
					showError(
						response?.data?.title ||
							response?.data ||
							"Could not update task detail"
					)
				);
			}
		} catch (error) {
			dispatch(
				showError(
					error?.response?.data ||
						error?.response ||
						"Could not update task detail"
				)
			);
		} finally {
			setLoading(false);
		}
	};

	const fetchCountAssest = async () => {
		const response = await getSiteAssetsCount(siteID);
		if (response.status) {
			setAssestCount(response.data);
		}
	};

	useEffect(() => {
		fetchModelTaskZones(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const fetchSiteAssest = async (
		siteAppID,
		pageNo,
		perPage = 20,
		search = ""
	) => {
		try {
			const response = await getSiteAssetsForZones(
				siteAppID,
				pageNo,
				perPage,
				search
			);
			setSiteAssest((prev) => [...prev, ...response.data]);
		} catch (error) {
			dispatch(error?.response?.data || "Coulnd not fetch site asset");
		}
	};
	useEffect(() => {
		!isReadOnly &&
			Promise.all([fetchSiteAssest(siteAppID, 1), fetchCountAssest()]);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [siteAppID, isReadOnly]);

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
		[dispatch, zones, originalZones, id]
	);

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
				isReadOnly={isReadOnly}
			/>
		</div>
	);
};

export default Zones;
