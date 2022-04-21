import ImageViewer from "components/Elements/ImageViewer";
import React from "react";

export default {
	title: "Components/ImageViewer",
	component: ImageViewer,
};

const Template = (args) => <ImageViewer {...args} />;

export const ImageView = Template.bind({});

ImageView.args = {
	open: true,
	imgSource:
		"https://emi3devupload.s3.us-west-2.amazonaws.com/ModelVersionZones/19ac6e85-e05b-4677-a5ca-3095612af496.JPG?X-Amz-Expires=900&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAZLU5PF25TX7UVWLD/20220418/us-west-2/s3/aws4_request&X-Amz-Date=20220418T032120Z&X-Amz-SignedHeaders=host&X-Amz-Signature=bdff63ed2b5bdb3ee54dcc3b935391425d91868bd1352f259e5c60041c4e23e1",
};
