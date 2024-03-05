import { useMutation } from 'react-query'
import { supabase } from '../utils/supabase'
import useStore from '../store'
// import { revalidateList, revalidateSingle } from '../utils/revalidation'
import { Event, EditedEvent } from '../types/types'
import { useRouter } from 'next/router'

export const useMutateEvent = () => {
  const reset = useStore((state) => state.resetEditedEvent)
  const router = useRouter()
  const createEventMutation = useMutation(
    async (event: Omit<Event, 'created_at' | 'id' | 'groups'>) => {
      const { data, error } = await supabase.from('events').insert(event)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: () => {
        reset()
        alert('登録に成功しました！')
        router.reload()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )
  const updateEventMutation = useMutation(
    async (event: EditedEvent) => {
      const { data, error } = await supabase
        .from('events')
        .update({ name: event.name, date: event.date })
        .eq('id', event.id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        reset()
        alert('更新に成功しました！')
        router.reload()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )
  const deleteEventMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: () => {
        reset()
        alert('削除に成功しました！')
        router.reload()
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )
  return { deleteEventMutation, createEventMutation, updateEventMutation }
}