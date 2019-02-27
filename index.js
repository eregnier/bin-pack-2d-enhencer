var ShelfPack = require('@mapbox/shelf-pack').default

export default class Optimizer {
  constructor (pieces, width, height) {
    this.pieces = pieces
    this.width = width
    this.height = height
  }
  optimize () {
    this.pieces = this.preprocess(this.pieces)
    this.height = this.computeHeight(this.pieces)
    let hasChange = true
    while (hasChange) {
      const orderedPieces = this.rankPieces()
      hasChange = this.tryOptimize(orderedPieces)
    }
    return this.pieces
  }
  preprocess (pieces) {
    const packer = new ShelfPack(this.width, this.height)
    const optimizedPieces = packer.pack(pieces.map(p => {
      return {
        w: parseInt(p.w),
        h: parseInt(p.h)
      }
    }))
    packer.clear()
    return optimizedPieces
  }
  computeHeight (pieces) {
    return Math.max(...pieces.map(p => p.y + p.h))
  }
  getIgnorePoints (pieces) {
    const cache = {}
    for (const piece of pieces) {
      const rectangle = this.toCompareRect(piece)
      for (let x=rectangle.left; x< rectangle.right; x++) {
        for (let y=rectangle.top; y< rectangle.bottom; y++) {
          cache[x+'-'+y] = true
        }
      }
    }
    return cache
  }
  tryOptimize (orderedPieces) {
    const ignorePoints = this.getIgnorePoints(orderedPieces)
    for (const piece of orderedPieces) {
      let maxWidth = this.width - piece.w + 1
      let maxHeight = this.height - piece.h + 1
      for (let y=0; y< maxHeight; y++) {
        for (let x=0; x< maxWidth; x++) {
          const ignoreCurrentPiece = x>= piece.x && x <= piece.x + piece.w && y >= piece.y && y <= piece.y + piece.h
          if (!ignorePoints[x + '-' + y] || ignoreCurrentPiece) {
            const testPiece = {
              x: x,
              y: y,
              w: piece.w,
              h: piece.h
            }
            const hasBetterScore = y < piece.y
            const respectConstraints = x + piece.w <= this.width
            const hasSpace = !this.intersects(testPiece, this.pieces, piece)
            if(hasSpace && hasBetterScore && respectConstraints) {
              piece.x = x
              piece.y = y
              return true
            }
          }
        }
      }
    }
    return false
  }
  rankPieces () {
    return this.pieces.sort((a, b) => {
      return -((a.w * a.h) - (b.w * b.h))
    })
  }
  toCompareRect (rect) {
    return {
      left : rect.x,
      right : rect.x + rect.w,
      top : rect.y,
      bottom : rect.y + rect.h
    }
  }
  intersectRect(r1, r2) {
    return !(
      r2.left >= r1.right ||
      r2.right <= r1.left ||
      r2.top >= r1.bottom ||
      r2.bottom <= r1.top
    )
  }
  intersects (p, pieces, ignorePiece) {
    for (const piece of pieces) {
      const ignore = ignorePiece.x === piece.x && ignorePiece.y === piece.y && ignorePiece.w === piece.w && ignorePiece.h === piece.h
      if(!ignore && this.intersectRect(
        this.toCompareRect(p),
        this.toCompareRect(piece)
      )) {
        return true
      }
    }
    return false
  }
}
