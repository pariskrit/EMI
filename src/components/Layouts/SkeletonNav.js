import React from "react";
import { Skeleton } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
	line: {
		height: "12px",
		width: "100%",
		background: "#dadada",
		zIndex: 100,
		position: "absolute",
	},
	skeletonBody: {
		height: "100%",
		width: 70,
		background: "#dadada",
		position: "relative",
	},
	skeletonNavs: {
		position: "absolute",
		right: 0,
		top: 12,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		background: "#c1b9b9",
		width: 52,
		height: "98%",
	},
	navTop: {
		display: "flex",
		flexDirection: "column",
		gap: 34,
		borderBottom: "1px solid rgba(0, 0, 0, 0.11)",
		padding: 12,
		height: "65%",
	},
	navBottom: {
		display: "flex",
		flexDirection: "column",
		gap: 34,
		height: "35%",
		marginTop: 20,
	},
});

const SkeletonNav = () => {
	const classes = useStyles();

	return (
		<>
			<div className={classes.line}></div>
			<div className={classes.skeletonBody}>
				<div className={classes.skeletonNavs}>
					<div className={classes.navTop}>
						<Skeleton
							animation="wave"
							height={27}
							width={27}
							variant="circle"
						/>
						<Skeleton animation="wave" height={27} width={27} variant="rect" />
						<Skeleton animation="wave" height={27} width={27} variant="rect" />
						<Skeleton animation="wave" height={27} width={27} variant="rect" />
						<Skeleton animation="wave" height={27} width={27} variant="rect" />
						<Skeleton animation="wave" height={27} width={27} variant="rect" />
					</div>
					<div className={classes.navBottom}>
						<Skeleton animation="wave" height={27} width={27} variant="rect" />
						<Skeleton animation="wave" height={27} width={27} variant="rect" />
						<Skeleton animation="wave" height={27} width={27} variant="rect" />
					</div>
				</div>
			</div>
		</>
	);
};
export default SkeletonNav;
