import { a as __exportAll, r as p } from "./paths_BlCYKCPI.mjs";
import { _ as createRenderInstruction, g as addAttribute, m as maybeRenderHead, o as renderComponent, p as renderTemplate } from "./server_Ciq-jqkO.mjs";
import { k as createComponent, t as $$BaseLayout } from "./BaseLayout_BpPz4rCZ.mjs";
//#region node_modules/astro/dist/runtime/server/render/script.js
/**
* Relies on the `renderScript: true` compiler option
* @experimental
*/
async function renderScript(result, id) {
	const inlined = result.inlinedScripts.get(id);
	let content = "";
	if (inlined != null) {
		if (inlined) content = `<script type="module">${inlined}<\/script>`;
	} else {
		const resolved = await result.resolve(id);
		content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
	}
	return createRenderInstruction({
		type: "script",
		id,
		content
	});
}
//#endregion
//#region src/pages/products/c-[id].astro
var c__id__exports = /* @__PURE__ */ __exportAll({
	default: () => $$CId,
	file: () => $$file,
	url: () => $$url
});
var $$CId = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": "社区产品 · SolHub",
		"description": "社区提交的产品详情"
	}, { "default": ($$result) => renderTemplate` ${maybeRenderHead($$result)}<div id="community-detail" class="container-page py-10"> <div class="text-sm text-muted-foreground"> <a${addAttribute(p("/"), "href")} class="hover:text-accent">Home</a> <span class="mx-1.5">/</span> <a${addAttribute(p("/launches/"), "href")} class="hover:text-accent">Launches</a> <span class="mx-1.5">/</span> <span id="cd-loading">加载中…</span> </div> <div id="cd-content" class="mt-6 hidden"> <div class="flex items-start gap-5"> <img id="cd-icon" class="h-20 w-20 rounded-[4px] border border-border bg-card object-cover" alt=""> <div class="min-w-0 flex-1"> <h1 id="cd-name" class="font-display text-3xl font-bold tracking-tight text-foreground"></h1> <p id="cd-desc" class="mt-2 text-base text-muted-foreground"></p> <span id="cd-badge" class="mt-3 inline-block badge border-accent/30 bg-accent/10 text-accent"></span> </div> </div> <h2 class="mt-10 font-display text-lg font-bold text-foreground">关于这个产品</h2> <p id="cd-full" class="mt-3 max-w-2xl whitespace-pre-line text-[15px] leading-7 text-foreground/80"></p> <div id="cd-tags" class="mt-4 flex flex-wrap gap-2"></div> <div class="mt-8 flex flex-wrap gap-3"> <a id="cd-visit" href="#" target="_blank" rel="noopener noreferrer" class="btn btn-accent !h-11 px-6">
访问官网 ↗
</a> <a${addAttribute(p("/submit/"), "href")} class="btn btn-outline !h-11 px-6">提交你的产品</a> </div> <div class="mt-10 rounded-[4px] border border-border bg-card p-5"> <h3 class="font-display text-sm font-bold text-foreground">核验状态</h3> <span class="mt-2 inline-block badge border-border-strong bg-secondary/60 text-muted-foreground">社区提交 · 待核验</span> <p class="mt-3 text-[13px] leading-6 text-muted-foreground">
这是由社区用户通过 GitHub Issues 提交的产品，尚未经 SolHub 编辑人工核验。核验后将标记为 Verified。
</p> </div> </div> </div> ` })}${renderScript($$result, "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/pages/products/c-[id].astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/pages/products/c-[id].astro", void 0);
var $$file = "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/pages/products/c-[id].astro";
var $$url = "/solhub/products/c-[id]/";
//#endregion
//#region \0virtual:astro:page:src/pages/products/c-[id]@_@astro
var page = () => c__id__exports;
//#endregion
export { page };
