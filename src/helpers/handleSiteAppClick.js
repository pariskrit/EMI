import { showError } from "redux/common/actions";
import { REMOVE_SESSIONS, defaultRedirect } from "./constants";
import roles from "./roles";
import { setStorage } from "./storage";
import instance from "./api";

export const handleSiteAppClick =
	(id, goToFeedbackPage) => async (dispatch) => {
		// dispatch(setLoading({ loading: true }));

		try {
			const res = await instance.get(`/api/Users/LoginToSiteApp/${id}`);

			localStorage.setItem("siteAppId", id);
			localStorage.setItem(
				"clientUserId",
				sessionStorage.getItem("clientUserId")
			);
			localStorage.setItem("isAdmin", sessionStorage.getItem("isAdmin"));
			const data = {
				...res.data,
				isAdmin: false,
				isSiteUser: true,
			};
			const response = await setStorage(data);
			if (response.role === roles.clientAdmin) {
				localStorage.removeItem("clientAdminMode");
			}
			localStorage.removeItem("siteAppId");
			localStorage.removeItem("isAdmin");
			REMOVE_SESSIONS.forEach((elem) => {
				sessionStorage.removeItem(elem);
			});

			//dispatch(dataSuccess({ data }));

			//  dispatch(setLoading({ loading: false }));
			if (goToFeedbackPage) {
				return;
			}
			const { position } = res.data;
			window.open(defaultRedirect[position?.defaultPage]);
		} catch {
			dispatch(
				showError(
					"Your license count has exceeded its limit. Please contact your site administrator"
				)
			);
		}
	};
