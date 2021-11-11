import { BASE_API_PATH } from "helpers/constants";
import {
	getUserDetails,
	getUserDetailsNotes,
	postUserDetailsNote,
	patchUserDetails,
	patchExternalReference,
} from "services/users/userDetails";
import {
	getUserProfile,
	// patchUser,
	// postPassword,
} from "services/users/userProfile";

const differentUserAPIs = {
	UserDetailsAPIs: {
		getAPI: getUserDetails,
		getNotesAPI: getUserDetailsNotes,
		postNotesAPI: postUserDetailsNote,
		patchAPI: patchUserDetails,
		patchExternalReferenceAPI: patchExternalReference,
		deleteNoteAPI: `${BASE_API_PATH}clientusernotes`,
	},
	UserProfileAPIs: {
		getAPI: getUserProfile,
		// patchAPI: patchUser,
		// postAPI: postPassword,
	},
};

export default differentUserAPIs;
