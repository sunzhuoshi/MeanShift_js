var assert = require('assert');
var MeanShift = require('./../javascript/MeanShift.js');

var ms = new MeanShift();

function GetClusterCount(clusterIndices) {
  var i;
  var index, maxIndex = 0;
  for (i=0; i<clusterIndices.length; ++i) {
	index = clusterIndices[i];
	if (index > maxIndex) {
		maxIndex = index;
	}  
  }
  return 1 + maxIndex;
}

var TestPoints = [[1, 1], [1.2, 1.2], [5, 5], [5.2, 5.2], [8, 8], [8.2, 8.2]];

describe('MeanShift', function() {
  describe('#cluster()', function() {
	it('6 cluster(s) with bandwidth(0.1)', function() {
	  assert.equal(6, GetClusterCount(ms.cluster(TestPoints, 0.1).clusterIndices));	  
	});
	
	it('3 cluster(s) with bandwidth(1)', function() {
	  assert.equal(3, GetClusterCount(ms.cluster(TestPoints, 1).clusterIndices));
    });
	
	it('1 cluster(s) with bandwidth(10)', function() {
	  assert.equal(1, GetClusterCount(ms.cluster(TestPoints, 10).clusterIndices));	  
	});
  });
  describe('#options', function() {
    it('minDistance', function() {
	  var iterationCount1, iterationCount2;
 	  var testKernelBandwidth = 1;
	  
      MeanShift.options.minDistance = 0.05;
	  assert.equal(3, GetClusterCount(
        ms.cluster(TestPoints, testKernelBandwidth, function(shiftPoints, iterationNumber) {iterationCount1 = iterationNumber}).clusterIndices
	  ));
	  
      MeanShift.options.minDistance = 0.001;
	  assert.equal(3, GetClusterCount(
		ms.cluster(TestPoints, testKernelBandwidth, function(shiftPoints, iterationNumber) {iterationCount2 = iterationNumber}).clusterIndices
	  ));	
	  assert.ok(iterationCount1 <= iterationCount2);
	});
	
   it('groupDistanceTolerance', function() {
	  var testKernelBandwidth = 1;	  
	  
      MeanShift.options.groupDistanceTolerance = 0.05;
	  assert.equal(3, GetClusterCount(ms.cluster(TestPoints, testKernelBandwidth).clusterIndices));
	  
	  MeanShift.options.groupDistanceTolerance = 5;
	  assert.equal(2, GetClusterCount(ms.cluster(TestPoints, testKernelBandwidth).clusterIndices));	  
    });	
  });
});