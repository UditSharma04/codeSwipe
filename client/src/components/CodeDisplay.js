import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const CodeDisplay = ({ code, language }) => {
  return (
    <div className="mb-4 neubrutalism overflow-hidden">
      <div className="bg-gray-800 text-white text-xs sm:text-sm py-2 px-3 sm:px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <i className="bi bi-code-slash"></i>
          <span className="hidden sm:inline">{language || 'JavaScript'}</span>
          <span className="sm:hidden">{(language || 'JavaScript').slice(0, 3)}</span>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className="max-h-[150px] sm:max-h-[200px] overflow-auto">
        <SyntaxHighlighter 
          language={language?.toLowerCase() || 'javascript'}
          style={atomOneDark}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: '12px',
            padding: '1rem',
          }}
        >
          {code || '// No code snippet provided'}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeDisplay; 