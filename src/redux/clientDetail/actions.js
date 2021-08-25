import { clientDetailSlice } from "./reducers";
import API from "helpers/api";
import { BASE_API_PATH } from "helpers/constants";

const {
	clientDetailInitialize,
	clientDetailFetchSuccess,
	clientDetailFailure,
	clientReset,
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

export const resetClient = () => (dispatch) => dispatch(clientReset());
