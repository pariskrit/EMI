import { CircularProgress, Link } from "@material-ui/core";
import AudioPlayer from "components/Elements/AudioPlayer";
import ColourConstants from "helpers/colourConstants";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { showError } from "redux/common/actions";
import { getServiceDefects } from "services/services/serviceDefects/defects";
import DefectsListTable from "./DefectsListTable";

function Defects({ state, customCaptions, siteAppID, serviceId }) {
	const dispatch = useDispatch();
	const history = useHistory();

	const [defects, setDefects] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const result = await getServiceDefects(serviceId);
				if (result.status) {
					setDefects(
						result.data.map((x) => ({
							...x,
							number: (
								<Link
									onClick={() => history.push(`/app/defects/${x.id}`)}
									style={{
										color: ColourConstants.activeLink,
										cursor: "pointer",
										textDecoration: "none",
									}}
								>
									{x.number}
								</Link>
							),
							audio: (
								<>{x?.audio ? <AudioPlayer audioSource={x?.audio} /> : ""}</>
							),
							defectStatusName: (
								<span
									style={{
										color:
											x.defectStatusName === "Complete"
												? ColourConstants.green
												: ColourConstants.red,
									}}
								>
									{x.defectStatusName}
								</span>
							),
						}))
					);
				} else {
					dispatch(
						showError(result?.data?.detail || "Could not fetch service defects")
					);
				}
			} catch (error) {
				dispatch(
					showError(error?.data?.detail || "Could not fetch service defects")
				);
			}
			setLoading(false);
		})();
	}, [dispatch, serviceId, history]);

	if (loading) {
		return <CircularProgress />;
	}
	return (
		<div style={{ marginTop: 25, display: "flex", justifyContent: "center" }}>
			<DefectsListTable
				data={defects}
				columns={[
					"number",
					"taskName",
					"details",
					"defectTypeName",
					"riskRatingName",
					"defectStatusName",
					"audio",
					"createdUserName",
				]}
				customCaptions={customCaptions}
				headers={[
					{ id: 1, name: "Number" },
					{
						id: 2,
						name: customCaptions?.task,
					},
					{
						id: 3,
						name: `Description`,
					},
					{
						id: 4,
						name: customCaptions?.defectType,
					},
					{
						id: 5,
						name: customCaptions?.riskRating,
					},
					{
						id: 8,
						name: customCaptions?.defectStatus,
					},
					{
						id: 6,
						name: `Audio`,
					},
					{
						id: 7,
						name: `Created By`,
					},
				]}
			/>
		</div>
	);
}

export default Defects;
