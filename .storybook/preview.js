import React from "react";
import { addDecorator } from "@storybook/react";
import { MemoryRouter } from "react-router";
import { withProvider } from "../src/stories/decorators/withProvider";
import "../src/App.scss";

addDecorator(withProvider);
addDecorator((story) => (
	<MemoryRouter initialEntries={["/"]}>{story()}</MemoryRouter>
));
export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
};
