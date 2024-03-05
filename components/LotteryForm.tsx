import { FC, useState } from 'react'
import useStore from '../store'
import { useMutateOrder } from '../hooks/useMutateOrder'
import { Spinner } from './Spinner'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import shuffle from "lodash.shuffle"
import { Grid } from '@mui/material'
import Image from 'next/image'

export const LotteryForm: FC<{menuList: Array<string>, group_id: string, event_id: string}> = ({menuList, group_id, event_id}) => {
  const [pickedMenu, setpickedMenu] = useState<string | undefined>('')
  const [isShowImage, setIsShowImage] = useState<boolean>(false)
  const { createOrderMutation } = useMutateOrder()
  const { editedOrder } = useStore()
  const update = useStore((state) => state.updateEditedOrder)
  const lottery = () => {
    setIsShowImage(false)
    let shuffledyMenu = shuffle(menuList)
    setpickedMenu(shuffledyMenu[0][0])
    if(shuffledyMenu[0][1] === "肉") {
      setIsShowImage(true)
    }
    update({ ...editedOrder, name: shuffledyMenu[0][0] })
  }
  const createOrder = () => {
    createOrderMutation.mutate({
        name: editedOrder.name,
        group_id: group_id,
        event_id: event_id,
      })
    setpickedMenu('')
  }

  if (createOrderMutation.isLoading) { // 処理中はisLoadingがtrueになる
    return (
      <Box
        sx={{
          marginTop: 4,
          marginBottom: 4,
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
      {isShowImage && <Box 
        style={{'textAlign': 'center'}}
        >
          <Image 
            src="/niku.png" 
            alt='nikugazou'
            width={150}
            height={150}
          />
      </Box>}
      <Box 
        sx={{
          bgcolor: 'background.paper',
          pb: 4,
          fontWeight: 'bold',
          fontSize: '20px'
        }}
        style={{'textAlign': 'center'}}
        >
          {pickedMenu}
      </Box>
      <Box 
        sx={{
          bgcolor: 'background.paper',
          pt: 0,
          pb: 3,
        }}
        style={{'textAlign': 'center'}}
        >
          {!pickedMenu && 
          <Button
            onClick={lottery}
            fullWidth
            variant="outlined"
            sx={{ mt: 1, mb: 2, width: '50%' }}
          >
             {'抽選する'}
          </Button> }
          {pickedMenu && 
            <Grid container spacing={3}>
              <Grid item xs={6}>
              <Button
                  onClick={createOrder}
                  variant="outlined"
                  sx={{ mt: 1, mb: 2 }}
                >
                   {'確定！'}
                </Button>
              </Grid>
              <Grid item xs={6}>
              <Button
                  onClick={lottery}
                  variant="outlined"
                  sx={{ mt: 1, mb: 2 }}
                >
                   {'再抽選!'}
                </Button>
              </Grid>
            </Grid> }
          </Box>
      </Container>
    </div>
  )
}