import { useState } from 'react'
import { Upload, Sparkles, FileText, Laugh, AlertCircle, Loader2, Download } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { roastResume } from '../api/roaster'

export default function ResumeRoaster() {
  const { themeConfig } = useTheme()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [roast, setRoast] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type.includes('text')) {
        setFile(selectedFile)
        setError(null)
        setRoast(null)
      } else {
        setError('Please upload a PDF or text file')
        setFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setError(null)
    setRoast(null)

    try {
      const response = await roastResume(file)
      setRoast(response.roast)
    } catch (err) {
      setError('Failed to roast your resume. Please try again.')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = () => {
    if (!roast) return

    const blob = new Blob([roast], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume-roast.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-xl transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})`,
              boxShadow: `0 10px 30px -5px rgba(${parseInt(themeConfig.colors.primary.slice(1, 3), 16)}, ${parseInt(themeConfig.colors.primary.slice(3, 5), 16)}, ${parseInt(themeConfig.colors.primary.slice(5, 7), 16)}, 0.4)`
            }}
          >
            <Laugh className="text-white" size={36} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Resume Roaster
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your resume and get brutally honest (but helpful) AI feedback with a side of humor.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Upload Your Resume
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="resume-upload"
                    className={`
                      flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer
                      transition-all duration-300
                      ${file
                        ? 'border-green-500 bg-green-50'
                        : `border-gray-300 hover:border-${themeConfig.colors.primary} hover:bg-gray-50`
                      }
                      ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    style={!file ? {
                      borderColor: themeConfig.colors.primary + '40'
                    } : {}}
                  >
                    {file ? (
                      <div className="text-center p-6">
                        <FileText
                          className="mx-auto mb-3 text-green-600"
                          size={48}
                        />
                        <p className="text-lg font-semibold text-gray-900 mb-1">
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    ) : (
                      <div className="text-center p-6">
                        <Upload
                          className="mx-auto mb-4 text-gray-400"
                          size={48}
                        />
                        <p className="text-lg font-semibold text-gray-700 mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-500">
                          PDF, DOC, DOCX, or TXT (MAX. 5MB)
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`
                  w-full py-4 px-6 rounded-xl font-bold text-lg text-white
                  transition-all duration-300 flex items-center justify-center gap-3
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${uploading ? 'cursor-wait' : 'hover:scale-105 hover:shadow-2xl'}
                `}
                style={{
                  background: !file || uploading
                    ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                    : `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})`,
                  boxShadow: !file || uploading
                    ? 'none'
                    : `0 8px 24px -4px rgba(${parseInt(themeConfig.colors.primary.slice(1, 3), 16)}, ${parseInt(themeConfig.colors.primary.slice(3, 5), 16)}, ${parseInt(themeConfig.colors.primary.slice(5, 7), 16)}, 0.4)`
                }}
              >
                {uploading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    <span>Roasting your resume...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={24} />
                    <span>Start the Roast 🔥</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Roast Result */}
        {roast && (
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-xl p-8 md:p-12 border-2 border-orange-200">
            <div className="max-w-3xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Laugh className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Your Resume Got Roasted! 🔥</h2>
                    <p className="text-sm text-gray-600">Here's what the AI thinks...</p>
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  className="p-3 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-md"
                  title="Download roast"
                >
                  <Download className="text-gray-700" size={20} />
                </button>
              </div>

              {/* Roast Content */}
              <div
                className="bg-white rounded-xl p-6 md:p-8 shadow-lg border border-orange-200"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-800 leading-relaxed font-medium">
                    {roast}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={() => {
                    setFile(null)
                    setRoast(null)
                    setError(null)
                  }}
                  className="flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${themeConfig.colors.primary}, ${themeConfig.colors.secondary})`
                  }}
                >
                  Upload Another Resume
                </button>
                <button
                  onClick={() => window.location.href = '/builder'}
                  className="flex-1 py-3 px-6 rounded-xl font-semibold bg-gray-800 text-white transition-all duration-300 hover:bg-gray-900 hover:scale-105"
                >
                  Fix It in Resume Builder
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
              <Laugh className="text-blue-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Funny Feedback</h3>
            <p className="text-sm text-gray-600">
              Get brutally honest feedback wrapped in humor to make learning fun.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
              <Sparkles className="text-green-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">AI-Powered</h3>
            <p className="text-sm text-gray-600">
              Advanced AI analyzes your resume and provides actionable improvements.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
              <FileText className="text-purple-600" size={24} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Real Insights</h3>
            <p className="text-sm text-gray-600">
              Beyond the jokes, get genuine feedback on formatting, content, and ATS optimization.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

