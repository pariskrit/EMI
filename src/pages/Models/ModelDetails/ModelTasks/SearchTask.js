import { LinearProgress } from "@material-ui/core";
import SearchField from "components/Elements/SearchField/SearchField";
import React, { useCallback, useState } from "react";

const debounce = (func, delay) => {
	let timer;
	return function () {
		let self = this;
		let args = arguments;
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(self, args);
		}, delay);
	};
};

function SearchTask({ fetchData, modelId, classes }) {
	const [searchTxt, setSearchTxt] = useState("");
	const [isSearching, setIsSearching] = useState(false);

	const handleSearch = useCallback(
		debounce(async (value) => {
			setIsSearching(true);
			if (value) await fetchData(modelId, false, value, "", "", false);
			else await fetchData(modelId, false, "", "", "", false);
			setIsSearching(false);
		}, 1500),
		[]
	);

	return (
		<>
			{isSearching ? <LinearProgress className={classes.loading} /> : null}
			<SearchField
				searchQuery={searchTxt}
				setSearchQuery={(e) => {
					setSearchTxt(e.target.value);
					handleSearch(e.target.value);
				}}
			/>
		</>
	);
}

export default SearchTask;
