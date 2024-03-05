import { NextPage } from 'next'
import { GetStaticProps, GetStaticPaths } from 'next'
import { supabase } from '../../utils/supabase'
import Layout from '../../components/Layout'
import { Event } from '../../types/types'
import { EventCard } from '../../components/EventCard'

// 全てのnoteのidを取得
const getAllRaceIds = async () => {
  const { data: ids } = await supabase.from('events').select('id')
  return ids!.map((id) => {
    return {
      params: {
        id: String(id.id), // この書き方は決まっている
      },
    }
  })
}

// 上記で取得したid分個別のページを生成してくれる
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getAllRaceIds()
  return {
    paths,
    fallback: 'blocking', // 新しい個別ページが出来た時の挙動(blockingだとssrの挙動になる)　ダイレクトにアクセスした場合に挙動の違いが出る
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  console.log('ISR invoked - detail page')
  // ctx.params?.idはGetStaticPathsで取得したidの一覧が渡ってくる
  const { data: eventDetails } = await supabase
    .from('events')
    .select('*, groups(*, courses(*), orders(*))')
    .eq('id', ctx.params?.id)
    .single()
  return {
    props: {
      eventDetails,
    },
    revalidate: false,
  }
}

type StaticProps = {
  eventDetails: Event
}

const NotePage: NextPage<StaticProps> = ({ eventDetails }) => {
  return (
    <Layout>
      <EventCard eventDetail={eventDetails}></EventCard>
    </Layout>
  )
}

export default NotePage
