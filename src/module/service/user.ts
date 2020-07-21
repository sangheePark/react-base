import API from '@module/api'
import { MUser } from '@model/user'
import { AxiosResponse } from 'axios'

const UserService = {
  get: (): Promise<MUser> => {
    return new Promise(async (resolve, reject) => {
      try {
        const response: AxiosResponse = await API.get('/user')
        resolve(response.data)
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default UserService
