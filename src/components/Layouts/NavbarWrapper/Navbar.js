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
import ColourConstants from "helpers/colourConstants";
import {
	applicationListPath,
	clientsPath,
	modelsPath,
	usersPath,
	userProfilePath,
	applicationPortalPath,
	servicesPath,
	analyticsPath,
	defectsPath,
	feedbackPath,
	analysisPath,
	noticeboardPath,
} from "helpers/routePaths";
import { connect } from "react-redux";
import { logOutUser } from "redux/auth/actions";
import access from "helpers/access";
import "./style.scss";

// Size constants
const drawerWidth = 240;
const minDrawerWidth = 62;

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
			background: "#e2b466",
		},
		"&::-webkit-scrollbar-thumb": {
			background: "#734d0f45",
			borderRadius: 12,
		},
	},
	drawerOpen: {
		backgroundColor: ColourConstants.navDrawer,
		width: drawerWidth,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		overflow: "hidden",
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

	// function signOutMicrosoftHandler() {
	// 	const accountId = localStorage.getItem("homeAccoundId");
	// 	const logoutRequest = {
	// 		account: instance.getAccountByHomeId(accountId),
	// 		postLogoutRedirectUri: "http://localhost:3000/login",
	// 	};
	// 	instance.logoutRedirect(logoutRequest);
	// }
	const { position, isAdmin } = JSON.parse(localStorage.getItem("me"));
	const navOptions = [
		{
			name: "Clients",
			icon: ClientIcon,
			path: clientsPath,
			access: "",
		},
		{
			name: "Applications",
			icon: ApplicationIcon,
			path: applicationListPath,
			access: "",
		},
		{
			name: "Models",
			icon: ModelIcon,
			path: modelsPath,
			access: access.modelAccess,
		},
		{
			name: "Users",
			icon: UserIcon,
			path: usersPath,
			access: access.userAccess,
		},
		{
			name: "Analytics",
			icon: AnalyticsIcon,
			path: analyticsPath,
			access: access.analyticsAccess,
		},
		{
			name: "Services",
			icon: ModelIcon,
			path: servicesPath,
			access: access.serviceAccess,
		},
		{
			name: "Defects",
			icon: ModelIcon,
			path: defectsPath,
			access: access.defectAccess,
		},
		{
			name: "Analysis",
			icon: ModelIcon,
			path: analysisPath,
			access: access.analysisAccess,
		},
		{
			name: "Feedback",
			icon: ModelIcon,
			path: feedbackPath,
			access: access.feedbackAccess,
		},
		{
			name: "Noticeboards",
			icon: ModelIcon,
			path: noticeboardPath,
			access: access.noticeboardAccess,
		},
	]
		// Filter which sidebar navigation is accessible
		.filter((x) => {
			// If position is null it is super admin

			if (position === null || position?.[x.access] === "F") return true;
			else return false;
		});

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
								<Link to={clientsPath} className={classes.navLink}>
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
												primary="Admin Mode"
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
													item.name.toLowerCase() === activeLink
														? classes.currentItemBackground
														: null
												}
											>
												<ListItemIcon className={classes.navIconContainer}>
													<NavIcon
														className={
															item.name.toLowerCase() === activeLink
																? classes.navIconCurrent
																: classes.navIcon
														}
														alt={`${item.name} icon`}
													/>
												</ListItemIcon>
												<ListItemText
													classes={{
														primary:
															item.name.toLowerCase() === activeLink
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
										primary="Russell Harland"
										secondary="Site: Ahafo - Ghana"
									/>
								</ListItem>
							</div>
							{position !== null && !isApplicationPortal ? (
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
