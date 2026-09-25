import { memo } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

interface CodeBlockProps {
  code: string;
  language?: string;
  theme: 'light' | 'dark';
}

export const CodeBlock = memo(function CodeBlock({ code, language = 'tsx', theme }: CodeBlockProps) {
  return (
    <Highlight code={code.trimEnd()} language={language} theme={theme === 'dark' ? themes.vsDark : themes.github}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={`code ${className}`} style={style} tabIndex={0} aria-label="Code snippet">
          <code>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="ln" aria-hidden="true">
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
});
