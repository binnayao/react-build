/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 * @nolint
 * @preventMunge
 * @preserve-invariant-messages
 */

'use strict';

if (__DEV__) {
  (function() {
"use strict";

// ATTENTION
// When adding new symbols to this file,
// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
// The Symbol used to tag the ReactElement-like types. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var REACT_ELEMENT_TYPE = 0xeac7;
var REACT_PORTAL_TYPE = 0xeaca;
var REACT_FRAGMENT_TYPE = 0xeacb;
var REACT_STRICT_MODE_TYPE = 0xeacc;
var REACT_PROFILER_TYPE = 0xead2;
var REACT_PROVIDER_TYPE = 0xeacd;
var REACT_CONTEXT_TYPE = 0xeace;
var REACT_FORWARD_REF_TYPE = 0xead0;
var REACT_SUSPENSE_TYPE = 0xead1;
var REACT_SUSPENSE_LIST_TYPE = 0xead8;
var REACT_MEMO_TYPE = 0xead3;
var REACT_LAZY_TYPE = 0xead4;
var REACT_SCOPE_TYPE = 0xead7;
var REACT_OPAQUE_ID_TYPE = 0xeae0;
var REACT_DEBUG_TRACING_MODE_TYPE = 0xeae1;
var REACT_OFFSCREEN_TYPE = 0xeae2;
var REACT_LEGACY_HIDDEN_TYPE = 0xeae3;
var REACT_CACHE_TYPE = 0xeae4;

if (typeof Symbol === "function" && Symbol.for) {
  var symbolFor = Symbol.for;
  REACT_ELEMENT_TYPE = symbolFor("react.element");
  REACT_PORTAL_TYPE = symbolFor("react.portal");
  REACT_FRAGMENT_TYPE = symbolFor("react.fragment");
  REACT_STRICT_MODE_TYPE = symbolFor("react.strict_mode");
  REACT_PROFILER_TYPE = symbolFor("react.profiler");
  REACT_PROVIDER_TYPE = symbolFor("react.provider");
  REACT_CONTEXT_TYPE = symbolFor("react.context");
  REACT_FORWARD_REF_TYPE = symbolFor("react.forward_ref");
  REACT_SUSPENSE_TYPE = symbolFor("react.suspense");
  REACT_SUSPENSE_LIST_TYPE = symbolFor("react.suspense_list");
  REACT_MEMO_TYPE = symbolFor("react.memo");
  REACT_LAZY_TYPE = symbolFor("react.lazy");
  REACT_SCOPE_TYPE = symbolFor("react.scope");
  REACT_OPAQUE_ID_TYPE = symbolFor("react.opaque.id");
  REACT_DEBUG_TRACING_MODE_TYPE = symbolFor("react.debug_trace_mode");
  REACT_OFFSCREEN_TYPE = symbolFor("react.offscreen");
  REACT_LEGACY_HIDDEN_TYPE = symbolFor("react.legacy_hidden");
  REACT_CACHE_TYPE = symbolFor("react.cache");
}

// Re-export dynamic flags from the www version.
var dynamicFeatureFlags = require("ReactFeatureFlags");

var debugRenderPhaseSideEffectsForStrictMode =
    dynamicFeatureFlags.debugRenderPhaseSideEffectsForStrictMode,
  disableInputAttributeSyncing =
    dynamicFeatureFlags.disableInputAttributeSyncing,
  enableTrustedTypesIntegration =
    dynamicFeatureFlags.enableTrustedTypesIntegration,
  disableSchedulerTimeoutBasedOnReactExpirationTime =
    dynamicFeatureFlags.disableSchedulerTimeoutBasedOnReactExpirationTime,
  warnAboutSpreadingKeyToJSX = dynamicFeatureFlags.warnAboutSpreadingKeyToJSX,
  replayFailedUnitOfWorkWithInvokeGuardedCallback =
    dynamicFeatureFlags.replayFailedUnitOfWorkWithInvokeGuardedCallback,
  enableFilterEmptyStringAttributesDOM =
    dynamicFeatureFlags.enableFilterEmptyStringAttributesDOM,
  enableLegacyFBSupport = dynamicFeatureFlags.enableLegacyFBSupport,
  deferRenderPhaseUpdateToNextBatch =
    dynamicFeatureFlags.deferRenderPhaseUpdateToNextBatch,
  enableDebugTracing = dynamicFeatureFlags.enableDebugTracing,
  skipUnmountedBoundaries = dynamicFeatureFlags.skipUnmountedBoundaries,
  enableStrictEffects = dynamicFeatureFlags.enableStrictEffects,
  createRootStrictEffectsByDefault =
    dynamicFeatureFlags.createRootStrictEffectsByDefault,
  enableUseRefAccessWarning = dynamicFeatureFlags.enableUseRefAccessWarning,
  disableNativeComponentFrames =
    dynamicFeatureFlags.disableNativeComponentFrames,
  disableSchedulerTimeoutInWorkLoop =
    dynamicFeatureFlags.disableSchedulerTimeoutInWorkLoop,
  enableSyncMicroTasks = dynamicFeatureFlags.enableSyncMicroTasks,
  enableLazyContextPropagation =
    dynamicFeatureFlags.enableLazyContextPropagation; // On WWW, true is used for a new modern build.
var enableProfilerNestedUpdateScheduledHook =
  dynamicFeatureFlags.enableProfilerNestedUpdateScheduledHook; // Logs additional User Timing API marks for use with an experimental profiling tool.

var enableSchedulingProfiler = dynamicFeatureFlags.enableSchedulingProfiler; // Note: we'll want to remove this when we to userland implementation.

var REACT_MODULE_REFERENCE = 0;

if (typeof Symbol === "function") {
  REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
}

function isValidElementType(type) {
  if (typeof type === "string" || typeof type === "function") {
    return true;
  } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).

  if (
    type === REACT_FRAGMENT_TYPE ||
    type === REACT_PROFILER_TYPE ||
    type === REACT_DEBUG_TRACING_MODE_TYPE ||
    type === REACT_STRICT_MODE_TYPE ||
    type === REACT_SUSPENSE_TYPE ||
    type === REACT_SUSPENSE_LIST_TYPE ||
    type === REACT_LEGACY_HIDDEN_TYPE ||
    type === REACT_SCOPE_TYPE ||
    type === REACT_CACHE_TYPE
  ) {
    return true;
  }

  if (typeof type === "object" && type !== null) {
    if (
      type.$$typeof === REACT_LAZY_TYPE ||
      type.$$typeof === REACT_MEMO_TYPE ||
      type.$$typeof === REACT_PROVIDER_TYPE ||
      type.$$typeof === REACT_CONTEXT_TYPE ||
      type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      type.$$typeof === REACT_MODULE_REFERENCE ||
      type.getModuleId !== undefined
    ) {
      return true;
    }
  }

  return false;
}

function typeOf(object) {
  if (typeof object === "object" && object !== null) {
    var $$typeof = object.$$typeof;

    switch ($$typeof) {
      case REACT_ELEMENT_TYPE:
        var type = object.type;

        switch (type) {
          case REACT_FRAGMENT_TYPE:
          case REACT_PROFILER_TYPE:
          case REACT_STRICT_MODE_TYPE:
          case REACT_SUSPENSE_TYPE:
          case REACT_SUSPENSE_LIST_TYPE:
            return type;

          default:
            var $$typeofType = type && type.$$typeof;

            switch ($$typeofType) {
              case REACT_CONTEXT_TYPE:
              case REACT_FORWARD_REF_TYPE:
              case REACT_LAZY_TYPE:
              case REACT_MEMO_TYPE:
              case REACT_PROVIDER_TYPE:
                return $$typeofType;

              default:
                return $$typeof;
            }
        }

      case REACT_PORTAL_TYPE:
        return $$typeof;
    }
  }

  return undefined;
}
var ContextConsumer = REACT_CONTEXT_TYPE;
var ContextProvider = REACT_PROVIDER_TYPE;
var Element = REACT_ELEMENT_TYPE;
var ForwardRef = REACT_FORWARD_REF_TYPE;
var Fragment = REACT_FRAGMENT_TYPE;
var Lazy = REACT_LAZY_TYPE;
var Memo = REACT_MEMO_TYPE;
var Portal = REACT_PORTAL_TYPE;
var Profiler = REACT_PROFILER_TYPE;
var StrictMode = REACT_STRICT_MODE_TYPE;
var Suspense = REACT_SUSPENSE_TYPE;
var unstable_SuspenseList = REACT_SUSPENSE_LIST_TYPE;
var hasWarnedAboutDeprecatedIsAsyncMode = false;
var hasWarnedAboutDeprecatedIsConcurrentMode = false; // AsyncMode should be deprecated

function isAsyncMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsAsyncMode) {
      hasWarnedAboutDeprecatedIsAsyncMode = true; // Using console['warn'] to evade Babel and ESLint

      console["warn"](
        "The ReactIs.isAsyncMode() alias has been deprecated, " +
          "and will be removed in React 18+."
      );
    }
  }

  return false;
}
function isConcurrentMode(object) {
  {
    if (!hasWarnedAboutDeprecatedIsConcurrentMode) {
      hasWarnedAboutDeprecatedIsConcurrentMode = true; // Using console['warn'] to evade Babel and ESLint

      console["warn"](
        "The ReactIs.isConcurrentMode() alias has been deprecated, " +
          "and will be removed in React 18+."
      );
    }
  }

  return false;
}
function isContextConsumer(object) {
  return typeOf(object) === REACT_CONTEXT_TYPE;
}
function isContextProvider(object) {
  return typeOf(object) === REACT_PROVIDER_TYPE;
}
function isElement(object) {
  return (
    typeof object === "object" &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}
function isForwardRef(object) {
  return typeOf(object) === REACT_FORWARD_REF_TYPE;
}
function isFragment(object) {
  return typeOf(object) === REACT_FRAGMENT_TYPE;
}
function isLazy(object) {
  return typeOf(object) === REACT_LAZY_TYPE;
}
function isMemo(object) {
  return typeOf(object) === REACT_MEMO_TYPE;
}
function isPortal(object) {
  return typeOf(object) === REACT_PORTAL_TYPE;
}
function isProfiler(object) {
  return typeOf(object) === REACT_PROFILER_TYPE;
}
function isStrictMode(object) {
  return typeOf(object) === REACT_STRICT_MODE_TYPE;
}
function isSuspense(object) {
  return typeOf(object) === REACT_SUSPENSE_TYPE;
}
function unstable_isSuspenseList(object) {
  return typeOf(object) === REACT_SUSPENSE_LIST_TYPE;
}

exports.ContextConsumer = ContextConsumer;
exports.ContextProvider = ContextProvider;
exports.Element = Element;
exports.ForwardRef = ForwardRef;
exports.Fragment = Fragment;
exports.Lazy = Lazy;
exports.Memo = Memo;
exports.Portal = Portal;
exports.Profiler = Profiler;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.isAsyncMode = isAsyncMode;
exports.isConcurrentMode = isConcurrentMode;
exports.isContextConsumer = isContextConsumer;
exports.isContextProvider = isContextProvider;
exports.isElement = isElement;
exports.isForwardRef = isForwardRef;
exports.isFragment = isFragment;
exports.isLazy = isLazy;
exports.isMemo = isMemo;
exports.isPortal = isPortal;
exports.isProfiler = isProfiler;
exports.isStrictMode = isStrictMode;
exports.isSuspense = isSuspense;
exports.isValidElementType = isValidElementType;
exports.typeOf = typeOf;
exports.unstable_SuspenseList = unstable_SuspenseList;
exports.unstable_isSuspenseList = unstable_isSuspenseList;

  })();
}
