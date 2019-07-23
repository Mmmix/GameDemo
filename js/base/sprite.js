/**
 * 游戏基础的精灵类
 */
export default class Sprite {
  constructor(imgSrc = '', width=  0, height = 0, x = 0, y = 0) {
    this.img     = new Image()
    this.img.src = imgSrc

    this.width  = width
    this.height = height

    this.x = x
    this.y = y

    this.visible = true
  }

  /**
   * 将精灵图绘制在canvas上
   */
  drawToCanvas(ctx) {
    if ( !this.visible )
      return

    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }

  /**
   * 简单的碰撞检测定义：
   * 另一个精灵所在的矩形与本精灵所在的矩形重叠即可
   * @param{Sprite} sp: Sptite的实例
   */
  isCollideWith(sp) {
    let spX1 = sp.x
    let spY1 = sp.y
    let spX2 = sp.x + sp.width
    let spY2 = sp.y + sp.height

    if (!this.visible || !sp.visible)
      return false

    return !!(
      (
        (spX1 >= this.x && spX1 <= this.x + this.width)
        || (spX2 >= this.x && spX2 <= this.x + this.width)
        || (spX1 >= this.x && spX2 <= this.x + this.width)
        || (spX1 <= this.x && spX2 >= this.x + this.width)
      )
      && (
        (spY1 >= this.y && spY1 <= this.y + this.height)
        || (spY2 >= this.y && spY2 <= this.y + this.height)
        || (spY1 >= this.y && spY2 <= this.y + this.height)
        || (spY1 <= this.y && spY2 >= this.y + this.height)
      )
    )
  }
}
