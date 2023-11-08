import { Repository } from 'typeorm'
import { CustomRepository } from '../common/decorator/typeorm-ex.decorator'
import { User } from './entities/user.entity'
import { RegisterUserDto } from './dto/registerUser.dto'
import { SettingUserDto } from './dto/settingUser.dto'

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  // 유저 생성
  async createUser(user: RegisterUserDto): Promise<void> {
    await this.save(user)
  }

  // username으로 유저 찾기
  async findByUsername(username: string): Promise<User> {
    const user = await this.findOne({ where: { username } })

    return user
  }

  // id로 유저 찾기
  async findById(id: string): Promise<User> {
    const user = await this.findOne({ where: { id } })

    return user
  }
  // username으로 유저 찾기
  async findByUsernameExceptPW(username: string): Promise<User> {
    const user = await this.findOne({
      select: {
        id: true,
        username: true,
        lat: true,
        lon: true,
        lunchServiceYn: true,
      },
      where: { username },
    })

    return user
  }

  // 설정 업데이트
  async updateUserByUsername(username: string, settingUserDto: SettingUserDto): Promise<boolean> {
    const user = await this.createQueryBuilder()
    .update(User)
    .set({
      ...settingUserDto
    })
    .where({ username })
    .execute()

    return user.affected === 1 ? true : false
  }
}
