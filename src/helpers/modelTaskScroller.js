export const viewIntersectionObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.click();
				setTimeout(() => {
					entry.target.scrollIntoView({
						block: "center",
						inline: "center",
					});
				}, 500);

				viewIntersectionObserver.unobserve(entry.target);
			}
		});
	},
	{ threshold: 0.1 }
);

export default function modelTaskScroller(elementName) {
	elementName.scrollIntoView({
		behavior: "smooth",
		block: "start",
		inline: "center",
		top: elementName.getBoundingClientRect().bottom + window.pageYOffset,
	});

	viewIntersectionObserver.observe(elementName);
}
