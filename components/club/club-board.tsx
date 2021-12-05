import { Avatar, Collapse, Divider, IconButton, Paper } from '@mui/material'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import Email from '@mui/icons-material/Email'
import Phone from '@mui/icons-material/Phone'
import { useTypeSafeQuery } from 'hooks'
import { Fragment, useState } from 'react'
import { Text } from 'ui'

// TODO: remove lorem ipsum, fix accordion expansions
export const ClubBoard = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const clubBoardQuery = useTypeSafeQuery('getClubBoard')

  return (
    <Paper className="p-4">
      <Text variant="h1_light" className="mb-6">
        Contact
      </Text>

      {clubBoardQuery.isLoading && <p>Loading...</p>}
      {clubBoardQuery.isError && <p>Error!</p>}
      {clubBoardQuery.isSuccess &&
        clubBoardQuery.data &&
        clubBoardQuery.data.map(boardMember => (
          <Fragment key={boardMember.id}>
            <div className="flex items-start">
              <div className="flex-1 mr-4">
                <Text className="font-semibold">
                  {boardMember.ClubRole?.name}
                </Text>
                <Text variant="body2">Lorem ipsum for now</Text>

                <Collapse in={isExpanded}>
                  <div className="flex items-center mt-2">
                    <Avatar
                      src={boardMember.avatar ?? ''}
                      className="w-10 h-10 mr-4"
                    />
                    <div>
                      <Text>{`${boardMember.name} ${boardMember.surname}`}</Text>
                      <div className="flex items-center">
                        <Phone className="text-xl mr-2" />
                        <Text variant="body2">{boardMember.phone}</Text>
                      </div>
                      <div className="flex items-center">
                        <Email className="text-xl mr-2" />
                        <Text variant="body2">{boardMember.User.email}</Text>
                      </div>
                    </div>
                  </div>
                </Collapse>
              </div>

              <IconButton
                size="small"
                edge="end"
                onClick={() => setIsExpanded(prev => !prev)}
              >
                <KeyboardArrowDown rotate={isExpanded ? 180 : 0} />
              </IconButton>
            </div>

            <Divider className="my-4" />
          </Fragment>
        ))}
    </Paper>
  )
}
