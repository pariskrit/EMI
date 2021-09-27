import React from "react";
import ContentStyle from "styles/application/ContentStyle";
import Grid from "@material-ui/core/Grid";

// Icon Import
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";

// Init styled components
const AC = ContentStyle();

function SearchField({ searchQuery, setSearchQuery }) {
	return (
		<div className="desktopSearchCustomCaptions">
			<AC.SearchContainer>
				<AC.SearchInner>
					<Grid container spacing={1} alignItems="flex-end">
						<div className="flex">
							<Grid item>
								<SearchIcon style={{ marginTop: "20px", marginRight: "5px" }} />
							</Grid>
							<Grid item>
								<AC.SearchInput
									value={searchQuery}
									onChange={setSearchQuery}
									label="Search custom captions"
								/>
							</Grid>
						</div>
					</Grid>
				</AC.SearchInner>
			</AC.SearchContainer>
		</div>
	);
}

export default SearchField;
