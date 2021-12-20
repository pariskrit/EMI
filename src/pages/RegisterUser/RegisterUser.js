import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useGoogleLogin } from "react-google-login";
import * as yup from "yup";
import ColourLogo from "assets/colourLogo.png";
import LoginImage from "assets/spash_no_background.png";
import Watermark from "assets/watermark.png";
import ColourConstants from "helpers/colourConstants";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import { useMsal } from "@azure/msal-react";
import { useLocation } from "react-router-dom";
import API from "helpers/api";
import { Apis } from "services/api";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { showNotications } from "redux/notification/actions";
import { loginSocialAccount } from "redux/auth/actions";
import { clientsPath } from "helpers/routePaths";

// Yup validation schema
const schema = yup.object({
	Password: yup
		.string("This field must be a string")
		.required("This field is required")
		.min(8, "password must be atleast 8 characters long")
		.matches(
			/^(?=.*\d)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
			"must contain 1 uppercase letter and 1 numeric value"
		),
});

// Default state schemas
const defaultErrorSchema = { Password: null };

const useStyles = makeStyles((theme) => ({
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
		margin: theme.spacing(8, 4),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	watermark: {
		background: `url(${Watermark}) fixed no-repeat bottom right`,
		backgroundSize: 400,
	},
	logoContainer: {
		display: "flex",
		alignItems: "center",
		marginBottom: 70,
		marginTop: 0,
	},
	logo: {
		width: 300,
	},
	loginFormContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		borderRadius: "5px",
		//marginTop: "-50px",
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
		width: "45px",
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
		fontSize: "14px",
		letterSpacing: "0.2px",
		fontFamily: "Roboto",
	},
	footer: {
		position: "fixed",
		bottom: "8px",
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
}));

const RegisterEmail = () => {
	// search contains email and token link
	const { search, state } = useLocation();

	// Init hooks
	const classes = useStyles();
	const history = useHistory();
	const dispatch = useDispatch();

	// Init state
	const [Password, setPassword] = useState("");
	const [errors, setErrors] = useState(defaultErrorSchema);
	const [loading, setLoading] = useState(false);
	const { instance } = useMsal();

	const { signIn } = useGoogleLogin({
		jsSrc: "https://apis.google.com/js/api.js",
		onFailure: (res) => console.log(res),
		clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
		onSuccess: (res) => responseGoogle(res),
		cookiePolicy: "single_host_origin",
	});

	// Handlers
	const RegisterEmail = async (e, Password) => {
		// Attempting login
		e.preventDefault();
		// Attempting Sending  passoword for Email Registration
		try {
			const input = {
				Password,
			};
			const localChecker = await handleValidateObj(schema, input);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				setLoading(true);
				// adding email and token to the payload
				const query = new URLSearchParams(search);
				const payload = {
					Email: query.get("email"),
					VerifyToken: query.get("token"),
					Password: input.Password,
				};
				const response = await API.post(Apis.RegisterEmail, payload);
				if (response.status === 200) {
					dispatch(
						showNotications({
							show: true,
							message: "Email Registered Successfully",
							severity: "success",
						})
					);
					// push to login page upon successful Email registration
					redirectLogin();
				} else {
					// show error notification
					dispatch(
						showNotications({
							show: true,
							message: "Invalid Verification Code.",
							severity: "error",
						})
					);
					setErrors(defaultErrorSchema);
					setPassword("");
					setLoading(false);
				}
			} else {
				const newErrors = generateErrorState(localChecker);
				setErrors({ ...errors, ...newErrors });
			}
		} catch (err) {
			// show error notification
			dispatch(
				showNotications({
					show: true,
					message: err?.response?.data ?? "Invalid Verification Code.",
					severity: "error",
				})
			);
			setErrors(defaultErrorSchema);
			setPassword("");
			setLoading(false);
			return false;
		}
	};

	const responseGoogle = async (res) => {
		setLoading(true);
		try {
			const respon = await dispatch(
				loginSocialAccount({ token: res.tokenId }, "GOOGLE", "/Account/google")
			);

			if (respon) {
				redirectToPortalOrDefault(respon?.position?.siteAppID);

				return true;
			} else {
				setLoading(false);
				throw new Error(respon);
			}
		} catch (err) {
			dispatch(
				showNotications({
					show: true,
					message: err?.response?.detail ?? "Invalid Email Account.",
					severity: "error",
				})
			);
			setLoading(false);
			console.error(err);
			return false;
		}
	};

	function signInMicrosoftHandler() {
		instance
			.loginPopup()
			.then((res) => responseMicrosoft(res))
			.catch((error) => console.log(error));
	}

	const responseMicrosoft = async (data) => {
		// some actions
		setLoading(true);
		try {
			const respon = await dispatch(
				loginSocialAccount(
					{ token: data.idToken },
					"MICROSOFT",
					"/Account/microsoft"
				)
			);

			if (respon) {
				redirectToPortalOrDefault(respon?.position?.siteAppID);
			} else {
				setLoading(false);
				throw new Error(respon);
			}
		} catch (err) {
			dispatch(
				showNotications({
					show: true,
					message: err?.response?.detail ?? "Invalid Email Account.",
					severity: "error",
				})
			);
			setLoading(false);
			console.error(err);
		}
	};
	const redirectToPortalOrDefault = (positionNotNull) =>
		positionNotNull ? successRedirect() : redirectToPortal();

	const successRedirect = () => {
		// Update below to change redirect location
		// if Previous location available redirect to previous location
		history.push(state?.from?.pathname ? state?.from?.pathname : clientsPath);
		return true;
	};

	const redirectToPortal = () => history.push("/app/portal");

	const redirectLogin = () => history.push("/login");

	return (
		<Grid container component="main" className={classes.root}>
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
						{loading ? (
							<div className={classes.spinnerContainer}>
								<CircularProgress />
							</div>
						) : (
							<>
								<form
									className={classes.form}
									noValidate
									onSubmit={(e) => {
										RegisterEmail(e, Password);
									}}
								>
									<TextField
										className={classes.labels}
										error={errors.Password === null ? false : true}
										helperText={
											errors.Password === null ? null : errors.Password
										}
										variant="outlined"
										margin="normal"
										required
										fullWidth
										name="Password"
										label="Set Password"
										type="password"
										id="password"
										value={Password}
										autoComplete="current-password"
										onChange={(e) => setPassword(e.target.value)}
									/>

									<div className={classes.submitContainer}>
										<Button
											fullWidth
											variant="contained"
											color="primary"
											className={classes.submit}
											type="submit"
										>
											Set Password
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
						<div style={{ width: "100%" }}>
							<div className={classes.googleBtn} onClick={signIn}>
								<div className={classes.googleIconWrapper}>
									<img
										alt=""
										className={classes.googleIcon}
										src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
									/>
								</div>
								<p className={classes.btnText}>
									<b>Sign Up With Google</b>
								</p>
							</div>
						</div>

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
								<b>Sign Up With Microsoft</b>
							</p>
						</div>
					</div>

					<footer className={classes.footer}>
						<Typography className={classes.footerText}>
							&copy; 2021 Equipment Management International P/L
						</Typography>
					</footer>
				</div>
			</Grid>
		</Grid>
	);
};

export default RegisterEmail;
