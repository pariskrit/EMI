import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { makeStyles } from "tss-react/mui";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { loginPath, siteUserLoginPath } from "helpers/routePaths";
import * as yup from "yup";
import ColourLogo from "assets/colourLogo.png";
import LoginImage from "assets/spash_no_background.png";
import Watermark from "assets/watermark.png";
import ColourConstants from "helpers/colourConstants";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import { loginSocialAccount, loginUser } from "redux/auth/actions";
import { useMsal } from "@azure/msal-react";
import ErrorIcon from "@mui/icons-material/Error";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import TabTitle from "components/Elements/TabTitle";
import AppleLoginSignin from "components/Elements/AppleSigin/AppleLoginSignin";
import { showError } from "redux/common/actions";
import { handleSiteAppClick } from "helpers/handleSiteAppClick";
import { defaultRedirect } from "helpers/constants";

// Yup validation schema
const schema = yup.object({
	email: yup
		.string("This field must be a string")
		.email("Invalid email address")
		.required("This field is required"),
	password: yup
		.string("This field must be a string")
		.required("This field is required"),
	siteAppID: yup.mixed().nullable(),
});

// Default state schemas
const defaultErrorSchema = { email: null, password: null, siteAppID: null };

const useStyles = makeStyles()((theme) => ({
	root: {
		height: "100vh",
	},
	image: {
		background: `url(${LoginImage}), linear-gradient(90deg, rgba(255,212,130,1) 25%, rgba(250,171,19,1) 100%)`,
		backgroundRepeat: "no-repeat",
		backgroundSize: "contain",
		backgroundPosition: "center",
	},
	paper: {
		// margin: theme.spacing(8, 4),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		position: "relative",
		top: "50%",
		transform: "translateY(-50%)",
	},
	watermark: {
		background: `url(${Watermark}) fixed no-repeat bottom right`,
		backgroundSize: 400,
		position: "relative",
	},
	logoContainer: {
		display: "flex",
		alignItems: "center",
		marginBottom: 80,
		marginTop: 0,
	},
	logo: {
		width: 335,
	},
	loginFormContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		borderRadius: "5px",
		marginTop: "-50px",
		width: "340px",
	},
	spinnerContainer: {
		marginTop: 20,
	},
	form: {
		width: "100%",
		marginTop: "theme.spacing(1)",
	},
	submitContainer: {
		width: "100%",
	},
	submit: {
		backgroundColor: ColourConstants.confirmButton,
		marginTop: 10,
		width: "100%",
	},
	googleBtn: {
		width: "100%",
		height: "38px",
		backgroundColor: "#f8f8f9",
		borderRadius: "2px",
		boxShadow: "0 3px 4px 0 rgba(0,0,0,.25)",
		"&:hover": {
			cursor: "pointer",
			backgroundColor: "#fff",
		},
		display: "flex",
		alignItems: "center",
		gap: "70px",
	},
	googleIconWrapper: {
		width: "40px",
		height: "38px",
		borderRadius: "2px",
		backgroundColor: "#fff",
		display: "flex",
		justifyItems: "center",
	},
	googleIcon: {
		margin: "auto",
		width: "20px",
		height: "20px",
	},
	microsoftbtn: {
		width: "100%",
		height: "38px",
		marginTop: "11px",
		borderRadius: "2px",
		boxShadow: "0 3px 4px 0 rgba(0,0,0,.25)",
		backgroundColor: "#00a1f1",
		"&:hover": {
			cursor: "pointer",
			backgroundColor: "#55ceff",
		},
		display: "flex",
		alignItems: "center",
		gap: "70px",
	},
	btnText: {
		color: "#5e5e5e",
		fontSize: "13px",
		letterSpacing: "0.2px",
		fontFamily: "Roboto",
		marginLeft: "10px",
	},
	footer: {
		position: "absolute",
		bottom: "8px",
		left: "50%",
		transform: "translateX(-50%)",
		whiteSpace: "nowrap",
	},
	footerText: {
		fontSize: "1em",
		margin: 0,
		padding: 0,
	},

	divider: {
		fontSize: "1.1em",
		margin: "15px 0",
		position: "relative",
		width: "100%",
		display: "flex",
		alignItems: "center",
		color: "rgba(0,0,0,0.6)",
	},

	dividerText: {
		width: "50px",
		zindex: 2,
		margin: "auto",
		textAlign: "center",
	},

	title: {
		marginTop: 0,
		fontSize: "20px",
		fontWeight: "bold",
	},

	errorMsg: {
		width: "100%",
		display: "flex",
		height: "35px",
		alignItems: "center",
		border: "1px solid rgba(0,0,0,0.2)",
		marginBottom: "10px",
		gap: "15px",
	},

	errorIcon: {
		backgroundColor: "#e34843",
		height: "100%",
		width: "38px",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},

	firstLine: {
		height: "1px",
		width: "45%",
		position: "absolute",
		backgroundColor: "rgba(0,0,0,0.2)",
	},

	secondLine: {
		height: "1px",
		width: "45%",
		position: "absolute",
		backgroundColor: "rgba(0,0,0,0.2)",
		right: 0,
	},

	labels: {
		"& .MuiOutlinedInput-root": {
			height: "38px",
			overflow: "hidden",
		},
		"& .MuiInputLabel-outlined": {
			transform: "translate(14px, 13px) scale(0.9)",
		},
		"& .MuiInputLabel-shrink": {
			transform: "translate(14px, -6px) scale(0.75)",
		},
	},
	forgotPassword: {
		color: "#307AD6",
		textDecoration: "none",
		fontSize: "14px",
		margin: "10px 0",
		"&:hover": {
			textDecoration: "underline",
		},
	},
	termsAndPolicy: {
		display: "flex",
		justifyContent: "center",
		width: "100%",
		alignItems: "center",
		gap: "10px",
		height: "70px",
		color: "#307AD6",
		textDecoration: "none",
		fontSize: "14px",
	},
}));

