import Player from './player/index'
import Enemy from './npc/enemy'
import Discount from './npc/discount'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'
import Config from './common/config'

let ctx = canvas.getContext('2d')
let databus = new DataBus()
let isDiscountShow = false
/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    // 维护当前requestAnimationFrame的id
    this.aniId = 0

    this.hasEventBind = true
    this.touchHandler = this.touchEventHandler.bind(this)
    canvas.addEventListener('touchstart', this.touchHandler)
    this.restart()
  }

  switchBullet() {
    if (Config.BulletNum == 2)
      Config.BulletNum += 1;
    else
      Config.BulletNum = (Config.BulletNum + 1) % 3
  }

  switchLevel(res) {
    let index = res.option.indexOf(Config.EnemyRate)
    Config.EnemyRate = res.option[(index + 1) % res.option.length]
  }

  switchFire(res) {
    let index = res.option.indexOf(Config.ShootSpeed)
    Config.ShootSpeed = res.option[(index + 1) % res.option.length]
    Config.BulletSpeed = (index + 1) * 10
  }

  legendary(res) {
    let index = res.option.indexOf(Config.legendary)
    Config.legendary = res.option[(index + 1) % res.option.length]

  }

  discountLink(res) {
    let that = this
    wx.navigateToMiniProgram({
      appId: 'wx91d27dbf599dff74',
      path: 'pages/item_wqvue/detail/detail?sku=37681995738',
      success(res) {
        // 打开成功
        // wx.showToast({
        //   title: '',
        // })
      },
      fail(res) {
        wx.showToast({
          title: '残忍拒绝了',
          icon: 'none'
        })
      },
      complete(res) {
        that.resume()
      }
    })
  }

  pause() {
    databus.gamePause = true
  }

  resume() {
    databus.gamePause = false
    this.render()
    this.update()
  }

  restart() {
    isDiscountShow = false
    databus.reset()

    this.bg = new BackGround(ctx)
    this.player = new Player(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()

    this.bindLoop = this.loop.bind(this)
    this.hasEventBind = false

    // 清除上一局的动画
    window.cancelAnimationFrame(this.aniId);

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if (databus.frame % Config.EnemyRate === 0) {
      let enemy = databus.pool.getItemByClass('enemy', Enemy)
      enemy.init(6)
      databus.enemys.push(enemy)
    }
  }

  /**
   * 随着帧数变化的优惠券生成逻辑
   * 帧数取模定义成生成的频率
   */
  discountGenerate() {
    // if (!this.isDiscountShow && databus.score === Config.DiscountShowScore) {
    if (databus.score % Config.DiscountShowScore === 0) {
      let discount = databus.pool.getItemByClass('discount', Discount)
      discount.init(1)
      databus.discounts.push(discount)
      this.isDiscountShow = true
      discount.playAnimation(0, true, 1000 / 18, true)
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    let that = this

    databus.bullets.forEach((bullet) => {
      for (let i = 0, il = databus.enemys.length; i < il; i++) {
        let enemy = databus.enemys[i]

        if (!enemy.isPlaying && enemy.isCollideWith(bullet)) {
          enemy.playAnimation()
          that.music.playExplosion()

          bullet.visible = false
          databus.score += 1

          that.discountGenerate()

          // 随分数增加难度
          // if (databus.score % 10 == 0 && Config.EnemyRate>10){

          //   Config.EnemyRate -= 10
          // }

          break
        }
      }
    })

    for (let i = 0, il = databus.enemys.length; i < il; i++) {
      let enemy = databus.enemys[i]

      if (this.player.isCollideWith(enemy) && !Config.legendary) {
        databus.gameOver = true

        break
      }
    }

    for (let i = 0, il = databus.discounts.length; i < il; i++) {
      let discount = databus.discounts[i]

      if (this.player.isCollideWith(discount)) {
        databus.getDiscount = true
        discount.visible = false
        discount.stop()
        databus.removeDiscount(discount)
        this.pause()
        this.gameinfo.gamePause = true

        break
      }
    }
  }

  // 游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
    e.preventDefault()
    let x = e.touches[0].clientX
    let y = e.touches[0].clientY
    // let that = this
    let element = this.gameinfo
    element.onTouchEvent(e.type, x, y, ((res) => {
      switch (res.message) {
        case "pause":
          this.pause()
          break
        case "resume":
          this.resume()
          break
        case "restart":
          this.restart()
          break
        case "switchLevel":
          this.switchLevel(res)
          break
        case "switchBullet":
          this.switchBullet(res)
          break
        case "switchFire":
          this.switchFire(res)
          break
        case "legendary":
          this.legendary(res)
          break
        case "discountLink":
          this.discountLink(res)
          break
        default:
          break
      }
    }).bind(this))


  }

  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.bg.render(ctx)


    databus.bullets
      .concat(databus.enemys)
      .concat(databus.discounts)
      .forEach((item) => {
        item.drawToCanvas(ctx)
      })

    this.player.drawToCanvas(ctx)

    databus.discounts.forEach((discount) => {
      discount.aniRender(ctx)
    })

    databus.animations.forEach((ani) => {
      if (ani.isPlaying) {
        ani.aniRender(ctx)
      }
    })

    this.gameinfo.renderGameScore(ctx, databus.score)

    if (databus.getDiscount) {

      this.gameinfo.renderDiscount(ctx)
    }

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      this.gameinfo.renderGameOver(ctx, databus.score)

    }
  }

  // 游戏逻辑更新主函数
  update() {
    if (databus.gameOver || databus.gamePause)
      return;

    this.bg.update()

    databus.bullets
      .concat(databus.enemys)
      .concat(databus.discounts)
      .forEach((item) => {
        item.update()
      })

    this.enemyGenerate()

    this.collisionDetection()

    if (databus.frame % Config.ShootSpeed === 0) {
      this.player.shoot()
      this.music.playShoot()
    }
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.update()
    this.render()

    this.aniId = window.requestAnimationFrame(
      this.bindLoop,
      canvas
    )
  }
}