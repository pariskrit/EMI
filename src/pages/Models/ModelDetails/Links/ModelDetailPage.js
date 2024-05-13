import React from "react";
import { Route, Routes, useOutletContext } from "react-router-dom";
import ModelDetailContext from "contexts/ModelDetailContext";
import ModelDetails from "..";
import routeList from "./routeList";
import SingleComponent from "./SingleComponent";
import { modelDetailsPath } from "helpers/routePaths";

const ModelDetailPage = () => {
	const { access } = useOutletContext();
	const {
		customCaptions,
		application: { showArrangements },
		position,
	} = JSON.parse(sessionStorage.getItem("me")) ||
	JSON.parse(localStorage.getItem("me"));
	return (
		<ModelDetailContext>
			<ModelDetails>
				{(modelDetail) => {
					return (
						<Routes>
							{routeList(modelDetail, customCaptions, showArrangements).map(
								(route) => (
									<Route
										key={route.id}
										element={
											<SingleComponent
												{...route}
												access={access}
												customCaptions={customCaptions}
												position={position}
												showArrangements={showArrangements}
											/>
										}
										path={route.path}
									/>
								)
							)}
						</Routes>
					);
				}}
			</ModelDetails>
		</ModelDetailContext>
	);
};

export default ModelDetailPage;
