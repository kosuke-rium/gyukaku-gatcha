import { useMutation } from 'react-query'
import { supabase } from '../utils/supabase'
import useStore from '../store'
import { Profile, EditedProfile } from '../types/types'

export const useMutateProfile = () => {
  const reset = useStore((state) => state.resetEditedProfile)
  const createProfileMutation = useMutation(
    async (profile: Omit<Profile, 'id' | 'created_at' >) => {
      const { data, error } = await supabase.from('profiles').insert(profile)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: () => {
        reset()
        alert('Successfully completed !!')
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )
  const updateProfileMutation = useMutation(
    async (profile: EditedProfile) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ username: profile.username, avatar_url: profile.avatar_url })
        .eq('id', profile.id)
      if (error) throw new Error(error.message)
      return data
    },
    {
      onSuccess: (res) => {
        reset()
        alert('Successfully completed !!')
      },
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
    }
  )
  return { createProfileMutation, updateProfileMutation }
}