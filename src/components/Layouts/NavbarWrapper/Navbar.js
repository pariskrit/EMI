import React, { useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useGoogleLogout } from "react-google-login";

// Bottom Navigation
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import MiniLogo from "assets/EMI-symbol.png";
import { ReactComponent as AnalyticsIcon } from "assets/icons/analyticsIcon.svg";
import { ReactComponent as ApplicationIcon } from "assets/icons/applicationsIcon.svg";
// Importing icons
import { ReactComponent as ClientIcon } from "assets/icons/clientsIcon.svg";
import { ReactComponent as CloseIcon } from "assets/icons/close-panel.svg";
import { ReactComponent as ModelIcon } from "assets/icons/modelsIcon.svg";
import { ReactComponent as OpenIcon } from "assets/icons/open-panel.svg";
import { ReactComponent as UserProfileIcon } from "assets/icons/user-profile.svg";
import { ReactComponent as UserIcon } from "assets/icons/usersIcon.svg";
import { ReactComponent as Home } from "assets/icons/home.svg";
import { ReactComponent as LogoutIcon } from "assets/icons/logoutIcon.svg";
// Logo imports
import LargeLogo from "assets/LargeLogoWhite.png";
import clsx from "clsx";
import ColourConstants from "helpers/colourConstants";
import {
	applicationListPath,
	clientsPath,
	usersPath,
	userProfilePath,
	applicationPortalPath,
} from "helpers/routePaths";
import "./style.scss";
import { connect } from "react-redux";
import { logOutUser } from "redux/auth/actions";
import AddToHomeScreenIcon from "@material-ui/icons/AddToHomeScreen";

// Size constants
const drawerWidth = 240;
const minDrawerWidth = 62;

const mediaHeight = "@media(max-height: 593px)";
const mediaHeight2 = "@media(max-height: 493px)";
const mediaHeight3 = "@media(max-height: 450px)";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
	},
	hide: {
		display: "none",
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: "nowrap",
	},
	drawerOpen: {
		backgroundColor: ColourConstants.navDrawer,
		width: drawerWidth,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerClose: {
		backgroundColor: ColourConstants.navDrawer,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		overflowX: "hidden",
		width: minDrawerWidth,
		[theme.breakpoints.up("sm")]: {
			width: minDrawerWidth,
		},
	},
	miniLogoContainer: {
		display: "flex",
		justifyContent: "center",
		marginBottom: 43,
	},
	miniLogo: {
		marginTop: 30,
		height: "33px",
		width: "auto",
	},
	miniLogoMobile: {
		height: "33px",
		width: "auto",
	},
	largeLogoContainer: {
		display: "flex",
		justifyContent: "center",
		marginBottom: 16,
	},
	largeLogo: {
		marginTop: 30,
		height: 60,
		// Note: width should be auto if using a different sized logo
		width: 140,
	},
	toolbar: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
	},
	navLink: {
		textDecoration: "none",
	},
	listItemTextPrimary: {
		fontSize: "16px",
		fontWeight: "bold",
		color: "#000000",
	},
	listItemTextPrimaryCurrent: {
		fontSize: "16px",
		fontWeight: "bold",
		color: "#FFFFFF",
	},
	listItemTextSecondary: {
		fontSize: "13px",
		color: "#000000",
	},
	navListContainer: {
		display: "flex",
		justifyContent: "center",
	},
	currentItemBackground: {
		backgroundColor: ColourConstants.navCurrentItem,
	},
	navIconContainer: {
		display: "flex",
		justifyContent: "center",
		paddingRight: 25,
	},
	navIcon: {
		transform: "scale(0.8)",
	},
	homeIcon: {
		transform: "scale(1.1)",
	},
	navIconCurrent: {
		transform: "scale(0.8)",
		fill: "#FFFFFF",
	},
	miniProfileDivider: {
		color: "#FFFFFF",
		width: minDrawerWidth,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	expandedProfileDivider: {
		color: "#FFFFFF",
		width: drawerWidth,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
	footerClose: {
		position: "fixed",
		bottom: 0,
		textAlign: "center",
		// paddingBottom: 10,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		overflowX: "hidden",
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up("sm")]: {
			width: minDrawerWidth,
		},
	},
	footerOpen: {
		position: "fixed",
		width: drawerWidth,
		bottom: 0,
		textAlign: "center",
		paddingBottom: 10,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},

	bottomNavigationContainer: {
		position: "fixed",
		width: "100vw",
		bottom: 0,
		left: 0,
		zIndex: 50,
	},

	// always show category

	line: {
		height: "100%",
		width: "2px",
		backgroundColor: "#ffdeb0",
		zIndex: 10,
	},

	logoutIcon: {
		transform: "scale(0.35)",
		fill: "#FFFFFF",
		marginTop: "-15px",
	},

	innerBottomNav: {
		width: "80vw",
		overflowX: "scroll",
		overflowY: "hidden",
		display: "flex",
	},

	alwaysShow: {
		display: "flex",
		backgroundColor: "black",
	},

	upperContent: {
		[mediaHeight]: {
			// backgroundColor: "black",
			maxHeight: "190px",
			overflowY: "scroll",
			overflowX: "hidden",
			boxSizing: "content-box",
		},
		[mediaHeight2]: {
			maxHeight: "120px",
		},
		[mediaHeight3]: {
			maxHeight: "50px",
		},
	},
}));

