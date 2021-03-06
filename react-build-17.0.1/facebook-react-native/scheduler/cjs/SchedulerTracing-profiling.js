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
var interactionIDCounter = 0,
  threadIDCounter = 0;
exports.__interactionsRef = null;
exports.__subscriberRef = null;
exports.__interactionsRef = { current: new Set() };
exports.__subscriberRef = { current: null };
var subscribers = null;
subscribers = new Set();
function onInteractionTraced(interaction) {
  var didCatchError = !1,
    caughtError = null;
  subscribers.forEach(function(subscriber) {
    try {
      subscriber.onInteractionTraced(interaction);
    } catch (error) {
      didCatchError || ((didCatchError = !0), (caughtError = error));
    }
  });
  if (didCatchError) throw caughtError;
}
function onInteractionScheduledWorkCompleted(interaction) {
  var didCatchError = !1,
    caughtError = null;
  subscribers.forEach(function(subscriber) {
    try {
      subscriber.onInteractionScheduledWorkCompleted(interaction);
    } catch (error) {
      didCatchError || ((didCatchError = !0), (caughtError = error));
    }
  });
  if (didCatchError) throw caughtError;
}
function onWorkScheduled(interactions, threadID) {
  var didCatchError = !1,
    caughtError = null;
  subscribers.forEach(function(subscriber) {
    try {
      subscriber.onWorkScheduled(interactions, threadID);
    } catch (error) {
      didCatchError || ((didCatchError = !0), (caughtError = error));
    }
  });
  if (didCatchError) throw caughtError;
}
function onWorkStarted(interactions, threadID) {
  var didCatchError = !1,
    caughtError = null;
  subscribers.forEach(function(subscriber) {
    try {
      subscriber.onWorkStarted(interactions, threadID);
    } catch (error) {
      didCatchError || ((didCatchError = !0), (caughtError = error));
    }
  });
  if (didCatchError) throw caughtError;
}
function onWorkStopped(interactions, threadID) {
  var didCatchError = !1,
    caughtError = null;
  subscribers.forEach(function(subscriber) {
    try {
      subscriber.onWorkStopped(interactions, threadID);
    } catch (error) {
      didCatchError || ((didCatchError = !0), (caughtError = error));
    }
  });
  if (didCatchError) throw caughtError;
}
function onWorkCanceled(interactions, threadID) {
  var didCatchError = !1,
    caughtError = null;
  subscribers.forEach(function(subscriber) {
    try {
      subscriber.onWorkCanceled(interactions, threadID);
    } catch (error) {
      didCatchError || ((didCatchError = !0), (caughtError = error));
    }
  });
  if (didCatchError) throw caughtError;
}
exports.unstable_clear = function(callback) {
  var prevInteractions = exports.__interactionsRef.current;
  exports.__interactionsRef.current = new Set();
  try {
    return callback();
  } finally {
    exports.__interactionsRef.current = prevInteractions;
  }
};
exports.unstable_getCurrent = function() {
  return exports.__interactionsRef.current;
};
exports.unstable_getThreadID = function() {
  return ++threadIDCounter;
};
exports.unstable_subscribe = function(subscriber) {
  subscribers.add(subscriber);
  1 === subscribers.size &&
    (exports.__subscriberRef.current = {
      onInteractionScheduledWorkCompleted: onInteractionScheduledWorkCompleted,
      onInteractionTraced: onInteractionTraced,
      onWorkCanceled: onWorkCanceled,
      onWorkScheduled: onWorkScheduled,
      onWorkStarted: onWorkStarted,
      onWorkStopped: onWorkStopped
    });
};
exports.unstable_trace = function(name, timestamp, callback) {
  var threadID =
      3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : 0,
    interaction = {
      __count: 1,
      id: interactionIDCounter++,
      name: name,
      timestamp: timestamp
    },
    prevInteractions = exports.__interactionsRef.current,
    interactions = new Set(prevInteractions);
  interactions.add(interaction);
  exports.__interactionsRef.current = interactions;
  var subscriber = exports.__subscriberRef.current;
  try {
    if (null !== subscriber) subscriber.onInteractionTraced(interaction);
  } finally {
    try {
      if (null !== subscriber) subscriber.onWorkStarted(interactions, threadID);
    } finally {
      try {
        var returnValue = callback();
      } finally {
        exports.__interactionsRef.current = prevInteractions;
        try {
          if (null !== subscriber)
            subscriber.onWorkStopped(interactions, threadID);
        } finally {
          if (
            (interaction.__count--,
            null !== subscriber && 0 === interaction.__count)
          )
            subscriber.onInteractionScheduledWorkCompleted(interaction);
        }
      }
    }
  }
  return returnValue;
};
exports.unstable_unsubscribe = function(subscriber) {
  subscribers.delete(subscriber);
  0 === subscribers.size && (exports.__subscriberRef.current = null);
};
exports.unstable_wrap = function(callback) {
  function wrapped() {
    var prevInteractions = exports.__interactionsRef.current;
    exports.__interactionsRef.current = wrappedInteractions;
    subscriber = exports.__subscriberRef.current;
    try {
      try {
        if (null !== subscriber)
          subscriber.onWorkStarted(wrappedInteractions, threadID);
      } finally {
        try {
          var returnValue = callback.apply(void 0, arguments);
        } finally {
          if (
            ((exports.__interactionsRef.current = prevInteractions),
            null !== subscriber)
          )
            subscriber.onWorkStopped(wrappedInteractions, threadID);
        }
      }
      return returnValue;
    } finally {
      hasRun ||
        ((hasRun = !0),
        wrappedInteractions.forEach(function(interaction) {
          interaction.__count--;
          if (null !== subscriber && 0 === interaction.__count)
            subscriber.onInteractionScheduledWorkCompleted(interaction);
        }));
    }
  }
  var threadID =
      1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0,
    wrappedInteractions = exports.__interactionsRef.current,
    subscriber = exports.__subscriberRef.current;
  if (null !== subscriber)
    subscriber.onWorkScheduled(wrappedInteractions, threadID);
  wrappedInteractions.forEach(function(interaction) {
    interaction.__count++;
  });
  var hasRun = !1;
  wrapped.cancel = function() {
    subscriber = exports.__subscriberRef.current;
    try {
      if (null !== subscriber)
        subscriber.onWorkCanceled(wrappedInteractions, threadID);
    } finally {
      wrappedInteractions.forEach(function(interaction) {
        interaction.__count--;
        if (subscriber && 0 === interaction.__count)
          subscriber.onInteractionScheduledWorkCompleted(interaction);
      });
    }
  };
  return wrapped;
};
