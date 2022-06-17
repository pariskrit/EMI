import { ReactComponent as AnalyticsIcon } from "assets/icons/analyticsIcon.svg";
import { ReactComponent as ApplicationIcon } from "assets/icons/applicationsIcon.svg";
import { ReactComponent as ClientIcon } from "assets/icons/clientsIcon.svg";
import { ReactComponent as UserIcon } from "assets/icons/usersIcon.svg";
import { ReactComponent as ModelIcon } from "assets/icons/modelsIcon.svg";
import { ReactComponent as ServiceIcon } from "assets/icons/services.svg";
import { ReactComponent as SettingsIcon } from "assets/icons/settings.svg";
import { ReactComponent as DefectsIcon } from "assets/icons/defects.svg";
import { ReactComponent as FeedbackIcon } from "assets/icons/feedback.svg";

import access from "helpers/access";
import roles from "helpers/roles";
import {
	applicationListPath,
	clientsPath,
	modelsPath,
	usersPath,
	servicesPath,
	analyticsPath,
	defectsPath,
	defectExportPath,
	feedbackPath,
	analysisPath,
	noticeboardPath,
	settingPath,
	clientSettingPath,
} from "helpers/routePaths";

const navList = [
	{
		activeName: "Clients",
		name: "Clients",
		icon: ClientIcon,
		path: clientsPath,
		access: "",
		roles: [roles.superAdmin],
	},
	{
		activeName: "Applications",
		name: "Applications",
		icon: ApplicationIcon,
		path: applicationListPath,
		access: "",
		roles: [roles.superAdmin],
	},
	{
		activeName: "Client",
		name: "Client Setting",
		icon: ClientIcon,
		path: clientSettingPath,
		access: "",
		roles: [roles.clientAdmin],
	},
	{
		activeName: "Models",
		name: "Models",
		icon: ModelIcon,
		path: modelsPath,
		access: access.modelAccess,
		roles: "",
	},
	{
		activeName: "Services",
		name: "Services",
		icon: ServiceIcon,
		path: servicesPath,
		access: access.serviceAccess,
		roles: "",
	},
	{
		activeName: "Analytics",
		name: "Analytics",
		icon: AnalyticsIcon,
		path: analyticsPath,
		access: access.analyticsAccess,
		roles: [roles.superAdmin, roles.clientAdmin],
	},
	{
		activeName: "Defects",
		name: "Defects",
		icon: DefectsIcon,
		path: defectsPath,
		access: access.defectAccess,
		roles: "",
	},
	{
		activeName: "Analysis",
		name: "Analysis",
		icon: ModelIcon,
		path: analysisPath,
		access: access.analysisAccess,
		roles: "",
	},

	{
		activeName: "DefectExport",
		name: "Defect Export",
		icon: ModelIcon,
		path: defectExportPath,
		access: access.defectExportAccess,
		roles: "",
	},

	{
		activeName: "Feedback",
		name: "Feedback",
		icon: FeedbackIcon,
		path: feedbackPath,
		access: access.feedbackAccess,
		roles: "",
	},
	{
		activeName: "Noticeboards",
		name: "Noticeboards",
		icon: ModelIcon,
		path: noticeboardPath,
		access: access.noticeboardAccess,
		roles: "",
	},
	{
		activeName: "Users",
		name: "Users",
		icon: UserIcon,
		path: usersPath,
		access: access.userAccess,
		roles: [roles.superAdmin, roles.clientAdmin, roles.siteUser],
	},
	{
		activeName: "Setting",
		name: "Setting",
		icon: SettingsIcon,
		path: settingPath,
		access: access.settingsAccess,
		roles: "",
	},
];
export default navList;
