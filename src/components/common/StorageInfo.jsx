import { formatBytes, getUsagePercentage, getStorageUsagePercentage, getTotalUsagePercentage } from "../../utils/storage"

const StorageInfo = ({ dbUsedBytes, storageUsedBytes }) => {
  // 각각의 사용률 계산
  const dbLimit = 500 * 1024 * 1024 // 500MB
  const storageLimit = 1024 * 1024 * 1024 // 1GB
  const totalLimit = dbLimit + storageLimit // 1.5GB

  const dbUsagePercent = parseFloat(getUsagePercentage(dbUsedBytes))
  const storageUsagePercent = parseFloat(getStorageUsagePercentage(storageUsedBytes))
  const totalUsagePercent = parseFloat(getTotalUsagePercentage(dbUsedBytes, storageUsedBytes))

  const totalUsed = dbUsedBytes + storageUsedBytes
  const remaining = totalLimit - totalUsed

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

      {/* 전체 진행바 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-notion-gray-600 mb-2">
          <span>전체 사용: {formatBytes(totalUsed)}</span>
          <span>전체 용량: {formatBytes(totalLimit)}</span>
        </div>
        <div className="w-full bg-notion-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={"h-full transition-all duration-300 " + getProgressColor(totalUsagePercent)}
            style={{ width: Math.min(totalUsagePercent, 100) + "%" }}
          />
        </div>
        <div className="text-center mt-2 text-sm font-medium text-notion-gray-700">
          {totalUsagePercent}% 사용
        </div>
      </div>

      {/* 상세 정보 - DB와 Storage 분리 */}
      <div className="space-y-3 mb-4">
        {/* Database 사용량 */}
        <div className="bg-notion-gray-50 p-3 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-notion-gray-700">📊 Database (메타데이터)</span>
            <span className="text-xs text-notion-gray-600">{dbUsagePercent}%</span>
          </div>
          <div className="flex justify-between text-xs text-notion-gray-600">
            <span>{formatBytes(dbUsedBytes)} / {formatBytes(dbLimit)}</span>
          </div>
          <div className="w-full bg-notion-gray-200 rounded-full h-2 overflow-hidden mt-2">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: Math.min(dbUsagePercent, 100) + "%" }}
            />
          </div>
        </div>

        {/* Storage 사용량 */}
        <div className="bg-notion-gray-50 p-3 rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-notion-gray-700">🎬 Storage (파일)</span>
            <span className="text-xs text-notion-gray-600">{storageUsagePercent}%</span>
          </div>
          <div className="flex justify-between text-xs text-notion-gray-600">
            <span>{formatBytes(storageUsedBytes)} / {formatBytes(storageLimit)}</span>
          </div>
          <div className="w-full bg-notion-gray-200 rounded-full h-2 overflow-hidden mt-2">
            <div
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: Math.min(storageUsagePercent, 100) + "%" }}
            />
          </div>
        </div>
      </div>

      {/* 남은 용량 요약 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
        <div className="bg-notion-gray-50 p-3 rounded">
          <div className="text-notion-gray-600 mb-1">전체 사용</div>
          <div className="font-semibold text-notion-text">{formatBytes(totalUsed)}</div>
        </div>
        <div className="bg-notion-gray-50 p-3 rounded">
          <div className="text-notion-gray-600 mb-1">남은 용량</div>
          <div className="font-semibold text-notion-text">{formatBytes(remaining)}</div>
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className="mt-4 text-xs text-notion-gray-500 bg-notion-gray-50 p-3 rounded">
        💡 <strong>Supabase 무료 플랜:</strong> Database 500MB + Storage 1GB = 총 1.5GB
        <div className="mt-1 text-notion-gray-500">
          이미지/동영상은 Storage에, 게시글 정보는 Database에 저장됩니다.
        </div>
        {totalUsagePercent > 80 && (
          <div className="mt-2 text-orange-600 font-medium">
            ⚠️ 저장 공간이 부족합니다. 오래된 게시글이나 대용량 파일을 삭제하세요.
          </div>
        )}
      </div>
    </div>
  )
}

export default StorageInfo
