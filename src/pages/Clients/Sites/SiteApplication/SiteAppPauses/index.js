import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import DetailsPanel from "components/Elements/DetailsPanel";
import ContentStyle from "styles/application/ContentStyle";
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import CommonApplicationTable from "components/Modules/CommonApplicationTable";

const AC = ContentStyle();

const SiteAppPauses = () => {
	const [data, setData] = useState([
		{
			id: 1,
			name: "XYZ",
			totalSub: 2,
		},
		{
			id: 2,
			name: "ABC",
			totalSub: 3,
		},
	]);
	const [haveData, setHaveData] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [deleteID, setDeleteID] = useState(null);

	return (
		<div>
			<div className="detailsContainer">
				<DetailsPanel
					header={"Pause Reasons"}
					dataCount={haveData ? data.length : 0}
					description="Create and manage Pause Reasons"
				/>
				<div className="desktopSearchCustomCaptions">
					<AC.SearchContainer>
						<AC.SearchInner>
							<Grid container spacing={1} alignItems="flex-end">
								<div className="flex">
									<Grid item>
										<SearchIcon
											style={{ marginTop: "20px", marginRight: "5px" }}
										/>
									</Grid>
									<Grid item>
										<AC.SearchInput
											value={searchQuery}
											onChange={(e) => {
												setSearchQuery(e.target.value);
											}}
											label="Search Pauses"
										/>
									</Grid>
								</div>
							</Grid>
						</AC.SearchInner>
					</AC.SearchContainer>
				</div>
				<div className="mobileSearchCustomCaptions">
					<AC.SearchContainerMobile>
						<AC.SearchInner>
							<Grid container spacing={1} alignItems="flex-end">
								<Grid item>
									<SearchIcon />
								</Grid>
								<Grid item>
									<AC.SearchInput
										value={searchQuery}
										onChange={(e) => {
											setSearchQuery(e.target.value);
										}}
										label="Search Pauses"
									/>
								</Grid>
							</Grid>
						</AC.SearchInner>
					</AC.SearchContainerMobile>
				</div>
			</div>
			<CommonApplicationTable
				setData={setData}
				data={data}
				columns={["name", "totalSub"]}
				headers={["Name", "Number of subcategories"]}
				onEdit={(id) => alert("Edit" + id)}
				onDelete={(id) => alert("Delete" + id)}
			/>
		</div>
	);
};

export default SiteAppPauses;
