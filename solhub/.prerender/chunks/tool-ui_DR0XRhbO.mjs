import { n as copyText, o as getLocale, r as cx } from "./BaseLayout_BpPz4rCZ.mjs";
import { useRef, useState } from "react";
import { Check, Copy, Download, Eraser, RotateCcw, X } from "lucide-react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/components/tool-ui.tsx
/** 统一的操作反馈：复制 / 下载 / 重置 / 清空 / 状态消息 / 结果区 */
function CopyButton({ getText, label = "复制", copiedLabel, failedLabel, onStatus, className, disabled = false }) {
	const [state, setState] = useState("idle");
	const timer = useRef(null);
	const en = getLocale() === "en";
	const copiedText = copiedLabel ?? (en ? "Copied" : "已复制");
	const failedText = failedLabel ?? (en ? "Copy failed" : "复制失败");
	const onClick = async () => {
		if (disabled) return;
		const ok = await copyText(getText());
		setState(ok ? "copied" : "failed");
		onStatus?.(ok);
		if (timer.current) clearTimeout(timer.current);
		timer.current = setTimeout(() => setState("idle"), 1800);
	};
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		onClick,
		disabled,
		className: cx("btn btn-outline !h-8 px-3 text-xs", state === "copied" && "border-success/40 bg-success/10 text-success", state === "failed" && "border-destructive/40 bg-destructive/10 text-destructive", className),
		"aria-live": "polite",
		children: state === "copied" ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
			/* @__PURE__ */ jsx(Check, {
				className: "h-3.5 w-3.5",
				"aria-hidden": "true"
			}),
			" ",
			copiedText
		] }) : state === "failed" ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
			/* @__PURE__ */ jsx(X, {
				className: "h-3.5 w-3.5",
				"aria-hidden": "true"
			}),
			" ",
			failedText
		] }) : /* @__PURE__ */ jsxs(Fragment$1, { children: [
			/* @__PURE__ */ jsx(Copy, {
				className: "h-3.5 w-3.5",
				"aria-hidden": "true"
			}),
			" ",
			label
		] })
	});
}
function DownloadButton({ filename, getContent, mime = "text/plain;charset=utf-8", label = "下载", disabled = false }) {
	const onClick = () => {
		const blob = new Blob([getContent()], { type: mime });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		setTimeout(() => URL.revokeObjectURL(url), 1e3);
	};
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick,
		disabled,
		className: "btn btn-outline !h-8 px-3 text-xs",
		children: [
			/* @__PURE__ */ jsx(Download, {
				className: "h-3.5 w-3.5",
				"aria-hidden": "true"
			}),
			" ",
			label
		]
	});
}
function ResetButton({ onClick, label = "重置", disabled = false }) {
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick,
		disabled,
		className: "btn btn-ghost !h-8 px-3 text-xs",
		children: [
			/* @__PURE__ */ jsx(RotateCcw, {
				className: "h-3.5 w-3.5",
				"aria-hidden": "true"
			}),
			" ",
			label
		]
	});
}
function ClearButton({ onClick, label = "清空", disabled = false }) {
	return /* @__PURE__ */ jsxs("button", {
		type: "button",
		onClick,
		disabled,
		className: "btn btn-ghost !h-8 px-3 text-xs",
		children: [
			/* @__PURE__ */ jsx(Eraser, {
				className: "h-3.5 w-3.5",
				"aria-hidden": "true"
			}),
			" ",
			label
		]
	});
}
function Message({ tone, children }) {
	const cls = {
		info: "border-border bg-secondary/50 text-muted-foreground",
		error: "border-destructive/30 bg-destructive/10 text-destructive",
		success: "border-success/30 bg-success/10 text-success"
	}[tone];
	return /* @__PURE__ */ jsx("p", {
		role: tone === "error" ? "alert" : "status",
		className: cx("rounded-[2px] border px-3 py-2 text-[13px] leading-5", cls),
		children
	});
}
function ToolSection({ label, children, hint }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
		className: "mb-1.5 flex items-baseline justify-between gap-2",
		children: [/* @__PURE__ */ jsx("span", {
			className: "label !mb-0",
			children: label
		}), hint && /* @__PURE__ */ jsx("span", {
			className: "text-[11px] text-muted-foreground",
			children: hint
		})]
	}), children] });
}
function ResultBox({ children, className }) {
	return /* @__PURE__ */ jsx("pre", {
		className: cx("scroll-x max-h-[420px] w-full rounded-[3px] border border-border bg-secondary/40 p-3.5 font-mono text-[13px] leading-6 whitespace-pre-wrap break-all text-foreground/85", className),
		children
	});
}
//#endregion
export { ResetButton as a, Message as i, CopyButton as n, ResultBox as o, DownloadButton as r, ToolSection as s, ClearButton as t };