const Login = ({
	userLoading,
	loginData,
	loginSocialAccount,
	location,
	history,
	errorMessage,
}) => {
	// from will provide previous path redirect from
	// const { state } = location;
	const { state } = useLocation();
	const navigate = useNavigate();
	// Init hooks
	const { classes } = useStyles();

	// Init state
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState(defaultErrorSchema);
	const { instance } = useMsal();
	const dispatch = useDispatch();

	//url detail
	const { search } = useLocation();
	const redirectUrl = new URLSearchParams(search).get("redirectUrl");
	let siteAppIdFromUrl;
	let feedbackIdFromUrl;
	if (redirectUrl) {
		siteAppIdFromUrl = parseInt(
			redirectUrl?.split("?")?.pop()?.split("=")?.pop()
		);
		feedbackIdFromUrl = parseInt(
			redirectUrl?.split("?")?.shift()?.split("/")?.pop()
		);
	}
	// Handlers
	const loginHandler = async (email, password) => {
		// Attempting login
		try {
			var input = {
				email: email,
				password: password,
			};

			if (siteAppIdFromUrl && feedbackIdFromUrl) {
				input = { ...input, siteAppID: siteAppIdFromUrl };
			}

			const localChecker = await handleValidateObj(schema, input);

			// Attempting API call if no local validaton errors
			if (!localChecker?.some((el) => el.valid === false)) {
				const response = await loginData(input);

				if (response.data && siteAppIdFromUrl && feedbackIdFromUrl) {
					redirectToFeedbackNotification();
				} else if (response.data && !(siteAppIdFromUrl && feedbackIdFromUrl)) {
					redirectToPortalOrDefault(
						response?.data?.position?.siteAppID,
						response?.data?.position?.defaultPage
					);
					return true;
				} else {
					throw new Error(response);
				}
			} else {
				const newErrors = generateErrorState(localChecker);

				setErrors({ ...errors, ...newErrors });
			}
		} catch (err) {
			// Removing spinner
			dispatch(showError(err?.response?.data?.detail || `Failed to login.`));
			return false;
		}
	};

	const responseGoogle = async (res) => {
		try {
			var googleInput = { token: res?.credential };

			if (siteAppIdFromUrl && feedbackIdFromUrl) {
				googleInput = { ...googleInput, siteAppID: siteAppIdFromUrl };
			}
			const respon = await loginSocialAccount(
				googleInput,
				"GOOGLE",
				"/api/Account/google"
			);
			if (respon && siteAppIdFromUrl && feedbackIdFromUrl) {
				redirectToFeedbackNotification();
			} else if (respon) {
				redirectToPortalOrDefault(respon?.position?.siteAppID);
				return true;
			} else {
				throw new Error(respon);
			}
		} catch (err) {
			dispatch(showError(err?.response?.data ?? `Failed to login.`));
			return false;
		}
	};

	function signInMicrosoftHandler() {
		instance
			.loginPopup()
			.then((res) => responseMicrosoft(res))
			.catch((error) => dispatch(showError(`Failed to login.`)));
	}

	const responseMicrosoft = async (data) => {
		// some actions

		try {
			var microsoftInput = { token: data?.idToken };

			if (siteAppIdFromUrl && feedbackIdFromUrl) {
				microsoftInput = { ...microsoftInput, siteAppID: siteAppIdFromUrl };
			}
			const respon = await loginSocialAccount(
				microsoftInput,
				"MICROSOFT",
				"/api/Account/microsoft"
			);

			if (respon && siteAppIdFromUrl && feedbackIdFromUrl) {
				redirectToFeedbackNotification();
			} else if (respon) {
				redirectToPortalOrDefault(respon?.position?.siteAppID);
			} else {
				throw new Error(respon);
			}
		} catch (err) {
			dispatch(showError(err?.response?.data ?? `Failed to login.`));
		}
	};

	const responseApple = async (data) => {
		if (data?.authorization?.code) {
			try {
				var appleInput = { token: data?.authorization?.code };

				if (siteAppIdFromUrl && feedbackIdFromUrl) {
					appleInput = { ...appleInput, siteAppID: siteAppIdFromUrl };
				}
				const respon = await loginSocialAccount(
					appleInput,
					"Apple",
					"/api/Account/Apple"
				);

				if (respon && siteAppIdFromUrl && feedbackIdFromUrl) {
					redirectToFeedbackNotification();
				} else if (respon) {
					redirectToPortalOrDefault(respon?.position?.siteAppID);
				} else {
					throw new Error(respon);
				}
			} catch (err) {
				dispatch(showError(err?.response?.data ?? `Failed to login.`));
			}
		} else {
			return;
		}
	};

	let versionInfo;

	if (document.querySelector('meta[name="build-version"]')) {
		versionInfo = document.querySelector('meta[name="build-version"]').content;
	}

	const redirectToPortalOrDefault = (positionNotNull, defaultPage) =>
		positionNotNull ? successRedirect(defaultPage) : redirectToPortal();

	const successRedirect = (defaultPage) => {
		// Update below to change redirect location
		// if Previous location available redirect to previous location
		navigate(
			state?.from?.pathname
				? state?.from?.pathname
				: defaultRedirect[defaultPage] || siteUserLoginPath
		);
		return true;
	};

	const redirectToPortal = () =>
		navigate("/app/portal", { state: { from: loginPath } });

	const redirectToFeedbackNotification = () => {
		dispatch(handleSiteAppClick(siteAppIdFromUrl, true));
		navigate(`/app/feedback/${feedbackIdFromUrl}`, {
			state: { from: loginPath },
		});
	};

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			loginHandler(email, password);
		}
	};

	return (
		<Grid container component="main" className={classes.root}>
			<TabTitle title="EMI3" />
			<CssBaseline />
			<Grid item xs={false} sm={false} md={7} className={classes.image} />
			<Grid
				item
				xs={12}
				sm={12}
				md={5}
				component={Paper}
				elevation={6}
				square
				className={classes.watermark}
			>
				<div className={classes.paper}>
					<div className={classes.logoContainer}>
						<img src={ColourLogo} className={classes.logo} alt="logo" />
					</div>

					<div className={classes.loginFormContainer}>
						{userLoading ? (
							<div className={classes.spinnerContainer}>
								<CircularProgress />
							</div>
						) : (
							<>
								{errorMessage !== "" && (
									<div className={classes.errorMsg}>
										<span className={classes.errorIcon}>
											<ErrorIcon style={{ color: "white" }} />
										</span>
										{errorMessage}
									</div>
								)}
								<form className={classes.form} noValidate>
									<TextField
										sx={{
											"& .MuiInputBase-input.Mui-disabled": {
												WebkitTextFillColor: "#000000",
											},
										}}
										className={classes.labels}
										error={errors.email === null ? false : true}
										helperText={errors.email === null ? null : errors.email}
										variant="outlined"
										margin="normal"
										required
										fullWidth
										id="email"
										value={email || null}
										label="Email"
										name="email"
										autoComplete="email"
										onChange={(e) => setEmail(e.target.value)}
										onKeyDown={handleEnterPress}
									/>

									<TextField
										sx={{
											"& .MuiInputBase-input.Mui-disabled": {
												WebkitTextFillColor: "#000000",
											},
										}}
										className={classes.labels}
										error={errors.password === null ? false : true}
										helperText={
											errors.password === null ? null : errors.password
										}
										variant="outlined"
										margin="normal"
										required
										fullWidth
										name="password"
										label="Password"
										type="password"
										id="password"
										value={password || null}
										autoComplete="current-password"
										onChange={(e) => setPassword(e.target.value)}
										onKeyDown={handleEnterPress}
									/>

									<div className={classes.submitContainer}>
										<Link
											to="/forgot-password"
											className={classes.forgotPassword}
										>
											Forgot Password?
										</Link>

										<Button
											fullWidth
											variant="contained"
											color="primary"
											className={classes.submit}
											onClick={(e) => {
												loginHandler(email, password);
											}}
										>
											Sign In
										</Button>
									</div>
								</form>
							</>
						)}
						<div className={classes.divider}>
							<span className={classes.firstLine}></span>
							<span className={classes.dividerText}>OR</span>
							<span className={classes.secondLine}></span>
						</div>
						<GoogleLogin
							onSuccess={(credentialResponse) => {
								responseGoogle(credentialResponse);
							}}
							onError={() => {
								dispatch(showError(`Failed to login.`));
							}}
							width="340px"
							theme="outline"
						/>

						{/* <div style={{ width: "100%" }}>
							<div onClick={() => login()} className={classes.googleBtn}>
								<div className={classes.googleIconWrapper}>
									<img
										alt=""
										className={classes.googleIcon}
										src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
									/>
								</div>
								<p className={classes.btnText}>
									<b>Sign In With Google</b>
								</p>
							</div>
						</div> */}
						<div
							onClick={signInMicrosoftHandler}
							className={classes.microsoftbtn}
						>
							<div className={classes.googleIconWrapper}>
								<img
									alt=""
									className={classes.googleIcon}
									src="https://img.icons8.com/color/96/000000/microsoft.png"
								/>
							</div>
							<p className={classes.btnText} style={{ color: "#fff" }}>
								<b>Sign In With Microsoft</b>
							</p>
						</div>
						<AppleLoginSignin responseApple={responseApple} />
					</div>
					<div className={classes.termsAndPolicy}>
						<NavLink
							target="_blank"
							to={"http://www.equipmentmanagement.com.au/term-of-use"}
							className={classes.forgotPassword}
						>
							Term Of Use
						</NavLink>
						<span>|</span>
						<NavLink
							target="_blank"
							to={"http://www.equipmentmanagement.com.au/privacy-policy"}
							className={classes.forgotPassword}
						>
							Privacy Policy
						</NavLink>
						<span>|</span>
						<NavLink
							target="_blank"
							to={"https://support.emi3.io/support/tickets/new"}
							className={classes.forgotPassword}
						>
							Support
						</NavLink>
					</div>
				</div>
				<footer className={classes.footer}>
					<Typography className={classes.footerText}>
						&emsp;&emsp;&emsp;Build Version:&nbsp;
						{versionInfo}
					</Typography>
					<Typography className={classes.footerText}>
						&copy;{versionInfo?.split("-")?.[0]} Equipment Management
						International P/L
					</Typography>
				</footer>
			</Grid>
		</Grid>
	);
};

const mapStateToProps = ({ authData: { userLoading, errorMessage } }) => ({
	userLoading,
	errorMessage,
});

const mapDispatchToProps = (dispatch) => ({
	loginData: (data) => dispatch(loginUser(data)),
	loginSocialAccount: (data, loginType, url) =>
		dispatch(loginSocialAccount(data, loginType, url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
