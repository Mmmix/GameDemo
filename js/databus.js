import Pool from './base/pool'

let instance

/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if (instance)
      return instance

    instance = this

    this.pool = new Pool()

    this.reset()
  }

  reset() {
    this.frame = 0
    this.score = 0
    this.bullets = []
    this.enemys = []
    this.discounts = []
    this.animations = []
    this.gameOver = false
    this.gamePause = false
    this.getDiscount = false
  }

  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */
  removeEnemey(enemy) {
    //let temp = this.enemys.shift()
    let temp = (enemy === undefined) ?
      this.enemys.shift() : this.enemys.splice(this.enemys.indexOf(enemy), 1)

    temp.visible = false

    this.pool.recover('enemy', enemy)
  }

  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */
  removeBullets(bullet) {
    //let temp = this.bullets.shift()
    let temp = (bullet === undefined) ?
      this.bullets.shift() : this.bullets.splice(this.bullets.indexOf(bullet), 1)

    temp.visible = false

    this.pool.recover('bullet', bullet)
  }

  /**
   * 回收打折券，进入对象池
   * 此后不进入帧循环
   */
  removeDiscount(discount) {
    // let temp = this.discount.shift()
    let temp = (discount === undefined) ?
      this.discounts.shift() : this.discounts.splice(this.discounts.indexOf(discount), 1)

    temp.visible = false

    this.pool.recover('discount', discount)
  }
}