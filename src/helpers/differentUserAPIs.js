import { BASE_API_PATH } from "helpers/constants";
import {
	getUserDetails,
	getUserDetailsNotes,
	postUserDetailsNote,
	patchUserDetails,
	patchSwitchUserDetails,
	patchExternalReference,
	getClientUserDetails,
} from "services/users/userDetails";
import {
	getUserProfile,
	patchUserProfile,
	postUserProfile,
	postPasswordReset,
	patchSwitchUserProfile,
	// patchUser,
	// postPassword,
} from "services/users/userProfile";

const differentUserAPIs = {
	UserDetailsAPIs: {
		getAPI: getUserDetails,
		getClientUserDetail: getClientUserDetails,
		getNotesAPI: getUserDetailsNotes,
		postNotesAPI: postUserDetailsNote,
		patchAPI: patchUserDetails,
		patchSwitchAPI: patchSwitchUserDetails,
		patchExternalReferenceAPI: patchExternalReference,
		deleteNoteAPI: `${BASE_API_PATH}clientusernotes`,
	},
	UserProfileAPIs: {
		getAPI: getUserProfile,
		patchAPI: patchUserProfile,
		postAPI: postUserProfile,
		postPasswordResetAPI: postPasswordReset,
		patchSwitchAPI: patchSwitchUserProfile,
		// patchAPI: patchUser,
		// postAPI: postPassword,
	},
};

export default differentUserAPIs;
