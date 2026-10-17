import { a as __exportAll, n as baseUrl } from "./paths_BlCYKCPI.mjs";
//#region src/pages/robots.txt.ts
var robots_txt_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	prerender: () => true
});
/** 动态生成 robots.txt，Sitemap 地址自动带上 base 前缀 */
var GET = ({ site }) => {
	const base = baseUrl();
	const body = [
		"User-agent: *",
		"Allow: /",
		"",
		`Sitemap: ${`${(site ? site.toString() : "https://solyoung.top").replace(/\/$/, "")}${base}sitemap-index.xml`}`,
		""
	].join("\n");
	return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
//#endregion
//#region \0virtual:astro:page:src/pages/robots.txt@_@ts
var page = () => robots_txt_exports;
//#endregion
export { page };
