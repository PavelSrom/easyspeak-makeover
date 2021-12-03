// @ts-ignore
const { PrismaClient } = require('@prisma/client')

const PATHWAYS = [
  { name: 'Dynamic Leadership' },
  { name: 'Effective Coaching' },
  { name: 'Engaging Humor' },
  { name: 'Innovative Planning' },
  { name: 'Leadership Development' },
  { name: 'Motivational Strategies' },
  { name: 'Persuasive Influence' },
  { name: 'Presentation Mastery' },
  { name: 'Strategic Relationships' },
  { name: 'Team Collaboration' },
  { name: 'Visionary Communication' },
]

const BOARD_ROLES = [
  { name: 'VP of Education' },
  { name: 'VP of Membership' },
  { name: 'President' },
  { name: 'VP of Public Relations' },
  { name: 'Secretary' },
  { name: 'Sergant at Arms' },
  { name: 'Treasurer' },
]

const CLUB = {
  name: 'Frederiksberg Toastmasters',
  description: 'This is the Frederiksberg Toastmasters club in Copenhagen',
  location: 'Østerbrohuset',
}

const prisma = new PrismaClient()

const main = async () => {
  try {
    await prisma.pathway.createMany({ data: PATHWAYS })
    await prisma.clubRole.createMany({ data: BOARD_ROLES })
    const club = await prisma.club.create({ data: CLUB })

    const firstBoardRole = await prisma.clubRole.findFirst()
    const firstPathway = await prisma.pathway.findFirst()

    const newUser = await prisma.user.create({
      data: {
        clubId: club?.id,
        email: 'pavel@gmail.com',
        password:
          '$2a$08$jv27f0KGgcNrvigaxvqVYeZvZA2uUMH.TMLjZ5WaeMuuwnr1NTNne',
      },
    })

    await prisma.profile.create({
      data: {
        name: 'Pavel',
        surname: 'Srom',
        phone: '52784097',
        User: { connect: { id: newUser.id } },
        ClubRole: { connect: { id: firstBoardRole?.id } },
        Pathway: { connect: { id: firstPathway?.id } },
      },
    })
  } catch (error) {
    console.log(error)
    process.exit(1)
  }

  await prisma.$disconnect()
}

main()
