import React, { useEffect, useState } from "react";
import { Image, Text, TextStyle, ViewStyle } from "react-native";
import {
	A,
	Article,
	BlockQuote,
	BR,
	Code,
	Del,
	EM,
	H1,
	H2,
	H3,
	H4,
	H5,
	H6,
	HR,
	LI,
	P,
	Strong,
	Table,
	TBody,
	TD,
	TR,
	UL,
} from "@expo/html-elements";
import RenderHTML, {
	defaultFallbackFonts,
	defaultHTMLElementModels,
	defaultSystemFonts,
	HTMLContentModel,
} from "react-native-render-html";
import SyntaxHighlighter from "react-native-syntax-highlighter";
import ol from "@jsamr/counter-style/presets/arabicIndic";
import disc from "@jsamr/counter-style/presets/disc";
import { MarkedList, MarkerBox } from "@jsamr/react-native-li";
import type { Table as TableType } from "mdast";
import { color, imgDims, slugify } from "./util";
import type { NodeType } from "./types";

const pickComponent = ({
	node,
	width,
	style,
	pStyle,
	hStyle,
	hSizeStep,
	aStyle,
	codeStyle,
	tableStyle,
	fontMap,
	htmlFallbackFonts,
	definitions,
}: {
	node: NodeType;
	width: number;
	style: ViewStyle;
	pStyle: TextStyle;
	hStyle: TextStyle;
	hSizeStep: number;
	aStyle: TextStyle;
	codeStyle: { fontFamily?: string; fontSize?: number; theme?: any };
	fontMap?: {
		normal?: string;
		bold?: string;
		italic?: string;
		monospace?: string;
	};
	htmlFallbackFonts?: typeof defaultFallbackFonts;
	tableStyle: {
		color: string;
		width: string | number;
		borderWidth: number;
		paddingVertical: number;
		paddingHorizontal: number;
	};
	definitions: Record<string, string>;
}): React.FC<any> => {
	switch (node.type) {
		case "root" as any:
			const Root: React.FC = ({ children }) => (
				<Article
					style={[
						style,
						{ width: Math.min(style.width as number, width) },
					]}>
					{children}
				</Article>
			);
			return Root;
		case "paragraph":
			const Paragraph: React.FC = ({ children }) => (
				<P style={pStyle}>{children}</P>
			);
			return Paragraph;
		case "heading":
			const index = node.depth - 1;
			const fontSize =
				(6 - node.depth) * hSizeStep +
				(hStyle.fontSize || pStyle.fontSize || 16);
			const Component = [H1, H2, H3, H4, H5, H6][index];
			const slug = slugify(node.children);
			const Heading: React.FC = ({ children }) => (
				<Component
					nativeID={slug}
					style={[pStyle, hStyle, { fontSize }]}>
					<A
						style={[aStyle, hStyle, { fontSize }]}
						href={`#${slug}`}>
						{children}
					</A>
				</Component>
			);
			return Heading;
		case "thematicBreak":
			const ThematicBreak: React.FC = () => (
				<HR
					// eslint-disable-next-line react-native/no-inline-styles
					style={{
						backgroundColor: pStyle.color,
						width: "90%",
						alignSelf: "center",
						marginHorizontal: "auto",
					}}
				/>
			);
			return ThematicBreak;
		case "blockquote":
			const Blockquote: React.FC = ({ children }) => (
				<BlockQuote
					// eslint-disable-next-line react-native/no-inline-styles
					style={{
						backgroundColor: color(pStyle.color as string, 0.1),
						paddingVertical: 10,
						paddingHorizontal: 15,
						borderStartColor: color(pStyle.color as string, 0.75),
						borderStartWidth: 8,
						marginStart: 20,
					}}>
					{children}
				</BlockQuote>
			);
			return Blockquote;
		case "list":
			const counter = node.ordered ? ol : disc;
			const start = node.start || 0;
			const List: React.FC = ({ children }) => (
				<MarkedList
					counterRenderer={counter}
					Container={UL}
					startIndex={start}
					renderMarker={(props) => (
						<P style={[pStyle]}>
							<MarkerBox {...props} />
						</P>
					)}>
					{children}
				</MarkedList>
			);
			return List;
		case "listItem":
			const ListItem: React.FC = ({ children }) => <LI>{children}</LI>;
			return ListItem;
		case "html":
			const HTML: React.FC<{ value: string }> = ({ value }) => (
				<RenderHTML
					source={{ html: value }}
					contentWidth={width}
					customHTMLElementModels={{
						img: defaultHTMLElementModels.img.extend({
							contentModel: HTMLContentModel.mixed,
						}),
					}}
					fallbackFonts={{
						...defaultFallbackFonts,
						...htmlFallbackFonts,
					}}
					defaultTextProps={{
						style: pStyle,
					}}
					systemFonts={[
						...defaultSystemFonts,
						pStyle.fontFamily || "",
					]}
					pressableHightlightColor={aStyle.color as string}
				/>
			);
			return HTML;
		case "code":
			const CodeBlock: React.FC<{ lang: string; value: string }> = ({
				lang,
				value,
			}) => (
				<SyntaxHighlighter
					language={lang || ""}
					fontFamily={fontMap?.monospace || codeStyle?.fontFamily}
					fontSize={codeStyle?.fontSize}
					highlighter="prism"
					style={codeStyle?.theme}>
					{value}
				</SyntaxHighlighter>
			);
			return CodeBlock;
		case "definition":
			definitions[node.identifier] = node.url;
			const Def: React.FC = () => <></>;
			return Def;
		case "text":
			const TextNode: React.FC<{ value: string }> = ({ value }) => (
				<Text>{value}</Text>
			);
			return TextNode;
		case "emphasis":
			const Em: React.FC = ({ children }) => (
				<EM style={{ fontFamily: fontMap?.italic }}>{children}</EM>
			);
			return Em;
		case "strong":
			const StrongNode: React.FC = ({ children }) => (
				<Strong style={{ fontFamily: fontMap?.bold }}>
					{children}
				</Strong>
			);
			return StrongNode;
		case "inlineCode":
			const InlineCode: React.FC<{ value: string }> = ({ value }) => (
				<Code
					style={{
						fontFamily:
							fontMap?.monospace || codeStyle?.fontFamily,
						fontSize: codeStyle?.fontSize,
						backgroundColor: color(pStyle.color as string, 0.1),
					}}>
					{value}
				</Code>
			);
			return InlineCode;
		case "break":
			const Break: React.FC = () => <BR>{"\r\n"}</BR>;
			return Break;
		case "link":
			const Link: React.FC<{ url: string; title?: string }> = ({
				children,
				url,
				title,
			}) => (
				<A style={[aStyle]} href={url} accessibilityLabel={title}>
					{children}
				</A>
			);
			return Link;
		case "image":
			const imgData = imgDims(node.alt || "");
			const Img: React.FC<{ url: string }> = ({ url }) => {
				const [w, setW] = useState(imgData.width);
				const [h, setH] = useState(imgData.height);

				useEffect(() => {
					Image.getSize(url, (rw, rh) => {
						const ratio = rw / rh;
						if (!imgData.width && !imgData.height) {
							setW(Math.floor(Math.min(rw, width)));
							setH(Math.floor(Math.min(rh, width * ratio)));
						}
					});
				}, [url]);

				return (
					<>
						{!!w && !!h && (
							<Image
								source={{
									uri: url,
									width: w,
									height: h,
								}}
								accessibilityLabel={imgData.label}
								resizeMode="contain"
							/>
						)}
					</>
				);
			};
			return Img;
		case "linkReference":
			const LinkRef: React.FC<{
				identifier: string;
				title?: string;
			}> = ({ children, identifier, title }) => (
				<A
					style={[aStyle]}
					href={definitions[identifier] || "#"}
					accessibilityLabel={title}>
					{children}
				</A>
			);
			return LinkRef;
		case "imageReference":
			const imgRefData = imgDims(node.alt || "");
			const ImgRef: React.FC<{ identifier: string }> = ({
				identifier,
			}) => {
				const [w, setW] = useState(imgData.width);
				const [h, setH] = useState(imgData.height);

				useEffect(() => {
					Image.getSize(definitions[identifier], (rw, rh) => {
						const ratio = rw / rh;
						if (!imgData.width && !imgData.height) {
							setW(Math.floor(Math.min(rw, width)));
							setH(Math.floor(Math.min(rh, width * ratio)));
						}
					});
				}, [identifier]);

				return (
					<>
						{!!w && !!h && (
							<Image
								source={{
									uri: definitions[identifier],
									width: w,
									height: h,
								}}
								accessibilityLabel={imgData.label}
								resizeMode="contain"
							/>
						)}
					</>
				);
			};
			return ImgRef;
		case "footnoteDefinition":
			const FootnoteDef: React.FC<{
				identifier: string;
				label: string;
				title?: string;
			}> = ({ children, identifier, label, title }) => (
				<P nativeID={`footnote-${identifier}`} style={[pStyle]}>
					<A
						href={`#reference-${identifier}`}
						style={[
							aStyle,
							// eslint-disable-next-line react-native/no-inline-styles
							{
								fontSize:
									(aStyle.fontSize ||
										pStyle.fontSize ||
										16) * 0.8,
								position: "relative",
								top: "-45%",
							},
						]}
						accessibilityLabel={title}>
						[{label}]
					</A>
					: {children}
				</P>
			);
			return FootnoteDef;
		case "footnoteReference":
			const FootnoteRef: React.FC<{
				identifier: string;
				label: string;
				title?: string;
			}> = ({ identifier, label, title }) => (
				<A
					href={`#footnote-${identifier}`}
					nativeID={`reference-${identifier}`}
					style={[
						aStyle,
						// eslint-disable-next-line react-native/no-inline-styles
						{
							fontSize:
								(aStyle.fontSize || pStyle.fontSize || 16) *
								0.45,
							position: "relative",
							top: "-65%",
						},
					]}
					accessibilityLabel={title}>
					[{label}]
				</A>
			);
			return FootnoteRef;
		case "table":
			const TableNode: React.FC<{ children: TableType["children"] }> = ({
				children,
			}) => (
				<Table
					style={{ width: tableStyle.width, alignSelf: "center" }}>
					<TBody>
						{children.map((row, i) => (
							<TR
								key={i}
								style={{
									flexDirection: "row",
									justifyContent: "flex-start",
								}}>
								{row.children.map((cell, j) => (
									<TD
										key={j}
										style={[
											pStyle,
											{
												flex: 1 / row.children.length,
												borderColor: tableStyle.color,
												borderTopWidth: !i
													? tableStyle.borderWidth
													: 0,
												borderLeftWidth: !j
													? tableStyle.borderWidth
													: 0,
												borderRightWidth:
													tableStyle.borderWidth,
												borderBottomWidth:
													tableStyle.borderWidth,
												paddingVertical:
													tableStyle.paddingVertical,
												paddingHorizontal:
													tableStyle.paddingHorizontal,
											},
										]}>
										{cell.children.map((child, k) => (
											<Node
												key={k}
												node={child}
												aStyle={aStyle}
												codeStyle={codeStyle}
												definitions={definitions}
												hSizeStep={hSizeStep}
												hStyle={hStyle}
												pStyle={pStyle}
												tableStyle={tableStyle}
												style={style}
												width={width}
												fontMap={fontMap}
												htmlFallbackFonts={
													htmlFallbackFonts
												}
											/>
										))}
									</TD>
								))}
							</TR>
						))}
					</TBody>
				</Table>
			);
			return TableNode;
		case "delete":
			const Delete: React.FC = ({ children }) => <Del>{children}</Del>;
			return Delete;
		default:
			console.warn(`Unhandled node in markdown: ${node.type}`);
			const Unhandled: React.FC = ({ children }) => <>{children}</>;
			return Unhandled;
	}
};

