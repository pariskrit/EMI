export default function screenSizeForTable(
	tableHeight,
	containsTable,
	navBarState,
	screenSize
) {
	let width = screenSize?.width;
	let result = { maxHeight: tableHeight + "px" };
	if (containsTable) {
		if (navBarState) {
			switch (navBarState) {
				case width <= 1054:
					return (result = { ...result, maxWidth: "68vw" });
				case width > 1055 && width <= 1299:
					return (result = { ...result, maxWidth: "72vw" });
				case width >= 1300 && width <= 1524:
					return (result = { ...result, maxWidth: "77vw" });
				case width > 1525 && width <= 1750:
					return (result = { ...result, maxWidth: "80vw" });
				case width > 1751 && width <= 2400:
					return (result = { ...result, maxWidth: "83vw" });
				case width > 2401 && width < 2980:
					return (result = { ...result, maxWidth: "88vw" });
				case width > 2981:
					return (result = { ...result, maxWidth: "90vw" });
				case width > 3500:
					return (result = { ...result, maxWidth: "100%" });
				default:
					return (result = { ...result, maxWidth: "100%" });
			}
		} else {
			switch (!navBarState) {
				case width <= 1024:
					return (result = { ...result, maxWidth: "84vw" });
				case width > 1055 && width <= 1299:
					return (result = { ...result, maxWidth: "88vw" });
				case width >= 1300 && width <= 1524:
					return (result = { ...result, maxWidth: "92vw" });
				case width > 1525 && width <= 1750:
					return (result = { ...result, maxWidth: "93vw" });
				case width > 1751 && width <= 2400:
					return (result = { ...result, maxWidth: "94vw" });
				case width > 2401 && width < 2800:
					return (result = { ...result, maxWidth: "98%" });
				case width > 2801:
					return (result = { ...result, maxWidth: "100%" });
				default:
					return (result = { ...result, maxWidth: "100%" });
			}
		}
	} else {
		return result;
	}
}


