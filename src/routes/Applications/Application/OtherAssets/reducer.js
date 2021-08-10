/**
 * Reducer for asset state
 *
 * Actions:
 *  "add" will add a new item to reducer state
 *  "delete" will remove the provided index from the reducer state
 *
 */
export function AssetReducer(state, action) {
	switch (action.type) {
		case "add":
			return [...state, action.payload];
		case "delete":
			return state.filter((_, index) => index !== action.index);
		default:
			throw new Error();
	}
}
