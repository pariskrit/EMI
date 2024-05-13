import { clientDetailSlice } from "./reducers";
import { getClientDetails } from "services/clients/clientDetailScreen";

const {
	clientDetailInitialize,
	clientDetailFetchSuccess,
	clientDetailFailure,
	clientReset,
} = clientDetailSlice.actions;

export const fetchClientDetail = (id) => async (dispatch) => {
	dispatch(clientDetailInitialize());
	try {
		const response = await getClientDetails(id);
		if (response) {
			dispatch(clientDetailFetchSuccess({ data: response.data }));
		} else {
			throw new Error(response);
		}
	} catch (err) {
		dispatch(clientDetailFailure());
	}
};

export const resetClient = () => (dispatch) => dispatch(clientReset());
