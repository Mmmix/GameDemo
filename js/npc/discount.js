import Animation  from '../base/animation'
import DataBus    from '../databus'
import Sprite     from '../base/sprite'

const DISCOUNT_IMG_SRC = ''
const DISCOUNT_WIDTH = 90
const DISCOUNT_HEIGHT = 90

const __ = {
  speed: Symbol('speed')
}

function rnd(start, end) {
  return Math.floor(Math.random() * (end - start) + start)
}

let databus = new DataBus()

export default class Discount extends Animation{
  constructor(){
    super(DISCOUNT_IMG_SRC, DISCOUNT_WIDTH, DISCOUNT_HEIGHT)

    this.initDiscountAnimation()
  }

  init(speed) {
    this.x = rnd(0, window.innerWidth - DISCOUNT_WIDTH)
    this.y = -this.height
    
    this[__.speed] = speed

    this.visible = true
  }

  // 预定义优惠券的帧动画
  initDiscountAnimation() {
    let frames = []

    const DISC_IMG_PREFIX = 'images/scaner'
    const DISC_FRAME_COUNT = 14

    for (let i = 0; i < DISC_FRAME_COUNT; i++) {
      frames.push(DISC_IMG_PREFIX + (i + 1) + '.png')
    }

    this.initFrames(frames)
  }

  // 每一帧更新折扣券位置
  update() {
    this.y += this[__.speed]

    // 对象回收
    if (this.y > window.innerHeight + this.height) {
      this.stop()
      databus.removeDiscount(this)
    }
  }

}