import { r as p } from "./paths_BlCYKCPI.mjs";
import { g as addAttribute, m as maybeRenderHead, o as renderComponent, p as renderTemplate } from "./server_Ciq-jqkO.mjs";
import { O as createAstro, _ as getDict, b as productCategoryName, d as productCategoryNameLocalized, i as formatDateIso, k as createComponent, p as productShortDescription, v as translate } from "./BaseLayout_BpPz4rCZ.mjs";
import { t as getIcon } from "./icons_BelbreN-.mjs";
//#region src/components/Badge.astro
createAstro("https://solyoung.top");
var $$Badge = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Badge;
	const { status, isDemo = false, locale = "zh" } = Astro.props;
	const dict = getDict(locale);
	const cfg = {
		verified: {
			label: "Verified",
			icon: "ShieldCheck",
			classes: "border-success/30 bg-success/10 text-success",
			titleKey: "about.verifiedText"
		},
		pending: {
			label: "Pending",
			icon: "Clock",
			classes: "border-warning/30 bg-warning/10 text-warning",
			titleKey: "about.pendingText"
		},
		unverified: {
			label: "Unverified",
			icon: "ShieldAlert",
			classes: "border-border-strong bg-secondary/60 text-muted-foreground",
			titleKey: "about.unverifiedText"
		}
	}[status];
	const Icon = getIcon(cfg.icon);
	return renderTemplate`${maybeRenderHead($$result)}<span class="inline-flex items-center gap-1.5"> ${isDemo && renderTemplate`<span class="badge border-border-strong bg-secondary text-muted-foreground"${addAttribute(locale === "en" ? "Demo data: for display only, not real operation data" : "演示数据：仅用于展示产品形态，不代表真实运营数据", "title")}> ${translate(dict, "common.demo")} ${locale === "en" ? "data" : "数据"} </span>`} <span${addAttribute(["badge", cfg.classes], "class:list")}${addAttribute(translate(dict, cfg.titleKey), "title")}> ${renderComponent($$result, "Icon", Icon, {
		"className": "h-3 w-3",
		"aria-hidden": "true"
	})} ${cfg.label} </span> </span>`;
}, "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/components/Badge.astro", void 0);
//#endregion
//#region src/components/ProductCard.astro
createAstro("https://solyoung.top");
var $$ProductCard = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ProductCard;
	const { product, rank, highlight = false, locale = "zh" } = Astro.props;
	getDict(locale);
	function initials(name) {
		return name.trim().slice(0, 2).toUpperCase();
	}
	return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(p(`/products/${product.slug}/`, locale), "href")}${addAttribute(["card group relative flex h-full flex-col p-5 transition-all duration-200", highlight ? "hover:-translate-y-0.5 hover:shadow-lg" : "hover:-translate-y-0.5 hover:shadow-md"], "class:list")}> ${rank !== void 0 && renderTemplate`<span${addAttribute([
		"font-display absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-[2px] text-sm font-bold",
		rank === 1 && "bg-accent text-accent-foreground",
		rank === 2 && "bg-foreground text-background",
		rank === 3 && "bg-secondary text-foreground border border-border"
	], "class:list")}${addAttribute(locale === "en" ? `Rank ${rank}` : `第 ${rank} 名`, "aria-label")}> ${rank} </span>`} <div class="flex items-start gap-3"> ${product.icon ? renderTemplate`<img${addAttribute(product.icon, "src")} alt="" loading="lazy" class="h-11 w-11 shrink-0 rounded-[3px] border border-border bg-card object-cover">` : renderTemplate`<span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] border border-border bg-secondary font-display text-[15px] font-bold text-foreground/70" aria-hidden="true"> ${initials(product.name)} </span>`} <div class="min-w-0 flex-1"> <h3 class="font-display truncate text-[15px] font-bold text-foreground group-hover:text-accent"> ${product.name} </h3> <p class="mt-0.5 text-[11px] text-muted-foreground"> ${productCategoryNameLocalized(product.category, productCategoryName(product.category), locale)} </p> </div> </div> <p class="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-foreground/75"> ${productShortDescription(product.slug, product.shortDescription, locale)} </p> ${product.tags.length > 0 && renderTemplate`<div class="mt-3 flex flex-wrap gap-1.5"> ${product.tags.slice(0, 3).map((tag) => renderTemplate`<span class="badge border-border bg-secondary/50 text-muted-foreground"> ${tag} </span>`)} </div>`} <div class="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3"> ${renderComponent($$result, "Badge", $$Badge, {
		"status": product.verificationStatus,
		"isDemo": product.isDemo,
		"locale": locale
	})} <span class="flex items-center gap-1 text-xs text-muted-foreground"> <span>${formatDateIso(product.publishedAt)}</span> <span class="text-muted-foreground/50 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true">→</span> </span> </div> </a>`;
}, "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/components/ProductCard.astro", void 0);
//#endregion
export { $$Badge as n, $$ProductCard as t };
