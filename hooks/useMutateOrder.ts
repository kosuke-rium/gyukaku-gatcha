import { useMutation } from 'react-query'
import { supabase } from '../utils/supabase'
import useStore from '../store'
import { Order, EditedOrder } from '../types/types'
import { useRouter } from 'next/router'
import { revalidateSingle } from '../utils/revalidation'

export const useMutateOrder = () => {
  const reset = useStore((state) => state.resetEditedOrder)
  const router = useRouter()
  const createOrderMutation = useMutation(
    async (event: Omit<Order, 'created_at' | 'id'>) => {
      const { data, error } = await supabase.from('orders').insert(event)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        revalidateSingle(res[0].event_id)
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
  const updateOrderMutation = useMutation(
    async (event: EditedOrder) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ name: event.name })
        .eq('id', event.id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        reset()
        alert('更新に成功しました！')
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )
  const deleteOrderMutation = useMutation(
    async (id: string) => {
      const { data, error } = await supabase.from('orders').delete().eq('id', id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        revalidateSingle(res[0].event_id)
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
  return { deleteOrderMutation, createOrderMutation, updateOrderMutation }
}