function Navbar({ userLogOut, isApplicationPortal = false }) {
	// Init hooks
	const classes = useStyles();
	const history = useHistory();
	const { signOut } = useGoogleLogout({
		jsSrc: "https://apis.google.com/js/api.js",
		onFailure: (res) => console.log(res),
		clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
		redirectUri: "/",
		onLogoutSuccess: () => history.push("/login"),
	});

	// Setting state
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const location = useLocation();

	let activeLink = location.pathname.split("/")[2];
	const user = JSON.parse(localStorage.getItem("me"));

	// Handlers
	const handleDrawerChange = () => {
		setOpen(!open);
	};

	const handleLogout = async () => {
		const loginType = localStorage.getItem("loginType");

		setLoading(true);
		const token = localStorage.getItem("token");
		try {
			const logOut = await userLogOut(token);

			// Successful response after revoke token
			if (logOut.status === 200) {
				localStorage.clear();
				// if loginType !==undefined
				if (loginType) {
					if (loginType === "GOOGLE") {
						// GOOGLE SIGNOUT
						signOut();
						return true;
					}
				}

				history.push("/login");
			} else {
				throw new Error(logOut);
			}
		} catch (err) {
			console.log(err);
		}
		setLoading(false);
	};

	return (
		<>
			<div className="drawerDesktop">
				<Drawer
					variant="permanent"
					className={clsx(classes.drawer, {
						[classes.drawerOpen]: open,
						[classes.drawerClose]: !open,
					})}
					classes={{
						paper: clsx({
							[classes.drawerOpen]: open,
							[classes.drawerClose]: !open,
						}),
					}}
				>
					{!open ? (
						<div className={classes.miniLogoContainer}>
							<img src={MiniLogo} alt="Logo" className={classes.miniLogo} />
						</div>
					) : (
						<div className={classes.largeLogoContainer}>
							<img src={LargeLogo} alt="logo" className={classes.largeLogo} />
						</div>
					)}
					{isApplicationPortal ? (
						<>
							<Link to="/portal" className={classes.navLink}>
								<div
									className={`${classes.navListContainer} mobNavListContainer`}
								>
									<ListItem button className={classes.currentItemBackground}>
										<ListItemIcon className={classes.navIconContainer}>
											<Home
												className={classes.navIconCurrent}
												alt={`Home icon`}
											/>
										</ListItemIcon>
										<ListItemText
											classes={{
												primary: classes.listItemTextPrimaryCurrent,
											}}
											primary="Application Portal"
										/>
									</ListItem>
								</div>
							</Link>
							{user.isAdmin ? (
								<Link to="/" className={classes.navLink}>
									<div
										className={`${classes.navListContainer} mobNavListContainer`}
									>
										<ListItem button className={null}>
											<ListItemIcon className={classes.navIconContainer}>
												<AddToHomeScreenIcon
													className={classes.homeIcon}
													alt={`Home icon`}
												/>
											</ListItemIcon>
											<ListItemText
												classes={{
													primary: classes.listItemTextPrimary,
												}}
												primary="Go To Home"
											/>
										</ListItem>
									</div>
								</Link>
							) : null}
						</>
					) : (
						<List className={`${classes.upperContent} upperContent`}>
							{[
								["Clients", ClientIcon, clientsPath],
								["Applications", ApplicationIcon, applicationListPath],
								["Models", ModelIcon, "/"],
								["Users", UserIcon, usersPath],
								["Analytics", AnalyticsIcon, "/"],
							].map((item, index) => {
								// Storing SVG
								let NavIcon = item[1];

								return (
									<Link to={item[2]} className={classes.navLink} key={item[0]}>
										<div
											className={`${classes.navListContainer} mobNavListContainer`}
											key={item[0]}
										>
											<ListItem
												button
												className={
													item[0].toLowerCase() === activeLink
														? classes.currentItemBackground
														: null
												}
											>
												<ListItemIcon className={classes.navIconContainer}>
													<NavIcon
														className={
															item[0].toLowerCase() === activeLink
																? classes.navIconCurrent
																: classes.navIcon
														}
														alt={`${item[0]} icon`}
													/>
												</ListItemIcon>
												<ListItemText
													classes={{
														primary:
															item[0].toLowerCase() === activeLink
																? classes.listItemTextPrimaryCurrent
																: classes.listItemTextPrimary,
													}}
													primary={item[0]}
												/>
											</ListItem>
										</div>
									</Link>
								);
							})}
						</List>
					)}

					<div
						className={clsx(classes.footerClose, {
							[classes.footerOpen]: open,
							[classes.footerClose]: !open,
						})}
					>
						<List>
							<Divider
								className={clsx(classes.null, {
									[classes.expandedProfileDivider]: open,
									[classes.miniProfileDivider]: !open,
								})}
							/>
							<div
								className={`${classes.navListContainer} mobNavListContainer`}
							>
								<ListItem
									button={true}
									key="userProfileIcon"
									onClick={() => history.push(userProfilePath)}
									className={
										"me" === activeLink ? classes.currentItemBackground : null
									}
								>
									<ListItemIcon className={classes.navIconContainer}>
										<UserProfileIcon
											alt="user profile icon"
											className={classes.navIcon}
										/>
									</ListItemIcon>
									<ListItemText
										classes={{
											primary: classes.listItemTextPrimary,
											secondary: classes.listItemTextSecondary,
										}}
										primary="Russell Harland"
										secondary="Site: Ahafo - Ghana"
									/>
								</ListItem>
							</div>

							{user.position != null ? (
								<Link to={applicationPortalPath} className={classes.navLink}>
									<div
										className={`${classes.navListContainer} mobNavListContainer`}
									>
										<ListItem
											button
											className={
												"portal" === activeLink
													? classes.currentItemBackground
													: null
											}
										>
											<ListItemIcon className={classes.navIconContainer}>
												<Home className={classes.navIcon} alt={`Home icon`} />
											</ListItemIcon>
											<ListItemText
												classes={{
													primary: classes.listItemTextPrimary,
													secondary: classes.listItemTextSecondary,
												}}
												primary="Application Portal"
											/>
										</ListItem>
									</div>
								</Link>
							) : null}

							<div>
								<ListItem key="logoutIcon" button={true} onClick={handleLogout}>
									<ListItemIcon className={classes.navIconContainer}>
										{loading ? (
											<CircularProgress size="30px" />
										) : (
											<LogoutIcon
												alt="Logout Button"
												className={classes.navIcon}
											/>
										)}
									</ListItemIcon>
									<ListItemText
										classes={{
											primary: classes.listItemTextPrimary,
											secondary: classes.listItemTextSecondary,
										}}
										primary="Logout"
									/>
								</ListItem>
							</div>
							<div
								className={`${classes.navListContainer} mobNavListContainer`}
							>
								<ListItem
									button={true}
									key="navbarExpandButton"
									onClick={handleDrawerChange}
								>
									<ListItemIcon className={classes.navIconContainer}>
										{open ? (
											<CloseIcon alt="close icon" className={classes.navIcon} />
										) : (
											<OpenIcon alt="open icon" className={classes.navIcon} />
										)}
									</ListItemIcon>
									<ListItemText
										classes={{ primary: classes.listItemTextPrimary }}
										primary="Close Panel"
									/>
								</ListItem>
							</div>
						</List>
					</div>
				</Drawer>
			</div>

			{/* Appbar */}
			<div style={{ height: "100vh", position: "relative" }}>
				<div className="appBar mobileNavigation">
					<img src={MiniLogo} alt="Logo" className="miniLogoMobile" />
				</div>

				{/* Bottom Navigation for Mobile View */}

				<BottomNavigation
					className={`${classes.bottomNavigationContainer} mobileNavigation`}
				>
					<div className={classes.innerBottomNav}>
						{[
							["Clients", ClientIcon, clientsPath],
							["Applications", ApplicationIcon, applicationListPath],
							["Models", ModelIcon, "/"],
							["Users", UserIcon, usersPath],
							["Analytics", AnalyticsIcon, "/"],
						].map((item, index) => {
							// Storing SVG
							let NavIcon = item[1];

							// Note: Currently hardcoding current selection -- pull from global state
							// when implemented
							if (index === 1) {
								return (
									<Link to={item[2]} className={classes.navLink} key={index}>
										<div
											className={`${classes.navListContainer} mobNavListContainer`}
										>
											<BottomNavigationAction
												label="Recents"
												key={item[0]}
												className={classes.currentItemBackground}
												value="recents"
												icon={
													<NavIcon
														className={classes.navIconCurrent}
														alt={`${item[0]} icon`}
													/>
												}
											/>
										</div>
									</Link>
								);
							} else {
								return (
									<Link to={item[2]} className={classes.navLink} key={index}>
										<div
											className={`${classes.navListContainer} mobNavListContainer`}
										>
											<BottomNavigationAction
												label="Recents"
												key={item[0]}
												className={classes.currentItemBackground}
												value="recents"
												icon={
													<NavIcon
														className={classes.navIconCurrent}
														alt={`${item[0]} icon`}
													/>
												}
											/>
										</div>
									</Link>
								);
							}
						})}
					</div>
					<div className={classes.line}></div>
					<div className={classes.alwaysShow}>
						<Link to={userProfilePath} className={classes.navLink}>
							<div
								className={`${classes.navListContainer} mobNavListContainer`}
							>
								<BottomNavigationAction
									label="Recents"
									key={"User Profile"}
									className={classes.currentItemBackground}
									value="recents"
									icon={
										<UserProfileIcon
											alt="user profile icon"
											className={classes.navIconCurrent}
										/>
									}
								/>
							</div>
						</Link>
						<div onClick={handleLogout} className={classes.navLink}>
							<div
								className={`${classes.navListContainer} mobNavListContainer`}
							>
								<BottomNavigationAction
									label="Recents"
									key={"Logout"}
									className={classes.currentItemBackground}
									value="recents"
									icon={
										loading ? (
											<CircularProgress size="30px" />
										) : (
											<LogoutIcon
												alt="Logout Button"
												className={classes.logoutIcon}
											/>
										)
									}
								/>
							</div>
						</div>
					</div>
					{/* <div className={`${classes.navListContainer} mobNavListContainer`}>
						<ListItem key="userProfileIcon">
							<ListItemIcon className={classes.navIconContainer}>
								<UserProfileIcon
									alt="user profile icon"
									className={classes.navIcon}
								/>
							</ListItemIcon>
						</ListItem>
					</div>
					<div className={`${classes.navListContainer} mobNavListContainer`}>
						<ListItem key="logoutIcon" button={true} onClick={handleLogout}>
							<ListItemIcon className={classes.navIconContainer}>
								{loading ? (
									<CircularProgress />
								) : (
									<LogoutIcon alt="Logout Button" className={classes.navIcon} />
								)}
							</ListItemIcon>
							<ListItemText
								classes={{
									primary: classes.listItemTextPrimary,
									secondary: classes.listItemTextSecondary,
								}}
								primary="Logout"
							/>
						</ListItem>
					</div> */}
					)
				</BottomNavigation>
			</div>
		</>
	);
}

const mapDispatchToProps = (dispatch) => ({
	userLogOut: (token) => dispatch(logOutUser(token)),
});

export default connect(null, mapDispatchToProps)(React.memo(Navbar));
