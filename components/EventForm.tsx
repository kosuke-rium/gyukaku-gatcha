import { FormEvent, FC } from 'react'
import { supabase } from '../utils/supabase'
import useStore from '../store'
import { useMutateEvent } from '../hooks/useMutateEvent'
import { Spinner } from './Spinner'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

export const EventForm: FC = () => {
  const { editedEvent } = useStore()
  const update = useStore((state) => state.updateEditedEvent)
  const { createEventMutation, updateEventMutation } = useMutateEvent()
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedEvent.id === '')
    createEventMutation.mutate({
        name: editedEvent.name,
        date: editedEvent.date,
        user_id: supabase.auth.user()?.id,
      })
    else {
      updateEventMutation.mutate({
        id: editedEvent.id,
        name: editedEvent.name,
        date: editedEvent.date,
      })
    }
  }
  if (createEventMutation.isLoading || updateEventMutation.isLoading) { // 処理中はisLoadingがtrueになる
    return (
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Spinner />
      </Box>
    )
  }
  return (
    <div>
      <Container maxWidth="sm">
      <Box 
        component="form"
        onSubmit={submitHandler} 
        noValidate
        sx={{
          bgcolor: 'background.paper',
          pt: 0,
          pb: 2,
        }}
        style={{'textAlign': 'center'}}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Event name"
            name="name"
            value={editedEvent.name}
            onChange={(e) => update({ ...editedEvent, name: e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="date"
            type="date"
            id="date"
            value={editedEvent.date}
            onChange={(e) => update({ ...editedEvent, date: e.target.value })}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, width: '80%' }}
          >
             {editedEvent.id ? 'Update Event' : 'Create Event'}
          </Button>
      </Box>
      </Container>
    </div>
  )
}