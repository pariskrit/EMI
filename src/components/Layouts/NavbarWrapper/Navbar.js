import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Bottom Navigation
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import SettingsIcon from "@mui/icons-material/Settings";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { makeStyles } from "tss-react/mui";
import MiniLogo from "assets/EMI-symbol.png";

// Importing icons
import { ReactComponent as CloseIcon } from "assets/icons/close-panel.svg";
import { ReactComponent as OpenIcon } from "assets/icons/open-panel.svg";
import { ReactComponent as UserProfileIcon } from "assets/icons/user-profile.svg";
import { ReactComponent as Home } from "assets/icons/home.svg";
import { ReactComponent as LogoutIcon } from "assets/icons/logoutIcon.svg";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
// Logo imports
import LargeLogo from "assets/LargeLogoWhite.png";
import ColourConstants from "helpers/colourConstants";
import {
	userProfilePath,
	applicationPortalPath,
	loginPath,
} from "helpers/routePaths";
import navList from "./navList";
import "components/Layouts/NavbarWrapper/style.scss";
import roles from "helpers/roles";
import { LightenDarkenColor } from "helpers/lightenDarkenColor";
import useDidMountEffect from "hooks/useDidMountEffect";
import SkeletonNav from "components/Layouts/SkeletonNav";
import { getLocalStorageData } from "helpers/utils";
import { showError } from "redux/common/actions";
import { useDispatch } from "react-redux";
import { RESELLER_ID } from "constants/UserConstants/indes";
import { googleLogout } from "@react-oauth/google";
import { decryptToken } from "helpers/authenticationCrypto";

// Size constants
const drawerWidth = 260;
const minDrawerWidth = 62;

