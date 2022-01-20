import React, { useState } from "react";
import clsx from "clsx";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useGoogleLogout } from "react-google-login";

// Bottom Navigation
import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import SettingsIcon from "@material-ui/icons/Settings";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import MiniLogo from "assets/EMI-symbol.png";

// Importing icons
import { ReactComponent as CloseIcon } from "assets/icons/close-panel.svg";
import { ReactComponent as OpenIcon } from "assets/icons/open-panel.svg";
import { ReactComponent as UserProfileIcon } from "assets/icons/user-profile.svg";
import { ReactComponent as Home } from "assets/icons/home.svg";
import { ReactComponent as LogoutIcon } from "assets/icons/logoutIcon.svg";
// Logo imports
import LargeLogo from "assets/LargeLogoWhite.png";
import ColourConstants from "helpers/colourConstants";
import {
	userProfilePath,
	applicationPortalPath,
	loginPath,
} from "helpers/routePaths";
import navList from "./navList";
import "./style.scss";
import roles from "helpers/roles";
import { LightenDarkenColor } from "helpers/lightenDarkenColor";

// Size constants
const drawerWidth = 240;
const minDrawerWidth = 62;

function Navbar({ userLogOut, isApplicationPortal = false, isLoading }) {
	const {
		position,
		isAdmin,
		regionName,
		siteName,
		firstName,
		lastName,
		application,
		multiSiteUser,
		role,
	} =
		JSON.parse(sessionStorage.getItem("me")) ||
		JSON.parse(localStorage.getItem("me")) ||
		{};

	React.useEffect(() => {
		const storageSession = JSON.parse(sessionStorage.getItem("me"));
		const storageLocal = JSON.parse(localStorage.getItem("me"));
		if (!storageSession) {
			sessionStorage.setItem("me", localStorage.getItem("me"));
			sessionStorage.setItem("token", storageLocal.jwtToken);
		}
		if (!storageLocal) {
			localStorage.setItem("me", sessionStorage.getItem("me"));
			localStorage.setItem("token", storageSession.jwtToken);
		}
	}, []);

	const colorBackground =
		application === null ? ColourConstants.navDrawer : "#" + application?.color;
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
		lists: {
			overflowX: "hidden",
			overflowY: "auto",
			//height: "56%",
			flex: "1",
			"&::-webkit-scrollbar": {
				width: 5,
				height: 5,
			},
			"&::-webkit-scrollbar-track": {
				background:
					application === null
						? "#e2b466"
						: LightenDarkenColor(application?.color, -20),
			},
			"&::-webkit-scrollbar-thumb": {
				background:
					application === null
						? "#734d0f45"
						: LightenDarkenColor(application?.color, 25),
				borderRadius: 12,
			},
		},
		drawerOpen: {
			backgroundColor: colorBackground,
			width: drawerWidth,
			transition: theme.transitions.create("width", {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
			overflow: "hidden",
		},
		drawerClose: {
			backgroundColor: colorBackground,
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
			marginBottom: 43,
		},
		largeLogo: {
			marginTop: 30,
			maxHeight: 60,
			// Note: width should be auto if using a different sized logo
			width: "auto",
			maxWidth: 210,
			marginLeft: 35,
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
			backgroundColor:
				application === null
					? ColourConstants.navCurrentItem
					: LightenDarkenColor(application?.color, -20),
		},
		navIconContainer: {
			display: "flex",
			justifyContent: "center",
			paddingRight: 25,
		},
		navIcon: {
			transform: "scale(0.8)",
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
			bottom: 0,
			textAlign: "center",
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
			width: drawerWidth,
			bottom: 0,
			textAlign: "center",
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
			backgroundColor: "#925e16",
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

		loader: {
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			padding: "20px",
		},
	}));
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

	// Handlers
	const handleDrawerChange = () => {
		setOpen(!open);
	};

	const handleLogout = async () => {
		const loginType =
			sessionStorage.getItem("loginType") || localStorage.getItem("loginType");

		setLoading(true);
		const token =
			sessionStorage.getItem("token") || localStorage.getItem("token");
		try {
			const logOut = await userLogOut(token);

			// Successful response after revoke token
			if (logOut.status === 200) {
				localStorage.clear();
				sessionStorage.clear();
				// if loginType !==undefined
				if (loginType) {
					if (loginType === "GOOGLE") {
						// GOOGLE SIGNOUT
						signOut();
						return true;
					}
				}
				setLoading(false);

				history.push(loginPath);
			} else {
				throw new Error(logOut);
			}
		} catch (err) {
			console.log(err);
		}
	};

	// }
	const clientAdminMode = JSON.parse(sessionStorage.getItem("clientAdminMode"));

	// Filter which sidebar navigation is accessible
	const navOptions = navList
		.filter((x) => {
			// // If position is null it is super admin
			const access = position?.[x.access];
			// If the user is SuperAdmin
			if (role === roles.superAdmin) {
				if (x.roles.includes(roles.superAdmin)) {
					return true;
				} else {
					return false;
				}
				// If the user is Client Administrator
			} else if (role === roles.clientAdmin) {
				// If Switched as Client Admin Mode ignore position access
				if (clientAdminMode) {
					if (x.roles.includes(roles.clientAdmin)) {
						return true;
					} else {
						return false;
					}
				} else {
					if (access === "F" || access === "E" || access === "R") return true;
					else return false;
				}
				// If the user is Site Application User
			} else {
				if (access === "F" || access === "E" || access === "R") return true;
				else return false;
			}
		})
		.map((x) => {
			if (x.name === "Client Setting") {
				return {
					...x,
					name: clientAdminMode?.label,
					path: `/app/client/${clientAdminMode?.id}`,
				};
			}
			return x;
		});

	const lgLogo = application === null ? LargeLogo : application?.logoURL;

	return (
		<>
			<div className="drawerDesktop">
				{isLoading ? (
					<div className={classes.loader}>
						<CircularProgress />
					</div>
				) : (
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
								<img src={lgLogo} alt="logo" className={classes.largeLogo} />
							</div>
						)}

						{isApplicationPortal ? (
							<List className={classes.lists}>
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
								{isAdmin ? (
									<Link to={navOptions[0].path} className={classes.navLink}>
										<div
											className={`${classes.navListContainer} mobNavListContainer`}
										>
											<ListItem button className={null}>
												<ListItemIcon className={classes.navIconContainer}>
													<SettingsIcon
														className={classes.homeIcon}
														alt={`Home icon`}
													/>
												</ListItemIcon>
												<ListItemText
													classes={{
														primary: classes.listItemTextPrimary,
													}}
													primary={
														sessionStorage.getItem("siteAppMode")
															? "Site App"
															: "Admin Mode"
													}
												/>
											</ListItem>
										</div>
									</Link>
								) : null}

								{/* For SiteAppUser */}
								{isAdmin === false && multiSiteUser === true ? (
									<Link to={navOptions[0].path} className={classes.navLink}>
										<div
											className={`${classes.navListContainer} mobNavListContainer`}
										>
											<ListItem button className={null}>
												<ListItemIcon className={classes.navIconContainer}>
													<SettingsIcon
														className={classes.homeIcon}
														alt={`Home icon`}
													/>
												</ListItemIcon>
												<ListItemText
													classes={{
														primary: classes.listItemTextPrimary,
													}}
													primary="Site App"
												/>
											</ListItem>
										</div>
									</Link>
								) : null}
							</List>
						) : (
							<List className={classes.lists}>
								{navOptions.map((item) => {
									// Storing SVG
									let NavIcon = item.icon;

									return (
										<Link
											to={item.path}
											className={classes.navLink}
											key={item.name}
										>
											<div
												className={`${classes.navListContainer} mobNavListContainer`}
												key={item.name}
											>
												<ListItem
													button
													className={
														item.activeName.toLowerCase() === activeLink
															? classes.currentItemBackground
															: null
													}
												>
													<ListItemIcon className={classes.navIconContainer}>
														<NavIcon
															className={
																item.activeName.toLowerCase() === activeLink
																	? classes.navIconCurrent
																	: classes.navIcon
															}
															alt={`${item.name} icon`}
														/>
													</ListItemIcon>
													<ListItemText
														classes={{
															primary:
																item.activeName.toLowerCase() === activeLink
																	? classes.listItemTextPrimaryCurrent
																	: classes.listItemTextPrimary,
														}}
														primary={item.name}
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
											primary={`${firstName} ${lastName}`}
											secondary={
												regionName && siteName
													? `Site: ${regionName} - ${siteName}`
													: ""
											}
										/>
									</ListItem>
								</div>
								{(multiSiteUser || position === null) &&
								!isApplicationPortal ? (
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
									<ListItem
										key="logoutIcon"
										button={true}
										onClick={handleLogout}
									>
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
												<CloseIcon
													alt="close icon"
													className={classes.navIcon}
												/>
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
				)}
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
						{navOptions.map((item, index) => {
							// Storing SVG
							let NavIcon = item.icon;

							// Note: Currently hardcoding current selection -- pull from global state
							// when implemented
							if (index === 1) {
								return (
									<Link to={item.path} className={classes.navLink} key={index}>
										<div
											className={`${classes.navListContainer} mobNavListContainer`}
										>
											<BottomNavigationAction
												label="Recents"
												key={item.name}
												className={classes.currentItemBackground}
												value="recents"
												icon={
													<NavIcon
														className={classes.navIconCurrent}
														alt={`${item.name} icon`}
													/>
												}
											/>
										</div>
									</Link>
								);
							} else {
								return (
									<Link to={item.path} className={classes.navLink} key={index}>
										<div
											className={`${classes.navListContainer} mobNavListContainer`}
										>
											<BottomNavigationAction
												label="Recents"
												key={item.name}
												className={classes.currentItemBackground}
												value="recents"
												icon={
													<NavIcon
														className={classes.navIconCurrent}
														alt={`${item.name} icon`}
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
					)
				</BottomNavigation>
			</div>
		</>
	);
}

export default React.memo(Navbar);
