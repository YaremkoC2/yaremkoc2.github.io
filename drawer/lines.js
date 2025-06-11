// Class to represent a point
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Class to represent LineSeg
class LineSeg {
    constructor(startPoint, endPoint, thickness, alpha, color) {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.thickness = thickness;
        this.alpha = alpha;
        this.color = color;
    }
}

// export the classes
export { Point, LineSeg };
