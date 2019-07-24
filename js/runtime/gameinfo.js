import DataBus from '../databus'

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
const SettingCommands = {
  textList: ['难度切换', '子弹切换', '火力切换', '无敌模式'],
  commandList: ['switchLevel', 'switchBullet', 'switchFire', 'legendary'],
  optionList: [
    [30, 20, 10],
    [1, 2, 3],
    [30, 20, 10, 5],
    [true, false]
  ]
}

let atlas = new Image()
atlas.src = 'images/Common.png'

export default class GameInfo {
  renderGameScore(ctx, score) {
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"

    ctx.fillText(
      '🏅 ' + score,
      10,
      30
    )

    this.areaSetting = {
      startX: 10,
      startY: 10,
      endX: 38,
      endY: 35
    }
  }

  onTouchEvent(type, x, y, callback) {
    let databus = new DataBus()
    // let area = this.areaSetting
    if (x >= this.areaSetting.startX &&
      x <= this.areaSetting.endX &&
      y >= this.areaSetting.startY &&
      y <= this.areaSetting.endY) {
      callback({
        message: 'pause'
      })
      let commandIndex
      wx.showActionSheet({
        itemList: SettingCommands.textList,
        success(res) {
          commandIndex = res.tapIndex
        },
        complete() {
          if (commandIndex != undefined) {
            callback({
              message: SettingCommands.commandList[commandIndex],
              option: SettingCommands.optionList[commandIndex]
            })
          }
          callback({
            message: 'resume'
          })
        }
      })
    } else if (databus.gameOver && x >= this.btnArea.startX &&
      x <= this.btnArea.endX &&
      y >= this.btnArea.startY &&
      y <= this.btnArea.endY) {
      callback({
        message: 'restart'
      })
      //...
    } else if (databus.getDiscount) {
      if (x >= this.btnArea.startX &&
        x <= this.btnArea.endX &&
        y >= this.btnArea.startY &&
        y <= this.btnArea.endY) {
        databus.getDiscount = false
        callback({
          message: 'resume'
        })
      } else if (x >= this.discountArea.startX &&
        x <= this.discountArea.endX &&
        y >= this.discountArea.startY &&
        y <= this.discountArea.endY) {
        databus.getDiscount = false
        callback({
          message: 'discountLink'
        })

      }
    }
  }

  renderDiscount(ctx) {
    let img = new Image()
    img.src = 'images/pfu.png'
    ctx.drawImage(img, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300)

    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"

    ctx.fillText(
      '恭喜您获得优惠券，请领取！！',
      screenWidth / 2 - 120,
      screenHeight / 2 - 100
    )

    //继续按钮渲染
    ctx.drawImage(
      atlas,
      120, 6, 39, 24,
      screenWidth / 2 + 30,
      screenHeight / 2 - 100 + 280,
      100, 40
    )

    //领取按钮渲染
    ctx.drawImage(
      atlas,
      120, 6, 39, 24,
      screenWidth / 2 - 100 - 5 - 5,
      screenHeight / 2 - 100 + 280,
      100, 40
    )

    ctx.fillText(
      '领取',
      screenWidth / 2 - 80 - 5,
      screenHeight / 2 - 100 + 305
    )

    ctx.fillText(
      '继续',
      screenWidth / 2 + 60,
      screenHeight / 2 - 100 + 305
    )

    //继续按钮区域
    this.btnArea = {
      startX: screenWidth / 2 + 40,
      startY: screenHeight / 2 + 180,
      endX: screenWidth / 2 + 120,
      endY: screenHeight / 2 + 220
    }

    //领取按钮区域
    this.discountArea = {
      startX: screenWidth / 2 - 110,
      startY: screenHeight / 2 + 180,
      endX: screenWidth / 2 - 10,
      endY: screenHeight / 2 + 220
    }

  }

  renderGameOver(ctx, score) {
    ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300)

    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"

    ctx.fillText(
      '游戏结束',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 50
    )

    ctx.fillText(
      '得分: ' + score,
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 130
    )

    ctx.drawImage(
      atlas,
      120, 6, 39, 24,
      screenWidth / 2 - 60,
      screenHeight / 2 - 100 + 180,
      120, 40
    )

    ctx.fillText(
      '重新开始',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 205
    )

    /**
     * 重新开始按钮区域
     * 方便简易判断按钮点击
     */
    this.btnArea = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 100 + 180,
      endX: screenWidth / 2 + 50,
      endY: screenHeight / 2 - 100 + 255
    }
  }
}