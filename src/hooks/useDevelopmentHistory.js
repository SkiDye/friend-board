import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

// 개발 히스토리 목록 조회 (content 제외 - 가벼운 로딩)
export const useDevelopmentHistory = () => {
  return useQuery({
    queryKey: ['developmentHistory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patch_notes')
        .select('id, version, title, created_at, updated_at')
        .order('id', { ascending: false })

      if (error) throw error

      return data.map(note => ({
        id: note.id,
        version: note.version,
        title: note.title,
        createdAt: note.created_at,
        updatedAt: note.updated_at
      }))
    },
    staleTime: 60000 // 1분간 캐시
  })
}

// 개별 히스토리 내용 조회 (펼칠 때만 로딩)
export const useHistoryContent = (id) => {
  return useQuery({
    queryKey: ['historyContent', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patch_notes')
        .select('content')
        .eq('id', id)
        .single()

      if (error) throw error
      return data.content
    },
    enabled: !!id, // id가 있을 때만 쿼리 실행
    staleTime: 300000 // 5분간 캐시
  })
}

// 개별 히스토리 전체 조회 (수정용)
export const useHistoryDetail = (id) => {
  return useQuery({
    queryKey: ['historyDetail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patch_notes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return {
        id: data.id,
        version: data.version,
        title: data.title,
        content: data.content,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    },
    enabled: !!id,
    staleTime: 60000
  })
}

// 개발 히스토리 작성
export const useCreateHistory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ version, title, content }) => {
      const { data, error } = await supabase
        .from('patch_notes')
        .insert([{
          version,
          title,
          content
        }])
        .select()

      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developmentHistory'] })
    }
  })
}

// 개발 히스토리 수정
export const useUpdateHistory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, version, title, content }) => {
      const { data, error } = await supabase
        .from('patch_notes')
        .update({
          version,
          title,
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()

      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developmentHistory'] })
    }
  })
}

// 개발 히스토리 삭제
export const useDeleteHistory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('patch_notes')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developmentHistory'] })
    }
  })
}
