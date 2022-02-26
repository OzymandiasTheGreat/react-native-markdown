import { unified } from "unified";
import markdown from "remark-parse";
import gfm from "remark-gfm";
import colorString from "color-string";
import type { Root } from "remark-parse/lib";
import type { NodeType } from "./types";

export const parse = (content: string): Root => {
	const engine = unified().use(markdown).use(gfm);
	const ast = engine.parse(content);
	return engine.runSync(ast);
};

export const imgDims = (alt: string) => {
	const match = [...alt.matchAll(/(.+)(?:[\s\-_.])(\d+?)x(\d+?)$/gm)];
	return {
		label: match[0]?.[1] || alt,
		width: parseInt(match[0]?.[2], 10) || undefined,
		height: parseInt(match[0]?.[3], 10) || undefined,
	};
};

export const slugify = (children: NodeType[]) => {
	const slug: string[] = children
		.map((child) => {
			if ("value" in child) {
				return child.value.replace(/\s+/g, "-");
			}
			if ("children" in child) {
				return slugify(child.children);
			}
			return "";
		})
		.flat();
	return slug.join("-");
};

export const color = (color?: string, opactity?: number): string => {
	let data = [0, 0, 0, 0];
	try {
		data = colorString.get.rgb(color as string);
	} catch {}
	if (typeof opactity === "number" && opactity <= 1 && opactity >= 0) {
		data[3] = opactity;
	}
	return colorString.to.hex(data);
};
