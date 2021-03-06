/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 * @nolint
 * @preventMunge
 * @generated
 */

"use strict";
var requestHostCallback, requestHostTimeout, cancelHostTimeout, requestPaint;
if ("object" === typeof performance && "function" === typeof performance.now) {
  var localPerformance = performance;
  exports.unstable_now = function() {
    return localPerformance.now();
  };
} else {
  var localDate = Date,
    initialTime = localDate.now();
  exports.unstable_now = function() {
    return localDate.now() - initialTime;
  };
}
if ("undefined" === typeof window || "function" !== typeof MessageChannel) {
  var _callback = null,
    _timeoutID = null,
    _flushCallback = function() {
      if (null !== _callback)
        try {
          var currentTime = exports.unstable_now();
          _callback(!0, currentTime);
          _callback = null;
        } catch (e) {
          throw (setTimeout(_flushCallback, 0), e);
        }
    };
  requestHostCallback = function(cb) {
    null !== _callback
      ? setTimeout(requestHostCallback, 0, cb)
      : ((_callback = cb), setTimeout(_flushCallback, 0));
  };
  requestHostTimeout = function(cb, ms) {
    _timeoutID = setTimeout(cb, ms);
  };
  cancelHostTimeout = function() {
    clearTimeout(_timeoutID);
  };
  exports.unstable_shouldYield = function() {
    return !1;
  };
  requestPaint = exports.unstable_forceFrameRate = function() {};
} else {
  var setTimeout$0 = window.setTimeout,
    clearTimeout$1 = window.clearTimeout;
  if ("undefined" !== typeof console) {
    var cancelAnimationFrame = window.cancelAnimationFrame;
    "function" !== typeof window.requestAnimationFrame &&
      console.error(
        "This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"
      );
    "function" !== typeof cancelAnimationFrame &&
      console.error(
        "This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"
      );
  }
  var isMessageLoopRunning = !1,
    scheduledHostCallback = null,
    taskTimeoutID = -1,
    yieldInterval = 5,
    deadline = 0;
  exports.unstable_shouldYield = function() {
    return exports.unstable_now() >= deadline;
  };
  requestPaint = function() {};
  exports.unstable_forceFrameRate = function(fps) {
    0 > fps || 125 < fps
      ? console.error(
          "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
        )
      : (yieldInterval = 0 < fps ? Math.floor(1e3 / fps) : 5);
  };
  var channel = new MessageChannel(),
    port = channel.port2;
  channel.port1.onmessage = function() {
    if (null !== scheduledHostCallback) {
      var currentTime = exports.unstable_now();
      deadline = currentTime + yieldInterval;
      try {
        scheduledHostCallback(!0, currentTime)
          ? port.postMessage(null)
          : ((isMessageLoopRunning = !1), (scheduledHostCallback = null));
      } catch (error) {
        throw (port.postMessage(null), error);
      }
    } else isMessageLoopRunning = !1;
  };
  requestHostCallback = function(callback) {
    scheduledHostCallback = callback;
    isMessageLoopRunning ||
      ((isMessageLoopRunning = !0), port.postMessage(null));
  };
  requestHostTimeout = function(callback, ms) {
    taskTimeoutID = setTimeout$0(function() {
      callback(exports.unstable_now());
    }, ms);
  };
  cancelHostTimeout = function() {
    clearTimeout$1(taskTimeoutID);
    taskTimeoutID = -1;
  };
}
function push(heap, node) {
  var index = heap.length;
  heap.push(node);
  a: for (;;) {
    var parentIndex = (index - 1) >>> 1,
      parent = heap[parentIndex];
    if (void 0 !== parent && 0 < compare(parent, node))
      (heap[parentIndex] = node), (heap[index] = parent), (index = parentIndex);
    else break a;
  }
}
function peek(heap) {
  heap = heap[0];
  return void 0 === heap ? null : heap;
}
function pop(heap) {
  var first = heap[0];
  if (void 0 !== first) {
    var last = heap.pop();
    if (last !== first) {
      heap[0] = last;
      a: for (var index = 0, length = heap.length; index < length; ) {
        var leftIndex = 2 * (index + 1) - 1,
          left = heap[leftIndex],
          rightIndex = leftIndex + 1,
          right = heap[rightIndex];
        if (void 0 !== left && 0 > compare(left, last))
          void 0 !== right && 0 > compare(right, left)
            ? ((heap[index] = right),
              (heap[rightIndex] = last),
              (index = rightIndex))
            : ((heap[index] = left),
              (heap[leftIndex] = last),
              (index = leftIndex));
        else if (void 0 !== right && 0 > compare(right, last))
          (heap[index] = right),
            (heap[rightIndex] = last),
            (index = rightIndex);
        else break a;
      }
    }
    return first;
  }
  return null;
}
function compare(a, b) {
  var diff = a.sortIndex - b.sortIndex;
  return 0 !== diff ? diff : a.id - b.id;
}
var taskQueue = [],
  timerQueue = [],
  taskIdCounter = 1,
  currentTask = null,
  currentPriorityLevel = 3,
  isPerformingWork = !1,
  isHostCallbackScheduled = !1,
  isHostTimeoutScheduled = !1;
