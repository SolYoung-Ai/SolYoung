import { a as __exportAll, r as p } from "./paths_BlCYKCPI.mjs";
import { m as maybeRenderHead, o as renderComponent, p as renderTemplate } from "./server_Ciq-jqkO.mjs";
import { D as submissionConfig, O as createAstro, _ as getDict, d as productCategoryNameLocalized, k as createComponent, s as isValidHttpUrl, t as $$BaseLayout, y as productCategories } from "./BaseLayout_BpPz4rCZ.mjs";
import { i as Message } from "./tool-ui_DR0XRhbO.mjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Download, ExternalLink, FileCode2, Globe2, Loader2, Package, ShieldAlert, UploadCloud } from "lucide-react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/lib/submission.ts
var LOCAL_DRAFT_KEY = "solhub:submission-drafts";
function getAvailableModes() {
	return {
		remote: Boolean(submissionConfig.remoteEndpoint),
		githubRepo: submissionConfig.githubIssueRepo ?? null
	};
}
function buildIssueBody(sub) {
	const f = sub.productFields;
	return [
		`## 产品提交：${f.name}`,
		"",
		`**一句话介绍**：${f.shortDescription}`,
		"",
		`**详细描述**：`,
		f.description,
		"",
		`**官网 URL**：${f.websiteUrl}`,
		`**分类**：${f.category}`,
		`**标签**：${f.tags.join(", ")}`,
		f.iconUrl ? `**图标 URL**：${f.iconUrl}` : "",
		`**开发者 / 团队**：${f.developerName}`,
		f.contact ? `**联系方式**：${f.contact}` : "",
		f.launchBatch ? `**发布批次**：${f.launchBatch}` : "",
		"",
		`---`,
		`由 SolHub 投稿表单生成 · ${sub.createdAt}`
	].filter((l) => l !== "").join("\n");
}
function buildIssueUrl(repo, sub) {
	const body = encodeURIComponent(buildIssueBody(sub));
	return `https://github.com/${repo}/issues/new?title=${encodeURIComponent(`[SolHub] 产品提交：${sub.productFields.name}`)}&body=${body}&labels=submission`;
}
async function submitSubmission(sub) {
	const { remote, githubRepo } = getAvailableModes();
	if (remote && submissionConfig.remoteEndpoint) try {
		const res = await fetch(submissionConfig.remoteEndpoint, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(sub)
		});
		if (!res.ok) return {
			ok: false,
			mode: "remote",
			message: `远程接口返回错误（${res.status}）。你的内容没有被提交，请稍后重试或改用本地草稿。`
		};
		return {
			ok: true,
			mode: "remote",
			message: "已提交到远程接口，等待管理员核验。"
		};
	} catch {
		return {
			ok: false,
			mode: "remote",
			message: "网络错误：无法连接远程提交接口。你的内容没有被提交，请稍后重试。"
		};
	}
	if (githubRepo) return {
		ok: true,
		mode: "github-issue",
		message: "已生成 GitHub Issue 预填链接。点击下方按钮在新标签页完成提交。",
		url: buildIssueUrl(githubRepo, sub)
	};
	try {
		const drafts = readLocalDrafts();
		drafts.push(sub);
		localStorage.setItem(LOCAL_DRAFT_KEY, JSON.stringify(drafts));
		return {
			ok: true,
			mode: "local-draft",
			message: "已保存为本地草稿。草稿只保存在当前浏览器，不会公开给其他访问者；可导出 JSON 备份或复制内容自行提交。",
			data: sub
		};
	} catch {
		return {
			ok: false,
			mode: "local-draft",
			message: "保存本地草稿失败（浏览器可能禁用了本地存储）。可复制下方内容自行保存。",
			data: sub
		};
	}
}
function readLocalDrafts() {
	try {
		const raw = localStorage.getItem(LOCAL_DRAFT_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
function exportSubmissionJson(sub) {
	return JSON.stringify(sub, null, 2);
}
//#endregion
//#region src/lib/cloudbase.ts
var ENV_ID = "solyoung-d4gpp1f7s4e075f6d";
var PUBLISHABLE_KEY = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjdhMWU4NzFjLTJjNzMtNDY4Yy04OTQ5LTVlMjMyNDFjM2MxNyJ9.eyJpc3MiOiJodHRwczovL3NvbHlvdW5nLWQ0Z3BwMWY3czRlMDc1ZjZkLmFwLXNoYW5naGFpLnRjYi1hcGkudGVuY2VudGNsb3VkYXBpLmNvbSIsInN1YiI6ImFub24iLCJhdWQiOiJzb2x5b3VuZy1kNGdwcDFmN3M0ZTA3NWY2ZCIsImV4cCI6NDA5NTgyMjQ2MywiaWF0IjoxNzkyMTM5MjYzLCJub25jZSI6IjNKMmNFOXJKUkZXMllOSF9MbkIyMUEiLCJhdF9oYXNoIjoiM0oyY0U5ckpSRlcyWU5IX0xuQjIxQSIsIm5hbWUiOiJBbm9ueW1vdXMiLCJzY29wZSI6ImFub255bW91cyIsInByb2plY3RfaWQiOiJzb2x5b3VuZy1kNGdwcDFmN3M0ZTA3NWY2ZCIsIm1ldGEiOnsicGxhdGZvcm0iOiJQdWJsaXNoYWJsZUtleSJ9LCJyb2xlIjoiYW5vbiIsImlzX2Fub255bW91cyI6dHJ1ZSwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiYW5vbnltb3VzIiwicHJvdmlkZXJzIjpbImFub255bW91cyJdfSwidXNlcl9tZXRhZGF0YSI6eyJuYW1lIjoiQW5vbnltb3VzIn0sInVzZXJfdHlwZSI6IiIsImNsaWVudF90eXBlIjoiY2xpZW50X3VzZXIiLCJpc19zeXN0ZW1fYWRtaW4iOmZhbHNlfQ.Xeks40kq-23Qryw8_XNQbtQOIIP-NmirzVl3ynZ9VhorEdoXL_BjHZpBxXwYsSA7MufdoM14XH9zAxMF031471IbMcyAp5SxYpZ6V0Q3pbvVovyK0ndirDV2C4PFdrhNNHaAKiIFSsKuV-uwcm9FJKRR-KoMK8GSuTImUN7GALieYx3AtBv84hhM-ODw9raRp5oLgcqe5CSLqw6fj2BcEhk78i5EJ5nqdF_i4ESk3ff5t-k4klpalyYVIaK9GUwXWhg6H8r4JYnku8N2AjYzVUq4_pLz9s3EtHMTYn7lYu4H8jK-SqkC86EQKlbGSPYmKqjqkISdqWpkuNUC--BWNA";
function isCloudBaseConfigured() {
	return Boolean(PUBLISHABLE_KEY);
}
/** 懒加载并返回 { app, db }；仅在浏览器端且已配置时可用。带 10 秒超时，防止 SDK init 挂起。 */
async function getClient() {
	if (typeof window === "undefined" || !isCloudBaseConfigured()) return null;
	try {
		const app = (await Promise.race([import("@cloudbase/js-sdk"), new Promise((_, reject) => setTimeout(() => reject(/* @__PURE__ */ new Error("CloudBase SDK init timeout")), 1e4))])).init({
			env: ENV_ID,
			accessKey: PUBLISHABLE_KEY,
			auth: { detectSessionInUrl: true }
		});
		return {
			app,
			db: app.rdb()
		};
	} catch (e) {
		console.error("[SolHub] getClient failed", e);
		return null;
	}
}
/** 提交到 CloudBase（匿名 anon 身份；status 由数据库 DEFAULT 为 approved 并受 RLS 强制）。 */
async function submitToCloudbase(payload) {
	const client = await getClient();
	if (!client) return {
		ok: false,
		message: "无法连接 CloudBase（初始化超时或网络不可达），请稍后重试。"
	};
	try {
		const insertPayload = {
			kind: payload.kind,
			name: payload.name.trim(),
			tags: payload.tags && payload.tags.length ? payload.tags : []
		};
		if (payload.short_description) insertPayload.short_description = payload.short_description.trim();
		if (payload.description) insertPayload.description = payload.description.trim();
		if (payload.url) insertPayload.url = payload.url.trim();
		if (payload.category) insertPayload.category = payload.category;
		if (payload.icon_url) insertPayload.icon_url = payload.icon_url.trim();
		if (payload.developer) insertPayload.developer = payload.developer.trim();
		if (payload.contact) insertPayload.contact = payload.contact.trim();
		if (payload.tool_type) insertPayload.tool_type = payload.tool_type;
		if (payload.hosted_key) insertPayload.hosted_key = payload.hosted_key;
		const { data, error } = await client.db.from("submissions").insert(insertPayload).select();
		if (error) {
			console.error("[SolHub] submitToCloudbase error", error);
			const msg = String(error?.message ?? error);
			if (/duplicate|violates|constraint/i.test(msg)) return {
				ok: false,
				message: "提交被数据库拒绝：请检查必填字段（名称、链接格式、长度限制）。"
			};
			return {
				ok: false,
				message: `提交失败：${msg}`
			};
		}
		return {
			ok: true,
			message: "提交成功，已自动公开到 SolHub 社区列表。",
			row: Array.isArray(data) && data[0]
		};
	} catch (e) {
		console.error("[SolHub] submitToCloudbase failed", e);
		return {
			ok: false,
			message: "网络错误：无法连接 CloudBase，请稍后重试。"
		};
	}
}
/** 上传托管工具 HTML 到 pgstore 桶；返回存储 key。 */
async function uploadHostedTool(file, slug) {
	const client = await getClient();
	if (!client) return {
		ok: false,
		message: "CloudBase 未配置，无法上传。"
	};
	if (file.size > 1048576) return {
		ok: false,
		message: "HTML 文件不能超过 1MB。"
	};
	if (!/^text\/html|\.html$/i.test(file.type || file.name)) return {
		ok: false,
		message: "仅支持 HTML 文件（自包含工具页面）。"
	};
	const key = `hosted/${Date.now().toString(36)}-${slug.replace(/[^a-z0-9-]/gi, "").slice(0, 40) || "tool"}.html`;
	try {
		const { error } = await client.app.storage.from("solhub-tools").upload(key, file, { contentType: "text/html" });
		if (error) {
			console.error("[SolHub] uploadHostedTool error", error);
			return {
				ok: false,
				message: `上传失败：${String(error?.message ?? error)}`
			};
		}
		return {
			ok: true,
			key
		};
	} catch (e) {
		console.error("[SolHub] uploadHostedTool failed", e);
		return {
			ok: false,
			message: "上传失败：网络错误，请稍后重试。"
		};
	}
}
//#endregion
//#region src/islands/SubmitForm.tsx
var initial = {
	kind: "product",
	toolType: "external",
	name: "",
	websiteUrl: "",
	shortDescription: "",
	description: "",
	category: "ai-tools",
	tags: "",
	iconUrl: "",
	developerName: "",
	contact: ""
};
function SubmitForm({ locale = "zh" }) {
	getDict(locale);
	const en = locale === "en";
	const [form, setForm] = useState(initial);
	const [hostedFile, setHostedFile] = useState(null);
	const [errors, setErrors] = useState({});
	const [showPreview, setShowPreview] = useState(false);
	const [status, setStatus] = useState("idle");
	const [result, setResult] = useState(null);
	const [draftJson, setDraftJson] = useState("");
	const fileInputRef = useRef(null);
	const cloudbaseReady = useMemo(() => isCloudBaseConfigured(), []);
	const githubRepo = submissionConfig.githubIssueRepo ?? null;
	const modes = useMemo(() => {
		return {
			remote: Boolean(submissionConfig.remoteEndpoint),
			githubRepo: submissionConfig.githubIssueRepo ?? null
		};
	}, []);
	const apiBase = "https://solhub-auth.solyoungwork.workers.dev";
	const [authedUser, setAuthedUser] = useState(null);
	const [checkingAuth, setCheckingAuth] = useState(true);
	useEffect(() => {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), 3e3);
		fetch(`${apiBase}/me`, {
			credentials: "include",
			signal: controller.signal
		}).then((r) => r.ok ? r.json() : null).then((d) => setAuthedUser(d?.user || { login: "unknown" })).catch(() => setAuthedUser({ login: "unknown" })).finally(() => {
			clearTimeout(timer);
			setCheckingAuth(false);
		});
	}, [apiBase]);
	if (checkingAuth) return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-center gap-2 py-20 text-sm text-muted-foreground",
		children: [/* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }), en ? "Checking login…" : "检查登录状态…"]
	});
	if (!authedUser) return /* @__PURE__ */ jsxs("div", {
		className: "py-16 text-center",
		children: [
			/* @__PURE__ */ jsx(ShieldAlert, { className: "mx-auto h-10 w-10 text-muted-foreground" }),
			/* @__PURE__ */ jsx("h2", {
				className: "mt-4 text-lg font-bold text-foreground",
				children: en ? "Please log in first" : "请先登录"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground",
				children: en ? "You must log in with GitHub to submit a product or tool. This lets you manage your submissions later." : "提交产品或工具需要先登录 GitHub，这样你之后才能在「我的提交」里查看和管理你的记录。"
			}),
			/* @__PURE__ */ jsxs("a", {
				href: `${apiBase}/auth`,
				className: "btn btn-accent mt-6 !h-10 px-6",
				children: ["GitHub ", en ? "Login" : "登录"]
			})
		]
	});
	const set = (key, value) => {
		setForm((f) => ({
			...f,
			[key]: value
		}));
		setErrors((e) => ({
			...e,
			[key]: void 0
		}));
		setStatus("idle");
	};
	const setKind = (kind) => {
		setForm((f) => ({
			...f,
			kind
		}));
		setErrors({});
		setStatus("idle");
	};
	const setToolType = (toolType) => {
		setForm((f) => ({
			...f,
			toolType
		}));
		setErrors({});
		setStatus("idle");
	};
	const isHosted = form.kind === "tool" && form.toolType === "hosted";
	const needsUrl = form.kind === "product" || form.kind === "tool" && form.toolType === "external";
	const validate = () => {
		const e = {};
		if (!form.name.trim()) e.name = en ? "Please enter a name." : "请输入名称。";
		else if (form.name.trim().length > 80) e.name = en ? "Name must be under 80 characters." : "名称请控制在 80 字以内。";
		if (needsUrl) {
			if (!form.websiteUrl.trim()) e.websiteUrl = form.kind === "product" ? en ? "Please enter the product website URL." : "请输入产品官网 URL。" : en ? "Please enter the tool URL." : "请输入工具访问 URL。";
			else if (!isValidHttpUrl(form.websiteUrl.trim())) e.websiteUrl = en ? "URL must start with http:// or https://." : "URL 需以 http:// 或 https:// 开头。";
		} else if (form.websiteUrl.trim() && !isValidHttpUrl(form.websiteUrl.trim())) e.websiteUrl = en ? "URL must start with http:// or https://." : "URL 需以 http:// 或 https:// 开头。";
		if (!form.shortDescription.trim()) e.shortDescription = en ? "Please enter a one-line description." : "请输入一句话介绍。";
		else if (form.shortDescription.trim().length > 200) e.shortDescription = en ? "One-line description must be under 200 characters." : "一句话介绍请控制在 200 字以内。";
		if (!form.description.trim()) e.description = en ? "Please enter a detailed description." : "请输入详细描述。";
		else if (form.description.trim().length > 2e3) e.description = en ? "Detailed description must be under 2000 characters." : "详细描述请控制在 2000 字以内。";
		const tagCount = form.tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean).length;
		if (tagCount === 0) e.tags = en ? "Add at least one tag (comma-separated)." : "至少填写一个标签（用逗号分隔）。";
		else if (tagCount > 8) e.tags = en ? "At most 8 tags." : "标签最多 8 个。";
		if (form.iconUrl.trim() && !isValidHttpUrl(form.iconUrl.trim())) e.iconUrl = en ? "Icon URL must start with http:// or https://." : "图标 URL 需以 http:// 或 https:// 开头。";
		if (!form.developerName.trim()) e.developerName = en ? "Please enter the developer or team name." : "请输入开发者或团队名称。";
		else if (form.developerName.trim().length > 80) e.developerName = en ? "Developer name must be under 80 characters." : "开发者名称请控制在 80 字以内。";
		if (isHosted) {
			if (!hostedFile) e.hostedFile = en ? "Please choose the HTML file to host." : "请选择要托管的 HTML 文件。";
			else if (hostedFile.size > 1048576) e.hostedFile = en ? "HTML file must be under 1MB." : "HTML 文件不能超过 1MB。";
			else if (!/^text\/html|\.html$/i.test(hostedFile.type || hostedFile.name)) e.hostedFile = en ? "Only HTML files are supported (self-contained tool pages)." : "仅支持 HTML 文件（自包含工具页面）。";
		}
		return e;
	};
	const handlePreview = () => {
		const e = validate();
		setErrors(e);
		if (Object.values(e).some(Boolean)) return;
		setShowPreview(true);
	};
	const buildPayload = () => ({
		kind: form.kind,
		name: form.name.trim(),
		short_description: form.shortDescription.trim(),
		description: form.description.trim(),
		url: form.websiteUrl.trim() || void 0,
		category: form.category,
		tags: form.tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean),
		icon_url: form.iconUrl.trim() || void 0,
		developer: form.developerName.trim(),
		contact: form.contact.trim() || void 0,
		tool_type: form.kind === "tool" ? form.toolType : void 0
	});
	const handleSubmit = async () => {
		const e = validate();
		setErrors(e);
		if (Object.values(e).some(Boolean)) return;
		setStatus("submitting");
		setShowPreview(false);
		try {
			let hostedKey;
			if (isHosted && hostedFile) {
				const up = await uploadHostedTool(hostedFile, form.name.trim());
				if (!up.ok || !up.key) {
					setStatus("error");
					setResult({
						mode: "local-draft",
						message: up.message ?? (en ? "Failed to upload the hosted tool." : "上传托管工具失败。")
					});
					return;
				}
				hostedKey = up.key;
			}
			const payload = buildPayload();
			if (hostedKey) payload.hosted_key = hostedKey;
			if (githubRepo) {
				const submission = {
					id: `sub-${Date.now().toString(36)}`,
					productFields: {
						name: form.name.trim(),
						websiteUrl: form.websiteUrl.trim(),
						shortDescription: form.shortDescription.trim(),
						description: form.description.trim(),
						category: form.category,
						tags: form.tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean),
						iconUrl: form.iconUrl.trim() || void 0,
						developerName: form.developerName.trim(),
						contact: form.contact.trim() || void 0
					},
					status: "submitted",
					createdAt: (/* @__PURE__ */ new Date()).toISOString(),
					submissionProvider: "github-issue"
				};
				const r = await submitSubmission(submission);
				setResult({
					mode: r.mode,
					message: r.message,
					url: r.url
				});
				setDraftJson(exportSubmissionJson(submission));
				setStatus("success");
				return;
			}
			if (cloudbaseReady) {
				const r = await submitToCloudbase(payload);
				if (r.ok) {
					setStatus("success");
					setResult({
						mode: "cloudbase",
						message: en ? `Submitted! "${payload.name}" is now publicly listed on the SolHub community page.` : `提交成功！「${payload.name}」已自动公开到 SolHub 社区列表。`
					});
					return;
				}
				setStatus("error");
				setResult({
					mode: "local-draft",
					message: en ? `CloudBase submission failed: ${r.message}` : `CloudBase 提交失败：${r.message}`
				});
				return;
			}
			const submission = {
				id: `sub-${Date.now().toString(36)}`,
				productFields: {
					name: form.name.trim(),
					websiteUrl: form.websiteUrl.trim(),
					shortDescription: form.shortDescription.trim(),
					description: form.description.trim(),
					category: form.category,
					tags: form.tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean),
					iconUrl: form.iconUrl.trim() || void 0,
					developerName: form.developerName.trim(),
					contact: form.contact.trim() || void 0
				},
				status: "submitted",
				createdAt: (/* @__PURE__ */ new Date()).toISOString(),
				submissionProvider: "local-draft"
			};
			const r = await submitSubmission(submission);
			setResult({
				mode: r.mode,
				message: r.message,
				url: r.url
			});
			setDraftJson(exportSubmissionJson(submission));
			setStatus(r.ok ? "success" : "error");
		} catch (err) {
			console.error("[SolHub] handleSubmit unexpected error", err);
			setStatus("error");
			setResult({
				mode: "local-draft",
				message: en ? `Unexpected error: ${err instanceof Error ? err.message : String(err)}. Please retry or export the draft JSON below.` : `提交出现异常：${err instanceof Error ? err.message : String(err)}。请重试，或导出下方 JSON 备份。`
			});
		}
	};
	const modeNote = modes.githubRepo ? en ? "Submissions are collected via GitHub Issues: after you fill the form, a pre-filled Issue link is generated — click it to complete the submission on GitHub. Your product then appears in the SolHub community list." : "提交通过 GitHub Issues 收集：填完表单后会生成预填 Issue 链接，点击后在 GitHub 上完成提交，产品即出现在 SolHub 社区列表。" : cloudbaseReady ? en ? "Connected to the CloudBase database: approved submissions are automatically listed on the SolHub community page — no manual review needed. Hosted tools run in a sandboxed iframe and cannot access the main site's data." : "已接入 CloudBase 实时数据库：提交通过后立即自动公开到 SolHub 社区列表，无需人工审核。托管工具以沙箱 iframe 隔离运行，无法访问主站数据。" : modes.remote ? en ? "A remote submission endpoint is configured: your content will be sent through it." : "已配置远程提交接口：提交内容将通过该接口发送。" : en ? "No remote endpoint or submission repo configured: your content is saved as a local draft (this browser only) with JSON export. Drafts are never published publicly." : "当前未配置远程接口或投稿仓库：提交内容将保存为本地草稿（仅存在于当前浏览器），并提供 JSON 导出。草稿不会自动公开给其他访问者。";
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-start gap-2.5 rounded-[3px] border border-border bg-secondary/40 p-4 text-[13px] leading-6 text-muted-foreground",
				children: [/* @__PURE__ */ jsx(ShieldAlert, {
					className: "mt-0.5 h-4 w-4 shrink-0 text-warning",
					"aria-hidden": "true"
				}), /* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("p", {
						className: "font-semibold text-foreground/80",
						children: en ? "What happens after you submit" : "提交后会发生什么"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1",
						children: modeNote
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1",
						children: en ? "Submissions appear in the SolHub community list (marked “community submission”) without a fake Verified badge; ranked picks are still manually verified before inclusion." : "提交内容会出现在 SolHub 社区列表（标注「社区提交」），不会伪造 Verified 核验状态；榜单精选位仍由人工核验后收录。"
					})
				] })]
			}),
			/* @__PURE__ */ jsxs("div", {
				role: "tablist",
				"aria-label": en ? "Submission type" : "提交类型",
				className: "grid gap-2 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ jsx(TypeTab, {
						active: form.kind === "product",
						onClick: () => setKind("product"),
						icon: /* @__PURE__ */ jsx(Package, {
							className: "h-4 w-4",
							"aria-hidden": "true"
						}),
						title: en ? "Submit a product" : "提交产品",
						desc: en ? "Sites, SaaS, AI tools…" : "网站、SaaS、AI 工具等"
					}),
					/* @__PURE__ */ jsx(TypeTab, {
						active: form.kind === "tool" && form.toolType === "external",
						onClick: () => {
							setKind("tool");
							setToolType("external");
						},
						icon: /* @__PURE__ */ jsx(Globe2, {
							className: "h-4 w-4",
							"aria-hidden": "true"
						}),
						title: en ? "Submit a tool (external)" : "提交工具（外链）",
						desc: en ? "The tool runs on your own site" : "工具在你自己的网站运行"
					}),
					/* @__PURE__ */ jsx(TypeTab, {
						active: form.kind === "tool" && form.toolType === "hosted",
						onClick: () => {
							setKind("tool");
							setToolType("hosted");
						},
						icon: /* @__PURE__ */ jsx(FileCode2, {
							className: "h-4 w-4",
							"aria-hidden": "true"
						}),
						title: en ? "Hosted tool" : "托管工具",
						desc: en ? "Upload HTML, runs in a sandbox here" : "上传 HTML，本站沙箱内运行"
					})
				]
			}),
			/* @__PURE__ */ jsxs("form", {
				className: "space-y-5",
				onSubmit: (e) => {
					e.preventDefault();
					handleSubmit();
				},
				noValidate: true,
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-5 sm:grid-cols-2",
						children: [/* @__PURE__ */ jsx(Field, {
							label: form.kind === "product" ? en ? "Product name" : "产品名称" : en ? "Tool name" : "工具名称",
							required: true,
							error: errors.name,
							children: /* @__PURE__ */ jsx("input", {
								type: "text",
								value: form.name,
								onChange: (e) => set("name", e.target.value),
								placeholder: form.kind === "product" ? en ? "e.g. SolHub" : "例如：SolHub" : en ? "e.g. Markdown editor" : "例如：Markdown 编辑器",
								className: "input",
								"aria-required": "true"
							})
						}), /* @__PURE__ */ jsx(Field, {
							label: needsUrl ? form.kind === "product" ? en ? "Product website URL" : "产品官网 URL" : en ? "Tool URL" : "工具访问 URL" : en ? "Tool page URL" : "工具主页 URL",
							required: needsUrl,
							error: errors.websiteUrl,
							hint: isHosted ? en ? "Optional" : "可选" : void 0,
							children: /* @__PURE__ */ jsx("input", {
								type: "url",
								value: form.websiteUrl,
								onChange: (e) => set("websiteUrl", e.target.value),
								placeholder: "https://example.com",
								className: "input font-mono !text-[13px]",
								"aria-required": needsUrl
							})
						})]
					}),
					isHosted && /* @__PURE__ */ jsxs(Field, {
						label: en ? "Tool HTML file" : "工具 HTML 文件",
						required: true,
						error: errors.hostedFile,
						hint: en ? "≤ 1MB, HTML only" : "≤ 1MB，仅 HTML",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => fileInputRef.current?.click(),
									className: "btn btn-outline !h-10 gap-2 px-4",
									children: [
										/* @__PURE__ */ jsx(UploadCloud, {
											className: "h-4 w-4",
											"aria-hidden": "true"
										}),
										" ",
										en ? "Choose file" : "选择文件"
									]
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-[13px] text-muted-foreground",
									children: hostedFile ? hostedFile.name : en ? "No file chosen" : "未选择文件"
								}),
								/* @__PURE__ */ jsx("input", {
									ref: fileInputRef,
									type: "file",
									accept: ".html,.htm,text/html",
									className: "hidden",
									"aria-label": en ? "Choose HTML tool file" : "选择 HTML 工具文件",
									onChange: (e) => {
										const f = e.target.files?.[0] ?? null;
										setHostedFile(f);
										setErrors((er) => ({
											...er,
											hostedFile: void 0
										}));
										setStatus("idle");
									}
								})
							]
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-2 text-xs leading-5 text-muted-foreground",
							children: en ? "Hosted tools run in a sandboxed iframe: scripts are restricted and the tool cannot access the main site's data or storage. Upload self-contained HTML only (styles and logic in one file, no external resources)." : "托管工具在沙箱 iframe 中运行：脚本受限、无法访问主站数据或存储。请只上传自包含的 HTML 工具（样式与逻辑写在同一个文件里，无需外部资源）。"
						})]
					}),
					/* @__PURE__ */ jsx(Field, {
						label: en ? "One-line description" : "一句话介绍",
						required: true,
						error: errors.shortDescription,
						hint: `${form.shortDescription.length}/200`,
						children: /* @__PURE__ */ jsx("textarea", {
							value: form.shortDescription,
							onChange: (e) => set("shortDescription", e.target.value),
							rows: 2,
							placeholder: en ? "One sentence on what problem it solves." : "用一句话说明它解决什么问题。",
							className: "input resize-y",
							"aria-required": "true"
						})
					}),
					/* @__PURE__ */ jsx(Field, {
						label: en ? "Detailed description" : "详细描述",
						required: true,
						error: errors.description,
						hint: `${form.description.length}/2000`,
						children: /* @__PURE__ */ jsx("textarea", {
							value: form.description,
							onChange: (e) => set("description", e.target.value),
							rows: 5,
							placeholder: en ? "Details: what it is, who it helps, and what makes it special." : "详细介绍：它是什么、为谁解决什么问题、有什么特点。",
							className: "input resize-y",
							"aria-required": "true"
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-5 sm:grid-cols-2",
						children: [/* @__PURE__ */ jsx(Field, {
							label: en ? "Category" : "分类",
							required: true,
							children: /* @__PURE__ */ jsx("select", {
								value: form.category,
								onChange: (e) => set("category", e.target.value),
								className: "input",
								"aria-required": "true",
								children: productCategories.map((c) => /* @__PURE__ */ jsx("option", {
									value: c.slug,
									children: productCategoryNameLocalized(c.slug, c.name, locale)
								}, c.slug))
							})
						}), /* @__PURE__ */ jsx(Field, {
							label: en ? "Tags" : "标签",
							required: true,
							error: errors.tags,
							hint: en ? "comma-separated, max 8" : "用逗号分隔，最多 8 个",
							children: /* @__PURE__ */ jsx("input", {
								type: "text",
								value: form.tags,
								onChange: (e) => set("tags", e.target.value),
								placeholder: "video, ai, free",
								className: "input",
								"aria-required": "true"
							})
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid gap-5 sm:grid-cols-2",
						children: [/* @__PURE__ */ jsx(Field, {
							label: en ? "Icon" : "图标",
							error: errors.iconUrl,
							hint: en ? "Optional — upload or paste URL" : "可选 — 上传或粘贴 URL",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ jsx("input", {
									type: "url",
									value: form.iconUrl,
									onChange: (e) => set("iconUrl", e.target.value),
									placeholder: "https://example.com/icon.png",
									className: "input font-mono !text-[13px] flex-1"
								}), /* @__PURE__ */ jsxs("label", {
									className: "btn btn-outline shrink-0 cursor-pointer !h-9",
									children: [/* @__PURE__ */ jsx(UploadCloud, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("input", {
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: async (e) => {
											const file = e.target.files?.[0];
											if (!file) return;
											const img = new Image();
											const url = URL.createObjectURL(file);
											img.onload = async () => {
												URL.revokeObjectURL(url);
												const canvas = document.createElement("canvas");
												canvas.width = 128;
												canvas.height = 128;
												const ctx = canvas.getContext("2d");
												const min = Math.min(img.width, img.height);
												const sx = (img.width - min) / 2;
												const sy = (img.height - min) / 2;
												ctx.drawImage(img, sx, sy, min, min, 0, 0, 128, 128);
												const dataUrl = canvas.toDataURL("image/png", .85);
												try {
													const d = await (await fetch(`${apiBase}/upload-icon`, {
														method: "POST",
														credentials: "include",
														headers: { "Content-Type": "application/json" },
														body: JSON.stringify({ dataUrl })
													})).json();
													if (d.url) set("iconUrl", d.url);
												} catch {}
											};
											img.src = url;
										}
									})]
								})]
							})
						}), /* @__PURE__ */ jsx(Field, {
							label: en ? "Developer / team name" : "开发者 / 团队名称",
							required: true,
							error: errors.developerName,
							children: /* @__PURE__ */ jsx("input", {
								type: "text",
								value: form.developerName,
								onChange: (e) => set("developerName", e.target.value),
								placeholder: en ? "Your name or team name" : "你的名字或团队名",
								className: "input",
								"aria-required": "true"
							})
						})]
					}),
					/* @__PURE__ */ jsx(Field, {
						label: en ? "Contact" : "联系方式",
						hint: en ? "Optional" : "可选",
						children: /* @__PURE__ */ jsx("input", {
							type: "text",
							value: form.contact,
							onChange: (e) => set("contact", e.target.value),
							placeholder: en ? "Email / WeChat / X handle" : "邮箱 / 微信 / X 账号",
							className: "input"
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-3 border-t border-border pt-5",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: handlePreview,
							className: "btn btn-outline !h-10 px-5",
							children: en ? "Preview submission" : "预览提交内容"
						}), /* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: status === "submitting",
							className: "btn btn-accent !h-10 px-6",
							children: status === "submitting" ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
								/* @__PURE__ */ jsx(Loader2, {
									className: "h-4 w-4 animate-spin",
									"aria-hidden": "true"
								}),
								" ",
								en ? "Submitting…" : "提交中…"
							] }) : form.kind === "product" ? en ? "Submit product" : "提交产品" : isHosted ? en ? "Upload & publish tool" : "上传并公开工具" : en ? "Submit tool" : "提交工具"
						})]
					})
				]
			}),
			showPreview && Object.values(errors).every((v) => !v) && /* @__PURE__ */ jsxs("div", {
				className: "card border-accent/30 p-5",
				children: [/* @__PURE__ */ jsxs("p", {
					className: "mb-3 flex items-center gap-2 text-sm font-bold text-foreground",
					children: [/* @__PURE__ */ jsx(CheckCircle2, {
						className: "h-4 w-4 text-success",
						"aria-hidden": "true"
					}), en ? "Submission preview" : "提交预览"]
				}), /* @__PURE__ */ jsxs("dl", {
					className: "grid gap-x-6 gap-y-2 text-[13px] sm:grid-cols-2",
					children: [
						/* @__PURE__ */ jsx(PreviewRow, {
							label: form.kind === "product" ? en ? "Name" : "名称" : en ? "Tool name" : "工具名",
							value: form.name
						}),
						/* @__PURE__ */ jsx(PreviewRow, {
							label: "URL",
							value: form.websiteUrl || (isHosted ? en ? "(hosted here)" : "（本站托管）" : "")
						}),
						/* @__PURE__ */ jsx(PreviewRow, {
							label: en ? "Category" : "分类",
							value: productCategoryNameLocalized(form.category, productCategories.find((c) => c.slug === form.category)?.name ?? form.category, locale)
						}),
						/* @__PURE__ */ jsx(PreviewRow, {
							label: en ? "Tags" : "标签",
							value: form.tags
						}),
						/* @__PURE__ */ jsx(PreviewRow, {
							label: en ? "Developer" : "开发者",
							value: form.developerName
						}),
						isHosted && /* @__PURE__ */ jsx(PreviewRow, {
							label: en ? "Hosted file" : "托管文件",
							value: hostedFile?.name ?? "—"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ jsx("dt", {
								className: "text-muted-foreground",
								children: en ? "One-line description" : "一句话介绍"
							}), /* @__PURE__ */ jsx("dd", {
								className: "mt-0.5 text-foreground",
								children: form.shortDescription
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ jsx("dt", {
								className: "text-muted-foreground",
								children: en ? "Detailed description" : "详细描述"
							}), /* @__PURE__ */ jsx("dd", {
								className: "mt-0.5 whitespace-pre-line text-foreground",
								children: form.description
							})]
						})
					]
				})]
			}),
			status === "success" && result && /* @__PURE__ */ jsxs("div", {
				className: "card border-success/30 bg-success/5 p-5",
				children: [
					/* @__PURE__ */ jsxs("p", {
						className: "flex items-center gap-2 text-sm font-bold text-success",
						children: [/* @__PURE__ */ jsx(CheckCircle2, {
							className: "h-4 w-4",
							"aria-hidden": "true"
						}), en ? "Submission processed" : "提交已处理"]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 text-[13px] leading-6 text-foreground/75",
						children: result.message
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							result.mode === "cloudbase" && /* @__PURE__ */ jsxs("a", {
								href: p("/launches/", locale),
								className: "btn btn-accent !h-8 px-3 text-xs",
								children: [
									en ? "View community products" : "查看社区产品",
									" ",
									/* @__PURE__ */ jsx(ExternalLink, {
										className: "h-3.5 w-3.5",
										"aria-hidden": "true"
									})
								]
							}),
							result.mode === "github-issue" && result.url && /* @__PURE__ */ jsxs("a", {
								href: result.url,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "btn btn-accent !h-8 px-3 text-xs",
								children: [
									en ? "Complete submission on GitHub" : "在 GitHub 上完成提交",
									" ",
									/* @__PURE__ */ jsx(ExternalLink, {
										className: "h-3.5 w-3.5",
										"aria-hidden": "true"
									})
								]
							}),
							result.mode !== "cloudbase" && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => {
									const blob = new Blob([draftJson], { type: "application/json;charset=utf-8" });
									const url = URL.createObjectURL(blob);
									const a = document.createElement("a");
									a.href = url;
									a.download = `solhub-submission-${Date.now()}.json`;
									a.click();
									setTimeout(() => URL.revokeObjectURL(url), 1e3);
								},
								className: "btn btn-outline !h-8 px-3 text-xs",
								children: [
									/* @__PURE__ */ jsx(Download, {
										className: "h-3.5 w-3.5",
										"aria-hidden": "true"
									}),
									" ",
									en ? "Export JSON" : "导出 JSON"
								]
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => {
									navigator.clipboard?.writeText(draftJson).catch(() => void 0);
								},
								className: "btn btn-ghost !h-8 px-3 text-xs",
								children: en ? "Copy JSON" : "复制 JSON"
							})] })
						]
					}),
					result.mode === "local-draft" && /* @__PURE__ */ jsx("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: en ? "The draft is saved only in this browser and will not appear on SolHub's public pages. Please export the JSON as a backup." : "草稿只保存在当前浏览器，不会出现在 SolHub 公共页面。请务必导出 JSON 备份。"
					})
				]
			}),
			status === "error" && result && /* @__PURE__ */ jsx(Message, {
				tone: "error",
				children: result.message
			})
		]
	});
}
function TypeTab({ active, onClick, icon, title, desc }) {
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		role: "tab",
		"aria-selected": active,
		onClick,
		className: `flex flex-col items-start gap-1 rounded-[3px] border p-3.5 text-left transition-colors ${active ? "border-accent/50 bg-accent/5" : "border-border bg-card hover:border-border-strong"}`,
		children: [/* @__PURE__ */ jsxs("span", {
			className: `flex items-center gap-2 text-sm font-bold ${active ? "text-accent" : "text-foreground"}`,
			children: [icon, title]
		}), /* @__PURE__ */ jsx("span", {
			className: "text-xs text-muted-foreground",
			children: desc
		})]
	});
}
function Field({ label, required, error, hint, children }) {
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "mb-1.5 flex items-baseline justify-between gap-2",
			children: [/* @__PURE__ */ jsxs("label", {
				className: "label !mb-0",
				children: [label, required && /* @__PURE__ */ jsx("span", {
					className: "ml-0.5 text-destructive",
					"aria-hidden": "true",
					children: "*"
				})]
			}), hint && /* @__PURE__ */ jsx("span", {
				className: "text-[11px] text-muted-foreground",
				children: hint
			})]
		}),
		children,
		error && /* @__PURE__ */ jsx("p", {
			className: "mt-1.5 text-xs text-destructive",
			role: "alert",
			children: error
		})
	] });
}
function PreviewRow({ label, value }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("dt", {
		className: "text-muted-foreground",
		children: label
	}), /* @__PURE__ */ jsx("dd", {
		className: "mt-0.5 break-all text-foreground",
		children: value || "—"
	})] });
}
//#endregion
//#region src/pages/submit.astro
var submit_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Submit,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://solyoung.top");
var $$Submit = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Submit;
	const locale = Astro.props.locale ?? "zh";
	const en = locale === "en";
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": en ? "Submit a Product" : "提交产品与工具",
		"description": en ? "Submit your website, software, AI tool or self-contained HTML tool to SolHub. Submissions are auto-published to the community list; hosted tools run in a sandbox." : "把你开发的网站、软件、AI 工具或自包含 HTML 工具提交到 SolHub。提交即自动公开到社区列表；托管工具在沙箱内运行。",
		"route": "/submit/",
		"locale": locale
	}, { "default": ($$result) => renderTemplate` ${maybeRenderHead($$result)}<section class="border-b border-border bg-secondary/30 py-10 sm:py-14"> <div class="container-page"> <p class="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
Launch
</p> <h1 class="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"> ${en ? "Submit Your Product or Tool" : "提交你的产品与工具"} </h1> <p class="mt-3 max-w-2xl text-[15px] leading-7 text-muted-foreground"> ${en ? "If you built a website, app or AI tool, submit it to SolHub so more indie developers and users can find it. Submissions are auto-published to the community list; self-contained HTML tools can be hosted and run in a sandbox here." : "如果你开发了网站、软件或 AI 工具，欢迎提交到 SolHub，让更多独立开发者和使用者发现它。提交即自动公开到社区列表；自包含 HTML 工具可以直接托管，在本站沙箱内运行。"} </p> </div> </section> <section class="py-8 sm:py-12"> <div class="container-page grid gap-10 lg:grid-cols-[1fr_280px]"> <div> ${renderComponent($$result, "SubmitForm", SubmitForm, {
		"client:load": true,
		"locale": locale,
		"client:component-hydration": "load",
		"client:component-path": "@/islands/SubmitForm.tsx",
		"client:component-export": "default"
	})} </div> <aside class="space-y-4"> <div class="card p-5"> <h2 class="text-sm font-bold text-foreground">${en ? "Submission flow" : "提交流程"}</h2> <ol class="mt-3 space-y-3 text-[13px] leading-6 text-muted-foreground"> <li class="flex gap-2.5"> <span class="font-display shrink-0 text-accent">01</span> ${en ? "Fill in the details and preview" : "填写信息并预览"} </li> <li class="flex gap-2.5"> <span class="font-display shrink-0 text-accent">02</span> ${en ? "Choose type: product / external tool / hosted tool" : "选择类型：产品 / 工具外链 / 托管工具"} </li> <li class="flex gap-2.5"> <span class="font-display shrink-0 text-accent">03</span> ${en ? "Submit — auto-published to the community list" : "提交即自动公开到社区列表"} </li> <li class="flex gap-2.5"> <span class="font-display shrink-0 text-accent">04</span> ${en ? "Ranked picks are manually verified by SolHub" : "榜单精选位由 SolHub 人工核验后收录"} </li> </ol> </div> <div class="card p-5"> <h2 class="text-sm font-bold text-foreground">${en ? "Verification & safety" : "核验与安全"}</h2> <p class="mt-2 text-[13px] leading-6 text-muted-foreground"> ${en ? "Community submissions are auto-published but never fake a Verified badge; Verified is granted only to products that pass an actual check. Hosted tools run in a sandboxed iframe — scripts are restricted and the main site's data is out of reach; uploads are limited to self-contained HTML under 1MB." : "社区提交自动公开但不会伪造 Verified 状态；Verified 仅授予实际核验通过的产品。托管工具在沙箱 iframe 中运行：脚本受限、无法访问主站数据；上传仅限 1MB 以内的自包含 HTML 文件。"} </p> </div> </aside> </div> </section> ` })}`;
}, "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/pages/submit.astro", void 0);
var $$file = "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/pages/submit.astro";
var $$url = "/solhub/submit/";
//#endregion
export { submit_exports as n, $$Submit as t };
