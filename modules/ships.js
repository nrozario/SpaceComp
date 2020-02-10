class SpaceObject {
  basicDraw(colour) {
    const cx = this.rect.centerx();
    const cy = this.rect.centery();

    ctx.strokeStyle = colour;
    ctx.lineWidth = this.LINE_WIDTH;
    ctx.beginPath();

    ctx.moveTo(this.pointList[0].x + cx, this.pointList[0].y + cy);
    for (var point of this.pointList) {
      ctx.lineTo(point.x + cx, point.y + cy);
    }

    ctx.closePath();
    ctx.stroke();
  }

  move(dTime) {
    this.dx = Math.min(this.dx, this.SPEED);
    this.dx = Math.max(this.dx, -this.SPEED);

    this.dy = Math.min(this.dy, this.SPEED);
    this.dy = Math.max(this.dy, -this.SPEED);

    this.rect.x += this.dx * dTime;
    this.rect.y += this.dy * dTime;
  }
}

class Ship extends SpaceObject {
  LINE_WIDTH = 3
  SIZE = 10;
  SPEED = 100;

  constructor(x, y, destX, destY, // Visualizer
              health, owner, sourceID, sourceType, targetID) {
    super();
    this.setOwner(owner);

    this.rect = new Rect(0, 0, this.SIZE, this.SIZE);
    this.rect.setCenterx(x);
    this.rect.setCentery(y);

    this.targetPlanet(destX, destY, targetID)
    this.health = health

    this.sourceID = sourceID;
    this.sourceType = sourceType;
  }

  draw(ctx, colourMan) {
    this.colour = colourMan.getColour(this.owner);

    // Connecting these points traces out ship
    this.pointList = [];

    for (var angle of [0, 140, 220]) {
      var temp = rotatePoint(0, 0, 0, -this.SIZE,
                   // "angle" is in degrees
                   // this.rotation in radians and clockwise from vertical
                   angle * TAU / 360 + this.rotation + TAU / 4
                   );

      // Flip y coordinates so rotations are done in conventional math form but match screen
      temp.y *= -1;
      this.pointList.push(temp);
    }

    this.basicDraw(this.colour);

    // Draw health
    ctx.fillStyle = this.colour;
    ctx.font = "12pt BebasNeue-Regular";
    ctx.fillText(this.health, this.rect.centerx(),
                 this.rect.centery() - this.SIZE);
  }

  setOwner(owner) {
    // Same as planet
    this.owner = owner;
  }

  serialize() {
    var out = new Map();
    out.set("Health", this.health);
    out.set("ID", this.id);
    out.set("Owner", this.owner);

    out.set("Source ID", this.sourceID);
    out.set("Source Type", this.sourceType);
    out.set("Target", this.targetID);

    return out;
  }

  targetPlanet(destX, destY, targetID) {
    const deltaX = destX - this.rect.centerx();
    const deltaY = destY - this.rect.centery();

    this.rotation = Math.atan2(deltaY, deltaX);
    this.dx = this.SPEED * Math.cos(this.rotation);
    this.dy = this.SPEED * Math.sin(this.rotation);

    this.targetID = targetID;
  }
}

class Ships extends PlayerCollection {
  classType = Ship;
}
