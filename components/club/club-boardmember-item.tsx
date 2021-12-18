import { Avatar, Collapse, Divider, IconButton } from '@mui/material'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import Email from '@mui/icons-material/Email'
import Phone from '@mui/icons-material/Phone'
import { Fragment, useState } from 'react'
import { Text } from 'ui'
import { theme } from 'styles/theme'
import { BoardSimpleDTO } from 'types/api'
import { clubRolesExplanations } from 'utils/club-roles-explanations'

type Props = { boardMember: BoardSimpleDTO }

export const BoardMemberItem = ({ boardMember }: Props) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  return (
    <Fragment key={boardMember.id}>
      <div className="flex items-start">
        <div className="flex-1 mr-4">
          <Text variant="h3">{boardMember.ClubRole?.name}</Text>
          <Text variant="body">
            {clubRolesExplanations[boardMember.ClubRole!.name]}
          </Text>

          <Collapse in={isExpanded}>
            <div className="flex items-center mt-2">
              <Avatar
                src={boardMember.avatar ?? ''}
                className="w-10 h-10 mr-4"
              />
              <div>
                <Text
                  variant="body"
                  className="font-semibold"
                >{`${boardMember.name} ${boardMember.surname}`}</Text>
                <div className="flex items-center">
                  <Phone
                    className="text-xl mr-2"
                    sx={{ color: theme.palette.neutral.main }}
                  />
                  <Text variant="body2">{boardMember.phone}</Text>
                </div>
                <div className="flex items-center">
                  <Email
                    className="text-xl mr-2"
                    sx={{ color: theme.palette.neutral.main }}
                  />
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
          <KeyboardArrowDown
            className={`transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
          />
        </IconButton>
      </div>

      <Divider className="my-4" />
    </Fragment>
  )
}
