import { getSiteApplicationDetail } from "services/clients/sites/siteApplications/siteApplicationDetails";

const storageLocal =
	localStorage.getItem("me") && JSON.parse(localStorage.getItem("me"));
const storageSession =
	sessionStorage.getItem("me") && JSON.parse(sessionStorage.getItem("me"));
const localApplication = storageLocal?.application;
const sessionApplication = sessionStorage?.application;

let updatedField = {
	alertColor: localApplication?.alertColor || sessionApplication?.alertColor,
	allowFacilityBasedModels:
		localApplication?.allowFacilityBasedModels ||
		sessionApplication?.allowFacilityBasedModels,
	allowIndividualAssetModels:
		localApplication?.allowIndividualAssetModels ||
		sessionApplication?.allowIndividualAssetModels,
	allowRegisterAssetsForServices:
		localApplication?.allowRegisterAssetsForServices ||
		sessionApplication?.allowRegisterAssetsForServices,
	color: localApplication?.color || sessionApplication?.color,
	logoURL: localApplication?.logoURL || sessionApplication?.logoURL,
	mobileSmallWhiteAppLogoURL:
		localApplication?.mobileSmallWhiteAppLogoURL ||
		sessionApplication?.mobileSmallWhiteAppLogoURL,
	mobileWhiteAppLogoURL:
		localApplication?.mobileWhiteAppLogoURL ||
		sessionApplication?.mobileWhiteAppLogoURL,
	name: localApplication?.name || sessionApplication?.name,
	navigationLogoURL:
		localApplication?.navigationLogoURL ||
		sessionApplication?.navigationLogoURL,
	showArrangements:
		localApplication?.showArrangements || sessionApplication?.showArrangements,
	showDefectParts:
		localApplication?.showDefectParts || sessionApplication?.showDefectParts,
	showLubricants:
		localApplication?.showLubricants || sessionApplication?.showLubricants,
	showOperatingMode:
		localApplication?.showOperatingMode || sessionStorage?.showOperatingMode,
	showParts: localApplication?.showParts || sessionApplication?.showParts,
	showSerialNumberRange:
		localApplication?.showSerialNumberRange ||
		sessionStorage?.showSerialNumberRange,
	showServiceClientName:
		localApplication?.showServiceClientName ||
		sessionStorage?.showServiceClientName,
	showSystem: localStorage?.showSystem || sessionStorage?.showSystem,
	smallLogoURL: localStorage?.smallLogoURL || sessionStorage?.smallLogoURL,
};

const updateStorage = async (siteId) => {
	const result = await getSiteApplicationDetail(siteId);
	const dataAfterUpdate = result.data?.application;
	if (dataAfterUpdate) {
		const objectKeys = Object.keys(updatedField);
		for (let i = 0; i < objectKeys.length; i++) {
			const key = objectKeys[i];
			updatedField[key] = dataAfterUpdate[key];
		}
	}
	if (storageLocal?.application) {
		localStorage.setItem(
			"me",
			JSON.stringify({
				...storageLocal,
				application: updatedField,
			})
		);
		sessionStorage.setItem(
			"me",
			JSON.stringify({
				...storageLocal,
				application: updatedField,
			})
		);
	}
	if (storageSession?.application) {
		sessionStorage.setItem(
			"me",
			JSON.stringify({
				...storageSession,
				application: updatedField,
			})
		);
		localStorage.setItem(
			"me",
			JSON.stringify({
				...storageSession,
				application: updatedField,
			})
		);
	}
};
export default updateStorage;
