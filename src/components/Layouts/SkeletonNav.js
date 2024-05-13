import React from "react";
import { Skeleton } from "@mui/lab";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => ({
	line: {
		height: "12px",
		width: "100%",
		background: "#dadada",
		zIndex: 100,
		position: "absolute",
	},
	skeletonBody: {
		height: "100vh",
		width: 62,
		background: "#dadada",
		position: "relative",
	},
	skeletonNavs: {
		position: "fixed",
		left: 0,
		top: 0,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		background: "#c1b9b9",
		width: 62,
		height: "100vh",
	},
	navTop: {
		display: "flex",
		flexDirection: "column",
		//gap: 34,
		borderBottom: "1px solid rgba(0, 0, 0, 0.11)",
		padding: "20px 12px 20px 12px",
		height: "67%",
	},
	navBottom: {
		display: "flex",
		flexDirection: "column",
		//gap: 34,
		height: "33%",
		marginTop: 20,
	},
	logoContainer: {
		marginBottom: 20,
	},
	rectBox: {
		margin: "auto",
	},
}));

const SkeletonNav = () => {
	const { classes, cx } = useStyles();

	return (
		<>
			{/* <div className={classes.line}></div> */}
			<div className={classes.skeletonBody}>
				<div className={classes.skeletonNavs + " nav-skeleton"}>
					<div className={classes.navTop}>
						<div className={classes.logoContainer}>
							<Skeleton
								animation="wave"
								height={33}
								width={33}
								variant="circle"
							/>
						</div>

						<Skeleton
							className={classes.rectBox}
							animation="wave"
							height={28}
							width={28}
							variant="rect"
						/>
						<Skeleton
							className={classes.rectBox}
							animation="wave"
							height={28}
							width={28}
							variant="rect"
						/>
						<Skeleton
							className={classes.rectBox}
							animation="wave"
							height={28}
							width={28}
							variant="rect"
						/>
						<Skeleton
							className={classes.rectBox}
							animation="wave"
							height={28}
							width={28}
							variant="rect"
						/>
						<Skeleton
							className={classes.rectBox}
							animation="wave"
							height={28}
							width={28}
							variant="rect"
						/>
					</div>
					<div className={classes.navBottom}>
						<Skeleton
							className={classes.rectBox}
							animation="wave"
							height={28}
							width={28}
							variant="rect"
						/>
						<Skeleton
							className={classes.rectBox}
							animation="wave"
							height={28}
							width={28}
							variant="rect"
						/>
						<Skeleton
							className={classes.rectBox}
							animation="wave"
							height={28}
							width={28}
							variant="rect"
						/>
					</div>
				</div>
			</div>
		</>
	);
};
export default SkeletonNav;
