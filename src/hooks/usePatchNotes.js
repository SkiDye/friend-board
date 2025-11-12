import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

// 패치노트 목록 조회
export const usePatchNotes = () => {
  return useQuery({
    queryKey: ['patchNotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patch_notes')
        .select('*')
        .order('created_at', { ascending: false })

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

// 패치노트 작성
export const useCreatePatchNote = () => {
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
      queryClient.invalidateQueries({ queryKey: ['patchNotes'] })
    }
  })
}

// 패치노트 수정
export const useUpdatePatchNote = () => {
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
      queryClient.invalidateQueries({ queryKey: ['patchNotes'] })
    }
  })
}

// 패치노트 삭제
export const useDeletePatchNote = () => {
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
      queryClient.invalidateQueries({ queryKey: ['patchNotes'] })
    }
  })
}
