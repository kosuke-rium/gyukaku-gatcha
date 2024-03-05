import { useState } from "react";
import { supabase } from "../utils/supabase";
import { useMutation } from "react-query";

// ログイン処理に必要な処理まとめ？

export const useMutateAuth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const reset = () => {
    setEmail('')
    setPassword('')
  }

  // ログインのボタンが押された時の処理
  const loginMutation = useMutation(
    async () => {
      const { error } = await supabase.auth.signIn({ 
        email, 
        password,
      }
      ) // supabase.auth.signInはログイン用のメソッド
      if (error) throw new Error(error.message) // エラーの時はErrorを生成する
    },
    {
      onError: (err: any) => { // useMutationは成功と失敗時の後処理を追加出来る 成功 onSuccess,失敗　onError
        alert(err.message)
        reset()
      },
    }
  )
  const registerMutation = useMutation(
    async () => {
      const { error } = await supabase.auth.signUp({ 
        email, password 
      }) // supabase.auth.signUpは新規登録用のメソッド
      if (error) throw new Error(error.message)
    },
    {
      onError: (err: any) => {
        alert(err.message)
        reset()
      },
      onSuccess: () => {
        alert("登録が完了しました！")
      }
    }
  )
  return {
    email,
    setEmail,
    password,
    setPassword,
    loginMutation,
    registerMutation,
  }
}