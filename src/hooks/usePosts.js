import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

// 게시글 목록 조회
export const usePosts = () => {
  const query = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // DB 데이터를 앱 형식으로 변환
      return data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content || '',
        date: new Date(post.created_at).toISOString().split('T')[0],
        images: post.images || [],
        comments: post.comments || []
      }))
    },
    // 30초마다 자동으로 새 데이터 확인 (선택사항)
    refetchInterval: 30000
  })

  return query
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
