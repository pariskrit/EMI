import React, { useRef, useState } from "react";
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
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
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
import useDidMountEffect from "hooks/useDidMountEffect";
import SkeletonNav from "../SkeletonNav";

// Size constants
const drawerWidth = 260;
const minDrawerWidth = 62;

function Navbar({
	userLogOut,
	isApplicationPortal = false,
	isLoading,
	userDetail,
	setUserDetail,
}) {
	const {
		position,
		regionName,
		siteName,
		firstName,
		lastName,
		application,
		multiSiteUser,
		role,
		site,
		siteID,
		siteAppID,
	} =
		Object.values(userDetail).length > 0
			? userDetail
			: JSON.parse(sessionStorage.getItem("me")) ||
			  JSON.parse(localStorage.getItem("me")) ||
			  {};

	const anchorRef = useRef(null);

	React.useEffect(() => {
		const storageSession = JSON.parse(sessionStorage.getItem("me"));
		const storageLocal = JSON.parse(localStorage.getItem("me"));
		const sessionOrign = sessionStorage.getItem("originalLogin");
		const localOrign = localStorage.getItem("originalLogin");
		if (!sessionOrign) {
			sessionStorage.setItem("originalLogin", localOrign);
		}
		if (!localOrign) {
			localStorage.setItem("originalLogin", sessionOrign);
		}
		if (!storageSession) {
			sessionStorage.setItem("me", localStorage.getItem("me"));
			sessionStorage.setItem("token", storageLocal.jwtToken);
			// setUserDetail(JSON.parse(localStorage.getItem("me")));
		}
		if (!storageLocal) {
			localStorage.setItem("me", sessionStorage.getItem("me"));
			localStorage.setItem("token", storageSession.jwtToken);
			// setUserDetail(JSON.parse(sessionStorage.getItem("me")));
		}
		const clientUserId = localStorage.getItem("clientUserId");
		if (clientUserId) sessionStorage.setItem("clientUserId", clientUserId);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const colorBackground =
		application === null ? ColourConstants.navDrawer : "#" + application?.color;

	const elementProps = anchorRef.current
		? {
				top: anchorRef.current.getBoundingClientRect().top,
				left: anchorRef.current.getBoundingClientRect().right,
		  }
		: { top: 255, left: 61 };

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
			// display: "flex",
			// justifyContent: "center",
		},
		settingsContainer: {
			position: "relative",
		},
		settingsOptions: {
			position: "fixed",
			zIndex: 2000,
			right: 0,
			left: elementProps.left,
			top: elementProps.top,
			width: 225,
			backgroundColor: colorBackground,
			borderRadius: 2,
		},
		nested: {
			paddingLeft: "72px",
		},
		currentItemBackground: {
			backgroundColor:
				application === null
					? ColourConstants.navCurrentItem
					: LightenDarkenColor(application?.color, -20),
		},
		settings: {
			paddingRight: "0 !important",
		},
		navIconContainer: {
			display: "flex",
			justifyContent: "center",
			paddingRight: 15,
		},
		navIcon: {
			transform: "scale(0.8)",
			filter: "brightness(0)",
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
	const [showSettingPopup, setShowSettingPopup] = useState(false);

	const [loading, setLoading] = useState(false);
	const location = useLocation();
	const pathname = location.pathname.split("/");
	let activeLink = pathname[2];

	if (pathname.length > 3) {
		activeLink =
			pathname[6] === "applications"
				? "site-application-settings"
				: "site-settings";
	}
	// Handlers
	const onHoverSettings = () => {
		setShowSettingPopup((prev) => !prev);
	};

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
	let clientAdminMode;
	if (role === roles.clientAdmin) {
		clientAdminMode =
			JSON.parse(sessionStorage.getItem("clientAdminMode")) ||
			JSON.parse(localStorage.getItem("clientAdminMode"));
	} else {
		clientAdminMode = null;
	}

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
			} else {
				return x;
			}
		});

	const loginUser =
		JSON.parse(sessionStorage.getItem("originalLogin")) ||
		JSON.parse(localStorage.getItem("originalLogin"));

	const pushToLogin = () => {
		history.push(navOptions[0].path);
	};

	useDidMountEffect(() => {
		// It detects the changes in the userDetail state of redux and call push
		pushToLogin();
	}, [userDetail]);

	const redirectToOriginalMode = async () => {
		sessionStorage.setItem("me", JSON.stringify(loginUser));
		localStorage.setItem("me", JSON.stringify(loginUser));
		localStorage.removeItem("clientAdminMode");
		sessionStorage.removeItem("clientAdminMode");

		// Cause change in redux state
		setUserDetail(loginUser);
	};
	const lgLogo = application === null ? LargeLogo : application?.logoURL;
	return (
		<>
			<div className={`${classes.settingsContainer} drawerDesktop`}>
				{isLoading ? (
					<SkeletonNav />
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
								<Link to="/app/portal" className={classes.navLink}>
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
								<div
									className={`${classes.navListContainer} mobNavListContainer`}
									onClick={redirectToOriginalMode}
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
												loginUser?.role === roles.superAdmin
													? "Admin Mode"
													: loginUser?.role === roles.clientAdmin
													? "Client Admin Mode"
													: "Site App Mode"
											}
										/>
									</ListItem>
								</div>
							</List>
						) : (
							<List className={classes.lists}>
								{navOptions.map((item) => {
									// Storing SVG
									let NavIcon = item.icon;

									if (item.name === "Setting") {
										return (
											<div
												className={` mobNavListContainer`}
												onMouseEnter={onHoverSettings}
												onMouseLeave={onHoverSettings}
												key={item.name}
												ref={anchorRef}
											>
												<ListItem
													button
													className={`${
														activeLink === "site-settings" ||
														activeLink === "site-application-settings"
															? classes.currentItemBackground
															: null
													} ${classes.settings}`}
												>
													<ListItemIcon className={classes.navIconContainer}>
														<NavIcon
															className={
																activeLink === "site-settings" ||
																activeLink === "site-application-settings"
																	? classes.navIconCurrent
																	: classes.navIcon
															}
															alt={`${item.name} icon`}
														/>
													</ListItemIcon>
													<ListItemText
														classes={{
															primary:
																activeLink === "site-settings" ||
																activeLink === "site-application-settings"
																	? classes.listItemTextPrimaryCurrent
																	: classes.listItemTextPrimary,
														}}
														primary={item.name}
													/>
													<ArrowRightIcon
														className={
															activeLink === "site-settings" ||
															activeLink === "site-application-settings"
																? classes.navIconCurrent
																: classes.navIcon
														}
														style={{ transform: "scale(1.2)" }}
													/>
												</ListItem>

												{showSettingPopup && (
													<List
														component="div"
														className={classes.settingsOptions}
														disablePadding
													>
														<Link
															to={`/app/clients/${site?.id}/sites/${siteID}/detail`}
															className={classes.navLink}
														>
															<ListItem button>
																<ListItemText
																	classes={{
																		primary:
																			activeLink === "site-settings"
																				? classes.listItemTextPrimaryCurrent
																				: classes.listItemTextPrimary,
																	}}
																	primary="Site Settings"
																/>
															</ListItem>
														</Link>

														<Link
															to={`/app/clients/${site?.id}/sites/${siteID}/applications/${siteAppID}/detail`}
															className={classes.navLink}
														>
															<ListItem button>
																{" "}
																<ListItemText
																	classes={{
																		primary:
																			activeLink === "site-application-settings"
																				? classes.listItemTextPrimaryCurrent
																				: classes.listItemTextPrimary,
																	}}
																	primary="Site Application Settings"
																/>
															</ListItem>
														</Link>
													</List>
												)}
											</div>
										);
									}

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
