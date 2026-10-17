import { a as __exportAll, r as p } from "./paths_BlCYKCPI.mjs";
import { m as maybeRenderHead, o as renderComponent, p as renderTemplate } from "./server_Ciq-jqkO.mjs";
import { O as createAstro, k as createComponent, t as $$BaseLayout } from "./BaseLayout_BpPz4rCZ.mjs";
import { useEffect, useState } from "react";
import { Check, ExternalLink, Link, Loader2, Lock, MapPin, Pencil } from "lucide-react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/islands/MySubmissions.tsx
var apiBase = "https://solhub-auth.solyoungwork.workers.dev";
function parseBody(body) {
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
function MySubmissions({ locale = "zh" }) {
	const en = locale === "en";
	const [issues, setIssues] = useState([]);
	const [loading, setLoading] = useState(true);
	const [notAuthed, setNotAuthed] = useState(false);
	const [editing, setEditing] = useState(null);
	const [editTitle, setEditTitle] = useState("");
	const [editBody, setEditBody] = useState("");
	const [profile, setProfile] = useState(null);
	const [editingProfile, setEditingProfile] = useState(false);
	const [pf, setPf] = useState({
		displayName: "",
		bio: "",
		location: "",
		website: ""
	});
	useEffect(() => {
		fetch(`${apiBase}/me`, {
			credentials: "include",
			cache: "no-store"
		}).then((r) => {
			if (!r.ok) throw new Error("unauthed");
			return r.json();
		}).then((d) => {
			if (d?.user) setProfile(d.user);
		}).catch(() => {
			setNotAuthed(true);
		}).finally(() => setLoading(false));
		fetch(`${apiBase}/my-issues`, {
			credentials: "include",
			cache: "no-store"
		}).then((r) => {
			if (r.status === 401) {
				setNotAuthed(true);
				return [];
			}
			return r.json();
		}).then((data) => setIssues((Array.isArray(data) ? data : []).filter((i) => i.state === "open"))).catch(() => {});
	}, []);
	const startEdit = (issue) => {
		setEditing(issue.number);
		setEditTitle(issue.title);
		setEditBody(issue.body || "");
	};
	const saveEdit = async (number) => {
		await fetch(`${apiBase}/issues/${number}`, {
			method: "PATCH",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				title: editTitle,
				body: editBody
			})
		});
		setEditing(null);
		const r = await fetch(`${apiBase}/my-issues`, { credentials: "include" });
		setIssues(await r.json());
	};
	const closeIssue = async (number) => {
		await fetch(`${apiBase}/issues/${number}/close`, {
			method: "POST",
			credentials: "include"
		});
		setIssues((prev) => prev.filter((i) => i.number !== number));
	};
	if (loading) return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground",
		children: [/* @__PURE__ */ jsx(Loader2, {
			className: "h-4 w-4 animate-spin",
			"aria-hidden": "true"
		}), en ? "Loading…" : "加载中…"]
	});
	if (notAuthed) return /* @__PURE__ */ jsxs("div", {
		className: "py-20 text-center",
		children: [
			/* @__PURE__ */ jsx(Lock, {
				className: "mx-auto h-10 w-10 text-muted-foreground",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: en ? "Please log in with GitHub to view your submissions." : "请用 GitHub 登录后查看你的提交。"
			}),
			/* @__PURE__ */ jsxs("a", {
				href: `${apiBase}/auth`,
				className: "btn btn-accent mt-6 !h-10 px-6",
				children: ["GitHub ", en ? "Login" : "登录"]
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "py-10",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "font-display text-2xl font-bold tracking-tight text-foreground",
				children: en ? "My submissions" : "我的提交"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-1 flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground",
					children: en ? "Manage the products and tools you've submitted to SolHub." : "管理你提交到 SolHub 的产品和工具。"
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [profile?.login && /* @__PURE__ */ jsxs("a", {
						href: `https://github.com/SolYoung-Ai/solhub/issues?q=is%3Aissue+author%3A${encodeURIComponent(profile.login)}`,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "btn btn-outline !h-8 gap-1.5 px-4 text-xs text-muted-foreground hover:text-foreground",
						children: [
							"GitHub ",
							en ? "记录" : "记录",
							" ",
							/* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
						]
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => {
							window.location.href = `${apiBase}/logout?redirect=https://solyoung.top/solhub/`;
						},
						className: "btn btn-outline !h-8 px-4 text-xs text-muted-foreground hover:text-destructive",
						children: en ? "Logout" : "退出登录"
					})]
				})]
			}),
			profile && /* @__PURE__ */ jsx("div", {
				className: "card mt-6 p-5",
				children: !editingProfile ? /* @__PURE__ */ jsxs("div", {
					className: "flex items-start gap-4",
					children: [
						/* @__PURE__ */ jsx("img", {
							src: profile.avatar_url,
							alt: "",
							className: "h-14 w-14 rounded-full border border-border"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("h2", {
										className: "font-display text-lg font-bold text-foreground",
										children: profile.displayName || profile.login
									}), /* @__PURE__ */ jsxs("span", {
										className: "text-xs text-muted-foreground",
										children: ["@", profile.login]
									})]
								}),
								profile.bio && /* @__PURE__ */ jsx("p", {
									className: "mt-1 text-sm text-foreground/70",
									children: profile.bio
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground",
									children: [profile.location && /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1",
										children: [/* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3" }), profile.location]
									}), profile.website && /* @__PURE__ */ jsxs("a", {
										href: profile.website,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "inline-flex items-center gap-1 text-accent hover:underline",
										children: [/* @__PURE__ */ jsx(Link, { className: "h-3 w-3" }), profile.website.replace(/^https?:\/\//, "")]
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("button", {
							onClick: () => {
								setPf({
									displayName: profile.displayName || "",
									bio: profile.bio || "",
									location: profile.location || "",
									website: profile.website || ""
								});
								setEditingProfile(true);
							},
							className: "btn btn-outline !h-8 gap-1.5 px-3 text-xs",
							children: [
								/* @__PURE__ */ jsx(Pencil, { className: "h-3 w-3" }),
								" ",
								en ? "Edit" : "编辑"
							]
						})
					]
				}) : /* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("img", {
								src: profile.avatar_url,
								alt: "",
								className: "h-12 w-12 rounded-full border border-border"
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-xs text-muted-foreground",
								children: ["@", profile.login]
							})]
						}),
						/* @__PURE__ */ jsx("input", {
							value: pf.displayName,
							onChange: (e) => setPf({
								...pf,
								displayName: e.target.value
							}),
							className: "input w-full",
							placeholder: en ? "Display name" : "昵称"
						}),
						/* @__PURE__ */ jsx("textarea", {
							value: pf.bio,
							onChange: (e) => setPf({
								...pf,
								bio: e.target.value
							}),
							rows: 2,
							className: "input w-full resize-y",
							placeholder: en ? "Short bio" : "个人简介"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ jsx("input", {
								value: pf.location,
								onChange: (e) => setPf({
									...pf,
									location: e.target.value
								}),
								className: "input w-full",
								placeholder: en ? "City" : "所在城市"
							}), /* @__PURE__ */ jsx("input", {
								value: pf.website,
								onChange: (e) => setPf({
									...pf,
									website: e.target.value
								}),
								className: "input w-full",
								placeholder: en ? "Website" : "个人网站"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ jsxs("button", {
								onClick: async () => {
									const d = await (await fetch(`${apiBase}/profile`, {
										method: "PUT",
										credentials: "include",
										headers: { "Content-Type": "application/json" },
										body: JSON.stringify(pf)
									})).json();
									setProfile({
										...profile,
										...d
									});
									setEditingProfile(false);
								},
								className: "btn btn-accent !h-8 gap-1.5 px-4 text-xs",
								children: [
									/* @__PURE__ */ jsx(Check, { className: "h-3 w-3" }),
									" ",
									en ? "Save" : "保存"
								]
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setEditingProfile(false),
								className: "btn btn-outline !h-8 px-4 text-xs",
								children: en ? "Cancel" : "取消"
							})]
						})
					]
				})
			}),
			issues.length === 0 ? /* @__PURE__ */ jsxs("p", {
				className: "mt-10 text-center text-sm text-muted-foreground",
				children: [en ? "No submissions yet. " : "还没有提交。", /* @__PURE__ */ jsx("a", {
					href: p("/submit/", locale),
					className: "text-accent underline-offset-2 hover:underline",
					children: en ? "Submit your first product" : "提交第一个产品"
				})]
			}) : /* @__PURE__ */ jsx("ul", {
				className: "mt-6 grid gap-4",
				children: issues.map((issue) => {
					const f = parseBody(issue.body);
					const name = f["产品提交"] || issue.title.replace(/^\[SolHub\]\s*产品提交：/, "");
					const editingThis = editing === issue.number;
					return /* @__PURE__ */ jsx("li", {
						className: "card p-5",
						children: editingThis ? /* @__PURE__ */ jsxs("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ jsx("input", {
									value: editTitle,
									onChange: (e) => setEditTitle(e.target.value),
									className: "input w-full",
									placeholder: "Title"
								}),
								/* @__PURE__ */ jsx("textarea", {
									value: editBody,
									onChange: (e) => setEditBody(e.target.value),
									rows: 8,
									className: "input w-full resize-y"
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ jsx("button", {
										onClick: () => saveEdit(issue.number),
										className: "btn btn-accent !h-8 px-4 text-xs",
										children: en ? "Save" : "保存"
									}), /* @__PURE__ */ jsx("button", {
										onClick: () => setEditing(null),
										className: "btn btn-outline !h-8 px-4 text-xs",
										children: en ? "Cancel" : "取消"
									})]
								})
							]
						}) : /* @__PURE__ */ jsx(Fragment$1, { children: /* @__PURE__ */ jsx("div", {
							className: "flex items-start justify-between gap-3",
							children: /* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("h3", {
											className: "truncate text-sm font-bold text-foreground",
											children: name
										}), /* @__PURE__ */ jsx("span", {
											className: `shrink-0 rounded-sm px-1.5 py-0.5 text-[10px] uppercase ${issue.state === "open" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`,
											children: issue.state === "open" ? en ? "Open" : "公开" : en ? "Closed" : "已关闭"
										})]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1 line-clamp-2 text-[13px] leading-5 text-muted-foreground",
										children: f["一句话介绍"] || f["详细描述"] || ""
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-3 flex flex-wrap gap-2",
										children: [
											f["官网 URL"] && /* @__PURE__ */ jsxs("a", {
												href: f["官网 URL"],
												target: "_blank",
												rel: "noopener noreferrer",
												className: "btn btn-outline !h-7 gap-1.5 px-3 text-xs",
												children: [
													en ? "Visit" : "访问",
													" ",
													/* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
												]
											}),
											/* @__PURE__ */ jsx("a", {
												href: issue.html_url,
												target: "_blank",
												rel: "noopener noreferrer",
												className: "btn btn-ghost !h-7 px-3 text-xs",
												children: "GitHub"
											}),
											/* @__PURE__ */ jsx("button", {
												onClick: () => startEdit(issue),
												className: "btn btn-outline !h-7 px-3 text-xs",
												children: en ? "Edit" : "编辑"
											}),
											/* @__PURE__ */ jsx("button", {
												onClick: () => {
													if (confirm(en ? "Delete this submission?" : "确定删除这条提交？")) closeIssue(issue.number);
												},
												className: "btn btn-outline !h-7 px-3 text-xs text-destructive hover:bg-destructive/10",
												children: en ? "Delete" : "删除"
											})
										]
									})
								]
							})
						}) })
					}, issue.number);
				})
			})
		]
	});
}
//#endregion
//#region src/pages/my-submissions/index.astro
var my_submissions_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://solyoung.top");
var $$Index = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const locale = Astro.props.locale ?? "zh";
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": locale === "en" ? "My submissions · SolHub" : "我的提交 · SolHub",
		"description": locale === "en" ? "Manage your product and tool submissions on SolHub." : "管理你提交到 SolHub 的产品和工具。",
		"route": "/my-submissions/",
		"locale": locale
	}, { "default": ($$result) => renderTemplate` ${maybeRenderHead($$result)}<div class="container-page py-10"> ${renderComponent($$result, "MySubmissions", MySubmissions, {
		"client:load": true,
		"locale": locale,
		"client:component-hydration": "load",
		"client:component-path": "@/islands/MySubmissions.tsx",
		"client:component-export": "default"
	})} </div> ` })}`;
}, "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/pages/my-submissions/index.astro", void 0);
var $$file = "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/pages/my-submissions/index.astro";
var $$url = "/solhub/my-submissions/";
//#endregion
//#region \0virtual:astro:page:src/pages/my-submissions/index@_@astro
var page = () => my_submissions_exports;
//#endregion
export { page };
