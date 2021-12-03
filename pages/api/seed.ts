// import { NextApiRequest, NextApiResponse } from 'next'
// import { prisma } from 'utils/prisma-client'

export const something = null

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   switch (req.method) {
//     case 'POST':
//       try {
//         const newClub = await prisma.club.create({
//           data: {
//             name: 'Frederiksberg Toastmasters',
//             description:
//               'This is the Frederiksberg Toastmasters Club in Copenhagen',
//             location: 'Østerbrohuset',
//           },
//         })

//         const pavel = await prisma.user.create({
//           data: { email: 'pavel@gmail.com', clubId: newClub.id },
//         })

//         const firstPathway = await prisma.pathway.findFirst()
//         const firstClubRole = await prisma.clubRole.findFirst()

//         const makePavelBoard = await prisma.profile.create({
//           data: {
//             name: 'Pavel',
//             surname: 'Srom',
//             phone: '52784097',
//             Pathway: { connect: { id: firstPathway?.id } },
//             ClubRole: { connect: { id: firstClubRole?.id } },
//             User: { connect: { id: pavel.id } },
//           },
//         })

//         return res.status(201).json({ newClub, makePavelBoard })
//       } catch ({ message }) {
//         return res.status(500).json({ message })
//       }

//     default:
//       return res.status(405).json({ message: 'Method not allowed' })
//   }
// }
