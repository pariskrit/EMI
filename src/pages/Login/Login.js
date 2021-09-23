import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { applicationListPath } from "helpers/routePaths";
import { useHistory } from "react-router-dom";
import * as yup from "yup";
import ColourLogo from "assets/colourLogo.png";
import LoginImage from "assets/spash_no_background.png";
import Watermark from "assets/watermark.png";
import API from "helpers/api";
import ColourConstants from "helpers/colourConstants";
import { generateErrorState, handleValidateObj } from "helpers/utils";

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

const Login = () => {
	// Init hooks
	const classes = useStyles();
	const history = useHistory();

	// Init state
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [attemptLogin, setAttemptLogin] = useState(false);
	const [errors, setErrors] = useState(defaultErrorSchema);

	// Handlers
	const loginHandler = async (email, password) => {
		// Setting spinner
		setAttemptLogin(true);

		// Attempting login
		try {
			var input = {
				email: email,
				password: password,
			};
			const localChecker = await handleValidateObj(schema, input);

			// Attempting API call if no local validaton errors
			if (!localChecker.some((el) => el.valid === false)) {
				// Making backend request
				let loginConfirm = await API.post("/api/Users/Login", {
					email: email,
					password: password,
				});

				if (loginConfirm.status === 200) {
					// Adding JWT to localStorage
					localStorage.setItem("token", loginConfirm.data.jwtToken);

					// Redirecting
					successRedirect();

					return true;
				} else {
					throw new Error(loginConfirm);
				}
			} else {
				const newErrors = generateErrorState(localChecker);

				setErrors({ ...errors, ...newErrors });
				setAttemptLogin(false);
			}
		} catch (err) {
			// Removing spinner
			setAttemptLogin(false);

			console.log("We didn't log in");
			console.log(err);

			return false;
		}
	};
	const successRedirect = () => {
		// Update below to change redirect location
		history.push(applicationListPath);

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
						{attemptLogin ? (
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

export default Login;