import React, { useEffect } from "react";
import { getDefectStatuses } from "services/clients/sites/siteApplications/defectStatuses";

function DefectStatuses({ appId }) {
	const fetchDefectStatuses = async () => {
		const result = await getDefectStatuses(appId);
		console.log(result);
	};

	useEffect(() => {
		fetchDefectStatuses();
	}, []);
	return (
		<div>
			<h1>defect Statuses</h1>
		</div>
	);
}

export default DefectStatuses;
