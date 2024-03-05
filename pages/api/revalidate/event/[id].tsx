// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  revalidated: boolean
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log('Revalidationg event page...')
  const {
    query: { id },
  } = req //　末尾のクエリを取得するここではidを取り出してる
  let revalidated = false
  try {
    await res.unstable_revalidate(`/event/${id}`) // ISRで再生成したいページを引数で指定
    revalidated = true
  } catch (err) {
    console.log(err)
  }
  res.json({ 
    revalidated,
  })
}