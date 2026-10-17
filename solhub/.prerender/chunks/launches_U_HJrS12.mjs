import { a as __exportAll, r as p } from "./paths_BlCYKCPI.mjs";
import { m as maybeRenderHead, o as renderComponent, p as renderTemplate } from "./server_Ciq-jqkO.mjs";
import { O as createAstro, T as products, _ as getDict, b as productCategoryName, d as productCategoryNameLocalized, i as formatDateIso, k as createComponent, p as productShortDescription, r as cx, t as $$BaseLayout } from "./BaseLayout_BpPz4rCZ.mjs";
import { t as rankProducts } from "./ranking_CsDXrXF_.mjs";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Filter, Search, ShieldCheck } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/islands/LaunchesExplorer.tsx
var PAGE_SIZE = 8;
function VerificationBadge({ status, isDemo, locale }) {
	const cfg = {
		verified: {
			label: locale === "en" ? "Verified" : "Verified",
			cls: "border-success/30 bg-success/10 text-success"
		},
		pending: {
			label: locale === "en" ? "Pending" : "Pending",
			cls: "border-warning/30 bg-warning/10 text-warning"
		},
		unverified: {
			label: locale === "en" ? "Unverified" : "Unverified",
			cls: "border-border-strong bg-secondary/60 text-muted-foreground"
		}
	}[status];
	return /* @__PURE__ */ jsxs("span", {
		className: "inline-flex items-center gap-1.5",
		children: [isDemo && /* @__PURE__ */ jsx("span", {
			className: "badge border-border-strong bg-secondary text-muted-foreground",
			children: locale === "en" ? "Demo data" : "演示数据"
		}), /* @__PURE__ */ jsxs("span", {
			className: cx("badge inline-flex items-center gap-1", cfg.cls),
			children: [status === "verified" && /* @__PURE__ */ jsx(ShieldCheck, {
				className: "h-3 w-3",
				"aria-hidden": "true"
			}), cfg.label]
		})]
	});
}
function LaunchesExplorer({ products, locale = "zh" }) {
	getDict(locale);
	const ranked = useMemo(() => rankProducts(products), [products]);
	const categories = useMemo(() => {
		const set = new Set(products.map((p) => p.category));
		return Array.from(set);
	}, [products]);
	const [community, setCommunity] = useState([]);
	useEffect(() => {
		fetch("https://api.github.com/repos/SolYoung-Ai/solhub/issues?state=open&per_page=50").then((r) => r.json()).then((issues) => {
			if (!Array.isArray(issues)) return;
			const items = issues.filter((i) => !i.pull_request).map((i) => {
				const body = i.body || "";
				const nameMatch = body.match(/产品提交[：:]\s*([^\n]+)/);
				const urlMatch = body.match(/(?:官网\s*URL|网站|网址|URL|链接)[：:]\s*(https?:\/\/[^\s<]+)/i);
				const iconMatch = body.match(/(?:图标|Icon)[：:]\s*(https?:\/\/[^\s<]+)/i);
				const descMatch = body.match(/(?:一句话介绍|描述|介绍|Description)[：:]\s*([^\n]+)/i);
				return {
					id: i.number,
					name: nameMatch ? nameMatch[1].trim() : i.title.replace(/^\[SolHub\]\s*产品提交[：:]\s*/, ""),
					url: urlMatch ? urlMatch[1] : "",
					icon: iconMatch ? iconMatch[1] : void 0,
					description: descMatch ? descMatch[1].trim() : "",
					createdAt: i.created_at?.slice(0, 10) || ""
				};
			});
			setCommunity(items);
		}).catch(() => {});
	}, []);
	const [category, setCategory] = useState("all");
	const [sort, setSort] = useState("ranked");
	const [query, setQuery] = useState("");
	const [visible, setVisible] = useState(PAGE_SIZE);
	const filtered = useMemo(() => {
		let list = ranked;
		if (category !== "all") list = list.filter((p) => p.category === category);
		if (query.trim()) {
			const q = query.trim().toLowerCase();
			list = list.filter((p) => p.name.toLowerCase().includes(q) || productShortDescription(p.slug, p.shortDescription, locale).toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)));
		}
		if (sort === "newest") list = [...list].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
		return list;
	}, [
		ranked,
		category,
		query,
		sort,
		locale
	]);
	const shown = filtered.slice(0, visible);
	const rankOf = (p) => ranked.findIndex((r) => r.id === p.id) + 1;
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "flex flex-col gap-3",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground",
						children: [/* @__PURE__ */ jsx(Filter, {
							className: "h-3.5 w-3.5",
							"aria-hidden": "true"
						}), locale === "en" ? "Category" : "分类"]
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setCategory("all"),
						className: cx("rounded-[2px] border px-2.5 py-1 text-xs font-medium transition-colors", category === "all" ? "border-foreground bg-foreground text-background" : "border-border bg-card text-foreground/70 hover:border-foreground/40"),
						children: locale === "en" ? "All" : "全部"
					}),
					categories.map((c) => /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setCategory(c),
						className: cx("rounded-[2px] border px-2.5 py-1 text-xs font-medium transition-colors", category === c ? "border-foreground bg-foreground text-background" : "border-border bg-card text-foreground/70 hover:border-foreground/40"),
						children: productCategoryNameLocalized(c, productCategoryName(c), locale)
					}, c))
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative w-full sm:max-w-xs",
					children: [/* @__PURE__ */ jsx(Search, {
						className: "pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground",
						"aria-hidden": "true"
					}), /* @__PURE__ */ jsx("input", {
						type: "search",
						value: query,
						onChange: (e) => {
							setQuery(e.target.value);
							setVisible(PAGE_SIZE);
						},
						placeholder: locale === "en" ? "Search by name, description or tag…" : "搜索产品名称、介绍或标签…",
						className: "input !pl-8",
						"aria-label": locale === "en" ? "Search products" : "搜索产品"
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-xs text-muted-foreground",
						children: locale === "en" ? "Sort" : "排序"
					}), /* @__PURE__ */ jsx("div", {
						className: "inline-flex rounded-[2px] border border-border bg-card p-0.5",
						role: "group",
						"aria-label": locale === "en" ? "Sort order" : "排序方式",
						children: [["ranked", locale === "en" ? "Ranked" : "榜单顺序"], ["newest", locale === "en" ? "Newest" : "最新收录"]].map(([key, label]) => /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setSort(key),
							"aria-pressed": sort === key,
							className: cx("rounded-[2px] px-2.5 py-1 text-xs font-medium transition-colors", sort === key ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"),
							children: label
						}, key))
					})]
				})]
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mt-6",
			children: [shown.length === 0 && /* @__PURE__ */ jsxs("div", {
				className: "card p-10 text-center",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-sm text-foreground/70",
					children: locale === "en" ? "No products match your criteria." : "没有符合条件的产品。"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: locale === "en" ? "Try adjusting the category, keywords or sort order." : "试试调整分类、关键词或排序方式。"
				})]
			}), /* @__PURE__ */ jsxs("ul", {
				className: "divide-y divide-border rounded-[3px] border border-border bg-card",
				children: [shown.map((product) => {
					const rank = sort === "ranked" ? rankOf(product) : null;
					return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", {
						href: p(`/products/${product.slug}/`, locale),
						className: "group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-secondary/40 sm:px-5",
						children: [
							rank !== null && /* @__PURE__ */ jsxs("span", {
								className: cx("font-display w-7 shrink-0 text-center text-base font-bold", rank === 1 ? "text-accent" : rank === 2 ? "text-foreground/80" : "text-muted-foreground/50"),
								"aria-label": `${locale === "en" ? "Rank" : "第"} ${rank} ${locale === "en" ? "" : "名"}`,
								children: ["#", rank]
							}),
							product.icon ? /* @__PURE__ */ jsx("img", {
								src: product.icon,
								alt: "",
								loading: "lazy",
								className: "h-10 w-10 shrink-0 rounded-[3px] border border-border bg-card object-cover"
							}) : /* @__PURE__ */ jsx("span", {
								className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-[3px] border border-border bg-secondary font-display text-sm font-bold text-foreground/70",
								"aria-hidden": "true",
								children: product.name.slice(0, 2).toUpperCase()
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ jsxs("span", {
										className: "flex flex-wrap items-center gap-x-2 gap-y-1",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "font-display text-[15px] font-bold text-foreground group-hover:text-accent",
												children: product.name
											}),
											/* @__PURE__ */ jsx("span", {
												className: "badge border-border-strong bg-secondary/60 text-muted-foreground",
												children: productCategoryNameLocalized(product.category, productCategoryName(product.category), locale)
											}),
											/* @__PURE__ */ jsx(VerificationBadge, {
												status: product.verificationStatus,
												isDemo: product.isDemo,
												locale
											})
										]
									}),
									/* @__PURE__ */ jsx("span", {
										className: "mt-0.5 block truncate text-[13px] text-muted-foreground",
										children: productShortDescription(product.slug, product.shortDescription, locale)
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "font-medium text-foreground/60",
												children: productCategoryNameLocalized(product.category, productCategoryName(product.category), locale)
											}),
											product.tags.slice(0, 3).map((t) => /* @__PURE__ */ jsxs("span", { children: ["#", t] }, t)),
											/* @__PURE__ */ jsx("span", { children: locale === "en" ? `Added ${formatDateIso(product.publishedAt)}` : `收录于 ${formatDateIso(product.publishedAt)}` })
										]
									})
								]
							}),
							/* @__PURE__ */ jsx(ArrowRight, {
								className: "h-4 w-4 shrink-0 text-muted-foreground/50 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-accent",
								"aria-hidden": "true"
							})
						]
					}) }, product.id);
				}), community.map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", {
					href: p(`/products/c-${item.id}/`, locale),
					className: "group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-secondary/40 sm:px-5",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "font-display w-7 shrink-0 text-center text-base text-muted-foreground/40",
							children: "·"
						}),
						item.icon ? /* @__PURE__ */ jsx("img", {
							src: item.icon,
							alt: "",
							loading: "lazy",
							className: "h-10 w-10 shrink-0 rounded-[3px] border border-border bg-card object-cover"
						}) : /* @__PURE__ */ jsx("span", {
							className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-[3px] border border-border bg-secondary font-display text-sm font-bold text-foreground/70",
							"aria-hidden": "true",
							children: item.name.slice(0, 2).toUpperCase()
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ jsxs("span", {
									className: "flex flex-wrap items-center gap-x-2 gap-y-1",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-display text-[15px] font-bold text-foreground group-hover:text-accent",
										children: item.name
									}), /* @__PURE__ */ jsx("span", {
										className: "badge border-accent/30 bg-accent/10 text-accent",
										children: locale === "en" ? "Community" : "社区"
									})]
								}),
								item.description && /* @__PURE__ */ jsx("span", {
									className: "mt-0.5 block truncate text-[13px] text-muted-foreground",
									children: item.description
								}),
								/* @__PURE__ */ jsx("span", {
									className: "mt-1.5 text-[11px] text-muted-foreground",
									children: locale === "en" ? `Submitted ${item.createdAt}` : `提交于 ${item.createdAt}`
								})
							]
						}),
						/* @__PURE__ */ jsx(ArrowRight, {
							className: "h-4 w-4 shrink-0 text-muted-foreground/50 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-accent",
							"aria-hidden": "true"
						})
					]
				}) }, `community-${item.id}`))]
			})]
		}),
		visible < filtered.length && /* @__PURE__ */ jsx("div", {
			className: "mt-6 text-center",
			children: /* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => setVisible((v) => v + PAGE_SIZE),
				className: "btn btn-outline",
				children: locale === "en" ? `Load more (${filtered.length - visible})` : `加载更多（${filtered.length - visible}）`
			})
		}),
		/* @__PURE__ */ jsx("p", {
			className: "mt-4 text-center text-xs text-muted-foreground",
			children: locale === "en" ? `${filtered.length} products · verification reflects actual SolHub checks; demo data is clearly marked` : `共 ${filtered.length} 个产品 · 核验状态以 SolHub 实际核验为准，演示数据已明确标记`
		})
	] });
}
//#endregion
//#region src/pages/launches.astro
var launches_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Launches,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://solyoung.top");
var $$Launches = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Launches;
	const locale = Astro.props.locale ?? "zh";
	const en = locale === "en";
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": en ? "Product Launches" : "近期产品榜单",
		"description": en ? "SolHub launches: browse what indie developers are building, filter by category, sort by newest, with transparent verification status." : "SolHub 近期产品榜单：浏览独立开发者正在创造的产品，按分类筛选、按最新收录排序，核验状态透明可解释。",
		"route": "/launches/",
		"locale": locale
	}, { "default": ($$result) => renderTemplate` ${maybeRenderHead($$result)}<section class="border-b border-border bg-secondary/30 py-6 sm:py-8"> <div class="container-page"> <div class="flex flex-wrap items-center gap-2"> <h1 class="font-display text-xl font-extrabold tracking-tight text-foreground sm:text-2xl"> ${en ? "Product Launches" : "近期产品榜单"} </h1> <span class="rounded-full border border-border bg-card px-2.5 py-0.5 text-[11px] text-muted-foreground"> ${en ? "Verified first" : "核验优先"} </span> <span class="rounded-full border border-border bg-card px-2.5 py-0.5 text-[11px] text-muted-foreground"> ${en ? "Human curated" : "人工精选"} </span> <span class="rounded-full border border-border bg-card px-2.5 py-0.5 text-[11px] text-muted-foreground"> ${en ? "No paid rankings" : "不购买排名"} </span> </div> </div> </section> <section class="py-8 sm:py-12"> <div class="container-page"> ${renderComponent($$result, "LaunchesExplorer", LaunchesExplorer, {
		"client:load": true,
		"products": products,
		"locale": locale,
		"client:component-hydration": "load",
		"client:component-path": "@/islands/LaunchesExplorer.tsx",
		"client:component-export": "default"
	})} </div> </section> ` })}`;
}, "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/pages/launches.astro", void 0);
var $$file = "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/pages/launches.astro";
var $$url = "/solhub/launches/";
//#endregion
export { launches_exports as n, $$Launches as t };
