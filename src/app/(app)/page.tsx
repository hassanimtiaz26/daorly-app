import ThemedHeader from '@components/ui/elements/ThemedHeader';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '@core/hooks/useAppTheme';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useFetch } from '@core/hooks/useFetch';
import { ApiRoutes } from '@core/constants/ApiRoutes';
import { Text } from 'react-native-paper';
import WebView from 'react-native-webview';

const css = `
  html {
  font-size: 100%;
  box-sizing: border-box;
}
*,
*::before,
*::after {
  box-sizing: inherit;
}
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";
  font-size: 1rem;
  line-height: 1.6;
  color: #15153B;
  font-feature-settings: "kern";
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0 auto; /* Centers the content */
  padding: 0 1.25rem;
}
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  font-weight: 700;
  line-height: 1.2;
  color: #15153B;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
h1 {
  font-size: 1.75rem;
}
h2 {
  font-size: 1.5rem;
}
h3 {
  font-size: 1.25rem;
}
h4 {
  font-size: 1.2rem;
}
h5 {
  font-size: 1.1rem;
}
h6 {
  font-size: 1rem;
}
p {
  margin-top: 0;
  margin-bottom: 1rem;
}
a {
  color: #0FB3A7;
  text-decoration: underline;
  transition: color 0.2s ease, text-decoration 0.2s ease;
}
a:hover,
a:focus {
  color: #15153B;
  text-decoration: none;
}
blockquote {
  margin: 1.5rem 0;
  padding: 0.5rem 1.5rem;
  font-style: italic;
  color: #555;
  border-left: 4px solid #e0e0e0;
}
blockquote p {
  margin-bottom: 0;
}
ul,
ol {
  margin-top: 0;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}
li {
  margin-bottom: 0.5rem;
}
code {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier,
    monospace;
  font-size: 0.9em;
  background-color: #f4f4f4;
  padding: 0.2em 0.4em;
  border-radius: 4px;
}
pre {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier,
    monospace;
  font-size: 0.9em;
  background-color: #f4f4f4;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto; /* Allow horizontal scrolling for long code lines */
  margin-bottom: 1rem;
}
pre code {
  background-color: transparent;
  padding: 0;
}
hr {
  border: 0;
  border-top: 1px solid #e0e0e0;
  margin: 2rem 0;
}
`;

const createStyles = (colors: MD3Colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContentContainer: {
    gap: 12,
  },
  innerContentContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.surface,
  },

  title: {
    color: colors.onPrimary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});

type PageScreenParams = {
  name: string;
}

const PageScreen = () => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { canGoBack, back, replace } = useRouter();
  const { get, loading } = useFetch();
  const { name } = useLocalSearchParams<PageScreenParams>();

  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const renderContent = (innerHtml: string) => {
    return `
        <html lang="en">
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              ${css}
            </style>
          </head>
          <body>
            ${innerHtml}
          </body>
        </html>
      `;
  }

  useEffect(() => {
    console.log('name', name);
    if (name) {
      get(ApiRoutes.page.name(name))
        .subscribe({
          next: (response) => {
            console.log(JSON.stringify(response, null, 2));
            if (response && 'data' in response) {
              const page = response.data.page;

              setTitle(page.title);
              setContent(renderContent(page.content));
            }
          }
        })
    }
  }, [name]);

  return (
    <View
      style={styles.container}>
      <ThemedHeader>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24, }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              if (canGoBack()) {
                back();
              }
            }}>
            <Feather
              name={'arrow-left-circle'} size={24} color={colors.onPrimary} />
          </TouchableOpacity>

          {title && <Text variant={'titleMedium'} style={styles.title}>{title}</Text>}
        </View>
      </ThemedHeader>

      <WebView
        originWhitelist={['*']}
        source={{ html: content }}
        style={styles.innerContentContainer}
      />
    </View>
  )
};

export default PageScreen;
