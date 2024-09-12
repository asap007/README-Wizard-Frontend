import React, { useState, useRef } from 'react';
import { Github, Loader2, Clipboard, ArrowRight, AlertCircle, Twitter } from 'lucide-react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [repoUrl, setRepoUrl] = useState('');
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const outputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setReadme('');

    try {
      const response = await axios.post('https://readme-wizard-backend.onrender.com/api/generate-readme', { repoUrl });
      setReadme(response.data.readme);
    } catch (err) {
      if (err.response && err.response.status === 429) {
        // Rate limit exceeded
        setError(err.response.data.error);
      } else {
        setError(err.response?.data?.error || 'An error occurred while generating the README.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(readme);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-8 flex flex-col">
      <header className="w-full max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <a href="#"><img src="/images/logo.png" alt="Logo" className="lg:w-16 lg:h-16 w-14 h-14 mr-4 rounded-full" /></a>
          <h1 className="text-4xl font-bold text-white">README Wizard</h1>
        </motion.div>
        <motion.a
          href="https://x.com/AnshulSingh5180"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Twitter size={36} />
        </motion.a>
      </header>

      <main className="w-full max-w-7xl mx-auto flex-grow flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-white mb-4">Generate Your README</h2>
            <p className="text-gray-300 mb-6">Transform your GitHub repositories into captivating showcases with our AI-powered README generator.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  id="repoUrl"
                  name="repoUrl"
                  type="text"
                  className="w-full bg-gray-700 text-white border-2 border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:border-blue-500 transition duration-300 placeholder-gray-400"
                  placeholder="Enter GitHub Repository URL"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  disabled={loading}
                />
              </div>
              <motion.button
                type="submit"
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center ${
                  loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    Generate README
                    <ArrowRight className="ml-2" size={20} />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        <div className="w-full md:w-2/3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg h-full"
          >
            {!readme && !error && !loading && (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p className="text-xl">Enter a GitHub repository URL to generate the README.</p>
              </div>
            )}

            {loading && (
              <div className="flex items-center justify-center h-full text-blue-400">
                <Loader2 className="animate-spin mr-3" size={32} />
                <p className="text-xl">Generating README, please wait...</p>
              </div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 p-4 bg-red-900 text-red-200 rounded-lg flex items-center"
                >
                  <AlertCircle className="mr-2" size={24} />
                  <span className="text-lg">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {readme && (
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">Generated README</h2>
                  <motion.button
                    onClick={handleCopy}
                    className="text-blue-400 hover:text-blue-300 transition duration-200 flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Clipboard size={20} />
                    <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy'}</span>
                  </motion.button>
                </div>
                <div 
                  ref={outputRef}
                  className="bg-gray-900 rounded-lg p-6 overflow-y-auto flex-grow custom-scrollbar max-h-svh"
                >
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                    className="text-gray-300"
                  >
                    {readme}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default App;