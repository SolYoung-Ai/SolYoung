//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region src/lib/paths.ts
function baseUrl() {
	const base = "/solhub/";
	return base.endsWith("/") ? base : base + "/";
}
/** 生成站内链接（自动带上 base 与语言前缀） */
function p(path, locale = "zh") {
	const cleanBase = baseUrl();
	const cleanPath = path.startsWith("/") ? path.slice(1) : path;
	return cleanBase + (locale === "en" ? "en/" : "") + cleanPath;
}
/** 把当前 pathname 还原为无 base、无语言前缀的路由（用于导航激活状态） */
function stripBase(pathname) {
	const base = baseUrl();
	let rest = pathname;
	if (base !== "/") {
		const cleanBase = base.replace(/\/$/, "");
		if (pathname === cleanBase || pathname === cleanBase + "/") rest = "/";
		else if (pathname.startsWith(cleanBase + "/")) rest = pathname.slice(cleanBase.length);
	}
	if (rest === "/en" || rest === "/en/") return "/";
	if (rest.startsWith("/en/")) return rest.slice(3);
	return rest;
}
/** 生成绝对 URL（用于 canonical / OG / sitemap，含语言前缀） */
function absoluteUrl(path, locale = "zh") {
	const site = "https://solyoung.top";
	const base = baseUrl();
	const cleanPath = path.startsWith("/") ? path.slice(1) : path;
	const langPrefix = locale === "en" ? "en/" : "";
	return `${site.replace(/\/$/, "")}${base}${langPrefix}${cleanPath}`;
}
//#endregion
export { __exportAll as a, stripBase as i, baseUrl as n, p as r, absoluteUrl as t };
