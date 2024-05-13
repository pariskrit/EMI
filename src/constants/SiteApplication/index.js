import {
	siteAppCustomCaptionsPath,
	siteAppDefectRiskRatingsPath,
	siteAppDefectStatusPath,
	siteAppDefectTypesPath,
	siteAppDetailPath,
	siteAppFeedbackClassificationsPath,
	siteAppFeedbackPrioritiesPath,
	siteAppFeedbackStatuses,
	siteAppMissingItemsPath,
	siteAppModelStatusesPath,
	siteAppModelTypesPath,
	siteAppOperationModesPath,
	siteAppPausePath,
	siteAppPositionsPath,
	siteAppSkippedTasksPath,
	siteAppStatusChangesPath,
	siteAppStopsReasonsPath,
	siteAppTaskActionsPath,
	siteAppTaskLubricants,
	siteAppTaskSystemsPath,
	siteAppUserRolesPath,
} from "helpers/routePaths";
import {
	getSiteApplicationDefectRiskRatingHistory,
	getSiteApplicationDefectStatusHistory,
	getSiteApplicationDefectTypeHistory,
	getSiteApplicationDetailsHistory,
	getSiteApplicationFeedbackClassificationHistory,
	getSiteApplicationFeedbackPriorityHistory,
	getSiteApplicationFeedbackStatusHistory,
	getSiteApplicationMissingPartToolReasonHistory,
	getSiteApplicationModelStatusHistory,
	getSiteApplicationModelTypeHistory,
	getSiteApplicationPauseReasonHistory,
	getSiteApplicationSkippedTaskReasonHistory,
	getSiteApplicationStatusChangeReasonHistory,
	getSiteApplicationStopReasonHistory,
	getSiteApplicationTaskActionHistory,
	getSiteApplicationTaskLubricants,
	getSiteApplicationTaskOperatingModeHistory,
	getSiteApplicationTaskSystemHistory,
	getSiteApplicationUserPositionHistory,
	getSiteApplicationUserRoleHistory,
} from "services/History/siteApplications";

export const getSiteAppHistory = (route) => {
	switch (route) {
		case siteAppDetailPath:
			return getSiteApplicationDetailsHistory;
		case siteAppCustomCaptionsPath:
			return getSiteApplicationDetailsHistory;
		case siteAppPausePath:
			return getSiteApplicationPauseReasonHistory;
		case siteAppStopsReasonsPath:
			return getSiteApplicationStopReasonHistory;
		case siteAppSkippedTasksPath:
			return getSiteApplicationSkippedTaskReasonHistory;
		case siteAppMissingItemsPath:
			return getSiteApplicationMissingPartToolReasonHistory;
		case siteAppStatusChangesPath:
			return getSiteApplicationStatusChangeReasonHistory;
		case siteAppModelStatusesPath:
			return getSiteApplicationModelStatusHistory;
		case siteAppModelTypesPath:
			return getSiteApplicationModelTypeHistory;
		case siteAppTaskActionsPath:
			return getSiteApplicationTaskActionHistory;
		case siteAppTaskSystemsPath:
			return getSiteApplicationTaskSystemHistory;
		case siteAppOperationModesPath:
			return getSiteApplicationTaskOperatingModeHistory;
		case siteAppPositionsPath:
			return getSiteApplicationUserPositionHistory;
		case siteAppUserRolesPath:
			return getSiteApplicationUserRoleHistory;
		case siteAppDefectRiskRatingsPath:
			return getSiteApplicationDefectRiskRatingHistory;
		case siteAppDefectStatusPath:
			return getSiteApplicationDefectStatusHistory;
		case siteAppDefectTypesPath:
			return getSiteApplicationDefectTypeHistory;
		case siteAppFeedbackClassificationsPath:
			return getSiteApplicationFeedbackClassificationHistory;
		case siteAppFeedbackPrioritiesPath:
			return getSiteApplicationFeedbackPriorityHistory;
		case siteAppFeedbackStatuses:
			return getSiteApplicationFeedbackStatusHistory;
		case siteAppTaskLubricants:
			return getSiteApplicationTaskLubricants;
		default:
			return;
	}
};
