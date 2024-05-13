export const updateModelTaskAssets = (content, id) => {
	const dataCell = document
		.getElementById(`taskExpandable${id}`)
		?.querySelector(`#dataCellassets > div > span`);
	if (dataCell) {
		dataCell.innerHTML = content;
	}
};
