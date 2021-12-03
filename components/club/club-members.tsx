import { Fab, Paper } from '@mui/material'
import AddOutlined from '@mui/icons-material/AddOutlined'
import { MemberSimpleDTO } from 'types/api'
import { Text } from 'ui'

type Props = {
  members: MemberSimpleDTO[]
  onAddMember: () => void
}

export const ClubMembers = ({ members, onAddMember }: Props) => (
  <div className="space-y-8">
    <Paper className="p-4">
      <Text variant="h1_light">Members</Text>
      {members.map(member => (
        <div key={member.id}>
          <Text variant="body">{`${member.name} ${member.surname}`}</Text>
          {member.ClubRole && (
            <Text variant="body">{member.ClubRole.name}</Text>
          )}
        </div>
      ))}
    </Paper>
    <Paper className="p-4">
      <Text variant="h1_light">Pending invites</Text>
    </Paper>

    <Fab
      variant="extended"
      color="secondary"
      size="small"
      className="fixed bottom-4 right-4 text-white"
      onClick={onAddMember}
    >
      <AddOutlined />
      Add member
    </Fab>
  </div>
)
