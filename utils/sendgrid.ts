import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

type SendArguments = {
  to: string
  subject: string
  text: string
}

export const sendEmail = async (
  sendArgs: SendArguments
): Promise<{ err: any }> =>
  new Promise((resolve, reject) => {
    sgMail.send({ from: 'srompavel98@gmail.com', ...sendArgs }).then(
      () => resolve({ err: undefined }),
      err => {
        if (err.response) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ err: err.response.body })
        }
      }
    )
  })
