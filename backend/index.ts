import axios from 'axios'
import queryString from 'query-string'
import {
  BoardSimpleDTO,
  ClubInfoDTO,
  CommentDTO,
  MeetingFullDTO,
  MeetingSimpleDTO,
  MemberFullDTO,
  MemberSchemaDTO,
  NewUserDTO,
  NotificationDTO,
  PostFullDTO,
  PostSimpleDTO,
  ProfileDTO,
} from 'types/api'
import {
  CreateCommentPayload,
  CreateMeetingPayload,
  CreateMemberPayload,
  CreatePostPayload,
} from 'types/payloads'

export const requests = {
  query: {
    // POSTS
    getAllPosts: (): Promise<PostSimpleDTO[]> =>
      axios.get('/api/posts').then(response => response.data),
    getPostById: (id: string): Promise<PostFullDTO> =>
      axios.get(`/api/posts/${id}`).then(response => response.data),
    // NOTIFICATIONS
    getAllNotifications: (): Promise<NotificationDTO[]> =>
      axios.get('/api/notifications').then(response => response.data),
    // COMMENTS
    getAllComments: (params: {
      postId?: string
      userId?: string
    }): Promise<CommentDTO[]> => {
      const query = queryString.stringify(params, {
        skipEmptyString: true,
        skipNull: true,
      })

      return axios.get(`/api/comments?${query}`).then(response => response.data)
    },
    // MEETINGS
    getMeetingRoles: (): Promise<{ id: string; name: string }[]> =>
      axios.get('/api/meeting-roles').then(response => response.data),
    getAllMeetings: (params: {
      timeStart?: string
      timeEnd?: string
      user?: string
    }): Promise<MeetingSimpleDTO[]> => {
      const query = queryString.stringify(params, {
        skipEmptyString: true,
        skipNull: true,
      })

      return axios.get(`/api/meetings?${query}`).then(response => response.data)
    },
    getMeetingById: (id: string): Promise<MeetingFullDTO> =>
      axios.get(`/api/meetings/${id}`).then(response => response.data),
    // PROFILE
    getUserProfile: (): Promise<ProfileDTO> =>
      axios.get('/api/profile').then(response => response.data),
    // CLUB THINGS
    getClubInfo: (): Promise<ClubInfoDTO> =>
      axios.get('/api/club').then(response => response.data),
    getClubMembers: (): Promise<MemberSchemaDTO> =>
      axios.get('/api/club/members').then(response => response.data),
    getClubBoard: (): Promise<BoardSimpleDTO[]> =>
      axios.get('/api/club/board').then(response => response.data),
    getClubMemberById: (id: string): Promise<MemberFullDTO> =>
      axios.get(`/api/club/members/${id}`).then(response => response.data),
    // MISCELLANEOUS
    getAllPathways: (): Promise<{ id: string; name: string }[]> =>
      axios.get('/api/pathways').then(response => response.data),
    getClubRoles: (): Promise<{ id: string; name: string }[]> =>
      axios.get('/api/club-roles').then(response => response.data),
  },
  mutation: {
    // AUTH
    createNewMember: (email: string): Promise<NewUserDTO> =>
      axios
        .post('/api/auth/create-member', { email })
        .then(response => response.data),
    deleteNewMemberById: (id: string): Promise<{ message: string }> =>
      axios
        .delete(`/api/auth/create-member/${id}`)
        .then(response => response.data),
    authCheckUser: (email: string): Promise<{ id: string }> =>
      axios
        .post('/api/auth/check-user', { email })
        .then(response => response.data),
    authSignup: (payload: CreateMemberPayload): Promise<{ message: string }> =>
      axios.post('/api/auth/signup', payload).then(response => response.data),
    deleteUserAccount: (): Promise<{ message: string }> =>
      axios.delete('/api/auth/delete').then(response => response.data),
    // PROFILE
    updateUserProfile: (
      payload: Partial<CreateMemberPayload> & { avatar?: string }
    ): Promise<ProfileDTO> =>
      axios.put('/api/profile', payload).then(response => response.data),
    // NOTIFICATIONS
    markNotificationAsRead: (id: string): Promise<NotificationDTO> =>
      axios.put(`/api/notifications/${id}`).then(response => response.data),
    deleteNotificationById: (id: string): Promise<{ message: string }> =>
      axios.delete(`/api/notifications/${id}`).then(response => response.data),
    // POSTS
    createNewPost: (payload: CreatePostPayload): Promise<PostFullDTO> =>
      axios.post('/api/posts', payload).then(response => response.data),
    updatePostById: (
      id: string,
      payload: CreatePostPayload
    ): Promise<PostFullDTO> =>
      axios.put(`/api/posts/${id}`, payload).then(response => response.data),
    deletePostById: (id: string): Promise<{ message: string }> =>
      axios.delete(`/api/posts/${id}`).then(response => response.data),
    // COMMENTS
    createNewComment: (payload: CreateCommentPayload): Promise<CommentDTO> =>
      axios.post('/api/comments', payload).then(response => response.data),
    deleteCommentById: (id: string): Promise<{ message: string }> =>
      axios.delete(`/api/comments/${id}`).then(response => response.data),
    // MEETINGS
    createNewMeeting: (
      payload: CreateMeetingPayload
    ): Promise<MeetingFullDTO> =>
      axios.post('/api/meetings', payload).then(response => response.data),
    toggleMeetingAttendance: ({
      meetingId,
      attending,
    }: {
      meetingId: string
      attending: boolean
    }): Promise<{ message: string }> =>
      axios
        .post(`/api/meetings/${meetingId}/attendance?attending=${attending}`)
        .then(response => response.data),
  },
}
