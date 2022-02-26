import { SafeAreaView, ScrollView } from "react-native";
// @ts-ignore
import { atomDark } from "react-syntax-highlighter/styles/prism";
import { Markdown } from "react-native-markdown";
import { text } from "react-native-markdown/src/example";

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
