import { DefectChipTypesConstants } from "constants/DefectDetails";
import { getLocalStorageData } from "./utils";

const me =
	(localStorage.getItem("me") && JSON.parse(sessionStorage.getItem("me"))) ||
	(localStorage.getItem("me") && JSON.parse(localStorage.getItem("me")));
export const DefectChipTypes = (id) => {
	return DefectChipTypesConstants(me?.customCaptions)?.filter(
		(item) => item?.id === id
	);
};
