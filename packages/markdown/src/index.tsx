import React, { useRef } from "react";
import { TextStyle, useWindowDimensions, ViewStyle } from "react-native";
import matchAll from "string.prototype.matchall";
import type { defaultFallbackFonts } from "react-native-render-html";
import type { Root } from "remark-parse/lib";
import { Node } from "./component";
import { color, parse } from "./util";

matchAll.shim();

export const Markdown: React.FC<{
	source: {
		markdown?: string;
		ast?: Root;
	};
	style?: ViewStyle;
	pStyle?: TextStyle;
	hStyle?: TextStyle;
	hSizeStep?: number;
	aStyle?: TextStyle;
	codeStyle?: { fontFamily?: string; fontSize?: number; theme?: any };
	tableStyle?: {
		color: string;
		width: string | number;
		borderWidth: number;
		paddingVertical: number;
		paddingHorizontal: number;
	};
	fontMap?: {
		normal?: string;
		bold?: string;
		italic?: string;
		monospace?: string;
	};
	htmlFallbackFonts?: typeof defaultFallbackFonts;
}> = ({
	source,
	style,
	pStyle,
	hStyle,
	hSizeStep,
	aStyle,
	codeStyle,
	tableStyle,
	fontMap,
	htmlFallbackFonts,
}) => {
	const ast = source.ast || parse(source.markdown || "");
	style = Object.assign(
		{},
		{ flex: 1, alignSelf: "center", width: "100%", padding: 25 },
		style,
	);
	pStyle = Object.assign(
		{},
		{
			color: "#212121",
			fontFamily: fontMap?.normal || "serif",
			fontSize: 16,
		},
		pStyle,
	);
	hStyle = Object.assign(
		{},
		{
			fontFamily: fontMap?.bold || "sans-serif",
		},
		pStyle,
		hStyle,
	);
	hSizeStep = hSizeStep || 2;
	aStyle = Object.assign(
		{},
		{
			color: "#4fc3f7",
			textDecorationLine: "underline",
		},
		aStyle,
	);
	codeStyle = Object.assign(
		{},
		{
			fontFamily: fontMap?.monospace || "monospace",
			fontSize: (pStyle.fontSize || 16) * 0.95,
		},
		codeStyle,
	);
	tableStyle = Object.assign(
		{},
		{
			color: color(pStyle.color as string, 0.75),
			width: "80%",
			borderWidth: 1,
			paddingVertical: 5,
			paddingHorizontal: 10,
		},
		tableStyle,
	);

	const { width } = useWindowDimensions();
	const definitions = useRef<Record<string, string>>({}).current;

	return (
		<Node
			node={ast as any}
			width={width}
			definitions={definitions}
			style={style}
			pStyle={pStyle}
			hStyle={hStyle}
			hSizeStep={hSizeStep}
			aStyle={aStyle}
			codeStyle={codeStyle}
			tableStyle={tableStyle}
			fontMap={fontMap}
			htmlFallbackFonts={htmlFallbackFonts}
		/>
	);
};