function advanceTimers(currentTime) {
  for (var timer = peek(timerQueue); null !== timer; ) {
    if (null === timer.callback) pop(timerQueue);
    else if (timer.startTime <= currentTime)
      pop(timerQueue),
        (timer.sortIndex = timer.expirationTime),
        push(taskQueue, timer);
    else break;
    timer = peek(timerQueue);
  }
}
function handleTimeout(currentTime) {
  isHostTimeoutScheduled = !1;
  advanceTimers(currentTime);
  if (!isHostCallbackScheduled)
    if (null !== peek(taskQueue))
      (isHostCallbackScheduled = !0), requestHostCallback(flushWork);
    else {
      var firstTimer = peek(timerQueue);
      null !== firstTimer &&
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }
}
function flushWork(hasTimeRemaining, initialTime) {
  isHostCallbackScheduled = !1;
  isHostTimeoutScheduled &&
    ((isHostTimeoutScheduled = !1), cancelHostTimeout());
  isPerformingWork = !0;
  var previousPriorityLevel = currentPriorityLevel;
  try {
    advanceTimers(initialTime);
    for (
      currentTask = peek(taskQueue);
      null !== currentTask &&
      (!(currentTask.expirationTime > initialTime) ||
        (hasTimeRemaining && !exports.unstable_shouldYield()));

    ) {
      var callback = currentTask.callback;
      if ("function" === typeof callback) {
        currentTask.callback = null;
        currentPriorityLevel = currentTask.priorityLevel;
        var continuationCallback = callback(
          currentTask.expirationTime <= initialTime
        );
        initialTime = exports.unstable_now();
        "function" === typeof continuationCallback
          ? (currentTask.callback = continuationCallback)
          : currentTask === peek(taskQueue) && pop(taskQueue);
        advanceTimers(initialTime);
      } else pop(taskQueue);
      currentTask = peek(taskQueue);
    }
    if (null !== currentTask) var JSCompiler_inline_result = !0;
    else {
      var firstTimer = peek(timerQueue);
      null !== firstTimer &&
        requestHostTimeout(handleTimeout, firstTimer.startTime - initialTime);
      JSCompiler_inline_result = !1;
    }
    return JSCompiler_inline_result;
  } finally {
    (currentTask = null),
      (currentPriorityLevel = previousPriorityLevel),
      (isPerformingWork = !1);
  }
}
var unstable_requestPaint = requestPaint;
exports.unstable_IdlePriority = 5;
exports.unstable_ImmediatePriority = 1;
exports.unstable_LowPriority = 4;
exports.unstable_NormalPriority = 3;
exports.unstable_Profiling = null;
exports.unstable_UserBlockingPriority = 2;
exports.unstable_cancelCallback = function(task) {
  task.callback = null;
};
exports.unstable_continueExecution = function() {
  isHostCallbackScheduled ||
    isPerformingWork ||
    ((isHostCallbackScheduled = !0), requestHostCallback(flushWork));
};
exports.unstable_getCurrentPriorityLevel = function() {
  return currentPriorityLevel;
};
exports.unstable_getFirstCallbackNode = function() {
  return peek(taskQueue);
};
exports.unstable_next = function(eventHandler) {
  switch (currentPriorityLevel) {
    case 1:
    case 2:
    case 3:
      var priorityLevel = 3;
      break;
    default:
      priorityLevel = currentPriorityLevel;
  }
  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;
  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
};
exports.unstable_pauseExecution = function() {};
exports.unstable_requestPaint = unstable_requestPaint;
exports.unstable_runWithPriority = function(priorityLevel, eventHandler) {
  switch (priorityLevel) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      break;
    default:
      priorityLevel = 3;
  }
  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;
  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
};
exports.unstable_scheduleCallback = function(priorityLevel, callback, options) {
  var currentTime = exports.unstable_now();
  "object" === typeof options && null !== options
    ? ((options = options.delay),
      (options =
        "number" === typeof options && 0 < options
          ? currentTime + options
          : currentTime))
    : (options = currentTime);
  switch (priorityLevel) {
    case 1:
      var timeout = -1;
      break;
    case 2:
      timeout = 250;
      break;
    case 5:
      timeout = 1073741823;
      break;
    case 4:
      timeout = 1e4;
      break;
    default:
      timeout = 5e3;
  }
  timeout = options + timeout;
  priorityLevel = {
    id: taskIdCounter++,
    callback: callback,
    priorityLevel: priorityLevel,
    startTime: options,
    expirationTime: timeout,
    sortIndex: -1
  };
  options > currentTime
    ? ((priorityLevel.sortIndex = options),
      push(timerQueue, priorityLevel),
      null === peek(taskQueue) &&
        priorityLevel === peek(timerQueue) &&
        (isHostTimeoutScheduled
          ? cancelHostTimeout()
          : (isHostTimeoutScheduled = !0),
        requestHostTimeout(handleTimeout, options - currentTime)))
    : ((priorityLevel.sortIndex = timeout),
      push(taskQueue, priorityLevel),
      isHostCallbackScheduled ||
        isPerformingWork ||
        ((isHostCallbackScheduled = !0), requestHostCallback(flushWork)));
  return priorityLevel;
};
exports.unstable_wrapCallback = function(callback) {
  var parentPriorityLevel = currentPriorityLevel;
  return function() {
    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = parentPriorityLevel;
    try {
      return callback.apply(this, arguments);
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  };
};
