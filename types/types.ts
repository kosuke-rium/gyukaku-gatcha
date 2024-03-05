export type Event = {
  id: string
  name: string
  user_id: string | undefined
  date: string
  created_at: string
  groups: Group[]
}

export type Group = {
  id: string
  name: string
  event_id: string,
  user_id: string | undefined
  course_id: string | undefined
  created_at: string
  courses: Course
  orders: Order[]
}

export type Course = {
  id: string
  name: string
  group_id: string,
  created_at: string
}

export type Order = {
  id: string
  name: string
  group_id: string,
  event_id: string,
  created_at: string
}


export type Profile = {
  id: string
  user_id: string | undefined
  username: string
  avatar_url: string
  created_at: string
}

export type EditedProfile = Omit<Profile, 'user_id' | 'created_at'>
export type EditedEvent = Omit<Event, 'created_at' | 'user_id' | 'groups'>
export type EditedGroup = Omit<Group, 'created_at' | 'user_id' | 'event_id' | 'courses' | 'orders'>
export type EditedOrder = Omit<Order, 'created_at' | 'group_id' | 'event_id'>