function Navbar({
	userLogOut,
	isApplicationPortal = false,
	isLoading,
	userDetail,
	setUserDetail,
	setNavState,
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
		customCaptions,
		adminType,
		isAdmin,
	} =
		Object.values(userDetail).length > 0
			? userDetail
			: JSON.parse(sessionStorage.getItem("me")) ||
			  JSON.parse(localStorage.getItem("me")) ||
			  {};

	const [IsAppPortal, setIsAppPortal] = useState();

	const anchorRef = useRef(null);
	const supportRef = useRef(null);
	const locations = useLocation();
	const dispatch = useDispatch();

	useEffect(() => {
		setIsAppPortal(locations.pathname === "/app/portal");
	}, [locations.pathname]);

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
		application === null || IsAppPortal
			? ColourConstants.navDrawer
			: "#" + application?.color;

	// const elementProps = anchorRef.current
	// 	? {
	// 			top: anchorRef.current.getBoundingClientRect().top,
	// 			left: anchorRef.current.getBoundingClientRect().right,
	// 	  }
	// 	: { top: 255, left: 61 };

	// intial style for settingsoptions -- settings  modal pop up

	const [settingsOptions, setSettingsOptions] = useState({
		position: "fixed",
		zIndex: 2000,
		right: 0,
		left: 61,
		top: 255,
		width: 225,
		backgroundColor: colorBackground,
		borderRadius: 2,
	});
	const [supportOptions, setSupportOptions] = useState({
		position: "fixed",
		zIndex: 2000,
		right: 0,
		left: 61,
		top: 255,
		width: 225,
		backgroundColor: colorBackground,
		borderRadius: 2,
	});
	const useStyles = makeStyles()((theme) => ({
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
				width: 14,
				height: 14,
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
			width: drawerWidth,
			transition: theme.transitions.create("width", {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
			overflow: "hidden",
		},
		drawerClose: {
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
			width: "100%",
			maxWidth: 50,
			objectFit: "contain",
		},
		miniLogoMobile: {
			height: "33px",
			width: "auto",
		},
		largeLogoContainer: {
			display: "flex",
			// justifyContent: "start",
			marginBottom: 43,
			padding: "0px 16px",
			//marginLeft: "5px",
		},
		largeLogo: {
			marginTop: 30,
			maxHeight: 82,
			// Note: width should be auto if using a different sized logo
			width: "100%",
			height: "auto",
			objectFit: "contain",
			maxWidth: 200,
			//marginLeft: 35,
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
		secondaryText: {},
		listItemTextSecondary: {
			fontSize: "13px",
			color: "#000000",
		},
		listItemTextSecondaryCurrent: {
			fontSize: "13px",
			color: "#FFFFFF",
		},
		listItemUserOpen: {
			fontSize: "13px",
			color: "#000000",
			whiteSpace: "normal",
		},
		listItemUserClosed: {
			fontSize: "13px",
			color: "#000000",
			whiteSpace: "inherit",
		},
		listItemUserOpenActive: {
			fontSize: "13px",
			color: "#fff",
			whiteSpace: "normal",
		},
		listItemUserClosedActive: {
			fontSize: "13px",
			color: "#fff",
			whiteSpace: "inherit",
		},
		navListContainer: {
			// display: "flex",
			// justifyContent: "center",
		},
		settingsContainer: {
			position: "relative",
		},
		settingsOptions: settingsOptions,
		supportOptions: supportOptions,
		nested: {
			paddingLeft: "72px",
		},
		currentItemBackground: {
			backgroundColor:
				application === null || IsAppPortal
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
			// width: "31.976px",
			// height: "28.357px",
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
	const { classes, cx } = useStyles();
	const navigate = useNavigate();

	// Setting state
	const [open, setOpen] = useState(false);
	const [showSettingPopup, setShowSettingPopup] = useState(false);
	const [showSupportPopup, setShowSupportPopup] = useState(false);

	const settingPath = getLocalStorageData("settingType");

	const [loading, setLoading] = useState(false);
	const location = useLocation();
	const pathname = location.pathname.split("/");
	let activeLink = pathname[2];

	if (settingPath) {
		activeLink = settingPath;
	}

	// Handlers
	const onHoverSettings = () => {
		setShowSettingPopup((prev) => !prev);
		if (anchorRef.current) {
			const updatedElementProps = {
				top: anchorRef.current.getBoundingClientRect().top,
				left: anchorRef.current.getBoundingClientRect().right,
			};

			setSettingsOptions((prevSettingsOptions) => ({
				...prevSettingsOptions,
				left: updatedElementProps.left,
				top: updatedElementProps.top,
			}));
		}
	};
	const onHoverSupport = () => {
		setShowSupportPopup((prev) => !prev);
		if (supportRef.current) {
			const updatedElementProps = {
				top: supportRef.current.getBoundingClientRect().top,
				left: supportRef.current.getBoundingClientRect().right,
			};

			setSupportOptions((prevSettingsOptions) => ({
				...prevSettingsOptions,
				left: updatedElementProps.left,
				top: updatedElementProps.top,
			}));
		}
	};

	const handleSavePath = (settingType) => {
		sessionStorage.setItem("settingType", settingType);
		onHoverSettings();
	};

	const handleDrawerChange = () => {
		setOpen(!open);
		setNavState(!open);
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
						googleLogout();
						navigate(loginPath);
						// history.push(loginPath);

						return true;
					}
				}

				navigate(loginPath);
			} else {
				throw new Error(logOut);
			}
		} catch (err) {
			dispatch(showError("Failed to logout."));
		} finally {
			setLoading(false);
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
	const navOptions = navList(customCaptions)
		.filter((x) => {
			// // If position is null it is super admin
			const access = position?.[x.access];
			// If the user is SuperAdmin
			if (role === roles.superAdmin) {
				if (x.roles.includes(roles.superAdmin)) {
					return x?.hideToReseller ? adminType !== RESELLER_ID : true;
				} else {
					return false;
				}
				// If the user is Client Administrator
			} else if (role === roles.clientAdmin && !siteID) {
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
		navigate(navOptions.length > 0 ? navOptions?.[0]?.path : "/app/me");
	};

	useDidMountEffect(() => {
		// It detects the changes in the userDetail state of redux and call push
		pushToLogin();
	}, [userDetail]);

	const redirectToOriginalMode = async () => {
		//setting role to superadmin
		const modifiedLoginData = {
			...loginUser,
			role: roles.superAdmin,
		};
		sessionStorage.setItem("me", JSON.stringify(modifiedLoginData));
		localStorage.setItem("me", JSON.stringify(modifiedLoginData));
		localStorage.removeItem("clientAdminMode");
		sessionStorage.removeItem("clientAdminMode");

		// Cause change in redux state
		setUserDetail(modifiedLoginData);
	};

	const removeSettingsPathFromLocalStorage = () => {
		if (settingPath) sessionStorage.removeItem("settingType");
	};

	useEffect(() => {
		return removeSettingsPathFromLocalStorage;
	}, []);

	const lgLogo =
		application === null || locations.pathname === "/app/portal"
			? LargeLogo
			: application?.navigationLogoURL;

	const smallLogo =
		application === null || locations.pathname === "/app/portal"
			? MiniLogo
			: application?.smallLogoURL
			? application?.smallLogoURL
			: MiniLogo;

	return (
		<>
			<div
				className={`${classes.settingsContainer} drawerDesktop ${
					!open ? "collapse" : ""
				}`}
			>
				{isLoading ? (
					<SkeletonNav />
				) : (
					<Drawer
						variant="permanent"
						className={cx(classes.drawer, {
							[classes.drawerOpen]: open,
							[classes.drawerClose]: !open,
						})}
						classes={{
							paper: cx({
								[classes.drawerOpen]: open,
								[classes.drawerClose]: !open,
							}),
						}}
						PaperProps={{
							sx: {
								backgroundColor: colorBackground,
							},
						}}
					>
						{!open ? (
							<div className={classes.miniLogoContainer}>
								<img src={smallLogo} alt="Logo" className={classes.miniLogo} />
							</div>
						) : (
							<div className={classes.largeLogoContainer}>
								<img src={lgLogo} alt="logo" className={classes.largeLogo} />
							</div>
						)}

						{isApplicationPortal ? (
							<List className={classes.lists}>
								{loginUser?.isAdmin && (
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
													loginUser?.position !== null
														? "Site App Mode"
														: loginUser?.isAdmin
														? "Admin Mode"
														: "Client Admin Mode"
												}
											/>
										</ListItem>
									</div>
								)}
							</List>
						) : (
							<List className={classes.lists}>
								{navOptions.map((item) => {
									// Storing SVG
									let NavIcon = item.icon;

									if (item.name === "Settings") {
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
														// className={classes.settingsOptions}
														disablePadding
														style={settingsOptions}
													>
														<Link
															to={{
																pathname: `/app/clients/${site?.id}/sites/${siteID}/detail`,
																state: { isSettings: true },
															}}
															className={classes.navLink}
															onClick={() => handleSavePath("site-settings")}
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
															to={{
																pathname: `/app/clients/${site?.id}/sites/${siteID}/applications/${siteAppID}/detail`,
																state: { isSettings: true },
															}}
															className={classes.navLink}
															onClick={() =>
																handleSavePath("site-application-settings")
															}
														>
															<ListItem button>
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
														<Link
															to={{
																pathname: `/app/clients/${site?.id}/sites/${siteID}/licenses`,
																state: { isSettings: true },
															}}
															className={classes.navLink}
															onClick={() => handleSavePath("site-licenses")}
														>
															<ListItem button>
																<ListItemText
																	classes={{
																		primary:
																			activeLink === "site-licenses"
																				? classes.listItemTextPrimaryCurrent
																				: classes.listItemTextPrimary,
																	}}
																	primary="Licenses"
																/>
															</ListItem>
														</Link>
													</List>
												)}
											</div>
										);
									}
									if (item.name === "Support") {
										return (
											<div
												className={` mobNavListContainer`}
												onMouseEnter={onHoverSupport}
												onMouseLeave={onHoverSupport}
												key={item.name}
												ref={supportRef}
											>
												<ListItem
													button
													className={`
														 ${classes.settings}`}
												>
													<ListItemIcon className={classes.navIconContainer}>
														<NavIcon
															className={classes.navIcon}
															alt={`${item.name} icon`}
														/>
													</ListItemIcon>
													<ListItemText
														classes={{
															primary: classes.listItemTextPrimary,
														}}
														primary={item.name}
													/>
													<ArrowRightIcon
														className={classes.navIcon}
														style={{ transform: "scale(1.2)" }}
													/>
												</ListItem>

												{showSupportPopup && (
													<List
														component="div"
														disablePadding
														style={supportOptions}
													>
														<Link
															to={`https://support.emi3.io/support/solutions`}
															className={classes.navLink}
															target="_blank"
														>
															<ListItem button>
																<ListItemText
																	classes={{
																		primary: classes.listItemTextPrimary,
																	}}
																	primary="Knowledge Base"
																/>
															</ListItem>
														</Link>

														<Link
															to={`https://support.emi3.io/support/tickets/new`}
															target="_blank"
															className={classes.navLink}
														>
															<ListItem button>
																<ListItemText
																	classes={{
																		primary: classes.listItemTextPrimary,
																	}}
																	primary="Raise a Ticket"
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
											onClick={removeSettingsPathFromLocalStorage}
										>
											<div
												className={`${classes.navListContainer} mobNavListContainer`}
												key={item.name}
											>
												<ListItem
													button
													sx={{
														backgroundColor:
															item.activeName.toLowerCase() === activeLink
																? application === null || IsAppPortal
																	? ColourConstants.navCurrentItem
																	: LightenDarkenColor(application?.color, -20)
																: null,
													}}
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
							className={cx(classes.footerClose, {
								[classes.footerOpen]: open,
								[classes.footerClose]: !open,
							})}
						>
							<List>
								<Divider
									className={cx(classes.null, {
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
										onClick={() => {
											removeSettingsPathFromLocalStorage();
											navigate(userProfilePath);
										}}
										className={
											"me" === activeLink ? classes.currentItemBackground : null
										}
									>
										<ListItemIcon className={classes.navIconContainer}>
											<UserProfileIcon
												alt="user profile icon"
												className={
													"me" === activeLink
														? classes.navIconCurrent
														: classes.navIcon
												}
											/>
										</ListItemIcon>
										<ListItemText
											classes={{
												primary:
													"me" === activeLink
														? classes.listItemTextPrimaryCurrent
														: classes.listItemTextPrimary,
												secondary: open
													? "me" === activeLink
														? classes.listItemUserOpenActive
														: classes.listItemUserOpen
													: classes.listItemUserClosed,
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
								{(multiSiteUser || position === null) && (
									<Link
										to={applicationPortalPath}
										className={classes.navLink}
										onClick={removeSettingsPathFromLocalStorage}
									>
										<div
											className={`${classes.navListContainer} mobNavListContainer`}
											style={{ marginLeft: "-1px" }}
										>
											<ListItem
												button
												sx={{
													backgroundColor:
														"portal" === activeLink
															? application === null || IsAppPortal
																? ColourConstants.navCurrentItem
																: LightenDarkenColor(application?.color, -20)
															: null,
												}}
											>
												<ListItemIcon className={classes.navIconContainer}>
													<Home
														className={
															"portal" === activeLink
																? classes.navIconCurrent
																: classes.navIcon
														}
														alt={`Home icon`}
													/>
												</ListItemIcon>
												<ListItemText
													classes={{
														primary:
															"portal" === activeLink
																? classes.listItemTextPrimaryCurrent
																: classes.listItemTextPrimary,

														secondary: open
															? "portal" === activeLink
																? classes.listItemUserOpenActive
																: classes.listItemUserOpen
															: classes.listItemUserClosed,
													}}
													primary="Application Portal"
												/>
											</ListItem>
										</div>
									</Link>
								)}

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
													style={{ width: "31.976px", height: "28.357px" }}
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