export const Node: React.FC<{
	node: NodeType;
	width: number;
	definitions: Record<string, string>;
	style: ViewStyle;
	pStyle: TextStyle;
	hStyle: TextStyle;
	hSizeStep: number;
	aStyle: TextStyle;
	codeStyle: { fontFamily?: string; fontSize?: number; theme?: any };
	fontMap?: {
		normal?: string;
		bold?: string;
		italic?: string;
		monospace?: string;
	};
	htmlFallbackFonts?: typeof defaultFallbackFonts;
	tableStyle: {
		color: string;
		width: string | number;
		borderWidth: number;
		paddingVertical: number;
		paddingHorizontal: number;
	};
}> = ({
	node,
	width,
	definitions,
	style,
	pStyle,
	hStyle,
	hSizeStep,
	aStyle,
	codeStyle,
	fontMap,
	htmlFallbackFonts,
	tableStyle,
}) => {
	const Component = pickComponent({
		node,
		width,
		definitions,
		style,
		pStyle,
		hStyle,
		hSizeStep,
		aStyle,
		codeStyle,
		fontMap,
		htmlFallbackFonts,
		tableStyle,
	});
	const { children } = node as any;

	return node.type === "table" ? (
		<Component {...node} />
	) : children ? (
		<Component {...node}>
			{children.map((child: NodeType, index: number) => (
				<Node
					key={index}
					node={child}
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
			))}
		</Component>
	) : (
		<Component {...node} />
	);
};
