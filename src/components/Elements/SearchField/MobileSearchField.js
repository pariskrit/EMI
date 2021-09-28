import React from "react";
import ContentStyle from "styles/application/ContentStyle";
import Grid from "@material-ui/core/Grid";

// Icon Import
import { ReactComponent as SearchIcon } from "assets/icons/search.svg";

// Init styled components
const AC = ContentStyle();

function MobileSearchField({ searchQuery, setSearchQuery, header }) {
	return (
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
								onChange={setSearchQuery}
								label={header ? `Search ${header}` : "Search"}
							/>
						</Grid>
					</Grid>
				</AC.SearchInner>
			</AC.SearchContainerMobile>
		</div>
	);
}

export default MobileSearchField;
