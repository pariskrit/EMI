import { clientDetailSlice } from "./reducers";
import API from "helpers/api";
import { BASE_API_PATH } from "helpers/constants";

const {
	clientDetailInitialize,
	clientDetailFetchSuccess,
	clientDetailFailure,
} = clientDetailSlice.actions;

export const fetchClientDetail = (id) => async (dispatch) => {
	dispatch(clientDetailInitialize());
	try {
		const response = await API.get(`${BASE_API_PATH}Clients/${id}`);
		if (response.status === 200) {
			dispatch(clientDetailFetchSuccess({ data: response.data }));
		} else {
			throw new Error(response);
		}
	} catch (err) {
		console.log(err.response);
		dispatch(clientDetailFailure());
	}
};

export const patchClientDetail = (id, data) => async (dispatch) => {
	dispatch(clientDetailInitialize());
	try {
		const result = await API.patch(`${BASE_API_PATH}Clients/${id}`, data);
		if (result?.status === 200) {
			console.log(result.data);
			return true;
		} else {
			throw new Error(result);
		}
	} catch (err) {
		//console.log("rr",err);
		if (err?.response?.data?.detail) {
			//setError({ status: true, message: err?.response.data.detail });
		}
		if (err?.response?.data?.errors?.name) {
			// setError({ status: true, message: err.response.data.errors.name[0] });
		}
		return err;
	}
};
