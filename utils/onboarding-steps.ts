import { Step } from 'react-joyride'

export const ONBOARDING_STEPS: Step[] = [
  {
    target: '.onboarding-1',
    title: 'Welcome!',
    content: `Welcome to EasySpeak! Right now you're seeing the Dashboard
      page where you can see multiple widgets with important information and
      updates. `,
  },
  {
    target: '.onboarding-2',
    title: 'Profile',
    content: `Now you are seeing your Profile page. Here you can update your
      personal information, change settings, and see your activity.`,
  },
  {
    target: '.onboarding-3',
    title: 'Toolbar',
    content: `This is a place where you can find app navigation, the title of
      the page you're currently on, and notifications.`,
  },
  {
    target: '.onboarding-4',
    title: 'Discussion forum',
    content: `Right now you're seeing the Discussion forum page. Here you can
      find people's posts, entire discussions by clicking on the post, and you
      can also create your own posts for everyone within the club to see by
      clicking this button.`,
  },
  {
    target: '.onboarding-5',
    title: 'About the club',
    content: `Right now you're seeing the Club page. Here you can
      find information about your club, its members, the board, descriptions
      and contact information for the different board roles in case you need
      someone to assist you.`,
  },
  {
    target: '.onboarding-6',
    title: 'The calendar',
    content: `Now you're seeing the Meetings page where you can see upcoming
      meetings, browse this calendar either by month or by a specific day to
      see what meetings are being held or have held in the past.`,
  },
  {
    target: '.onboarding-7',
    title: 'List with meetings',
    content: `This is a list of meetings for a specific month or day. If you
      click on a specific day in the calendar, only meetings on that day will
      be listed. If you click on the meeting tile itself, you will be redirected
      to a page showing the details of that meeting. Please do so to continue.`,
  },
  {
    target: '.onboarding-8',
    title: 'Meeting details',
    content: `This is a page with meeting details. On the 'Details' tab, you can
      see where the meeting is taking place, how long it lasts, who is the manager,
      and the list of people attending. You can also confirm your attendance here.`,
  },
  {
    target: '.onboarding-9',
    title: 'Meeting agenda',
    content: `This is the meeting agenda. You can sign up for roles by clicking
      the orange button. Once you've signed up for a role, you can remove
      yourself from that role by clicking the trash icon on the right side.`,
  },
  {
    target: '.onboarding-10',
    title: 'Signing up for speeches',
    content: `Please note that when you sign up for a speech, the speech must
      be approved by a board member. When you fill out the speech title and
      description, the speech will have a pending status until a board member
      approves it.`,
  },
  {
    target: '.onboarding-11',
    title: 'Signing up for other roles',
    content: `Signing up for other roles works the exact same way, except you
      don't need anybody's approval. You simply hit the orange button and you're
      good to go!`,
  },
]
