import React from "react";
import Analytics from "pages/Analytics";

import { Route, Routes } from "react-router-dom";
import AnalyticsListPage from "pages/Analytics/AnalyticsList";
import {
	analyticsPath,
	completedOutstangindDefectPath,
	conditionMonitoringPath,
	defectsByRiskRatingPath,
	defectsBySystemPath,
	defectsByTypePath,
	defectsRegisteredPath,
	missingPartsToolsPath,
	overdueServicesPath,
	plannedWorkPath,
	serviceAverageTime,
	servicePausePath,
	serviceSkippedPath,
	serviceStatusPath,
	serviceStopPath,
} from "helpers/routePaths";
import DefectTypePage from "../DefectsType";
import DefectsRiskRatingPage from "../DefectsRiskRating";
import DefectsSystemPage from "../DefectsSystem";
import DefectsRegisteredPage from "../DefectsRegistered";
import MissingPartsToolsPage from "../MissingPartsTools";
import OverdueServicesPage from "../OverdueServices";
import PlannedWorkPage from "../PlannedWork";
import ServicePausePage from "../ServicePause";
import ServiceSkippedPage from "../ServiceSkipped";
import ServiceStatusPage from "../ServiceStatus";
import ServiceStopPage from "../ServiceStop";
import ConditionMonitoringPage from "../ConditionMonitoring";
import CompletedOutstandingDefectsPage from "../CompletedVsOutstanding";
import ServiceAverageTimesPage from "../ServiceAverageTimes";
import AccessRoute from "components/HOC/AccessRoute";
import access from "helpers/access";

const AnalyticsPage = () => {
	return (
		<Analytics>
			<Routes>
				<Route element={<AccessRoute access={access.analyticsAccess} />}>
					<Route path={defectsByTypePath} element={<DefectTypePage />} />
					<Route
						path={defectsByRiskRatingPath}
						element={<DefectsRiskRatingPage />}
					/>
					<Route path={defectsBySystemPath} element={<DefectsSystemPage />} />
					<Route
						path={defectsRegisteredPath}
						element={<DefectsRegisteredPage />}
					/>
					<Route
						path={missingPartsToolsPath}
						element={<MissingPartsToolsPage />}
					/>
					<Route path={overdueServicesPath} element={<OverdueServicesPage />} />
					<Route path={plannedWorkPath} element={<PlannedWorkPage />} />
					<Route path={servicePausePath} element={<ServicePausePage />} />
					<Route path={serviceSkippedPath} element={<ServiceSkippedPage />} />
					<Route path={serviceStatusPath} element={<ServiceStatusPage />} />
					<Route path={serviceStopPath} element={<ServiceStopPage />} />
					<Route
						path={conditionMonitoringPath}
						element={<ConditionMonitoringPage />}
					/>
					<Route
						path={completedOutstangindDefectPath}
						element={<CompletedOutstandingDefectsPage />}
					/>
					<Route
						path={serviceAverageTime}
						element={<ServiceAverageTimesPage />}
					/>
				</Route>
				<Route index element={<AnalyticsListPage />} />
			</Routes>
		</Analytics>
	);
};

export default AnalyticsPage;
