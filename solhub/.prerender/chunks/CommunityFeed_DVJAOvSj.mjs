import { r as p } from "./paths_BlCYKCPI.mjs";
import { D as submissionConfig, o as getLocale, s as isValidHttpUrl } from "./BaseLayout_BpPz4rCZ.mjs";
import { useEffect, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/islands/CommunityFeed.tsx
/** 解析 Issue body 提取产品字段 */
function parseIssueBody(body) {
	if (!body) return {};
	const map = {};
	const lines = body.split("\n");
	let currentKey = "";
	let currentVal = "";
	for (const line of lines) {
		const m = line.match(/^\*\*(.+?)\*\*：\s*(.*)$/);
		if (m) {
			if (currentKey) map[currentKey] = currentVal.trim();
			currentKey = m[1].trim();
			currentVal = m[2];
		} else if (currentKey && !line.startsWith("##") && !line.startsWith("---") && !line.startsWith("由 SolHub")) currentVal += "\n" + line;
	}
	if (currentKey) map[currentKey] = currentVal.trim();
	return map;
}
function fetchIssues(kind, limit = 8) {
	const repo = submissionConfig.githubIssueRepo;
	if (!repo) return Promise.resolve([]);
	const url = `https://api.github.com/repos/${repo}/issues?labels=submission&state=open&per_page=${Math.min(limit, 30)}`;
	return fetch(url, { headers: { Accept: "application/vnd.github+json" } }).then((r) => r.ok ? r.json() : []).then((data) => Array.isArray(data) ? data : []);
}
/** 映射到 UI 用的 item 结构 */
function issueToItem(issue) {
	const f = parseIssueBody(issue.body);
	return {
		id: `gh-${issue.number}`,
		name: f["产品提交"] || issue.title.replace(/^\[SolHub\]\s*产品提交：/, ""),
		shortDescription: f["一句话介绍"] || "",
		description: f["详细描述"] || "",
		url: f["官网 URL"] || issue.html_url,
		iconUrl: f["图标 URL"] || "",
		developer: f["开发者 / 团队"] || issue.user?.login || "",
		kind: "product",
		toolType: "external",
		createdAt: issue.created_at,
		issueUrl: issue.html_url
	};
}
/**
* 社区提交动态区（客户端渲染，从 GitHub Issues 读取）。
*/
function CommunityFeed({ kind, limit = 8, title, showMore = true, locale }) {
	const lc = locale ?? getLocale();
	const en = lc === "en";
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		fetchIssues(kind, limit).then((issues) => {
			if (cancelled) return;
			setRows(issues.map(issueToItem));
		}).finally(() => {
			if (!cancelled) setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [kind, limit]);
	if (loading) return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground",
		children: [/* @__PURE__ */ jsx(Loader2, {
			className: "h-4 w-4 animate-spin",
			"aria-hidden": "true"
		}), en ? "Loading community submissions…" : "正在加载社区提交…"]
	});
	if (rows.length === 0) return null;
	return /* @__PURE__ */ jsxs("section", {
		"aria-label": en ? "Community submissions" : "社区提交",
		className: "mt-12",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "mb-4 flex items-end justify-between gap-4",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-lg font-bold text-foreground",
					children: title ?? (kind === "tool" ? en ? "Community tools" : "社区工具" : en ? "Community submissions" : "社区提交")
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-0.5 text-[13px] text-muted-foreground",
					children: en ? "Submitted via GitHub Issues · curated by SolHub" : "通过 GitHub Issues 提交 · 由 SolHub 人工精选"
				})] })
			}),
			/* @__PURE__ */ jsx("ul", {
				className: "grid gap-3 sm:grid-cols-2",
				children: rows.map((item) => /* @__PURE__ */ jsx("li", {
					className: "card p-4",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-start gap-3",
						children: [item.iconUrl && isValidHttpUrl(item.iconUrl) ? /* @__PURE__ */ jsx("img", {
							src: item.iconUrl,
							alt: "",
							loading: "lazy",
							className: "h-10 w-10 shrink-0 rounded-[3px] border border-border object-cover",
							referrerPolicy: "no-referrer"
						}) : /* @__PURE__ */ jsx("span", {
							className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-[3px] border border-border bg-secondary text-sm font-bold text-accent",
							children: item.name.trim().charAt(0).toUpperCase()
						}), /* @__PURE__ */ jsxs("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ jsx("a", {
										href: item.issueUrl,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "truncate text-sm font-bold text-foreground hover:text-accent hover:underline underline-offset-2",
										children: item.name
									}), /* @__PURE__ */ jsx("span", {
										className: "shrink-0 rounded-sm border border-border bg-secondary/60 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground",
										children: en ? "Product" : "产品"
									})]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 line-clamp-2 text-[13px] leading-5 text-muted-foreground",
									children: item.shortDescription || item.description
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-2.5 flex items-center gap-2",
									children: [item.url && isValidHttpUrl(item.url) && item.url !== item.issueUrl ? /* @__PURE__ */ jsxs("a", {
										href: item.url,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "btn btn-outline !h-7 gap-1.5 px-3 text-xs",
										children: [
											en ? "Visit" : "访问",
											" ",
											/* @__PURE__ */ jsx(ExternalLink, {
												className: "h-3 w-3",
												"aria-hidden": "true"
											})
										]
									}) : /* @__PURE__ */ jsxs("a", {
										href: item.issueUrl,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "btn btn-outline !h-7 gap-1.5 px-3 text-xs",
										children: [
											en ? "View on GitHub" : "GitHub 查看",
											" ",
											/* @__PURE__ */ jsx(ExternalLink, {
												className: "h-3 w-3",
												"aria-hidden": "true"
											})
										]
									}), item.developer && /* @__PURE__ */ jsxs("span", {
										className: "truncate text-[11px] text-muted-foreground",
										children: ["by ", item.developer]
									})]
								})
							]
						})]
					})
				}, item.id))
			}),
			showMore && /* @__PURE__ */ jsxs("p", {
				className: "mt-4 text-[13px] text-muted-foreground",
				children: [
					en ? `Showing the latest ${rows.length} submissions. Want on the list? ` : `展示最近 ${rows.length} 条社区提交。想要上榜？去 `,
					/* @__PURE__ */ jsx("a", {
						href: p("/submit/", lc),
						className: "text-accent underline-offset-2 hover:underline",
						children: en ? "Submit your product / tool" : "提交你的产品 / 工具"
					}),
					en ? "." : "。"
				]
			})
		]
	});
}
//#endregion
export { CommunityFeed as t };
