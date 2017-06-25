/**
 * @fileoverview meanshift_js-externs
 * @externs
 */

/**
 * This is a anonymous object type used as return value
 */
var __ClusterResult__ = {
	'originalPoints': [],
    'shiftedPoints': [],
    'clusterIndices': []
}

class MeanShift {
	cluster(points, kernelBandwidth, iterationCallback) {}
}

/**
 * @type {Object}
 */
MeanShift.options = {
	'minDistance': {},
	'groupDistanceTolerance': {}
};
