function EuclideanDistance(point1, point2) {
    var sum = 0.0;
	var i;
    for (i=0; i<point1.length; i++) {
        var temp = point1[i] - point2[i];
        sum += temp * temp;
    }
    return Math.sqrt(sum);
}

class MeanShift {
	// TODO: fix closure compiler warning 'attempted re-definition of type MeanShift'
	constructor() {
		// gaussian kernel by default
		this.kernelFunc = function(distance, kernelBandwidth) {
			return Math.exp(-1.0 / 2.0 * (distance * distance) / (kernelBandwidth * kernelBandwidth));
		}
		this.iterationCallback = null;
	}
    cluster(points, kernelBandwidth, iterationCallback) {
        var shiftPoints = points.slice();
        var clusterIndices = [];
		this.iterationCallback = iterationCallback;

        var maxMinDistance = 1;
        var iterationNumber = 0;
        var stillShifting = new Array(shiftPoints.length);
        stillShifting.fill(true);

        while (maxMinDistance > MeanShift.options.minDistance) {
            maxMinDistance = 0;
            iterationNumber += 1;

            for (var i = 0; i < shiftPoints.length; ++i) {
                if (!stillShifting[i]) {
                    continue;
                }
                var newPoint = shiftPoints[i];
                var newPointStart = newPoint;
                newPoint = this._shiftPoint(newPoint, points, kernelBandwidth);
                var distance = EuclideanDistance(newPoint, newPointStart);
                if (distance > maxMinDistance) {
                    maxMinDistance = distance;
                }
                if (distance < MeanShift.options.minDistance) {
                    stillShifting[i] = false;
                }
                shiftPoints[i] = newPoint;
            }
            if (this.iterationCallback) {
                this.iterationCallback(shiftPoints, iterationNumber);
            }
        }
        return {
            originalPoints: points,
            shiftedPoints: shiftPoints,
            clusterIndices: this._groupPoints(shiftPoints)
        }
    }
    setKernetFunc(kernelFunc) {
        this.kernelFunc = kernelFunc;
    }
	// shift one point 
    _shiftPoint(point, points, kernelBandwidth) {
		var shiftedPoint = point.slice();
		shiftedPoint.fill(0);
		var totalWeight = 0;
		var i;
		for (i=0; i<points.length; i++) {
			var tempPoint = points[i];
			var distance = EuclideanDistance(point, tempPoint);
			var weight = this.kernelFunc(distance, kernelBandwidth);
			var j;
			for (j=0; j<shiftedPoint.length; j++) {
				shiftedPoint[j] += tempPoint[j] * weight;
			}
			totalWeight += weight;
		}
		for (i=0; i<shiftedPoint.length; i++) {
			shiftedPoint[i] /= totalWeight;
		}
		return shiftedPoint;
    }
    _groupPoints(points) {
		var groupAssigment = [];
		var groupIndex = 0;
		var groups = [];
		var i;
		
		for (i=0; i<points.length; ++i) {
			var point = points[i];
			var nearestGroupIndex = this._findNearestGroup(point, groups);
			if (null == nearestGroupIndex) {
				groupAssigment[i] = groupIndex;
				groups[groupIndex] = [point];
				groupIndex ++;				
			}
			else {
				groupAssigment[i] = nearestGroupIndex;
				groups[nearestGroupIndex].push(point);
			}
		}
		return groupAssigment;
    }
	_findNearestGroup(point, groups) {
		var i;
		var nearestGroupIndex = null;
		for (i=0; i<groups.length; ++i) {
			var distance = this._distanceToGroup(point, groups[i]);
			if (distance < MeanShift.options.groupDistanceTolerance) {
				nearestGroupIndex = i;
				break;
			}
		}
		return nearestGroupIndex;
	}
	_distanceToGroup(point, group) {
		var minDistance = Number.MAX_VALUE;
		var i;
		
		for (i=0; i<group.length; ++i) {
			var distance = EuclideanDistance(point, group[i]);
			if (distance < minDistance) {
				minDistance = distance;
			}
		}
		return minDistance;
	}
};

MeanShift.options = {
	minDistance: 0.001,
	groupDistanceTolerance: 0.1
};

module.exports = MeanShift;