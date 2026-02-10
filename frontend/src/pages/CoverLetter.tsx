import { useState } from 'react'
import { Mail, Sparkles, FileText, Briefcase, Copy, Check, Loader2 } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import ReactMarkdown from 'react-markdown'
import { generateCoverLetter } from '../api/coverLetter'

export default function CoverLetter() {
  const { themeConfig } = useTheme()

  const [formData, setFormData] = useState({
    resumeText: '',
    jobDescription: '',
    companyName: '',
    jobRole: '',
    tone: 'Professional'
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!formData.resumeText || !formData.jobDescription || !formData.companyName || !formData.jobRole) {
      setError('Please fill in all required fields')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const response = await generateCoverLetter(formData)
      setGeneratedContent(response.content)
    } catch (err) {
      setError('Failed to generate cover letter. Please try again.')
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg transition-transform hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})`
            }}
          >
            <Mail className="text-white" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Cover Letter Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create a tailored, professional cover letter in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="text-yellow-500" />
              Job Details
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="e.g. Google"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. Senior Developer"
                    value={formData.jobRole}
                    onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                <textarea
                  className="w-full h-32 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  placeholder="Paste the job requirements here..."
                  value={formData.jobDescription}
                  onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                  <span>Your Resume Content</span>
                  <span className="text-xs text-blue-600 cursor-pointer hover:underline">How to copy?</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                  <textarea
                    className="w-full h-48 pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                    placeholder="Paste your full resume text here so the AI can match your skills..."
                    value={formData.resumeText}
                    onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                >
                  <option>Professional</option>
                  <option>Enthusiastic</option>
                  <option>Confident</option>
                  <option>Formal</option>
                </select>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3 rounded-xl font-semibold text-white shadow-lg transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})`
                }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate Cover Letter
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Display */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col h-full min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Cover Letter</h2>
              {generatedContent && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  {isCopied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                  {isCopied ? 'Copied!' : 'Copy Text'}
                </button>
              )}
            </div>

            <div className="flex-1 bg-gray-50 rounded-xl p-6 border border-gray-100 overflow-y-auto">
              {generatedContent ? (
                <article className="prose prose-slate max-w-none">
                  <ReactMarkdown>{generatedContent}</ReactMarkdown>
                </article>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <Mail size={48} className="opacity-20" />
                  <p className="text-center max-w-xs">
                    Fill out the form and click generate to see your personalized cover letter here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

