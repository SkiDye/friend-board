import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { deleteMultipleFiles } from '../utils/storage-upload'

// 게시글 목록 조회 (갤러리용 - 썸네일만)
export const usePosts = () => {
  const query = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, content, created_at, images, comments')
        .order('created_at', { ascending: false })

      if (error) throw error

      // 갤러리용으로 최적화: 첫 번째 이미지만, 댓글 개수만
      return data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content || '',
        date: new Date(post.created_at).toISOString().split('T')[0],
        // 첫 번째 이미지만 포함 (갤러리 표시용)
        thumbnail: post.images && post.images.length > 0 ? post.images[0] : null,
        imageCount: post.images ? post.images.length : 0,
        commentCount: post.comments ? post.comments.length : 0
      }))
    },
    // 30초마다 자동으로 새 데이터 확인 (선택사항)
    refetchInterval: 30000
  })

  return query
}

// 게시글 상세 조회 (클릭 시 전체 데이터 로드)
export const usePost = (postId) => {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single()

      if (error) throw error

      return {
        id: data.id,
        title: data.title,
        content: data.content || '',
        date: new Date(data.created_at).toISOString().split('T')[0],
        images: data.images || [],
        comments: data.comments || []
      }
    },
    enabled: !!postId // postId가 있을 때만 실행
  })
}

// 게시글 생성
export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postData) => {
      const { data, error } = await supabase
        .from('posts')
        .insert([{
          title: postData.title,
          content: postData.content,
          images: postData.images || []
        }])
        .select()

      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })
}

// 게시글 수정
export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postData) => {
      // 기존 게시글 데이터 조회 (삭제할 이미지 확인용)
      const { data: originalPost, error: fetchError } = await supabase
        .from('posts')
        .select('images')
        .eq('id', postData.id)
        .single()

      if (fetchError) throw fetchError

      // 삭제된 이미지 찾기 (기존에 있었지만 새 데이터에 없는 것)
      if (originalPost.images && originalPost.images.length > 0) {
        const newImagePaths = new Set(
          (postData.images || [])
            .filter(img => img.path)
            .map(img => img.path)
        )

        const deletedImages = originalPost.images
          .filter(img => img.path && !newImagePaths.has(img.path))
          .map(img => img.path)

        // Storage에서 삭제된 이미지 제거
        if (deletedImages.length > 0) {
          try {
            await deleteMultipleFiles(deletedImages)
          } catch (storageError) {
            console.error('Storage 파일 삭제 실패:', storageError)
            // Storage 삭제 실패해도 업데이트는 진행
          }
        }
      }

      // 게시글 업데이트
      const { data, error } = await supabase
        .from('posts')
        .update({
          title: postData.title,
          content: postData.content,
          images: postData.images || []
        })
        .eq('id', postData.id)
        .select()

      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })
}

// 게시글 삭제
export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postId) => {
      // 게시글 데이터 먼저 조회 (이미지 경로 확인)
      const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('images')
        .eq('id', postId)
        .single()

      if (fetchError) throw fetchError

      // Storage에서 이미지 파일 삭제
      if (post.images && post.images.length > 0) {
        const filePaths = post.images
          .filter(img => img.path) // path가 있는 것만 (URL 기반 이미지)
          .map(img => img.path)

        if (filePaths.length > 0) {
          try {
            await deleteMultipleFiles(filePaths)
          } catch (storageError) {
            console.error('Storage 파일 삭제 실패:', storageError)
            // Storage 삭제 실패해도 DB는 삭제 진행
          }
        }
      }

      // 데이터베이스에서 게시글 삭제
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })
}

// 댓글 추가
export const useAddComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, commentText }) => {
      // 현재 게시글 가져오기
      const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('comments')
        .eq('id', postId)
        .single()

      if (fetchError) throw fetchError

      // 새 댓글 추가
      const newComment = {
        id: Date.now() + Math.random(),
        text: commentText,
        created_at: new Date().toISOString()
      }

      const updatedComments = [...(post.comments || []), newComment]

      // 업데이트
      const { error: updateError } = await supabase
        .from('posts')
        .update({ comments: updatedComments })
        .eq('id', postId)

      if (updateError) throw updateError

      return newComment
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })
}

// 댓글 삭제
export const useDeleteComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, commentId }) => {
      // 현재 게시글 가져오기
      const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('comments')
        .eq('id', postId)
        .single()

      if (fetchError) throw fetchError

      // 댓글 삭제
      const updatedComments = (post.comments || []).filter(c => c.id !== commentId)

      // 업데이트
      const { error: updateError } = await supabase
        .from('posts')
        .update({ comments: updatedComments })
        .eq('id', postId)

      if (updateError) throw updateError
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })
}

// 저장공간 계산용 - 전체 데이터 조회
export const usePostsForStorage = () => {
  return useQuery({
    queryKey: ['posts-storage'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')

      if (error) throw error

      return data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content || '',
        images: post.images || [],
        comments: post.comments || []
      }))
    },
    staleTime: 60000, // 1분간 캐시
    refetchInterval: false // 자동 새로고침 비활성화
  })
}
