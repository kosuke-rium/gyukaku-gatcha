import { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Event } from '../types/types'
import { EventForm } from '../components/EventForm'
import { supabase } from '../utils/supabase'
import { useMutateEvent } from '../hooks/useMutateEvent'
import useStore from '../store'

type Props = {
  events: Event[]
};

export const EventItem: FC<Props> = (props) => {
  const [userId, setUserId] = useState<string | undefined>('')
  useEffect(() => {
    setUserId(supabase.auth.user()?.id)
  }, [])
  const update = useStore((state) => state.updateEditedEvent)
  const { deleteEventMutation } = useMutateEvent()
  return (
    <div>
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
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
            Event List
          </Typography>
        </Container>
      </Box>
      <EventForm />
      <Container sx={{ py: 8 }} maxWidth="md">
        <Grid container spacing={4}>
          {props.events.map((event) => (
            <Grid item key={event.id} xs={12} sm={6} md={4}>
              <Card
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom component="h2">
                    {event.date}
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
                    {event.name}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small"
                  >
                  <Link 
                    href={`/event/${event.id}`}
                    passHref 
                    prefetch={false}
                    key={event.id}
                  >     
                    <Typography component="h2">
                      View
                    </Typography>      
                  </Link>
                  </Button>
                  {userId === event.user_id && (
                    <span>
                      <Button 
                        size="small"
                        onClick={() => {
                        update({
                            id: event.id,
                            name: event.name,
                            date: event.date,
                          })
                        }}
                      >
                        <Typography component="h2">
                          Edit
                        </Typography>
                      </Button>
                      <Button 
                        size="small"
                        onClick={() => {
                          deleteEventMutation.mutate(event.id)
                        }}
                      >
                        <Typography component="h2">
                          delete
                        </Typography>
                      </Button>

                    </span>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  )
}