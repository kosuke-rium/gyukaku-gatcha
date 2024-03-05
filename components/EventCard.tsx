import { FC, useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Event } from '../types/types'
import { supabase } from '../utils/supabase'
import { GroupForm } from './GroupForm';
import mainMenu from '../mainMenu.json'
import { LotteryForm } from './LotteryForm'
import { useMutateOrder } from '../hooks/useMutateOrder'
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

type Props = {
  eventDetail: Event
};

export const EventCard: FC<Props> = (props) => {
  const [userId, setUserId] = useState<string | undefined>('')
  const [groupId, setGroupId] = useState<string>('')
  const [eventId, setEventId] = useState<string>('')
  const [courseId, setcourseId] = useState<string>('')
  const [menu, setMenu] = useState<Array<string>>([])
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [isDesertMode, setIsDesertMode] = useState<boolean>(false)
  const [isExistGroup, setIsExistGroup] = useState<boolean | undefined>(false)
  const { deleteOrderMutation } = useMutateOrder()

  const changeMenuMode = () => {
    const isDesertFlg = !isDesertMode
    if(!isDesertFlg) {
      // @ts-ignore
      const menu = mainMenu[`${courseId}`]["main"]
      setMenu(menu)
    } else {
      // @ts-ignore
      const menu = mainMenu[`${courseId}`]["desert"]
      setMenu(menu)
    }
    setIsDesertMode(!isDesertMode)
  }
 
  useEffect(() => {
    // memo: useEffectの中でuseStateを使う場合はuseEffect内では値を参照できない場合があるので注意！！
    const userId = supabase.auth.user()?.id
    setUserId(userId)

    const courseId = props.eventDetail.groups.find(e => e.user_id === userId)?.course_id
    const group = props.eventDetail.groups.find(e => e.user_id === userId)

    if(courseId) {
      setcourseId(courseId)
      // @ts-ignore
      const mainMenuList = mainMenu[`${courseId}`]["main"]
      setMenu(mainMenuList)
      setGroupId(group?.id || "")
      setEventId(group?.event_id || "")
      setIsExistGroup(true)
    }
  }, [])
  return (
    <div>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 6,
          pb: 2,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            sx={{
              width: '100%',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              textDecoration: 'none',
            }}
          >
            {props.eventDetail.name}
          </Typography>
        </Container>
      </Box>
      {!isExistGroup &&
        <GroupForm event_id={props.eventDetail.id} />
      }
      {isExistGroup && 
        <Container sx={{ py: 8 }} maxWidth="md">
          <div style={{"textAlign": "right"}}>
                    <FormControlLabel
                    control={
                    <Switch
                      checked={isDesertMode}
                      onChange={changeMenuMode}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />} 
                    label="デザート" />
                  </div>
        <LotteryForm menuList={menu} group_id={groupId} event_id={eventId} />
        <Grid container spacing={4}>
          {props.eventDetail.groups.map((group) => (
            <Grid item key={group.id} xs={12} sm={6} md={6}>
              <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom component="h2">
                    {group.courses.name}
                  </Typography>
                  <Typography 
                    gutterBottom 
                    variant="h5" 
                    component="h2"
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 500,
                    }}
                  >
                    {group.name}
                  </Typography>
                  <Typography 
                    gutterBottom 
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                  >
                    {'注文したメニュー↓'}
                  </Typography>
                  {group?.id === groupId &&
                  <div style={{"textAlign": "right"}}>
                    <FormControlLabel
                    control={
                    <Switch
                      checked={isEditMode}
                      onChange={() => {setIsEditMode(!isEditMode)}}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />} 
                    label="編集モード" />
                  </div>
                  }

                  {group?.orders.map((order) => (
                    <div key={order.id}>
                      <Typography 
                      sx={{
                        paddingTop: '4px',
                        paddingBottom: '4px',
                        fontFamily: 'monospace',
                        textAlign: 'center',
                        width: isEditMode ? '70%' : '100%'
                      }}
                      style={{'float': 'left'}}
                      >
                        {order.name}
                      </Typography>
                      {group?.id === groupId && isEditMode && (
                        <Button 
                          size="small"
                          onClick={() => {
                            deleteOrderMutation.mutate(order.id)
                          }}
                        >
                        <Typography textAlign={'right'}>
                          削除
                        </Typography>
                      </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
      }
    </div>
  )
}