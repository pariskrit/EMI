import React from "react";
import AppleLogin from "react-apple-login";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => ({
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
		backgroundColor: "rgba(0,0,0)",
		"&:hover": {
			cursor: "pointer",
			backgroundColor: "rgba(0,0,0,.6)",
		},
		display: "flex",
		alignItems: "center",
		gap: "70px",
	},
	btnText: {
		color: "black",
		fontSize: "13px",
		letterSpacing: "0.2px",
		fontFamily: "Roboto",
		marginLeft: "10px",
	},
}));

const AppleLoginSignin = ({ responseApple }) => {
	const { classes, cx } = useStyles();
	return (
		<AppleLogin
			clientId={process.env.REACT_APP_APPLE_CLIENT_ID}
			redirectURI={process.env.REACT_APP_APPLE_REDIRECT_URL}
			responseType={"code"}
			responseMode={"query"}
			usePopup={true}
			callback={responseApple}
			render={(props) => (
				<div {...props} className={classes.microsoftbtn}>
					<div className={classes.googleIconWrapper}>
						<img
							alt=""
							className={classes.googleIcon}
							src="https://logodix.com/logo/4094.png"
						/>
					</div>
					<p className={classes.btnText} style={{ color: "#fff" }}>
						<b>Sign In With Apple</b>
					</p>
				</div>
			)}
		/>
	);
};

export default AppleLoginSignin;
