import { r as p, t as absoluteUrl } from "./paths_BlCYKCPI.mjs";
import { C as unescapeHTML, g as addAttribute, m as maybeRenderHead, o as renderComponent, p as renderTemplate, s as Fragment } from "./server_Ciq-jqkO.mjs";
import { O as createAstro, T as products, _ as getDict, a as formatDateZh, b as productCategoryName, d as productCategoryNameLocalized, f as productDescription, k as createComponent, p as productShortDescription, t as $$BaseLayout } from "./BaseLayout_BpPz4rCZ.mjs";
import { t as rankProducts } from "./ranking_CsDXrXF_.mjs";
import { n as $$Badge, t as $$ProductCard } from "./ProductCard_-weNsyPB.mjs";
import { AlertCircle, ExternalLink, ShieldCheck } from "lucide-react";
//#region src/components/pages/ProductDetail.astro
createAstro("https://solyoung.top");
var $$ProductDetail = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ProductDetail;
	const { product } = Astro.props;
	const locale = Astro.props.locale ?? "zh";
	const en = locale === "en";
	getDict(locale);
	const meta = {
		verified: {
			title: en ? "Verified" : "已核验",
			text: en ? "SolHub editors actually visited the product's website, checked the name, description and reachability, then marked it Verified. Verification reflects truthfulness and reachability at the time of checking — not a quality guarantee." : "SolHub 编辑已实际访问该产品官网，核对产品名称、描述与站点可用性后标记为 Verified。核验不代表产品功能质量的保证，仅代表核验时点上的真实性与可访问性。"
		},
		pending: {
			title: en ? "Pending" : "待核验",
			text: en ? "This product is in SolHub's verification queue, waiting for an actual editor check. It will not show Verified before that." : "该产品已进入 SolHub 核验队列，等待编辑实际核验。核验完成前不会显示 Verified 状态。"
		},
		unverified: {
			title: en ? "Unverified" : "未核验",
			text: en ? "This product has not been verified by SolHub. Unverified doesn't mean something is wrong — we simply haven't checked its website and description yet." : "该产品尚未通过 SolHub 核验。未核验不代表产品有问题，只是我们还没有实际确认过它的官网与描述。"
		}
	}[product.verificationStatus];
	const related = rankProducts(products).filter((p) => p.id !== product.id).slice(0, 3);
	const shortDesc = productShortDescription(product.slug, product.shortDescription, locale);
	const fullDesc = productDescription(product.slug, product.description, locale);
	const schemaJsonLd = {
		"@context": "https://schema.org",
		"@type": product.isDemo ? "Product" : "SoftwareApplication",
		name: product.name,
		description: shortDesc,
		url: absoluteUrl(`/products/${product.slug}/`, locale),
		...product.isDemo ? {} : {
			applicationCategory: "WebApplication",
			operatingSystem: "Web"
		},
		...product.websiteUrl ? { sameAs: [product.websiteUrl] } : {}
	};
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": product.name,
		"description": shortDesc,
		"route": `/products/${product.slug}/`,
		"ogType": "website",
		"locale": locale
	}, { "default": ($$result) => renderTemplate` ${maybeRenderHead($$result)}<div class="container-page py-10"> <!-- 面包屑 --><nav class="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground"${addAttribute(en ? "Breadcrumb" : "面包屑", "aria-label")}> <a${addAttribute(p("/", locale), "href")} class="hover:text-foreground">Home</a> <span aria-hidden="true">/</span> <a${addAttribute(p("/launches/", locale), "href")} class="hover:text-foreground">Launches</a> <span aria-hidden="true">/</span> <span class="truncate text-foreground/80">${product.name}</span> </nav> <div class="grid gap-10 lg:grid-cols-[1fr_300px]"> <!-- 主栏 --><article> <div class="flex items-start gap-4"> ${product.icon ? renderTemplate`<img${addAttribute(product.icon, "src")} alt="" class="h-16 w-16 shrink-0 rounded-[4px] border border-border bg-card object-cover">` : renderTemplate`<span class="flex h-16 w-16 shrink-0 items-center justify-center rounded-[4px] border border-border bg-secondary font-display text-xl font-bold text-foreground/70" aria-hidden="true"> ${product.name.slice(0, 2).toUpperCase()} </span>`} <div class="min-w-0"> <h1 class="font-display text-3xl font-extrabold tracking-tight text-foreground"> ${product.name} </h1> <p class="mt-2 text-[15px] leading-7 text-muted-foreground"> ${shortDesc} </p> </div> </div> ${product.isDemo && renderTemplate`<div class="mt-5 flex items-start gap-2.5 rounded-[3px] border border-warning/30 bg-warning/10 p-4 text-sm leading-6 text-warning"> ${renderComponent($$result, "AlertCircle", AlertCircle, {
		"className": "mt-0.5 h-4 w-4 shrink-0",
		"aria-hidden": "true"
	})} <p> ${en ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`This is <strong>demo data</strong>: it only illustrates SolHub's product-page structure and does not represent any real, operating product. Demo entries never receive a verification status.` })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`这是一条<strong>演示数据</strong>：仅用于展示 SolHub 产品详情页的信息架构，不代表任何真实运营的产品。演示数据不会被授予任何核验状态。` })}`} </p> </div>`} <div class="mt-8"> <h2 class="font-display text-lg font-bold text-foreground">${en ? "About this product" : "关于这个产品"}</h2> <p class="prose-solhub mt-3 whitespace-pre-line">${fullDesc}</p> </div> <div class="mt-8 flex flex-wrap gap-2"> ${product.tags.map((tag) => renderTemplate`<span class="badge border-border bg-secondary/50 text-muted-foreground">#${tag}</span>`)} </div> <div class="mt-8 grid gap-4 sm:grid-cols-2"> <a${addAttribute(product.websiteUrl, "href")} target="_blank" rel="noopener noreferrer" class="btn btn-primary !h-11 w-full"> ${en ? "Visit website" : "访问官网"} ${renderComponent($$result, "ExternalLink", ExternalLink, {
		"className": "h-4 w-4",
		"aria-hidden": "true"
	})} </a> <a${addAttribute(p("/submit/", locale), "href")} class="btn btn-outline !h-11 w-full"> ${en ? "Submit your product" : "提交你的产品"} </a> </div> <!-- 相关产品 --> <div class="mt-12 border-t border-border pt-8"> <h2 class="font-display text-lg font-bold text-foreground">${en ? "You may also like" : "你可能也感兴趣"}</h2> <div class="mt-4 grid gap-4 sm:grid-cols-3"> ${related.map((item) => renderTemplate`${renderComponent($$result, "ProductCard", $$ProductCard, {
		"product": item,
		"locale": locale
	})}`)} </div> </div> </article> <!-- 侧栏：核验信息 --> <aside class="space-y-5 lg:pt-1"> <div class="card p-5"> <h2 class="flex items-center gap-2 text-sm font-bold text-foreground"> ${renderComponent($$result, "ShieldCheck", ShieldCheck, {
		"className": "h-4 w-4 text-success",
		"aria-hidden": "true"
	})} ${en ? "Verification status" : "核验状态"} </h2> <div class="mt-3"> ${renderComponent($$result, "Badge", $$Badge, {
		"status": product.verificationStatus,
		"isDemo": product.isDemo,
		"locale": locale
	})} </div> <p class="mt-3 text-[13px] leading-6 text-muted-foreground">${meta.text}</p> ${product.verificationStatus === "verified" && product.verifiedAt && renderTemplate`<p class="mt-3 border-t border-border pt-3 text-xs text-muted-foreground"> ${en ? "Verified at" : "核验时间"}：${formatDateZh(product.verifiedAt)} <br> ${en ? "Method" : "核验方式"}：${product.verificationMethod} </p>`} </div> <dl class="card divide-y divide-border p-5 text-sm"> <div class="flex items-center justify-between py-2"> <dt class="text-muted-foreground">${en ? "Category" : "分类"}</dt> <dd class="font-medium text-foreground">${productCategoryNameLocalized(product.category, productCategoryName(product.category), locale)}</dd> </div> <div class="flex items-center justify-between py-2"> <dt class="text-muted-foreground">${en ? "Developer" : "开发者"}</dt> <dd class="font-medium text-foreground">${product.developerName}</dd> </div> <div class="flex items-center justify-between py-2"> <dt class="text-muted-foreground">${en ? "Added" : "收录时间"}</dt> <dd class="font-medium text-foreground">${formatDateZh(product.publishedAt)}</dd> </div> <div class="flex items-center justify-between py-2"> <dt class="text-muted-foreground">${en ? "Launch batch" : "榜单批次"}</dt> <dd class="font-medium text-foreground">${product.launchBatch}</dd> </div> </dl> <div class="card p-5"> <p class="text-[13px] leading-6 text-muted-foreground"> ${en ? "Want on the list? Submit your product — it gets Verified only after passing a real check. Verification is manual today; automatic checks (Meta Tag / DNS TXT) are not enabled yet." : "想加入榜单？提交你的产品，通过核验后将获得 Verified 状态。当前核验为人工核验，自动核验（Meta Tag / DNS TXT）功能尚未启用。"} </p> <a${addAttribute(p("/submit/", locale), "href")} class="btn btn-accent mt-3 w-full !h-9"> ${en ? "Submit product" : "提交产品"} </a> </div> </aside> </div> </div> <script type="application/ld+json">${unescapeHTML(JSON.stringify(schemaJsonLd))}<\/script>` })}`;
}, "/Users/songyang/Doubao/chats/2026-10-16/new-chat/src/components/pages/ProductDetail.astro", void 0);
//#endregion
export { $$ProductDetail as t };
