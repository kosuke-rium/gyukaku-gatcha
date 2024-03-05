import { NextPage } from 'next'
import { GetStaticProps } from 'next'
import { supabase } from '../utils/supabase'
import { EventItem } from '../components/EventItem'
import { Event } from '../types/types'
import Layout from '../components/Layout'

export const getStaticProps: GetStaticProps = async () => {
  console.log('ISR invoked - notes page')
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: false })
  if (error) {
    throw new Error(`${error.message}: ${error.details}`)
  }
  return {
    props: { events },
    revalidate: false,
  }
}

type StaticProps = {
  events: Event[]
}

const Home: NextPage<StaticProps> = ({ events }) => {
  return (
    <Layout>
      <EventItem
        events={events}
      />
    </Layout>
  )
}

export default Home
