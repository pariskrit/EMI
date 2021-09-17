import React from "react";
import { styled } from "@material-ui/core/styles";
import ColourConstants from "../../helpers/colourConstants";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Popper from "@material-ui/core/Popper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

// Style overrides
const PopperPaper = styled(Paper)({
	borderRadius: "9px",
	paddingLeft: 5,
	paddingRight: 5,
	minWidth: 220,
	maxWidth: 500,
});
const LinkText = styled(Typography)({
	fontFamily: "Roboto Condensed",
	fontWeight: "bold",
	fontSize: 15,
	color: ColourConstants.activeLink,
});
const DeleteLink = styled(Typography)({
	fontFamily: "Roboto Condensed",
	fontWeight: "bold",
	fontSize: 15,
	color: ColourConstants.deleteLink,
});

const PopupMenu = ({
	index,
	selectedData,
	anchorEl,
	isLast,
	id,
	clickAwayHandler,
	menuData,
}) => {
	// Event vars
	// Opening if selected is this instance
	let open = index === selectedData ? true : false;
	// Updating ID based on whether popper open
	const popperId = open ? "nav-edit-popper" : undefined;

	return (
		<Popper
			id={popperId}
			open={open}
			anchorEl={anchorEl}
			placement={isLast ? "left-end" : "left"}
		>
			<ClickAwayListener onClickAway={clickAwayHandler}>
				<PopperPaper>
					<List component="nav" aria-label="menu list">
						{menuData.map((item, i) => (
							<React.Fragment key={i}>
								<ListItem
									button
									onClick={() => {
										item.handler(id);
									}}
								>
									<ListItemText
										primary={
											item.isDelete ? (
												<DeleteLink>{item.name}</DeleteLink>
											) : (
												<LinkText>{item.name}</LinkText>
											)
										}
									/>
								</ListItem>

								{menuData.length === i + 1 ? null : (
									<Divider variant="middle" />
								)}
							</React.Fragment>
						))}
					</List>
				</PopperPaper>
			</ClickAwayListener>
		</Popper>
	);
};

export default PopupMenu;
