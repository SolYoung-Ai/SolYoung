import { a as __exportAll, r as p } from "./paths_BlCYKCPI.mjs";
import { m as maybeRenderHead, o as renderComponent, p as renderTemplate } from "./server_Ciq-jqkO.mjs";
import { O as createAstro, S as categoryName, _ as getDict, h as toolDescription, k as createComponent, r as cx, t as $$BaseLayout, v as translate, w as tools, x as categories } from "./BaseLayout_BpPz4rCZ.mjs";
import { t as getIcon } from "./icons_BelbreN-.mjs";
import { t as CommunityFeed } from "./CommunityFeed_DVJAOvSj.mjs";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/islands/ToolsExplorer.tsx
function ToolsExplorer({ tools, initialCategory, locale = "zh" }) {
	const dict = getDict(locale);
	const [category, setCategory] = useState(initialCategory);
	const [query, setQuery] = useState("");
	const filtered = useMemo(() => {
		let list = tools;
		if (category !== "all") list = list.filter((t) => t.category === category);
		if (query.trim()) {
			const q = query.trim().toLowerCase();
			list = list.filter((t) => t.name.toLowerCase().includes(q) || toolDescription(t.slug, t.description, locale).toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q)) || t.keywords.some((k) => k.toLowerCase().includes(q)));
		}
		return list;
	}, [
		tools,
		category,
		query,
		locale
	]);
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "flex flex-col gap-3",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => setCategory("all"),
					className: cx("rounded-[2px] border px-2.5 py-1 text-xs font-medium transition-colors", category === "all" ? "border-foreground bg-foreground text-background" : "border-border bg-card text-foreground/70 hover:border-foreground/40"),
					children: locale === "en" ? "All tools" : "全部工具"
				}), categories.map((c) => /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => setCategory(c.slug),
					className: cx("rounded-[2px] border px-2.5 py-1 text-xs font-medium transition-colors", category === c.slug ? "border-foreground bg-foreground text-background" : "border-border bg-card text-foreground/70 hover:border-foreground/40"),
					children: c.name
				}, c.slug))]
			}), /* @__PURE__ */ jsxs("div", {
				className: "relative w-full sm:max-w-xs",
				children: [/* @__PURE__ */ jsx(Search, {
					className: "pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground",
					"aria-hidden": "true"
				}), /* @__PURE__ */ jsx("input", {
					type: "search",
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: locale === "en" ? "Search tools by name, description or keyword…" : "搜索工具名称、说明或关键词…",
					className: "input !pl-8",
					"aria-label": locale === "en" ? "Search tools" : "搜索工具"
				})]
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mt-6",
			children: [filtered.length === 0 && /* @__PURE__ */ jsxs("div", {
				className: "card p-10 text-center",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-sm text-foreground/70",
					children: locale === "en" ? "No tools match your search." : "没有找到符合条件的工具。"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: locale === "en" ? "Try different keywords or another category." : "试试其他关键词或分类。"
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: filtered.map((tool) => {
					const Icon = getIcon(tool.icon);
					return /* @__PURE__ */ jsxs("a", {
						href: p(`/tools/${tool.slug}/`, locale),
						className: "card group flex h-full flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "flex h-10 w-10 items-center justify-center rounded-[3px] border border-border bg-secondary text-foreground/80 transition-colors group-hover:bg-accent group-hover:text-accent-foreground",
									children: /* @__PURE__ */ jsx(Icon, {
										className: "h-5 w-5",
										"aria-hidden": "true"
									})
								}), /* @__PURE__ */ jsx("span", {
									className: "badge border-success/30 bg-success/10 text-success",
									children: translate(dict, "common.free")
								})]
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "font-display mt-3 text-[15px] font-bold text-foreground group-hover:text-accent",
								children: tool.name
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 line-clamp-2 flex-1 text-[13px] leading-5 text-muted-foreground",
								children: toolDescription(tool.slug, tool.description, locale)
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-4 flex items-center justify-between border-t border-border pt-3",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-muted-foreground",
									children: categoryName(tool.category)
								}), /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1 text-xs font-medium text-foreground/70 transition-all duration-150 group-hover:gap-2 group-hover:text-accent",
									children: [locale === "en" ? "Open tool" : "打开工具", /* @__PURE__ */ jsx("span", {
										"aria-hidden": "true",
										children: "→"
									})]
								})]
							})
						]
					}, tool.id);
				})
			})]
		}),
		/* @__PURE__ */ jsx("p", {
			className: "mt-4 text-center text-xs text-muted-foreground",
			children: locale === "en" ? `${filtered.length} tools · all free, running locally in your browser` : `共 ${filtered.length} 个工具 · 全部免费，在浏览器本地运行`
		})
	] });
}
//#endregion
//#region src/pages/tools/index.astro
var tools_exports = /* @__PURE__ */ __exportAll({
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
	const initialCategory = Astro.url.searchParams.get("category") ?? "all";
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": en ? "Free Online Tools" : "免费在线工具",
		"description": en ? "SolHub free online toolbox: JSON formatting, text counting, Base64, UUID, QR codes, image compression and more — all running locally in your browser, no signup." : "SolHub 免费在线工具箱：JSON 格式化、文本统计、Base64、UUID、二维码、图片压缩等实用工具，全部在浏览器本地运行，无需注册。",
		"route": "/tools/",
		"locale": locale
	}, { "default": ($$result) => renderTemplate` ${maybeRenderHead($$result)}<section class="border-b border-border bg-secondary/30 py-14"> <div class="container-page"> <p class="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
Tools
</p> <h1 class="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"> ${en ? "Free Online Toolbox" : "免费在线工具箱"} </h1> <p class="mt-3 max-w-2xl text-[15px] leading-7 text-muted-foreground"> ${en ? "Simple, practical and free. Every tool works right away with no login; your input is processed only in your browser and never uploaded to any server." : "简单、实用、免费。所有工具都直接可用，无需登录；你的输入只在浏览器本地处理，不会上传到任何服务器。"} </p> </div> </section> <section class="py-12"> <div class="container-page"> ${renderComponent($$result, "ToolsExplorer", ToolsExplorer, {
		"client:load": true,
		"tools": tools,
		"initialCategory": initialCategory,
		"locale": locale,
		"client:component-hydration": "load",
		"client:component-path": "@/islands/ToolsExplorer.tsx",
		"client:component-export": "default"
	})} ${renderComponent($$result, "CommunityFeed", CommunityFeed, {
		"client:load": true,
		"kind": "tool",
		"limit": 8,
		"title": en ? "Community tools" : "社区工具",
		"locale": locale,
		"client:component-hydration": "load",
		"client:component-path": "@/islands/CommunityFeed.tsx",
		"client:component-export": "default"
	})} </div> </section> ` })}`;
}, "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/pages/tools/index.astro", void 0);
var $$file = "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/pages/tools/index.astro";
var $$url = "/solhub/tools/";
//#endregion
export { tools_exports as n, $$Index as t };
