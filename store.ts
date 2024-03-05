import create from "zustand";
import { EditedProfile, EditedEvent, EditedGroup, EditedOrder } from './types/types'

// 型を定義
type State = {
  editedProfile: EditedProfile
  updateEditedProfile: (payload: EditedProfile) => void
  resetEditedProfile: () => void

  editedEvent: EditedEvent
  updateEditedEvent: (payload: EditedEvent) => void
  resetEditedEvent: () => void

  editedGroup: EditedGroup
  updateEditedGroup: (payload: EditedGroup) => void
  resetEditedGroup: () => void

  editedOrder: EditedOrder
  updateEditedOrder: (payload: EditedOrder) => void
  resetEditedOrder: () => void
}

const useStore = create<State>((set, _) => ({
  editedGroup: { id: '', name: '', course_id: '' },
  updateEditedGroup: (payload) =>
    set({
      editedGroup: {
        id: payload.id,
        name: payload.name,
        course_id: payload.course_id,
      },
    }),
  resetEditedGroup: () =>
    set({ editedGroup: { id: '', name: '', course_id: '' } }),

  // editedEventとeditedCommentの定義 + 初期値の設定
  editedEvent: { id: '', name: '', date: '' },
  updateEditedEvent: (payload) =>
    set({
      editedEvent: {
        id: payload.id,
        name: payload.name,
        date: payload.date,
      },
    }),
  resetEditedEvent: () =>
    set({ editedEvent: { id: '', name: '', date: '' } }),

  editedOrder: { id: '', name: ''},
  updateEditedOrder: (payload) =>
    set({
      editedOrder: {
        id: payload.id,
        name: payload.name,
      },
    }),
  resetEditedOrder: () =>
    set({ editedOrder: { id: '', name: ''} }),

  
  editedProfile: { id: '',username: '' ,avatar_url: '' },
  updateEditedProfile: (payload) =>
    set({
      editedProfile: {
        id: payload.id,
        username: payload.username,
        avatar_url: payload.avatar_url,
      },
    }),
  resetEditedProfile: () =>
    set({ editedProfile: { id: '',username: '' ,avatar_url: '' },
  }),
}))
export default useStore