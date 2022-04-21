import React from "react";
import PropTypes from "prop-types";

function TabelRowImage(props) {
	const {
		imageURL,
		imageWidth,
		imageHeight,
		imageWrapperHeight,
		imageWrapperWidth,
		onClickImage,
	} = props;
	return (
		<span
			className="image-wrapper"
			style={{ width: imageWrapperWidth, height: imageWrapperHeight }}
		>
			<img
				src={imageURL}
				alt="img"
				style={{
					width: imageWidth,
					height: imageHeight,
					objectFit: "contain",
					cursor: "pointer",
				}}
				onClick={onClickImage}
			/>
		</span>
	);
}
TabelRowImage.defaultProps = {
	imageURL: "",
	imageHeight: "100%",
	imageWidth: "100px",
	imageWrapperHeight: "70px",
	imageWrapperWidth: "100px",
	onClickImage: () => {},
};
TabelRowImage.propTypes = {
	imageURL: PropTypes.string.isRequired,
	imageHeight: PropTypes.string,
	imageWidth: PropTypes.string,
	imageWrapperHeight: PropTypes.string,
	imageWrapperWidth: PropTypes.string,
	onClickImage: PropTypes.func,
};
export default TabelRowImage;
