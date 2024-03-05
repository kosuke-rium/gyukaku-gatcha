import { FormEvent, FC } from 'react'
import { supabase } from '../utils/supabase'
import useStore from '../store'
import { useMutateGroup } from '../hooks/useMutateGroup'
import { Spinner } from './Spinner'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export const GroupForm: FC<{event_id: string}> = ({event_id}) => {
  const { editedGroup } = useStore()
  const update = useStore((state) => state.updateEditedGroup)
  const { createGroupMutation, updateGroupMutation } = useMutateGroup()
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedGroup.id === '')
    createGroupMutation.mutate({
        name: editedGroup.name,
        course_id: editedGroup.course_id,
        event_id: event_id,
        user_id: supabase.auth.user()?.id,
      })
    else {
      updateGroupMutation.mutate({
        id: editedGroup.id ,
        name: editedGroup.name,
        course_id: editedGroup.course_id,
      })
    }
  }
  if (createGroupMutation.isLoading || updateGroupMutation.isLoading) { // 処理中はisLoadingがtrueになる
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
            label="Group name"
            name="name"
            value={editedGroup.name}
            onChange={(e) => update({ ...editedGroup, name: e.target.value })}
          />
          <FormControl variant="standard" sx={{ m: 1, minWidth: 240 }}>
            <InputLabel id="demo-simple-select-standard-label">Course</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={editedGroup.course_id}
              onChange={(e) => update({ ...editedGroup, course_id: e.target.value })}
              label="Course"
            >
              <MenuItem value={'0a4eeacd-60c5-4b4a-9508-fe238cb692b3'}>満足70品コース 2980円(税込 3278円)</MenuItem>
              <MenuItem value={'95db9684-ee0d-4b4c-8fbf-ec6b9a98817f'}>牛角90品コース 3580円(税込 3938円)</MenuItem>
              <MenuItem value={'181a3ecf-1db9-4902-816e-83c7c8bd4705'}>堪能100品コース 4580円(税込 5038円)</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, width: '80%' }}
          >
             {editedGroup.id ? 'Update Group' : 'Create Group'}
          </Button>
      </Box>
      </Container>
    </div>
  )
}