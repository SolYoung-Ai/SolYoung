import { r as p, t as absoluteUrl } from "./paths_BlCYKCPI.mjs";
import { C as unescapeHTML, g as addAttribute, m as maybeRenderHead, o as renderComponent, p as renderTemplate } from "./server_Ciq-jqkO.mjs";
import { C as getToolById, O as createAstro, S as categoryName, _ as getDict, g as toolNote, h as toolDescription, k as createComponent, m as t, t as $$BaseLayout, u as localizeError, v as translate } from "./BaseLayout_BpPz4rCZ.mjs";
import { t as getIcon } from "./icons_BelbreN-.mjs";
import { a as ResetButton, i as Message, n as CopyButton, o as ResultBox, r as DownloadButton, s as ToolSection, t as ClearButton } from "./tool-ui_DR0XRhbO.mjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Braces, Download, ImagePlus, Plus, RefreshCw, Trash2, Upload } from "lucide-react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
import QRCode from "qrcode";
import { marked } from "marked";
import DOMPurify from "dompurify";
//#region src/components/ToolCard.astro
createAstro("https://solyoung.top");
var $$ToolCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ToolCard;
	const { tool, locale = "zh" } = Astro.props;
	const dict = getDict(locale);
	const Icon = getIcon(tool.icon);
	return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(p(`/tools/${tool.slug}/`, locale), "href")} class="card group flex h-full flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"> <div class="flex items-start justify-between gap-3"> <span class="flex h-10 w-10 items-center justify-center rounded-[3px] border border-border bg-secondary text-foreground/80 transition-colors group-hover:bg-accent group-hover:text-accent-foreground"> ${renderComponent($$result, "Icon", Icon, {
		"className": "h-5 w-5",
		"aria-hidden": "true"
	})} </span> <span class="badge border-success/30 bg-success/10 text-success">${translate(dict, "common.free")}</span> </div> <h3 class="font-display mt-3 text-[15px] font-bold text-foreground group-hover:text-accent"> ${tool.name} </h3> <p class="mt-1 line-clamp-2 flex-1 text-[13px] leading-5 text-muted-foreground"> ${toolDescription(tool.slug, tool.description, locale)} </p> <div class="mt-4 flex items-center justify-between border-t border-border pt-3"> <span class="text-[11px] text-muted-foreground">${categoryName(tool.category)}</span> <span class="inline-flex items-center gap-1 text-xs font-medium text-foreground/70 transition-all duration-150 group-hover:gap-2 group-hover:text-accent"> ${translate(dict, "tools.openTool")} <span aria-hidden="true">→</span> </span> </div> </a>`;
}, "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/components/ToolCard.astro", void 0);
//#endregion
//#region src/lib/tools/json.ts
function parseJsonWithError(input) {
	const trimmed = input.trim();
	if (!trimmed) return {
		ok: false,
		error: {
			message: "输入为空，请输入 JSON 内容。",
			line: 1,
			column: 1,
			offset: 0
		}
	};
	try {
		return {
			ok: true,
			value: JSON.parse(trimmed)
		};
	} catch (e) {
		const err = e;
		const posMatch = /position (\d+)/.exec(err.message);
		let offset = 0;
		if (posMatch) offset = Number(posMatch[1]);
		const { line, column } = offsetToLineColumn(trimmed, offset);
		return {
			ok: false,
			error: {
				message: describeJsonError(err.message, trimmed, offset),
				line,
				column,
				offset
			}
		};
	}
}
function offsetToLineColumn(text, offset) {
	const safe = Math.max(0, Math.min(offset, text.length));
	const lines = text.slice(0, safe).split("\n");
	return {
		line: lines.length,
		column: lines[lines.length - 1].length + 1
	};
}
function describeJsonError(raw, text, offset) {
	const clean = raw.replace(/ in JSON at position \d+$/, "").trim();
	let hint = "";
	if (offset < text.length) hint = `（附近内容：…${text.slice(Math.max(0, offset - 12), offset + 12).replace(/\n/g, "⏎")}…）`;
	return `${clean}${hint}`;
}
function formatJson(input, indent = 2) {
	const parsed = parseJsonWithError(input);
	if (!parsed.ok) return parsed;
	return {
		ok: true,
		output: JSON.stringify(parsed.value, null, indent)
	};
}
function minifyJson(input) {
	const parsed = parseJsonWithError(input);
	if (!parsed.ok) return parsed;
	return {
		ok: true,
		output: JSON.stringify(parsed.value)
	};
}
//#endregion
//#region src/islands/tools/JsonFormatter.tsx
function JsonFormatter({ locale = "zh" }) {
	getDict(locale);
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState(null);
	const [meta, setMeta] = useState("");
	const run = (mode) => {
		if (!input.trim()) {
			setError(t(locale, "tools.json-formatter.errEmpty"));
			setOutput("");
			setMeta("");
			return;
		}
		const result = mode === "format" ? formatJson(input) : minifyJson(input);
		if (!result.ok) {
			setError(t(locale, "tools.json-formatter.errParse", {
				line: result.error.line,
				col: result.error.column,
				msg: result.error.message
			}));
			setOutput("");
			setMeta("");
			return;
		}
		setError(null);
		setOutput(result.output);
		setMeta(t(locale, "tools.json-formatter.metaFormatted", {
			out: result.output.length,
			in: input.length
		}));
	};
	const handleValidate = () => {
		if (!input.trim()) {
			setError(t(locale, "tools.json-formatter.errEmpty"));
			return;
		}
		const result = parseJsonWithError(input);
		if (result.ok) {
			setError(null);
			setOutput("");
			setMeta(t(locale, "tools.json-formatter.metaValidated"));
		} else {
			setError(t(locale, "tools.json-formatter.errParse", {
				line: result.error.line,
				col: result.error.column,
				msg: result.error.message
			}));
			setOutput("");
			setMeta("");
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsx(ToolSection, {
				label: t(locale, "tools.json-formatter.inputLabel"),
				hint: t(locale, "tools.json-formatter.inputHint"),
				children: /* @__PURE__ */ jsx("textarea", {
					value: input,
					onChange: (e) => {
						setInput(e.target.value);
						setError(null);
					},
					rows: 10,
					spellCheck: false,
					placeholder: `{\n  "name": "SolHub",\n  "type": "product"\n}`,
					className: "input scroll-x w-full resize-y font-mono !text-[13px] leading-6",
					"aria-label": t(locale, "tools.json-formatter.inputAria")
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: () => run("format"),
						className: "btn btn-accent !h-8 px-3 text-xs",
						children: [
							/* @__PURE__ */ jsx(Braces, {
								className: "h-3.5 w-3.5",
								"aria-hidden": "true"
							}),
							" ",
							t(locale, "tools.json-formatter.formatBtn")
						]
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => run("minify"),
						className: "btn btn-outline !h-8 px-3 text-xs",
						children: t(locale, "tools.json-formatter.minifyBtn")
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: handleValidate,
						className: "btn btn-outline !h-8 px-3 text-xs",
						children: t(locale, "tools.json-formatter.validateBtn")
					}),
					/* @__PURE__ */ jsx(ClearButton, {
						onClick: () => {
							setInput("");
							setOutput("");
							setError(null);
							setMeta("");
						},
						disabled: !input
					}),
					/* @__PURE__ */ jsx(CopyButton, {
						getText: () => output,
						disabled: !output,
						className: "ml-auto"
					})
				]
			}),
			error && /* @__PURE__ */ jsx(Message, {
				tone: "error",
				children: error
			}),
			meta && /* @__PURE__ */ jsx(Message, {
				tone: "success",
				children: meta
			}),
			output && /* @__PURE__ */ jsx(ToolSection, {
				label: t(locale, "tools.json-formatter.outputLabel"),
				children: /* @__PURE__ */ jsx(ResultBox, { children: output })
			})
		]
	});
}
//#endregion
//#region src/lib/tools/text.ts
/**
* 统计规则（页面需要向用户说明）：
* - characters：全部字符数（含空格与换行）。
* - charactersNoSpaces：去除空格（U+0020 与全角空格）后的字符数，保留换行。
* - words：英文按空白分词；中文按连续汉字/中文标点边界计为「词」。
*   混合文本将两者相加。数字串视为一个词。
* - paragraphs：按空行分隔的段落数；全部为空白时段落数为 0。
* - lines：按换行分隔的行数；空文本为 0。
*/
function countText(input) {
	if (!input) return {
		characters: 0,
		charactersNoSpaces: 0,
		charactersNoWhitespace: 0,
		words: 0,
		paragraphs: 0,
		lines: 0
	};
	const characters = input.length;
	const charactersNoSpaces = input.replace(/[\u0020\u3000]/g, "").length;
	const charactersNoWhitespace = input.replace(/\s/g, "").length;
	const englishWords = input.split(/[\s\u3000]+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
	const chineseRuns = input.match(/[\u4e00-\u9fff\u3400-\u4dbf]+/g);
	return {
		characters,
		charactersNoSpaces,
		charactersNoWhitespace,
		words: englishWords + (chineseRuns ? chineseRuns.length : 0),
		paragraphs: input.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length > 0).length,
		lines: input === "" ? 0 : input.split("\n").length
	};
}
//#endregion
//#region src/islands/tools/TextCounter.tsx
function TextCounter({ locale = "zh" }) {
	getDict(locale);
	const [text, setText] = useState("");
	const stats = useMemo(() => countText(text), [text]);
	const RULES = [
		{
			labelKey: "statChars",
			key: "characters"
		},
		{
			labelKey: "statCharsNoSpace",
			key: "charactersNoSpaces"
		},
		{
			labelKey: "statCharsNoWs",
			key: "charactersNoWhitespace"
		},
		{
			labelKey: "statWords",
			key: "words"
		},
		{
			labelKey: "statParagraphs",
			key: "paragraphs"
		},
		{
			labelKey: "statLines",
			key: "lines"
		}
	];
	const labels = {
		statChars: t(locale, "tools.text-counter.statChars"),
		statCharsNoSpace: locale === "en" ? "Characters (no spaces)" : "字符（不含空格）",
		statCharsNoWs: locale === "en" ? "Characters (no whitespace)" : "字符（不含所有空白）",
		statWords: t(locale, "tools.text-counter.statWords"),
		statParagraphs: t(locale, "tools.text-counter.statParagraphs"),
		statLines: locale === "en" ? "Lines" : "行数"
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsx("textarea", {
				value: text,
				onChange: (e) => setText(e.target.value),
				rows: 12,
				placeholder: locale === "en" ? "Paste or type text here; stats update live…" : "在这里粘贴或输入文本，统计结果会实时更新…",
				className: "input scroll-x w-full resize-y !text-[15px] leading-7",
				"aria-label": t(locale, "tools.text-counter.inputAria")
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6",
					children: RULES.map((rule) => /* @__PURE__ */ jsxs("div", {
						className: "card px-3 py-2.5 text-center",
						children: [/* @__PURE__ */ jsx("p", {
							className: "font-display text-xl font-bold text-foreground",
							children: stats[rule.key].toLocaleString()
						}), /* @__PURE__ */ jsx("p", {
							className: "mt-0.5 text-[11px] text-muted-foreground",
							children: labels[rule.labelKey]
						})]
					}, rule.key))
				}), /* @__PURE__ */ jsx(ClearButton, {
					onClick: () => setText(""),
					disabled: !text
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-[3px] border border-border bg-secondary/40 p-4 text-[13px] leading-6 text-muted-foreground",
				children: [/* @__PURE__ */ jsx("p", {
					className: "font-semibold text-foreground/80",
					children: t(locale, "tools.text-counter.ruleTitle")
				}), /* @__PURE__ */ jsxs("ul", {
					className: "mt-1.5 list-disc space-y-1 pl-5",
					children: [
						/* @__PURE__ */ jsx("li", { children: locale === "en" ? "English counts words by whitespace; Chinese counts consecutive Han characters (e.g. 「你好世界」 = 1 Chinese word)." : "英文按空白分词统计词数；中文按连续汉字序列计数（如「你好世界」计 1 个中文词）。" }),
						/* @__PURE__ */ jsx("li", { children: locale === "en" ? "Mixed text sums English and Chinese word counts." : "混合中英文文本时，英文词数与中文词数相加。" }),
						/* @__PURE__ */ jsx("li", { children: locale === "en" ? "Paragraphs split on blank lines; empty whitespace-only text has 0 paragraphs." : "段落按空行分隔；全部为空白文本时段落数为 0。" }),
						/* @__PURE__ */ jsx("li", { children: locale === "en" ? "Everything is computed locally — your text never leaves your device." : "所有计算在浏览器本地完成，文本不会离开你的设备。" })
					]
				})]
			})
		]
	});
}
//#endregion
//#region src/lib/tools/url.ts
/** URL 编码 / 解码纯逻辑 */
function urlEncode(input) {
	return encodeURIComponent(input);
}
function urlDecode(input) {
	try {
		return {
			ok: true,
			output: decodeURIComponent(input)
		};
	} catch {
		return {
			ok: false,
			error: "解码失败：输入包含非法的百分号编码（如不完整的 % 转义序列）。"
		};
	}
}
//#endregion
//#region src/islands/tools/UrlCodec.tsx
function UrlCodec({ locale = "zh" }) {
	getDict(locale);
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState(null);
	const [mode, setMode] = useState("encode");
	const run = () => {
		if (!input.trim()) {
			setError(t(locale, "tools.url-codec.errEmpty"));
			setOutput("");
			return;
		}
		if (mode === "encode") {
			setOutput(urlEncode(input));
			setError(null);
		} else {
			const result = urlDecode(input);
			if (result.ok) {
				setOutput(result.output);
				setError(null);
			} else {
				setError(localizeError(locale, result.error));
				setOutput("");
			}
		}
	};
	const switchMode = () => {
		setMode((m) => m === "encode" ? "decode" : "encode");
		setInput("");
		setOutput("");
		setError(null);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx("span", {
					className: "badge border-border-strong bg-secondary text-foreground",
					children: mode === "encode" ? t(locale, "tools.url-codec.encodeBtn") : t(locale, "tools.url-codec.decodeBtn")
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: switchMode,
					className: "btn btn-ghost !h-7 px-2 text-xs",
					children: mode === "encode" ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
						locale === "en" ? "Switch to decode" : "切换为解码",
						" ",
						/* @__PURE__ */ jsx(ArrowRight, {
							className: "h-3 w-3",
							"aria-hidden": "true"
						})
					] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
						locale === "en" ? "Switch to encode" : "切换为编码",
						" ",
						/* @__PURE__ */ jsx(ArrowLeft, {
							className: "h-3 w-3",
							"aria-hidden": "true"
						})
					] })
				})]
			}),
			/* @__PURE__ */ jsx(ToolSection, {
				label: mode === "encode" ? locale === "en" ? "Plain text" : "原始文本" : locale === "en" ? "Encoded content" : "编码内容",
				children: /* @__PURE__ */ jsx("textarea", {
					value: input,
					onChange: (e) => {
						setInput(e.target.value);
						setError(null);
					},
					rows: 6,
					spellCheck: false,
					placeholder: mode === "encode" ? "例如：https://example.com/search?q=中文 与 特殊字符 &%#" : "例如：https%3A%2F%2Fexample.com%2Fsearch%3Fq%3D%E4%B8%AD%E6%96%87",
					className: "input scroll-x w-full resize-y font-mono !text-[13px] leading-6",
					"aria-label": t(locale, "tools.url-codec.inputLabel")
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: run,
						className: "btn btn-accent !h-8 px-3 text-xs",
						children: mode === "encode" ? t(locale, "tools.url-codec.encodeBtn") : t(locale, "tools.url-codec.decodeBtn")
					}),
					/* @__PURE__ */ jsx(ClearButton, {
						onClick: () => {
							setInput("");
							setOutput("");
							setError(null);
						},
						disabled: !input
					}),
					/* @__PURE__ */ jsx(CopyButton, {
						getText: () => output,
						disabled: !output,
						className: "ml-auto"
					})
				]
			}),
			error && /* @__PURE__ */ jsx(Message, {
				tone: "error",
				children: error
			}),
			output && /* @__PURE__ */ jsx(ToolSection, {
				label: t(locale, "tools.url-codec.outputLabel"),
				children: /* @__PURE__ */ jsx(ResultBox, { children: output })
			})
		]
	});
}
//#endregion
//#region src/lib/tools/base64.ts
/** Base64 编解码纯逻辑（支持 UTF-8 中文） */
function base64Encode(input) {
	const bytes = new TextEncoder().encode(input);
	let binary = "";
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
	return btoa(binary);
}
function base64Decode(input) {
	const cleaned = input.trim();
	if (!cleaned) return {
		ok: false,
		error: "输入为空，请输入需要解码的 Base64 内容。"
	};
	if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) return {
		ok: false,
		error: "非法输入：Base64 只包含字母、数字、+、/ 与末尾的 = 填充符。"
	};
	if (cleaned.length % 4 !== 0 && !cleaned.includes("=")) {}
	try {
		const binary = atob(cleaned);
		const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
		return {
			ok: true,
			output: new TextDecoder("utf-8", { fatal: true }).decode(bytes)
		};
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error && e.message.includes("fatal") ? "解码失败：内容不是有效的 UTF-8 文本（可能是二进制数据或使用了错误的编码）。" : "解码失败：输入不是有效的 Base64 内容。"
		};
	}
}
//#endregion
//#region src/islands/tools/Base64Codec.tsx
function Base64Codec({ locale = "zh" }) {
	getDict(locale);
	const [input, setInput] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState(null);
	const [mode, setMode] = useState("encode");
	const run = () => {
		if (!input.trim()) {
			setError(t(locale, "tools.base64-codec.errEmpty"));
			setOutput("");
			return;
		}
		if (mode === "encode") {
			setOutput(base64Encode(input));
			setError(null);
		} else {
			const result = base64Decode(input);
			if (result.ok) {
				setOutput(result.output);
				setError(null);
			} else {
				setError(localizeError(locale, result.error));
				setOutput("");
			}
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx("span", {
					className: "badge border-border-strong bg-secondary text-foreground",
					children: mode === "encode" ? "Encode (UTF-8)" : "Decode"
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => {
						setMode((m) => m === "encode" ? "decode" : "encode");
						setInput("");
						setOutput("");
						setError(null);
					},
					className: "btn btn-ghost !h-7 px-2 text-xs",
					children: locale === "en" ? "Switch" : "切换操作"
				})]
			}),
			/* @__PURE__ */ jsx(ToolSection, {
				label: mode === "encode" ? locale === "en" ? "Plain text (Chinese OK)" : "原始文本（支持中文）" : locale === "en" ? "Base64 content" : "Base64 内容",
				children: /* @__PURE__ */ jsx("textarea", {
					value: input,
					onChange: (e) => {
						setInput(e.target.value);
						setError(null);
					},
					rows: 6,
					spellCheck: false,
					placeholder: mode === "encode" ? "例如：你好，SolHub！" : "例如：5L2g5aW977yMU29sSHVi77yB",
					className: "input scroll-x w-full resize-y font-mono !text-[13px] leading-6",
					"aria-label": t(locale, "tools.base64-codec.inputLabel")
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: run,
						className: "btn btn-accent !h-8 px-3 text-xs",
						children: mode === "encode" ? t(locale, "tools.base64-codec.encodeBtn") : t(locale, "tools.base64-codec.decodeBtn")
					}),
					/* @__PURE__ */ jsx(ClearButton, {
						onClick: () => {
							setInput("");
							setOutput("");
							setError(null);
						},
						disabled: !input
					}),
					/* @__PURE__ */ jsx(CopyButton, {
						getText: () => output,
						disabled: !output,
						className: "ml-auto"
					})
				]
			}),
			error && /* @__PURE__ */ jsx(Message, {
				tone: "error",
				children: error
			}),
			output && /* @__PURE__ */ jsx(ToolSection, {
				label: locale === "en" ? "Result" : "结果",
				children: /* @__PURE__ */ jsx(ResultBox, { children: output })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-[3px] border border-border bg-secondary/40 p-4 text-[13px] leading-6 text-muted-foreground",
				children: [/* @__PURE__ */ jsx("p", {
					className: "font-semibold text-foreground/80",
					children: locale === "en" ? "Notes" : "说明"
				}), /* @__PURE__ */ jsxs("ul", {
					className: "mt-1.5 list-disc space-y-1 pl-5",
					children: [
						/* @__PURE__ */ jsx("li", { children: locale === "en" ? "Text is UTF-8 encoded first, so Chinese, emoji etc. encode correctly." : "编码前先将文本转为 UTF-8 字节，因此中文、emoji 等都能正确编码。" }),
						/* @__PURE__ */ jsx("li", { children: locale === "en" ? "Decoding uses strict UTF-8 validation: binary data or bad encoding shows a clear error." : "解码时使用严格 UTF-8 校验：二进制数据或错误编码会给出明确错误提示。" }),
						/* @__PURE__ */ jsx("li", { children: locale === "en" ? "Everything runs locally in your browser." : "所有处理在浏览器本地完成。" })
					]
				})]
			})
		]
	});
}
//#endregion
//#region src/lib/tools/uuid.ts
/** UUID 生成纯逻辑（基于 Web Crypto API） */
function generateUuidV4() {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
	const bytes = /* @__PURE__ */ new Uint8Array(16);
	crypto.getRandomValues(bytes);
	bytes[6] = bytes[6] & 15 | 64;
	bytes[8] = bytes[8] & 63 | 128;
	const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
function generateUuids(count) {
	const n = Math.max(1, Math.min(Math.floor(count), 5e3));
	return Array.from({ length: n }, () => generateUuidV4());
}
//#endregion
//#region src/islands/tools/UuidGenerator.tsx
function UuidGenerator({ locale = "zh" }) {
	getDict(locale);
	const [count, setCount] = useState(5);
	const [uuids, setUuids] = useState(() => generateUuids(5));
	const regenerate = () => {
		setUuids(generateUuids(count));
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsx(ToolSection, {
				label: t(locale, "tools.uuid-generator.countLabel"),
				hint: t(locale, "tools.uuid-generator.countHint"),
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ jsx("input", {
							type: "number",
							min: 1,
							max: 1e3,
							value: count,
							onChange: (e) => setCount(Math.max(1, Math.min(1e3, Number(e.target.value) || 1))),
							className: "input !w-28",
							"aria-label": t(locale, "tools.uuid-generator.countLabel")
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: regenerate,
							className: "btn btn-accent !h-8 px-3 text-xs",
							children: t(locale, "tools.uuid-generator.generateBtn")
						}),
						/* @__PURE__ */ jsx(ClearButton, {
							onClick: () => setUuids([]),
							disabled: uuids.length === 0
						}),
						/* @__PURE__ */ jsx(CopyButton, {
							getText: () => uuids.join("\n"),
							disabled: uuids.length === 0,
							className: "ml-auto"
						})
					]
				})
			}),
			uuids.length === 0 ? /* @__PURE__ */ jsx("div", {
				className: "card p-8 text-center text-sm text-muted-foreground",
				children: locale === "en" ? "No UUIDs yet. Set a count and click “Generate”." : "还没有生成的 UUID。设置数量后点击「生成」。"
			}) : /* @__PURE__ */ jsx(ToolSection, {
				label: locale === "en" ? "Result" : "结果",
				hint: `${uuids.length} · UUID v4`,
				children: /* @__PURE__ */ jsx(ResultBox, { children: uuids.join("\n") })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-[3px] border border-border bg-secondary/40 p-4 text-[13px] leading-6 text-muted-foreground",
				children: [/* @__PURE__ */ jsx("p", {
					className: "font-semibold text-foreground/80",
					children: locale === "en" ? "Notes" : "说明"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1.5",
					children: locale === "en" ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
						"Generated with the browser's ",
						/* @__PURE__ */ jsx("code", {
							className: "rounded-[2px] bg-secondary px-1 font-mono text-xs",
							children: "crypto.randomUUID()"
						}),
						" (Web Crypto API) — no network, no history."
					] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
						"使用浏览器 ",
						/* @__PURE__ */ jsx("code", {
							className: "rounded-[2px] bg-secondary px-1 font-mono text-xs",
							children: "crypto.randomUUID()"
						}),
						" ",
						"（Web Crypto API）生成，无需联网，不记录任何历史。"
					] })
				})]
			})
		]
	});
}
//#endregion
//#region src/lib/tools/password.ts
var UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var LOWER = "abcdefghijklmnopqrstuvwxyz";
var NUMBERS = "0123456789";
var SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?";
function generatePassword(options) {
	const length = Math.floor(options.length);
	if (!Number.isFinite(length) || length < 4 || length > 128) return {
		ok: false,
		error: "密码长度需在 4–128 之间。"
	};
	const pools = [];
	if (options.uppercase) pools.push(UPPER);
	if (options.lowercase) pools.push(LOWER);
	if (options.numbers) pools.push(NUMBERS);
	if (options.symbols) pools.push(SYMBOLS);
	if (pools.length === 0) return {
		ok: false,
		error: "至少选择一种字符类型。"
	};
	const all = pools.join("");
	const random = (max) => {
		const buf = /* @__PURE__ */ new Uint32Array(1);
		crypto.getRandomValues(buf);
		return buf[0] % max;
	};
	const chars = [];
	for (const pool of pools) chars.push(pool[random(pool.length)]);
	while (chars.length < length) chars.push(all[random(all.length)]);
	for (let i = chars.length - 1; i > 0; i--) {
		const j = random(i + 1);
		[chars[i], chars[j]] = [chars[j], chars[i]];
	}
	return {
		ok: true,
		password: chars.join("")
	};
}
//#endregion
//#region src/islands/tools/PasswordGenerator.tsx
function PasswordGenerator({ locale = "zh" }) {
	getDict(locale);
	const [options, setOptions] = useState({
		length: 16,
		uppercase: true,
		lowercase: true,
		numbers: true,
		symbols: true
	});
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const generate = () => {
		const result = generatePassword(options);
		if (result.ok) {
			setPassword(result.password);
			setError(null);
		} else setError(localizeError(locale, result.error));
	};
	const setOpt = (key, value) => {
		setOptions((o) => ({
			...o,
			[key]: value
		}));
		setError(null);
	};
	const toggle = (key) => {
		setOptions((o) => ({
			...o,
			[key]: !o[key]
		}));
		setError(null);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsxs(ToolSection, {
				label: t(locale, "tools.password-generator.lengthLabel"),
				hint: "4–128",
				children: [/* @__PURE__ */ jsx("input", {
					type: "range",
					min: 4,
					max: 128,
					value: options.length,
					onChange: (e) => setOpt("length", Number(e.target.value)),
					className: "w-full accent-[var(--color-accent)]",
					"aria-label": t(locale, "tools.password-generator.lengthLabel")
				}), /* @__PURE__ */ jsxs("p", {
					className: "mt-1 text-right font-mono text-sm text-foreground",
					children: [
						options.length,
						" ",
						locale === "en" ? "chars" : "位"
					]
				})]
			}),
			/* @__PURE__ */ jsx(ToolSection, {
				label: locale === "en" ? "Character set" : "字符集",
				children: /* @__PURE__ */ jsx("div", {
					className: "grid gap-2 sm:grid-cols-2",
					children: [
						["uppercase", t(locale, "tools.password-generator.includeUpper")],
						["lowercase", t(locale, "tools.password-generator.includeLower")],
						["numbers", t(locale, "tools.password-generator.includeDigits")],
						["symbols", t(locale, "tools.password-generator.includeSymbols")]
					].map(([key, label]) => /* @__PURE__ */ jsxs("label", {
						className: "flex cursor-pointer items-center gap-2.5 rounded-[2px] border border-border bg-card px-3 py-2.5 text-sm hover:bg-secondary/50",
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: options[key],
							onChange: () => toggle(key),
							className: "h-4 w-4 accent-[var(--color-accent)]"
						}), label]
					}, key))
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: generate,
						className: "btn btn-accent !h-8 px-3 text-xs",
						children: [
							/* @__PURE__ */ jsx(RefreshCw, {
								className: "h-3.5 w-3.5",
								"aria-hidden": "true"
							}),
							" ",
							t(locale, "tools.password-generator.generateBtn")
						]
					}),
					/* @__PURE__ */ jsx(ClearButton, {
						onClick: () => setPassword(""),
						disabled: !password
					}),
					/* @__PURE__ */ jsx(CopyButton, {
						getText: () => password,
						disabled: !password,
						className: "ml-auto"
					})
				]
			}),
			error && /* @__PURE__ */ jsx(Message, {
				tone: "error",
				children: error
			}),
			password && /* @__PURE__ */ jsx(ResultBox, {
				className: "!text-base !font-bold tracking-wider",
				children: password
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-[3px] border border-border bg-secondary/40 p-4 text-[13px] leading-6 text-muted-foreground",
				children: [/* @__PURE__ */ jsx("p", {
					className: "font-semibold text-foreground/80",
					children: locale === "en" ? "Security notes" : "安全说明"
				}), /* @__PURE__ */ jsxs("ul", {
					className: "mt-1.5 list-disc space-y-1 pl-5",
					children: [
						/* @__PURE__ */ jsx("li", { children: locale === "en" ? "Uses the browser's native crypto.getRandomValues() — not pseudo-random." : "使用浏览器原生安全随机数（crypto.getRandomValues），非伪随机。" }),
						/* @__PURE__ */ jsx("li", { children: locale === "en" ? "Passwords exist only in this page's memory — never saved locally, to console or any server." : "密码只在当前页面内存中生成，不会保存到本地、控制台或任何服务器。" }),
						/* @__PURE__ */ jsx("li", { children: locale === "en" ? "Refreshing the page clears the password — copy it now." : "刷新页面后密码即消失，请及时复制保存。" })
					]
				})]
			})
		]
	});
}
//#endregion
//#region src/lib/tools/timestamp.ts
/** 时间戳 → 日期。unit: "s" | "ms"。 */
function timestampToDate(input, unit) {
	const raw = input.trim();
	if (!raw) return {
		ok: false,
		error: "请输入时间戳。"
	};
	const num = Number(raw);
	if (!Number.isFinite(num)) return {
		ok: false,
		error: "输入不是有效数字。"
	};
	if (num < 0) return {
		ok: false,
		error: "时间戳不能为负数。"
	};
	const ms = unit === "s" ? num * 1e3 : num;
	const d = new Date(ms);
	if (Number.isNaN(d.getTime())) return {
		ok: false,
		error: "无法解析为有效日期。"
	};
	const offset = d.getTimezoneOffset();
	const tz = getTimezoneName();
	return {
		ok: true,
		result: {
			timestampMs: ms,
			isoLocal: d.toISOString().slice(0, 19).replace("T", " ") + localOffsetSuffix(offset),
			isoUtc: d.toISOString(),
			timezone: tz,
			timezoneOffsetMinutes: -offset
		}
	};
}
/** 日期时间字符串 → 时间戳（秒与毫秒）。支持 ISO 格式与常见本地格式。 */
function dateToTimestamp(input) {
	const raw = input.trim();
	if (!raw) return {
		ok: false,
		error: "请输入日期时间。"
	};
	const d = parseDateInput(raw);
	if (!d || Number.isNaN(d.getTime())) return {
		ok: false,
		error: "无法解析日期。支持格式：YYYY-MM-DD HH:mm:ss、YYYY-MM-DD、ISO 8601（如 2026-10-16T12:00:00Z）。"
	};
	const ms = d.getTime();
	if (ms < 0) return {
		ok: false,
		error: "解析结果早于 Unix 纪元（1970-01-01），无法表示为时间戳。"
	};
	return {
		ok: true,
		seconds: Math.floor(ms / 1e3),
		milliseconds: ms
	};
}
function parseDateInput(raw) {
	const localMatch = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/.exec(raw);
	if (localMatch) {
		const [, yStr, mStr, dStr, hStr = "0", minStr = "0", sStr = "0"] = localMatch;
		const y = Number(yStr);
		const m = Number(mStr);
		const d = Number(dStr);
		const h = Number(hStr);
		const min = Number(minStr);
		const s = Number(sStr);
		if (y < 1 || y > 9999 || m < 1 || m > 12 || d < 1 || d > 31 || h > 23 || min > 59 || s > 59) return null;
		const date = new Date(y, m - 1, d, h, min, s);
		if (date.getFullYear() !== y || date.getMonth() + 1 !== m || date.getDate() !== d || date.getHours() !== h || date.getMinutes() !== min || date.getSeconds() !== s) return null;
		return date;
	}
	const iso = new Date(raw);
	return Number.isNaN(iso.getTime()) ? null : iso;
}
function getTimezoneName() {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "本地时区";
	} catch {
		return "本地时区";
	}
}
function localOffsetSuffix(offsetMinutes) {
	const sign = offsetMinutes <= 0 ? "+" : "-";
	const abs = Math.abs(offsetMinutes);
	return ` (UTC${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")})`;
}
/** 当前时间戳（毫秒） */
function nowTimestampMs() {
	return Date.now();
}
//#endregion
//#region src/islands/tools/TimestampConverter.tsx
function TimestampConverter({ locale = "zh" }) {
	getDict(locale);
	const [tsInput, setTsInput] = useState("");
	const [unit, setUnit] = useState("s");
	const [dateResult, setDateResult] = useState("");
	const [dateError, setDateError] = useState(null);
	const [dateInput, setDateInput] = useState("");
	const [tsResult, setTsResult] = useState("");
	const [tsError, setTsError] = useState(null);
	const convertTs = () => {
		const r = timestampToDate(tsInput, unit);
		if (r.ok) {
			setDateError(null);
			setDateResult(locale === "en" ? `Local: ${r.result.isoLocal}\nUTC: ${r.result.isoUtc}\nTimezone: ${r.result.timezone} (UTC${r.result.timezoneOffsetMinutes >= 0 ? "+" : ""}${r.result.timezoneOffsetMinutes / 60})` : `本地时间：${r.result.isoLocal}\nUTC 时间：${r.result.isoUtc}\n时区：${r.result.timezone}（UTC${r.result.timezoneOffsetMinutes >= 0 ? "+" : ""}${r.result.timezoneOffsetMinutes / 60}）`);
		} else {
			setDateResult("");
			setDateError(localizeError(locale, r.error));
		}
	};
	const convertDate = () => {
		const r = dateToTimestamp(dateInput);
		if (r.ok) {
			setTsError(null);
			setTsResult(locale === "en" ? `Seconds (10 digits): ${r.seconds}\nMilliseconds (13 digits): ${r.milliseconds}` : `秒（10 位）：${r.seconds}\n毫秒（13 位）：${r.milliseconds}`);
		} else {
			setTsResult("");
			setTsError(localizeError(locale, r.error));
		}
	};
	const fillNow = () => {
		setUnit("ms");
		setTsInput(String(nowTimestampMs()));
		setDateInput("");
		setDateResult("");
		setDateError(null);
		setTsResult("");
		setTsError(null);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6 lg:grid-cols-2",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ jsxs(ToolSection, {
						label: locale === "en" ? "Timestamp → Date" : "时间戳 → 日期",
						hint: locale === "en" ? "Seconds (10) or milliseconds (13)" : "支持秒（10 位）与毫秒（13 位）",
						children: [/* @__PURE__ */ jsx("input", {
							type: "text",
							value: tsInput,
							onChange: (e) => setTsInput(e.target.value),
							placeholder: "例如：1739520000 或 1739520000000",
							className: "input font-mono !text-[13px]",
							"aria-label": t(locale, "tools.timestamp-converter.tsLabel")
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-2 flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "inline-flex rounded-[2px] border border-border bg-card p-0.5",
									role: "group",
									"aria-label": locale === "en" ? "Timestamp unit" : "时间戳单位",
									children: [["s", locale === "en" ? "sec" : "秒"], ["ms", locale === "en" ? "ms" : "毫秒"]].map(([key, label]) => /* @__PURE__ */ jsx("button", {
										type: "button",
										onClick: () => setUnit(key),
										"aria-pressed": unit === key,
										className: `rounded-[2px] px-2.5 py-1 text-xs font-medium transition-colors ${unit === key ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`,
										children: label
									}, key))
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: convertTs,
									className: "btn btn-accent !h-8 px-3 text-xs",
									children: locale === "en" ? "Convert" : "转换"
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: fillNow,
									className: "btn btn-ghost !h-8 px-3 text-xs",
									children: locale === "en" ? "Use now" : "使用当前时间"
								}),
								/* @__PURE__ */ jsx(CopyButton, {
									getText: () => dateResult,
									disabled: !dateResult,
									className: "ml-auto"
								})
							]
						})]
					}),
					dateError && /* @__PURE__ */ jsx(Message, {
						tone: "error",
						children: dateError
					}),
					dateResult && /* @__PURE__ */ jsx(ResultBox, { children: dateResult })
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ jsxs(ToolSection, {
						label: locale === "en" ? "Date → Timestamp" : "日期 → 时间戳",
						hint: locale === "en" ? "YYYY-MM-DD HH:mm:ss, ISO 8601" : "支持 YYYY-MM-DD HH:mm:ss、ISO 8601",
						children: [/* @__PURE__ */ jsx("input", {
							type: "text",
							value: dateInput,
							onChange: (e) => setDateInput(e.target.value),
							placeholder: "例如：2026-10-16 12:00:00",
							className: "input font-mono !text-[13px]",
							"aria-label": t(locale, "tools.timestamp-converter.dateLabel")
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-2 flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: convertDate,
								className: "btn btn-accent !h-8 px-3 text-xs",
								children: locale === "en" ? "Convert" : "转换"
							}), /* @__PURE__ */ jsx(CopyButton, {
								getText: () => tsResult,
								disabled: !tsResult,
								className: "ml-auto"
							})]
						})]
					}),
					tsError && /* @__PURE__ */ jsx(Message, {
						tone: "error",
						children: tsError
					}),
					tsResult && /* @__PURE__ */ jsx(ResultBox, { children: tsResult })
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-[3px] border border-border bg-secondary/40 p-4 text-[13px] leading-6 text-muted-foreground lg:col-span-2",
				children: [/* @__PURE__ */ jsx("p", {
					className: "font-semibold text-foreground/80",
					children: locale === "en" ? "Timezone notes" : "时区说明"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1.5",
					children: locale === "en" ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
						"Date → timestamp parses in the ",
						/* @__PURE__ */ jsx("strong", { children: "browser's local timezone" }),
						"; timestamp → date shows both local and UTC with the offset. All conversions happen locally."
					] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
						"日期 → 时间戳按",
						/* @__PURE__ */ jsx("strong", { children: "当前浏览器本地时区" }),
						"解析（即你所在时区的时间）；时间戳 → 日期同时显示本地时间与 UTC 时间，并标注时区偏移。转换在浏览器本地完成。"
					] })
				})]
			})
		]
	});
}
//#endregion
//#region src/lib/tools/utm.ts
function buildUtmUrl(baseUrl, params) {
	if (!baseUrl.trim()) return {
		ok: false,
		error: "请输入目标网址。"
	};
	let u;
	try {
		u = new URL(baseUrl.trim());
	} catch {
		return {
			ok: false,
			error: "目标网址不是有效的 URL（需包含协议，例如 https://example.com/page）。"
		};
	}
	if (u.protocol !== "http:" && u.protocol !== "https:") return {
		ok: false,
		error: "目标网址需以 http:// 或 https:// 开头。"
	};
	if (!params.source.trim() || !params.medium.trim() || !params.campaign.trim()) return {
		ok: false,
		error: "Source、Medium、Campaign 为必填项。"
	};
	u.searchParams.set("utm_source", params.source.trim());
	u.searchParams.set("utm_medium", params.medium.trim());
	u.searchParams.set("utm_campaign", params.campaign.trim());
	if (params.term?.trim()) u.searchParams.set("utm_term", params.term.trim());
	else u.searchParams.delete("utm_term");
	if (params.content?.trim()) u.searchParams.set("utm_content", params.content.trim());
	else u.searchParams.delete("utm_content");
	return {
		ok: true,
		url: u.toString()
	};
}
//#endregion
//#region src/islands/tools/UtmBuilder.tsx
function UtmBuilder({ locale = "zh" }) {
	getDict(locale);
	const [baseUrl, setBaseUrl] = useState("");
	const [fields, setFields] = useState({
		source: "",
		medium: "",
		campaign: "",
		term: "",
		content: ""
	});
	const [result, setResult] = useState("");
	const [error, setError] = useState(null);
	const setField = (key, value) => {
		setFields((f) => ({
			...f,
			[key]: value
		}));
		setError(null);
	};
	const build = () => {
		const r = buildUtmUrl(baseUrl, fields);
		if (r.ok) {
			setResult(r.url);
			setError(null);
		} else {
			setResult("");
			setError(localizeError(locale, r.error));
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6 lg:grid-cols-[1.2fr_1fr]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsx(ToolSection, {
					label: t(locale, "tools.utm-builder.targetLabel"),
					hint: locale === "en" ? "Required" : "必填",
					children: /* @__PURE__ */ jsx("input", {
						type: "url",
						value: baseUrl,
						onChange: (e) => setBaseUrl(e.target.value),
						placeholder: "https://example.com/product",
						className: "input font-mono !text-[13px]",
						"aria-label": t(locale, "tools.utm-builder.targetLabel")
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ jsx(ToolSection, {
							label: "Source",
							hint: locale === "en" ? "Required · e.g. google" : "必填 · 流量来源，如 google",
							children: /* @__PURE__ */ jsx("input", {
								type: "text",
								value: fields.source,
								onChange: (e) => setField("source", e.target.value),
								placeholder: "google",
								className: "input",
								"aria-label": "Source"
							})
						}),
						/* @__PURE__ */ jsx(ToolSection, {
							label: "Medium",
							hint: locale === "en" ? "Required · e.g. cpc" : "必填 · 媒介，如 cpc",
							children: /* @__PURE__ */ jsx("input", {
								type: "text",
								value: fields.medium,
								onChange: (e) => setField("medium", e.target.value),
								placeholder: "cpc",
								className: "input",
								"aria-label": "Medium"
							})
						}),
						/* @__PURE__ */ jsx(ToolSection, {
							label: "Campaign",
							hint: locale === "en" ? "Required · campaign name" : "必填 · 活动名",
							children: /* @__PURE__ */ jsx("input", {
								type: "text",
								value: fields.campaign,
								onChange: (e) => setField("campaign", e.target.value),
								placeholder: "summer-launch",
								className: "input",
								"aria-label": "Campaign"
							})
						}),
						/* @__PURE__ */ jsx(ToolSection, {
							label: "Term",
							hint: locale === "en" ? "Optional · keyword" : "可选 · 关键词",
							children: /* @__PURE__ */ jsx("input", {
								type: "text",
								value: fields.term,
								onChange: (e) => setField("term", e.target.value),
								placeholder: "best-tool",
								className: "input",
								"aria-label": "Term"
							})
						}),
						/* @__PURE__ */ jsx(ToolSection, {
							label: "Content",
							hint: locale === "en" ? "Optional · distinguishes links" : "可选 · 区分同活动内链接",
							children: /* @__PURE__ */ jsx("input", {
								type: "text",
								value: fields.content,
								onChange: (e) => setField("content", e.target.value),
								placeholder: "banner-a",
								className: "input",
								"aria-label": "Content"
							})
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: build,
							className: "btn btn-accent !h-8 px-3 text-xs",
							children: locale === "en" ? "Build link" : "生成链接"
						}),
						/* @__PURE__ */ jsx(ClearButton, {
							onClick: () => {
								setBaseUrl("");
								setFields({
									source: "",
									medium: "",
									campaign: "",
									term: "",
									content: ""
								});
								setResult("");
								setError(null);
							},
							disabled: !baseUrl && !fields.source
						}),
						/* @__PURE__ */ jsx(CopyButton, {
							getText: () => result,
							disabled: !result,
							className: "ml-auto"
						})
					]
				}),
				error && /* @__PURE__ */ jsx(Message, {
					tone: "error",
					children: error
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ jsx(ToolSection, {
				label: locale === "en" ? "Generated link" : "生成的链接",
				children: result ? /* @__PURE__ */ jsx(ResultBox, { children: result }) : /* @__PURE__ */ jsx("div", {
					className: "card p-6 text-center text-sm text-muted-foreground",
					children: locale === "en" ? "Fill the fields on the left and click “Build link”." : "填写左侧字段后点击「生成链接」。"
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "rounded-[3px] border border-border bg-secondary/40 p-4 text-[13px] leading-6 text-muted-foreground",
				children: [/* @__PURE__ */ jsx("p", {
					className: "font-semibold text-foreground/80",
					children: locale === "en" ? "Notes" : "说明"
				}), /* @__PURE__ */ jsxs("ul", {
					className: "mt-1.5 list-disc space-y-1 pl-5",
					children: [/* @__PURE__ */ jsx("li", { children: locale === "en" ? "Existing query params on the target URL are kept; UTM params are appended." : "目标网址已有的查询参数会完整保留，UTM 参数自动追加。" }), /* @__PURE__ */ jsx("li", { children: locale === "en" ? "The result works with Google Analytics and similar platforms." : "生成的链接便于在 Google Analytics 等平台统计活动来源。" })]
				})]
			})]
		})]
	});
}
//#endregion
//#region src/islands/tools/QrGenerator.tsx
function QrGenerator({ locale = "zh" }) {
	getDict(locale);
	const [text, setText] = useState("");
	const [size, setSize] = useState(256);
	const [error, setError] = useState(null);
	const canvasRef = useRef(null);
	const generate = async () => {
		const content = text.trim();
		if (!content) {
			setError(t(locale, "tools.qr-generator.errEmpty"));
			return;
		}
		if (content.length > 2953) {
			setError(locale === "en" ? "Content too long (over 2953 chars) to encode as QR." : "内容过长（超过 2953 个字符），无法生成二维码。");
			return;
		}
		setError(null);
		try {
			await QRCode.toCanvas(canvasRef.current, content, {
				width: size,
				margin: 2,
				errorCorrectionLevel: "M",
				color: {
					dark: "#1d1a15",
					light: "#ffffff"
				}
			});
		} catch {
			setError(locale === "en" ? "QR generation failed: the content may contain unencodable characters." : "二维码生成失败：内容可能包含无法编码的字符。");
		}
	};
	const downloadPng = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const a = document.createElement("a");
		a.href = canvas.toDataURL("image/png");
		a.download = "solhub-qrcode.png";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};
	useEffect(() => {
		if (text.trim()) generate();
	}, [size]);
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6 lg:grid-cols-[1.2fr_1fr]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsx(ToolSection, {
					label: t(locale, "tools.qr-generator.inputLabel"),
					hint: locale === "en" ? "max 2953 chars" : "最多 2953 字符",
					children: /* @__PURE__ */ jsx("textarea", {
						value: text,
						onChange: (e) => {
							setText(e.target.value);
							setError(null);
						},
						rows: 5,
						placeholder: locale === "en" ? "Enter text or URL, e.g. https://solyoung.top" : "输入文本或网址，例如 https://solyoung.top",
						className: "input scroll-x w-full resize-y !text-[14px] leading-6",
						"aria-label": locale === "en" ? "QR content" : "二维码内容"
					})
				}),
				/* @__PURE__ */ jsx(ToolSection, {
					label: t(locale, "tools.qr-generator.sizeLabel"),
					hint: `${locale === "en" ? "current" : "当前"} ${size}px`,
					children: /* @__PURE__ */ jsx("input", {
						type: "range",
						min: 128,
						max: 1024,
						step: 32,
						value: size,
						onChange: (e) => setSize(Number(e.target.value)),
						className: "w-full accent-[var(--color-accent)]",
						"aria-label": locale === "en" ? "QR size" : "二维码尺寸"
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => void generate(),
							className: "btn btn-accent !h-8 px-3 text-xs",
							children: locale === "en" ? "Generate QR" : "生成二维码"
						}),
						/* @__PURE__ */ jsx(ClearButton, {
							onClick: () => {
								setText("");
								setError(null);
								const canvas = canvasRef.current;
								if (canvas) canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
							},
							disabled: !text
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: downloadPng,
							disabled: !text.trim(),
							className: "btn btn-outline !h-8 px-3 text-xs",
							children: locale === "en" ? "Download PNG" : "下载 PNG"
						}),
						/* @__PURE__ */ jsx(CopyButton, {
							getText: () => text,
							disabled: !text,
							className: "ml-auto"
						})
					]
				}),
				error && /* @__PURE__ */ jsx(Message, {
					tone: "error",
					children: error
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ jsx(ToolSection, {
				label: locale === "en" ? "Preview" : "预览",
				children: /* @__PURE__ */ jsx("div", {
					className: "card flex min-h-[280px] items-center justify-center p-6",
					children: /* @__PURE__ */ jsx("canvas", {
						ref: canvasRef,
						className: "max-h-[360px] max-w-full rounded-[2px] border border-border bg-white",
						"aria-label": locale === "en" ? "QR preview" : "二维码预览"
					})
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "rounded-[3px] border border-border bg-secondary/40 p-4 text-[13px] leading-6 text-muted-foreground",
				children: [/* @__PURE__ */ jsx("p", {
					className: "font-semibold text-foreground/80",
					children: locale === "en" ? "Notes" : "说明"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1.5",
					children: locale === "en" ? "Generated locally with the proven “qrcode” library — content never leaves your browser." : "使用成熟的 QR 编码库（qrcode）在浏览器本地生成，内容不会上传到任何服务器。"
				})]
			})]
		})]
	});
}
//#endregion
//#region src/islands/tools/ImageCompressor.tsx
function ImageCompressor({ locale = "zh" }) {
	getDict(locale);
	const [file, setFile] = useState(null);
	const [quality, setQuality] = useState(80);
	const [format, setFormat] = useState("auto");
	const [state, setState] = useState(null);
	const [error, setError] = useState(null);
	const [busy, setBusy] = useState(false);
	const inputRef = useRef(null);
	const compress = async (f) => {
		if (!/^image\/(png|jpe?g|webp|gif|avif|bmp)/i.test(f.type) && !/\.(png|jpe?g|webp|gif|avif|bmp)$/i.test(f.name)) {
			setError(locale === "en" ? "Please choose a common image format (PNG / JPEG / WebP / GIF etc.)." : "请选择常见图片格式（PNG / JPEG / WebP / GIF 等）。");
			return;
		}
		setBusy(true);
		setError(null);
		try {
			const img = await loadImage(await readAsDataURL(f));
			const canvas = document.createElement("canvas");
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			const ctx = canvas.getContext("2d");
			if (!ctx) throw new Error("canvas");
			const outMime = format === "jpeg" ? "image/jpeg" : format === "webp" ? "image/webp" : format === "png" ? "image/png" : f.type === "image/png" ? "image/png" : "image/jpeg";
			if (outMime === "image/jpeg" || outMime === "image/webp") {
				ctx.fillStyle = "#ffffff";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			}
			ctx.drawImage(img, 0, 0);
			const blob = await canvasToBlob(canvas, outMime, quality / 100);
			if (!blob) {
				setError(locale === "en" ? "Compression failed: your browser can't output that format." : "压缩失败：浏览器无法以所选格式输出。");
				setBusy(false);
				return;
			}
			const outputUrl = URL.createObjectURL(blob);
			if (state?.outputUrl) URL.revokeObjectURL(state.outputUrl);
			const ext = outMime === "image/jpeg" ? "jpg" : outMime === "image/webp" ? "webp" : "png";
			setState({
				name: `${f.name.replace(/\.[^.]+$/, "")}-compressed.${ext}`,
				originalSize: f.size,
				outputSize: blob.size,
				outputUrl,
				outputBlob: blob,
				width: img.naturalWidth,
				height: img.naturalHeight
			});
		} catch {
			setError(locale === "en" ? "Image processing failed: the image may be corrupted or too large." : "图片处理失败：图片可能已损坏或尺寸过大。");
		} finally {
			setBusy(false);
		}
	};
	const download = () => {
		if (!state) return;
		const a = document.createElement("a");
		a.href = state.outputUrl;
		a.download = state.name;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};
	const ratio = state ? Math.max(0, Math.round((1 - state.outputSize / state.originalSize) * 100)) : 0;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "card flex cursor-pointer flex-col items-center justify-center gap-2 border-dashed p-8 text-center transition-colors hover:bg-secondary/40",
				onClick: () => inputRef.current?.click(),
				onDragOver: (e) => e.preventDefault(),
				onDrop: (e) => {
					e.preventDefault();
					const f = e.dataTransfer.files?.[0];
					if (f) {
						setFile(f);
						compress(f);
					}
				},
				role: "button",
				tabIndex: 0,
				onKeyDown: (e) => {
					if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
				},
				"aria-label": locale === "en" ? "Choose or drop an image" : "选择或拖入图片",
				children: [
					/* @__PURE__ */ jsx(Upload, {
						className: "h-6 w-6 text-muted-foreground",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm font-medium text-foreground",
						children: locale === "en" ? "Click to choose an image, or drop it here" : "点击选择图片，或拖拽到此处"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-xs text-muted-foreground",
						children: locale === "en" ? "PNG / JPEG / WebP / GIF supported — image never leaves your device" : "支持 PNG / JPEG / WebP / GIF，图片不会上传"
					}),
					/* @__PURE__ */ jsx("input", {
						ref: inputRef,
						type: "file",
						accept: "image/png,image/jpeg,image/webp,image/gif,image/avif,image/bmp",
						className: "hidden",
						onChange: (e) => {
							const f = e.target.files?.[0];
							if (f) {
								setFile(f);
								compress(f);
							}
						}
					})
				]
			}),
			file && /* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ jsx(ToolSection, {
					label: locale === "en" ? "Output format" : "输出格式",
					hint: locale === "en" ? "auto keeps source format" : "auto 保留源格式",
					children: /* @__PURE__ */ jsxs("select", {
						value: format,
						onChange: (e) => setFormat(e.target.value),
						className: "input",
						"aria-label": locale === "en" ? "Output format" : "输出格式",
						children: [
							/* @__PURE__ */ jsx("option", {
								value: "auto",
								children: locale === "en" ? "Auto (keep source format)" : "自动（保留源格式）"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "jpeg",
								children: locale === "en" ? "JPEG (no transparency)" : "JPEG（无透明通道）"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "webp",
								children: "WebP"
							}),
							/* @__PURE__ */ jsx("option", {
								value: "png",
								children: locale === "en" ? "PNG (keeps transparency)" : "PNG（保留透明）"
							})
						]
					})
				}), /* @__PURE__ */ jsx(ToolSection, {
					label: t(locale, "tools.image-compressor.qualityLabel"),
					hint: `${quality}%`,
					children: /* @__PURE__ */ jsx("input", {
						type: "range",
						min: 10,
						max: 100,
						value: quality,
						onChange: (e) => setQuality(Number(e.target.value)),
						className: "w-full accent-[var(--color-accent)]",
						"aria-label": locale === "en" ? "Compression quality" : "压缩质量"
					})
				})]
			}),
			file && /* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => void compress(file),
					disabled: busy,
					className: "btn btn-accent !h-8 px-3 text-xs",
					children: [
						/* @__PURE__ */ jsx(ImagePlus, {
							className: "h-3.5 w-3.5",
							"aria-hidden": "true"
						}),
						" ",
						busy ? locale === "en" ? "Processing…" : "处理中…" : locale === "en" ? "Re-compress" : "重新压缩"
					]
				}), /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: download,
					disabled: !state,
					className: "btn btn-outline !h-8 px-3 text-xs",
					children: [
						/* @__PURE__ */ jsx(Download, {
							className: "h-3.5 w-3.5",
							"aria-hidden": "true"
						}),
						" ",
						locale === "en" ? "Download result" : "下载结果"
					]
				})]
			}),
			error && /* @__PURE__ */ jsx(Message, {
				tone: "error",
				children: error
			}),
			state && /* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsx(ToolSection, {
					label: locale === "en" ? "Preview" : "压缩预览",
					children: /* @__PURE__ */ jsx("img", {
						src: state.outputUrl,
						alt: locale === "en" ? "Compressed result preview" : "压缩结果预览",
						className: "max-h-[360px] w-full rounded-[3px] border border-border object-contain"
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ jsx(ToolSection, {
						label: locale === "en" ? "Compression stats" : "压缩统计",
						children: /* @__PURE__ */ jsxs("dl", {
							className: "card divide-y divide-border text-sm",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between px-4 py-2.5",
									children: [/* @__PURE__ */ jsx("dt", {
										className: "text-muted-foreground",
										children: locale === "en" ? "Original size" : "原始大小"
									}), /* @__PURE__ */ jsx("dd", {
										className: "font-mono font-medium text-foreground",
										children: formatSize(state.originalSize)
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between px-4 py-2.5",
									children: [/* @__PURE__ */ jsx("dt", {
										className: "text-muted-foreground",
										children: locale === "en" ? "Output size" : "输出大小"
									}), /* @__PURE__ */ jsx("dd", {
										className: "font-mono font-medium text-foreground",
										children: formatSize(state.outputSize)
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between px-4 py-2.5",
									children: [/* @__PURE__ */ jsx("dt", {
										className: "text-muted-foreground",
										children: locale === "en" ? "Reduction" : "压缩率"
									}), /* @__PURE__ */ jsx("dd", {
										className: ratio > 0 ? "font-mono font-semibold text-success" : "font-mono font-semibold text-muted-foreground",
										children: ratio > 0 ? `-${ratio}%` : "0%"
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between px-4 py-2.5",
									children: [/* @__PURE__ */ jsx("dt", {
										className: "text-muted-foreground",
										children: locale === "en" ? "Dimensions" : "尺寸"
									}), /* @__PURE__ */ jsxs("dd", {
										className: "font-mono text-foreground",
										children: [
											state.width,
											" × ",
											state.height
										]
									})]
								})
							]
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "rounded-[3px] border border-border bg-secondary/40 p-4 text-[13px] leading-6 text-muted-foreground",
						children: [/* @__PURE__ */ jsx("p", {
							className: "font-semibold text-foreground/80",
							children: locale === "en" ? "Limits" : "限制说明"
						}), /* @__PURE__ */ jsxs("ul", {
							className: "mt-1.5 list-disc space-y-1 pl-5",
							children: [
								/* @__PURE__ */ jsx("li", { children: locale === "en" ? "PNG (with transparency) is flattened to white when converting to JPEG." : "PNG（含透明通道）转为 JPEG 时会填充白色背景。" }),
								/* @__PURE__ */ jsx("li", { children: locale === "en" ? "PNG output usually compresses little (lossless format)." : "输出格式为 PNG 时压缩率通常有限（无损格式）。" }),
								/* @__PURE__ */ jsx("li", { children: locale === "en" ? "Very large images may fail due to browser Canvas size limits." : "超大图片受浏览器 Canvas 尺寸限制，可能处理失败。" })
							]
						})]
					})]
				})]
			})
		]
	});
}
function formatSize(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
function readAsDataURL(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = () => reject(/* @__PURE__ */ new Error("read"));
		reader.readAsDataURL(file);
	});
}
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error("load"));
		img.src = src;
	});
}
function canvasToBlob(canvas, mime, quality) {
	return new Promise((resolve) => canvas.toBlob(resolve, mime, quality));
}
//#endregion
//#region src/lib/tools/aspect.ts
function calculateAspect(args) {
	const width = parseNum(args.width);
	const height = parseNum(args.height);
	let ratio = parseRatio(args.ratio);
	if ([
		width,
		height,
		ratio
	].filter((v) => v !== null).length === 0) return {
		ok: false,
		error: "请至少输入宽度、高度或比例中的一项。"
	};
	let outW = width;
	let outH = height;
	if (outW !== null && outH !== null && ratio !== null) outH = outW / ratio;
	else if (outW !== null && outH === null && ratio !== null) outH = outW / ratio;
	else if (outW === null && outH !== null && ratio !== null) outW = outH * ratio;
	else if (outW !== null && outH !== null && ratio === null) ratio = outW / outH;
	else return {
		ok: false,
		error: "已知条件不足：比例必须与宽度或高度中的至少一项同时给出。"
	};
	if (outW !== null && outH !== null && (outW <= 0 || outH <= 0)) return {
		ok: false,
		error: "尺寸必须为正数。"
	};
	if (outW !== null && outW > 1e7) return {
		ok: false,
		error: "宽度数值过大。"
	};
	if (outH !== null && outH > 1e7) return {
		ok: false,
		error: "高度数值过大。"
	};
	const r = outW !== null && outH !== null ? outW / outH : 1;
	return {
		ok: true,
		result: {
			width: outW !== null ? round(outW) : null,
			height: outH !== null ? round(outH) : null,
			ratio: simplifyRatio(r),
			isLandscape: r >= 1
		}
	};
}
var commonRatios = [
	{
		label: "1:1（方形）",
		value: "1:1"
	},
	{
		label: "4:3（经典）",
		value: "4:3"
	},
	{
		label: "3:2（照片）",
		value: "3:2"
	},
	{
		label: "16:9（视频）",
		value: "16:9"
	},
	{
		label: "21:9（超宽）",
		value: "21:9"
	},
	{
		label: "9:16（竖屏）",
		value: "9:16"
	},
	{
		label: "3:4（竖版）",
		value: "3:4"
	},
	{
		label: "2:3（竖版）",
		value: "2:3"
	},
	{
		label: "1:1.91（卡片）",
		value: "1:1.91"
	}
];
function parseNum(v) {
	if (v === void 0 || v.trim() === "") return null;
	const n = Number(v.trim());
	return Number.isFinite(n) && n > 0 ? n : null;
}
function parseRatio(v) {
	if (v === void 0 || v.trim() === "") return null;
	const s = v.trim();
	const m = /^(\d+(?:\.\d+)?)\s*[:：/]\s*(\d+(?:\.\d+)?)$/.exec(s);
	if (!m) return null;
	const a = Number(m[1]);
	const b = Number(m[2]);
	if (a <= 0 || b <= 0) return null;
	return a / b;
}
function round(n) {
	return Math.round(n * 100) / 100;
}
function simplifyRatio(r) {
	for (const c of commonRatios) {
		const m = /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/.exec(c.value);
		if (!m) continue;
		const a = Number(m[1]);
		const b = Number(m[2]);
		if (Math.abs(r - a / b) < .001) return c.value;
	}
	return `1 : ${round(1 / r)}`;
}
//#endregion
//#region src/islands/tools/AspectRatioCalculator.tsx
function AspectRatioCalculator({ locale = "zh" }) {
	getDict(locale);
	const [width, setWidth] = useState("");
	const [height, setHeight] = useState("");
	const [ratio, setRatio] = useState("");
	const [result, setResult] = useState("");
	const [error, setError] = useState(null);
	const calc = () => {
		const r = calculateAspect({
			width,
			height,
			ratio
		});
		if (r.ok) {
			setError(null);
			const res = r.result;
			setResult([
				res.width !== null ? `${locale === "en" ? "Width" : "宽度"}：${res.width}px` : null,
				res.height !== null ? `${locale === "en" ? "Height" : "高度"}：${res.height}px` : null,
				`${locale === "en" ? "Ratio" : "比例"}：${res.ratio}`,
				`${locale === "en" ? "Orientation" : "方向"}：${res.isLandscape ? locale === "en" ? "Landscape (W ≥ H)" : "横向（宽 ≥ 高）" : locale === "en" ? "Portrait (H > W)" : "纵向（高 > 宽）"}`
			].filter(Boolean).join("\n"));
		} else {
			setResult("");
			setError(localizeError(locale, r.error));
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6 lg:grid-cols-[1.2fr_1fr]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ jsx(ToolSection, {
							label: locale === "en" ? "Width (px)" : "宽度 (px)",
							hint: locale === "en" ? "blank to derive" : "留空可推算",
							children: /* @__PURE__ */ jsx("input", {
								type: "number",
								value: width,
								onChange: (e) => setWidth(e.target.value),
								placeholder: "1920",
								className: "input font-mono",
								"aria-label": t(locale, "tools.aspect-ratio-calculator.widthLabel")
							})
						}),
						/* @__PURE__ */ jsx(ToolSection, {
							label: locale === "en" ? "Height (px)" : "高度 (px)",
							hint: locale === "en" ? "blank to derive" : "留空可推算",
							children: /* @__PURE__ */ jsx("input", {
								type: "number",
								value: height,
								onChange: (e) => setHeight(e.target.value),
								placeholder: "1080",
								className: "input font-mono",
								"aria-label": t(locale, "tools.aspect-ratio-calculator.heightLabel")
							})
						}),
						/* @__PURE__ */ jsx(ToolSection, {
							label: t(locale, "tools.aspect-ratio-calculator.ratioLabel"),
							hint: locale === "en" ? "e.g. 16:9" : "如 16:9",
							children: /* @__PURE__ */ jsx("input", {
								type: "text",
								value: ratio,
								onChange: (e) => setRatio(e.target.value),
								placeholder: "16:9",
								className: "input font-mono",
								"aria-label": t(locale, "tools.aspect-ratio-calculator.ratioLabel")
							})
						})
					]
				}),
				/* @__PURE__ */ jsx(ToolSection, {
					label: t(locale, "tools.aspect-ratio-calculator.presets"),
					hint: locale === "en" ? "click to fill" : "点击填入",
					children: /* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap gap-1.5",
						children: commonRatios.map((r) => /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => {
								setRatio(r.value);
								setError(null);
							},
							className: "rounded-[2px] border border-border bg-card px-2 py-1 text-xs text-foreground/80 transition-colors hover:border-accent hover:text-accent",
							title: r.label,
							children: r.value
						}, r.value))
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: calc,
							className: "btn btn-accent !h-8 px-3 text-xs",
							children: locale === "en" ? "Calculate" : "计算"
						}),
						/* @__PURE__ */ jsx(ClearButton, {
							onClick: () => {
								setWidth("");
								setHeight("");
								setRatio("");
								setResult("");
								setError(null);
							},
							disabled: !width && !height && !ratio
						}),
						/* @__PURE__ */ jsx(CopyButton, {
							getText: () => result,
							disabled: !result,
							className: "ml-auto"
						})
					]
				}),
				error && /* @__PURE__ */ jsx(Message, {
					tone: "error",
					children: error
				})
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "space-y-4",
			children: /* @__PURE__ */ jsx(ToolSection, {
				label: locale === "en" ? "Result" : "结果",
				children: result ? /* @__PURE__ */ jsx(ResultBox, { children: result }) : /* @__PURE__ */ jsx("div", {
					className: "card p-6 text-center text-sm text-muted-foreground",
					children: locale === "en" ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
						"Enter known width, height or ratio to derive the unknown. ",
						/* @__PURE__ */ jsx("br", {}),
						"e.g. width 1920, ratio 16:9 → height 1080."
					] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
						"输入已知的宽、高或比例，计算未知尺寸。",
						/* @__PURE__ */ jsx("br", {}),
						"例如：宽 1920、比例 16:9 → 高度 1080。"
					] })
				})
			})
		})]
	});
}
//#endregion
//#region src/lib/tools/color.ts
function parseHex(input) {
	const s = input.trim().replace(/^#/, "");
	if (/^[0-9a-fA-F]{3}$/.test(s)) return {
		ok: true,
		rgb: {
			r: parseInt(s[0] + s[0], 16),
			g: parseInt(s[1] + s[1], 16),
			b: parseInt(s[2] + s[2], 16)
		}
	};
	if (/^[0-9a-fA-F]{6}$/.test(s)) return {
		ok: true,
		rgb: {
			r: parseInt(s.slice(0, 2), 16),
			g: parseInt(s.slice(2, 4), 16),
			b: parseInt(s.slice(4, 6), 16)
		}
	};
	if (/^[0-9a-fA-F]{4}$/.test(s)) {
		const r = parseInt(s[0] + s[0], 16);
		const g = parseInt(s[1] + s[1], 16);
		const b = parseInt(s[2] + s[2], 16);
		const a = parseInt(s[3] + s[3], 16) / 255;
		return {
			ok: true,
			rgb: {
				r,
				g,
				b
			},
			alpha: a
		};
	}
	if (/^[0-9a-fA-F]{8}$/.test(s)) return {
		ok: true,
		rgb: {
			r: parseInt(s.slice(0, 2), 16),
			g: parseInt(s.slice(2, 4), 16),
			b: parseInt(s.slice(4, 6), 16)
		},
		alpha: parseInt(s.slice(6, 8), 16) / 255
	};
	return {
		ok: false,
		error: "HEX 需为 3、4、6 或 8 位十六进制（如 #E87028）。"
	};
}
function parseRgb(input) {
	const m = /^rgb\(?\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*\)?$/i.exec(input.trim());
	if (!m) return {
		ok: false,
		error: "RGB 格式：rgb(232, 112, 40)，数值 0–255。"
	};
	const r = Number(m[1]);
	const g = Number(m[2]);
	const b = Number(m[3]);
	if ([
		r,
		g,
		b
	].some((v) => v < 0 || v > 255)) return {
		ok: false,
		error: "RGB 数值需在 0–255 之间。"
	};
	return {
		ok: true,
		rgb: {
			r,
			g,
			b
		}
	};
}
function parseHsl(input) {
	const m = /^hsl\(?\s*(\d{1,3}(?:\.\d+)?)\s*[, ]\s*(\d{1,3}(?:\.\d+)?)%\s*[, ]\s*(\d{1,3}(?:\.\d+)?)%\s*\)?$/i.exec(input.trim());
	if (!m) return {
		ok: false,
		error: "HSL 格式：hsl(24, 79%, 53%)。"
	};
	const h = Number(m[1]);
	const s = Number(m[2]);
	const l = Number(m[3]);
	if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) return {
		ok: false,
		error: "HSL 范围：H 0–360，S/L 0–100。"
	};
	return {
		ok: true,
		hsl: {
			h,
			s,
			l
		}
	};
}
function rgbToHex(rgb) {
	const to = (v) => Math.round(v).toString(16).padStart(2, "0");
	return `#${to(rgb.r)}${to(rgb.g)}${to(rgb.b)}`.toUpperCase();
}
function rgbToHsl(rgb) {
	const r = rgb.r / 255;
	const g = rgb.g / 255;
	const b = rgb.b / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;
	let h = 0;
	let s = 0;
	if (max !== min) {
		const d = max - min;
		s = l > .5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
				break;
			case g:
				h = ((b - r) / d + 2) / 6;
				break;
			default: h = ((r - g) / d + 4) / 6;
		}
		h *= 360;
	}
	return {
		h: Math.round(h * 100) / 100,
		s: Math.round(s * 1e4) / 100,
		l: Math.round(l * 1e4) / 100
	};
}
function hslToRgb(hsl) {
	const h = (hsl.h % 360 + 360) % 360 / 360;
	const s = hsl.s / 100;
	const l = hsl.l / 100;
	if (s === 0) {
		const v = Math.round(l * 255);
		return {
			r: v,
			g: v,
			b: v
		};
	}
	const hue2rgb = (p, q, t) => {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};
	const q = l < .5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;
	return {
		r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
		g: Math.round(hue2rgb(p, q, h) * 255),
		b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255)
	};
}
function hslString(hsl) {
	return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
}
function rgbString(rgb) {
	return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
}
function rgbCss(rgb) {
	return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
}
/** 将任意支持的颜色输入解析为 RGB */
function parseColor(input) {
	const trimmed = input.trim();
	const lower = trimmed.toLowerCase();
	if (lower.startsWith("#")) return parseHex(trimmed);
	if (lower.startsWith("rgb")) return parseRgb(trimmed);
	if (lower.startsWith("hsl")) {
		const parsed = parseHsl(trimmed);
		if (!parsed.ok) return parsed;
		return {
			ok: true,
			rgb: hslToRgb(parsed.hsl)
		};
	}
	const named = {
		black: {
			r: 0,
			g: 0,
			b: 0
		},
		white: {
			r: 255,
			g: 255,
			b: 255
		},
		red: {
			r: 255,
			g: 0,
			b: 0
		},
		green: {
			r: 0,
			g: 128,
			b: 0
		},
		blue: {
			r: 0,
			g: 0,
			b: 255
		},
		orange: {
			r: 255,
			g: 165,
			b: 0
		},
		gray: {
			r: 128,
			g: 128,
			b: 128
		},
		grey: {
			r: 128,
			g: 128,
			b: 128
		},
		yellow: {
			r: 255,
			g: 255,
			b: 0
		},
		purple: {
			r: 128,
			g: 0,
			b: 128
		},
		pink: {
			r: 255,
			g: 192,
			b: 203
		}
	};
	if (named[lower]) return {
		ok: true,
		rgb: named[lower]
	};
	return {
		ok: false,
		error: "无法识别的颜色格式。支持 HEX、rgb(r,g,b)、hsl(h,s%,l%) 与常见颜色名。"
	};
}
function parseAny(input) {
	const parsed = parseColor(input);
	if (!parsed.ok) return parsed;
	const hex = rgbToHex(parsed.rgb);
	const hsl = rgbToHsl(parsed.rgb);
	const lower = input.trim().toLowerCase();
	return {
		ok: true,
		format: lower.startsWith("#") ? "hex" : lower.startsWith("rgb") ? "rgb" : lower.startsWith("hsl") ? "hsl" : "hex",
		rgb: parsed.rgb,
		hsl,
		hex
	};
}
//#endregion
//#region src/islands/tools/ColorConverter.tsx
function ColorConverter({ locale = "zh" }) {
	getDict(locale);
	const [input, setInput] = useState("");
	const [error, setError] = useState(null);
	const [parsed, setParsed] = useState(null);
	const convert = () => {
		const r = parseAny(input);
		if (!r.ok) {
			setError(localizeError(locale, r.error));
			setParsed(null);
			return;
		}
		setError(null);
		setParsed(r);
	};
	const rows = parsed ? [
		{
			label: "HEX",
			value: parsed.hex
		},
		{
			label: "RGB",
			value: rgbString(parsed.rgb)
		},
		{
			label: "HSL",
			value: hslString(parsed.hsl)
		},
		{
			label: "CSS (rgb)",
			value: rgbCss(parsed.rgb)
		}
	] : [];
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsx(ToolSection, {
				label: locale === "en" ? "Input color" : "输入颜色",
				hint: locale === "en" ? "HEX, rgb(r,g,b), hsl(h,s%,l%) or color names" : "支持 HEX、rgb(r,g,b)、hsl(h,s%,l%) 与常见颜色名",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-2 sm:flex-row",
					children: [
						/* @__PURE__ */ jsx("input", {
							type: "text",
							value: input,
							onChange: (e) => {
								setInput(e.target.value);
								setError(null);
							},
							placeholder: "#E87028 或 rgb(232, 112, 40) 或 orange",
							className: "input font-mono !text-[13px]",
							"aria-label": locale === "en" ? "Color input" : "颜色输入",
							onKeyDown: (e) => {
								if (e.key === "Enter") convert();
							}
						}),
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: convert,
							className: "btn btn-accent shrink-0 !h-8 px-3 text-xs",
							children: locale === "en" ? "Convert" : "转换"
						}),
						/* @__PURE__ */ jsx(ClearButton, {
							onClick: () => {
								setInput("");
								setParsed(null);
								setError(null);
							},
							disabled: !input
						})
					]
				})
			}),
			error && /* @__PURE__ */ jsx(Message, {
				tone: "error",
				children: error
			}),
			parsed && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx(ToolSection, {
				label: t(locale, "tools.color-converter.previewLabel"),
				children: /* @__PURE__ */ jsx("div", {
					className: "h-24 w-full rounded-[3px] border border-border",
					style: { backgroundColor: parsed.hex },
					role: "img",
					"aria-label": `${locale === "en" ? "Color preview" : "颜色预览"} ${parsed.hex}`
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "grid gap-2 sm:grid-cols-2",
				children: rows.map((row) => /* @__PURE__ */ jsxs("div", {
					className: "card flex items-center justify-between gap-2 px-3 py-2.5",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "text-xs font-medium text-muted-foreground",
							children: row.label
						}),
						/* @__PURE__ */ jsx("span", {
							className: "scroll-x flex-1 truncate text-right font-mono text-[13px] text-foreground",
							children: row.value
						}),
						/* @__PURE__ */ jsx(CopyButton, {
							getText: () => row.value,
							label: "",
							className: "!h-7 !px-2"
						})
					]
				}, row.label))
			})] })
		]
	});
}
//#endregion
//#region src/lib/tools/robots.ts
var robotsDefaultRule = {
	userAgent: "*",
	allow: ["/"],
	disallow: []
};
function buildRobots(rules) {
	const lines = [];
	for (const rule of rules) {
		if (rule.allow.length === 0 && rule.disallow.length === 0) continue;
		lines.push(`User-agent: ${rule.userAgent || "*"}`);
		for (const a of rule.allow) if (a.trim()) lines.push(`Allow: ${a.trim()}`);
		for (const d of rule.disallow) if (d.trim()) lines.push(`Disallow: ${d.trim()}`);
		if (rule.crawlDelay?.trim()) lines.push(`Crawl-delay: ${rule.crawlDelay.trim()}`);
		lines.push("");
	}
	for (const rule of rules) if (rule.sitemapUrl?.trim()) lines.push(`Sitemap: ${rule.sitemapUrl.trim()}`);
	return lines.join("\n").trim() + "\n";
}
/** robots.txt 说明（用于页面展示，不构成 SEO 承诺） */
var robotsExplanations = [
	{
		title: "它是规范，不是指令",
		detail: "robots.txt 是给搜索引擎爬虫的访问建议，遵守与否由爬虫决定，不能用来隐藏敏感页面。"
	},
	{
		title: "Disallow 不等于不收录",
		detail: "Disallow 只是阻止抓取，页面仍可能因外部链接被收录（只是没有正文内容）。"
	},
	{
		title: "Sitemap 配合使用",
		detail: "在 robots.txt 中声明 Sitemap 可以帮助爬虫更快发现新页面。"
	},
	{
		title: "部分指令支持不一",
		detail: "Crawl-delay 等指令并非所有搜索引擎都支持。"
	}
];
//#endregion
//#region src/islands/tools/RobotsGenerator.tsx
var EXPLANATIONS_EN = [
	{
		title: "User-agent",
		detail: "Which crawler a rule block applies to; * covers all."
	},
	{
		title: "Allow / Disallow",
		detail: "Exact or prefix paths; more specific rules win."
	},
	{
		title: "Sitemap",
		detail: "Points crawlers to your sitemap; many engines read it."
	},
	{
		title: "Not a security tool",
		detail: "robots.txt is a polite request — it cannot block malicious bots."
	}
];
function RobotsGenerator({ locale = "zh" }) {
	getDict(locale);
	const [rules, setRules] = useState([{ ...robotsDefaultRule }]);
	const [sitemap, setSitemap] = useState("");
	const [error, setError] = useState(null);
	const output = buildRobots(rules.map((r) => ({
		...r,
		sitemapUrl: sitemap || void 0
	})));
	const updateRule = (index, patch) => {
		setRules((list) => list.map((r, i) => i === index ? {
			...r,
			...patch
		} : r));
		setError(null);
	};
	const addRule = () => {
		setRules((list) => [...list, {
			userAgent: "*",
			allow: [],
			disallow: [],
			crawlDelay: void 0
		}]);
	};
	const removeRule = (index) => {
		setRules((list) => list.filter((_, i) => i !== index));
	};
	const resetDefault = () => {
		setRules([{ ...robotsDefaultRule }]);
		setSitemap("");
		setError(null);
	};
	const handleBuild = () => {
		if (!rules.some((r) => r.allow.length > 0 || r.disallow.length > 0)) {
			setError(locale === "en" ? "Add at least one Allow or Disallow rule." : "至少需要一条 Allow 或 Disallow 规则。");
			return;
		}
		setError(null);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6 lg:grid-cols-[1.2fr_1fr]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-4",
			children: [
				rules.map((rule, index) => /* @__PURE__ */ jsxs("div", {
					className: "card space-y-3 p-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-sm font-semibold text-foreground",
								children: locale === "en" ? `Rule ${index + 1}` : `规则 ${index + 1}`
							}), rules.length > 1 && /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => removeRule(index),
								className: "inline-flex h-6 items-center gap-1 text-xs text-muted-foreground hover:text-destructive",
								"aria-label": locale === "en" ? `Delete rule ${index + 1}` : `删除规则 ${index + 1}`,
								children: [
									/* @__PURE__ */ jsx(Trash2, { className: "h-3 w-3" }),
									" ",
									locale === "en" ? "Delete" : "删除"
								]
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "label",
								htmlFor: `ua-${index}`,
								children: "User-agent"
							}), /* @__PURE__ */ jsx("input", {
								id: `ua-${index}`,
								type: "text",
								value: rule.userAgent,
								onChange: (e) => updateRule(index, { userAgent: e.target.value }),
								className: "input font-mono !text-[13px]",
								placeholder: "*"
							})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "label",
								htmlFor: `delay-${index}`,
								children: locale === "en" ? "Crawl-delay (sec, optional)" : "Crawl-delay（秒，可选）"
							}), /* @__PURE__ */ jsx("input", {
								id: `delay-${index}`,
								type: "text",
								value: rule.crawlDelay ?? "",
								onChange: (e) => updateRule(index, { crawlDelay: e.target.value }),
								className: "input font-mono !text-[13px]",
								placeholder: "1"
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "label",
								htmlFor: `allow-${index}`,
								children: locale === "en" ? "Allow (one per line)" : "Allow（每行一条）"
							}), /* @__PURE__ */ jsx("textarea", {
								id: `allow-${index}`,
								value: rule.allow.join("\n"),
								onChange: (e) => updateRule(index, { allow: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) }),
								rows: 3,
								className: "input scroll-x font-mono !text-[13px]",
								placeholder: "/"
							})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "label",
								htmlFor: `disallow-${index}`,
								children: locale === "en" ? "Disallow (one per line)" : "Disallow（每行一条）"
							}), /* @__PURE__ */ jsx("textarea", {
								id: `disallow-${index}`,
								value: rule.disallow.join("\n"),
								onChange: (e) => updateRule(index, { disallow: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) }),
								rows: 3,
								className: "input scroll-x font-mono !text-[13px]",
								placeholder: "/admin/"
							})] })]
						})
					]
				}, index)),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ jsxs("button", {
						type: "button",
						onClick: addRule,
						className: "btn btn-outline !h-8 px-3 text-xs",
						children: [
							/* @__PURE__ */ jsx(Plus, {
								className: "h-3.5 w-3.5",
								"aria-hidden": "true"
							}),
							" ",
							locale === "en" ? "Add rule" : "添加规则"
						]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: resetDefault,
						className: "btn btn-ghost !h-8 px-3 text-xs",
						children: locale === "en" ? "Restore default" : "恢复默认模板"
					})]
				}),
				/* @__PURE__ */ jsx(ToolSection, {
					label: "Sitemap URL",
					hint: locale === "en" ? "optional" : "可选，声明站点地图位置",
					children: /* @__PURE__ */ jsx("input", {
						type: "url",
						value: sitemap,
						onChange: (e) => setSitemap(e.target.value),
						placeholder: "https://example.com/sitemap.xml",
						className: "input font-mono !text-[13px]",
						"aria-label": "Sitemap URL"
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: handleBuild,
							className: "btn btn-accent !h-8 px-3 text-xs",
							children: locale === "en" ? "Generate robots.txt" : "生成 robots.txt"
						}),
						/* @__PURE__ */ jsx(CopyButton, { getText: () => output }),
						/* @__PURE__ */ jsx(DownloadButton, {
							filename: "robots.txt",
							getContent: () => output
						})
					]
				}),
				error && /* @__PURE__ */ jsx(Message, {
					tone: "error",
					children: error
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ jsx(ToolSection, {
				label: locale === "en" ? "Preview" : "预览",
				children: /* @__PURE__ */ jsx(ResultBox, { children: output || (locale === "en" ? "# Configure rules on the left to generate robots.txt" : "# 在左侧配置规则后生成 robots.txt") })
			}), /* @__PURE__ */ jsxs("div", {
				className: "rounded-[3px] border border-border bg-secondary/40 p-4 text-[13px] leading-6 text-muted-foreground",
				children: [/* @__PURE__ */ jsx("p", {
					className: "font-semibold text-foreground/80",
					children: locale === "en" ? "Purpose & limits" : "用途与限制"
				}), /* @__PURE__ */ jsx("ul", {
					className: "mt-1.5 list-disc space-y-1.5 pl-5",
					children: (locale === "en" ? EXPLANATIONS_EN : robotsExplanations).map((e) => /* @__PURE__ */ jsxs("li", { children: [
						/* @__PURE__ */ jsx("strong", {
							className: "text-foreground/70",
							children: e.title
						}),
						"：",
						e.detail
					] }, e.title))
				})]
			})]
		})]
	});
}
//#endregion
//#region src/lib/tools/llms.ts
function buildLlms(input) {
	if (!input.siteName.trim() || !input.siteUrl.trim()) return {
		ok: false,
		error: "网站名称与网址为必填项。"
	};
	let siteUrl;
	try {
		siteUrl = new URL(input.siteUrl.trim());
	} catch {
		return {
			ok: false,
			error: "网站网址不是有效的 URL（需包含协议，如 https://example.com）。"
		};
	}
	if (siteUrl.protocol !== "http:" && siteUrl.protocol !== "https:") return {
		ok: false,
		error: "网站网址需以 http:// 或 https:// 开头。"
	};
	const base = siteUrl.origin;
	const lines = [];
	lines.push(`# ${input.siteName.trim()}`);
	lines.push("");
	lines.push(`> ${input.siteUrl.trim()}`);
	lines.push("");
	if (input.intro.trim()) {
		lines.push(input.intro.trim());
		lines.push("");
	}
	lines.push("## 主要页面");
	lines.push("");
	const seen = /* @__PURE__ */ new Set();
	for (const page of input.pages) {
		if (!page.url.trim() || !page.title.trim()) continue;
		const url = normalizePageUrl(page.url.trim(), base);
		if (seen.has(url)) continue;
		seen.add(url);
		lines.push(`- [${page.title.trim()}](${url})${page.detail ? `: ${page.detail.trim()}` : ""}`);
	}
	return {
		ok: true,
		output: lines.join("\n") + "\n"
	};
}
function normalizePageUrl(raw, base) {
	try {
		const u = new URL(raw, base);
		if (u.origin !== new URL(base).origin) return raw;
		return u.toString();
	} catch {
		return raw;
	}
}
//#endregion
//#region src/islands/tools/LlmsGenerator.tsx
function LlmsGenerator({ locale = "zh" }) {
	getDict(locale);
	const [siteName, setSiteName] = useState("");
	const [siteUrl, setSiteUrl] = useState("");
	const [intro, setIntro] = useState("");
	const [pages, setPages] = useState([{
		url: "",
		title: "",
		detail: ""
	}, {
		url: "",
		title: "",
		detail: ""
	}]);
	const [error, setError] = useState(null);
	const [output, setOutput] = useState("");
	const updatePage = (index, patch) => {
		setPages((list) => list.map((p, i) => i === index ? {
			...p,
			...patch
		} : p));
	};
	const generate = () => {
		const r = buildLlms({
			siteName,
			siteUrl,
			intro,
			pages
		});
		if (r.ok) {
			setOutput(r.output);
			setError(null);
		} else {
			setOutput("");
			setError(localizeError(locale, r.error));
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6 lg:grid-cols-[1.2fr_1fr]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ jsx(ToolSection, {
						label: t(locale, "tools.llms-generator.siteNameLabel"),
						hint: locale === "en" ? "Required" : "必填",
						children: /* @__PURE__ */ jsx("input", {
							type: "text",
							value: siteName,
							onChange: (e) => setSiteName(e.target.value),
							placeholder: "SolHub",
							className: "input",
							"aria-label": t(locale, "tools.llms-generator.siteNameLabel")
						})
					}), /* @__PURE__ */ jsx(ToolSection, {
						label: t(locale, "tools.llms-generator.siteUrlLabel"),
						hint: locale === "en" ? "Required" : "必填",
						children: /* @__PURE__ */ jsx("input", {
							type: "url",
							value: siteUrl,
							onChange: (e) => setSiteUrl(e.target.value),
							placeholder: "https://example.com",
							className: "input font-mono !text-[13px]",
							"aria-label": t(locale, "tools.llms-generator.siteUrlLabel")
						})
					})]
				}),
				/* @__PURE__ */ jsx(ToolSection, {
					label: t(locale, "tools.llms-generator.summaryLabel"),
					hint: locale === "en" ? "optional, at the file top" : "可选，写在文件头部",
					children: /* @__PURE__ */ jsx("textarea", {
						value: intro,
						onChange: (e) => setIntro(e.target.value),
						rows: 3,
						placeholder: locale === "en" ? "A platform helping indie developers discover great products." : "这是一个帮助独立开发者发现好产品的平台。",
						className: "input resize-y !text-[14px] leading-6",
						"aria-label": t(locale, "tools.llms-generator.summaryLabel")
					})
				}),
				/* @__PURE__ */ jsx(ToolSection, {
					label: t(locale, "tools.llms-generator.pagesTitle"),
					hint: locale === "en" ? "URL & title required, detail optional" : "URL、标题必填，说明可选",
					children: /* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [pages.map((page, index) => /* @__PURE__ */ jsxs("div", {
							className: "card grid gap-2 p-3 sm:grid-cols-[1.2fr_1fr_1.2fr_auto]",
							children: [
								/* @__PURE__ */ jsx("input", {
									type: "url",
									value: page.url,
									onChange: (e) => updatePage(index, { url: e.target.value }),
									placeholder: "/products/",
									className: "input font-mono !text-[12px]",
									"aria-label": `${locale === "en" ? "Page" : "页面"} ${index + 1} ${locale === "en" ? "URL" : "网址"}`
								}),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									value: page.title,
									onChange: (e) => updatePage(index, { title: e.target.value }),
									placeholder: locale === "en" ? "Product launches" : "产品榜单",
									className: "input !text-[13px]",
									"aria-label": `${locale === "en" ? "Page" : "页面"} ${index + 1} ${locale === "en" ? "title" : "标题"}`
								}),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									value: page.detail ?? "",
									onChange: (e) => updatePage(index, { detail: e.target.value }),
									placeholder: locale === "en" ? "Discover products indie developers are building" : "发现独立开发者正在创造的产品",
									className: "input !text-[13px]",
									"aria-label": `${locale === "en" ? "Page" : "页面"} ${index + 1} ${locale === "en" ? "detail" : "说明"}`
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setPages((list) => list.filter((_, i) => i !== index)),
									className: "inline-flex h-8 w-8 items-center justify-center self-center rounded-[2px] text-muted-foreground hover:bg-secondary hover:text-destructive",
									"aria-label": `${locale === "en" ? "Delete page" : "删除页面"} ${index + 1}`,
									children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
								})
							]
						}, index)), /* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setPages((list) => [...list, {
								url: "",
								title: "",
								detail: ""
							}]),
							className: "btn btn-outline !h-8 px-3 text-xs",
							children: [
								/* @__PURE__ */ jsx(Plus, {
									className: "h-3.5 w-3.5",
									"aria-hidden": "true"
								}),
								" ",
								locale === "en" ? "Add page" : "添加页面"
							]
						})]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: generate,
							className: "btn btn-accent !h-8 px-3 text-xs",
							children: locale === "en" ? "Generate llms.txt" : "生成 llms.txt"
						}),
						/* @__PURE__ */ jsx(CopyButton, {
							getText: () => output,
							disabled: !output
						}),
						/* @__PURE__ */ jsx(DownloadButton, {
							filename: "llms.txt",
							getContent: () => output,
							disabled: !output
						})
					]
				}),
				error && /* @__PURE__ */ jsx(Message, {
					tone: "error",
					children: error
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ jsx(ToolSection, {
				label: locale === "en" ? "Preview" : "预览",
				children: output ? /* @__PURE__ */ jsx(ResultBox, { children: output }) : /* @__PURE__ */ jsx("div", {
					className: "card p-6 text-center text-sm text-muted-foreground",
					children: locale === "en" ? "Fill the fields on the left to generate llms.txt." : "填写左侧字段后生成 llms.txt。"
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "rounded-[3px] border border-border bg-secondary/40 p-4 text-[13px] leading-6 text-muted-foreground",
				children: [/* @__PURE__ */ jsx("p", {
					className: "font-semibold text-foreground/80",
					children: locale === "en" ? "Notes" : "说明"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1.5",
					children: locale === "en" ? "llms.txt is a community-proposed format that helps LLMs quickly understand your site structure and content. It is not a search-engine standard, and adoption depends on each AI product. Relative paths are resolved against the site URL." : "llms.txt 是社区提出的格式，用于让 LLM 快速理解网站结构与内容。它并非搜索引擎标准，是否被采用取决于各 AI 产品。相对路径会自动基于网站网址补全。"
				})]
			})]
		})]
	});
}
//#endregion
//#region src/lib/tools/jsonld.ts
function buildJsonLd(input) {
	const validation = [];
	if (!input.name.trim()) return {
		ok: false,
		error: "名称不能为空。"
	};
	if (!input.url.trim()) return {
		ok: false,
		error: "网址不能为空。"
	};
	try {
		const u = new URL(input.url.trim());
		if (u.protocol !== "http:" && u.protocol !== "https:") return {
			ok: false,
			error: "网址需以 http:// 或 https:// 开头。"
		};
	} catch {
		return {
			ok: false,
			error: "网址不是有效的 URL。"
		};
	}
	const base = {
		"@context": "https://schema.org",
		"@type": input.type,
		name: input.name.trim(),
		url: input.url.trim(),
		description: input.description.trim() || void 0
	};
	if (input.type === "Organization" && input.logo?.trim()) try {
		new URL(input.logo.trim());
		base.logo = input.logo.trim();
	} catch {
		validation.push("Logo URL 无效，已忽略。");
	}
	if (input.type === "WebSite") {
		if (input.searchTemplate?.trim()) {
			const tpl = input.searchTemplate.trim();
			if (tpl.includes("{search_term_string}")) {
				base.potentialAction = {
					"@type": "SearchAction",
					target: `${tpl}?`,
					"query-input": "required name=search_term_string"
				};
				base.potentialAction.target = tpl.replace("{search_term_string}", "{search_term_string}");
			} else validation.push("SearchAction 模板需包含 {search_term_string} 占位符，已忽略。");
		}
	}
	if (input.type === "SoftwareApplication") {
		base.applicationCategory = input.applicationCategory || "WebApplication";
		if (input.operatingSystem?.trim()) base.operatingSystem = input.operatingSystem.trim();
		if (input.offersPrice?.trim()) base.offers = {
			"@type": "Offer",
			price: input.offersPrice.trim(),
			priceCurrency: input.offersCurrency?.trim() || "CNY"
		};
	}
	const clean = JSON.parse(JSON.stringify(base));
	let output;
	try {
		output = JSON.stringify(clean, null, 2);
	} catch {
		return {
			ok: false,
			error: "无法序列化 JSON-LD（可能存在循环引用）。"
		};
	}
	try {
		JSON.parse(output);
	} catch {
		return {
			ok: false,
			error: "生成的 JSON-LD 无法通过 JSON 解析。"
		};
	}
	validation.push("JSON 语法校验通过。");
	return {
		ok: true,
		output,
		validation
	};
}
//#endregion
//#region src/islands/tools/JsonLdGenerator.tsx
function JsonLdGenerator({ locale = "zh" }) {
	getDict(locale);
	const [type, setType] = useState("Organization");
	const [fields, setFields] = useState({
		name: "",
		url: "",
		description: "",
		logo: "",
		searchTemplate: "",
		applicationCategory: "",
		operatingSystem: "",
		offersPrice: "",
		offersCurrency: "CNY"
	});
	const [output, setOutput] = useState("");
	const [validation, setValidation] = useState([]);
	const [error, setError] = useState(null);
	const set = (key, value) => {
		setFields((f) => ({
			...f,
			[key]: value
		}));
		setError(null);
	};
	const generate = () => {
		const r = buildJsonLd({
			type,
			name: fields.name,
			url: fields.url,
			description: fields.description,
			...fields.logo ? { logo: fields.logo } : {},
			...fields.searchTemplate ? { searchTemplate: fields.searchTemplate } : {},
			...fields.applicationCategory ? { applicationCategory: fields.applicationCategory } : {},
			...fields.operatingSystem ? { operatingSystem: fields.operatingSystem } : {},
			...fields.offersPrice ? {
				offersPrice: fields.offersPrice,
				offersCurrency: fields.offersCurrency
			} : {}
		});
		if (r.ok) {
			setOutput(r.output);
			setValidation(r.validation);
			setError(null);
		} else {
			setOutput("");
			setValidation([]);
			setError(localizeError(locale, r.error));
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6 lg:grid-cols-[1.2fr_1fr]",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsx(ToolSection, {
					label: locale === "en" ? "Schema type" : "Schema 类型",
					children: /* @__PURE__ */ jsx("select", {
						value: type,
						onChange: (e) => setType(e.target.value),
						className: "input",
						"aria-label": locale === "en" ? "Schema type" : "Schema 类型",
						children: [
							"Organization",
							"WebSite",
							"SoftwareApplication"
						].map((v) => /* @__PURE__ */ jsx("option", {
							value: v,
							children: v
						}, v))
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ jsx(ToolSection, {
						label: locale === "en" ? "Name" : "名称",
						hint: locale === "en" ? "Required" : "必填",
						children: /* @__PURE__ */ jsx("input", {
							type: "text",
							value: fields.name,
							onChange: (e) => set("name", e.target.value),
							placeholder: "SolHub",
							className: "input",
							"aria-label": locale === "en" ? "Name" : "名称"
						})
					}), /* @__PURE__ */ jsx(ToolSection, {
						label: locale === "en" ? "URL" : "网址",
						hint: locale === "en" ? "Required" : "必填",
						children: /* @__PURE__ */ jsx("input", {
							type: "url",
							value: fields.url,
							onChange: (e) => set("url", e.target.value),
							placeholder: "https://example.com",
							className: "input font-mono !text-[13px]",
							"aria-label": locale === "en" ? "URL" : "网址"
						})
					})]
				}),
				/* @__PURE__ */ jsx(ToolSection, {
					label: locale === "en" ? "Description" : "描述",
					children: /* @__PURE__ */ jsx("textarea", {
						value: fields.description,
						onChange: (e) => set("description", e.target.value),
						rows: 2,
						placeholder: locale === "en" ? "One-line description" : "一句话描述",
						className: "input resize-y",
						"aria-label": locale === "en" ? "Description" : "描述"
					})
				}),
				type === "Organization" && /* @__PURE__ */ jsx(ToolSection, {
					label: "Logo URL",
					hint: locale === "en" ? "Optional" : "可选",
					children: /* @__PURE__ */ jsx("input", {
						type: "url",
						value: fields.logo,
						onChange: (e) => set("logo", e.target.value),
						placeholder: "https://example.com/logo.png",
						className: "input font-mono !text-[13px]",
						"aria-label": "Logo URL"
					})
				}),
				type === "WebSite" && /* @__PURE__ */ jsx(ToolSection, {
					label: locale === "en" ? "Search action template" : "搜索动作模板",
					hint: locale === "en" ? "Optional · must contain {search_term_string}" : "可选 · 需包含 {search_term_string}",
					children: /* @__PURE__ */ jsx("input", {
						type: "text",
						value: fields.searchTemplate,
						onChange: (e) => set("searchTemplate", e.target.value),
						placeholder: "https://example.com/search?q={search_term_string}",
						className: "input font-mono !text-[13px]",
						"aria-label": locale === "en" ? "Search template" : "搜索模板"
					})
				}),
				type === "SoftwareApplication" && /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ jsx(ToolSection, {
						label: locale === "en" ? "Application category" : "应用分类",
						hint: locale === "en" ? "Optional" : "可选",
						children: /* @__PURE__ */ jsx("input", {
							type: "text",
							value: fields.applicationCategory,
							onChange: (e) => set("applicationCategory", e.target.value),
							placeholder: "WebApplication",
							className: "input",
							"aria-label": locale === "en" ? "Application category" : "应用分类"
						})
					}), /* @__PURE__ */ jsx(ToolSection, {
						label: locale === "en" ? "Operating system" : "运行平台",
						hint: locale === "en" ? "Optional" : "可选",
						children: /* @__PURE__ */ jsx("input", {
							type: "text",
							value: fields.operatingSystem,
							onChange: (e) => set("operatingSystem", e.target.value),
							placeholder: "Web",
							className: "input",
							"aria-label": locale === "en" ? "Operating system" : "运行平台"
						})
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ jsx(ToolSection, {
						label: locale === "en" ? "Price" : "价格",
						hint: locale === "en" ? "Optional, e.g. 0 / 99" : "可选，如 0 / 99",
						children: /* @__PURE__ */ jsx("input", {
							type: "text",
							value: fields.offersPrice,
							onChange: (e) => set("offersPrice", e.target.value),
							placeholder: "0",
							className: "input",
							"aria-label": locale === "en" ? "Price" : "价格"
						})
					}), /* @__PURE__ */ jsx(ToolSection, {
						label: locale === "en" ? "Currency" : "货币",
						hint: locale === "en" ? "default CNY" : "默认 CNY",
						children: /* @__PURE__ */ jsx("input", {
							type: "text",
							value: fields.offersCurrency,
							onChange: (e) => set("offersCurrency", e.target.value),
							placeholder: "CNY",
							className: "input",
							"aria-label": locale === "en" ? "Currency" : "货币"
						})
					})]
				})] }),
				/* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: generate,
							className: "btn btn-accent !h-8 px-3 text-xs",
							children: locale === "en" ? "Generate JSON-LD" : "生成 JSON-LD"
						}),
						/* @__PURE__ */ jsx(CopyButton, {
							getText: () => output,
							disabled: !output
						}),
						/* @__PURE__ */ jsx(DownloadButton, {
							filename: "schema.jsonld",
							getContent: () => output,
							mime: "application/json;charset=utf-8",
							disabled: !output,
							label: locale === "en" ? "Download .jsonld" : "下载 .jsonld"
						})
					]
				}),
				error && /* @__PURE__ */ jsx(Message, {
					tone: "error",
					children: error
				}),
				validation.map((v) => /* @__PURE__ */ jsx(Message, {
					tone: "info",
					children: locale === "en" ? v : v
				}, v))
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ jsx(ToolSection, {
				label: locale === "en" ? "Output" : "输出",
				children: output ? /* @__PURE__ */ jsx(ResultBox, {
					className: "!max-h-[560px]",
					children: output
				}) : /* @__PURE__ */ jsx("div", {
					className: "card p-6 text-center text-sm text-muted-foreground",
					children: locale === "en" ? "Pick a type and fill the fields to generate JSON-LD." : "选择类型并填写字段后生成 JSON-LD。"
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "rounded-[3px] border border-border bg-secondary/40 p-4 text-[13px] leading-6 text-muted-foreground",
				children: [/* @__PURE__ */ jsx("p", {
					className: "font-semibold text-foreground/80",
					children: locale === "en" ? "Notes" : "说明"
				}), /* @__PURE__ */ jsxs("ul", {
					className: "mt-1.5 list-disc space-y-1 pl-5",
					children: [/* @__PURE__ */ jsx("li", { children: locale === "en" ? "Structured data should only include information that truly exists on the page." : "结构化数据只能填写页面上真实存在的信息。" }), /* @__PURE__ */ jsx("li", { children: locale === "en" ? "Output is JSON-validated; actual indexing depends on the search engine — no ranking guarantee." : "生成结果会做 JSON 语法校验；实际收录效果取决于搜索引擎，不保证排名。" })]
				})]
			})]
		})]
	});
}
//#endregion
//#region src/islands/tools/MarkdownEditor.tsx
var SAMPLE = `# 你好，SolHub

这是一个 **Markdown 编辑器**，左侧编辑、右侧实时预览。

## 支持的内容

- 标题、列表、引用、代码块
- [链接](https://solyoung.top)
- 图片 \`![alt](url)\`
- \`行内代码\` 与表格

> 预览输出经过 HTML 净化，不会执行脚本。

\`\`\`js
console.log("Hello, SolHub");
\`\`\`
`;
function MarkdownEditor({ locale = "zh" }) {
	getDict(locale);
	const [text, setText] = useState(SAMPLE);
	const html = useMemo(() => {
		const raw = marked.parse(text);
		return DOMPurify.sanitize(raw, {
			USE_PROFILES: { html: true },
			FORBID_TAGS: [
				"style",
				"script",
				"iframe",
				"object",
				"embed",
				"form",
				"input",
				"button",
				"link",
				"meta"
			],
			FORBID_ATTR: [
				"onerror",
				"onclick",
				"onload",
				"style",
				"srcdoc"
			]
		});
	}, [text]);
	const stats = useMemo(() => countText(text), [text]);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ jsx(CopyButton, {
						getText: () => text,
						label: locale === "en" ? "Copy Markdown" : "复制 Markdown"
					}),
					/* @__PURE__ */ jsx(DownloadButton, {
						filename: "document.md",
						getContent: () => text,
						mime: "text/markdown;charset=utf-8",
						label: locale === "en" ? "Download .md" : "下载 .md"
					}),
					/* @__PURE__ */ jsx(ResetButton, {
						onClick: () => setText(SAMPLE),
						label: locale === "en" ? "Load sample" : "载入示例"
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "ml-auto text-xs text-muted-foreground",
						children: [
							stats.characters.toLocaleString(),
							" ",
							locale === "en" ? "chars" : "字符",
							" · ",
							stats.words.toLocaleString(),
							" ",
							locale === "en" ? "words" : "词"
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					className: "label",
					children: locale === "en" ? "Edit" : "编辑"
				}), /* @__PURE__ */ jsx("textarea", {
					value: text,
					onChange: (e) => setText(e.target.value),
					rows: 22,
					spellCheck: false,
					className: "input scroll-x w-full resize-y font-mono !text-[13px] leading-6",
					"aria-label": locale === "en" ? "Markdown editor" : "Markdown 编辑"
				})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					className: "label",
					children: locale === "en" ? "Preview" : "预览"
				}), /* @__PURE__ */ jsx("div", {
					className: "prose-solhub scroll-x min-h-[560px] w-full rounded-[3px] border border-border bg-card p-4",
					dangerouslySetInnerHTML: { __html: html }
				})] })]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-[3px] border border-border bg-secondary/40 p-4 text-[13px] leading-6 text-muted-foreground",
				children: [/* @__PURE__ */ jsx("p", {
					className: "font-semibold text-foreground/80",
					children: locale === "en" ? "Security note" : "安全说明"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-1.5",
					children: locale === "en" ? "Preview output is sanitized with DOMPurify: scripts, inline events and dangerous tags are removed, so untrusted HTML never executes. Everything runs locally." : "预览输出经过 DOMPurify 净化，脚本、内联事件与危险标签会被移除，不可信 HTML 不会在预览中执行。内容只在浏览器本地处理。"
				})]
			})
		]
	});
}
//#endregion
//#region src/islands/ToolRenderer.tsx
/** slug -> React 组件 的静态映射（与 tools.ts 注册表 component 字段一致） */
var toolComponents = {
	"json-formatter": JsonFormatter,
	"text-counter": TextCounter,
	"url-codec": UrlCodec,
	"base64-codec": Base64Codec,
	"uuid-generator": UuidGenerator,
	"password-generator": PasswordGenerator,
	"timestamp-converter": TimestampConverter,
	"utm-builder": UtmBuilder,
	"qr-generator": QrGenerator,
	"image-compressor": ImageCompressor,
	"aspect-ratio-calculator": AspectRatioCalculator,
	"color-converter": ColorConverter,
	"robots-generator": RobotsGenerator,
	"llms-generator": LlmsGenerator,
	"jsonld-generator": JsonLdGenerator,
	"markdown-editor": MarkdownEditor
};
function ToolRenderer({ component, locale = "zh" }) {
	const Comp = toolComponents[component];
	if (!Comp) return /* @__PURE__ */ jsx("div", {
		className: "card p-6 text-sm text-muted-foreground",
		children: locale === "en" ? "This tool is not implemented yet — it's listed but its workspace is unavailable." : "该工具尚未实现。它已在分类中展示，但工作区暂不可用。"
	});
	return /* @__PURE__ */ jsx(Comp, { locale });
}
//#endregion
//#region src/components/pages/ToolDetail.astro
createAstro("https://solyoung.top");
var $$ToolDetail = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ToolDetail;
	const { tool } = Astro.props;
	const locale = Astro.props.locale ?? "zh";
	const en = locale === "en";
	const dict = getDict(locale);
	const Icon = getIcon(tool.icon);
	const related = (tool.relatedToolIds ?? []).map((id) => getToolById(id)).filter((t) => Boolean(t && t.isImplemented)).slice(0, 3);
	const desc = toolDescription(tool.slug, tool.description, locale);
	const note = toolNote(tool.slug, tool.note, locale);
	const schemaJsonLd = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: tool.name,
		description: desc,
		url: absoluteUrl(`/tools/${tool.slug}/`, locale),
		applicationCategory: "UtilityApplication",
		operatingSystem: "Web",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "CNY"
		}
	};
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": tool.name,
		"description": en ? `${desc} Free online tool — data is processed locally in your browser, no signup needed.` : `${desc} 免费在线使用，数据处理在浏览器本地完成，无需注册。`,
		"route": `/tools/${tool.slug}/`,
		"locale": locale
	}, { "default": ($$result) => renderTemplate` ${maybeRenderHead($$result)}<div class="container-page py-10"> <!-- 面包屑 --><nav class="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground"${addAttribute(en ? "Breadcrumb" : "面包屑", "aria-label")}> <a${addAttribute(p("/", locale), "href")} class="hover:text-foreground">Home</a> <span aria-hidden="true">/</span> <a${addAttribute(p("/tools/", locale), "href")} class="hover:text-foreground">Tools</a> <span aria-hidden="true">/</span> <span class="truncate text-foreground/80">${tool.name}</span> </nav> <!-- 工具头部 --> <header class="mb-8 flex flex-wrap items-start justify-between gap-4"> <div class="flex items-start gap-4"> <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[4px] border border-border bg-secondary text-foreground"> ${renderComponent($$result, "Icon", Icon, {
		"className": "h-6 w-6",
		"aria-hidden": "true"
	})} </span> <div> <div class="flex flex-wrap items-center gap-2"> <h1 class="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl"> ${tool.name} </h1> <span class="badge border-success/30 bg-success/10 text-success">${translate(dict, "common.free")}</span> <span class="badge border-border-strong bg-secondary/60 text-muted-foreground"> ${categoryName(tool.category)} </span> </div> <p class="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-[15px]"> ${desc} </p> </div> </div> <a${addAttribute(p("/tools/", locale), "href")} class="btn btn-ghost !h-8 text-xs">
← ${en ? "Back to toolbox" : "返回工具箱"} </a> </header> <!-- 工作区 --> <section class="card p-5 sm:p-6"${addAttribute(`${tool.name} ${en ? "workspace" : "工作区"}`, "aria-label")}> ${renderComponent($$result, "ToolRenderer", ToolRenderer, {
		"client:load": true,
		"component": tool.component,
		"locale": locale,
		"client:component-hydration": "load",
		"client:component-path": "@/islands/ToolRenderer.tsx",
		"client:component-export": "default"
	})} </section> <!-- 说明与 FAQ --> <div class="mt-8 grid gap-6 lg:grid-cols-2"> <section class="rounded-[3px] border border-border bg-secondary/30 p-5"> <h2 class="font-display text-base font-bold text-foreground">${en ? "How it works & limits" : "功能说明与限制"}</h2> ${note && renderTemplate`<p class="mt-2 text-[13px] leading-6 text-muted-foreground">${note}</p>`} <ul class="mt-3 list-disc space-y-1.5 pl-5 text-[13px] leading-6 text-muted-foreground"> <li>${en ? "Runs locally in your browser — input is never uploaded to any server." : "工具在浏览器本地运行，输入内容不会上传到任何服务器。"}</li> <li>${en ? "No input history is recorded; refreshing clears everything." : "页面不记录你的输入历史，刷新后内容消失。"}</li> <li>${en ? "Results are for reference — double-check critical data before relying on it." : "结果仅供参考，使用前请自行核对关键数据。"}</li> </ul> </section> <section class="rounded-[3px] border border-border bg-secondary/30 p-5"> <h2 class="font-display text-base font-bold text-foreground">${en ? "FAQ" : "常见问题"}</h2> <div class="mt-3 space-y-3 text-[13px] leading-6 text-muted-foreground"> <div> <p class="font-semibold text-foreground/80">${en ? "Where does my data go?" : "数据会发送到哪里？"}</p> <p>${en ? "Nowhere. All computation happens locally via browser JavaScript." : "不会发送。所有计算与转换都通过浏览器 JavaScript 在本地完成。"}</p> </div> <div> <p class="font-semibold text-foreground/80">${en ? "Why does the result differ from another online tool?" : "为什么结果和某在线工具不同？"}</p> <p>${en ? "Different implementations use slightly different boundary rules (e.g. word counting, encoding). This page documents its rules." : "不同实现的边界规则略有差异（如字数统计、编码方式）。本页面已注明规则。"}</p> </div> <div> <p class="font-semibold text-foreground/80">${en ? "Can I copy or download the result?" : "结果可以复制或下载吗？"}</p> <p>${en ? "Yes. Every tool has a copy button, and some support file downloads." : "可以。每个工具的输入输出区都提供复制按钮，部分工具支持下载文件。"}</p> </div> </div> </section> </div> <!-- 相关工具 --> ${related.length > 0 && renderTemplate`<section class="mt-10 border-t border-border pt-8"> <h2 class="font-display text-lg font-bold text-foreground">${en ? "Related tools" : "相关工具"}</h2> <div class="mt-4 grid gap-4 sm:grid-cols-3"> ${related.map((item) => renderTemplate`${renderComponent($$result, "ToolCard", $$ToolCard, {
		"tool": item,
		"locale": locale
	})}`)} </div> </section>`} </div> <script type="application/ld+json">${unescapeHTML(JSON.stringify(schemaJsonLd))}<\/script>` })}`;
}, "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/components/pages/ToolDetail.astro", void 0);
//#endregion
export { $$ToolDetail as t };
