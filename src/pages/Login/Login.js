import React, { useState } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { GoogleLogin } from "react-google-login";
import { clientsPath } from "helpers/routePaths";
import * as yup from "yup";
import ColourLogo from "assets/colourLogo.png";
import LoginImage from "assets/spash_no_background.png";
import Watermark from "assets/watermark.png";
import ColourConstants from "helpers/colourConstants";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import { loginSocialAccount, loginUser } from "redux/auth/actions";
import { showError } from "redux/common/actions";
import { useMsal } from "@azure/msal-react";

// Yup validation schema
const schema = yup.object({
	email: yup
		.string("This field must be a string")
		.email("Invalid email address")
		.required("This field is required"),
	password: yup
		.string("This field must be a string")
		.required("This field is required"),
});

// Default state schemas
const defaultErrorSchema = { email: null, password: null };

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
		margin: "20px 32px",
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
		marginTop: 30,
	},
	logo: {
		width: 300,
	},
	loginFormContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		minWidth: 380,
	},
	spinnerContainer: {
		marginTop: 20,
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(1),
	},
	submitContainer: {
		display: "flex",
		flexDirection: "row-reverse",
	},
	submit: {
		backgroundColor: ColourConstants.confirmButton,
		marginTop: 10,
		width: 150,
		paddingTop: 15,
		paddingBottom: 15,
	},
	googleBtn: {
		width: "230px",
		height: "42px",
		backgroundColor: "#4285f4",
		borderRadius: "2px",
		boxShadow: "0 3px 4px 0 rgba(0,0,0,.25)",
		"&:hover": {
			cursor: "pointer",
		},
	},
	googleIconWrapper: {
		position: "absolute",
		marginTop: "1px",
		marginLeft: "1px",
		width: "40px",
		height: "40px",
		borderRadius: "2px",
		backgroundColor: "#fff",
	},
	googleIcon: {
		position: "absolute",
		marginTop: "11px",
		marginLeft: "11px",
		width: "18px",
		height: "18px",
	},
	microsoftbtn: {
		width: "255px",
		height: "42px",
		marginTop: "11px",
		borderRadius: "2px",
		boxShadow: "0 3px 4px 0 rgba(0,0,0,.25)",
		"&:hover": {
			cursor: "pointer",
		},
		backgroundColor: "#2b2c2c",
	},
	btnText: {
		float: "right",
		margin: "11px 11px 0 0",
		color: "#fff",
		fontSize: "14px",
		letterSpacing: "0.2px",
		fontFamily: "Roboto",
	},
	footer: {
		height: 50,
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		bottom: 0,
	},
	footerText: {
		fontSize: "1em",
		margin: 0,
		padding: 0,
	},
}));

const Login = ({
	userLoading,
	loginData,
	loginSocialAccount,
	getErrors,
	location,
	history,
}) => {
	// from will provide previous path redirect from
	const { state } = location;

	// Init hooks
	const classes = useStyles();

	// Init state
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState(defaultErrorSchema);
	const { instance } = useMsal();

	// Handlers
	const loginHandler = async (email, password) => {
		// Setting spinner

		// Attempting login
		try {
			var input = {
				email: email,
				password: password,
			};
			const localChecker = await handleValidateObj(schema, input);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				const response = await loginData(input);
				if (response) {
					successRedirect();
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
			return false;
		}
	};

	const responseGoogle = async (res) => {
		try {
			const respon = await loginSocialAccount(
				{ token: res.Zb.id_token },
				"GOOGLE",
				"/Account/google"
			);
			if (respon) {
				successRedirect();
				return true;
			} else {
				throw new Error(respon);
			}
		} catch (err) {
			getErrors(err.response.data.detail);
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

		try {
			const respon = await loginSocialAccount(
				{ token: data.idToken },
				"MICROSOFT",
				"/Account/microsoft"
			);
			if (respon) {
				localStorage.setItem("homeAccoundId", data.account.homeAccountId);
				successRedirect();
			} else {
				throw new Error(respon);
			}
		} catch (err) {
			getErrors(err.response.data.detail);
		}
	};

	const successRedirect = () => {
		// Update below to change redirect location
		// if Previous location available redirect to previous location
		history.push(state?.from?.pathname ? state?.from?.pathname : clientsPath);
		return true;
	};

	const handleEnterPress = (e) => {
		// 13 is the enter keycode
		if (e.keyCode === 13) {
			loginHandler(email, password);
		}
	};

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
						{userLoading ? (
							<div className={classes.spinnerContainer}>
								<CircularProgress />
							</div>
						) : (
							<form className={classes.form} noValidate>
								<TextField
									error={errors.email === null ? false : true}
									helperText={errors.email === null ? null : errors.email}
									variant="outlined"
									margin="normal"
									required
									fullWidth
									id="email"
									value={email}
									label="Email"
									name="email"
									autoComplete="email"
									onChange={(e) => setEmail(e.target.value)}
									onKeyDown={handleEnterPress}
								/>
								<TextField
									error={errors.password === null ? false : true}
									helperText={errors.password === null ? null : errors.password}
									variant="outlined"
									margin="normal"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									value={password}
									autoComplete="current-password"
									onChange={(e) => setPassword(e.target.value)}
									onKeyDown={handleEnterPress}
								/>

								<div className={classes.submitContainer}>
									<Button
										fullWidth
										variant="contained"
										color="primary"
										className={classes.submit}
										onClick={(e) => {
											loginHandler(email, password);
										}}
									>
										Log In
									</Button>
								</div>
							</form>
						)}
						<div style={{ marginTop: "11px" }}>
							<GoogleLogin
								clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
								render={(renderProps) => (
									<div
										onClick={renderProps.onClick}
										disabled={renderProps.disabled}
										className={classes.googleBtn}
									>
										<div className={classes.googleIconWrapper}>
											<img
												alt=""
												className={classes.googleIcon}
												src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
											/>
										</div>
										<p className={classes.btnText}>
											<b>CONTINUE WITH GOOGLE</b>
										</p>
									</div>
								)}
								onSuccess={responseGoogle}
								onFailure={responseGoogle}
								cookiePolicy={"single_host_origin"}
							/>
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
							<p className={classes.btnText}>
								<b>CONTINUE WITH MICROSOFT</b>
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

const mapStateToProps = ({ authData: { userLoading } }) => ({
	userLoading,
});
const mapDispatchToProps = (dispatch) => ({
	loginData: (data) => dispatch(loginUser(data)),
	loginSocialAccount: (data, loginType, url) =>
		dispatch(loginSocialAccount(data, loginType, url)),
	getErrors: (msg) => dispatch(showError(msg)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
