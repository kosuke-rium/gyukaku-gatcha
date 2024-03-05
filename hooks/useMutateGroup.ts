import { useMutation } from 'react-query'
import { supabase } from '../utils/supabase'
import useStore from '../store'
import { Group, EditedGroup } from '../types/types'
import { revalidateSingle } from '../utils/revalidation'
import { useRouter } from 'next/router'

export const useMutateGroup = () => {
  const reset = useStore((state) => state.resetEditedGroup)
  const router = useRouter()
  const createGroupMutation = useMutation(
    async (event: Omit<Group, 'created_at' | 'id' | 'courses' | 'orders'>) => {
      const { data, error } = await supabase.from('groups').insert(event)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        revalidateSingle(res[0].event_id)
        reset()
        alert('Successfully completed !!')
        router.reload()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )
  const updateGroupMutation = useMutation(
    async (event: EditedGroup) => {
      const { data, error } = await supabase
        .from('groups')
        .update({ name: event.name, course_id: event.course_id })
        .eq('id', event.id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        revalidateSingle(res[0].event_id)
        reset()
        alert('Successfully completed !!')
        router.reload()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )
  const deleteGroupMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase.from('groups').delete().eq('id', id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        revalidateSingle(res[0].event_id)
        reset()
        alert('Successfully completed !!')
        router.reload()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )
  return { deleteGroupMutation, createGroupMutation, updateGroupMutation }
}