import React, { useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { makeStyles } from "tss-react/mui";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as yup from "yup";
import ColourLogo from "assets/colourLogo.png";
import LoginImage from "assets/spash_no_background.png";
import Watermark from "assets/watermark.png";
import ColourConstants from "helpers/colourConstants";
import { generateErrorState, handleValidateObj } from "helpers/utils";
import API from "helpers/api";
import { Apis } from "services/api";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { showNotications } from "redux/notification/actions";
import { useDispatch } from "react-redux";

// Yup validation schema
const schema = (password) =>
	yup.object({
		Password: yup
			.string("This field must be a string")
			.required("This field is required")
			.min(8, "must be atleast 8 characters long")
			.matches(
				/^(?=.*\d)(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
				"must contain 1 uppercase letter and 1 numeric value"
			),
		ConfirmPassword: yup
			.string("This field must be a string")
			.required("This field is required")
			.test("passwords-match", "Passwords must match", function (value, ctx) {
				return password === value;
			}),
	});

// Default state schemas
const defaultErrorSchema = { Password: null, ConfirmPassword: null };

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

const ResetPassword = () => {
	// Init hooks
	const { classes } = useStyles();
	const { search } = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// Init state
	const [Password, setPassword] = useState("");
	const [ConfirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState(defaultErrorSchema);

	// Handlers
	const ResetPasswordHandler = async (e, Email) => {
		e.preventDefault();
		// Attempting Sending new passowrd for Password reset
		try {
			var input = {
				Password,
				ConfirmPassword,
			};
			const localChecker = await handleValidateObj(schema(Password), input);

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
				const response = await API.post(Apis.ResetPassword, payload);
				if (response.status === 200) {
					dispatch(
						showNotications({
							show: true,
							message: "Password Reset Successful",
							severity: "success",
						})
					);
					// push to login page upon successful password reset
					navigate("/login");
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
					setConfirmPassword("");
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
			setConfirmPassword("");
			setLoading(false);
			return false;
		}
	};

	return (
		<>
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
											ResetPasswordHandler(e, Password);
										}}
									>
										<TextField
											sx={{
												"& .MuiInputBase-input.Mui-disabled": {
													WebkitTextFillColor: "#000000",
												},
											}}
											className={classes.labels}
											error={errors.Password === null ? false : true}
											helperText={
												errors.Password === null ? null : errors.Password
											}
											variant="outlined"
											margin="normal"
											required
											fullWidth
											id="password"
											value={Password}
											label="New password"
											name="Password"
											type="password"
											autoComplete="new-password"
											onChange={(e) => setPassword(e.target.value)}
										/>
										<TextField
											sx={{
												"& .MuiInputBase-input.Mui-disabled": {
													WebkitTextFillColor: "#000000",
												},
											}}
											className={classes.labels}
											error={errors.ConfirmPassword === null ? false : true}
											helperText={
												errors.ConfirmPassword === null
													? null
													: errors.ConfirmPassword
											}
											variant="outlined"
											margin="normal"
											required
											fullWidth
											id="ConfirmPassword"
											type="password"
											value={ConfirmPassword}
											label="Confirm new password"
											name="ConfirmPassword"
											autoComplete="confirm-password"
											onChange={(e) => setConfirmPassword(e.target.value)}
										/>

										<div className={classes.submitContainer}>
											<Button
												fullWidth
												variant="contained"
												color="primary"
												className={classes.submit}
												type="submit"
											>
												Change Your Password
											</Button>
										</div>
									</form>
									<div
										style={{
											marginTop: "20px",
										}}
									>
										<Typography className={classes.footerText}>
											Already have login and password?{" "}
											<Link to="/login" className={classes.forgotPassword}>
												Log In
											</Link>
										</Typography>
									</div>
								</>
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
		</>
	);
};

export default ResetPassword;
