import { a as __exportAll } from "./paths_BlCYKCPI.mjs";
import { o as renderComponent, p as renderTemplate } from "./server_Ciq-jqkO.mjs";
import { O as createAstro, k as createComponent, w as tools } from "./BaseLayout_BpPz4rCZ.mjs";
import { t as $$ToolDetail } from "./ToolDetail_XnTrXL2_.mjs";
//#region src/pages/tools/[slug].astro
var _slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Slug,
	file: () => $$file,
	getStaticPaths: () => getStaticPaths,
	url: () => $$url
});
createAstro("https://solyoung.top");
function getStaticPaths() {
	return tools.map((tool) => ({
		params: { slug: tool.slug },
		props: {
			tool,
			locale: "zh"
		}
	}));
}
var $$Slug = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Slug;
	return renderTemplate`${renderComponent($$result, "ToolDetail", $$ToolDetail, { ...Astro.props })}`;
}, "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/pages/tools/[slug].astro", void 0);
var $$file = "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/pages/tools/[slug].astro";
var $$url = "/solhub/tools/[slug]/";
//#endregion
//#region \0virtual:astro:page:src/pages/tools/[slug]@_@astro
var page = () => _slug__exports;
//#endregion
export { page };
