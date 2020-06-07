import {getMagnet} from '../libs/posts'

export default class Post {
  constructor({title, size, pubDate, hash}) {
  }
  static async downloadToNas(number) {
    const magnet = await getMagnet(number)
    console.log(magnet);
  }
  fetchFc2Imgs() {
  }
}
