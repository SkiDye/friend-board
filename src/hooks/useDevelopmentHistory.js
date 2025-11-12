import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

// 개발 히스토리 목록 조회
export const useDevelopmentHistory = () => {
  return useQuery({
    queryKey: ['developmentHistory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patch_notes')
        .select('*')
        .order('id', { ascending: false })

      if (error) throw error

      return data.map(note => ({
        id: note.id,
        version: note.version,
        title: note.title,
        content: note.content,
        createdAt: note.created_at,
        updatedAt: note.updated_at
      }))
    },
    staleTime: 60000 // 1분간 캐시
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
