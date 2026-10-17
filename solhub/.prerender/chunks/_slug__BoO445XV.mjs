import { a as __exportAll } from "./paths_BlCYKCPI.mjs";
import { o as renderComponent, p as renderTemplate } from "./server_Ciq-jqkO.mjs";
import { O as createAstro, T as products, k as createComponent } from "./BaseLayout_BpPz4rCZ.mjs";
import { t as $$ProductDetail } from "./ProductDetail_B6BAXTTL.mjs";
//#region src/pages/products/[slug].astro
var _slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Slug,
	file: () => $$file,
	getStaticPaths: () => getStaticPaths,
	url: () => $$url
});
createAstro("https://solyoung.top");
function getStaticPaths() {
	return products.map((product) => ({
		params: { slug: product.slug },
		props: {
			product,
			locale: "zh"
		}
	}));
}
var $$Slug = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Slug;
	return renderTemplate`${renderComponent($$result, "ProductDetail", $$ProductDetail, { ...Astro.props })}`;
}, "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/pages/products/[slug].astro", void 0);
var $$file = "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/pages/products/[slug].astro";
var $$url = "/solhub/products/[slug]/";
//#endregion
//#region \0virtual:astro:page:src/pages/products/[slug]@_@astro
var page = () => _slug__exports;
//#endregion
export { page };
