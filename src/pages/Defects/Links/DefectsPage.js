import React from "react";
import AccessRoute from "components/HOC/AccessRoute";
import { defectsDetailsPath, defectsPath } from "helpers/routePaths";
import access from "helpers/access";
import Defects from "..";
import DefectsList from "../DefectsList";
import DefectDetailPage from "../DefectDetails";

const DefectsPage = () => {
	return (
		<Defects>
			<AccessRoute
				path={defectsPath}
				exact
				component={DefectsList}
				access={access.defectAccess}
			/>
			<AccessRoute
				path={defectsDetailsPath}
				component={DefectDetailPage}
				access={access.defectAccess}
			/>
		</Defects>
	);
};

export default DefectsPage;
