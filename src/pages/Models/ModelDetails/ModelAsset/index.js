import React from "react";
import CommonApplicationTable from "components/Modules/CommonApplicationTable";
// import API from "helpers/api";

const ModelAsset = () => {
	// useEffect(() => {
	// 	API.get("/api/modelassets?modelId?=" + 36);
	// }, []);
	return (
		<div>
			<h1>Model Asset</h1>
			<div>
				<CommonApplicationTable
					data={[]}
					headers={["Asset Number", "Status", "Description"]}
				/>
			</div>
		</div>
	);
};

export default ModelAsset;
