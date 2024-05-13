import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "tss-react/mui";
import { createTheme, ThemeProvider } from "@mui/styles";

import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ColourConstants from "helpers/colourConstants";

const useStyles = makeStyles()((theme) => ({
	popperPaper: {
		borderRadius: "9px",
		paddingLeft: theme.spacing(1),
		paddingRight: theme.spacing(1),
		marginTop: 10,
		minWidth: 220,
		maxWidth: 500,
		backgroundColor: theme.palette.background.paper,
	},
	linkText: {
		fontFamily: "Roboto Condensed",
		fontWeight: "bold",
		fontSize: 15,
		color: ColourConstants.activeLink,
	},
}));

const MenuDropdown = ({
	content,
	index,
	selectedButton,
	anchorEl,
	applicationName,
}) => {
	// Init hooks
	const { classes, cx } = useStyles();

	// Event vars
	// Only opening if selected is this button instance
	let open = index === selectedButton ? true : false;
	// Updating ID based on whether popper open
	const id = open ? "nav-menu-popper" : undefined;

	return (
		<Popper
			id={id}
			open={open}
			anchorEl={anchorEl}
			placement={index === 0 ? "bottom-start" : "bottom"}
			style={{ zIndex: 2 }}
		>
			<Paper className={classes.popperPaper}>
				<List component="nav" aria-label="main mailbox folders">
					{content.map((dropItem, index) => {
						return (
							<div key={`application-list-container-${index}`}>
								<ListItem
									button
									component={Link}
									to={{
										pathname: dropItem.link,
										state: { applicationName: applicationName },
									}}
									key={`application-list-item-${index}`}
								>
									<ListItemText
										key={`application-list-link-${index}`}
										primary={
											<Typography
												className={classes.linkText}
												key={`application-list-link-text-${index}`}
											>
												{dropItem.title}
											</Typography>
										}
									/>
								</ListItem>

								{/* Not rendering divider for last item */}
								{index === content.length - 1 ? null : (
									<Divider variant="middle" />
								)}
							</div>
						);
					})}
				</List>
			</Paper>
		</Popper>
	);
};

export default MenuDropdown;
