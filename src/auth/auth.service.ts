import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { Env } from 'src/env'

@Injectable()
export class AuthService {
  constructor(private config: ConfigService<Env, true>) {}

  async getNewAccessToken(refreshToken: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://accounts.google.com/o/oauth2/token',
        {
          client_id: this.config.get('GOOGLE_CLIENT_ID', { infer: true }),
          client_secret: this.config.get('GOOGLE_CLIENT_SECRET', {
            infer: true,
          }),
        },
      )

      return response.data.access_token
    } catch (error) {
      throw new Error('Failed to refresh the access token.')
    }
  }

  async getProfile(token: string) {
    try {
      return axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`,
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to revoke the token:', error)
    }
  }

  async isTokenExpired(token: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
      )

      const expiresIn = response.data.expires_in

      if (!expiresIn || expiresIn <= 0) {
        return true
      }
    } catch (error) {
      return true
    }
  }

  async revokeGoogleToken(token: string) {
    try {
      await axios.get(
        `https://accounts.google.com/o/oauth2/revoke?token=${token}`,
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to revoke the token:', error)
    }
  }
}
