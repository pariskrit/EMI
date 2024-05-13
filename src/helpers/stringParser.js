//parse string--removes p tag and adds br tag
const parser = new DOMParser()
export const removeParaTagFromString = (taskName) => {
	let filteredText = ""
	let containsText = false

	const newHtml = parser?.parseFromString(taskName, "text/html")
	const paragraphs = newHtml?.querySelectorAll("p,h1,h2,blockquote")
	const newHtmlBody = newHtml?.getElementsByTagName("body")[0]?.childNodes
	if (newHtmlBody?.length > 0) {
		for (let i = 0; i < newHtmlBody?.length; i++) {
			if (newHtmlBody?.[i]?.nodeName === "#text") {
				containsText = true
				break
			}
		}
	}

	if (
		(taskName?.length > 0 && paragraphs?.length === 0) ||
		containsText ||
		!paragraphs?.length > 0
	) {
		filteredText = taskName
	} else {
		paragraphs.forEach((p) => {
			if (p?.nodeName !== "P") {
				filteredText += p.outerHTML + ""
			} else if (
				p?.firstElementChild &&
				p?.firstElementChild.nodeName === "BR"
			) {
				filteredText += p.innerHTML + ""
			} else if (
				p?.firstElementChild &&
				p?.firstElementChild.nodeName !== "BR"
			) {
				filteredText += p.innerHTML + "<br/>"
			} else {
				filteredText += p.textContent + "<br/>"
			}
		})
	}

	return filteredText
}
