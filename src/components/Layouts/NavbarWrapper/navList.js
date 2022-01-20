import { ReactComponent as AnalyticsIcon } from "assets/icons/analyticsIcon.svg";
import { ReactComponent as ApplicationIcon } from "assets/icons/applicationsIcon.svg";
import { ReactComponent as ClientIcon } from "assets/icons/clientsIcon.svg";
import { ReactComponent as UserIcon } from "assets/icons/usersIcon.svg";
import { ReactComponent as ModelIcon } from "assets/icons/modelsIcon.svg";
import access from "helpers/access";
import role from "helpers/roles";
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
import roles from "helpers/roles";
const clientName =
	JSON.parse(localStorage.getItem("clientAdminMode"))?.label ||
	JSON.parse(localStorage.getItem("me"))?.firstName;

const navList = [
	{
		name: "Clients",
		icon: ClientIcon,
		path: clientsPath,
		access: "",
		roles: [roles.superAdmin],
	},
	{
		name: "Applications",
		icon: ApplicationIcon,
		path: applicationListPath,
		access: "",
		roles: [roles.superAdmin],
	},
	{
		name: `${clientName}`,
		icon: ClientIcon,
		path: clientSettingPath,
		access: "",
		roles: [roles.clientAdmin],
	},
	{
		name: "Models",
		icon: ModelIcon,
		path: modelsPath,
		access: access.modelAccess,
		roles: "",
	},
	{
		name: "Users",
		icon: UserIcon,
		path: usersPath,
		access: access.userAccess,
		roles: [roles.superAdmin, roles.clientAdmin],
	},
	{
		name: "Analytics",
		icon: AnalyticsIcon,
		path: analyticsPath,
		access: access.analyticsAccess,
		roles: [roles.superAdmin, roles.clientAdmin],
	},
	{
		name: "Services",
		icon: ModelIcon,
		path: servicesPath,
		access: access.serviceAccess,
		roles: "",
	},
	{
		name: "Defects",
		icon: ModelIcon,
		path: defectsPath,
		access: access.defectAccess,
		roles: "",
	},
	{
		name: "Defect Export",
		icon: ModelIcon,
		path: defectExportPath,
		access: access.defectExportAccess,
		roles: "",
	},
	{
		name: "Analysis",
		icon: ModelIcon,
		path: analysisPath,
		access: access.analysisAccess,
		roles: "",
	},
	{
		name: "Feedback",
		icon: ModelIcon,
		path: feedbackPath,
		access: access.feedbackAccess,
		roles: "",
	},
	{
		name: "Noticeboards",
		icon: ModelIcon,
		path: noticeboardPath,
		access: access.noticeboardAccess,
		roles: "",
	},
	{
		name: "Setting",
		icon: ModelIcon,
		path: settingPath,
		access: access.settingsAccess,
		roles: "",
	},
];
export default navList;
