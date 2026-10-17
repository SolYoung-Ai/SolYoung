import { i as stripBase, n as baseUrl, r as p, t as absoluteUrl } from "./paths_BlCYKCPI.mjs";
import { C as unescapeHTML, P as InvalidComponentArgs, Q as AstroError, X as UnavailableAstroGlobal, g as addAttribute, h as renderHead, m as maybeRenderHead, o as renderComponent, p as renderTemplate, tt as ASTRO_GENERATOR, u as renderSlot } from "./server_Ciq-jqkO.mjs";
import { useEffect, useRef, useState } from "react";
import { Languages, Menu, Moon, Search, Sun, X } from "lucide-react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/astro/dist/runtime/server/astro-component.js
function validateArgs(args) {
	if (args.length !== 3) return false;
	if (!args[0] || typeof args[0] !== "object") return false;
	return true;
}
function baseCreateComponent(cb, moduleId, propagation) {
	const name = moduleId?.split("/").pop()?.replace(".astro", "") ?? "";
	const fn = (...args) => {
		if (!validateArgs(args)) throw new AstroError({
			...InvalidComponentArgs,
			message: InvalidComponentArgs.message(name)
		});
		return cb(...args);
	};
	Object.defineProperty(fn, "name", {
		value: name,
		writable: false
	});
	fn.isAstroComponentFactory = true;
	fn.moduleId = moduleId;
	fn.propagation = propagation;
	return fn;
}
function createComponentWithOptions(opts) {
	return baseCreateComponent(opts.factory, opts.moduleId, opts.propagation);
}
function createComponent(arg1, moduleId, propagation) {
	if (typeof arg1 === "function") return baseCreateComponent(arg1, moduleId, propagation);
	else return createComponentWithOptions(arg1);
}
//#endregion
//#region node_modules/astro/dist/runtime/server/astro-global.js
function createError(name) {
	return new AstroError({
		...UnavailableAstroGlobal,
		message: UnavailableAstroGlobal.message(name)
	});
}
function createAstro(site) {
	return {
		get site() {
			console.warn(`Astro.site inside getStaticPaths is deprecated and will be removed in a future major version of Astro. Use import.meta.env.SITE instead`);
			return site ? new URL(site) : void 0;
		},
		get generator() {
			console.warn(`Astro.generator inside getStaticPaths is deprecated and will be removed in a future major version of Astro.`);
			return ASTRO_GENERATOR;
		},
		get callAction() {
			throw createError("callAction");
		},
		get clientAddress() {
			throw createError("clientAddress");
		},
		get cookies() {
			throw createError("cookies");
		},
		get csp() {
			throw createError("csp");
		},
		get currentLocale() {
			throw createError("currentLocale");
		},
		get getActionResult() {
			throw createError("getActionResult");
		},
		get isPrerendered() {
			throw createError("isPrerendered");
		},
		get locals() {
			throw createError("locals");
		},
		get originPathname() {
			throw createError("originPathname");
		},
		get params() {
			throw createError("params");
		},
		get preferredLocale() {
			throw createError("preferredLocale");
		},
		get preferredLocaleList() {
			throw createError("preferredLocaleList");
		},
		get props() {
			throw createError("props");
		},
		get redirect() {
			throw createError("redirect");
		},
		get request() {
			throw createError("request");
		},
		get response() {
			throw createError("response");
		},
		get rewrite() {
			throw createError("rewrite");
		},
		get routePattern() {
			throw createError("routePattern");
		},
		get self() {
			throw createError("self");
		},
		get slots() {
			throw createError("slots");
		},
		get url() {
			throw createError("url");
		},
		get session() {
			throw createError("session");
		},
		get cache() {
			throw createError("cache");
		},
		get logger() {
			throw createError("logger");
		}
	};
}
//#endregion
//#region src/data/site.ts
/**
* SolHub 站点级配置
* 部署时按实际情况修改。环境变量以 PUBLIC_ 开头会暴露给客户端。
*/
var siteConfig = {
	name: "SolHub",
	tagline: "Discover. Build. Share.",
	taglineZh: "发现好产品，使用好工具，让独立创作更高效。",
	description: "SolHub 是一个独立产品发现平台与在线工具箱：探索独立开发者正在创造的产品，使用简单、实用、免费的在线工具。",
	descriptionEn: "SolHub is an indie-product discovery platform and free online toolbox: explore what indie developers are building, and use simple, practical, free online tools.",
	/** 生产环境站点地址（与 astro.config.mjs 的 ASTRO_SITE 保持一致） */
	defaultSite: "https://solyoung.top",
	/** GitHub 项目仓库地址；配置后页脚显示 GitHub 入口 */
	githubUrl: "https://github.com/SolYoung-Ai/solhub",
	/** 联系方式（可选） */
	contactEmail: "",
	copyrightYear: 2026
};
/**
* 提交系统配置（客户端可读，以 PUBLIC_ 开头，不能放置任何密钥）
* - PUBLIC_SOLHUB_ISSUE_REPO: 例如 "SolYoung-work/solhub"。配置后提交页提供
*   「在 GitHub 上提交 Issue」入口（生成预填链接，由用户自己点击提交）。
* - PUBLIC_SOLHUB_SUBMIT_ENDPOINT: 远程提交接口 URL（需服务端实现并允许 CORS）。
*   两者都未配置时，提交内容保存为本地草稿并提供 JSON 导出，并明确说明不会公开。
*/
var submissionConfig = {
	githubIssueRepo: "SolYoung-Ai/solhub",
	remoteEndpoint: void 0
};
//#endregion
//#region src/data/products.ts
/**
* SolHub 产品数据。
*
* 数据诚实性约定：
* 1. isDemo=true 的产品是演示数据，仅用于展示产品形态，页面会显示「演示数据」标记，
*    且不会被授予任何核验状态（verificationStatus 一律为 unverified）。
* 2. verificationStatus="verified" 仅授予 SolHub 编辑已实际核验的产品：
*    人工访问官网 → 核对产品名称、描述、站点可访问性 → 记录核验时间与方法。
* 3. publishedAt 表示「SolHub 收录时间」（即加入本平台的时间），不是产品自身的发布日期，
*    避免编造无法核实的发布时间；榜单批次 launchBatch 表示人工精选批次。
* 4. rankPosition 是人工精选顺序，规则见 src/lib/ranking.ts，与数据分离。
*/
var products = [
	{
		id: "solyoung",
		slug: "solyoung",
		name: "SolYoung",
		icon: "/solhub/icons/solyoung.jpg",
		shortDescription: "一个把想法变成作品的人 —— 个人数字空间，持续运营。",
		description: "SolYoung 是独立创作者宋杨（Sol Young）的个人网站：以数字档案式排版承载作品集、此刻时间线、思考文章与产品入口，是个人品牌的主阵地。内容覆盖影像创作、AI 实践与轻量产品开发，持续更新。",
		websiteUrl: "https://solyoung.top",
		category: "creator-space",
		tags: [
			"personal-site",
			"portfolio",
			"content"
		],
		developerName: "Sol Young",
		publishedAt: "2026-10-16",
		launchBatch: "Curated W42",
		verificationStatus: "verified",
		verificationMethod: "人工访问 https://solyoung.top，核对产品名称、定位与页面内容后核验通过。",
		verifiedAt: "2026-10-16",
		rankPosition: 2,
		isDemo: false
	},
	{
		id: "solyoung-studio",
		slug: "solyoung-studio",
		name: "SolYoung Studio",
		icon: "/solhub/icons/solyoung-studio.png",
		shortDescription: "AI 个人网站、数字空间与轻量产品制作服务。",
		description: "SolYoung Studio 是面向创作者、自由职业者和小型品牌的服务型站点：从需求梳理、视觉设计到 AI 辅助制作与部署，把想法逐步变成真实可用的作品，并提供品牌与商业合作入口。",
		websiteUrl: "https://solyoung.top/studio/",
		category: "services",
		tags: [
			"website",
			"brand",
			"ai-assisted"
		],
		developerName: "Sol Young",
		publishedAt: "2026-10-16",
		launchBatch: "Curated W42",
		verificationStatus: "verified",
		verificationMethod: "人工访问 https://solyoung.top/studio/，核对服务定位与页面内容后核验通过。",
		verifiedAt: "2026-10-16",
		rankPosition: 3,
		isDemo: false
	},
	{
		id: "myos",
		slug: "myos",
		name: "My.OS",
		icon: "/solhub/icons/myos.png",
		shortDescription: "属于独立创作者的本地工作台：记录 → 思考 → 创作 → 交付 → 归档。",
		description: "My.OS 是一套在线可用的个人创作系统：把记录、灵感、创作、项目、此刻与档案收拢在同一个入口，减少想法散落的焦虑，免费开放使用。",
		websiteUrl: "https://solyoung.top/OS/",
		category: "productivity",
		tags: [
			"personal-os",
			"notes",
			"productivity"
		],
		developerName: "Sol Young",
		publishedAt: "2026-10-16",
		launchBatch: "Curated W42",
		verificationStatus: "verified",
		verificationMethod: "人工访问 https://solyoung.top/OS/，核对产品功能与可用性后核验通过。",
		verifiedAt: "2026-10-16",
		isDemo: false
	},
	{
		id: "verity",
		slug: "verity",
		name: "Verity",
		icon: "/solhub/icons/verity.png",
		shortDescription: "把 13 套人格测试收拢在一个站点，选一套就能开始测。",
		description: "Verity 是在线可用的测试集合站：结构统一的性格测试入口，结果即时生成，免费开放。适合想快速了解自己的人。",
		websiteUrl: "https://solyoung.top/Verity/",
		category: "fun-tools",
		tags: [
			"personality",
			"quiz",
			"free"
		],
		developerName: "Sol Young",
		publishedAt: "2026-10-16",
		launchBatch: "Curated W42",
		verificationStatus: "verified",
		verificationMethod: "人工访问 https://solyoung.top/Verity/，核对测试功能与可用性后核验通过。",
		verifiedAt: "2026-10-16",
		isDemo: false
	},
	{
		id: "camsim",
		slug: "camsim",
		name: "CamSim",
		icon: "/solhub/icons/camsim.png",
		shortDescription: "相机参数模拟器：从想拍的效果反推光圈、快门与 ISO。",
		description: "CamSim 是面向摄影新手的交互工具：告诉它你想拍成什么样，得到一组可参考的光圈 / 快门 / ISO 参数，免费开放使用。",
		websiteUrl: "https://solyoung.top/CamSim/",
		category: "creator-tools",
		tags: [
			"photography",
			"simulator",
			"free"
		],
		developerName: "Sol Young",
		publishedAt: "2026-10-16",
		launchBatch: "Curated W42",
		verificationStatus: "verified",
		verificationMethod: "人工访问 https://solyoung.top/CamSim/，核对工具功能与可用性后核验通过。",
		verifiedAt: "2026-10-16",
		isDemo: false
	}
];
//#endregion
//#region src/data/tools.ts
/**
* SolHub 工具注册表 —— 分类页、首页、搜索、工具详情与相关推荐全部从此数据源读取。
* component 字段对应 src/islands/tools/ 下的组件 key，必须与 [slug].astro 的映射一致。
* 所有工具都必须有真实计算/转换逻辑，不允许只有卡片没有实现的「摆设」。
*/
var tools = [
	{
		id: "json-formatter",
		slug: "json-formatter",
		name: "JSON Formatter",
		description: "格式化、压缩并校验 JSON，定位具体解析错误位置。",
		category: "developer-tools",
		tags: [
			"json",
			"format",
			"validate"
		],
		icon: "Braces",
		component: "JsonFormatter",
		isImplemented: true,
		relatedToolIds: [
			"base64-codec",
			"url-codec",
			"markdown-editor"
		],
		keywords: [
			"json",
			"格式化",
			"压缩",
			"校验",
			"pretty",
			"minify",
			"validate",
			"parse"
		],
		note: "全部处理在浏览器本地完成，输入不会上传到任何服务器。"
	},
	{
		id: "text-counter",
		slug: "text-counter",
		name: "Text & Character Counter",
		description: "实时统计字符、字数（不含空格）、词数与段落数，支持中英文。",
		category: "text-content",
		tags: [
			"counter",
			"words",
			"characters"
		],
		icon: "Type",
		component: "TextCounter",
		isImplemented: true,
		relatedToolIds: ["json-formatter", "markdown-editor"],
		keywords: [
			"字数",
			"字符",
			"单词",
			"段落",
			"counter",
			"word",
			"character",
			"count",
			"统计"
		],
		note: "词数统计规则：英文按空格分词，中文按连续汉字/词语边界分词，详见页面说明。"
	},
	{
		id: "url-codec",
		slug: "url-codec",
		name: "URL Encoder / Decoder",
		description: "URL 编码与解码一键切换，错误输入有清晰反馈。",
		category: "seo-web",
		tags: [
			"url",
			"encode",
			"decode"
		],
		icon: "Link",
		component: "UrlCodec",
		isImplemented: true,
		relatedToolIds: [
			"base64-codec",
			"utm-builder",
			"qr-generator"
		],
		keywords: [
			"url",
			"encode",
			"decode",
			"编码",
			"解码",
			"percent",
			"percent-encoding"
		],
		note: "使用 encodeURIComponent / decodeURIComponent，覆盖 UTF-8 中文与常见特殊字符。"
	},
	{
		id: "base64-codec",
		slug: "base64-codec",
		name: "Base64 Encoder / Decoder",
		description: "Base64 编码与解码，完整支持 UTF-8 中文与特殊字符。",
		category: "developer-tools",
		tags: [
			"base64",
			"encode",
			"decode"
		],
		icon: "Binary",
		component: "Base64Codec",
		isImplemented: true,
		relatedToolIds: [
			"url-codec",
			"json-formatter",
			"uuid-generator"
		],
		keywords: [
			"base64",
			"编码",
			"解码",
			"utf8",
			"encode",
			"decode",
			"atob",
			"btoa"
		],
		note: "中文等非 ASCII 字符先转 UTF-8 再编码；非法输入会给出明确错误提示。"
	},
	{
		id: "uuid-generator",
		slug: "uuid-generator",
		name: "UUID Generator",
		description: "使用 Web Crypto API 批量生成 UUID v4。",
		category: "developer-tools",
		tags: [
			"uuid",
			"v4",
			"generator"
		],
		icon: "Fingerprint",
		component: "UuidGenerator",
		isImplemented: true,
		relatedToolIds: ["password-generator", "timestamp-converter"],
		keywords: [
			"uuid",
			"guid",
			"v4",
			"生成",
			"random",
			"id"
		],
		note: "使用 crypto.randomUUID() 生成，不依赖任何服务端。"
	},
	{
		id: "password-generator",
		slug: "password-generator",
		name: "Password Generator",
		description: "可配置长度与字符集的强密码生成器，仅在本机运行。",
		category: "developer-tools",
		tags: [
			"password",
			"security",
			"random"
		],
		icon: "KeyRound",
		component: "PasswordGenerator",
		isImplemented: true,
		relatedToolIds: ["uuid-generator"],
		keywords: [
			"password",
			"密码",
			"随机",
			"安全",
			"strong",
			"generate",
			"random"
		],
		note: "使用浏览器原生 crypto.getRandomValues()，密码不会保存到页面、控制台或任何服务器。"
	},
	{
		id: "timestamp-converter",
		slug: "timestamp-converter",
		name: "Timestamp Converter",
		description: "Unix 时间戳与日期互转，支持秒与毫秒，明确显示时区。",
		category: "converters-calculators",
		tags: [
			"timestamp",
			"unix",
			"date"
		],
		icon: "Clock",
		component: "TimestampConverter",
		isImplemented: true,
		relatedToolIds: ["color-converter", "aspect-ratio-calculator"],
		keywords: [
			"timestamp",
			"unix",
			"时间戳",
			"日期",
			"date",
			"秒",
			"毫秒",
			"time"
		],
		note: "转换使用本地时区显示，并标注时区偏移；无效输入会给出错误提示。"
	},
	{
		id: "utm-builder",
		slug: "utm-builder",
		name: "UTM Builder",
		description: "为推广链接生成 UTM 参数，正确处理已有查询参数。",
		category: "growth-marketing",
		tags: [
			"utm",
			"marketing",
			"link"
		],
		icon: "Share2",
		component: "UtmBuilder",
		isImplemented: true,
		relatedToolIds: ["url-codec", "qr-generator"],
		keywords: [
			"utm",
			"ga",
			"推广",
			"链接",
			"参数",
			"campaign",
			"marketing",
			"tracking"
		],
		note: "自动合并目标网址中已有的查询参数，不会覆盖同名参数。"
	},
	{
		id: "qr-generator",
		slug: "qr-generator",
		name: "QR Code Generator",
		description: "输入文本或网址生成二维码，可调整尺寸并下载 PNG。",
		category: "images",
		tags: [
			"qr",
			"code",
			"generator"
		],
		icon: "QrCode",
		component: "QrGenerator",
		isImplemented: true,
		relatedToolIds: ["image-compressor", "utm-builder"],
		keywords: [
			"qr",
			"二维码",
			"生成",
			"qrcode",
			"png",
			"下载"
		],
		note: "使用成熟的 QR 编码库在浏览器本地生成，图片不会上传。"
	},
	{
		id: "image-compressor",
		slug: "image-compressor",
		name: "Image Compressor",
		description: "浏览器本地压缩图片，展示压缩率，支持预览与下载。",
		category: "images",
		tags: [
			"image",
			"compress",
			"png",
			"jpeg",
			"webp"
		],
		icon: "ImageDown",
		component: "ImageCompressor",
		isImplemented: true,
		relatedToolIds: ["qr-generator", "color-converter"],
		keywords: [
			"image",
			"图片",
			"压缩",
			"compressor",
			"png",
			"jpeg",
			"webp",
			"quality"
		],
		note: "图片全程在本地处理，不会上传。透明通道（PNG）转换到 JPEG 时会填充背景色。"
	},
	{
		id: "aspect-ratio-calculator",
		slug: "aspect-ratio-calculator",
		name: "Aspect Ratio Calculator",
		description: "根据已知宽高或比例计算未知尺寸，支持常见比例参考。",
		category: "converters-calculators",
		tags: [
			"aspect",
			"ratio",
			"calculator"
		],
		icon: "RectangleHorizontal",
		component: "AspectRatioCalculator",
		isImplemented: true,
		relatedToolIds: ["color-converter", "timestamp-converter"],
		keywords: [
			"aspect",
			"ratio",
			"比例",
			"宽高比",
			"尺寸",
			"计算",
			"calculator"
		],
		note: "宽度或高度留空其一即可按比例推算；所有计算在本地完成。"
	},
	{
		id: "color-converter",
		slug: "color-converter",
		name: "Color Converter",
		description: "HEX、RGB、HSL 互相转换，实时预览颜色并复制各种格式。",
		category: "converters-calculators",
		tags: [
			"color",
			"hex",
			"rgb",
			"hsl"
		],
		icon: "Palette",
		component: "ColorConverter",
		isImplemented: true,
		relatedToolIds: ["image-compressor", "aspect-ratio-calculator"],
		keywords: [
			"color",
			"hex",
			"rgb",
			"hsl",
			"颜色",
			"转换",
			"色值"
		],
		note: "非法颜色输入会给出明确提示；HEX 同时支持 3/6 位与带透明度的 8 位格式。"
	},
	{
		id: "robots-generator",
		slug: "robots-generator",
		name: "robots.txt Generator",
		description: "配置常用规则，生成可复制的 robots.txt 内容。",
		category: "seo-web",
		tags: [
			"robots",
			"seo",
			"crawler"
		],
		icon: "FileCode2",
		component: "RobotsGenerator",
		isImplemented: true,
		relatedToolIds: ["llms-generator", "jsonld-generator"],
		keywords: [
			"robots",
			"seo",
			"搜索引擎",
			"crawler",
			"蜘蛛",
			"爬虫"
		],
		note: "生成器只产出 robots.txt 文本；不同搜索引擎对部分指令的支持程度不同。"
	},
	{
		id: "llms-generator",
		slug: "llms-generator",
		name: "llms.txt Generator",
		description: "生成结构清晰的 llms.txt，帮助 LLM 理解你的网站。",
		category: "seo-web",
		tags: [
			"llms",
			"llm",
			"ai"
		],
		icon: "Bot",
		component: "LlmsGenerator",
		isImplemented: true,
		relatedToolIds: ["robots-generator", "jsonld-generator"],
		keywords: [
			"llms",
			"llm",
			"ai",
			"markdown",
			"站点描述"
		],
		note: "llms.txt 目前是社区提案格式，并非搜索引擎标准，请结合自身情况使用。"
	},
	{
		id: "jsonld-generator",
		slug: "jsonld-generator",
		name: "JSON-LD Schema Generator",
		description: "生成 Organization、WebSite、SoftwareApplication 等结构化数据。",
		category: "developer-tools",
		tags: [
			"jsonld",
			"schema",
			"structured-data"
		],
		icon: "Database",
		component: "JsonLdGenerator",
		isImplemented: true,
		relatedToolIds: [
			"robots-generator",
			"llms-generator",
			"json-formatter"
		],
		keywords: [
			"jsonld",
			"schema",
			"structured",
			"seo",
			"结构化数据",
			"rich snippets"
		],
		note: "生成结果可在页面内校验 JSON 合法性；实际收录效果取决于搜索引擎。"
	},
	{
		id: "markdown-editor",
		slug: "markdown-editor",
		name: "Markdown Editor & Preview",
		description: "左侧编辑、右侧预览的 Markdown 编辑器，支持复制与下载。",
		category: "developer-tools",
		tags: [
			"markdown",
			"editor",
			"preview"
		],
		icon: "PenLine",
		component: "MarkdownEditor",
		isImplemented: true,
		relatedToolIds: ["text-counter", "json-formatter"],
		keywords: [
			"markdown",
			"md",
			"编辑器",
			"preview",
			"预览",
			"写作"
		],
		note: "预览输出经过 HTML 净化（DOMPurify），不会执行任何不可信脚本。"
	}
];
function getToolById(id) {
	return tools.find((t) => t.id === id);
}
//#endregion
//#region src/data/categories.ts
/** 工具分类（首页分类入口、工具详情、筛选共用） */
var categories = [
	{
		id: "developer-tools",
		slug: "developer-tools",
		name: "Developer Tools",
		description: "面向开发者的日常效率工具：JSON、代码、编码与生成类。",
		icon: "Code2"
	},
	{
		id: "seo-web",
		slug: "seo-web",
		name: "SEO & Web",
		description: "网页与搜索引擎相关的工具：URL、robots、结构化数据。",
		icon: "Globe"
	},
	{
		id: "text-content",
		slug: "text-content",
		name: "Text & Content",
		description: "文本统计与内容处理工具。",
		icon: "FileText"
	},
	{
		id: "images",
		slug: "images",
		name: "Images",
		description: "图片生成、压缩与二维码等图像工具。",
		icon: "Image"
	},
	{
		id: "converters-calculators",
		slug: "converters-calculators",
		name: "Converters & Calculators",
		description: "时间戳、颜色、比例等转换与计算工具。",
		icon: "Calculator"
	},
	{
		id: "growth-marketing",
		slug: "growth-marketing",
		name: "Growth & Marketing",
		description: "推广与增长相关工具：UTM 链接构建等。",
		icon: "TrendingUp"
	}
];
function getCategory(slug) {
	return categories.find((c) => c.slug === slug);
}
function categoryName(slug) {
	return getCategory(slug)?.name ?? slug;
}
//#endregion
//#region src/data/product-categories.ts
/**
* 产品分类（区别于工具分类：产品分类描述「产品属于什么领域」，
* 工具分类描述「工具属于什么用途」）。与 products.ts 的 category 字段对应。
*/
var productCategories = [
	{
		slug: "creator-space",
		name: "个人数字空间",
		description: "个人网站、作品集与数字档案。"
	},
	{
		slug: "services",
		name: "设计与服务",
		description: "网站搭建、品牌与商业合作等服务。"
	},
	{
		slug: "ai-tools",
		name: "AI 工具",
		description: "借助 AI 能力的产品与工具。"
	},
	{
		slug: "productivity",
		name: "效率工具",
		description: "帮助更高效完成工作的产品。"
	},
	{
		slug: "creator-tools",
		name: "创作者工具",
		description: "面向影像、设计与内容创作者的装备。"
	},
	{
		slug: "fun-tools",
		name: "趣味工具",
		description: "测试、娱乐与轻量交互产品。"
	},
	{
		slug: "growth-marketing",
		name: "增长营销",
		description: "获客、推广与增长相关产品。"
	},
	{
		slug: "design-tools",
		name: "设计工具",
		description: "视觉与设计相关产品。"
	}
];
function productCategoryName(slug) {
	return productCategories.find((c) => c.slug === slug)?.name ?? slug;
}
//#endregion
//#region src/i18n/tools.ts
/**
* 16 个在线工具的 UI 文案字典（中英双语）。
* key 命名：tools.<toolSlug>.<key>
*/
var toolsZh = {
	"tools.json-formatter.inputLabel": "输入 JSON",
	"tools.json-formatter.inputHint": "支持粘贴任意长度的 JSON 文本",
	"tools.json-formatter.inputAria": "JSON 输入",
	"tools.json-formatter.formatBtn": "格式化",
	"tools.json-formatter.minifyBtn": "压缩",
	"tools.json-formatter.validateBtn": "校验",
	"tools.json-formatter.errEmpty": "请输入 JSON 内容。",
	"tools.json-formatter.errParse": "JSON 解析失败（第 {line} 行，第 {col} 列）：{msg}",
	"tools.json-formatter.metaFormatted": "格式化后 {out} 字符；源输入 {in} 字符，JSON 校验通过。",
	"tools.json-formatter.metaValidated": "JSON 校验通过。点击「格式化」查看缩进后的结果。",
	"tools.json-formatter.outputLabel": "输出",
	"tools.text-counter.inputLabel": "输入文本",
	"tools.text-counter.inputHint": "支持中文、英文与常见标点",
	"tools.text-counter.inputAria": "文本输入",
	"tools.text-counter.countHint": "输入内容后，统计信息会实时显示在下方。",
	"tools.text-counter.statChars": "字符数",
	"tools.text-counter.statCharsNoSpace": "字符数（不含空格）",
	"tools.text-counter.statWords": "词数",
	"tools.text-counter.statParagraphs": "段落数",
	"tools.text-counter.ruleTitle": "统计规则说明",
	"tools.text-counter.ruleEn": "英文按空格分词；",
	"tools.text-counter.ruleZh": "中文按连续汉字/词语边界计数；",
	"tools.text-counter.rulePunct": "标点计入字符数，不计入词数。",
	"tools.url-codec.inputLabel": "输入内容",
	"tools.url-codec.outputLabel": "输出",
	"tools.url-codec.encodeBtn": "编码",
	"tools.url-codec.decodeBtn": "解码",
	"tools.url-codec.swapBtn": "交换模式",
	"tools.url-codec.errEmpty": "请输入要编码 / 解码的内容。",
	"tools.url-codec.errDecode": "解码失败：不是合法的百分号编码（{msg}）。",
	"tools.base64-codec.inputLabel": "输入内容",
	"tools.base64-codec.outputLabel": "输出",
	"tools.base64-codec.encodeBtn": "编码",
	"tools.base64-codec.decodeBtn": "解码",
	"tools.base64-codec.errEmpty": "请输入要编码 / 解码的内容。",
	"tools.base64-codec.errDecode": "解码失败：不是合法的 Base64 文本（{msg}）。",
	"tools.base64-codec.utf8Note": "中文等非 ASCII 字符会先转为 UTF-8 再编码。",
	"tools.uuid-generator.countLabel": "生成数量",
	"tools.uuid-generator.countHint": "1–1000",
	"tools.uuid-generator.versionHint": "版本",
	"tools.uuid-generator.generateBtn": "生成",
	"tools.uuid-generator.upperCase": "大写",
	"tools.uuid-generator.copyAll": "复制全部",
	"tools.uuid-generator.resultHint": "已生成 {n} 个 UUID，使用浏览器原生 crypto.randomUUID()。",
	"tools.password-generator.lengthLabel": "密码长度",
	"tools.password-generator.includeUpper": "包含大写字母（A–Z）",
	"tools.password-generator.includeLower": "包含小写字母（a–z）",
	"tools.password-generator.includeDigits": "包含数字（0–9）",
	"tools.password-generator.includeSymbols": "包含符号（!@#$%…）",
	"tools.password-generator.generateBtn": "生成密码",
	"tools.password-generator.strengthLabel": "强度",
	"tools.password-generator.strengthWeak": "弱",
	"tools.password-generator.strengthMedium": "中",
	"tools.password-generator.strengthStrong": "强",
	"tools.password-generator.strengthVeryStrong": "很强",
	"tools.password-generator.errOptions": "至少选择一种字符类型。",
	"tools.password-generator.privacyNote": "密码在本机生成，不会保存到页面、控制台或任何服务器。",
	"tools.timestamp-converter.tsLabel": "Unix 时间戳",
	"tools.timestamp-converter.dateLabel": "日期时间",
	"tools.timestamp-converter.tsUnitSeconds": "秒（10 位）",
	"tools.timestamp-converter.tsUnitMillis": "毫秒（13 位）",
	"tools.timestamp-converter.tsToDateBtn": "时间戳 → 日期",
	"tools.timestamp-converter.dateToTsBtn": "日期 → 时间戳",
	"tools.timestamp-converter.nowBtn": "使用当前时间",
	"tools.timestamp-converter.errTs": "时间戳无效，请输入 10 位（秒）或 13 位（毫秒）数字。",
	"tools.timestamp-converter.errDate": "日期无效，请使用 YYYY-MM-DD 或 YYYY-MM-DD HH:mm:ss 格式。",
	"tools.timestamp-converter.timezoneNote": "时区：{tz}（UTC{offset}）",
	"tools.utm-builder.targetLabel": "目标网址",
	"tools.utm-builder.sourceLabel": "Source",
	"tools.utm-builder.mediumLabel": "Medium",
	"tools.utm-builder.campaignLabel": "Campaign",
	"tools.utm-builder.termLabel": "Term",
	"tools.utm-builder.contentLabel": "Content",
	"tools.utm-builder.errUrl": "请输入有效的网址（以 http:// 或 https:// 开头）。",
	"tools.utm-builder.errSource": "Source 必填。",
	"tools.utm-builder.mediumRequired": "Medium 建议填写。",
	"tools.utm-builder.resultHint": "自动合并目标网址已有的查询参数，同名参数不覆盖。",
	"tools.qr-generator.inputLabel": "文本或网址",
	"tools.qr-generator.sizeLabel": "尺寸",
	"tools.qr-generator.pxSuffix": "px",
	"tools.qr-generator.errEmpty": "请输入要生成二维码的文本或网址。",
	"tools.qr-generator.previewHint": "预览",
	"tools.qr-generator.downloadPng": "下载 PNG",
	"tools.image-compressor.choose": "选择图片",
	"tools.image-compressor.dragHint": "点击选择或拖拽图片（PNG / JPEG / WebP）",
	"tools.image-compressor.qualityLabel": "质量",
	"tools.image-compressor.original": "原始",
	"tools.image-compressor.compressed": "压缩后",
	"tools.image-compressor.ratio": "压缩率",
	"tools.image-compressor.downloadBtn": "下载压缩图片",
	"tools.image-compressor.errNotImage": "请选择有效的图片文件。",
	"tools.image-compressor.errTooLarge": "图片过大，处理失败，请换一张较小的图。",
	"tools.image-compressor.transparencyNote": "PNG 透明通道在导出 JPEG 时会填充背景色；导出 PNG 保留透明。",
	"tools.aspect-ratio-calculator.widthLabel": "宽度",
	"tools.aspect-ratio-calculator.heightLabel": "高度",
	"tools.aspect-ratio-calculator.ratioLabel": "比例",
	"tools.aspect-ratio-calculator.modeLabel": "已知",
	"tools.aspect-ratio-calculator.modeWidthHeight": "宽 + 高",
	"tools.aspect-ratio-calculator.modeWidthRatio": "宽 + 比例",
	"tools.aspect-ratio-calculator.modeHeightRatio": "高 + 比例",
	"tools.aspect-ratio-calculator.calcBtn": "计算",
	"tools.aspect-ratio-calculator.errNumbers": "请输入有效的数字。",
	"tools.aspect-ratio-calculator.errMode": "请选择已知条件。",
	"tools.aspect-ratio-calculator.errRatio": "比例格式应为 a:b（如 16:9）。",
	"tools.aspect-ratio-calculator.result": "结果：{w} × {h}（比例 {r}）",
	"tools.aspect-ratio-calculator.presets": "常见比例",
	"tools.aspect-ratio-calculator.preset16_9": "16:9",
	"tools.aspect-ratio-calculator.preset4_3": "4:3",
	"tools.aspect-ratio-calculator.preset1_1": "1:1",
	"tools.aspect-ratio-calculator.preset3_2": "3:2",
	"tools.aspect-ratio-calculator.preset9_16": "9:16",
	"tools.color-converter.hexLabel": "HEX",
	"tools.color-converter.rgbLabel": "RGB",
	"tools.color-converter.hslLabel": "HSL",
	"tools.color-converter.previewLabel": "颜色预览",
	"tools.color-converter.copyFormat": "复制 {format}",
	"tools.color-converter.errInvalid": "颜色无效：{msg}",
	"tools.color-converter.errMsgHex": "HEX 应为 # 加 3/6/8 位十六进制。",
	"tools.color-converter.errMsgRgb": "RGB 格式：rgb(255, 0, 0)，数值 0–255。",
	"tools.color-converter.errMsgHsl": "HSL 格式：hsl(0, 100%, 50%)，H 0–360，S/L 0–100%。",
	"tools.robots-generator.userAgentLabel": "User-agent",
	"tools.robots-generator.userAgentAll": "所有爬虫（*）",
	"tools.robots-generator.userAgentGoogle": "Googlebot",
	"tools.robots-generator.userAgentBing": "Bingbot",
	"tools.robots-generator.allowLabel": "允许路径",
	"tools.robots-generator.disallowLabel": "禁止路径",
	"tools.robots-generator.onePerLine": "每行一个路径",
	"tools.robots-generator.sitemapLabel": "Sitemap URL",
	"tools.robots-generator.crawlDelayLabel": "Crawl-delay（秒，可选）",
	"tools.robots-generator.generateBtn": "生成 robots.txt",
	"tools.robots-generator.templateBtn": "恢复默认模板",
	"tools.robots-generator.outputLabel": "输出",
	"tools.robots-generator.errDisallow": "路径应以 / 开头（如 /admin）。",
	"tools.llms-generator.siteNameLabel": "网站名称",
	"tools.llms-generator.siteUrlLabel": "网站网址",
	"tools.llms-generator.summaryLabel": "简短介绍",
	"tools.llms-generator.pagesTitle": "主要页面（Markdown 链接）",
	"tools.llms-generator.pagesHint": "每行一个：[页面名称](https://example.com/page)",
	"tools.llms-generator.errName": "请输入网站名称。",
	"tools.llms-generator.errUrl": "请输入有效的网站网址。",
	"tools.llms-generator.errSummary": "请输入简短介绍。",
	"tools.llms-generator.generateBtn": "生成 llms.txt",
	"tools.llms-generator.outputLabel": "输出",
	"tools.llms-generator.howTo": "把生成内容保存为 /llms.txt 放在网站根目录。",
	"tools.jsonld-generator.typeLabel": "结构类型",
	"tools.jsonld-generator.typeOrganization": "Organization",
	"tools.jsonld-generator.typeWebSite": "WebSite",
	"tools.jsonld-generator.typeSoftwareApplication": "SoftwareApplication",
	"tools.jsonld-generator.nameLabel": "名称",
	"tools.jsonld-generator.urlLabel": "网址",
	"tools.jsonld-generator.descriptionLabel": "描述",
	"tools.jsonld-generator.logoLabel": "Logo 网址",
	"tools.jsonld-generator.applicationCategoryLabel": "应用分类",
	"tools.jsonld-generator.applicationCategoryPlaceholder": "如 BusinessApplication / UtilitiesApplication",
	"tools.jsonld-generator.errName": "请输入名称。",
	"tools.jsonld-generator.errUrl": "请输入有效的网址。",
	"tools.jsonld-generator.generateBtn": "生成 JSON-LD",
	"tools.jsonld-generator.outputLabel": "输出",
	"tools.jsonld-generator.validNote": "JSON 校验通过，可直接复制到 <script type=\"application/ld+json\"> 中。",
	"tools.markdown-editor.editorLabel": "编辑",
	"tools.markdown-editor.previewLabel": "预览",
	"tools.markdown-editor.tabWrite": "写作",
	"tools.markdown-editor.tabPreview": "预览",
	"tools.markdown-editor.copyMd": "复制 Markdown",
	"tools.markdown-editor.downloadMd": "下载 .md",
	"tools.markdown-editor.emptyHint": "在左侧输入 Markdown 文本，右侧实时预览。",
	"tools.markdown-editor.sanitizeNote": "预览经过 HTML 净化，不会执行任何不可信脚本。"
};
var toolsEn = {
	"tools.json-formatter.inputLabel": "Input JSON",
	"tools.json-formatter.inputHint": "Paste JSON of any length",
	"tools.json-formatter.inputAria": "JSON input",
	"tools.json-formatter.formatBtn": "Format",
	"tools.json-formatter.minifyBtn": "Minify",
	"tools.json-formatter.validateBtn": "Validate",
	"tools.json-formatter.errEmpty": "Please enter JSON content.",
	"tools.json-formatter.errParse": "JSON parse failed (line {line}, column {col}): {msg}",
	"tools.json-formatter.metaFormatted": "{out} chars after formatting; source {in} chars. JSON valid.",
	"tools.json-formatter.metaValidated": "JSON is valid. Click “Format” to see the indented result.",
	"tools.json-formatter.outputLabel": "Output",
	"tools.text-counter.inputLabel": "Input text",
	"tools.text-counter.inputHint": "Chinese, English and common punctuation supported",
	"tools.text-counter.inputAria": "Text input",
	"tools.text-counter.countHint": "Stats update live as you type.",
	"tools.text-counter.statChars": "Characters",
	"tools.text-counter.statCharsNoSpace": "Characters (no spaces)",
	"tools.text-counter.statWords": "Words",
	"tools.text-counter.statParagraphs": "Paragraphs",
	"tools.text-counter.ruleTitle": "Counting rules",
	"tools.text-counter.ruleEn": "English splits on spaces;",
	"tools.text-counter.ruleZh": "Chinese counts consecutive characters;",
	"tools.text-counter.rulePunct": "punctuation counts as characters, not words.",
	"tools.url-codec.inputLabel": "Input",
	"tools.url-codec.outputLabel": "Output",
	"tools.url-codec.encodeBtn": "Encode",
	"tools.url-codec.decodeBtn": "Decode",
	"tools.url-codec.swapBtn": "Swap mode",
	"tools.url-codec.errEmpty": "Please enter content to encode / decode.",
	"tools.url-codec.errDecode": "Decode failed: not valid percent-encoding ({msg}).",
	"tools.base64-codec.inputLabel": "Input",
	"tools.base64-codec.outputLabel": "Output",
	"tools.base64-codec.encodeBtn": "Encode",
	"tools.base64-codec.decodeBtn": "Decode",
	"tools.base64-codec.errEmpty": "Please enter content to encode / decode.",
	"tools.base64-codec.errDecode": "Decode failed: not valid Base64 ({msg}).",
	"tools.base64-codec.utf8Note": "Non-ASCII text (e.g. Chinese) is UTF-8 encoded first.",
	"tools.uuid-generator.countLabel": "Count",
	"tools.uuid-generator.countHint": "1–1000",
	"tools.uuid-generator.versionHint": "Version",
	"tools.uuid-generator.generateBtn": "Generate",
	"tools.uuid-generator.upperCase": "Uppercase",
	"tools.uuid-generator.copyAll": "Copy all",
	"tools.uuid-generator.resultHint": "Generated {n} UUIDs with the browser's native crypto.randomUUID().",
	"tools.password-generator.lengthLabel": "Length",
	"tools.password-generator.includeUpper": "Uppercase (A–Z)",
	"tools.password-generator.includeLower": "Lowercase (a–z)",
	"tools.password-generator.includeDigits": "Digits (0–9)",
	"tools.password-generator.includeSymbols": "Symbols (!@#$%…)",
	"tools.password-generator.generateBtn": "Generate password",
	"tools.password-generator.strengthLabel": "Strength",
	"tools.password-generator.strengthWeak": "Weak",
	"tools.password-generator.strengthMedium": "Medium",
	"tools.password-generator.strengthStrong": "Strong",
	"tools.password-generator.strengthVeryStrong": "Very strong",
	"tools.password-generator.errOptions": "Select at least one character type.",
	"tools.password-generator.privacyNote": "Passwords are generated on-device and never saved to the page, console or any server.",
	"tools.timestamp-converter.tsLabel": "Unix timestamp",
	"tools.timestamp-converter.dateLabel": "Date & time",
	"tools.timestamp-converter.tsUnitSeconds": "Seconds (10 digits)",
	"tools.timestamp-converter.tsUnitMillis": "Milliseconds (13 digits)",
	"tools.timestamp-converter.tsToDateBtn": "Timestamp → Date",
	"tools.timestamp-converter.dateToTsBtn": "Date → Timestamp",
	"tools.timestamp-converter.nowBtn": "Use now",
	"tools.timestamp-converter.errTs": "Invalid timestamp. Enter a 10-digit (seconds) or 13-digit (ms) number.",
	"tools.timestamp-converter.errDate": "Invalid date. Use YYYY-MM-DD or YYYY-MM-DD HH:mm:ss.",
	"tools.timestamp-converter.timezoneNote": "Timezone: {tz} (UTC{offset})",
	"tools.utm-builder.targetLabel": "Target URL",
	"tools.utm-builder.sourceLabel": "Source",
	"tools.utm-builder.mediumLabel": "Medium",
	"tools.utm-builder.campaignLabel": "Campaign",
	"tools.utm-builder.termLabel": "Term",
	"tools.utm-builder.contentLabel": "Content",
	"tools.utm-builder.errUrl": "Enter a valid URL (starting with http:// or https://).",
	"tools.utm-builder.errSource": "Source is required.",
	"tools.utm-builder.mediumRequired": "Medium is recommended.",
	"tools.utm-builder.resultHint": "Existing query params on the target URL are merged, never overwritten.",
	"tools.qr-generator.inputLabel": "Text or URL",
	"tools.qr-generator.sizeLabel": "Size",
	"tools.qr-generator.pxSuffix": "px",
	"tools.qr-generator.errEmpty": "Enter text or a URL to encode as QR.",
	"tools.qr-generator.previewHint": "Preview",
	"tools.qr-generator.downloadPng": "Download PNG",
	"tools.image-compressor.choose": "Choose image",
	"tools.image-compressor.dragHint": "Click to select or drag & drop (PNG / JPEG / WebP)",
	"tools.image-compressor.qualityLabel": "Quality",
	"tools.image-compressor.original": "Original",
	"tools.image-compressor.compressed": "Compressed",
	"tools.image-compressor.ratio": "Reduction",
	"tools.image-compressor.downloadBtn": "Download compressed image",
	"tools.image-compressor.errNotImage": "Please choose a valid image file.",
	"tools.image-compressor.errTooLarge": "Image too large to process — try a smaller one.",
	"tools.image-compressor.transparencyNote": "PNG transparency is flattened when exporting JPEG; PNG export keeps it.",
	"tools.aspect-ratio-calculator.widthLabel": "Width",
	"tools.aspect-ratio-calculator.heightLabel": "Height",
	"tools.aspect-ratio-calculator.ratioLabel": "Ratio",
	"tools.aspect-ratio-calculator.modeLabel": "Known",
	"tools.aspect-ratio-calculator.modeWidthHeight": "Width + height",
	"tools.aspect-ratio-calculator.modeWidthRatio": "Width + ratio",
	"tools.aspect-ratio-calculator.modeHeightRatio": "Height + ratio",
	"tools.aspect-ratio-calculator.calcBtn": "Calculate",
	"tools.aspect-ratio-calculator.errNumbers": "Enter valid numbers.",
	"tools.aspect-ratio-calculator.errMode": "Choose what's known.",
	"tools.aspect-ratio-calculator.errRatio": "Ratio format: a:b (e.g. 16:9).",
	"tools.aspect-ratio-calculator.result": "Result: {w} × {h} (ratio {r})",
	"tools.aspect-ratio-calculator.presets": "Common ratios",
	"tools.aspect-ratio-calculator.preset16_9": "16:9",
	"tools.aspect-ratio-calculator.preset4_3": "4:3",
	"tools.aspect-ratio-calculator.preset1_1": "1:1",
	"tools.aspect-ratio-calculator.preset3_2": "3:2",
	"tools.aspect-ratio-calculator.preset9_16": "9:16",
	"tools.color-converter.hexLabel": "HEX",
	"tools.color-converter.rgbLabel": "RGB",
	"tools.color-converter.hslLabel": "HSL",
	"tools.color-converter.previewLabel": "Preview",
	"tools.color-converter.copyFormat": "Copy {format}",
	"tools.color-converter.errInvalid": "Invalid color: {msg}",
	"tools.color-converter.errMsgHex": "HEX should be # plus 3/6/8 hex digits.",
	"tools.color-converter.errMsgRgb": "RGB format: rgb(255, 0, 0), values 0–255.",
	"tools.color-converter.errMsgHsl": "HSL format: hsl(0, 100%, 50%), H 0–360, S/L 0–100%.",
	"tools.robots-generator.userAgentLabel": "User-agent",
	"tools.robots-generator.userAgentAll": "All crawlers (*)",
	"tools.robots-generator.userAgentGoogle": "Googlebot",
	"tools.robots-generator.userAgentBing": "Bingbot",
	"tools.robots-generator.allowLabel": "Allow paths",
	"tools.robots-generator.disallowLabel": "Disallow paths",
	"tools.robots-generator.onePerLine": "One path per line",
	"tools.robots-generator.sitemapLabel": "Sitemap URL",
	"tools.robots-generator.crawlDelayLabel": "Crawl-delay (seconds, optional)",
	"tools.robots-generator.generateBtn": "Generate robots.txt",
	"tools.robots-generator.templateBtn": "Restore default",
	"tools.robots-generator.outputLabel": "Output",
	"tools.robots-generator.errDisallow": "Paths should start with / (e.g. /admin).",
	"tools.llms-generator.siteNameLabel": "Site name",
	"tools.llms-generator.siteUrlLabel": "Site URL",
	"tools.llms-generator.summaryLabel": "Summary",
	"tools.llms-generator.pagesTitle": "Key pages (Markdown links)",
	"tools.llms-generator.pagesHint": "One per line: [Page](https://example.com/page)",
	"tools.llms-generator.errName": "Please enter the site name.",
	"tools.llms-generator.errUrl": "Please enter a valid site URL.",
	"tools.llms-generator.errSummary": "Please enter a summary.",
	"tools.llms-generator.generateBtn": "Generate llms.txt",
	"tools.llms-generator.outputLabel": "Output",
	"tools.llms-generator.howTo": "Save the result as /llms.txt in your site root.",
	"tools.jsonld-generator.typeLabel": "Schema type",
	"tools.jsonld-generator.typeOrganization": "Organization",
	"tools.jsonld-generator.typeWebSite": "WebSite",
	"tools.jsonld-generator.typeSoftwareApplication": "SoftwareApplication",
	"tools.jsonld-generator.nameLabel": "Name",
	"tools.jsonld-generator.urlLabel": "URL",
	"tools.jsonld-generator.descriptionLabel": "Description",
	"tools.jsonld-generator.logoLabel": "Logo URL",
	"tools.jsonld-generator.applicationCategoryLabel": "Application category",
	"tools.jsonld-generator.applicationCategoryPlaceholder": "e.g. BusinessApplication / UtilitiesApplication",
	"tools.jsonld-generator.errName": "Please enter a name.",
	"tools.jsonld-generator.errUrl": "Please enter a valid URL.",
	"tools.jsonld-generator.generateBtn": "Generate JSON-LD",
	"tools.jsonld-generator.outputLabel": "Output",
	"tools.jsonld-generator.validNote": "JSON validated — paste into <script type=\"application/ld+json\">.",
	"tools.markdown-editor.editorLabel": "Edit",
	"tools.markdown-editor.previewLabel": "Preview",
	"tools.markdown-editor.tabWrite": "Write",
	"tools.markdown-editor.tabPreview": "Preview",
	"tools.markdown-editor.copyMd": "Copy Markdown",
	"tools.markdown-editor.downloadMd": "Download .md",
	"tools.markdown-editor.emptyHint": "Type Markdown on the left; the preview updates live.",
	"tools.markdown-editor.sanitizeNote": "Preview output is sanitized — untrusted scripts never execute."
};
//#endregion
//#region src/i18n/index.ts
/** 取词函数：dictionary[`${ns}.${key}`]，支持 {var} 插值。 */
var zh = {
	"common.open": "打开",
	"common.copy": "复制",
	"common.copied": "已复制",
	"common.copyFailed": "复制失败，请手动选择复制",
	"common.download": "下载",
	"common.clear": "清空",
	"common.reset": "重置",
	"common.close": "关闭",
	"common.optional": "可选",
	"common.required": "必填",
	"common.free": "免费",
	"common.local": "本地运行",
	"common.community": "社区提交",
	"common.visit": "访问",
	"common.processing": "处理中…",
	"common.invalidInput": "输入无效，请检查后重试。",
	"common.comingSoon": "敬请期待",
	"common.demo": "演示",
	"common.by": "by",
	"nav.discover": "发现",
	"nav.launches": "榜单",
	"nav.tools": "工具",
	"nav.about": "关于",
	"nav.search": "搜索产品或工具",
	"nav.searchPlaceholder": "搜索产品或工具…",
	"nav.submit": "提交产品",
	"nav.menuOpen": "打开菜单",
	"nav.menuClose": "关闭菜单",
	"nav.mobileNav": "移动端导航",
	"nav.mainNav": "主导航",
	"nav.homeAria": "SolHub 首页",
	"search.aria": "全局搜索",
	"search.placeholder": "搜索产品或工具…",
	"search.clear": "清除搜索",
	"search.hint": "输入关键词，搜索产品与工具。",
	"search.hintTips": "提示：试试 “json”“二维码”“视频” 或 “SolYoung”",
	"search.emptyTitle": "没有找到与「{q}」相关的内容。",
	"search.emptyHint": "可以换个关键词，或者去提交一个产品。",
	"search.tools": "工具",
	"search.products": "产品",
	"search.demoNote": "（含演示数据）",
	"search.shortcut": "↑↓ 选择 · Enter 打开 · Esc 关闭",
	"search.localNote": "所有数据在本地匹配，不发送搜索内容",
	"home.eyebrow": "SolHub · 发现 · 构建 · 分享",
	"home.title1": "值得被发现的产品，",
	"home.title2": "值得被使用的工具。",
	"home.subtitle1": "探索独立开发者正在创造的产品，使用简单、实用、免费的在线工具，",
	"home.subtitle2": "让每一个好想法更快落地。",
	"home.exploreProducts": "探索产品",
	"home.exploreTools": "探索工具",
	"home.weekEyebrow": "本周 · 人工精选",
	"home.weekTitle": "本周产品榜单",
	"home.weekDesc": "近期值得关注的产品。榜单为人工精选 + 核验优先排序，完整规则见榜单页。",
	"home.weekMore": "查看完整榜单",
	"home.toolsEyebrow": "免费工具 · 本地运行",
	"home.toolsTitle": "热门在线工具",
	"home.toolsDesc": "全部工具免费、无需登录，数据处理在浏览器本地完成。",
	"home.toolsMore": "查看全部工具",
	"home.catsEyebrow": "分类",
	"home.catsTitle": "按用途找工具",
	"home.catsDesc": "分类数量根据工具注册表实时计算。",
	"home.catsCount": "{n} 个工具",
	"home.newEyebrow": "最近收录",
	"home.newTitle": "新收录的产品",
	"home.newDesc": "最近加入 SolHub 的产品，均为真实可访问的站点。",
	"home.newMore": "浏览全部",
	"home.communityTitle": "社区最新提交",
	"home.ctaTitle": "自己做了一款网站、软件或 AI 工具？",
	"home.ctaDesc": "把它提交到 SolHub，让更多独立开发者与使用者发现它。提交即自动公开到社区列表；也可以上传自包含 HTML，让工具直接在本站沙箱内运行。",
	"home.ctaButton": "提交产品",
	"launches.eyebrow": "产品发布",
	"launches.title": "产品发布榜单",
	"launches.desc": "发现独立开发者正在创造的产品。所有排名都有清晰的规则，核验状态以 SolHub 实际核验为准；社区提交自动公开但未经人工核验，会单独标注。",
	"launches.communityTitle": "社区提交的产品",
	"launches.communityNote": "由开发者直接提交，自动公开 · 未经人工核验，请自行判断",
	"launches.submitHint": "展示最近 {n} 条社区提交。想要上榜？去 {link}。",
	"launches.submitLink": "提交你的产品 / 工具",
	"launches.loading": "正在加载社区提交…",
	"tools.eyebrow": "工具",
	"tools.title": "免费在线工具箱",
	"tools.desc": "简单、实用、免费。所有工具都直接可用，无需登录；你的输入只在浏览器本地处理，不会上传到任何服务器。",
	"tools.all": "全部",
	"tools.communityTitle": "社区工具",
	"tools.openTool": "打开工具",
	"tools.externalTool": "工具",
	"tools.hostedTool": "托管工具",
	"tools.noLink": "暂无链接",
	"submit.eyebrow": "发布",
	"submit.title": "提交你的产品与工具",
	"submit.desc": "如果你开发了网站、软件或 AI 工具，欢迎提交到 SolHub，让更多独立开发者和使用者发现它。提交即自动公开到社区列表；自包含 HTML 工具可以直接托管，在本站沙箱内运行。",
	"submit.noteTitle": "提交后会发生什么",
	"submit.noteCloudbase": "已接入 CloudBase 实时数据库：提交通过后立即自动公开到 SolHub 社区列表，无需人工审核。托管工具以沙箱 iframe 隔离运行，无法访问主站数据。",
	"submit.noteNoReview": "提交内容会出现在 SolHub 社区列表（标注「社区提交」），不会伪造 Verified 核验状态；榜单精选位仍由人工核验后收录。",
	"submit.typeProduct": "提交产品",
	"submit.typeProductDesc": "网站、SaaS、AI 工具等",
	"submit.typeToolExternal": "提交工具（外链）",
	"submit.typeToolExternalDesc": "工具在你自己的网站运行",
	"submit.typeToolHosted": "托管工具",
	"submit.typeToolHostedDesc": "上传 HTML，本站沙箱内运行",
	"submit.name": "产品名称",
	"submit.nameTool": "工具名称",
	"submit.namePlaceholder": "例如：SolHub",
	"submit.nameToolPlaceholder": "例如：Markdown 编辑器",
	"submit.url": "产品官网 URL",
	"submit.urlTool": "工具访问 URL",
	"submit.urlHosted": "工具主页 URL",
	"submit.urlPlaceholder": "https://example.com",
	"submit.urlOptional": "可选",
	"submit.file": "工具 HTML 文件",
	"submit.fileHint": "≤ 1MB，仅 HTML",
	"submit.fileChoose": "选择文件",
	"submit.fileNone": "未选择文件",
	"submit.fileNote": "托管工具在沙箱 iframe 中运行：脚本受限、无法访问主站数据或存储。请只上传自包含的 HTML 工具（样式与逻辑写在同一个文件里，无需外部资源）。",
	"submit.shortDesc": "一句话介绍",
	"submit.shortDescPlaceholder": "用一句话说明它解决什么问题。",
	"submit.detailDesc": "详细描述",
	"submit.detailDescPlaceholder": "详细介绍：它是什么、为谁解决什么问题、有什么特点。",
	"submit.category": "分类",
	"submit.tags": "标签",
	"submit.tagsHint": "用逗号分隔，最多 8 个",
	"submit.tagsPlaceholder": "video, ai, free",
	"submit.icon": "图标 URL",
	"submit.developer": "开发者 / 团队名称",
	"submit.developerPlaceholder": "你的名字或团队名",
	"submit.contact": "联系方式",
	"submit.contactHint": "可选",
	"submit.contactPlaceholder": "邮箱 / 微信 / X 账号",
	"submit.preview": "预览提交内容",
	"submit.submitProduct": "提交产品",
	"submit.submitTool": "提交工具",
	"submit.submitHosted": "上传并公开工具",
	"submit.submitting": "提交中…",
	"submit.previewTitle": "提交预览",
	"submit.successTitle": "提交已处理",
	"submit.successCloudbase": "提交成功！「{name}」已自动公开到 SolHub 社区列表。{extra}",
	"submit.successHosted": "托管工具已部署，访问者可在本站沙箱内直接使用。",
	"submit.successNormal": "访问者现在就能看到它。",
	"submit.viewCommunity": "查看社区产品",
	"submit.githubSubmit": "在 GitHub 上完成提交",
	"submit.exportJson": "导出 JSON",
	"submit.copyJson": "复制 JSON",
	"submit.draftNote": "草稿只保存在当前浏览器，不会出现在 SolHub 公共页面。请务必导出 JSON 备份。",
	"submit.errorName": "请输入名称。",
	"submit.errorNameLong": "名称请控制在 80 字以内。",
	"submit.errorUrl": "请输入产品官网 URL。",
	"submit.errorUrlTool": "请输入工具访问 URL。",
	"submit.errorUrlFormat": "URL 需以 http:// 或 https:// 开头。",
	"submit.errorShortDesc": "请输入一句话介绍。",
	"submit.errorShortDescLong": "一句话介绍请控制在 200 字以内。",
	"submit.errorDesc": "请输入详细描述。",
	"submit.errorDescLong": "详细描述请控制在 2000 字以内。",
	"submit.errorTags": "至少填写一个标签（用逗号分隔）。",
	"submit.errorTagsMax": "标签最多 8 个。",
	"submit.errorIcon": "图标 URL 需以 http:// 或 https:// 开头。",
	"submit.errorDeveloper": "请输入开发者或团队名称。",
	"submit.errorDeveloperLong": "开发者名称请控制在 80 字以内。",
	"submit.errorFile": "请选择要托管的 HTML 文件。",
	"submit.errorFileSize": "HTML 文件不能超过 1MB。",
	"submit.errorFileType": "仅支持 HTML 文件（自包含工具页面）。",
	"submit.errorCloudbase": "CloudBase 提交失败：{msg}",
	"submit.errorCloudbaseNotConfigured": "CloudBase 未配置，无法提交。",
	"submit.errorUpload": "上传托管工具失败。",
	"submit.processTitle": "提交流程",
	"submit.process1": "填写信息并预览",
	"submit.process2": "选择类型：产品 / 工具外链 / 托管工具",
	"submit.process3": "提交即自动公开到社区列表",
	"submit.process4": "榜单精选位由 SolHub 人工核验后收录",
	"submit.verifyTitle": "核验与安全",
	"submit.verifyDesc": "社区提交自动公开但不会伪造 Verified 状态；Verified 仅授予实际核验通过的产品。托管工具在沙箱 iframe 中运行：脚本受限、无法访问主站数据；上传仅限 1MB 以内的自包含 HTML 文件。",
	"submit.localDraft": "本地草稿",
	"about.eyebrow": "关于",
	"about.title": "关于 SolHub",
	"about.subtitle": "发现 · 构建 · 分享 —— 一个由独立开发者构建、为独立开发者服务的产品发现平台与在线工具箱。",
	"about.whyTitle": "我们为什么做 SolHub",
	"about.why1": "独立开发者在产品发布后，常常缺少一个可信、克制的曝光渠道：大平台信息过载、榜单规则不透明、工具站充斥着「只有卡片没有功能」的摆设。SolHub 想提供一个不一样的选择——榜单规则透明可解释，核验状态真实，工具全部能实际使用。",
	"about.principlesTitle": "核心原则",
	"about.p1": "先把真实可用的功能做好，不追求空洞的功能数量。",
	"about.p2": "所有排名、核验状态和数据来源必须清晰，不使用虚构的访问量、用户数或投票数装饰页面。",
	"about.p3": "工具尽量在浏览器本地运行，不上传你的输入、图片或敏感数据。",
	"about.p4": "社区提交自动公开但绝不伪造核验：提交即公开到社区列表，但 Verified 状态只授予人工实际核验通过的产品。",
	"about.communityTitle": "社区提交",
	"about.community1": "SolHub 已接入 CloudBase（PostgreSQL）作为社区提交后端：任何人提交的产品 / 工具会自动公开到社区列表，无需人工审核；自包含 HTML 工具可以上传，在本站沙箱 iframe 中隔离运行。提交内容未经人工核验，请自行判断。榜单精选位仍由 SolHub 人工核验后收录。",
	"about.verificationTitle": "核验机制",
	"about.verification1": "SolHub 使用三种核验状态：Verified（已通过实际核验）、Pending（等待核验）、Unverified（尚未核验）。",
	"about.v1": "当前核验方式为人工核验：编辑实际访问产品官网，核对名称、描述与站点可访问性，并记录核验时间。",
	"about.v2": "不允许仅凭用户填写的信息、图片上传或点击按钮自动显示 Verified。",
	"about.v3": "自动核验（Meta Tag、文件验证、DNS TXT）已预留接口说明，但功能尚未启用。",
	"about.v4": "演示数据一律标记为 Unverified，并带有「演示数据」标识。",
	"about.rankingTitle": "榜单排序规则",
	"about.roadmapTitle": "路线图与已知限制",
	"about.roadmap1": "以下能力需要外部服务或后端支持，当前尚未接入：",
	"about.r1": "自动域名核验：Meta Tag / DNS TXT 核验需要后端验证服务，当前为人工核验。",
	"about.r2": "全局投票 / 收藏 / 评论 / 账号系统：需要真实用户体系；本地收藏目前保存在当前浏览器。",
	"about.r3": "社区提交的治理：自动公开模式下，隐藏违规内容需通过管理端操作（CloudBase 控制台或服务端 API）。",
	"about.teamTitle": "关于我们",
	"about.team1": "SolHub 由 SolYoung（独立创作者宋杨）构建与维护，与 SolYoung Studio 属于同一品牌体系。我们相信：真正有价值的产品和工具，值得被发现。",
	"about.submitCta": "提交你的产品",
	"about.verified": "已核验",
	"about.pending": "待核验",
	"about.unverified": "未核验",
	"about.verifiedText": "SolHub 编辑已实际访问该产品官网，核对产品名称、描述与站点可用性后标记为 Verified。核验不代表产品功能质量的保证，仅代表核验时点上的真实性与可访问性。",
	"about.pendingText": "该产品已进入 SolHub 核验队列，等待编辑实际核验。核验完成前不会显示 Verified 状态。",
	"about.unverifiedText": "该产品尚未通过 SolHub 核验。未核验不代表产品有问题，只是我们还没有实际确认过它的官网与描述。",
	"footer.tagline": "发现好产品，使用好工具，让独立创作更高效。",
	"footer.discover": "发现",
	"footer.launches": "产品发布榜单",
	"footer.tools": "免费在线工具箱",
	"footer.about": "关于 SolHub",
	"footer.privacy": "隐私说明",
	"footer.github": "GitHub 项目",
	"footer.copyright": "© {year} SolHub · 由 SolYoung 构建",
	"404.title": "页面不存在",
	"404.desc": "你访问的页面不存在或已被移动。",
	"404.backHome": "返回首页",
	"product.verification": "核验状态",
	"product.verifiedAt": "核验时间",
	"product.verificationMethod": "核验方式",
	"product.category": "分类",
	"product.tags": "标签",
	"product.developer": "开发者",
	"product.publishedAt": "收录时间",
	"product.batch": "发布批次",
	"product.visitSite": "访问官网",
	"product.related": "相关产品与工具",
	"product.relatedNone": "暂无相关条目",
	"product.demoNote": "演示数据不会被授予任何核验状态。",
	"product.submitCta": "想加入榜单？提交你的产品，通过核验后将获得 Verified 状态。当前核验为人工核验，自动核验（Meta Tag / DNS TXT）功能尚未启用。",
	"product.back": "返回榜单",
	"toolui.freeNote": "免费使用 · 浏览器本地运行",
	"toolui.howTitle": "使用方法",
	"toolui.limitsTitle": "功能限制与隐私",
	"toolui.faqTitle": "常见问题",
	"toolui.relatedTitle": "相关工具",
	"toolui.backAll": "返回工具箱",
	"toolui.breadcrumbHome": "首页",
	"toolui.breadcrumbTools": "工具",
	"toolui.copyOutput": "复制结果",
	"toolui.downloadOutput": "下载文件",
	"toolui.clearInput": "清空输入",
	"toolui.resetAll": "重置",
	"toolui.emptyHint": "请在左侧输入内容，结果会显示在这里。",
	"toolui.privacyLocal": "本工具在浏览器本地运行，输入内容不会上传到任何服务器。"
};
var en = {
	"common.open": "Open",
	"common.copy": "Copy",
	"common.copied": "Copied",
	"common.copyFailed": "Copy failed — select and copy manually",
	"common.download": "Download",
	"common.clear": "Clear",
	"common.reset": "Reset",
	"common.close": "Close",
	"common.optional": "Optional",
	"common.required": "Required",
	"common.free": "Free",
	"common.local": "Runs locally",
	"common.community": "Community",
	"common.visit": "Visit",
	"common.processing": "Processing…",
	"common.invalidInput": "Invalid input. Please check and retry.",
	"common.comingSoon": "Coming soon",
	"common.demo": "Demo",
	"common.by": "by",
	"nav.discover": "Discover",
	"nav.launches": "Launches",
	"nav.tools": "Tools",
	"nav.about": "About",
	"nav.search": "Search products & tools",
	"nav.searchPlaceholder": "Search products & tools…",
	"nav.submit": "Submit a Product",
	"nav.menuOpen": "Open menu",
	"nav.menuClose": "Close menu",
	"nav.mobileNav": "Mobile navigation",
	"nav.mainNav": "Main navigation",
	"nav.homeAria": "SolHub home",
	"search.aria": "Global search",
	"search.placeholder": "Search products & tools…",
	"search.clear": "Clear search",
	"search.hint": "Type a keyword to search products and tools.",
	"search.hintTips": "Try “json”, “qr”, “video” or “SolYoung”",
	"search.emptyTitle": "No results for “{q}”.",
	"search.emptyHint": "Try another keyword, or submit a product.",
	"search.tools": "Tools",
	"search.products": "Products",
	"search.demoNote": "(includes demo data)",
	"search.shortcut": "↑↓ select · Enter open · Esc close",
	"search.localNote": "All matching runs locally — search text never leaves your browser",
	"home.eyebrow": "SolHub · Discover · Build · Share",
	"home.title1": "Products worth discovering,",
	"home.title2": "tools worth using.",
	"home.subtitle1": "Explore what independent developers are building, and use simple, practical, free online tools",
	"home.subtitle2": "to bring every good idea to life faster.",
	"home.exploreProducts": "Explore Products",
	"home.exploreTools": "Explore Tools",
	"home.weekEyebrow": "This Week · Curated",
	"home.weekTitle": "This Week's Products",
	"home.weekDesc": "Products worth watching. Ranking is human-curated with verification priority; full rules on the Launches page.",
	"home.weekMore": "View full ranking",
	"home.toolsEyebrow": "Free Tools · Local",
	"home.toolsTitle": "Popular Online Tools",
	"home.toolsDesc": "All tools are free, no login required; data is processed locally in your browser.",
	"home.toolsMore": "View all tools",
	"home.catsEyebrow": "Categories",
	"home.catsTitle": "Find tools by purpose",
	"home.catsDesc": "Category counts are computed live from the tool registry.",
	"home.catsCount": "{n} tools",
	"home.newEyebrow": "Recently Added",
	"home.newTitle": "Newly Listed Products",
	"home.newDesc": "Products recently added to SolHub — all real, reachable sites.",
	"home.newMore": "Browse all",
	"home.communityTitle": "Latest Community Submissions",
	"home.ctaTitle": "Built a website, app or AI tool?",
	"home.ctaDesc": "Submit it to SolHub so more developers and users can discover it. Submissions go public instantly; or upload a self-contained HTML tool to run right here in a sandbox.",
	"home.ctaButton": "Submit a Product",
	"launches.eyebrow": "Launches",
	"launches.title": "Product Launches",
	"launches.desc": "Discover what independent developers are building. Every ranking has clear rules; verification status reflects SolHub's actual review. Community submissions go public instantly but are not human-reviewed.",
	"launches.communityTitle": "Community Products",
	"launches.communityNote": "Submitted by developers, auto-published · not human-reviewed, judge for yourself",
	"launches.submitHint": "Showing the latest {n} community submissions. Want to be listed? {link}.",
	"launches.submitLink": "Submit your product / tool",
	"launches.loading": "Loading community submissions…",
	"tools.eyebrow": "Tools",
	"tools.title": "Free Online Toolbox",
	"tools.desc": "Simple, practical, free. Every tool works immediately, no login needed; your input is processed locally in the browser and never uploaded.",
	"tools.all": "All",
	"tools.communityTitle": "Community Tools",
	"tools.openTool": "Open tool",
	"tools.externalTool": "Tool",
	"tools.hostedTool": "Hosted tool",
	"tools.noLink": "No link",
	"submit.eyebrow": "Launch",
	"submit.title": "Submit Your Product & Tools",
	"submit.desc": "Built a website, app or AI tool? Submit it to SolHub so more developers and users can discover it. Submissions go public instantly; self-contained HTML tools can be hosted and run in a sandbox right here.",
	"submit.noteTitle": "What happens after submitting",
	"submit.noteCloudbase": "Connected to a CloudBase realtime database: submissions appear publicly in SolHub's community feed instantly, no manual review. Hosted tools run in a sandboxed iframe, isolated from the main site.",
	"submit.noteNoReview": "Submissions appear in the community feed (marked “Community”), never faked as Verified; curated rankings stay human-verified.",
	"submit.typeProduct": "Submit Product",
	"submit.typeProductDesc": "Website, SaaS, AI tool, etc.",
	"submit.typeToolExternal": "Submit Tool (external)",
	"submit.typeToolExternalDesc": "Runs on your own site",
	"submit.typeToolHosted": "Hosted Tool",
	"submit.typeToolHostedDesc": "Upload HTML, run in sandbox here",
	"submit.name": "Product name",
	"submit.nameTool": "Tool name",
	"submit.namePlaceholder": "e.g. SolHub",
	"submit.nameToolPlaceholder": "e.g. Markdown editor",
	"submit.url": "Product website URL",
	"submit.urlTool": "Tool URL",
	"submit.urlHosted": "Tool homepage URL",
	"submit.urlPlaceholder": "https://example.com",
	"submit.urlOptional": "Optional",
	"submit.file": "Tool HTML file",
	"submit.fileHint": "≤ 1MB, HTML only",
	"submit.fileChoose": "Choose file",
	"submit.fileNone": "No file selected",
	"submit.fileNote": "Hosted tools run in a sandboxed iframe: scripts are restricted and cannot access SolHub data or storage. Upload a self-contained HTML tool only (styles and logic in one file, no external resources).",
	"submit.shortDesc": "One-line description",
	"submit.shortDescPlaceholder": "What problem does it solve, in one line?",
	"submit.detailDesc": "Detailed description",
	"submit.detailDescPlaceholder": "Describe it: what it is, who it's for, and what makes it special.",
	"submit.category": "Category",
	"submit.tags": "Tags",
	"submit.tagsHint": "Comma-separated, max 8",
	"submit.tagsPlaceholder": "video, ai, free",
	"submit.icon": "Icon URL",
	"submit.developer": "Developer / Team",
	"submit.developerPlaceholder": "Your name or team name",
	"submit.contact": "Contact",
	"submit.contactHint": "Optional",
	"submit.contactPlaceholder": "Email / WeChat / X handle",
	"submit.preview": "Preview submission",
	"submit.submitProduct": "Submit Product",
	"submit.submitTool": "Submit Tool",
	"submit.submitHosted": "Upload & Publish Tool",
	"submit.submitting": "Submitting…",
	"submit.previewTitle": "Submission preview",
	"submit.successTitle": "Submission processed",
	"submit.successCloudbase": "Success! “{name}” is now public in SolHub's community feed. {extra}",
	"submit.successHosted": "Your hosted tool is deployed and visitors can use it in the sandbox right here.",
	"submit.successNormal": "Visitors can see it now.",
	"submit.viewCommunity": "View community products",
	"submit.githubSubmit": "Complete on GitHub",
	"submit.exportJson": "Export JSON",
	"submit.copyJson": "Copy JSON",
	"submit.draftNote": "The draft stays only in this browser and never appears on SolHub's public pages. Export the JSON to keep a backup.",
	"submit.errorName": "Please enter a name.",
	"submit.errorNameLong": "Name must be 80 characters or fewer.",
	"submit.errorUrl": "Please enter the product website URL.",
	"submit.errorUrlTool": "Please enter the tool URL.",
	"submit.errorUrlFormat": "URL must start with http:// or https://.",
	"submit.errorShortDesc": "Please enter a one-line description.",
	"submit.errorShortDescLong": "Keep it to 200 characters or fewer.",
	"submit.errorDesc": "Please enter a detailed description.",
	"submit.errorDescLong": "Keep it to 2000 characters or fewer.",
	"submit.errorTags": "Add at least one tag (comma-separated).",
	"submit.errorTagsMax": "At most 8 tags.",
	"submit.errorIcon": "Icon URL must start with http:// or https://.",
	"submit.errorDeveloper": "Please enter the developer or team name.",
	"submit.errorDeveloperLong": "Developer name must be 80 characters or fewer.",
	"submit.errorFile": "Please choose the HTML file to host.",
	"submit.errorFileSize": "HTML file must not exceed 1MB.",
	"submit.errorFileType": "Only HTML files are supported (self-contained tool page).",
	"submit.errorCloudbase": "CloudBase submission failed: {msg}",
	"submit.errorCloudbaseNotConfigured": "CloudBase is not configured; cannot submit.",
	"submit.errorUpload": "Uploading the hosted tool failed.",
	"submit.processTitle": "Submission flow",
	"submit.process1": "Fill in details and preview",
	"submit.process2": "Pick a type: Product / Tool (external) / Hosted tool",
	"submit.process3": "Published to the community feed instantly",
	"submit.process4": "Curated ranking slots stay human-verified",
	"submit.verifyTitle": "Verification & safety",
	"submit.verifyDesc": "Community submissions are auto-published but never faked as Verified; Verified is granted only after actual review. Hosted tools run in a sandboxed iframe: scripts restricted, no access to main-site data; uploads limited to 1MB self-contained HTML.",
	"submit.localDraft": "Local draft",
	"about.eyebrow": "About",
	"about.title": "About SolHub",
	"about.subtitle": "Discover. Build. Share. — a product-discovery platform and online toolbox built by an indie developer, for indie developers.",
	"about.whyTitle": "Why we built SolHub",
	"about.why1": "After shipping, indie developers often lack a trustworthy, restrained channel for exposure: big platforms are noisy, rankings are opaque, and tool directories are full of cards without actual functionality. SolHub is a different option — transparent ranking rules, honest verification, and tools that actually work.",
	"about.principlesTitle": "Core principles",
	"about.p1": "Build real, working features first — never empty feature counts.",
	"about.p2": "Every ranking, verification state and data source must be clear — no fabricated traffic, users or votes to decorate pages.",
	"about.p3": "Tools run locally in the browser whenever possible — your input, images and sensitive data are never uploaded.",
	"about.p4": "Community submissions go public instantly but are never faked as verified — Verified is granted only after actual human review.",
	"about.communityTitle": "Community submissions",
	"about.community1": "SolHub uses CloudBase (PostgreSQL) as its community backend: anyone's product / tool is published to the community feed instantly, no manual review; self-contained HTML tools can be uploaded and run in a sandboxed iframe, isolated from the main site. Submissions are not human-reviewed — judge for yourself. Curated ranking slots remain human-verified.",
	"about.verificationTitle": "Verification",
	"about.verification1": "SolHub uses three verification states: Verified (actually reviewed), Pending (awaiting review), Unverified (not reviewed).",
	"about.v1": "Current method is manual review: an editor actually visits the site, checks the name, description and reachability, and records the timestamp.",
	"about.v2": "Verified is never granted automatically from form input, image uploads or button clicks.",
	"about.v3": "Automated verification (Meta Tag, file check, DNS TXT) is reserved but not enabled yet.",
	"about.v4": "Demo data is always marked Unverified with a “Demo” badge.",
	"about.rankingTitle": "Ranking rules",
	"about.roadmapTitle": "Roadmap & known limits",
	"about.roadmap1": "The following need external services or backend support and are not yet wired up:",
	"about.r1": "Automated domain verification: Meta Tag / DNS TXT needs a backend verification service; currently manual.",
	"about.r2": "Global voting / favorites / comments / accounts: needs a real user system; local favorites currently stay in this browser.",
	"about.r3": "Community moderation: with auto-publish, hiding violations requires admin-side action (CloudBase console or server API).",
	"about.teamTitle": "About us",
	"about.team1": "SolHub is built and maintained by SolYoung (independent creator Song Yang), part of the same brand family as SolYoung Studio. We believe: genuinely valuable products and tools deserve to be discovered.",
	"about.submitCta": "Submit your product",
	"about.verified": "Verified",
	"about.pending": "Pending",
	"about.unverified": "Unverified",
	"about.verifiedText": "A SolHub editor actually visited the product site, verified the name, description and reachability, then marked it Verified. Verification attests to authenticity and reachability at a point in time, not to feature quality.",
	"about.pendingText": "This product is in SolHub's review queue, awaiting actual verification. It won't show Verified until then.",
	"about.unverifiedText": "This product has not passed SolHub verification. Unverified doesn't mean something is wrong — we simply haven't confirmed its site and description yet.",
	"footer.tagline": "Discover good products, use good tools, make independent creation more efficient.",
	"footer.discover": "Discover",
	"footer.launches": "Product launches",
	"footer.tools": "Free online toolbox",
	"footer.about": "About SolHub",
	"footer.privacy": "Privacy",
	"footer.github": "GitHub project",
	"footer.copyright": "© {year} SolHub · Built by SolYoung",
	"404.title": "Page not found",
	"404.desc": "The page you're looking for doesn't exist or has moved.",
	"404.backHome": "Back to home",
	"product.verification": "Verification",
	"product.verifiedAt": "Verified at",
	"product.verificationMethod": "Method",
	"product.category": "Category",
	"product.tags": "Tags",
	"product.developer": "Developer",
	"product.publishedAt": "Listed",
	"product.batch": "Batch",
	"product.visitSite": "Visit website",
	"product.related": "Related products & tools",
	"product.relatedNone": "Nothing related yet",
	"product.demoNote": "Demo data never receives a verification state.",
	"product.submitCta": "Want to be listed? Submit your product; it earns Verified after passing actual review. Review is currently manual; automated checks (Meta Tag / DNS TXT) are not enabled yet.",
	"product.back": "Back to launches",
	"toolui.freeNote": "Free · runs locally in your browser",
	"toolui.howTitle": "How to use",
	"toolui.limitsTitle": "Limits & privacy",
	"toolui.faqTitle": "FAQ",
	"toolui.relatedTitle": "Related tools",
	"toolui.backAll": "Back to toolbox",
	"toolui.breadcrumbHome": "Home",
	"toolui.breadcrumbTools": "Tools",
	"toolui.copyOutput": "Copy result",
	"toolui.downloadOutput": "Download",
	"toolui.clearInput": "Clear input",
	"toolui.resetAll": "Reset",
	"toolui.emptyHint": "Type something on the left; the result appears here.",
	"toolui.privacyLocal": "This tool runs locally in your browser — input never leaves your device."
};
function getDict(locale) {
	return {
		...locale === "en" ? en : zh,
		...locale === "en" ? toolsEn : toolsZh
	};
}
function translate(dict, key, vars) {
	let text = dict[key] ?? key;
	if (vars) for (const [k, v] of Object.entries(vars)) text = text.replaceAll(`{${k}}`, String(v));
	return text;
}
//#endregion
//#region src/i18n/data.ts
var toolDescEn = {
	"json-formatter": "Format, minify and validate JSON, with exact parse-error locations.",
	"text-counter": "Real-time character, word and paragraph counts for Chinese and English.",
	"url-codec": "URL encode / decode with one click and clear feedback on bad input.",
	"base64-codec": "Base64 encode / decode with full UTF-8 (Chinese) and special-char support.",
	"uuid-generator": "Batch-generate UUID v4 with the Web Crypto API.",
	"password-generator": "Configurable strong-password generator that runs entirely on your device.",
	"timestamp-converter": "Convert Unix timestamps to dates and back, seconds or milliseconds, timezone-aware.",
	"utm-builder": "Build UTM tracking links that merge cleanly with existing query params.",
	"qr-generator": "Generate QR codes from text or URLs, resize and download as PNG.",
	"image-compressor": "Compress images locally in the browser with live size and ratio feedback.",
	"aspect-ratio-calculator": "Derive missing dimensions from width, height or ratio, with common presets.",
	"color-converter": "Convert between HEX, RGB and HSL with a live preview and one-click copy.",
	"robots-generator": "Build common robots.txt rules and copy the result.",
	"llms-generator": "Generate a clean llms.txt so LLMs can understand your site.",
	"jsonld-generator": "Generate JSON-LD for Organization, WebSite, SoftwareApplication and more.",
	"markdown-editor": "Split-pane Markdown editor with live preview, copy and download."
};
var toolNoteEn = {
	"json-formatter": "Everything runs locally in your browser — input is never uploaded.",
	"text-counter": "Word-count rules: English splits on spaces; Chinese counts consecutive characters. See the page notes.",
	"url-codec": "Uses encodeURIComponent / decodeURIComponent, covering UTF-8 Chinese and common special characters.",
	"base64-codec": "Non-ASCII text (e.g. Chinese) is UTF-8 encoded first; invalid input shows a clear error.",
	"uuid-generator": "Uses crypto.randomUUID() — no server involved.",
	"password-generator": "Uses the browser's native crypto.getRandomValues(). Passwords are never saved to the page, console or any server.",
	"timestamp-converter": "Times are shown in your local timezone with the offset; invalid input shows an error.",
	"utm-builder": "Existing query params on the target URL are merged, never overwritten.",
	"qr-generator": "Generated locally with a proven QR library — your image is never uploaded.",
	"image-compressor": "Images are processed entirely on-device. PNG transparency is flattened to a background color when exporting JPEG.",
	"aspect-ratio-calculator": "Leave either width or height blank to derive it from the ratio. All math is local.",
	"color-converter": "Invalid colors show a clear message. HEX accepts 3/6-digit and 8-digit (alpha) formats.",
	"robots-generator": "This generator only outputs the robots.txt text; search engines vary in which directives they honor.",
	"llms-generator": "llms.txt is a community-proposed format, not a search-engine standard — use it with judgment.",
	"jsonld-generator": "Results are validated as JSON right on the page; actual indexing depends on the search engine.",
	"markdown-editor": "Preview output is sanitized (DOMPurify) — untrusted scripts never execute."
};
var productCatEn = {
	"creator-space": {
		name: "Personal Digital Space",
		description: "Personal sites, portfolios and digital archives."
	},
	services: {
		name: "Design & Services",
		description: "Web building, branding and business collaboration services."
	},
	"ai-tools": {
		name: "AI Tools",
		description: "Products and tools powered by AI."
	},
	productivity: {
		name: "Productivity",
		description: "Products that help you get work done more efficiently."
	},
	"creator-tools": {
		name: "Creator Tools",
		description: "Gear for image, video and content creators."
	},
	"fun-tools": {
		name: "Fun Tools",
		description: "Tests, entertainment and light interactive products."
	},
	"growth-marketing": {
		name: "Growth & Marketing",
		description: "Acquisition, promotion and growth products."
	},
	"design-tools": {
		name: "Design Tools",
		description: "Visual and design products."
	}
};
var productShortEn = {
	solyoung: "A person who turns ideas into work — an ever-updated personal digital space.",
	"solyoung-studio": "AI-powered personal websites, digital spaces and lightweight product builds.",
	myos: "A local-first workspace for independent creators: capture → think → create → ship → archive.",
	verity: "13 personality tests in one place — pick one and start.",
	camsim: "Camera simulator: reverse-engineer aperture, shutter and ISO from the look you want."
};
var productDescEn = {
	solyoung: "SolYoung is the personal site of independent creator Song Yang (Sol Young): a digital-archive layout hosting a portfolio, an on-now timeline, essays and product entries. It's the home base of his personal brand, covering image work, AI practice and lightweight product development — continuously updated.",
	"solyoung-studio": "SolYoung Studio is a service site for creators, freelancers and small brands: from requirements and visual design to AI-assisted production and deployment, turning ideas into real, usable work, plus branding and collaboration entry points.",
	myos: "My.OS is an online personal creation system: records, inspiration, projects, now and archives in one entry point, reducing the anxiety of scattered ideas. Free to use.",
	verity: "Verity is an online collection of 13 personality tests behind one consistent entry point, with instant results. Free to use — for people who want to understand themselves quickly.",
	camsim: "CamSim is an interactive tool for photography beginners: tell it the look you want, get a reference set of aperture / shutter / ISO values. Free to use."
};
function toolDescription(slug, desc, locale) {
	if (locale === "en") return toolDescEn[slug] ?? desc;
	return desc;
}
function toolNote(slug, note, locale) {
	if (locale === "en" && note) return toolNoteEn[slug] ?? note;
	return note ?? "";
}
function productCategoryNameLocalized(slug, zhName, locale) {
	if (locale === "en") return productCatEn[slug]?.name ?? zhName;
	return zhName;
}
function productShortDescription(slug, zh, locale) {
	if (locale === "en") return productShortEn[slug] ?? zh;
	return zh;
}
function productDescription(slug, zh, locale) {
	if (locale === "en") return productDescEn[slug] ?? zh;
	return zh;
}
/** 翻译辅助：从 i18n 字典取词（页面组件统一入口） */
function t(locale, key, vars) {
	return translate(getDict(locale), key, vars);
}
var errMapEn = {
	"解码失败：输入包含非法的百分号编码（如不完整的 % 转义序列）。": "Decode failed: invalid percent-encoding (e.g. an incomplete % escape).",
	"密码长度需在 4–128 之间。": "Password length must be between 4 and 128.",
	"输入为空，请输入需要解码的 Base64 内容。": "Empty input — enter Base64 to decode.",
	"无法识别的颜色格式。支持 HEX、rgb(r,g,b)、hsl(h,s%,l%) 与常见颜色名。": "Unrecognized color. Supported: HEX, rgb(r,g,b), hsl(h,s%,l%) and common color names.",
	"网址需以 http:// 或 https:// 开头。": "URL must start with http:// or https://.",
	"网站网址需以 http:// 或 https:// 开头。": "Site URL must start with http:// or https://.",
	"生成的 JSON-LD 无法通过 JSON 解析。": "Generated JSON-LD is not valid JSON.",
	"无法序列化 JSON-LD（可能存在循环引用）。": "Could not serialize JSON-LD (possible circular reference).",
	"解析结果早于 Unix 纪元（1970-01-01），无法表示为时间戳。": "The date is before the Unix epoch (1970-01-01) and cannot be a timestamp.",
	"网站网址不是有效的 URL（需包含协议，如 https://example.com）。": "Site URL is not valid (needs a protocol, e.g. https://example.com).",
	"目标网址不是有效的 URL（需包含协议，例如 https://example.com/page）。": "Target URL is not valid (needs a protocol, e.g. https://example.com/page).",
	"网址不是有效的 URL。": "URL is not valid.",
	"宽度数值过大。": "Width is too large.",
	"尺寸必须为正数。": "Dimensions must be positive numbers.",
	"输入不是有效数字。": "Input is not a valid number.",
	"无法解析为有效日期。": "Could not parse as a valid date.",
	"至少选择一种字符类型。": "Select at least one character type.",
	"网站名称与网址为必填项。": "Site name and URL are required.",
	"请至少输入宽度、高度或比例中的一项。": "Enter at least one of width, height or ratio.",
	"已知条件不足：比例必须与宽度或高度中的至少一项同时给出。": "Not enough input: ratio must be paired with width or height.",
	"非法输入：Base64 只包含字母、数字、+、/ 与末尾的 = 填充符。": "Invalid input: Base64 only contains letters, digits, +, / and trailing = padding.",
	"HEX 需为 3、4、6 或 8 位十六进制（如 #E87028）。": "HEX must be 3, 4, 6 or 8 hex digits (e.g. #E87028).",
	"HSL 范围：H 0–360，S/L 0–100。": "HSL range: H 0–360, S/L 0–100.",
	"HSL 格式：hsl(24, 79%, 53%)。": "HSL format: hsl(24, 79%, 53%).",
	"RGB 数值需在 0–255 之间。": "RGB values must be 0–255.",
	"RGB 格式：rgb(232, 112, 40)，数值 0–255。": "RGB format: rgb(232, 112, 40), values 0–255.",
	"Source、Medium、Campaign 为必填项。": "Source, Medium and Campaign are required.",
	"请输入目标网址。": "Enter the target URL.",
	"无法解析日期。支持格式：YYYY-MM-DD HH:mm:ss、YYYY-MM-DD、ISO 8601（如 2026-10-16T12:00:00Z）。": "Could not parse the date. Supported: YYYY-MM-DD HH:mm:ss, YYYY-MM-DD, ISO 8601 (e.g. 2026-10-16T12:00:00Z).",
	"请输入时间戳。": "Enter a timestamp.",
	"名称不能为空。": "Name cannot be empty.",
	"网址不能为空。": "URL cannot be empty."
};
/** 展示层本地化纯逻辑错误文案（zh 原样返回，en 查映射，未知则原样） */
function localizeError(locale, message) {
	if (locale === "zh") return message;
	return errMapEn[message] ?? message;
}
//#endregion
//#region src/lib/search.ts
/**
* 全局搜索 —— 数据来自统一数据源（products.ts + tools.ts），
* 首页、导航搜索、榜单筛选共用同一份索引。locale 决定展示文案语言。
*/
function buildSearchIndex(products, tools, locale = "zh") {
	const productEntries = products.map((p) => ({
		kind: "product",
		slug: p.slug,
		name: p.name,
		description: `${productShortDescription(p.slug, p.shortDescription, locale)} ${productDescription(p.slug, p.description, locale)}`,
		category: p.category,
		categoryName: productCategoryNameLocalized(p.category, productCategoryName(p.category), locale),
		tags: p.tags,
		isDemo: p.isDemo
	}));
	return [...tools.filter((t) => t.isImplemented).map((t) => ({
		kind: "tool",
		slug: t.slug,
		name: t.name,
		description: toolDescription(t.slug, t.description, locale),
		category: t.category,
		categoryName: categoryName(t.category),
		tags: t.tags,
		keywords: t.keywords
	})), ...productEntries];
}
/** 简单的关键词评分匹配：名称命中 > 分类/标签/关键词命中 > 描述命中 */
function searchIndex(query, index, _locale) {
	const q = normalize(query);
	if (!q) return [];
	return index.map((entry) => ({
		entry,
		score: scoreEntry(entry, q)
	})).filter((r) => r.score > 0).sort((a, b) => b.score - a.score).map((r) => r.entry);
}
function normalize(s) {
	return s.trim().toLowerCase();
}
function scoreEntry(entry, q) {
	const name = normalize(entry.name);
	const desc = normalize(entry.description);
	const tags = entry.tags.map(normalize).join(" ");
	const cat = normalize(entry.categoryName);
	const keywords = (entry.keywords ?? []).map(normalize).join(" ");
	if (!`${name} ${desc} ${tags} ${cat} ${keywords}`.includes(q)) return 0;
	let score = 1;
	if (name.includes(q)) score += 3;
	if (name.startsWith(q)) score += 1;
	if (tags.includes(q) || cat.includes(q) || keywords.includes(q)) score += 2;
	return score;
}
//#endregion
//#region src/lib/utils.ts
function cx(...parts) {
	return parts.filter(Boolean).join(" ");
}
/** 客户端获取当前语言（按 URL 前缀判断；无 window 时默认 zh） */
function getLocale() {
	if (typeof window === "undefined") return "zh";
	const path = window.location.pathname;
	if (path.indexOf("/en/") !== -1 || path.endsWith("/en")) return "en";
	return "zh";
}
function isValidHttpUrl(value) {
	if (!value) return false;
	try {
		const u = new URL(value);
		return u.protocol === "http:" || u.protocol === "https:";
	} catch {
		return false;
	}
}
/** 格式化日期为 YYYY-MM-DD */
function formatDateIso(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
/** 格式化日期为中文友好格式：2026年10月16日 */
function formatDateZh(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}
/** 复制文本到剪贴板（带降级方案），返回是否成功 */
async function copyText(text) {
	if (navigator.clipboard && window.isSecureContext) try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {}
	try {
		const ta = document.createElement("textarea");
		ta.value = text;
		ta.setAttribute("readonly", "");
		ta.style.position = "fixed";
		ta.style.opacity = "0";
		document.body.appendChild(ta);
		ta.select();
		const ok = document.execCommand("copy");
		document.body.removeChild(ta);
		return ok;
	} catch {
		return false;
	}
}
//#endregion
//#region src/islands/HeaderApp.tsx
var API_BASE = "https://solhub-auth.solyoungwork.workers.dev";
function HeaderApp({ currentRoute, searchIndex, locale = "zh" }) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const dict = getDict(locale);
	const NAV = [
		{
			label: translate(dict, "nav.discover"),
			path: "/",
			match: (r) => r === "/"
		},
		{
			label: translate(dict, "nav.launches"),
			path: "/launches/",
			match: (r) => r.startsWith("/launches/")
		},
		{
			label: translate(dict, "nav.about"),
			path: "/about/",
			match: (r) => r.startsWith("/about/")
		}
	];
	useEffect(() => {
		const onOpen = () => setSearchOpen(true);
		window.addEventListener("solhub:open-search", onOpen);
		return () => window.removeEventListener("solhub:open-search", onOpen);
	}, []);
	useEffect(() => {
		const onKey = (e) => {
			if (e.key === "Escape") {
				setSearchOpen(false);
				setMenuOpen(false);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	useEffect(() => {
		if (searchOpen || menuOpen) {
			const prev = document.body.style.overflow;
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = prev;
			};
		}
	}, [searchOpen, menuOpen]);
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("header", {
		className: "sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "container-page flex h-14 items-center justify-between gap-2",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ jsx("button", {
						type: "button",
						className: "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] text-foreground hover:bg-secondary md:hidden",
						onClick: () => setMenuOpen((v) => !v),
						"aria-expanded": menuOpen,
						"aria-label": menuOpen ? "关闭菜单" : "打开菜单",
						children: menuOpen ? /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Menu, { className: "h-4 w-4" })
					}), /* @__PURE__ */ jsx(Logo, { locale })]
				}),
				/* @__PURE__ */ jsx("nav", {
					className: "hidden items-center gap-1 md:flex",
					"aria-label": translate(dict, "nav.mainNav"),
					children: NAV.map((item) => /* @__PURE__ */ jsx("a", {
						href: p(item.path, locale),
						"aria-current": item.match(currentRoute) ? "page" : void 0,
						className: cx("rounded-[2px] px-3 py-1.5 text-sm font-medium transition-colors", item.match(currentRoute) ? "bg-secondary text-foreground" : "text-foreground/70 hover:bg-secondary/60 hover:text-foreground"),
						children: item.label
					}, item.path))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setSearchOpen(true),
							className: "inline-flex h-8 w-8 items-center justify-center rounded-[2px] border border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground",
							"aria-label": "搜索",
							children: /* @__PURE__ */ jsx(Search, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "hidden sm:block",
							children: /* @__PURE__ */ jsx(AuthButton, { locale })
						}),
						/* @__PURE__ */ jsx("a", {
							href: p("/submit/", locale),
							className: "btn btn-accent hidden !h-8 px-2.5 sm:inline-flex !text-xs",
							children: translate(dict, "nav.submit")
						}),
						/* @__PURE__ */ jsx("span", {
							className: "mx-0.5 hidden h-4 w-px bg-border sm:block",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "hidden sm:flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(LangButton, {
								locale,
								currentRoute
							}), /* @__PURE__ */ jsx(ThemeButton, {})]
						})
					]
				})
			]
		}), searchOpen && /* @__PURE__ */ jsx(SearchDialog, {
			index: searchIndex,
			locale,
			onClose: () => setSearchOpen(false)
		})]
	}), menuOpen && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[90] md:hidden bg-black/30",
		onClick: () => setMenuOpen(false)
	}), /* @__PURE__ */ jsxs("div", {
		className: "fixed left-0 top-0 bottom-0 z-[100] md:hidden w-[280px] overflow-y-auto overscroll-contain shadow-2xl bg-[#f4f0e7] dark:bg-[#17140f] border-r border-border",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between px-5 pt-5 pb-4",
				children: [/* @__PURE__ */ jsx("span", {
					className: "font-display text-lg font-bold text-foreground",
					children: "SolHub"
				}), /* @__PURE__ */ jsx("button", {
					onClick: () => setMenuOpen(false),
					className: "p-1 text-muted-foreground hover:text-foreground",
					"aria-label": "Close menu",
					children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
				})]
			}),
			/* @__PURE__ */ jsx("nav", {
				className: "px-3 py-2",
				children: NAV.map((item) => /* @__PURE__ */ jsx("a", {
					href: p(item.path, locale),
					onClick: () => setMenuOpen(false),
					className: cx("flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium transition-colors", item.match(currentRoute) ? "text-accent bg-accent/10" : "text-foreground/80 hover:bg-secondary/60"),
					children: item.label
				}, item.path))
			}),
			/* @__PURE__ */ jsx("div", { className: "mx-5 my-3 border-t border-border/50" }),
			/* @__PURE__ */ jsxs("div", {
				className: "px-3 py-2",
				children: [
					/* @__PURE__ */ jsx("a", {
						href: p("/submit/", locale),
						onClick: () => setMenuOpen(false),
						className: "flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium text-foreground/80 hover:bg-secondary/60",
						children: translate(dict, "nav.submit")
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium text-foreground/80",
						children: /* @__PURE__ */ jsx(AuthButton, { locale })
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4 px-3 py-3",
						children: [/* @__PURE__ */ jsx(LangButton, {
							locale,
							currentRoute
						}), /* @__PURE__ */ jsx(ThemeButton, {})]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", { className: "mx-5 my-3 border-t border-border/50" }),
			/* @__PURE__ */ jsxs("div", {
				className: "mx-5 mb-6 rounded-xl border border-dashed border-accent/30 bg-accent/5 p-4",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-sm font-semibold text-foreground",
					children: "Feedback?"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-0.5 text-xs text-muted-foreground",
					children: "Bug, idea or suggestion — we read every one."
				})]
			})
		]
	})] })] });
}
function AuthButton({ locale }) {
	const [user, setUser] = useState(null);
	useEffect(() => {
		const ctrl = new AbortController();
		const timer = setTimeout(() => ctrl.abort(), 2500);
		fetch(`${API_BASE}/me`, {
			credentials: "include",
			signal: ctrl.signal
		}).then((r) => r.ok ? r.json() : null).then((d) => {
			if (d?.user?.login) setUser(d.user);
		}).catch(() => {}).finally(() => clearTimeout(timer));
		return () => ctrl.abort();
	}, []);
	if (user) return /* @__PURE__ */ jsxs("a", {
		href: p("/my-submissions/", locale),
		className: "inline-flex h-8 items-center gap-1.5 rounded-[2px] border border-border bg-card px-2 text-xs font-medium text-foreground/80 hover:border-foreground/30",
		children: [/* @__PURE__ */ jsx("img", {
			src: user.avatar_url,
			alt: "",
			className: "h-5 w-5 rounded-full"
		}), /* @__PURE__ */ jsx("span", {
			className: "hidden sm:inline",
			children: user.login
		})]
	});
	return /* @__PURE__ */ jsx("a", {
		href: `${API_BASE}/auth`,
		className: "inline-flex h-8 items-center rounded-[2px] border border-border bg-card px-3 text-xs font-medium text-foreground/80 hover:border-foreground/30",
		children: locale === "zh" ? "GitHub 登录" : "Sign in"
	});
}
function IconButton({ label, onClick, children, ariaPressed }) {
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		onClick,
		"aria-label": label,
		title: label,
		"aria-pressed": ariaPressed,
		className: "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] border border-border bg-card text-foreground/80 transition-colors hover:border-foreground/30 hover:text-foreground",
		children
	});
}
function LangButton({ locale, currentRoute }) {
	const other = locale === "zh" ? "en" : "zh";
	const target = p(currentRoute, other);
	return /* @__PURE__ */ jsx("a", {
		href: target,
		onClick: () => {
			try {
				localStorage.setItem("solhub:lang", other);
			} catch {}
		},
		"aria-label": other === "en" ? "Switch to English" : "切换到中文",
		title: other === "en" ? "Switch to English" : "切换到中文",
		className: "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] border border-border bg-card text-foreground/80 transition-colors hover:border-foreground/30 hover:text-foreground",
		children: /* @__PURE__ */ jsx(Languages, {
			className: "h-3.5 w-3.5",
			"aria-hidden": "true"
		})
	});
}
function ThemeButton() {
	const [dark, setDark] = useState(false);
	useEffect(() => {
		try {
			setDark(document.documentElement.classList.contains("dark"));
		} catch {}
	}, []);
	const toggle = () => {
		const next = !dark;
		setDark(next);
		const root = document.documentElement;
		root.classList.add("theme-transition");
		if (next) root.classList.add("dark");
		else root.classList.remove("dark");
		try {
			localStorage.setItem("solhub:theme", next ? "dark" : "light");
		} catch {}
		window.setTimeout(() => root.classList.remove("theme-transition"), 350);
	};
	return /* @__PURE__ */ jsx(IconButton, {
		label: dark ? "切换到浅色" : "切换到深色",
		onClick: toggle,
		ariaPressed: dark,
		children: dark ? /* @__PURE__ */ jsx(Sun, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(Moon, { className: "h-3.5 w-3.5" })
	});
}
function Logo({ locale = "zh" }) {
	return /* @__PURE__ */ jsxs("a", {
		href: p("/", locale),
		className: "inline-flex items-center leading-none",
		"aria-label": "SolHub",
		children: [/* @__PURE__ */ jsx("img", {
			src: "/solhub/solhub-mark.png",
			alt: "",
			width: 56,
			height: 56,
			className: "shrink-0"
		}), /* @__PURE__ */ jsx("span", {
			className: "font-display text-[20px] font-bold tracking-tight text-foreground",
			children: "SolHub"
		})]
	});
}
function SearchDialog({ index, locale, onClose }) {
	const [query, setQuery] = useState("");
	const [active, setActive] = useState(0);
	const inputRef = useRef(null);
	const [results, setResults] = useState([]);
	const dict = getDict(locale);
	useEffect(() => {
		inputRef.current?.focus();
	}, []);
	useEffect(() => {
		setResults(searchIndex(query, index, locale));
		setActive(0);
	}, [
		query,
		index,
		locale
	]);
	const onKeyDown = (e) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActive((a) => Math.min(a + 1, Math.max(results.length - 1, 0)));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActive((a) => Math.max(a - 1, 0));
		} else if (e.key === "Enter") {
			e.preventDefault();
			const t = results[active];
			if (t) window.location.href = t.kind === "tool" ? p(`/tools/${t.slug}/`, locale) : p(`/products/${t.slug}/`, locale);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-50 animate-fade-in",
		role: "dialog",
		"aria-modal": "true",
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute inset-0 bg-foreground/20 backdrop-blur-[2px]",
			onClick: onClose,
			"aria-hidden": "true"
		}), /* @__PURE__ */ jsx("div", {
			className: "absolute inset-x-0 top-0 mx-auto w-full max-w-2xl px-4 pt-16 sm:pt-24",
			children: /* @__PURE__ */ jsxs("div", {
				className: "animate-dialog-in overflow-hidden rounded-[4px] border border-border bg-card shadow-xl",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 border-b border-border px-4",
					children: [
						/* @__PURE__ */ jsx(Search, {
							className: "h-4 w-4 shrink-0 text-muted-foreground",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ jsx("input", {
							ref: inputRef,
							value: query,
							onChange: (e) => setQuery(e.target.value),
							onKeyDown,
							type: "text",
							placeholder: translate(dict, "search.placeholder"),
							className: "h-12 w-full bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
						}),
						query && /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setQuery(""),
							className: "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[2px] text-muted-foreground hover:bg-secondary",
							children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "max-h-[60vh] overflow-y-auto py-2",
					children: [query.trim() === "" && /* @__PURE__ */ jsx("p", {
						className: "px-4 py-8 text-center text-sm text-muted-foreground",
						children: translate(dict, "search.hint")
					}), results.map((r, i) => /* @__PURE__ */ jsxs("a", {
						href: r.kind === "tool" ? p(`/tools/${r.slug}/`, locale) : p(`/products/${r.slug}/`, locale),
						onMouseEnter: () => setActive(i),
						className: cx("mx-1.5 flex items-center justify-between gap-3 rounded-[2px] px-2.5 py-2", active === i ? "bg-secondary" : "hover:bg-secondary/50"),
						children: [/* @__PURE__ */ jsxs("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ jsx("span", {
								className: "block truncate text-sm font-medium text-foreground",
								children: r.name
							}), /* @__PURE__ */ jsx("span", {
								className: "block truncate text-xs text-muted-foreground",
								children: r.description
							})]
						}), /* @__PURE__ */ jsx("span", {
							className: "shrink-0 text-[11px] text-muted-foreground",
							children: r.categoryName
						})]
					}, r.slug))]
				})]
			})
		})]
	});
}
var $$Logo = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Logo;
	const { size = 72, withText = true } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<span class="inline-flex items-center leading-none" aria-label="SolHub"> <img${addAttribute(`/solhub/solhub-mark.png`, "src")} alt=""${addAttribute(size, "width")}${addAttribute(size, "height")} class="shrink-0 block"> ${withText && renderTemplate`<span class="font-display text-[32px] font-bold leading-none tracking-tight text-foreground">
SolHub
</span>`} </span>`;
}, "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/components/Logo.astro", void 0);
var $$Footer = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Footer;
	const { locale = "zh" } = Astro.props;
	const dict = getDict(locale);
	return renderTemplate`${maybeRenderHead($$result)}<footer class="border-t border-border bg-secondary/40"> <div class="container-page py-12"> <div class="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]"> <div> <a${addAttribute(p("/", locale), "href")} class="inline-block"> ${renderComponent($$result, "Logo", $$Logo, { "locale": locale })} </a> <p class="mt-4 max-w-xs text-sm leading-6 text-muted-foreground"> ${locale === "en" ? siteConfig.tagline : siteConfig.taglineZh} </p> <p class="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground/70"> ${siteConfig.tagline} </p> </div> <nav${addAttribute(locale === "en" ? "Product navigation" : "产品导航", "aria-label")}> <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"> ${translate(dict, "footer.discover")} </p> <ul class="mt-3 space-y-2 text-sm"> <li><a${addAttribute(p("/", locale), "href")} class="text-foreground/80 transition-colors hover:text-accent">${translate(dict, "footer.discover")}</a></li> <li><a${addAttribute(p("/launches/", locale), "href")} class="text-foreground/80 transition-colors hover:text-accent">${translate(dict, "footer.launches")}</a></li> </ul> </nav> <nav${addAttribute(locale === "en" ? "About" : "关于导航", "aria-label")}> <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About</p> <ul class="mt-3 space-y-2 text-sm"> <li><a${addAttribute(p("/about/", locale), "href")} class="text-foreground/80 transition-colors hover:text-accent">${translate(dict, "nav.about")}</a></li> <li><a${addAttribute(p("/privacy/", locale), "href")} class="text-foreground/80 transition-colors hover:text-accent">${translate(dict, "footer.privacy")}</a></li> <li><a${addAttribute(p("/submit/", locale), "href")} class="text-foreground/80 transition-colors hover:text-accent">${translate(dict, "nav.submit")}</a></li> </ul> </nav> <div> <p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Project</p> <ul class="mt-3 space-y-2 text-sm"> ${siteConfig.githubUrl && renderTemplate`<li> <a${addAttribute(siteConfig.githubUrl, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-foreground/80 transition-colors hover:text-accent"> ${locale === "en" ? "GitHub repo ↗" : "GitHub 仓库 ↗"} </a> </li>`} <li> <a${addAttribute(p("/about/#verification", locale), "href")} class="text-foreground/80 transition-colors hover:text-accent"> ${locale === "en" ? "Verification" : "核验机制说明"} </a> </li> <li> <a${addAttribute(p("/about/#roadmap", locale), "href")} class="text-foreground/80 transition-colors hover:text-accent"> ${locale === "en" ? "Roadmap & limits" : "路线图与限制"} </a> </li> </ul> </div> </div> <div class="mt-10 flex border-t border-border pt-6 text-xs text-muted-foreground"> <p> <a href="https://solyoung.top/" target="_blank" rel="noopener noreferrer" class="text-foreground/80 transition-colors hover:text-accent"> ${translate(dict, "footer.copyright", { year: siteConfig.copyrightYear })} </a> </p> </div> </div> </footer>`;
}, "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/components/Footer.astro", void 0);
var $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BaseLayout;
	const { title, description, route, ogType = "website", noIndex = false, locale = "zh" } = Astro.props;
	getDict(locale);
	const htmlLang = locale === "en" ? "en" : "zh-CN";
	const ogLocale = locale === "en" ? "en_US" : "zh_CN";
	const pageTitle = title === siteConfig.name ? title : `${title} · ${siteConfig.name}`;
	const canonical = absoluteUrl(route, locale);
	const searchIndex = buildSearchIndex(products, tools, locale);
	const currentRoute = stripBase(Astro.url.pathname);
	const orgJsonLd = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: siteConfig.name,
		url: absoluteUrl("/", locale),
		description: locale === "en" ? siteConfig.descriptionEn : siteConfig.description,
		inLanguage: locale === "en" ? "en" : "zh-CN"
	};
	return renderTemplate`<html${addAttribute(htmlLang, "lang")} class="theme-init"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="generator"${addAttribute(Astro.generator, "content")}><title>${pageTitle}</title><meta name="description"${addAttribute(description, "content")}>${noIndex && renderTemplate`<meta name="robots" content="noindex">`}<link rel="canonical"${addAttribute(canonical, "href")}><link rel="icon" type="image/png"${addAttribute(p("/favicon.png", locale), "href")}><meta name="solhub-base"${addAttribute(baseUrl(), "content")}><!-- 语言切换（alternate） --><link rel="alternate" hreflang="zh-CN"${addAttribute(absoluteUrl(route, "zh"), "href")}><link rel="alternate" hreflang="en"${addAttribute(absoluteUrl(route, "en"), "href")}><link rel="alternate" hreflang="x-default"${addAttribute(absoluteUrl(route, "zh"), "href")}><!-- Open Graph --><meta property="og:type"${addAttribute(ogType, "content")}><meta property="og:site_name"${addAttribute(siteConfig.name, "content")}><meta property="og:title"${addAttribute(pageTitle, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(canonical, "content")}><meta property="og:locale"${addAttribute(ogLocale, "content")}><meta name="twitter:card" content="summary"><meta name="twitter:title"${addAttribute(pageTitle, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><!-- 字体：与 SolYoung Studio 一致的 Archivo + Noto Sans SC --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@600&display=swap" rel="stylesheet"><!-- 首屏前恢复 主题 / 语言 / 视口 偏好（防止闪烁与错误语言停留） --><script>
      (function () {
        try {
          // 1) 主题：dark class + 过渡
          var savedTheme = localStorage.getItem("solhub:theme");
          var theme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
          if (theme === "dark") document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("theme-init");

          // 2) 视口模拟
          if (localStorage.getItem("solhub:viewport") === "mobile") {
            document.documentElement.classList.add("viewport-mobile");
          }

          // 3) 语言偏好：记住后自动跳转到对应语言版本（仅当路径不含目标语言前缀时）
          var savedLang = localStorage.getItem("solhub:lang");
          var base = (document.querySelector("meta[name='solhub-base']") || {}).getAttribute
            ? document.querySelector("meta[name='solhub-base']").getAttribute("content")
            : "";
          if (savedLang === "en" || savedLang === "zh") {
            var path = window.location.pathname;
            var hasEn = path.indexOf("/en/") !== -1 || path.endsWith("/en");
            var wantEn = savedLang === "en";
            if (wantEn !== hasEn) {
              // 构造目标路径
              if (wantEn) {
                // 当前 zh（无 /en/）→ 插入 /en/（跳过 base 前缀）
                var baseClean = base.replace(/\\/$/, "");
                var rest = baseClean && path.indexOf(baseClean) === 0 ? path.slice(baseClean.length) : path;
                var target = baseClean + "/en" + (rest === "/" ? "/" : rest);
                window.location.replace(target);
              } else {
                // 当前 en → 去掉 /en/
                var t2 = path.replace(/\\/en(\\/|$)/, "/");
                window.location.replace(t2);
              }
            }
          }
        } catch (e) { /* 忽略存储不可用 */ }
      })();
    <\/script><script type="application/ld+json">${unescapeHTML(JSON.stringify(orgJsonLd))}<\/script>${renderHead($$result)}</head> <body class="flex min-h-screen flex-col"> ${renderComponent($$result, "HeaderApp", HeaderApp, {
		"client:load": true,
		"currentRoute": currentRoute,
		"searchIndex": searchIndex,
		"locale": locale,
		"client:component-hydration": "load",
		"client:component-path": "@/islands/HeaderApp.tsx",
		"client:component-export": "default"
	})} <main class="flex-1"> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, { "locale": locale })} </body> </html>`;
}, "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/layouts/BaseLayout.astro", void 0);
//#endregion
export { getToolById as C, submissionConfig as D, siteConfig as E, createAstro as O, categoryName as S, products as T, getDict as _, formatDateZh as a, productCategoryName as b, buildSearchIndex as c, productCategoryNameLocalized as d, productDescription as f, toolNote as g, toolDescription as h, formatDateIso as i, createComponent as k, searchIndex as l, t as m, copyText as n, getLocale as o, productShortDescription as p, cx as r, isValidHttpUrl as s, $$BaseLayout as t, localizeError as u, translate as v, tools as w, categories as x, productCategories as y };
