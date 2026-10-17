import { a as __exportAll, r as p } from "./paths_BlCYKCPI.mjs";
import { g as addAttribute, m as maybeRenderHead, o as renderComponent, p as renderTemplate } from "./server_Ciq-jqkO.mjs";
import { O as createAstro, _ as getDict, k as createComponent, t as $$BaseLayout } from "./BaseLayout_BpPz4rCZ.mjs";
//#region src/pages/404.astro
var _404_exports = /* @__PURE__ */ __exportAll({
	default: () => $$404,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://solyoung.top");
var $$404 = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$404;
	const pathname = Astro.url.pathname;
	const en = pathname.includes("/en/") || pathname.endsWith("/en");
	getDict(en ? "en" : "zh");
	const locale = en ? "en" : "zh";
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": en ? "Page not found" : "页面不存在",
		"description": en ? "The page you visited does not exist or has been moved." : "你访问的页面不存在或已被移动。",
		"route": "/404/",
		"noIndex": true,
		"locale": locale
	}, { "default": ($$result) => renderTemplate` ${maybeRenderHead($$result)}<div class="container-page flex flex-col items-center py-28 text-center"> <p class="font-display text-7xl font-extrabold tracking-tight text-accent" aria-hidden="true">
404
</p> <h1 class="font-display mt-4 text-2xl font-bold text-foreground">${en ? "This page doesn't exist" : "这个页面不存在"}</h1> <p class="mt-2 max-w-md text-sm leading-6 text-muted-foreground"> ${en ? "The link may be broken, or the page has moved. Head back home, or go discover some products and tools." : "链接可能已失效，或者页面被移动了。你可以回到首页，或者去发现一些产品和工具。"} </p> <div class="mt-8 flex flex-wrap items-center justify-center gap-3"> <a${addAttribute(p("/", locale), "href")} class="btn btn-primary"> ${en ? "Back to home" : "回到首页"} </a> <a${addAttribute(p("/launches/", locale), "href")} class="btn btn-outline">
Explore Products
</a> <a${addAttribute(p("/tools/", locale), "href")} class="btn btn-outline">
Explore Tools
</a> </div> </div> ` })}`;
}, "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/pages/404.astro", void 0);
var $$file = "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/pages/404.astro";
var $$url = "/solhub/404/";
//#endregion
//#region \0virtual:astro:page:src/pages/404@_@astro
var page = () => _404_exports;
//#endregion
export { page };
