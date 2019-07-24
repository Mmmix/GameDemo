import DataBus from  '../databus'

const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight
const SettingCommands = {
  textList: ['帧率切换','子弹切换','无敌模式'],
  commandList: ['switchFps','switchBullet','legendary'],
  optionList: [[60,30,10],[1,2,3],[true,false]]
}

let atlas = new Image()
atlas.src = 'images/Common.png'

export default class GameInfo {
  renderGameScore(ctx, score) {
    ctx.fillStyle = "#ffffff"
    ctx.font      = "20px Arial"

    ctx.fillText(
      '🏅 ' + score,
      10,
      30
    )

    this.areaSetting = {
      startX : 10,
      startY : 10,
      endX : 38,
      endY : 35
    }
  }

  onTouchEvent(type, x, y, callback) {
    let databus = new DataBus()
    console.log(databus)
    // let area = this.areaSetting
    if (x >= this.areaSetting.startX
      && x <= this.areaSetting.endX
      && y >= this.areaSetting.startY
      && y <= this.areaSetting.endY) {
      callback({ message: 'pause'})
      let commandIndex
      wx.showActionSheet({
        itemList: SettingCommands.textList,
        success(res){
          commandIndex = res.tapIndex
        },
        complete(){
          if(commandIndex!=undefined){
            callback({
              message: SettingCommands.commandList[commandIndex],
              option: SettingCommands.optionList[commandIndex]
            })
          }
          callback({message: 'resume'})
        }
      })
    } 
    else if (databus.gameOver&& x >= this.btnArea.startX
      && x <= this.btnArea.endX
      && y >= this.btnArea.startY
      && y <= this.btnArea.endY) {
      callback({ message: 'restart' })
      //...
    }
  }

  renderGameOver(ctx, score) {
    ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300)

    ctx.fillStyle = "#ffffff"
    ctx.font    = "20px Arial"

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
      endX  : screenWidth / 2  + 50,
      endY  : screenHeight / 2 - 100 + 255
    }
  }
}

