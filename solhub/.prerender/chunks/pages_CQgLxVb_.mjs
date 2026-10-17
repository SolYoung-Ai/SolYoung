import { a as __exportAll, r as p } from "./paths_BlCYKCPI.mjs";
import { g as addAttribute, m as maybeRenderHead, o as renderComponent, p as renderTemplate, s as Fragment$2 } from "./server_Ciq-jqkO.mjs";
import { E as siteConfig, O as createAstro, T as products, _ as getDict, c as buildSearchIndex, k as createComponent, l as searchIndex, o as getLocale, t as $$BaseLayout, v as translate, w as tools } from "./BaseLayout_BpPz4rCZ.mjs";
import { t as rankProducts } from "./ranking_CsDXrXF_.mjs";
import { t as $$ProductCard } from "./ProductCard_-weNsyPB.mjs";
import { t as CommunityFeed } from "./CommunityFeed_DVJAOvSj.mjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/SectionHeading.astro
createAstro("https://solyoung.top");
var $$SectionHeading = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$SectionHeading;
	const { eyebrow, title, description, actionHref, actionLabel } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="mb-6 flex flex-wrap items-end justify-between gap-4"> <div class="max-w-2xl"> ${eyebrow && renderTemplate`<p class="mb-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-accent"> ${eyebrow} </p>`} <h2 class="font-display text-2xl font-bold tracking-tight text-foreground sm:text-[28px]"> ${title} </h2> ${description && renderTemplate`<p class="mt-2 text-sm leading-6 text-muted-foreground">${description}</p>`} </div> ${actionHref && actionLabel && renderTemplate`<a${addAttribute(actionHref, "href")} class="btn btn-outline !h-8 text-[13px]"> ${actionLabel} <span aria-hidden="true">→</span> </a>`} </div>`;
}, "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/components/SectionHeading.astro", void 0);
//#endregion
//#region src/islands/HeroSearch.tsx
/** 首页 Hero 搜索条：直接输入出下拉结果 */
function HeroSearch() {
	const locale = getLocale();
	const dict = getDict(locale);
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const [active, setActive] = useState(0);
	const boxRef = useRef(null);
	const index = useMemo(() => buildSearchIndex(products, tools, locale), [locale]);
	const results = query.trim() ? searchIndex(query, index, locale) : [];
	useEffect(() => {
		const onClick = (e) => {
			if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
		};
		document.addEventListener("mousedown", onClick);
		return () => document.removeEventListener("mousedown", onClick);
	}, []);
	const go = (r) => {
		window.location.href = r.kind === "tool" ? p(`/tools/${r.slug}/`, locale) : p(`/products/${r.slug}/`, locale);
	};
	return /* @__PURE__ */ jsxs("div", {
		ref: boxRef,
		className: "relative mx-auto w-full max-w-xl",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3 rounded-[4px] border border-border-strong bg-card px-4 py-3.5 shadow-md transition-all duration-200 focus-within:border-foreground/40 focus-within:shadow-lg",
				children: [
					/* @__PURE__ */ jsx(Search, {
						className: "h-4 w-4 shrink-0 text-muted-foreground",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ jsx("input", {
						type: "text",
						value: query,
						onChange: (e) => {
							setQuery(e.target.value);
							setOpen(true);
							setActive(0);
						},
						onFocus: () => setOpen(true),
						onKeyDown: (e) => {
							if (e.key === "ArrowDown") {
								e.preventDefault();
								setActive((a) => Math.min(a + 1, results.length - 1));
							} else if (e.key === "ArrowUp") {
								e.preventDefault();
								setActive((a) => Math.max(a - 1, 0));
							} else if (e.key === "Enter" && results[active]) go(results[active]);
							else if (e.key === "Escape") setOpen(false);
						},
						placeholder: locale === "en" ? "Search products & tools, e.g. “json”, “QR”, “SolYoung”…" : "搜索产品或工具，比如 “json”“二维码”“SolYoung”…",
						className: "flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none",
						"aria-label": translate(dict, "nav.search")
					}),
					query && /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setQuery(""),
						className: "text-muted-foreground hover:text-foreground",
						"aria-label": "Clear",
						children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
					})
				]
			}),
			open && query.trim() && results.length > 0 && /* @__PURE__ */ jsx("div", {
				className: "absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-[4px] border border-border bg-card shadow-xl",
				children: /* @__PURE__ */ jsx("ul", {
					className: "max-h-80 overflow-y-auto py-1",
					children: results.map((r, i) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => go(r),
						onMouseEnter: () => setActive(i),
						className: "flex w-full items-center gap-2 px-4 py-2.5 text-left text-[14px] " + (i === active ? "bg-secondary" : ""),
						children: [
							/* @__PURE__ */ jsx("span", { className: "h-2 w-2 shrink-0 rounded-full " + (r.kind === "tool" ? "bg-accent" : "bg-foreground/40") }),
							/* @__PURE__ */ jsx("span", {
								className: "min-w-0 flex-1 truncate text-foreground",
								children: r.name
							}),
							/* @__PURE__ */ jsx("span", {
								className: "shrink-0 text-[10px] uppercase text-muted-foreground",
								children: r.kind
							})
						]
					}) }, r.slug))
				})
			}),
			open && query.trim() && results.length === 0 && /* @__PURE__ */ jsx("div", {
				className: "absolute left-0 right-0 top-full z-50 mt-2 rounded-[4px] border border-border bg-card px-4 py-3 text-[13px] text-muted-foreground shadow-xl",
				children: translate(dict, "search.emptyTitle", { q: query.trim() })
			})
		]
	});
}
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://solyoung.top");
var $$Index = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const locale = Astro.props.locale ?? "zh";
	const en = locale === "en";
	const featured = rankProducts(products).slice(0, 3);
	rankProducts(products).slice(3, 7);
	const metaTitle = en ? `${siteConfig.name} — Discover. Build. Share.` : siteConfig.name;
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": metaTitle,
		"description": en ? "Products worth discovering, tools worth using. SolHub is an indie-product discovery platform and free online toolbox: explore what indie developers are building and use simple, practical, free tools." : "值得被发现的产品，值得被使用的工具。SolHub 是独立产品发现平台与在线工具箱：探索独立开发者正在创造的产品，使用简单、实用、免费的在线工具，让独立创作更高效。",
		"route": "/",
		"locale": locale
	}, { "default": ($$result) => renderTemplate`  ${maybeRenderHead($$result)}<section class="relative overflow-hidden"> <div class="pointer-events-none absolute inset-0" aria-hidden="true" style="background-image: radial-gradient(circle at 50% 0%, rgb(232 112 40 / 0.08), transparent 55%)"></div> <div class="container-page relative py-12 text-center sm:py-20"> <p class="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-accent sm:mb-4 sm:text-[11px]">
