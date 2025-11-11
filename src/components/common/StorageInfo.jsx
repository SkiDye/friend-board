import { formatBytes, getUsagePercentage } from "../../utils/storage"

const StorageInfo = ({ usedBytes }) => {
  const usagePercent = parseFloat(getUsagePercentage(usedBytes))
  const supabaseLimit = 500 * 1024 * 1024 // 500MB (Supabase Free DB)
  const remaining = supabaseLimit - usedBytes

  // 진행바 색상 결정
  const getProgressColor = (percent) => {
    if (percent < 50) return "bg-green-500"
    if (percent < 75) return "bg-yellow-500"
    if (percent < 90) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 text-notion-text">저장 공간 사용 현황</h3>
      
      {/* 진행바 */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-notion-gray-600 mb-2">
          <span>사용 중: {formatBytes(usedBytes)}</span>
          <span>전체: {formatBytes(supabaseLimit)}</span>
        </div>
        <div className="w-full bg-notion-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={"h-full transition-all duration-300 " + getProgressColor(usagePercent)}
            style={{ width: Math.min(usagePercent, 100) + "%" }}
          />
        </div>
        <div className="text-center mt-2 text-sm font-medium text-notion-gray-700">
          {usagePercent}% 사용
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        <div className="bg-notion-gray-50 p-3 rounded">
          <div className="text-notion-gray-600 mb-1">사용 중</div>
          <div className="font-semibold text-notion-text">{formatBytes(usedBytes)}</div>
        </div>
        <div className="bg-notion-gray-50 p-3 rounded">
          <div className="text-notion-gray-600 mb-1">남은 용량</div>
          <div className="font-semibold text-notion-text">{formatBytes(remaining)}</div>
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="mt-4 text-xs text-notion-gray-500 bg-notion-gray-50 p-3 rounded">
        💡 <strong>Supabase 무료 플랜 (Database):</strong> 최대 500MB까지 사용 가능합니다.
        <div className="mt-1 text-notion-gray-500">
          이미지와 동영상이 Database에 저장되므로 대용량 파일 업로드 시 주의하세요.
        </div>
        {usagePercent > 80 && (
          <div className="mt-2 text-orange-600 font-medium">
            ⚠️ 저장 공간이 부족합니다. 오래된 게시글이나 대용량 파일을 삭제하세요.
          </div>
        )}
      </div>
    </div>
  )
}

export default StorageInfo
