import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
// @ts-ignore
import { atomDark } from "react-syntax-highlighter/styles/prism";
import { Markdown } from "@ozymandiasthegreat/react-native-markdown";
import { text } from "@ozymandiasthegreat/react-native-markdown/src/example";

export default function App() {
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<ScrollView>
				<Markdown
					source={{ markdown: text }}
					codeStyle={{ theme: atomDark }}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}