SolHub · Discover · Build · Share
</p> <p class="mx-auto mt-2 max-w-2xl text-[15px] leading-7 text-muted-foreground sm:text-base"> ${en ? renderTemplate`${renderComponent($$result, "Fragment", Fragment$2, {}, { "default": ($$result) => renderTemplate`Explore products indie developers are building, use simple, practical, free online tools,<br class="hidden sm:block">and ship every good idea faster.` })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment$2, {}, { "default": ($$result) => renderTemplate`探索独立开发者正在创造的产品，使用简单、实用、免费的在线工具，<br class="hidden sm:block">让每一个好想法更快落地。` })}`} </p> <div class="mx-auto mt-8 max-w-xl"> ${renderComponent($$result, "HeroSearch", HeroSearch, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "@/islands/HeroSearch.tsx",
		"client:component-export": "default"
	})} </div> <div class="mt-6 flex flex-wrap items-center justify-center gap-3"> <a${addAttribute(p("/launches/", locale), "href")} class="btn bg-accent/10 text-accent hover:bg-accent/15 border border-accent/20"> ${en ? "Explore All Products" : "浏览全部产品"} </a> </div> </div> </section>  <section class="border-t border-border bg-secondary/30 py-10 sm:py-16"> <div class="container-page"> ${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": en ? "This Week · Curated" : "This Week · 人工精选",
		"title": en ? "This week's launches" : "本周产品榜单",
		"description": en ? "Products worth your attention recently. Ranked by curation + verification priority; full rules on the launches page." : "近期值得关注的产品。榜单为人工精选 + 核验优先排序，完整规则见榜单页。",
		"actionHref": p("/launches/", locale),
		"actionLabel": en ? "View full rankings" : "查看完整榜单"
	})} <div class="grid gap-5 md:grid-cols-3"> ${featured.map((product, i) => renderTemplate`<div class="animate-rise"${addAttribute(`animation-delay:${i * 60}ms`, "style")}> ${renderComponent($$result, "ProductCard", $$ProductCard, {
		"product": product,
		"rank": i + 1,
		"highlight": true,
		"locale": locale
	})} </div>`)} </div> </div> </section>  <section class="border-t border-border bg-secondary/30 py-10 sm:py-16"> <div class="container-page"> ${renderComponent($$result, "SectionHeading", $$SectionHeading, {
		"eyebrow": "Community Picks",
		"title": en ? "Community-submitted products" : "社区精选产品",
		"description": en ? "Products submitted by developers like you via GitHub Issues." : "开发者通过 GitHub Issues 提交的产品和工具，任何人都可以提交自己的作品。",
		"actionHref": p("/submit/", locale),
		"actionLabel": en ? "Submit yours" : "提交我的产品"
	})} ${renderComponent($$result, "CommunityFeed", CommunityFeed, {
		"client:load": true,
		"kind": "product",
		"limit": 8,
		"title": "",
		"locale": locale,
		"client:component-hydration": "load",
		"client:component-path": "@/islands/CommunityFeed.tsx",
		"client:component-export": "default"
	})} </div> </section>  <section class="py-10 sm:py-16"> <div class="container-page"> <div class="card relative overflow-hidden p-8 text-center sm:p-12"> <div class="pointer-events-none absolute inset-0" aria-hidden="true" style="background-image: radial-gradient(circle at 80% 20%, rgb(232 112 40 / 0.1), transparent 50%)"></div> <h2 class="font-display relative text-2xl font-bold tracking-tight text-foreground sm:text-3xl"> ${en ? "Built a website, app or AI tool yourself?" : "自己做了一款网站、软件或 AI 工具？"} </h2> <p class="relative mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-[15px]"> ${en ? "Submit it to SolHub and let more indie developers and users find it. Submissions are auto-published to the community list; you can also upload a self-contained HTML tool to run in a sandbox right here." : "把它提交到 SolHub，让更多独立开发者与使用者发现它。提交即自动公开到社区列表；也可以上传自包含 HTML，让工具直接在本站沙箱内运行。"} </p> <a${addAttribute(p("/submit/", locale), "href")} class="btn btn-accent relative mt-6 !h-10 px-6"> ${en ? "Submit a Product" : "提交你的产品"} <span aria-hidden="true">→</span> </a> </div> </div> </section> ` })}`;
}, "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/pages/index.astro", void 0);
var $$file = "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/pages/index.astro";
var $$url = "/solhub/";
//#endregion
export { pages_exports as n, $$Index as t };
