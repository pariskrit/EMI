import { ReactComponent as AnalyticsIcon } from "assets/icons/analyticsIcon.svg";
import { ReactComponent as ApplicationIcon } from "assets/icons/applicationsIcon.svg";
import { ReactComponent as ClientIcon } from "assets/icons/clientsIcon.svg";
import { ReactComponent as UserIcon } from "assets/icons/usersIcon.svg";
import { ReactComponent as ModelIcon } from "assets/icons/modelsIcon.svg";
import access from "helpers/access";
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
} from "helpers/routePaths";

const navList = [
	{
		name: "Clients",
		icon: ClientIcon,
		path: clientsPath,
		access: "",
		position: null,
	},
	{
		name: "Applications",
		icon: ApplicationIcon,
		path: applicationListPath,
		access: "",
		position: null,
	},
	{
		name: "Models",
		icon: ModelIcon,
		path: modelsPath,
		access: access.modelAccess,
		position: "",
	},
	{
		name: "Users",
		icon: UserIcon,
		path: usersPath,
		access: access.userAccess,
		position: null,
	},
	{
		name: "Analytics",
		icon: AnalyticsIcon,
		path: analyticsPath,
		access: access.analyticsAccess,
		position: null,
	},
	{
		name: "Services",
		icon: ModelIcon,
		path: servicesPath,
		access: access.serviceAccess,
		position: "",
	},
	{
		name: "Defects",
		icon: ModelIcon,
		path: defectsPath,
		access: access.defectAccess,
		position: "",
	},
	{
		name: "Defect Export",
		icon: ModelIcon,
		path: defectExportPath,
		access: access.defectExportAccess,
		position: "",
	},
	{
		name: "Analysis",
		icon: ModelIcon,
		path: analysisPath,
		access: access.analysisAccess,
		position: "",
	},
	{
		name: "Feedback",
		icon: ModelIcon,
		path: feedbackPath,
		access: access.feedbackAccess,
		position: "",
	},
	{
		name: "Noticeboards",
		icon: ModelIcon,
		path: noticeboardPath,
		access: access.noticeboardAccess,
		position: "",
	},
	{
		name: "Setting",
		icon: ModelIcon,
		path: settingPath,
		access: access.settingsAccess,
		position: "",
	},
];
export default navList;
