import React from "react";
import { styled } from "@mui/styles";
import ColourConstants from "helpers/colourConstants";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Popper from "@mui/material/Popper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

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
	disabled = false,
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
						{menuData &&
							menuData.map((item, i) => (
								<React.Fragment key={i}>
									<ListItem
										button
										onClick={() => {
											item.handler(id, item?.name, item?.otherDetail);
										}}
										disabled={item.disabled}
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
