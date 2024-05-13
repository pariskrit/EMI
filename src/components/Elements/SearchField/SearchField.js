import React from "react";
import ContentStyle from "styles/application/ContentStyle";
import Grid from "@mui/material/Grid";

// Icon Import
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";

// Init styled components
const AC = ContentStyle();

function SearchField({ searchQuery, setSearchQuery, header, ...rest }) {
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
									{...rest}
									variant="standard"
									value={searchQuery}
									onChange={setSearchQuery}
									label={header ? `Search ${header}` : "Search"}
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
