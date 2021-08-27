import React, { useState } from "react";
import SiteWrapper from "components/SiteWrapper";
import { useHistory } from "react-router-dom";
import ContentStyle from "styles/application/ContentStyle";
import DetailsPanel from "components/DetailsPanel";
import { Grid } from "@material-ui/core";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import ClientSiteTable from "components/ClientSiteTable";

const AC = ContentStyle();

const SiteAsset = () => {
	const history = useHistory();
	const [data, setData] = useState([
		{
			id: 1,
			asset: "Rujal",
			description: "Building Change room M DBS BD007",
		},
		{
			id: 2,
			asset: "Ram Prasad",
			description: "This is final Testing of the table",
		},
	]);
	return (
		<SiteWrapper
			current="Assets"
			onNavClick={(path) => history.push(path)}
			status=""
			lastSaved=""
		>
			<AC.DetailsContainer>
				<DetailsPanel
					header={"Assets"}
					dataCount={123}
					description="Create and manage assets that can be assigned in zone maintenance"
				/>

				<AC.SearchContainer>
					<AC.SearchInner>
						<Grid container spacing={1} alignItems="flex-end">
							<Grid item>
								<SearchIcon />
							</Grid>
							<Grid item>
								<AC.SearchInput
									onChange={(e) => console.log(e.target.value)}
									label="Search"
								/>
							</Grid>
						</Grid>
					</AC.SearchInner>
				</AC.SearchContainer>
			</AC.DetailsContainer>
			<ClientSiteTable
				data={data}
				columns={["asset", "description"]}
				headers={["Asset", "Description"]}
				onEdit={(id) => alert(id)}
				onDelete={(id) => alert(id)}
				setData={setData}
			/>
		</SiteWrapper>
	);
};

export default SiteAsset;
