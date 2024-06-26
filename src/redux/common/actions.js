import instance from "helpers/api";
import { commonSlice } from "redux/common/reducers";
import { authSlice } from "redux/auth/reducers.js";
import { setStorage } from "helpers/storage";
import roles from "helpers/roles";

const { setError, removeError, setLoading, openHistoryDrawer, setShowData } =
	commonSlice.actions;
const { dataSuccess } = authSlice.actions;

export const showError = (message) => (dispatch) =>
	dispatch(setError({ message }));

export const loginWithSiteAppId = (id) => async (dispatch) => {
	dispatch(setLoading({ loading: true }));

	const res = await instance.get(`/api/Users/LoginToSiteApp/${id}`);
	const data = {
		...res.data,
		isAdmin: localStorage.getItem("isAdmin") === "true",
		isSiteUser: true,
	};
	const response = await setStorage(data);
	if (response.role === roles.clientAdmin) {
		localStorage.removeItem("clientAdminMode");
	}
	localStorage.removeItem("siteAppId");
	localStorage.removeItem("isAdmin");
	dispatch(dataSuccess({ data }));

	dispatch(setLoading({ loading: false }));
	return res;
};

export const hideError = () => (dispatch) => dispatch(removeError());

export const setHistoryDrawerState = (payload) => (dispatch) =>
	dispatch(openHistoryDrawer({ historyDrawerState: payload }));

//showData for analytics page
export const setAnalyticsShowData = (payload) => (dispatch) => {
	dispatch(
		setShowData({ showData: payload.data, showDataState: payload.state })
	);
};
