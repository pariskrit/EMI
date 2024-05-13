import React from "react";
import AccessRoute from "components/HOC/AccessRoute";
import { defectsDetailsPath, defectsPath } from "helpers/routePaths";
import access from "helpers/access";
import Defects from "pages/Defects";
import DefectsList from "pages/Defects/DefectsList";
import DefectDetailPage from "pages/Defects/DefectDetails";
import { Route, Routes } from "react-router-dom";
import DefectsDetails from "pages/Defects/DefectDetails";

const DefectsPage = () => {
	return (
		<Defects>
			<Routes>
				<Route element={<AccessRoute access={access.defectAccess} />}>
					<Route index element={<DefectsList />} />
					<Route path={`:id`} element={<DefectsDetails />} />
				</Route>
			</Routes>
			{/* <AccessRoute
				path={defectsPath}
				exact
				component={DefectsList}
				access={access.defectAccess}
			/>
			<AccessRoute
				path={defectsDetailsPath}
				component={DefectDetailPage}
				access={access.defectAccess}
			/> */}
		</Defects>
	);
};

export default DefectsPage;
