import { useState } from 'react'
import { useDevelopmentHistory, useCreateHistory, useUpdateHistory, useDeleteHistory } from '../hooks/useDevelopmentHistory'
import ReactMarkdown from 'react-markdown'

const DevelopmentHistory = () => {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false)
  const [editNote, setEditNote] = useState(null)

  const { data: historyNotes = [], isLoading } = useDevelopmentHistory()
  const createNote = useCreateHistory()
  const updateNote = useUpdateHistory()
  const deleteNote = useDeleteHistory()

  const handleSubmit = async (noteData) => {
    try {
      if (noteData.id) {
        await updateNote.mutateAsync(noteData)
      } else {
        await createNote.mutateAsync(noteData)
      }
      setIsWriteModalOpen(false)
      setEditNote(null)
    } catch (error) {
      console.error('개발 히스토리 저장 실패:', error)
      alert('저장에 실패했습니다.')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('이 개발 히스토리를 삭제하시겠습니까?')) {
      try {
        await deleteNote.mutateAsync(id)
      } catch (error) {
        console.error('삭제 실패:', error)
        alert('삭제에 실패했습니다.')
      }
    }
  }

  const handleEdit = (note) => {
    setEditNote(note)
    setIsWriteModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        <p className="text-center text-notion-gray-500">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-notion-text mb-2">개발 히스토리</h1>
          <p className="text-notion-gray-500 text-sm">Friend Board의 개발 변천사입니다</p>
        </div>
        <button
          onClick={() => {
            setEditNote(null)
            setIsWriteModalOpen(true)
          }}
          className="btn-primary w-full sm:w-auto"
        >
          + 새 히스토리
        </button>
      </div>

      {/* 타임라인 (가로로 길게) */}
      <div className="relative">
        {/* 타임라인 선 */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-notion-gray-200" />

        {/* 개발 히스토리 리스트 */}
        <div className="space-y-8">
          {historyNotes.length === 0 ? (
            <div className="text-center py-12 text-notion-gray-500">
              <p>아직 개발 히스토리가 없습니다.</p>
              <p className="text-sm mt-2">첫 히스토리를 작성해보세요!</p>
            </div>
          ) : (
            historyNotes.map((note, index) => (
              <div key={note.id} className="relative pl-20">
                {/* 타임라인 점 */}
                <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-blue-500 border-4 border-white shadow" />

                {/* 버전 뱃지 */}
                <div className="absolute left-0 top-1">
                  <span className="inline-block px-3 py-1 bg-blue-500 text-white text-sm font-bold rounded-full">
                    {note.version}
                  </span>
                </div>

                {/* 개발 히스토리 카드 */}
                <div className="card group hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-xl font-bold text-notion-text mb-1">
                        {note.title}
                      </h2>
                      <p className="text-xs text-notion-gray-500">
                        {new Date(note.createdAt).toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {note.updatedAt !== note.createdAt && ' (수정됨)'}
                      </p>
                    </div>

                    {/* 수정/삭제 버튼 */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(note)}
                        className="p-2 text-notion-gray-600 hover:text-notion-text hover:bg-notion-gray-100 rounded transition-colors"
                        title="수정"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="삭제"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* 마크다운 콘텐츠 */}
                  <div className="prose max-w-none text-notion-text">
                    <ReactMarkdown>{note.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 작성/수정 모달 */}
      {isWriteModalOpen && (
        <HistoryModal
          note={editNote}
          onClose={() => {
            setIsWriteModalOpen(false)
            setEditNote(null)
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}

// 개발 히스토리 작성/수정 모달
const HistoryModal = ({ note, onClose, onSubmit }) => {
  const [version, setVersion] = useState(note?.version || '')
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!version.trim() || !title.trim() || !content.trim()) {
      alert('모든 필드를 입력해주세요')
      return
    }

    onSubmit({
      ...(note && { id: note.id }),
      version: version.trim(),
      title: title.trim(),
      content: content.trim()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-notion-gray-200">
          <h2 className="text-2xl font-bold text-notion-text">
            {note ? '개발 히스토리 수정' : '새 개발 히스토리'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-notion-gray-100 rounded transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* 버전 */}
          <div>
            <label className="block text-sm font-medium text-notion-gray-700 mb-2">
              버전 *
            </label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="예: v1.0.0"
              className="input"
              required
            />
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-notion-gray-700 mb-2">
              제목 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: Initial Release"
              className="input"
              required
            />
          </div>

          {/* 내용 (마크다운) */}
          <div>
            <label className="block text-sm font-medium text-notion-gray-700 mb-2">
              내용 (마크다운 지원) *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="## 주요 기능&#10;- 기능 1&#10;- 기능 2&#10;&#10;## 개선 사항&#10;- 개선 1"
              rows={15}
              className="input resize-none font-mono text-sm"
              required
            />
          </div>

          {/* 도움말 */}
          <div className="text-xs text-notion-gray-500 bg-notion-gray-50 p-3 rounded">
            💡 <strong>마크다운 팁:</strong> ## 제목, **굵게**, *기울임*, - 목록, [링크](url)
          </div>
        </form>

        {/* 푸터 */}
        <div className="flex gap-3 p-6 border-t border-notion-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1 sm:flex-none"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="btn-primary flex-1 sm:flex-none"
          >
            {note ? '수정하기' : '작성하기'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DevelopmentHistory
