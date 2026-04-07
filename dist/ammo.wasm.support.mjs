// This is ammo.js, a port of Bullet Physics to JavaScript. zlib licensed.
// include: shell.js
// include: minimum_runtime_check.js
(function() {
  // "30.0.0" -> 300000
  function humanReadableVersionToPacked(str) {
    str = str.split('-')[0]; // Remove any trailing part from e.g. "12.53.3-alpha"
    var vers = str.split('.').slice(0, 3);
    while(vers.length < 3) vers.push('00');
    vers = vers.map((n, i, arr) => n.padStart(2, '0'));
    return vers.join('');
  }
  // 300000 -> "30.0.0"
  var packedVersionToHumanReadable = n => [n / 10000 | 0, (n / 100 | 0) % 100, n % 100].join('.');

  var TARGET_NOT_SUPPORTED = 2147483647;

  // Note: We use a typeof check here instead of optional chaining using
  // globalThis because older browsers might not have globalThis defined.
  var currentNodeVersion = typeof process !== 'undefined' && process.versions?.node ? humanReadableVersionToPacked(process.versions.node) : TARGET_NOT_SUPPORTED;
  if (currentNodeVersion < TARGET_NOT_SUPPORTED) {
    throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');
  }
  if (currentNodeVersion < 2147483647) {
    throw new Error(`This emscripten-generated code requires node v${ packedVersionToHumanReadable(2147483647) } (detected v${packedVersionToHumanReadable(currentNodeVersion)})`);
  }

  var userAgent = typeof navigator !== 'undefined' && navigator.userAgent;
  if (!userAgent) {
    return;
  }

  var currentSafariVersion = userAgent.includes("Safari/") && !userAgent.includes("Chrome/") && userAgent.match(/Version\/(\d+\.?\d*\.?\d*)/) ? humanReadableVersionToPacked(userAgent.match(/Version\/(\d+\.?\d*\.?\d*)/)[1]) : TARGET_NOT_SUPPORTED;
  if (currentSafariVersion < 150000) {
    throw new Error(`This emscripten-generated code requires Safari v${ packedVersionToHumanReadable(150000) } (detected v${currentSafariVersion})`);
  }

  var currentFirefoxVersion = userAgent.match(/Firefox\/(\d+(?:\.\d+)?)/) ? parseFloat(userAgent.match(/Firefox\/(\d+(?:\.\d+)?)/)[1]) : TARGET_NOT_SUPPORTED;
  if (currentFirefoxVersion < 79) {
    throw new Error(`This emscripten-generated code requires Firefox v79 (detected v${currentFirefoxVersion})`);
  }

  var currentChromeVersion = userAgent.match(/Chrome\/(\d+(?:\.\d+)?)/) ? parseFloat(userAgent.match(/Chrome\/(\d+(?:\.\d+)?)/)[1]) : TARGET_NOT_SUPPORTED;
  if (currentChromeVersion < 85) {
    throw new Error(`This emscripten-generated code requires Chrome v85 (detected v${currentChromeVersion})`);
  }
})();

// end include: minimum_runtime_check.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = {};

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = !!globalThis.window;
var ENVIRONMENT_IS_WORKER = !!globalThis.WorkerGlobalScope;
// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = globalThis.process?.versions?.node && globalThis.process?.type != 'renderer';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)


var arguments_ = [];
var thisProgram = './this.program';
var quit_ = (status, toThrow) => {
  throw toThrow;
};

var _scriptName = import.meta.url;

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  dbg('locateFile:', path, 'scriptDirectory:', scriptDirectory);
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var readAsync, readBinary;

if (ENVIRONMENT_IS_SHELL) {

} else

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  try {
    scriptDirectory = new URL('.', _scriptName).href; // includes trailing slash
  } catch {
    // Must be a `blob:` or `data:` URL (e.g. `blob:http://site.com/etc/etc`), we cannot
    // infer anything from them.
  }

  if (!(globalThis.window || globalThis.WorkerGlobalScope)) throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  {
// include: web_or_worker_shell_read.js
readAsync = async (url) => {
    assert(!isFileURI(url), "readAsync does not work with file:// URLs");
    var response = await fetch(url, { credentials: 'same-origin' });
    if (response.ok) {
      return response.arrayBuffer();
    }
    throw new Error(response.status + ' : ' + response.url);
  };
// end include: web_or_worker_shell_read.js
  }
} else
{
  throw new Error('environment detection error');
}

var out = console.log.bind(console);
var err = console.error.bind(console);

var IDBFS = 'IDBFS is no longer included by default; build with -lidbfs.js';
var PROXYFS = 'PROXYFS is no longer included by default; build with -lproxyfs.js';
var WORKERFS = 'WORKERFS is no longer included by default; build with -lworkerfs.js';
var FETCHFS = 'FETCHFS is no longer included by default; build with -lfetchfs.js';
var ICASEFS = 'ICASEFS is no longer included by default; build with -licasefs.js';
var JSFILEFS = 'JSFILEFS is no longer included by default; build with -ljsfilefs.js';
var OPFS = 'OPFS is no longer included by default; build with -lopfs.js';

var NODEFS = 'NODEFS is no longer included by default; build with -lnodefs.js';

// perform assertions in shell.js after we set up out() and err(), as otherwise
// if an assertion fails it cannot print the message

assert(!ENVIRONMENT_IS_WORKER, 'worker environment detected but not enabled at build time.  Add `worker` to `-sENVIRONMENT` to enable.');

assert(!ENVIRONMENT_IS_NODE, 'node environment detected but not enabled at build time.  Add `node` to `-sENVIRONMENT` to enable.');

assert(!ENVIRONMENT_IS_SHELL, 'shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.');

// end include: shell.js

// include: preamble.js
// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

var wasmBinary;

if (!globalThis.WebAssembly) {
  err('no native wasm support detected');
}

// Wasm globals

//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

// In STRICT mode, we only define assert() when ASSERTIONS is set.  i.e. we
// don't define it at all in release modes.  This matches the behaviour of
// MINIMAL_RUNTIME.
// TODO(sbc): Make this the default even without STRICT enabled.
/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed' + (text ? ': ' + text : ''));
  }
}

// We used to include malloc/free by default in the past. Show a helpful error in
// builds with assertions.
function _free() {
  // Show a helpful error since we used to include free by default in the past.
  abort('free() called but not included in the build - add `_free` to EXPORTED_FUNCTIONS');
}

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */
var isFileURI = (filename) => filename.startsWith('file://');

// include: runtime_common.js
// include: runtime_stack_check.js
// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  var max = _emscripten_stack_get_end();
  dbg(`writeStackCookie: ${ptrToString(max)}`);
  assert((max & 3) == 0);
  // If the stack ends at address zero we write our cookies 4 bytes into the
  // stack.  This prevents interference with SAFE_HEAP and ASAN which also
  // monitor writes to address zero.
  if (max == 0) {
    max += 4;
  }
  // The stack grow downwards towards _emscripten_stack_get_end.
  // We write cookies to the final two words in the stack and detect if they are
  // ever overwritten.
  HEAPU32[((max)>>2)] = 0x02135467;
  HEAPU32[(((max)+(4))>>2)] = 0x89BACDFE;
  // Also test the global address 0 for integrity.
  HEAPU32[((0)>>2)] = 1668509029;
}

function checkStackCookie() {
  if (ABORT) return;
  var max = _emscripten_stack_get_end();
  // See writeStackCookie().
  if (max == 0) {
    max += 4;
  }
  var cookie1 = HEAPU32[((max)>>2)];
  var cookie2 = HEAPU32[(((max)+(4))>>2)];
  if (cookie1 != 0x02135467 || cookie2 != 0x89BACDFE) {
    abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`);
  }
  // Also test the global address 0 for integrity.
  if (HEAPU32[((0)>>2)] != 0x63736d65 /* 'emsc' */) {
    abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
  }
}
// end include: runtime_stack_check.js
// include: runtime_exceptions.js
// end include: runtime_exceptions.js
// include: runtime_debug.js
var runtimeDebug = true; // Switch to false at runtime to disable logging at the right times

// Used by XXXXX_DEBUG settings to output debug messages.
function dbg(...args) {
  if (!runtimeDebug && typeof runtimeDebug != 'undefined') return;
  // TODO(sbc): Make this configurable somehow.  Its not always convenient for
  // logging to show up as warnings.
  console.warn(...args);
}

// Endianness check
(() => {
  var h16 = new Int16Array(1);
  var h8 = new Int8Array(h16.buffer);
  h16[0] = 0x6373;
  if (h8[0] !== 0x73 || h8[1] !== 0x63) abort('Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)');
})();

function consumedModuleProp(prop) {
  if (!Object.getOwnPropertyDescriptor(Module, prop)) {
    Object.defineProperty(Module, prop, {
      configurable: true,
      set() {
        abort(`Attempt to set \`Module.${prop}\` after it has already been processed.  This can happen, for example, when code is injected via '--post-js' rather than '--pre-js'`);

      }
    });
  }
}

function makeInvalidEarlyAccess(name) {
  return () => assert(false, `call to '${name}' via reference taken before Wasm module initialization`);

}

function ignoredModuleProp(prop) {
  if (Object.getOwnPropertyDescriptor(Module, prop)) {
    abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
  }
}

// forcing the filesystem exports a few things by default
function isExportedByForceFilesystem(name) {
  return name === 'FS_createPath' ||
         name === 'FS_createDataFile' ||
         name === 'FS_createPreloadedFile' ||
         name === 'FS_preloadFile' ||
         name === 'FS_unlink' ||
         name === 'addRunDependency' ||
         // The old FS has some functionality that WasmFS lacks.
         name === 'FS_createLazyFile' ||
         name === 'FS_createDevice' ||
         name === 'removeRunDependency';
}

function missingLibrarySymbol(sym) {

  // Any symbol that is not included from the JS library is also (by definition)
  // not exported on the Module object.
  unexportedRuntimeSymbol(sym);
}

function unexportedRuntimeSymbol(sym) {
  if (!Object.getOwnPropertyDescriptor(Module, sym)) {
    Object.defineProperty(Module, sym, {
      configurable: true,
      get() {
        var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
        if (isExportedByForceFilesystem(sym)) {
          msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
        }
        abort(msg);
      },
    });
  }
}

var printObjectList = [];

function prettyPrint(arg) {
  if (typeof arg == 'undefined') return 'undefined';
  if (typeof arg == 'boolean') arg = arg + 0;
  if (!arg) return arg;
  var index = printObjectList.indexOf(arg);
  if (index >= 0) return '<' + arg + '|' + index + '>';
  if (arg.toString() == '[object HTMLImageElement]') {
    return arg + '\n\n';
  }
  if (arg.byteLength) {
    return '{' + Array.prototype.slice.call(arg, 0, Math.min(arg.length, 400)) + '}';
  }
  if (typeof arg == 'function') {
    return '<function>';
  } else if (typeof arg == 'object') {
    printObjectList.push(arg);
    return '<' + arg + '|' + (printObjectList.length-1) + '>';
  } else if (typeof arg == 'number') {
    if (arg > 0) return ptrToString(arg) + ' (' + arg + ')';
  }
  return arg;
}
// end include: runtime_debug.js
var readyPromiseResolve, readyPromiseReject;

// Memory management

var runtimeInitialized = false;



function updateMemoryViews() {
  var b = wasmMemory.buffer;
  HEAP8 = new Int8Array(b);
  HEAP16 = new Int16Array(b);
  HEAPU8 = new Uint8Array(b);
  HEAPU16 = new Uint16Array(b);
  HEAP32 = new Int32Array(b);
  HEAPU32 = new Uint32Array(b);
  HEAPF32 = new Float32Array(b);
  HEAPF64 = new Float64Array(b);
  HEAP64 = new BigInt64Array(b);
  HEAPU64 = new BigUint64Array(b);
}

// include: memoryprofiler.js
// end include: memoryprofiler.js
// end include: runtime_common.js
assert(globalThis.Int32Array && globalThis.Float64Array && Int32Array.prototype.subarray && Int32Array.prototype.set,
       'JS engine does not provide full typed array support');

function preRun() {
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  consumedModuleProp('preRun');
  // Begin ATPRERUNS hooks
  callRuntimeCallbacks(onPreRuns);
  // End ATPRERUNS hooks
}

function initRuntime() {
  dbg('initRuntime');
  assert(!runtimeInitialized);
  runtimeInitialized = true;

  checkStackCookie();

  // Begin ATINITS hooks
  callRuntimeCallbacks(onInits);
  // End ATINITS hooks

  ___wasm_call_ctors();
  dbg('done __wasm_call_ctors');

  // No ATPOSTCTORS hooks
  dbg('done ATPOSTCTORS');
}

function postRun() {
  checkStackCookie();
   // PThreads reuse the runtime from the main thread.

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  consumedModuleProp('postRun');

  // Begin ATPOSTRUNS hooks
  callRuntimeCallbacks(onPostRuns);
  // End ATPOSTRUNS hooks
}

/** @param {string|number=} what */
function abort(what) {
  Module['onAbort']?.(what);

  what = 'Aborted(' + what + ')';
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);

  ABORT = true;

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.

  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // definition for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */
  var e = new WebAssembly.RuntimeError(what);

  readyPromiseReject?.(e);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

// show errors on likely calls to FS when it was not included
var FS = {
  error() {
    abort('Filesystem support (FS) was not included. The problem is that you are using files from JS, but files were not used from C/C++, so filesystem support was not auto-included. You can force-include filesystem support with -sFORCE_FILESYSTEM');
  },
  init() { FS.error() },
  createDataFile() { FS.error() },
  createPreloadedFile() { FS.error() },
  createLazyFile() { FS.error() },
  open() { FS.error() },
  mkdev() { FS.error() },
  registerDevice() { FS.error() },
  analyzePath() { FS.error() },

  ErrnoError() { FS.error() },
};


function createExportWrapper(name, nargs) {
  return (...args) => {
    assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
    var f = wasmExports[name];
    assert(f, `exported native function \`${name}\` not found`);
    // Only assert for too many arguments. Too few can be valid since the missing arguments will be zero filled.
    assert(args.length <= nargs, `native function \`${name}\` called with ${args.length} args but expects ${nargs}`);
    return f(...args);
  };
}

// end include: preamble.js

// Begin JS library code


  class ExitStatus {
      name = 'ExitStatus';
      constructor(status) {
        this.message = `Program terminated with exit(${status})`;
        this.status = status;
      }
    }

  /** @type {!Int16Array} */
  var HEAP16;

  /** @type {!Int32Array} */
  var HEAP32;

  /** not-@type {!BigInt64Array} */
  var HEAP64;

  /** @type {!Int8Array} */
  var HEAP8;

  /** @type {!Float32Array} */
  var HEAPF32;

  /** @type {!Float64Array} */
  var HEAPF64;

  /** @type {!Uint16Array} */
  var HEAPU16;

  /** @type {!Uint32Array} */
  var HEAPU32;

  /** not-@type {!BigUint64Array} */
  var HEAPU64;

  /** @type {!Uint8Array} */
  var HEAPU8;

  var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {
        // Pass the module as the first argument.
        callbacks.shift()(Module);
      }
    };
  var onPostRuns = [];
  var addOnPostRun = (cb) => onPostRuns.push(cb);

  var onPreRuns = [];
  var addOnPreRun = (cb) => onPreRuns.push(cb);


  
    /**
   * @param {number} ptr
   * @param {string} type
   */
  function getValue(ptr, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': return HEAP8[ptr];
      case 'i8': return HEAP8[ptr];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP64[((ptr)>>3)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      case '*': return HEAPU32[((ptr)>>2)];
      default: abort(`invalid type for getValue: ${type}`);
    }
  }

  var noExitRuntime = true;

  function ptrToString(ptr) {
      assert(typeof ptr === 'number', `ptrToString expects a number, got ${typeof ptr}`);
      // Convert to 32-bit unsigned value
      ptr >>>= 0;
      return '0x' + ptr.toString(16).padStart(8, '0');
    }

  
    /**
   * @param {number} ptr
   * @param {number} value
   * @param {string} type
   */
  function setValue(ptr, value, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': HEAP8[ptr] = value; break;
      case 'i8': HEAP8[ptr] = value; break;
      case 'i16': HEAP16[((ptr)>>1)] = value; break;
      case 'i32': HEAP32[((ptr)>>2)] = value; break;
      case 'i64': HEAP64[((ptr)>>3)] = BigInt(value); break;
      case 'float': HEAPF32[((ptr)>>2)] = value; break;
      case 'double': HEAPF64[((ptr)>>3)] = value; break;
      case '*': HEAPU32[((ptr)>>2)] = value; break;
      default: abort(`invalid type for setValue: ${type}`);
    }
  }

  var stackRestore = (val) => __emscripten_stack_restore(val);

  var stackSave = () => _emscripten_stack_get_current();

  var warnOnce = (text) => {
      warnOnce.shown ||= {};
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        err(text);
      }
    };

  

  class ExceptionInfo {
      // excPtr - Thrown object pointer to wrap. Metadata pointer is calculated from it.
      constructor(excPtr) {
        this.excPtr = excPtr;
        this.ptr = excPtr - 24;
      }
  
      set_type(type) {
        HEAPU32[(((this.ptr)+(4))>>2)] = type;
      }
  
      get_type() {
        return HEAPU32[(((this.ptr)+(4))>>2)];
      }
  
      set_destructor(destructor) {
        HEAPU32[(((this.ptr)+(8))>>2)] = destructor;
      }
  
      get_destructor() {
        return HEAPU32[(((this.ptr)+(8))>>2)];
      }
  
      set_caught(caught) {
        caught = caught ? 1 : 0;
        HEAP8[(this.ptr)+(12)] = caught;
      }
  
      get_caught() {
        return HEAP8[(this.ptr)+(12)] != 0;
      }
  
      set_rethrown(rethrown) {
        rethrown = rethrown ? 1 : 0;
        HEAP8[(this.ptr)+(13)] = rethrown;
      }
  
      get_rethrown() {
        return HEAP8[(this.ptr)+(13)] != 0;
      }
  
      // Initialize native structure fields. Should be called once after allocated.
      init(type, destructor) {
        dbg('ExceptionInfo init: ' + [type, destructor]);
        this.set_adjusted_ptr(0);
        this.set_type(type);
        this.set_destructor(destructor);
      }
  
      set_adjusted_ptr(adjustedPtr) {
        HEAPU32[(((this.ptr)+(16))>>2)] = adjustedPtr;
      }
  
      get_adjusted_ptr() {
        return HEAPU32[(((this.ptr)+(16))>>2)];
      }
    }
  
  var exceptionLast = 0;
  
  var uncaughtExceptionCount = 0;
  var ___cxa_throw = function(ptr, type, destructor) {
    dbg("[library call:___cxa_throw: " + Array.prototype.slice.call(arguments).map(prettyPrint) + "]");
    var ret = (() => { 
      dbg('__cxa_throw: ' + [ptrToString(ptr), type, ptrToString(destructor)]);
      var info = new ExceptionInfo(ptr);
      // Initialize ExceptionInfo content after it was allocated in __cxa_allocate_exception.
      info.init(type, destructor);
      exceptionLast = ptr;
      uncaughtExceptionCount++;
      assert(false, 'Exception thrown, but exception catching is not enabled. Compile with -sNO_DISABLE_EXCEPTION_CATCHING or -sEXCEPTION_CATCHING_ALLOWED=[..] to catch.');
     })();
    dbg("  [     return:" + prettyPrint(ret));
    return ret;
  };

  function __abort_js() {
    dbg("[library call:__abort_js: " + Array.prototype.slice.call(arguments).map(prettyPrint) + "]");
    var ret = abort('native code called abort()')
    dbg("  [     return:" + prettyPrint(ret));
    return ret;
  }

  var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
      assert(typeof str === 'string', `stringToUTF8Array expects a string (got ${typeof str})`);
      // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
      // undefined and false each don't write out any bytes.
      if (!(maxBytesToWrite > 0))
        return 0;
  
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
      for (var i = 0; i < str.length; ++i) {
        // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
        // and https://www.ietf.org/rfc/rfc2279.txt
        // and https://tools.ietf.org/html/rfc3629
        var u = str.codePointAt(i);
        if (u <= 0x7F) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 0x7FF) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 0xC0 | (u >> 6);
          heap[outIdx++] = 0x80 | (u & 63);
        } else if (u <= 0xFFFF) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 0xE0 | (u >> 12);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          if (u > 0x10FFFF) warnOnce('Invalid Unicode code point ' + ptrToString(u) + ' encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).');
          heap[outIdx++] = 0xF0 | (u >> 18);
          heap[outIdx++] = 0x80 | ((u >> 12) & 63);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
          // Gotcha: if codePoint is over 0xFFFF, it is represented as a surrogate pair in UTF-16.
          // We need to manually skip over the second code unit for correct iteration.
          i++;
        }
      }
      // Null-terminate the pointer to the buffer.
      heap[outIdx] = 0;
      return outIdx - startIdx;
    };
  var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
      assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    };
  
  var lengthBytesUTF8 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
        // unit, not a Unicode code point of the character! So decode
        // UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        var c = str.charCodeAt(i); // possibly a lead surrogate
        if (c <= 0x7F) {
          len++;
        } else if (c <= 0x7FF) {
          len += 2;
        } else if (c >= 0xD800 && c <= 0xDFFF) {
          len += 4; ++i;
        } else {
          len += 3;
        }
      }
      return len;
    };
  var __tzset_js = function(timezone, daylight, std_name, dst_name) {
    dbg("[library call:__tzset_js: " + Array.prototype.slice.call(arguments).map(prettyPrint) + "]");
    var ret = (() => { 
      // TODO: Use (malleable) environment variables instead of system settings.
      var currentYear = new Date().getFullYear();
      var winter = new Date(currentYear, 0, 1);
      var summer = new Date(currentYear, 6, 1);
      var winterOffset = winter.getTimezoneOffset();
      var summerOffset = summer.getTimezoneOffset();
  
      // Local standard timezone offset. Local standard time is not adjusted for
      // daylight savings.  This code uses the fact that getTimezoneOffset returns
      // a greater value during Standard Time versus Daylight Saving Time (DST).
      // Thus it determines the expected output during Standard Time, and it
      // compares whether the output of the given date the same (Standard) or less
      // (DST).
      var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
  
      // timezone is specified as seconds west of UTC ("The external variable
      // `timezone` shall be set to the difference, in seconds, between
      // Coordinated Universal Time (UTC) and local standard time."), the same
      // as returned by stdTimezoneOffset.
      // See http://pubs.opengroup.org/onlinepubs/009695399/functions/tzset.html
      HEAPU32[((timezone)>>2)] = stdTimezoneOffset * 60;
  
      HEAP32[((daylight)>>2)] = Number(winterOffset != summerOffset);
  
      var extractZone = (timezoneOffset) => {
        // Why inverse sign?
        // Read here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
        var sign = timezoneOffset >= 0 ? "-" : "+";
  
        var absOffset = Math.abs(timezoneOffset)
        var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
        var minutes = String(absOffset % 60).padStart(2, "0");
  
        return `UTC${sign}${hours}${minutes}`;
      }
  
      var winterName = extractZone(winterOffset);
      var summerName = extractZone(summerOffset);
      assert(winterName);
      assert(summerName);
      assert(lengthBytesUTF8(winterName) <= 16, `timezone name truncated to fit in TZNAME_MAX (${winterName})`);
      assert(lengthBytesUTF8(summerName) <= 16, `timezone name truncated to fit in TZNAME_MAX (${summerName})`);
      if (summerOffset < winterOffset) {
        // Northern hemisphere
        stringToUTF8(winterName, std_name, 17);
        stringToUTF8(summerName, dst_name, 17);
      } else {
        stringToUTF8(winterName, dst_name, 17);
        stringToUTF8(summerName, std_name, 17);
      }
     })();
    dbg("  [     return:" + prettyPrint(ret));
    return ret;
  };

  function _emscripten_get_now() {
    dbg("[library call:_emscripten_get_now: " + Array.prototype.slice.call(arguments).map(prettyPrint) + "]");
    var ret = performance.now()
    dbg("  [     return:" + prettyPrint(ret));
    return ret;
  }
  
  function _emscripten_date_now() {
    dbg("[library call:_emscripten_date_now: " + Array.prototype.slice.call(arguments).map(prettyPrint) + "]");
    var ret = Date.now()
    dbg("  [     return:" + prettyPrint(ret));
    return ret;
  }
  
  var nowIsMonotonic = 1;
  
  var checkWasiClock = (clock_id) => clock_id >= 0 && clock_id <= 3;
  
  
  var UTF8Decoder = globalThis.TextDecoder && new TextDecoder();
  
  var findStringEnd = (heapOrArray, idx, maxBytesToRead, ignoreNul) => {
      var maxIdx = idx + maxBytesToRead;
      if (ignoreNul) return maxIdx;
      // TextDecoder needs to know the byte length in advance, it doesn't stop on
      // null terminator by itself.
      // As a tiny code save trick, compare idx against maxIdx using a negation,
      // so that maxBytesToRead=undefined/NaN means Infinity.
      while (heapOrArray[idx] && !(idx >= maxIdx)) ++idx;
      return idx;
    };
  
  
    /**
   * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
   * array that contains uint8 values, returns a copy of that string as a
   * Javascript String object.
   * heapOrArray is either a regular array, or a JavaScript typed array view.
   * @param {number=} idx
   * @param {number=} maxBytesToRead
   * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
   * @return {string}
   */
  var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead, ignoreNul) => {
  
      var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
  
      // When using conditional TextDecoder, skip it for short strings as the overhead of the native call is not worth it.
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = '';
      while (idx < endPtr) {
        // For UTF8 byte structure, see:
        // http://en.wikipedia.org/wiki/UTF-8#Description
        // https://www.ietf.org/rfc/rfc2279.txt
        // https://tools.ietf.org/html/rfc3629
        var u0 = heapOrArray[idx++];
        if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 0xF0) == 0xE0) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          if ((u0 & 0xF8) != 0xF0) warnOnce('Invalid UTF-8 leading byte ' + ptrToString(u0) + ' encountered when deserializing a UTF-8 string in wasm memory to a JS string!');
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
        }
  
        if (u0 < 0x10000) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 0x10000;
          str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
        }
      }
      return str;
    };
  
    /**
   * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
   * emscripten HEAP, returns a copy of that string as a Javascript String object.
   *
   * @param {number} ptr
   * @param {number=} maxBytesToRead - An optional length that specifies the
   *   maximum number of bytes to read. You can omit this parameter to scan the
   *   string until the first 0 byte. If maxBytesToRead is passed, and the string
   *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
   *   string will cut short at that byte index.
   * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
   * @return {string}
   */
  var UTF8ToString = (ptr, maxBytesToRead, ignoreNul) => {
      assert(typeof ptr == 'number', `UTF8ToString expects a number (got ${typeof ptr})`);
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead, ignoreNul) : '';
    };
  
  var strError = (errno) => UTF8ToString(_strerror(errno));
  
  var INT53_MAX = 9007199254740992;
  
  var INT53_MIN = -9007199254740992;
  var bigintToI53Checked = (num) => (num < INT53_MIN || num > INT53_MAX) ? NaN : Number(num);
  var _clock_time_get = function(clk_id, ignored_precision, ptime) {
    ignored_precision = bigintToI53Checked(ignored_precision);
  
  
    dbg("[library call:_clock_time_get: " + Array.prototype.slice.call(arguments).map(prettyPrint) + "]");
    var ret = (() => { 
  dbg('syscall! clock_time_get: [' + Array.prototype.slice.call(arguments) + ']');
  var canWarn = true;
  var ret = (() => {
      if (!checkWasiClock(clk_id)) {
        return 28;
      }
      var now;
      // all wasi clocks but realtime are monotonic
      if (clk_id === 0) {
        now = _emscripten_date_now();
      } else if (nowIsMonotonic) {
        now = _emscripten_get_now();
      } else {
        return 52;
      }
      // "now" is in ms, and wasi times are in ns.
      var nsec = Math.round(now * 1000 * 1000);
      HEAP64[((ptime)>>3)] = BigInt(nsec);
      return 0;
    })();
  if (ret && ret < 0 && canWarn) {
    dbg(`error: syscall may have failed with ${-ret} (${strError(-ret)})`);
  }
  dbg(`syscall return: ${ret}`);
  return ret;
   })();
    dbg("  [     return:" + prettyPrint(ret));
    return ret;
  ;
  };

  var readEmAsmArgsArray = [];
  var readEmAsmArgs = (sigPtr, buf) => {
      // Nobody should have mutated _readEmAsmArgsArray underneath us to be something else than an array.
      assert(Array.isArray(readEmAsmArgsArray));
      // The input buffer is allocated on the stack, so it must be stack-aligned.
      assert(buf % 16 == 0);
      readEmAsmArgsArray.length = 0;
      var ch;
      // Most arguments are i32s, so shift the buffer pointer so it is a plain
      // index into HEAP32.
      while (ch = HEAPU8[sigPtr++]) {
        var chr = String.fromCharCode(ch);
        var validChars = ['d', 'f', 'i', 'p'];
        // In WASM_BIGINT mode we support passing i64 values as bigint.
        validChars.push('j');
        assert(validChars.includes(chr), `Invalid character ${ch}("${chr}") in readEmAsmArgs! Use only [${validChars}], and do not specify "v" for void return argument.`);
        // Floats are always passed as doubles, so all types except for 'i'
        // are 8 bytes and require alignment.
        var wide = (ch != 105);
        wide &= (ch != 112);
        buf += wide && (buf % 8) ? 4 : 0;
        readEmAsmArgsArray.push(
          // Special case for pointers under wasm64 or CAN_ADDRESS_2GB mode.
          ch == 112 ? HEAPU32[((buf)>>2)] :
          ch == 106 ? HEAP64[((buf)>>3)] :
          ch == 105 ?
            HEAP32[((buf)>>2)] :
            HEAPF64[((buf)>>3)]
        );
        buf += wide ? 8 : 4;
      }
      return readEmAsmArgsArray;
    };
  var runEmAsmFunction = (code, sigPtr, argbuf) => {
      var args = readEmAsmArgs(sigPtr, argbuf);
      assert(ASM_CONSTS.hasOwnProperty(code), `No EM_ASM constant found at address ${code}.  The loaded WebAssembly file is likely out of sync with the generated JavaScript.`);
      return ASM_CONSTS[code](...args);
    };
  var _emscripten_asm_const_double = function(code, sigPtr, argbuf) {
    dbg("[library call:_emscripten_asm_const_double: " + Array.prototype.slice.call(arguments).map(prettyPrint) + "]");
    var ret = (() => { 
      return runEmAsmFunction(code, sigPtr, argbuf);
     })();
    dbg("  [     return:" + prettyPrint(ret));
    return ret;
  };

  var _emscripten_asm_const_int = function(code, sigPtr, argbuf) {
    dbg("[library call:_emscripten_asm_const_int: " + Array.prototype.slice.call(arguments).map(prettyPrint) + "]");
    var ret = (() => { 
      return runEmAsmFunction(code, sigPtr, argbuf);
     })();
    dbg("  [     return:" + prettyPrint(ret));
    return ret;
  };


  var abortOnCannotGrowMemory = (requestedSize) => {
      abort(`Cannot enlarge memory arrays to size ${requestedSize} bytes (OOM). Either (1) compile with -sINITIAL_MEMORY=X with X higher than the current value ${HEAP8.length}, (2) compile with -sALLOW_MEMORY_GROWTH which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with -sABORTING_MALLOC=0`);
    };
  var _emscripten_resize_heap = function(requestedSize) {
    dbg("[library call:_emscripten_resize_heap: " + Array.prototype.slice.call(arguments).map(prettyPrint) + "]");
    var ret = (() => { 
      var oldSize = HEAPU8.length;
      // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
      requestedSize >>>= 0;
      abortOnCannotGrowMemory(requestedSize);
     })();
    dbg("  [     return:" + prettyPrint(ret));
    return ret;
  };

  var ENV = {
  };
  
  var getExecutableName = () => thisProgram || './this.program';
  var getEnvStrings = () => {
      if (!getEnvStrings.strings) {
        // Default values.
        // Browser language detection #8751
        var lang = (globalThis.navigator?.language ?? 'C').replace('-', '_') + '.UTF-8';
        var env = {
          'USER': 'web_user',
          'LOGNAME': 'web_user',
          'PATH': '/',
          'PWD': '/',
          'HOME': '/home/web_user',
          'LANG': lang,
          '_': getExecutableName()
        };
        // Apply the user-provided values, if any.
        for (var x in ENV) {
          // x is a key in ENV; if ENV[x] is undefined, that means it was
          // explicitly set to be so. We allow user code to do that to
          // force variables with default values to remain unset.
          if (ENV[x] === undefined) delete env[x];
          else env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(`${x}=${env[x]}`);
        }
        getEnvStrings.strings = strings;
      }
      return getEnvStrings.strings;
    };
  
  
  var _environ_get = function(__environ, environ_buf) {
    dbg("[library call:_environ_get: " + Array.prototype.slice.call(arguments).map(prettyPrint) + "]");
    var ret = (() => { 
  dbg('syscall! environ_get: [' + Array.prototype.slice.call(arguments) + ']');
  var canWarn = true;
  var ret = (() => {
      var bufSize = 0;
      var envp = 0;
      for (var string of getEnvStrings()) {
        var ptr = environ_buf + bufSize;
        HEAPU32[(((__environ)+(envp))>>2)] = ptr;
        bufSize += stringToUTF8(string, ptr, Infinity) + 1;
        envp += 4;
      }
      return 0;
    })();
  if (ret && ret < 0 && canWarn) {
    dbg(`error: syscall may have failed with ${-ret} (${strError(-ret)})`);
  }
  dbg(`syscall return: ${ret}`);
  return ret;
   })();
    dbg("  [     return:" + prettyPrint(ret));
    return ret;
  };

  
  
  var _environ_sizes_get = function(penviron_count, penviron_buf_size) {
    dbg("[library call:_environ_sizes_get: " + Array.prototype.slice.call(arguments).map(prettyPrint) + "]");
    var ret = (() => { 
  dbg('syscall! environ_sizes_get: [' + Array.prototype.slice.call(arguments) + ']');
  var canWarn = true;
  var ret = (() => {
      var strings = getEnvStrings();
      HEAPU32[((penviron_count)>>2)] = strings.length;
      var bufSize = 0;
      for (var string of strings) {
        bufSize += lengthBytesUTF8(string) + 1;
      }
      HEAPU32[((penviron_buf_size)>>2)] = bufSize;
      return 0;
    })();
  if (ret && ret < 0 && canWarn) {
    dbg(`error: syscall may have failed with ${-ret} (${strError(-ret)})`);
  }
  dbg(`syscall return: ${ret}`);
  return ret;
   })();
    dbg("  [     return:" + prettyPrint(ret));
    return ret;
  };

  
  var SYSCALLS = {
  varargs:undefined,
  getStr(ptr) {
        var ret = UTF8ToString(ptr);
        dbg(`    (str: "${ret}")`);
        return ret;
      },
  };
  var _fd_close = function(fd) {
    dbg("[library call:_fd_close: " + Array.prototype.slice.call(arguments).map(prettyPrint) + "]");
    var ret = (() => { 
  dbg('syscall! fd_close: [' + Array.prototype.slice.call(arguments) + ']');
  var canWarn = true;
  var ret = (() => {
      abort('fd_close called without SYSCALLS_REQUIRE_FILESYSTEM');
    })();
  if (ret && ret < 0 && canWarn) {
    dbg(`error: syscall may have failed with ${-ret} (${strError(-ret)})`);
  }
  dbg(`syscall return: ${ret}`);
  return ret;
   })();
    dbg("  [     return:" + prettyPrint(ret));
    return ret;
  };

  
  var _fd_seek = function(fd, offset, whence, newOffset) {
    offset = bigintToI53Checked(offset);
  
  
    dbg("[library call:_fd_seek: " + Array.prototype.slice.call(arguments).map(prettyPrint) + "]");
    var ret = (() => { 
  dbg('syscall! fd_seek: [' + Array.prototype.slice.call(arguments) + ']');
  var canWarn = true;
  var ret = (() => {
      return 70;
    })();
  if (ret && ret < 0 && canWarn) {
    dbg(`error: syscall may have failed with ${-ret} (${strError(-ret)})`);
  }
  dbg(`syscall return: ${ret}`);
  return ret;
   })();
    dbg("  [     return:" + prettyPrint(ret));
    return ret;
  ;
  };

  var printCharBuffers = [null,[],[]];
  
  var printChar = (stream, curr) => {
      var buffer = printCharBuffers[stream];
      assert(buffer);
      if (curr === 0 || curr === 10) {
        (stream === 1 ? out : err)(UTF8ArrayToString(buffer));
        buffer.length = 0;
      } else {
        buffer.push(curr);
      }
    };
  
  var flush_NO_FILESYSTEM = () => {
      // flush anything remaining in the buffers during shutdown
      _fflush(0);
      if (printCharBuffers[1].length) printChar(1, 10);
      if (printCharBuffers[2].length) printChar(2, 10);
    };
  
  
  
  var _fd_write = function(fd, iov, iovcnt, pnum) {
    dbg("[library call:_fd_write: " + Array.prototype.slice.call(arguments).map(prettyPrint) + "]");
    var ret = (() => { 
  dbg('syscall! fd_write: [' + Array.prototype.slice.call(arguments) + ']');
  var canWarn = true;
  var ret = (() => {
      // hack to support printf in SYSCALLS_REQUIRE_FILESYSTEM=0
      var num = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        for (var j = 0; j < len; j++) {
          printChar(fd, HEAPU8[ptr+j]);
        }
        num += len;
      }
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    })();
  if (ret && ret < 0 && canWarn) {
    dbg(`error: syscall may have failed with ${-ret} (${strError(-ret)})`);
  }
  dbg(`syscall return: ${ret}`);
  return ret;
   })();
    dbg("  [     return:" + prettyPrint(ret));
    return ret;
  };

  
  /** @type {function(string, boolean=, number=)} */
  var intArrayFromString = (stringy, dontAddNull, length) => {
      var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
      var u8array = new Array(len);
      var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
      if (dontAddNull) u8array.length = numBytesWritten;
      return u8array;
    };


  var alignMemory = (size, alignment) => {
      assert(alignment, "alignment argument is required");
      return Math.ceil(size / alignment) * alignment;
    };

  var onInits = [];
  var addOnInit = (cb) => onInits.push(cb);

// End JS library code

// include: postlibrary.js
// This file is included after the automatically-generated JS library code
// but before the wasm module is created.

function processModuleArgs() 
{

  // Begin ATMODULES hooks
  if (Module['noExitRuntime']) noExitRuntime = Module['noExitRuntime'];
if (Module['print']) out = Module['print'];
if (Module['printErr']) err = Module['printErr'];
if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];

Module['FS_createDataFile'] = FS.createDataFile;
Module['FS_createPreloadedFile'] = FS.createPreloadedFile;

  // End ATMODULES hooks

  checkIncomingModuleAPI();

  if (Module['arguments']) arguments_ = Module['arguments'];
  if (Module['thisProgram']) thisProgram = Module['thisProgram'];

  // Assertions on removed incoming Module JS APIs.
  assert(typeof Module['memoryInitializerPrefixURL'] == 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['pthreadMainPrefixURL'] == 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['cdInitializerPrefixURL'] == 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['filePackagePrefixURL'] == 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['read'] == 'undefined', 'Module.read option was removed');
  assert(typeof Module['readAsync'] == 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
  assert(typeof Module['readBinary'] == 'undefined', 'Module.readBinary option was removed (modify readBinary in JS)');
  assert(typeof Module['setWindowTitle'] == 'undefined', 'Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)');
  assert(typeof Module['TOTAL_MEMORY'] == 'undefined', 'Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY');
  assert(typeof Module['ENVIRONMENT'] == 'undefined', 'Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)');
  assert(typeof Module['STACK_SIZE'] == 'undefined', 'STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time')
  // If memory is defined in wasm, the user can't provide it, or set INITIAL_MEMORY
  assert(typeof Module['wasmMemory'] == 'undefined', 'Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally');
  assert(typeof Module['INITIAL_MEMORY'] == 'undefined', 'Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically');

  if (Module['preInit']) {
    if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
    while (Module['preInit'].length > 0) {
      Module['preInit'].shift()();
    }
  }
  consumedModuleProp('preInit');
}

// Runtime exports
export { UTF8ToString };

// end include: postlibrary.js

function checkIncomingModuleAPI() {
  ignoredModuleProp('fetchSettings');
  ignoredModuleProp('logReadFiles');
  ignoredModuleProp('loadSplitModule');
  ignoredModuleProp('onMalloc');
  ignoredModuleProp('onRealloc');
  ignoredModuleProp('onFree');
  ignoredModuleProp('onSbrkGrow');
}
var ASM_CONSTS = {
  115202: ($0, $1, $2, $3) => { var self = Module['getCache'](Module['DebugDrawer'])[$0]; if (!self.hasOwnProperty('drawLine')) throw 'a JSImplementation must implement all functions, you forgot DebugDrawer::drawLine.'; self['drawLine']($1,$2,$3); },  
 115422: ($0, $1, $2, $3, $4, $5) => { var self = Module['getCache'](Module['DebugDrawer'])[$0]; if (!self.hasOwnProperty('drawContactPoint')) throw 'a JSImplementation must implement all functions, you forgot DebugDrawer::drawContactPoint.'; self['drawContactPoint']($1,$2,$3,$4,$5); },  
 115672: ($0, $1) => { var self = Module['getCache'](Module['DebugDrawer'])[$0]; if (!self.hasOwnProperty('reportErrorWarning')) throw 'a JSImplementation must implement all functions, you forgot DebugDrawer::reportErrorWarning.'; self['reportErrorWarning']($1); },  
 115916: ($0, $1, $2) => { var self = Module['getCache'](Module['DebugDrawer'])[$0]; if (!self.hasOwnProperty('draw3dText')) throw 'a JSImplementation must implement all functions, you forgot DebugDrawer::draw3dText.'; self['draw3dText']($1,$2); },  
 116139: ($0, $1) => { var self = Module['getCache'](Module['DebugDrawer'])[$0]; if (!self.hasOwnProperty('setDebugMode')) throw 'a JSImplementation must implement all functions, you forgot DebugDrawer::setDebugMode.'; self['setDebugMode']($1); },  
 116365: ($0) => { var self = Module['getCache'](Module['DebugDrawer'])[$0]; if (!self.hasOwnProperty('getDebugMode')) throw 'a JSImplementation must implement all functions, you forgot DebugDrawer::getDebugMode.'; return self['getDebugMode'](); },  
 116596: ($0, $1) => { var self = Module['getCache'](Module['MotionState'])[$0]; if (!self.hasOwnProperty('getWorldTransform')) throw 'a JSImplementation must implement all functions, you forgot MotionState::getWorldTransform.'; self['getWorldTransform']($1); },  
 116837: ($0, $1) => { var self = Module['getCache'](Module['MotionState'])[$0]; if (!self.hasOwnProperty('setWorldTransform')) throw 'a JSImplementation must implement all functions, you forgot MotionState::setWorldTransform.'; self['setWorldTransform']($1); },  
 117078: ($0, $1, $2, $3, $4, $5, $6, $7) => { var self = Module['getCache'](Module['ConcreteContactResultCallback'])[$0]; if (!self.hasOwnProperty('addSingleResult')) throw 'a JSImplementation must implement all functions, you forgot ConcreteContactResultCallback::addSingleResult.'; return self['addSingleResult']($1,$2,$3,$4,$5,$6,$7); }
};

// Imports from the Wasm binary.
import {
  memory,
  __indirect_function_table,
  __wasm_call_ctors as ___wasm_call_ctors,
  webidl_free as _webidl_free,
  webidl_malloc as _webidl_malloc,
  malloc as _malloc,
  emscripten_bind_btCollisionShape_setLocalScaling_1 as _emscripten_bind_btCollisionShape_setLocalScaling_1,
  emscripten_bind_btCollisionShape_getLocalScaling_0 as _emscripten_bind_btCollisionShape_getLocalScaling_0,
  emscripten_bind_btCollisionShape_calculateLocalInertia_2 as _emscripten_bind_btCollisionShape_calculateLocalInertia_2,
  emscripten_bind_btCollisionShape_setMargin_1 as _emscripten_bind_btCollisionShape_setMargin_1,
  emscripten_bind_btCollisionShape_getMargin_0 as _emscripten_bind_btCollisionShape_getMargin_0,
  emscripten_bind_btCollisionShape___destroy___0 as _emscripten_bind_btCollisionShape___destroy___0,
  emscripten_bind_btCollisionWorld_getDispatcher_0 as _emscripten_bind_btCollisionWorld_getDispatcher_0,
  emscripten_bind_btCollisionWorld_rayTest_3 as _emscripten_bind_btCollisionWorld_rayTest_3,
  emscripten_bind_btCollisionWorld_getPairCache_0 as _emscripten_bind_btCollisionWorld_getPairCache_0,
  emscripten_bind_btCollisionWorld_getDispatchInfo_0 as _emscripten_bind_btCollisionWorld_getDispatchInfo_0,
  emscripten_bind_btCollisionWorld_addCollisionObject_1 as _emscripten_bind_btCollisionWorld_addCollisionObject_1,
  emscripten_bind_btCollisionWorld_addCollisionObject_2 as _emscripten_bind_btCollisionWorld_addCollisionObject_2,
  emscripten_bind_btCollisionWorld_addCollisionObject_3 as _emscripten_bind_btCollisionWorld_addCollisionObject_3,
  emscripten_bind_btCollisionWorld_removeCollisionObject_1 as _emscripten_bind_btCollisionWorld_removeCollisionObject_1,
  emscripten_bind_btCollisionWorld_getBroadphase_0 as _emscripten_bind_btCollisionWorld_getBroadphase_0,
  emscripten_bind_btCollisionWorld_convexSweepTest_5 as _emscripten_bind_btCollisionWorld_convexSweepTest_5,
  emscripten_bind_btCollisionWorld_contactPairTest_3 as _emscripten_bind_btCollisionWorld_contactPairTest_3,
  emscripten_bind_btCollisionWorld_contactTest_2 as _emscripten_bind_btCollisionWorld_contactTest_2,
  emscripten_bind_btCollisionWorld_setForceUpdateAllAabbs_1 as _emscripten_bind_btCollisionWorld_setForceUpdateAllAabbs_1,
  emscripten_bind_btCollisionWorld_updateSingleAabb_1 as _emscripten_bind_btCollisionWorld_updateSingleAabb_1,
  emscripten_bind_btCollisionWorld_setDebugDrawer_1 as _emscripten_bind_btCollisionWorld_setDebugDrawer_1,
  emscripten_bind_btCollisionWorld_getDebugDrawer_0 as _emscripten_bind_btCollisionWorld_getDebugDrawer_0,
  emscripten_bind_btCollisionWorld_debugDrawWorld_0 as _emscripten_bind_btCollisionWorld_debugDrawWorld_0,
  emscripten_bind_btCollisionWorld_debugDrawObject_3 as _emscripten_bind_btCollisionWorld_debugDrawObject_3,
  emscripten_bind_btCollisionWorld___destroy___0 as _emscripten_bind_btCollisionWorld___destroy___0,
  emscripten_bind_btCollisionObject_setAnisotropicFriction_2 as _emscripten_bind_btCollisionObject_setAnisotropicFriction_2,
  emscripten_bind_btCollisionObject_getCollisionShape_0 as _emscripten_bind_btCollisionObject_getCollisionShape_0,
  emscripten_bind_btCollisionObject_setContactProcessingThreshold_1 as _emscripten_bind_btCollisionObject_setContactProcessingThreshold_1,
  emscripten_bind_btCollisionObject_setActivationState_1 as _emscripten_bind_btCollisionObject_setActivationState_1,
  emscripten_bind_btCollisionObject_forceActivationState_1 as _emscripten_bind_btCollisionObject_forceActivationState_1,
  emscripten_bind_btCollisionObject_activate_0 as _emscripten_bind_btCollisionObject_activate_0,
  emscripten_bind_btCollisionObject_activate_1 as _emscripten_bind_btCollisionObject_activate_1,
  emscripten_bind_btCollisionObject_isActive_0 as _emscripten_bind_btCollisionObject_isActive_0,
  emscripten_bind_btCollisionObject_isKinematicObject_0 as _emscripten_bind_btCollisionObject_isKinematicObject_0,
  emscripten_bind_btCollisionObject_isStaticObject_0 as _emscripten_bind_btCollisionObject_isStaticObject_0,
  emscripten_bind_btCollisionObject_isStaticOrKinematicObject_0 as _emscripten_bind_btCollisionObject_isStaticOrKinematicObject_0,
  emscripten_bind_btCollisionObject_getRestitution_0 as _emscripten_bind_btCollisionObject_getRestitution_0,
  emscripten_bind_btCollisionObject_getFriction_0 as _emscripten_bind_btCollisionObject_getFriction_0,
  emscripten_bind_btCollisionObject_getRollingFriction_0 as _emscripten_bind_btCollisionObject_getRollingFriction_0,
  emscripten_bind_btCollisionObject_setRestitution_1 as _emscripten_bind_btCollisionObject_setRestitution_1,
  emscripten_bind_btCollisionObject_setFriction_1 as _emscripten_bind_btCollisionObject_setFriction_1,
  emscripten_bind_btCollisionObject_setRollingFriction_1 as _emscripten_bind_btCollisionObject_setRollingFriction_1,
  emscripten_bind_btCollisionObject_getWorldTransform_0 as _emscripten_bind_btCollisionObject_getWorldTransform_0,
  emscripten_bind_btCollisionObject_getCollisionFlags_0 as _emscripten_bind_btCollisionObject_getCollisionFlags_0,
  emscripten_bind_btCollisionObject_setCollisionFlags_1 as _emscripten_bind_btCollisionObject_setCollisionFlags_1,
  emscripten_bind_btCollisionObject_setWorldTransform_1 as _emscripten_bind_btCollisionObject_setWorldTransform_1,
  emscripten_bind_btCollisionObject_setCollisionShape_1 as _emscripten_bind_btCollisionObject_setCollisionShape_1,
  emscripten_bind_btCollisionObject_setCcdMotionThreshold_1 as _emscripten_bind_btCollisionObject_setCcdMotionThreshold_1,
  emscripten_bind_btCollisionObject_setCcdSweptSphereRadius_1 as _emscripten_bind_btCollisionObject_setCcdSweptSphereRadius_1,
  emscripten_bind_btCollisionObject_getUserIndex_0 as _emscripten_bind_btCollisionObject_getUserIndex_0,
  emscripten_bind_btCollisionObject_setUserIndex_1 as _emscripten_bind_btCollisionObject_setUserIndex_1,
  emscripten_bind_btCollisionObject_getUserPointer_0 as _emscripten_bind_btCollisionObject_getUserPointer_0,
  emscripten_bind_btCollisionObject_setUserPointer_1 as _emscripten_bind_btCollisionObject_setUserPointer_1,
  emscripten_bind_btCollisionObject_getBroadphaseHandle_0 as _emscripten_bind_btCollisionObject_getBroadphaseHandle_0,
  emscripten_bind_btCollisionObject___destroy___0 as _emscripten_bind_btCollisionObject___destroy___0,
  emscripten_bind_btConcaveShape_setLocalScaling_1 as _emscripten_bind_btConcaveShape_setLocalScaling_1,
  emscripten_bind_btConcaveShape_getLocalScaling_0 as _emscripten_bind_btConcaveShape_getLocalScaling_0,
  emscripten_bind_btConcaveShape_calculateLocalInertia_2 as _emscripten_bind_btConcaveShape_calculateLocalInertia_2,
  emscripten_bind_btConcaveShape___destroy___0 as _emscripten_bind_btConcaveShape___destroy___0,
  emscripten_bind_btCollisionAlgorithm___destroy___0 as _emscripten_bind_btCollisionAlgorithm___destroy___0,
  emscripten_bind_btTypedConstraint_enableFeedback_1 as _emscripten_bind_btTypedConstraint_enableFeedback_1,
  emscripten_bind_btTypedConstraint_getBreakingImpulseThreshold_0 as _emscripten_bind_btTypedConstraint_getBreakingImpulseThreshold_0,
  emscripten_bind_btTypedConstraint_setBreakingImpulseThreshold_1 as _emscripten_bind_btTypedConstraint_setBreakingImpulseThreshold_1,
  emscripten_bind_btTypedConstraint_getParam_2 as _emscripten_bind_btTypedConstraint_getParam_2,
  emscripten_bind_btTypedConstraint_setParam_3 as _emscripten_bind_btTypedConstraint_setParam_3,
  emscripten_bind_btTypedConstraint___destroy___0 as _emscripten_bind_btTypedConstraint___destroy___0,
  emscripten_bind_btDynamicsWorld_addAction_1 as _emscripten_bind_btDynamicsWorld_addAction_1,
  emscripten_bind_btDynamicsWorld_removeAction_1 as _emscripten_bind_btDynamicsWorld_removeAction_1,
  emscripten_bind_btDynamicsWorld_getSolverInfo_0 as _emscripten_bind_btDynamicsWorld_getSolverInfo_0,
  emscripten_bind_btDynamicsWorld_setInternalTickCallback_1 as _emscripten_bind_btDynamicsWorld_setInternalTickCallback_1,
  emscripten_bind_btDynamicsWorld_setInternalTickCallback_2 as _emscripten_bind_btDynamicsWorld_setInternalTickCallback_2,
  emscripten_bind_btDynamicsWorld_setInternalTickCallback_3 as _emscripten_bind_btDynamicsWorld_setInternalTickCallback_3,
  emscripten_bind_btDynamicsWorld_getDispatcher_0 as _emscripten_bind_btDynamicsWorld_getDispatcher_0,
  emscripten_bind_btDynamicsWorld_rayTest_3 as _emscripten_bind_btDynamicsWorld_rayTest_3,
  emscripten_bind_btDynamicsWorld_getPairCache_0 as _emscripten_bind_btDynamicsWorld_getPairCache_0,
  emscripten_bind_btDynamicsWorld_getDispatchInfo_0 as _emscripten_bind_btDynamicsWorld_getDispatchInfo_0,
  emscripten_bind_btDynamicsWorld_addCollisionObject_1 as _emscripten_bind_btDynamicsWorld_addCollisionObject_1,
  emscripten_bind_btDynamicsWorld_addCollisionObject_2 as _emscripten_bind_btDynamicsWorld_addCollisionObject_2,
  emscripten_bind_btDynamicsWorld_addCollisionObject_3 as _emscripten_bind_btDynamicsWorld_addCollisionObject_3,
  emscripten_bind_btDynamicsWorld_removeCollisionObject_1 as _emscripten_bind_btDynamicsWorld_removeCollisionObject_1,
  emscripten_bind_btDynamicsWorld_getBroadphase_0 as _emscripten_bind_btDynamicsWorld_getBroadphase_0,
  emscripten_bind_btDynamicsWorld_convexSweepTest_5 as _emscripten_bind_btDynamicsWorld_convexSweepTest_5,
  emscripten_bind_btDynamicsWorld_contactPairTest_3 as _emscripten_bind_btDynamicsWorld_contactPairTest_3,
  emscripten_bind_btDynamicsWorld_contactTest_2 as _emscripten_bind_btDynamicsWorld_contactTest_2,
  emscripten_bind_btDynamicsWorld_setForceUpdateAllAabbs_1 as _emscripten_bind_btDynamicsWorld_setForceUpdateAllAabbs_1,
  emscripten_bind_btDynamicsWorld_updateSingleAabb_1 as _emscripten_bind_btDynamicsWorld_updateSingleAabb_1,
  emscripten_bind_btDynamicsWorld_setDebugDrawer_1 as _emscripten_bind_btDynamicsWorld_setDebugDrawer_1,
  emscripten_bind_btDynamicsWorld_getDebugDrawer_0 as _emscripten_bind_btDynamicsWorld_getDebugDrawer_0,
  emscripten_bind_btDynamicsWorld_debugDrawWorld_0 as _emscripten_bind_btDynamicsWorld_debugDrawWorld_0,
  emscripten_bind_btDynamicsWorld_debugDrawObject_3 as _emscripten_bind_btDynamicsWorld_debugDrawObject_3,
  emscripten_bind_btDynamicsWorld___destroy___0 as _emscripten_bind_btDynamicsWorld___destroy___0,
  emscripten_bind_btIDebugDraw_drawLine_3 as _emscripten_bind_btIDebugDraw_drawLine_3,
  emscripten_bind_btIDebugDraw_drawContactPoint_5 as _emscripten_bind_btIDebugDraw_drawContactPoint_5,
  emscripten_bind_btIDebugDraw_reportErrorWarning_1 as _emscripten_bind_btIDebugDraw_reportErrorWarning_1,
  emscripten_bind_btIDebugDraw_draw3dText_2 as _emscripten_bind_btIDebugDraw_draw3dText_2,
  emscripten_bind_btIDebugDraw_setDebugMode_1 as _emscripten_bind_btIDebugDraw_setDebugMode_1,
  emscripten_bind_btIDebugDraw_getDebugMode_0 as _emscripten_bind_btIDebugDraw_getDebugMode_0,
  emscripten_bind_btIDebugDraw___destroy___0 as _emscripten_bind_btIDebugDraw___destroy___0,
  emscripten_bind_btVector3_btVector3_0 as _emscripten_bind_btVector3_btVector3_0,
  emscripten_bind_btVector3_btVector3_3 as _emscripten_bind_btVector3_btVector3_3,
  emscripten_bind_btVector3_length_0 as _emscripten_bind_btVector3_length_0,
  emscripten_bind_btVector3_length2_0 as _emscripten_bind_btVector3_length2_0,
  emscripten_bind_btVector3_x_0 as _emscripten_bind_btVector3_x_0,
  emscripten_bind_btVector3_y_0 as _emscripten_bind_btVector3_y_0,
  emscripten_bind_btVector3_z_0 as _emscripten_bind_btVector3_z_0,
  emscripten_bind_btVector3_setX_1 as _emscripten_bind_btVector3_setX_1,
  emscripten_bind_btVector3_setY_1 as _emscripten_bind_btVector3_setY_1,
  emscripten_bind_btVector3_setZ_1 as _emscripten_bind_btVector3_setZ_1,
  emscripten_bind_btVector3_setValue_3 as _emscripten_bind_btVector3_setValue_3,
  emscripten_bind_btVector3_normalize_0 as _emscripten_bind_btVector3_normalize_0,
  emscripten_bind_btVector3_rotate_2 as _emscripten_bind_btVector3_rotate_2,
  emscripten_bind_btVector3_dot_1 as _emscripten_bind_btVector3_dot_1,
  emscripten_bind_btVector3_op_mul_1 as _emscripten_bind_btVector3_op_mul_1,
  emscripten_bind_btVector3_op_add_1 as _emscripten_bind_btVector3_op_add_1,
  emscripten_bind_btVector3_op_sub_1 as _emscripten_bind_btVector3_op_sub_1,
  emscripten_bind_btVector3___destroy___0 as _emscripten_bind_btVector3___destroy___0,
  emscripten_bind_btQuadWord_x_0 as _emscripten_bind_btQuadWord_x_0,
  emscripten_bind_btQuadWord_y_0 as _emscripten_bind_btQuadWord_y_0,
  emscripten_bind_btQuadWord_z_0 as _emscripten_bind_btQuadWord_z_0,
  emscripten_bind_btQuadWord_w_0 as _emscripten_bind_btQuadWord_w_0,
  emscripten_bind_btQuadWord_setX_1 as _emscripten_bind_btQuadWord_setX_1,
  emscripten_bind_btQuadWord_setY_1 as _emscripten_bind_btQuadWord_setY_1,
  emscripten_bind_btQuadWord_setZ_1 as _emscripten_bind_btQuadWord_setZ_1,
  emscripten_bind_btQuadWord_setW_1 as _emscripten_bind_btQuadWord_setW_1,
  emscripten_bind_btQuadWord___destroy___0 as _emscripten_bind_btQuadWord___destroy___0,
  emscripten_bind_btMotionState_getWorldTransform_1 as _emscripten_bind_btMotionState_getWorldTransform_1,
  emscripten_bind_btMotionState_setWorldTransform_1 as _emscripten_bind_btMotionState_setWorldTransform_1,
  emscripten_bind_btMotionState___destroy___0 as _emscripten_bind_btMotionState___destroy___0,
  emscripten_bind_RayResultCallback_hasHit_0 as _emscripten_bind_RayResultCallback_hasHit_0,
  emscripten_bind_RayResultCallback_get_m_collisionFilterGroup_0 as _emscripten_bind_RayResultCallback_get_m_collisionFilterGroup_0,
  emscripten_bind_RayResultCallback_set_m_collisionFilterGroup_1 as _emscripten_bind_RayResultCallback_set_m_collisionFilterGroup_1,
  emscripten_bind_RayResultCallback_get_m_collisionFilterMask_0 as _emscripten_bind_RayResultCallback_get_m_collisionFilterMask_0,
  emscripten_bind_RayResultCallback_set_m_collisionFilterMask_1 as _emscripten_bind_RayResultCallback_set_m_collisionFilterMask_1,
  emscripten_bind_RayResultCallback_get_m_closestHitFraction_0 as _emscripten_bind_RayResultCallback_get_m_closestHitFraction_0,
  emscripten_bind_RayResultCallback_set_m_closestHitFraction_1 as _emscripten_bind_RayResultCallback_set_m_closestHitFraction_1,
  emscripten_bind_RayResultCallback_get_m_collisionObject_0 as _emscripten_bind_RayResultCallback_get_m_collisionObject_0,
  emscripten_bind_RayResultCallback_set_m_collisionObject_1 as _emscripten_bind_RayResultCallback_set_m_collisionObject_1,
  emscripten_bind_RayResultCallback_get_m_flags_0 as _emscripten_bind_RayResultCallback_get_m_flags_0,
  emscripten_bind_RayResultCallback_set_m_flags_1 as _emscripten_bind_RayResultCallback_set_m_flags_1,
  emscripten_bind_RayResultCallback___destroy___0 as _emscripten_bind_RayResultCallback___destroy___0,
  emscripten_bind_ContactResultCallback_addSingleResult_7 as _emscripten_bind_ContactResultCallback_addSingleResult_7,
  emscripten_bind_ContactResultCallback___destroy___0 as _emscripten_bind_ContactResultCallback___destroy___0,
  emscripten_bind_ConvexResultCallback_hasHit_0 as _emscripten_bind_ConvexResultCallback_hasHit_0,
  emscripten_bind_ConvexResultCallback_get_m_collisionFilterGroup_0 as _emscripten_bind_ConvexResultCallback_get_m_collisionFilterGroup_0,
  emscripten_bind_ConvexResultCallback_set_m_collisionFilterGroup_1 as _emscripten_bind_ConvexResultCallback_set_m_collisionFilterGroup_1,
  emscripten_bind_ConvexResultCallback_get_m_collisionFilterMask_0 as _emscripten_bind_ConvexResultCallback_get_m_collisionFilterMask_0,
  emscripten_bind_ConvexResultCallback_set_m_collisionFilterMask_1 as _emscripten_bind_ConvexResultCallback_set_m_collisionFilterMask_1,
  emscripten_bind_ConvexResultCallback_get_m_closestHitFraction_0 as _emscripten_bind_ConvexResultCallback_get_m_closestHitFraction_0,
  emscripten_bind_ConvexResultCallback_set_m_closestHitFraction_1 as _emscripten_bind_ConvexResultCallback_set_m_closestHitFraction_1,
  emscripten_bind_ConvexResultCallback___destroy___0 as _emscripten_bind_ConvexResultCallback___destroy___0,
  emscripten_bind_btConvexShape_setLocalScaling_1 as _emscripten_bind_btConvexShape_setLocalScaling_1,
  emscripten_bind_btConvexShape_getLocalScaling_0 as _emscripten_bind_btConvexShape_getLocalScaling_0,
  emscripten_bind_btConvexShape_calculateLocalInertia_2 as _emscripten_bind_btConvexShape_calculateLocalInertia_2,
  emscripten_bind_btConvexShape_setMargin_1 as _emscripten_bind_btConvexShape_setMargin_1,
  emscripten_bind_btConvexShape_getMargin_0 as _emscripten_bind_btConvexShape_getMargin_0,
  emscripten_bind_btConvexShape___destroy___0 as _emscripten_bind_btConvexShape___destroy___0,
  emscripten_bind_btCapsuleShape_btCapsuleShape_2 as _emscripten_bind_btCapsuleShape_btCapsuleShape_2,
  emscripten_bind_btCapsuleShape_setMargin_1 as _emscripten_bind_btCapsuleShape_setMargin_1,
  emscripten_bind_btCapsuleShape_getMargin_0 as _emscripten_bind_btCapsuleShape_getMargin_0,
  emscripten_bind_btCapsuleShape_getUpAxis_0 as _emscripten_bind_btCapsuleShape_getUpAxis_0,
  emscripten_bind_btCapsuleShape_getRadius_0 as _emscripten_bind_btCapsuleShape_getRadius_0,
  emscripten_bind_btCapsuleShape_getHalfHeight_0 as _emscripten_bind_btCapsuleShape_getHalfHeight_0,
  emscripten_bind_btCapsuleShape_setLocalScaling_1 as _emscripten_bind_btCapsuleShape_setLocalScaling_1,
  emscripten_bind_btCapsuleShape_getLocalScaling_0 as _emscripten_bind_btCapsuleShape_getLocalScaling_0,
  emscripten_bind_btCapsuleShape_calculateLocalInertia_2 as _emscripten_bind_btCapsuleShape_calculateLocalInertia_2,
  emscripten_bind_btCapsuleShape___destroy___0 as _emscripten_bind_btCapsuleShape___destroy___0,
  emscripten_bind_btCylinderShape_btCylinderShape_1 as _emscripten_bind_btCylinderShape_btCylinderShape_1,
  emscripten_bind_btCylinderShape_setMargin_1 as _emscripten_bind_btCylinderShape_setMargin_1,
  emscripten_bind_btCylinderShape_getMargin_0 as _emscripten_bind_btCylinderShape_getMargin_0,
  emscripten_bind_btCylinderShape_setLocalScaling_1 as _emscripten_bind_btCylinderShape_setLocalScaling_1,
  emscripten_bind_btCylinderShape_getLocalScaling_0 as _emscripten_bind_btCylinderShape_getLocalScaling_0,
  emscripten_bind_btCylinderShape_calculateLocalInertia_2 as _emscripten_bind_btCylinderShape_calculateLocalInertia_2,
  emscripten_bind_btCylinderShape___destroy___0 as _emscripten_bind_btCylinderShape___destroy___0,
  emscripten_bind_btConeShape_btConeShape_2 as _emscripten_bind_btConeShape_btConeShape_2,
  emscripten_bind_btConeShape_setLocalScaling_1 as _emscripten_bind_btConeShape_setLocalScaling_1,
  emscripten_bind_btConeShape_getLocalScaling_0 as _emscripten_bind_btConeShape_getLocalScaling_0,
  emscripten_bind_btConeShape_calculateLocalInertia_2 as _emscripten_bind_btConeShape_calculateLocalInertia_2,
  emscripten_bind_btConeShape___destroy___0 as _emscripten_bind_btConeShape___destroy___0,
  emscripten_bind_btStridingMeshInterface_setScaling_1 as _emscripten_bind_btStridingMeshInterface_setScaling_1,
  emscripten_bind_btStridingMeshInterface___destroy___0 as _emscripten_bind_btStridingMeshInterface___destroy___0,
  emscripten_bind_btTriangleMeshShape_setLocalScaling_1 as _emscripten_bind_btTriangleMeshShape_setLocalScaling_1,
  emscripten_bind_btTriangleMeshShape_getLocalScaling_0 as _emscripten_bind_btTriangleMeshShape_getLocalScaling_0,
  emscripten_bind_btTriangleMeshShape_calculateLocalInertia_2 as _emscripten_bind_btTriangleMeshShape_calculateLocalInertia_2,
  emscripten_bind_btTriangleMeshShape___destroy___0 as _emscripten_bind_btTriangleMeshShape___destroy___0,
  emscripten_bind_btPrimitiveManagerBase_is_trimesh_0 as _emscripten_bind_btPrimitiveManagerBase_is_trimesh_0,
  emscripten_bind_btPrimitiveManagerBase_get_primitive_count_0 as _emscripten_bind_btPrimitiveManagerBase_get_primitive_count_0,
  emscripten_bind_btPrimitiveManagerBase_get_primitive_box_2 as _emscripten_bind_btPrimitiveManagerBase_get_primitive_box_2,
  emscripten_bind_btPrimitiveManagerBase_get_primitive_triangle_2 as _emscripten_bind_btPrimitiveManagerBase_get_primitive_triangle_2,
  emscripten_bind_btPrimitiveManagerBase___destroy___0 as _emscripten_bind_btPrimitiveManagerBase___destroy___0,
  emscripten_bind_btGImpactShapeInterface_updateBound_0 as _emscripten_bind_btGImpactShapeInterface_updateBound_0,
  emscripten_bind_btGImpactShapeInterface_postUpdate_0 as _emscripten_bind_btGImpactShapeInterface_postUpdate_0,
  emscripten_bind_btGImpactShapeInterface_getShapeType_0 as _emscripten_bind_btGImpactShapeInterface_getShapeType_0,
  emscripten_bind_btGImpactShapeInterface_getName_0 as _emscripten_bind_btGImpactShapeInterface_getName_0,
  emscripten_bind_btGImpactShapeInterface_getGImpactShapeType_0 as _emscripten_bind_btGImpactShapeInterface_getGImpactShapeType_0,
  emscripten_bind_btGImpactShapeInterface_getPrimitiveManager_0 as _emscripten_bind_btGImpactShapeInterface_getPrimitiveManager_0,
  emscripten_bind_btGImpactShapeInterface_getNumChildShapes_0 as _emscripten_bind_btGImpactShapeInterface_getNumChildShapes_0,
  emscripten_bind_btGImpactShapeInterface_childrenHasTransform_0 as _emscripten_bind_btGImpactShapeInterface_childrenHasTransform_0,
  emscripten_bind_btGImpactShapeInterface_needsRetrieveTriangles_0 as _emscripten_bind_btGImpactShapeInterface_needsRetrieveTriangles_0,
  emscripten_bind_btGImpactShapeInterface_needsRetrieveTetrahedrons_0 as _emscripten_bind_btGImpactShapeInterface_needsRetrieveTetrahedrons_0,
  emscripten_bind_btGImpactShapeInterface_getBulletTriangle_2 as _emscripten_bind_btGImpactShapeInterface_getBulletTriangle_2,
  emscripten_bind_btGImpactShapeInterface_getBulletTetrahedron_2 as _emscripten_bind_btGImpactShapeInterface_getBulletTetrahedron_2,
  emscripten_bind_btGImpactShapeInterface_getChildShape_1 as _emscripten_bind_btGImpactShapeInterface_getChildShape_1,
  emscripten_bind_btGImpactShapeInterface_getChildTransform_1 as _emscripten_bind_btGImpactShapeInterface_getChildTransform_1,
  emscripten_bind_btGImpactShapeInterface_setChildTransform_2 as _emscripten_bind_btGImpactShapeInterface_setChildTransform_2,
  emscripten_bind_btGImpactShapeInterface_setLocalScaling_1 as _emscripten_bind_btGImpactShapeInterface_setLocalScaling_1,
  emscripten_bind_btGImpactShapeInterface_getLocalScaling_0 as _emscripten_bind_btGImpactShapeInterface_getLocalScaling_0,
  emscripten_bind_btGImpactShapeInterface_calculateLocalInertia_2 as _emscripten_bind_btGImpactShapeInterface_calculateLocalInertia_2,
  emscripten_bind_btGImpactShapeInterface___destroy___0 as _emscripten_bind_btGImpactShapeInterface___destroy___0,
  emscripten_bind_btActivatingCollisionAlgorithm___destroy___0 as _emscripten_bind_btActivatingCollisionAlgorithm___destroy___0,
  emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_0 as _emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_0,
  emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_1 as _emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_1,
  emscripten_bind_btDefaultCollisionConfiguration___destroy___0 as _emscripten_bind_btDefaultCollisionConfiguration___destroy___0,
  emscripten_bind_btDispatcher_getNumManifolds_0 as _emscripten_bind_btDispatcher_getNumManifolds_0,
  emscripten_bind_btDispatcher_getManifoldByIndexInternal_1 as _emscripten_bind_btDispatcher_getManifoldByIndexInternal_1,
  emscripten_bind_btDispatcher___destroy___0 as _emscripten_bind_btDispatcher___destroy___0,
  emscripten_bind_btBroadphaseInterface_getOverlappingPairCache_0 as _emscripten_bind_btBroadphaseInterface_getOverlappingPairCache_0,
  emscripten_bind_btBroadphaseInterface___destroy___0 as _emscripten_bind_btBroadphaseInterface___destroy___0,
  emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_3 as _emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_3,
  emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_5 as _emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_5,
  emscripten_bind_btGeneric6DofConstraint_setLinearLowerLimit_1 as _emscripten_bind_btGeneric6DofConstraint_setLinearLowerLimit_1,
  emscripten_bind_btGeneric6DofConstraint_setLinearUpperLimit_1 as _emscripten_bind_btGeneric6DofConstraint_setLinearUpperLimit_1,
  emscripten_bind_btGeneric6DofConstraint_setAngularLowerLimit_1 as _emscripten_bind_btGeneric6DofConstraint_setAngularLowerLimit_1,
  emscripten_bind_btGeneric6DofConstraint_setAngularUpperLimit_1 as _emscripten_bind_btGeneric6DofConstraint_setAngularUpperLimit_1,
  emscripten_bind_btGeneric6DofConstraint_getFrameOffsetA_0 as _emscripten_bind_btGeneric6DofConstraint_getFrameOffsetA_0,
  emscripten_bind_btGeneric6DofConstraint_enableFeedback_1 as _emscripten_bind_btGeneric6DofConstraint_enableFeedback_1,
  emscripten_bind_btGeneric6DofConstraint_getBreakingImpulseThreshold_0 as _emscripten_bind_btGeneric6DofConstraint_getBreakingImpulseThreshold_0,
  emscripten_bind_btGeneric6DofConstraint_setBreakingImpulseThreshold_1 as _emscripten_bind_btGeneric6DofConstraint_setBreakingImpulseThreshold_1,
  emscripten_bind_btGeneric6DofConstraint_getParam_2 as _emscripten_bind_btGeneric6DofConstraint_getParam_2,
  emscripten_bind_btGeneric6DofConstraint_setParam_3 as _emscripten_bind_btGeneric6DofConstraint_setParam_3,
  emscripten_bind_btGeneric6DofConstraint___destroy___0 as _emscripten_bind_btGeneric6DofConstraint___destroy___0,
  emscripten_bind_btDiscreteDynamicsWorld_btDiscreteDynamicsWorld_4 as _emscripten_bind_btDiscreteDynamicsWorld_btDiscreteDynamicsWorld_4,
  emscripten_bind_btDiscreteDynamicsWorld_setGravity_1 as _emscripten_bind_btDiscreteDynamicsWorld_setGravity_1,
  emscripten_bind_btDiscreteDynamicsWorld_getGravity_0 as _emscripten_bind_btDiscreteDynamicsWorld_getGravity_0,
  emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_1 as _emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_1,
  emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_3 as _emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_3,
  emscripten_bind_btDiscreteDynamicsWorld_removeRigidBody_1 as _emscripten_bind_btDiscreteDynamicsWorld_removeRigidBody_1,
  emscripten_bind_btDiscreteDynamicsWorld_addConstraint_1 as _emscripten_bind_btDiscreteDynamicsWorld_addConstraint_1,
  emscripten_bind_btDiscreteDynamicsWorld_addConstraint_2 as _emscripten_bind_btDiscreteDynamicsWorld_addConstraint_2,
  emscripten_bind_btDiscreteDynamicsWorld_removeConstraint_1 as _emscripten_bind_btDiscreteDynamicsWorld_removeConstraint_1,
  emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_1 as _emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_1,
  emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_2 as _emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_2,
  emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_3 as _emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_3,
  emscripten_bind_btDiscreteDynamicsWorld_setContactAddedCallback_1 as _emscripten_bind_btDiscreteDynamicsWorld_setContactAddedCallback_1,
  emscripten_bind_btDiscreteDynamicsWorld_setContactProcessedCallback_1 as _emscripten_bind_btDiscreteDynamicsWorld_setContactProcessedCallback_1,
  emscripten_bind_btDiscreteDynamicsWorld_setContactDestroyedCallback_1 as _emscripten_bind_btDiscreteDynamicsWorld_setContactDestroyedCallback_1,
  emscripten_bind_btDiscreteDynamicsWorld_getDispatcher_0 as _emscripten_bind_btDiscreteDynamicsWorld_getDispatcher_0,
  emscripten_bind_btDiscreteDynamicsWorld_rayTest_3 as _emscripten_bind_btDiscreteDynamicsWorld_rayTest_3,
  emscripten_bind_btDiscreteDynamicsWorld_getPairCache_0 as _emscripten_bind_btDiscreteDynamicsWorld_getPairCache_0,
  emscripten_bind_btDiscreteDynamicsWorld_getDispatchInfo_0 as _emscripten_bind_btDiscreteDynamicsWorld_getDispatchInfo_0,
  emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_1 as _emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_1,
  emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_2 as _emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_2,
  emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_3 as _emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_3,
  emscripten_bind_btDiscreteDynamicsWorld_removeCollisionObject_1 as _emscripten_bind_btDiscreteDynamicsWorld_removeCollisionObject_1,
  emscripten_bind_btDiscreteDynamicsWorld_getBroadphase_0 as _emscripten_bind_btDiscreteDynamicsWorld_getBroadphase_0,
  emscripten_bind_btDiscreteDynamicsWorld_convexSweepTest_5 as _emscripten_bind_btDiscreteDynamicsWorld_convexSweepTest_5,
  emscripten_bind_btDiscreteDynamicsWorld_contactPairTest_3 as _emscripten_bind_btDiscreteDynamicsWorld_contactPairTest_3,
  emscripten_bind_btDiscreteDynamicsWorld_contactTest_2 as _emscripten_bind_btDiscreteDynamicsWorld_contactTest_2,
  emscripten_bind_btDiscreteDynamicsWorld_setForceUpdateAllAabbs_1 as _emscripten_bind_btDiscreteDynamicsWorld_setForceUpdateAllAabbs_1,
  emscripten_bind_btDiscreteDynamicsWorld_updateSingleAabb_1 as _emscripten_bind_btDiscreteDynamicsWorld_updateSingleAabb_1,
  emscripten_bind_btDiscreteDynamicsWorld_setDebugDrawer_1 as _emscripten_bind_btDiscreteDynamicsWorld_setDebugDrawer_1,
  emscripten_bind_btDiscreteDynamicsWorld_getDebugDrawer_0 as _emscripten_bind_btDiscreteDynamicsWorld_getDebugDrawer_0,
  emscripten_bind_btDiscreteDynamicsWorld_debugDrawWorld_0 as _emscripten_bind_btDiscreteDynamicsWorld_debugDrawWorld_0,
  emscripten_bind_btDiscreteDynamicsWorld_debugDrawObject_3 as _emscripten_bind_btDiscreteDynamicsWorld_debugDrawObject_3,
  emscripten_bind_btDiscreteDynamicsWorld_addAction_1 as _emscripten_bind_btDiscreteDynamicsWorld_addAction_1,
  emscripten_bind_btDiscreteDynamicsWorld_removeAction_1 as _emscripten_bind_btDiscreteDynamicsWorld_removeAction_1,
  emscripten_bind_btDiscreteDynamicsWorld_getSolverInfo_0 as _emscripten_bind_btDiscreteDynamicsWorld_getSolverInfo_0,
  emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_1 as _emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_1,
  emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_2 as _emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_2,
  emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_3 as _emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_3,
  emscripten_bind_btDiscreteDynamicsWorld___destroy___0 as _emscripten_bind_btDiscreteDynamicsWorld___destroy___0,
  emscripten_bind_btVehicleRaycaster_castRay_3 as _emscripten_bind_btVehicleRaycaster_castRay_3,
  emscripten_bind_btVehicleRaycaster___destroy___0 as _emscripten_bind_btVehicleRaycaster___destroy___0,
  emscripten_bind_btActionInterface_updateAction_2 as _emscripten_bind_btActionInterface_updateAction_2,
  emscripten_bind_btActionInterface___destroy___0 as _emscripten_bind_btActionInterface___destroy___0,
  emscripten_bind_btGhostObject_btGhostObject_0 as _emscripten_bind_btGhostObject_btGhostObject_0,
  emscripten_bind_btGhostObject_getNumOverlappingObjects_0 as _emscripten_bind_btGhostObject_getNumOverlappingObjects_0,
  emscripten_bind_btGhostObject_getOverlappingObject_1 as _emscripten_bind_btGhostObject_getOverlappingObject_1,
  emscripten_bind_btGhostObject_setAnisotropicFriction_2 as _emscripten_bind_btGhostObject_setAnisotropicFriction_2,
  emscripten_bind_btGhostObject_getCollisionShape_0 as _emscripten_bind_btGhostObject_getCollisionShape_0,
  emscripten_bind_btGhostObject_setContactProcessingThreshold_1 as _emscripten_bind_btGhostObject_setContactProcessingThreshold_1,
  emscripten_bind_btGhostObject_setActivationState_1 as _emscripten_bind_btGhostObject_setActivationState_1,
  emscripten_bind_btGhostObject_forceActivationState_1 as _emscripten_bind_btGhostObject_forceActivationState_1,
  emscripten_bind_btGhostObject_activate_0 as _emscripten_bind_btGhostObject_activate_0,
  emscripten_bind_btGhostObject_activate_1 as _emscripten_bind_btGhostObject_activate_1,
  emscripten_bind_btGhostObject_isActive_0 as _emscripten_bind_btGhostObject_isActive_0,
  emscripten_bind_btGhostObject_isKinematicObject_0 as _emscripten_bind_btGhostObject_isKinematicObject_0,
  emscripten_bind_btGhostObject_isStaticObject_0 as _emscripten_bind_btGhostObject_isStaticObject_0,
  emscripten_bind_btGhostObject_isStaticOrKinematicObject_0 as _emscripten_bind_btGhostObject_isStaticOrKinematicObject_0,
  emscripten_bind_btGhostObject_getRestitution_0 as _emscripten_bind_btGhostObject_getRestitution_0,
  emscripten_bind_btGhostObject_getFriction_0 as _emscripten_bind_btGhostObject_getFriction_0,
  emscripten_bind_btGhostObject_getRollingFriction_0 as _emscripten_bind_btGhostObject_getRollingFriction_0,
  emscripten_bind_btGhostObject_setRestitution_1 as _emscripten_bind_btGhostObject_setRestitution_1,
  emscripten_bind_btGhostObject_setFriction_1 as _emscripten_bind_btGhostObject_setFriction_1,
  emscripten_bind_btGhostObject_setRollingFriction_1 as _emscripten_bind_btGhostObject_setRollingFriction_1,
  emscripten_bind_btGhostObject_getWorldTransform_0 as _emscripten_bind_btGhostObject_getWorldTransform_0,
  emscripten_bind_btGhostObject_getCollisionFlags_0 as _emscripten_bind_btGhostObject_getCollisionFlags_0,
  emscripten_bind_btGhostObject_setCollisionFlags_1 as _emscripten_bind_btGhostObject_setCollisionFlags_1,
  emscripten_bind_btGhostObject_setWorldTransform_1 as _emscripten_bind_btGhostObject_setWorldTransform_1,
  emscripten_bind_btGhostObject_setCollisionShape_1 as _emscripten_bind_btGhostObject_setCollisionShape_1,
  emscripten_bind_btGhostObject_setCcdMotionThreshold_1 as _emscripten_bind_btGhostObject_setCcdMotionThreshold_1,
  emscripten_bind_btGhostObject_setCcdSweptSphereRadius_1 as _emscripten_bind_btGhostObject_setCcdSweptSphereRadius_1,
  emscripten_bind_btGhostObject_getUserIndex_0 as _emscripten_bind_btGhostObject_getUserIndex_0,
  emscripten_bind_btGhostObject_setUserIndex_1 as _emscripten_bind_btGhostObject_setUserIndex_1,
  emscripten_bind_btGhostObject_getUserPointer_0 as _emscripten_bind_btGhostObject_getUserPointer_0,
  emscripten_bind_btGhostObject_setUserPointer_1 as _emscripten_bind_btGhostObject_setUserPointer_1,
  emscripten_bind_btGhostObject_getBroadphaseHandle_0 as _emscripten_bind_btGhostObject_getBroadphaseHandle_0,
  emscripten_bind_btGhostObject___destroy___0 as _emscripten_bind_btGhostObject___destroy___0,
  emscripten_bind_btSoftBodySolver___destroy___0 as _emscripten_bind_btSoftBodySolver___destroy___0,
  emscripten_bind_VoidPtr___destroy___0 as _emscripten_bind_VoidPtr___destroy___0,
  emscripten_bind_DebugDrawer_DebugDrawer_0 as _emscripten_bind_DebugDrawer_DebugDrawer_0,
  emscripten_bind_DebugDrawer_drawLine_3 as _emscripten_bind_DebugDrawer_drawLine_3,
  emscripten_bind_DebugDrawer_drawContactPoint_5 as _emscripten_bind_DebugDrawer_drawContactPoint_5,
  emscripten_bind_DebugDrawer_reportErrorWarning_1 as _emscripten_bind_DebugDrawer_reportErrorWarning_1,
  emscripten_bind_DebugDrawer_draw3dText_2 as _emscripten_bind_DebugDrawer_draw3dText_2,
  emscripten_bind_DebugDrawer_setDebugMode_1 as _emscripten_bind_DebugDrawer_setDebugMode_1,
  emscripten_bind_DebugDrawer_getDebugMode_0 as _emscripten_bind_DebugDrawer_getDebugMode_0,
  emscripten_bind_DebugDrawer___destroy___0 as _emscripten_bind_DebugDrawer___destroy___0,
  emscripten_bind_btVector4_btVector4_0 as _emscripten_bind_btVector4_btVector4_0,
  emscripten_bind_btVector4_btVector4_4 as _emscripten_bind_btVector4_btVector4_4,
  emscripten_bind_btVector4_w_0 as _emscripten_bind_btVector4_w_0,
  emscripten_bind_btVector4_setValue_4 as _emscripten_bind_btVector4_setValue_4,
  emscripten_bind_btVector4_length_0 as _emscripten_bind_btVector4_length_0,
  emscripten_bind_btVector4_length2_0 as _emscripten_bind_btVector4_length2_0,
  emscripten_bind_btVector4_x_0 as _emscripten_bind_btVector4_x_0,
  emscripten_bind_btVector4_y_0 as _emscripten_bind_btVector4_y_0,
  emscripten_bind_btVector4_z_0 as _emscripten_bind_btVector4_z_0,
  emscripten_bind_btVector4_setX_1 as _emscripten_bind_btVector4_setX_1,
  emscripten_bind_btVector4_setY_1 as _emscripten_bind_btVector4_setY_1,
  emscripten_bind_btVector4_setZ_1 as _emscripten_bind_btVector4_setZ_1,
  emscripten_bind_btVector4_normalize_0 as _emscripten_bind_btVector4_normalize_0,
  emscripten_bind_btVector4_rotate_2 as _emscripten_bind_btVector4_rotate_2,
  emscripten_bind_btVector4_dot_1 as _emscripten_bind_btVector4_dot_1,
  emscripten_bind_btVector4_op_mul_1 as _emscripten_bind_btVector4_op_mul_1,
  emscripten_bind_btVector4_op_add_1 as _emscripten_bind_btVector4_op_add_1,
  emscripten_bind_btVector4_op_sub_1 as _emscripten_bind_btVector4_op_sub_1,
  emscripten_bind_btVector4___destroy___0 as _emscripten_bind_btVector4___destroy___0,
  emscripten_bind_btQuaternion_btQuaternion_4 as _emscripten_bind_btQuaternion_btQuaternion_4,
  emscripten_bind_btQuaternion_setValue_4 as _emscripten_bind_btQuaternion_setValue_4,
  emscripten_bind_btQuaternion_setEulerZYX_3 as _emscripten_bind_btQuaternion_setEulerZYX_3,
  emscripten_bind_btQuaternion_setRotation_2 as _emscripten_bind_btQuaternion_setRotation_2,
  emscripten_bind_btQuaternion_normalize_0 as _emscripten_bind_btQuaternion_normalize_0,
  emscripten_bind_btQuaternion_length2_0 as _emscripten_bind_btQuaternion_length2_0,
  emscripten_bind_btQuaternion_length_0 as _emscripten_bind_btQuaternion_length_0,
  emscripten_bind_btQuaternion_dot_1 as _emscripten_bind_btQuaternion_dot_1,
  emscripten_bind_btQuaternion_normalized_0 as _emscripten_bind_btQuaternion_normalized_0,
  emscripten_bind_btQuaternion_getAxis_0 as _emscripten_bind_btQuaternion_getAxis_0,
  emscripten_bind_btQuaternion_inverse_0 as _emscripten_bind_btQuaternion_inverse_0,
  emscripten_bind_btQuaternion_getAngle_0 as _emscripten_bind_btQuaternion_getAngle_0,
  emscripten_bind_btQuaternion_getAngleShortestPath_0 as _emscripten_bind_btQuaternion_getAngleShortestPath_0,
  emscripten_bind_btQuaternion_angle_1 as _emscripten_bind_btQuaternion_angle_1,
  emscripten_bind_btQuaternion_angleShortestPath_1 as _emscripten_bind_btQuaternion_angleShortestPath_1,
  emscripten_bind_btQuaternion_op_add_1 as _emscripten_bind_btQuaternion_op_add_1,
  emscripten_bind_btQuaternion_op_sub_1 as _emscripten_bind_btQuaternion_op_sub_1,
  emscripten_bind_btQuaternion_op_mul_1 as _emscripten_bind_btQuaternion_op_mul_1,
  emscripten_bind_btQuaternion_op_mulq_1 as _emscripten_bind_btQuaternion_op_mulq_1,
  emscripten_bind_btQuaternion_op_div_1 as _emscripten_bind_btQuaternion_op_div_1,
  emscripten_bind_btQuaternion_x_0 as _emscripten_bind_btQuaternion_x_0,
  emscripten_bind_btQuaternion_y_0 as _emscripten_bind_btQuaternion_y_0,
  emscripten_bind_btQuaternion_z_0 as _emscripten_bind_btQuaternion_z_0,
  emscripten_bind_btQuaternion_w_0 as _emscripten_bind_btQuaternion_w_0,
  emscripten_bind_btQuaternion_setX_1 as _emscripten_bind_btQuaternion_setX_1,
  emscripten_bind_btQuaternion_setY_1 as _emscripten_bind_btQuaternion_setY_1,
  emscripten_bind_btQuaternion_setZ_1 as _emscripten_bind_btQuaternion_setZ_1,
  emscripten_bind_btQuaternion_setW_1 as _emscripten_bind_btQuaternion_setW_1,
  emscripten_bind_btQuaternion___destroy___0 as _emscripten_bind_btQuaternion___destroy___0,
  emscripten_bind_btMatrix3x3_setEulerZYX_3 as _emscripten_bind_btMatrix3x3_setEulerZYX_3,
  emscripten_bind_btMatrix3x3_getRotation_1 as _emscripten_bind_btMatrix3x3_getRotation_1,
  emscripten_bind_btMatrix3x3_getRow_1 as _emscripten_bind_btMatrix3x3_getRow_1,
  emscripten_bind_btMatrix3x3___destroy___0 as _emscripten_bind_btMatrix3x3___destroy___0,
  emscripten_bind_btTransform_btTransform_0 as _emscripten_bind_btTransform_btTransform_0,
  emscripten_bind_btTransform_btTransform_2 as _emscripten_bind_btTransform_btTransform_2,
  emscripten_bind_btTransform_setIdentity_0 as _emscripten_bind_btTransform_setIdentity_0,
  emscripten_bind_btTransform_setOrigin_1 as _emscripten_bind_btTransform_setOrigin_1,
  emscripten_bind_btTransform_setRotation_1 as _emscripten_bind_btTransform_setRotation_1,
  emscripten_bind_btTransform_getOrigin_0 as _emscripten_bind_btTransform_getOrigin_0,
  emscripten_bind_btTransform_getRotation_0 as _emscripten_bind_btTransform_getRotation_0,
  emscripten_bind_btTransform_getBasis_0 as _emscripten_bind_btTransform_getBasis_0,
  emscripten_bind_btTransform_setFromOpenGLMatrix_1 as _emscripten_bind_btTransform_setFromOpenGLMatrix_1,
  emscripten_bind_btTransform_inverse_0 as _emscripten_bind_btTransform_inverse_0,
  emscripten_bind_btTransform_op_mul_1 as _emscripten_bind_btTransform_op_mul_1,
  emscripten_bind_btTransform___destroy___0 as _emscripten_bind_btTransform___destroy___0,
  emscripten_bind_MotionState_MotionState_0 as _emscripten_bind_MotionState_MotionState_0,
  emscripten_bind_MotionState_getWorldTransform_1 as _emscripten_bind_MotionState_getWorldTransform_1,
  emscripten_bind_MotionState_setWorldTransform_1 as _emscripten_bind_MotionState_setWorldTransform_1,
  emscripten_bind_MotionState___destroy___0 as _emscripten_bind_MotionState___destroy___0,
  emscripten_bind_btDefaultMotionState_btDefaultMotionState_0 as _emscripten_bind_btDefaultMotionState_btDefaultMotionState_0,
  emscripten_bind_btDefaultMotionState_btDefaultMotionState_1 as _emscripten_bind_btDefaultMotionState_btDefaultMotionState_1,
  emscripten_bind_btDefaultMotionState_btDefaultMotionState_2 as _emscripten_bind_btDefaultMotionState_btDefaultMotionState_2,
  emscripten_bind_btDefaultMotionState_getWorldTransform_1 as _emscripten_bind_btDefaultMotionState_getWorldTransform_1,
  emscripten_bind_btDefaultMotionState_setWorldTransform_1 as _emscripten_bind_btDefaultMotionState_setWorldTransform_1,
  emscripten_bind_btDefaultMotionState_get_m_graphicsWorldTrans_0 as _emscripten_bind_btDefaultMotionState_get_m_graphicsWorldTrans_0,
  emscripten_bind_btDefaultMotionState_set_m_graphicsWorldTrans_1 as _emscripten_bind_btDefaultMotionState_set_m_graphicsWorldTrans_1,
  emscripten_bind_btDefaultMotionState___destroy___0 as _emscripten_bind_btDefaultMotionState___destroy___0,
  emscripten_bind_btCollisionObjectWrapper_getWorldTransform_0 as _emscripten_bind_btCollisionObjectWrapper_getWorldTransform_0,
  emscripten_bind_btCollisionObjectWrapper_getCollisionObject_0 as _emscripten_bind_btCollisionObjectWrapper_getCollisionObject_0,
  emscripten_bind_btCollisionObjectWrapper_getCollisionShape_0 as _emscripten_bind_btCollisionObjectWrapper_getCollisionShape_0,
  emscripten_bind_ClosestRayResultCallback_ClosestRayResultCallback_2 as _emscripten_bind_ClosestRayResultCallback_ClosestRayResultCallback_2,
  emscripten_bind_ClosestRayResultCallback_hasHit_0 as _emscripten_bind_ClosestRayResultCallback_hasHit_0,
  emscripten_bind_ClosestRayResultCallback_get_m_rayFromWorld_0 as _emscripten_bind_ClosestRayResultCallback_get_m_rayFromWorld_0,
  emscripten_bind_ClosestRayResultCallback_set_m_rayFromWorld_1 as _emscripten_bind_ClosestRayResultCallback_set_m_rayFromWorld_1,
  emscripten_bind_ClosestRayResultCallback_get_m_rayToWorld_0 as _emscripten_bind_ClosestRayResultCallback_get_m_rayToWorld_0,
  emscripten_bind_ClosestRayResultCallback_set_m_rayToWorld_1 as _emscripten_bind_ClosestRayResultCallback_set_m_rayToWorld_1,
  emscripten_bind_ClosestRayResultCallback_get_m_hitNormalWorld_0 as _emscripten_bind_ClosestRayResultCallback_get_m_hitNormalWorld_0,
  emscripten_bind_ClosestRayResultCallback_set_m_hitNormalWorld_1 as _emscripten_bind_ClosestRayResultCallback_set_m_hitNormalWorld_1,
  emscripten_bind_ClosestRayResultCallback_get_m_hitPointWorld_0 as _emscripten_bind_ClosestRayResultCallback_get_m_hitPointWorld_0,
  emscripten_bind_ClosestRayResultCallback_set_m_hitPointWorld_1 as _emscripten_bind_ClosestRayResultCallback_set_m_hitPointWorld_1,
  emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterGroup_0 as _emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterGroup_0,
  emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterGroup_1 as _emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterGroup_1,
  emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterMask_0 as _emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterMask_0,
  emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterMask_1 as _emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterMask_1,
  emscripten_bind_ClosestRayResultCallback_get_m_closestHitFraction_0 as _emscripten_bind_ClosestRayResultCallback_get_m_closestHitFraction_0,
  emscripten_bind_ClosestRayResultCallback_set_m_closestHitFraction_1 as _emscripten_bind_ClosestRayResultCallback_set_m_closestHitFraction_1,
  emscripten_bind_ClosestRayResultCallback_get_m_collisionObject_0 as _emscripten_bind_ClosestRayResultCallback_get_m_collisionObject_0,
  emscripten_bind_ClosestRayResultCallback_set_m_collisionObject_1 as _emscripten_bind_ClosestRayResultCallback_set_m_collisionObject_1,
  emscripten_bind_ClosestRayResultCallback_get_m_flags_0 as _emscripten_bind_ClosestRayResultCallback_get_m_flags_0,
  emscripten_bind_ClosestRayResultCallback_set_m_flags_1 as _emscripten_bind_ClosestRayResultCallback_set_m_flags_1,
  emscripten_bind_ClosestRayResultCallback___destroy___0 as _emscripten_bind_ClosestRayResultCallback___destroy___0,
  emscripten_bind_btConstCollisionObjectArray_size_0 as _emscripten_bind_btConstCollisionObjectArray_size_0,
  emscripten_bind_btConstCollisionObjectArray_at_1 as _emscripten_bind_btConstCollisionObjectArray_at_1,
  emscripten_bind_btConstCollisionObjectArray___destroy___0 as _emscripten_bind_btConstCollisionObjectArray___destroy___0,
  emscripten_bind_btScalarArray_size_0 as _emscripten_bind_btScalarArray_size_0,
  emscripten_bind_btScalarArray_at_1 as _emscripten_bind_btScalarArray_at_1,
  emscripten_bind_btScalarArray___destroy___0 as _emscripten_bind_btScalarArray___destroy___0,
  emscripten_bind_AllHitsRayResultCallback_AllHitsRayResultCallback_2 as _emscripten_bind_AllHitsRayResultCallback_AllHitsRayResultCallback_2,
  emscripten_bind_AllHitsRayResultCallback_hasHit_0 as _emscripten_bind_AllHitsRayResultCallback_hasHit_0,
  emscripten_bind_AllHitsRayResultCallback_get_m_collisionObjects_0 as _emscripten_bind_AllHitsRayResultCallback_get_m_collisionObjects_0,
  emscripten_bind_AllHitsRayResultCallback_set_m_collisionObjects_1 as _emscripten_bind_AllHitsRayResultCallback_set_m_collisionObjects_1,
  emscripten_bind_AllHitsRayResultCallback_get_m_rayFromWorld_0 as _emscripten_bind_AllHitsRayResultCallback_get_m_rayFromWorld_0,
  emscripten_bind_AllHitsRayResultCallback_set_m_rayFromWorld_1 as _emscripten_bind_AllHitsRayResultCallback_set_m_rayFromWorld_1,
  emscripten_bind_AllHitsRayResultCallback_get_m_rayToWorld_0 as _emscripten_bind_AllHitsRayResultCallback_get_m_rayToWorld_0,
  emscripten_bind_AllHitsRayResultCallback_set_m_rayToWorld_1 as _emscripten_bind_AllHitsRayResultCallback_set_m_rayToWorld_1,
  emscripten_bind_AllHitsRayResultCallback_get_m_hitNormalWorld_0 as _emscripten_bind_AllHitsRayResultCallback_get_m_hitNormalWorld_0,
  emscripten_bind_AllHitsRayResultCallback_set_m_hitNormalWorld_1 as _emscripten_bind_AllHitsRayResultCallback_set_m_hitNormalWorld_1,
  emscripten_bind_AllHitsRayResultCallback_get_m_hitPointWorld_0 as _emscripten_bind_AllHitsRayResultCallback_get_m_hitPointWorld_0,
  emscripten_bind_AllHitsRayResultCallback_set_m_hitPointWorld_1 as _emscripten_bind_AllHitsRayResultCallback_set_m_hitPointWorld_1,
  emscripten_bind_AllHitsRayResultCallback_get_m_hitFractions_0 as _emscripten_bind_AllHitsRayResultCallback_get_m_hitFractions_0,
  emscripten_bind_AllHitsRayResultCallback_set_m_hitFractions_1 as _emscripten_bind_AllHitsRayResultCallback_set_m_hitFractions_1,
  emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterGroup_0 as _emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterGroup_0,
  emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterGroup_1 as _emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterGroup_1,
  emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterMask_0 as _emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterMask_0,
  emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterMask_1 as _emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterMask_1,
  emscripten_bind_AllHitsRayResultCallback_get_m_closestHitFraction_0 as _emscripten_bind_AllHitsRayResultCallback_get_m_closestHitFraction_0,
  emscripten_bind_AllHitsRayResultCallback_set_m_closestHitFraction_1 as _emscripten_bind_AllHitsRayResultCallback_set_m_closestHitFraction_1,
  emscripten_bind_AllHitsRayResultCallback_get_m_collisionObject_0 as _emscripten_bind_AllHitsRayResultCallback_get_m_collisionObject_0,
  emscripten_bind_AllHitsRayResultCallback_set_m_collisionObject_1 as _emscripten_bind_AllHitsRayResultCallback_set_m_collisionObject_1,
  emscripten_bind_AllHitsRayResultCallback_get_m_flags_0 as _emscripten_bind_AllHitsRayResultCallback_get_m_flags_0,
  emscripten_bind_AllHitsRayResultCallback_set_m_flags_1 as _emscripten_bind_AllHitsRayResultCallback_set_m_flags_1,
  emscripten_bind_AllHitsRayResultCallback___destroy___0 as _emscripten_bind_AllHitsRayResultCallback___destroy___0,
  emscripten_bind_btManifoldPoint_getPositionWorldOnA_0 as _emscripten_bind_btManifoldPoint_getPositionWorldOnA_0,
  emscripten_bind_btManifoldPoint_getPositionWorldOnB_0 as _emscripten_bind_btManifoldPoint_getPositionWorldOnB_0,
  emscripten_bind_btManifoldPoint_getAppliedImpulse_0 as _emscripten_bind_btManifoldPoint_getAppliedImpulse_0,
  emscripten_bind_btManifoldPoint_getDistance_0 as _emscripten_bind_btManifoldPoint_getDistance_0,
  emscripten_bind_btManifoldPoint_get_m_localPointA_0 as _emscripten_bind_btManifoldPoint_get_m_localPointA_0,
  emscripten_bind_btManifoldPoint_set_m_localPointA_1 as _emscripten_bind_btManifoldPoint_set_m_localPointA_1,
  emscripten_bind_btManifoldPoint_get_m_localPointB_0 as _emscripten_bind_btManifoldPoint_get_m_localPointB_0,
  emscripten_bind_btManifoldPoint_set_m_localPointB_1 as _emscripten_bind_btManifoldPoint_set_m_localPointB_1,
  emscripten_bind_btManifoldPoint_get_m_positionWorldOnB_0 as _emscripten_bind_btManifoldPoint_get_m_positionWorldOnB_0,
  emscripten_bind_btManifoldPoint_set_m_positionWorldOnB_1 as _emscripten_bind_btManifoldPoint_set_m_positionWorldOnB_1,
  emscripten_bind_btManifoldPoint_get_m_positionWorldOnA_0 as _emscripten_bind_btManifoldPoint_get_m_positionWorldOnA_0,
  emscripten_bind_btManifoldPoint_set_m_positionWorldOnA_1 as _emscripten_bind_btManifoldPoint_set_m_positionWorldOnA_1,
  emscripten_bind_btManifoldPoint_get_m_normalWorldOnB_0 as _emscripten_bind_btManifoldPoint_get_m_normalWorldOnB_0,
  emscripten_bind_btManifoldPoint_set_m_normalWorldOnB_1 as _emscripten_bind_btManifoldPoint_set_m_normalWorldOnB_1,
  emscripten_bind_btManifoldPoint_get_m_userPersistentData_0 as _emscripten_bind_btManifoldPoint_get_m_userPersistentData_0,
  emscripten_bind_btManifoldPoint_set_m_userPersistentData_1 as _emscripten_bind_btManifoldPoint_set_m_userPersistentData_1,
  emscripten_bind_btManifoldPoint___destroy___0 as _emscripten_bind_btManifoldPoint___destroy___0,
  emscripten_bind_ConcreteContactResultCallback_ConcreteContactResultCallback_0 as _emscripten_bind_ConcreteContactResultCallback_ConcreteContactResultCallback_0,
  emscripten_bind_ConcreteContactResultCallback_addSingleResult_7 as _emscripten_bind_ConcreteContactResultCallback_addSingleResult_7,
  emscripten_bind_ConcreteContactResultCallback___destroy___0 as _emscripten_bind_ConcreteContactResultCallback___destroy___0,
  emscripten_bind_LocalShapeInfo_get_m_shapePart_0 as _emscripten_bind_LocalShapeInfo_get_m_shapePart_0,
  emscripten_bind_LocalShapeInfo_set_m_shapePart_1 as _emscripten_bind_LocalShapeInfo_set_m_shapePart_1,
  emscripten_bind_LocalShapeInfo_get_m_triangleIndex_0 as _emscripten_bind_LocalShapeInfo_get_m_triangleIndex_0,
  emscripten_bind_LocalShapeInfo_set_m_triangleIndex_1 as _emscripten_bind_LocalShapeInfo_set_m_triangleIndex_1,
  emscripten_bind_LocalShapeInfo___destroy___0 as _emscripten_bind_LocalShapeInfo___destroy___0,
  emscripten_bind_LocalConvexResult_LocalConvexResult_5 as _emscripten_bind_LocalConvexResult_LocalConvexResult_5,
  emscripten_bind_LocalConvexResult_get_m_hitCollisionObject_0 as _emscripten_bind_LocalConvexResult_get_m_hitCollisionObject_0,
  emscripten_bind_LocalConvexResult_set_m_hitCollisionObject_1 as _emscripten_bind_LocalConvexResult_set_m_hitCollisionObject_1,
  emscripten_bind_LocalConvexResult_get_m_localShapeInfo_0 as _emscripten_bind_LocalConvexResult_get_m_localShapeInfo_0,
  emscripten_bind_LocalConvexResult_set_m_localShapeInfo_1 as _emscripten_bind_LocalConvexResult_set_m_localShapeInfo_1,
  emscripten_bind_LocalConvexResult_get_m_hitNormalLocal_0 as _emscripten_bind_LocalConvexResult_get_m_hitNormalLocal_0,
  emscripten_bind_LocalConvexResult_set_m_hitNormalLocal_1 as _emscripten_bind_LocalConvexResult_set_m_hitNormalLocal_1,
  emscripten_bind_LocalConvexResult_get_m_hitPointLocal_0 as _emscripten_bind_LocalConvexResult_get_m_hitPointLocal_0,
  emscripten_bind_LocalConvexResult_set_m_hitPointLocal_1 as _emscripten_bind_LocalConvexResult_set_m_hitPointLocal_1,
  emscripten_bind_LocalConvexResult_get_m_hitFraction_0 as _emscripten_bind_LocalConvexResult_get_m_hitFraction_0,
  emscripten_bind_LocalConvexResult_set_m_hitFraction_1 as _emscripten_bind_LocalConvexResult_set_m_hitFraction_1,
  emscripten_bind_LocalConvexResult___destroy___0 as _emscripten_bind_LocalConvexResult___destroy___0,
  emscripten_bind_ClosestConvexResultCallback_ClosestConvexResultCallback_2 as _emscripten_bind_ClosestConvexResultCallback_ClosestConvexResultCallback_2,
  emscripten_bind_ClosestConvexResultCallback_hasHit_0 as _emscripten_bind_ClosestConvexResultCallback_hasHit_0,
  emscripten_bind_ClosestConvexResultCallback_get_m_hitCollisionObject_0 as _emscripten_bind_ClosestConvexResultCallback_get_m_hitCollisionObject_0,
  emscripten_bind_ClosestConvexResultCallback_set_m_hitCollisionObject_1 as _emscripten_bind_ClosestConvexResultCallback_set_m_hitCollisionObject_1,
  emscripten_bind_ClosestConvexResultCallback_get_m_convexFromWorld_0 as _emscripten_bind_ClosestConvexResultCallback_get_m_convexFromWorld_0,
  emscripten_bind_ClosestConvexResultCallback_set_m_convexFromWorld_1 as _emscripten_bind_ClosestConvexResultCallback_set_m_convexFromWorld_1,
  emscripten_bind_ClosestConvexResultCallback_get_m_convexToWorld_0 as _emscripten_bind_ClosestConvexResultCallback_get_m_convexToWorld_0,
  emscripten_bind_ClosestConvexResultCallback_set_m_convexToWorld_1 as _emscripten_bind_ClosestConvexResultCallback_set_m_convexToWorld_1,
  emscripten_bind_ClosestConvexResultCallback_get_m_hitNormalWorld_0 as _emscripten_bind_ClosestConvexResultCallback_get_m_hitNormalWorld_0,
  emscripten_bind_ClosestConvexResultCallback_set_m_hitNormalWorld_1 as _emscripten_bind_ClosestConvexResultCallback_set_m_hitNormalWorld_1,
  emscripten_bind_ClosestConvexResultCallback_get_m_hitPointWorld_0 as _emscripten_bind_ClosestConvexResultCallback_get_m_hitPointWorld_0,
  emscripten_bind_ClosestConvexResultCallback_set_m_hitPointWorld_1 as _emscripten_bind_ClosestConvexResultCallback_set_m_hitPointWorld_1,
  emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterGroup_0 as _emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterGroup_0,
  emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterGroup_1 as _emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterGroup_1,
  emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterMask_0 as _emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterMask_0,
  emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterMask_1 as _emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterMask_1,
  emscripten_bind_ClosestConvexResultCallback_get_m_closestHitFraction_0 as _emscripten_bind_ClosestConvexResultCallback_get_m_closestHitFraction_0,
  emscripten_bind_ClosestConvexResultCallback_set_m_closestHitFraction_1 as _emscripten_bind_ClosestConvexResultCallback_set_m_closestHitFraction_1,
  emscripten_bind_ClosestConvexResultCallback___destroy___0 as _emscripten_bind_ClosestConvexResultCallback___destroy___0,
  emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_1 as _emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_1,
  emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_2 as _emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_2,
  emscripten_bind_btConvexTriangleMeshShape_setLocalScaling_1 as _emscripten_bind_btConvexTriangleMeshShape_setLocalScaling_1,
  emscripten_bind_btConvexTriangleMeshShape_getLocalScaling_0 as _emscripten_bind_btConvexTriangleMeshShape_getLocalScaling_0,
  emscripten_bind_btConvexTriangleMeshShape_calculateLocalInertia_2 as _emscripten_bind_btConvexTriangleMeshShape_calculateLocalInertia_2,
  emscripten_bind_btConvexTriangleMeshShape_setMargin_1 as _emscripten_bind_btConvexTriangleMeshShape_setMargin_1,
  emscripten_bind_btConvexTriangleMeshShape_getMargin_0 as _emscripten_bind_btConvexTriangleMeshShape_getMargin_0,
  emscripten_bind_btConvexTriangleMeshShape___destroy___0 as _emscripten_bind_btConvexTriangleMeshShape___destroy___0,
  emscripten_bind_btBoxShape_btBoxShape_1 as _emscripten_bind_btBoxShape_btBoxShape_1,
  emscripten_bind_btBoxShape_setMargin_1 as _emscripten_bind_btBoxShape_setMargin_1,
  emscripten_bind_btBoxShape_getMargin_0 as _emscripten_bind_btBoxShape_getMargin_0,
  emscripten_bind_btBoxShape_setLocalScaling_1 as _emscripten_bind_btBoxShape_setLocalScaling_1,
  emscripten_bind_btBoxShape_getLocalScaling_0 as _emscripten_bind_btBoxShape_getLocalScaling_0,
  emscripten_bind_btBoxShape_calculateLocalInertia_2 as _emscripten_bind_btBoxShape_calculateLocalInertia_2,
  emscripten_bind_btBoxShape___destroy___0 as _emscripten_bind_btBoxShape___destroy___0,
  emscripten_bind_btCapsuleShapeX_btCapsuleShapeX_2 as _emscripten_bind_btCapsuleShapeX_btCapsuleShapeX_2,
  emscripten_bind_btCapsuleShapeX_setMargin_1 as _emscripten_bind_btCapsuleShapeX_setMargin_1,
  emscripten_bind_btCapsuleShapeX_getMargin_0 as _emscripten_bind_btCapsuleShapeX_getMargin_0,
  emscripten_bind_btCapsuleShapeX_getUpAxis_0 as _emscripten_bind_btCapsuleShapeX_getUpAxis_0,
  emscripten_bind_btCapsuleShapeX_getRadius_0 as _emscripten_bind_btCapsuleShapeX_getRadius_0,
  emscripten_bind_btCapsuleShapeX_getHalfHeight_0 as _emscripten_bind_btCapsuleShapeX_getHalfHeight_0,
  emscripten_bind_btCapsuleShapeX_setLocalScaling_1 as _emscripten_bind_btCapsuleShapeX_setLocalScaling_1,
  emscripten_bind_btCapsuleShapeX_getLocalScaling_0 as _emscripten_bind_btCapsuleShapeX_getLocalScaling_0,
  emscripten_bind_btCapsuleShapeX_calculateLocalInertia_2 as _emscripten_bind_btCapsuleShapeX_calculateLocalInertia_2,
  emscripten_bind_btCapsuleShapeX___destroy___0 as _emscripten_bind_btCapsuleShapeX___destroy___0,
  emscripten_bind_btCapsuleShapeZ_btCapsuleShapeZ_2 as _emscripten_bind_btCapsuleShapeZ_btCapsuleShapeZ_2,
  emscripten_bind_btCapsuleShapeZ_setMargin_1 as _emscripten_bind_btCapsuleShapeZ_setMargin_1,
  emscripten_bind_btCapsuleShapeZ_getMargin_0 as _emscripten_bind_btCapsuleShapeZ_getMargin_0,
  emscripten_bind_btCapsuleShapeZ_getUpAxis_0 as _emscripten_bind_btCapsuleShapeZ_getUpAxis_0,
  emscripten_bind_btCapsuleShapeZ_getRadius_0 as _emscripten_bind_btCapsuleShapeZ_getRadius_0,
  emscripten_bind_btCapsuleShapeZ_getHalfHeight_0 as _emscripten_bind_btCapsuleShapeZ_getHalfHeight_0,
  emscripten_bind_btCapsuleShapeZ_setLocalScaling_1 as _emscripten_bind_btCapsuleShapeZ_setLocalScaling_1,
  emscripten_bind_btCapsuleShapeZ_getLocalScaling_0 as _emscripten_bind_btCapsuleShapeZ_getLocalScaling_0,
  emscripten_bind_btCapsuleShapeZ_calculateLocalInertia_2 as _emscripten_bind_btCapsuleShapeZ_calculateLocalInertia_2,
  emscripten_bind_btCapsuleShapeZ___destroy___0 as _emscripten_bind_btCapsuleShapeZ___destroy___0,
  emscripten_bind_btCylinderShapeX_btCylinderShapeX_1 as _emscripten_bind_btCylinderShapeX_btCylinderShapeX_1,
  emscripten_bind_btCylinderShapeX_setMargin_1 as _emscripten_bind_btCylinderShapeX_setMargin_1,
  emscripten_bind_btCylinderShapeX_getMargin_0 as _emscripten_bind_btCylinderShapeX_getMargin_0,
  emscripten_bind_btCylinderShapeX_setLocalScaling_1 as _emscripten_bind_btCylinderShapeX_setLocalScaling_1,
  emscripten_bind_btCylinderShapeX_getLocalScaling_0 as _emscripten_bind_btCylinderShapeX_getLocalScaling_0,
  emscripten_bind_btCylinderShapeX_calculateLocalInertia_2 as _emscripten_bind_btCylinderShapeX_calculateLocalInertia_2,
  emscripten_bind_btCylinderShapeX___destroy___0 as _emscripten_bind_btCylinderShapeX___destroy___0,
  emscripten_bind_btCylinderShapeZ_btCylinderShapeZ_1 as _emscripten_bind_btCylinderShapeZ_btCylinderShapeZ_1,
  emscripten_bind_btCylinderShapeZ_setMargin_1 as _emscripten_bind_btCylinderShapeZ_setMargin_1,
  emscripten_bind_btCylinderShapeZ_getMargin_0 as _emscripten_bind_btCylinderShapeZ_getMargin_0,
  emscripten_bind_btCylinderShapeZ_setLocalScaling_1 as _emscripten_bind_btCylinderShapeZ_setLocalScaling_1,
  emscripten_bind_btCylinderShapeZ_getLocalScaling_0 as _emscripten_bind_btCylinderShapeZ_getLocalScaling_0,
  emscripten_bind_btCylinderShapeZ_calculateLocalInertia_2 as _emscripten_bind_btCylinderShapeZ_calculateLocalInertia_2,
  emscripten_bind_btCylinderShapeZ___destroy___0 as _emscripten_bind_btCylinderShapeZ___destroy___0,
  emscripten_bind_btSphereShape_btSphereShape_1 as _emscripten_bind_btSphereShape_btSphereShape_1,
  emscripten_bind_btSphereShape_setMargin_1 as _emscripten_bind_btSphereShape_setMargin_1,
  emscripten_bind_btSphereShape_getMargin_0 as _emscripten_bind_btSphereShape_getMargin_0,
  emscripten_bind_btSphereShape_setLocalScaling_1 as _emscripten_bind_btSphereShape_setLocalScaling_1,
  emscripten_bind_btSphereShape_getLocalScaling_0 as _emscripten_bind_btSphereShape_getLocalScaling_0,
  emscripten_bind_btSphereShape_calculateLocalInertia_2 as _emscripten_bind_btSphereShape_calculateLocalInertia_2,
  emscripten_bind_btSphereShape___destroy___0 as _emscripten_bind_btSphereShape___destroy___0,
  emscripten_bind_btMultiSphereShape_btMultiSphereShape_3 as _emscripten_bind_btMultiSphereShape_btMultiSphereShape_3,
  emscripten_bind_btMultiSphereShape_setLocalScaling_1 as _emscripten_bind_btMultiSphereShape_setLocalScaling_1,
  emscripten_bind_btMultiSphereShape_getLocalScaling_0 as _emscripten_bind_btMultiSphereShape_getLocalScaling_0,
  emscripten_bind_btMultiSphereShape_calculateLocalInertia_2 as _emscripten_bind_btMultiSphereShape_calculateLocalInertia_2,
  emscripten_bind_btMultiSphereShape___destroy___0 as _emscripten_bind_btMultiSphereShape___destroy___0,
  emscripten_bind_btConeShapeX_btConeShapeX_2 as _emscripten_bind_btConeShapeX_btConeShapeX_2,
  emscripten_bind_btConeShapeX_setLocalScaling_1 as _emscripten_bind_btConeShapeX_setLocalScaling_1,
  emscripten_bind_btConeShapeX_getLocalScaling_0 as _emscripten_bind_btConeShapeX_getLocalScaling_0,
  emscripten_bind_btConeShapeX_calculateLocalInertia_2 as _emscripten_bind_btConeShapeX_calculateLocalInertia_2,
  emscripten_bind_btConeShapeX___destroy___0 as _emscripten_bind_btConeShapeX___destroy___0,
  emscripten_bind_btConeShapeZ_btConeShapeZ_2 as _emscripten_bind_btConeShapeZ_btConeShapeZ_2,
  emscripten_bind_btConeShapeZ_setLocalScaling_1 as _emscripten_bind_btConeShapeZ_setLocalScaling_1,
  emscripten_bind_btConeShapeZ_getLocalScaling_0 as _emscripten_bind_btConeShapeZ_getLocalScaling_0,
  emscripten_bind_btConeShapeZ_calculateLocalInertia_2 as _emscripten_bind_btConeShapeZ_calculateLocalInertia_2,
  emscripten_bind_btConeShapeZ___destroy___0 as _emscripten_bind_btConeShapeZ___destroy___0,
  emscripten_bind_btIntArray_size_0 as _emscripten_bind_btIntArray_size_0,
  emscripten_bind_btIntArray_at_1 as _emscripten_bind_btIntArray_at_1,
  emscripten_bind_btIntArray___destroy___0 as _emscripten_bind_btIntArray___destroy___0,
  emscripten_bind_btFace_get_m_indices_0 as _emscripten_bind_btFace_get_m_indices_0,
  emscripten_bind_btFace_set_m_indices_1 as _emscripten_bind_btFace_set_m_indices_1,
  emscripten_bind_btFace_get_m_plane_1 as _emscripten_bind_btFace_get_m_plane_1,
  emscripten_bind_btFace_set_m_plane_2 as _emscripten_bind_btFace_set_m_plane_2,
  emscripten_bind_btFace___destroy___0 as _emscripten_bind_btFace___destroy___0,
  emscripten_bind_btVector3Array_size_0 as _emscripten_bind_btVector3Array_size_0,
  emscripten_bind_btVector3Array_at_1 as _emscripten_bind_btVector3Array_at_1,
  emscripten_bind_btVector3Array___destroy___0 as _emscripten_bind_btVector3Array___destroy___0,
  emscripten_bind_btFaceArray_size_0 as _emscripten_bind_btFaceArray_size_0,
  emscripten_bind_btFaceArray_at_1 as _emscripten_bind_btFaceArray_at_1,
  emscripten_bind_btFaceArray___destroy___0 as _emscripten_bind_btFaceArray___destroy___0,
  emscripten_bind_btConvexPolyhedron_get_m_vertices_0 as _emscripten_bind_btConvexPolyhedron_get_m_vertices_0,
  emscripten_bind_btConvexPolyhedron_set_m_vertices_1 as _emscripten_bind_btConvexPolyhedron_set_m_vertices_1,
  emscripten_bind_btConvexPolyhedron_get_m_faces_0 as _emscripten_bind_btConvexPolyhedron_get_m_faces_0,
  emscripten_bind_btConvexPolyhedron_set_m_faces_1 as _emscripten_bind_btConvexPolyhedron_set_m_faces_1,
  emscripten_bind_btConvexPolyhedron___destroy___0 as _emscripten_bind_btConvexPolyhedron___destroy___0,
  emscripten_bind_btConvexHullShape_btConvexHullShape_0 as _emscripten_bind_btConvexHullShape_btConvexHullShape_0,
  emscripten_bind_btConvexHullShape_btConvexHullShape_1 as _emscripten_bind_btConvexHullShape_btConvexHullShape_1,
  emscripten_bind_btConvexHullShape_btConvexHullShape_2 as _emscripten_bind_btConvexHullShape_btConvexHullShape_2,
  emscripten_bind_btConvexHullShape_addPoint_1 as _emscripten_bind_btConvexHullShape_addPoint_1,
  emscripten_bind_btConvexHullShape_addPoint_2 as _emscripten_bind_btConvexHullShape_addPoint_2,
  emscripten_bind_btConvexHullShape_setMargin_1 as _emscripten_bind_btConvexHullShape_setMargin_1,
  emscripten_bind_btConvexHullShape_getMargin_0 as _emscripten_bind_btConvexHullShape_getMargin_0,
  emscripten_bind_btConvexHullShape_getNumVertices_0 as _emscripten_bind_btConvexHullShape_getNumVertices_0,
  emscripten_bind_btConvexHullShape_initializePolyhedralFeatures_1 as _emscripten_bind_btConvexHullShape_initializePolyhedralFeatures_1,
  emscripten_bind_btConvexHullShape_recalcLocalAabb_0 as _emscripten_bind_btConvexHullShape_recalcLocalAabb_0,
  emscripten_bind_btConvexHullShape_getConvexPolyhedron_0 as _emscripten_bind_btConvexHullShape_getConvexPolyhedron_0,
  emscripten_bind_btConvexHullShape_setLocalScaling_1 as _emscripten_bind_btConvexHullShape_setLocalScaling_1,
  emscripten_bind_btConvexHullShape_getLocalScaling_0 as _emscripten_bind_btConvexHullShape_getLocalScaling_0,
  emscripten_bind_btConvexHullShape_calculateLocalInertia_2 as _emscripten_bind_btConvexHullShape_calculateLocalInertia_2,
  emscripten_bind_btConvexHullShape___destroy___0 as _emscripten_bind_btConvexHullShape___destroy___0,
  emscripten_bind_btShapeHull_btShapeHull_1 as _emscripten_bind_btShapeHull_btShapeHull_1,
  emscripten_bind_btShapeHull_buildHull_1 as _emscripten_bind_btShapeHull_buildHull_1,
  emscripten_bind_btShapeHull_numVertices_0 as _emscripten_bind_btShapeHull_numVertices_0,
  emscripten_bind_btShapeHull_getVertexPointer_0 as _emscripten_bind_btShapeHull_getVertexPointer_0,
  emscripten_bind_btShapeHull___destroy___0 as _emscripten_bind_btShapeHull___destroy___0,
  emscripten_bind_btCompoundShape_btCompoundShape_0 as _emscripten_bind_btCompoundShape_btCompoundShape_0,
  emscripten_bind_btCompoundShape_btCompoundShape_1 as _emscripten_bind_btCompoundShape_btCompoundShape_1,
  emscripten_bind_btCompoundShape_addChildShape_2 as _emscripten_bind_btCompoundShape_addChildShape_2,
  emscripten_bind_btCompoundShape_removeChildShape_1 as _emscripten_bind_btCompoundShape_removeChildShape_1,
  emscripten_bind_btCompoundShape_removeChildShapeByIndex_1 as _emscripten_bind_btCompoundShape_removeChildShapeByIndex_1,
  emscripten_bind_btCompoundShape_getNumChildShapes_0 as _emscripten_bind_btCompoundShape_getNumChildShapes_0,
  emscripten_bind_btCompoundShape_getChildShape_1 as _emscripten_bind_btCompoundShape_getChildShape_1,
  emscripten_bind_btCompoundShape_updateChildTransform_2 as _emscripten_bind_btCompoundShape_updateChildTransform_2,
  emscripten_bind_btCompoundShape_updateChildTransform_3 as _emscripten_bind_btCompoundShape_updateChildTransform_3,
  emscripten_bind_btCompoundShape_setMargin_1 as _emscripten_bind_btCompoundShape_setMargin_1,
  emscripten_bind_btCompoundShape_getMargin_0 as _emscripten_bind_btCompoundShape_getMargin_0,
  emscripten_bind_btCompoundShape_setLocalScaling_1 as _emscripten_bind_btCompoundShape_setLocalScaling_1,
  emscripten_bind_btCompoundShape_getLocalScaling_0 as _emscripten_bind_btCompoundShape_getLocalScaling_0,
  emscripten_bind_btCompoundShape_calculateLocalInertia_2 as _emscripten_bind_btCompoundShape_calculateLocalInertia_2,
  emscripten_bind_btCompoundShape___destroy___0 as _emscripten_bind_btCompoundShape___destroy___0,
  emscripten_bind_btIndexedMesh_get_m_numTriangles_0 as _emscripten_bind_btIndexedMesh_get_m_numTriangles_0,
  emscripten_bind_btIndexedMesh_set_m_numTriangles_1 as _emscripten_bind_btIndexedMesh_set_m_numTriangles_1,
  emscripten_bind_btIndexedMesh___destroy___0 as _emscripten_bind_btIndexedMesh___destroy___0,
  emscripten_bind_btIndexedMeshArray_size_0 as _emscripten_bind_btIndexedMeshArray_size_0,
  emscripten_bind_btIndexedMeshArray_at_1 as _emscripten_bind_btIndexedMeshArray_at_1,
  emscripten_bind_btIndexedMeshArray___destroy___0 as _emscripten_bind_btIndexedMeshArray___destroy___0,
  emscripten_bind_btTriangleMesh_btTriangleMesh_0 as _emscripten_bind_btTriangleMesh_btTriangleMesh_0,
  emscripten_bind_btTriangleMesh_btTriangleMesh_1 as _emscripten_bind_btTriangleMesh_btTriangleMesh_1,
  emscripten_bind_btTriangleMesh_btTriangleMesh_2 as _emscripten_bind_btTriangleMesh_btTriangleMesh_2,
  emscripten_bind_btTriangleMesh_addTriangle_3 as _emscripten_bind_btTriangleMesh_addTriangle_3,
  emscripten_bind_btTriangleMesh_addTriangle_4 as _emscripten_bind_btTriangleMesh_addTriangle_4,
  emscripten_bind_btTriangleMesh_findOrAddVertex_2 as _emscripten_bind_btTriangleMesh_findOrAddVertex_2,
  emscripten_bind_btTriangleMesh_addIndex_1 as _emscripten_bind_btTriangleMesh_addIndex_1,
  emscripten_bind_btTriangleMesh_getIndexedMeshArray_0 as _emscripten_bind_btTriangleMesh_getIndexedMeshArray_0,
  emscripten_bind_btTriangleMesh_setScaling_1 as _emscripten_bind_btTriangleMesh_setScaling_1,
  emscripten_bind_btTriangleMesh___destroy___0 as _emscripten_bind_btTriangleMesh___destroy___0,
  emscripten_bind_btEmptyShape_btEmptyShape_0 as _emscripten_bind_btEmptyShape_btEmptyShape_0,
  emscripten_bind_btEmptyShape_setLocalScaling_1 as _emscripten_bind_btEmptyShape_setLocalScaling_1,
  emscripten_bind_btEmptyShape_getLocalScaling_0 as _emscripten_bind_btEmptyShape_getLocalScaling_0,
  emscripten_bind_btEmptyShape_calculateLocalInertia_2 as _emscripten_bind_btEmptyShape_calculateLocalInertia_2,
  emscripten_bind_btEmptyShape___destroy___0 as _emscripten_bind_btEmptyShape___destroy___0,
  emscripten_bind_btStaticPlaneShape_btStaticPlaneShape_2 as _emscripten_bind_btStaticPlaneShape_btStaticPlaneShape_2,
  emscripten_bind_btStaticPlaneShape_setLocalScaling_1 as _emscripten_bind_btStaticPlaneShape_setLocalScaling_1,
  emscripten_bind_btStaticPlaneShape_getLocalScaling_0 as _emscripten_bind_btStaticPlaneShape_getLocalScaling_0,
  emscripten_bind_btStaticPlaneShape_calculateLocalInertia_2 as _emscripten_bind_btStaticPlaneShape_calculateLocalInertia_2,
  emscripten_bind_btStaticPlaneShape___destroy___0 as _emscripten_bind_btStaticPlaneShape___destroy___0,
  emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_2 as _emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_2,
  emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_3 as _emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_3,
  emscripten_bind_btBvhTriangleMeshShape_setLocalScaling_1 as _emscripten_bind_btBvhTriangleMeshShape_setLocalScaling_1,
  emscripten_bind_btBvhTriangleMeshShape_getLocalScaling_0 as _emscripten_bind_btBvhTriangleMeshShape_getLocalScaling_0,
  emscripten_bind_btBvhTriangleMeshShape_calculateLocalInertia_2 as _emscripten_bind_btBvhTriangleMeshShape_calculateLocalInertia_2,
  emscripten_bind_btBvhTriangleMeshShape___destroy___0 as _emscripten_bind_btBvhTriangleMeshShape___destroy___0,
  emscripten_bind_btHeightfieldTerrainShape_btHeightfieldTerrainShape_9 as _emscripten_bind_btHeightfieldTerrainShape_btHeightfieldTerrainShape_9,
  emscripten_bind_btHeightfieldTerrainShape_setMargin_1 as _emscripten_bind_btHeightfieldTerrainShape_setMargin_1,
  emscripten_bind_btHeightfieldTerrainShape_getMargin_0 as _emscripten_bind_btHeightfieldTerrainShape_getMargin_0,
  emscripten_bind_btHeightfieldTerrainShape_setLocalScaling_1 as _emscripten_bind_btHeightfieldTerrainShape_setLocalScaling_1,
  emscripten_bind_btHeightfieldTerrainShape_getLocalScaling_0 as _emscripten_bind_btHeightfieldTerrainShape_getLocalScaling_0,
  emscripten_bind_btHeightfieldTerrainShape_calculateLocalInertia_2 as _emscripten_bind_btHeightfieldTerrainShape_calculateLocalInertia_2,
  emscripten_bind_btHeightfieldTerrainShape___destroy___0 as _emscripten_bind_btHeightfieldTerrainShape___destroy___0,
  emscripten_bind_btAABB_btAABB_4 as _emscripten_bind_btAABB_btAABB_4,
  emscripten_bind_btAABB_invalidate_0 as _emscripten_bind_btAABB_invalidate_0,
  emscripten_bind_btAABB_increment_margin_1 as _emscripten_bind_btAABB_increment_margin_1,
  emscripten_bind_btAABB_copy_with_margin_2 as _emscripten_bind_btAABB_copy_with_margin_2,
  emscripten_bind_btAABB___destroy___0 as _emscripten_bind_btAABB___destroy___0,
  emscripten_bind_btPrimitiveTriangle_btPrimitiveTriangle_0 as _emscripten_bind_btPrimitiveTriangle_btPrimitiveTriangle_0,
  emscripten_bind_btPrimitiveTriangle___destroy___0 as _emscripten_bind_btPrimitiveTriangle___destroy___0,
  emscripten_bind_btTriangleShapeEx_btTriangleShapeEx_3 as _emscripten_bind_btTriangleShapeEx_btTriangleShapeEx_3,
  emscripten_bind_btTriangleShapeEx_getAabb_3 as _emscripten_bind_btTriangleShapeEx_getAabb_3,
  emscripten_bind_btTriangleShapeEx_applyTransform_1 as _emscripten_bind_btTriangleShapeEx_applyTransform_1,
  emscripten_bind_btTriangleShapeEx_buildTriPlane_1 as _emscripten_bind_btTriangleShapeEx_buildTriPlane_1,
  emscripten_bind_btTriangleShapeEx___destroy___0 as _emscripten_bind_btTriangleShapeEx___destroy___0,
  emscripten_bind_btTetrahedronShapeEx_btTetrahedronShapeEx_0 as _emscripten_bind_btTetrahedronShapeEx_btTetrahedronShapeEx_0,
  emscripten_bind_btTetrahedronShapeEx_setVertices_4 as _emscripten_bind_btTetrahedronShapeEx_setVertices_4,
  emscripten_bind_btTetrahedronShapeEx___destroy___0 as _emscripten_bind_btTetrahedronShapeEx___destroy___0,
  emscripten_bind_CompoundPrimitiveManager_get_primitive_count_0 as _emscripten_bind_CompoundPrimitiveManager_get_primitive_count_0,
  emscripten_bind_CompoundPrimitiveManager_get_primitive_box_2 as _emscripten_bind_CompoundPrimitiveManager_get_primitive_box_2,
  emscripten_bind_CompoundPrimitiveManager_get_primitive_triangle_2 as _emscripten_bind_CompoundPrimitiveManager_get_primitive_triangle_2,
  emscripten_bind_CompoundPrimitiveManager_is_trimesh_0 as _emscripten_bind_CompoundPrimitiveManager_is_trimesh_0,
  emscripten_bind_CompoundPrimitiveManager_get_m_compoundShape_0 as _emscripten_bind_CompoundPrimitiveManager_get_m_compoundShape_0,
  emscripten_bind_CompoundPrimitiveManager_set_m_compoundShape_1 as _emscripten_bind_CompoundPrimitiveManager_set_m_compoundShape_1,
  emscripten_bind_CompoundPrimitiveManager___destroy___0 as _emscripten_bind_CompoundPrimitiveManager___destroy___0,
  emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_0 as _emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_0,
  emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_1 as _emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_1,
  emscripten_bind_btGImpactCompoundShape_childrenHasTransform_0 as _emscripten_bind_btGImpactCompoundShape_childrenHasTransform_0,
  emscripten_bind_btGImpactCompoundShape_getPrimitiveManager_0 as _emscripten_bind_btGImpactCompoundShape_getPrimitiveManager_0,
  emscripten_bind_btGImpactCompoundShape_getCompoundPrimitiveManager_0 as _emscripten_bind_btGImpactCompoundShape_getCompoundPrimitiveManager_0,
  emscripten_bind_btGImpactCompoundShape_getNumChildShapes_0 as _emscripten_bind_btGImpactCompoundShape_getNumChildShapes_0,
  emscripten_bind_btGImpactCompoundShape_addChildShape_2 as _emscripten_bind_btGImpactCompoundShape_addChildShape_2,
  emscripten_bind_btGImpactCompoundShape_getChildShape_1 as _emscripten_bind_btGImpactCompoundShape_getChildShape_1,
  emscripten_bind_btGImpactCompoundShape_getChildAabb_4 as _emscripten_bind_btGImpactCompoundShape_getChildAabb_4,
  emscripten_bind_btGImpactCompoundShape_getChildTransform_1 as _emscripten_bind_btGImpactCompoundShape_getChildTransform_1,
  emscripten_bind_btGImpactCompoundShape_setChildTransform_2 as _emscripten_bind_btGImpactCompoundShape_setChildTransform_2,
  emscripten_bind_btGImpactCompoundShape_calculateLocalInertia_2 as _emscripten_bind_btGImpactCompoundShape_calculateLocalInertia_2,
  emscripten_bind_btGImpactCompoundShape_getName_0 as _emscripten_bind_btGImpactCompoundShape_getName_0,
  emscripten_bind_btGImpactCompoundShape_getGImpactShapeType_0 as _emscripten_bind_btGImpactCompoundShape_getGImpactShapeType_0,
  emscripten_bind_btGImpactCompoundShape_setLocalScaling_1 as _emscripten_bind_btGImpactCompoundShape_setLocalScaling_1,
  emscripten_bind_btGImpactCompoundShape_getLocalScaling_0 as _emscripten_bind_btGImpactCompoundShape_getLocalScaling_0,
  emscripten_bind_btGImpactCompoundShape_updateBound_0 as _emscripten_bind_btGImpactCompoundShape_updateBound_0,
  emscripten_bind_btGImpactCompoundShape_postUpdate_0 as _emscripten_bind_btGImpactCompoundShape_postUpdate_0,
  emscripten_bind_btGImpactCompoundShape_getShapeType_0 as _emscripten_bind_btGImpactCompoundShape_getShapeType_0,
  emscripten_bind_btGImpactCompoundShape_needsRetrieveTriangles_0 as _emscripten_bind_btGImpactCompoundShape_needsRetrieveTriangles_0,
  emscripten_bind_btGImpactCompoundShape_needsRetrieveTetrahedrons_0 as _emscripten_bind_btGImpactCompoundShape_needsRetrieveTetrahedrons_0,
  emscripten_bind_btGImpactCompoundShape_getBulletTriangle_2 as _emscripten_bind_btGImpactCompoundShape_getBulletTriangle_2,
  emscripten_bind_btGImpactCompoundShape_getBulletTetrahedron_2 as _emscripten_bind_btGImpactCompoundShape_getBulletTetrahedron_2,
  emscripten_bind_btGImpactCompoundShape___destroy___0 as _emscripten_bind_btGImpactCompoundShape___destroy___0,
  emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_0 as _emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_0,
  emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_1 as _emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_1,
  emscripten_bind_TrimeshPrimitiveManager_lock_0 as _emscripten_bind_TrimeshPrimitiveManager_lock_0,
  emscripten_bind_TrimeshPrimitiveManager_unlock_0 as _emscripten_bind_TrimeshPrimitiveManager_unlock_0,
  emscripten_bind_TrimeshPrimitiveManager_is_trimesh_0 as _emscripten_bind_TrimeshPrimitiveManager_is_trimesh_0,
  emscripten_bind_TrimeshPrimitiveManager_get_vertex_count_0 as _emscripten_bind_TrimeshPrimitiveManager_get_vertex_count_0,
  emscripten_bind_TrimeshPrimitiveManager_get_indices_4 as _emscripten_bind_TrimeshPrimitiveManager_get_indices_4,
  emscripten_bind_TrimeshPrimitiveManager_get_vertex_2 as _emscripten_bind_TrimeshPrimitiveManager_get_vertex_2,
  emscripten_bind_TrimeshPrimitiveManager_get_bullet_triangle_2 as _emscripten_bind_TrimeshPrimitiveManager_get_bullet_triangle_2,
  emscripten_bind_TrimeshPrimitiveManager_get_m_margin_0 as _emscripten_bind_TrimeshPrimitiveManager_get_m_margin_0,
  emscripten_bind_TrimeshPrimitiveManager_set_m_margin_1 as _emscripten_bind_TrimeshPrimitiveManager_set_m_margin_1,
  emscripten_bind_TrimeshPrimitiveManager_get_m_meshInterface_0 as _emscripten_bind_TrimeshPrimitiveManager_get_m_meshInterface_0,
  emscripten_bind_TrimeshPrimitiveManager_set_m_meshInterface_1 as _emscripten_bind_TrimeshPrimitiveManager_set_m_meshInterface_1,
  emscripten_bind_TrimeshPrimitiveManager_get_m_part_0 as _emscripten_bind_TrimeshPrimitiveManager_get_m_part_0,
  emscripten_bind_TrimeshPrimitiveManager_set_m_part_1 as _emscripten_bind_TrimeshPrimitiveManager_set_m_part_1,
  emscripten_bind_TrimeshPrimitiveManager_get_m_lock_count_0 as _emscripten_bind_TrimeshPrimitiveManager_get_m_lock_count_0,
  emscripten_bind_TrimeshPrimitiveManager_set_m_lock_count_1 as _emscripten_bind_TrimeshPrimitiveManager_set_m_lock_count_1,
  emscripten_bind_TrimeshPrimitiveManager_get_numverts_0 as _emscripten_bind_TrimeshPrimitiveManager_get_numverts_0,
  emscripten_bind_TrimeshPrimitiveManager_set_numverts_1 as _emscripten_bind_TrimeshPrimitiveManager_set_numverts_1,
  emscripten_bind_TrimeshPrimitiveManager_get_type_0 as _emscripten_bind_TrimeshPrimitiveManager_get_type_0,
  emscripten_bind_TrimeshPrimitiveManager_set_type_1 as _emscripten_bind_TrimeshPrimitiveManager_set_type_1,
  emscripten_bind_TrimeshPrimitiveManager_get_stride_0 as _emscripten_bind_TrimeshPrimitiveManager_get_stride_0,
  emscripten_bind_TrimeshPrimitiveManager_set_stride_1 as _emscripten_bind_TrimeshPrimitiveManager_set_stride_1,
  emscripten_bind_TrimeshPrimitiveManager_get_indexstride_0 as _emscripten_bind_TrimeshPrimitiveManager_get_indexstride_0,
  emscripten_bind_TrimeshPrimitiveManager_set_indexstride_1 as _emscripten_bind_TrimeshPrimitiveManager_set_indexstride_1,
  emscripten_bind_TrimeshPrimitiveManager_get_numfaces_0 as _emscripten_bind_TrimeshPrimitiveManager_get_numfaces_0,
  emscripten_bind_TrimeshPrimitiveManager_set_numfaces_1 as _emscripten_bind_TrimeshPrimitiveManager_set_numfaces_1,
  emscripten_bind_TrimeshPrimitiveManager_get_indicestype_0 as _emscripten_bind_TrimeshPrimitiveManager_get_indicestype_0,
  emscripten_bind_TrimeshPrimitiveManager_set_indicestype_1 as _emscripten_bind_TrimeshPrimitiveManager_set_indicestype_1,
  emscripten_bind_TrimeshPrimitiveManager___destroy___0 as _emscripten_bind_TrimeshPrimitiveManager___destroy___0,
  emscripten_bind_btGImpactMeshShapePart_btGImpactMeshShapePart_2 as _emscripten_bind_btGImpactMeshShapePart_btGImpactMeshShapePart_2,
  emscripten_bind_btGImpactMeshShapePart_getTrimeshPrimitiveManager_0 as _emscripten_bind_btGImpactMeshShapePart_getTrimeshPrimitiveManager_0,
  emscripten_bind_btGImpactMeshShapePart_getVertexCount_0 as _emscripten_bind_btGImpactMeshShapePart_getVertexCount_0,
  emscripten_bind_btGImpactMeshShapePart_getVertex_2 as _emscripten_bind_btGImpactMeshShapePart_getVertex_2,
  emscripten_bind_btGImpactMeshShapePart_getPart_0 as _emscripten_bind_btGImpactMeshShapePart_getPart_0,
  emscripten_bind_btGImpactMeshShapePart_setLocalScaling_1 as _emscripten_bind_btGImpactMeshShapePart_setLocalScaling_1,
  emscripten_bind_btGImpactMeshShapePart_getLocalScaling_0 as _emscripten_bind_btGImpactMeshShapePart_getLocalScaling_0,
  emscripten_bind_btGImpactMeshShapePart_updateBound_0 as _emscripten_bind_btGImpactMeshShapePart_updateBound_0,
  emscripten_bind_btGImpactMeshShapePart_postUpdate_0 as _emscripten_bind_btGImpactMeshShapePart_postUpdate_0,
  emscripten_bind_btGImpactMeshShapePart_getShapeType_0 as _emscripten_bind_btGImpactMeshShapePart_getShapeType_0,
  emscripten_bind_btGImpactMeshShapePart_needsRetrieveTriangles_0 as _emscripten_bind_btGImpactMeshShapePart_needsRetrieveTriangles_0,
  emscripten_bind_btGImpactMeshShapePart_needsRetrieveTetrahedrons_0 as _emscripten_bind_btGImpactMeshShapePart_needsRetrieveTetrahedrons_0,
  emscripten_bind_btGImpactMeshShapePart_getBulletTriangle_2 as _emscripten_bind_btGImpactMeshShapePart_getBulletTriangle_2,
  emscripten_bind_btGImpactMeshShapePart_getBulletTetrahedron_2 as _emscripten_bind_btGImpactMeshShapePart_getBulletTetrahedron_2,
  emscripten_bind_btGImpactMeshShapePart___destroy___0 as _emscripten_bind_btGImpactMeshShapePart___destroy___0,
  emscripten_bind_btGImpactMeshShape_btGImpactMeshShape_1 as _emscripten_bind_btGImpactMeshShape_btGImpactMeshShape_1,
  emscripten_bind_btGImpactMeshShape_getMeshInterface_0 as _emscripten_bind_btGImpactMeshShape_getMeshInterface_0,
  emscripten_bind_btGImpactMeshShape_getMeshPartCount_0 as _emscripten_bind_btGImpactMeshShape_getMeshPartCount_0,
  emscripten_bind_btGImpactMeshShape_getMeshPart_1 as _emscripten_bind_btGImpactMeshShape_getMeshPart_1,
  emscripten_bind_btGImpactMeshShape_calculateSerializeBufferSize_0 as _emscripten_bind_btGImpactMeshShape_calculateSerializeBufferSize_0,
  emscripten_bind_btGImpactMeshShape_setLocalScaling_1 as _emscripten_bind_btGImpactMeshShape_setLocalScaling_1,
  emscripten_bind_btGImpactMeshShape_getLocalScaling_0 as _emscripten_bind_btGImpactMeshShape_getLocalScaling_0,
  emscripten_bind_btGImpactMeshShape_updateBound_0 as _emscripten_bind_btGImpactMeshShape_updateBound_0,
  emscripten_bind_btGImpactMeshShape_postUpdate_0 as _emscripten_bind_btGImpactMeshShape_postUpdate_0,
  emscripten_bind_btGImpactMeshShape_getShapeType_0 as _emscripten_bind_btGImpactMeshShape_getShapeType_0,
  emscripten_bind_btGImpactMeshShape_needsRetrieveTriangles_0 as _emscripten_bind_btGImpactMeshShape_needsRetrieveTriangles_0,
  emscripten_bind_btGImpactMeshShape_needsRetrieveTetrahedrons_0 as _emscripten_bind_btGImpactMeshShape_needsRetrieveTetrahedrons_0,
  emscripten_bind_btGImpactMeshShape_getBulletTriangle_2 as _emscripten_bind_btGImpactMeshShape_getBulletTriangle_2,
  emscripten_bind_btGImpactMeshShape_getBulletTetrahedron_2 as _emscripten_bind_btGImpactMeshShape_getBulletTetrahedron_2,
  emscripten_bind_btGImpactMeshShape___destroy___0 as _emscripten_bind_btGImpactMeshShape___destroy___0,
  emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_0 as _emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_0,
  emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_2 as _emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_2,
  emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_dispatcher1_0 as _emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_dispatcher1_0,
  emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_dispatcher1_1 as _emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_dispatcher1_1,
  emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_manifold_0 as _emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_manifold_0,
  emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_manifold_1 as _emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_manifold_1,
  emscripten_bind_btCollisionAlgorithmConstructionInfo___destroy___0 as _emscripten_bind_btCollisionAlgorithmConstructionInfo___destroy___0,
  emscripten_bind_btGImpactCollisionAlgorithm_btGImpactCollisionAlgorithm_3 as _emscripten_bind_btGImpactCollisionAlgorithm_btGImpactCollisionAlgorithm_3,
  emscripten_bind_btGImpactCollisionAlgorithm_registerAlgorithm_1 as _emscripten_bind_btGImpactCollisionAlgorithm_registerAlgorithm_1,
  emscripten_bind_btGImpactCollisionAlgorithm___destroy___0 as _emscripten_bind_btGImpactCollisionAlgorithm___destroy___0,
  emscripten_bind_btDefaultCollisionConstructionInfo_btDefaultCollisionConstructionInfo_0 as _emscripten_bind_btDefaultCollisionConstructionInfo_btDefaultCollisionConstructionInfo_0,
  emscripten_bind_btDefaultCollisionConstructionInfo___destroy___0 as _emscripten_bind_btDefaultCollisionConstructionInfo___destroy___0,
  emscripten_bind_btPersistentManifold_btPersistentManifold_0 as _emscripten_bind_btPersistentManifold_btPersistentManifold_0,
  emscripten_bind_btPersistentManifold_getBody0_0 as _emscripten_bind_btPersistentManifold_getBody0_0,
  emscripten_bind_btPersistentManifold_getBody1_0 as _emscripten_bind_btPersistentManifold_getBody1_0,
  emscripten_bind_btPersistentManifold_getNumContacts_0 as _emscripten_bind_btPersistentManifold_getNumContacts_0,
  emscripten_bind_btPersistentManifold_getContactPoint_1 as _emscripten_bind_btPersistentManifold_getContactPoint_1,
  emscripten_bind_btPersistentManifold___destroy___0 as _emscripten_bind_btPersistentManifold___destroy___0,
  emscripten_bind_btCollisionDispatcher_btCollisionDispatcher_1 as _emscripten_bind_btCollisionDispatcher_btCollisionDispatcher_1,
  emscripten_bind_btCollisionDispatcher_getNumManifolds_0 as _emscripten_bind_btCollisionDispatcher_getNumManifolds_0,
  emscripten_bind_btCollisionDispatcher_getManifoldByIndexInternal_1 as _emscripten_bind_btCollisionDispatcher_getManifoldByIndexInternal_1,
  emscripten_bind_btCollisionDispatcher___destroy___0 as _emscripten_bind_btCollisionDispatcher___destroy___0,
  emscripten_bind_btOverlappingPairCallback_removeOverlappingPairsContainingProxy_2 as _emscripten_bind_btOverlappingPairCallback_removeOverlappingPairsContainingProxy_2,
  emscripten_bind_btOverlappingPairCallback___destroy___0 as _emscripten_bind_btOverlappingPairCallback___destroy___0,
  emscripten_bind_btOverlappingPairCache_setInternalGhostPairCallback_1 as _emscripten_bind_btOverlappingPairCache_setInternalGhostPairCallback_1,
  emscripten_bind_btOverlappingPairCache_getNumOverlappingPairs_0 as _emscripten_bind_btOverlappingPairCache_getNumOverlappingPairs_0,
  emscripten_bind_btOverlappingPairCache___destroy___0 as _emscripten_bind_btOverlappingPairCache___destroy___0,
  emscripten_bind_btAxisSweep3_btAxisSweep3_2 as _emscripten_bind_btAxisSweep3_btAxisSweep3_2,
  emscripten_bind_btAxisSweep3_btAxisSweep3_3 as _emscripten_bind_btAxisSweep3_btAxisSweep3_3,
  emscripten_bind_btAxisSweep3_btAxisSweep3_4 as _emscripten_bind_btAxisSweep3_btAxisSweep3_4,
  emscripten_bind_btAxisSweep3_btAxisSweep3_5 as _emscripten_bind_btAxisSweep3_btAxisSweep3_5,
  emscripten_bind_btAxisSweep3___destroy___0 as _emscripten_bind_btAxisSweep3___destroy___0,
  emscripten_bind_btCollisionConfiguration___destroy___0 as _emscripten_bind_btCollisionConfiguration___destroy___0,
  emscripten_bind_btDbvtBroadphase_btDbvtBroadphase_0 as _emscripten_bind_btDbvtBroadphase_btDbvtBroadphase_0,
  emscripten_bind_btDbvtBroadphase_getOverlappingPairCache_0 as _emscripten_bind_btDbvtBroadphase_getOverlappingPairCache_0,
  emscripten_bind_btDbvtBroadphase___destroy___0 as _emscripten_bind_btDbvtBroadphase___destroy___0,
  emscripten_bind_btBroadphaseProxy_get_m_collisionFilterGroup_0 as _emscripten_bind_btBroadphaseProxy_get_m_collisionFilterGroup_0,
  emscripten_bind_btBroadphaseProxy_set_m_collisionFilterGroup_1 as _emscripten_bind_btBroadphaseProxy_set_m_collisionFilterGroup_1,
  emscripten_bind_btBroadphaseProxy_get_m_collisionFilterMask_0 as _emscripten_bind_btBroadphaseProxy_get_m_collisionFilterMask_0,
  emscripten_bind_btBroadphaseProxy_set_m_collisionFilterMask_1 as _emscripten_bind_btBroadphaseProxy_set_m_collisionFilterMask_1,
  emscripten_bind_btBroadphaseProxy___destroy___0 as _emscripten_bind_btBroadphaseProxy___destroy___0,
  emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_3 as _emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_3,
  emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_4 as _emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_4,
  emscripten_bind_btRigidBodyConstructionInfo_get_m_linearDamping_0 as _emscripten_bind_btRigidBodyConstructionInfo_get_m_linearDamping_0,
  emscripten_bind_btRigidBodyConstructionInfo_set_m_linearDamping_1 as _emscripten_bind_btRigidBodyConstructionInfo_set_m_linearDamping_1,
  emscripten_bind_btRigidBodyConstructionInfo_get_m_angularDamping_0 as _emscripten_bind_btRigidBodyConstructionInfo_get_m_angularDamping_0,
  emscripten_bind_btRigidBodyConstructionInfo_set_m_angularDamping_1 as _emscripten_bind_btRigidBodyConstructionInfo_set_m_angularDamping_1,
  emscripten_bind_btRigidBodyConstructionInfo_get_m_friction_0 as _emscripten_bind_btRigidBodyConstructionInfo_get_m_friction_0,
  emscripten_bind_btRigidBodyConstructionInfo_set_m_friction_1 as _emscripten_bind_btRigidBodyConstructionInfo_set_m_friction_1,
  emscripten_bind_btRigidBodyConstructionInfo_get_m_rollingFriction_0 as _emscripten_bind_btRigidBodyConstructionInfo_get_m_rollingFriction_0,
  emscripten_bind_btRigidBodyConstructionInfo_set_m_rollingFriction_1 as _emscripten_bind_btRigidBodyConstructionInfo_set_m_rollingFriction_1,
  emscripten_bind_btRigidBodyConstructionInfo_get_m_restitution_0 as _emscripten_bind_btRigidBodyConstructionInfo_get_m_restitution_0,
  emscripten_bind_btRigidBodyConstructionInfo_set_m_restitution_1 as _emscripten_bind_btRigidBodyConstructionInfo_set_m_restitution_1,
  emscripten_bind_btRigidBodyConstructionInfo_get_m_linearSleepingThreshold_0 as _emscripten_bind_btRigidBodyConstructionInfo_get_m_linearSleepingThreshold_0,
  emscripten_bind_btRigidBodyConstructionInfo_set_m_linearSleepingThreshold_1 as _emscripten_bind_btRigidBodyConstructionInfo_set_m_linearSleepingThreshold_1,
  emscripten_bind_btRigidBodyConstructionInfo_get_m_angularSleepingThreshold_0 as _emscripten_bind_btRigidBodyConstructionInfo_get_m_angularSleepingThreshold_0,
  emscripten_bind_btRigidBodyConstructionInfo_set_m_angularSleepingThreshold_1 as _emscripten_bind_btRigidBodyConstructionInfo_set_m_angularSleepingThreshold_1,
  emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDamping_0 as _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDamping_0,
  emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDamping_1 as _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDamping_1,
  emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDampingFactor_0 as _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDampingFactor_0,
  emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDampingFactor_1 as _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDampingFactor_1,
  emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalLinearDampingThresholdSqr_0 as _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalLinearDampingThresholdSqr_0,
  emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalLinearDampingThresholdSqr_1 as _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalLinearDampingThresholdSqr_1,
  emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingThresholdSqr_0 as _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingThresholdSqr_0,
  emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingThresholdSqr_1 as _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingThresholdSqr_1,
  emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingFactor_0 as _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingFactor_0,
  emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingFactor_1 as _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingFactor_1,
  emscripten_bind_btRigidBodyConstructionInfo___destroy___0 as _emscripten_bind_btRigidBodyConstructionInfo___destroy___0,
  emscripten_bind_btRigidBody_btRigidBody_1 as _emscripten_bind_btRigidBody_btRigidBody_1,
  emscripten_bind_btRigidBody_getCenterOfMassTransform_0 as _emscripten_bind_btRigidBody_getCenterOfMassTransform_0,
  emscripten_bind_btRigidBody_setCenterOfMassTransform_1 as _emscripten_bind_btRigidBody_setCenterOfMassTransform_1,
  emscripten_bind_btRigidBody_setSleepingThresholds_2 as _emscripten_bind_btRigidBody_setSleepingThresholds_2,
  emscripten_bind_btRigidBody_getLinearDamping_0 as _emscripten_bind_btRigidBody_getLinearDamping_0,
  emscripten_bind_btRigidBody_getAngularDamping_0 as _emscripten_bind_btRigidBody_getAngularDamping_0,
  emscripten_bind_btRigidBody_setDamping_2 as _emscripten_bind_btRigidBody_setDamping_2,
  emscripten_bind_btRigidBody_setMassProps_2 as _emscripten_bind_btRigidBody_setMassProps_2,
  emscripten_bind_btRigidBody_getLinearFactor_0 as _emscripten_bind_btRigidBody_getLinearFactor_0,
  emscripten_bind_btRigidBody_setLinearFactor_1 as _emscripten_bind_btRigidBody_setLinearFactor_1,
  emscripten_bind_btRigidBody_applyTorque_1 as _emscripten_bind_btRigidBody_applyTorque_1,
  emscripten_bind_btRigidBody_applyLocalTorque_1 as _emscripten_bind_btRigidBody_applyLocalTorque_1,
  emscripten_bind_btRigidBody_applyForce_2 as _emscripten_bind_btRigidBody_applyForce_2,
  emscripten_bind_btRigidBody_applyCentralForce_1 as _emscripten_bind_btRigidBody_applyCentralForce_1,
  emscripten_bind_btRigidBody_applyCentralLocalForce_1 as _emscripten_bind_btRigidBody_applyCentralLocalForce_1,
  emscripten_bind_btRigidBody_applyTorqueImpulse_1 as _emscripten_bind_btRigidBody_applyTorqueImpulse_1,
  emscripten_bind_btRigidBody_applyImpulse_2 as _emscripten_bind_btRigidBody_applyImpulse_2,
  emscripten_bind_btRigidBody_applyCentralImpulse_1 as _emscripten_bind_btRigidBody_applyCentralImpulse_1,
  emscripten_bind_btRigidBody_updateInertiaTensor_0 as _emscripten_bind_btRigidBody_updateInertiaTensor_0,
  emscripten_bind_btRigidBody_getLinearVelocity_0 as _emscripten_bind_btRigidBody_getLinearVelocity_0,
  emscripten_bind_btRigidBody_getAngularVelocity_0 as _emscripten_bind_btRigidBody_getAngularVelocity_0,
  emscripten_bind_btRigidBody_setLinearVelocity_1 as _emscripten_bind_btRigidBody_setLinearVelocity_1,
  emscripten_bind_btRigidBody_setAngularVelocity_1 as _emscripten_bind_btRigidBody_setAngularVelocity_1,
  emscripten_bind_btRigidBody_getMotionState_0 as _emscripten_bind_btRigidBody_getMotionState_0,
  emscripten_bind_btRigidBody_setMotionState_1 as _emscripten_bind_btRigidBody_setMotionState_1,
  emscripten_bind_btRigidBody_getAngularFactor_0 as _emscripten_bind_btRigidBody_getAngularFactor_0,
  emscripten_bind_btRigidBody_setAngularFactor_1 as _emscripten_bind_btRigidBody_setAngularFactor_1,
  emscripten_bind_btRigidBody_upcast_1 as _emscripten_bind_btRigidBody_upcast_1,
  emscripten_bind_btRigidBody_getAabb_2 as _emscripten_bind_btRigidBody_getAabb_2,
  emscripten_bind_btRigidBody_applyGravity_0 as _emscripten_bind_btRigidBody_applyGravity_0,
  emscripten_bind_btRigidBody_getGravity_0 as _emscripten_bind_btRigidBody_getGravity_0,
  emscripten_bind_btRigidBody_setGravity_1 as _emscripten_bind_btRigidBody_setGravity_1,
  emscripten_bind_btRigidBody_getBroadphaseProxy_0 as _emscripten_bind_btRigidBody_getBroadphaseProxy_0,
  emscripten_bind_btRigidBody_clearForces_0 as _emscripten_bind_btRigidBody_clearForces_0,
  emscripten_bind_btRigidBody_setFlags_1 as _emscripten_bind_btRigidBody_setFlags_1,
  emscripten_bind_btRigidBody_getFlags_0 as _emscripten_bind_btRigidBody_getFlags_0,
  emscripten_bind_btRigidBody_setAnisotropicFriction_2 as _emscripten_bind_btRigidBody_setAnisotropicFriction_2,
  emscripten_bind_btRigidBody_getCollisionShape_0 as _emscripten_bind_btRigidBody_getCollisionShape_0,
  emscripten_bind_btRigidBody_setContactProcessingThreshold_1 as _emscripten_bind_btRigidBody_setContactProcessingThreshold_1,
  emscripten_bind_btRigidBody_setActivationState_1 as _emscripten_bind_btRigidBody_setActivationState_1,
  emscripten_bind_btRigidBody_forceActivationState_1 as _emscripten_bind_btRigidBody_forceActivationState_1,
  emscripten_bind_btRigidBody_activate_0 as _emscripten_bind_btRigidBody_activate_0,
  emscripten_bind_btRigidBody_activate_1 as _emscripten_bind_btRigidBody_activate_1,
  emscripten_bind_btRigidBody_isActive_0 as _emscripten_bind_btRigidBody_isActive_0,
  emscripten_bind_btRigidBody_isKinematicObject_0 as _emscripten_bind_btRigidBody_isKinematicObject_0,
  emscripten_bind_btRigidBody_isStaticObject_0 as _emscripten_bind_btRigidBody_isStaticObject_0,
  emscripten_bind_btRigidBody_isStaticOrKinematicObject_0 as _emscripten_bind_btRigidBody_isStaticOrKinematicObject_0,
  emscripten_bind_btRigidBody_getRestitution_0 as _emscripten_bind_btRigidBody_getRestitution_0,
  emscripten_bind_btRigidBody_getFriction_0 as _emscripten_bind_btRigidBody_getFriction_0,
  emscripten_bind_btRigidBody_getRollingFriction_0 as _emscripten_bind_btRigidBody_getRollingFriction_0,
  emscripten_bind_btRigidBody_setRestitution_1 as _emscripten_bind_btRigidBody_setRestitution_1,
  emscripten_bind_btRigidBody_setFriction_1 as _emscripten_bind_btRigidBody_setFriction_1,
  emscripten_bind_btRigidBody_setRollingFriction_1 as _emscripten_bind_btRigidBody_setRollingFriction_1,
  emscripten_bind_btRigidBody_getWorldTransform_0 as _emscripten_bind_btRigidBody_getWorldTransform_0,
  emscripten_bind_btRigidBody_getCollisionFlags_0 as _emscripten_bind_btRigidBody_getCollisionFlags_0,
  emscripten_bind_btRigidBody_setCollisionFlags_1 as _emscripten_bind_btRigidBody_setCollisionFlags_1,
  emscripten_bind_btRigidBody_setWorldTransform_1 as _emscripten_bind_btRigidBody_setWorldTransform_1,
  emscripten_bind_btRigidBody_setCollisionShape_1 as _emscripten_bind_btRigidBody_setCollisionShape_1,
  emscripten_bind_btRigidBody_setCcdMotionThreshold_1 as _emscripten_bind_btRigidBody_setCcdMotionThreshold_1,
  emscripten_bind_btRigidBody_setCcdSweptSphereRadius_1 as _emscripten_bind_btRigidBody_setCcdSweptSphereRadius_1,
  emscripten_bind_btRigidBody_getUserIndex_0 as _emscripten_bind_btRigidBody_getUserIndex_0,
  emscripten_bind_btRigidBody_setUserIndex_1 as _emscripten_bind_btRigidBody_setUserIndex_1,
  emscripten_bind_btRigidBody_getUserPointer_0 as _emscripten_bind_btRigidBody_getUserPointer_0,
  emscripten_bind_btRigidBody_setUserPointer_1 as _emscripten_bind_btRigidBody_setUserPointer_1,
  emscripten_bind_btRigidBody_getBroadphaseHandle_0 as _emscripten_bind_btRigidBody_getBroadphaseHandle_0,
  emscripten_bind_btRigidBody___destroy___0 as _emscripten_bind_btRigidBody___destroy___0,
  emscripten_bind_btConstraintSetting_btConstraintSetting_0 as _emscripten_bind_btConstraintSetting_btConstraintSetting_0,
  emscripten_bind_btConstraintSetting_get_m_tau_0 as _emscripten_bind_btConstraintSetting_get_m_tau_0,
  emscripten_bind_btConstraintSetting_set_m_tau_1 as _emscripten_bind_btConstraintSetting_set_m_tau_1,
  emscripten_bind_btConstraintSetting_get_m_damping_0 as _emscripten_bind_btConstraintSetting_get_m_damping_0,
  emscripten_bind_btConstraintSetting_set_m_damping_1 as _emscripten_bind_btConstraintSetting_set_m_damping_1,
  emscripten_bind_btConstraintSetting_get_m_impulseClamp_0 as _emscripten_bind_btConstraintSetting_get_m_impulseClamp_0,
  emscripten_bind_btConstraintSetting_set_m_impulseClamp_1 as _emscripten_bind_btConstraintSetting_set_m_impulseClamp_1,
  emscripten_bind_btConstraintSetting___destroy___0 as _emscripten_bind_btConstraintSetting___destroy___0,
  emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_2 as _emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_2,
  emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_4 as _emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_4,
  emscripten_bind_btPoint2PointConstraint_setPivotA_1 as _emscripten_bind_btPoint2PointConstraint_setPivotA_1,
  emscripten_bind_btPoint2PointConstraint_setPivotB_1 as _emscripten_bind_btPoint2PointConstraint_setPivotB_1,
  emscripten_bind_btPoint2PointConstraint_getPivotInA_0 as _emscripten_bind_btPoint2PointConstraint_getPivotInA_0,
  emscripten_bind_btPoint2PointConstraint_getPivotInB_0 as _emscripten_bind_btPoint2PointConstraint_getPivotInB_0,
  emscripten_bind_btPoint2PointConstraint_enableFeedback_1 as _emscripten_bind_btPoint2PointConstraint_enableFeedback_1,
  emscripten_bind_btPoint2PointConstraint_getBreakingImpulseThreshold_0 as _emscripten_bind_btPoint2PointConstraint_getBreakingImpulseThreshold_0,
  emscripten_bind_btPoint2PointConstraint_setBreakingImpulseThreshold_1 as _emscripten_bind_btPoint2PointConstraint_setBreakingImpulseThreshold_1,
  emscripten_bind_btPoint2PointConstraint_getParam_2 as _emscripten_bind_btPoint2PointConstraint_getParam_2,
  emscripten_bind_btPoint2PointConstraint_setParam_3 as _emscripten_bind_btPoint2PointConstraint_setParam_3,
  emscripten_bind_btPoint2PointConstraint_get_m_setting_0 as _emscripten_bind_btPoint2PointConstraint_get_m_setting_0,
  emscripten_bind_btPoint2PointConstraint_set_m_setting_1 as _emscripten_bind_btPoint2PointConstraint_set_m_setting_1,
  emscripten_bind_btPoint2PointConstraint___destroy___0 as _emscripten_bind_btPoint2PointConstraint___destroy___0,
  emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_3 as _emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_3,
  emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_5 as _emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_5,
  emscripten_bind_btGeneric6DofSpringConstraint_enableSpring_2 as _emscripten_bind_btGeneric6DofSpringConstraint_enableSpring_2,
  emscripten_bind_btGeneric6DofSpringConstraint_setStiffness_2 as _emscripten_bind_btGeneric6DofSpringConstraint_setStiffness_2,
  emscripten_bind_btGeneric6DofSpringConstraint_setDamping_2 as _emscripten_bind_btGeneric6DofSpringConstraint_setDamping_2,
  emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_0 as _emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_0,
  emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_1 as _emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_1,
  emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_2 as _emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_2,
  emscripten_bind_btGeneric6DofSpringConstraint_setLinearLowerLimit_1 as _emscripten_bind_btGeneric6DofSpringConstraint_setLinearLowerLimit_1,
  emscripten_bind_btGeneric6DofSpringConstraint_setLinearUpperLimit_1 as _emscripten_bind_btGeneric6DofSpringConstraint_setLinearUpperLimit_1,
  emscripten_bind_btGeneric6DofSpringConstraint_setAngularLowerLimit_1 as _emscripten_bind_btGeneric6DofSpringConstraint_setAngularLowerLimit_1,
  emscripten_bind_btGeneric6DofSpringConstraint_setAngularUpperLimit_1 as _emscripten_bind_btGeneric6DofSpringConstraint_setAngularUpperLimit_1,
  emscripten_bind_btGeneric6DofSpringConstraint_getFrameOffsetA_0 as _emscripten_bind_btGeneric6DofSpringConstraint_getFrameOffsetA_0,
  emscripten_bind_btGeneric6DofSpringConstraint_enableFeedback_1 as _emscripten_bind_btGeneric6DofSpringConstraint_enableFeedback_1,
  emscripten_bind_btGeneric6DofSpringConstraint_getBreakingImpulseThreshold_0 as _emscripten_bind_btGeneric6DofSpringConstraint_getBreakingImpulseThreshold_0,
  emscripten_bind_btGeneric6DofSpringConstraint_setBreakingImpulseThreshold_1 as _emscripten_bind_btGeneric6DofSpringConstraint_setBreakingImpulseThreshold_1,
  emscripten_bind_btGeneric6DofSpringConstraint_getParam_2 as _emscripten_bind_btGeneric6DofSpringConstraint_getParam_2,
  emscripten_bind_btGeneric6DofSpringConstraint_setParam_3 as _emscripten_bind_btGeneric6DofSpringConstraint_setParam_3,
  emscripten_bind_btGeneric6DofSpringConstraint___destroy___0 as _emscripten_bind_btGeneric6DofSpringConstraint___destroy___0,
  emscripten_bind_btSequentialImpulseConstraintSolver_btSequentialImpulseConstraintSolver_0 as _emscripten_bind_btSequentialImpulseConstraintSolver_btSequentialImpulseConstraintSolver_0,
  emscripten_bind_btSequentialImpulseConstraintSolver___destroy___0 as _emscripten_bind_btSequentialImpulseConstraintSolver___destroy___0,
  emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_2 as _emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_2,
  emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_4 as _emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_4,
  emscripten_bind_btConeTwistConstraint_setLimit_2 as _emscripten_bind_btConeTwistConstraint_setLimit_2,
  emscripten_bind_btConeTwistConstraint_setAngularOnly_1 as _emscripten_bind_btConeTwistConstraint_setAngularOnly_1,
  emscripten_bind_btConeTwistConstraint_setDamping_1 as _emscripten_bind_btConeTwistConstraint_setDamping_1,
  emscripten_bind_btConeTwistConstraint_enableMotor_1 as _emscripten_bind_btConeTwistConstraint_enableMotor_1,
  emscripten_bind_btConeTwistConstraint_setMaxMotorImpulse_1 as _emscripten_bind_btConeTwistConstraint_setMaxMotorImpulse_1,
  emscripten_bind_btConeTwistConstraint_setMaxMotorImpulseNormalized_1 as _emscripten_bind_btConeTwistConstraint_setMaxMotorImpulseNormalized_1,
  emscripten_bind_btConeTwistConstraint_setMotorTarget_1 as _emscripten_bind_btConeTwistConstraint_setMotorTarget_1,
  emscripten_bind_btConeTwistConstraint_setMotorTargetInConstraintSpace_1 as _emscripten_bind_btConeTwistConstraint_setMotorTargetInConstraintSpace_1,
  emscripten_bind_btConeTwistConstraint_enableFeedback_1 as _emscripten_bind_btConeTwistConstraint_enableFeedback_1,
  emscripten_bind_btConeTwistConstraint_getBreakingImpulseThreshold_0 as _emscripten_bind_btConeTwistConstraint_getBreakingImpulseThreshold_0,
  emscripten_bind_btConeTwistConstraint_setBreakingImpulseThreshold_1 as _emscripten_bind_btConeTwistConstraint_setBreakingImpulseThreshold_1,
  emscripten_bind_btConeTwistConstraint_getParam_2 as _emscripten_bind_btConeTwistConstraint_getParam_2,
  emscripten_bind_btConeTwistConstraint_setParam_3 as _emscripten_bind_btConeTwistConstraint_setParam_3,
  emscripten_bind_btConeTwistConstraint___destroy___0 as _emscripten_bind_btConeTwistConstraint___destroy___0,
  emscripten_bind_btHingeConstraint_btHingeConstraint_2 as _emscripten_bind_btHingeConstraint_btHingeConstraint_2,
  emscripten_bind_btHingeConstraint_btHingeConstraint_3 as _emscripten_bind_btHingeConstraint_btHingeConstraint_3,
  emscripten_bind_btHingeConstraint_btHingeConstraint_4 as _emscripten_bind_btHingeConstraint_btHingeConstraint_4,
  emscripten_bind_btHingeConstraint_btHingeConstraint_5 as _emscripten_bind_btHingeConstraint_btHingeConstraint_5,
  emscripten_bind_btHingeConstraint_btHingeConstraint_6 as _emscripten_bind_btHingeConstraint_btHingeConstraint_6,
  emscripten_bind_btHingeConstraint_btHingeConstraint_7 as _emscripten_bind_btHingeConstraint_btHingeConstraint_7,
  emscripten_bind_btHingeConstraint_getHingeAngle_0 as _emscripten_bind_btHingeConstraint_getHingeAngle_0,
  emscripten_bind_btHingeConstraint_setLimit_4 as _emscripten_bind_btHingeConstraint_setLimit_4,
  emscripten_bind_btHingeConstraint_setLimit_5 as _emscripten_bind_btHingeConstraint_setLimit_5,
  emscripten_bind_btHingeConstraint_enableAngularMotor_3 as _emscripten_bind_btHingeConstraint_enableAngularMotor_3,
  emscripten_bind_btHingeConstraint_setAngularOnly_1 as _emscripten_bind_btHingeConstraint_setAngularOnly_1,
  emscripten_bind_btHingeConstraint_enableMotor_1 as _emscripten_bind_btHingeConstraint_enableMotor_1,
  emscripten_bind_btHingeConstraint_setMaxMotorImpulse_1 as _emscripten_bind_btHingeConstraint_setMaxMotorImpulse_1,
  emscripten_bind_btHingeConstraint_setMotorTarget_2 as _emscripten_bind_btHingeConstraint_setMotorTarget_2,
  emscripten_bind_btHingeConstraint_enableFeedback_1 as _emscripten_bind_btHingeConstraint_enableFeedback_1,
  emscripten_bind_btHingeConstraint_getBreakingImpulseThreshold_0 as _emscripten_bind_btHingeConstraint_getBreakingImpulseThreshold_0,
  emscripten_bind_btHingeConstraint_setBreakingImpulseThreshold_1 as _emscripten_bind_btHingeConstraint_setBreakingImpulseThreshold_1,
  emscripten_bind_btHingeConstraint_getParam_2 as _emscripten_bind_btHingeConstraint_getParam_2,
  emscripten_bind_btHingeConstraint_setParam_3 as _emscripten_bind_btHingeConstraint_setParam_3,
  emscripten_bind_btHingeConstraint___destroy___0 as _emscripten_bind_btHingeConstraint___destroy___0,
  emscripten_bind_btSliderConstraint_btSliderConstraint_3 as _emscripten_bind_btSliderConstraint_btSliderConstraint_3,
  emscripten_bind_btSliderConstraint_btSliderConstraint_5 as _emscripten_bind_btSliderConstraint_btSliderConstraint_5,
  emscripten_bind_btSliderConstraint_getLinearPos_0 as _emscripten_bind_btSliderConstraint_getLinearPos_0,
  emscripten_bind_btSliderConstraint_getAngularPos_0 as _emscripten_bind_btSliderConstraint_getAngularPos_0,
  emscripten_bind_btSliderConstraint_setLowerLinLimit_1 as _emscripten_bind_btSliderConstraint_setLowerLinLimit_1,
  emscripten_bind_btSliderConstraint_setUpperLinLimit_1 as _emscripten_bind_btSliderConstraint_setUpperLinLimit_1,
  emscripten_bind_btSliderConstraint_setLowerAngLimit_1 as _emscripten_bind_btSliderConstraint_setLowerAngLimit_1,
  emscripten_bind_btSliderConstraint_setUpperAngLimit_1 as _emscripten_bind_btSliderConstraint_setUpperAngLimit_1,
  emscripten_bind_btSliderConstraint_setPoweredLinMotor_1 as _emscripten_bind_btSliderConstraint_setPoweredLinMotor_1,
  emscripten_bind_btSliderConstraint_setMaxLinMotorForce_1 as _emscripten_bind_btSliderConstraint_setMaxLinMotorForce_1,
  emscripten_bind_btSliderConstraint_setTargetLinMotorVelocity_1 as _emscripten_bind_btSliderConstraint_setTargetLinMotorVelocity_1,
  emscripten_bind_btSliderConstraint_enableFeedback_1 as _emscripten_bind_btSliderConstraint_enableFeedback_1,
  emscripten_bind_btSliderConstraint_getBreakingImpulseThreshold_0 as _emscripten_bind_btSliderConstraint_getBreakingImpulseThreshold_0,
  emscripten_bind_btSliderConstraint_setBreakingImpulseThreshold_1 as _emscripten_bind_btSliderConstraint_setBreakingImpulseThreshold_1,
  emscripten_bind_btSliderConstraint_getParam_2 as _emscripten_bind_btSliderConstraint_getParam_2,
  emscripten_bind_btSliderConstraint_setParam_3 as _emscripten_bind_btSliderConstraint_setParam_3,
  emscripten_bind_btSliderConstraint___destroy___0 as _emscripten_bind_btSliderConstraint___destroy___0,
  emscripten_bind_btFixedConstraint_btFixedConstraint_4 as _emscripten_bind_btFixedConstraint_btFixedConstraint_4,
  emscripten_bind_btFixedConstraint_enableFeedback_1 as _emscripten_bind_btFixedConstraint_enableFeedback_1,
  emscripten_bind_btFixedConstraint_getBreakingImpulseThreshold_0 as _emscripten_bind_btFixedConstraint_getBreakingImpulseThreshold_0,
  emscripten_bind_btFixedConstraint_setBreakingImpulseThreshold_1 as _emscripten_bind_btFixedConstraint_setBreakingImpulseThreshold_1,
  emscripten_bind_btFixedConstraint_getParam_2 as _emscripten_bind_btFixedConstraint_getParam_2,
  emscripten_bind_btFixedConstraint_setParam_3 as _emscripten_bind_btFixedConstraint_setParam_3,
  emscripten_bind_btFixedConstraint___destroy___0 as _emscripten_bind_btFixedConstraint___destroy___0,
  emscripten_bind_btConstraintSolver___destroy___0 as _emscripten_bind_btConstraintSolver___destroy___0,
  emscripten_bind_btDispatcherInfo_get_m_timeStep_0 as _emscripten_bind_btDispatcherInfo_get_m_timeStep_0,
  emscripten_bind_btDispatcherInfo_set_m_timeStep_1 as _emscripten_bind_btDispatcherInfo_set_m_timeStep_1,
  emscripten_bind_btDispatcherInfo_get_m_stepCount_0 as _emscripten_bind_btDispatcherInfo_get_m_stepCount_0,
  emscripten_bind_btDispatcherInfo_set_m_stepCount_1 as _emscripten_bind_btDispatcherInfo_set_m_stepCount_1,
  emscripten_bind_btDispatcherInfo_get_m_dispatchFunc_0 as _emscripten_bind_btDispatcherInfo_get_m_dispatchFunc_0,
  emscripten_bind_btDispatcherInfo_set_m_dispatchFunc_1 as _emscripten_bind_btDispatcherInfo_set_m_dispatchFunc_1,
  emscripten_bind_btDispatcherInfo_get_m_timeOfImpact_0 as _emscripten_bind_btDispatcherInfo_get_m_timeOfImpact_0,
  emscripten_bind_btDispatcherInfo_set_m_timeOfImpact_1 as _emscripten_bind_btDispatcherInfo_set_m_timeOfImpact_1,
  emscripten_bind_btDispatcherInfo_get_m_useContinuous_0 as _emscripten_bind_btDispatcherInfo_get_m_useContinuous_0,
  emscripten_bind_btDispatcherInfo_set_m_useContinuous_1 as _emscripten_bind_btDispatcherInfo_set_m_useContinuous_1,
  emscripten_bind_btDispatcherInfo_get_m_enableSatConvex_0 as _emscripten_bind_btDispatcherInfo_get_m_enableSatConvex_0,
  emscripten_bind_btDispatcherInfo_set_m_enableSatConvex_1 as _emscripten_bind_btDispatcherInfo_set_m_enableSatConvex_1,
  emscripten_bind_btDispatcherInfo_get_m_enableSPU_0 as _emscripten_bind_btDispatcherInfo_get_m_enableSPU_0,
  emscripten_bind_btDispatcherInfo_set_m_enableSPU_1 as _emscripten_bind_btDispatcherInfo_set_m_enableSPU_1,
  emscripten_bind_btDispatcherInfo_get_m_useEpa_0 as _emscripten_bind_btDispatcherInfo_get_m_useEpa_0,
  emscripten_bind_btDispatcherInfo_set_m_useEpa_1 as _emscripten_bind_btDispatcherInfo_set_m_useEpa_1,
  emscripten_bind_btDispatcherInfo_get_m_allowedCcdPenetration_0 as _emscripten_bind_btDispatcherInfo_get_m_allowedCcdPenetration_0,
  emscripten_bind_btDispatcherInfo_set_m_allowedCcdPenetration_1 as _emscripten_bind_btDispatcherInfo_set_m_allowedCcdPenetration_1,
  emscripten_bind_btDispatcherInfo_get_m_useConvexConservativeDistanceUtil_0 as _emscripten_bind_btDispatcherInfo_get_m_useConvexConservativeDistanceUtil_0,
  emscripten_bind_btDispatcherInfo_set_m_useConvexConservativeDistanceUtil_1 as _emscripten_bind_btDispatcherInfo_set_m_useConvexConservativeDistanceUtil_1,
  emscripten_bind_btDispatcherInfo_get_m_convexConservativeDistanceThreshold_0 as _emscripten_bind_btDispatcherInfo_get_m_convexConservativeDistanceThreshold_0,
  emscripten_bind_btDispatcherInfo_set_m_convexConservativeDistanceThreshold_1 as _emscripten_bind_btDispatcherInfo_set_m_convexConservativeDistanceThreshold_1,
  emscripten_bind_btDispatcherInfo___destroy___0 as _emscripten_bind_btDispatcherInfo___destroy___0,
  emscripten_bind_btContactSolverInfo_get_m_splitImpulse_0 as _emscripten_bind_btContactSolverInfo_get_m_splitImpulse_0,
  emscripten_bind_btContactSolverInfo_set_m_splitImpulse_1 as _emscripten_bind_btContactSolverInfo_set_m_splitImpulse_1,
  emscripten_bind_btContactSolverInfo_get_m_splitImpulsePenetrationThreshold_0 as _emscripten_bind_btContactSolverInfo_get_m_splitImpulsePenetrationThreshold_0,
  emscripten_bind_btContactSolverInfo_set_m_splitImpulsePenetrationThreshold_1 as _emscripten_bind_btContactSolverInfo_set_m_splitImpulsePenetrationThreshold_1,
  emscripten_bind_btContactSolverInfo_get_m_numIterations_0 as _emscripten_bind_btContactSolverInfo_get_m_numIterations_0,
  emscripten_bind_btContactSolverInfo_set_m_numIterations_1 as _emscripten_bind_btContactSolverInfo_set_m_numIterations_1,
  emscripten_bind_btContactSolverInfo___destroy___0 as _emscripten_bind_btContactSolverInfo___destroy___0,
  emscripten_bind_btVehicleTuning_btVehicleTuning_0 as _emscripten_bind_btVehicleTuning_btVehicleTuning_0,
  emscripten_bind_btVehicleTuning_get_m_suspensionStiffness_0 as _emscripten_bind_btVehicleTuning_get_m_suspensionStiffness_0,
  emscripten_bind_btVehicleTuning_set_m_suspensionStiffness_1 as _emscripten_bind_btVehicleTuning_set_m_suspensionStiffness_1,
  emscripten_bind_btVehicleTuning_get_m_suspensionCompression_0 as _emscripten_bind_btVehicleTuning_get_m_suspensionCompression_0,
  emscripten_bind_btVehicleTuning_set_m_suspensionCompression_1 as _emscripten_bind_btVehicleTuning_set_m_suspensionCompression_1,
  emscripten_bind_btVehicleTuning_get_m_suspensionDamping_0 as _emscripten_bind_btVehicleTuning_get_m_suspensionDamping_0,
  emscripten_bind_btVehicleTuning_set_m_suspensionDamping_1 as _emscripten_bind_btVehicleTuning_set_m_suspensionDamping_1,
  emscripten_bind_btVehicleTuning_get_m_maxSuspensionTravelCm_0 as _emscripten_bind_btVehicleTuning_get_m_maxSuspensionTravelCm_0,
  emscripten_bind_btVehicleTuning_set_m_maxSuspensionTravelCm_1 as _emscripten_bind_btVehicleTuning_set_m_maxSuspensionTravelCm_1,
  emscripten_bind_btVehicleTuning_get_m_frictionSlip_0 as _emscripten_bind_btVehicleTuning_get_m_frictionSlip_0,
  emscripten_bind_btVehicleTuning_set_m_frictionSlip_1 as _emscripten_bind_btVehicleTuning_set_m_frictionSlip_1,
  emscripten_bind_btVehicleTuning_get_m_maxSuspensionForce_0 as _emscripten_bind_btVehicleTuning_get_m_maxSuspensionForce_0,
  emscripten_bind_btVehicleTuning_set_m_maxSuspensionForce_1 as _emscripten_bind_btVehicleTuning_set_m_maxSuspensionForce_1,
  emscripten_bind_btVehicleRaycasterResult_get_m_hitPointInWorld_0 as _emscripten_bind_btVehicleRaycasterResult_get_m_hitPointInWorld_0,
  emscripten_bind_btVehicleRaycasterResult_set_m_hitPointInWorld_1 as _emscripten_bind_btVehicleRaycasterResult_set_m_hitPointInWorld_1,
  emscripten_bind_btVehicleRaycasterResult_get_m_hitNormalInWorld_0 as _emscripten_bind_btVehicleRaycasterResult_get_m_hitNormalInWorld_0,
  emscripten_bind_btVehicleRaycasterResult_set_m_hitNormalInWorld_1 as _emscripten_bind_btVehicleRaycasterResult_set_m_hitNormalInWorld_1,
  emscripten_bind_btVehicleRaycasterResult_get_m_distFraction_0 as _emscripten_bind_btVehicleRaycasterResult_get_m_distFraction_0,
  emscripten_bind_btVehicleRaycasterResult_set_m_distFraction_1 as _emscripten_bind_btVehicleRaycasterResult_set_m_distFraction_1,
  emscripten_bind_btVehicleRaycasterResult___destroy___0 as _emscripten_bind_btVehicleRaycasterResult___destroy___0,
  emscripten_bind_btDefaultVehicleRaycaster_btDefaultVehicleRaycaster_1 as _emscripten_bind_btDefaultVehicleRaycaster_btDefaultVehicleRaycaster_1,
  emscripten_bind_btDefaultVehicleRaycaster_castRay_3 as _emscripten_bind_btDefaultVehicleRaycaster_castRay_3,
  emscripten_bind_btDefaultVehicleRaycaster___destroy___0 as _emscripten_bind_btDefaultVehicleRaycaster___destroy___0,
  emscripten_bind_RaycastInfo_get_m_contactNormalWS_0 as _emscripten_bind_RaycastInfo_get_m_contactNormalWS_0,
  emscripten_bind_RaycastInfo_set_m_contactNormalWS_1 as _emscripten_bind_RaycastInfo_set_m_contactNormalWS_1,
  emscripten_bind_RaycastInfo_get_m_contactPointWS_0 as _emscripten_bind_RaycastInfo_get_m_contactPointWS_0,
  emscripten_bind_RaycastInfo_set_m_contactPointWS_1 as _emscripten_bind_RaycastInfo_set_m_contactPointWS_1,
  emscripten_bind_RaycastInfo_get_m_suspensionLength_0 as _emscripten_bind_RaycastInfo_get_m_suspensionLength_0,
  emscripten_bind_RaycastInfo_set_m_suspensionLength_1 as _emscripten_bind_RaycastInfo_set_m_suspensionLength_1,
  emscripten_bind_RaycastInfo_get_m_hardPointWS_0 as _emscripten_bind_RaycastInfo_get_m_hardPointWS_0,
  emscripten_bind_RaycastInfo_set_m_hardPointWS_1 as _emscripten_bind_RaycastInfo_set_m_hardPointWS_1,
  emscripten_bind_RaycastInfo_get_m_wheelDirectionWS_0 as _emscripten_bind_RaycastInfo_get_m_wheelDirectionWS_0,
  emscripten_bind_RaycastInfo_set_m_wheelDirectionWS_1 as _emscripten_bind_RaycastInfo_set_m_wheelDirectionWS_1,
  emscripten_bind_RaycastInfo_get_m_wheelAxleWS_0 as _emscripten_bind_RaycastInfo_get_m_wheelAxleWS_0,
  emscripten_bind_RaycastInfo_set_m_wheelAxleWS_1 as _emscripten_bind_RaycastInfo_set_m_wheelAxleWS_1,
  emscripten_bind_RaycastInfo_get_m_isInContact_0 as _emscripten_bind_RaycastInfo_get_m_isInContact_0,
  emscripten_bind_RaycastInfo_set_m_isInContact_1 as _emscripten_bind_RaycastInfo_set_m_isInContact_1,
  emscripten_bind_RaycastInfo_get_m_groundObject_0 as _emscripten_bind_RaycastInfo_get_m_groundObject_0,
  emscripten_bind_RaycastInfo_set_m_groundObject_1 as _emscripten_bind_RaycastInfo_set_m_groundObject_1,
  emscripten_bind_RaycastInfo___destroy___0 as _emscripten_bind_RaycastInfo___destroy___0,
  emscripten_bind_btWheelInfoConstructionInfo_get_m_chassisConnectionCS_0 as _emscripten_bind_btWheelInfoConstructionInfo_get_m_chassisConnectionCS_0,
  emscripten_bind_btWheelInfoConstructionInfo_set_m_chassisConnectionCS_1 as _emscripten_bind_btWheelInfoConstructionInfo_set_m_chassisConnectionCS_1,
  emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelDirectionCS_0 as _emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelDirectionCS_0,
  emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelDirectionCS_1 as _emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelDirectionCS_1,
  emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelAxleCS_0 as _emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelAxleCS_0,
  emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelAxleCS_1 as _emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelAxleCS_1,
  emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionRestLength_0 as _emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionRestLength_0,
  emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionRestLength_1 as _emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionRestLength_1,
  emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionTravelCm_0 as _emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionTravelCm_0,
  emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionTravelCm_1 as _emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionTravelCm_1,
  emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelRadius_0 as _emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelRadius_0,
  emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelRadius_1 as _emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelRadius_1,
  emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionStiffness_0 as _emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionStiffness_0,
  emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionStiffness_1 as _emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionStiffness_1,
  emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingCompression_0 as _emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingCompression_0,
  emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingCompression_1 as _emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingCompression_1,
  emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingRelaxation_0 as _emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingRelaxation_0,
  emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingRelaxation_1 as _emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingRelaxation_1,
  emscripten_bind_btWheelInfoConstructionInfo_get_m_frictionSlip_0 as _emscripten_bind_btWheelInfoConstructionInfo_get_m_frictionSlip_0,
  emscripten_bind_btWheelInfoConstructionInfo_set_m_frictionSlip_1 as _emscripten_bind_btWheelInfoConstructionInfo_set_m_frictionSlip_1,
  emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionForce_0 as _emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionForce_0,
  emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionForce_1 as _emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionForce_1,
  emscripten_bind_btWheelInfoConstructionInfo_get_m_bIsFrontWheel_0 as _emscripten_bind_btWheelInfoConstructionInfo_get_m_bIsFrontWheel_0,
  emscripten_bind_btWheelInfoConstructionInfo_set_m_bIsFrontWheel_1 as _emscripten_bind_btWheelInfoConstructionInfo_set_m_bIsFrontWheel_1,
  emscripten_bind_btWheelInfoConstructionInfo___destroy___0 as _emscripten_bind_btWheelInfoConstructionInfo___destroy___0,
  emscripten_bind_btWheelInfo_btWheelInfo_1 as _emscripten_bind_btWheelInfo_btWheelInfo_1,
  emscripten_bind_btWheelInfo_getSuspensionRestLength_0 as _emscripten_bind_btWheelInfo_getSuspensionRestLength_0,
  emscripten_bind_btWheelInfo_updateWheel_2 as _emscripten_bind_btWheelInfo_updateWheel_2,
  emscripten_bind_btWheelInfo_get_m_suspensionStiffness_0 as _emscripten_bind_btWheelInfo_get_m_suspensionStiffness_0,
  emscripten_bind_btWheelInfo_set_m_suspensionStiffness_1 as _emscripten_bind_btWheelInfo_set_m_suspensionStiffness_1,
  emscripten_bind_btWheelInfo_get_m_frictionSlip_0 as _emscripten_bind_btWheelInfo_get_m_frictionSlip_0,
  emscripten_bind_btWheelInfo_set_m_frictionSlip_1 as _emscripten_bind_btWheelInfo_set_m_frictionSlip_1,
  emscripten_bind_btWheelInfo_get_m_engineForce_0 as _emscripten_bind_btWheelInfo_get_m_engineForce_0,
  emscripten_bind_btWheelInfo_set_m_engineForce_1 as _emscripten_bind_btWheelInfo_set_m_engineForce_1,
  emscripten_bind_btWheelInfo_get_m_rollInfluence_0 as _emscripten_bind_btWheelInfo_get_m_rollInfluence_0,
  emscripten_bind_btWheelInfo_set_m_rollInfluence_1 as _emscripten_bind_btWheelInfo_set_m_rollInfluence_1,
  emscripten_bind_btWheelInfo_get_m_suspensionRestLength1_0 as _emscripten_bind_btWheelInfo_get_m_suspensionRestLength1_0,
  emscripten_bind_btWheelInfo_set_m_suspensionRestLength1_1 as _emscripten_bind_btWheelInfo_set_m_suspensionRestLength1_1,
  emscripten_bind_btWheelInfo_get_m_wheelsRadius_0 as _emscripten_bind_btWheelInfo_get_m_wheelsRadius_0,
  emscripten_bind_btWheelInfo_set_m_wheelsRadius_1 as _emscripten_bind_btWheelInfo_set_m_wheelsRadius_1,
  emscripten_bind_btWheelInfo_get_m_wheelsDampingCompression_0 as _emscripten_bind_btWheelInfo_get_m_wheelsDampingCompression_0,
  emscripten_bind_btWheelInfo_set_m_wheelsDampingCompression_1 as _emscripten_bind_btWheelInfo_set_m_wheelsDampingCompression_1,
  emscripten_bind_btWheelInfo_get_m_wheelsDampingRelaxation_0 as _emscripten_bind_btWheelInfo_get_m_wheelsDampingRelaxation_0,
  emscripten_bind_btWheelInfo_set_m_wheelsDampingRelaxation_1 as _emscripten_bind_btWheelInfo_set_m_wheelsDampingRelaxation_1,
  emscripten_bind_btWheelInfo_get_m_steering_0 as _emscripten_bind_btWheelInfo_get_m_steering_0,
  emscripten_bind_btWheelInfo_set_m_steering_1 as _emscripten_bind_btWheelInfo_set_m_steering_1,
  emscripten_bind_btWheelInfo_get_m_maxSuspensionForce_0 as _emscripten_bind_btWheelInfo_get_m_maxSuspensionForce_0,
  emscripten_bind_btWheelInfo_set_m_maxSuspensionForce_1 as _emscripten_bind_btWheelInfo_set_m_maxSuspensionForce_1,
  emscripten_bind_btWheelInfo_get_m_maxSuspensionTravelCm_0 as _emscripten_bind_btWheelInfo_get_m_maxSuspensionTravelCm_0,
  emscripten_bind_btWheelInfo_set_m_maxSuspensionTravelCm_1 as _emscripten_bind_btWheelInfo_set_m_maxSuspensionTravelCm_1,
  emscripten_bind_btWheelInfo_get_m_wheelsSuspensionForce_0 as _emscripten_bind_btWheelInfo_get_m_wheelsSuspensionForce_0,
  emscripten_bind_btWheelInfo_set_m_wheelsSuspensionForce_1 as _emscripten_bind_btWheelInfo_set_m_wheelsSuspensionForce_1,
  emscripten_bind_btWheelInfo_get_m_bIsFrontWheel_0 as _emscripten_bind_btWheelInfo_get_m_bIsFrontWheel_0,
  emscripten_bind_btWheelInfo_set_m_bIsFrontWheel_1 as _emscripten_bind_btWheelInfo_set_m_bIsFrontWheel_1,
  emscripten_bind_btWheelInfo_get_m_raycastInfo_0 as _emscripten_bind_btWheelInfo_get_m_raycastInfo_0,
  emscripten_bind_btWheelInfo_set_m_raycastInfo_1 as _emscripten_bind_btWheelInfo_set_m_raycastInfo_1,
  emscripten_bind_btWheelInfo_get_m_chassisConnectionPointCS_0 as _emscripten_bind_btWheelInfo_get_m_chassisConnectionPointCS_0,
  emscripten_bind_btWheelInfo_set_m_chassisConnectionPointCS_1 as _emscripten_bind_btWheelInfo_set_m_chassisConnectionPointCS_1,
  emscripten_bind_btWheelInfo_get_m_worldTransform_0 as _emscripten_bind_btWheelInfo_get_m_worldTransform_0,
  emscripten_bind_btWheelInfo_set_m_worldTransform_1 as _emscripten_bind_btWheelInfo_set_m_worldTransform_1,
  emscripten_bind_btWheelInfo_get_m_wheelDirectionCS_0 as _emscripten_bind_btWheelInfo_get_m_wheelDirectionCS_0,
  emscripten_bind_btWheelInfo_set_m_wheelDirectionCS_1 as _emscripten_bind_btWheelInfo_set_m_wheelDirectionCS_1,
  emscripten_bind_btWheelInfo_get_m_wheelAxleCS_0 as _emscripten_bind_btWheelInfo_get_m_wheelAxleCS_0,
  emscripten_bind_btWheelInfo_set_m_wheelAxleCS_1 as _emscripten_bind_btWheelInfo_set_m_wheelAxleCS_1,
  emscripten_bind_btWheelInfo_get_m_rotation_0 as _emscripten_bind_btWheelInfo_get_m_rotation_0,
  emscripten_bind_btWheelInfo_set_m_rotation_1 as _emscripten_bind_btWheelInfo_set_m_rotation_1,
  emscripten_bind_btWheelInfo_get_m_deltaRotation_0 as _emscripten_bind_btWheelInfo_get_m_deltaRotation_0,
  emscripten_bind_btWheelInfo_set_m_deltaRotation_1 as _emscripten_bind_btWheelInfo_set_m_deltaRotation_1,
  emscripten_bind_btWheelInfo_get_m_brake_0 as _emscripten_bind_btWheelInfo_get_m_brake_0,
  emscripten_bind_btWheelInfo_set_m_brake_1 as _emscripten_bind_btWheelInfo_set_m_brake_1,
  emscripten_bind_btWheelInfo_get_m_clippedInvContactDotSuspension_0 as _emscripten_bind_btWheelInfo_get_m_clippedInvContactDotSuspension_0,
  emscripten_bind_btWheelInfo_set_m_clippedInvContactDotSuspension_1 as _emscripten_bind_btWheelInfo_set_m_clippedInvContactDotSuspension_1,
  emscripten_bind_btWheelInfo_get_m_suspensionRelativeVelocity_0 as _emscripten_bind_btWheelInfo_get_m_suspensionRelativeVelocity_0,
  emscripten_bind_btWheelInfo_set_m_suspensionRelativeVelocity_1 as _emscripten_bind_btWheelInfo_set_m_suspensionRelativeVelocity_1,
  emscripten_bind_btWheelInfo_get_m_skidInfo_0 as _emscripten_bind_btWheelInfo_get_m_skidInfo_0,
  emscripten_bind_btWheelInfo_set_m_skidInfo_1 as _emscripten_bind_btWheelInfo_set_m_skidInfo_1,
  emscripten_bind_btWheelInfo___destroy___0 as _emscripten_bind_btWheelInfo___destroy___0,
  emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_3 as _emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_3,
  emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_4 as _emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_4,
  emscripten_bind_btKinematicCharacterController_setUpAxis_1 as _emscripten_bind_btKinematicCharacterController_setUpAxis_1,
  emscripten_bind_btKinematicCharacterController_setWalkDirection_1 as _emscripten_bind_btKinematicCharacterController_setWalkDirection_1,
  emscripten_bind_btKinematicCharacterController_setVelocityForTimeInterval_2 as _emscripten_bind_btKinematicCharacterController_setVelocityForTimeInterval_2,
  emscripten_bind_btKinematicCharacterController_warp_1 as _emscripten_bind_btKinematicCharacterController_warp_1,
  emscripten_bind_btKinematicCharacterController_preStep_1 as _emscripten_bind_btKinematicCharacterController_preStep_1,
  emscripten_bind_btKinematicCharacterController_playerStep_2 as _emscripten_bind_btKinematicCharacterController_playerStep_2,
  emscripten_bind_btKinematicCharacterController_setFallSpeed_1 as _emscripten_bind_btKinematicCharacterController_setFallSpeed_1,
  emscripten_bind_btKinematicCharacterController_setJumpSpeed_1 as _emscripten_bind_btKinematicCharacterController_setJumpSpeed_1,
  emscripten_bind_btKinematicCharacterController_setMaxJumpHeight_1 as _emscripten_bind_btKinematicCharacterController_setMaxJumpHeight_1,
  emscripten_bind_btKinematicCharacterController_canJump_0 as _emscripten_bind_btKinematicCharacterController_canJump_0,
  emscripten_bind_btKinematicCharacterController_jump_0 as _emscripten_bind_btKinematicCharacterController_jump_0,
  emscripten_bind_btKinematicCharacterController_setGravity_1 as _emscripten_bind_btKinematicCharacterController_setGravity_1,
  emscripten_bind_btKinematicCharacterController_getGravity_0 as _emscripten_bind_btKinematicCharacterController_getGravity_0,
  emscripten_bind_btKinematicCharacterController_setMaxSlope_1 as _emscripten_bind_btKinematicCharacterController_setMaxSlope_1,
  emscripten_bind_btKinematicCharacterController_getMaxSlope_0 as _emscripten_bind_btKinematicCharacterController_getMaxSlope_0,
  emscripten_bind_btKinematicCharacterController_getGhostObject_0 as _emscripten_bind_btKinematicCharacterController_getGhostObject_0,
  emscripten_bind_btKinematicCharacterController_setUseGhostSweepTest_1 as _emscripten_bind_btKinematicCharacterController_setUseGhostSweepTest_1,
  emscripten_bind_btKinematicCharacterController_onGround_0 as _emscripten_bind_btKinematicCharacterController_onGround_0,
  emscripten_bind_btKinematicCharacterController_setUpInterpolate_1 as _emscripten_bind_btKinematicCharacterController_setUpInterpolate_1,
  emscripten_bind_btKinematicCharacterController_updateAction_2 as _emscripten_bind_btKinematicCharacterController_updateAction_2,
  emscripten_bind_btKinematicCharacterController___destroy___0 as _emscripten_bind_btKinematicCharacterController___destroy___0,
  emscripten_bind_btRaycastVehicle_btRaycastVehicle_3 as _emscripten_bind_btRaycastVehicle_btRaycastVehicle_3,
  emscripten_bind_btRaycastVehicle_applyEngineForce_2 as _emscripten_bind_btRaycastVehicle_applyEngineForce_2,
  emscripten_bind_btRaycastVehicle_setSteeringValue_2 as _emscripten_bind_btRaycastVehicle_setSteeringValue_2,
  emscripten_bind_btRaycastVehicle_getWheelTransformWS_1 as _emscripten_bind_btRaycastVehicle_getWheelTransformWS_1,
  emscripten_bind_btRaycastVehicle_updateWheelTransform_2 as _emscripten_bind_btRaycastVehicle_updateWheelTransform_2,
  emscripten_bind_btRaycastVehicle_addWheel_7 as _emscripten_bind_btRaycastVehicle_addWheel_7,
  emscripten_bind_btRaycastVehicle_getNumWheels_0 as _emscripten_bind_btRaycastVehicle_getNumWheels_0,
  emscripten_bind_btRaycastVehicle_getRigidBody_0 as _emscripten_bind_btRaycastVehicle_getRigidBody_0,
  emscripten_bind_btRaycastVehicle_getWheelInfo_1 as _emscripten_bind_btRaycastVehicle_getWheelInfo_1,
  emscripten_bind_btRaycastVehicle_setBrake_2 as _emscripten_bind_btRaycastVehicle_setBrake_2,
  emscripten_bind_btRaycastVehicle_setCoordinateSystem_3 as _emscripten_bind_btRaycastVehicle_setCoordinateSystem_3,
  emscripten_bind_btRaycastVehicle_getCurrentSpeedKmHour_0 as _emscripten_bind_btRaycastVehicle_getCurrentSpeedKmHour_0,
  emscripten_bind_btRaycastVehicle_getChassisWorldTransform_0 as _emscripten_bind_btRaycastVehicle_getChassisWorldTransform_0,
  emscripten_bind_btRaycastVehicle_rayCast_1 as _emscripten_bind_btRaycastVehicle_rayCast_1,
  emscripten_bind_btRaycastVehicle_updateVehicle_1 as _emscripten_bind_btRaycastVehicle_updateVehicle_1,
  emscripten_bind_btRaycastVehicle_resetSuspension_0 as _emscripten_bind_btRaycastVehicle_resetSuspension_0,
  emscripten_bind_btRaycastVehicle_getSteeringValue_1 as _emscripten_bind_btRaycastVehicle_getSteeringValue_1,
  emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_1 as _emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_1,
  emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_2 as _emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_2,
  emscripten_bind_btRaycastVehicle_setPitchControl_1 as _emscripten_bind_btRaycastVehicle_setPitchControl_1,
  emscripten_bind_btRaycastVehicle_updateSuspension_1 as _emscripten_bind_btRaycastVehicle_updateSuspension_1,
  emscripten_bind_btRaycastVehicle_updateFriction_1 as _emscripten_bind_btRaycastVehicle_updateFriction_1,
  emscripten_bind_btRaycastVehicle_getRightAxis_0 as _emscripten_bind_btRaycastVehicle_getRightAxis_0,
  emscripten_bind_btRaycastVehicle_getUpAxis_0 as _emscripten_bind_btRaycastVehicle_getUpAxis_0,
  emscripten_bind_btRaycastVehicle_getForwardAxis_0 as _emscripten_bind_btRaycastVehicle_getForwardAxis_0,
  emscripten_bind_btRaycastVehicle_getForwardVector_0 as _emscripten_bind_btRaycastVehicle_getForwardVector_0,
  emscripten_bind_btRaycastVehicle_getUserConstraintType_0 as _emscripten_bind_btRaycastVehicle_getUserConstraintType_0,
  emscripten_bind_btRaycastVehicle_setUserConstraintType_1 as _emscripten_bind_btRaycastVehicle_setUserConstraintType_1,
  emscripten_bind_btRaycastVehicle_setUserConstraintId_1 as _emscripten_bind_btRaycastVehicle_setUserConstraintId_1,
  emscripten_bind_btRaycastVehicle_getUserConstraintId_0 as _emscripten_bind_btRaycastVehicle_getUserConstraintId_0,
  emscripten_bind_btRaycastVehicle_updateAction_2 as _emscripten_bind_btRaycastVehicle_updateAction_2,
  emscripten_bind_btRaycastVehicle___destroy___0 as _emscripten_bind_btRaycastVehicle___destroy___0,
  emscripten_bind_btPairCachingGhostObject_btPairCachingGhostObject_0 as _emscripten_bind_btPairCachingGhostObject_btPairCachingGhostObject_0,
  emscripten_bind_btPairCachingGhostObject_setAnisotropicFriction_2 as _emscripten_bind_btPairCachingGhostObject_setAnisotropicFriction_2,
  emscripten_bind_btPairCachingGhostObject_getCollisionShape_0 as _emscripten_bind_btPairCachingGhostObject_getCollisionShape_0,
  emscripten_bind_btPairCachingGhostObject_setContactProcessingThreshold_1 as _emscripten_bind_btPairCachingGhostObject_setContactProcessingThreshold_1,
  emscripten_bind_btPairCachingGhostObject_setActivationState_1 as _emscripten_bind_btPairCachingGhostObject_setActivationState_1,
  emscripten_bind_btPairCachingGhostObject_forceActivationState_1 as _emscripten_bind_btPairCachingGhostObject_forceActivationState_1,
  emscripten_bind_btPairCachingGhostObject_activate_0 as _emscripten_bind_btPairCachingGhostObject_activate_0,
  emscripten_bind_btPairCachingGhostObject_activate_1 as _emscripten_bind_btPairCachingGhostObject_activate_1,
  emscripten_bind_btPairCachingGhostObject_isActive_0 as _emscripten_bind_btPairCachingGhostObject_isActive_0,
  emscripten_bind_btPairCachingGhostObject_isKinematicObject_0 as _emscripten_bind_btPairCachingGhostObject_isKinematicObject_0,
  emscripten_bind_btPairCachingGhostObject_isStaticObject_0 as _emscripten_bind_btPairCachingGhostObject_isStaticObject_0,
  emscripten_bind_btPairCachingGhostObject_isStaticOrKinematicObject_0 as _emscripten_bind_btPairCachingGhostObject_isStaticOrKinematicObject_0,
  emscripten_bind_btPairCachingGhostObject_getRestitution_0 as _emscripten_bind_btPairCachingGhostObject_getRestitution_0,
  emscripten_bind_btPairCachingGhostObject_getFriction_0 as _emscripten_bind_btPairCachingGhostObject_getFriction_0,
  emscripten_bind_btPairCachingGhostObject_getRollingFriction_0 as _emscripten_bind_btPairCachingGhostObject_getRollingFriction_0,
  emscripten_bind_btPairCachingGhostObject_setRestitution_1 as _emscripten_bind_btPairCachingGhostObject_setRestitution_1,
  emscripten_bind_btPairCachingGhostObject_setFriction_1 as _emscripten_bind_btPairCachingGhostObject_setFriction_1,
  emscripten_bind_btPairCachingGhostObject_setRollingFriction_1 as _emscripten_bind_btPairCachingGhostObject_setRollingFriction_1,
  emscripten_bind_btPairCachingGhostObject_getWorldTransform_0 as _emscripten_bind_btPairCachingGhostObject_getWorldTransform_0,
  emscripten_bind_btPairCachingGhostObject_getCollisionFlags_0 as _emscripten_bind_btPairCachingGhostObject_getCollisionFlags_0,
  emscripten_bind_btPairCachingGhostObject_setCollisionFlags_1 as _emscripten_bind_btPairCachingGhostObject_setCollisionFlags_1,
  emscripten_bind_btPairCachingGhostObject_setWorldTransform_1 as _emscripten_bind_btPairCachingGhostObject_setWorldTransform_1,
  emscripten_bind_btPairCachingGhostObject_setCollisionShape_1 as _emscripten_bind_btPairCachingGhostObject_setCollisionShape_1,
  emscripten_bind_btPairCachingGhostObject_setCcdMotionThreshold_1 as _emscripten_bind_btPairCachingGhostObject_setCcdMotionThreshold_1,
  emscripten_bind_btPairCachingGhostObject_setCcdSweptSphereRadius_1 as _emscripten_bind_btPairCachingGhostObject_setCcdSweptSphereRadius_1,
  emscripten_bind_btPairCachingGhostObject_getUserIndex_0 as _emscripten_bind_btPairCachingGhostObject_getUserIndex_0,
  emscripten_bind_btPairCachingGhostObject_setUserIndex_1 as _emscripten_bind_btPairCachingGhostObject_setUserIndex_1,
  emscripten_bind_btPairCachingGhostObject_getUserPointer_0 as _emscripten_bind_btPairCachingGhostObject_getUserPointer_0,
  emscripten_bind_btPairCachingGhostObject_setUserPointer_1 as _emscripten_bind_btPairCachingGhostObject_setUserPointer_1,
  emscripten_bind_btPairCachingGhostObject_getBroadphaseHandle_0 as _emscripten_bind_btPairCachingGhostObject_getBroadphaseHandle_0,
  emscripten_bind_btPairCachingGhostObject_getNumOverlappingObjects_0 as _emscripten_bind_btPairCachingGhostObject_getNumOverlappingObjects_0,
  emscripten_bind_btPairCachingGhostObject_getOverlappingObject_1 as _emscripten_bind_btPairCachingGhostObject_getOverlappingObject_1,
  emscripten_bind_btPairCachingGhostObject___destroy___0 as _emscripten_bind_btPairCachingGhostObject___destroy___0,
  emscripten_bind_btGhostPairCallback_btGhostPairCallback_0 as _emscripten_bind_btGhostPairCallback_btGhostPairCallback_0,
  emscripten_bind_btGhostPairCallback___destroy___0 as _emscripten_bind_btGhostPairCallback___destroy___0,
  emscripten_bind_btSoftBodyWorldInfo_btSoftBodyWorldInfo_0 as _emscripten_bind_btSoftBodyWorldInfo_btSoftBodyWorldInfo_0,
  emscripten_bind_btSoftBodyWorldInfo_get_air_density_0 as _emscripten_bind_btSoftBodyWorldInfo_get_air_density_0,
  emscripten_bind_btSoftBodyWorldInfo_set_air_density_1 as _emscripten_bind_btSoftBodyWorldInfo_set_air_density_1,
  emscripten_bind_btSoftBodyWorldInfo_get_water_density_0 as _emscripten_bind_btSoftBodyWorldInfo_get_water_density_0,
  emscripten_bind_btSoftBodyWorldInfo_set_water_density_1 as _emscripten_bind_btSoftBodyWorldInfo_set_water_density_1,
  emscripten_bind_btSoftBodyWorldInfo_get_water_offset_0 as _emscripten_bind_btSoftBodyWorldInfo_get_water_offset_0,
  emscripten_bind_btSoftBodyWorldInfo_set_water_offset_1 as _emscripten_bind_btSoftBodyWorldInfo_set_water_offset_1,
  emscripten_bind_btSoftBodyWorldInfo_get_m_maxDisplacement_0 as _emscripten_bind_btSoftBodyWorldInfo_get_m_maxDisplacement_0,
  emscripten_bind_btSoftBodyWorldInfo_set_m_maxDisplacement_1 as _emscripten_bind_btSoftBodyWorldInfo_set_m_maxDisplacement_1,
  emscripten_bind_btSoftBodyWorldInfo_get_water_normal_0 as _emscripten_bind_btSoftBodyWorldInfo_get_water_normal_0,
  emscripten_bind_btSoftBodyWorldInfo_set_water_normal_1 as _emscripten_bind_btSoftBodyWorldInfo_set_water_normal_1,
  emscripten_bind_btSoftBodyWorldInfo_get_m_broadphase_0 as _emscripten_bind_btSoftBodyWorldInfo_get_m_broadphase_0,
  emscripten_bind_btSoftBodyWorldInfo_set_m_broadphase_1 as _emscripten_bind_btSoftBodyWorldInfo_set_m_broadphase_1,
  emscripten_bind_btSoftBodyWorldInfo_get_m_dispatcher_0 as _emscripten_bind_btSoftBodyWorldInfo_get_m_dispatcher_0,
  emscripten_bind_btSoftBodyWorldInfo_set_m_dispatcher_1 as _emscripten_bind_btSoftBodyWorldInfo_set_m_dispatcher_1,
  emscripten_bind_btSoftBodyWorldInfo_get_m_gravity_0 as _emscripten_bind_btSoftBodyWorldInfo_get_m_gravity_0,
  emscripten_bind_btSoftBodyWorldInfo_set_m_gravity_1 as _emscripten_bind_btSoftBodyWorldInfo_set_m_gravity_1,
  emscripten_bind_btSoftBodyWorldInfo___destroy___0 as _emscripten_bind_btSoftBodyWorldInfo___destroy___0,
  emscripten_bind_Face_get_m_n_1 as _emscripten_bind_Face_get_m_n_1,
  emscripten_bind_Face_set_m_n_2 as _emscripten_bind_Face_set_m_n_2,
  emscripten_bind_Face_get_m_normal_0 as _emscripten_bind_Face_get_m_normal_0,
  emscripten_bind_Face_set_m_normal_1 as _emscripten_bind_Face_set_m_normal_1,
  emscripten_bind_Face_get_m_ra_0 as _emscripten_bind_Face_get_m_ra_0,
  emscripten_bind_Face_set_m_ra_1 as _emscripten_bind_Face_set_m_ra_1,
  emscripten_bind_Face___destroy___0 as _emscripten_bind_Face___destroy___0,
  emscripten_bind_tFaceArray_size_0 as _emscripten_bind_tFaceArray_size_0,
  emscripten_bind_tFaceArray_at_1 as _emscripten_bind_tFaceArray_at_1,
  emscripten_bind_tFaceArray___destroy___0 as _emscripten_bind_tFaceArray___destroy___0,
  emscripten_bind_Node_get_m_x_0 as _emscripten_bind_Node_get_m_x_0,
  emscripten_bind_Node_set_m_x_1 as _emscripten_bind_Node_set_m_x_1,
  emscripten_bind_Node_get_m_q_0 as _emscripten_bind_Node_get_m_q_0,
  emscripten_bind_Node_set_m_q_1 as _emscripten_bind_Node_set_m_q_1,
  emscripten_bind_Node_get_m_v_0 as _emscripten_bind_Node_get_m_v_0,
  emscripten_bind_Node_set_m_v_1 as _emscripten_bind_Node_set_m_v_1,
  emscripten_bind_Node_get_m_f_0 as _emscripten_bind_Node_get_m_f_0,
  emscripten_bind_Node_set_m_f_1 as _emscripten_bind_Node_set_m_f_1,
  emscripten_bind_Node_get_m_n_0 as _emscripten_bind_Node_get_m_n_0,
  emscripten_bind_Node_set_m_n_1 as _emscripten_bind_Node_set_m_n_1,
  emscripten_bind_Node_get_m_im_0 as _emscripten_bind_Node_get_m_im_0,
  emscripten_bind_Node_set_m_im_1 as _emscripten_bind_Node_set_m_im_1,
  emscripten_bind_Node_get_m_area_0 as _emscripten_bind_Node_get_m_area_0,
  emscripten_bind_Node_set_m_area_1 as _emscripten_bind_Node_set_m_area_1,
  emscripten_bind_Node___destroy___0 as _emscripten_bind_Node___destroy___0,
  emscripten_bind_tNodeArray_size_0 as _emscripten_bind_tNodeArray_size_0,
  emscripten_bind_tNodeArray_at_1 as _emscripten_bind_tNodeArray_at_1,
  emscripten_bind_tNodeArray___destroy___0 as _emscripten_bind_tNodeArray___destroy___0,
  emscripten_bind_Material_get_m_kLST_0 as _emscripten_bind_Material_get_m_kLST_0,
  emscripten_bind_Material_set_m_kLST_1 as _emscripten_bind_Material_set_m_kLST_1,
  emscripten_bind_Material_get_m_kAST_0 as _emscripten_bind_Material_get_m_kAST_0,
  emscripten_bind_Material_set_m_kAST_1 as _emscripten_bind_Material_set_m_kAST_1,
  emscripten_bind_Material_get_m_kVST_0 as _emscripten_bind_Material_get_m_kVST_0,
  emscripten_bind_Material_set_m_kVST_1 as _emscripten_bind_Material_set_m_kVST_1,
  emscripten_bind_Material_get_m_flags_0 as _emscripten_bind_Material_get_m_flags_0,
  emscripten_bind_Material_set_m_flags_1 as _emscripten_bind_Material_set_m_flags_1,
  emscripten_bind_Material___destroy___0 as _emscripten_bind_Material___destroy___0,
  emscripten_bind_tMaterialArray_size_0 as _emscripten_bind_tMaterialArray_size_0,
  emscripten_bind_tMaterialArray_at_1 as _emscripten_bind_tMaterialArray_at_1,
  emscripten_bind_tMaterialArray___destroy___0 as _emscripten_bind_tMaterialArray___destroy___0,
  emscripten_bind_Anchor_get_m_node_0 as _emscripten_bind_Anchor_get_m_node_0,
  emscripten_bind_Anchor_set_m_node_1 as _emscripten_bind_Anchor_set_m_node_1,
  emscripten_bind_Anchor_get_m_local_0 as _emscripten_bind_Anchor_get_m_local_0,
  emscripten_bind_Anchor_set_m_local_1 as _emscripten_bind_Anchor_set_m_local_1,
  emscripten_bind_Anchor_get_m_body_0 as _emscripten_bind_Anchor_get_m_body_0,
  emscripten_bind_Anchor_set_m_body_1 as _emscripten_bind_Anchor_set_m_body_1,
  emscripten_bind_Anchor_get_m_influence_0 as _emscripten_bind_Anchor_get_m_influence_0,
  emscripten_bind_Anchor_set_m_influence_1 as _emscripten_bind_Anchor_set_m_influence_1,
  emscripten_bind_Anchor_get_m_c0_0 as _emscripten_bind_Anchor_get_m_c0_0,
  emscripten_bind_Anchor_set_m_c0_1 as _emscripten_bind_Anchor_set_m_c0_1,
  emscripten_bind_Anchor_get_m_c1_0 as _emscripten_bind_Anchor_get_m_c1_0,
  emscripten_bind_Anchor_set_m_c1_1 as _emscripten_bind_Anchor_set_m_c1_1,
  emscripten_bind_Anchor_get_m_c2_0 as _emscripten_bind_Anchor_get_m_c2_0,
  emscripten_bind_Anchor_set_m_c2_1 as _emscripten_bind_Anchor_set_m_c2_1,
  emscripten_bind_Anchor___destroy___0 as _emscripten_bind_Anchor___destroy___0,
  emscripten_bind_tAnchorArray_size_0 as _emscripten_bind_tAnchorArray_size_0,
  emscripten_bind_tAnchorArray_at_1 as _emscripten_bind_tAnchorArray_at_1,
  emscripten_bind_tAnchorArray_clear_0 as _emscripten_bind_tAnchorArray_clear_0,
  emscripten_bind_tAnchorArray_push_back_1 as _emscripten_bind_tAnchorArray_push_back_1,
  emscripten_bind_tAnchorArray_pop_back_0 as _emscripten_bind_tAnchorArray_pop_back_0,
  emscripten_bind_tAnchorArray___destroy___0 as _emscripten_bind_tAnchorArray___destroy___0,
  emscripten_bind_Config_get_kVCF_0 as _emscripten_bind_Config_get_kVCF_0,
  emscripten_bind_Config_set_kVCF_1 as _emscripten_bind_Config_set_kVCF_1,
  emscripten_bind_Config_get_kDP_0 as _emscripten_bind_Config_get_kDP_0,
  emscripten_bind_Config_set_kDP_1 as _emscripten_bind_Config_set_kDP_1,
  emscripten_bind_Config_get_kDG_0 as _emscripten_bind_Config_get_kDG_0,
  emscripten_bind_Config_set_kDG_1 as _emscripten_bind_Config_set_kDG_1,
  emscripten_bind_Config_get_kLF_0 as _emscripten_bind_Config_get_kLF_0,
  emscripten_bind_Config_set_kLF_1 as _emscripten_bind_Config_set_kLF_1,
  emscripten_bind_Config_get_kPR_0 as _emscripten_bind_Config_get_kPR_0,
  emscripten_bind_Config_set_kPR_1 as _emscripten_bind_Config_set_kPR_1,
  emscripten_bind_Config_get_kVC_0 as _emscripten_bind_Config_get_kVC_0,
  emscripten_bind_Config_set_kVC_1 as _emscripten_bind_Config_set_kVC_1,
  emscripten_bind_Config_get_kDF_0 as _emscripten_bind_Config_get_kDF_0,
  emscripten_bind_Config_set_kDF_1 as _emscripten_bind_Config_set_kDF_1,
  emscripten_bind_Config_get_kMT_0 as _emscripten_bind_Config_get_kMT_0,
  emscripten_bind_Config_set_kMT_1 as _emscripten_bind_Config_set_kMT_1,
  emscripten_bind_Config_get_kCHR_0 as _emscripten_bind_Config_get_kCHR_0,
  emscripten_bind_Config_set_kCHR_1 as _emscripten_bind_Config_set_kCHR_1,
  emscripten_bind_Config_get_kKHR_0 as _emscripten_bind_Config_get_kKHR_0,
  emscripten_bind_Config_set_kKHR_1 as _emscripten_bind_Config_set_kKHR_1,
  emscripten_bind_Config_get_kSHR_0 as _emscripten_bind_Config_get_kSHR_0,
  emscripten_bind_Config_set_kSHR_1 as _emscripten_bind_Config_set_kSHR_1,
  emscripten_bind_Config_get_kAHR_0 as _emscripten_bind_Config_get_kAHR_0,
  emscripten_bind_Config_set_kAHR_1 as _emscripten_bind_Config_set_kAHR_1,
  emscripten_bind_Config_get_kSRHR_CL_0 as _emscripten_bind_Config_get_kSRHR_CL_0,
  emscripten_bind_Config_set_kSRHR_CL_1 as _emscripten_bind_Config_set_kSRHR_CL_1,
  emscripten_bind_Config_get_kSKHR_CL_0 as _emscripten_bind_Config_get_kSKHR_CL_0,
  emscripten_bind_Config_set_kSKHR_CL_1 as _emscripten_bind_Config_set_kSKHR_CL_1,
  emscripten_bind_Config_get_kSSHR_CL_0 as _emscripten_bind_Config_get_kSSHR_CL_0,
  emscripten_bind_Config_set_kSSHR_CL_1 as _emscripten_bind_Config_set_kSSHR_CL_1,
  emscripten_bind_Config_get_kSR_SPLT_CL_0 as _emscripten_bind_Config_get_kSR_SPLT_CL_0,
  emscripten_bind_Config_set_kSR_SPLT_CL_1 as _emscripten_bind_Config_set_kSR_SPLT_CL_1,
  emscripten_bind_Config_get_kSK_SPLT_CL_0 as _emscripten_bind_Config_get_kSK_SPLT_CL_0,
  emscripten_bind_Config_set_kSK_SPLT_CL_1 as _emscripten_bind_Config_set_kSK_SPLT_CL_1,
  emscripten_bind_Config_get_kSS_SPLT_CL_0 as _emscripten_bind_Config_get_kSS_SPLT_CL_0,
  emscripten_bind_Config_set_kSS_SPLT_CL_1 as _emscripten_bind_Config_set_kSS_SPLT_CL_1,
  emscripten_bind_Config_get_maxvolume_0 as _emscripten_bind_Config_get_maxvolume_0,
  emscripten_bind_Config_set_maxvolume_1 as _emscripten_bind_Config_set_maxvolume_1,
  emscripten_bind_Config_get_timescale_0 as _emscripten_bind_Config_get_timescale_0,
  emscripten_bind_Config_set_timescale_1 as _emscripten_bind_Config_set_timescale_1,
  emscripten_bind_Config_get_viterations_0 as _emscripten_bind_Config_get_viterations_0,
  emscripten_bind_Config_set_viterations_1 as _emscripten_bind_Config_set_viterations_1,
  emscripten_bind_Config_get_piterations_0 as _emscripten_bind_Config_get_piterations_0,
  emscripten_bind_Config_set_piterations_1 as _emscripten_bind_Config_set_piterations_1,
  emscripten_bind_Config_get_diterations_0 as _emscripten_bind_Config_get_diterations_0,
  emscripten_bind_Config_set_diterations_1 as _emscripten_bind_Config_set_diterations_1,
  emscripten_bind_Config_get_citerations_0 as _emscripten_bind_Config_get_citerations_0,
  emscripten_bind_Config_set_citerations_1 as _emscripten_bind_Config_set_citerations_1,
  emscripten_bind_Config_get_collisions_0 as _emscripten_bind_Config_get_collisions_0,
  emscripten_bind_Config_set_collisions_1 as _emscripten_bind_Config_set_collisions_1,
  emscripten_bind_Config___destroy___0 as _emscripten_bind_Config___destroy___0,
  emscripten_bind_btSoftBody_btSoftBody_4 as _emscripten_bind_btSoftBody_btSoftBody_4,
  emscripten_bind_btSoftBody_checkLink_2 as _emscripten_bind_btSoftBody_checkLink_2,
  emscripten_bind_btSoftBody_checkFace_3 as _emscripten_bind_btSoftBody_checkFace_3,
  emscripten_bind_btSoftBody_appendMaterial_0 as _emscripten_bind_btSoftBody_appendMaterial_0,
  emscripten_bind_btSoftBody_appendNode_2 as _emscripten_bind_btSoftBody_appendNode_2,
  emscripten_bind_btSoftBody_appendLink_4 as _emscripten_bind_btSoftBody_appendLink_4,
  emscripten_bind_btSoftBody_appendFace_4 as _emscripten_bind_btSoftBody_appendFace_4,
  emscripten_bind_btSoftBody_appendTetra_5 as _emscripten_bind_btSoftBody_appendTetra_5,
  emscripten_bind_btSoftBody_appendAnchor_4 as _emscripten_bind_btSoftBody_appendAnchor_4,
  emscripten_bind_btSoftBody_addForce_1 as _emscripten_bind_btSoftBody_addForce_1,
  emscripten_bind_btSoftBody_addForce_2 as _emscripten_bind_btSoftBody_addForce_2,
  emscripten_bind_btSoftBody_addAeroForceToNode_2 as _emscripten_bind_btSoftBody_addAeroForceToNode_2,
  emscripten_bind_btSoftBody_getTotalMass_0 as _emscripten_bind_btSoftBody_getTotalMass_0,
  emscripten_bind_btSoftBody_setTotalMass_2 as _emscripten_bind_btSoftBody_setTotalMass_2,
  emscripten_bind_btSoftBody_setMass_2 as _emscripten_bind_btSoftBody_setMass_2,
  emscripten_bind_btSoftBody_transform_1 as _emscripten_bind_btSoftBody_transform_1,
  emscripten_bind_btSoftBody_translate_1 as _emscripten_bind_btSoftBody_translate_1,
  emscripten_bind_btSoftBody_rotate_1 as _emscripten_bind_btSoftBody_rotate_1,
  emscripten_bind_btSoftBody_scale_1 as _emscripten_bind_btSoftBody_scale_1,
  emscripten_bind_btSoftBody_generateClusters_1 as _emscripten_bind_btSoftBody_generateClusters_1,
  emscripten_bind_btSoftBody_generateClusters_2 as _emscripten_bind_btSoftBody_generateClusters_2,
  emscripten_bind_btSoftBody_generateBendingConstraints_2 as _emscripten_bind_btSoftBody_generateBendingConstraints_2,
  emscripten_bind_btSoftBody_upcast_1 as _emscripten_bind_btSoftBody_upcast_1,
  emscripten_bind_btSoftBody_getRestLengthScale_0 as _emscripten_bind_btSoftBody_getRestLengthScale_0,
  emscripten_bind_btSoftBody_setRestLengthScale_1 as _emscripten_bind_btSoftBody_setRestLengthScale_1,
  emscripten_bind_btSoftBody_setAnisotropicFriction_2 as _emscripten_bind_btSoftBody_setAnisotropicFriction_2,
  emscripten_bind_btSoftBody_getCollisionShape_0 as _emscripten_bind_btSoftBody_getCollisionShape_0,
  emscripten_bind_btSoftBody_setContactProcessingThreshold_1 as _emscripten_bind_btSoftBody_setContactProcessingThreshold_1,
  emscripten_bind_btSoftBody_setActivationState_1 as _emscripten_bind_btSoftBody_setActivationState_1,
  emscripten_bind_btSoftBody_forceActivationState_1 as _emscripten_bind_btSoftBody_forceActivationState_1,
  emscripten_bind_btSoftBody_activate_0 as _emscripten_bind_btSoftBody_activate_0,
  emscripten_bind_btSoftBody_activate_1 as _emscripten_bind_btSoftBody_activate_1,
  emscripten_bind_btSoftBody_isActive_0 as _emscripten_bind_btSoftBody_isActive_0,
  emscripten_bind_btSoftBody_isKinematicObject_0 as _emscripten_bind_btSoftBody_isKinematicObject_0,
  emscripten_bind_btSoftBody_isStaticObject_0 as _emscripten_bind_btSoftBody_isStaticObject_0,
  emscripten_bind_btSoftBody_isStaticOrKinematicObject_0 as _emscripten_bind_btSoftBody_isStaticOrKinematicObject_0,
  emscripten_bind_btSoftBody_getRestitution_0 as _emscripten_bind_btSoftBody_getRestitution_0,
  emscripten_bind_btSoftBody_getFriction_0 as _emscripten_bind_btSoftBody_getFriction_0,
  emscripten_bind_btSoftBody_getRollingFriction_0 as _emscripten_bind_btSoftBody_getRollingFriction_0,
  emscripten_bind_btSoftBody_setRestitution_1 as _emscripten_bind_btSoftBody_setRestitution_1,
  emscripten_bind_btSoftBody_setFriction_1 as _emscripten_bind_btSoftBody_setFriction_1,
  emscripten_bind_btSoftBody_setRollingFriction_1 as _emscripten_bind_btSoftBody_setRollingFriction_1,
  emscripten_bind_btSoftBody_getWorldTransform_0 as _emscripten_bind_btSoftBody_getWorldTransform_0,
  emscripten_bind_btSoftBody_getCollisionFlags_0 as _emscripten_bind_btSoftBody_getCollisionFlags_0,
  emscripten_bind_btSoftBody_setCollisionFlags_1 as _emscripten_bind_btSoftBody_setCollisionFlags_1,
  emscripten_bind_btSoftBody_setWorldTransform_1 as _emscripten_bind_btSoftBody_setWorldTransform_1,
  emscripten_bind_btSoftBody_setCollisionShape_1 as _emscripten_bind_btSoftBody_setCollisionShape_1,
  emscripten_bind_btSoftBody_setCcdMotionThreshold_1 as _emscripten_bind_btSoftBody_setCcdMotionThreshold_1,
  emscripten_bind_btSoftBody_setCcdSweptSphereRadius_1 as _emscripten_bind_btSoftBody_setCcdSweptSphereRadius_1,
  emscripten_bind_btSoftBody_getUserIndex_0 as _emscripten_bind_btSoftBody_getUserIndex_0,
  emscripten_bind_btSoftBody_setUserIndex_1 as _emscripten_bind_btSoftBody_setUserIndex_1,
  emscripten_bind_btSoftBody_getUserPointer_0 as _emscripten_bind_btSoftBody_getUserPointer_0,
  emscripten_bind_btSoftBody_setUserPointer_1 as _emscripten_bind_btSoftBody_setUserPointer_1,
  emscripten_bind_btSoftBody_getBroadphaseHandle_0 as _emscripten_bind_btSoftBody_getBroadphaseHandle_0,
  emscripten_bind_btSoftBody_get_m_cfg_0 as _emscripten_bind_btSoftBody_get_m_cfg_0,
  emscripten_bind_btSoftBody_set_m_cfg_1 as _emscripten_bind_btSoftBody_set_m_cfg_1,
  emscripten_bind_btSoftBody_get_m_nodes_0 as _emscripten_bind_btSoftBody_get_m_nodes_0,
  emscripten_bind_btSoftBody_set_m_nodes_1 as _emscripten_bind_btSoftBody_set_m_nodes_1,
  emscripten_bind_btSoftBody_get_m_faces_0 as _emscripten_bind_btSoftBody_get_m_faces_0,
  emscripten_bind_btSoftBody_set_m_faces_1 as _emscripten_bind_btSoftBody_set_m_faces_1,
  emscripten_bind_btSoftBody_get_m_materials_0 as _emscripten_bind_btSoftBody_get_m_materials_0,
  emscripten_bind_btSoftBody_set_m_materials_1 as _emscripten_bind_btSoftBody_set_m_materials_1,
  emscripten_bind_btSoftBody_get_m_anchors_0 as _emscripten_bind_btSoftBody_get_m_anchors_0,
  emscripten_bind_btSoftBody_set_m_anchors_1 as _emscripten_bind_btSoftBody_set_m_anchors_1,
  emscripten_bind_btSoftBody___destroy___0 as _emscripten_bind_btSoftBody___destroy___0,
  emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_0 as _emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_0,
  emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_1 as _emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_1,
  emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration___destroy___0 as _emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration___destroy___0,
  emscripten_bind_btDefaultSoftBodySolver_btDefaultSoftBodySolver_0 as _emscripten_bind_btDefaultSoftBodySolver_btDefaultSoftBodySolver_0,
  emscripten_bind_btDefaultSoftBodySolver___destroy___0 as _emscripten_bind_btDefaultSoftBodySolver___destroy___0,
  emscripten_bind_btSoftBodyArray_size_0 as _emscripten_bind_btSoftBodyArray_size_0,
  emscripten_bind_btSoftBodyArray_at_1 as _emscripten_bind_btSoftBodyArray_at_1,
  emscripten_bind_btSoftBodyArray___destroy___0 as _emscripten_bind_btSoftBodyArray___destroy___0,
  emscripten_bind_btSoftRigidDynamicsWorld_btSoftRigidDynamicsWorld_5 as _emscripten_bind_btSoftRigidDynamicsWorld_btSoftRigidDynamicsWorld_5,
  emscripten_bind_btSoftRigidDynamicsWorld_addSoftBody_3 as _emscripten_bind_btSoftRigidDynamicsWorld_addSoftBody_3,
  emscripten_bind_btSoftRigidDynamicsWorld_removeSoftBody_1 as _emscripten_bind_btSoftRigidDynamicsWorld_removeSoftBody_1,
  emscripten_bind_btSoftRigidDynamicsWorld_removeCollisionObject_1 as _emscripten_bind_btSoftRigidDynamicsWorld_removeCollisionObject_1,
  emscripten_bind_btSoftRigidDynamicsWorld_getWorldInfo_0 as _emscripten_bind_btSoftRigidDynamicsWorld_getWorldInfo_0,
  emscripten_bind_btSoftRigidDynamicsWorld_getSoftBodyArray_0 as _emscripten_bind_btSoftRigidDynamicsWorld_getSoftBodyArray_0,
  emscripten_bind_btSoftRigidDynamicsWorld_getDispatcher_0 as _emscripten_bind_btSoftRigidDynamicsWorld_getDispatcher_0,
  emscripten_bind_btSoftRigidDynamicsWorld_rayTest_3 as _emscripten_bind_btSoftRigidDynamicsWorld_rayTest_3,
  emscripten_bind_btSoftRigidDynamicsWorld_getPairCache_0 as _emscripten_bind_btSoftRigidDynamicsWorld_getPairCache_0,
  emscripten_bind_btSoftRigidDynamicsWorld_getDispatchInfo_0 as _emscripten_bind_btSoftRigidDynamicsWorld_getDispatchInfo_0,
  emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_1 as _emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_1,
  emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_2 as _emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_2,
  emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_3 as _emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_3,
  emscripten_bind_btSoftRigidDynamicsWorld_getBroadphase_0 as _emscripten_bind_btSoftRigidDynamicsWorld_getBroadphase_0,
  emscripten_bind_btSoftRigidDynamicsWorld_convexSweepTest_5 as _emscripten_bind_btSoftRigidDynamicsWorld_convexSweepTest_5,
  emscripten_bind_btSoftRigidDynamicsWorld_contactPairTest_3 as _emscripten_bind_btSoftRigidDynamicsWorld_contactPairTest_3,
  emscripten_bind_btSoftRigidDynamicsWorld_contactTest_2 as _emscripten_bind_btSoftRigidDynamicsWorld_contactTest_2,
  emscripten_bind_btSoftRigidDynamicsWorld_setForceUpdateAllAabbs_1 as _emscripten_bind_btSoftRigidDynamicsWorld_setForceUpdateAllAabbs_1,
  emscripten_bind_btSoftRigidDynamicsWorld_updateSingleAabb_1 as _emscripten_bind_btSoftRigidDynamicsWorld_updateSingleAabb_1,
  emscripten_bind_btSoftRigidDynamicsWorld_setDebugDrawer_1 as _emscripten_bind_btSoftRigidDynamicsWorld_setDebugDrawer_1,
  emscripten_bind_btSoftRigidDynamicsWorld_getDebugDrawer_0 as _emscripten_bind_btSoftRigidDynamicsWorld_getDebugDrawer_0,
  emscripten_bind_btSoftRigidDynamicsWorld_debugDrawWorld_0 as _emscripten_bind_btSoftRigidDynamicsWorld_debugDrawWorld_0,
  emscripten_bind_btSoftRigidDynamicsWorld_debugDrawObject_3 as _emscripten_bind_btSoftRigidDynamicsWorld_debugDrawObject_3,
  emscripten_bind_btSoftRigidDynamicsWorld_setGravity_1 as _emscripten_bind_btSoftRigidDynamicsWorld_setGravity_1,
  emscripten_bind_btSoftRigidDynamicsWorld_getGravity_0 as _emscripten_bind_btSoftRigidDynamicsWorld_getGravity_0,
  emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_1 as _emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_1,
  emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_3 as _emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_3,
  emscripten_bind_btSoftRigidDynamicsWorld_removeRigidBody_1 as _emscripten_bind_btSoftRigidDynamicsWorld_removeRigidBody_1,
  emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_1 as _emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_1,
  emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_2 as _emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_2,
  emscripten_bind_btSoftRigidDynamicsWorld_removeConstraint_1 as _emscripten_bind_btSoftRigidDynamicsWorld_removeConstraint_1,
  emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_1 as _emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_1,
  emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_2 as _emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_2,
  emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_3 as _emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_3,
  emscripten_bind_btSoftRigidDynamicsWorld_setContactAddedCallback_1 as _emscripten_bind_btSoftRigidDynamicsWorld_setContactAddedCallback_1,
  emscripten_bind_btSoftRigidDynamicsWorld_setContactProcessedCallback_1 as _emscripten_bind_btSoftRigidDynamicsWorld_setContactProcessedCallback_1,
  emscripten_bind_btSoftRigidDynamicsWorld_setContactDestroyedCallback_1 as _emscripten_bind_btSoftRigidDynamicsWorld_setContactDestroyedCallback_1,
  emscripten_bind_btSoftRigidDynamicsWorld_addAction_1 as _emscripten_bind_btSoftRigidDynamicsWorld_addAction_1,
  emscripten_bind_btSoftRigidDynamicsWorld_removeAction_1 as _emscripten_bind_btSoftRigidDynamicsWorld_removeAction_1,
  emscripten_bind_btSoftRigidDynamicsWorld_getSolverInfo_0 as _emscripten_bind_btSoftRigidDynamicsWorld_getSolverInfo_0,
  emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_1 as _emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_1,
  emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_2 as _emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_2,
  emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_3 as _emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_3,
  emscripten_bind_btSoftRigidDynamicsWorld___destroy___0 as _emscripten_bind_btSoftRigidDynamicsWorld___destroy___0,
  emscripten_bind_btSoftBodyHelpers_btSoftBodyHelpers_0 as _emscripten_bind_btSoftBodyHelpers_btSoftBodyHelpers_0,
  emscripten_bind_btSoftBodyHelpers_CreateRope_5 as _emscripten_bind_btSoftBodyHelpers_CreateRope_5,
  emscripten_bind_btSoftBodyHelpers_CreatePatch_9 as _emscripten_bind_btSoftBodyHelpers_CreatePatch_9,
  emscripten_bind_btSoftBodyHelpers_CreatePatchUV_10 as _emscripten_bind_btSoftBodyHelpers_CreatePatchUV_10,
  emscripten_bind_btSoftBodyHelpers_CreateEllipsoid_4 as _emscripten_bind_btSoftBodyHelpers_CreateEllipsoid_4,
  emscripten_bind_btSoftBodyHelpers_CreateFromTriMesh_5 as _emscripten_bind_btSoftBodyHelpers_CreateFromTriMesh_5,
  emscripten_bind_btSoftBodyHelpers_CreateFromConvexHull_4 as _emscripten_bind_btSoftBodyHelpers_CreateFromConvexHull_4,
  emscripten_bind_btSoftBodyHelpers___destroy___0 as _emscripten_bind_btSoftBodyHelpers___destroy___0,
  emscripten_bind_Vec3Long_Vec3Long_3 as _emscripten_bind_Vec3Long_Vec3Long_3,
  emscripten_bind_Vec3Long_X_0 as _emscripten_bind_Vec3Long_X_0,
  emscripten_bind_Vec3Long_Y_0 as _emscripten_bind_Vec3Long_Y_0,
  emscripten_bind_Vec3Long_Z_0 as _emscripten_bind_Vec3Long_Z_0,
  emscripten_bind_Vec3Long___destroy___0 as _emscripten_bind_Vec3Long___destroy___0,
  emscripten_bind_Vec3Real_Vec3Real_3 as _emscripten_bind_Vec3Real_Vec3Real_3,
  emscripten_bind_Vec3Real_X_0 as _emscripten_bind_Vec3Real_X_0,
  emscripten_bind_Vec3Real_Y_0 as _emscripten_bind_Vec3Real_Y_0,
  emscripten_bind_Vec3Real_Z_0 as _emscripten_bind_Vec3Real_Z_0,
  emscripten_bind_Vec3Real___destroy___0 as _emscripten_bind_Vec3Real___destroy___0,
  emscripten_bind_HACD_HACD_0 as _emscripten_bind_HACD_HACD_0,
  emscripten_bind_HACD_SetCompacityWeight_1 as _emscripten_bind_HACD_SetCompacityWeight_1,
  emscripten_bind_HACD_SetVolumeWeight_1 as _emscripten_bind_HACD_SetVolumeWeight_1,
  emscripten_bind_HACD_SetConcavity_1 as _emscripten_bind_HACD_SetConcavity_1,
  emscripten_bind_HACD_SetNClusters_1 as _emscripten_bind_HACD_SetNClusters_1,
  emscripten_bind_HACD_SetNVerticesPerCH_1 as _emscripten_bind_HACD_SetNVerticesPerCH_1,
  emscripten_bind_HACD_SetPoints_1 as _emscripten_bind_HACD_SetPoints_1,
  emscripten_bind_HACD_SetNPoints_1 as _emscripten_bind_HACD_SetNPoints_1,
  emscripten_bind_HACD_SetTriangles_1 as _emscripten_bind_HACD_SetTriangles_1,
  emscripten_bind_HACD_SetNTriangles_1 as _emscripten_bind_HACD_SetNTriangles_1,
  emscripten_bind_HACD_Compute_0 as _emscripten_bind_HACD_Compute_0,
  emscripten_bind_HACD_GetNClusters_0 as _emscripten_bind_HACD_GetNClusters_0,
  emscripten_bind_HACD_GetNPointsCH_1 as _emscripten_bind_HACD_GetNPointsCH_1,
  emscripten_bind_HACD_GetNTrianglesCH_1 as _emscripten_bind_HACD_GetNTrianglesCH_1,
  emscripten_bind_HACD_GetCH_3 as _emscripten_bind_HACD_GetCH_3,
  emscripten_bind_HACD___destroy___0 as _emscripten_bind_HACD___destroy___0,
  emscripten_bind_VHACD_VHACD_0 as _emscripten_bind_VHACD_VHACD_0,
  emscripten_bind_VHACD_Compute_7 as _emscripten_bind_VHACD_Compute_7,
  emscripten_bind_VHACD_GetNConvexHulls_0 as _emscripten_bind_VHACD_GetNConvexHulls_0,
  emscripten_bind_VHACD_GetConvexHull_2 as _emscripten_bind_VHACD_GetConvexHull_2,
  emscripten_bind_VHACD_Cancel_0 as _emscripten_bind_VHACD_Cancel_0,
  emscripten_bind_VHACD_Clean_0 as _emscripten_bind_VHACD_Clean_0,
  emscripten_bind_VHACD_Release_0 as _emscripten_bind_VHACD_Release_0,
  emscripten_bind_VHACD___destroy___0 as _emscripten_bind_VHACD___destroy___0,
  emscripten_bind_Parameters_Parameters_0 as _emscripten_bind_Parameters_Parameters_0,
  emscripten_bind_Parameters_get_m_concavity_0 as _emscripten_bind_Parameters_get_m_concavity_0,
  emscripten_bind_Parameters_set_m_concavity_1 as _emscripten_bind_Parameters_set_m_concavity_1,
  emscripten_bind_Parameters_get_m_alpha_0 as _emscripten_bind_Parameters_get_m_alpha_0,
  emscripten_bind_Parameters_set_m_alpha_1 as _emscripten_bind_Parameters_set_m_alpha_1,
  emscripten_bind_Parameters_get_m_beta_0 as _emscripten_bind_Parameters_get_m_beta_0,
  emscripten_bind_Parameters_set_m_beta_1 as _emscripten_bind_Parameters_set_m_beta_1,
  emscripten_bind_Parameters_get_m_gamma_0 as _emscripten_bind_Parameters_get_m_gamma_0,
  emscripten_bind_Parameters_set_m_gamma_1 as _emscripten_bind_Parameters_set_m_gamma_1,
  emscripten_bind_Parameters_get_m_minVolumePerCH_0 as _emscripten_bind_Parameters_get_m_minVolumePerCH_0,
  emscripten_bind_Parameters_set_m_minVolumePerCH_1 as _emscripten_bind_Parameters_set_m_minVolumePerCH_1,
  emscripten_bind_Parameters_get_m_resolution_0 as _emscripten_bind_Parameters_get_m_resolution_0,
  emscripten_bind_Parameters_set_m_resolution_1 as _emscripten_bind_Parameters_set_m_resolution_1,
  emscripten_bind_Parameters_get_m_maxNumVerticesPerCH_0 as _emscripten_bind_Parameters_get_m_maxNumVerticesPerCH_0,
  emscripten_bind_Parameters_set_m_maxNumVerticesPerCH_1 as _emscripten_bind_Parameters_set_m_maxNumVerticesPerCH_1,
  emscripten_bind_Parameters_get_m_depth_0 as _emscripten_bind_Parameters_get_m_depth_0,
  emscripten_bind_Parameters_set_m_depth_1 as _emscripten_bind_Parameters_set_m_depth_1,
  emscripten_bind_Parameters_get_m_planeDownsampling_0 as _emscripten_bind_Parameters_get_m_planeDownsampling_0,
  emscripten_bind_Parameters_set_m_planeDownsampling_1 as _emscripten_bind_Parameters_set_m_planeDownsampling_1,
  emscripten_bind_Parameters_get_m_convexhullDownsampling_0 as _emscripten_bind_Parameters_get_m_convexhullDownsampling_0,
  emscripten_bind_Parameters_set_m_convexhullDownsampling_1 as _emscripten_bind_Parameters_set_m_convexhullDownsampling_1,
  emscripten_bind_Parameters_get_m_pca_0 as _emscripten_bind_Parameters_get_m_pca_0,
  emscripten_bind_Parameters_set_m_pca_1 as _emscripten_bind_Parameters_set_m_pca_1,
  emscripten_bind_Parameters_get_m_mode_0 as _emscripten_bind_Parameters_get_m_mode_0,
  emscripten_bind_Parameters_set_m_mode_1 as _emscripten_bind_Parameters_set_m_mode_1,
  emscripten_bind_Parameters_get_m_convexhullApproximation_0 as _emscripten_bind_Parameters_get_m_convexhullApproximation_0,
  emscripten_bind_Parameters_set_m_convexhullApproximation_1 as _emscripten_bind_Parameters_set_m_convexhullApproximation_1,
  emscripten_bind_Parameters_get_m_oclAcceleration_0 as _emscripten_bind_Parameters_get_m_oclAcceleration_0,
  emscripten_bind_Parameters_set_m_oclAcceleration_1 as _emscripten_bind_Parameters_set_m_oclAcceleration_1,
  emscripten_bind_Parameters___destroy___0 as _emscripten_bind_Parameters___destroy___0,
  emscripten_bind_ConvexHull_ConvexHull_0 as _emscripten_bind_ConvexHull_ConvexHull_0,
  emscripten_bind_ConvexHull_get_m_points_1 as _emscripten_bind_ConvexHull_get_m_points_1,
  emscripten_bind_ConvexHull_get_m_triangles_1 as _emscripten_bind_ConvexHull_get_m_triangles_1,
  emscripten_bind_ConvexHull_get_m_nPoints_0 as _emscripten_bind_ConvexHull_get_m_nPoints_0,
  emscripten_bind_ConvexHull_get_m_nTriangles_0 as _emscripten_bind_ConvexHull_get_m_nTriangles_0,
  emscripten_bind_ConvexHull___destroy___0 as _emscripten_bind_ConvexHull___destroy___0,
  emscripten_enum_PHY_ScalarType_PHY_FLOAT as _emscripten_enum_PHY_ScalarType_PHY_FLOAT,
  emscripten_enum_PHY_ScalarType_PHY_DOUBLE as _emscripten_enum_PHY_ScalarType_PHY_DOUBLE,
  emscripten_enum_PHY_ScalarType_PHY_INTEGER as _emscripten_enum_PHY_ScalarType_PHY_INTEGER,
  emscripten_enum_PHY_ScalarType_PHY_SHORT as _emscripten_enum_PHY_ScalarType_PHY_SHORT,
  emscripten_enum_PHY_ScalarType_PHY_FIXEDPOINT88 as _emscripten_enum_PHY_ScalarType_PHY_FIXEDPOINT88,
  emscripten_enum_PHY_ScalarType_PHY_UCHAR as _emscripten_enum_PHY_ScalarType_PHY_UCHAR,
  emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_COMPOUND_SHAPE as _emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_COMPOUND_SHAPE,
  emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_TRIMESH_SHAPE_PART as _emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_TRIMESH_SHAPE_PART,
  emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_TRIMESH_SHAPE as _emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_TRIMESH_SHAPE,
  emscripten_enum_btConstraintParams_BT_CONSTRAINT_ERP as _emscripten_enum_btConstraintParams_BT_CONSTRAINT_ERP,
  emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_ERP as _emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_ERP,
  emscripten_enum_btConstraintParams_BT_CONSTRAINT_CFM as _emscripten_enum_btConstraintParams_BT_CONSTRAINT_CFM,
  emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_CFM as _emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_CFM,
  fflush as _fflush,
  emscripten_stack_get_end as _emscripten_stack_get_end,
  emscripten_stack_get_base as _emscripten_stack_get_base,
  strerror as _strerror,
  emscripten_stack_init as _emscripten_stack_init,
  emscripten_stack_get_free as _emscripten_stack_get_free,
  _emscripten_stack_restore as __emscripten_stack_restore,
  _emscripten_stack_alloc as __emscripten_stack_alloc,
  emscripten_stack_get_current as _emscripten_stack_get_current,
  memory as wasmMemory
} from './ammo.wasm.wasm';

// Export JS functions to the wasm module with demangled names.
export {
  ___cxa_throw as __cxa_throw,
  __abort_js as _abort_js,
  __tzset_js as _tzset_js,
  _clock_time_get as clock_time_get,
  _emscripten_asm_const_double as emscripten_asm_const_double,
  _emscripten_asm_const_int as emscripten_asm_const_int,
  _emscripten_date_now as emscripten_date_now,
  _emscripten_resize_heap as emscripten_resize_heap,
  _environ_get as environ_get,
  _environ_sizes_get as environ_sizes_get,
  _fd_close as fd_close,
  _fd_seek as fd_seek,
  _fd_write as fd_write
};

// Re-export imported wasm functions to the JS entry point. These are user-facing and underscore mangled.
export { _emscripten_bind_btConvexPolyhedron___destroy___0, _emscripten_bind_btGImpactMeshShapePart_getVertexCount_0, _emscripten_bind_btWheelInfo_get_m_suspensionRestLength1_0, _emscripten_bind_btVector3_setY_1, _emscripten_bind_btTriangleMeshShape_getLocalScaling_0, _emscripten_bind_LocalConvexResult___destroy___0, _emscripten_bind_btSoftBody_appendAnchor_4, _emscripten_bind_Vec3Real_Z_0, _emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterGroup_1, _emscripten_bind_btGhostObject_setRollingFriction_1, _emscripten_bind_btCapsuleShapeX_getHalfHeight_0, _emscripten_bind_btWheelInfo_set_m_raycastInfo_1, _emscripten_bind_btQuaternion_z_0, _emscripten_bind_VHACD_VHACD_0, _emscripten_bind_btDiscreteDynamicsWorld_getDebugDrawer_0, _emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_manifold_0, _emscripten_bind_btDefaultMotionState_getWorldTransform_1, _emscripten_bind_btManifoldPoint_get_m_localPointA_0, _emscripten_bind_Parameters_get_m_alpha_0, _emscripten_bind_btSoftRigidDynamicsWorld_getBroadphase_0, _emscripten_bind_btCylinderShapeZ___destroy___0, _emscripten_bind_btSphereShape_btSphereShape_1, _emscripten_bind_btCollisionWorld_getDispatcher_0, _emscripten_bind_btWheelInfo_get_m_wheelsDampingCompression_0, _emscripten_bind_btGImpactCompoundShape_getBulletTetrahedron_2, _emscripten_bind_btHingeConstraint_btHingeConstraint_7, _emscripten_bind_btSoftBody_getTotalMass_0, _emscripten_bind_btSoftRigidDynamicsWorld_updateSingleAabb_1, _emscripten_bind_btWheelInfoConstructionInfo_set_m_chassisConnectionCS_1, _emscripten_bind_btConvexTriangleMeshShape_calculateLocalInertia_2, _emscripten_bind_btVehicleTuning_get_m_maxSuspensionForce_0, _emscripten_bind_btPairCachingGhostObject_isStaticObject_0, _emscripten_bind_Vec3Real_Y_0, _emscripten_bind_btRigidBody_getAngularFactor_0, _emscripten_bind_TrimeshPrimitiveManager_set_m_meshInterface_1, _emscripten_bind_btWheelInfo_get_m_suspensionStiffness_0, _emscripten_bind_btGImpactCompoundShape_childrenHasTransform_0, _emscripten_bind_ClosestRayResultCallback_set_m_rayToWorld_1, _emscripten_bind_btTriangleShapeEx___destroy___0, _emscripten_bind_ContactResultCallback___destroy___0, _emscripten_bind_btGhostObject_setAnisotropicFriction_2, _emscripten_bind_Config_set_kKHR_1, _emscripten_bind_btPersistentManifold_getBody0_0, _emscripten_bind_btRaycastVehicle_setUserConstraintId_1, _emscripten_bind_btSliderConstraint_setPoweredLinMotor_1, _emscripten_bind_HACD_GetCH_3, _emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterGroup_0, _emscripten_bind_btRigidBody_setUserPointer_1, _emscripten_bind_TrimeshPrimitiveManager_set_m_lock_count_1, _emscripten_bind_Vec3Real___destroy___0, _emscripten_bind_btDynamicsWorld_setInternalTickCallback_2, _emscripten_bind_btConstraintSetting_get_m_tau_0, _emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterMask_1, _emscripten_bind_btConvexShape_getLocalScaling_0, _emscripten_bind_Material_get_m_kVST_0, _emscripten_bind_btVector3_dot_1, _emscripten_bind_btIDebugDraw_draw3dText_2, _emscripten_bind_btRigidBody_setLinearFactor_1, _emscripten_bind_btRigidBody_applyGravity_0, _emscripten_bind_btConeTwistConstraint_enableFeedback_1, _emscripten_bind_btOverlappingPairCache_setInternalGhostPairCallback_1, _emscripten_bind_btVector4_dot_1, _emscripten_bind_btHingeConstraint_enableMotor_1, _emscripten_bind_btKinematicCharacterController_setFallSpeed_1, _emscripten_bind_RayResultCallback_get_m_collisionFilterGroup_0, _emscripten_bind_btDiscreteDynamicsWorld_getDispatcher_0, _emscripten_bind_btSphereShape_getLocalScaling_0, _emscripten_bind_btIDebugDraw_drawLine_3, _emscripten_bind_btRaycastVehicle_rayCast_1, _emscripten_bind_btCollisionObject_forceActivationState_1, _emscripten_bind_btSoftBody_set_m_anchors_1, _emscripten_bind_btConvexTriangleMeshShape_setMargin_1, _emscripten_bind_btDynamicsWorld_addCollisionObject_2, _emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_3, _emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_1, _emscripten_bind_btPairCachingGhostObject_setCollisionFlags_1, _emscripten_bind_Parameters_get_m_convexhullApproximation_0, _emscripten_bind_HACD___destroy___0, _emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_5, _emscripten_bind_RaycastInfo_set_m_hardPointWS_1, _emscripten_bind_LocalShapeInfo_set_m_triangleIndex_1, _emscripten_bind_btGImpactMeshShape_getMeshPartCount_0, _emscripten_bind_AllHitsRayResultCallback_get_m_rayFromWorld_0, _emscripten_bind_btSoftBody_setActivationState_1, _emscripten_bind_btSoftRigidDynamicsWorld_setForceUpdateAllAabbs_1, _emscripten_bind_btIDebugDraw_reportErrorWarning_1, _emscripten_bind_btGImpactMeshShapePart_getVertex_2, _emscripten_bind_TrimeshPrimitiveManager_set_numverts_1, _emscripten_bind_btGeneric6DofSpringConstraint_setLinearUpperLimit_1, _emscripten_bind_btSoftBodyHelpers_CreateFromConvexHull_4, _emscripten_bind_Face_get_m_ra_0, _emscripten_bind_btCollisionObject_activate_1, _emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_dispatcher1_1, _emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_1, _emscripten_bind_btConvexShape_setLocalScaling_1, _emscripten_bind_btTransform___destroy___0, _emscripten_bind_btCollisionObject_getUserIndex_0, _emscripten_bind_btConvexHullShape_setMargin_1, _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingThresholdSqr_0, _emscripten_bind_TrimeshPrimitiveManager_set_m_part_1, _emscripten_bind_Parameters_set_m_beta_1, _emscripten_bind_btPairCachingGhostObject_setRestitution_1, _emscripten_bind_btWheelInfo_get_m_frictionSlip_0, _emscripten_bind_btVector4_w_0, _emscripten_bind_btConvexHullShape_addPoint_2, _emscripten_bind_btDiscreteDynamicsWorld_setContactProcessedCallback_1, _emscripten_bind_btWheelInfo_updateWheel_2, _emscripten_bind_HACD_GetNPointsCH_1, _emscripten_bind_btSoftBodyWorldInfo_set_m_maxDisplacement_1, _emscripten_bind_btConvexHullShape_calculateLocalInertia_2, _emscripten_bind_tFaceArray_at_1, _emscripten_bind_btSoftRigidDynamicsWorld_setDebugDrawer_1, _emscripten_bind_RayResultCallback_set_m_closestHitFraction_1, _emscripten_bind_btGImpactMeshShapePart_getLocalScaling_0, _emscripten_bind_btOverlappingPairCallback_removeOverlappingPairsContainingProxy_2, _emscripten_bind_btDynamicsWorld_debugDrawWorld_0, _emscripten_bind_btPairCachingGhostObject_getNumOverlappingObjects_0, _emscripten_bind_btCylinderShapeX_calculateLocalInertia_2, _emscripten_bind_btGhostObject_getCollisionShape_0, _emscripten_bind_btConvexHullShape_getMargin_0, _emscripten_bind_btRigidBody_isKinematicObject_0, _emscripten_bind_btCylinderShapeZ_setMargin_1, _emscripten_bind_btConstraintSolver___destroy___0, _emscripten_bind_btQuaternion_getAngle_0, _emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterMask_0, _emscripten_bind_btRaycastVehicle_updateWheelTransform_2, _emscripten_bind_btSoftBody_setFriction_1, _emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionRestLength_0, _emscripten_bind_btWheelInfo_set_m_clippedInvContactDotSuspension_1, _emscripten_bind_btCollisionObject_isStaticObject_0, _emscripten_bind_btDynamicsWorld_getPairCache_0, _emscripten_bind_CompoundPrimitiveManager_set_m_compoundShape_1, _emscripten_bind_btGeneric6DofSpringConstraint_enableSpring_2, _emscripten_bind_btCollisionAlgorithmConstructionInfo___destroy___0, _emscripten_bind_ClosestConvexResultCallback_get_m_hitNormalWorld_0, _emscripten_bind_AllHitsRayResultCallback_set_m_collisionObject_1, _emscripten_bind_btPairCachingGhostObject_setWorldTransform_1, _emscripten_bind_btConvexPolyhedron_set_m_vertices_1, _emscripten_bind_btCollisionObject_getWorldTransform_0, _emscripten_bind_btDynamicsWorld___destroy___0, _emscripten_bind_btSoftBody_activate_0, _emscripten_bind_btSphereShape_calculateLocalInertia_2, _emscripten_bind_RayResultCallback_get_m_collisionFilterMask_0, _emscripten_bind_btGImpactShapeInterface___destroy___0, _emscripten_bind_btPoint2PointConstraint_enableFeedback_1, _emscripten_bind_btVehicleRaycasterResult_set_m_distFraction_1, _emscripten_bind_btCompoundShape_getChildShape_1, _emscripten_bind_btQuaternion_setX_1, _emscripten_bind_AllHitsRayResultCallback_set_m_closestHitFraction_1, _emscripten_bind_btTransform_btTransform_0, _emscripten_bind_btSoftBody_generateClusters_1, _emscripten_bind_tMaterialArray_size_0, _emscripten_bind_btGImpactMeshShape_calculateSerializeBufferSize_0, _emscripten_bind_btDiscreteDynamicsWorld_setForceUpdateAllAabbs_1, _emscripten_bind_btWheelInfo_get_m_skidInfo_0, _emscripten_bind_btSliderConstraint_btSliderConstraint_3, _emscripten_bind_btCollisionObject_setUserPointer_1, _emscripten_bind_btPairCachingGhostObject_isStaticOrKinematicObject_0, _emscripten_bind_btPrimitiveManagerBase_get_primitive_box_2, _emscripten_bind_btSliderConstraint_enableFeedback_1, _emscripten_bind_btRaycastVehicle_getForwardAxis_0, _emscripten_bind_btDispatcher_getNumManifolds_0, _emscripten_bind_CompoundPrimitiveManager_get_m_compoundShape_0, _emscripten_bind_btKinematicCharacterController_getMaxSlope_0, _emscripten_bind_btCollisionWorld_rayTest_3, _emscripten_bind_HACD_SetNVerticesPerCH_1, _emscripten_bind_btCollisionDispatcher___destroy___0, _emscripten_bind_Config_set_timescale_1, _emscripten_bind_VHACD_GetNConvexHulls_0, _emscripten_bind_DebugDrawer_DebugDrawer_0, _emscripten_bind_btSoftBody_getUserPointer_0, _emscripten_bind_btGImpactCompoundShape_setChildTransform_2, _emscripten_bind_btSoftBody_set_m_materials_1, _emscripten_bind_btCapsuleShapeZ_setMargin_1, _emscripten_bind_btShapeHull_btShapeHull_1, _emscripten_bind_btRigidBody_getLinearDamping_0, _emscripten_bind_Parameters_set_m_mode_1, _emscripten_bind_btQuaternion_w_0, _emscripten_bind_btRigidBody_getUserPointer_0, _emscripten_bind_btSoftRigidDynamicsWorld_removeRigidBody_1, _emscripten_bind_btConvexHullShape___destroy___0, _emscripten_bind_Material_get_m_kAST_0, _emscripten_bind_Face_set_m_normal_1, _emscripten_bind_btDynamicsWorld_setDebugDrawer_1, _emscripten_bind_ClosestConvexResultCallback_set_m_closestHitFraction_1, _emscripten_bind_btPairCachingGhostObject_getRollingFriction_0, _emscripten_bind_btGhostObject_setActivationState_1, _emscripten_bind_btGImpactMeshShapePart_getBulletTriangle_2, _emscripten_bind_btBoxShape_getLocalScaling_0, _emscripten_bind_btBvhTriangleMeshShape_getLocalScaling_0, _emscripten_bind_btMultiSphereShape_setLocalScaling_1, _emscripten_bind_btVector4_setX_1, _emscripten_bind_btCapsuleShapeZ___destroy___0, _emscripten_bind_btCylinderShapeX_setMargin_1, _emscripten_bind_btWheelInfoConstructionInfo_set_m_bIsFrontWheel_1, _emscripten_bind_Config_set_kSKHR_CL_1, _emscripten_bind_btCylinderShapeZ_getLocalScaling_0, _emscripten_bind_btDiscreteDynamicsWorld_updateSingleAabb_1, _emscripten_bind_RayResultCallback_get_m_closestHitFraction_0, _emscripten_bind_btQuaternion_op_div_1, _emscripten_bind_btRaycastVehicle_updateSuspension_1, _emscripten_bind_btCollisionWorld_addCollisionObject_2, _emscripten_bind_DebugDrawer_drawContactPoint_5, _emscripten_bind_AllHitsRayResultCallback_hasHit_0, _emscripten_bind_btRigidBody_setCcdMotionThreshold_1, _emscripten_bind_LocalConvexResult_get_m_hitFraction_0, _emscripten_bind_Config_set_maxvolume_1, _emscripten_bind_TrimeshPrimitiveManager_get_stride_0, _emscripten_bind_btAABB_invalidate_0, _emscripten_bind_btGImpactShapeInterface_setChildTransform_2, _emscripten_bind_btOverlappingPairCallback___destroy___0, _emscripten_bind_Config_get_kVC_0, _emscripten_bind_btVehicleTuning_get_m_suspensionDamping_0, _emscripten_bind_btGhostObject_isKinematicObject_0, _emscripten_bind_ClosestConvexResultCallback_ClosestConvexResultCallback_2, _emscripten_bind_btQuadWord_z_0, _emscripten_bind_tAnchorArray_clear_0, _emscripten_bind_btWheelInfo_set_m_wheelsDampingCompression_1, _emscripten_bind_btHingeConstraint_btHingeConstraint_2, _emscripten_bind_btCylinderShape_getMargin_0, _emscripten_bind_btSoftBody_getWorldTransform_0, _emscripten_bind_CompoundPrimitiveManager_get_primitive_box_2, _emscripten_bind_ConvexResultCallback_set_m_closestHitFraction_1, _emscripten_bind_btCollisionWorld_getBroadphase_0, _emscripten_bind_btRigidBody_getUserIndex_0, _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingFactor_0, _emscripten_bind_btConeTwistConstraint_getParam_2, _emscripten_bind_btRigidBodyConstructionInfo_set_m_restitution_1, _webidl_malloc, _emscripten_bind_btQuaternion_dot_1, _emscripten_bind_btManifoldPoint_get_m_positionWorldOnA_0, _emscripten_bind_Config_get_timescale_0, _emscripten_bind_btRigidBody_getRollingFriction_0, _emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_1, _emscripten_bind_btDynamicsWorld_updateSingleAabb_1, _emscripten_bind_HACD_GetNTrianglesCH_1, _emscripten_bind_btGImpactShapeInterface_getPrimitiveManager_0, _emscripten_bind_btGImpactShapeInterface_updateBound_0, _emscripten_bind_tNodeArray___destroy___0, _emscripten_bind_btGImpactShapeInterface_getNumChildShapes_0, _emscripten_bind_btContactSolverInfo___destroy___0, _emscripten_bind_ConvexHull_get_m_points_1, _emscripten_bind_btVector4_x_0, _emscripten_bind_btSoftBody_addAeroForceToNode_2, _emscripten_bind_btSoftBody_transform_1, _emscripten_bind_ConvexHull_get_m_triangles_1, _emscripten_bind_btGhostObject_getBroadphaseHandle_0, _emscripten_bind_btContactSolverInfo_get_m_splitImpulsePenetrationThreshold_0, _emscripten_bind_btSoftBody_getUserIndex_0, _emscripten_bind_btSoftRigidDynamicsWorld_removeConstraint_1, _emscripten_bind_Material_get_m_flags_0, _emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_1, _emscripten_bind_btOverlappingPairCache_getNumOverlappingPairs_0, _emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelAxleCS_1, _emscripten_bind_btQuadWord_setY_1, _emscripten_bind_Node_get_m_q_0, _emscripten_bind_btWheelInfo_get_m_engineForce_0, _emscripten_bind_Config_set_kDF_1, _emscripten_bind_TrimeshPrimitiveManager_get_numverts_0, _emscripten_bind_btBoxShape_calculateLocalInertia_2, _emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterMask_0, _emscripten_bind_btTriangleShapeEx_buildTriPlane_1, _emscripten_bind_Anchor_set_m_influence_1, _emscripten_bind_btSoftBody_btSoftBody_4, _emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_3, _emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_1, _emscripten_bind_btCollisionObject_setRollingFriction_1, _emscripten_bind_btGhostObject_getFriction_0, _emscripten_bind_btEmptyShape_calculateLocalInertia_2, _emscripten_bind_ClosestRayResultCallback_set_m_closestHitFraction_1, _emscripten_bind_Vec3Long_Y_0, _emscripten_bind_Config_set_piterations_1, _emscripten_bind_btWheelInfo_set_m_deltaRotation_1, _emscripten_bind_btDispatcherInfo_set_m_dispatchFunc_1, _emscripten_bind_btPoint2PointConstraint_getParam_2, _emscripten_bind_btVehicleRaycasterResult_set_m_hitPointInWorld_1, _emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_3, _emscripten_bind_AllHitsRayResultCallback_set_m_flags_1, _emscripten_bind_btBvhTriangleMeshShape___destroy___0, _emscripten_bind_Node_set_m_x_1, _emscripten_bind_btFace_set_m_plane_2, _emscripten_bind_btDynamicsWorld_addAction_1, _emscripten_bind_btSphereShape_setMargin_1, _emscripten_bind_btConvexTriangleMeshShape_getLocalScaling_0, _emscripten_bind_btPairCachingGhostObject_setCcdMotionThreshold_1, _emscripten_bind_btGeneric6DofConstraint_setLinearUpperLimit_1, _emscripten_bind_btSphereShape_setLocalScaling_1, _emscripten_bind_btRigidBody_setMotionState_1, _emscripten_bind_btVector3___destroy___0, _emscripten_bind_Face_set_m_ra_1, _emscripten_bind_btCapsuleShapeX_getUpAxis_0, _emscripten_bind_btGImpactCompoundShape_postUpdate_0, _emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_3, _emscripten_bind_Config_set_kSS_SPLT_CL_1, _emscripten_enum_PHY_ScalarType_PHY_UCHAR, _emscripten_bind_btRaycastVehicle_setCoordinateSystem_3, _emscripten_bind_Parameters_get_m_concavity_0, _emscripten_bind_btPoint2PointConstraint_getPivotInA_0, _emscripten_bind_btTriangleMesh_btTriangleMesh_2, _emscripten_bind_Config_get_kAHR_0, _emscripten_bind_btGhostObject_forceActivationState_1, _emscripten_bind_btDiscreteDynamicsWorld_convexSweepTest_5, _emscripten_bind_btEmptyShape_getLocalScaling_0, _emscripten_bind_btConeShapeX_calculateLocalInertia_2, _emscripten_bind_btPairCachingGhostObject___destroy___0, _emscripten_bind_btContactSolverInfo_get_m_splitImpulse_0, _emscripten_bind_btVector4_op_mul_1, _emscripten_bind_btScalarArray___destroy___0, _emscripten_bind_btOverlappingPairCache___destroy___0, _emscripten_bind_Anchor_get_m_influence_0, _emscripten_bind_btPairCachingGhostObject_setRollingFriction_1, _emscripten_bind_RaycastInfo_get_m_suspensionLength_0, _emscripten_bind_btPairCachingGhostObject_setAnisotropicFriction_2, _emscripten_bind_Anchor_get_m_node_0, _emscripten_bind_Anchor_set_m_c1_1, _emscripten_bind_btCompoundShape_btCompoundShape_1, _emscripten_bind_btGImpactMeshShape___destroy___0, _emscripten_bind_btGImpactShapeInterface_getShapeType_0, _emscripten_bind_btConeShapeZ_calculateLocalInertia_2, _emscripten_bind_btEmptyShape_btEmptyShape_0, _emscripten_bind_btConeShapeX_btConeShapeX_2, _emscripten_bind_btCapsuleShapeX___destroy___0, _emscripten_bind_btGImpactCollisionAlgorithm___destroy___0, _emscripten_bind_Config_set_collisions_1, _emscripten_bind_btWheelInfo_get_m_rotation_0, _emscripten_bind_btSoftRigidDynamicsWorld_removeCollisionObject_1, _emscripten_bind_btRigidBody_applyTorque_1, _emscripten_bind_btCapsuleShape_setMargin_1, _emscripten_bind_Parameters_set_m_depth_1, _emscripten_bind_btSoftBody_forceActivationState_1, _emscripten_bind_Parameters_get_m_oclAcceleration_0, _emscripten_bind_btCapsuleShape_getUpAxis_0, _emscripten_bind_HACD_SetNTriangles_1, _emscripten_bind_Node_set_m_n_1, _emscripten_bind_Material_set_m_kAST_1, _emscripten_bind_btDispatcherInfo_get_m_stepCount_0, _emscripten_bind_btFixedConstraint_getBreakingImpulseThreshold_0, _emscripten_bind_btCollisionWorld_convexSweepTest_5, _emscripten_bind_btGImpactCompoundShape_calculateLocalInertia_2, _emscripten_bind_btManifoldPoint_get_m_localPointB_0, _emscripten_bind_TrimeshPrimitiveManager_get_indicestype_0, _emscripten_bind_btGImpactCompoundShape_getGImpactShapeType_0, _emscripten_bind_btHeightfieldTerrainShape_getLocalScaling_0, _emscripten_bind_btConeTwistConstraint_getBreakingImpulseThreshold_0, _emscripten_bind_btVector4_btVector4_4, _emscripten_bind_btActionInterface___destroy___0, _emscripten_bind_btConvexHullShape_getNumVertices_0, _emscripten_bind_btRaycastVehicle_setBrake_2, _emscripten_bind_btFixedConstraint_setParam_3, _emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_1, _emscripten_bind_TrimeshPrimitiveManager_get_m_margin_0, _emscripten_bind_LocalShapeInfo_set_m_shapePart_1, _emscripten_bind_btHingeConstraint_enableFeedback_1, _emscripten_bind_btDbvtBroadphase_getOverlappingPairCache_0, _emscripten_bind_btGeneric6DofConstraint_getBreakingImpulseThreshold_0, _emscripten_bind_btBroadphaseInterface_getOverlappingPairCache_0, _emscripten_bind_btGhostPairCallback_btGhostPairCallback_0, _emscripten_bind_btVector4_setY_1, _emscripten_bind_btGImpactMeshShape_getMeshPart_1, _emscripten_bind_Config_get_maxvolume_0, _emscripten_bind_btGImpactShapeInterface_getChildTransform_1, _emscripten_bind_btDiscreteDynamicsWorld_getBroadphase_0, _emscripten_bind_btGImpactMeshShapePart_postUpdate_0, _emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_dispatcher1_0, _emscripten_bind_btSoftBody_activate_1, _emscripten_bind_btSoftBody_getCollisionFlags_0, _emscripten_bind_btDiscreteDynamicsWorld_debugDrawWorld_0, _emscripten_bind_Anchor_set_m_c2_1, _emscripten_bind_btConvexTriangleMeshShape_setLocalScaling_1, _emscripten_bind_btConcaveShape_calculateLocalInertia_2, _emscripten_bind_btCapsuleShape_btCapsuleShape_2, _emscripten_bind_btGImpactMeshShape_getLocalScaling_0, _emscripten_bind_btCollisionObject_setUserIndex_1, _emscripten_bind_Material_set_m_kLST_1, _emscripten_bind_btCapsuleShape_getHalfHeight_0, _emscripten_bind_btAxisSweep3_btAxisSweep3_4, _emscripten_bind_btRigidBodyConstructionInfo_set_m_rollingFriction_1, _emscripten_bind_btPoint2PointConstraint_set_m_setting_1, _emscripten_bind_btSoftBody_isActive_0, _emscripten_bind_btConstraintSetting_set_m_impulseClamp_1, _emscripten_bind_btStaticPlaneShape_setLocalScaling_1, _emscripten_bind_btPersistentManifold___destroy___0, _emscripten_bind_btWheelInfo_set_m_wheelAxleCS_1, _emscripten_bind_btGImpactCompoundShape_getBulletTriangle_2, _emscripten_bind_HACD_SetNClusters_1, _emscripten_bind_btWheelInfoConstructionInfo_get_m_chassisConnectionCS_0, _emscripten_bind_btSoftBodyWorldInfo_set_air_density_1, _emscripten_bind_btConcaveShape___destroy___0, _emscripten_bind_btCompoundShape_addChildShape_2, _emscripten_bind_btEmptyShape___destroy___0, _emscripten_bind_btTransform_inverse_0, _emscripten_bind_btVector3_y_0, _emscripten_bind_btGImpactShapeInterface_getBulletTetrahedron_2, _emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_1, _emscripten_bind_btGeneric6DofSpringConstraint_setParam_3, _emscripten_bind_HACD_SetConcavity_1, _emscripten_bind_ContactResultCallback_addSingleResult_7, _emscripten_bind_TrimeshPrimitiveManager_set_m_margin_1, _emscripten_bind_btSoftBody_checkFace_3, _emscripten_bind_btDispatcher_getManifoldByIndexInternal_1, _emscripten_bind_btSoftBody_getRestLengthScale_0, _emscripten_bind_btCylinderShape_getLocalScaling_0, _emscripten_bind_btSoftBodyWorldInfo_set_m_broadphase_1, _emscripten_bind_btBvhTriangleMeshShape_calculateLocalInertia_2, _emscripten_bind_DebugDrawer_reportErrorWarning_1, _emscripten_bind_btCollisionWorld_getDebugDrawer_0, _emscripten_bind_btWheelInfo_set_m_suspensionRestLength1_1, _emscripten_bind_btDefaultCollisionConstructionInfo_btDefaultCollisionConstructionInfo_0, _emscripten_bind_Parameters___destroy___0, _emscripten_bind_btConeShape_setLocalScaling_1, _emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_1, _emscripten_bind_btTransform_setFromOpenGLMatrix_1, _emscripten_bind_btGeneric6DofConstraint_setParam_3, _emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_TRIMESH_SHAPE, _emscripten_bind_ClosestRayResultCallback_get_m_flags_0, _emscripten_bind_Config_set_diterations_1, _emscripten_bind_btCollisionObject___destroy___0, _emscripten_bind_btDynamicsWorld_getDispatcher_0, _emscripten_bind_btKinematicCharacterController_setMaxJumpHeight_1, _emscripten_bind_btDiscreteDynamicsWorld_getSolverInfo_0, _emscripten_bind_btActionInterface_updateAction_2, _emscripten_bind_btDiscreteDynamicsWorld_addConstraint_2, _emscripten_bind_btSoftBody_rotate_1, _emscripten_bind_btRigidBody___destroy___0, _emscripten_bind_btCapsuleShapeZ_getHalfHeight_0, _emscripten_bind_Material_get_m_kLST_0, _emscripten_bind_btQuaternion_op_sub_1, _emscripten_bind_btShapeHull_numVertices_0, _emscripten_bind_Parameters_set_m_alpha_1, _emscripten_bind_btWheelInfoConstructionInfo___destroy___0, _emscripten_bind_btSoftRigidDynamicsWorld_contactTest_2, _emscripten_bind_btSoftBody_setRestitution_1, _emscripten_bind_btTransform_op_mul_1, _emscripten_bind_btManifoldPoint_get_m_normalWorldOnB_0, _emscripten_bind_btGImpactCompoundShape_getPrimitiveManager_0, _emscripten_bind_btPoint2PointConstraint_getBreakingImpulseThreshold_0, _emscripten_bind_btDynamicsWorld_getSolverInfo_0, _emscripten_bind_tAnchorArray_size_0, _emscripten_bind_btDbvtBroadphase___destroy___0, _emscripten_bind_btSoftBody_setMass_2, _emscripten_bind_ClosestConvexResultCallback_set_m_hitPointWorld_1, _emscripten_bind_btGImpactMeshShape_getShapeType_0, _emscripten_bind_btCollisionWorld_addCollisionObject_1, _emscripten_bind_btGhostObject_setUserPointer_1, _emscripten_bind_btCollisionObject_setContactProcessingThreshold_1, _emscripten_bind_btCompoundShape_getLocalScaling_0, _emscripten_bind_btContactSolverInfo_set_m_numIterations_1, _emscripten_bind_btGhostObject_getUserIndex_0, _emscripten_enum_btConstraintParams_BT_CONSTRAINT_CFM, _emscripten_bind_btRigidBodyConstructionInfo_get_m_linearDamping_0, _emscripten_bind_btTriangleShapeEx_applyTransform_1, _emscripten_bind_btSoftRigidDynamicsWorld_getPairCache_0, _emscripten_bind_btVehicleTuning_set_m_suspensionCompression_1, _emscripten_bind_btGImpactCompoundShape_needsRetrieveTriangles_0, _emscripten_bind_btWheelInfo_set_m_steering_1, _emscripten_bind_Config_get_kMT_0, _emscripten_bind_btWheelInfo_get_m_chassisConnectionPointCS_0, _emscripten_bind_Anchor_get_m_c1_0, _emscripten_bind_btQuaternion_op_mul_1, _emscripten_bind_Face_get_m_normal_0, _emscripten_bind_btPoint2PointConstraint___destroy___0, _emscripten_bind_btCollisionWorld_debugDrawWorld_0, _emscripten_bind_btFixedConstraint_btFixedConstraint_4, _emscripten_bind_btDiscreteDynamicsWorld_btDiscreteDynamicsWorld_4, _emscripten_bind_btAABB_increment_margin_1, _emscripten_bind_btRaycastVehicle_setPitchControl_1, _emscripten_bind_btDynamicsWorld_getDispatchInfo_0, _emscripten_bind_btTriangleMesh_addTriangle_4, _emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_1, _emscripten_bind_ClosestConvexResultCallback_get_m_hitPointWorld_0, _emscripten_bind_btConvexPolyhedron_get_m_faces_0, _emscripten_enum_PHY_ScalarType_PHY_SHORT, _emscripten_bind_btCollisionObjectWrapper_getCollisionObject_0, _emscripten_bind_btRigidBodyConstructionInfo_get_m_angularDamping_0, _emscripten_bind_btQuaternion_normalize_0, _emscripten_bind_btSoftRigidDynamicsWorld_setContactAddedCallback_1, _emscripten_bind_tAnchorArray_at_1, _emscripten_bind_TrimeshPrimitiveManager_set_stride_1, _emscripten_bind_btDynamicsWorld_getDebugDrawer_0, _emscripten_bind_btSoftBody_set_m_nodes_1, _emscripten_bind_btSoftRigidDynamicsWorld_rayTest_3, _emscripten_bind_btGImpactMeshShape_getBulletTriangle_2, _emscripten_bind_btGImpactShapeInterface_getLocalScaling_0, _emscripten_bind_btPoint2PointConstraint_setPivotA_1, _emscripten_bind_btSoftBody_setTotalMass_2, _emscripten_bind_btTriangleShapeEx_btTriangleShapeEx_3, _emscripten_bind_MotionState___destroy___0, _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingFactor_1, _emscripten_bind_MotionState_setWorldTransform_1, _emscripten_bind_btDiscreteDynamicsWorld_removeAction_1, _emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionStiffness_1, _emscripten_bind_btSoftBodySolver___destroy___0, _emscripten_bind_btConeTwistConstraint_setMaxMotorImpulseNormalized_1, _emscripten_bind_btVector4_btVector4_0, _emscripten_bind_btDynamicsWorld_contactPairTest_3, _emscripten_bind_btRaycastVehicle_getSteeringValue_1, _emscripten_bind_btPairCachingGhostObject_isActive_0, _emscripten_bind_btMotionState___destroy___0, _emscripten_bind_btDispatcherInfo_set_m_useEpa_1, _emscripten_bind_btRigidBody_setSleepingThresholds_2, _emscripten_bind_LocalShapeInfo_get_m_shapePart_0, _emscripten_bind_btRigidBody_setAngularVelocity_1, _emscripten_bind_btWheelInfo_set_m_worldTransform_1, _emscripten_bind_btDispatcherInfo_get_m_timeStep_0, _emscripten_bind_btGImpactMeshShapePart___destroy___0, _emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterGroup_1, _emscripten_bind_btTriangleMesh_setScaling_1, _emscripten_bind_btTypedConstraint_getBreakingImpulseThreshold_0, _emscripten_bind_btConeTwistConstraint_setMotorTarget_1, _emscripten_bind_LocalConvexResult_set_m_hitCollisionObject_1, _emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_manifold_1, _emscripten_bind_btSoftBody_translate_1, _emscripten_bind_AllHitsRayResultCallback_get_m_collisionObject_0, _emscripten_bind_btRigidBody_applyForce_2, _emscripten_bind_btQuaternion_inverse_0, _emscripten_bind_btGImpactCollisionAlgorithm_btGImpactCollisionAlgorithm_3, _emscripten_bind_btCapsuleShapeX_getMargin_0, _emscripten_bind_RaycastInfo_get_m_hardPointWS_0, _emscripten_bind_HACD_SetVolumeWeight_1, _emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_3, _emscripten_bind_Config_get_kSR_SPLT_CL_0, _emscripten_bind_btGeneric6DofSpringConstraint_setAngularUpperLimit_1, _emscripten_bind_btBoxShape___destroy___0, _emscripten_bind_btRaycastVehicle_getWheelInfo_1, _emscripten_bind_btCompoundShape_updateChildTransform_2, _emscripten_bind_btSoftBody_set_m_cfg_1, _emscripten_bind_Parameters_get_m_beta_0, _emscripten_bind_DebugDrawer___destroy___0, _emscripten_bind_btCollisionWorld_debugDrawObject_3, _emscripten_bind_ConcreteContactResultCallback_addSingleResult_7, _emscripten_bind_btPairCachingGhostObject_setUserPointer_1, _emscripten_bind_btSoftBody_appendFace_4, _emscripten_bind_btPairCachingGhostObject_setCcdSweptSphereRadius_1, _emscripten_bind_btRigidBody_forceActivationState_1, _emscripten_bind_btPoint2PointConstraint_setParam_3, _emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelDirectionCS_0, _emscripten_bind_btConeTwistConstraint_setParam_3, _emscripten_bind_btConvexHullShape_btConvexHullShape_1, _emscripten_bind_btWheelInfo_get_m_steering_0, _emscripten_bind_btVector3_setZ_1, _emscripten_bind_RayResultCallback_set_m_collisionFilterGroup_1, _emscripten_bind_btGeneric6DofConstraint_setAngularUpperLimit_1, _emscripten_bind_btDispatcherInfo_get_m_convexConservativeDistanceThreshold_0, _emscripten_bind_btWheelInfo___destroy___0, _emscripten_bind_btSoftRigidDynamicsWorld_getGravity_0, _emscripten_bind_ClosestRayResultCallback_set_m_flags_1, _emscripten_bind_btConvexHullShape_btConvexHullShape_2, _emscripten_bind_btRigidBody_setCollisionShape_1, _emscripten_bind_LocalConvexResult_set_m_hitPointLocal_1, _emscripten_bind_btManifoldPoint_getPositionWorldOnA_0, _emscripten_bind_btQuaternion_setValue_4, _emscripten_bind_btSoftBody_generateBendingConstraints_2, _emscripten_bind_btRigidBody_setWorldTransform_1, _emscripten_bind_RaycastInfo_set_m_groundObject_1, _emscripten_bind_btIntArray_size_0, _emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_2, _emscripten_bind_btDynamicsWorld_addCollisionObject_3, _emscripten_bind_btVehicleTuning_set_m_suspensionDamping_1, _emscripten_bind_RaycastInfo_set_m_contactNormalWS_1, _emscripten_bind_btDiscreteDynamicsWorld_removeRigidBody_1, _emscripten_bind_btGhostObject_isStaticObject_0, _emscripten_bind_btDefaultMotionState_set_m_graphicsWorldTrans_1, _emscripten_bind_btDispatcherInfo_set_m_enableSatConvex_1, _emscripten_bind_ClosestRayResultCallback_set_m_hitNormalWorld_1, _emscripten_bind_btDefaultMotionState_btDefaultMotionState_0, _emscripten_bind_btCylinderShape_setMargin_1, _emscripten_bind_btRigidBody_getRestitution_0, _emscripten_bind_btRigidBody_getCollisionShape_0, _emscripten_bind_btConvexHullShape_recalcLocalAabb_0, _emscripten_bind_Vec3Real_Vec3Real_3, _emscripten_bind_Parameters_get_m_gamma_0, _emscripten_bind_btKinematicCharacterController_setJumpSpeed_1, _emscripten_bind_Parameters_get_m_planeDownsampling_0, _emscripten_bind_btConcaveShape_getLocalScaling_0, _emscripten_bind_LocalConvexResult_get_m_hitCollisionObject_0, _emscripten_bind_btKinematicCharacterController_warp_1, _emscripten_bind_btDispatcherInfo_set_m_timeStep_1, _emscripten_bind_Parameters_get_m_maxNumVerticesPerCH_0, _emscripten_bind_btQuaternion_y_0, _emscripten_bind_btGImpactCompoundShape_getChildAabb_4, _emscripten_bind_Material_set_m_flags_1, _emscripten_bind_btSoftBodyWorldInfo_get_water_density_0, _emscripten_bind_btBoxShape_btBoxShape_1, _emscripten_bind_btRigidBody_setCcdSweptSphereRadius_1, _emscripten_bind_btGImpactShapeInterface_postUpdate_0, _emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_3, _emscripten_bind_btKinematicCharacterController_playerStep_2, _emscripten_bind_AllHitsRayResultCallback_set_m_rayToWorld_1, _emscripten_bind_btHingeConstraint_setLimit_4, _emscripten_bind_RaycastInfo_set_m_contactPointWS_1, _emscripten_bind_btWheelInfo_get_m_deltaRotation_0, _emscripten_bind_btPairCachingGhostObject_getFriction_0, _emscripten_bind_btConvexTriangleMeshShape_getMargin_0, _emscripten_bind_btTriangleMeshShape_setLocalScaling_1, _emscripten_bind_btGeneric6DofConstraint_enableFeedback_1, _emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_CFM, _emscripten_bind_btCollisionShape_getMargin_0, _emscripten_bind_btRigidBody_activate_1, _emscripten_bind_btStaticPlaneShape_btStaticPlaneShape_2, _emscripten_bind_TrimeshPrimitiveManager_get_vertex_count_0, _emscripten_bind_TrimeshPrimitiveManager___destroy___0, _emscripten_bind_btConeShape_calculateLocalInertia_2, _emscripten_bind_btVehicleRaycaster_castRay_3, _emscripten_bind_btTetrahedronShapeEx___destroy___0, _emscripten_bind_btRigidBody_applyCentralForce_1, _emscripten_bind_btRigidBody_setActivationState_1, _emscripten_bind_CompoundPrimitiveManager___destroy___0, _emscripten_bind_btHingeConstraint_btHingeConstraint_4, _emscripten_bind_btDiscreteDynamicsWorld_setDebugDrawer_1, _emscripten_bind_btSoftBody_getCollisionShape_0, _emscripten_bind_btConeShapeZ_setLocalScaling_1, _emscripten_bind_btWheelInfo_set_m_rotation_1, _emscripten_bind_Node_get_m_v_0, _emscripten_bind_btGImpactCollisionAlgorithm_registerAlgorithm_1, _emscripten_bind_btCompoundShape_setMargin_1, _emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_0, _emscripten_bind_btRaycastVehicle_getUserConstraintType_0, _emscripten_bind_btRigidBody_getFlags_0, _emscripten_bind_Config_set_citerations_1, _emscripten_bind_btGeneric6DofConstraint_getParam_2, _emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_2, _emscripten_bind_btRigidBody_getGravity_0, _emscripten_bind_btSoftBody_get_m_materials_0, _emscripten_bind_btRigidBodyConstructionInfo_set_m_linearDamping_1, _emscripten_bind_btGImpactCompoundShape_getShapeType_0, _emscripten_bind_btVehicleRaycasterResult_get_m_hitNormalInWorld_0, _emscripten_bind_btSoftBodyWorldInfo_get_m_gravity_0, _emscripten_bind_btSoftBodyWorldInfo_get_air_density_0, _emscripten_bind_ConvexResultCallback_hasHit_0, _emscripten_bind_btPairCachingGhostObject_setCollisionShape_1, _emscripten_bind_AllHitsRayResultCallback_get_m_hitPointWorld_0, _emscripten_bind_btVector3_length2_0, _emscripten_bind_btCollisionObject_getRestitution_0, _emscripten_bind_btDiscreteDynamicsWorld_addAction_1, _emscripten_bind_ClosestRayResultCallback_get_m_collisionObject_0, _emscripten_bind_btKinematicCharacterController_setUpInterpolate_1, _emscripten_bind_Anchor_set_m_local_1, _emscripten_bind_TrimeshPrimitiveManager_is_trimesh_0, _emscripten_bind_btDiscreteDynamicsWorld_addConstraint_1, _emscripten_bind_Config_get_kCHR_0, _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDamping_1, _emscripten_bind_btMultiSphereShape___destroy___0, _emscripten_bind_btRigidBody_setUserIndex_1, _emscripten_bind_btPairCachingGhostObject_isKinematicObject_0, _emscripten_bind_btHingeConstraint_setLimit_5, _emscripten_bind_btRigidBody_clearForces_0, _emscripten_bind_btDefaultSoftBodySolver___destroy___0, _emscripten_bind_btDispatcherInfo_get_m_enableSPU_0, _emscripten_bind_btPersistentManifold_getContactPoint_1, _emscripten_bind_AllHitsRayResultCallback_set_m_hitNormalWorld_1, _emscripten_bind_CompoundPrimitiveManager_is_trimesh_0, _emscripten_bind_btRigidBody_setDamping_2, _emscripten_bind_btGeneric6DofSpringConstraint_getParam_2, _emscripten_bind_Anchor_get_m_local_0, _emscripten_bind_btRigidBodyConstructionInfo_get_m_angularSleepingThreshold_0, _emscripten_bind_btGeneric6DofSpringConstraint_enableFeedback_1, _emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingRelaxation_0, _emscripten_bind_btSoftBody_getBroadphaseHandle_0, _emscripten_bind_btVector3_btVector3_3, _emscripten_bind_btPairCachingGhostObject_getWorldTransform_0, _emscripten_bind_btWheelInfo_get_m_worldTransform_0, _emscripten_bind_btDiscreteDynamicsWorld___destroy___0, _emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_1, _emscripten_bind_btGImpactShapeInterface_needsRetrieveTetrahedrons_0, _emscripten_bind_btQuaternion_btQuaternion_4, _emscripten_bind_ClosestRayResultCallback_get_m_hitNormalWorld_0, _emscripten_bind_btCapsuleShapeZ_getLocalScaling_0, _emscripten_bind_btConeShape_btConeShape_2, _emscripten_bind_btGImpactMeshShape_needsRetrieveTetrahedrons_0, _emscripten_bind_btMotionState_getWorldTransform_1, _emscripten_bind_btSoftBodyWorldInfo_set_m_dispatcher_1, _emscripten_bind_TrimeshPrimitiveManager_get_indices_4, _emscripten_bind_btSoftBody_getFriction_0, _emscripten_bind_btHingeConstraint_getParam_2, _emscripten_bind_btBroadphaseProxy_set_m_collisionFilterGroup_1, _emscripten_bind_btWheelInfoConstructionInfo_get_m_frictionSlip_0, _emscripten_bind_btDynamicsWorld_setInternalTickCallback_3, _emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_2, _emscripten_bind_btWheelInfo_get_m_wheelsRadius_0, _emscripten_bind_ConvexHull_ConvexHull_0, _emscripten_bind_btGImpactMeshShapePart_btGImpactMeshShapePart_2, _emscripten_bind_btStridingMeshInterface___destroy___0, _emscripten_bind_btQuaternion_normalized_0, _emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_1, _emscripten_bind_btQuaternion_angleShortestPath_1, _emscripten_bind_btConeShapeZ_getLocalScaling_0, _emscripten_bind_btGImpactMeshShapePart_getShapeType_0, _emscripten_bind_btSoftBodyHelpers_CreatePatchUV_10, _emscripten_bind_btPairCachingGhostObject_setContactProcessingThreshold_1, _emscripten_bind_btCompoundShape_calculateLocalInertia_2, _emscripten_bind_btVector4_rotate_2, _emscripten_bind_btCapsuleShape_getLocalScaling_0, _emscripten_bind_btFixedConstraint_enableFeedback_1, _emscripten_bind_btConeShapeZ___destroy___0, _emscripten_bind_btVector3_setValue_3, _emscripten_bind_btRigidBody_activate_0, _emscripten_bind_Config_get_kSRHR_CL_0, _emscripten_bind_btTransform_setIdentity_0, _emscripten_bind_btTriangleMesh_findOrAddVertex_2, _emscripten_bind_tMaterialArray___destroy___0, _emscripten_bind_btAxisSweep3___destroy___0, _emscripten_bind_btConstraintSetting_get_m_damping_0, _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalLinearDampingThresholdSqr_0, _emscripten_bind_btVector3_setX_1, _emscripten_bind_Config_get_kKHR_0, _emscripten_bind_btConvexHullShape_btConvexHullShape_0, _emscripten_bind_btSliderConstraint_getBreakingImpulseThreshold_0, _emscripten_bind_TrimeshPrimitiveManager_get_numfaces_0, _emscripten_bind_btFaceArray_at_1, _emscripten_bind_btDispatcherInfo_get_m_useContinuous_0, _emscripten_bind_HACD_GetNClusters_0, _emscripten_bind_btCollisionObject_setFriction_1, _emscripten_bind_btSoftBodyWorldInfo___destroy___0, _emscripten_bind_btCylinderShapeZ_calculateLocalInertia_2, _emscripten_bind_btDiscreteDynamicsWorld_setGravity_1, _emscripten_bind_Parameters_Parameters_0, _emscripten_bind_btSoftBody_setUserPointer_1, _emscripten_bind_btSoftRigidDynamicsWorld_addSoftBody_3, _emscripten_bind_LocalConvexResult_get_m_hitNormalLocal_0, _emscripten_bind_btConeTwistConstraint_setDamping_1, _emscripten_bind_btFixedConstraint_setBreakingImpulseThreshold_1, _emscripten_bind_btTriangleMesh_getIndexedMeshArray_0, _emscripten_bind_btDefaultVehicleRaycaster_castRay_3, _emscripten_bind_btGhostObject_activate_1, _emscripten_bind_btIDebugDraw_setDebugMode_1, _emscripten_bind_btCapsuleShapeX_getLocalScaling_0, _emscripten_bind_btRigidBody_applyCentralLocalForce_1, _emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_2, _emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_1, _emscripten_bind_Anchor_set_m_c0_1, _emscripten_bind_btWheelInfo_set_m_maxSuspensionForce_1, _emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingRelaxation_1, _emscripten_bind_btPairCachingGhostObject_getCollisionShape_0, _emscripten_bind_btSoftRigidDynamicsWorld_getDispatcher_0, _emscripten_bind_btAxisSweep3_btAxisSweep3_5, _emscripten_bind_btConeTwistConstraint_setMaxMotorImpulse_1, _emscripten_bind_btCollisionObject_getUserPointer_0, _emscripten_bind_btRaycastVehicle_getUpAxis_0, _emscripten_bind_btStaticPlaneShape_getLocalScaling_0, _emscripten_bind_btConeTwistConstraint___destroy___0, _emscripten_bind_btTriangleMesh_btTriangleMesh_1, _emscripten_bind_TrimeshPrimitiveManager_get_bullet_triangle_2, _emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterGroup_0, _emscripten_bind_btIntArray_at_1, _emscripten_bind_btCollisionObject_setCollisionShape_1, _emscripten_bind_btRaycastVehicle_setUserConstraintType_1, _emscripten_bind_btSoftBody_setUserIndex_1, _emscripten_bind_TrimeshPrimitiveManager_get_indexstride_0, _emscripten_bind_Config_set_kMT_1, _emscripten_bind_btGhostObject_setUserIndex_1, _emscripten_bind_btQuaternion_setRotation_2, _emscripten_bind_btCylinderShapeX_setLocalScaling_1, _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDampingFactor_1, _emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_2, _emscripten_bind_btRigidBody_setRestitution_1, _emscripten_bind_btDispatcherInfo_get_m_enableSatConvex_0, _emscripten_bind_btCylinderShapeX_btCylinderShapeX_1, _emscripten_bind_AllHitsRayResultCallback_set_m_hitPointWorld_1, _emscripten_bind_btSoftBody_isKinematicObject_0, _emscripten_bind_btCylinderShape___destroy___0, _emscripten_bind_btPrimitiveManagerBase_get_primitive_triangle_2, _emscripten_bind_btStaticPlaneShape_calculateLocalInertia_2, _emscripten_bind_btQuaternion_op_mulq_1, _emscripten_bind_btCollisionObject_isActive_0, _emscripten_bind_btPrimitiveManagerBase_get_primitive_count_0, _emscripten_bind_btRaycastVehicle_updateVehicle_1, _emscripten_bind_btSoftRigidDynamicsWorld___destroy___0, _emscripten_bind_RaycastInfo_get_m_wheelDirectionWS_0, _emscripten_bind_btDynamicsWorld_debugDrawObject_3, _emscripten_bind_btWheelInfo_get_m_suspensionRelativeVelocity_0, _emscripten_bind_btBroadphaseProxy_get_m_collisionFilterGroup_0, _emscripten_bind_btFixedConstraint_getParam_2, _emscripten_bind_btHeightfieldTerrainShape___destroy___0, _emscripten_bind_btCapsuleShapeX_setMargin_1, _emscripten_bind_btSoftBodyWorldInfo_get_m_broadphase_0, _emscripten_bind_TrimeshPrimitiveManager_get_vertex_2, _emscripten_bind_btCollisionObject_setAnisotropicFriction_2, _emscripten_bind_btWheelInfo_set_m_wheelsDampingRelaxation_1, _emscripten_bind_btVector4_setZ_1, _emscripten_bind_btGhostObject_setWorldTransform_1, _emscripten_enum_PHY_ScalarType_PHY_INTEGER, _emscripten_bind_btVector4_op_sub_1, _emscripten_bind_ClosestRayResultCallback_get_m_hitPointWorld_0, _emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionTravelCm_1, _emscripten_bind_btCollisionShape_getLocalScaling_0, _emscripten_bind_btSoftBody_get_m_cfg_0, _emscripten_bind_btGhostObject_isActive_0, _emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingCompression_1, _emscripten_bind_btQuadWord_x_0, _emscripten_bind_btSoftBodyWorldInfo_set_water_offset_1, _emscripten_bind_RaycastInfo_get_m_wheelAxleWS_0, _emscripten_bind_btDynamicsWorld_setInternalTickCallback_1, _emscripten_bind_btWheelInfo_set_m_wheelsSuspensionForce_1, _emscripten_bind_btDiscreteDynamicsWorld_setContactDestroyedCallback_1, _emscripten_bind_btGeneric6DofConstraint_getFrameOffsetA_0, _emscripten_bind_btSoftRigidDynamicsWorld_removeSoftBody_1, _emscripten_bind_btSoftBody_isStaticOrKinematicObject_0, _emscripten_bind_Config_get_citerations_0, _emscripten_bind_btBroadphaseProxy_get_m_collisionFilterMask_0, _emscripten_bind_Config_get_kLF_0, _emscripten_bind_btCapsuleShapeZ_setLocalScaling_1, _emscripten_bind_btSliderConstraint___destroy___0, _emscripten_bind_btPersistentManifold_getNumContacts_0, _emscripten_bind_btCollisionWorld_addCollisionObject_3, _emscripten_bind_btVehicleTuning_get_m_suspensionStiffness_0, _emscripten_bind_Config_get_viterations_0, _emscripten_bind_btQuadWord_w_0, _emscripten_bind_btCollisionShape___destroy___0, _emscripten_bind_Config_get_kDG_0, _emscripten_bind_btCapsuleShapeZ_getRadius_0, _emscripten_bind_btCollisionObject_getCollisionFlags_0, _emscripten_bind_btQuadWord_y_0, _emscripten_bind_btGImpactMeshShape_setLocalScaling_1, _emscripten_bind_btGhostObject_activate_0, _emscripten_bind_btRigidBody_setContactProcessingThreshold_1, _emscripten_bind_Config_get_diterations_0, _emscripten_bind_btVector4___destroy___0, _emscripten_bind_btWheelInfo_get_m_wheelAxleCS_0, _emscripten_bind_btRigidBodyConstructionInfo_get_m_linearSleepingThreshold_0, _emscripten_bind_Vec3Long_Z_0, _emscripten_bind_btDispatcherInfo_get_m_dispatchFunc_0, _emscripten_bind_btPairCachingGhostObject_setFriction_1, _emscripten_bind_btWheelInfo_set_m_bIsFrontWheel_1, _emscripten_bind_btConeShapeZ_btConeShapeZ_2, _emscripten_bind_btTypedConstraint___destroy___0, _emscripten_bind_ClosestConvexResultCallback_get_m_convexToWorld_0, _emscripten_bind_btCollisionWorld_removeCollisionObject_1, _emscripten_bind_btConeShapeX___destroy___0, _emscripten_bind_btRigidBody_setFriction_1, _emscripten_bind_btDispatcherInfo_get_m_allowedCcdPenetration_0, _emscripten_bind_btSoftBodyWorldInfo_set_m_gravity_1, _emscripten_bind_btGImpactMeshShapePart_setLocalScaling_1, _emscripten_bind_btDefaultVehicleRaycaster_btDefaultVehicleRaycaster_1, _emscripten_bind_btCollisionConfiguration___destroy___0, _emscripten_bind_btGImpactShapeInterface_setLocalScaling_1, _emscripten_bind_btRigidBody_getCollisionFlags_0, _emscripten_bind_btRigidBody_applyTorqueImpulse_1, _emscripten_bind_btCollisionObject_getBroadphaseHandle_0, _emscripten_bind_btRigidBody_getBroadphaseHandle_0, _emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelRadius_1, _emscripten_bind_btConeShape___destroy___0, _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDamping_0, _emscripten_bind_btQuaternion_angle_1, _emscripten_bind_btSoftBody_upcast_1, _emscripten_bind_btDynamicsWorld_convexSweepTest_5, _emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_2, _emscripten_bind_btDiscreteDynamicsWorld_removeCollisionObject_1, _emscripten_bind_Node_get_m_x_0, _emscripten_bind_btDefaultMotionState_btDefaultMotionState_2, _emscripten_bind_btCompoundShape_removeChildShape_1, _emscripten_bind_btRigidBodyConstructionInfo_get_m_friction_0, _emscripten_bind_btVehicleTuning_get_m_suspensionCompression_0, _emscripten_bind_btWheelInfo_set_m_wheelDirectionCS_1, _emscripten_bind_btRaycastVehicle_getWheelTransformWS_1, _emscripten_bind_btCylinderShapeZ_setLocalScaling_1, _emscripten_bind_btWheelInfo_set_m_chassisConnectionPointCS_1, _emscripten_bind_btConstraintSetting___destroy___0, _emscripten_bind_btGImpactShapeInterface_childrenHasTransform_0, _emscripten_bind_LocalConvexResult_get_m_hitPointLocal_0, _emscripten_bind_btTypedConstraint_setBreakingImpulseThreshold_1, _emscripten_bind_btAABB_copy_with_margin_2, _emscripten_bind_btRigidBody_getLinearVelocity_0, _emscripten_bind_btSoftBody_appendTetra_5, _emscripten_bind_VHACD_Clean_0, _emscripten_bind_Parameters_get_m_resolution_0, _emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelDirectionCS_1, _emscripten_bind_btWheelInfo_set_m_maxSuspensionTravelCm_1, _emscripten_bind_btGeneric6DofConstraint_setLinearLowerLimit_1, _emscripten_bind_btConvexShape_setMargin_1, _emscripten_bind_LocalConvexResult_LocalConvexResult_5, _emscripten_bind_btGImpactMeshShapePart_updateBound_0, _emscripten_bind_btPairCachingGhostObject_forceActivationState_1, _emscripten_bind_btDiscreteDynamicsWorld_getGravity_0, _emscripten_bind_btDispatcherInfo_set_m_enableSPU_1, _emscripten_bind_HACD_SetPoints_1, _emscripten_bind_btConvexHullShape_initializePolyhedralFeatures_1, _emscripten_bind_btRaycastVehicle_resetSuspension_0, _emscripten_bind_btPairCachingGhostObject_getUserIndex_0, _emscripten_bind_btFace___destroy___0, _emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_TRIMESH_SHAPE_PART, _emscripten_bind_RaycastInfo_get_m_contactPointWS_0, _emscripten_bind_btGhostObject_setCcdSweptSphereRadius_1, _emscripten_bind_btGhostObject_getOverlappingObject_1, _emscripten_bind_btConvexHullShape_getLocalScaling_0, _emscripten_bind_btDiscreteDynamicsWorld_contactPairTest_3, _emscripten_bind_btGeneric6DofSpringConstraint_setLinearLowerLimit_1, _emscripten_bind_btSliderConstraint_setLowerAngLimit_1, _emscripten_bind_Parameters_set_m_gamma_1, _emscripten_bind_RayResultCallback_set_m_collisionFilterMask_1, _emscripten_bind_btPairCachingGhostObject_btPairCachingGhostObject_0, _emscripten_bind_btDiscreteDynamicsWorld_getDispatchInfo_0, _emscripten_bind_btGImpactShapeInterface_needsRetrieveTriangles_0, _emscripten_bind_Anchor_get_m_body_0, _emscripten_bind_btDefaultCollisionConfiguration___destroy___0, _emscripten_bind_btCapsuleShapeZ_getMargin_0, _emscripten_bind_btCollisionWorld_updateSingleAabb_1, _emscripten_bind_btPairCachingGhostObject_activate_1, _emscripten_bind_btHeightfieldTerrainShape_getMargin_0, _emscripten_bind_btTransform_getOrigin_0, _emscripten_bind_btVehicleRaycaster___destroy___0, _emscripten_bind_ConvexResultCallback_get_m_closestHitFraction_0, _emscripten_bind_btCollisionObject_setWorldTransform_1, _emscripten_enum_btConstraintParams_BT_CONSTRAINT_ERP, _emscripten_bind_btRigidBodyConstructionInfo___destroy___0, _emscripten_bind_btPairCachingGhostObject_getCollisionFlags_0, _emscripten_bind_btSoftRigidDynamicsWorld_getSolverInfo_0, _emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionForce_0, _emscripten_bind_tNodeArray_at_1, _emscripten_bind_btCollisionObject_setCollisionFlags_1, _emscripten_bind_btGhostObject_isStaticOrKinematicObject_0, _emscripten_bind_btHeightfieldTerrainShape_setMargin_1, _emscripten_bind_btVector3Array_at_1, _emscripten_bind_Config_get_kDP_0, _emscripten_bind_btGImpactCompoundShape_getNumChildShapes_0, _emscripten_bind_btConstraintSetting_set_m_tau_1, _emscripten_bind_btIDebugDraw_drawContactPoint_5, _emscripten_bind_RaycastInfo_set_m_wheelDirectionWS_1, _emscripten_bind_btSoftRigidDynamicsWorld_convexSweepTest_5, _emscripten_bind_RaycastInfo_get_m_groundObject_0, _emscripten_bind_btSoftRigidDynamicsWorld_contactPairTest_3, _emscripten_bind_btVector4_length_0, _emscripten_bind_LocalConvexResult_set_m_localShapeInfo_1, _emscripten_bind_AllHitsRayResultCallback_get_m_closestHitFraction_0, _emscripten_bind_btRigidBodyConstructionInfo_get_m_rollingFriction_0, _emscripten_bind_btWheelInfo_set_m_brake_1, _emscripten_bind_btGhostPairCallback___destroy___0, _emscripten_bind_VHACD_Cancel_0, _emscripten_bind_btPrimitiveTriangle_btPrimitiveTriangle_0, _emscripten_bind_btSliderConstraint_getAngularPos_0, _emscripten_bind_RaycastInfo_get_m_contactNormalWS_0, _emscripten_bind_AllHitsRayResultCallback___destroy___0, _emscripten_bind_btRaycastVehicle_getRigidBody_0, _emscripten_bind_Config_get_kSHR_0, _emscripten_bind_btQuaternion_setY_1, _emscripten_bind_btCylinderShapeX_getLocalScaling_0, _emscripten_bind_btVehicleTuning_get_m_maxSuspensionTravelCm_0, _emscripten_bind_btConstCollisionObjectArray___destroy___0, _emscripten_bind_btConeTwistConstraint_setLimit_2, _emscripten_bind_Parameters_set_m_resolution_1, _emscripten_bind_btQuaternion___destroy___0, _emscripten_bind_btSoftBody_generateClusters_2, _emscripten_bind_btTransform_getBasis_0, _emscripten_bind_btCylinderShapeZ_getMargin_0, _emscripten_bind_btGImpactCompoundShape_updateBound_0, _emscripten_bind_btGImpactCompoundShape_getLocalScaling_0, _emscripten_bind_btCollisionShape_calculateLocalInertia_2, _emscripten_bind_btRigidBodyConstructionInfo_get_m_restitution_0, _emscripten_bind_btSphereShape___destroy___0, _emscripten_bind_btCapsuleShapeZ_calculateLocalInertia_2, _emscripten_bind_Parameters_set_m_pca_1, _emscripten_bind_btAABB___destroy___0, _emscripten_bind_btDispatcherInfo_set_m_useConvexConservativeDistanceUtil_1, _emscripten_bind_btSoftRigidDynamicsWorld_getWorldInfo_0, _emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_3, _emscripten_bind_btSoftBody_addForce_1, _emscripten_bind_LocalShapeInfo___destroy___0, _emscripten_bind_btRaycastVehicle_updateFriction_1, _emscripten_bind_btConstraintSetting_get_m_impulseClamp_0, _emscripten_bind_btGImpactMeshShapePart_needsRetrieveTriangles_0, _emscripten_bind_btSoftBodyWorldInfo_get_m_dispatcher_0, _emscripten_bind_btCollisionDispatcher_btCollisionDispatcher_1, _emscripten_bind_btCapsuleShape_getMargin_0, _emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_2, _emscripten_bind_btGImpactMeshShape_needsRetrieveTriangles_0, _emscripten_bind_btAxisSweep3_btAxisSweep3_3, _emscripten_bind_btDiscreteDynamicsWorld_rayTest_3, _emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration___destroy___0, _emscripten_bind_btVector3_x_0, _emscripten_bind_btCylinderShape_btCylinderShape_1, _emscripten_bind_btWheelInfo_get_m_rollInfluence_0, _emscripten_bind_RayResultCallback_get_m_collisionObject_0, _emscripten_bind_btRigidBody_setAngularFactor_1, _emscripten_bind_btPairCachingGhostObject_activate_0, _emscripten_bind_ConvexResultCallback_set_m_collisionFilterMask_1, _emscripten_bind_btQuaternion_setW_1, _emscripten_bind_btGhostObject_setFriction_1, _emscripten_bind_DebugDrawer_setDebugMode_1, _emscripten_bind_btGeneric6DofSpringConstraint_setAngularLowerLimit_1, _emscripten_bind_btTypedConstraint_setParam_3, _emscripten_bind_Config_set_kSK_SPLT_CL_1, _emscripten_bind_btVehicleTuning_set_m_suspensionStiffness_1, _emscripten_bind_btGhostObject_setCollisionShape_1, _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalLinearDampingThresholdSqr_1, _emscripten_bind_btMatrix3x3_getRotation_1, _emscripten_bind_btVector3_op_mul_1, _emscripten_bind_btSoftBodyHelpers_CreatePatch_9, _emscripten_enum_PHY_ScalarType_PHY_FLOAT, _emscripten_bind_btRaycastVehicle_getCurrentSpeedKmHour_0, _emscripten_bind_btConeShape_getLocalScaling_0, _emscripten_bind_btGhostObject_setCollisionFlags_1, _emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterMask_0, _emscripten_bind_btHingeConstraint_btHingeConstraint_3, _emscripten_bind_btCylinderShape_setLocalScaling_1, _emscripten_bind_btManifoldPoint_get_m_userPersistentData_0, _emscripten_bind_btBroadphaseInterface___destroy___0, _emscripten_bind_btSoftBody_appendMaterial_0, _emscripten_bind_btConcaveShape_setLocalScaling_1, _emscripten_bind_CompoundPrimitiveManager_get_primitive_triangle_2, _emscripten_bind_btCapsuleShape_setLocalScaling_1, _emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_2, _emscripten_bind_btGImpactShapeInterface_calculateLocalInertia_2, _emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_2, _emscripten_bind_ClosestConvexResultCallback_get_m_convexFromWorld_0, _emscripten_bind_btQuadWord_setX_1, _emscripten_bind_btCylinderShapeX_getMargin_0, _emscripten_bind_btCollisionObject_isStaticOrKinematicObject_0, _emscripten_bind_btTriangleMesh_addTriangle_3, _emscripten_bind_CompoundPrimitiveManager_get_primitive_count_0, _emscripten_bind_ClosestRayResultCallback_ClosestRayResultCallback_2, _emscripten_bind_Parameters_set_m_convexhullDownsampling_1, _emscripten_bind_btRigidBodyConstructionInfo_set_m_angularDamping_1, _emscripten_bind_btCollisionObject_getCollisionShape_0, _emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_4, _emscripten_bind_btVehicleTuning_set_m_frictionSlip_1, _emscripten_bind_btRigidBodyConstructionInfo_set_m_linearSleepingThreshold_1, _emscripten_bind_Parameters_set_m_oclAcceleration_1, _emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_1, _emscripten_bind_btPoint2PointConstraint_setBreakingImpulseThreshold_1, _emscripten_bind_Parameters_get_m_pca_0, _emscripten_bind_btSoftBody_scale_1, _emscripten_bind_btIndexedMesh_get_m_numTriangles_0, _emscripten_bind_btDispatcherInfo_get_m_timeOfImpact_0, _emscripten_bind_btManifoldPoint_set_m_positionWorldOnB_1, _emscripten_bind_btVector4_z_0, _emscripten_bind_btVehicleRaycasterResult_set_m_hitNormalInWorld_1, _emscripten_bind_btSoftBodyHelpers_CreateRope_5, _emscripten_bind_btCollisionObjectWrapper_getCollisionShape_0, _emscripten_bind_btGImpactMeshShape_updateBound_0, _emscripten_bind_btDispatcherInfo___destroy___0, _emscripten_bind_tFaceArray___destroy___0, _emscripten_bind_btDynamicsWorld_removeAction_1, _emscripten_bind_btQuaternion_setEulerZYX_3, _emscripten_bind_TrimeshPrimitiveManager_get_m_part_0, _emscripten_bind_btPoint2PointConstraint_getPivotInB_0, _emscripten_bind_btIndexedMeshArray___destroy___0, _emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelAxleCS_0, _emscripten_bind_btCollisionObject_isKinematicObject_0, _emscripten_bind_ConvexResultCallback_get_m_collisionFilterGroup_0, _emscripten_bind_Config_get_collisions_0, _emscripten_bind_btSoftRigidDynamicsWorld_getDebugDrawer_0, _emscripten_bind_btWheelInfo_set_m_frictionSlip_1, _emscripten_bind_btSoftBody_get_m_anchors_0, _emscripten_bind_btDispatcher___destroy___0, _emscripten_bind_btManifoldPoint_set_m_localPointA_1, _emscripten_bind_btSoftRigidDynamicsWorld_getSoftBodyArray_0, _emscripten_bind_Config_set_kPR_1, _emscripten_bind_TrimeshPrimitiveManager_set_numfaces_1, _emscripten_bind_btFace_get_m_indices_0, _emscripten_bind_btDefaultVehicleRaycaster___destroy___0, _emscripten_bind_btQuadWord_setZ_1, _emscripten_bind_btWheelInfoConstructionInfo_set_m_frictionSlip_1, _emscripten_bind_ClosestConvexResultCallback_set_m_hitCollisionObject_1, _emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_ERP, _emscripten_bind_Parameters_set_m_convexhullApproximation_1, _emscripten_bind_btQuaternion_length_0, _emscripten_bind_btSoftBodyHelpers_CreateEllipsoid_4, _emscripten_bind_btCapsuleShapeZ_btCapsuleShapeZ_2, _emscripten_bind_btManifoldPoint_set_m_localPointB_1, _emscripten_bind_TrimeshPrimitiveManager_get_m_lock_count_0, _emscripten_bind_btGImpactShapeInterface_getBulletTriangle_2, _emscripten_bind_btStridingMeshInterface_setScaling_1, _emscripten_bind_btSphereShape_getMargin_0, _emscripten_bind_btSoftBody_appendLink_4, _emscripten_bind_Node_set_m_q_1, _emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_4, _emscripten_bind_btWheelInfo_get_m_wheelDirectionCS_0, _emscripten_bind_btKinematicCharacterController_setGravity_1, _emscripten_bind_btSliderConstraint_btSliderConstraint_5, _emscripten_bind_Material___destroy___0, _emscripten_bind_btVector3_btVector3_0, _emscripten_bind_btVehicleTuning_get_m_frictionSlip_0, _emscripten_bind_btSequentialImpulseConstraintSolver_btSequentialImpulseConstraintSolver_0, _emscripten_bind_Config_get_kSSHR_CL_0, _emscripten_bind_LocalShapeInfo_get_m_triangleIndex_0, _emscripten_bind_btConstraintSetting_btConstraintSetting_0, _emscripten_bind_btGImpactCompoundShape_getChildShape_1, _emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_1, _emscripten_bind_btKinematicCharacterController_setWalkDirection_1, _emscripten_bind_btAABB_btAABB_4, _emscripten_bind_btCollisionObject_setRestitution_1, _emscripten_bind_btPairCachingGhostObject_getRestitution_0, _emscripten_enum_PHY_ScalarType_PHY_DOUBLE, _emscripten_bind_btDiscreteDynamicsWorld_getPairCache_0, _emscripten_bind_AllHitsRayResultCallback_get_m_flags_0, _emscripten_bind_btVector3_z_0, _emscripten_bind_RaycastInfo_get_m_isInContact_0, _emscripten_bind_btCollisionObjectWrapper_getWorldTransform_0, _emscripten_bind_btTriangleMesh_btTriangleMesh_0, _emscripten_bind_btSoftRigidDynamicsWorld_addAction_1, _emscripten_bind_btDynamicsWorld_removeCollisionObject_1, _emscripten_bind_btManifoldPoint_set_m_userPersistentData_1, _emscripten_bind_btGImpactCompoundShape___destroy___0, _emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_2, _emscripten_bind_btGeneric6DofSpringConstraint_getBreakingImpulseThreshold_0, _emscripten_bind_btConstCollisionObjectArray_at_1, _emscripten_bind_Config_set_kSHR_1, _emscripten_bind_btBoxShape_setLocalScaling_1, _emscripten_bind_btConstCollisionObjectArray_size_0, _emscripten_bind_btSoftBodyArray_at_1, _emscripten_bind_Anchor_get_m_c2_0, _emscripten_bind_btManifoldPoint_getPositionWorldOnB_0, _emscripten_bind_btWheelInfo_set_m_suspensionRelativeVelocity_1, _emscripten_bind_Config_set_kAHR_1, _emscripten_bind_btBvhTriangleMeshShape_setLocalScaling_1, _emscripten_bind_btDispatcherInfo_set_m_stepCount_1, _emscripten_bind_btManifoldPoint_getDistance_0, _emscripten_bind_btCollisionShape_setLocalScaling_1, _emscripten_bind_btHingeConstraint___destroy___0, _emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_2, _emscripten_bind_btIndexedMesh___destroy___0, _emscripten_bind_btGImpactMeshShapePart_getBulletTetrahedron_2, _emscripten_bind_ConvexHull_get_m_nPoints_0, _emscripten_bind_btShapeHull___destroy___0, _emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_3, _emscripten_bind_ClosestConvexResultCallback_set_m_hitNormalWorld_1, _emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_5, _emscripten_bind_TrimeshPrimitiveManager_unlock_0, _emscripten_bind_Config_get_kPR_0, _emscripten_bind_btRigidBody_setAnisotropicFriction_2, _emscripten_bind_btVector3Array_size_0, _emscripten_bind_btSoftBody_setCollisionShape_1, _emscripten_bind_Vec3Long___destroy___0, _emscripten_bind_btDispatcherInfo_get_m_useEpa_0, _emscripten_bind_tAnchorArray_push_back_1, _emscripten_bind_btVector4_op_add_1, _emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_0, _emscripten_bind_btKinematicCharacterController_setUseGhostSweepTest_1, _emscripten_bind_btWheelInfo_get_m_wheelsSuspensionForce_0, _emscripten_bind_btRigidBody_setRollingFriction_1, _emscripten_bind_btRigidBody_getBroadphaseProxy_0, _emscripten_bind_btCapsuleShapeX_btCapsuleShapeX_2, _emscripten_bind_btKinematicCharacterController_setUpAxis_1, _emscripten_bind_btCapsuleShape_getRadius_0, _emscripten_bind_btCompoundShape_getMargin_0, _emscripten_bind_MotionState_getWorldTransform_1, _emscripten_bind_btWheelInfo_set_m_engineForce_1, _emscripten_bind_Node_set_m_area_1, _emscripten_bind_btKinematicCharacterController_canJump_0, _emscripten_bind_LocalConvexResult_set_m_hitFraction_1, _emscripten_bind_btRigidBody_getAngularVelocity_0, _emscripten_bind_Config_set_kDP_1, _emscripten_bind_btPersistentManifold_getBody1_0, _emscripten_bind_btGImpactCompoundShape_getChildTransform_1, _emscripten_bind_MotionState_MotionState_0, _emscripten_bind_btPairCachingGhostObject_setActivationState_1, _emscripten_bind_btCollisionWorld_getDispatchInfo_0, _emscripten_enum_PHY_ScalarType_PHY_FIXEDPOINT88, _emscripten_bind_btCollisionShape_setMargin_1, _emscripten_bind_btGImpactMeshShapePart_getPart_0, _emscripten_bind_btSliderConstraint_setUpperAngLimit_1, _emscripten_bind_btMultiSphereShape_getLocalScaling_0, _emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_2, _emscripten_bind_Parameters_get_m_convexhullDownsampling_0, _emscripten_bind_btPersistentManifold_btPersistentManifold_0, _emscripten_bind_btCompoundShape_removeChildShapeByIndex_1, _emscripten_bind_btCollisionWorld_setForceUpdateAllAabbs_1, _emscripten_bind_btHingeConstraint_getHingeAngle_0, _emscripten_bind_btConvexPolyhedron_get_m_vertices_0, _emscripten_bind_btSoftBody_isStaticObject_0, _emscripten_bind_btVector3_op_add_1, _emscripten_bind_btCollisionWorld_setDebugDrawer_1, _emscripten_bind_btWheelInfoConstructionInfo_get_m_bIsFrontWheel_0, _emscripten_bind_btVehicleRaycasterResult_get_m_distFraction_0, _emscripten_bind_btCylinderShapeZ_btCylinderShapeZ_1, _emscripten_bind_btIDebugDraw___destroy___0, _emscripten_bind_btGhostObject_getUserPointer_0, _emscripten_bind_Parameters_get_m_minVolumePerCH_0, _emscripten_bind_TrimeshPrimitiveManager_lock_0, _emscripten_bind_ConvexResultCallback_set_m_collisionFilterGroup_1, _emscripten_bind_btSoftRigidDynamicsWorld_setContactProcessedCallback_1, _emscripten_bind_btGeneric6DofSpringConstraint_setDamping_2, _emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_COMPOUND_SHAPE, _emscripten_bind_HACD_SetCompacityWeight_1, _emscripten_bind_btGhostObject_getCollisionFlags_0, _emscripten_bind_btDefaultSoftBodySolver_btDefaultSoftBodySolver_0, _emscripten_bind_btIDebugDraw_getDebugMode_0, _emscripten_bind_btPairCachingGhostObject_getUserPointer_0, _emscripten_bind_btSoftRigidDynamicsWorld_debugDrawObject_3, _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDampingFactor_0, _emscripten_bind_Node_get_m_f_0, _emscripten_bind_btPrimitiveTriangle___destroy___0, _emscripten_bind_btHeightfieldTerrainShape_calculateLocalInertia_2, _emscripten_bind_btManifoldPoint___destroy___0, _emscripten_bind_btSoftBody_get_m_faces_0, _emscripten_bind_btSoftRigidDynamicsWorld_getDispatchInfo_0, _emscripten_bind_btScalarArray_at_1, _emscripten_bind_Node_set_m_im_1, _emscripten_bind_btGImpactCompoundShape_getCompoundPrimitiveManager_0, _emscripten_bind_btConvexHullShape_addPoint_1, _emscripten_bind_btTypedConstraint_getParam_2, _emscripten_bind_btSoftBody_setWorldTransform_1, _emscripten_bind_btRaycastVehicle_getChassisWorldTransform_0, _emscripten_bind_btConvexShape_calculateLocalInertia_2, _emscripten_bind_btKinematicCharacterController_setVelocityForTimeInterval_2, _emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_3, _emscripten_bind_btKinematicCharacterController_onGround_0, _emscripten_bind_btGhostObject_setCcdMotionThreshold_1, _emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_0, _emscripten_bind_btIndexedMesh_set_m_numTriangles_1, _emscripten_bind_btGImpactShapeInterface_getChildShape_1, _emscripten_bind_btRigidBody_isActive_0, _emscripten_bind_btFixedConstraint___destroy___0, _emscripten_bind_btSoftBodyHelpers___destroy___0, _emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_0, _emscripten_bind_btFaceArray___destroy___0, _emscripten_bind_TrimeshPrimitiveManager_set_indicestype_1, _emscripten_bind_btGImpactCompoundShape_getName_0, _emscripten_bind_btDefaultCollisionConstructionInfo___destroy___0, _emscripten_bind_btCapsuleShape_calculateLocalInertia_2, _emscripten_bind_Config_get_kVCF_0, _emscripten_bind_btSliderConstraint_setTargetLinMotorVelocity_1, _emscripten_bind_AllHitsRayResultCallback_get_m_collisionObjects_0, _emscripten_bind_btGhostObject_setContactProcessingThreshold_1, _emscripten_bind_btCapsuleShapeX_setLocalScaling_1, _emscripten_bind_btShapeHull_getVertexPointer_0, _emscripten_bind_Config_set_kSRHR_CL_1, _emscripten_bind_btCapsuleShapeZ_getUpAxis_0, _emscripten_bind_Anchor_set_m_body_1, _emscripten_bind_btGeneric6DofSpringConstraint_getFrameOffsetA_0, _webidl_free, _emscripten_bind_btWheelInfo_get_m_raycastInfo_0, _emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_4, _emscripten_bind_btManifoldPoint_get_m_positionWorldOnB_0, _emscripten_bind_btVector4_normalize_0, _emscripten_bind_btFace_set_m_indices_1, _emscripten_bind_btRaycastVehicle_setSteeringValue_2, _emscripten_bind_btRaycastVehicle_applyEngineForce_2, _emscripten_bind_btVector3_normalize_0, _emscripten_bind_btSoftBody_setAnisotropicFriction_2, _emscripten_bind_btBoxShape_getMargin_0, _emscripten_bind_Node_get_m_area_0, _emscripten_bind_btDynamicsWorld_addCollisionObject_1, _emscripten_bind_Node_get_m_n_0, _emscripten_bind_btSliderConstraint_setBreakingImpulseThreshold_1, _emscripten_bind_btContactSolverInfo_get_m_numIterations_0, _emscripten_bind_btGImpactMeshShapePart_needsRetrieveTetrahedrons_0, _emscripten_bind_ClosestRayResultCallback___destroy___0, _emscripten_bind_Config_get_piterations_0, _emscripten_bind_VHACD_GetConvexHull_2, _emscripten_bind_RayResultCallback_get_m_flags_0, _emscripten_bind_btBroadphaseProxy___destroy___0, _emscripten_bind_btSoftRigidDynamicsWorld_btSoftRigidDynamicsWorld_5, _emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_3, _emscripten_bind_Config_set_viterations_1, _emscripten_bind_btSoftBodyArray___destroy___0, _emscripten_bind_btVector3_length_0, _emscripten_bind_btSoftBodyWorldInfo_set_water_normal_1, _emscripten_bind_btHingeConstraint_getBreakingImpulseThreshold_0, _emscripten_bind_Face_get_m_n_1, _emscripten_bind_btStaticPlaneShape___destroy___0, _emscripten_bind_btCapsuleShapeX_calculateLocalInertia_2, _emscripten_bind_btVector3Array___destroy___0, _emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_1, _emscripten_bind_btVector3_op_sub_1, _emscripten_bind_btVehicleRaycasterResult_get_m_hitPointInWorld_0, _emscripten_bind_btWheelInfo_set_m_suspensionStiffness_1, _emscripten_bind_btGhostObject___destroy___0, _emscripten_bind_Config_get_kSKHR_CL_0, _emscripten_bind_btRaycastVehicle_getForwardVector_0, _emscripten_bind_btKinematicCharacterController_jump_0, _emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterMask_1, _emscripten_bind_btCollisionDispatcher_getManifoldByIndexInternal_1, _emscripten_bind_btVector3_rotate_2, _emscripten_bind_Parameters_get_m_mode_0, _emscripten_bind_btSoftBodyWorldInfo_get_water_offset_0, _emscripten_bind_ClosestRayResultCallback_set_m_hitPointWorld_1, _emscripten_bind_btMultiSphereShape_calculateLocalInertia_2, _emscripten_bind_Vec3Long_X_0, _emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_3, _emscripten_bind_btRigidBody_setMassProps_2, _emscripten_bind_btSoftBodyHelpers_btSoftBodyHelpers_0, _emscripten_bind_btSliderConstraint_getParam_2, _emscripten_bind_HACD_Compute_0, _emscripten_bind_btTriangleMeshShape_calculateLocalInertia_2, _emscripten_bind_VHACD_Compute_7, _emscripten_bind_btCollisionWorld_contactTest_2, _emscripten_bind_btSoftBody_addForce_2, _emscripten_bind_btDynamicsWorld_rayTest_3, _emscripten_bind_btHingeConstraint_enableAngularMotor_3, _emscripten_bind_btBroadphaseProxy_set_m_collisionFilterMask_1, _emscripten_bind_RayResultCallback_set_m_flags_1, _emscripten_bind_btGeneric6DofConstraint_setAngularLowerLimit_1, _emscripten_bind_btRigidBody_getFriction_0, _emscripten_bind_btTransform_btTransform_2, _emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_0, _emscripten_bind_tMaterialArray_at_1, _emscripten_bind_btWheelInfo_btWheelInfo_1, _emscripten_bind_Config_set_kVC_1, _emscripten_bind_btWheelInfo_set_m_rollInfluence_1, _emscripten_bind_btSliderConstraint_getLinearPos_0, _emscripten_bind_btEmptyShape_setLocalScaling_1, _emscripten_bind_btGeneric6DofConstraint_setBreakingImpulseThreshold_1, _emscripten_bind_btGhostObject_getNumOverlappingObjects_0, _emscripten_bind_btWheelInfo_get_m_bIsFrontWheel_0, _emscripten_bind_btGeneric6DofSpringConstraint_setBreakingImpulseThreshold_1, _emscripten_bind_ClosestConvexResultCallback_get_m_closestHitFraction_0, _emscripten_bind_btTransform_getRotation_0, _emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_2, _emscripten_bind_btQuaternion_op_add_1, _emscripten_bind_ClosestRayResultCallback_hasHit_0, _emscripten_bind_btMultiSphereShape_btMultiSphereShape_3, _emscripten_bind_AllHitsRayResultCallback_get_m_rayToWorld_0, _emscripten_bind_RayResultCallback___destroy___0, _emscripten_bind_btGImpactCompoundShape_addChildShape_2, _emscripten_bind_btConstraintSetting_set_m_damping_1, _emscripten_bind_btSoftRigidDynamicsWorld_setContactDestroyedCallback_1, _emscripten_bind_btSliderConstraint_setParam_3, _emscripten_bind_btContactSolverInfo_set_m_splitImpulsePenetrationThreshold_1, _emscripten_bind_btSoftBody_get_m_nodes_0, _emscripten_bind_btGImpactCompoundShape_setLocalScaling_1, _emscripten_bind_btQuadWord___destroy___0, _emscripten_bind_btTetrahedronShapeEx_btTetrahedronShapeEx_0, _emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_1, _emscripten_bind_ClosestConvexResultCallback___destroy___0, _emscripten_bind_btCollisionObject_getRollingFriction_0, _emscripten_bind_btScalarArray_size_0, _emscripten_bind_btRigidBody_isStaticObject_0, _emscripten_bind_btPairCachingGhostObject_getBroadphaseHandle_0, _emscripten_bind_btDiscreteDynamicsWorld_debugDrawObject_3, _emscripten_bind_btQuaternion_getAxis_0, _emscripten_bind_Node_set_m_f_1, _emscripten_bind_btCollisionAlgorithm___destroy___0, _emscripten_bind_btSoftRigidDynamicsWorld_debugDrawWorld_0, _emscripten_bind_btGImpactMeshShape_btGImpactMeshShape_1, _emscripten_bind_btMatrix3x3___destroy___0, _emscripten_bind_btGImpactMeshShapePart_getTrimeshPrimitiveManager_0, _emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_2, _emscripten_bind_btTypedConstraint_enableFeedback_1, _emscripten_bind_btConvexHullShape_setLocalScaling_1, _emscripten_bind_btPairCachingGhostObject_setUserIndex_1, _emscripten_bind_Material_set_m_kVST_1, _emscripten_bind_btCompoundShape_setLocalScaling_1, _emscripten_bind_ClosestConvexResultCallback_hasHit_0, _emscripten_bind_btConeShapeX_setLocalScaling_1, _emscripten_bind_btVehicleTuning_set_m_maxSuspensionTravelCm_1, _emscripten_bind_btSliderConstraint_setMaxLinMotorForce_1, _emscripten_bind_ClosestRayResultCallback_get_m_closestHitFraction_0, _emscripten_bind_btMatrix3x3_getRow_1, _emscripten_bind_btRigidBody_getWorldTransform_0, _emscripten_bind_RaycastInfo_set_m_wheelAxleWS_1, _emscripten_bind_btCollisionWorld_getPairCache_0, _emscripten_bind_ConcreteContactResultCallback___destroy___0, _emscripten_bind_btSoftBody_getRollingFriction_0, _emscripten_bind_btCollisionObject_setActivationState_1, _emscripten_bind_btSliderConstraint_setUpperLinLimit_1, _emscripten_bind_btSoftBody_setCcdMotionThreshold_1, _emscripten_bind_ConvexResultCallback___destroy___0, _emscripten_bind_btCompoundShape_btCompoundShape_0, _emscripten_bind_btRigidBody_getLinearFactor_0, _emscripten_bind_btDbvtBroadphase_btDbvtBroadphase_0, _emscripten_bind_Parameters_set_m_minVolumePerCH_1, _emscripten_bind_btVehicleTuning_btVehicleTuning_0, _emscripten_bind_btConeShapeX_getLocalScaling_0, _emscripten_bind_btDispatcherInfo_set_m_allowedCcdPenetration_1, _emscripten_bind_btHingeConstraint_setBreakingImpulseThreshold_1, _emscripten_bind_btSoftBodyWorldInfo_get_water_normal_0, _emscripten_bind_btRigidBody_upcast_1, _emscripten_bind_btWheelInfo_get_m_maxSuspensionTravelCm_0, _emscripten_bind_btCollisionObject_getFriction_0, _emscripten_bind_btIndexedMeshArray_at_1, _emscripten_bind_btHeightfieldTerrainShape_setLocalScaling_1, _emscripten_bind_ClosestRayResultCallback_set_m_collisionObject_1, _emscripten_bind_RaycastInfo_set_m_isInContact_1, _emscripten_bind_btSoftBodyWorldInfo_set_water_density_1, _emscripten_bind_btPoint2PointConstraint_get_m_setting_0, _emscripten_bind_btQuadWord_setW_1, _emscripten_bind_Face_set_m_n_2, _emscripten_bind_Config_set_kLF_1, _emscripten_bind_Parameters_get_m_depth_0, _emscripten_bind_btManifoldPoint_getAppliedImpulse_0, _emscripten_bind_LocalConvexResult_get_m_localShapeInfo_0, _emscripten_bind_ClosestRayResultCallback_get_m_rayFromWorld_0, _emscripten_bind_btConvexTriangleMeshShape___destroy___0, _emscripten_bind_btConvexPolyhedron_set_m_faces_1, _emscripten_bind_AllHitsRayResultCallback_set_m_collisionObjects_1, _emscripten_bind_btCollisionDispatcher_getNumManifolds_0, _emscripten_bind_btWheelInfo_get_m_clippedInvContactDotSuspension_0, _emscripten_bind_btTransform_setRotation_1, _emscripten_bind_btVector4_setValue_4, _emscripten_bind_btGImpactMeshShape_getBulletTetrahedron_2, _emscripten_bind_btRigidBody_setCenterOfMassTransform_1, _emscripten_bind_HACD_HACD_0, _emscripten_bind_btSoftBody_getRestitution_0, _emscripten_bind_TrimeshPrimitiveManager_set_type_1, _emscripten_bind_btVehicleTuning_set_m_maxSuspensionForce_1, _emscripten_bind_btRigidBody_setGravity_1, _emscripten_bind_btDefaultMotionState_btDefaultMotionState_1, _emscripten_bind_RaycastInfo_set_m_suspensionLength_1, _emscripten_bind_btRaycastVehicle_getRightAxis_0, _emscripten_bind_btRigidBody_getAabb_2, _emscripten_bind_AllHitsRayResultCallback_set_m_rayFromWorld_1, _emscripten_bind_Parameters_set_m_concavity_1, _emscripten_bind_btGImpactMeshShape_postUpdate_0, _emscripten_bind_AllHitsRayResultCallback_AllHitsRayResultCallback_2, _emscripten_bind_Anchor_set_m_node_1, _emscripten_bind_btGhostObject_setRestitution_1, _emscripten_bind_btManifoldPoint_set_m_normalWorldOnB_1, _emscripten_bind_btSoftBody_appendNode_2, _emscripten_bind_btWheelInfo_get_m_maxSuspensionForce_0, _emscripten_bind_btWheelInfo_getSuspensionRestLength_0, _emscripten_bind_AllHitsRayResultCallback_set_m_hitFractions_1, _emscripten_bind_btVector4_y_0, _emscripten_bind_Config_set_kSR_SPLT_CL_1, _emscripten_bind_btTriangleMesh___destroy___0, _emscripten_bind_Face___destroy___0, _emscripten_bind_btRaycastVehicle_getUserConstraintId_0, _emscripten_bind_btTetrahedronShapeEx_setVertices_4, _emscripten_bind_VHACD_Release_0, _emscripten_bind_btWheelInfo_set_m_wheelsRadius_1, _emscripten_bind_btSliderConstraint_setLowerLinLimit_1, _emscripten_bind_RayResultCallback_hasHit_0, _emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionRestLength_1, _emscripten_bind_ClosestRayResultCallback_set_m_rayFromWorld_1, _emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionForce_1, _emscripten_bind_Vec3Long_Vec3Long_3, _emscripten_bind_ClosestRayResultCallback_get_m_rayToWorld_0, _emscripten_bind_btSoftBody_setRestLengthScale_1, _emscripten_bind_ConvexHull_get_m_nTriangles_0, _emscripten_bind_ConcreteContactResultCallback_ConcreteContactResultCallback_0, _emscripten_bind_btPrimitiveManagerBase___destroy___0, _emscripten_bind_btHingeConstraint_setMotorTarget_2, _emscripten_bind_TrimeshPrimitiveManager_set_indexstride_1, _emscripten_bind_btGhostObject_getWorldTransform_0, _emscripten_bind_btGeneric6DofSpringConstraint_setStiffness_2, _emscripten_bind_btSoftBodyWorldInfo_btSoftBodyWorldInfo_0, _emscripten_bind_btFace_get_m_plane_1, _emscripten_bind_RaycastInfo___destroy___0, _emscripten_bind_btSoftBody_checkLink_2, _emscripten_bind_btAxisSweep3_btAxisSweep3_2, _emscripten_bind_ConvexResultCallback_get_m_collisionFilterMask_0, _emscripten_bind_btContactSolverInfo_set_m_splitImpulse_1, _emscripten_bind_btCollisionWorld___destroy___0, _emscripten_bind_btRigidBody_setCollisionFlags_1, _emscripten_bind_btCompoundShape_getNumChildShapes_0, _emscripten_bind_btRigidBody_applyImpulse_2, _emscripten_bind_btRaycastVehicle_getNumWheels_0, _emscripten_bind_btDispatcherInfo_get_m_useConvexConservativeDistanceUtil_0, _emscripten_bind_btIndexedMeshArray_size_0, _emscripten_bind_btRigidBody_btRigidBody_1, _emscripten_bind_btRigidBodyConstructionInfo_set_m_friction_1, _emscripten_bind_btIntArray___destroy___0, _emscripten_bind_btActivatingCollisionAlgorithm___destroy___0, _emscripten_bind_btGeneric6DofSpringConstraint___destroy___0, _emscripten_bind_btTriangleShapeEx_getAabb_3, _malloc, _emscripten_bind_btWheelInfo_get_m_brake_0, _emscripten_bind_btCompoundShape_updateChildTransform_3, _emscripten_bind_btConeTwistConstraint_setAngularOnly_1, _emscripten_bind_btSoftRigidDynamicsWorld_setGravity_1, _emscripten_bind_btShapeHull_buildHull_1, _emscripten_bind_btConeTwistConstraint_setMotorTargetInConstraintSpace_1, _emscripten_bind_btCapsuleShapeX_getRadius_0, _emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelRadius_0, _emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingCompression_0, _emscripten_bind_btSequentialImpulseConstraintSolver___destroy___0, _emscripten_bind_btGhostObject_btGhostObject_0, _emscripten_bind_btRigidBody_setFlags_1, _emscripten_bind_btWheelInfo_set_m_skidInfo_1, _emscripten_bind_VHACD___destroy___0, _emscripten_bind_Vec3Real_X_0, _emscripten_bind_LocalConvexResult_set_m_hitNormalLocal_1, _emscripten_bind_btDispatcherInfo_set_m_useContinuous_1, _emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterGroup_0, _emscripten_bind_Config___destroy___0, _emscripten_bind_btHeightfieldTerrainShape_btHeightfieldTerrainShape_9, _emscripten_bind_btCollisionWorld_contactPairTest_3, _emscripten_bind_Config_set_kVCF_1, _emscripten_bind_btSoftBody___destroy___0, _emscripten_bind_btKinematicCharacterController_updateAction_2, _emscripten_bind_btRigidBodyConstructionInfo_set_m_angularSleepingThreshold_1, _emscripten_bind_btRaycastVehicle_updateAction_2, _emscripten_bind_btRigidBody_updateInertiaTensor_0, _emscripten_bind_btGhostObject_getRollingFriction_0, _emscripten_bind_btDefaultMotionState_setWorldTransform_1, _emscripten_bind_btPrimitiveManagerBase_is_trimesh_0, _emscripten_bind_ClosestConvexResultCallback_set_m_convexToWorld_1, _emscripten_bind_Config_get_kSK_SPLT_CL_0, _emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterMask_1, _emscripten_bind_AllHitsRayResultCallback_get_m_hitNormalWorld_0, _emscripten_bind_btPairCachingGhostObject_getOverlappingObject_1, _emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionStiffness_0, _emscripten_bind_btKinematicCharacterController_getGhostObject_0, _emscripten_bind_btDefaultMotionState_get_m_graphicsWorldTrans_0, _emscripten_bind_btRigidBody_getCenterOfMassTransform_0, _emscripten_bind_btHingeConstraint_setMaxMotorImpulse_1, _emscripten_bind_btRigidBody_applyLocalTorque_1, _emscripten_bind_AllHitsRayResultCallback_get_m_hitFractions_0, _emscripten_bind_btConvexHullShape_getConvexPolyhedron_0, _emscripten_bind_btDispatcherInfo_set_m_timeOfImpact_1, _emscripten_bind_btSoftBodyArray_size_0, _emscripten_bind_btMotionState_setWorldTransform_1, _emscripten_bind_btConeTwistConstraint_setBreakingImpulseThreshold_1, _emscripten_bind_btKinematicCharacterController___destroy___0, _emscripten_bind_Config_set_kSSHR_CL_1, _emscripten_bind_DebugDrawer_getDebugMode_0, _emscripten_bind_ClosestConvexResultCallback_set_m_convexFromWorld_1, _emscripten_bind_btVector4_length2_0, _emscripten_bind_btFaceArray_size_0, _emscripten_bind_btCylinderShapeX___destroy___0, _emscripten_bind_btVehicleRaycasterResult___destroy___0, _emscripten_bind_tAnchorArray___destroy___0, _emscripten_bind_btCollisionObject_activate_0, _emscripten_bind_btConvexShape___destroy___0, _emscripten_bind_btManifoldPoint_set_m_positionWorldOnA_1, _emscripten_bind_btSoftBody_set_m_faces_1, _emscripten_bind_tAnchorArray_pop_back_0, _emscripten_bind_btHingeConstraint_btHingeConstraint_5, _emscripten_bind_btCapsuleShape___destroy___0, _emscripten_bind_btDefaultMotionState___destroy___0, _emscripten_bind_btDiscreteDynamicsWorld_contactTest_2, _emscripten_bind_btRigidBody_getMotionState_0, _emscripten_bind_btTriangleMesh_addIndex_1, _emscripten_bind_btConvexShape_getMargin_0, _emscripten_bind_Node_get_m_im_0, _emscripten_bind_btGeneric6DofConstraint___destroy___0, _emscripten_bind_btRigidBody_getAngularDamping_0, _emscripten_bind_btMatrix3x3_setEulerZYX_3, _emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_0, _emscripten_bind_btQuaternion_setZ_1, _emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_3, _emscripten_bind_DebugDrawer_draw3dText_2, _emscripten_bind_ClosestConvexResultCallback_get_m_hitCollisionObject_0, _emscripten_bind_Config_get_kDF_0, _emscripten_bind_btDiscreteDynamicsWorld_setContactAddedCallback_1, _emscripten_bind_btRigidBody_isStaticOrKinematicObject_0, _emscripten_bind_btKinematicCharacterController_getGravity_0, _emscripten_bind_Config_set_kCHR_1, _emscripten_bind_Anchor___destroy___0, _emscripten_bind_btSoftBody_setCollisionFlags_1, _emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_4, _emscripten_bind_HACD_SetNPoints_1, _emscripten_bind_Parameters_set_m_planeDownsampling_1, _emscripten_bind_btQuaternion_getAngleShortestPath_0, _emscripten_bind_btCylinderShape_calculateLocalInertia_2, _emscripten_bind_btDynamicsWorld_setForceUpdateAllAabbs_1, _emscripten_bind_Parameters_set_m_maxNumVerticesPerCH_1, _emscripten_bind_Node_set_m_v_1, _emscripten_bind_btGImpactCompoundShape_needsRetrieveTetrahedrons_0, _emscripten_bind_btDispatcherInfo_set_m_convexConservativeDistanceThreshold_1, _emscripten_bind_Config_get_kSS_SPLT_CL_0, _emscripten_bind_btPoint2PointConstraint_setPivotB_1, _emscripten_bind_tNodeArray_size_0, _emscripten_bind_btQuaternion_length2_0, _emscripten_bind_btHingeConstraint_setParam_3, _emscripten_bind_btHingeConstraint_btHingeConstraint_6, _emscripten_bind_btGImpactMeshShape_getMeshInterface_0, _emscripten_bind_btWheelInfo_get_m_wheelsDampingRelaxation_0, _emscripten_bind_btSoftBody_setCcdSweptSphereRadius_1, _emscripten_bind_btTriangleMeshShape___destroy___0, _emscripten_bind_btRaycastVehicle_addWheel_7, _emscripten_bind_btGhostObject_getRestitution_0, _emscripten_bind_btDiscreteDynamicsWorld_removeConstraint_1, _emscripten_bind_btRaycastVehicle___destroy___0, _emscripten_bind_btQuaternion_x_0, _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingThresholdSqr_1, _emscripten_bind_DebugDrawer_drawLine_3, _emscripten_bind_btSoftBodyHelpers_CreateFromTriMesh_5, _emscripten_bind_btCompoundShape___destroy___0, _emscripten_bind_VoidPtr___destroy___0, _emscripten_bind_btRigidBody_setLinearVelocity_1, _emscripten_bind_Anchor_get_m_c0_0, _emscripten_bind_Node___destroy___0, _emscripten_bind_btSoftBody_setContactProcessingThreshold_1, _emscripten_bind_btDynamicsWorld_contactTest_2, _emscripten_bind_btTransform_setOrigin_1, _emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterGroup_1, _emscripten_bind_btRaycastVehicle_btRaycastVehicle_3, _emscripten_bind_btSoftBodyWorldInfo_get_m_maxDisplacement_0, _emscripten_bind_tFaceArray_size_0, _emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_3, _emscripten_bind_btSoftRigidDynamicsWorld_removeAction_1, _emscripten_bind_btGImpactShapeInterface_getName_0, _emscripten_bind_ConvexHull___destroy___0, _emscripten_bind_btDynamicsWorld_getBroadphase_0, _emscripten_bind_RayResultCallback_set_m_collisionObject_1, _emscripten_bind_HACD_SetTriangles_1, _emscripten_bind_btCollisionObject_setCcdSweptSphereRadius_1, _emscripten_bind_btKinematicCharacterController_preStep_1, _emscripten_bind_TrimeshPrimitiveManager_get_m_meshInterface_0, _emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionTravelCm_0, _emscripten_bind_btSoftBody_setRollingFriction_1, _emscripten_bind_btConeTwistConstraint_enableMotor_1, _emscripten_bind_btBoxShape_setMargin_1, _emscripten_bind_btGImpactShapeInterface_getGImpactShapeType_0, _emscripten_bind_btCollisionObject_setCcdMotionThreshold_1, _emscripten_bind_Config_set_kDG_1, _emscripten_bind_TrimeshPrimitiveManager_get_type_0, _emscripten_bind_btHingeConstraint_setAngularOnly_1, _emscripten_bind_btKinematicCharacterController_setMaxSlope_1, _emscripten_bind_btRigidBody_applyCentralImpulse_1 };


// include: postamble.js
// === Auto-generated postamble setup entry stuff ===

var calledRun;

function stackCheckInit() {
  // This is normally called automatically during __wasm_call_ctors but need to
  // get these values before even running any of the ctors so we call it redundantly
  // here.
  _emscripten_stack_init();
  // TODO(sbc): Move writeStackCookie to native to to avoid this.
  writeStackCookie();
}

function run() {

  stackCheckInit();

  preRun();

  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    assert(!calledRun);
    calledRun = true;
    Module['calledRun'] = true;

    if (ABORT) return;

    initRuntime();

    readyPromiseResolve?.(Module);
    Module['onRuntimeInitialized']?.();
    consumedModuleProp('onRuntimeInitialized');

    assert(!Module['_main'], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(() => {
      setTimeout(() => Module['setStatus'](''), 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
  checkStackCookie();
}

function checkUnflushedContent() {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var oldOut = out;
  var oldErr = err;
  var has = false;
  out = err = (x) => {
    has = true;
  }
  try { // it doesn't matter if it fails
    flush_NO_FILESYSTEM();
  } catch(e) {}
  out = oldOut;
  err = oldErr;
  if (has) {
    warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.');
    warnOnce('(this may also be due to not including full filesystem support - try building with -sFORCE_FILESYSTEM)');
  }
}

var wasmExports;

// In MODULARIZE=instance mode we delay most of the initialization work until
// the `init` function is called.
var initCalled = false;
export default async function init(moduleArg = {}) {
  assert(!initCalled);
  initCalled = true;
  Object.assign(Module, moduleArg);
  processModuleArgs();
  updateMemoryViews();
  run();
}

// end include: postamble.js


// Bindings utilities

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function WrapperObject() {
}
WrapperObject.prototype = Object.create(WrapperObject.prototype);
WrapperObject.prototype.constructor = WrapperObject;
WrapperObject.prototype.__class__ = WrapperObject;
WrapperObject.__cache__ = {};
Module['WrapperObject'] = WrapperObject;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant)
    @param {*=} __class__ */
function getCache(__class__) {
  return (__class__ || WrapperObject).__cache__;
}
Module['getCache'] = getCache;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant)
    @param {*=} __class__ */
function wrapPointer(ptr, __class__) {
  var cache = getCache(__class__);
  var ret = cache[ptr];
  if (ret) return ret;
  ret = Object.create((__class__ || WrapperObject).prototype);
  ret.ptr = ptr;
  return cache[ptr] = ret;
}
Module['wrapPointer'] = wrapPointer;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function castObject(obj, __class__) {
  return wrapPointer(obj.ptr, __class__);
}
Module['castObject'] = castObject;

Module['NULL'] = wrapPointer(0);

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function destroy(obj) {
  if (!obj['__destroy__']) throw 'Error: Cannot destroy object. (Did you create it yourself?)';
  obj['__destroy__']();
  // Remove from cache, so the object can be GC'd and refs added onto it released
  delete getCache(obj.__class__)[obj.ptr];
}
Module['destroy'] = destroy;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function compare(obj1, obj2) {
  return obj1.ptr === obj2.ptr;
}
Module['compare'] = compare;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function getPointer(obj) {
  return obj.ptr;
}
Module['getPointer'] = getPointer;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function getClass(obj) {
  return obj.__class__;
}
Module['getClass'] = getClass;

// Converts big (string or array) values into a C-style storage, in temporary space

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
var ensureCache = {
  buffer: 0,  // the main buffer of temporary storage
  size: 0,   // the size of buffer
  pos: 0,    // the next free offset in buffer
  temps: [], // extra allocations
  needed: 0, // the total size we need next time

  prepare() {
    if (ensureCache.needed) {
      // clear the temps
      for (var i = 0; i < ensureCache.temps.length; i++) {
        Module['_webidl_free'](ensureCache.temps[i]);
      }
      ensureCache.temps.length = 0;
      // prepare to allocate a bigger buffer
      Module['_webidl_free'](ensureCache.buffer);
      ensureCache.buffer = 0;
      ensureCache.size += ensureCache.needed;
      // clean up
      ensureCache.needed = 0;
    }
    if (!ensureCache.buffer) { // happens first time, or when we need to grow
      ensureCache.size += 128; // heuristic, avoid many small grow events
      ensureCache.buffer = Module['_webidl_malloc'](ensureCache.size);
      assert(ensureCache.buffer);
    }
    ensureCache.pos = 0;
  },
  alloc(array, view) {
    assert(ensureCache.buffer);
    var bytes = view.BYTES_PER_ELEMENT;
    var len = array.length * bytes;
    len = alignMemory(len, 8); // keep things aligned to 8 byte boundaries
    var ret;
    if (ensureCache.pos + len >= ensureCache.size) {
      // we failed to allocate in the buffer, next time around :(
      assert(len > 0); // null terminator, at least
      ensureCache.needed += len;
      ret = Module['_webidl_malloc'](len);
      ensureCache.temps.push(ret);
    } else {
      // we can allocate in the buffer
      ret = ensureCache.buffer + ensureCache.pos;
      ensureCache.pos += len;
    }
    return ret;
  },
};

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureString(value) {
  if (typeof value === 'string') {
    var intArray = intArrayFromString(value);
    var offset = ensureCache.alloc(intArray, HEAP8);
    for (var i = 0; i < intArray.length; i++) {
      HEAP8[offset + i] = intArray[i];
    }
    return offset;
  }
  return value;
}

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt8(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP8);
    for (var i = 0; i < value.length; i++) {
      HEAP8[offset + i] = value[i];
    }
    return offset;
  }
  return value;
}

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt16(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP16);
    var heapOffset = offset / 2;
    for (var i = 0; i < value.length; i++) {
      HEAP16[heapOffset + i] = value[i];
    }
    return offset;
  }
  return value;
}

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP32);
    var heapOffset = offset / 4;
    for (var i = 0; i < value.length; i++) {
      HEAP32[heapOffset + i] = value[i];
    }
    return offset;
  }
  return value;
}

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureFloat32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF32);
    var heapOffset = offset / 4;
    for (var i = 0; i < value.length; i++) {
      HEAPF32[heapOffset + i] = value[i];
    }
    return offset;
  }
  return value;
}

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureFloat64(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF64);
    var heapOffset = offset / 8;
    for (var i = 0; i < value.length; i++) {
      HEAPF64[heapOffset + i] = value[i];
    }
    return offset;
  }
  return value;
}

// Interface: btCollisionShape

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btCollisionShape() { throw "cannot construct a btCollisionShape, no constructor in IDL" }
btCollisionShape.prototype = Object.create(WrapperObject.prototype);
btCollisionShape.prototype.constructor = btCollisionShape;
btCollisionShape.prototype.__class__ = btCollisionShape;
btCollisionShape.__cache__ = {};
Module['btCollisionShape'] = btCollisionShape;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionShape.prototype['setLocalScaling'] = btCollisionShape.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btCollisionShape_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionShape.prototype['getLocalScaling'] = btCollisionShape.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionShape_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionShape.prototype['calculateLocalInertia'] = btCollisionShape.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btCollisionShape_calculateLocalInertia_2(self, mass, inertia);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionShape.prototype['setMargin'] = btCollisionShape.prototype.setMargin = function(margin) {
  var self = this.ptr;
  if (margin && typeof margin === 'object') margin = margin.ptr;
  _emscripten_bind_btCollisionShape_setMargin_1(self, margin);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionShape.prototype['getMargin'] = btCollisionShape.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btCollisionShape_getMargin_0(self);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionShape.prototype['__destroy__'] = btCollisionShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCollisionShape___destroy___0(self);
};

// Interface: btCollisionWorld

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btCollisionWorld() { throw "cannot construct a btCollisionWorld, no constructor in IDL" }
btCollisionWorld.prototype = Object.create(WrapperObject.prototype);
btCollisionWorld.prototype.constructor = btCollisionWorld;
btCollisionWorld.prototype.__class__ = btCollisionWorld;
btCollisionWorld.__cache__ = {};
Module['btCollisionWorld'] = btCollisionWorld;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionWorld.prototype['getDispatcher'] = btCollisionWorld.prototype.getDispatcher = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionWorld_getDispatcher_0(self), btDispatcher);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionWorld.prototype['rayTest'] = btCollisionWorld.prototype.rayTest = function(rayFromWorld, rayToWorld, resultCallback) {
  var self = this.ptr;
  if (rayFromWorld && typeof rayFromWorld === 'object') rayFromWorld = rayFromWorld.ptr;
  if (rayToWorld && typeof rayToWorld === 'object') rayToWorld = rayToWorld.ptr;
  if (resultCallback && typeof resultCallback === 'object') resultCallback = resultCallback.ptr;
  _emscripten_bind_btCollisionWorld_rayTest_3(self, rayFromWorld, rayToWorld, resultCallback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionWorld.prototype['getPairCache'] = btCollisionWorld.prototype.getPairCache = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionWorld_getPairCache_0(self), btOverlappingPairCache);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionWorld.prototype['getDispatchInfo'] = btCollisionWorld.prototype.getDispatchInfo = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionWorld_getDispatchInfo_0(self), btDispatcherInfo);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionWorld.prototype['addCollisionObject'] = btCollisionWorld.prototype.addCollisionObject = function(collisionObject, collisionFilterGroup, collisionFilterMask) {
  var self = this.ptr;
  if (collisionObject && typeof collisionObject === 'object') collisionObject = collisionObject.ptr;
  if (collisionFilterGroup && typeof collisionFilterGroup === 'object') collisionFilterGroup = collisionFilterGroup.ptr;
  if (collisionFilterMask && typeof collisionFilterMask === 'object') collisionFilterMask = collisionFilterMask.ptr;
  if (collisionFilterGroup === undefined) { _emscripten_bind_btCollisionWorld_addCollisionObject_1(self, collisionObject); return }
  if (collisionFilterMask === undefined) { _emscripten_bind_btCollisionWorld_addCollisionObject_2(self, collisionObject, collisionFilterGroup); return }
  _emscripten_bind_btCollisionWorld_addCollisionObject_3(self, collisionObject, collisionFilterGroup, collisionFilterMask);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionWorld.prototype['removeCollisionObject'] = btCollisionWorld.prototype.removeCollisionObject = function(collisionObject) {
  var self = this.ptr;
  if (collisionObject && typeof collisionObject === 'object') collisionObject = collisionObject.ptr;
  _emscripten_bind_btCollisionWorld_removeCollisionObject_1(self, collisionObject);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionWorld.prototype['getBroadphase'] = btCollisionWorld.prototype.getBroadphase = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionWorld_getBroadphase_0(self), btBroadphaseInterface);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionWorld.prototype['convexSweepTest'] = btCollisionWorld.prototype.convexSweepTest = function(castShape, from, to, resultCallback, allowedCcdPenetration) {
  var self = this.ptr;
  if (castShape && typeof castShape === 'object') castShape = castShape.ptr;
  if (from && typeof from === 'object') from = from.ptr;
  if (to && typeof to === 'object') to = to.ptr;
  if (resultCallback && typeof resultCallback === 'object') resultCallback = resultCallback.ptr;
  if (allowedCcdPenetration && typeof allowedCcdPenetration === 'object') allowedCcdPenetration = allowedCcdPenetration.ptr;
  _emscripten_bind_btCollisionWorld_convexSweepTest_5(self, castShape, from, to, resultCallback, allowedCcdPenetration);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionWorld.prototype['contactPairTest'] = btCollisionWorld.prototype.contactPairTest = function(colObjA, colObjB, resultCallback) {
  var self = this.ptr;
  if (colObjA && typeof colObjA === 'object') colObjA = colObjA.ptr;
  if (colObjB && typeof colObjB === 'object') colObjB = colObjB.ptr;
  if (resultCallback && typeof resultCallback === 'object') resultCallback = resultCallback.ptr;
  _emscripten_bind_btCollisionWorld_contactPairTest_3(self, colObjA, colObjB, resultCallback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionWorld.prototype['contactTest'] = btCollisionWorld.prototype.contactTest = function(colObj, resultCallback) {
  var self = this.ptr;
  if (colObj && typeof colObj === 'object') colObj = colObj.ptr;
  if (resultCallback && typeof resultCallback === 'object') resultCallback = resultCallback.ptr;
  _emscripten_bind_btCollisionWorld_contactTest_2(self, colObj, resultCallback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionWorld.prototype['setForceUpdateAllAabbs'] = btCollisionWorld.prototype.setForceUpdateAllAabbs = function(forceUpdateAllAabbs) {
  var self = this.ptr;
  if (forceUpdateAllAabbs && typeof forceUpdateAllAabbs === 'object') forceUpdateAllAabbs = forceUpdateAllAabbs.ptr;
  _emscripten_bind_btCollisionWorld_setForceUpdateAllAabbs_1(self, forceUpdateAllAabbs);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionWorld.prototype['updateSingleAabb'] = btCollisionWorld.prototype.updateSingleAabb = function(colObj) {
  var self = this.ptr;
  if (colObj && typeof colObj === 'object') colObj = colObj.ptr;
  _emscripten_bind_btCollisionWorld_updateSingleAabb_1(self, colObj);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionWorld.prototype['setDebugDrawer'] = btCollisionWorld.prototype.setDebugDrawer = function(debugDrawer) {
  var self = this.ptr;
  if (debugDrawer && typeof debugDrawer === 'object') debugDrawer = debugDrawer.ptr;
  _emscripten_bind_btCollisionWorld_setDebugDrawer_1(self, debugDrawer);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionWorld.prototype['getDebugDrawer'] = btCollisionWorld.prototype.getDebugDrawer = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionWorld_getDebugDrawer_0(self), btIDebugDraw);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionWorld.prototype['debugDrawWorld'] = btCollisionWorld.prototype.debugDrawWorld = function() {
  var self = this.ptr;
  _emscripten_bind_btCollisionWorld_debugDrawWorld_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionWorld.prototype['debugDrawObject'] = btCollisionWorld.prototype.debugDrawObject = function(worldTransform, shape, color) {
  var self = this.ptr;
  if (worldTransform && typeof worldTransform === 'object') worldTransform = worldTransform.ptr;
  if (shape && typeof shape === 'object') shape = shape.ptr;
  if (color && typeof color === 'object') color = color.ptr;
  _emscripten_bind_btCollisionWorld_debugDrawObject_3(self, worldTransform, shape, color);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionWorld.prototype['__destroy__'] = btCollisionWorld.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCollisionWorld___destroy___0(self);
};

// Interface: btCollisionObject

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btCollisionObject() { throw "cannot construct a btCollisionObject, no constructor in IDL" }
btCollisionObject.prototype = Object.create(WrapperObject.prototype);
btCollisionObject.prototype.constructor = btCollisionObject;
btCollisionObject.prototype.__class__ = btCollisionObject;
btCollisionObject.__cache__ = {};
Module['btCollisionObject'] = btCollisionObject;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['setAnisotropicFriction'] = btCollisionObject.prototype.setAnisotropicFriction = function(anisotropicFriction, frictionMode) {
  var self = this.ptr;
  if (anisotropicFriction && typeof anisotropicFriction === 'object') anisotropicFriction = anisotropicFriction.ptr;
  if (frictionMode && typeof frictionMode === 'object') frictionMode = frictionMode.ptr;
  _emscripten_bind_btCollisionObject_setAnisotropicFriction_2(self, anisotropicFriction, frictionMode);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['getCollisionShape'] = btCollisionObject.prototype.getCollisionShape = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionObject_getCollisionShape_0(self), btCollisionShape);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['setContactProcessingThreshold'] = btCollisionObject.prototype.setContactProcessingThreshold = function(contactProcessingThreshold) {
  var self = this.ptr;
  if (contactProcessingThreshold && typeof contactProcessingThreshold === 'object') contactProcessingThreshold = contactProcessingThreshold.ptr;
  _emscripten_bind_btCollisionObject_setContactProcessingThreshold_1(self, contactProcessingThreshold);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['setActivationState'] = btCollisionObject.prototype.setActivationState = function(newState) {
  var self = this.ptr;
  if (newState && typeof newState === 'object') newState = newState.ptr;
  _emscripten_bind_btCollisionObject_setActivationState_1(self, newState);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['forceActivationState'] = btCollisionObject.prototype.forceActivationState = function(newState) {
  var self = this.ptr;
  if (newState && typeof newState === 'object') newState = newState.ptr;
  _emscripten_bind_btCollisionObject_forceActivationState_1(self, newState);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['activate'] = btCollisionObject.prototype.activate = function(forceActivation) {
  var self = this.ptr;
  if (forceActivation && typeof forceActivation === 'object') forceActivation = forceActivation.ptr;
  if (forceActivation === undefined) { _emscripten_bind_btCollisionObject_activate_0(self); return }
  _emscripten_bind_btCollisionObject_activate_1(self, forceActivation);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['isActive'] = btCollisionObject.prototype.isActive = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btCollisionObject_isActive_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['isKinematicObject'] = btCollisionObject.prototype.isKinematicObject = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btCollisionObject_isKinematicObject_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['isStaticObject'] = btCollisionObject.prototype.isStaticObject = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btCollisionObject_isStaticObject_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['isStaticOrKinematicObject'] = btCollisionObject.prototype.isStaticOrKinematicObject = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btCollisionObject_isStaticOrKinematicObject_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['getRestitution'] = btCollisionObject.prototype.getRestitution = function() {
  var self = this.ptr;
  return _emscripten_bind_btCollisionObject_getRestitution_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['getFriction'] = btCollisionObject.prototype.getFriction = function() {
  var self = this.ptr;
  return _emscripten_bind_btCollisionObject_getFriction_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['getRollingFriction'] = btCollisionObject.prototype.getRollingFriction = function() {
  var self = this.ptr;
  return _emscripten_bind_btCollisionObject_getRollingFriction_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['setRestitution'] = btCollisionObject.prototype.setRestitution = function(rest) {
  var self = this.ptr;
  if (rest && typeof rest === 'object') rest = rest.ptr;
  _emscripten_bind_btCollisionObject_setRestitution_1(self, rest);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['setFriction'] = btCollisionObject.prototype.setFriction = function(frict) {
  var self = this.ptr;
  if (frict && typeof frict === 'object') frict = frict.ptr;
  _emscripten_bind_btCollisionObject_setFriction_1(self, frict);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['setRollingFriction'] = btCollisionObject.prototype.setRollingFriction = function(frict) {
  var self = this.ptr;
  if (frict && typeof frict === 'object') frict = frict.ptr;
  _emscripten_bind_btCollisionObject_setRollingFriction_1(self, frict);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['getWorldTransform'] = btCollisionObject.prototype.getWorldTransform = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionObject_getWorldTransform_0(self), btTransform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['getCollisionFlags'] = btCollisionObject.prototype.getCollisionFlags = function() {
  var self = this.ptr;
  return _emscripten_bind_btCollisionObject_getCollisionFlags_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['setCollisionFlags'] = btCollisionObject.prototype.setCollisionFlags = function(flags) {
  var self = this.ptr;
  if (flags && typeof flags === 'object') flags = flags.ptr;
  _emscripten_bind_btCollisionObject_setCollisionFlags_1(self, flags);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['setWorldTransform'] = btCollisionObject.prototype.setWorldTransform = function(worldTrans) {
  var self = this.ptr;
  if (worldTrans && typeof worldTrans === 'object') worldTrans = worldTrans.ptr;
  _emscripten_bind_btCollisionObject_setWorldTransform_1(self, worldTrans);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['setCollisionShape'] = btCollisionObject.prototype.setCollisionShape = function(collisionShape) {
  var self = this.ptr;
  if (collisionShape && typeof collisionShape === 'object') collisionShape = collisionShape.ptr;
  _emscripten_bind_btCollisionObject_setCollisionShape_1(self, collisionShape);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['setCcdMotionThreshold'] = btCollisionObject.prototype.setCcdMotionThreshold = function(ccdMotionThreshold) {
  var self = this.ptr;
  if (ccdMotionThreshold && typeof ccdMotionThreshold === 'object') ccdMotionThreshold = ccdMotionThreshold.ptr;
  _emscripten_bind_btCollisionObject_setCcdMotionThreshold_1(self, ccdMotionThreshold);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['setCcdSweptSphereRadius'] = btCollisionObject.prototype.setCcdSweptSphereRadius = function(radius) {
  var self = this.ptr;
  if (radius && typeof radius === 'object') radius = radius.ptr;
  _emscripten_bind_btCollisionObject_setCcdSweptSphereRadius_1(self, radius);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['getUserIndex'] = btCollisionObject.prototype.getUserIndex = function() {
  var self = this.ptr;
  return _emscripten_bind_btCollisionObject_getUserIndex_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['setUserIndex'] = btCollisionObject.prototype.setUserIndex = function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  _emscripten_bind_btCollisionObject_setUserIndex_1(self, index);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['getUserPointer'] = btCollisionObject.prototype.getUserPointer = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionObject_getUserPointer_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['setUserPointer'] = btCollisionObject.prototype.setUserPointer = function(userPointer) {
  var self = this.ptr;
  if (userPointer && typeof userPointer === 'object') userPointer = userPointer.ptr;
  _emscripten_bind_btCollisionObject_setUserPointer_1(self, userPointer);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['getBroadphaseHandle'] = btCollisionObject.prototype.getBroadphaseHandle = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionObject_getBroadphaseHandle_0(self), btBroadphaseProxy);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObject.prototype['__destroy__'] = btCollisionObject.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCollisionObject___destroy___0(self);
};

// Interface: btConcaveShape

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btConcaveShape() { throw "cannot construct a btConcaveShape, no constructor in IDL" }
btConcaveShape.prototype = Object.create(btCollisionShape.prototype);
btConcaveShape.prototype.constructor = btConcaveShape;
btConcaveShape.prototype.__class__ = btConcaveShape;
btConcaveShape.__cache__ = {};
Module['btConcaveShape'] = btConcaveShape;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btConcaveShape.prototype['setLocalScaling'] = btConcaveShape.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btConcaveShape_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConcaveShape.prototype['getLocalScaling'] = btConcaveShape.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btConcaveShape_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConcaveShape.prototype['calculateLocalInertia'] = btConcaveShape.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btConcaveShape_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btConcaveShape.prototype['__destroy__'] = btConcaveShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConcaveShape___destroy___0(self);
};

// Interface: btCollisionAlgorithm

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btCollisionAlgorithm() { throw "cannot construct a btCollisionAlgorithm, no constructor in IDL" }
btCollisionAlgorithm.prototype = Object.create(WrapperObject.prototype);
btCollisionAlgorithm.prototype.constructor = btCollisionAlgorithm;
btCollisionAlgorithm.prototype.__class__ = btCollisionAlgorithm;
btCollisionAlgorithm.__cache__ = {};
Module['btCollisionAlgorithm'] = btCollisionAlgorithm;

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionAlgorithm.prototype['__destroy__'] = btCollisionAlgorithm.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCollisionAlgorithm___destroy___0(self);
};

// Interface: btTypedConstraint

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btTypedConstraint() { throw "cannot construct a btTypedConstraint, no constructor in IDL" }
btTypedConstraint.prototype = Object.create(WrapperObject.prototype);
btTypedConstraint.prototype.constructor = btTypedConstraint;
btTypedConstraint.prototype.__class__ = btTypedConstraint;
btTypedConstraint.__cache__ = {};
Module['btTypedConstraint'] = btTypedConstraint;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btTypedConstraint.prototype['enableFeedback'] = btTypedConstraint.prototype.enableFeedback = function(needsFeedback) {
  var self = this.ptr;
  if (needsFeedback && typeof needsFeedback === 'object') needsFeedback = needsFeedback.ptr;
  _emscripten_bind_btTypedConstraint_enableFeedback_1(self, needsFeedback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btTypedConstraint.prototype['getBreakingImpulseThreshold'] = btTypedConstraint.prototype.getBreakingImpulseThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btTypedConstraint_getBreakingImpulseThreshold_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btTypedConstraint.prototype['setBreakingImpulseThreshold'] = btTypedConstraint.prototype.setBreakingImpulseThreshold = function(threshold) {
  var self = this.ptr;
  if (threshold && typeof threshold === 'object') threshold = threshold.ptr;
  _emscripten_bind_btTypedConstraint_setBreakingImpulseThreshold_1(self, threshold);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btTypedConstraint.prototype['getParam'] = btTypedConstraint.prototype.getParam = function(num, axis) {
  var self = this.ptr;
  if (num && typeof num === 'object') num = num.ptr;
  if (axis && typeof axis === 'object') axis = axis.ptr;
  return _emscripten_bind_btTypedConstraint_getParam_2(self, num, axis);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btTypedConstraint.prototype['setParam'] = btTypedConstraint.prototype.setParam = function(num, value, axis) {
  var self = this.ptr;
  if (num && typeof num === 'object') num = num.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  if (axis && typeof axis === 'object') axis = axis.ptr;
  _emscripten_bind_btTypedConstraint_setParam_3(self, num, value, axis);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btTypedConstraint.prototype['__destroy__'] = btTypedConstraint.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btTypedConstraint___destroy___0(self);
};

// Interface: btDynamicsWorld

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btDynamicsWorld() { throw "cannot construct a btDynamicsWorld, no constructor in IDL" }
btDynamicsWorld.prototype = Object.create(btCollisionWorld.prototype);
btDynamicsWorld.prototype.constructor = btDynamicsWorld;
btDynamicsWorld.prototype.__class__ = btDynamicsWorld;
btDynamicsWorld.__cache__ = {};
Module['btDynamicsWorld'] = btDynamicsWorld;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['addAction'] = btDynamicsWorld.prototype.addAction = function(action) {
  var self = this.ptr;
  if (action && typeof action === 'object') action = action.ptr;
  _emscripten_bind_btDynamicsWorld_addAction_1(self, action);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['removeAction'] = btDynamicsWorld.prototype.removeAction = function(action) {
  var self = this.ptr;
  if (action && typeof action === 'object') action = action.ptr;
  _emscripten_bind_btDynamicsWorld_removeAction_1(self, action);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['getSolverInfo'] = btDynamicsWorld.prototype.getSolverInfo = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDynamicsWorld_getSolverInfo_0(self), btContactSolverInfo);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['setInternalTickCallback'] = btDynamicsWorld.prototype.setInternalTickCallback = function(cb, worldUserInfo, isPreTick) {
  var self = this.ptr;
  if (cb && typeof cb === 'object') cb = cb.ptr;
  if (worldUserInfo && typeof worldUserInfo === 'object') worldUserInfo = worldUserInfo.ptr;
  if (isPreTick && typeof isPreTick === 'object') isPreTick = isPreTick.ptr;
  if (worldUserInfo === undefined) { _emscripten_bind_btDynamicsWorld_setInternalTickCallback_1(self, cb); return }
  if (isPreTick === undefined) { _emscripten_bind_btDynamicsWorld_setInternalTickCallback_2(self, cb, worldUserInfo); return }
  _emscripten_bind_btDynamicsWorld_setInternalTickCallback_3(self, cb, worldUserInfo, isPreTick);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['getDispatcher'] = btDynamicsWorld.prototype.getDispatcher = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDynamicsWorld_getDispatcher_0(self), btDispatcher);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['rayTest'] = btDynamicsWorld.prototype.rayTest = function(rayFromWorld, rayToWorld, resultCallback) {
  var self = this.ptr;
  if (rayFromWorld && typeof rayFromWorld === 'object') rayFromWorld = rayFromWorld.ptr;
  if (rayToWorld && typeof rayToWorld === 'object') rayToWorld = rayToWorld.ptr;
  if (resultCallback && typeof resultCallback === 'object') resultCallback = resultCallback.ptr;
  _emscripten_bind_btDynamicsWorld_rayTest_3(self, rayFromWorld, rayToWorld, resultCallback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['getPairCache'] = btDynamicsWorld.prototype.getPairCache = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDynamicsWorld_getPairCache_0(self), btOverlappingPairCache);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['getDispatchInfo'] = btDynamicsWorld.prototype.getDispatchInfo = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDynamicsWorld_getDispatchInfo_0(self), btDispatcherInfo);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['addCollisionObject'] = btDynamicsWorld.prototype.addCollisionObject = function(collisionObject, collisionFilterGroup, collisionFilterMask) {
  var self = this.ptr;
  if (collisionObject && typeof collisionObject === 'object') collisionObject = collisionObject.ptr;
  if (collisionFilterGroup && typeof collisionFilterGroup === 'object') collisionFilterGroup = collisionFilterGroup.ptr;
  if (collisionFilterMask && typeof collisionFilterMask === 'object') collisionFilterMask = collisionFilterMask.ptr;
  if (collisionFilterGroup === undefined) { _emscripten_bind_btDynamicsWorld_addCollisionObject_1(self, collisionObject); return }
  if (collisionFilterMask === undefined) { _emscripten_bind_btDynamicsWorld_addCollisionObject_2(self, collisionObject, collisionFilterGroup); return }
  _emscripten_bind_btDynamicsWorld_addCollisionObject_3(self, collisionObject, collisionFilterGroup, collisionFilterMask);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['removeCollisionObject'] = btDynamicsWorld.prototype.removeCollisionObject = function(collisionObject) {
  var self = this.ptr;
  if (collisionObject && typeof collisionObject === 'object') collisionObject = collisionObject.ptr;
  _emscripten_bind_btDynamicsWorld_removeCollisionObject_1(self, collisionObject);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['getBroadphase'] = btDynamicsWorld.prototype.getBroadphase = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDynamicsWorld_getBroadphase_0(self), btBroadphaseInterface);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['convexSweepTest'] = btDynamicsWorld.prototype.convexSweepTest = function(castShape, from, to, resultCallback, allowedCcdPenetration) {
  var self = this.ptr;
  if (castShape && typeof castShape === 'object') castShape = castShape.ptr;
  if (from && typeof from === 'object') from = from.ptr;
  if (to && typeof to === 'object') to = to.ptr;
  if (resultCallback && typeof resultCallback === 'object') resultCallback = resultCallback.ptr;
  if (allowedCcdPenetration && typeof allowedCcdPenetration === 'object') allowedCcdPenetration = allowedCcdPenetration.ptr;
  _emscripten_bind_btDynamicsWorld_convexSweepTest_5(self, castShape, from, to, resultCallback, allowedCcdPenetration);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['contactPairTest'] = btDynamicsWorld.prototype.contactPairTest = function(colObjA, colObjB, resultCallback) {
  var self = this.ptr;
  if (colObjA && typeof colObjA === 'object') colObjA = colObjA.ptr;
  if (colObjB && typeof colObjB === 'object') colObjB = colObjB.ptr;
  if (resultCallback && typeof resultCallback === 'object') resultCallback = resultCallback.ptr;
  _emscripten_bind_btDynamicsWorld_contactPairTest_3(self, colObjA, colObjB, resultCallback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['contactTest'] = btDynamicsWorld.prototype.contactTest = function(colObj, resultCallback) {
  var self = this.ptr;
  if (colObj && typeof colObj === 'object') colObj = colObj.ptr;
  if (resultCallback && typeof resultCallback === 'object') resultCallback = resultCallback.ptr;
  _emscripten_bind_btDynamicsWorld_contactTest_2(self, colObj, resultCallback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['setForceUpdateAllAabbs'] = btDynamicsWorld.prototype.setForceUpdateAllAabbs = function(forceUpdateAllAabbs) {
  var self = this.ptr;
  if (forceUpdateAllAabbs && typeof forceUpdateAllAabbs === 'object') forceUpdateAllAabbs = forceUpdateAllAabbs.ptr;
  _emscripten_bind_btDynamicsWorld_setForceUpdateAllAabbs_1(self, forceUpdateAllAabbs);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['updateSingleAabb'] = btDynamicsWorld.prototype.updateSingleAabb = function(colObj) {
  var self = this.ptr;
  if (colObj && typeof colObj === 'object') colObj = colObj.ptr;
  _emscripten_bind_btDynamicsWorld_updateSingleAabb_1(self, colObj);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['setDebugDrawer'] = btDynamicsWorld.prototype.setDebugDrawer = function(debugDrawer) {
  var self = this.ptr;
  if (debugDrawer && typeof debugDrawer === 'object') debugDrawer = debugDrawer.ptr;
  _emscripten_bind_btDynamicsWorld_setDebugDrawer_1(self, debugDrawer);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['getDebugDrawer'] = btDynamicsWorld.prototype.getDebugDrawer = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDynamicsWorld_getDebugDrawer_0(self), btIDebugDraw);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['debugDrawWorld'] = btDynamicsWorld.prototype.debugDrawWorld = function() {
  var self = this.ptr;
  _emscripten_bind_btDynamicsWorld_debugDrawWorld_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['debugDrawObject'] = btDynamicsWorld.prototype.debugDrawObject = function(worldTransform, shape, color) {
  var self = this.ptr;
  if (worldTransform && typeof worldTransform === 'object') worldTransform = worldTransform.ptr;
  if (shape && typeof shape === 'object') shape = shape.ptr;
  if (color && typeof color === 'object') color = color.ptr;
  _emscripten_bind_btDynamicsWorld_debugDrawObject_3(self, worldTransform, shape, color);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btDynamicsWorld.prototype['__destroy__'] = btDynamicsWorld.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btDynamicsWorld___destroy___0(self);
};

// Interface: btIDebugDraw

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btIDebugDraw() { throw "cannot construct a btIDebugDraw, no constructor in IDL" }
btIDebugDraw.prototype = Object.create(WrapperObject.prototype);
btIDebugDraw.prototype.constructor = btIDebugDraw;
btIDebugDraw.prototype.__class__ = btIDebugDraw;
btIDebugDraw.__cache__ = {};
Module['btIDebugDraw'] = btIDebugDraw;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btIDebugDraw.prototype['drawLine'] = btIDebugDraw.prototype.drawLine = function(from, to, color) {
  var self = this.ptr;
  if (from && typeof from === 'object') from = from.ptr;
  if (to && typeof to === 'object') to = to.ptr;
  if (color && typeof color === 'object') color = color.ptr;
  _emscripten_bind_btIDebugDraw_drawLine_3(self, from, to, color);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btIDebugDraw.prototype['drawContactPoint'] = btIDebugDraw.prototype.drawContactPoint = function(pointOnB, normalOnB, distance, lifeTime, color) {
  var self = this.ptr;
  if (pointOnB && typeof pointOnB === 'object') pointOnB = pointOnB.ptr;
  if (normalOnB && typeof normalOnB === 'object') normalOnB = normalOnB.ptr;
  if (distance && typeof distance === 'object') distance = distance.ptr;
  if (lifeTime && typeof lifeTime === 'object') lifeTime = lifeTime.ptr;
  if (color && typeof color === 'object') color = color.ptr;
  _emscripten_bind_btIDebugDraw_drawContactPoint_5(self, pointOnB, normalOnB, distance, lifeTime, color);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btIDebugDraw.prototype['reportErrorWarning'] = btIDebugDraw.prototype.reportErrorWarning = function(warningString) {
  var self = this.ptr;
  ensureCache.prepare();
  if (warningString && typeof warningString === 'object') warningString = warningString.ptr;
  else warningString = ensureString(warningString);
  _emscripten_bind_btIDebugDraw_reportErrorWarning_1(self, warningString);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btIDebugDraw.prototype['draw3dText'] = btIDebugDraw.prototype.draw3dText = function(location, textString) {
  var self = this.ptr;
  ensureCache.prepare();
  if (location && typeof location === 'object') location = location.ptr;
  if (textString && typeof textString === 'object') textString = textString.ptr;
  else textString = ensureString(textString);
  _emscripten_bind_btIDebugDraw_draw3dText_2(self, location, textString);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btIDebugDraw.prototype['setDebugMode'] = btIDebugDraw.prototype.setDebugMode = function(debugMode) {
  var self = this.ptr;
  if (debugMode && typeof debugMode === 'object') debugMode = debugMode.ptr;
  _emscripten_bind_btIDebugDraw_setDebugMode_1(self, debugMode);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btIDebugDraw.prototype['getDebugMode'] = btIDebugDraw.prototype.getDebugMode = function() {
  var self = this.ptr;
  return _emscripten_bind_btIDebugDraw_getDebugMode_0(self);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btIDebugDraw.prototype['__destroy__'] = btIDebugDraw.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btIDebugDraw___destroy___0(self);
};

// Interface: btVector3

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btVector3(x, y, z) {
  if (x && typeof x === 'object') x = x.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  if (z && typeof z === 'object') z = z.ptr;
  if (x === undefined) { this.ptr = _emscripten_bind_btVector3_btVector3_0(); getCache(btVector3)[this.ptr] = this;return }
  if (y === undefined) { this.ptr = _emscripten_bind_btVector3_btVector3_1(x); getCache(btVector3)[this.ptr] = this;return }
  if (z === undefined) { this.ptr = _emscripten_bind_btVector3_btVector3_2(x, y); getCache(btVector3)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btVector3_btVector3_3(x, y, z);
  getCache(btVector3)[this.ptr] = this;
};

btVector3.prototype = Object.create(WrapperObject.prototype);
btVector3.prototype.constructor = btVector3;
btVector3.prototype.__class__ = btVector3;
btVector3.__cache__ = {};
Module['btVector3'] = btVector3;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector3.prototype['length'] = btVector3.prototype.length = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector3_length_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector3.prototype['length2'] = btVector3.prototype.length2 = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector3_length2_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector3.prototype['x'] = btVector3.prototype.x = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector3_x_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector3.prototype['y'] = btVector3.prototype.y = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector3_y_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector3.prototype['z'] = btVector3.prototype.z = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector3_z_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector3.prototype['setX'] = btVector3.prototype.setX = function(x) {
  var self = this.ptr;
  if (x && typeof x === 'object') x = x.ptr;
  _emscripten_bind_btVector3_setX_1(self, x);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector3.prototype['setY'] = btVector3.prototype.setY = function(y) {
  var self = this.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  _emscripten_bind_btVector3_setY_1(self, y);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector3.prototype['setZ'] = btVector3.prototype.setZ = function(z) {
  var self = this.ptr;
  if (z && typeof z === 'object') z = z.ptr;
  _emscripten_bind_btVector3_setZ_1(self, z);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector3.prototype['setValue'] = btVector3.prototype.setValue = function(x, y, z) {
  var self = this.ptr;
  if (x && typeof x === 'object') x = x.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  if (z && typeof z === 'object') z = z.ptr;
  _emscripten_bind_btVector3_setValue_3(self, x, y, z);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector3.prototype['normalize'] = btVector3.prototype.normalize = function() {
  var self = this.ptr;
  _emscripten_bind_btVector3_normalize_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector3.prototype['rotate'] = btVector3.prototype.rotate = function(wAxis, angle) {
  var self = this.ptr;
  if (wAxis && typeof wAxis === 'object') wAxis = wAxis.ptr;
  if (angle && typeof angle === 'object') angle = angle.ptr;
  return wrapPointer(_emscripten_bind_btVector3_rotate_2(self, wAxis, angle), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector3.prototype['dot'] = btVector3.prototype.dot = function(v) {
  var self = this.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  return _emscripten_bind_btVector3_dot_1(self, v);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector3.prototype['op_mul'] = btVector3.prototype.op_mul = function(x) {
  var self = this.ptr;
  if (x && typeof x === 'object') x = x.ptr;
  return wrapPointer(_emscripten_bind_btVector3_op_mul_1(self, x), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector3.prototype['op_add'] = btVector3.prototype.op_add = function(v) {
  var self = this.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  return wrapPointer(_emscripten_bind_btVector3_op_add_1(self, v), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector3.prototype['op_sub'] = btVector3.prototype.op_sub = function(v) {
  var self = this.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  return wrapPointer(_emscripten_bind_btVector3_op_sub_1(self, v), btVector3);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector3.prototype['__destroy__'] = btVector3.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btVector3___destroy___0(self);
};

// Interface: btQuadWord

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btQuadWord() { throw "cannot construct a btQuadWord, no constructor in IDL" }
btQuadWord.prototype = Object.create(WrapperObject.prototype);
btQuadWord.prototype.constructor = btQuadWord;
btQuadWord.prototype.__class__ = btQuadWord;
btQuadWord.__cache__ = {};
Module['btQuadWord'] = btQuadWord;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuadWord.prototype['x'] = btQuadWord.prototype.x = function() {
  var self = this.ptr;
  return _emscripten_bind_btQuadWord_x_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuadWord.prototype['y'] = btQuadWord.prototype.y = function() {
  var self = this.ptr;
  return _emscripten_bind_btQuadWord_y_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuadWord.prototype['z'] = btQuadWord.prototype.z = function() {
  var self = this.ptr;
  return _emscripten_bind_btQuadWord_z_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuadWord.prototype['w'] = btQuadWord.prototype.w = function() {
  var self = this.ptr;
  return _emscripten_bind_btQuadWord_w_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuadWord.prototype['setX'] = btQuadWord.prototype.setX = function(x) {
  var self = this.ptr;
  if (x && typeof x === 'object') x = x.ptr;
  _emscripten_bind_btQuadWord_setX_1(self, x);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuadWord.prototype['setY'] = btQuadWord.prototype.setY = function(y) {
  var self = this.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  _emscripten_bind_btQuadWord_setY_1(self, y);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuadWord.prototype['setZ'] = btQuadWord.prototype.setZ = function(z) {
  var self = this.ptr;
  if (z && typeof z === 'object') z = z.ptr;
  _emscripten_bind_btQuadWord_setZ_1(self, z);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuadWord.prototype['setW'] = btQuadWord.prototype.setW = function(w) {
  var self = this.ptr;
  if (w && typeof w === 'object') w = w.ptr;
  _emscripten_bind_btQuadWord_setW_1(self, w);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuadWord.prototype['__destroy__'] = btQuadWord.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btQuadWord___destroy___0(self);
};

// Interface: btMotionState

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btMotionState() { throw "cannot construct a btMotionState, no constructor in IDL" }
btMotionState.prototype = Object.create(WrapperObject.prototype);
btMotionState.prototype.constructor = btMotionState;
btMotionState.prototype.__class__ = btMotionState;
btMotionState.__cache__ = {};
Module['btMotionState'] = btMotionState;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btMotionState.prototype['getWorldTransform'] = btMotionState.prototype.getWorldTransform = function(worldTrans) {
  var self = this.ptr;
  if (worldTrans && typeof worldTrans === 'object') worldTrans = worldTrans.ptr;
  _emscripten_bind_btMotionState_getWorldTransform_1(self, worldTrans);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btMotionState.prototype['setWorldTransform'] = btMotionState.prototype.setWorldTransform = function(worldTrans) {
  var self = this.ptr;
  if (worldTrans && typeof worldTrans === 'object') worldTrans = worldTrans.ptr;
  _emscripten_bind_btMotionState_setWorldTransform_1(self, worldTrans);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btMotionState.prototype['__destroy__'] = btMotionState.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btMotionState___destroy___0(self);
};

// Interface: RayResultCallback

/** @suppress {undefinedVars, duplicate} @this{Object} */
function RayResultCallback() { throw "cannot construct a RayResultCallback, no constructor in IDL" }
RayResultCallback.prototype = Object.create(WrapperObject.prototype);
RayResultCallback.prototype.constructor = RayResultCallback;
RayResultCallback.prototype.__class__ = RayResultCallback;
RayResultCallback.__cache__ = {};
Module['RayResultCallback'] = RayResultCallback;
/** @suppress {undefinedVars, duplicate} @this{Object} */
RayResultCallback.prototype['hasHit'] = RayResultCallback.prototype.hasHit = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_RayResultCallback_hasHit_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
RayResultCallback.prototype['get_m_collisionFilterGroup'] = RayResultCallback.prototype.get_m_collisionFilterGroup = function() {
  var self = this.ptr;
  return _emscripten_bind_RayResultCallback_get_m_collisionFilterGroup_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
RayResultCallback.prototype['set_m_collisionFilterGroup'] = RayResultCallback.prototype.set_m_collisionFilterGroup = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RayResultCallback_set_m_collisionFilterGroup_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(RayResultCallback.prototype, 'm_collisionFilterGroup', { get: RayResultCallback.prototype.get_m_collisionFilterGroup, set: RayResultCallback.prototype.set_m_collisionFilterGroup });
/** @suppress {undefinedVars, duplicate} @this{Object} */
RayResultCallback.prototype['get_m_collisionFilterMask'] = RayResultCallback.prototype.get_m_collisionFilterMask = function() {
  var self = this.ptr;
  return _emscripten_bind_RayResultCallback_get_m_collisionFilterMask_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
RayResultCallback.prototype['set_m_collisionFilterMask'] = RayResultCallback.prototype.set_m_collisionFilterMask = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RayResultCallback_set_m_collisionFilterMask_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(RayResultCallback.prototype, 'm_collisionFilterMask', { get: RayResultCallback.prototype.get_m_collisionFilterMask, set: RayResultCallback.prototype.set_m_collisionFilterMask });
/** @suppress {undefinedVars, duplicate} @this{Object} */
RayResultCallback.prototype['get_m_closestHitFraction'] = RayResultCallback.prototype.get_m_closestHitFraction = function() {
  var self = this.ptr;
  return _emscripten_bind_RayResultCallback_get_m_closestHitFraction_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
RayResultCallback.prototype['set_m_closestHitFraction'] = RayResultCallback.prototype.set_m_closestHitFraction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RayResultCallback_set_m_closestHitFraction_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(RayResultCallback.prototype, 'm_closestHitFraction', { get: RayResultCallback.prototype.get_m_closestHitFraction, set: RayResultCallback.prototype.set_m_closestHitFraction });
/** @suppress {undefinedVars, duplicate} @this{Object} */
RayResultCallback.prototype['get_m_collisionObject'] = RayResultCallback.prototype.get_m_collisionObject = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RayResultCallback_get_m_collisionObject_0(self), btCollisionObject);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
RayResultCallback.prototype['set_m_collisionObject'] = RayResultCallback.prototype.set_m_collisionObject = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RayResultCallback_set_m_collisionObject_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(RayResultCallback.prototype, 'm_collisionObject', { get: RayResultCallback.prototype.get_m_collisionObject, set: RayResultCallback.prototype.set_m_collisionObject });
/** @suppress {undefinedVars, duplicate} @this{Object} */
RayResultCallback.prototype['get_m_flags'] = RayResultCallback.prototype.get_m_flags = function() {
  var self = this.ptr;
  return _emscripten_bind_RayResultCallback_get_m_flags_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
RayResultCallback.prototype['set_m_flags'] = RayResultCallback.prototype.set_m_flags = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RayResultCallback_set_m_flags_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(RayResultCallback.prototype, 'm_flags', { get: RayResultCallback.prototype.get_m_flags, set: RayResultCallback.prototype.set_m_flags });

/** @suppress {undefinedVars, duplicate} @this{Object} */
RayResultCallback.prototype['__destroy__'] = RayResultCallback.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_RayResultCallback___destroy___0(self);
};

// Interface: ContactResultCallback

/** @suppress {undefinedVars, duplicate} @this{Object} */
function ContactResultCallback() { throw "cannot construct a ContactResultCallback, no constructor in IDL" }
ContactResultCallback.prototype = Object.create(WrapperObject.prototype);
ContactResultCallback.prototype.constructor = ContactResultCallback;
ContactResultCallback.prototype.__class__ = ContactResultCallback;
ContactResultCallback.__cache__ = {};
Module['ContactResultCallback'] = ContactResultCallback;
/** @suppress {undefinedVars, duplicate} @this{Object} */
ContactResultCallback.prototype['addSingleResult'] = ContactResultCallback.prototype.addSingleResult = function(cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1) {
  var self = this.ptr;
  if (cp && typeof cp === 'object') cp = cp.ptr;
  if (colObj0Wrap && typeof colObj0Wrap === 'object') colObj0Wrap = colObj0Wrap.ptr;
  if (partId0 && typeof partId0 === 'object') partId0 = partId0.ptr;
  if (index0 && typeof index0 === 'object') index0 = index0.ptr;
  if (colObj1Wrap && typeof colObj1Wrap === 'object') colObj1Wrap = colObj1Wrap.ptr;
  if (partId1 && typeof partId1 === 'object') partId1 = partId1.ptr;
  if (index1 && typeof index1 === 'object') index1 = index1.ptr;
  return _emscripten_bind_ContactResultCallback_addSingleResult_7(self, cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
ContactResultCallback.prototype['__destroy__'] = ContactResultCallback.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_ContactResultCallback___destroy___0(self);
};

// Interface: ConvexResultCallback

/** @suppress {undefinedVars, duplicate} @this{Object} */
function ConvexResultCallback() { throw "cannot construct a ConvexResultCallback, no constructor in IDL" }
ConvexResultCallback.prototype = Object.create(WrapperObject.prototype);
ConvexResultCallback.prototype.constructor = ConvexResultCallback;
ConvexResultCallback.prototype.__class__ = ConvexResultCallback;
ConvexResultCallback.__cache__ = {};
Module['ConvexResultCallback'] = ConvexResultCallback;
/** @suppress {undefinedVars, duplicate} @this{Object} */
ConvexResultCallback.prototype['hasHit'] = ConvexResultCallback.prototype.hasHit = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_ConvexResultCallback_hasHit_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ConvexResultCallback.prototype['get_m_collisionFilterGroup'] = ConvexResultCallback.prototype.get_m_collisionFilterGroup = function() {
  var self = this.ptr;
  return _emscripten_bind_ConvexResultCallback_get_m_collisionFilterGroup_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ConvexResultCallback.prototype['set_m_collisionFilterGroup'] = ConvexResultCallback.prototype.set_m_collisionFilterGroup = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ConvexResultCallback_set_m_collisionFilterGroup_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ConvexResultCallback.prototype, 'm_collisionFilterGroup', { get: ConvexResultCallback.prototype.get_m_collisionFilterGroup, set: ConvexResultCallback.prototype.set_m_collisionFilterGroup });
/** @suppress {undefinedVars, duplicate} @this{Object} */
ConvexResultCallback.prototype['get_m_collisionFilterMask'] = ConvexResultCallback.prototype.get_m_collisionFilterMask = function() {
  var self = this.ptr;
  return _emscripten_bind_ConvexResultCallback_get_m_collisionFilterMask_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ConvexResultCallback.prototype['set_m_collisionFilterMask'] = ConvexResultCallback.prototype.set_m_collisionFilterMask = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ConvexResultCallback_set_m_collisionFilterMask_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ConvexResultCallback.prototype, 'm_collisionFilterMask', { get: ConvexResultCallback.prototype.get_m_collisionFilterMask, set: ConvexResultCallback.prototype.set_m_collisionFilterMask });
/** @suppress {undefinedVars, duplicate} @this{Object} */
ConvexResultCallback.prototype['get_m_closestHitFraction'] = ConvexResultCallback.prototype.get_m_closestHitFraction = function() {
  var self = this.ptr;
  return _emscripten_bind_ConvexResultCallback_get_m_closestHitFraction_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ConvexResultCallback.prototype['set_m_closestHitFraction'] = ConvexResultCallback.prototype.set_m_closestHitFraction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ConvexResultCallback_set_m_closestHitFraction_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ConvexResultCallback.prototype, 'm_closestHitFraction', { get: ConvexResultCallback.prototype.get_m_closestHitFraction, set: ConvexResultCallback.prototype.set_m_closestHitFraction });

/** @suppress {undefinedVars, duplicate} @this{Object} */
ConvexResultCallback.prototype['__destroy__'] = ConvexResultCallback.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_ConvexResultCallback___destroy___0(self);
};

// Interface: btConvexShape

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btConvexShape() { throw "cannot construct a btConvexShape, no constructor in IDL" }
btConvexShape.prototype = Object.create(btCollisionShape.prototype);
btConvexShape.prototype.constructor = btConvexShape;
btConvexShape.prototype.__class__ = btConvexShape;
btConvexShape.__cache__ = {};
Module['btConvexShape'] = btConvexShape;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexShape.prototype['setLocalScaling'] = btConvexShape.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btConvexShape_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexShape.prototype['getLocalScaling'] = btConvexShape.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btConvexShape_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexShape.prototype['calculateLocalInertia'] = btConvexShape.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btConvexShape_calculateLocalInertia_2(self, mass, inertia);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexShape.prototype['setMargin'] = btConvexShape.prototype.setMargin = function(margin) {
  var self = this.ptr;
  if (margin && typeof margin === 'object') margin = margin.ptr;
  _emscripten_bind_btConvexShape_setMargin_1(self, margin);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexShape.prototype['getMargin'] = btConvexShape.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btConvexShape_getMargin_0(self);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexShape.prototype['__destroy__'] = btConvexShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConvexShape___destroy___0(self);
};

// Interface: btCapsuleShape

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btCapsuleShape(radius, height) {
  if (radius && typeof radius === 'object') radius = radius.ptr;
  if (height && typeof height === 'object') height = height.ptr;
  this.ptr = _emscripten_bind_btCapsuleShape_btCapsuleShape_2(radius, height);
  getCache(btCapsuleShape)[this.ptr] = this;
};

btCapsuleShape.prototype = Object.create(btCollisionShape.prototype);
btCapsuleShape.prototype.constructor = btCapsuleShape;
btCapsuleShape.prototype.__class__ = btCapsuleShape;
btCapsuleShape.__cache__ = {};
Module['btCapsuleShape'] = btCapsuleShape;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShape.prototype['setMargin'] = btCapsuleShape.prototype.setMargin = function(margin) {
  var self = this.ptr;
  if (margin && typeof margin === 'object') margin = margin.ptr;
  _emscripten_bind_btCapsuleShape_setMargin_1(self, margin);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShape.prototype['getMargin'] = btCapsuleShape.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShape_getMargin_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShape.prototype['getUpAxis'] = btCapsuleShape.prototype.getUpAxis = function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShape_getUpAxis_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShape.prototype['getRadius'] = btCapsuleShape.prototype.getRadius = function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShape_getRadius_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShape.prototype['getHalfHeight'] = btCapsuleShape.prototype.getHalfHeight = function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShape_getHalfHeight_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShape.prototype['setLocalScaling'] = btCapsuleShape.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btCapsuleShape_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShape.prototype['getLocalScaling'] = btCapsuleShape.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCapsuleShape_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShape.prototype['calculateLocalInertia'] = btCapsuleShape.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btCapsuleShape_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShape.prototype['__destroy__'] = btCapsuleShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCapsuleShape___destroy___0(self);
};

// Interface: btCylinderShape

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btCylinderShape(halfExtents) {
  if (halfExtents && typeof halfExtents === 'object') halfExtents = halfExtents.ptr;
  this.ptr = _emscripten_bind_btCylinderShape_btCylinderShape_1(halfExtents);
  getCache(btCylinderShape)[this.ptr] = this;
};

btCylinderShape.prototype = Object.create(btCollisionShape.prototype);
btCylinderShape.prototype.constructor = btCylinderShape;
btCylinderShape.prototype.__class__ = btCylinderShape;
btCylinderShape.__cache__ = {};
Module['btCylinderShape'] = btCylinderShape;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btCylinderShape.prototype['setMargin'] = btCylinderShape.prototype.setMargin = function(margin) {
  var self = this.ptr;
  if (margin && typeof margin === 'object') margin = margin.ptr;
  _emscripten_bind_btCylinderShape_setMargin_1(self, margin);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCylinderShape.prototype['getMargin'] = btCylinderShape.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btCylinderShape_getMargin_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCylinderShape.prototype['setLocalScaling'] = btCylinderShape.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btCylinderShape_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCylinderShape.prototype['getLocalScaling'] = btCylinderShape.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCylinderShape_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCylinderShape.prototype['calculateLocalInertia'] = btCylinderShape.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btCylinderShape_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btCylinderShape.prototype['__destroy__'] = btCylinderShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCylinderShape___destroy___0(self);
};

// Interface: btConeShape

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btConeShape(radius, height) {
  if (radius && typeof radius === 'object') radius = radius.ptr;
  if (height && typeof height === 'object') height = height.ptr;
  this.ptr = _emscripten_bind_btConeShape_btConeShape_2(radius, height);
  getCache(btConeShape)[this.ptr] = this;
};

btConeShape.prototype = Object.create(btCollisionShape.prototype);
btConeShape.prototype.constructor = btConeShape;
btConeShape.prototype.__class__ = btConeShape;
btConeShape.__cache__ = {};
Module['btConeShape'] = btConeShape;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeShape.prototype['setLocalScaling'] = btConeShape.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btConeShape_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeShape.prototype['getLocalScaling'] = btConeShape.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btConeShape_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeShape.prototype['calculateLocalInertia'] = btConeShape.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btConeShape_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeShape.prototype['__destroy__'] = btConeShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConeShape___destroy___0(self);
};

// Interface: btStridingMeshInterface

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btStridingMeshInterface() { throw "cannot construct a btStridingMeshInterface, no constructor in IDL" }
btStridingMeshInterface.prototype = Object.create(WrapperObject.prototype);
btStridingMeshInterface.prototype.constructor = btStridingMeshInterface;
btStridingMeshInterface.prototype.__class__ = btStridingMeshInterface;
btStridingMeshInterface.__cache__ = {};
Module['btStridingMeshInterface'] = btStridingMeshInterface;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btStridingMeshInterface.prototype['setScaling'] = btStridingMeshInterface.prototype.setScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btStridingMeshInterface_setScaling_1(self, scaling);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btStridingMeshInterface.prototype['__destroy__'] = btStridingMeshInterface.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btStridingMeshInterface___destroy___0(self);
};

// Interface: btTriangleMeshShape

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btTriangleMeshShape() { throw "cannot construct a btTriangleMeshShape, no constructor in IDL" }
btTriangleMeshShape.prototype = Object.create(btConcaveShape.prototype);
btTriangleMeshShape.prototype.constructor = btTriangleMeshShape;
btTriangleMeshShape.prototype.__class__ = btTriangleMeshShape;
btTriangleMeshShape.__cache__ = {};
Module['btTriangleMeshShape'] = btTriangleMeshShape;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btTriangleMeshShape.prototype['setLocalScaling'] = btTriangleMeshShape.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btTriangleMeshShape_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btTriangleMeshShape.prototype['getLocalScaling'] = btTriangleMeshShape.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btTriangleMeshShape_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btTriangleMeshShape.prototype['calculateLocalInertia'] = btTriangleMeshShape.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btTriangleMeshShape_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btTriangleMeshShape.prototype['__destroy__'] = btTriangleMeshShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btTriangleMeshShape___destroy___0(self);
};

// Interface: btPrimitiveManagerBase

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btPrimitiveManagerBase() { throw "cannot construct a btPrimitiveManagerBase, no constructor in IDL" }
btPrimitiveManagerBase.prototype = Object.create(WrapperObject.prototype);
btPrimitiveManagerBase.prototype.constructor = btPrimitiveManagerBase;
btPrimitiveManagerBase.prototype.__class__ = btPrimitiveManagerBase;
btPrimitiveManagerBase.__cache__ = {};
Module['btPrimitiveManagerBase'] = btPrimitiveManagerBase;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btPrimitiveManagerBase.prototype['is_trimesh'] = btPrimitiveManagerBase.prototype.is_trimesh = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btPrimitiveManagerBase_is_trimesh_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPrimitiveManagerBase.prototype['get_primitive_count'] = btPrimitiveManagerBase.prototype.get_primitive_count = function() {
  var self = this.ptr;
  return _emscripten_bind_btPrimitiveManagerBase_get_primitive_count_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPrimitiveManagerBase.prototype['get_primitive_box'] = btPrimitiveManagerBase.prototype.get_primitive_box = function(prim_index, primbox) {
  var self = this.ptr;
  if (prim_index && typeof prim_index === 'object') prim_index = prim_index.ptr;
  if (primbox && typeof primbox === 'object') primbox = primbox.ptr;
  _emscripten_bind_btPrimitiveManagerBase_get_primitive_box_2(self, prim_index, primbox);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPrimitiveManagerBase.prototype['get_primitive_triangle'] = btPrimitiveManagerBase.prototype.get_primitive_triangle = function(prim_index, triangle) {
  var self = this.ptr;
  if (prim_index && typeof prim_index === 'object') prim_index = prim_index.ptr;
  if (triangle && typeof triangle === 'object') triangle = triangle.ptr;
  _emscripten_bind_btPrimitiveManagerBase_get_primitive_triangle_2(self, prim_index, triangle);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btPrimitiveManagerBase.prototype['__destroy__'] = btPrimitiveManagerBase.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btPrimitiveManagerBase___destroy___0(self);
};

// Interface: btGImpactShapeInterface

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btGImpactShapeInterface() { throw "cannot construct a btGImpactShapeInterface, no constructor in IDL" }
btGImpactShapeInterface.prototype = Object.create(btConcaveShape.prototype);
btGImpactShapeInterface.prototype.constructor = btGImpactShapeInterface;
btGImpactShapeInterface.prototype.__class__ = btGImpactShapeInterface;
btGImpactShapeInterface.__cache__ = {};
Module['btGImpactShapeInterface'] = btGImpactShapeInterface;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactShapeInterface.prototype['updateBound'] = btGImpactShapeInterface.prototype.updateBound = function() {
  var self = this.ptr;
  _emscripten_bind_btGImpactShapeInterface_updateBound_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactShapeInterface.prototype['postUpdate'] = btGImpactShapeInterface.prototype.postUpdate = function() {
  var self = this.ptr;
  _emscripten_bind_btGImpactShapeInterface_postUpdate_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactShapeInterface.prototype['getShapeType'] = btGImpactShapeInterface.prototype.getShapeType = function() {
  var self = this.ptr;
  return _emscripten_bind_btGImpactShapeInterface_getShapeType_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactShapeInterface.prototype['getName'] = btGImpactShapeInterface.prototype.getName = function() {
  var self = this.ptr;
  return UTF8ToString(_emscripten_bind_btGImpactShapeInterface_getName_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactShapeInterface.prototype['getGImpactShapeType'] = btGImpactShapeInterface.prototype.getGImpactShapeType = function() {
  var self = this.ptr;
  return _emscripten_bind_btGImpactShapeInterface_getGImpactShapeType_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactShapeInterface.prototype['getPrimitiveManager'] = btGImpactShapeInterface.prototype.getPrimitiveManager = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGImpactShapeInterface_getPrimitiveManager_0(self), btPrimitiveManagerBase);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactShapeInterface.prototype['getNumChildShapes'] = btGImpactShapeInterface.prototype.getNumChildShapes = function() {
  var self = this.ptr;
  return _emscripten_bind_btGImpactShapeInterface_getNumChildShapes_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactShapeInterface.prototype['childrenHasTransform'] = btGImpactShapeInterface.prototype.childrenHasTransform = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btGImpactShapeInterface_childrenHasTransform_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactShapeInterface.prototype['needsRetrieveTriangles'] = btGImpactShapeInterface.prototype.needsRetrieveTriangles = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btGImpactShapeInterface_needsRetrieveTriangles_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactShapeInterface.prototype['needsRetrieveTetrahedrons'] = btGImpactShapeInterface.prototype.needsRetrieveTetrahedrons = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btGImpactShapeInterface_needsRetrieveTetrahedrons_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactShapeInterface.prototype['getBulletTriangle'] = btGImpactShapeInterface.prototype.getBulletTriangle = function(prim_index, triangle) {
  var self = this.ptr;
  if (prim_index && typeof prim_index === 'object') prim_index = prim_index.ptr;
  if (triangle && typeof triangle === 'object') triangle = triangle.ptr;
  _emscripten_bind_btGImpactShapeInterface_getBulletTriangle_2(self, prim_index, triangle);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactShapeInterface.prototype['getBulletTetrahedron'] = btGImpactShapeInterface.prototype.getBulletTetrahedron = function(prim_index, tetrahedron) {
  var self = this.ptr;
  if (prim_index && typeof prim_index === 'object') prim_index = prim_index.ptr;
  if (tetrahedron && typeof tetrahedron === 'object') tetrahedron = tetrahedron.ptr;
  _emscripten_bind_btGImpactShapeInterface_getBulletTetrahedron_2(self, prim_index, tetrahedron);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactShapeInterface.prototype['getChildShape'] = btGImpactShapeInterface.prototype.getChildShape = function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_btGImpactShapeInterface_getChildShape_1(self, index), btCollisionShape);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactShapeInterface.prototype['getChildTransform'] = btGImpactShapeInterface.prototype.getChildTransform = function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_btGImpactShapeInterface_getChildTransform_1(self, index), btTransform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactShapeInterface.prototype['setChildTransform'] = btGImpactShapeInterface.prototype.setChildTransform = function(index, transform) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  if (transform && typeof transform === 'object') transform = transform.ptr;
  _emscripten_bind_btGImpactShapeInterface_setChildTransform_2(self, index, transform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactShapeInterface.prototype['setLocalScaling'] = btGImpactShapeInterface.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btGImpactShapeInterface_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactShapeInterface.prototype['getLocalScaling'] = btGImpactShapeInterface.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGImpactShapeInterface_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactShapeInterface.prototype['calculateLocalInertia'] = btGImpactShapeInterface.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btGImpactShapeInterface_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactShapeInterface.prototype['__destroy__'] = btGImpactShapeInterface.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btGImpactShapeInterface___destroy___0(self);
};

// Interface: btActivatingCollisionAlgorithm

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btActivatingCollisionAlgorithm() { throw "cannot construct a btActivatingCollisionAlgorithm, no constructor in IDL" }
btActivatingCollisionAlgorithm.prototype = Object.create(btCollisionAlgorithm.prototype);
btActivatingCollisionAlgorithm.prototype.constructor = btActivatingCollisionAlgorithm;
btActivatingCollisionAlgorithm.prototype.__class__ = btActivatingCollisionAlgorithm;
btActivatingCollisionAlgorithm.__cache__ = {};
Module['btActivatingCollisionAlgorithm'] = btActivatingCollisionAlgorithm;

/** @suppress {undefinedVars, duplicate} @this{Object} */
btActivatingCollisionAlgorithm.prototype['__destroy__'] = btActivatingCollisionAlgorithm.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btActivatingCollisionAlgorithm___destroy___0(self);
};

// Interface: btDefaultCollisionConfiguration

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btDefaultCollisionConfiguration(info) {
  if (info && typeof info === 'object') info = info.ptr;
  if (info === undefined) { this.ptr = _emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_0(); getCache(btDefaultCollisionConfiguration)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_1(info);
  getCache(btDefaultCollisionConfiguration)[this.ptr] = this;
};

btDefaultCollisionConfiguration.prototype = Object.create(WrapperObject.prototype);
btDefaultCollisionConfiguration.prototype.constructor = btDefaultCollisionConfiguration;
btDefaultCollisionConfiguration.prototype.__class__ = btDefaultCollisionConfiguration;
btDefaultCollisionConfiguration.__cache__ = {};
Module['btDefaultCollisionConfiguration'] = btDefaultCollisionConfiguration;

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDefaultCollisionConfiguration.prototype['__destroy__'] = btDefaultCollisionConfiguration.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btDefaultCollisionConfiguration___destroy___0(self);
};

// Interface: btDispatcher

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btDispatcher() { throw "cannot construct a btDispatcher, no constructor in IDL" }
btDispatcher.prototype = Object.create(WrapperObject.prototype);
btDispatcher.prototype.constructor = btDispatcher;
btDispatcher.prototype.__class__ = btDispatcher;
btDispatcher.__cache__ = {};
Module['btDispatcher'] = btDispatcher;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcher.prototype['getNumManifolds'] = btDispatcher.prototype.getNumManifolds = function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcher_getNumManifolds_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcher.prototype['getManifoldByIndexInternal'] = btDispatcher.prototype.getManifoldByIndexInternal = function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_btDispatcher_getManifoldByIndexInternal_1(self, index), btPersistentManifold);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcher.prototype['__destroy__'] = btDispatcher.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btDispatcher___destroy___0(self);
};

// Interface: btBroadphaseInterface

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btBroadphaseInterface() { throw "cannot construct a btBroadphaseInterface, no constructor in IDL" }
btBroadphaseInterface.prototype = Object.create(WrapperObject.prototype);
btBroadphaseInterface.prototype.constructor = btBroadphaseInterface;
btBroadphaseInterface.prototype.__class__ = btBroadphaseInterface;
btBroadphaseInterface.__cache__ = {};
Module['btBroadphaseInterface'] = btBroadphaseInterface;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btBroadphaseInterface.prototype['getOverlappingPairCache'] = btBroadphaseInterface.prototype.getOverlappingPairCache = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btBroadphaseInterface_getOverlappingPairCache_0(self), btOverlappingPairCache);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btBroadphaseInterface.prototype['__destroy__'] = btBroadphaseInterface.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btBroadphaseInterface___destroy___0(self);
};

// Interface: btGeneric6DofConstraint

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btGeneric6DofConstraint(rbA, rbB, frameInA, frameInB, useLinearFrameReferenceFrameA) {
  if (rbA && typeof rbA === 'object') rbA = rbA.ptr;
  if (rbB && typeof rbB === 'object') rbB = rbB.ptr;
  if (frameInA && typeof frameInA === 'object') frameInA = frameInA.ptr;
  if (frameInB && typeof frameInB === 'object') frameInB = frameInB.ptr;
  if (useLinearFrameReferenceFrameA && typeof useLinearFrameReferenceFrameA === 'object') useLinearFrameReferenceFrameA = useLinearFrameReferenceFrameA.ptr;
  if (frameInB === undefined) { this.ptr = _emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_3(rbA, rbB, frameInA); getCache(btGeneric6DofConstraint)[this.ptr] = this;return }
  if (useLinearFrameReferenceFrameA === undefined) { this.ptr = _emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_4(rbA, rbB, frameInA, frameInB); getCache(btGeneric6DofConstraint)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_5(rbA, rbB, frameInA, frameInB, useLinearFrameReferenceFrameA);
  getCache(btGeneric6DofConstraint)[this.ptr] = this;
};

btGeneric6DofConstraint.prototype = Object.create(btTypedConstraint.prototype);
btGeneric6DofConstraint.prototype.constructor = btGeneric6DofConstraint;
btGeneric6DofConstraint.prototype.__class__ = btGeneric6DofConstraint;
btGeneric6DofConstraint.__cache__ = {};
Module['btGeneric6DofConstraint'] = btGeneric6DofConstraint;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofConstraint.prototype['setLinearLowerLimit'] = btGeneric6DofConstraint.prototype.setLinearLowerLimit = function(linearLower) {
  var self = this.ptr;
  if (linearLower && typeof linearLower === 'object') linearLower = linearLower.ptr;
  _emscripten_bind_btGeneric6DofConstraint_setLinearLowerLimit_1(self, linearLower);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofConstraint.prototype['setLinearUpperLimit'] = btGeneric6DofConstraint.prototype.setLinearUpperLimit = function(linearUpper) {
  var self = this.ptr;
  if (linearUpper && typeof linearUpper === 'object') linearUpper = linearUpper.ptr;
  _emscripten_bind_btGeneric6DofConstraint_setLinearUpperLimit_1(self, linearUpper);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofConstraint.prototype['setAngularLowerLimit'] = btGeneric6DofConstraint.prototype.setAngularLowerLimit = function(angularLower) {
  var self = this.ptr;
  if (angularLower && typeof angularLower === 'object') angularLower = angularLower.ptr;
  _emscripten_bind_btGeneric6DofConstraint_setAngularLowerLimit_1(self, angularLower);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofConstraint.prototype['setAngularUpperLimit'] = btGeneric6DofConstraint.prototype.setAngularUpperLimit = function(angularUpper) {
  var self = this.ptr;
  if (angularUpper && typeof angularUpper === 'object') angularUpper = angularUpper.ptr;
  _emscripten_bind_btGeneric6DofConstraint_setAngularUpperLimit_1(self, angularUpper);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofConstraint.prototype['getFrameOffsetA'] = btGeneric6DofConstraint.prototype.getFrameOffsetA = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGeneric6DofConstraint_getFrameOffsetA_0(self), btTransform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofConstraint.prototype['enableFeedback'] = btGeneric6DofConstraint.prototype.enableFeedback = function(needsFeedback) {
  var self = this.ptr;
  if (needsFeedback && typeof needsFeedback === 'object') needsFeedback = needsFeedback.ptr;
  _emscripten_bind_btGeneric6DofConstraint_enableFeedback_1(self, needsFeedback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofConstraint.prototype['getBreakingImpulseThreshold'] = btGeneric6DofConstraint.prototype.getBreakingImpulseThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btGeneric6DofConstraint_getBreakingImpulseThreshold_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofConstraint.prototype['setBreakingImpulseThreshold'] = btGeneric6DofConstraint.prototype.setBreakingImpulseThreshold = function(threshold) {
  var self = this.ptr;
  if (threshold && typeof threshold === 'object') threshold = threshold.ptr;
  _emscripten_bind_btGeneric6DofConstraint_setBreakingImpulseThreshold_1(self, threshold);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofConstraint.prototype['getParam'] = btGeneric6DofConstraint.prototype.getParam = function(num, axis) {
  var self = this.ptr;
  if (num && typeof num === 'object') num = num.ptr;
  if (axis && typeof axis === 'object') axis = axis.ptr;
  return _emscripten_bind_btGeneric6DofConstraint_getParam_2(self, num, axis);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofConstraint.prototype['setParam'] = btGeneric6DofConstraint.prototype.setParam = function(num, value, axis) {
  var self = this.ptr;
  if (num && typeof num === 'object') num = num.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  if (axis && typeof axis === 'object') axis = axis.ptr;
  _emscripten_bind_btGeneric6DofConstraint_setParam_3(self, num, value, axis);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofConstraint.prototype['__destroy__'] = btGeneric6DofConstraint.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btGeneric6DofConstraint___destroy___0(self);
};

// Interface: btDiscreteDynamicsWorld

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btDiscreteDynamicsWorld(dispatcher, pairCache, constraintSolver, collisionConfiguration) {
  if (dispatcher && typeof dispatcher === 'object') dispatcher = dispatcher.ptr;
  if (pairCache && typeof pairCache === 'object') pairCache = pairCache.ptr;
  if (constraintSolver && typeof constraintSolver === 'object') constraintSolver = constraintSolver.ptr;
  if (collisionConfiguration && typeof collisionConfiguration === 'object') collisionConfiguration = collisionConfiguration.ptr;
  this.ptr = _emscripten_bind_btDiscreteDynamicsWorld_btDiscreteDynamicsWorld_4(dispatcher, pairCache, constraintSolver, collisionConfiguration);
  getCache(btDiscreteDynamicsWorld)[this.ptr] = this;
};

btDiscreteDynamicsWorld.prototype = Object.create(btDynamicsWorld.prototype);
btDiscreteDynamicsWorld.prototype.constructor = btDiscreteDynamicsWorld;
btDiscreteDynamicsWorld.prototype.__class__ = btDiscreteDynamicsWorld;
btDiscreteDynamicsWorld.__cache__ = {};
Module['btDiscreteDynamicsWorld'] = btDiscreteDynamicsWorld;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['setGravity'] = btDiscreteDynamicsWorld.prototype.setGravity = function(gravity) {
  var self = this.ptr;
  if (gravity && typeof gravity === 'object') gravity = gravity.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_setGravity_1(self, gravity);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['getGravity'] = btDiscreteDynamicsWorld.prototype.getGravity = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDiscreteDynamicsWorld_getGravity_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['addRigidBody'] = btDiscreteDynamicsWorld.prototype.addRigidBody = function(body, group, mask) {
  var self = this.ptr;
  if (body && typeof body === 'object') body = body.ptr;
  if (group && typeof group === 'object') group = group.ptr;
  if (mask && typeof mask === 'object') mask = mask.ptr;
  if (group === undefined) { _emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_1(self, body); return }
  if (mask === undefined) { _emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_2(self, body, group); return }
  _emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_3(self, body, group, mask);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['removeRigidBody'] = btDiscreteDynamicsWorld.prototype.removeRigidBody = function(body) {
  var self = this.ptr;
  if (body && typeof body === 'object') body = body.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_removeRigidBody_1(self, body);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['addConstraint'] = btDiscreteDynamicsWorld.prototype.addConstraint = function(constraint, disableCollisionsBetweenLinkedBodies) {
  var self = this.ptr;
  if (constraint && typeof constraint === 'object') constraint = constraint.ptr;
  if (disableCollisionsBetweenLinkedBodies && typeof disableCollisionsBetweenLinkedBodies === 'object') disableCollisionsBetweenLinkedBodies = disableCollisionsBetweenLinkedBodies.ptr;
  if (disableCollisionsBetweenLinkedBodies === undefined) { _emscripten_bind_btDiscreteDynamicsWorld_addConstraint_1(self, constraint); return }
  _emscripten_bind_btDiscreteDynamicsWorld_addConstraint_2(self, constraint, disableCollisionsBetweenLinkedBodies);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['removeConstraint'] = btDiscreteDynamicsWorld.prototype.removeConstraint = function(constraint) {
  var self = this.ptr;
  if (constraint && typeof constraint === 'object') constraint = constraint.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_removeConstraint_1(self, constraint);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['stepSimulation'] = btDiscreteDynamicsWorld.prototype.stepSimulation = function(timeStep, maxSubSteps, fixedTimeStep) {
  var self = this.ptr;
  if (timeStep && typeof timeStep === 'object') timeStep = timeStep.ptr;
  if (maxSubSteps && typeof maxSubSteps === 'object') maxSubSteps = maxSubSteps.ptr;
  if (fixedTimeStep && typeof fixedTimeStep === 'object') fixedTimeStep = fixedTimeStep.ptr;
  if (maxSubSteps === undefined) { return _emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_1(self, timeStep) }
  if (fixedTimeStep === undefined) { return _emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_2(self, timeStep, maxSubSteps) }
  return _emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_3(self, timeStep, maxSubSteps, fixedTimeStep);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['setContactAddedCallback'] = btDiscreteDynamicsWorld.prototype.setContactAddedCallback = function(funcpointer) {
  var self = this.ptr;
  if (funcpointer && typeof funcpointer === 'object') funcpointer = funcpointer.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_setContactAddedCallback_1(self, funcpointer);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['setContactProcessedCallback'] = btDiscreteDynamicsWorld.prototype.setContactProcessedCallback = function(funcpointer) {
  var self = this.ptr;
  if (funcpointer && typeof funcpointer === 'object') funcpointer = funcpointer.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_setContactProcessedCallback_1(self, funcpointer);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['setContactDestroyedCallback'] = btDiscreteDynamicsWorld.prototype.setContactDestroyedCallback = function(funcpointer) {
  var self = this.ptr;
  if (funcpointer && typeof funcpointer === 'object') funcpointer = funcpointer.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_setContactDestroyedCallback_1(self, funcpointer);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['getDispatcher'] = btDiscreteDynamicsWorld.prototype.getDispatcher = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDiscreteDynamicsWorld_getDispatcher_0(self), btDispatcher);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['rayTest'] = btDiscreteDynamicsWorld.prototype.rayTest = function(rayFromWorld, rayToWorld, resultCallback) {
  var self = this.ptr;
  if (rayFromWorld && typeof rayFromWorld === 'object') rayFromWorld = rayFromWorld.ptr;
  if (rayToWorld && typeof rayToWorld === 'object') rayToWorld = rayToWorld.ptr;
  if (resultCallback && typeof resultCallback === 'object') resultCallback = resultCallback.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_rayTest_3(self, rayFromWorld, rayToWorld, resultCallback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['getPairCache'] = btDiscreteDynamicsWorld.prototype.getPairCache = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDiscreteDynamicsWorld_getPairCache_0(self), btOverlappingPairCache);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['getDispatchInfo'] = btDiscreteDynamicsWorld.prototype.getDispatchInfo = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDiscreteDynamicsWorld_getDispatchInfo_0(self), btDispatcherInfo);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['addCollisionObject'] = btDiscreteDynamicsWorld.prototype.addCollisionObject = function(collisionObject, collisionFilterGroup, collisionFilterMask) {
  var self = this.ptr;
  if (collisionObject && typeof collisionObject === 'object') collisionObject = collisionObject.ptr;
  if (collisionFilterGroup && typeof collisionFilterGroup === 'object') collisionFilterGroup = collisionFilterGroup.ptr;
  if (collisionFilterMask && typeof collisionFilterMask === 'object') collisionFilterMask = collisionFilterMask.ptr;
  if (collisionFilterGroup === undefined) { _emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_1(self, collisionObject); return }
  if (collisionFilterMask === undefined) { _emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_2(self, collisionObject, collisionFilterGroup); return }
  _emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_3(self, collisionObject, collisionFilterGroup, collisionFilterMask);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['removeCollisionObject'] = btDiscreteDynamicsWorld.prototype.removeCollisionObject = function(collisionObject) {
  var self = this.ptr;
  if (collisionObject && typeof collisionObject === 'object') collisionObject = collisionObject.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_removeCollisionObject_1(self, collisionObject);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['getBroadphase'] = btDiscreteDynamicsWorld.prototype.getBroadphase = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDiscreteDynamicsWorld_getBroadphase_0(self), btBroadphaseInterface);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['convexSweepTest'] = btDiscreteDynamicsWorld.prototype.convexSweepTest = function(castShape, from, to, resultCallback, allowedCcdPenetration) {
  var self = this.ptr;
  if (castShape && typeof castShape === 'object') castShape = castShape.ptr;
  if (from && typeof from === 'object') from = from.ptr;
  if (to && typeof to === 'object') to = to.ptr;
  if (resultCallback && typeof resultCallback === 'object') resultCallback = resultCallback.ptr;
  if (allowedCcdPenetration && typeof allowedCcdPenetration === 'object') allowedCcdPenetration = allowedCcdPenetration.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_convexSweepTest_5(self, castShape, from, to, resultCallback, allowedCcdPenetration);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['contactPairTest'] = btDiscreteDynamicsWorld.prototype.contactPairTest = function(colObjA, colObjB, resultCallback) {
  var self = this.ptr;
  if (colObjA && typeof colObjA === 'object') colObjA = colObjA.ptr;
  if (colObjB && typeof colObjB === 'object') colObjB = colObjB.ptr;
  if (resultCallback && typeof resultCallback === 'object') resultCallback = resultCallback.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_contactPairTest_3(self, colObjA, colObjB, resultCallback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['contactTest'] = btDiscreteDynamicsWorld.prototype.contactTest = function(colObj, resultCallback) {
  var self = this.ptr;
  if (colObj && typeof colObj === 'object') colObj = colObj.ptr;
  if (resultCallback && typeof resultCallback === 'object') resultCallback = resultCallback.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_contactTest_2(self, colObj, resultCallback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['setForceUpdateAllAabbs'] = btDiscreteDynamicsWorld.prototype.setForceUpdateAllAabbs = function(forceUpdateAllAabbs) {
  var self = this.ptr;
  if (forceUpdateAllAabbs && typeof forceUpdateAllAabbs === 'object') forceUpdateAllAabbs = forceUpdateAllAabbs.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_setForceUpdateAllAabbs_1(self, forceUpdateAllAabbs);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['updateSingleAabb'] = btDiscreteDynamicsWorld.prototype.updateSingleAabb = function(colObj) {
  var self = this.ptr;
  if (colObj && typeof colObj === 'object') colObj = colObj.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_updateSingleAabb_1(self, colObj);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['setDebugDrawer'] = btDiscreteDynamicsWorld.prototype.setDebugDrawer = function(debugDrawer) {
  var self = this.ptr;
  if (debugDrawer && typeof debugDrawer === 'object') debugDrawer = debugDrawer.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_setDebugDrawer_1(self, debugDrawer);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['getDebugDrawer'] = btDiscreteDynamicsWorld.prototype.getDebugDrawer = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDiscreteDynamicsWorld_getDebugDrawer_0(self), btIDebugDraw);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['debugDrawWorld'] = btDiscreteDynamicsWorld.prototype.debugDrawWorld = function() {
  var self = this.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_debugDrawWorld_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['debugDrawObject'] = btDiscreteDynamicsWorld.prototype.debugDrawObject = function(worldTransform, shape, color) {
  var self = this.ptr;
  if (worldTransform && typeof worldTransform === 'object') worldTransform = worldTransform.ptr;
  if (shape && typeof shape === 'object') shape = shape.ptr;
  if (color && typeof color === 'object') color = color.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_debugDrawObject_3(self, worldTransform, shape, color);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['addAction'] = btDiscreteDynamicsWorld.prototype.addAction = function(action) {
  var self = this.ptr;
  if (action && typeof action === 'object') action = action.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_addAction_1(self, action);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['removeAction'] = btDiscreteDynamicsWorld.prototype.removeAction = function(action) {
  var self = this.ptr;
  if (action && typeof action === 'object') action = action.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld_removeAction_1(self, action);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['getSolverInfo'] = btDiscreteDynamicsWorld.prototype.getSolverInfo = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDiscreteDynamicsWorld_getSolverInfo_0(self), btContactSolverInfo);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['setInternalTickCallback'] = btDiscreteDynamicsWorld.prototype.setInternalTickCallback = function(cb, worldUserInfo, isPreTick) {
  var self = this.ptr;
  if (cb && typeof cb === 'object') cb = cb.ptr;
  if (worldUserInfo && typeof worldUserInfo === 'object') worldUserInfo = worldUserInfo.ptr;
  if (isPreTick && typeof isPreTick === 'object') isPreTick = isPreTick.ptr;
  if (worldUserInfo === undefined) { _emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_1(self, cb); return }
  if (isPreTick === undefined) { _emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_2(self, cb, worldUserInfo); return }
  _emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_3(self, cb, worldUserInfo, isPreTick);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btDiscreteDynamicsWorld.prototype['__destroy__'] = btDiscreteDynamicsWorld.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btDiscreteDynamicsWorld___destroy___0(self);
};

// Interface: btVehicleRaycaster

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btVehicleRaycaster() { throw "cannot construct a btVehicleRaycaster, no constructor in IDL" }
btVehicleRaycaster.prototype = Object.create(WrapperObject.prototype);
btVehicleRaycaster.prototype.constructor = btVehicleRaycaster;
btVehicleRaycaster.prototype.__class__ = btVehicleRaycaster;
btVehicleRaycaster.__cache__ = {};
Module['btVehicleRaycaster'] = btVehicleRaycaster;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleRaycaster.prototype['castRay'] = btVehicleRaycaster.prototype.castRay = function(from, to, result) {
  var self = this.ptr;
  if (from && typeof from === 'object') from = from.ptr;
  if (to && typeof to === 'object') to = to.ptr;
  if (result && typeof result === 'object') result = result.ptr;
  _emscripten_bind_btVehicleRaycaster_castRay_3(self, from, to, result);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleRaycaster.prototype['__destroy__'] = btVehicleRaycaster.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btVehicleRaycaster___destroy___0(self);
};

// Interface: btActionInterface

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btActionInterface() { throw "cannot construct a btActionInterface, no constructor in IDL" }
btActionInterface.prototype = Object.create(WrapperObject.prototype);
btActionInterface.prototype.constructor = btActionInterface;
btActionInterface.prototype.__class__ = btActionInterface;
btActionInterface.__cache__ = {};
Module['btActionInterface'] = btActionInterface;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btActionInterface.prototype['updateAction'] = btActionInterface.prototype.updateAction = function(collisionWorld, deltaTimeStep) {
  var self = this.ptr;
  if (collisionWorld && typeof collisionWorld === 'object') collisionWorld = collisionWorld.ptr;
  if (deltaTimeStep && typeof deltaTimeStep === 'object') deltaTimeStep = deltaTimeStep.ptr;
  _emscripten_bind_btActionInterface_updateAction_2(self, collisionWorld, deltaTimeStep);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btActionInterface.prototype['__destroy__'] = btActionInterface.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btActionInterface___destroy___0(self);
};

// Interface: btGhostObject

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btGhostObject() {
  this.ptr = _emscripten_bind_btGhostObject_btGhostObject_0();
  getCache(btGhostObject)[this.ptr] = this;
};

btGhostObject.prototype = Object.create(btCollisionObject.prototype);
btGhostObject.prototype.constructor = btGhostObject;
btGhostObject.prototype.__class__ = btGhostObject;
btGhostObject.__cache__ = {};
Module['btGhostObject'] = btGhostObject;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['getNumOverlappingObjects'] = btGhostObject.prototype.getNumOverlappingObjects = function() {
  var self = this.ptr;
  return _emscripten_bind_btGhostObject_getNumOverlappingObjects_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['getOverlappingObject'] = btGhostObject.prototype.getOverlappingObject = function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_btGhostObject_getOverlappingObject_1(self, index), btCollisionObject);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['setAnisotropicFriction'] = btGhostObject.prototype.setAnisotropicFriction = function(anisotropicFriction, frictionMode) {
  var self = this.ptr;
  if (anisotropicFriction && typeof anisotropicFriction === 'object') anisotropicFriction = anisotropicFriction.ptr;
  if (frictionMode && typeof frictionMode === 'object') frictionMode = frictionMode.ptr;
  _emscripten_bind_btGhostObject_setAnisotropicFriction_2(self, anisotropicFriction, frictionMode);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['getCollisionShape'] = btGhostObject.prototype.getCollisionShape = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGhostObject_getCollisionShape_0(self), btCollisionShape);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['setContactProcessingThreshold'] = btGhostObject.prototype.setContactProcessingThreshold = function(contactProcessingThreshold) {
  var self = this.ptr;
  if (contactProcessingThreshold && typeof contactProcessingThreshold === 'object') contactProcessingThreshold = contactProcessingThreshold.ptr;
  _emscripten_bind_btGhostObject_setContactProcessingThreshold_1(self, contactProcessingThreshold);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['setActivationState'] = btGhostObject.prototype.setActivationState = function(newState) {
  var self = this.ptr;
  if (newState && typeof newState === 'object') newState = newState.ptr;
  _emscripten_bind_btGhostObject_setActivationState_1(self, newState);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['forceActivationState'] = btGhostObject.prototype.forceActivationState = function(newState) {
  var self = this.ptr;
  if (newState && typeof newState === 'object') newState = newState.ptr;
  _emscripten_bind_btGhostObject_forceActivationState_1(self, newState);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['activate'] = btGhostObject.prototype.activate = function(forceActivation) {
  var self = this.ptr;
  if (forceActivation && typeof forceActivation === 'object') forceActivation = forceActivation.ptr;
  if (forceActivation === undefined) { _emscripten_bind_btGhostObject_activate_0(self); return }
  _emscripten_bind_btGhostObject_activate_1(self, forceActivation);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['isActive'] = btGhostObject.prototype.isActive = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btGhostObject_isActive_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['isKinematicObject'] = btGhostObject.prototype.isKinematicObject = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btGhostObject_isKinematicObject_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['isStaticObject'] = btGhostObject.prototype.isStaticObject = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btGhostObject_isStaticObject_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['isStaticOrKinematicObject'] = btGhostObject.prototype.isStaticOrKinematicObject = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btGhostObject_isStaticOrKinematicObject_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['getRestitution'] = btGhostObject.prototype.getRestitution = function() {
  var self = this.ptr;
  return _emscripten_bind_btGhostObject_getRestitution_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['getFriction'] = btGhostObject.prototype.getFriction = function() {
  var self = this.ptr;
  return _emscripten_bind_btGhostObject_getFriction_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['getRollingFriction'] = btGhostObject.prototype.getRollingFriction = function() {
  var self = this.ptr;
  return _emscripten_bind_btGhostObject_getRollingFriction_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['setRestitution'] = btGhostObject.prototype.setRestitution = function(rest) {
  var self = this.ptr;
  if (rest && typeof rest === 'object') rest = rest.ptr;
  _emscripten_bind_btGhostObject_setRestitution_1(self, rest);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['setFriction'] = btGhostObject.prototype.setFriction = function(frict) {
  var self = this.ptr;
  if (frict && typeof frict === 'object') frict = frict.ptr;
  _emscripten_bind_btGhostObject_setFriction_1(self, frict);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['setRollingFriction'] = btGhostObject.prototype.setRollingFriction = function(frict) {
  var self = this.ptr;
  if (frict && typeof frict === 'object') frict = frict.ptr;
  _emscripten_bind_btGhostObject_setRollingFriction_1(self, frict);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['getWorldTransform'] = btGhostObject.prototype.getWorldTransform = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGhostObject_getWorldTransform_0(self), btTransform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['getCollisionFlags'] = btGhostObject.prototype.getCollisionFlags = function() {
  var self = this.ptr;
  return _emscripten_bind_btGhostObject_getCollisionFlags_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['setCollisionFlags'] = btGhostObject.prototype.setCollisionFlags = function(flags) {
  var self = this.ptr;
  if (flags && typeof flags === 'object') flags = flags.ptr;
  _emscripten_bind_btGhostObject_setCollisionFlags_1(self, flags);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['setWorldTransform'] = btGhostObject.prototype.setWorldTransform = function(worldTrans) {
  var self = this.ptr;
  if (worldTrans && typeof worldTrans === 'object') worldTrans = worldTrans.ptr;
  _emscripten_bind_btGhostObject_setWorldTransform_1(self, worldTrans);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['setCollisionShape'] = btGhostObject.prototype.setCollisionShape = function(collisionShape) {
  var self = this.ptr;
  if (collisionShape && typeof collisionShape === 'object') collisionShape = collisionShape.ptr;
  _emscripten_bind_btGhostObject_setCollisionShape_1(self, collisionShape);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['setCcdMotionThreshold'] = btGhostObject.prototype.setCcdMotionThreshold = function(ccdMotionThreshold) {
  var self = this.ptr;
  if (ccdMotionThreshold && typeof ccdMotionThreshold === 'object') ccdMotionThreshold = ccdMotionThreshold.ptr;
  _emscripten_bind_btGhostObject_setCcdMotionThreshold_1(self, ccdMotionThreshold);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['setCcdSweptSphereRadius'] = btGhostObject.prototype.setCcdSweptSphereRadius = function(radius) {
  var self = this.ptr;
  if (radius && typeof radius === 'object') radius = radius.ptr;
  _emscripten_bind_btGhostObject_setCcdSweptSphereRadius_1(self, radius);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['getUserIndex'] = btGhostObject.prototype.getUserIndex = function() {
  var self = this.ptr;
  return _emscripten_bind_btGhostObject_getUserIndex_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['setUserIndex'] = btGhostObject.prototype.setUserIndex = function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  _emscripten_bind_btGhostObject_setUserIndex_1(self, index);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['getUserPointer'] = btGhostObject.prototype.getUserPointer = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGhostObject_getUserPointer_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['setUserPointer'] = btGhostObject.prototype.setUserPointer = function(userPointer) {
  var self = this.ptr;
  if (userPointer && typeof userPointer === 'object') userPointer = userPointer.ptr;
  _emscripten_bind_btGhostObject_setUserPointer_1(self, userPointer);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['getBroadphaseHandle'] = btGhostObject.prototype.getBroadphaseHandle = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGhostObject_getBroadphaseHandle_0(self), btBroadphaseProxy);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostObject.prototype['__destroy__'] = btGhostObject.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btGhostObject___destroy___0(self);
};

// Interface: btSoftBodySolver

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btSoftBodySolver() { throw "cannot construct a btSoftBodySolver, no constructor in IDL" }
btSoftBodySolver.prototype = Object.create(WrapperObject.prototype);
btSoftBodySolver.prototype.constructor = btSoftBodySolver;
btSoftBodySolver.prototype.__class__ = btSoftBodySolver;
btSoftBodySolver.__cache__ = {};
Module['btSoftBodySolver'] = btSoftBodySolver;

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodySolver.prototype['__destroy__'] = btSoftBodySolver.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btSoftBodySolver___destroy___0(self);
};

// Interface: VoidPtr

/** @suppress {undefinedVars, duplicate} @this{Object} */
function VoidPtr() { throw "cannot construct a VoidPtr, no constructor in IDL" }
VoidPtr.prototype = Object.create(WrapperObject.prototype);
VoidPtr.prototype.constructor = VoidPtr;
VoidPtr.prototype.__class__ = VoidPtr;
VoidPtr.__cache__ = {};
Module['VoidPtr'] = VoidPtr;

/** @suppress {undefinedVars, duplicate} @this{Object} */
VoidPtr.prototype['__destroy__'] = VoidPtr.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_VoidPtr___destroy___0(self);
};

// Interface: DebugDrawer

/** @suppress {undefinedVars, duplicate} @this{Object} */
function DebugDrawer() {
  this.ptr = _emscripten_bind_DebugDrawer_DebugDrawer_0();
  getCache(DebugDrawer)[this.ptr] = this;
};

DebugDrawer.prototype = Object.create(btIDebugDraw.prototype);
DebugDrawer.prototype.constructor = DebugDrawer;
DebugDrawer.prototype.__class__ = DebugDrawer;
DebugDrawer.__cache__ = {};
Module['DebugDrawer'] = DebugDrawer;
/** @suppress {undefinedVars, duplicate} @this{Object} */
DebugDrawer.prototype['drawLine'] = DebugDrawer.prototype.drawLine = function(from, to, color) {
  var self = this.ptr;
  if (from && typeof from === 'object') from = from.ptr;
  if (to && typeof to === 'object') to = to.ptr;
  if (color && typeof color === 'object') color = color.ptr;
  _emscripten_bind_DebugDrawer_drawLine_3(self, from, to, color);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
DebugDrawer.prototype['drawContactPoint'] = DebugDrawer.prototype.drawContactPoint = function(pointOnB, normalOnB, distance, lifeTime, color) {
  var self = this.ptr;
  if (pointOnB && typeof pointOnB === 'object') pointOnB = pointOnB.ptr;
  if (normalOnB && typeof normalOnB === 'object') normalOnB = normalOnB.ptr;
  if (distance && typeof distance === 'object') distance = distance.ptr;
  if (lifeTime && typeof lifeTime === 'object') lifeTime = lifeTime.ptr;
  if (color && typeof color === 'object') color = color.ptr;
  _emscripten_bind_DebugDrawer_drawContactPoint_5(self, pointOnB, normalOnB, distance, lifeTime, color);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
DebugDrawer.prototype['reportErrorWarning'] = DebugDrawer.prototype.reportErrorWarning = function(warningString) {
  var self = this.ptr;
  ensureCache.prepare();
  if (warningString && typeof warningString === 'object') warningString = warningString.ptr;
  else warningString = ensureString(warningString);
  _emscripten_bind_DebugDrawer_reportErrorWarning_1(self, warningString);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
DebugDrawer.prototype['draw3dText'] = DebugDrawer.prototype.draw3dText = function(location, textString) {
  var self = this.ptr;
  ensureCache.prepare();
  if (location && typeof location === 'object') location = location.ptr;
  if (textString && typeof textString === 'object') textString = textString.ptr;
  else textString = ensureString(textString);
  _emscripten_bind_DebugDrawer_draw3dText_2(self, location, textString);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
DebugDrawer.prototype['setDebugMode'] = DebugDrawer.prototype.setDebugMode = function(debugMode) {
  var self = this.ptr;
  if (debugMode && typeof debugMode === 'object') debugMode = debugMode.ptr;
  _emscripten_bind_DebugDrawer_setDebugMode_1(self, debugMode);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
DebugDrawer.prototype['getDebugMode'] = DebugDrawer.prototype.getDebugMode = function() {
  var self = this.ptr;
  return _emscripten_bind_DebugDrawer_getDebugMode_0(self);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
DebugDrawer.prototype['__destroy__'] = DebugDrawer.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_DebugDrawer___destroy___0(self);
};

// Interface: btVector4

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btVector4(x, y, z, w) {
  if (x && typeof x === 'object') x = x.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  if (z && typeof z === 'object') z = z.ptr;
  if (w && typeof w === 'object') w = w.ptr;
  if (x === undefined) { this.ptr = _emscripten_bind_btVector4_btVector4_0(); getCache(btVector4)[this.ptr] = this;return }
  if (y === undefined) { this.ptr = _emscripten_bind_btVector4_btVector4_1(x); getCache(btVector4)[this.ptr] = this;return }
  if (z === undefined) { this.ptr = _emscripten_bind_btVector4_btVector4_2(x, y); getCache(btVector4)[this.ptr] = this;return }
  if (w === undefined) { this.ptr = _emscripten_bind_btVector4_btVector4_3(x, y, z); getCache(btVector4)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btVector4_btVector4_4(x, y, z, w);
  getCache(btVector4)[this.ptr] = this;
};

btVector4.prototype = Object.create(btVector3.prototype);
btVector4.prototype.constructor = btVector4;
btVector4.prototype.__class__ = btVector4;
btVector4.__cache__ = {};
Module['btVector4'] = btVector4;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector4.prototype['w'] = btVector4.prototype.w = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector4_w_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector4.prototype['setValue'] = btVector4.prototype.setValue = function(x, y, z, w) {
  var self = this.ptr;
  if (x && typeof x === 'object') x = x.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  if (z && typeof z === 'object') z = z.ptr;
  if (w && typeof w === 'object') w = w.ptr;
  _emscripten_bind_btVector4_setValue_4(self, x, y, z, w);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector4.prototype['length'] = btVector4.prototype.length = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector4_length_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector4.prototype['length2'] = btVector4.prototype.length2 = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector4_length2_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector4.prototype['x'] = btVector4.prototype.x = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector4_x_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector4.prototype['y'] = btVector4.prototype.y = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector4_y_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector4.prototype['z'] = btVector4.prototype.z = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector4_z_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector4.prototype['setX'] = btVector4.prototype.setX = function(x) {
  var self = this.ptr;
  if (x && typeof x === 'object') x = x.ptr;
  _emscripten_bind_btVector4_setX_1(self, x);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector4.prototype['setY'] = btVector4.prototype.setY = function(y) {
  var self = this.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  _emscripten_bind_btVector4_setY_1(self, y);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector4.prototype['setZ'] = btVector4.prototype.setZ = function(z) {
  var self = this.ptr;
  if (z && typeof z === 'object') z = z.ptr;
  _emscripten_bind_btVector4_setZ_1(self, z);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector4.prototype['normalize'] = btVector4.prototype.normalize = function() {
  var self = this.ptr;
  _emscripten_bind_btVector4_normalize_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector4.prototype['rotate'] = btVector4.prototype.rotate = function(wAxis, angle) {
  var self = this.ptr;
  if (wAxis && typeof wAxis === 'object') wAxis = wAxis.ptr;
  if (angle && typeof angle === 'object') angle = angle.ptr;
  return wrapPointer(_emscripten_bind_btVector4_rotate_2(self, wAxis, angle), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector4.prototype['dot'] = btVector4.prototype.dot = function(v) {
  var self = this.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  return _emscripten_bind_btVector4_dot_1(self, v);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector4.prototype['op_mul'] = btVector4.prototype.op_mul = function(x) {
  var self = this.ptr;
  if (x && typeof x === 'object') x = x.ptr;
  return wrapPointer(_emscripten_bind_btVector4_op_mul_1(self, x), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector4.prototype['op_add'] = btVector4.prototype.op_add = function(v) {
  var self = this.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  return wrapPointer(_emscripten_bind_btVector4_op_add_1(self, v), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector4.prototype['op_sub'] = btVector4.prototype.op_sub = function(v) {
  var self = this.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  return wrapPointer(_emscripten_bind_btVector4_op_sub_1(self, v), btVector3);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector4.prototype['__destroy__'] = btVector4.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btVector4___destroy___0(self);
};

// Interface: btQuaternion

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btQuaternion(x, y, z, w) {
  if (x && typeof x === 'object') x = x.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  if (z && typeof z === 'object') z = z.ptr;
  if (w && typeof w === 'object') w = w.ptr;
  this.ptr = _emscripten_bind_btQuaternion_btQuaternion_4(x, y, z, w);
  getCache(btQuaternion)[this.ptr] = this;
};

btQuaternion.prototype = Object.create(btQuadWord.prototype);
btQuaternion.prototype.constructor = btQuaternion;
btQuaternion.prototype.__class__ = btQuaternion;
btQuaternion.__cache__ = {};
Module['btQuaternion'] = btQuaternion;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['setValue'] = btQuaternion.prototype.setValue = function(x, y, z, w) {
  var self = this.ptr;
  if (x && typeof x === 'object') x = x.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  if (z && typeof z === 'object') z = z.ptr;
  if (w && typeof w === 'object') w = w.ptr;
  _emscripten_bind_btQuaternion_setValue_4(self, x, y, z, w);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['setEulerZYX'] = btQuaternion.prototype.setEulerZYX = function(z, y, x) {
  var self = this.ptr;
  if (z && typeof z === 'object') z = z.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  if (x && typeof x === 'object') x = x.ptr;
  _emscripten_bind_btQuaternion_setEulerZYX_3(self, z, y, x);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['setRotation'] = btQuaternion.prototype.setRotation = function(axis, angle) {
  var self = this.ptr;
  if (axis && typeof axis === 'object') axis = axis.ptr;
  if (angle && typeof angle === 'object') angle = angle.ptr;
  _emscripten_bind_btQuaternion_setRotation_2(self, axis, angle);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['normalize'] = btQuaternion.prototype.normalize = function() {
  var self = this.ptr;
  _emscripten_bind_btQuaternion_normalize_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['length2'] = btQuaternion.prototype.length2 = function() {
  var self = this.ptr;
  return _emscripten_bind_btQuaternion_length2_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['length'] = btQuaternion.prototype.length = function() {
  var self = this.ptr;
  return _emscripten_bind_btQuaternion_length_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['dot'] = btQuaternion.prototype.dot = function(q) {
  var self = this.ptr;
  if (q && typeof q === 'object') q = q.ptr;
  return _emscripten_bind_btQuaternion_dot_1(self, q);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['normalized'] = btQuaternion.prototype.normalized = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btQuaternion_normalized_0(self), btQuaternion);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['getAxis'] = btQuaternion.prototype.getAxis = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btQuaternion_getAxis_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['inverse'] = btQuaternion.prototype.inverse = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btQuaternion_inverse_0(self), btQuaternion);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['getAngle'] = btQuaternion.prototype.getAngle = function() {
  var self = this.ptr;
  return _emscripten_bind_btQuaternion_getAngle_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['getAngleShortestPath'] = btQuaternion.prototype.getAngleShortestPath = function() {
  var self = this.ptr;
  return _emscripten_bind_btQuaternion_getAngleShortestPath_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['angle'] = btQuaternion.prototype.angle = function(q) {
  var self = this.ptr;
  if (q && typeof q === 'object') q = q.ptr;
  return _emscripten_bind_btQuaternion_angle_1(self, q);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['angleShortestPath'] = btQuaternion.prototype.angleShortestPath = function(q) {
  var self = this.ptr;
  if (q && typeof q === 'object') q = q.ptr;
  return _emscripten_bind_btQuaternion_angleShortestPath_1(self, q);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['op_add'] = btQuaternion.prototype.op_add = function(q) {
  var self = this.ptr;
  if (q && typeof q === 'object') q = q.ptr;
  return wrapPointer(_emscripten_bind_btQuaternion_op_add_1(self, q), btQuaternion);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['op_sub'] = btQuaternion.prototype.op_sub = function(q) {
  var self = this.ptr;
  if (q && typeof q === 'object') q = q.ptr;
  return wrapPointer(_emscripten_bind_btQuaternion_op_sub_1(self, q), btQuaternion);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['op_mul'] = btQuaternion.prototype.op_mul = function(s) {
  var self = this.ptr;
  if (s && typeof s === 'object') s = s.ptr;
  return wrapPointer(_emscripten_bind_btQuaternion_op_mul_1(self, s), btQuaternion);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['op_mulq'] = btQuaternion.prototype.op_mulq = function(q) {
  var self = this.ptr;
  if (q && typeof q === 'object') q = q.ptr;
  return wrapPointer(_emscripten_bind_btQuaternion_op_mulq_1(self, q), btQuaternion);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['op_div'] = btQuaternion.prototype.op_div = function(s) {
  var self = this.ptr;
  if (s && typeof s === 'object') s = s.ptr;
  return wrapPointer(_emscripten_bind_btQuaternion_op_div_1(self, s), btQuaternion);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['x'] = btQuaternion.prototype.x = function() {
  var self = this.ptr;
  return _emscripten_bind_btQuaternion_x_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['y'] = btQuaternion.prototype.y = function() {
  var self = this.ptr;
  return _emscripten_bind_btQuaternion_y_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['z'] = btQuaternion.prototype.z = function() {
  var self = this.ptr;
  return _emscripten_bind_btQuaternion_z_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['w'] = btQuaternion.prototype.w = function() {
  var self = this.ptr;
  return _emscripten_bind_btQuaternion_w_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['setX'] = btQuaternion.prototype.setX = function(x) {
  var self = this.ptr;
  if (x && typeof x === 'object') x = x.ptr;
  _emscripten_bind_btQuaternion_setX_1(self, x);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['setY'] = btQuaternion.prototype.setY = function(y) {
  var self = this.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  _emscripten_bind_btQuaternion_setY_1(self, y);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['setZ'] = btQuaternion.prototype.setZ = function(z) {
  var self = this.ptr;
  if (z && typeof z === 'object') z = z.ptr;
  _emscripten_bind_btQuaternion_setZ_1(self, z);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['setW'] = btQuaternion.prototype.setW = function(w) {
  var self = this.ptr;
  if (w && typeof w === 'object') w = w.ptr;
  _emscripten_bind_btQuaternion_setW_1(self, w);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btQuaternion.prototype['__destroy__'] = btQuaternion.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btQuaternion___destroy___0(self);
};

// Interface: btMatrix3x3

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btMatrix3x3() { throw "cannot construct a btMatrix3x3, no constructor in IDL" }
btMatrix3x3.prototype = Object.create(WrapperObject.prototype);
btMatrix3x3.prototype.constructor = btMatrix3x3;
btMatrix3x3.prototype.__class__ = btMatrix3x3;
btMatrix3x3.__cache__ = {};
Module['btMatrix3x3'] = btMatrix3x3;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btMatrix3x3.prototype['setEulerZYX'] = btMatrix3x3.prototype.setEulerZYX = function(ex, ey, ez) {
  var self = this.ptr;
  if (ex && typeof ex === 'object') ex = ex.ptr;
  if (ey && typeof ey === 'object') ey = ey.ptr;
  if (ez && typeof ez === 'object') ez = ez.ptr;
  _emscripten_bind_btMatrix3x3_setEulerZYX_3(self, ex, ey, ez);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btMatrix3x3.prototype['getRotation'] = btMatrix3x3.prototype.getRotation = function(q) {
  var self = this.ptr;
  if (q && typeof q === 'object') q = q.ptr;
  _emscripten_bind_btMatrix3x3_getRotation_1(self, q);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btMatrix3x3.prototype['getRow'] = btMatrix3x3.prototype.getRow = function(y) {
  var self = this.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  return wrapPointer(_emscripten_bind_btMatrix3x3_getRow_1(self, y), btVector3);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btMatrix3x3.prototype['__destroy__'] = btMatrix3x3.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btMatrix3x3___destroy___0(self);
};

// Interface: btTransform

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btTransform(q, v) {
  if (q && typeof q === 'object') q = q.ptr;
  if (v && typeof v === 'object') v = v.ptr;
  if (q === undefined) { this.ptr = _emscripten_bind_btTransform_btTransform_0(); getCache(btTransform)[this.ptr] = this;return }
  if (v === undefined) { this.ptr = _emscripten_bind_btTransform_btTransform_1(q); getCache(btTransform)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btTransform_btTransform_2(q, v);
  getCache(btTransform)[this.ptr] = this;
};

btTransform.prototype = Object.create(WrapperObject.prototype);
btTransform.prototype.constructor = btTransform;
btTransform.prototype.__class__ = btTransform;
btTransform.__cache__ = {};
Module['btTransform'] = btTransform;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btTransform.prototype['setIdentity'] = btTransform.prototype.setIdentity = function() {
  var self = this.ptr;
  _emscripten_bind_btTransform_setIdentity_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btTransform.prototype['setOrigin'] = btTransform.prototype.setOrigin = function(origin) {
  var self = this.ptr;
  if (origin && typeof origin === 'object') origin = origin.ptr;
  _emscripten_bind_btTransform_setOrigin_1(self, origin);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btTransform.prototype['setRotation'] = btTransform.prototype.setRotation = function(rotation) {
  var self = this.ptr;
  if (rotation && typeof rotation === 'object') rotation = rotation.ptr;
  _emscripten_bind_btTransform_setRotation_1(self, rotation);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btTransform.prototype['getOrigin'] = btTransform.prototype.getOrigin = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btTransform_getOrigin_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btTransform.prototype['getRotation'] = btTransform.prototype.getRotation = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btTransform_getRotation_0(self), btQuaternion);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btTransform.prototype['getBasis'] = btTransform.prototype.getBasis = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btTransform_getBasis_0(self), btMatrix3x3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btTransform.prototype['setFromOpenGLMatrix'] = btTransform.prototype.setFromOpenGLMatrix = function(m) {
  var self = this.ptr;
  ensureCache.prepare();
  if (typeof m == 'object') { m = ensureFloat32(m); }
  _emscripten_bind_btTransform_setFromOpenGLMatrix_1(self, m);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btTransform.prototype['inverse'] = btTransform.prototype.inverse = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btTransform_inverse_0(self), btTransform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btTransform.prototype['op_mul'] = btTransform.prototype.op_mul = function(t) {
  var self = this.ptr;
  if (t && typeof t === 'object') t = t.ptr;
  return wrapPointer(_emscripten_bind_btTransform_op_mul_1(self, t), btTransform);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btTransform.prototype['__destroy__'] = btTransform.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btTransform___destroy___0(self);
};

// Interface: MotionState

/** @suppress {undefinedVars, duplicate} @this{Object} */
function MotionState() {
  this.ptr = _emscripten_bind_MotionState_MotionState_0();
  getCache(MotionState)[this.ptr] = this;
};

MotionState.prototype = Object.create(btMotionState.prototype);
MotionState.prototype.constructor = MotionState;
MotionState.prototype.__class__ = MotionState;
MotionState.__cache__ = {};
Module['MotionState'] = MotionState;
/** @suppress {undefinedVars, duplicate} @this{Object} */
MotionState.prototype['getWorldTransform'] = MotionState.prototype.getWorldTransform = function(worldTrans) {
  var self = this.ptr;
  if (worldTrans && typeof worldTrans === 'object') worldTrans = worldTrans.ptr;
  _emscripten_bind_MotionState_getWorldTransform_1(self, worldTrans);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
MotionState.prototype['setWorldTransform'] = MotionState.prototype.setWorldTransform = function(worldTrans) {
  var self = this.ptr;
  if (worldTrans && typeof worldTrans === 'object') worldTrans = worldTrans.ptr;
  _emscripten_bind_MotionState_setWorldTransform_1(self, worldTrans);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
MotionState.prototype['__destroy__'] = MotionState.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_MotionState___destroy___0(self);
};

// Interface: btDefaultMotionState

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btDefaultMotionState(startTrans, centerOfMassOffset) {
  if (startTrans && typeof startTrans === 'object') startTrans = startTrans.ptr;
  if (centerOfMassOffset && typeof centerOfMassOffset === 'object') centerOfMassOffset = centerOfMassOffset.ptr;
  if (startTrans === undefined) { this.ptr = _emscripten_bind_btDefaultMotionState_btDefaultMotionState_0(); getCache(btDefaultMotionState)[this.ptr] = this;return }
  if (centerOfMassOffset === undefined) { this.ptr = _emscripten_bind_btDefaultMotionState_btDefaultMotionState_1(startTrans); getCache(btDefaultMotionState)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btDefaultMotionState_btDefaultMotionState_2(startTrans, centerOfMassOffset);
  getCache(btDefaultMotionState)[this.ptr] = this;
};

btDefaultMotionState.prototype = Object.create(btMotionState.prototype);
btDefaultMotionState.prototype.constructor = btDefaultMotionState;
btDefaultMotionState.prototype.__class__ = btDefaultMotionState;
btDefaultMotionState.__cache__ = {};
Module['btDefaultMotionState'] = btDefaultMotionState;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btDefaultMotionState.prototype['getWorldTransform'] = btDefaultMotionState.prototype.getWorldTransform = function(worldTrans) {
  var self = this.ptr;
  if (worldTrans && typeof worldTrans === 'object') worldTrans = worldTrans.ptr;
  _emscripten_bind_btDefaultMotionState_getWorldTransform_1(self, worldTrans);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDefaultMotionState.prototype['setWorldTransform'] = btDefaultMotionState.prototype.setWorldTransform = function(worldTrans) {
  var self = this.ptr;
  if (worldTrans && typeof worldTrans === 'object') worldTrans = worldTrans.ptr;
  _emscripten_bind_btDefaultMotionState_setWorldTransform_1(self, worldTrans);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDefaultMotionState.prototype['get_m_graphicsWorldTrans'] = btDefaultMotionState.prototype.get_m_graphicsWorldTrans = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDefaultMotionState_get_m_graphicsWorldTrans_0(self), btTransform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDefaultMotionState.prototype['set_m_graphicsWorldTrans'] = btDefaultMotionState.prototype.set_m_graphicsWorldTrans = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDefaultMotionState_set_m_graphicsWorldTrans_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btDefaultMotionState.prototype, 'm_graphicsWorldTrans', { get: btDefaultMotionState.prototype.get_m_graphicsWorldTrans, set: btDefaultMotionState.prototype.set_m_graphicsWorldTrans });

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDefaultMotionState.prototype['__destroy__'] = btDefaultMotionState.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btDefaultMotionState___destroy___0(self);
};

// Interface: btCollisionObjectWrapper

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btCollisionObjectWrapper() { throw "cannot construct a btCollisionObjectWrapper, no constructor in IDL" }
btCollisionObjectWrapper.prototype = Object.create(WrapperObject.prototype);
btCollisionObjectWrapper.prototype.constructor = btCollisionObjectWrapper;
btCollisionObjectWrapper.prototype.__class__ = btCollisionObjectWrapper;
btCollisionObjectWrapper.__cache__ = {};
Module['btCollisionObjectWrapper'] = btCollisionObjectWrapper;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObjectWrapper.prototype['getWorldTransform'] = btCollisionObjectWrapper.prototype.getWorldTransform = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionObjectWrapper_getWorldTransform_0(self), btTransform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObjectWrapper.prototype['getCollisionObject'] = btCollisionObjectWrapper.prototype.getCollisionObject = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionObjectWrapper_getCollisionObject_0(self), btCollisionObject);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionObjectWrapper.prototype['getCollisionShape'] = btCollisionObjectWrapper.prototype.getCollisionShape = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionObjectWrapper_getCollisionShape_0(self), btCollisionShape);
};


// Interface: ClosestRayResultCallback

/** @suppress {undefinedVars, duplicate} @this{Object} */
function ClosestRayResultCallback(from, to) {
  if (from && typeof from === 'object') from = from.ptr;
  if (to && typeof to === 'object') to = to.ptr;
  this.ptr = _emscripten_bind_ClosestRayResultCallback_ClosestRayResultCallback_2(from, to);
  getCache(ClosestRayResultCallback)[this.ptr] = this;
};

ClosestRayResultCallback.prototype = Object.create(RayResultCallback.prototype);
ClosestRayResultCallback.prototype.constructor = ClosestRayResultCallback;
ClosestRayResultCallback.prototype.__class__ = ClosestRayResultCallback;
ClosestRayResultCallback.__cache__ = {};
Module['ClosestRayResultCallback'] = ClosestRayResultCallback;
/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestRayResultCallback.prototype['hasHit'] = ClosestRayResultCallback.prototype.hasHit = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_ClosestRayResultCallback_hasHit_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestRayResultCallback.prototype['get_m_rayFromWorld'] = ClosestRayResultCallback.prototype.get_m_rayFromWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestRayResultCallback_get_m_rayFromWorld_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestRayResultCallback.prototype['set_m_rayFromWorld'] = ClosestRayResultCallback.prototype.set_m_rayFromWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_rayFromWorld_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ClosestRayResultCallback.prototype, 'm_rayFromWorld', { get: ClosestRayResultCallback.prototype.get_m_rayFromWorld, set: ClosestRayResultCallback.prototype.set_m_rayFromWorld });
/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestRayResultCallback.prototype['get_m_rayToWorld'] = ClosestRayResultCallback.prototype.get_m_rayToWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestRayResultCallback_get_m_rayToWorld_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestRayResultCallback.prototype['set_m_rayToWorld'] = ClosestRayResultCallback.prototype.set_m_rayToWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_rayToWorld_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ClosestRayResultCallback.prototype, 'm_rayToWorld', { get: ClosestRayResultCallback.prototype.get_m_rayToWorld, set: ClosestRayResultCallback.prototype.set_m_rayToWorld });
/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestRayResultCallback.prototype['get_m_hitNormalWorld'] = ClosestRayResultCallback.prototype.get_m_hitNormalWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestRayResultCallback_get_m_hitNormalWorld_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestRayResultCallback.prototype['set_m_hitNormalWorld'] = ClosestRayResultCallback.prototype.set_m_hitNormalWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_hitNormalWorld_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ClosestRayResultCallback.prototype, 'm_hitNormalWorld', { get: ClosestRayResultCallback.prototype.get_m_hitNormalWorld, set: ClosestRayResultCallback.prototype.set_m_hitNormalWorld });
/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestRayResultCallback.prototype['get_m_hitPointWorld'] = ClosestRayResultCallback.prototype.get_m_hitPointWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestRayResultCallback_get_m_hitPointWorld_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestRayResultCallback.prototype['set_m_hitPointWorld'] = ClosestRayResultCallback.prototype.set_m_hitPointWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_hitPointWorld_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ClosestRayResultCallback.prototype, 'm_hitPointWorld', { get: ClosestRayResultCallback.prototype.get_m_hitPointWorld, set: ClosestRayResultCallback.prototype.set_m_hitPointWorld });
/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestRayResultCallback.prototype['get_m_collisionFilterGroup'] = ClosestRayResultCallback.prototype.get_m_collisionFilterGroup = function() {
  var self = this.ptr;
  return _emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterGroup_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestRayResultCallback.prototype['set_m_collisionFilterGroup'] = ClosestRayResultCallback.prototype.set_m_collisionFilterGroup = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterGroup_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ClosestRayResultCallback.prototype, 'm_collisionFilterGroup', { get: ClosestRayResultCallback.prototype.get_m_collisionFilterGroup, set: ClosestRayResultCallback.prototype.set_m_collisionFilterGroup });
/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestRayResultCallback.prototype['get_m_collisionFilterMask'] = ClosestRayResultCallback.prototype.get_m_collisionFilterMask = function() {
  var self = this.ptr;
  return _emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterMask_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestRayResultCallback.prototype['set_m_collisionFilterMask'] = ClosestRayResultCallback.prototype.set_m_collisionFilterMask = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterMask_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ClosestRayResultCallback.prototype, 'm_collisionFilterMask', { get: ClosestRayResultCallback.prototype.get_m_collisionFilterMask, set: ClosestRayResultCallback.prototype.set_m_collisionFilterMask });
/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestRayResultCallback.prototype['get_m_closestHitFraction'] = ClosestRayResultCallback.prototype.get_m_closestHitFraction = function() {
  var self = this.ptr;
  return _emscripten_bind_ClosestRayResultCallback_get_m_closestHitFraction_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestRayResultCallback.prototype['set_m_closestHitFraction'] = ClosestRayResultCallback.prototype.set_m_closestHitFraction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_closestHitFraction_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ClosestRayResultCallback.prototype, 'm_closestHitFraction', { get: ClosestRayResultCallback.prototype.get_m_closestHitFraction, set: ClosestRayResultCallback.prototype.set_m_closestHitFraction });
/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestRayResultCallback.prototype['get_m_collisionObject'] = ClosestRayResultCallback.prototype.get_m_collisionObject = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestRayResultCallback_get_m_collisionObject_0(self), btCollisionObject);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestRayResultCallback.prototype['set_m_collisionObject'] = ClosestRayResultCallback.prototype.set_m_collisionObject = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_collisionObject_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ClosestRayResultCallback.prototype, 'm_collisionObject', { get: ClosestRayResultCallback.prototype.get_m_collisionObject, set: ClosestRayResultCallback.prototype.set_m_collisionObject });
/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestRayResultCallback.prototype['get_m_flags'] = ClosestRayResultCallback.prototype.get_m_flags = function() {
  var self = this.ptr;
  return _emscripten_bind_ClosestRayResultCallback_get_m_flags_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestRayResultCallback.prototype['set_m_flags'] = ClosestRayResultCallback.prototype.set_m_flags = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestRayResultCallback_set_m_flags_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ClosestRayResultCallback.prototype, 'm_flags', { get: ClosestRayResultCallback.prototype.get_m_flags, set: ClosestRayResultCallback.prototype.set_m_flags });

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestRayResultCallback.prototype['__destroy__'] = ClosestRayResultCallback.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_ClosestRayResultCallback___destroy___0(self);
};

// Interface: btConstCollisionObjectArray

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btConstCollisionObjectArray() { throw "cannot construct a btConstCollisionObjectArray, no constructor in IDL" }
btConstCollisionObjectArray.prototype = Object.create(WrapperObject.prototype);
btConstCollisionObjectArray.prototype.constructor = btConstCollisionObjectArray;
btConstCollisionObjectArray.prototype.__class__ = btConstCollisionObjectArray;
btConstCollisionObjectArray.__cache__ = {};
Module['btConstCollisionObjectArray'] = btConstCollisionObjectArray;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btConstCollisionObjectArray.prototype['size'] = btConstCollisionObjectArray.prototype.size = function() {
  var self = this.ptr;
  return _emscripten_bind_btConstCollisionObjectArray_size_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConstCollisionObjectArray.prototype['at'] = btConstCollisionObjectArray.prototype.at = function(n) {
  var self = this.ptr;
  if (n && typeof n === 'object') n = n.ptr;
  return wrapPointer(_emscripten_bind_btConstCollisionObjectArray_at_1(self, n), btCollisionObject);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btConstCollisionObjectArray.prototype['__destroy__'] = btConstCollisionObjectArray.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConstCollisionObjectArray___destroy___0(self);
};

// Interface: btScalarArray

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btScalarArray() { throw "cannot construct a btScalarArray, no constructor in IDL" }
btScalarArray.prototype = Object.create(WrapperObject.prototype);
btScalarArray.prototype.constructor = btScalarArray;
btScalarArray.prototype.__class__ = btScalarArray;
btScalarArray.__cache__ = {};
Module['btScalarArray'] = btScalarArray;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btScalarArray.prototype['size'] = btScalarArray.prototype.size = function() {
  var self = this.ptr;
  return _emscripten_bind_btScalarArray_size_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btScalarArray.prototype['at'] = btScalarArray.prototype.at = function(n) {
  var self = this.ptr;
  if (n && typeof n === 'object') n = n.ptr;
  return _emscripten_bind_btScalarArray_at_1(self, n);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btScalarArray.prototype['__destroy__'] = btScalarArray.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btScalarArray___destroy___0(self);
};

// Interface: AllHitsRayResultCallback

/** @suppress {undefinedVars, duplicate} @this{Object} */
function AllHitsRayResultCallback(from, to) {
  if (from && typeof from === 'object') from = from.ptr;
  if (to && typeof to === 'object') to = to.ptr;
  this.ptr = _emscripten_bind_AllHitsRayResultCallback_AllHitsRayResultCallback_2(from, to);
  getCache(AllHitsRayResultCallback)[this.ptr] = this;
};

AllHitsRayResultCallback.prototype = Object.create(RayResultCallback.prototype);
AllHitsRayResultCallback.prototype.constructor = AllHitsRayResultCallback;
AllHitsRayResultCallback.prototype.__class__ = AllHitsRayResultCallback;
AllHitsRayResultCallback.__cache__ = {};
Module['AllHitsRayResultCallback'] = AllHitsRayResultCallback;
/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['hasHit'] = AllHitsRayResultCallback.prototype.hasHit = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_AllHitsRayResultCallback_hasHit_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['get_m_collisionObjects'] = AllHitsRayResultCallback.prototype.get_m_collisionObjects = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_AllHitsRayResultCallback_get_m_collisionObjects_0(self), btConstCollisionObjectArray);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['set_m_collisionObjects'] = AllHitsRayResultCallback.prototype.set_m_collisionObjects = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_AllHitsRayResultCallback_set_m_collisionObjects_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(AllHitsRayResultCallback.prototype, 'm_collisionObjects', { get: AllHitsRayResultCallback.prototype.get_m_collisionObjects, set: AllHitsRayResultCallback.prototype.set_m_collisionObjects });
/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['get_m_rayFromWorld'] = AllHitsRayResultCallback.prototype.get_m_rayFromWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_AllHitsRayResultCallback_get_m_rayFromWorld_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['set_m_rayFromWorld'] = AllHitsRayResultCallback.prototype.set_m_rayFromWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_AllHitsRayResultCallback_set_m_rayFromWorld_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(AllHitsRayResultCallback.prototype, 'm_rayFromWorld', { get: AllHitsRayResultCallback.prototype.get_m_rayFromWorld, set: AllHitsRayResultCallback.prototype.set_m_rayFromWorld });
/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['get_m_rayToWorld'] = AllHitsRayResultCallback.prototype.get_m_rayToWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_AllHitsRayResultCallback_get_m_rayToWorld_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['set_m_rayToWorld'] = AllHitsRayResultCallback.prototype.set_m_rayToWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_AllHitsRayResultCallback_set_m_rayToWorld_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(AllHitsRayResultCallback.prototype, 'm_rayToWorld', { get: AllHitsRayResultCallback.prototype.get_m_rayToWorld, set: AllHitsRayResultCallback.prototype.set_m_rayToWorld });
/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['get_m_hitNormalWorld'] = AllHitsRayResultCallback.prototype.get_m_hitNormalWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_AllHitsRayResultCallback_get_m_hitNormalWorld_0(self), btVector3Array);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['set_m_hitNormalWorld'] = AllHitsRayResultCallback.prototype.set_m_hitNormalWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_AllHitsRayResultCallback_set_m_hitNormalWorld_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(AllHitsRayResultCallback.prototype, 'm_hitNormalWorld', { get: AllHitsRayResultCallback.prototype.get_m_hitNormalWorld, set: AllHitsRayResultCallback.prototype.set_m_hitNormalWorld });
/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['get_m_hitPointWorld'] = AllHitsRayResultCallback.prototype.get_m_hitPointWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_AllHitsRayResultCallback_get_m_hitPointWorld_0(self), btVector3Array);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['set_m_hitPointWorld'] = AllHitsRayResultCallback.prototype.set_m_hitPointWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_AllHitsRayResultCallback_set_m_hitPointWorld_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(AllHitsRayResultCallback.prototype, 'm_hitPointWorld', { get: AllHitsRayResultCallback.prototype.get_m_hitPointWorld, set: AllHitsRayResultCallback.prototype.set_m_hitPointWorld });
/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['get_m_hitFractions'] = AllHitsRayResultCallback.prototype.get_m_hitFractions = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_AllHitsRayResultCallback_get_m_hitFractions_0(self), btScalarArray);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['set_m_hitFractions'] = AllHitsRayResultCallback.prototype.set_m_hitFractions = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_AllHitsRayResultCallback_set_m_hitFractions_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(AllHitsRayResultCallback.prototype, 'm_hitFractions', { get: AllHitsRayResultCallback.prototype.get_m_hitFractions, set: AllHitsRayResultCallback.prototype.set_m_hitFractions });
/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['get_m_collisionFilterGroup'] = AllHitsRayResultCallback.prototype.get_m_collisionFilterGroup = function() {
  var self = this.ptr;
  return _emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterGroup_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['set_m_collisionFilterGroup'] = AllHitsRayResultCallback.prototype.set_m_collisionFilterGroup = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterGroup_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(AllHitsRayResultCallback.prototype, 'm_collisionFilterGroup', { get: AllHitsRayResultCallback.prototype.get_m_collisionFilterGroup, set: AllHitsRayResultCallback.prototype.set_m_collisionFilterGroup });
/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['get_m_collisionFilterMask'] = AllHitsRayResultCallback.prototype.get_m_collisionFilterMask = function() {
  var self = this.ptr;
  return _emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterMask_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['set_m_collisionFilterMask'] = AllHitsRayResultCallback.prototype.set_m_collisionFilterMask = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterMask_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(AllHitsRayResultCallback.prototype, 'm_collisionFilterMask', { get: AllHitsRayResultCallback.prototype.get_m_collisionFilterMask, set: AllHitsRayResultCallback.prototype.set_m_collisionFilterMask });
/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['get_m_closestHitFraction'] = AllHitsRayResultCallback.prototype.get_m_closestHitFraction = function() {
  var self = this.ptr;
  return _emscripten_bind_AllHitsRayResultCallback_get_m_closestHitFraction_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['set_m_closestHitFraction'] = AllHitsRayResultCallback.prototype.set_m_closestHitFraction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_AllHitsRayResultCallback_set_m_closestHitFraction_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(AllHitsRayResultCallback.prototype, 'm_closestHitFraction', { get: AllHitsRayResultCallback.prototype.get_m_closestHitFraction, set: AllHitsRayResultCallback.prototype.set_m_closestHitFraction });
/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['get_m_collisionObject'] = AllHitsRayResultCallback.prototype.get_m_collisionObject = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_AllHitsRayResultCallback_get_m_collisionObject_0(self), btCollisionObject);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['set_m_collisionObject'] = AllHitsRayResultCallback.prototype.set_m_collisionObject = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_AllHitsRayResultCallback_set_m_collisionObject_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(AllHitsRayResultCallback.prototype, 'm_collisionObject', { get: AllHitsRayResultCallback.prototype.get_m_collisionObject, set: AllHitsRayResultCallback.prototype.set_m_collisionObject });
/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['get_m_flags'] = AllHitsRayResultCallback.prototype.get_m_flags = function() {
  var self = this.ptr;
  return _emscripten_bind_AllHitsRayResultCallback_get_m_flags_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['set_m_flags'] = AllHitsRayResultCallback.prototype.set_m_flags = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_AllHitsRayResultCallback_set_m_flags_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(AllHitsRayResultCallback.prototype, 'm_flags', { get: AllHitsRayResultCallback.prototype.get_m_flags, set: AllHitsRayResultCallback.prototype.set_m_flags });

/** @suppress {undefinedVars, duplicate} @this{Object} */
AllHitsRayResultCallback.prototype['__destroy__'] = AllHitsRayResultCallback.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_AllHitsRayResultCallback___destroy___0(self);
};

// Interface: btManifoldPoint

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btManifoldPoint() { throw "cannot construct a btManifoldPoint, no constructor in IDL" }
btManifoldPoint.prototype = Object.create(WrapperObject.prototype);
btManifoldPoint.prototype.constructor = btManifoldPoint;
btManifoldPoint.prototype.__class__ = btManifoldPoint;
btManifoldPoint.__cache__ = {};
Module['btManifoldPoint'] = btManifoldPoint;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btManifoldPoint.prototype['getPositionWorldOnA'] = btManifoldPoint.prototype.getPositionWorldOnA = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_getPositionWorldOnA_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btManifoldPoint.prototype['getPositionWorldOnB'] = btManifoldPoint.prototype.getPositionWorldOnB = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_getPositionWorldOnB_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btManifoldPoint.prototype['getAppliedImpulse'] = btManifoldPoint.prototype.getAppliedImpulse = function() {
  var self = this.ptr;
  return _emscripten_bind_btManifoldPoint_getAppliedImpulse_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btManifoldPoint.prototype['getDistance'] = btManifoldPoint.prototype.getDistance = function() {
  var self = this.ptr;
  return _emscripten_bind_btManifoldPoint_getDistance_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btManifoldPoint.prototype['get_m_localPointA'] = btManifoldPoint.prototype.get_m_localPointA = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_get_m_localPointA_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btManifoldPoint.prototype['set_m_localPointA'] = btManifoldPoint.prototype.set_m_localPointA = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btManifoldPoint_set_m_localPointA_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btManifoldPoint.prototype, 'm_localPointA', { get: btManifoldPoint.prototype.get_m_localPointA, set: btManifoldPoint.prototype.set_m_localPointA });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btManifoldPoint.prototype['get_m_localPointB'] = btManifoldPoint.prototype.get_m_localPointB = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_get_m_localPointB_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btManifoldPoint.prototype['set_m_localPointB'] = btManifoldPoint.prototype.set_m_localPointB = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btManifoldPoint_set_m_localPointB_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btManifoldPoint.prototype, 'm_localPointB', { get: btManifoldPoint.prototype.get_m_localPointB, set: btManifoldPoint.prototype.set_m_localPointB });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btManifoldPoint.prototype['get_m_positionWorldOnB'] = btManifoldPoint.prototype.get_m_positionWorldOnB = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_get_m_positionWorldOnB_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btManifoldPoint.prototype['set_m_positionWorldOnB'] = btManifoldPoint.prototype.set_m_positionWorldOnB = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btManifoldPoint_set_m_positionWorldOnB_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btManifoldPoint.prototype, 'm_positionWorldOnB', { get: btManifoldPoint.prototype.get_m_positionWorldOnB, set: btManifoldPoint.prototype.set_m_positionWorldOnB });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btManifoldPoint.prototype['get_m_positionWorldOnA'] = btManifoldPoint.prototype.get_m_positionWorldOnA = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_get_m_positionWorldOnA_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btManifoldPoint.prototype['set_m_positionWorldOnA'] = btManifoldPoint.prototype.set_m_positionWorldOnA = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btManifoldPoint_set_m_positionWorldOnA_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btManifoldPoint.prototype, 'm_positionWorldOnA', { get: btManifoldPoint.prototype.get_m_positionWorldOnA, set: btManifoldPoint.prototype.set_m_positionWorldOnA });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btManifoldPoint.prototype['get_m_normalWorldOnB'] = btManifoldPoint.prototype.get_m_normalWorldOnB = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btManifoldPoint_get_m_normalWorldOnB_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btManifoldPoint.prototype['set_m_normalWorldOnB'] = btManifoldPoint.prototype.set_m_normalWorldOnB = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btManifoldPoint_set_m_normalWorldOnB_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btManifoldPoint.prototype, 'm_normalWorldOnB', { get: btManifoldPoint.prototype.get_m_normalWorldOnB, set: btManifoldPoint.prototype.set_m_normalWorldOnB });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btManifoldPoint.prototype['get_m_userPersistentData'] = btManifoldPoint.prototype.get_m_userPersistentData = function() {
  var self = this.ptr;
  return _emscripten_bind_btManifoldPoint_get_m_userPersistentData_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btManifoldPoint.prototype['set_m_userPersistentData'] = btManifoldPoint.prototype.set_m_userPersistentData = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btManifoldPoint_set_m_userPersistentData_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btManifoldPoint.prototype, 'm_userPersistentData', { get: btManifoldPoint.prototype.get_m_userPersistentData, set: btManifoldPoint.prototype.set_m_userPersistentData });

/** @suppress {undefinedVars, duplicate} @this{Object} */
btManifoldPoint.prototype['__destroy__'] = btManifoldPoint.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btManifoldPoint___destroy___0(self);
};

// Interface: ConcreteContactResultCallback

/** @suppress {undefinedVars, duplicate} @this{Object} */
function ConcreteContactResultCallback() {
  this.ptr = _emscripten_bind_ConcreteContactResultCallback_ConcreteContactResultCallback_0();
  getCache(ConcreteContactResultCallback)[this.ptr] = this;
};

ConcreteContactResultCallback.prototype = Object.create(ContactResultCallback.prototype);
ConcreteContactResultCallback.prototype.constructor = ConcreteContactResultCallback;
ConcreteContactResultCallback.prototype.__class__ = ConcreteContactResultCallback;
ConcreteContactResultCallback.__cache__ = {};
Module['ConcreteContactResultCallback'] = ConcreteContactResultCallback;
/** @suppress {undefinedVars, duplicate} @this{Object} */
ConcreteContactResultCallback.prototype['addSingleResult'] = ConcreteContactResultCallback.prototype.addSingleResult = function(cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1) {
  var self = this.ptr;
  if (cp && typeof cp === 'object') cp = cp.ptr;
  if (colObj0Wrap && typeof colObj0Wrap === 'object') colObj0Wrap = colObj0Wrap.ptr;
  if (partId0 && typeof partId0 === 'object') partId0 = partId0.ptr;
  if (index0 && typeof index0 === 'object') index0 = index0.ptr;
  if (colObj1Wrap && typeof colObj1Wrap === 'object') colObj1Wrap = colObj1Wrap.ptr;
  if (partId1 && typeof partId1 === 'object') partId1 = partId1.ptr;
  if (index1 && typeof index1 === 'object') index1 = index1.ptr;
  return _emscripten_bind_ConcreteContactResultCallback_addSingleResult_7(self, cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
ConcreteContactResultCallback.prototype['__destroy__'] = ConcreteContactResultCallback.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_ConcreteContactResultCallback___destroy___0(self);
};

// Interface: LocalShapeInfo

/** @suppress {undefinedVars, duplicate} @this{Object} */
function LocalShapeInfo() { throw "cannot construct a LocalShapeInfo, no constructor in IDL" }
LocalShapeInfo.prototype = Object.create(WrapperObject.prototype);
LocalShapeInfo.prototype.constructor = LocalShapeInfo;
LocalShapeInfo.prototype.__class__ = LocalShapeInfo;
LocalShapeInfo.__cache__ = {};
Module['LocalShapeInfo'] = LocalShapeInfo;
/** @suppress {undefinedVars, duplicate} @this{Object} */
LocalShapeInfo.prototype['get_m_shapePart'] = LocalShapeInfo.prototype.get_m_shapePart = function() {
  var self = this.ptr;
  return _emscripten_bind_LocalShapeInfo_get_m_shapePart_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
LocalShapeInfo.prototype['set_m_shapePart'] = LocalShapeInfo.prototype.set_m_shapePart = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalShapeInfo_set_m_shapePart_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(LocalShapeInfo.prototype, 'm_shapePart', { get: LocalShapeInfo.prototype.get_m_shapePart, set: LocalShapeInfo.prototype.set_m_shapePart });
/** @suppress {undefinedVars, duplicate} @this{Object} */
LocalShapeInfo.prototype['get_m_triangleIndex'] = LocalShapeInfo.prototype.get_m_triangleIndex = function() {
  var self = this.ptr;
  return _emscripten_bind_LocalShapeInfo_get_m_triangleIndex_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
LocalShapeInfo.prototype['set_m_triangleIndex'] = LocalShapeInfo.prototype.set_m_triangleIndex = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalShapeInfo_set_m_triangleIndex_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(LocalShapeInfo.prototype, 'm_triangleIndex', { get: LocalShapeInfo.prototype.get_m_triangleIndex, set: LocalShapeInfo.prototype.set_m_triangleIndex });

/** @suppress {undefinedVars, duplicate} @this{Object} */
LocalShapeInfo.prototype['__destroy__'] = LocalShapeInfo.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_LocalShapeInfo___destroy___0(self);
};

// Interface: LocalConvexResult

/** @suppress {undefinedVars, duplicate} @this{Object} */
function LocalConvexResult(hitCollisionObject, localShapeInfo, hitNormalLocal, hitPointLocal, hitFraction) {
  if (hitCollisionObject && typeof hitCollisionObject === 'object') hitCollisionObject = hitCollisionObject.ptr;
  if (localShapeInfo && typeof localShapeInfo === 'object') localShapeInfo = localShapeInfo.ptr;
  if (hitNormalLocal && typeof hitNormalLocal === 'object') hitNormalLocal = hitNormalLocal.ptr;
  if (hitPointLocal && typeof hitPointLocal === 'object') hitPointLocal = hitPointLocal.ptr;
  if (hitFraction && typeof hitFraction === 'object') hitFraction = hitFraction.ptr;
  this.ptr = _emscripten_bind_LocalConvexResult_LocalConvexResult_5(hitCollisionObject, localShapeInfo, hitNormalLocal, hitPointLocal, hitFraction);
  getCache(LocalConvexResult)[this.ptr] = this;
};

LocalConvexResult.prototype = Object.create(WrapperObject.prototype);
LocalConvexResult.prototype.constructor = LocalConvexResult;
LocalConvexResult.prototype.__class__ = LocalConvexResult;
LocalConvexResult.__cache__ = {};
Module['LocalConvexResult'] = LocalConvexResult;
/** @suppress {undefinedVars, duplicate} @this{Object} */
LocalConvexResult.prototype['get_m_hitCollisionObject'] = LocalConvexResult.prototype.get_m_hitCollisionObject = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_LocalConvexResult_get_m_hitCollisionObject_0(self), btCollisionObject);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
LocalConvexResult.prototype['set_m_hitCollisionObject'] = LocalConvexResult.prototype.set_m_hitCollisionObject = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalConvexResult_set_m_hitCollisionObject_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(LocalConvexResult.prototype, 'm_hitCollisionObject', { get: LocalConvexResult.prototype.get_m_hitCollisionObject, set: LocalConvexResult.prototype.set_m_hitCollisionObject });
/** @suppress {undefinedVars, duplicate} @this{Object} */
LocalConvexResult.prototype['get_m_localShapeInfo'] = LocalConvexResult.prototype.get_m_localShapeInfo = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_LocalConvexResult_get_m_localShapeInfo_0(self), LocalShapeInfo);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
LocalConvexResult.prototype['set_m_localShapeInfo'] = LocalConvexResult.prototype.set_m_localShapeInfo = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalConvexResult_set_m_localShapeInfo_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(LocalConvexResult.prototype, 'm_localShapeInfo', { get: LocalConvexResult.prototype.get_m_localShapeInfo, set: LocalConvexResult.prototype.set_m_localShapeInfo });
/** @suppress {undefinedVars, duplicate} @this{Object} */
LocalConvexResult.prototype['get_m_hitNormalLocal'] = LocalConvexResult.prototype.get_m_hitNormalLocal = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_LocalConvexResult_get_m_hitNormalLocal_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
LocalConvexResult.prototype['set_m_hitNormalLocal'] = LocalConvexResult.prototype.set_m_hitNormalLocal = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalConvexResult_set_m_hitNormalLocal_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(LocalConvexResult.prototype, 'm_hitNormalLocal', { get: LocalConvexResult.prototype.get_m_hitNormalLocal, set: LocalConvexResult.prototype.set_m_hitNormalLocal });
/** @suppress {undefinedVars, duplicate} @this{Object} */
LocalConvexResult.prototype['get_m_hitPointLocal'] = LocalConvexResult.prototype.get_m_hitPointLocal = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_LocalConvexResult_get_m_hitPointLocal_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
LocalConvexResult.prototype['set_m_hitPointLocal'] = LocalConvexResult.prototype.set_m_hitPointLocal = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalConvexResult_set_m_hitPointLocal_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(LocalConvexResult.prototype, 'm_hitPointLocal', { get: LocalConvexResult.prototype.get_m_hitPointLocal, set: LocalConvexResult.prototype.set_m_hitPointLocal });
/** @suppress {undefinedVars, duplicate} @this{Object} */
LocalConvexResult.prototype['get_m_hitFraction'] = LocalConvexResult.prototype.get_m_hitFraction = function() {
  var self = this.ptr;
  return _emscripten_bind_LocalConvexResult_get_m_hitFraction_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
LocalConvexResult.prototype['set_m_hitFraction'] = LocalConvexResult.prototype.set_m_hitFraction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_LocalConvexResult_set_m_hitFraction_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(LocalConvexResult.prototype, 'm_hitFraction', { get: LocalConvexResult.prototype.get_m_hitFraction, set: LocalConvexResult.prototype.set_m_hitFraction });

/** @suppress {undefinedVars, duplicate} @this{Object} */
LocalConvexResult.prototype['__destroy__'] = LocalConvexResult.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_LocalConvexResult___destroy___0(self);
};

// Interface: ClosestConvexResultCallback

/** @suppress {undefinedVars, duplicate} @this{Object} */
function ClosestConvexResultCallback(convexFromWorld, convexToWorld) {
  if (convexFromWorld && typeof convexFromWorld === 'object') convexFromWorld = convexFromWorld.ptr;
  if (convexToWorld && typeof convexToWorld === 'object') convexToWorld = convexToWorld.ptr;
  this.ptr = _emscripten_bind_ClosestConvexResultCallback_ClosestConvexResultCallback_2(convexFromWorld, convexToWorld);
  getCache(ClosestConvexResultCallback)[this.ptr] = this;
};

ClosestConvexResultCallback.prototype = Object.create(ConvexResultCallback.prototype);
ClosestConvexResultCallback.prototype.constructor = ClosestConvexResultCallback;
ClosestConvexResultCallback.prototype.__class__ = ClosestConvexResultCallback;
ClosestConvexResultCallback.__cache__ = {};
Module['ClosestConvexResultCallback'] = ClosestConvexResultCallback;
/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestConvexResultCallback.prototype['hasHit'] = ClosestConvexResultCallback.prototype.hasHit = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_ClosestConvexResultCallback_hasHit_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestConvexResultCallback.prototype['get_m_hitCollisionObject'] = ClosestConvexResultCallback.prototype.get_m_hitCollisionObject = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestConvexResultCallback_get_m_hitCollisionObject_0(self), btCollisionObject);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestConvexResultCallback.prototype['set_m_hitCollisionObject'] = ClosestConvexResultCallback.prototype.set_m_hitCollisionObject = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_hitCollisionObject_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ClosestConvexResultCallback.prototype, 'm_hitCollisionObject', { get: ClosestConvexResultCallback.prototype.get_m_hitCollisionObject, set: ClosestConvexResultCallback.prototype.set_m_hitCollisionObject });
/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestConvexResultCallback.prototype['get_m_convexFromWorld'] = ClosestConvexResultCallback.prototype.get_m_convexFromWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestConvexResultCallback_get_m_convexFromWorld_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestConvexResultCallback.prototype['set_m_convexFromWorld'] = ClosestConvexResultCallback.prototype.set_m_convexFromWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_convexFromWorld_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ClosestConvexResultCallback.prototype, 'm_convexFromWorld', { get: ClosestConvexResultCallback.prototype.get_m_convexFromWorld, set: ClosestConvexResultCallback.prototype.set_m_convexFromWorld });
/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestConvexResultCallback.prototype['get_m_convexToWorld'] = ClosestConvexResultCallback.prototype.get_m_convexToWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestConvexResultCallback_get_m_convexToWorld_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestConvexResultCallback.prototype['set_m_convexToWorld'] = ClosestConvexResultCallback.prototype.set_m_convexToWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_convexToWorld_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ClosestConvexResultCallback.prototype, 'm_convexToWorld', { get: ClosestConvexResultCallback.prototype.get_m_convexToWorld, set: ClosestConvexResultCallback.prototype.set_m_convexToWorld });
/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestConvexResultCallback.prototype['get_m_hitNormalWorld'] = ClosestConvexResultCallback.prototype.get_m_hitNormalWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestConvexResultCallback_get_m_hitNormalWorld_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestConvexResultCallback.prototype['set_m_hitNormalWorld'] = ClosestConvexResultCallback.prototype.set_m_hitNormalWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_hitNormalWorld_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ClosestConvexResultCallback.prototype, 'm_hitNormalWorld', { get: ClosestConvexResultCallback.prototype.get_m_hitNormalWorld, set: ClosestConvexResultCallback.prototype.set_m_hitNormalWorld });
/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestConvexResultCallback.prototype['get_m_hitPointWorld'] = ClosestConvexResultCallback.prototype.get_m_hitPointWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_ClosestConvexResultCallback_get_m_hitPointWorld_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestConvexResultCallback.prototype['set_m_hitPointWorld'] = ClosestConvexResultCallback.prototype.set_m_hitPointWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_hitPointWorld_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ClosestConvexResultCallback.prototype, 'm_hitPointWorld', { get: ClosestConvexResultCallback.prototype.get_m_hitPointWorld, set: ClosestConvexResultCallback.prototype.set_m_hitPointWorld });
/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestConvexResultCallback.prototype['get_m_collisionFilterGroup'] = ClosestConvexResultCallback.prototype.get_m_collisionFilterGroup = function() {
  var self = this.ptr;
  return _emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterGroup_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestConvexResultCallback.prototype['set_m_collisionFilterGroup'] = ClosestConvexResultCallback.prototype.set_m_collisionFilterGroup = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterGroup_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ClosestConvexResultCallback.prototype, 'm_collisionFilterGroup', { get: ClosestConvexResultCallback.prototype.get_m_collisionFilterGroup, set: ClosestConvexResultCallback.prototype.set_m_collisionFilterGroup });
/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestConvexResultCallback.prototype['get_m_collisionFilterMask'] = ClosestConvexResultCallback.prototype.get_m_collisionFilterMask = function() {
  var self = this.ptr;
  return _emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterMask_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestConvexResultCallback.prototype['set_m_collisionFilterMask'] = ClosestConvexResultCallback.prototype.set_m_collisionFilterMask = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterMask_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ClosestConvexResultCallback.prototype, 'm_collisionFilterMask', { get: ClosestConvexResultCallback.prototype.get_m_collisionFilterMask, set: ClosestConvexResultCallback.prototype.set_m_collisionFilterMask });
/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestConvexResultCallback.prototype['get_m_closestHitFraction'] = ClosestConvexResultCallback.prototype.get_m_closestHitFraction = function() {
  var self = this.ptr;
  return _emscripten_bind_ClosestConvexResultCallback_get_m_closestHitFraction_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestConvexResultCallback.prototype['set_m_closestHitFraction'] = ClosestConvexResultCallback.prototype.set_m_closestHitFraction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_ClosestConvexResultCallback_set_m_closestHitFraction_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ClosestConvexResultCallback.prototype, 'm_closestHitFraction', { get: ClosestConvexResultCallback.prototype.get_m_closestHitFraction, set: ClosestConvexResultCallback.prototype.set_m_closestHitFraction });

/** @suppress {undefinedVars, duplicate} @this{Object} */
ClosestConvexResultCallback.prototype['__destroy__'] = ClosestConvexResultCallback.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_ClosestConvexResultCallback___destroy___0(self);
};

// Interface: btConvexTriangleMeshShape

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btConvexTriangleMeshShape(meshInterface, calcAabb) {
  if (meshInterface && typeof meshInterface === 'object') meshInterface = meshInterface.ptr;
  if (calcAabb && typeof calcAabb === 'object') calcAabb = calcAabb.ptr;
  if (calcAabb === undefined) { this.ptr = _emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_1(meshInterface); getCache(btConvexTriangleMeshShape)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_2(meshInterface, calcAabb);
  getCache(btConvexTriangleMeshShape)[this.ptr] = this;
};

btConvexTriangleMeshShape.prototype = Object.create(btConvexShape.prototype);
btConvexTriangleMeshShape.prototype.constructor = btConvexTriangleMeshShape;
btConvexTriangleMeshShape.prototype.__class__ = btConvexTriangleMeshShape;
btConvexTriangleMeshShape.__cache__ = {};
Module['btConvexTriangleMeshShape'] = btConvexTriangleMeshShape;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexTriangleMeshShape.prototype['setLocalScaling'] = btConvexTriangleMeshShape.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btConvexTriangleMeshShape_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexTriangleMeshShape.prototype['getLocalScaling'] = btConvexTriangleMeshShape.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btConvexTriangleMeshShape_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexTriangleMeshShape.prototype['calculateLocalInertia'] = btConvexTriangleMeshShape.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btConvexTriangleMeshShape_calculateLocalInertia_2(self, mass, inertia);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexTriangleMeshShape.prototype['setMargin'] = btConvexTriangleMeshShape.prototype.setMargin = function(margin) {
  var self = this.ptr;
  if (margin && typeof margin === 'object') margin = margin.ptr;
  _emscripten_bind_btConvexTriangleMeshShape_setMargin_1(self, margin);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexTriangleMeshShape.prototype['getMargin'] = btConvexTriangleMeshShape.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btConvexTriangleMeshShape_getMargin_0(self);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexTriangleMeshShape.prototype['__destroy__'] = btConvexTriangleMeshShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConvexTriangleMeshShape___destroy___0(self);
};

// Interface: btBoxShape

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btBoxShape(boxHalfExtents) {
  if (boxHalfExtents && typeof boxHalfExtents === 'object') boxHalfExtents = boxHalfExtents.ptr;
  this.ptr = _emscripten_bind_btBoxShape_btBoxShape_1(boxHalfExtents);
  getCache(btBoxShape)[this.ptr] = this;
};

btBoxShape.prototype = Object.create(btCollisionShape.prototype);
btBoxShape.prototype.constructor = btBoxShape;
btBoxShape.prototype.__class__ = btBoxShape;
btBoxShape.__cache__ = {};
Module['btBoxShape'] = btBoxShape;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btBoxShape.prototype['setMargin'] = btBoxShape.prototype.setMargin = function(margin) {
  var self = this.ptr;
  if (margin && typeof margin === 'object') margin = margin.ptr;
  _emscripten_bind_btBoxShape_setMargin_1(self, margin);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btBoxShape.prototype['getMargin'] = btBoxShape.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btBoxShape_getMargin_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btBoxShape.prototype['setLocalScaling'] = btBoxShape.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btBoxShape_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btBoxShape.prototype['getLocalScaling'] = btBoxShape.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btBoxShape_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btBoxShape.prototype['calculateLocalInertia'] = btBoxShape.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btBoxShape_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btBoxShape.prototype['__destroy__'] = btBoxShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btBoxShape___destroy___0(self);
};

// Interface: btCapsuleShapeX

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btCapsuleShapeX(radius, height) {
  if (radius && typeof radius === 'object') radius = radius.ptr;
  if (height && typeof height === 'object') height = height.ptr;
  this.ptr = _emscripten_bind_btCapsuleShapeX_btCapsuleShapeX_2(radius, height);
  getCache(btCapsuleShapeX)[this.ptr] = this;
};

btCapsuleShapeX.prototype = Object.create(btCapsuleShape.prototype);
btCapsuleShapeX.prototype.constructor = btCapsuleShapeX;
btCapsuleShapeX.prototype.__class__ = btCapsuleShapeX;
btCapsuleShapeX.__cache__ = {};
Module['btCapsuleShapeX'] = btCapsuleShapeX;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShapeX.prototype['setMargin'] = btCapsuleShapeX.prototype.setMargin = function(margin) {
  var self = this.ptr;
  if (margin && typeof margin === 'object') margin = margin.ptr;
  _emscripten_bind_btCapsuleShapeX_setMargin_1(self, margin);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShapeX.prototype['getMargin'] = btCapsuleShapeX.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShapeX_getMargin_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShapeX.prototype['getUpAxis'] = btCapsuleShapeX.prototype.getUpAxis = function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShapeX_getUpAxis_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShapeX.prototype['getRadius'] = btCapsuleShapeX.prototype.getRadius = function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShapeX_getRadius_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShapeX.prototype['getHalfHeight'] = btCapsuleShapeX.prototype.getHalfHeight = function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShapeX_getHalfHeight_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShapeX.prototype['setLocalScaling'] = btCapsuleShapeX.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btCapsuleShapeX_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShapeX.prototype['getLocalScaling'] = btCapsuleShapeX.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCapsuleShapeX_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShapeX.prototype['calculateLocalInertia'] = btCapsuleShapeX.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btCapsuleShapeX_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShapeX.prototype['__destroy__'] = btCapsuleShapeX.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCapsuleShapeX___destroy___0(self);
};

// Interface: btCapsuleShapeZ

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btCapsuleShapeZ(radius, height) {
  if (radius && typeof radius === 'object') radius = radius.ptr;
  if (height && typeof height === 'object') height = height.ptr;
  this.ptr = _emscripten_bind_btCapsuleShapeZ_btCapsuleShapeZ_2(radius, height);
  getCache(btCapsuleShapeZ)[this.ptr] = this;
};

btCapsuleShapeZ.prototype = Object.create(btCapsuleShape.prototype);
btCapsuleShapeZ.prototype.constructor = btCapsuleShapeZ;
btCapsuleShapeZ.prototype.__class__ = btCapsuleShapeZ;
btCapsuleShapeZ.__cache__ = {};
Module['btCapsuleShapeZ'] = btCapsuleShapeZ;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShapeZ.prototype['setMargin'] = btCapsuleShapeZ.prototype.setMargin = function(margin) {
  var self = this.ptr;
  if (margin && typeof margin === 'object') margin = margin.ptr;
  _emscripten_bind_btCapsuleShapeZ_setMargin_1(self, margin);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShapeZ.prototype['getMargin'] = btCapsuleShapeZ.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShapeZ_getMargin_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShapeZ.prototype['getUpAxis'] = btCapsuleShapeZ.prototype.getUpAxis = function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShapeZ_getUpAxis_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShapeZ.prototype['getRadius'] = btCapsuleShapeZ.prototype.getRadius = function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShapeZ_getRadius_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShapeZ.prototype['getHalfHeight'] = btCapsuleShapeZ.prototype.getHalfHeight = function() {
  var self = this.ptr;
  return _emscripten_bind_btCapsuleShapeZ_getHalfHeight_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShapeZ.prototype['setLocalScaling'] = btCapsuleShapeZ.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btCapsuleShapeZ_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShapeZ.prototype['getLocalScaling'] = btCapsuleShapeZ.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCapsuleShapeZ_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShapeZ.prototype['calculateLocalInertia'] = btCapsuleShapeZ.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btCapsuleShapeZ_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btCapsuleShapeZ.prototype['__destroy__'] = btCapsuleShapeZ.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCapsuleShapeZ___destroy___0(self);
};

// Interface: btCylinderShapeX

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btCylinderShapeX(halfExtents) {
  if (halfExtents && typeof halfExtents === 'object') halfExtents = halfExtents.ptr;
  this.ptr = _emscripten_bind_btCylinderShapeX_btCylinderShapeX_1(halfExtents);
  getCache(btCylinderShapeX)[this.ptr] = this;
};

btCylinderShapeX.prototype = Object.create(btCylinderShape.prototype);
btCylinderShapeX.prototype.constructor = btCylinderShapeX;
btCylinderShapeX.prototype.__class__ = btCylinderShapeX;
btCylinderShapeX.__cache__ = {};
Module['btCylinderShapeX'] = btCylinderShapeX;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btCylinderShapeX.prototype['setMargin'] = btCylinderShapeX.prototype.setMargin = function(margin) {
  var self = this.ptr;
  if (margin && typeof margin === 'object') margin = margin.ptr;
  _emscripten_bind_btCylinderShapeX_setMargin_1(self, margin);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCylinderShapeX.prototype['getMargin'] = btCylinderShapeX.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btCylinderShapeX_getMargin_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCylinderShapeX.prototype['setLocalScaling'] = btCylinderShapeX.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btCylinderShapeX_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCylinderShapeX.prototype['getLocalScaling'] = btCylinderShapeX.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCylinderShapeX_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCylinderShapeX.prototype['calculateLocalInertia'] = btCylinderShapeX.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btCylinderShapeX_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btCylinderShapeX.prototype['__destroy__'] = btCylinderShapeX.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCylinderShapeX___destroy___0(self);
};

// Interface: btCylinderShapeZ

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btCylinderShapeZ(halfExtents) {
  if (halfExtents && typeof halfExtents === 'object') halfExtents = halfExtents.ptr;
  this.ptr = _emscripten_bind_btCylinderShapeZ_btCylinderShapeZ_1(halfExtents);
  getCache(btCylinderShapeZ)[this.ptr] = this;
};

btCylinderShapeZ.prototype = Object.create(btCylinderShape.prototype);
btCylinderShapeZ.prototype.constructor = btCylinderShapeZ;
btCylinderShapeZ.prototype.__class__ = btCylinderShapeZ;
btCylinderShapeZ.__cache__ = {};
Module['btCylinderShapeZ'] = btCylinderShapeZ;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btCylinderShapeZ.prototype['setMargin'] = btCylinderShapeZ.prototype.setMargin = function(margin) {
  var self = this.ptr;
  if (margin && typeof margin === 'object') margin = margin.ptr;
  _emscripten_bind_btCylinderShapeZ_setMargin_1(self, margin);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCylinderShapeZ.prototype['getMargin'] = btCylinderShapeZ.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btCylinderShapeZ_getMargin_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCylinderShapeZ.prototype['setLocalScaling'] = btCylinderShapeZ.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btCylinderShapeZ_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCylinderShapeZ.prototype['getLocalScaling'] = btCylinderShapeZ.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCylinderShapeZ_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCylinderShapeZ.prototype['calculateLocalInertia'] = btCylinderShapeZ.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btCylinderShapeZ_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btCylinderShapeZ.prototype['__destroy__'] = btCylinderShapeZ.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCylinderShapeZ___destroy___0(self);
};

// Interface: btSphereShape

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btSphereShape(radius) {
  if (radius && typeof radius === 'object') radius = radius.ptr;
  this.ptr = _emscripten_bind_btSphereShape_btSphereShape_1(radius);
  getCache(btSphereShape)[this.ptr] = this;
};

btSphereShape.prototype = Object.create(btCollisionShape.prototype);
btSphereShape.prototype.constructor = btSphereShape;
btSphereShape.prototype.__class__ = btSphereShape;
btSphereShape.__cache__ = {};
Module['btSphereShape'] = btSphereShape;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btSphereShape.prototype['setMargin'] = btSphereShape.prototype.setMargin = function(margin) {
  var self = this.ptr;
  if (margin && typeof margin === 'object') margin = margin.ptr;
  _emscripten_bind_btSphereShape_setMargin_1(self, margin);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSphereShape.prototype['getMargin'] = btSphereShape.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btSphereShape_getMargin_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSphereShape.prototype['setLocalScaling'] = btSphereShape.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btSphereShape_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSphereShape.prototype['getLocalScaling'] = btSphereShape.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSphereShape_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSphereShape.prototype['calculateLocalInertia'] = btSphereShape.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btSphereShape_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btSphereShape.prototype['__destroy__'] = btSphereShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btSphereShape___destroy___0(self);
};

// Interface: btMultiSphereShape

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btMultiSphereShape(positions, radii, numPoints) {
  ensureCache.prepare();
  if (positions && typeof positions === 'object') positions = positions.ptr;
  if (typeof radii == 'object') { radii = ensureFloat32(radii); }
  if (numPoints && typeof numPoints === 'object') numPoints = numPoints.ptr;
  this.ptr = _emscripten_bind_btMultiSphereShape_btMultiSphereShape_3(positions, radii, numPoints);
  getCache(btMultiSphereShape)[this.ptr] = this;
};

btMultiSphereShape.prototype = Object.create(btCollisionShape.prototype);
btMultiSphereShape.prototype.constructor = btMultiSphereShape;
btMultiSphereShape.prototype.__class__ = btMultiSphereShape;
btMultiSphereShape.__cache__ = {};
Module['btMultiSphereShape'] = btMultiSphereShape;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btMultiSphereShape.prototype['setLocalScaling'] = btMultiSphereShape.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btMultiSphereShape_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btMultiSphereShape.prototype['getLocalScaling'] = btMultiSphereShape.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btMultiSphereShape_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btMultiSphereShape.prototype['calculateLocalInertia'] = btMultiSphereShape.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btMultiSphereShape_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btMultiSphereShape.prototype['__destroy__'] = btMultiSphereShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btMultiSphereShape___destroy___0(self);
};

// Interface: btConeShapeX

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btConeShapeX(radius, height) {
  if (radius && typeof radius === 'object') radius = radius.ptr;
  if (height && typeof height === 'object') height = height.ptr;
  this.ptr = _emscripten_bind_btConeShapeX_btConeShapeX_2(radius, height);
  getCache(btConeShapeX)[this.ptr] = this;
};

btConeShapeX.prototype = Object.create(btConeShape.prototype);
btConeShapeX.prototype.constructor = btConeShapeX;
btConeShapeX.prototype.__class__ = btConeShapeX;
btConeShapeX.__cache__ = {};
Module['btConeShapeX'] = btConeShapeX;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeShapeX.prototype['setLocalScaling'] = btConeShapeX.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btConeShapeX_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeShapeX.prototype['getLocalScaling'] = btConeShapeX.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btConeShapeX_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeShapeX.prototype['calculateLocalInertia'] = btConeShapeX.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btConeShapeX_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeShapeX.prototype['__destroy__'] = btConeShapeX.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConeShapeX___destroy___0(self);
};

// Interface: btConeShapeZ

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btConeShapeZ(radius, height) {
  if (radius && typeof radius === 'object') radius = radius.ptr;
  if (height && typeof height === 'object') height = height.ptr;
  this.ptr = _emscripten_bind_btConeShapeZ_btConeShapeZ_2(radius, height);
  getCache(btConeShapeZ)[this.ptr] = this;
};

btConeShapeZ.prototype = Object.create(btConeShape.prototype);
btConeShapeZ.prototype.constructor = btConeShapeZ;
btConeShapeZ.prototype.__class__ = btConeShapeZ;
btConeShapeZ.__cache__ = {};
Module['btConeShapeZ'] = btConeShapeZ;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeShapeZ.prototype['setLocalScaling'] = btConeShapeZ.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btConeShapeZ_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeShapeZ.prototype['getLocalScaling'] = btConeShapeZ.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btConeShapeZ_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeShapeZ.prototype['calculateLocalInertia'] = btConeShapeZ.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btConeShapeZ_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeShapeZ.prototype['__destroy__'] = btConeShapeZ.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConeShapeZ___destroy___0(self);
};

// Interface: btIntArray

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btIntArray() { throw "cannot construct a btIntArray, no constructor in IDL" }
btIntArray.prototype = Object.create(WrapperObject.prototype);
btIntArray.prototype.constructor = btIntArray;
btIntArray.prototype.__class__ = btIntArray;
btIntArray.__cache__ = {};
Module['btIntArray'] = btIntArray;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btIntArray.prototype['size'] = btIntArray.prototype.size = function() {
  var self = this.ptr;
  return _emscripten_bind_btIntArray_size_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btIntArray.prototype['at'] = btIntArray.prototype.at = function(n) {
  var self = this.ptr;
  if (n && typeof n === 'object') n = n.ptr;
  return _emscripten_bind_btIntArray_at_1(self, n);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btIntArray.prototype['__destroy__'] = btIntArray.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btIntArray___destroy___0(self);
};

// Interface: btFace

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btFace() { throw "cannot construct a btFace, no constructor in IDL" }
btFace.prototype = Object.create(WrapperObject.prototype);
btFace.prototype.constructor = btFace;
btFace.prototype.__class__ = btFace;
btFace.__cache__ = {};
Module['btFace'] = btFace;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btFace.prototype['get_m_indices'] = btFace.prototype.get_m_indices = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btFace_get_m_indices_0(self), btIntArray);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btFace.prototype['set_m_indices'] = btFace.prototype.set_m_indices = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btFace_set_m_indices_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btFace.prototype, 'm_indices', { get: btFace.prototype.get_m_indices, set: btFace.prototype.set_m_indices });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btFace.prototype['get_m_plane'] = btFace.prototype.get_m_plane = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return _emscripten_bind_btFace_get_m_plane_1(self, arg0);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btFace.prototype['set_m_plane'] = btFace.prototype.set_m_plane = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_btFace_set_m_plane_2(self, arg0, arg1);
};

/** @suppress {checkTypes} */
Object.defineProperty(btFace.prototype, 'm_plane', { get: btFace.prototype.get_m_plane, set: btFace.prototype.set_m_plane });

/** @suppress {undefinedVars, duplicate} @this{Object} */
btFace.prototype['__destroy__'] = btFace.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btFace___destroy___0(self);
};

// Interface: btVector3Array

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btVector3Array() { throw "cannot construct a btVector3Array, no constructor in IDL" }
btVector3Array.prototype = Object.create(WrapperObject.prototype);
btVector3Array.prototype.constructor = btVector3Array;
btVector3Array.prototype.__class__ = btVector3Array;
btVector3Array.__cache__ = {};
Module['btVector3Array'] = btVector3Array;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector3Array.prototype['size'] = btVector3Array.prototype.size = function() {
  var self = this.ptr;
  return _emscripten_bind_btVector3Array_size_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector3Array.prototype['at'] = btVector3Array.prototype.at = function(n) {
  var self = this.ptr;
  if (n && typeof n === 'object') n = n.ptr;
  return wrapPointer(_emscripten_bind_btVector3Array_at_1(self, n), btVector3);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btVector3Array.prototype['__destroy__'] = btVector3Array.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btVector3Array___destroy___0(self);
};

// Interface: btFaceArray

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btFaceArray() { throw "cannot construct a btFaceArray, no constructor in IDL" }
btFaceArray.prototype = Object.create(WrapperObject.prototype);
btFaceArray.prototype.constructor = btFaceArray;
btFaceArray.prototype.__class__ = btFaceArray;
btFaceArray.__cache__ = {};
Module['btFaceArray'] = btFaceArray;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btFaceArray.prototype['size'] = btFaceArray.prototype.size = function() {
  var self = this.ptr;
  return _emscripten_bind_btFaceArray_size_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btFaceArray.prototype['at'] = btFaceArray.prototype.at = function(n) {
  var self = this.ptr;
  if (n && typeof n === 'object') n = n.ptr;
  return wrapPointer(_emscripten_bind_btFaceArray_at_1(self, n), btFace);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btFaceArray.prototype['__destroy__'] = btFaceArray.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btFaceArray___destroy___0(self);
};

// Interface: btConvexPolyhedron

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btConvexPolyhedron() { throw "cannot construct a btConvexPolyhedron, no constructor in IDL" }
btConvexPolyhedron.prototype = Object.create(WrapperObject.prototype);
btConvexPolyhedron.prototype.constructor = btConvexPolyhedron;
btConvexPolyhedron.prototype.__class__ = btConvexPolyhedron;
btConvexPolyhedron.__cache__ = {};
Module['btConvexPolyhedron'] = btConvexPolyhedron;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexPolyhedron.prototype['get_m_vertices'] = btConvexPolyhedron.prototype.get_m_vertices = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btConvexPolyhedron_get_m_vertices_0(self), btVector3Array);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexPolyhedron.prototype['set_m_vertices'] = btConvexPolyhedron.prototype.set_m_vertices = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConvexPolyhedron_set_m_vertices_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btConvexPolyhedron.prototype, 'm_vertices', { get: btConvexPolyhedron.prototype.get_m_vertices, set: btConvexPolyhedron.prototype.set_m_vertices });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexPolyhedron.prototype['get_m_faces'] = btConvexPolyhedron.prototype.get_m_faces = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btConvexPolyhedron_get_m_faces_0(self), btFaceArray);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexPolyhedron.prototype['set_m_faces'] = btConvexPolyhedron.prototype.set_m_faces = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConvexPolyhedron_set_m_faces_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btConvexPolyhedron.prototype, 'm_faces', { get: btConvexPolyhedron.prototype.get_m_faces, set: btConvexPolyhedron.prototype.set_m_faces });

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexPolyhedron.prototype['__destroy__'] = btConvexPolyhedron.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConvexPolyhedron___destroy___0(self);
};

// Interface: btConvexHullShape

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btConvexHullShape(points, numPoints) {
  ensureCache.prepare();
  if (typeof points == 'object') { points = ensureFloat32(points); }
  if (numPoints && typeof numPoints === 'object') numPoints = numPoints.ptr;
  if (points === undefined) { this.ptr = _emscripten_bind_btConvexHullShape_btConvexHullShape_0(); getCache(btConvexHullShape)[this.ptr] = this;return }
  if (numPoints === undefined) { this.ptr = _emscripten_bind_btConvexHullShape_btConvexHullShape_1(points); getCache(btConvexHullShape)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btConvexHullShape_btConvexHullShape_2(points, numPoints);
  getCache(btConvexHullShape)[this.ptr] = this;
};

btConvexHullShape.prototype = Object.create(btCollisionShape.prototype);
btConvexHullShape.prototype.constructor = btConvexHullShape;
btConvexHullShape.prototype.__class__ = btConvexHullShape;
btConvexHullShape.__cache__ = {};
Module['btConvexHullShape'] = btConvexHullShape;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexHullShape.prototype['addPoint'] = btConvexHullShape.prototype.addPoint = function(point, recalculateLocalAABB) {
  var self = this.ptr;
  if (point && typeof point === 'object') point = point.ptr;
  if (recalculateLocalAABB && typeof recalculateLocalAABB === 'object') recalculateLocalAABB = recalculateLocalAABB.ptr;
  if (recalculateLocalAABB === undefined) { _emscripten_bind_btConvexHullShape_addPoint_1(self, point); return }
  _emscripten_bind_btConvexHullShape_addPoint_2(self, point, recalculateLocalAABB);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexHullShape.prototype['setMargin'] = btConvexHullShape.prototype.setMargin = function(margin) {
  var self = this.ptr;
  if (margin && typeof margin === 'object') margin = margin.ptr;
  _emscripten_bind_btConvexHullShape_setMargin_1(self, margin);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexHullShape.prototype['getMargin'] = btConvexHullShape.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btConvexHullShape_getMargin_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexHullShape.prototype['getNumVertices'] = btConvexHullShape.prototype.getNumVertices = function() {
  var self = this.ptr;
  return _emscripten_bind_btConvexHullShape_getNumVertices_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexHullShape.prototype['initializePolyhedralFeatures'] = btConvexHullShape.prototype.initializePolyhedralFeatures = function(shiftVerticesByMargin) {
  var self = this.ptr;
  if (shiftVerticesByMargin && typeof shiftVerticesByMargin === 'object') shiftVerticesByMargin = shiftVerticesByMargin.ptr;
  return !!(_emscripten_bind_btConvexHullShape_initializePolyhedralFeatures_1(self, shiftVerticesByMargin));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexHullShape.prototype['recalcLocalAabb'] = btConvexHullShape.prototype.recalcLocalAabb = function() {
  var self = this.ptr;
  _emscripten_bind_btConvexHullShape_recalcLocalAabb_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexHullShape.prototype['getConvexPolyhedron'] = btConvexHullShape.prototype.getConvexPolyhedron = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btConvexHullShape_getConvexPolyhedron_0(self), btConvexPolyhedron);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexHullShape.prototype['setLocalScaling'] = btConvexHullShape.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btConvexHullShape_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexHullShape.prototype['getLocalScaling'] = btConvexHullShape.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btConvexHullShape_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexHullShape.prototype['calculateLocalInertia'] = btConvexHullShape.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btConvexHullShape_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btConvexHullShape.prototype['__destroy__'] = btConvexHullShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConvexHullShape___destroy___0(self);
};

// Interface: btShapeHull

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btShapeHull(shape) {
  if (shape && typeof shape === 'object') shape = shape.ptr;
  this.ptr = _emscripten_bind_btShapeHull_btShapeHull_1(shape);
  getCache(btShapeHull)[this.ptr] = this;
};

btShapeHull.prototype = Object.create(WrapperObject.prototype);
btShapeHull.prototype.constructor = btShapeHull;
btShapeHull.prototype.__class__ = btShapeHull;
btShapeHull.__cache__ = {};
Module['btShapeHull'] = btShapeHull;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btShapeHull.prototype['buildHull'] = btShapeHull.prototype.buildHull = function(margin) {
  var self = this.ptr;
  if (margin && typeof margin === 'object') margin = margin.ptr;
  return !!(_emscripten_bind_btShapeHull_buildHull_1(self, margin));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btShapeHull.prototype['numVertices'] = btShapeHull.prototype.numVertices = function() {
  var self = this.ptr;
  return _emscripten_bind_btShapeHull_numVertices_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btShapeHull.prototype['getVertexPointer'] = btShapeHull.prototype.getVertexPointer = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btShapeHull_getVertexPointer_0(self), btVector3);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btShapeHull.prototype['__destroy__'] = btShapeHull.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btShapeHull___destroy___0(self);
};

// Interface: btCompoundShape

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btCompoundShape(enableDynamicAabbTree) {
  if (enableDynamicAabbTree && typeof enableDynamicAabbTree === 'object') enableDynamicAabbTree = enableDynamicAabbTree.ptr;
  if (enableDynamicAabbTree === undefined) { this.ptr = _emscripten_bind_btCompoundShape_btCompoundShape_0(); getCache(btCompoundShape)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btCompoundShape_btCompoundShape_1(enableDynamicAabbTree);
  getCache(btCompoundShape)[this.ptr] = this;
};

btCompoundShape.prototype = Object.create(btCollisionShape.prototype);
btCompoundShape.prototype.constructor = btCompoundShape;
btCompoundShape.prototype.__class__ = btCompoundShape;
btCompoundShape.__cache__ = {};
Module['btCompoundShape'] = btCompoundShape;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btCompoundShape.prototype['addChildShape'] = btCompoundShape.prototype.addChildShape = function(localTransform, shape) {
  var self = this.ptr;
  if (localTransform && typeof localTransform === 'object') localTransform = localTransform.ptr;
  if (shape && typeof shape === 'object') shape = shape.ptr;
  _emscripten_bind_btCompoundShape_addChildShape_2(self, localTransform, shape);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCompoundShape.prototype['removeChildShape'] = btCompoundShape.prototype.removeChildShape = function(shape) {
  var self = this.ptr;
  if (shape && typeof shape === 'object') shape = shape.ptr;
  _emscripten_bind_btCompoundShape_removeChildShape_1(self, shape);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCompoundShape.prototype['removeChildShapeByIndex'] = btCompoundShape.prototype.removeChildShapeByIndex = function(childShapeindex) {
  var self = this.ptr;
  if (childShapeindex && typeof childShapeindex === 'object') childShapeindex = childShapeindex.ptr;
  _emscripten_bind_btCompoundShape_removeChildShapeByIndex_1(self, childShapeindex);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCompoundShape.prototype['getNumChildShapes'] = btCompoundShape.prototype.getNumChildShapes = function() {
  var self = this.ptr;
  return _emscripten_bind_btCompoundShape_getNumChildShapes_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCompoundShape.prototype['getChildShape'] = btCompoundShape.prototype.getChildShape = function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_btCompoundShape_getChildShape_1(self, index), btCollisionShape);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCompoundShape.prototype['updateChildTransform'] = btCompoundShape.prototype.updateChildTransform = function(childIndex, newChildTransform, shouldRecalculateLocalAabb) {
  var self = this.ptr;
  if (childIndex && typeof childIndex === 'object') childIndex = childIndex.ptr;
  if (newChildTransform && typeof newChildTransform === 'object') newChildTransform = newChildTransform.ptr;
  if (shouldRecalculateLocalAabb && typeof shouldRecalculateLocalAabb === 'object') shouldRecalculateLocalAabb = shouldRecalculateLocalAabb.ptr;
  if (shouldRecalculateLocalAabb === undefined) { _emscripten_bind_btCompoundShape_updateChildTransform_2(self, childIndex, newChildTransform); return }
  _emscripten_bind_btCompoundShape_updateChildTransform_3(self, childIndex, newChildTransform, shouldRecalculateLocalAabb);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCompoundShape.prototype['setMargin'] = btCompoundShape.prototype.setMargin = function(margin) {
  var self = this.ptr;
  if (margin && typeof margin === 'object') margin = margin.ptr;
  _emscripten_bind_btCompoundShape_setMargin_1(self, margin);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCompoundShape.prototype['getMargin'] = btCompoundShape.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btCompoundShape_getMargin_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCompoundShape.prototype['setLocalScaling'] = btCompoundShape.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btCompoundShape_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCompoundShape.prototype['getLocalScaling'] = btCompoundShape.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCompoundShape_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCompoundShape.prototype['calculateLocalInertia'] = btCompoundShape.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btCompoundShape_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btCompoundShape.prototype['__destroy__'] = btCompoundShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCompoundShape___destroy___0(self);
};

// Interface: btIndexedMesh

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btIndexedMesh() { throw "cannot construct a btIndexedMesh, no constructor in IDL" }
btIndexedMesh.prototype = Object.create(WrapperObject.prototype);
btIndexedMesh.prototype.constructor = btIndexedMesh;
btIndexedMesh.prototype.__class__ = btIndexedMesh;
btIndexedMesh.__cache__ = {};
Module['btIndexedMesh'] = btIndexedMesh;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btIndexedMesh.prototype['get_m_numTriangles'] = btIndexedMesh.prototype.get_m_numTriangles = function() {
  var self = this.ptr;
  return _emscripten_bind_btIndexedMesh_get_m_numTriangles_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btIndexedMesh.prototype['set_m_numTriangles'] = btIndexedMesh.prototype.set_m_numTriangles = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btIndexedMesh_set_m_numTriangles_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btIndexedMesh.prototype, 'm_numTriangles', { get: btIndexedMesh.prototype.get_m_numTriangles, set: btIndexedMesh.prototype.set_m_numTriangles });

/** @suppress {undefinedVars, duplicate} @this{Object} */
btIndexedMesh.prototype['__destroy__'] = btIndexedMesh.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btIndexedMesh___destroy___0(self);
};

// Interface: btIndexedMeshArray

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btIndexedMeshArray() { throw "cannot construct a btIndexedMeshArray, no constructor in IDL" }
btIndexedMeshArray.prototype = Object.create(WrapperObject.prototype);
btIndexedMeshArray.prototype.constructor = btIndexedMeshArray;
btIndexedMeshArray.prototype.__class__ = btIndexedMeshArray;
btIndexedMeshArray.__cache__ = {};
Module['btIndexedMeshArray'] = btIndexedMeshArray;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btIndexedMeshArray.prototype['size'] = btIndexedMeshArray.prototype.size = function() {
  var self = this.ptr;
  return _emscripten_bind_btIndexedMeshArray_size_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btIndexedMeshArray.prototype['at'] = btIndexedMeshArray.prototype.at = function(n) {
  var self = this.ptr;
  if (n && typeof n === 'object') n = n.ptr;
  return wrapPointer(_emscripten_bind_btIndexedMeshArray_at_1(self, n), btIndexedMesh);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btIndexedMeshArray.prototype['__destroy__'] = btIndexedMeshArray.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btIndexedMeshArray___destroy___0(self);
};

// Interface: btTriangleMesh

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btTriangleMesh(use32bitIndices, use4componentVertices) {
  if (use32bitIndices && typeof use32bitIndices === 'object') use32bitIndices = use32bitIndices.ptr;
  if (use4componentVertices && typeof use4componentVertices === 'object') use4componentVertices = use4componentVertices.ptr;
  if (use32bitIndices === undefined) { this.ptr = _emscripten_bind_btTriangleMesh_btTriangleMesh_0(); getCache(btTriangleMesh)[this.ptr] = this;return }
  if (use4componentVertices === undefined) { this.ptr = _emscripten_bind_btTriangleMesh_btTriangleMesh_1(use32bitIndices); getCache(btTriangleMesh)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btTriangleMesh_btTriangleMesh_2(use32bitIndices, use4componentVertices);
  getCache(btTriangleMesh)[this.ptr] = this;
};

btTriangleMesh.prototype = Object.create(btStridingMeshInterface.prototype);
btTriangleMesh.prototype.constructor = btTriangleMesh;
btTriangleMesh.prototype.__class__ = btTriangleMesh;
btTriangleMesh.__cache__ = {};
Module['btTriangleMesh'] = btTriangleMesh;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btTriangleMesh.prototype['addTriangle'] = btTriangleMesh.prototype.addTriangle = function(vertex0, vertex1, vertex2, removeDuplicateVertices) {
  var self = this.ptr;
  if (vertex0 && typeof vertex0 === 'object') vertex0 = vertex0.ptr;
  if (vertex1 && typeof vertex1 === 'object') vertex1 = vertex1.ptr;
  if (vertex2 && typeof vertex2 === 'object') vertex2 = vertex2.ptr;
  if (removeDuplicateVertices && typeof removeDuplicateVertices === 'object') removeDuplicateVertices = removeDuplicateVertices.ptr;
  if (removeDuplicateVertices === undefined) { _emscripten_bind_btTriangleMesh_addTriangle_3(self, vertex0, vertex1, vertex2); return }
  _emscripten_bind_btTriangleMesh_addTriangle_4(self, vertex0, vertex1, vertex2, removeDuplicateVertices);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btTriangleMesh.prototype['findOrAddVertex'] = btTriangleMesh.prototype.findOrAddVertex = function(vertex, removeDuplicateVertices) {
  var self = this.ptr;
  if (vertex && typeof vertex === 'object') vertex = vertex.ptr;
  if (removeDuplicateVertices && typeof removeDuplicateVertices === 'object') removeDuplicateVertices = removeDuplicateVertices.ptr;
  return _emscripten_bind_btTriangleMesh_findOrAddVertex_2(self, vertex, removeDuplicateVertices);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btTriangleMesh.prototype['addIndex'] = btTriangleMesh.prototype.addIndex = function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  _emscripten_bind_btTriangleMesh_addIndex_1(self, index);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btTriangleMesh.prototype['getIndexedMeshArray'] = btTriangleMesh.prototype.getIndexedMeshArray = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btTriangleMesh_getIndexedMeshArray_0(self), btIndexedMeshArray);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btTriangleMesh.prototype['setScaling'] = btTriangleMesh.prototype.setScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btTriangleMesh_setScaling_1(self, scaling);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btTriangleMesh.prototype['__destroy__'] = btTriangleMesh.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btTriangleMesh___destroy___0(self);
};

// Interface: btEmptyShape

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btEmptyShape() {
  this.ptr = _emscripten_bind_btEmptyShape_btEmptyShape_0();
  getCache(btEmptyShape)[this.ptr] = this;
};

btEmptyShape.prototype = Object.create(btConcaveShape.prototype);
btEmptyShape.prototype.constructor = btEmptyShape;
btEmptyShape.prototype.__class__ = btEmptyShape;
btEmptyShape.__cache__ = {};
Module['btEmptyShape'] = btEmptyShape;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btEmptyShape.prototype['setLocalScaling'] = btEmptyShape.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btEmptyShape_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btEmptyShape.prototype['getLocalScaling'] = btEmptyShape.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btEmptyShape_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btEmptyShape.prototype['calculateLocalInertia'] = btEmptyShape.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btEmptyShape_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btEmptyShape.prototype['__destroy__'] = btEmptyShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btEmptyShape___destroy___0(self);
};

// Interface: btStaticPlaneShape

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btStaticPlaneShape(planeNormal, planeConstant) {
  if (planeNormal && typeof planeNormal === 'object') planeNormal = planeNormal.ptr;
  if (planeConstant && typeof planeConstant === 'object') planeConstant = planeConstant.ptr;
  this.ptr = _emscripten_bind_btStaticPlaneShape_btStaticPlaneShape_2(planeNormal, planeConstant);
  getCache(btStaticPlaneShape)[this.ptr] = this;
};

btStaticPlaneShape.prototype = Object.create(btConcaveShape.prototype);
btStaticPlaneShape.prototype.constructor = btStaticPlaneShape;
btStaticPlaneShape.prototype.__class__ = btStaticPlaneShape;
btStaticPlaneShape.__cache__ = {};
Module['btStaticPlaneShape'] = btStaticPlaneShape;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btStaticPlaneShape.prototype['setLocalScaling'] = btStaticPlaneShape.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btStaticPlaneShape_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btStaticPlaneShape.prototype['getLocalScaling'] = btStaticPlaneShape.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btStaticPlaneShape_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btStaticPlaneShape.prototype['calculateLocalInertia'] = btStaticPlaneShape.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btStaticPlaneShape_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btStaticPlaneShape.prototype['__destroy__'] = btStaticPlaneShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btStaticPlaneShape___destroy___0(self);
};

// Interface: btBvhTriangleMeshShape

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btBvhTriangleMeshShape(meshInterface, useQuantizedAabbCompression, buildBvh) {
  if (meshInterface && typeof meshInterface === 'object') meshInterface = meshInterface.ptr;
  if (useQuantizedAabbCompression && typeof useQuantizedAabbCompression === 'object') useQuantizedAabbCompression = useQuantizedAabbCompression.ptr;
  if (buildBvh && typeof buildBvh === 'object') buildBvh = buildBvh.ptr;
  if (buildBvh === undefined) { this.ptr = _emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_2(meshInterface, useQuantizedAabbCompression); getCache(btBvhTriangleMeshShape)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_3(meshInterface, useQuantizedAabbCompression, buildBvh);
  getCache(btBvhTriangleMeshShape)[this.ptr] = this;
};

btBvhTriangleMeshShape.prototype = Object.create(btTriangleMeshShape.prototype);
btBvhTriangleMeshShape.prototype.constructor = btBvhTriangleMeshShape;
btBvhTriangleMeshShape.prototype.__class__ = btBvhTriangleMeshShape;
btBvhTriangleMeshShape.__cache__ = {};
Module['btBvhTriangleMeshShape'] = btBvhTriangleMeshShape;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btBvhTriangleMeshShape.prototype['setLocalScaling'] = btBvhTriangleMeshShape.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btBvhTriangleMeshShape_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btBvhTriangleMeshShape.prototype['getLocalScaling'] = btBvhTriangleMeshShape.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btBvhTriangleMeshShape_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btBvhTriangleMeshShape.prototype['calculateLocalInertia'] = btBvhTriangleMeshShape.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btBvhTriangleMeshShape_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btBvhTriangleMeshShape.prototype['__destroy__'] = btBvhTriangleMeshShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btBvhTriangleMeshShape___destroy___0(self);
};

// Interface: btHeightfieldTerrainShape

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btHeightfieldTerrainShape(heightStickWidth, heightStickLength, heightfieldData, heightScale, minHeight, maxHeight, upAxis, hdt, flipQuadEdges) {
  if (heightStickWidth && typeof heightStickWidth === 'object') heightStickWidth = heightStickWidth.ptr;
  if (heightStickLength && typeof heightStickLength === 'object') heightStickLength = heightStickLength.ptr;
  if (heightfieldData && typeof heightfieldData === 'object') heightfieldData = heightfieldData.ptr;
  if (heightScale && typeof heightScale === 'object') heightScale = heightScale.ptr;
  if (minHeight && typeof minHeight === 'object') minHeight = minHeight.ptr;
  if (maxHeight && typeof maxHeight === 'object') maxHeight = maxHeight.ptr;
  if (upAxis && typeof upAxis === 'object') upAxis = upAxis.ptr;
  if (hdt && typeof hdt === 'object') hdt = hdt.ptr;
  if (flipQuadEdges && typeof flipQuadEdges === 'object') flipQuadEdges = flipQuadEdges.ptr;
  this.ptr = _emscripten_bind_btHeightfieldTerrainShape_btHeightfieldTerrainShape_9(heightStickWidth, heightStickLength, heightfieldData, heightScale, minHeight, maxHeight, upAxis, hdt, flipQuadEdges);
  getCache(btHeightfieldTerrainShape)[this.ptr] = this;
};

btHeightfieldTerrainShape.prototype = Object.create(btConcaveShape.prototype);
btHeightfieldTerrainShape.prototype.constructor = btHeightfieldTerrainShape;
btHeightfieldTerrainShape.prototype.__class__ = btHeightfieldTerrainShape;
btHeightfieldTerrainShape.__cache__ = {};
Module['btHeightfieldTerrainShape'] = btHeightfieldTerrainShape;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btHeightfieldTerrainShape.prototype['setMargin'] = btHeightfieldTerrainShape.prototype.setMargin = function(margin) {
  var self = this.ptr;
  if (margin && typeof margin === 'object') margin = margin.ptr;
  _emscripten_bind_btHeightfieldTerrainShape_setMargin_1(self, margin);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btHeightfieldTerrainShape.prototype['getMargin'] = btHeightfieldTerrainShape.prototype.getMargin = function() {
  var self = this.ptr;
  return _emscripten_bind_btHeightfieldTerrainShape_getMargin_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btHeightfieldTerrainShape.prototype['setLocalScaling'] = btHeightfieldTerrainShape.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btHeightfieldTerrainShape_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btHeightfieldTerrainShape.prototype['getLocalScaling'] = btHeightfieldTerrainShape.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btHeightfieldTerrainShape_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btHeightfieldTerrainShape.prototype['calculateLocalInertia'] = btHeightfieldTerrainShape.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btHeightfieldTerrainShape_calculateLocalInertia_2(self, mass, inertia);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btHeightfieldTerrainShape.prototype['__destroy__'] = btHeightfieldTerrainShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btHeightfieldTerrainShape___destroy___0(self);
};

// Interface: btAABB

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btAABB(V1, V2, V3, margin) {
  if (V1 && typeof V1 === 'object') V1 = V1.ptr;
  if (V2 && typeof V2 === 'object') V2 = V2.ptr;
  if (V3 && typeof V3 === 'object') V3 = V3.ptr;
  if (margin && typeof margin === 'object') margin = margin.ptr;
  this.ptr = _emscripten_bind_btAABB_btAABB_4(V1, V2, V3, margin);
  getCache(btAABB)[this.ptr] = this;
};

btAABB.prototype = Object.create(WrapperObject.prototype);
btAABB.prototype.constructor = btAABB;
btAABB.prototype.__class__ = btAABB;
btAABB.__cache__ = {};
Module['btAABB'] = btAABB;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btAABB.prototype['invalidate'] = btAABB.prototype.invalidate = function() {
  var self = this.ptr;
  _emscripten_bind_btAABB_invalidate_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btAABB.prototype['increment_margin'] = btAABB.prototype.increment_margin = function(margin) {
  var self = this.ptr;
  if (margin && typeof margin === 'object') margin = margin.ptr;
  _emscripten_bind_btAABB_increment_margin_1(self, margin);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btAABB.prototype['copy_with_margin'] = btAABB.prototype.copy_with_margin = function(other, margin) {
  var self = this.ptr;
  if (other && typeof other === 'object') other = other.ptr;
  if (margin && typeof margin === 'object') margin = margin.ptr;
  _emscripten_bind_btAABB_copy_with_margin_2(self, other, margin);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btAABB.prototype['__destroy__'] = btAABB.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btAABB___destroy___0(self);
};

// Interface: btPrimitiveTriangle

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btPrimitiveTriangle() {
  this.ptr = _emscripten_bind_btPrimitiveTriangle_btPrimitiveTriangle_0();
  getCache(btPrimitiveTriangle)[this.ptr] = this;
};

btPrimitiveTriangle.prototype = Object.create(WrapperObject.prototype);
btPrimitiveTriangle.prototype.constructor = btPrimitiveTriangle;
btPrimitiveTriangle.prototype.__class__ = btPrimitiveTriangle;
btPrimitiveTriangle.__cache__ = {};
Module['btPrimitiveTriangle'] = btPrimitiveTriangle;

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPrimitiveTriangle.prototype['__destroy__'] = btPrimitiveTriangle.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btPrimitiveTriangle___destroy___0(self);
};

// Interface: btTriangleShapeEx

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btTriangleShapeEx(p1, p2, p3) {
  if (p1 && typeof p1 === 'object') p1 = p1.ptr;
  if (p2 && typeof p2 === 'object') p2 = p2.ptr;
  if (p3 && typeof p3 === 'object') p3 = p3.ptr;
  this.ptr = _emscripten_bind_btTriangleShapeEx_btTriangleShapeEx_3(p1, p2, p3);
  getCache(btTriangleShapeEx)[this.ptr] = this;
};

btTriangleShapeEx.prototype = Object.create(WrapperObject.prototype);
btTriangleShapeEx.prototype.constructor = btTriangleShapeEx;
btTriangleShapeEx.prototype.__class__ = btTriangleShapeEx;
btTriangleShapeEx.__cache__ = {};
Module['btTriangleShapeEx'] = btTriangleShapeEx;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btTriangleShapeEx.prototype['getAabb'] = btTriangleShapeEx.prototype.getAabb = function(t, aabbMin, aabbMax) {
  var self = this.ptr;
  if (t && typeof t === 'object') t = t.ptr;
  if (aabbMin && typeof aabbMin === 'object') aabbMin = aabbMin.ptr;
  if (aabbMax && typeof aabbMax === 'object') aabbMax = aabbMax.ptr;
  _emscripten_bind_btTriangleShapeEx_getAabb_3(self, t, aabbMin, aabbMax);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btTriangleShapeEx.prototype['applyTransform'] = btTriangleShapeEx.prototype.applyTransform = function(t) {
  var self = this.ptr;
  if (t && typeof t === 'object') t = t.ptr;
  _emscripten_bind_btTriangleShapeEx_applyTransform_1(self, t);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btTriangleShapeEx.prototype['buildTriPlane'] = btTriangleShapeEx.prototype.buildTriPlane = function(plane) {
  var self = this.ptr;
  if (plane && typeof plane === 'object') plane = plane.ptr;
  _emscripten_bind_btTriangleShapeEx_buildTriPlane_1(self, plane);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btTriangleShapeEx.prototype['__destroy__'] = btTriangleShapeEx.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btTriangleShapeEx___destroy___0(self);
};

// Interface: btTetrahedronShapeEx

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btTetrahedronShapeEx() {
  this.ptr = _emscripten_bind_btTetrahedronShapeEx_btTetrahedronShapeEx_0();
  getCache(btTetrahedronShapeEx)[this.ptr] = this;
};

btTetrahedronShapeEx.prototype = Object.create(WrapperObject.prototype);
btTetrahedronShapeEx.prototype.constructor = btTetrahedronShapeEx;
btTetrahedronShapeEx.prototype.__class__ = btTetrahedronShapeEx;
btTetrahedronShapeEx.__cache__ = {};
Module['btTetrahedronShapeEx'] = btTetrahedronShapeEx;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btTetrahedronShapeEx.prototype['setVertices'] = btTetrahedronShapeEx.prototype.setVertices = function(v0, v1, v2, v3) {
  var self = this.ptr;
  if (v0 && typeof v0 === 'object') v0 = v0.ptr;
  if (v1 && typeof v1 === 'object') v1 = v1.ptr;
  if (v2 && typeof v2 === 'object') v2 = v2.ptr;
  if (v3 && typeof v3 === 'object') v3 = v3.ptr;
  _emscripten_bind_btTetrahedronShapeEx_setVertices_4(self, v0, v1, v2, v3);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btTetrahedronShapeEx.prototype['__destroy__'] = btTetrahedronShapeEx.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btTetrahedronShapeEx___destroy___0(self);
};

// Interface: CompoundPrimitiveManager

/** @suppress {undefinedVars, duplicate} @this{Object} */
function CompoundPrimitiveManager() { throw "cannot construct a CompoundPrimitiveManager, no constructor in IDL" }
CompoundPrimitiveManager.prototype = Object.create(btPrimitiveManagerBase.prototype);
CompoundPrimitiveManager.prototype.constructor = CompoundPrimitiveManager;
CompoundPrimitiveManager.prototype.__class__ = CompoundPrimitiveManager;
CompoundPrimitiveManager.__cache__ = {};
Module['CompoundPrimitiveManager'] = CompoundPrimitiveManager;
/** @suppress {undefinedVars, duplicate} @this{Object} */
CompoundPrimitiveManager.prototype['get_primitive_count'] = CompoundPrimitiveManager.prototype.get_primitive_count = function() {
  var self = this.ptr;
  return _emscripten_bind_CompoundPrimitiveManager_get_primitive_count_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
CompoundPrimitiveManager.prototype['get_primitive_box'] = CompoundPrimitiveManager.prototype.get_primitive_box = function(prim_index, primbox) {
  var self = this.ptr;
  if (prim_index && typeof prim_index === 'object') prim_index = prim_index.ptr;
  if (primbox && typeof primbox === 'object') primbox = primbox.ptr;
  _emscripten_bind_CompoundPrimitiveManager_get_primitive_box_2(self, prim_index, primbox);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
CompoundPrimitiveManager.prototype['get_primitive_triangle'] = CompoundPrimitiveManager.prototype.get_primitive_triangle = function(prim_index, triangle) {
  var self = this.ptr;
  if (prim_index && typeof prim_index === 'object') prim_index = prim_index.ptr;
  if (triangle && typeof triangle === 'object') triangle = triangle.ptr;
  _emscripten_bind_CompoundPrimitiveManager_get_primitive_triangle_2(self, prim_index, triangle);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
CompoundPrimitiveManager.prototype['is_trimesh'] = CompoundPrimitiveManager.prototype.is_trimesh = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_CompoundPrimitiveManager_is_trimesh_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
CompoundPrimitiveManager.prototype['get_m_compoundShape'] = CompoundPrimitiveManager.prototype.get_m_compoundShape = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_CompoundPrimitiveManager_get_m_compoundShape_0(self), btGImpactCompoundShape);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
CompoundPrimitiveManager.prototype['set_m_compoundShape'] = CompoundPrimitiveManager.prototype.set_m_compoundShape = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_CompoundPrimitiveManager_set_m_compoundShape_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(CompoundPrimitiveManager.prototype, 'm_compoundShape', { get: CompoundPrimitiveManager.prototype.get_m_compoundShape, set: CompoundPrimitiveManager.prototype.set_m_compoundShape });

/** @suppress {undefinedVars, duplicate} @this{Object} */
CompoundPrimitiveManager.prototype['__destroy__'] = CompoundPrimitiveManager.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_CompoundPrimitiveManager___destroy___0(self);
};

// Interface: btGImpactCompoundShape

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btGImpactCompoundShape(children_has_transform) {
  if (children_has_transform && typeof children_has_transform === 'object') children_has_transform = children_has_transform.ptr;
  if (children_has_transform === undefined) { this.ptr = _emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_0(); getCache(btGImpactCompoundShape)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_1(children_has_transform);
  getCache(btGImpactCompoundShape)[this.ptr] = this;
};

btGImpactCompoundShape.prototype = Object.create(btGImpactShapeInterface.prototype);
btGImpactCompoundShape.prototype.constructor = btGImpactCompoundShape;
btGImpactCompoundShape.prototype.__class__ = btGImpactCompoundShape;
btGImpactCompoundShape.__cache__ = {};
Module['btGImpactCompoundShape'] = btGImpactCompoundShape;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['childrenHasTransform'] = btGImpactCompoundShape.prototype.childrenHasTransform = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btGImpactCompoundShape_childrenHasTransform_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['getPrimitiveManager'] = btGImpactCompoundShape.prototype.getPrimitiveManager = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGImpactCompoundShape_getPrimitiveManager_0(self), btPrimitiveManagerBase);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['getCompoundPrimitiveManager'] = btGImpactCompoundShape.prototype.getCompoundPrimitiveManager = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGImpactCompoundShape_getCompoundPrimitiveManager_0(self), CompoundPrimitiveManager);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['getNumChildShapes'] = btGImpactCompoundShape.prototype.getNumChildShapes = function() {
  var self = this.ptr;
  return _emscripten_bind_btGImpactCompoundShape_getNumChildShapes_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['addChildShape'] = btGImpactCompoundShape.prototype.addChildShape = function(localTransform, shape) {
  var self = this.ptr;
  if (localTransform && typeof localTransform === 'object') localTransform = localTransform.ptr;
  if (shape && typeof shape === 'object') shape = shape.ptr;
  _emscripten_bind_btGImpactCompoundShape_addChildShape_2(self, localTransform, shape);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['getChildShape'] = btGImpactCompoundShape.prototype.getChildShape = function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_btGImpactCompoundShape_getChildShape_1(self, index), btCollisionShape);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['getChildAabb'] = btGImpactCompoundShape.prototype.getChildAabb = function(child_index, t, aabbMin, aabbMax) {
  var self = this.ptr;
  if (child_index && typeof child_index === 'object') child_index = child_index.ptr;
  if (t && typeof t === 'object') t = t.ptr;
  if (aabbMin && typeof aabbMin === 'object') aabbMin = aabbMin.ptr;
  if (aabbMax && typeof aabbMax === 'object') aabbMax = aabbMax.ptr;
  _emscripten_bind_btGImpactCompoundShape_getChildAabb_4(self, child_index, t, aabbMin, aabbMax);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['getChildTransform'] = btGImpactCompoundShape.prototype.getChildTransform = function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_btGImpactCompoundShape_getChildTransform_1(self, index), btTransform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['setChildTransform'] = btGImpactCompoundShape.prototype.setChildTransform = function(index, transform) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  if (transform && typeof transform === 'object') transform = transform.ptr;
  _emscripten_bind_btGImpactCompoundShape_setChildTransform_2(self, index, transform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['calculateLocalInertia'] = btGImpactCompoundShape.prototype.calculateLocalInertia = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btGImpactCompoundShape_calculateLocalInertia_2(self, mass, inertia);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['getName'] = btGImpactCompoundShape.prototype.getName = function() {
  var self = this.ptr;
  return UTF8ToString(_emscripten_bind_btGImpactCompoundShape_getName_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['getGImpactShapeType'] = btGImpactCompoundShape.prototype.getGImpactShapeType = function() {
  var self = this.ptr;
  return _emscripten_bind_btGImpactCompoundShape_getGImpactShapeType_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['setLocalScaling'] = btGImpactCompoundShape.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btGImpactCompoundShape_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['getLocalScaling'] = btGImpactCompoundShape.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGImpactCompoundShape_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['updateBound'] = btGImpactCompoundShape.prototype.updateBound = function() {
  var self = this.ptr;
  _emscripten_bind_btGImpactCompoundShape_updateBound_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['postUpdate'] = btGImpactCompoundShape.prototype.postUpdate = function() {
  var self = this.ptr;
  _emscripten_bind_btGImpactCompoundShape_postUpdate_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['getShapeType'] = btGImpactCompoundShape.prototype.getShapeType = function() {
  var self = this.ptr;
  return _emscripten_bind_btGImpactCompoundShape_getShapeType_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['needsRetrieveTriangles'] = btGImpactCompoundShape.prototype.needsRetrieveTriangles = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btGImpactCompoundShape_needsRetrieveTriangles_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['needsRetrieveTetrahedrons'] = btGImpactCompoundShape.prototype.needsRetrieveTetrahedrons = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btGImpactCompoundShape_needsRetrieveTetrahedrons_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['getBulletTriangle'] = btGImpactCompoundShape.prototype.getBulletTriangle = function(prim_index, triangle) {
  var self = this.ptr;
  if (prim_index && typeof prim_index === 'object') prim_index = prim_index.ptr;
  if (triangle && typeof triangle === 'object') triangle = triangle.ptr;
  _emscripten_bind_btGImpactCompoundShape_getBulletTriangle_2(self, prim_index, triangle);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['getBulletTetrahedron'] = btGImpactCompoundShape.prototype.getBulletTetrahedron = function(prim_index, tetrahedron) {
  var self = this.ptr;
  if (prim_index && typeof prim_index === 'object') prim_index = prim_index.ptr;
  if (tetrahedron && typeof tetrahedron === 'object') tetrahedron = tetrahedron.ptr;
  _emscripten_bind_btGImpactCompoundShape_getBulletTetrahedron_2(self, prim_index, tetrahedron);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCompoundShape.prototype['__destroy__'] = btGImpactCompoundShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btGImpactCompoundShape___destroy___0(self);
};

// Interface: TrimeshPrimitiveManager

/** @suppress {undefinedVars, duplicate} @this{Object} */
function TrimeshPrimitiveManager(manager) {
  if (manager && typeof manager === 'object') manager = manager.ptr;
  if (manager === undefined) { this.ptr = _emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_0(); getCache(TrimeshPrimitiveManager)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_1(manager);
  getCache(TrimeshPrimitiveManager)[this.ptr] = this;
};

TrimeshPrimitiveManager.prototype = Object.create(btPrimitiveManagerBase.prototype);
TrimeshPrimitiveManager.prototype.constructor = TrimeshPrimitiveManager;
TrimeshPrimitiveManager.prototype.__class__ = TrimeshPrimitiveManager;
TrimeshPrimitiveManager.__cache__ = {};
Module['TrimeshPrimitiveManager'] = TrimeshPrimitiveManager;
/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['lock'] = TrimeshPrimitiveManager.prototype.lock = function() {
  var self = this.ptr;
  _emscripten_bind_TrimeshPrimitiveManager_lock_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['unlock'] = TrimeshPrimitiveManager.prototype.unlock = function() {
  var self = this.ptr;
  _emscripten_bind_TrimeshPrimitiveManager_unlock_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['is_trimesh'] = TrimeshPrimitiveManager.prototype.is_trimesh = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_TrimeshPrimitiveManager_is_trimesh_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['get_vertex_count'] = TrimeshPrimitiveManager.prototype.get_vertex_count = function() {
  var self = this.ptr;
  return _emscripten_bind_TrimeshPrimitiveManager_get_vertex_count_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['get_indices'] = TrimeshPrimitiveManager.prototype.get_indices = function(face_index, i0, i1, i2) {
  var self = this.ptr;
  if (face_index && typeof face_index === 'object') face_index = face_index.ptr;
  if (i0 && typeof i0 === 'object') i0 = i0.ptr;
  if (i1 && typeof i1 === 'object') i1 = i1.ptr;
  if (i2 && typeof i2 === 'object') i2 = i2.ptr;
  _emscripten_bind_TrimeshPrimitiveManager_get_indices_4(self, face_index, i0, i1, i2);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['get_vertex'] = TrimeshPrimitiveManager.prototype.get_vertex = function(vertex_index, vertex) {
  var self = this.ptr;
  if (vertex_index && typeof vertex_index === 'object') vertex_index = vertex_index.ptr;
  if (vertex && typeof vertex === 'object') vertex = vertex.ptr;
  _emscripten_bind_TrimeshPrimitiveManager_get_vertex_2(self, vertex_index, vertex);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['get_bullet_triangle'] = TrimeshPrimitiveManager.prototype.get_bullet_triangle = function(prim_index, triangle) {
  var self = this.ptr;
  if (prim_index && typeof prim_index === 'object') prim_index = prim_index.ptr;
  if (triangle && typeof triangle === 'object') triangle = triangle.ptr;
  _emscripten_bind_TrimeshPrimitiveManager_get_bullet_triangle_2(self, prim_index, triangle);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['get_m_margin'] = TrimeshPrimitiveManager.prototype.get_m_margin = function() {
  var self = this.ptr;
  return _emscripten_bind_TrimeshPrimitiveManager_get_m_margin_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['set_m_margin'] = TrimeshPrimitiveManager.prototype.set_m_margin = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_TrimeshPrimitiveManager_set_m_margin_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(TrimeshPrimitiveManager.prototype, 'm_margin', { get: TrimeshPrimitiveManager.prototype.get_m_margin, set: TrimeshPrimitiveManager.prototype.set_m_margin });
/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['get_m_meshInterface'] = TrimeshPrimitiveManager.prototype.get_m_meshInterface = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_TrimeshPrimitiveManager_get_m_meshInterface_0(self), btStridingMeshInterface);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['set_m_meshInterface'] = TrimeshPrimitiveManager.prototype.set_m_meshInterface = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_TrimeshPrimitiveManager_set_m_meshInterface_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(TrimeshPrimitiveManager.prototype, 'm_meshInterface', { get: TrimeshPrimitiveManager.prototype.get_m_meshInterface, set: TrimeshPrimitiveManager.prototype.set_m_meshInterface });
/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['get_m_part'] = TrimeshPrimitiveManager.prototype.get_m_part = function() {
  var self = this.ptr;
  return _emscripten_bind_TrimeshPrimitiveManager_get_m_part_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['set_m_part'] = TrimeshPrimitiveManager.prototype.set_m_part = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_TrimeshPrimitiveManager_set_m_part_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(TrimeshPrimitiveManager.prototype, 'm_part', { get: TrimeshPrimitiveManager.prototype.get_m_part, set: TrimeshPrimitiveManager.prototype.set_m_part });
/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['get_m_lock_count'] = TrimeshPrimitiveManager.prototype.get_m_lock_count = function() {
  var self = this.ptr;
  return _emscripten_bind_TrimeshPrimitiveManager_get_m_lock_count_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['set_m_lock_count'] = TrimeshPrimitiveManager.prototype.set_m_lock_count = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_TrimeshPrimitiveManager_set_m_lock_count_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(TrimeshPrimitiveManager.prototype, 'm_lock_count', { get: TrimeshPrimitiveManager.prototype.get_m_lock_count, set: TrimeshPrimitiveManager.prototype.set_m_lock_count });
/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['get_numverts'] = TrimeshPrimitiveManager.prototype.get_numverts = function() {
  var self = this.ptr;
  return _emscripten_bind_TrimeshPrimitiveManager_get_numverts_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['set_numverts'] = TrimeshPrimitiveManager.prototype.set_numverts = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_TrimeshPrimitiveManager_set_numverts_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(TrimeshPrimitiveManager.prototype, 'numverts', { get: TrimeshPrimitiveManager.prototype.get_numverts, set: TrimeshPrimitiveManager.prototype.set_numverts });
/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['get_type'] = TrimeshPrimitiveManager.prototype.get_type = function() {
  var self = this.ptr;
  return _emscripten_bind_TrimeshPrimitiveManager_get_type_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['set_type'] = TrimeshPrimitiveManager.prototype.set_type = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_TrimeshPrimitiveManager_set_type_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(TrimeshPrimitiveManager.prototype, 'type', { get: TrimeshPrimitiveManager.prototype.get_type, set: TrimeshPrimitiveManager.prototype.set_type });
/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['get_stride'] = TrimeshPrimitiveManager.prototype.get_stride = function() {
  var self = this.ptr;
  return _emscripten_bind_TrimeshPrimitiveManager_get_stride_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['set_stride'] = TrimeshPrimitiveManager.prototype.set_stride = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_TrimeshPrimitiveManager_set_stride_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(TrimeshPrimitiveManager.prototype, 'stride', { get: TrimeshPrimitiveManager.prototype.get_stride, set: TrimeshPrimitiveManager.prototype.set_stride });
/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['get_indexstride'] = TrimeshPrimitiveManager.prototype.get_indexstride = function() {
  var self = this.ptr;
  return _emscripten_bind_TrimeshPrimitiveManager_get_indexstride_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['set_indexstride'] = TrimeshPrimitiveManager.prototype.set_indexstride = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_TrimeshPrimitiveManager_set_indexstride_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(TrimeshPrimitiveManager.prototype, 'indexstride', { get: TrimeshPrimitiveManager.prototype.get_indexstride, set: TrimeshPrimitiveManager.prototype.set_indexstride });
/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['get_numfaces'] = TrimeshPrimitiveManager.prototype.get_numfaces = function() {
  var self = this.ptr;
  return _emscripten_bind_TrimeshPrimitiveManager_get_numfaces_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['set_numfaces'] = TrimeshPrimitiveManager.prototype.set_numfaces = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_TrimeshPrimitiveManager_set_numfaces_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(TrimeshPrimitiveManager.prototype, 'numfaces', { get: TrimeshPrimitiveManager.prototype.get_numfaces, set: TrimeshPrimitiveManager.prototype.set_numfaces });
/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['get_indicestype'] = TrimeshPrimitiveManager.prototype.get_indicestype = function() {
  var self = this.ptr;
  return _emscripten_bind_TrimeshPrimitiveManager_get_indicestype_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['set_indicestype'] = TrimeshPrimitiveManager.prototype.set_indicestype = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_TrimeshPrimitiveManager_set_indicestype_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(TrimeshPrimitiveManager.prototype, 'indicestype', { get: TrimeshPrimitiveManager.prototype.get_indicestype, set: TrimeshPrimitiveManager.prototype.set_indicestype });

/** @suppress {undefinedVars, duplicate} @this{Object} */
TrimeshPrimitiveManager.prototype['__destroy__'] = TrimeshPrimitiveManager.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_TrimeshPrimitiveManager___destroy___0(self);
};

// Interface: btGImpactMeshShapePart

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btGImpactMeshShapePart(meshInterface, part) {
  if (meshInterface && typeof meshInterface === 'object') meshInterface = meshInterface.ptr;
  if (part && typeof part === 'object') part = part.ptr;
  this.ptr = _emscripten_bind_btGImpactMeshShapePart_btGImpactMeshShapePart_2(meshInterface, part);
  getCache(btGImpactMeshShapePart)[this.ptr] = this;
};

btGImpactMeshShapePart.prototype = Object.create(btGImpactShapeInterface.prototype);
btGImpactMeshShapePart.prototype.constructor = btGImpactMeshShapePart;
btGImpactMeshShapePart.prototype.__class__ = btGImpactMeshShapePart;
btGImpactMeshShapePart.__cache__ = {};
Module['btGImpactMeshShapePart'] = btGImpactMeshShapePart;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShapePart.prototype['getTrimeshPrimitiveManager'] = btGImpactMeshShapePart.prototype.getTrimeshPrimitiveManager = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGImpactMeshShapePart_getTrimeshPrimitiveManager_0(self), TrimeshPrimitiveManager);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShapePart.prototype['getVertexCount'] = btGImpactMeshShapePart.prototype.getVertexCount = function() {
  var self = this.ptr;
  return _emscripten_bind_btGImpactMeshShapePart_getVertexCount_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShapePart.prototype['getVertex'] = btGImpactMeshShapePart.prototype.getVertex = function(vertex_index, vertex) {
  var self = this.ptr;
  if (vertex_index && typeof vertex_index === 'object') vertex_index = vertex_index.ptr;
  if (vertex && typeof vertex === 'object') vertex = vertex.ptr;
  _emscripten_bind_btGImpactMeshShapePart_getVertex_2(self, vertex_index, vertex);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShapePart.prototype['getPart'] = btGImpactMeshShapePart.prototype.getPart = function() {
  var self = this.ptr;
  return _emscripten_bind_btGImpactMeshShapePart_getPart_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShapePart.prototype['setLocalScaling'] = btGImpactMeshShapePart.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btGImpactMeshShapePart_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShapePart.prototype['getLocalScaling'] = btGImpactMeshShapePart.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGImpactMeshShapePart_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShapePart.prototype['updateBound'] = btGImpactMeshShapePart.prototype.updateBound = function() {
  var self = this.ptr;
  _emscripten_bind_btGImpactMeshShapePart_updateBound_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShapePart.prototype['postUpdate'] = btGImpactMeshShapePart.prototype.postUpdate = function() {
  var self = this.ptr;
  _emscripten_bind_btGImpactMeshShapePart_postUpdate_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShapePart.prototype['getShapeType'] = btGImpactMeshShapePart.prototype.getShapeType = function() {
  var self = this.ptr;
  return _emscripten_bind_btGImpactMeshShapePart_getShapeType_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShapePart.prototype['needsRetrieveTriangles'] = btGImpactMeshShapePart.prototype.needsRetrieveTriangles = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btGImpactMeshShapePart_needsRetrieveTriangles_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShapePart.prototype['needsRetrieveTetrahedrons'] = btGImpactMeshShapePart.prototype.needsRetrieveTetrahedrons = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btGImpactMeshShapePart_needsRetrieveTetrahedrons_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShapePart.prototype['getBulletTriangle'] = btGImpactMeshShapePart.prototype.getBulletTriangle = function(prim_index, triangle) {
  var self = this.ptr;
  if (prim_index && typeof prim_index === 'object') prim_index = prim_index.ptr;
  if (triangle && typeof triangle === 'object') triangle = triangle.ptr;
  _emscripten_bind_btGImpactMeshShapePart_getBulletTriangle_2(self, prim_index, triangle);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShapePart.prototype['getBulletTetrahedron'] = btGImpactMeshShapePart.prototype.getBulletTetrahedron = function(prim_index, tetrahedron) {
  var self = this.ptr;
  if (prim_index && typeof prim_index === 'object') prim_index = prim_index.ptr;
  if (tetrahedron && typeof tetrahedron === 'object') tetrahedron = tetrahedron.ptr;
  _emscripten_bind_btGImpactMeshShapePart_getBulletTetrahedron_2(self, prim_index, tetrahedron);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShapePart.prototype['__destroy__'] = btGImpactMeshShapePart.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btGImpactMeshShapePart___destroy___0(self);
};

// Interface: btGImpactMeshShape

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btGImpactMeshShape(meshInterface) {
  if (meshInterface && typeof meshInterface === 'object') meshInterface = meshInterface.ptr;
  this.ptr = _emscripten_bind_btGImpactMeshShape_btGImpactMeshShape_1(meshInterface);
  getCache(btGImpactMeshShape)[this.ptr] = this;
};

btGImpactMeshShape.prototype = Object.create(btGImpactShapeInterface.prototype);
btGImpactMeshShape.prototype.constructor = btGImpactMeshShape;
btGImpactMeshShape.prototype.__class__ = btGImpactMeshShape;
btGImpactMeshShape.__cache__ = {};
Module['btGImpactMeshShape'] = btGImpactMeshShape;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShape.prototype['getMeshInterface'] = btGImpactMeshShape.prototype.getMeshInterface = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGImpactMeshShape_getMeshInterface_0(self), btStridingMeshInterface);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShape.prototype['getMeshPartCount'] = btGImpactMeshShape.prototype.getMeshPartCount = function() {
  var self = this.ptr;
  return _emscripten_bind_btGImpactMeshShape_getMeshPartCount_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShape.prototype['getMeshPart'] = btGImpactMeshShape.prototype.getMeshPart = function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_btGImpactMeshShape_getMeshPart_1(self, index), btGImpactMeshShapePart);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShape.prototype['calculateSerializeBufferSize'] = btGImpactMeshShape.prototype.calculateSerializeBufferSize = function() {
  var self = this.ptr;
  return _emscripten_bind_btGImpactMeshShape_calculateSerializeBufferSize_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShape.prototype['setLocalScaling'] = btGImpactMeshShape.prototype.setLocalScaling = function(scaling) {
  var self = this.ptr;
  if (scaling && typeof scaling === 'object') scaling = scaling.ptr;
  _emscripten_bind_btGImpactMeshShape_setLocalScaling_1(self, scaling);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShape.prototype['getLocalScaling'] = btGImpactMeshShape.prototype.getLocalScaling = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGImpactMeshShape_getLocalScaling_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShape.prototype['updateBound'] = btGImpactMeshShape.prototype.updateBound = function() {
  var self = this.ptr;
  _emscripten_bind_btGImpactMeshShape_updateBound_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShape.prototype['postUpdate'] = btGImpactMeshShape.prototype.postUpdate = function() {
  var self = this.ptr;
  _emscripten_bind_btGImpactMeshShape_postUpdate_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShape.prototype['getShapeType'] = btGImpactMeshShape.prototype.getShapeType = function() {
  var self = this.ptr;
  return _emscripten_bind_btGImpactMeshShape_getShapeType_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShape.prototype['needsRetrieveTriangles'] = btGImpactMeshShape.prototype.needsRetrieveTriangles = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btGImpactMeshShape_needsRetrieveTriangles_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShape.prototype['needsRetrieveTetrahedrons'] = btGImpactMeshShape.prototype.needsRetrieveTetrahedrons = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btGImpactMeshShape_needsRetrieveTetrahedrons_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShape.prototype['getBulletTriangle'] = btGImpactMeshShape.prototype.getBulletTriangle = function(prim_index, triangle) {
  var self = this.ptr;
  if (prim_index && typeof prim_index === 'object') prim_index = prim_index.ptr;
  if (triangle && typeof triangle === 'object') triangle = triangle.ptr;
  _emscripten_bind_btGImpactMeshShape_getBulletTriangle_2(self, prim_index, triangle);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShape.prototype['getBulletTetrahedron'] = btGImpactMeshShape.prototype.getBulletTetrahedron = function(prim_index, tetrahedron) {
  var self = this.ptr;
  if (prim_index && typeof prim_index === 'object') prim_index = prim_index.ptr;
  if (tetrahedron && typeof tetrahedron === 'object') tetrahedron = tetrahedron.ptr;
  _emscripten_bind_btGImpactMeshShape_getBulletTetrahedron_2(self, prim_index, tetrahedron);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactMeshShape.prototype['__destroy__'] = btGImpactMeshShape.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btGImpactMeshShape___destroy___0(self);
};

// Interface: btCollisionAlgorithmConstructionInfo

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btCollisionAlgorithmConstructionInfo(dispatcher, temp) {
  if (dispatcher && typeof dispatcher === 'object') dispatcher = dispatcher.ptr;
  if (temp && typeof temp === 'object') temp = temp.ptr;
  if (dispatcher === undefined) { this.ptr = _emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_0(); getCache(btCollisionAlgorithmConstructionInfo)[this.ptr] = this;return }
  if (temp === undefined) { this.ptr = _emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_1(dispatcher); getCache(btCollisionAlgorithmConstructionInfo)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_2(dispatcher, temp);
  getCache(btCollisionAlgorithmConstructionInfo)[this.ptr] = this;
};

btCollisionAlgorithmConstructionInfo.prototype = Object.create(WrapperObject.prototype);
btCollisionAlgorithmConstructionInfo.prototype.constructor = btCollisionAlgorithmConstructionInfo;
btCollisionAlgorithmConstructionInfo.prototype.__class__ = btCollisionAlgorithmConstructionInfo;
btCollisionAlgorithmConstructionInfo.__cache__ = {};
Module['btCollisionAlgorithmConstructionInfo'] = btCollisionAlgorithmConstructionInfo;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionAlgorithmConstructionInfo.prototype['get_m_dispatcher1'] = btCollisionAlgorithmConstructionInfo.prototype.get_m_dispatcher1 = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_dispatcher1_0(self), btDispatcher);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionAlgorithmConstructionInfo.prototype['set_m_dispatcher1'] = btCollisionAlgorithmConstructionInfo.prototype.set_m_dispatcher1 = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_dispatcher1_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btCollisionAlgorithmConstructionInfo.prototype, 'm_dispatcher1', { get: btCollisionAlgorithmConstructionInfo.prototype.get_m_dispatcher1, set: btCollisionAlgorithmConstructionInfo.prototype.set_m_dispatcher1 });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionAlgorithmConstructionInfo.prototype['get_m_manifold'] = btCollisionAlgorithmConstructionInfo.prototype.get_m_manifold = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_manifold_0(self), btPersistentManifold);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionAlgorithmConstructionInfo.prototype['set_m_manifold'] = btCollisionAlgorithmConstructionInfo.prototype.set_m_manifold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_manifold_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btCollisionAlgorithmConstructionInfo.prototype, 'm_manifold', { get: btCollisionAlgorithmConstructionInfo.prototype.get_m_manifold, set: btCollisionAlgorithmConstructionInfo.prototype.set_m_manifold });

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionAlgorithmConstructionInfo.prototype['__destroy__'] = btCollisionAlgorithmConstructionInfo.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCollisionAlgorithmConstructionInfo___destroy___0(self);
};

// Interface: btGImpactCollisionAlgorithm

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btGImpactCollisionAlgorithm(ci, body0Wrap, body1Wrap) {
  if (ci && typeof ci === 'object') ci = ci.ptr;
  if (body0Wrap && typeof body0Wrap === 'object') body0Wrap = body0Wrap.ptr;
  if (body1Wrap && typeof body1Wrap === 'object') body1Wrap = body1Wrap.ptr;
  this.ptr = _emscripten_bind_btGImpactCollisionAlgorithm_btGImpactCollisionAlgorithm_3(ci, body0Wrap, body1Wrap);
  getCache(btGImpactCollisionAlgorithm)[this.ptr] = this;
};

btGImpactCollisionAlgorithm.prototype = Object.create(btActivatingCollisionAlgorithm.prototype);
btGImpactCollisionAlgorithm.prototype.constructor = btGImpactCollisionAlgorithm;
btGImpactCollisionAlgorithm.prototype.__class__ = btGImpactCollisionAlgorithm;
btGImpactCollisionAlgorithm.__cache__ = {};
Module['btGImpactCollisionAlgorithm'] = btGImpactCollisionAlgorithm;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCollisionAlgorithm.prototype['registerAlgorithm'] = btGImpactCollisionAlgorithm.prototype.registerAlgorithm = function(dispatcher) {
  if (dispatcher && typeof dispatcher === 'object') dispatcher = dispatcher.ptr;
  _emscripten_bind_btGImpactCollisionAlgorithm_registerAlgorithm_1(dispatcher);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btGImpactCollisionAlgorithm.prototype['__destroy__'] = btGImpactCollisionAlgorithm.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btGImpactCollisionAlgorithm___destroy___0(self);
};

// Interface: btDefaultCollisionConstructionInfo

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btDefaultCollisionConstructionInfo() {
  this.ptr = _emscripten_bind_btDefaultCollisionConstructionInfo_btDefaultCollisionConstructionInfo_0();
  getCache(btDefaultCollisionConstructionInfo)[this.ptr] = this;
};

btDefaultCollisionConstructionInfo.prototype = Object.create(WrapperObject.prototype);
btDefaultCollisionConstructionInfo.prototype.constructor = btDefaultCollisionConstructionInfo;
btDefaultCollisionConstructionInfo.prototype.__class__ = btDefaultCollisionConstructionInfo;
btDefaultCollisionConstructionInfo.__cache__ = {};
Module['btDefaultCollisionConstructionInfo'] = btDefaultCollisionConstructionInfo;

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDefaultCollisionConstructionInfo.prototype['__destroy__'] = btDefaultCollisionConstructionInfo.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btDefaultCollisionConstructionInfo___destroy___0(self);
};

// Interface: btPersistentManifold

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btPersistentManifold() {
  this.ptr = _emscripten_bind_btPersistentManifold_btPersistentManifold_0();
  getCache(btPersistentManifold)[this.ptr] = this;
};

btPersistentManifold.prototype = Object.create(WrapperObject.prototype);
btPersistentManifold.prototype.constructor = btPersistentManifold;
btPersistentManifold.prototype.__class__ = btPersistentManifold;
btPersistentManifold.__cache__ = {};
Module['btPersistentManifold'] = btPersistentManifold;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btPersistentManifold.prototype['getBody0'] = btPersistentManifold.prototype.getBody0 = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPersistentManifold_getBody0_0(self), btCollisionObject);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPersistentManifold.prototype['getBody1'] = btPersistentManifold.prototype.getBody1 = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPersistentManifold_getBody1_0(self), btCollisionObject);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPersistentManifold.prototype['getNumContacts'] = btPersistentManifold.prototype.getNumContacts = function() {
  var self = this.ptr;
  return _emscripten_bind_btPersistentManifold_getNumContacts_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPersistentManifold.prototype['getContactPoint'] = btPersistentManifold.prototype.getContactPoint = function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_btPersistentManifold_getContactPoint_1(self, index), btManifoldPoint);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btPersistentManifold.prototype['__destroy__'] = btPersistentManifold.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btPersistentManifold___destroy___0(self);
};

// Interface: btCollisionDispatcher

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btCollisionDispatcher(conf) {
  if (conf && typeof conf === 'object') conf = conf.ptr;
  this.ptr = _emscripten_bind_btCollisionDispatcher_btCollisionDispatcher_1(conf);
  getCache(btCollisionDispatcher)[this.ptr] = this;
};

btCollisionDispatcher.prototype = Object.create(btDispatcher.prototype);
btCollisionDispatcher.prototype.constructor = btCollisionDispatcher;
btCollisionDispatcher.prototype.__class__ = btCollisionDispatcher;
btCollisionDispatcher.__cache__ = {};
Module['btCollisionDispatcher'] = btCollisionDispatcher;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionDispatcher.prototype['getNumManifolds'] = btCollisionDispatcher.prototype.getNumManifolds = function() {
  var self = this.ptr;
  return _emscripten_bind_btCollisionDispatcher_getNumManifolds_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionDispatcher.prototype['getManifoldByIndexInternal'] = btCollisionDispatcher.prototype.getManifoldByIndexInternal = function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_btCollisionDispatcher_getManifoldByIndexInternal_1(self, index), btPersistentManifold);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionDispatcher.prototype['__destroy__'] = btCollisionDispatcher.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCollisionDispatcher___destroy___0(self);
};

// Interface: btOverlappingPairCallback

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btOverlappingPairCallback() { throw "cannot construct a btOverlappingPairCallback, no constructor in IDL" }
btOverlappingPairCallback.prototype = Object.create(WrapperObject.prototype);
btOverlappingPairCallback.prototype.constructor = btOverlappingPairCallback;
btOverlappingPairCallback.prototype.__class__ = btOverlappingPairCallback;
btOverlappingPairCallback.__cache__ = {};
Module['btOverlappingPairCallback'] = btOverlappingPairCallback;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btOverlappingPairCallback.prototype['removeOverlappingPairsContainingProxy'] = btOverlappingPairCallback.prototype.removeOverlappingPairsContainingProxy = function(proxy, dispatcher) {
  var self = this.ptr;
  if (proxy && typeof proxy === 'object') proxy = proxy.ptr;
  if (dispatcher && typeof dispatcher === 'object') dispatcher = dispatcher.ptr;
  _emscripten_bind_btOverlappingPairCallback_removeOverlappingPairsContainingProxy_2(self, proxy, dispatcher);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btOverlappingPairCallback.prototype['__destroy__'] = btOverlappingPairCallback.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btOverlappingPairCallback___destroy___0(self);
};

// Interface: btOverlappingPairCache

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btOverlappingPairCache() { throw "cannot construct a btOverlappingPairCache, no constructor in IDL" }
btOverlappingPairCache.prototype = Object.create(WrapperObject.prototype);
btOverlappingPairCache.prototype.constructor = btOverlappingPairCache;
btOverlappingPairCache.prototype.__class__ = btOverlappingPairCache;
btOverlappingPairCache.__cache__ = {};
Module['btOverlappingPairCache'] = btOverlappingPairCache;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btOverlappingPairCache.prototype['setInternalGhostPairCallback'] = btOverlappingPairCache.prototype.setInternalGhostPairCallback = function(ghostPairCallback) {
  var self = this.ptr;
  if (ghostPairCallback && typeof ghostPairCallback === 'object') ghostPairCallback = ghostPairCallback.ptr;
  _emscripten_bind_btOverlappingPairCache_setInternalGhostPairCallback_1(self, ghostPairCallback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btOverlappingPairCache.prototype['getNumOverlappingPairs'] = btOverlappingPairCache.prototype.getNumOverlappingPairs = function() {
  var self = this.ptr;
  return _emscripten_bind_btOverlappingPairCache_getNumOverlappingPairs_0(self);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btOverlappingPairCache.prototype['__destroy__'] = btOverlappingPairCache.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btOverlappingPairCache___destroy___0(self);
};

// Interface: btAxisSweep3

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btAxisSweep3(worldAabbMin, worldAabbMax, maxHandles, pairCache, disableRaycastAccelerator) {
  if (worldAabbMin && typeof worldAabbMin === 'object') worldAabbMin = worldAabbMin.ptr;
  if (worldAabbMax && typeof worldAabbMax === 'object') worldAabbMax = worldAabbMax.ptr;
  if (maxHandles && typeof maxHandles === 'object') maxHandles = maxHandles.ptr;
  if (pairCache && typeof pairCache === 'object') pairCache = pairCache.ptr;
  if (disableRaycastAccelerator && typeof disableRaycastAccelerator === 'object') disableRaycastAccelerator = disableRaycastAccelerator.ptr;
  if (maxHandles === undefined) { this.ptr = _emscripten_bind_btAxisSweep3_btAxisSweep3_2(worldAabbMin, worldAabbMax); getCache(btAxisSweep3)[this.ptr] = this;return }
  if (pairCache === undefined) { this.ptr = _emscripten_bind_btAxisSweep3_btAxisSweep3_3(worldAabbMin, worldAabbMax, maxHandles); getCache(btAxisSweep3)[this.ptr] = this;return }
  if (disableRaycastAccelerator === undefined) { this.ptr = _emscripten_bind_btAxisSweep3_btAxisSweep3_4(worldAabbMin, worldAabbMax, maxHandles, pairCache); getCache(btAxisSweep3)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btAxisSweep3_btAxisSweep3_5(worldAabbMin, worldAabbMax, maxHandles, pairCache, disableRaycastAccelerator);
  getCache(btAxisSweep3)[this.ptr] = this;
};

btAxisSweep3.prototype = Object.create(WrapperObject.prototype);
btAxisSweep3.prototype.constructor = btAxisSweep3;
btAxisSweep3.prototype.__class__ = btAxisSweep3;
btAxisSweep3.__cache__ = {};
Module['btAxisSweep3'] = btAxisSweep3;

/** @suppress {undefinedVars, duplicate} @this{Object} */
btAxisSweep3.prototype['__destroy__'] = btAxisSweep3.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btAxisSweep3___destroy___0(self);
};

// Interface: btCollisionConfiguration

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btCollisionConfiguration() { throw "cannot construct a btCollisionConfiguration, no constructor in IDL" }
btCollisionConfiguration.prototype = Object.create(WrapperObject.prototype);
btCollisionConfiguration.prototype.constructor = btCollisionConfiguration;
btCollisionConfiguration.prototype.__class__ = btCollisionConfiguration;
btCollisionConfiguration.__cache__ = {};
Module['btCollisionConfiguration'] = btCollisionConfiguration;

/** @suppress {undefinedVars, duplicate} @this{Object} */
btCollisionConfiguration.prototype['__destroy__'] = btCollisionConfiguration.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btCollisionConfiguration___destroy___0(self);
};

// Interface: btDbvtBroadphase

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btDbvtBroadphase() {
  this.ptr = _emscripten_bind_btDbvtBroadphase_btDbvtBroadphase_0();
  getCache(btDbvtBroadphase)[this.ptr] = this;
};

btDbvtBroadphase.prototype = Object.create(btBroadphaseInterface.prototype);
btDbvtBroadphase.prototype.constructor = btDbvtBroadphase;
btDbvtBroadphase.prototype.__class__ = btDbvtBroadphase;
btDbvtBroadphase.__cache__ = {};
Module['btDbvtBroadphase'] = btDbvtBroadphase;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btDbvtBroadphase.prototype['getOverlappingPairCache'] = btDbvtBroadphase.prototype.getOverlappingPairCache = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btDbvtBroadphase_getOverlappingPairCache_0(self), btOverlappingPairCache);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btDbvtBroadphase.prototype['__destroy__'] = btDbvtBroadphase.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btDbvtBroadphase___destroy___0(self);
};

// Interface: btBroadphaseProxy

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btBroadphaseProxy() { throw "cannot construct a btBroadphaseProxy, no constructor in IDL" }
btBroadphaseProxy.prototype = Object.create(WrapperObject.prototype);
btBroadphaseProxy.prototype.constructor = btBroadphaseProxy;
btBroadphaseProxy.prototype.__class__ = btBroadphaseProxy;
btBroadphaseProxy.__cache__ = {};
Module['btBroadphaseProxy'] = btBroadphaseProxy;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btBroadphaseProxy.prototype['get_m_collisionFilterGroup'] = btBroadphaseProxy.prototype.get_m_collisionFilterGroup = function() {
  var self = this.ptr;
  return _emscripten_bind_btBroadphaseProxy_get_m_collisionFilterGroup_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btBroadphaseProxy.prototype['set_m_collisionFilterGroup'] = btBroadphaseProxy.prototype.set_m_collisionFilterGroup = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btBroadphaseProxy_set_m_collisionFilterGroup_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btBroadphaseProxy.prototype, 'm_collisionFilterGroup', { get: btBroadphaseProxy.prototype.get_m_collisionFilterGroup, set: btBroadphaseProxy.prototype.set_m_collisionFilterGroup });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btBroadphaseProxy.prototype['get_m_collisionFilterMask'] = btBroadphaseProxy.prototype.get_m_collisionFilterMask = function() {
  var self = this.ptr;
  return _emscripten_bind_btBroadphaseProxy_get_m_collisionFilterMask_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btBroadphaseProxy.prototype['set_m_collisionFilterMask'] = btBroadphaseProxy.prototype.set_m_collisionFilterMask = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btBroadphaseProxy_set_m_collisionFilterMask_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btBroadphaseProxy.prototype, 'm_collisionFilterMask', { get: btBroadphaseProxy.prototype.get_m_collisionFilterMask, set: btBroadphaseProxy.prototype.set_m_collisionFilterMask });

/** @suppress {undefinedVars, duplicate} @this{Object} */
btBroadphaseProxy.prototype['__destroy__'] = btBroadphaseProxy.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btBroadphaseProxy___destroy___0(self);
};

// Interface: btRigidBodyConstructionInfo

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btRigidBodyConstructionInfo(mass, motionState, collisionShape, localInertia) {
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (motionState && typeof motionState === 'object') motionState = motionState.ptr;
  if (collisionShape && typeof collisionShape === 'object') collisionShape = collisionShape.ptr;
  if (localInertia && typeof localInertia === 'object') localInertia = localInertia.ptr;
  if (localInertia === undefined) { this.ptr = _emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_3(mass, motionState, collisionShape); getCache(btRigidBodyConstructionInfo)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_4(mass, motionState, collisionShape, localInertia);
  getCache(btRigidBodyConstructionInfo)[this.ptr] = this;
};

btRigidBodyConstructionInfo.prototype = Object.create(WrapperObject.prototype);
btRigidBodyConstructionInfo.prototype.constructor = btRigidBodyConstructionInfo;
btRigidBodyConstructionInfo.prototype.__class__ = btRigidBodyConstructionInfo;
btRigidBodyConstructionInfo.__cache__ = {};
Module['btRigidBodyConstructionInfo'] = btRigidBodyConstructionInfo;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['get_m_linearDamping'] = btRigidBodyConstructionInfo.prototype.get_m_linearDamping = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_linearDamping_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['set_m_linearDamping'] = btRigidBodyConstructionInfo.prototype.set_m_linearDamping = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_linearDamping_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btRigidBodyConstructionInfo.prototype, 'm_linearDamping', { get: btRigidBodyConstructionInfo.prototype.get_m_linearDamping, set: btRigidBodyConstructionInfo.prototype.set_m_linearDamping });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['get_m_angularDamping'] = btRigidBodyConstructionInfo.prototype.get_m_angularDamping = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_angularDamping_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['set_m_angularDamping'] = btRigidBodyConstructionInfo.prototype.set_m_angularDamping = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_angularDamping_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btRigidBodyConstructionInfo.prototype, 'm_angularDamping', { get: btRigidBodyConstructionInfo.prototype.get_m_angularDamping, set: btRigidBodyConstructionInfo.prototype.set_m_angularDamping });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['get_m_friction'] = btRigidBodyConstructionInfo.prototype.get_m_friction = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_friction_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['set_m_friction'] = btRigidBodyConstructionInfo.prototype.set_m_friction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_friction_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btRigidBodyConstructionInfo.prototype, 'm_friction', { get: btRigidBodyConstructionInfo.prototype.get_m_friction, set: btRigidBodyConstructionInfo.prototype.set_m_friction });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['get_m_rollingFriction'] = btRigidBodyConstructionInfo.prototype.get_m_rollingFriction = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_rollingFriction_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['set_m_rollingFriction'] = btRigidBodyConstructionInfo.prototype.set_m_rollingFriction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_rollingFriction_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btRigidBodyConstructionInfo.prototype, 'm_rollingFriction', { get: btRigidBodyConstructionInfo.prototype.get_m_rollingFriction, set: btRigidBodyConstructionInfo.prototype.set_m_rollingFriction });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['get_m_restitution'] = btRigidBodyConstructionInfo.prototype.get_m_restitution = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_restitution_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['set_m_restitution'] = btRigidBodyConstructionInfo.prototype.set_m_restitution = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_restitution_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btRigidBodyConstructionInfo.prototype, 'm_restitution', { get: btRigidBodyConstructionInfo.prototype.get_m_restitution, set: btRigidBodyConstructionInfo.prototype.set_m_restitution });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['get_m_linearSleepingThreshold'] = btRigidBodyConstructionInfo.prototype.get_m_linearSleepingThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_linearSleepingThreshold_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['set_m_linearSleepingThreshold'] = btRigidBodyConstructionInfo.prototype.set_m_linearSleepingThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_linearSleepingThreshold_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btRigidBodyConstructionInfo.prototype, 'm_linearSleepingThreshold', { get: btRigidBodyConstructionInfo.prototype.get_m_linearSleepingThreshold, set: btRigidBodyConstructionInfo.prototype.set_m_linearSleepingThreshold });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['get_m_angularSleepingThreshold'] = btRigidBodyConstructionInfo.prototype.get_m_angularSleepingThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_angularSleepingThreshold_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['set_m_angularSleepingThreshold'] = btRigidBodyConstructionInfo.prototype.set_m_angularSleepingThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_angularSleepingThreshold_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btRigidBodyConstructionInfo.prototype, 'm_angularSleepingThreshold', { get: btRigidBodyConstructionInfo.prototype.get_m_angularSleepingThreshold, set: btRigidBodyConstructionInfo.prototype.set_m_angularSleepingThreshold });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['get_m_additionalDamping'] = btRigidBodyConstructionInfo.prototype.get_m_additionalDamping = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDamping_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['set_m_additionalDamping'] = btRigidBodyConstructionInfo.prototype.set_m_additionalDamping = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDamping_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btRigidBodyConstructionInfo.prototype, 'm_additionalDamping', { get: btRigidBodyConstructionInfo.prototype.get_m_additionalDamping, set: btRigidBodyConstructionInfo.prototype.set_m_additionalDamping });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['get_m_additionalDampingFactor'] = btRigidBodyConstructionInfo.prototype.get_m_additionalDampingFactor = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDampingFactor_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['set_m_additionalDampingFactor'] = btRigidBodyConstructionInfo.prototype.set_m_additionalDampingFactor = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDampingFactor_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btRigidBodyConstructionInfo.prototype, 'm_additionalDampingFactor', { get: btRigidBodyConstructionInfo.prototype.get_m_additionalDampingFactor, set: btRigidBodyConstructionInfo.prototype.set_m_additionalDampingFactor });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['get_m_additionalLinearDampingThresholdSqr'] = btRigidBodyConstructionInfo.prototype.get_m_additionalLinearDampingThresholdSqr = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalLinearDampingThresholdSqr_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['set_m_additionalLinearDampingThresholdSqr'] = btRigidBodyConstructionInfo.prototype.set_m_additionalLinearDampingThresholdSqr = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalLinearDampingThresholdSqr_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btRigidBodyConstructionInfo.prototype, 'm_additionalLinearDampingThresholdSqr', { get: btRigidBodyConstructionInfo.prototype.get_m_additionalLinearDampingThresholdSqr, set: btRigidBodyConstructionInfo.prototype.set_m_additionalLinearDampingThresholdSqr });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['get_m_additionalAngularDampingThresholdSqr'] = btRigidBodyConstructionInfo.prototype.get_m_additionalAngularDampingThresholdSqr = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingThresholdSqr_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['set_m_additionalAngularDampingThresholdSqr'] = btRigidBodyConstructionInfo.prototype.set_m_additionalAngularDampingThresholdSqr = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingThresholdSqr_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btRigidBodyConstructionInfo.prototype, 'm_additionalAngularDampingThresholdSqr', { get: btRigidBodyConstructionInfo.prototype.get_m_additionalAngularDampingThresholdSqr, set: btRigidBodyConstructionInfo.prototype.set_m_additionalAngularDampingThresholdSqr });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['get_m_additionalAngularDampingFactor'] = btRigidBodyConstructionInfo.prototype.get_m_additionalAngularDampingFactor = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingFactor_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['set_m_additionalAngularDampingFactor'] = btRigidBodyConstructionInfo.prototype.set_m_additionalAngularDampingFactor = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingFactor_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btRigidBodyConstructionInfo.prototype, 'm_additionalAngularDampingFactor', { get: btRigidBodyConstructionInfo.prototype.get_m_additionalAngularDampingFactor, set: btRigidBodyConstructionInfo.prototype.set_m_additionalAngularDampingFactor });

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBodyConstructionInfo.prototype['__destroy__'] = btRigidBodyConstructionInfo.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btRigidBodyConstructionInfo___destroy___0(self);
};

// Interface: btRigidBody

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btRigidBody(constructionInfo) {
  if (constructionInfo && typeof constructionInfo === 'object') constructionInfo = constructionInfo.ptr;
  this.ptr = _emscripten_bind_btRigidBody_btRigidBody_1(constructionInfo);
  getCache(btRigidBody)[this.ptr] = this;
};

btRigidBody.prototype = Object.create(btCollisionObject.prototype);
btRigidBody.prototype.constructor = btRigidBody;
btRigidBody.prototype.__class__ = btRigidBody;
btRigidBody.__cache__ = {};
Module['btRigidBody'] = btRigidBody;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getCenterOfMassTransform'] = btRigidBody.prototype.getCenterOfMassTransform = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getCenterOfMassTransform_0(self), btTransform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setCenterOfMassTransform'] = btRigidBody.prototype.setCenterOfMassTransform = function(xform) {
  var self = this.ptr;
  if (xform && typeof xform === 'object') xform = xform.ptr;
  _emscripten_bind_btRigidBody_setCenterOfMassTransform_1(self, xform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setSleepingThresholds'] = btRigidBody.prototype.setSleepingThresholds = function(linear, angular) {
  var self = this.ptr;
  if (linear && typeof linear === 'object') linear = linear.ptr;
  if (angular && typeof angular === 'object') angular = angular.ptr;
  _emscripten_bind_btRigidBody_setSleepingThresholds_2(self, linear, angular);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getLinearDamping'] = btRigidBody.prototype.getLinearDamping = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBody_getLinearDamping_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getAngularDamping'] = btRigidBody.prototype.getAngularDamping = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBody_getAngularDamping_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setDamping'] = btRigidBody.prototype.setDamping = function(lin_damping, ang_damping) {
  var self = this.ptr;
  if (lin_damping && typeof lin_damping === 'object') lin_damping = lin_damping.ptr;
  if (ang_damping && typeof ang_damping === 'object') ang_damping = ang_damping.ptr;
  _emscripten_bind_btRigidBody_setDamping_2(self, lin_damping, ang_damping);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setMassProps'] = btRigidBody.prototype.setMassProps = function(mass, inertia) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (inertia && typeof inertia === 'object') inertia = inertia.ptr;
  _emscripten_bind_btRigidBody_setMassProps_2(self, mass, inertia);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getLinearFactor'] = btRigidBody.prototype.getLinearFactor = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getLinearFactor_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setLinearFactor'] = btRigidBody.prototype.setLinearFactor = function(linearFactor) {
  var self = this.ptr;
  if (linearFactor && typeof linearFactor === 'object') linearFactor = linearFactor.ptr;
  _emscripten_bind_btRigidBody_setLinearFactor_1(self, linearFactor);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['applyTorque'] = btRigidBody.prototype.applyTorque = function(torque) {
  var self = this.ptr;
  if (torque && typeof torque === 'object') torque = torque.ptr;
  _emscripten_bind_btRigidBody_applyTorque_1(self, torque);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['applyLocalTorque'] = btRigidBody.prototype.applyLocalTorque = function(torque) {
  var self = this.ptr;
  if (torque && typeof torque === 'object') torque = torque.ptr;
  _emscripten_bind_btRigidBody_applyLocalTorque_1(self, torque);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['applyForce'] = btRigidBody.prototype.applyForce = function(force, rel_pos) {
  var self = this.ptr;
  if (force && typeof force === 'object') force = force.ptr;
  if (rel_pos && typeof rel_pos === 'object') rel_pos = rel_pos.ptr;
  _emscripten_bind_btRigidBody_applyForce_2(self, force, rel_pos);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['applyCentralForce'] = btRigidBody.prototype.applyCentralForce = function(force) {
  var self = this.ptr;
  if (force && typeof force === 'object') force = force.ptr;
  _emscripten_bind_btRigidBody_applyCentralForce_1(self, force);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['applyCentralLocalForce'] = btRigidBody.prototype.applyCentralLocalForce = function(force) {
  var self = this.ptr;
  if (force && typeof force === 'object') force = force.ptr;
  _emscripten_bind_btRigidBody_applyCentralLocalForce_1(self, force);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['applyTorqueImpulse'] = btRigidBody.prototype.applyTorqueImpulse = function(torque) {
  var self = this.ptr;
  if (torque && typeof torque === 'object') torque = torque.ptr;
  _emscripten_bind_btRigidBody_applyTorqueImpulse_1(self, torque);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['applyImpulse'] = btRigidBody.prototype.applyImpulse = function(impulse, rel_pos) {
  var self = this.ptr;
  if (impulse && typeof impulse === 'object') impulse = impulse.ptr;
  if (rel_pos && typeof rel_pos === 'object') rel_pos = rel_pos.ptr;
  _emscripten_bind_btRigidBody_applyImpulse_2(self, impulse, rel_pos);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['applyCentralImpulse'] = btRigidBody.prototype.applyCentralImpulse = function(impulse) {
  var self = this.ptr;
  if (impulse && typeof impulse === 'object') impulse = impulse.ptr;
  _emscripten_bind_btRigidBody_applyCentralImpulse_1(self, impulse);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['updateInertiaTensor'] = btRigidBody.prototype.updateInertiaTensor = function() {
  var self = this.ptr;
  _emscripten_bind_btRigidBody_updateInertiaTensor_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getLinearVelocity'] = btRigidBody.prototype.getLinearVelocity = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getLinearVelocity_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getAngularVelocity'] = btRigidBody.prototype.getAngularVelocity = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getAngularVelocity_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setLinearVelocity'] = btRigidBody.prototype.setLinearVelocity = function(lin_vel) {
  var self = this.ptr;
  if (lin_vel && typeof lin_vel === 'object') lin_vel = lin_vel.ptr;
  _emscripten_bind_btRigidBody_setLinearVelocity_1(self, lin_vel);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setAngularVelocity'] = btRigidBody.prototype.setAngularVelocity = function(ang_vel) {
  var self = this.ptr;
  if (ang_vel && typeof ang_vel === 'object') ang_vel = ang_vel.ptr;
  _emscripten_bind_btRigidBody_setAngularVelocity_1(self, ang_vel);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getMotionState'] = btRigidBody.prototype.getMotionState = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getMotionState_0(self), btMotionState);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setMotionState'] = btRigidBody.prototype.setMotionState = function(motionState) {
  var self = this.ptr;
  if (motionState && typeof motionState === 'object') motionState = motionState.ptr;
  _emscripten_bind_btRigidBody_setMotionState_1(self, motionState);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getAngularFactor'] = btRigidBody.prototype.getAngularFactor = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getAngularFactor_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setAngularFactor'] = btRigidBody.prototype.setAngularFactor = function(angularFactor) {
  var self = this.ptr;
  if (angularFactor && typeof angularFactor === 'object') angularFactor = angularFactor.ptr;
  _emscripten_bind_btRigidBody_setAngularFactor_1(self, angularFactor);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['upcast'] = btRigidBody.prototype.upcast = function(colObj) {
  var self = this.ptr;
  if (colObj && typeof colObj === 'object') colObj = colObj.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_upcast_1(self, colObj), btRigidBody);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getAabb'] = btRigidBody.prototype.getAabb = function(aabbMin, aabbMax) {
  var self = this.ptr;
  if (aabbMin && typeof aabbMin === 'object') aabbMin = aabbMin.ptr;
  if (aabbMax && typeof aabbMax === 'object') aabbMax = aabbMax.ptr;
  _emscripten_bind_btRigidBody_getAabb_2(self, aabbMin, aabbMax);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['applyGravity'] = btRigidBody.prototype.applyGravity = function() {
  var self = this.ptr;
  _emscripten_bind_btRigidBody_applyGravity_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getGravity'] = btRigidBody.prototype.getGravity = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getGravity_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setGravity'] = btRigidBody.prototype.setGravity = function(acceleration) {
  var self = this.ptr;
  if (acceleration && typeof acceleration === 'object') acceleration = acceleration.ptr;
  _emscripten_bind_btRigidBody_setGravity_1(self, acceleration);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getBroadphaseProxy'] = btRigidBody.prototype.getBroadphaseProxy = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getBroadphaseProxy_0(self), btBroadphaseProxy);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['clearForces'] = btRigidBody.prototype.clearForces = function() {
  var self = this.ptr;
  _emscripten_bind_btRigidBody_clearForces_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setFlags'] = btRigidBody.prototype.setFlags = function(flags) {
  var self = this.ptr;
  if (flags && typeof flags === 'object') flags = flags.ptr;
  _emscripten_bind_btRigidBody_setFlags_1(self, flags);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getFlags'] = btRigidBody.prototype.getFlags = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBody_getFlags_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setAnisotropicFriction'] = btRigidBody.prototype.setAnisotropicFriction = function(anisotropicFriction, frictionMode) {
  var self = this.ptr;
  if (anisotropicFriction && typeof anisotropicFriction === 'object') anisotropicFriction = anisotropicFriction.ptr;
  if (frictionMode && typeof frictionMode === 'object') frictionMode = frictionMode.ptr;
  _emscripten_bind_btRigidBody_setAnisotropicFriction_2(self, anisotropicFriction, frictionMode);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getCollisionShape'] = btRigidBody.prototype.getCollisionShape = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getCollisionShape_0(self), btCollisionShape);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setContactProcessingThreshold'] = btRigidBody.prototype.setContactProcessingThreshold = function(contactProcessingThreshold) {
  var self = this.ptr;
  if (contactProcessingThreshold && typeof contactProcessingThreshold === 'object') contactProcessingThreshold = contactProcessingThreshold.ptr;
  _emscripten_bind_btRigidBody_setContactProcessingThreshold_1(self, contactProcessingThreshold);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setActivationState'] = btRigidBody.prototype.setActivationState = function(newState) {
  var self = this.ptr;
  if (newState && typeof newState === 'object') newState = newState.ptr;
  _emscripten_bind_btRigidBody_setActivationState_1(self, newState);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['forceActivationState'] = btRigidBody.prototype.forceActivationState = function(newState) {
  var self = this.ptr;
  if (newState && typeof newState === 'object') newState = newState.ptr;
  _emscripten_bind_btRigidBody_forceActivationState_1(self, newState);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['activate'] = btRigidBody.prototype.activate = function(forceActivation) {
  var self = this.ptr;
  if (forceActivation && typeof forceActivation === 'object') forceActivation = forceActivation.ptr;
  if (forceActivation === undefined) { _emscripten_bind_btRigidBody_activate_0(self); return }
  _emscripten_bind_btRigidBody_activate_1(self, forceActivation);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['isActive'] = btRigidBody.prototype.isActive = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btRigidBody_isActive_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['isKinematicObject'] = btRigidBody.prototype.isKinematicObject = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btRigidBody_isKinematicObject_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['isStaticObject'] = btRigidBody.prototype.isStaticObject = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btRigidBody_isStaticObject_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['isStaticOrKinematicObject'] = btRigidBody.prototype.isStaticOrKinematicObject = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btRigidBody_isStaticOrKinematicObject_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getRestitution'] = btRigidBody.prototype.getRestitution = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBody_getRestitution_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getFriction'] = btRigidBody.prototype.getFriction = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBody_getFriction_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getRollingFriction'] = btRigidBody.prototype.getRollingFriction = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBody_getRollingFriction_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setRestitution'] = btRigidBody.prototype.setRestitution = function(rest) {
  var self = this.ptr;
  if (rest && typeof rest === 'object') rest = rest.ptr;
  _emscripten_bind_btRigidBody_setRestitution_1(self, rest);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setFriction'] = btRigidBody.prototype.setFriction = function(frict) {
  var self = this.ptr;
  if (frict && typeof frict === 'object') frict = frict.ptr;
  _emscripten_bind_btRigidBody_setFriction_1(self, frict);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setRollingFriction'] = btRigidBody.prototype.setRollingFriction = function(frict) {
  var self = this.ptr;
  if (frict && typeof frict === 'object') frict = frict.ptr;
  _emscripten_bind_btRigidBody_setRollingFriction_1(self, frict);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getWorldTransform'] = btRigidBody.prototype.getWorldTransform = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getWorldTransform_0(self), btTransform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getCollisionFlags'] = btRigidBody.prototype.getCollisionFlags = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBody_getCollisionFlags_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setCollisionFlags'] = btRigidBody.prototype.setCollisionFlags = function(flags) {
  var self = this.ptr;
  if (flags && typeof flags === 'object') flags = flags.ptr;
  _emscripten_bind_btRigidBody_setCollisionFlags_1(self, flags);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setWorldTransform'] = btRigidBody.prototype.setWorldTransform = function(worldTrans) {
  var self = this.ptr;
  if (worldTrans && typeof worldTrans === 'object') worldTrans = worldTrans.ptr;
  _emscripten_bind_btRigidBody_setWorldTransform_1(self, worldTrans);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setCollisionShape'] = btRigidBody.prototype.setCollisionShape = function(collisionShape) {
  var self = this.ptr;
  if (collisionShape && typeof collisionShape === 'object') collisionShape = collisionShape.ptr;
  _emscripten_bind_btRigidBody_setCollisionShape_1(self, collisionShape);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setCcdMotionThreshold'] = btRigidBody.prototype.setCcdMotionThreshold = function(ccdMotionThreshold) {
  var self = this.ptr;
  if (ccdMotionThreshold && typeof ccdMotionThreshold === 'object') ccdMotionThreshold = ccdMotionThreshold.ptr;
  _emscripten_bind_btRigidBody_setCcdMotionThreshold_1(self, ccdMotionThreshold);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setCcdSweptSphereRadius'] = btRigidBody.prototype.setCcdSweptSphereRadius = function(radius) {
  var self = this.ptr;
  if (radius && typeof radius === 'object') radius = radius.ptr;
  _emscripten_bind_btRigidBody_setCcdSweptSphereRadius_1(self, radius);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getUserIndex'] = btRigidBody.prototype.getUserIndex = function() {
  var self = this.ptr;
  return _emscripten_bind_btRigidBody_getUserIndex_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setUserIndex'] = btRigidBody.prototype.setUserIndex = function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  _emscripten_bind_btRigidBody_setUserIndex_1(self, index);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getUserPointer'] = btRigidBody.prototype.getUserPointer = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getUserPointer_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['setUserPointer'] = btRigidBody.prototype.setUserPointer = function(userPointer) {
  var self = this.ptr;
  if (userPointer && typeof userPointer === 'object') userPointer = userPointer.ptr;
  _emscripten_bind_btRigidBody_setUserPointer_1(self, userPointer);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['getBroadphaseHandle'] = btRigidBody.prototype.getBroadphaseHandle = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRigidBody_getBroadphaseHandle_0(self), btBroadphaseProxy);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btRigidBody.prototype['__destroy__'] = btRigidBody.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btRigidBody___destroy___0(self);
};

// Interface: btConstraintSetting

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btConstraintSetting() {
  this.ptr = _emscripten_bind_btConstraintSetting_btConstraintSetting_0();
  getCache(btConstraintSetting)[this.ptr] = this;
};

btConstraintSetting.prototype = Object.create(WrapperObject.prototype);
btConstraintSetting.prototype.constructor = btConstraintSetting;
btConstraintSetting.prototype.__class__ = btConstraintSetting;
btConstraintSetting.__cache__ = {};
Module['btConstraintSetting'] = btConstraintSetting;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btConstraintSetting.prototype['get_m_tau'] = btConstraintSetting.prototype.get_m_tau = function() {
  var self = this.ptr;
  return _emscripten_bind_btConstraintSetting_get_m_tau_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConstraintSetting.prototype['set_m_tau'] = btConstraintSetting.prototype.set_m_tau = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConstraintSetting_set_m_tau_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btConstraintSetting.prototype, 'm_tau', { get: btConstraintSetting.prototype.get_m_tau, set: btConstraintSetting.prototype.set_m_tau });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btConstraintSetting.prototype['get_m_damping'] = btConstraintSetting.prototype.get_m_damping = function() {
  var self = this.ptr;
  return _emscripten_bind_btConstraintSetting_get_m_damping_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConstraintSetting.prototype['set_m_damping'] = btConstraintSetting.prototype.set_m_damping = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConstraintSetting_set_m_damping_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btConstraintSetting.prototype, 'm_damping', { get: btConstraintSetting.prototype.get_m_damping, set: btConstraintSetting.prototype.set_m_damping });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btConstraintSetting.prototype['get_m_impulseClamp'] = btConstraintSetting.prototype.get_m_impulseClamp = function() {
  var self = this.ptr;
  return _emscripten_bind_btConstraintSetting_get_m_impulseClamp_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConstraintSetting.prototype['set_m_impulseClamp'] = btConstraintSetting.prototype.set_m_impulseClamp = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btConstraintSetting_set_m_impulseClamp_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btConstraintSetting.prototype, 'm_impulseClamp', { get: btConstraintSetting.prototype.get_m_impulseClamp, set: btConstraintSetting.prototype.set_m_impulseClamp });

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConstraintSetting.prototype['__destroy__'] = btConstraintSetting.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConstraintSetting___destroy___0(self);
};

// Interface: btPoint2PointConstraint

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btPoint2PointConstraint(rbA, rbB, pivotInA, pivotInB) {
  if (rbA && typeof rbA === 'object') rbA = rbA.ptr;
  if (rbB && typeof rbB === 'object') rbB = rbB.ptr;
  if (pivotInA && typeof pivotInA === 'object') pivotInA = pivotInA.ptr;
  if (pivotInB && typeof pivotInB === 'object') pivotInB = pivotInB.ptr;
  if (pivotInA === undefined) { this.ptr = _emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_2(rbA, rbB); getCache(btPoint2PointConstraint)[this.ptr] = this;return }
  if (pivotInB === undefined) { this.ptr = _emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_3(rbA, rbB, pivotInA); getCache(btPoint2PointConstraint)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_4(rbA, rbB, pivotInA, pivotInB);
  getCache(btPoint2PointConstraint)[this.ptr] = this;
};

btPoint2PointConstraint.prototype = Object.create(btTypedConstraint.prototype);
btPoint2PointConstraint.prototype.constructor = btPoint2PointConstraint;
btPoint2PointConstraint.prototype.__class__ = btPoint2PointConstraint;
btPoint2PointConstraint.__cache__ = {};
Module['btPoint2PointConstraint'] = btPoint2PointConstraint;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btPoint2PointConstraint.prototype['setPivotA'] = btPoint2PointConstraint.prototype.setPivotA = function(pivotA) {
  var self = this.ptr;
  if (pivotA && typeof pivotA === 'object') pivotA = pivotA.ptr;
  _emscripten_bind_btPoint2PointConstraint_setPivotA_1(self, pivotA);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPoint2PointConstraint.prototype['setPivotB'] = btPoint2PointConstraint.prototype.setPivotB = function(pivotB) {
  var self = this.ptr;
  if (pivotB && typeof pivotB === 'object') pivotB = pivotB.ptr;
  _emscripten_bind_btPoint2PointConstraint_setPivotB_1(self, pivotB);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPoint2PointConstraint.prototype['getPivotInA'] = btPoint2PointConstraint.prototype.getPivotInA = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPoint2PointConstraint_getPivotInA_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPoint2PointConstraint.prototype['getPivotInB'] = btPoint2PointConstraint.prototype.getPivotInB = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPoint2PointConstraint_getPivotInB_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPoint2PointConstraint.prototype['enableFeedback'] = btPoint2PointConstraint.prototype.enableFeedback = function(needsFeedback) {
  var self = this.ptr;
  if (needsFeedback && typeof needsFeedback === 'object') needsFeedback = needsFeedback.ptr;
  _emscripten_bind_btPoint2PointConstraint_enableFeedback_1(self, needsFeedback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPoint2PointConstraint.prototype['getBreakingImpulseThreshold'] = btPoint2PointConstraint.prototype.getBreakingImpulseThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btPoint2PointConstraint_getBreakingImpulseThreshold_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPoint2PointConstraint.prototype['setBreakingImpulseThreshold'] = btPoint2PointConstraint.prototype.setBreakingImpulseThreshold = function(threshold) {
  var self = this.ptr;
  if (threshold && typeof threshold === 'object') threshold = threshold.ptr;
  _emscripten_bind_btPoint2PointConstraint_setBreakingImpulseThreshold_1(self, threshold);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPoint2PointConstraint.prototype['getParam'] = btPoint2PointConstraint.prototype.getParam = function(num, axis) {
  var self = this.ptr;
  if (num && typeof num === 'object') num = num.ptr;
  if (axis && typeof axis === 'object') axis = axis.ptr;
  return _emscripten_bind_btPoint2PointConstraint_getParam_2(self, num, axis);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPoint2PointConstraint.prototype['setParam'] = btPoint2PointConstraint.prototype.setParam = function(num, value, axis) {
  var self = this.ptr;
  if (num && typeof num === 'object') num = num.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  if (axis && typeof axis === 'object') axis = axis.ptr;
  _emscripten_bind_btPoint2PointConstraint_setParam_3(self, num, value, axis);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPoint2PointConstraint.prototype['get_m_setting'] = btPoint2PointConstraint.prototype.get_m_setting = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPoint2PointConstraint_get_m_setting_0(self), btConstraintSetting);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPoint2PointConstraint.prototype['set_m_setting'] = btPoint2PointConstraint.prototype.set_m_setting = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btPoint2PointConstraint_set_m_setting_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btPoint2PointConstraint.prototype, 'm_setting', { get: btPoint2PointConstraint.prototype.get_m_setting, set: btPoint2PointConstraint.prototype.set_m_setting });

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPoint2PointConstraint.prototype['__destroy__'] = btPoint2PointConstraint.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btPoint2PointConstraint___destroy___0(self);
};

// Interface: btGeneric6DofSpringConstraint

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btGeneric6DofSpringConstraint(rbA, rbB, frameInA, frameInB, useLinearFrameReferenceFrameA) {
  if (rbA && typeof rbA === 'object') rbA = rbA.ptr;
  if (rbB && typeof rbB === 'object') rbB = rbB.ptr;
  if (frameInA && typeof frameInA === 'object') frameInA = frameInA.ptr;
  if (frameInB && typeof frameInB === 'object') frameInB = frameInB.ptr;
  if (useLinearFrameReferenceFrameA && typeof useLinearFrameReferenceFrameA === 'object') useLinearFrameReferenceFrameA = useLinearFrameReferenceFrameA.ptr;
  if (frameInB === undefined) { this.ptr = _emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_3(rbA, rbB, frameInA); getCache(btGeneric6DofSpringConstraint)[this.ptr] = this;return }
  if (useLinearFrameReferenceFrameA === undefined) { this.ptr = _emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_4(rbA, rbB, frameInA, frameInB); getCache(btGeneric6DofSpringConstraint)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_5(rbA, rbB, frameInA, frameInB, useLinearFrameReferenceFrameA);
  getCache(btGeneric6DofSpringConstraint)[this.ptr] = this;
};

btGeneric6DofSpringConstraint.prototype = Object.create(btGeneric6DofConstraint.prototype);
btGeneric6DofSpringConstraint.prototype.constructor = btGeneric6DofSpringConstraint;
btGeneric6DofSpringConstraint.prototype.__class__ = btGeneric6DofSpringConstraint;
btGeneric6DofSpringConstraint.__cache__ = {};
Module['btGeneric6DofSpringConstraint'] = btGeneric6DofSpringConstraint;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofSpringConstraint.prototype['enableSpring'] = btGeneric6DofSpringConstraint.prototype.enableSpring = function(index, onOff) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  if (onOff && typeof onOff === 'object') onOff = onOff.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_enableSpring_2(self, index, onOff);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofSpringConstraint.prototype['setStiffness'] = btGeneric6DofSpringConstraint.prototype.setStiffness = function(index, stiffness) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  if (stiffness && typeof stiffness === 'object') stiffness = stiffness.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setStiffness_2(self, index, stiffness);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofSpringConstraint.prototype['setDamping'] = btGeneric6DofSpringConstraint.prototype.setDamping = function(index, damping) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  if (damping && typeof damping === 'object') damping = damping.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setDamping_2(self, index, damping);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofSpringConstraint.prototype['setEquilibriumPoint'] = btGeneric6DofSpringConstraint.prototype.setEquilibriumPoint = function(index, val) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  if (index === undefined) { _emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_0(self); return }
  if (val === undefined) { _emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_1(self, index); return }
  _emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_2(self, index, val);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofSpringConstraint.prototype['setLinearLowerLimit'] = btGeneric6DofSpringConstraint.prototype.setLinearLowerLimit = function(linearLower) {
  var self = this.ptr;
  if (linearLower && typeof linearLower === 'object') linearLower = linearLower.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setLinearLowerLimit_1(self, linearLower);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofSpringConstraint.prototype['setLinearUpperLimit'] = btGeneric6DofSpringConstraint.prototype.setLinearUpperLimit = function(linearUpper) {
  var self = this.ptr;
  if (linearUpper && typeof linearUpper === 'object') linearUpper = linearUpper.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setLinearUpperLimit_1(self, linearUpper);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofSpringConstraint.prototype['setAngularLowerLimit'] = btGeneric6DofSpringConstraint.prototype.setAngularLowerLimit = function(angularLower) {
  var self = this.ptr;
  if (angularLower && typeof angularLower === 'object') angularLower = angularLower.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setAngularLowerLimit_1(self, angularLower);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofSpringConstraint.prototype['setAngularUpperLimit'] = btGeneric6DofSpringConstraint.prototype.setAngularUpperLimit = function(angularUpper) {
  var self = this.ptr;
  if (angularUpper && typeof angularUpper === 'object') angularUpper = angularUpper.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setAngularUpperLimit_1(self, angularUpper);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofSpringConstraint.prototype['getFrameOffsetA'] = btGeneric6DofSpringConstraint.prototype.getFrameOffsetA = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btGeneric6DofSpringConstraint_getFrameOffsetA_0(self), btTransform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofSpringConstraint.prototype['enableFeedback'] = btGeneric6DofSpringConstraint.prototype.enableFeedback = function(needsFeedback) {
  var self = this.ptr;
  if (needsFeedback && typeof needsFeedback === 'object') needsFeedback = needsFeedback.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_enableFeedback_1(self, needsFeedback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofSpringConstraint.prototype['getBreakingImpulseThreshold'] = btGeneric6DofSpringConstraint.prototype.getBreakingImpulseThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btGeneric6DofSpringConstraint_getBreakingImpulseThreshold_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofSpringConstraint.prototype['setBreakingImpulseThreshold'] = btGeneric6DofSpringConstraint.prototype.setBreakingImpulseThreshold = function(threshold) {
  var self = this.ptr;
  if (threshold && typeof threshold === 'object') threshold = threshold.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setBreakingImpulseThreshold_1(self, threshold);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofSpringConstraint.prototype['getParam'] = btGeneric6DofSpringConstraint.prototype.getParam = function(num, axis) {
  var self = this.ptr;
  if (num && typeof num === 'object') num = num.ptr;
  if (axis && typeof axis === 'object') axis = axis.ptr;
  return _emscripten_bind_btGeneric6DofSpringConstraint_getParam_2(self, num, axis);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofSpringConstraint.prototype['setParam'] = btGeneric6DofSpringConstraint.prototype.setParam = function(num, value, axis) {
  var self = this.ptr;
  if (num && typeof num === 'object') num = num.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  if (axis && typeof axis === 'object') axis = axis.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint_setParam_3(self, num, value, axis);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btGeneric6DofSpringConstraint.prototype['__destroy__'] = btGeneric6DofSpringConstraint.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btGeneric6DofSpringConstraint___destroy___0(self);
};

// Interface: btSequentialImpulseConstraintSolver

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btSequentialImpulseConstraintSolver() {
  this.ptr = _emscripten_bind_btSequentialImpulseConstraintSolver_btSequentialImpulseConstraintSolver_0();
  getCache(btSequentialImpulseConstraintSolver)[this.ptr] = this;
};

btSequentialImpulseConstraintSolver.prototype = Object.create(WrapperObject.prototype);
btSequentialImpulseConstraintSolver.prototype.constructor = btSequentialImpulseConstraintSolver;
btSequentialImpulseConstraintSolver.prototype.__class__ = btSequentialImpulseConstraintSolver;
btSequentialImpulseConstraintSolver.__cache__ = {};
Module['btSequentialImpulseConstraintSolver'] = btSequentialImpulseConstraintSolver;

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSequentialImpulseConstraintSolver.prototype['__destroy__'] = btSequentialImpulseConstraintSolver.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btSequentialImpulseConstraintSolver___destroy___0(self);
};

// Interface: btConeTwistConstraint

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btConeTwistConstraint(rbA, rbB, rbAFrame, rbBFrame) {
  if (rbA && typeof rbA === 'object') rbA = rbA.ptr;
  if (rbB && typeof rbB === 'object') rbB = rbB.ptr;
  if (rbAFrame && typeof rbAFrame === 'object') rbAFrame = rbAFrame.ptr;
  if (rbBFrame && typeof rbBFrame === 'object') rbBFrame = rbBFrame.ptr;
  if (rbAFrame === undefined) { this.ptr = _emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_2(rbA, rbB); getCache(btConeTwistConstraint)[this.ptr] = this;return }
  if (rbBFrame === undefined) { this.ptr = _emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_3(rbA, rbB, rbAFrame); getCache(btConeTwistConstraint)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_4(rbA, rbB, rbAFrame, rbBFrame);
  getCache(btConeTwistConstraint)[this.ptr] = this;
};

btConeTwistConstraint.prototype = Object.create(btTypedConstraint.prototype);
btConeTwistConstraint.prototype.constructor = btConeTwistConstraint;
btConeTwistConstraint.prototype.__class__ = btConeTwistConstraint;
btConeTwistConstraint.__cache__ = {};
Module['btConeTwistConstraint'] = btConeTwistConstraint;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeTwistConstraint.prototype['setLimit'] = btConeTwistConstraint.prototype.setLimit = function(limitIndex, limitValue) {
  var self = this.ptr;
  if (limitIndex && typeof limitIndex === 'object') limitIndex = limitIndex.ptr;
  if (limitValue && typeof limitValue === 'object') limitValue = limitValue.ptr;
  _emscripten_bind_btConeTwistConstraint_setLimit_2(self, limitIndex, limitValue);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeTwistConstraint.prototype['setAngularOnly'] = btConeTwistConstraint.prototype.setAngularOnly = function(angularOnly) {
  var self = this.ptr;
  if (angularOnly && typeof angularOnly === 'object') angularOnly = angularOnly.ptr;
  _emscripten_bind_btConeTwistConstraint_setAngularOnly_1(self, angularOnly);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeTwistConstraint.prototype['setDamping'] = btConeTwistConstraint.prototype.setDamping = function(damping) {
  var self = this.ptr;
  if (damping && typeof damping === 'object') damping = damping.ptr;
  _emscripten_bind_btConeTwistConstraint_setDamping_1(self, damping);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeTwistConstraint.prototype['enableMotor'] = btConeTwistConstraint.prototype.enableMotor = function(b) {
  var self = this.ptr;
  if (b && typeof b === 'object') b = b.ptr;
  _emscripten_bind_btConeTwistConstraint_enableMotor_1(self, b);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeTwistConstraint.prototype['setMaxMotorImpulse'] = btConeTwistConstraint.prototype.setMaxMotorImpulse = function(maxMotorImpulse) {
  var self = this.ptr;
  if (maxMotorImpulse && typeof maxMotorImpulse === 'object') maxMotorImpulse = maxMotorImpulse.ptr;
  _emscripten_bind_btConeTwistConstraint_setMaxMotorImpulse_1(self, maxMotorImpulse);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeTwistConstraint.prototype['setMaxMotorImpulseNormalized'] = btConeTwistConstraint.prototype.setMaxMotorImpulseNormalized = function(maxMotorImpulse) {
  var self = this.ptr;
  if (maxMotorImpulse && typeof maxMotorImpulse === 'object') maxMotorImpulse = maxMotorImpulse.ptr;
  _emscripten_bind_btConeTwistConstraint_setMaxMotorImpulseNormalized_1(self, maxMotorImpulse);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeTwistConstraint.prototype['setMotorTarget'] = btConeTwistConstraint.prototype.setMotorTarget = function(q) {
  var self = this.ptr;
  if (q && typeof q === 'object') q = q.ptr;
  _emscripten_bind_btConeTwistConstraint_setMotorTarget_1(self, q);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeTwistConstraint.prototype['setMotorTargetInConstraintSpace'] = btConeTwistConstraint.prototype.setMotorTargetInConstraintSpace = function(q) {
  var self = this.ptr;
  if (q && typeof q === 'object') q = q.ptr;
  _emscripten_bind_btConeTwistConstraint_setMotorTargetInConstraintSpace_1(self, q);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeTwistConstraint.prototype['enableFeedback'] = btConeTwistConstraint.prototype.enableFeedback = function(needsFeedback) {
  var self = this.ptr;
  if (needsFeedback && typeof needsFeedback === 'object') needsFeedback = needsFeedback.ptr;
  _emscripten_bind_btConeTwistConstraint_enableFeedback_1(self, needsFeedback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeTwistConstraint.prototype['getBreakingImpulseThreshold'] = btConeTwistConstraint.prototype.getBreakingImpulseThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btConeTwistConstraint_getBreakingImpulseThreshold_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeTwistConstraint.prototype['setBreakingImpulseThreshold'] = btConeTwistConstraint.prototype.setBreakingImpulseThreshold = function(threshold) {
  var self = this.ptr;
  if (threshold && typeof threshold === 'object') threshold = threshold.ptr;
  _emscripten_bind_btConeTwistConstraint_setBreakingImpulseThreshold_1(self, threshold);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeTwistConstraint.prototype['getParam'] = btConeTwistConstraint.prototype.getParam = function(num, axis) {
  var self = this.ptr;
  if (num && typeof num === 'object') num = num.ptr;
  if (axis && typeof axis === 'object') axis = axis.ptr;
  return _emscripten_bind_btConeTwistConstraint_getParam_2(self, num, axis);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeTwistConstraint.prototype['setParam'] = btConeTwistConstraint.prototype.setParam = function(num, value, axis) {
  var self = this.ptr;
  if (num && typeof num === 'object') num = num.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  if (axis && typeof axis === 'object') axis = axis.ptr;
  _emscripten_bind_btConeTwistConstraint_setParam_3(self, num, value, axis);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btConeTwistConstraint.prototype['__destroy__'] = btConeTwistConstraint.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConeTwistConstraint___destroy___0(self);
};

// Interface: btHingeConstraint

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btHingeConstraint(rbA, rbB, pivotInA, pivotInB, axisInA, axisInB, useReferenceFrameA) {
  if (rbA && typeof rbA === 'object') rbA = rbA.ptr;
  if (rbB && typeof rbB === 'object') rbB = rbB.ptr;
  if (pivotInA && typeof pivotInA === 'object') pivotInA = pivotInA.ptr;
  if (pivotInB && typeof pivotInB === 'object') pivotInB = pivotInB.ptr;
  if (axisInA && typeof axisInA === 'object') axisInA = axisInA.ptr;
  if (axisInB && typeof axisInB === 'object') axisInB = axisInB.ptr;
  if (useReferenceFrameA && typeof useReferenceFrameA === 'object') useReferenceFrameA = useReferenceFrameA.ptr;
  if (pivotInA === undefined) { this.ptr = _emscripten_bind_btHingeConstraint_btHingeConstraint_2(rbA, rbB); getCache(btHingeConstraint)[this.ptr] = this;return }
  if (pivotInB === undefined) { this.ptr = _emscripten_bind_btHingeConstraint_btHingeConstraint_3(rbA, rbB, pivotInA); getCache(btHingeConstraint)[this.ptr] = this;return }
  if (axisInA === undefined) { this.ptr = _emscripten_bind_btHingeConstraint_btHingeConstraint_4(rbA, rbB, pivotInA, pivotInB); getCache(btHingeConstraint)[this.ptr] = this;return }
  if (axisInB === undefined) { this.ptr = _emscripten_bind_btHingeConstraint_btHingeConstraint_5(rbA, rbB, pivotInA, pivotInB, axisInA); getCache(btHingeConstraint)[this.ptr] = this;return }
  if (useReferenceFrameA === undefined) { this.ptr = _emscripten_bind_btHingeConstraint_btHingeConstraint_6(rbA, rbB, pivotInA, pivotInB, axisInA, axisInB); getCache(btHingeConstraint)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btHingeConstraint_btHingeConstraint_7(rbA, rbB, pivotInA, pivotInB, axisInA, axisInB, useReferenceFrameA);
  getCache(btHingeConstraint)[this.ptr] = this;
};

btHingeConstraint.prototype = Object.create(btTypedConstraint.prototype);
btHingeConstraint.prototype.constructor = btHingeConstraint;
btHingeConstraint.prototype.__class__ = btHingeConstraint;
btHingeConstraint.__cache__ = {};
Module['btHingeConstraint'] = btHingeConstraint;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btHingeConstraint.prototype['getHingeAngle'] = btHingeConstraint.prototype.getHingeAngle = function() {
  var self = this.ptr;
  return _emscripten_bind_btHingeConstraint_getHingeAngle_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btHingeConstraint.prototype['setLimit'] = btHingeConstraint.prototype.setLimit = function(low, high, softness, biasFactor, relaxationFactor) {
  var self = this.ptr;
  if (low && typeof low === 'object') low = low.ptr;
  if (high && typeof high === 'object') high = high.ptr;
  if (softness && typeof softness === 'object') softness = softness.ptr;
  if (biasFactor && typeof biasFactor === 'object') biasFactor = biasFactor.ptr;
  if (relaxationFactor && typeof relaxationFactor === 'object') relaxationFactor = relaxationFactor.ptr;
  if (relaxationFactor === undefined) { _emscripten_bind_btHingeConstraint_setLimit_4(self, low, high, softness, biasFactor); return }
  _emscripten_bind_btHingeConstraint_setLimit_5(self, low, high, softness, biasFactor, relaxationFactor);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btHingeConstraint.prototype['enableAngularMotor'] = btHingeConstraint.prototype.enableAngularMotor = function(enableMotor, targetVelocity, maxMotorImpulse) {
  var self = this.ptr;
  if (enableMotor && typeof enableMotor === 'object') enableMotor = enableMotor.ptr;
  if (targetVelocity && typeof targetVelocity === 'object') targetVelocity = targetVelocity.ptr;
  if (maxMotorImpulse && typeof maxMotorImpulse === 'object') maxMotorImpulse = maxMotorImpulse.ptr;
  _emscripten_bind_btHingeConstraint_enableAngularMotor_3(self, enableMotor, targetVelocity, maxMotorImpulse);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btHingeConstraint.prototype['setAngularOnly'] = btHingeConstraint.prototype.setAngularOnly = function(angularOnly) {
  var self = this.ptr;
  if (angularOnly && typeof angularOnly === 'object') angularOnly = angularOnly.ptr;
  _emscripten_bind_btHingeConstraint_setAngularOnly_1(self, angularOnly);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btHingeConstraint.prototype['enableMotor'] = btHingeConstraint.prototype.enableMotor = function(enableMotor) {
  var self = this.ptr;
  if (enableMotor && typeof enableMotor === 'object') enableMotor = enableMotor.ptr;
  _emscripten_bind_btHingeConstraint_enableMotor_1(self, enableMotor);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btHingeConstraint.prototype['setMaxMotorImpulse'] = btHingeConstraint.prototype.setMaxMotorImpulse = function(maxMotorImpulse) {
  var self = this.ptr;
  if (maxMotorImpulse && typeof maxMotorImpulse === 'object') maxMotorImpulse = maxMotorImpulse.ptr;
  _emscripten_bind_btHingeConstraint_setMaxMotorImpulse_1(self, maxMotorImpulse);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btHingeConstraint.prototype['setMotorTarget'] = btHingeConstraint.prototype.setMotorTarget = function(targetAngle, dt) {
  var self = this.ptr;
  if (targetAngle && typeof targetAngle === 'object') targetAngle = targetAngle.ptr;
  if (dt && typeof dt === 'object') dt = dt.ptr;
  _emscripten_bind_btHingeConstraint_setMotorTarget_2(self, targetAngle, dt);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btHingeConstraint.prototype['enableFeedback'] = btHingeConstraint.prototype.enableFeedback = function(needsFeedback) {
  var self = this.ptr;
  if (needsFeedback && typeof needsFeedback === 'object') needsFeedback = needsFeedback.ptr;
  _emscripten_bind_btHingeConstraint_enableFeedback_1(self, needsFeedback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btHingeConstraint.prototype['getBreakingImpulseThreshold'] = btHingeConstraint.prototype.getBreakingImpulseThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btHingeConstraint_getBreakingImpulseThreshold_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btHingeConstraint.prototype['setBreakingImpulseThreshold'] = btHingeConstraint.prototype.setBreakingImpulseThreshold = function(threshold) {
  var self = this.ptr;
  if (threshold && typeof threshold === 'object') threshold = threshold.ptr;
  _emscripten_bind_btHingeConstraint_setBreakingImpulseThreshold_1(self, threshold);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btHingeConstraint.prototype['getParam'] = btHingeConstraint.prototype.getParam = function(num, axis) {
  var self = this.ptr;
  if (num && typeof num === 'object') num = num.ptr;
  if (axis && typeof axis === 'object') axis = axis.ptr;
  return _emscripten_bind_btHingeConstraint_getParam_2(self, num, axis);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btHingeConstraint.prototype['setParam'] = btHingeConstraint.prototype.setParam = function(num, value, axis) {
  var self = this.ptr;
  if (num && typeof num === 'object') num = num.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  if (axis && typeof axis === 'object') axis = axis.ptr;
  _emscripten_bind_btHingeConstraint_setParam_3(self, num, value, axis);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btHingeConstraint.prototype['__destroy__'] = btHingeConstraint.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btHingeConstraint___destroy___0(self);
};

// Interface: btSliderConstraint

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btSliderConstraint(rbA, rbB, frameInA, frameInB, useLinearReferenceFrameA) {
  if (rbA && typeof rbA === 'object') rbA = rbA.ptr;
  if (rbB && typeof rbB === 'object') rbB = rbB.ptr;
  if (frameInA && typeof frameInA === 'object') frameInA = frameInA.ptr;
  if (frameInB && typeof frameInB === 'object') frameInB = frameInB.ptr;
  if (useLinearReferenceFrameA && typeof useLinearReferenceFrameA === 'object') useLinearReferenceFrameA = useLinearReferenceFrameA.ptr;
  if (frameInB === undefined) { this.ptr = _emscripten_bind_btSliderConstraint_btSliderConstraint_3(rbA, rbB, frameInA); getCache(btSliderConstraint)[this.ptr] = this;return }
  if (useLinearReferenceFrameA === undefined) { this.ptr = _emscripten_bind_btSliderConstraint_btSliderConstraint_4(rbA, rbB, frameInA, frameInB); getCache(btSliderConstraint)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btSliderConstraint_btSliderConstraint_5(rbA, rbB, frameInA, frameInB, useLinearReferenceFrameA);
  getCache(btSliderConstraint)[this.ptr] = this;
};

btSliderConstraint.prototype = Object.create(btTypedConstraint.prototype);
btSliderConstraint.prototype.constructor = btSliderConstraint;
btSliderConstraint.prototype.__class__ = btSliderConstraint;
btSliderConstraint.__cache__ = {};
Module['btSliderConstraint'] = btSliderConstraint;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btSliderConstraint.prototype['getLinearPos'] = btSliderConstraint.prototype.getLinearPos = function() {
  var self = this.ptr;
  return _emscripten_bind_btSliderConstraint_getLinearPos_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSliderConstraint.prototype['getAngularPos'] = btSliderConstraint.prototype.getAngularPos = function() {
  var self = this.ptr;
  return _emscripten_bind_btSliderConstraint_getAngularPos_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSliderConstraint.prototype['setLowerLinLimit'] = btSliderConstraint.prototype.setLowerLinLimit = function(lowerLimit) {
  var self = this.ptr;
  if (lowerLimit && typeof lowerLimit === 'object') lowerLimit = lowerLimit.ptr;
  _emscripten_bind_btSliderConstraint_setLowerLinLimit_1(self, lowerLimit);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSliderConstraint.prototype['setUpperLinLimit'] = btSliderConstraint.prototype.setUpperLinLimit = function(upperLimit) {
  var self = this.ptr;
  if (upperLimit && typeof upperLimit === 'object') upperLimit = upperLimit.ptr;
  _emscripten_bind_btSliderConstraint_setUpperLinLimit_1(self, upperLimit);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSliderConstraint.prototype['setLowerAngLimit'] = btSliderConstraint.prototype.setLowerAngLimit = function(lowerAngLimit) {
  var self = this.ptr;
  if (lowerAngLimit && typeof lowerAngLimit === 'object') lowerAngLimit = lowerAngLimit.ptr;
  _emscripten_bind_btSliderConstraint_setLowerAngLimit_1(self, lowerAngLimit);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSliderConstraint.prototype['setUpperAngLimit'] = btSliderConstraint.prototype.setUpperAngLimit = function(upperAngLimit) {
  var self = this.ptr;
  if (upperAngLimit && typeof upperAngLimit === 'object') upperAngLimit = upperAngLimit.ptr;
  _emscripten_bind_btSliderConstraint_setUpperAngLimit_1(self, upperAngLimit);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSliderConstraint.prototype['setPoweredLinMotor'] = btSliderConstraint.prototype.setPoweredLinMotor = function(onOff) {
  var self = this.ptr;
  if (onOff && typeof onOff === 'object') onOff = onOff.ptr;
  _emscripten_bind_btSliderConstraint_setPoweredLinMotor_1(self, onOff);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSliderConstraint.prototype['setMaxLinMotorForce'] = btSliderConstraint.prototype.setMaxLinMotorForce = function(maxLinMotorForce) {
  var self = this.ptr;
  if (maxLinMotorForce && typeof maxLinMotorForce === 'object') maxLinMotorForce = maxLinMotorForce.ptr;
  _emscripten_bind_btSliderConstraint_setMaxLinMotorForce_1(self, maxLinMotorForce);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSliderConstraint.prototype['setTargetLinMotorVelocity'] = btSliderConstraint.prototype.setTargetLinMotorVelocity = function(targetLinMotorVelocity) {
  var self = this.ptr;
  if (targetLinMotorVelocity && typeof targetLinMotorVelocity === 'object') targetLinMotorVelocity = targetLinMotorVelocity.ptr;
  _emscripten_bind_btSliderConstraint_setTargetLinMotorVelocity_1(self, targetLinMotorVelocity);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSliderConstraint.prototype['enableFeedback'] = btSliderConstraint.prototype.enableFeedback = function(needsFeedback) {
  var self = this.ptr;
  if (needsFeedback && typeof needsFeedback === 'object') needsFeedback = needsFeedback.ptr;
  _emscripten_bind_btSliderConstraint_enableFeedback_1(self, needsFeedback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSliderConstraint.prototype['getBreakingImpulseThreshold'] = btSliderConstraint.prototype.getBreakingImpulseThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btSliderConstraint_getBreakingImpulseThreshold_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSliderConstraint.prototype['setBreakingImpulseThreshold'] = btSliderConstraint.prototype.setBreakingImpulseThreshold = function(threshold) {
  var self = this.ptr;
  if (threshold && typeof threshold === 'object') threshold = threshold.ptr;
  _emscripten_bind_btSliderConstraint_setBreakingImpulseThreshold_1(self, threshold);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSliderConstraint.prototype['getParam'] = btSliderConstraint.prototype.getParam = function(num, axis) {
  var self = this.ptr;
  if (num && typeof num === 'object') num = num.ptr;
  if (axis && typeof axis === 'object') axis = axis.ptr;
  return _emscripten_bind_btSliderConstraint_getParam_2(self, num, axis);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSliderConstraint.prototype['setParam'] = btSliderConstraint.prototype.setParam = function(num, value, axis) {
  var self = this.ptr;
  if (num && typeof num === 'object') num = num.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  if (axis && typeof axis === 'object') axis = axis.ptr;
  _emscripten_bind_btSliderConstraint_setParam_3(self, num, value, axis);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btSliderConstraint.prototype['__destroy__'] = btSliderConstraint.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btSliderConstraint___destroy___0(self);
};

// Interface: btFixedConstraint

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btFixedConstraint(rbA, rbB, frameInA, frameInB) {
  if (rbA && typeof rbA === 'object') rbA = rbA.ptr;
  if (rbB && typeof rbB === 'object') rbB = rbB.ptr;
  if (frameInA && typeof frameInA === 'object') frameInA = frameInA.ptr;
  if (frameInB && typeof frameInB === 'object') frameInB = frameInB.ptr;
  this.ptr = _emscripten_bind_btFixedConstraint_btFixedConstraint_4(rbA, rbB, frameInA, frameInB);
  getCache(btFixedConstraint)[this.ptr] = this;
};

btFixedConstraint.prototype = Object.create(btTypedConstraint.prototype);
btFixedConstraint.prototype.constructor = btFixedConstraint;
btFixedConstraint.prototype.__class__ = btFixedConstraint;
btFixedConstraint.__cache__ = {};
Module['btFixedConstraint'] = btFixedConstraint;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btFixedConstraint.prototype['enableFeedback'] = btFixedConstraint.prototype.enableFeedback = function(needsFeedback) {
  var self = this.ptr;
  if (needsFeedback && typeof needsFeedback === 'object') needsFeedback = needsFeedback.ptr;
  _emscripten_bind_btFixedConstraint_enableFeedback_1(self, needsFeedback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btFixedConstraint.prototype['getBreakingImpulseThreshold'] = btFixedConstraint.prototype.getBreakingImpulseThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btFixedConstraint_getBreakingImpulseThreshold_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btFixedConstraint.prototype['setBreakingImpulseThreshold'] = btFixedConstraint.prototype.setBreakingImpulseThreshold = function(threshold) {
  var self = this.ptr;
  if (threshold && typeof threshold === 'object') threshold = threshold.ptr;
  _emscripten_bind_btFixedConstraint_setBreakingImpulseThreshold_1(self, threshold);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btFixedConstraint.prototype['getParam'] = btFixedConstraint.prototype.getParam = function(num, axis) {
  var self = this.ptr;
  if (num && typeof num === 'object') num = num.ptr;
  if (axis && typeof axis === 'object') axis = axis.ptr;
  return _emscripten_bind_btFixedConstraint_getParam_2(self, num, axis);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btFixedConstraint.prototype['setParam'] = btFixedConstraint.prototype.setParam = function(num, value, axis) {
  var self = this.ptr;
  if (num && typeof num === 'object') num = num.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  if (axis && typeof axis === 'object') axis = axis.ptr;
  _emscripten_bind_btFixedConstraint_setParam_3(self, num, value, axis);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btFixedConstraint.prototype['__destroy__'] = btFixedConstraint.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btFixedConstraint___destroy___0(self);
};

// Interface: btConstraintSolver

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btConstraintSolver() { throw "cannot construct a btConstraintSolver, no constructor in IDL" }
btConstraintSolver.prototype = Object.create(WrapperObject.prototype);
btConstraintSolver.prototype.constructor = btConstraintSolver;
btConstraintSolver.prototype.__class__ = btConstraintSolver;
btConstraintSolver.__cache__ = {};
Module['btConstraintSolver'] = btConstraintSolver;

/** @suppress {undefinedVars, duplicate} @this{Object} */
btConstraintSolver.prototype['__destroy__'] = btConstraintSolver.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btConstraintSolver___destroy___0(self);
};

// Interface: btDispatcherInfo

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btDispatcherInfo() { throw "cannot construct a btDispatcherInfo, no constructor in IDL" }
btDispatcherInfo.prototype = Object.create(WrapperObject.prototype);
btDispatcherInfo.prototype.constructor = btDispatcherInfo;
btDispatcherInfo.prototype.__class__ = btDispatcherInfo;
btDispatcherInfo.__cache__ = {};
Module['btDispatcherInfo'] = btDispatcherInfo;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['get_m_timeStep'] = btDispatcherInfo.prototype.get_m_timeStep = function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcherInfo_get_m_timeStep_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['set_m_timeStep'] = btDispatcherInfo.prototype.set_m_timeStep = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_timeStep_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btDispatcherInfo.prototype, 'm_timeStep', { get: btDispatcherInfo.prototype.get_m_timeStep, set: btDispatcherInfo.prototype.set_m_timeStep });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['get_m_stepCount'] = btDispatcherInfo.prototype.get_m_stepCount = function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcherInfo_get_m_stepCount_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['set_m_stepCount'] = btDispatcherInfo.prototype.set_m_stepCount = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_stepCount_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btDispatcherInfo.prototype, 'm_stepCount', { get: btDispatcherInfo.prototype.get_m_stepCount, set: btDispatcherInfo.prototype.set_m_stepCount });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['get_m_dispatchFunc'] = btDispatcherInfo.prototype.get_m_dispatchFunc = function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcherInfo_get_m_dispatchFunc_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['set_m_dispatchFunc'] = btDispatcherInfo.prototype.set_m_dispatchFunc = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_dispatchFunc_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btDispatcherInfo.prototype, 'm_dispatchFunc', { get: btDispatcherInfo.prototype.get_m_dispatchFunc, set: btDispatcherInfo.prototype.set_m_dispatchFunc });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['get_m_timeOfImpact'] = btDispatcherInfo.prototype.get_m_timeOfImpact = function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcherInfo_get_m_timeOfImpact_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['set_m_timeOfImpact'] = btDispatcherInfo.prototype.set_m_timeOfImpact = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_timeOfImpact_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btDispatcherInfo.prototype, 'm_timeOfImpact', { get: btDispatcherInfo.prototype.get_m_timeOfImpact, set: btDispatcherInfo.prototype.set_m_timeOfImpact });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['get_m_useContinuous'] = btDispatcherInfo.prototype.get_m_useContinuous = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btDispatcherInfo_get_m_useContinuous_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['set_m_useContinuous'] = btDispatcherInfo.prototype.set_m_useContinuous = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_useContinuous_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btDispatcherInfo.prototype, 'm_useContinuous', { get: btDispatcherInfo.prototype.get_m_useContinuous, set: btDispatcherInfo.prototype.set_m_useContinuous });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['get_m_enableSatConvex'] = btDispatcherInfo.prototype.get_m_enableSatConvex = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btDispatcherInfo_get_m_enableSatConvex_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['set_m_enableSatConvex'] = btDispatcherInfo.prototype.set_m_enableSatConvex = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_enableSatConvex_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btDispatcherInfo.prototype, 'm_enableSatConvex', { get: btDispatcherInfo.prototype.get_m_enableSatConvex, set: btDispatcherInfo.prototype.set_m_enableSatConvex });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['get_m_enableSPU'] = btDispatcherInfo.prototype.get_m_enableSPU = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btDispatcherInfo_get_m_enableSPU_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['set_m_enableSPU'] = btDispatcherInfo.prototype.set_m_enableSPU = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_enableSPU_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btDispatcherInfo.prototype, 'm_enableSPU', { get: btDispatcherInfo.prototype.get_m_enableSPU, set: btDispatcherInfo.prototype.set_m_enableSPU });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['get_m_useEpa'] = btDispatcherInfo.prototype.get_m_useEpa = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btDispatcherInfo_get_m_useEpa_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['set_m_useEpa'] = btDispatcherInfo.prototype.set_m_useEpa = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_useEpa_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btDispatcherInfo.prototype, 'm_useEpa', { get: btDispatcherInfo.prototype.get_m_useEpa, set: btDispatcherInfo.prototype.set_m_useEpa });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['get_m_allowedCcdPenetration'] = btDispatcherInfo.prototype.get_m_allowedCcdPenetration = function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcherInfo_get_m_allowedCcdPenetration_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['set_m_allowedCcdPenetration'] = btDispatcherInfo.prototype.set_m_allowedCcdPenetration = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_allowedCcdPenetration_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btDispatcherInfo.prototype, 'm_allowedCcdPenetration', { get: btDispatcherInfo.prototype.get_m_allowedCcdPenetration, set: btDispatcherInfo.prototype.set_m_allowedCcdPenetration });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['get_m_useConvexConservativeDistanceUtil'] = btDispatcherInfo.prototype.get_m_useConvexConservativeDistanceUtil = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btDispatcherInfo_get_m_useConvexConservativeDistanceUtil_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['set_m_useConvexConservativeDistanceUtil'] = btDispatcherInfo.prototype.set_m_useConvexConservativeDistanceUtil = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_useConvexConservativeDistanceUtil_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btDispatcherInfo.prototype, 'm_useConvexConservativeDistanceUtil', { get: btDispatcherInfo.prototype.get_m_useConvexConservativeDistanceUtil, set: btDispatcherInfo.prototype.set_m_useConvexConservativeDistanceUtil });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['get_m_convexConservativeDistanceThreshold'] = btDispatcherInfo.prototype.get_m_convexConservativeDistanceThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btDispatcherInfo_get_m_convexConservativeDistanceThreshold_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['set_m_convexConservativeDistanceThreshold'] = btDispatcherInfo.prototype.set_m_convexConservativeDistanceThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btDispatcherInfo_set_m_convexConservativeDistanceThreshold_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btDispatcherInfo.prototype, 'm_convexConservativeDistanceThreshold', { get: btDispatcherInfo.prototype.get_m_convexConservativeDistanceThreshold, set: btDispatcherInfo.prototype.set_m_convexConservativeDistanceThreshold });

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDispatcherInfo.prototype['__destroy__'] = btDispatcherInfo.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btDispatcherInfo___destroy___0(self);
};

// Interface: btContactSolverInfo

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btContactSolverInfo() { throw "cannot construct a btContactSolverInfo, no constructor in IDL" }
btContactSolverInfo.prototype = Object.create(WrapperObject.prototype);
btContactSolverInfo.prototype.constructor = btContactSolverInfo;
btContactSolverInfo.prototype.__class__ = btContactSolverInfo;
btContactSolverInfo.__cache__ = {};
Module['btContactSolverInfo'] = btContactSolverInfo;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btContactSolverInfo.prototype['get_m_splitImpulse'] = btContactSolverInfo.prototype.get_m_splitImpulse = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btContactSolverInfo_get_m_splitImpulse_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btContactSolverInfo.prototype['set_m_splitImpulse'] = btContactSolverInfo.prototype.set_m_splitImpulse = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btContactSolverInfo_set_m_splitImpulse_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btContactSolverInfo.prototype, 'm_splitImpulse', { get: btContactSolverInfo.prototype.get_m_splitImpulse, set: btContactSolverInfo.prototype.set_m_splitImpulse });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btContactSolverInfo.prototype['get_m_splitImpulsePenetrationThreshold'] = btContactSolverInfo.prototype.get_m_splitImpulsePenetrationThreshold = function() {
  var self = this.ptr;
  return _emscripten_bind_btContactSolverInfo_get_m_splitImpulsePenetrationThreshold_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btContactSolverInfo.prototype['set_m_splitImpulsePenetrationThreshold'] = btContactSolverInfo.prototype.set_m_splitImpulsePenetrationThreshold = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btContactSolverInfo_set_m_splitImpulsePenetrationThreshold_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btContactSolverInfo.prototype, 'm_splitImpulsePenetrationThreshold', { get: btContactSolverInfo.prototype.get_m_splitImpulsePenetrationThreshold, set: btContactSolverInfo.prototype.set_m_splitImpulsePenetrationThreshold });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btContactSolverInfo.prototype['get_m_numIterations'] = btContactSolverInfo.prototype.get_m_numIterations = function() {
  var self = this.ptr;
  return _emscripten_bind_btContactSolverInfo_get_m_numIterations_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btContactSolverInfo.prototype['set_m_numIterations'] = btContactSolverInfo.prototype.set_m_numIterations = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btContactSolverInfo_set_m_numIterations_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btContactSolverInfo.prototype, 'm_numIterations', { get: btContactSolverInfo.prototype.get_m_numIterations, set: btContactSolverInfo.prototype.set_m_numIterations });

/** @suppress {undefinedVars, duplicate} @this{Object} */
btContactSolverInfo.prototype['__destroy__'] = btContactSolverInfo.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btContactSolverInfo___destroy___0(self);
};

// Interface: btVehicleTuning

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btVehicleTuning() {
  this.ptr = _emscripten_bind_btVehicleTuning_btVehicleTuning_0();
  getCache(btVehicleTuning)[this.ptr] = this;
};

btVehicleTuning.prototype = Object.create(WrapperObject.prototype);
btVehicleTuning.prototype.constructor = btVehicleTuning;
btVehicleTuning.prototype.__class__ = btVehicleTuning;
btVehicleTuning.__cache__ = {};
Module['btVehicleTuning'] = btVehicleTuning;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleTuning.prototype['get_m_suspensionStiffness'] = btVehicleTuning.prototype.get_m_suspensionStiffness = function() {
  var self = this.ptr;
  return _emscripten_bind_btVehicleTuning_get_m_suspensionStiffness_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleTuning.prototype['set_m_suspensionStiffness'] = btVehicleTuning.prototype.set_m_suspensionStiffness = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleTuning_set_m_suspensionStiffness_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btVehicleTuning.prototype, 'm_suspensionStiffness', { get: btVehicleTuning.prototype.get_m_suspensionStiffness, set: btVehicleTuning.prototype.set_m_suspensionStiffness });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleTuning.prototype['get_m_suspensionCompression'] = btVehicleTuning.prototype.get_m_suspensionCompression = function() {
  var self = this.ptr;
  return _emscripten_bind_btVehicleTuning_get_m_suspensionCompression_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleTuning.prototype['set_m_suspensionCompression'] = btVehicleTuning.prototype.set_m_suspensionCompression = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleTuning_set_m_suspensionCompression_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btVehicleTuning.prototype, 'm_suspensionCompression', { get: btVehicleTuning.prototype.get_m_suspensionCompression, set: btVehicleTuning.prototype.set_m_suspensionCompression });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleTuning.prototype['get_m_suspensionDamping'] = btVehicleTuning.prototype.get_m_suspensionDamping = function() {
  var self = this.ptr;
  return _emscripten_bind_btVehicleTuning_get_m_suspensionDamping_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleTuning.prototype['set_m_suspensionDamping'] = btVehicleTuning.prototype.set_m_suspensionDamping = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleTuning_set_m_suspensionDamping_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btVehicleTuning.prototype, 'm_suspensionDamping', { get: btVehicleTuning.prototype.get_m_suspensionDamping, set: btVehicleTuning.prototype.set_m_suspensionDamping });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleTuning.prototype['get_m_maxSuspensionTravelCm'] = btVehicleTuning.prototype.get_m_maxSuspensionTravelCm = function() {
  var self = this.ptr;
  return _emscripten_bind_btVehicleTuning_get_m_maxSuspensionTravelCm_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleTuning.prototype['set_m_maxSuspensionTravelCm'] = btVehicleTuning.prototype.set_m_maxSuspensionTravelCm = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleTuning_set_m_maxSuspensionTravelCm_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btVehicleTuning.prototype, 'm_maxSuspensionTravelCm', { get: btVehicleTuning.prototype.get_m_maxSuspensionTravelCm, set: btVehicleTuning.prototype.set_m_maxSuspensionTravelCm });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleTuning.prototype['get_m_frictionSlip'] = btVehicleTuning.prototype.get_m_frictionSlip = function() {
  var self = this.ptr;
  return _emscripten_bind_btVehicleTuning_get_m_frictionSlip_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleTuning.prototype['set_m_frictionSlip'] = btVehicleTuning.prototype.set_m_frictionSlip = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleTuning_set_m_frictionSlip_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btVehicleTuning.prototype, 'm_frictionSlip', { get: btVehicleTuning.prototype.get_m_frictionSlip, set: btVehicleTuning.prototype.set_m_frictionSlip });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleTuning.prototype['get_m_maxSuspensionForce'] = btVehicleTuning.prototype.get_m_maxSuspensionForce = function() {
  var self = this.ptr;
  return _emscripten_bind_btVehicleTuning_get_m_maxSuspensionForce_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleTuning.prototype['set_m_maxSuspensionForce'] = btVehicleTuning.prototype.set_m_maxSuspensionForce = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleTuning_set_m_maxSuspensionForce_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btVehicleTuning.prototype, 'm_maxSuspensionForce', { get: btVehicleTuning.prototype.get_m_maxSuspensionForce, set: btVehicleTuning.prototype.set_m_maxSuspensionForce });

// Interface: btVehicleRaycasterResult

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btVehicleRaycasterResult() { throw "cannot construct a btVehicleRaycasterResult, no constructor in IDL" }
btVehicleRaycasterResult.prototype = Object.create(WrapperObject.prototype);
btVehicleRaycasterResult.prototype.constructor = btVehicleRaycasterResult;
btVehicleRaycasterResult.prototype.__class__ = btVehicleRaycasterResult;
btVehicleRaycasterResult.__cache__ = {};
Module['btVehicleRaycasterResult'] = btVehicleRaycasterResult;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleRaycasterResult.prototype['get_m_hitPointInWorld'] = btVehicleRaycasterResult.prototype.get_m_hitPointInWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btVehicleRaycasterResult_get_m_hitPointInWorld_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleRaycasterResult.prototype['set_m_hitPointInWorld'] = btVehicleRaycasterResult.prototype.set_m_hitPointInWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleRaycasterResult_set_m_hitPointInWorld_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btVehicleRaycasterResult.prototype, 'm_hitPointInWorld', { get: btVehicleRaycasterResult.prototype.get_m_hitPointInWorld, set: btVehicleRaycasterResult.prototype.set_m_hitPointInWorld });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleRaycasterResult.prototype['get_m_hitNormalInWorld'] = btVehicleRaycasterResult.prototype.get_m_hitNormalInWorld = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btVehicleRaycasterResult_get_m_hitNormalInWorld_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleRaycasterResult.prototype['set_m_hitNormalInWorld'] = btVehicleRaycasterResult.prototype.set_m_hitNormalInWorld = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleRaycasterResult_set_m_hitNormalInWorld_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btVehicleRaycasterResult.prototype, 'm_hitNormalInWorld', { get: btVehicleRaycasterResult.prototype.get_m_hitNormalInWorld, set: btVehicleRaycasterResult.prototype.set_m_hitNormalInWorld });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleRaycasterResult.prototype['get_m_distFraction'] = btVehicleRaycasterResult.prototype.get_m_distFraction = function() {
  var self = this.ptr;
  return _emscripten_bind_btVehicleRaycasterResult_get_m_distFraction_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleRaycasterResult.prototype['set_m_distFraction'] = btVehicleRaycasterResult.prototype.set_m_distFraction = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btVehicleRaycasterResult_set_m_distFraction_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btVehicleRaycasterResult.prototype, 'm_distFraction', { get: btVehicleRaycasterResult.prototype.get_m_distFraction, set: btVehicleRaycasterResult.prototype.set_m_distFraction });

/** @suppress {undefinedVars, duplicate} @this{Object} */
btVehicleRaycasterResult.prototype['__destroy__'] = btVehicleRaycasterResult.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btVehicleRaycasterResult___destroy___0(self);
};

// Interface: btDefaultVehicleRaycaster

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btDefaultVehicleRaycaster(world) {
  if (world && typeof world === 'object') world = world.ptr;
  this.ptr = _emscripten_bind_btDefaultVehicleRaycaster_btDefaultVehicleRaycaster_1(world);
  getCache(btDefaultVehicleRaycaster)[this.ptr] = this;
};

btDefaultVehicleRaycaster.prototype = Object.create(btVehicleRaycaster.prototype);
btDefaultVehicleRaycaster.prototype.constructor = btDefaultVehicleRaycaster;
btDefaultVehicleRaycaster.prototype.__class__ = btDefaultVehicleRaycaster;
btDefaultVehicleRaycaster.__cache__ = {};
Module['btDefaultVehicleRaycaster'] = btDefaultVehicleRaycaster;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btDefaultVehicleRaycaster.prototype['castRay'] = btDefaultVehicleRaycaster.prototype.castRay = function(from, to, result) {
  var self = this.ptr;
  if (from && typeof from === 'object') from = from.ptr;
  if (to && typeof to === 'object') to = to.ptr;
  if (result && typeof result === 'object') result = result.ptr;
  _emscripten_bind_btDefaultVehicleRaycaster_castRay_3(self, from, to, result);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btDefaultVehicleRaycaster.prototype['__destroy__'] = btDefaultVehicleRaycaster.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btDefaultVehicleRaycaster___destroy___0(self);
};

// Interface: RaycastInfo

/** @suppress {undefinedVars, duplicate} @this{Object} */
function RaycastInfo() { throw "cannot construct a RaycastInfo, no constructor in IDL" }
RaycastInfo.prototype = Object.create(WrapperObject.prototype);
RaycastInfo.prototype.constructor = RaycastInfo;
RaycastInfo.prototype.__class__ = RaycastInfo;
RaycastInfo.__cache__ = {};
Module['RaycastInfo'] = RaycastInfo;
/** @suppress {undefinedVars, duplicate} @this{Object} */
RaycastInfo.prototype['get_m_contactNormalWS'] = RaycastInfo.prototype.get_m_contactNormalWS = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastInfo_get_m_contactNormalWS_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
RaycastInfo.prototype['set_m_contactNormalWS'] = RaycastInfo.prototype.set_m_contactNormalWS = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_contactNormalWS_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(RaycastInfo.prototype, 'm_contactNormalWS', { get: RaycastInfo.prototype.get_m_contactNormalWS, set: RaycastInfo.prototype.set_m_contactNormalWS });
/** @suppress {undefinedVars, duplicate} @this{Object} */
RaycastInfo.prototype['get_m_contactPointWS'] = RaycastInfo.prototype.get_m_contactPointWS = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastInfo_get_m_contactPointWS_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
RaycastInfo.prototype['set_m_contactPointWS'] = RaycastInfo.prototype.set_m_contactPointWS = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_contactPointWS_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(RaycastInfo.prototype, 'm_contactPointWS', { get: RaycastInfo.prototype.get_m_contactPointWS, set: RaycastInfo.prototype.set_m_contactPointWS });
/** @suppress {undefinedVars, duplicate} @this{Object} */
RaycastInfo.prototype['get_m_suspensionLength'] = RaycastInfo.prototype.get_m_suspensionLength = function() {
  var self = this.ptr;
  return _emscripten_bind_RaycastInfo_get_m_suspensionLength_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
RaycastInfo.prototype['set_m_suspensionLength'] = RaycastInfo.prototype.set_m_suspensionLength = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_suspensionLength_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(RaycastInfo.prototype, 'm_suspensionLength', { get: RaycastInfo.prototype.get_m_suspensionLength, set: RaycastInfo.prototype.set_m_suspensionLength });
/** @suppress {undefinedVars, duplicate} @this{Object} */
RaycastInfo.prototype['get_m_hardPointWS'] = RaycastInfo.prototype.get_m_hardPointWS = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastInfo_get_m_hardPointWS_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
RaycastInfo.prototype['set_m_hardPointWS'] = RaycastInfo.prototype.set_m_hardPointWS = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_hardPointWS_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(RaycastInfo.prototype, 'm_hardPointWS', { get: RaycastInfo.prototype.get_m_hardPointWS, set: RaycastInfo.prototype.set_m_hardPointWS });
/** @suppress {undefinedVars, duplicate} @this{Object} */
RaycastInfo.prototype['get_m_wheelDirectionWS'] = RaycastInfo.prototype.get_m_wheelDirectionWS = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastInfo_get_m_wheelDirectionWS_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
RaycastInfo.prototype['set_m_wheelDirectionWS'] = RaycastInfo.prototype.set_m_wheelDirectionWS = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_wheelDirectionWS_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(RaycastInfo.prototype, 'm_wheelDirectionWS', { get: RaycastInfo.prototype.get_m_wheelDirectionWS, set: RaycastInfo.prototype.set_m_wheelDirectionWS });
/** @suppress {undefinedVars, duplicate} @this{Object} */
RaycastInfo.prototype['get_m_wheelAxleWS'] = RaycastInfo.prototype.get_m_wheelAxleWS = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_RaycastInfo_get_m_wheelAxleWS_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
RaycastInfo.prototype['set_m_wheelAxleWS'] = RaycastInfo.prototype.set_m_wheelAxleWS = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_wheelAxleWS_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(RaycastInfo.prototype, 'm_wheelAxleWS', { get: RaycastInfo.prototype.get_m_wheelAxleWS, set: RaycastInfo.prototype.set_m_wheelAxleWS });
/** @suppress {undefinedVars, duplicate} @this{Object} */
RaycastInfo.prototype['get_m_isInContact'] = RaycastInfo.prototype.get_m_isInContact = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_RaycastInfo_get_m_isInContact_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
RaycastInfo.prototype['set_m_isInContact'] = RaycastInfo.prototype.set_m_isInContact = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_isInContact_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(RaycastInfo.prototype, 'm_isInContact', { get: RaycastInfo.prototype.get_m_isInContact, set: RaycastInfo.prototype.set_m_isInContact });
/** @suppress {undefinedVars, duplicate} @this{Object} */
RaycastInfo.prototype['get_m_groundObject'] = RaycastInfo.prototype.get_m_groundObject = function() {
  var self = this.ptr;
  return _emscripten_bind_RaycastInfo_get_m_groundObject_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
RaycastInfo.prototype['set_m_groundObject'] = RaycastInfo.prototype.set_m_groundObject = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_RaycastInfo_set_m_groundObject_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(RaycastInfo.prototype, 'm_groundObject', { get: RaycastInfo.prototype.get_m_groundObject, set: RaycastInfo.prototype.set_m_groundObject });

/** @suppress {undefinedVars, duplicate} @this{Object} */
RaycastInfo.prototype['__destroy__'] = RaycastInfo.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_RaycastInfo___destroy___0(self);
};

// Interface: btWheelInfoConstructionInfo

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btWheelInfoConstructionInfo() { throw "cannot construct a btWheelInfoConstructionInfo, no constructor in IDL" }
btWheelInfoConstructionInfo.prototype = Object.create(WrapperObject.prototype);
btWheelInfoConstructionInfo.prototype.constructor = btWheelInfoConstructionInfo;
btWheelInfoConstructionInfo.prototype.__class__ = btWheelInfoConstructionInfo;
btWheelInfoConstructionInfo.__cache__ = {};
Module['btWheelInfoConstructionInfo'] = btWheelInfoConstructionInfo;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['get_m_chassisConnectionCS'] = btWheelInfoConstructionInfo.prototype.get_m_chassisConnectionCS = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btWheelInfoConstructionInfo_get_m_chassisConnectionCS_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['set_m_chassisConnectionCS'] = btWheelInfoConstructionInfo.prototype.set_m_chassisConnectionCS = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_chassisConnectionCS_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfoConstructionInfo.prototype, 'm_chassisConnectionCS', { get: btWheelInfoConstructionInfo.prototype.get_m_chassisConnectionCS, set: btWheelInfoConstructionInfo.prototype.set_m_chassisConnectionCS });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['get_m_wheelDirectionCS'] = btWheelInfoConstructionInfo.prototype.get_m_wheelDirectionCS = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelDirectionCS_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['set_m_wheelDirectionCS'] = btWheelInfoConstructionInfo.prototype.set_m_wheelDirectionCS = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelDirectionCS_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfoConstructionInfo.prototype, 'm_wheelDirectionCS', { get: btWheelInfoConstructionInfo.prototype.get_m_wheelDirectionCS, set: btWheelInfoConstructionInfo.prototype.set_m_wheelDirectionCS });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['get_m_wheelAxleCS'] = btWheelInfoConstructionInfo.prototype.get_m_wheelAxleCS = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelAxleCS_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['set_m_wheelAxleCS'] = btWheelInfoConstructionInfo.prototype.set_m_wheelAxleCS = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelAxleCS_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfoConstructionInfo.prototype, 'm_wheelAxleCS', { get: btWheelInfoConstructionInfo.prototype.get_m_wheelAxleCS, set: btWheelInfoConstructionInfo.prototype.set_m_wheelAxleCS });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['get_m_suspensionRestLength'] = btWheelInfoConstructionInfo.prototype.get_m_suspensionRestLength = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionRestLength_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['set_m_suspensionRestLength'] = btWheelInfoConstructionInfo.prototype.set_m_suspensionRestLength = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionRestLength_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfoConstructionInfo.prototype, 'm_suspensionRestLength', { get: btWheelInfoConstructionInfo.prototype.get_m_suspensionRestLength, set: btWheelInfoConstructionInfo.prototype.set_m_suspensionRestLength });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['get_m_maxSuspensionTravelCm'] = btWheelInfoConstructionInfo.prototype.get_m_maxSuspensionTravelCm = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionTravelCm_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['set_m_maxSuspensionTravelCm'] = btWheelInfoConstructionInfo.prototype.set_m_maxSuspensionTravelCm = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionTravelCm_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfoConstructionInfo.prototype, 'm_maxSuspensionTravelCm', { get: btWheelInfoConstructionInfo.prototype.get_m_maxSuspensionTravelCm, set: btWheelInfoConstructionInfo.prototype.set_m_maxSuspensionTravelCm });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['get_m_wheelRadius'] = btWheelInfoConstructionInfo.prototype.get_m_wheelRadius = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelRadius_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['set_m_wheelRadius'] = btWheelInfoConstructionInfo.prototype.set_m_wheelRadius = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelRadius_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfoConstructionInfo.prototype, 'm_wheelRadius', { get: btWheelInfoConstructionInfo.prototype.get_m_wheelRadius, set: btWheelInfoConstructionInfo.prototype.set_m_wheelRadius });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['get_m_suspensionStiffness'] = btWheelInfoConstructionInfo.prototype.get_m_suspensionStiffness = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionStiffness_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['set_m_suspensionStiffness'] = btWheelInfoConstructionInfo.prototype.set_m_suspensionStiffness = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionStiffness_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfoConstructionInfo.prototype, 'm_suspensionStiffness', { get: btWheelInfoConstructionInfo.prototype.get_m_suspensionStiffness, set: btWheelInfoConstructionInfo.prototype.set_m_suspensionStiffness });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['get_m_wheelsDampingCompression'] = btWheelInfoConstructionInfo.prototype.get_m_wheelsDampingCompression = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingCompression_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['set_m_wheelsDampingCompression'] = btWheelInfoConstructionInfo.prototype.set_m_wheelsDampingCompression = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingCompression_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfoConstructionInfo.prototype, 'm_wheelsDampingCompression', { get: btWheelInfoConstructionInfo.prototype.get_m_wheelsDampingCompression, set: btWheelInfoConstructionInfo.prototype.set_m_wheelsDampingCompression });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['get_m_wheelsDampingRelaxation'] = btWheelInfoConstructionInfo.prototype.get_m_wheelsDampingRelaxation = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingRelaxation_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['set_m_wheelsDampingRelaxation'] = btWheelInfoConstructionInfo.prototype.set_m_wheelsDampingRelaxation = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingRelaxation_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfoConstructionInfo.prototype, 'm_wheelsDampingRelaxation', { get: btWheelInfoConstructionInfo.prototype.get_m_wheelsDampingRelaxation, set: btWheelInfoConstructionInfo.prototype.set_m_wheelsDampingRelaxation });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['get_m_frictionSlip'] = btWheelInfoConstructionInfo.prototype.get_m_frictionSlip = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfoConstructionInfo_get_m_frictionSlip_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['set_m_frictionSlip'] = btWheelInfoConstructionInfo.prototype.set_m_frictionSlip = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_frictionSlip_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfoConstructionInfo.prototype, 'm_frictionSlip', { get: btWheelInfoConstructionInfo.prototype.get_m_frictionSlip, set: btWheelInfoConstructionInfo.prototype.set_m_frictionSlip });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['get_m_maxSuspensionForce'] = btWheelInfoConstructionInfo.prototype.get_m_maxSuspensionForce = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionForce_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['set_m_maxSuspensionForce'] = btWheelInfoConstructionInfo.prototype.set_m_maxSuspensionForce = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionForce_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfoConstructionInfo.prototype, 'm_maxSuspensionForce', { get: btWheelInfoConstructionInfo.prototype.get_m_maxSuspensionForce, set: btWheelInfoConstructionInfo.prototype.set_m_maxSuspensionForce });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['get_m_bIsFrontWheel'] = btWheelInfoConstructionInfo.prototype.get_m_bIsFrontWheel = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btWheelInfoConstructionInfo_get_m_bIsFrontWheel_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['set_m_bIsFrontWheel'] = btWheelInfoConstructionInfo.prototype.set_m_bIsFrontWheel = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo_set_m_bIsFrontWheel_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfoConstructionInfo.prototype, 'm_bIsFrontWheel', { get: btWheelInfoConstructionInfo.prototype.get_m_bIsFrontWheel, set: btWheelInfoConstructionInfo.prototype.set_m_bIsFrontWheel });

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfoConstructionInfo.prototype['__destroy__'] = btWheelInfoConstructionInfo.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btWheelInfoConstructionInfo___destroy___0(self);
};

// Interface: btWheelInfo

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btWheelInfo(ci) {
  if (ci && typeof ci === 'object') ci = ci.ptr;
  this.ptr = _emscripten_bind_btWheelInfo_btWheelInfo_1(ci);
  getCache(btWheelInfo)[this.ptr] = this;
};

btWheelInfo.prototype = Object.create(WrapperObject.prototype);
btWheelInfo.prototype.constructor = btWheelInfo;
btWheelInfo.prototype.__class__ = btWheelInfo;
btWheelInfo.__cache__ = {};
Module['btWheelInfo'] = btWheelInfo;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['getSuspensionRestLength'] = btWheelInfo.prototype.getSuspensionRestLength = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_getSuspensionRestLength_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['updateWheel'] = btWheelInfo.prototype.updateWheel = function(chassis, raycastInfo) {
  var self = this.ptr;
  if (chassis && typeof chassis === 'object') chassis = chassis.ptr;
  if (raycastInfo && typeof raycastInfo === 'object') raycastInfo = raycastInfo.ptr;
  _emscripten_bind_btWheelInfo_updateWheel_2(self, chassis, raycastInfo);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_suspensionStiffness'] = btWheelInfo.prototype.get_m_suspensionStiffness = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_suspensionStiffness_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_suspensionStiffness'] = btWheelInfo.prototype.set_m_suspensionStiffness = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_suspensionStiffness_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_suspensionStiffness', { get: btWheelInfo.prototype.get_m_suspensionStiffness, set: btWheelInfo.prototype.set_m_suspensionStiffness });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_frictionSlip'] = btWheelInfo.prototype.get_m_frictionSlip = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_frictionSlip_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_frictionSlip'] = btWheelInfo.prototype.set_m_frictionSlip = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_frictionSlip_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_frictionSlip', { get: btWheelInfo.prototype.get_m_frictionSlip, set: btWheelInfo.prototype.set_m_frictionSlip });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_engineForce'] = btWheelInfo.prototype.get_m_engineForce = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_engineForce_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_engineForce'] = btWheelInfo.prototype.set_m_engineForce = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_engineForce_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_engineForce', { get: btWheelInfo.prototype.get_m_engineForce, set: btWheelInfo.prototype.set_m_engineForce });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_rollInfluence'] = btWheelInfo.prototype.get_m_rollInfluence = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_rollInfluence_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_rollInfluence'] = btWheelInfo.prototype.set_m_rollInfluence = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_rollInfluence_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_rollInfluence', { get: btWheelInfo.prototype.get_m_rollInfluence, set: btWheelInfo.prototype.set_m_rollInfluence });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_suspensionRestLength1'] = btWheelInfo.prototype.get_m_suspensionRestLength1 = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_suspensionRestLength1_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_suspensionRestLength1'] = btWheelInfo.prototype.set_m_suspensionRestLength1 = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_suspensionRestLength1_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_suspensionRestLength1', { get: btWheelInfo.prototype.get_m_suspensionRestLength1, set: btWheelInfo.prototype.set_m_suspensionRestLength1 });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_wheelsRadius'] = btWheelInfo.prototype.get_m_wheelsRadius = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_wheelsRadius_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_wheelsRadius'] = btWheelInfo.prototype.set_m_wheelsRadius = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_wheelsRadius_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_wheelsRadius', { get: btWheelInfo.prototype.get_m_wheelsRadius, set: btWheelInfo.prototype.set_m_wheelsRadius });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_wheelsDampingCompression'] = btWheelInfo.prototype.get_m_wheelsDampingCompression = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_wheelsDampingCompression_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_wheelsDampingCompression'] = btWheelInfo.prototype.set_m_wheelsDampingCompression = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_wheelsDampingCompression_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_wheelsDampingCompression', { get: btWheelInfo.prototype.get_m_wheelsDampingCompression, set: btWheelInfo.prototype.set_m_wheelsDampingCompression });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_wheelsDampingRelaxation'] = btWheelInfo.prototype.get_m_wheelsDampingRelaxation = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_wheelsDampingRelaxation_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_wheelsDampingRelaxation'] = btWheelInfo.prototype.set_m_wheelsDampingRelaxation = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_wheelsDampingRelaxation_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_wheelsDampingRelaxation', { get: btWheelInfo.prototype.get_m_wheelsDampingRelaxation, set: btWheelInfo.prototype.set_m_wheelsDampingRelaxation });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_steering'] = btWheelInfo.prototype.get_m_steering = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_steering_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_steering'] = btWheelInfo.prototype.set_m_steering = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_steering_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_steering', { get: btWheelInfo.prototype.get_m_steering, set: btWheelInfo.prototype.set_m_steering });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_maxSuspensionForce'] = btWheelInfo.prototype.get_m_maxSuspensionForce = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_maxSuspensionForce_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_maxSuspensionForce'] = btWheelInfo.prototype.set_m_maxSuspensionForce = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_maxSuspensionForce_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_maxSuspensionForce', { get: btWheelInfo.prototype.get_m_maxSuspensionForce, set: btWheelInfo.prototype.set_m_maxSuspensionForce });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_maxSuspensionTravelCm'] = btWheelInfo.prototype.get_m_maxSuspensionTravelCm = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_maxSuspensionTravelCm_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_maxSuspensionTravelCm'] = btWheelInfo.prototype.set_m_maxSuspensionTravelCm = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_maxSuspensionTravelCm_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_maxSuspensionTravelCm', { get: btWheelInfo.prototype.get_m_maxSuspensionTravelCm, set: btWheelInfo.prototype.set_m_maxSuspensionTravelCm });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_wheelsSuspensionForce'] = btWheelInfo.prototype.get_m_wheelsSuspensionForce = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_wheelsSuspensionForce_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_wheelsSuspensionForce'] = btWheelInfo.prototype.set_m_wheelsSuspensionForce = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_wheelsSuspensionForce_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_wheelsSuspensionForce', { get: btWheelInfo.prototype.get_m_wheelsSuspensionForce, set: btWheelInfo.prototype.set_m_wheelsSuspensionForce });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_bIsFrontWheel'] = btWheelInfo.prototype.get_m_bIsFrontWheel = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btWheelInfo_get_m_bIsFrontWheel_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_bIsFrontWheel'] = btWheelInfo.prototype.set_m_bIsFrontWheel = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_bIsFrontWheel_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_bIsFrontWheel', { get: btWheelInfo.prototype.get_m_bIsFrontWheel, set: btWheelInfo.prototype.set_m_bIsFrontWheel });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_raycastInfo'] = btWheelInfo.prototype.get_m_raycastInfo = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btWheelInfo_get_m_raycastInfo_0(self), RaycastInfo);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_raycastInfo'] = btWheelInfo.prototype.set_m_raycastInfo = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_raycastInfo_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_raycastInfo', { get: btWheelInfo.prototype.get_m_raycastInfo, set: btWheelInfo.prototype.set_m_raycastInfo });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_chassisConnectionPointCS'] = btWheelInfo.prototype.get_m_chassisConnectionPointCS = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btWheelInfo_get_m_chassisConnectionPointCS_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_chassisConnectionPointCS'] = btWheelInfo.prototype.set_m_chassisConnectionPointCS = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_chassisConnectionPointCS_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_chassisConnectionPointCS', { get: btWheelInfo.prototype.get_m_chassisConnectionPointCS, set: btWheelInfo.prototype.set_m_chassisConnectionPointCS });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_worldTransform'] = btWheelInfo.prototype.get_m_worldTransform = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btWheelInfo_get_m_worldTransform_0(self), btTransform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_worldTransform'] = btWheelInfo.prototype.set_m_worldTransform = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_worldTransform_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_worldTransform', { get: btWheelInfo.prototype.get_m_worldTransform, set: btWheelInfo.prototype.set_m_worldTransform });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_wheelDirectionCS'] = btWheelInfo.prototype.get_m_wheelDirectionCS = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btWheelInfo_get_m_wheelDirectionCS_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_wheelDirectionCS'] = btWheelInfo.prototype.set_m_wheelDirectionCS = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_wheelDirectionCS_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_wheelDirectionCS', { get: btWheelInfo.prototype.get_m_wheelDirectionCS, set: btWheelInfo.prototype.set_m_wheelDirectionCS });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_wheelAxleCS'] = btWheelInfo.prototype.get_m_wheelAxleCS = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btWheelInfo_get_m_wheelAxleCS_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_wheelAxleCS'] = btWheelInfo.prototype.set_m_wheelAxleCS = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_wheelAxleCS_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_wheelAxleCS', { get: btWheelInfo.prototype.get_m_wheelAxleCS, set: btWheelInfo.prototype.set_m_wheelAxleCS });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_rotation'] = btWheelInfo.prototype.get_m_rotation = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_rotation_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_rotation'] = btWheelInfo.prototype.set_m_rotation = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_rotation_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_rotation', { get: btWheelInfo.prototype.get_m_rotation, set: btWheelInfo.prototype.set_m_rotation });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_deltaRotation'] = btWheelInfo.prototype.get_m_deltaRotation = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_deltaRotation_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_deltaRotation'] = btWheelInfo.prototype.set_m_deltaRotation = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_deltaRotation_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_deltaRotation', { get: btWheelInfo.prototype.get_m_deltaRotation, set: btWheelInfo.prototype.set_m_deltaRotation });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_brake'] = btWheelInfo.prototype.get_m_brake = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_brake_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_brake'] = btWheelInfo.prototype.set_m_brake = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_brake_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_brake', { get: btWheelInfo.prototype.get_m_brake, set: btWheelInfo.prototype.set_m_brake });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_clippedInvContactDotSuspension'] = btWheelInfo.prototype.get_m_clippedInvContactDotSuspension = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_clippedInvContactDotSuspension_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_clippedInvContactDotSuspension'] = btWheelInfo.prototype.set_m_clippedInvContactDotSuspension = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_clippedInvContactDotSuspension_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_clippedInvContactDotSuspension', { get: btWheelInfo.prototype.get_m_clippedInvContactDotSuspension, set: btWheelInfo.prototype.set_m_clippedInvContactDotSuspension });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_suspensionRelativeVelocity'] = btWheelInfo.prototype.get_m_suspensionRelativeVelocity = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_suspensionRelativeVelocity_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_suspensionRelativeVelocity'] = btWheelInfo.prototype.set_m_suspensionRelativeVelocity = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_suspensionRelativeVelocity_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_suspensionRelativeVelocity', { get: btWheelInfo.prototype.get_m_suspensionRelativeVelocity, set: btWheelInfo.prototype.set_m_suspensionRelativeVelocity });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['get_m_skidInfo'] = btWheelInfo.prototype.get_m_skidInfo = function() {
  var self = this.ptr;
  return _emscripten_bind_btWheelInfo_get_m_skidInfo_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['set_m_skidInfo'] = btWheelInfo.prototype.set_m_skidInfo = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btWheelInfo_set_m_skidInfo_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btWheelInfo.prototype, 'm_skidInfo', { get: btWheelInfo.prototype.get_m_skidInfo, set: btWheelInfo.prototype.set_m_skidInfo });

/** @suppress {undefinedVars, duplicate} @this{Object} */
btWheelInfo.prototype['__destroy__'] = btWheelInfo.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btWheelInfo___destroy___0(self);
};

// Interface: btKinematicCharacterController

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btKinematicCharacterController(ghostObject, convexShape, stepHeight, upAxis) {
  if (ghostObject && typeof ghostObject === 'object') ghostObject = ghostObject.ptr;
  if (convexShape && typeof convexShape === 'object') convexShape = convexShape.ptr;
  if (stepHeight && typeof stepHeight === 'object') stepHeight = stepHeight.ptr;
  if (upAxis && typeof upAxis === 'object') upAxis = upAxis.ptr;
  if (upAxis === undefined) { this.ptr = _emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_3(ghostObject, convexShape, stepHeight); getCache(btKinematicCharacterController)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_4(ghostObject, convexShape, stepHeight, upAxis);
  getCache(btKinematicCharacterController)[this.ptr] = this;
};

btKinematicCharacterController.prototype = Object.create(btActionInterface.prototype);
btKinematicCharacterController.prototype.constructor = btKinematicCharacterController;
btKinematicCharacterController.prototype.__class__ = btKinematicCharacterController;
btKinematicCharacterController.__cache__ = {};
Module['btKinematicCharacterController'] = btKinematicCharacterController;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['setUpAxis'] = btKinematicCharacterController.prototype.setUpAxis = function(axis) {
  var self = this.ptr;
  if (axis && typeof axis === 'object') axis = axis.ptr;
  _emscripten_bind_btKinematicCharacterController_setUpAxis_1(self, axis);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['setWalkDirection'] = btKinematicCharacterController.prototype.setWalkDirection = function(walkDirection) {
  var self = this.ptr;
  if (walkDirection && typeof walkDirection === 'object') walkDirection = walkDirection.ptr;
  _emscripten_bind_btKinematicCharacterController_setWalkDirection_1(self, walkDirection);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['setVelocityForTimeInterval'] = btKinematicCharacterController.prototype.setVelocityForTimeInterval = function(velocity, timeInterval) {
  var self = this.ptr;
  if (velocity && typeof velocity === 'object') velocity = velocity.ptr;
  if (timeInterval && typeof timeInterval === 'object') timeInterval = timeInterval.ptr;
  _emscripten_bind_btKinematicCharacterController_setVelocityForTimeInterval_2(self, velocity, timeInterval);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['warp'] = btKinematicCharacterController.prototype.warp = function(origin) {
  var self = this.ptr;
  if (origin && typeof origin === 'object') origin = origin.ptr;
  _emscripten_bind_btKinematicCharacterController_warp_1(self, origin);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['preStep'] = btKinematicCharacterController.prototype.preStep = function(collisionWorld) {
  var self = this.ptr;
  if (collisionWorld && typeof collisionWorld === 'object') collisionWorld = collisionWorld.ptr;
  _emscripten_bind_btKinematicCharacterController_preStep_1(self, collisionWorld);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['playerStep'] = btKinematicCharacterController.prototype.playerStep = function(collisionWorld, dt) {
  var self = this.ptr;
  if (collisionWorld && typeof collisionWorld === 'object') collisionWorld = collisionWorld.ptr;
  if (dt && typeof dt === 'object') dt = dt.ptr;
  _emscripten_bind_btKinematicCharacterController_playerStep_2(self, collisionWorld, dt);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['setFallSpeed'] = btKinematicCharacterController.prototype.setFallSpeed = function(fallSpeed) {
  var self = this.ptr;
  if (fallSpeed && typeof fallSpeed === 'object') fallSpeed = fallSpeed.ptr;
  _emscripten_bind_btKinematicCharacterController_setFallSpeed_1(self, fallSpeed);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['setJumpSpeed'] = btKinematicCharacterController.prototype.setJumpSpeed = function(jumpSpeed) {
  var self = this.ptr;
  if (jumpSpeed && typeof jumpSpeed === 'object') jumpSpeed = jumpSpeed.ptr;
  _emscripten_bind_btKinematicCharacterController_setJumpSpeed_1(self, jumpSpeed);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['setMaxJumpHeight'] = btKinematicCharacterController.prototype.setMaxJumpHeight = function(maxJumpHeight) {
  var self = this.ptr;
  if (maxJumpHeight && typeof maxJumpHeight === 'object') maxJumpHeight = maxJumpHeight.ptr;
  _emscripten_bind_btKinematicCharacterController_setMaxJumpHeight_1(self, maxJumpHeight);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['canJump'] = btKinematicCharacterController.prototype.canJump = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btKinematicCharacterController_canJump_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['jump'] = btKinematicCharacterController.prototype.jump = function() {
  var self = this.ptr;
  _emscripten_bind_btKinematicCharacterController_jump_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['setGravity'] = btKinematicCharacterController.prototype.setGravity = function(gravity) {
  var self = this.ptr;
  if (gravity && typeof gravity === 'object') gravity = gravity.ptr;
  _emscripten_bind_btKinematicCharacterController_setGravity_1(self, gravity);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['getGravity'] = btKinematicCharacterController.prototype.getGravity = function() {
  var self = this.ptr;
  return _emscripten_bind_btKinematicCharacterController_getGravity_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['setMaxSlope'] = btKinematicCharacterController.prototype.setMaxSlope = function(slopeRadians) {
  var self = this.ptr;
  if (slopeRadians && typeof slopeRadians === 'object') slopeRadians = slopeRadians.ptr;
  _emscripten_bind_btKinematicCharacterController_setMaxSlope_1(self, slopeRadians);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['getMaxSlope'] = btKinematicCharacterController.prototype.getMaxSlope = function() {
  var self = this.ptr;
  return _emscripten_bind_btKinematicCharacterController_getMaxSlope_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['getGhostObject'] = btKinematicCharacterController.prototype.getGhostObject = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btKinematicCharacterController_getGhostObject_0(self), btPairCachingGhostObject);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['setUseGhostSweepTest'] = btKinematicCharacterController.prototype.setUseGhostSweepTest = function(useGhostObjectSweepTest) {
  var self = this.ptr;
  if (useGhostObjectSweepTest && typeof useGhostObjectSweepTest === 'object') useGhostObjectSweepTest = useGhostObjectSweepTest.ptr;
  _emscripten_bind_btKinematicCharacterController_setUseGhostSweepTest_1(self, useGhostObjectSweepTest);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['onGround'] = btKinematicCharacterController.prototype.onGround = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btKinematicCharacterController_onGround_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['setUpInterpolate'] = btKinematicCharacterController.prototype.setUpInterpolate = function(value) {
  var self = this.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_btKinematicCharacterController_setUpInterpolate_1(self, value);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['updateAction'] = btKinematicCharacterController.prototype.updateAction = function(collisionWorld, deltaTimeStep) {
  var self = this.ptr;
  if (collisionWorld && typeof collisionWorld === 'object') collisionWorld = collisionWorld.ptr;
  if (deltaTimeStep && typeof deltaTimeStep === 'object') deltaTimeStep = deltaTimeStep.ptr;
  _emscripten_bind_btKinematicCharacterController_updateAction_2(self, collisionWorld, deltaTimeStep);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btKinematicCharacterController.prototype['__destroy__'] = btKinematicCharacterController.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btKinematicCharacterController___destroy___0(self);
};

// Interface: btRaycastVehicle

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btRaycastVehicle(tuning, chassis, raycaster) {
  if (tuning && typeof tuning === 'object') tuning = tuning.ptr;
  if (chassis && typeof chassis === 'object') chassis = chassis.ptr;
  if (raycaster && typeof raycaster === 'object') raycaster = raycaster.ptr;
  this.ptr = _emscripten_bind_btRaycastVehicle_btRaycastVehicle_3(tuning, chassis, raycaster);
  getCache(btRaycastVehicle)[this.ptr] = this;
};

btRaycastVehicle.prototype = Object.create(btActionInterface.prototype);
btRaycastVehicle.prototype.constructor = btRaycastVehicle;
btRaycastVehicle.prototype.__class__ = btRaycastVehicle;
btRaycastVehicle.__cache__ = {};
Module['btRaycastVehicle'] = btRaycastVehicle;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['applyEngineForce'] = btRaycastVehicle.prototype.applyEngineForce = function(force, wheel) {
  var self = this.ptr;
  if (force && typeof force === 'object') force = force.ptr;
  if (wheel && typeof wheel === 'object') wheel = wheel.ptr;
  _emscripten_bind_btRaycastVehicle_applyEngineForce_2(self, force, wheel);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['setSteeringValue'] = btRaycastVehicle.prototype.setSteeringValue = function(steering, wheel) {
  var self = this.ptr;
  if (steering && typeof steering === 'object') steering = steering.ptr;
  if (wheel && typeof wheel === 'object') wheel = wheel.ptr;
  _emscripten_bind_btRaycastVehicle_setSteeringValue_2(self, steering, wheel);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['getWheelTransformWS'] = btRaycastVehicle.prototype.getWheelTransformWS = function(wheelIndex) {
  var self = this.ptr;
  if (wheelIndex && typeof wheelIndex === 'object') wheelIndex = wheelIndex.ptr;
  return wrapPointer(_emscripten_bind_btRaycastVehicle_getWheelTransformWS_1(self, wheelIndex), btTransform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['updateWheelTransform'] = btRaycastVehicle.prototype.updateWheelTransform = function(wheelIndex, interpolatedTransform) {
  var self = this.ptr;
  if (wheelIndex && typeof wheelIndex === 'object') wheelIndex = wheelIndex.ptr;
  if (interpolatedTransform && typeof interpolatedTransform === 'object') interpolatedTransform = interpolatedTransform.ptr;
  _emscripten_bind_btRaycastVehicle_updateWheelTransform_2(self, wheelIndex, interpolatedTransform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['addWheel'] = btRaycastVehicle.prototype.addWheel = function(connectionPointCS0, wheelDirectionCS0, wheelAxleCS, suspensionRestLength, wheelRadius, tuning, isFrontWheel) {
  var self = this.ptr;
  if (connectionPointCS0 && typeof connectionPointCS0 === 'object') connectionPointCS0 = connectionPointCS0.ptr;
  if (wheelDirectionCS0 && typeof wheelDirectionCS0 === 'object') wheelDirectionCS0 = wheelDirectionCS0.ptr;
  if (wheelAxleCS && typeof wheelAxleCS === 'object') wheelAxleCS = wheelAxleCS.ptr;
  if (suspensionRestLength && typeof suspensionRestLength === 'object') suspensionRestLength = suspensionRestLength.ptr;
  if (wheelRadius && typeof wheelRadius === 'object') wheelRadius = wheelRadius.ptr;
  if (tuning && typeof tuning === 'object') tuning = tuning.ptr;
  if (isFrontWheel && typeof isFrontWheel === 'object') isFrontWheel = isFrontWheel.ptr;
  return wrapPointer(_emscripten_bind_btRaycastVehicle_addWheel_7(self, connectionPointCS0, wheelDirectionCS0, wheelAxleCS, suspensionRestLength, wheelRadius, tuning, isFrontWheel), btWheelInfo);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['getNumWheels'] = btRaycastVehicle.prototype.getNumWheels = function() {
  var self = this.ptr;
  return _emscripten_bind_btRaycastVehicle_getNumWheels_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['getRigidBody'] = btRaycastVehicle.prototype.getRigidBody = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRaycastVehicle_getRigidBody_0(self), btRigidBody);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['getWheelInfo'] = btRaycastVehicle.prototype.getWheelInfo = function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_btRaycastVehicle_getWheelInfo_1(self, index), btWheelInfo);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['setBrake'] = btRaycastVehicle.prototype.setBrake = function(brake, wheelIndex) {
  var self = this.ptr;
  if (brake && typeof brake === 'object') brake = brake.ptr;
  if (wheelIndex && typeof wheelIndex === 'object') wheelIndex = wheelIndex.ptr;
  _emscripten_bind_btRaycastVehicle_setBrake_2(self, brake, wheelIndex);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['setCoordinateSystem'] = btRaycastVehicle.prototype.setCoordinateSystem = function(rightIndex, upIndex, forwardIndex) {
  var self = this.ptr;
  if (rightIndex && typeof rightIndex === 'object') rightIndex = rightIndex.ptr;
  if (upIndex && typeof upIndex === 'object') upIndex = upIndex.ptr;
  if (forwardIndex && typeof forwardIndex === 'object') forwardIndex = forwardIndex.ptr;
  _emscripten_bind_btRaycastVehicle_setCoordinateSystem_3(self, rightIndex, upIndex, forwardIndex);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['getCurrentSpeedKmHour'] = btRaycastVehicle.prototype.getCurrentSpeedKmHour = function() {
  var self = this.ptr;
  return _emscripten_bind_btRaycastVehicle_getCurrentSpeedKmHour_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['getChassisWorldTransform'] = btRaycastVehicle.prototype.getChassisWorldTransform = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRaycastVehicle_getChassisWorldTransform_0(self), btTransform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['rayCast'] = btRaycastVehicle.prototype.rayCast = function(wheel) {
  var self = this.ptr;
  if (wheel && typeof wheel === 'object') wheel = wheel.ptr;
  return _emscripten_bind_btRaycastVehicle_rayCast_1(self, wheel);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['updateVehicle'] = btRaycastVehicle.prototype.updateVehicle = function(step) {
  var self = this.ptr;
  if (step && typeof step === 'object') step = step.ptr;
  _emscripten_bind_btRaycastVehicle_updateVehicle_1(self, step);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['resetSuspension'] = btRaycastVehicle.prototype.resetSuspension = function() {
  var self = this.ptr;
  _emscripten_bind_btRaycastVehicle_resetSuspension_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['getSteeringValue'] = btRaycastVehicle.prototype.getSteeringValue = function(wheel) {
  var self = this.ptr;
  if (wheel && typeof wheel === 'object') wheel = wheel.ptr;
  return _emscripten_bind_btRaycastVehicle_getSteeringValue_1(self, wheel);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['updateWheelTransformsWS'] = btRaycastVehicle.prototype.updateWheelTransformsWS = function(wheel, interpolatedTransform) {
  var self = this.ptr;
  if (wheel && typeof wheel === 'object') wheel = wheel.ptr;
  if (interpolatedTransform && typeof interpolatedTransform === 'object') interpolatedTransform = interpolatedTransform.ptr;
  if (interpolatedTransform === undefined) { _emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_1(self, wheel); return }
  _emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_2(self, wheel, interpolatedTransform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['setPitchControl'] = btRaycastVehicle.prototype.setPitchControl = function(pitch) {
  var self = this.ptr;
  if (pitch && typeof pitch === 'object') pitch = pitch.ptr;
  _emscripten_bind_btRaycastVehicle_setPitchControl_1(self, pitch);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['updateSuspension'] = btRaycastVehicle.prototype.updateSuspension = function(deltaTime) {
  var self = this.ptr;
  if (deltaTime && typeof deltaTime === 'object') deltaTime = deltaTime.ptr;
  _emscripten_bind_btRaycastVehicle_updateSuspension_1(self, deltaTime);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['updateFriction'] = btRaycastVehicle.prototype.updateFriction = function(timeStep) {
  var self = this.ptr;
  if (timeStep && typeof timeStep === 'object') timeStep = timeStep.ptr;
  _emscripten_bind_btRaycastVehicle_updateFriction_1(self, timeStep);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['getRightAxis'] = btRaycastVehicle.prototype.getRightAxis = function() {
  var self = this.ptr;
  return _emscripten_bind_btRaycastVehicle_getRightAxis_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['getUpAxis'] = btRaycastVehicle.prototype.getUpAxis = function() {
  var self = this.ptr;
  return _emscripten_bind_btRaycastVehicle_getUpAxis_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['getForwardAxis'] = btRaycastVehicle.prototype.getForwardAxis = function() {
  var self = this.ptr;
  return _emscripten_bind_btRaycastVehicle_getForwardAxis_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['getForwardVector'] = btRaycastVehicle.prototype.getForwardVector = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btRaycastVehicle_getForwardVector_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['getUserConstraintType'] = btRaycastVehicle.prototype.getUserConstraintType = function() {
  var self = this.ptr;
  return _emscripten_bind_btRaycastVehicle_getUserConstraintType_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['setUserConstraintType'] = btRaycastVehicle.prototype.setUserConstraintType = function(userConstraintType) {
  var self = this.ptr;
  if (userConstraintType && typeof userConstraintType === 'object') userConstraintType = userConstraintType.ptr;
  _emscripten_bind_btRaycastVehicle_setUserConstraintType_1(self, userConstraintType);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['setUserConstraintId'] = btRaycastVehicle.prototype.setUserConstraintId = function(uid) {
  var self = this.ptr;
  if (uid && typeof uid === 'object') uid = uid.ptr;
  _emscripten_bind_btRaycastVehicle_setUserConstraintId_1(self, uid);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['getUserConstraintId'] = btRaycastVehicle.prototype.getUserConstraintId = function() {
  var self = this.ptr;
  return _emscripten_bind_btRaycastVehicle_getUserConstraintId_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['updateAction'] = btRaycastVehicle.prototype.updateAction = function(collisionWorld, deltaTimeStep) {
  var self = this.ptr;
  if (collisionWorld && typeof collisionWorld === 'object') collisionWorld = collisionWorld.ptr;
  if (deltaTimeStep && typeof deltaTimeStep === 'object') deltaTimeStep = deltaTimeStep.ptr;
  _emscripten_bind_btRaycastVehicle_updateAction_2(self, collisionWorld, deltaTimeStep);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btRaycastVehicle.prototype['__destroy__'] = btRaycastVehicle.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btRaycastVehicle___destroy___0(self);
};

// Interface: btPairCachingGhostObject

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btPairCachingGhostObject() {
  this.ptr = _emscripten_bind_btPairCachingGhostObject_btPairCachingGhostObject_0();
  getCache(btPairCachingGhostObject)[this.ptr] = this;
};

btPairCachingGhostObject.prototype = Object.create(btGhostObject.prototype);
btPairCachingGhostObject.prototype.constructor = btPairCachingGhostObject;
btPairCachingGhostObject.prototype.__class__ = btPairCachingGhostObject;
btPairCachingGhostObject.__cache__ = {};
Module['btPairCachingGhostObject'] = btPairCachingGhostObject;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['setAnisotropicFriction'] = btPairCachingGhostObject.prototype.setAnisotropicFriction = function(anisotropicFriction, frictionMode) {
  var self = this.ptr;
  if (anisotropicFriction && typeof anisotropicFriction === 'object') anisotropicFriction = anisotropicFriction.ptr;
  if (frictionMode && typeof frictionMode === 'object') frictionMode = frictionMode.ptr;
  _emscripten_bind_btPairCachingGhostObject_setAnisotropicFriction_2(self, anisotropicFriction, frictionMode);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['getCollisionShape'] = btPairCachingGhostObject.prototype.getCollisionShape = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPairCachingGhostObject_getCollisionShape_0(self), btCollisionShape);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['setContactProcessingThreshold'] = btPairCachingGhostObject.prototype.setContactProcessingThreshold = function(contactProcessingThreshold) {
  var self = this.ptr;
  if (contactProcessingThreshold && typeof contactProcessingThreshold === 'object') contactProcessingThreshold = contactProcessingThreshold.ptr;
  _emscripten_bind_btPairCachingGhostObject_setContactProcessingThreshold_1(self, contactProcessingThreshold);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['setActivationState'] = btPairCachingGhostObject.prototype.setActivationState = function(newState) {
  var self = this.ptr;
  if (newState && typeof newState === 'object') newState = newState.ptr;
  _emscripten_bind_btPairCachingGhostObject_setActivationState_1(self, newState);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['forceActivationState'] = btPairCachingGhostObject.prototype.forceActivationState = function(newState) {
  var self = this.ptr;
  if (newState && typeof newState === 'object') newState = newState.ptr;
  _emscripten_bind_btPairCachingGhostObject_forceActivationState_1(self, newState);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['activate'] = btPairCachingGhostObject.prototype.activate = function(forceActivation) {
  var self = this.ptr;
  if (forceActivation && typeof forceActivation === 'object') forceActivation = forceActivation.ptr;
  if (forceActivation === undefined) { _emscripten_bind_btPairCachingGhostObject_activate_0(self); return }
  _emscripten_bind_btPairCachingGhostObject_activate_1(self, forceActivation);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['isActive'] = btPairCachingGhostObject.prototype.isActive = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btPairCachingGhostObject_isActive_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['isKinematicObject'] = btPairCachingGhostObject.prototype.isKinematicObject = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btPairCachingGhostObject_isKinematicObject_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['isStaticObject'] = btPairCachingGhostObject.prototype.isStaticObject = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btPairCachingGhostObject_isStaticObject_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['isStaticOrKinematicObject'] = btPairCachingGhostObject.prototype.isStaticOrKinematicObject = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btPairCachingGhostObject_isStaticOrKinematicObject_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['getRestitution'] = btPairCachingGhostObject.prototype.getRestitution = function() {
  var self = this.ptr;
  return _emscripten_bind_btPairCachingGhostObject_getRestitution_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['getFriction'] = btPairCachingGhostObject.prototype.getFriction = function() {
  var self = this.ptr;
  return _emscripten_bind_btPairCachingGhostObject_getFriction_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['getRollingFriction'] = btPairCachingGhostObject.prototype.getRollingFriction = function() {
  var self = this.ptr;
  return _emscripten_bind_btPairCachingGhostObject_getRollingFriction_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['setRestitution'] = btPairCachingGhostObject.prototype.setRestitution = function(rest) {
  var self = this.ptr;
  if (rest && typeof rest === 'object') rest = rest.ptr;
  _emscripten_bind_btPairCachingGhostObject_setRestitution_1(self, rest);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['setFriction'] = btPairCachingGhostObject.prototype.setFriction = function(frict) {
  var self = this.ptr;
  if (frict && typeof frict === 'object') frict = frict.ptr;
  _emscripten_bind_btPairCachingGhostObject_setFriction_1(self, frict);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['setRollingFriction'] = btPairCachingGhostObject.prototype.setRollingFriction = function(frict) {
  var self = this.ptr;
  if (frict && typeof frict === 'object') frict = frict.ptr;
  _emscripten_bind_btPairCachingGhostObject_setRollingFriction_1(self, frict);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['getWorldTransform'] = btPairCachingGhostObject.prototype.getWorldTransform = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPairCachingGhostObject_getWorldTransform_0(self), btTransform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['getCollisionFlags'] = btPairCachingGhostObject.prototype.getCollisionFlags = function() {
  var self = this.ptr;
  return _emscripten_bind_btPairCachingGhostObject_getCollisionFlags_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['setCollisionFlags'] = btPairCachingGhostObject.prototype.setCollisionFlags = function(flags) {
  var self = this.ptr;
  if (flags && typeof flags === 'object') flags = flags.ptr;
  _emscripten_bind_btPairCachingGhostObject_setCollisionFlags_1(self, flags);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['setWorldTransform'] = btPairCachingGhostObject.prototype.setWorldTransform = function(worldTrans) {
  var self = this.ptr;
  if (worldTrans && typeof worldTrans === 'object') worldTrans = worldTrans.ptr;
  _emscripten_bind_btPairCachingGhostObject_setWorldTransform_1(self, worldTrans);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['setCollisionShape'] = btPairCachingGhostObject.prototype.setCollisionShape = function(collisionShape) {
  var self = this.ptr;
  if (collisionShape && typeof collisionShape === 'object') collisionShape = collisionShape.ptr;
  _emscripten_bind_btPairCachingGhostObject_setCollisionShape_1(self, collisionShape);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['setCcdMotionThreshold'] = btPairCachingGhostObject.prototype.setCcdMotionThreshold = function(ccdMotionThreshold) {
  var self = this.ptr;
  if (ccdMotionThreshold && typeof ccdMotionThreshold === 'object') ccdMotionThreshold = ccdMotionThreshold.ptr;
  _emscripten_bind_btPairCachingGhostObject_setCcdMotionThreshold_1(self, ccdMotionThreshold);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['setCcdSweptSphereRadius'] = btPairCachingGhostObject.prototype.setCcdSweptSphereRadius = function(radius) {
  var self = this.ptr;
  if (radius && typeof radius === 'object') radius = radius.ptr;
  _emscripten_bind_btPairCachingGhostObject_setCcdSweptSphereRadius_1(self, radius);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['getUserIndex'] = btPairCachingGhostObject.prototype.getUserIndex = function() {
  var self = this.ptr;
  return _emscripten_bind_btPairCachingGhostObject_getUserIndex_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['setUserIndex'] = btPairCachingGhostObject.prototype.setUserIndex = function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  _emscripten_bind_btPairCachingGhostObject_setUserIndex_1(self, index);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['getUserPointer'] = btPairCachingGhostObject.prototype.getUserPointer = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPairCachingGhostObject_getUserPointer_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['setUserPointer'] = btPairCachingGhostObject.prototype.setUserPointer = function(userPointer) {
  var self = this.ptr;
  if (userPointer && typeof userPointer === 'object') userPointer = userPointer.ptr;
  _emscripten_bind_btPairCachingGhostObject_setUserPointer_1(self, userPointer);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['getBroadphaseHandle'] = btPairCachingGhostObject.prototype.getBroadphaseHandle = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btPairCachingGhostObject_getBroadphaseHandle_0(self), btBroadphaseProxy);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['getNumOverlappingObjects'] = btPairCachingGhostObject.prototype.getNumOverlappingObjects = function() {
  var self = this.ptr;
  return _emscripten_bind_btPairCachingGhostObject_getNumOverlappingObjects_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['getOverlappingObject'] = btPairCachingGhostObject.prototype.getOverlappingObject = function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  return wrapPointer(_emscripten_bind_btPairCachingGhostObject_getOverlappingObject_1(self, index), btCollisionObject);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btPairCachingGhostObject.prototype['__destroy__'] = btPairCachingGhostObject.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btPairCachingGhostObject___destroy___0(self);
};

// Interface: btGhostPairCallback

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btGhostPairCallback() {
  this.ptr = _emscripten_bind_btGhostPairCallback_btGhostPairCallback_0();
  getCache(btGhostPairCallback)[this.ptr] = this;
};

btGhostPairCallback.prototype = Object.create(WrapperObject.prototype);
btGhostPairCallback.prototype.constructor = btGhostPairCallback;
btGhostPairCallback.prototype.__class__ = btGhostPairCallback;
btGhostPairCallback.__cache__ = {};
Module['btGhostPairCallback'] = btGhostPairCallback;

/** @suppress {undefinedVars, duplicate} @this{Object} */
btGhostPairCallback.prototype['__destroy__'] = btGhostPairCallback.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btGhostPairCallback___destroy___0(self);
};

// Interface: btSoftBodyWorldInfo

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btSoftBodyWorldInfo() {
  this.ptr = _emscripten_bind_btSoftBodyWorldInfo_btSoftBodyWorldInfo_0();
  getCache(btSoftBodyWorldInfo)[this.ptr] = this;
};

btSoftBodyWorldInfo.prototype = Object.create(WrapperObject.prototype);
btSoftBodyWorldInfo.prototype.constructor = btSoftBodyWorldInfo;
btSoftBodyWorldInfo.prototype.__class__ = btSoftBodyWorldInfo;
btSoftBodyWorldInfo.__cache__ = {};
Module['btSoftBodyWorldInfo'] = btSoftBodyWorldInfo;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyWorldInfo.prototype['get_air_density'] = btSoftBodyWorldInfo.prototype.get_air_density = function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBodyWorldInfo_get_air_density_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyWorldInfo.prototype['set_air_density'] = btSoftBodyWorldInfo.prototype.set_air_density = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_air_density_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btSoftBodyWorldInfo.prototype, 'air_density', { get: btSoftBodyWorldInfo.prototype.get_air_density, set: btSoftBodyWorldInfo.prototype.set_air_density });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyWorldInfo.prototype['get_water_density'] = btSoftBodyWorldInfo.prototype.get_water_density = function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBodyWorldInfo_get_water_density_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyWorldInfo.prototype['set_water_density'] = btSoftBodyWorldInfo.prototype.set_water_density = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_water_density_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btSoftBodyWorldInfo.prototype, 'water_density', { get: btSoftBodyWorldInfo.prototype.get_water_density, set: btSoftBodyWorldInfo.prototype.set_water_density });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyWorldInfo.prototype['get_water_offset'] = btSoftBodyWorldInfo.prototype.get_water_offset = function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBodyWorldInfo_get_water_offset_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyWorldInfo.prototype['set_water_offset'] = btSoftBodyWorldInfo.prototype.set_water_offset = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_water_offset_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btSoftBodyWorldInfo.prototype, 'water_offset', { get: btSoftBodyWorldInfo.prototype.get_water_offset, set: btSoftBodyWorldInfo.prototype.set_water_offset });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyWorldInfo.prototype['get_m_maxDisplacement'] = btSoftBodyWorldInfo.prototype.get_m_maxDisplacement = function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBodyWorldInfo_get_m_maxDisplacement_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyWorldInfo.prototype['set_m_maxDisplacement'] = btSoftBodyWorldInfo.prototype.set_m_maxDisplacement = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_m_maxDisplacement_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btSoftBodyWorldInfo.prototype, 'm_maxDisplacement', { get: btSoftBodyWorldInfo.prototype.get_m_maxDisplacement, set: btSoftBodyWorldInfo.prototype.set_m_maxDisplacement });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyWorldInfo.prototype['get_water_normal'] = btSoftBodyWorldInfo.prototype.get_water_normal = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyWorldInfo_get_water_normal_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyWorldInfo.prototype['set_water_normal'] = btSoftBodyWorldInfo.prototype.set_water_normal = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_water_normal_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btSoftBodyWorldInfo.prototype, 'water_normal', { get: btSoftBodyWorldInfo.prototype.get_water_normal, set: btSoftBodyWorldInfo.prototype.set_water_normal });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyWorldInfo.prototype['get_m_broadphase'] = btSoftBodyWorldInfo.prototype.get_m_broadphase = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyWorldInfo_get_m_broadphase_0(self), btBroadphaseInterface);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyWorldInfo.prototype['set_m_broadphase'] = btSoftBodyWorldInfo.prototype.set_m_broadphase = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_m_broadphase_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btSoftBodyWorldInfo.prototype, 'm_broadphase', { get: btSoftBodyWorldInfo.prototype.get_m_broadphase, set: btSoftBodyWorldInfo.prototype.set_m_broadphase });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyWorldInfo.prototype['get_m_dispatcher'] = btSoftBodyWorldInfo.prototype.get_m_dispatcher = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyWorldInfo_get_m_dispatcher_0(self), btDispatcher);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyWorldInfo.prototype['set_m_dispatcher'] = btSoftBodyWorldInfo.prototype.set_m_dispatcher = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_m_dispatcher_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btSoftBodyWorldInfo.prototype, 'm_dispatcher', { get: btSoftBodyWorldInfo.prototype.get_m_dispatcher, set: btSoftBodyWorldInfo.prototype.set_m_dispatcher });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyWorldInfo.prototype['get_m_gravity'] = btSoftBodyWorldInfo.prototype.get_m_gravity = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyWorldInfo_get_m_gravity_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyWorldInfo.prototype['set_m_gravity'] = btSoftBodyWorldInfo.prototype.set_m_gravity = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBodyWorldInfo_set_m_gravity_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btSoftBodyWorldInfo.prototype, 'm_gravity', { get: btSoftBodyWorldInfo.prototype.get_m_gravity, set: btSoftBodyWorldInfo.prototype.set_m_gravity });

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyWorldInfo.prototype['__destroy__'] = btSoftBodyWorldInfo.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btSoftBodyWorldInfo___destroy___0(self);
};

// Interface: Face

/** @suppress {undefinedVars, duplicate} @this{Object} */
function Face() { throw "cannot construct a Face, no constructor in IDL" }
Face.prototype = Object.create(WrapperObject.prototype);
Face.prototype.constructor = Face;
Face.prototype.__class__ = Face;
Face.__cache__ = {};
Module['Face'] = Face;
/** @suppress {undefinedVars, duplicate} @this{Object} */
Face.prototype['get_m_n'] = Face.prototype.get_m_n = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return wrapPointer(_emscripten_bind_Face_get_m_n_1(self, arg0), Node);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Face.prototype['set_m_n'] = Face.prototype.set_m_n = function(arg0, arg1) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  if (arg1 && typeof arg1 === 'object') arg1 = arg1.ptr;
  _emscripten_bind_Face_set_m_n_2(self, arg0, arg1);
};

/** @suppress {checkTypes} */
Object.defineProperty(Face.prototype, 'm_n', { get: Face.prototype.get_m_n, set: Face.prototype.set_m_n });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Face.prototype['get_m_normal'] = Face.prototype.get_m_normal = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Face_get_m_normal_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Face.prototype['set_m_normal'] = Face.prototype.set_m_normal = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Face_set_m_normal_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Face.prototype, 'm_normal', { get: Face.prototype.get_m_normal, set: Face.prototype.set_m_normal });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Face.prototype['get_m_ra'] = Face.prototype.get_m_ra = function() {
  var self = this.ptr;
  return _emscripten_bind_Face_get_m_ra_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Face.prototype['set_m_ra'] = Face.prototype.set_m_ra = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Face_set_m_ra_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Face.prototype, 'm_ra', { get: Face.prototype.get_m_ra, set: Face.prototype.set_m_ra });

/** @suppress {undefinedVars, duplicate} @this{Object} */
Face.prototype['__destroy__'] = Face.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_Face___destroy___0(self);
};

// Interface: tFaceArray

/** @suppress {undefinedVars, duplicate} @this{Object} */
function tFaceArray() { throw "cannot construct a tFaceArray, no constructor in IDL" }
tFaceArray.prototype = Object.create(WrapperObject.prototype);
tFaceArray.prototype.constructor = tFaceArray;
tFaceArray.prototype.__class__ = tFaceArray;
tFaceArray.__cache__ = {};
Module['tFaceArray'] = tFaceArray;
/** @suppress {undefinedVars, duplicate} @this{Object} */
tFaceArray.prototype['size'] = tFaceArray.prototype.size = function() {
  var self = this.ptr;
  return _emscripten_bind_tFaceArray_size_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
tFaceArray.prototype['at'] = tFaceArray.prototype.at = function(n) {
  var self = this.ptr;
  if (n && typeof n === 'object') n = n.ptr;
  return wrapPointer(_emscripten_bind_tFaceArray_at_1(self, n), Face);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
tFaceArray.prototype['__destroy__'] = tFaceArray.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_tFaceArray___destroy___0(self);
};

// Interface: Node

/** @suppress {undefinedVars, duplicate} @this{Object} */
function Node() { throw "cannot construct a Node, no constructor in IDL" }
Node.prototype = Object.create(WrapperObject.prototype);
Node.prototype.constructor = Node;
Node.prototype.__class__ = Node;
Node.__cache__ = {};
Module['Node'] = Node;
/** @suppress {undefinedVars, duplicate} @this{Object} */
Node.prototype['get_m_x'] = Node.prototype.get_m_x = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Node_get_m_x_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Node.prototype['set_m_x'] = Node.prototype.set_m_x = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Node_set_m_x_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Node.prototype, 'm_x', { get: Node.prototype.get_m_x, set: Node.prototype.set_m_x });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Node.prototype['get_m_q'] = Node.prototype.get_m_q = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Node_get_m_q_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Node.prototype['set_m_q'] = Node.prototype.set_m_q = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Node_set_m_q_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Node.prototype, 'm_q', { get: Node.prototype.get_m_q, set: Node.prototype.set_m_q });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Node.prototype['get_m_v'] = Node.prototype.get_m_v = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Node_get_m_v_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Node.prototype['set_m_v'] = Node.prototype.set_m_v = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Node_set_m_v_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Node.prototype, 'm_v', { get: Node.prototype.get_m_v, set: Node.prototype.set_m_v });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Node.prototype['get_m_f'] = Node.prototype.get_m_f = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Node_get_m_f_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Node.prototype['set_m_f'] = Node.prototype.set_m_f = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Node_set_m_f_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Node.prototype, 'm_f', { get: Node.prototype.get_m_f, set: Node.prototype.set_m_f });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Node.prototype['get_m_n'] = Node.prototype.get_m_n = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Node_get_m_n_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Node.prototype['set_m_n'] = Node.prototype.set_m_n = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Node_set_m_n_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Node.prototype, 'm_n', { get: Node.prototype.get_m_n, set: Node.prototype.set_m_n });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Node.prototype['get_m_im'] = Node.prototype.get_m_im = function() {
  var self = this.ptr;
  return _emscripten_bind_Node_get_m_im_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Node.prototype['set_m_im'] = Node.prototype.set_m_im = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Node_set_m_im_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Node.prototype, 'm_im', { get: Node.prototype.get_m_im, set: Node.prototype.set_m_im });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Node.prototype['get_m_area'] = Node.prototype.get_m_area = function() {
  var self = this.ptr;
  return _emscripten_bind_Node_get_m_area_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Node.prototype['set_m_area'] = Node.prototype.set_m_area = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Node_set_m_area_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Node.prototype, 'm_area', { get: Node.prototype.get_m_area, set: Node.prototype.set_m_area });

/** @suppress {undefinedVars, duplicate} @this{Object} */
Node.prototype['__destroy__'] = Node.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_Node___destroy___0(self);
};

// Interface: tNodeArray

/** @suppress {undefinedVars, duplicate} @this{Object} */
function tNodeArray() { throw "cannot construct a tNodeArray, no constructor in IDL" }
tNodeArray.prototype = Object.create(WrapperObject.prototype);
tNodeArray.prototype.constructor = tNodeArray;
tNodeArray.prototype.__class__ = tNodeArray;
tNodeArray.__cache__ = {};
Module['tNodeArray'] = tNodeArray;
/** @suppress {undefinedVars, duplicate} @this{Object} */
tNodeArray.prototype['size'] = tNodeArray.prototype.size = function() {
  var self = this.ptr;
  return _emscripten_bind_tNodeArray_size_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
tNodeArray.prototype['at'] = tNodeArray.prototype.at = function(n) {
  var self = this.ptr;
  if (n && typeof n === 'object') n = n.ptr;
  return wrapPointer(_emscripten_bind_tNodeArray_at_1(self, n), Node);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
tNodeArray.prototype['__destroy__'] = tNodeArray.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_tNodeArray___destroy___0(self);
};

// Interface: Material

/** @suppress {undefinedVars, duplicate} @this{Object} */
function Material() { throw "cannot construct a Material, no constructor in IDL" }
Material.prototype = Object.create(WrapperObject.prototype);
Material.prototype.constructor = Material;
Material.prototype.__class__ = Material;
Material.__cache__ = {};
Module['Material'] = Material;
/** @suppress {undefinedVars, duplicate} @this{Object} */
Material.prototype['get_m_kLST'] = Material.prototype.get_m_kLST = function() {
  var self = this.ptr;
  return _emscripten_bind_Material_get_m_kLST_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Material.prototype['set_m_kLST'] = Material.prototype.set_m_kLST = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Material_set_m_kLST_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Material.prototype, 'm_kLST', { get: Material.prototype.get_m_kLST, set: Material.prototype.set_m_kLST });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Material.prototype['get_m_kAST'] = Material.prototype.get_m_kAST = function() {
  var self = this.ptr;
  return _emscripten_bind_Material_get_m_kAST_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Material.prototype['set_m_kAST'] = Material.prototype.set_m_kAST = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Material_set_m_kAST_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Material.prototype, 'm_kAST', { get: Material.prototype.get_m_kAST, set: Material.prototype.set_m_kAST });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Material.prototype['get_m_kVST'] = Material.prototype.get_m_kVST = function() {
  var self = this.ptr;
  return _emscripten_bind_Material_get_m_kVST_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Material.prototype['set_m_kVST'] = Material.prototype.set_m_kVST = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Material_set_m_kVST_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Material.prototype, 'm_kVST', { get: Material.prototype.get_m_kVST, set: Material.prototype.set_m_kVST });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Material.prototype['get_m_flags'] = Material.prototype.get_m_flags = function() {
  var self = this.ptr;
  return _emscripten_bind_Material_get_m_flags_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Material.prototype['set_m_flags'] = Material.prototype.set_m_flags = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Material_set_m_flags_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Material.prototype, 'm_flags', { get: Material.prototype.get_m_flags, set: Material.prototype.set_m_flags });

/** @suppress {undefinedVars, duplicate} @this{Object} */
Material.prototype['__destroy__'] = Material.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_Material___destroy___0(self);
};

// Interface: tMaterialArray

/** @suppress {undefinedVars, duplicate} @this{Object} */
function tMaterialArray() { throw "cannot construct a tMaterialArray, no constructor in IDL" }
tMaterialArray.prototype = Object.create(WrapperObject.prototype);
tMaterialArray.prototype.constructor = tMaterialArray;
tMaterialArray.prototype.__class__ = tMaterialArray;
tMaterialArray.__cache__ = {};
Module['tMaterialArray'] = tMaterialArray;
/** @suppress {undefinedVars, duplicate} @this{Object} */
tMaterialArray.prototype['size'] = tMaterialArray.prototype.size = function() {
  var self = this.ptr;
  return _emscripten_bind_tMaterialArray_size_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
tMaterialArray.prototype['at'] = tMaterialArray.prototype.at = function(n) {
  var self = this.ptr;
  if (n && typeof n === 'object') n = n.ptr;
  return wrapPointer(_emscripten_bind_tMaterialArray_at_1(self, n), Material);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
tMaterialArray.prototype['__destroy__'] = tMaterialArray.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_tMaterialArray___destroy___0(self);
};

// Interface: Anchor

/** @suppress {undefinedVars, duplicate} @this{Object} */
function Anchor() { throw "cannot construct a Anchor, no constructor in IDL" }
Anchor.prototype = Object.create(WrapperObject.prototype);
Anchor.prototype.constructor = Anchor;
Anchor.prototype.__class__ = Anchor;
Anchor.__cache__ = {};
Module['Anchor'] = Anchor;
/** @suppress {undefinedVars, duplicate} @this{Object} */
Anchor.prototype['get_m_node'] = Anchor.prototype.get_m_node = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Anchor_get_m_node_0(self), Node);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Anchor.prototype['set_m_node'] = Anchor.prototype.set_m_node = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Anchor_set_m_node_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Anchor.prototype, 'm_node', { get: Anchor.prototype.get_m_node, set: Anchor.prototype.set_m_node });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Anchor.prototype['get_m_local'] = Anchor.prototype.get_m_local = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Anchor_get_m_local_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Anchor.prototype['set_m_local'] = Anchor.prototype.set_m_local = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Anchor_set_m_local_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Anchor.prototype, 'm_local', { get: Anchor.prototype.get_m_local, set: Anchor.prototype.set_m_local });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Anchor.prototype['get_m_body'] = Anchor.prototype.get_m_body = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Anchor_get_m_body_0(self), btRigidBody);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Anchor.prototype['set_m_body'] = Anchor.prototype.set_m_body = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Anchor_set_m_body_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Anchor.prototype, 'm_body', { get: Anchor.prototype.get_m_body, set: Anchor.prototype.set_m_body });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Anchor.prototype['get_m_influence'] = Anchor.prototype.get_m_influence = function() {
  var self = this.ptr;
  return _emscripten_bind_Anchor_get_m_influence_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Anchor.prototype['set_m_influence'] = Anchor.prototype.set_m_influence = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Anchor_set_m_influence_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Anchor.prototype, 'm_influence', { get: Anchor.prototype.get_m_influence, set: Anchor.prototype.set_m_influence });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Anchor.prototype['get_m_c0'] = Anchor.prototype.get_m_c0 = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Anchor_get_m_c0_0(self), btMatrix3x3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Anchor.prototype['set_m_c0'] = Anchor.prototype.set_m_c0 = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Anchor_set_m_c0_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Anchor.prototype, 'm_c0', { get: Anchor.prototype.get_m_c0, set: Anchor.prototype.set_m_c0 });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Anchor.prototype['get_m_c1'] = Anchor.prototype.get_m_c1 = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_Anchor_get_m_c1_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Anchor.prototype['set_m_c1'] = Anchor.prototype.set_m_c1 = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Anchor_set_m_c1_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Anchor.prototype, 'm_c1', { get: Anchor.prototype.get_m_c1, set: Anchor.prototype.set_m_c1 });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Anchor.prototype['get_m_c2'] = Anchor.prototype.get_m_c2 = function() {
  var self = this.ptr;
  return _emscripten_bind_Anchor_get_m_c2_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Anchor.prototype['set_m_c2'] = Anchor.prototype.set_m_c2 = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Anchor_set_m_c2_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Anchor.prototype, 'm_c2', { get: Anchor.prototype.get_m_c2, set: Anchor.prototype.set_m_c2 });

/** @suppress {undefinedVars, duplicate} @this{Object} */
Anchor.prototype['__destroy__'] = Anchor.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_Anchor___destroy___0(self);
};

// Interface: tAnchorArray

/** @suppress {undefinedVars, duplicate} @this{Object} */
function tAnchorArray() { throw "cannot construct a tAnchorArray, no constructor in IDL" }
tAnchorArray.prototype = Object.create(WrapperObject.prototype);
tAnchorArray.prototype.constructor = tAnchorArray;
tAnchorArray.prototype.__class__ = tAnchorArray;
tAnchorArray.__cache__ = {};
Module['tAnchorArray'] = tAnchorArray;
/** @suppress {undefinedVars, duplicate} @this{Object} */
tAnchorArray.prototype['size'] = tAnchorArray.prototype.size = function() {
  var self = this.ptr;
  return _emscripten_bind_tAnchorArray_size_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
tAnchorArray.prototype['at'] = tAnchorArray.prototype.at = function(n) {
  var self = this.ptr;
  if (n && typeof n === 'object') n = n.ptr;
  return wrapPointer(_emscripten_bind_tAnchorArray_at_1(self, n), Anchor);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
tAnchorArray.prototype['clear'] = tAnchorArray.prototype.clear = function() {
  var self = this.ptr;
  _emscripten_bind_tAnchorArray_clear_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
tAnchorArray.prototype['push_back'] = tAnchorArray.prototype.push_back = function(val) {
  var self = this.ptr;
  if (val && typeof val === 'object') val = val.ptr;
  _emscripten_bind_tAnchorArray_push_back_1(self, val);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
tAnchorArray.prototype['pop_back'] = tAnchorArray.prototype.pop_back = function() {
  var self = this.ptr;
  _emscripten_bind_tAnchorArray_pop_back_0(self);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
tAnchorArray.prototype['__destroy__'] = tAnchorArray.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_tAnchorArray___destroy___0(self);
};

// Interface: Config

/** @suppress {undefinedVars, duplicate} @this{Object} */
function Config() { throw "cannot construct a Config, no constructor in IDL" }
Config.prototype = Object.create(WrapperObject.prototype);
Config.prototype.constructor = Config;
Config.prototype.__class__ = Config;
Config.__cache__ = {};
Module['Config'] = Config;
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_kVCF'] = Config.prototype.get_kVCF = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kVCF_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_kVCF'] = Config.prototype.set_kVCF = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kVCF_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'kVCF', { get: Config.prototype.get_kVCF, set: Config.prototype.set_kVCF });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_kDP'] = Config.prototype.get_kDP = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kDP_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_kDP'] = Config.prototype.set_kDP = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kDP_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'kDP', { get: Config.prototype.get_kDP, set: Config.prototype.set_kDP });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_kDG'] = Config.prototype.get_kDG = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kDG_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_kDG'] = Config.prototype.set_kDG = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kDG_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'kDG', { get: Config.prototype.get_kDG, set: Config.prototype.set_kDG });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_kLF'] = Config.prototype.get_kLF = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kLF_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_kLF'] = Config.prototype.set_kLF = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kLF_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'kLF', { get: Config.prototype.get_kLF, set: Config.prototype.set_kLF });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_kPR'] = Config.prototype.get_kPR = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kPR_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_kPR'] = Config.prototype.set_kPR = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kPR_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'kPR', { get: Config.prototype.get_kPR, set: Config.prototype.set_kPR });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_kVC'] = Config.prototype.get_kVC = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kVC_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_kVC'] = Config.prototype.set_kVC = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kVC_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'kVC', { get: Config.prototype.get_kVC, set: Config.prototype.set_kVC });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_kDF'] = Config.prototype.get_kDF = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kDF_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_kDF'] = Config.prototype.set_kDF = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kDF_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'kDF', { get: Config.prototype.get_kDF, set: Config.prototype.set_kDF });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_kMT'] = Config.prototype.get_kMT = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kMT_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_kMT'] = Config.prototype.set_kMT = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kMT_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'kMT', { get: Config.prototype.get_kMT, set: Config.prototype.set_kMT });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_kCHR'] = Config.prototype.get_kCHR = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kCHR_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_kCHR'] = Config.prototype.set_kCHR = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kCHR_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'kCHR', { get: Config.prototype.get_kCHR, set: Config.prototype.set_kCHR });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_kKHR'] = Config.prototype.get_kKHR = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kKHR_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_kKHR'] = Config.prototype.set_kKHR = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kKHR_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'kKHR', { get: Config.prototype.get_kKHR, set: Config.prototype.set_kKHR });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_kSHR'] = Config.prototype.get_kSHR = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSHR_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_kSHR'] = Config.prototype.set_kSHR = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSHR_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'kSHR', { get: Config.prototype.get_kSHR, set: Config.prototype.set_kSHR });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_kAHR'] = Config.prototype.get_kAHR = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kAHR_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_kAHR'] = Config.prototype.set_kAHR = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kAHR_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'kAHR', { get: Config.prototype.get_kAHR, set: Config.prototype.set_kAHR });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_kSRHR_CL'] = Config.prototype.get_kSRHR_CL = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSRHR_CL_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_kSRHR_CL'] = Config.prototype.set_kSRHR_CL = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSRHR_CL_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'kSRHR_CL', { get: Config.prototype.get_kSRHR_CL, set: Config.prototype.set_kSRHR_CL });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_kSKHR_CL'] = Config.prototype.get_kSKHR_CL = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSKHR_CL_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_kSKHR_CL'] = Config.prototype.set_kSKHR_CL = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSKHR_CL_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'kSKHR_CL', { get: Config.prototype.get_kSKHR_CL, set: Config.prototype.set_kSKHR_CL });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_kSSHR_CL'] = Config.prototype.get_kSSHR_CL = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSSHR_CL_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_kSSHR_CL'] = Config.prototype.set_kSSHR_CL = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSSHR_CL_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'kSSHR_CL', { get: Config.prototype.get_kSSHR_CL, set: Config.prototype.set_kSSHR_CL });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_kSR_SPLT_CL'] = Config.prototype.get_kSR_SPLT_CL = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSR_SPLT_CL_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_kSR_SPLT_CL'] = Config.prototype.set_kSR_SPLT_CL = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSR_SPLT_CL_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'kSR_SPLT_CL', { get: Config.prototype.get_kSR_SPLT_CL, set: Config.prototype.set_kSR_SPLT_CL });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_kSK_SPLT_CL'] = Config.prototype.get_kSK_SPLT_CL = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSK_SPLT_CL_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_kSK_SPLT_CL'] = Config.prototype.set_kSK_SPLT_CL = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSK_SPLT_CL_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'kSK_SPLT_CL', { get: Config.prototype.get_kSK_SPLT_CL, set: Config.prototype.set_kSK_SPLT_CL });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_kSS_SPLT_CL'] = Config.prototype.get_kSS_SPLT_CL = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_kSS_SPLT_CL_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_kSS_SPLT_CL'] = Config.prototype.set_kSS_SPLT_CL = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_kSS_SPLT_CL_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'kSS_SPLT_CL', { get: Config.prototype.get_kSS_SPLT_CL, set: Config.prototype.set_kSS_SPLT_CL });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_maxvolume'] = Config.prototype.get_maxvolume = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_maxvolume_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_maxvolume'] = Config.prototype.set_maxvolume = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_maxvolume_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'maxvolume', { get: Config.prototype.get_maxvolume, set: Config.prototype.set_maxvolume });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_timescale'] = Config.prototype.get_timescale = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_timescale_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_timescale'] = Config.prototype.set_timescale = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_timescale_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'timescale', { get: Config.prototype.get_timescale, set: Config.prototype.set_timescale });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_viterations'] = Config.prototype.get_viterations = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_viterations_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_viterations'] = Config.prototype.set_viterations = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_viterations_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'viterations', { get: Config.prototype.get_viterations, set: Config.prototype.set_viterations });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_piterations'] = Config.prototype.get_piterations = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_piterations_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_piterations'] = Config.prototype.set_piterations = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_piterations_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'piterations', { get: Config.prototype.get_piterations, set: Config.prototype.set_piterations });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_diterations'] = Config.prototype.get_diterations = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_diterations_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_diterations'] = Config.prototype.set_diterations = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_diterations_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'diterations', { get: Config.prototype.get_diterations, set: Config.prototype.set_diterations });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_citerations'] = Config.prototype.get_citerations = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_citerations_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_citerations'] = Config.prototype.set_citerations = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_citerations_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'citerations', { get: Config.prototype.get_citerations, set: Config.prototype.set_citerations });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['get_collisions'] = Config.prototype.get_collisions = function() {
  var self = this.ptr;
  return _emscripten_bind_Config_get_collisions_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['set_collisions'] = Config.prototype.set_collisions = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Config_set_collisions_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Config.prototype, 'collisions', { get: Config.prototype.get_collisions, set: Config.prototype.set_collisions });

/** @suppress {undefinedVars, duplicate} @this{Object} */
Config.prototype['__destroy__'] = Config.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_Config___destroy___0(self);
};

// Interface: btSoftBody

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btSoftBody(worldInfo, node_count, x, m) {
  ensureCache.prepare();
  if (worldInfo && typeof worldInfo === 'object') worldInfo = worldInfo.ptr;
  if (node_count && typeof node_count === 'object') node_count = node_count.ptr;
  if (x && typeof x === 'object') x = x.ptr;
  if (typeof m == 'object') { m = ensureFloat32(m); }
  this.ptr = _emscripten_bind_btSoftBody_btSoftBody_4(worldInfo, node_count, x, m);
  getCache(btSoftBody)[this.ptr] = this;
};

btSoftBody.prototype = Object.create(btCollisionObject.prototype);
btSoftBody.prototype.constructor = btSoftBody;
btSoftBody.prototype.__class__ = btSoftBody;
btSoftBody.__cache__ = {};
Module['btSoftBody'] = btSoftBody;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['checkLink'] = btSoftBody.prototype.checkLink = function(node0, node1) {
  var self = this.ptr;
  if (node0 && typeof node0 === 'object') node0 = node0.ptr;
  if (node1 && typeof node1 === 'object') node1 = node1.ptr;
  return !!(_emscripten_bind_btSoftBody_checkLink_2(self, node0, node1));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['checkFace'] = btSoftBody.prototype.checkFace = function(node0, node1, node2) {
  var self = this.ptr;
  if (node0 && typeof node0 === 'object') node0 = node0.ptr;
  if (node1 && typeof node1 === 'object') node1 = node1.ptr;
  if (node2 && typeof node2 === 'object') node2 = node2.ptr;
  return !!(_emscripten_bind_btSoftBody_checkFace_3(self, node0, node1, node2));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['appendMaterial'] = btSoftBody.prototype.appendMaterial = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_appendMaterial_0(self), Material);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['appendNode'] = btSoftBody.prototype.appendNode = function(x, m) {
  var self = this.ptr;
  if (x && typeof x === 'object') x = x.ptr;
  if (m && typeof m === 'object') m = m.ptr;
  _emscripten_bind_btSoftBody_appendNode_2(self, x, m);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['appendLink'] = btSoftBody.prototype.appendLink = function(node0, node1, mat, bcheckexist) {
  var self = this.ptr;
  if (node0 && typeof node0 === 'object') node0 = node0.ptr;
  if (node1 && typeof node1 === 'object') node1 = node1.ptr;
  if (mat && typeof mat === 'object') mat = mat.ptr;
  if (bcheckexist && typeof bcheckexist === 'object') bcheckexist = bcheckexist.ptr;
  _emscripten_bind_btSoftBody_appendLink_4(self, node0, node1, mat, bcheckexist);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['appendFace'] = btSoftBody.prototype.appendFace = function(node0, node1, node2, mat) {
  var self = this.ptr;
  if (node0 && typeof node0 === 'object') node0 = node0.ptr;
  if (node1 && typeof node1 === 'object') node1 = node1.ptr;
  if (node2 && typeof node2 === 'object') node2 = node2.ptr;
  if (mat && typeof mat === 'object') mat = mat.ptr;
  _emscripten_bind_btSoftBody_appendFace_4(self, node0, node1, node2, mat);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['appendTetra'] = btSoftBody.prototype.appendTetra = function(node0, node1, node2, node3, mat) {
  var self = this.ptr;
  if (node0 && typeof node0 === 'object') node0 = node0.ptr;
  if (node1 && typeof node1 === 'object') node1 = node1.ptr;
  if (node2 && typeof node2 === 'object') node2 = node2.ptr;
  if (node3 && typeof node3 === 'object') node3 = node3.ptr;
  if (mat && typeof mat === 'object') mat = mat.ptr;
  _emscripten_bind_btSoftBody_appendTetra_5(self, node0, node1, node2, node3, mat);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['appendAnchor'] = btSoftBody.prototype.appendAnchor = function(node, body, disableCollisionBetweenLinkedBodies, influence) {
  var self = this.ptr;
  if (node && typeof node === 'object') node = node.ptr;
  if (body && typeof body === 'object') body = body.ptr;
  if (disableCollisionBetweenLinkedBodies && typeof disableCollisionBetweenLinkedBodies === 'object') disableCollisionBetweenLinkedBodies = disableCollisionBetweenLinkedBodies.ptr;
  if (influence && typeof influence === 'object') influence = influence.ptr;
  _emscripten_bind_btSoftBody_appendAnchor_4(self, node, body, disableCollisionBetweenLinkedBodies, influence);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['addForce'] = btSoftBody.prototype.addForce = function(force, node) {
  var self = this.ptr;
  if (force && typeof force === 'object') force = force.ptr;
  if (node && typeof node === 'object') node = node.ptr;
  if (node === undefined) { _emscripten_bind_btSoftBody_addForce_1(self, force); return }
  _emscripten_bind_btSoftBody_addForce_2(self, force, node);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['addAeroForceToNode'] = btSoftBody.prototype.addAeroForceToNode = function(windVelocity, nodeIndex) {
  var self = this.ptr;
  if (windVelocity && typeof windVelocity === 'object') windVelocity = windVelocity.ptr;
  if (nodeIndex && typeof nodeIndex === 'object') nodeIndex = nodeIndex.ptr;
  _emscripten_bind_btSoftBody_addAeroForceToNode_2(self, windVelocity, nodeIndex);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['getTotalMass'] = btSoftBody.prototype.getTotalMass = function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBody_getTotalMass_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['setTotalMass'] = btSoftBody.prototype.setTotalMass = function(mass, fromfaces) {
  var self = this.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  if (fromfaces && typeof fromfaces === 'object') fromfaces = fromfaces.ptr;
  _emscripten_bind_btSoftBody_setTotalMass_2(self, mass, fromfaces);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['setMass'] = btSoftBody.prototype.setMass = function(node, mass) {
  var self = this.ptr;
  if (node && typeof node === 'object') node = node.ptr;
  if (mass && typeof mass === 'object') mass = mass.ptr;
  _emscripten_bind_btSoftBody_setMass_2(self, node, mass);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['transform'] = btSoftBody.prototype.transform = function(trs) {
  var self = this.ptr;
  if (trs && typeof trs === 'object') trs = trs.ptr;
  _emscripten_bind_btSoftBody_transform_1(self, trs);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['translate'] = btSoftBody.prototype.translate = function(trs) {
  var self = this.ptr;
  if (trs && typeof trs === 'object') trs = trs.ptr;
  _emscripten_bind_btSoftBody_translate_1(self, trs);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['rotate'] = btSoftBody.prototype.rotate = function(rot) {
  var self = this.ptr;
  if (rot && typeof rot === 'object') rot = rot.ptr;
  _emscripten_bind_btSoftBody_rotate_1(self, rot);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['scale'] = btSoftBody.prototype.scale = function(scl) {
  var self = this.ptr;
  if (scl && typeof scl === 'object') scl = scl.ptr;
  _emscripten_bind_btSoftBody_scale_1(self, scl);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['generateClusters'] = btSoftBody.prototype.generateClusters = function(k, maxiterations) {
  var self = this.ptr;
  if (k && typeof k === 'object') k = k.ptr;
  if (maxiterations && typeof maxiterations === 'object') maxiterations = maxiterations.ptr;
  if (maxiterations === undefined) { return _emscripten_bind_btSoftBody_generateClusters_1(self, k) }
  return _emscripten_bind_btSoftBody_generateClusters_2(self, k, maxiterations);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['generateBendingConstraints'] = btSoftBody.prototype.generateBendingConstraints = function(distance, mat) {
  var self = this.ptr;
  if (distance && typeof distance === 'object') distance = distance.ptr;
  if (mat && typeof mat === 'object') mat = mat.ptr;
  return _emscripten_bind_btSoftBody_generateBendingConstraints_2(self, distance, mat);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['upcast'] = btSoftBody.prototype.upcast = function(colObj) {
  var self = this.ptr;
  if (colObj && typeof colObj === 'object') colObj = colObj.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_upcast_1(self, colObj), btSoftBody);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['getRestLengthScale'] = btSoftBody.prototype.getRestLengthScale = function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBody_getRestLengthScale_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['setRestLengthScale'] = btSoftBody.prototype.setRestLengthScale = function(restLength) {
  var self = this.ptr;
  if (restLength && typeof restLength === 'object') restLength = restLength.ptr;
  _emscripten_bind_btSoftBody_setRestLengthScale_1(self, restLength);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['setAnisotropicFriction'] = btSoftBody.prototype.setAnisotropicFriction = function(anisotropicFriction, frictionMode) {
  var self = this.ptr;
  if (anisotropicFriction && typeof anisotropicFriction === 'object') anisotropicFriction = anisotropicFriction.ptr;
  if (frictionMode && typeof frictionMode === 'object') frictionMode = frictionMode.ptr;
  _emscripten_bind_btSoftBody_setAnisotropicFriction_2(self, anisotropicFriction, frictionMode);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['getCollisionShape'] = btSoftBody.prototype.getCollisionShape = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_getCollisionShape_0(self), btCollisionShape);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['setContactProcessingThreshold'] = btSoftBody.prototype.setContactProcessingThreshold = function(contactProcessingThreshold) {
  var self = this.ptr;
  if (contactProcessingThreshold && typeof contactProcessingThreshold === 'object') contactProcessingThreshold = contactProcessingThreshold.ptr;
  _emscripten_bind_btSoftBody_setContactProcessingThreshold_1(self, contactProcessingThreshold);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['setActivationState'] = btSoftBody.prototype.setActivationState = function(newState) {
  var self = this.ptr;
  if (newState && typeof newState === 'object') newState = newState.ptr;
  _emscripten_bind_btSoftBody_setActivationState_1(self, newState);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['forceActivationState'] = btSoftBody.prototype.forceActivationState = function(newState) {
  var self = this.ptr;
  if (newState && typeof newState === 'object') newState = newState.ptr;
  _emscripten_bind_btSoftBody_forceActivationState_1(self, newState);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['activate'] = btSoftBody.prototype.activate = function(forceActivation) {
  var self = this.ptr;
  if (forceActivation && typeof forceActivation === 'object') forceActivation = forceActivation.ptr;
  if (forceActivation === undefined) { _emscripten_bind_btSoftBody_activate_0(self); return }
  _emscripten_bind_btSoftBody_activate_1(self, forceActivation);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['isActive'] = btSoftBody.prototype.isActive = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btSoftBody_isActive_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['isKinematicObject'] = btSoftBody.prototype.isKinematicObject = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btSoftBody_isKinematicObject_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['isStaticObject'] = btSoftBody.prototype.isStaticObject = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btSoftBody_isStaticObject_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['isStaticOrKinematicObject'] = btSoftBody.prototype.isStaticOrKinematicObject = function() {
  var self = this.ptr;
  return !!(_emscripten_bind_btSoftBody_isStaticOrKinematicObject_0(self));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['getRestitution'] = btSoftBody.prototype.getRestitution = function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBody_getRestitution_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['getFriction'] = btSoftBody.prototype.getFriction = function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBody_getFriction_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['getRollingFriction'] = btSoftBody.prototype.getRollingFriction = function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBody_getRollingFriction_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['setRestitution'] = btSoftBody.prototype.setRestitution = function(rest) {
  var self = this.ptr;
  if (rest && typeof rest === 'object') rest = rest.ptr;
  _emscripten_bind_btSoftBody_setRestitution_1(self, rest);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['setFriction'] = btSoftBody.prototype.setFriction = function(frict) {
  var self = this.ptr;
  if (frict && typeof frict === 'object') frict = frict.ptr;
  _emscripten_bind_btSoftBody_setFriction_1(self, frict);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['setRollingFriction'] = btSoftBody.prototype.setRollingFriction = function(frict) {
  var self = this.ptr;
  if (frict && typeof frict === 'object') frict = frict.ptr;
  _emscripten_bind_btSoftBody_setRollingFriction_1(self, frict);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['getWorldTransform'] = btSoftBody.prototype.getWorldTransform = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_getWorldTransform_0(self), btTransform);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['getCollisionFlags'] = btSoftBody.prototype.getCollisionFlags = function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBody_getCollisionFlags_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['setCollisionFlags'] = btSoftBody.prototype.setCollisionFlags = function(flags) {
  var self = this.ptr;
  if (flags && typeof flags === 'object') flags = flags.ptr;
  _emscripten_bind_btSoftBody_setCollisionFlags_1(self, flags);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['setWorldTransform'] = btSoftBody.prototype.setWorldTransform = function(worldTrans) {
  var self = this.ptr;
  if (worldTrans && typeof worldTrans === 'object') worldTrans = worldTrans.ptr;
  _emscripten_bind_btSoftBody_setWorldTransform_1(self, worldTrans);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['setCollisionShape'] = btSoftBody.prototype.setCollisionShape = function(collisionShape) {
  var self = this.ptr;
  if (collisionShape && typeof collisionShape === 'object') collisionShape = collisionShape.ptr;
  _emscripten_bind_btSoftBody_setCollisionShape_1(self, collisionShape);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['setCcdMotionThreshold'] = btSoftBody.prototype.setCcdMotionThreshold = function(ccdMotionThreshold) {
  var self = this.ptr;
  if (ccdMotionThreshold && typeof ccdMotionThreshold === 'object') ccdMotionThreshold = ccdMotionThreshold.ptr;
  _emscripten_bind_btSoftBody_setCcdMotionThreshold_1(self, ccdMotionThreshold);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['setCcdSweptSphereRadius'] = btSoftBody.prototype.setCcdSweptSphereRadius = function(radius) {
  var self = this.ptr;
  if (radius && typeof radius === 'object') radius = radius.ptr;
  _emscripten_bind_btSoftBody_setCcdSweptSphereRadius_1(self, radius);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['getUserIndex'] = btSoftBody.prototype.getUserIndex = function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBody_getUserIndex_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['setUserIndex'] = btSoftBody.prototype.setUserIndex = function(index) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  _emscripten_bind_btSoftBody_setUserIndex_1(self, index);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['getUserPointer'] = btSoftBody.prototype.getUserPointer = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_getUserPointer_0(self), VoidPtr);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['setUserPointer'] = btSoftBody.prototype.setUserPointer = function(userPointer) {
  var self = this.ptr;
  if (userPointer && typeof userPointer === 'object') userPointer = userPointer.ptr;
  _emscripten_bind_btSoftBody_setUserPointer_1(self, userPointer);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['getBroadphaseHandle'] = btSoftBody.prototype.getBroadphaseHandle = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_getBroadphaseHandle_0(self), btBroadphaseProxy);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['get_m_cfg'] = btSoftBody.prototype.get_m_cfg = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_get_m_cfg_0(self), Config);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['set_m_cfg'] = btSoftBody.prototype.set_m_cfg = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_set_m_cfg_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btSoftBody.prototype, 'm_cfg', { get: btSoftBody.prototype.get_m_cfg, set: btSoftBody.prototype.set_m_cfg });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['get_m_nodes'] = btSoftBody.prototype.get_m_nodes = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_get_m_nodes_0(self), tNodeArray);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['set_m_nodes'] = btSoftBody.prototype.set_m_nodes = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_set_m_nodes_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btSoftBody.prototype, 'm_nodes', { get: btSoftBody.prototype.get_m_nodes, set: btSoftBody.prototype.set_m_nodes });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['get_m_faces'] = btSoftBody.prototype.get_m_faces = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_get_m_faces_0(self), tFaceArray);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['set_m_faces'] = btSoftBody.prototype.set_m_faces = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_set_m_faces_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btSoftBody.prototype, 'm_faces', { get: btSoftBody.prototype.get_m_faces, set: btSoftBody.prototype.set_m_faces });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['get_m_materials'] = btSoftBody.prototype.get_m_materials = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_get_m_materials_0(self), tMaterialArray);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['set_m_materials'] = btSoftBody.prototype.set_m_materials = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_set_m_materials_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btSoftBody.prototype, 'm_materials', { get: btSoftBody.prototype.get_m_materials, set: btSoftBody.prototype.set_m_materials });
/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['get_m_anchors'] = btSoftBody.prototype.get_m_anchors = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftBody_get_m_anchors_0(self), tAnchorArray);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['set_m_anchors'] = btSoftBody.prototype.set_m_anchors = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_btSoftBody_set_m_anchors_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(btSoftBody.prototype, 'm_anchors', { get: btSoftBody.prototype.get_m_anchors, set: btSoftBody.prototype.set_m_anchors });

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBody.prototype['__destroy__'] = btSoftBody.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btSoftBody___destroy___0(self);
};

// Interface: btSoftBodyRigidBodyCollisionConfiguration

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btSoftBodyRigidBodyCollisionConfiguration(info) {
  if (info && typeof info === 'object') info = info.ptr;
  if (info === undefined) { this.ptr = _emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_0(); getCache(btSoftBodyRigidBodyCollisionConfiguration)[this.ptr] = this;return }
  this.ptr = _emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_1(info);
  getCache(btSoftBodyRigidBodyCollisionConfiguration)[this.ptr] = this;
};

btSoftBodyRigidBodyCollisionConfiguration.prototype = Object.create(btDefaultCollisionConfiguration.prototype);
btSoftBodyRigidBodyCollisionConfiguration.prototype.constructor = btSoftBodyRigidBodyCollisionConfiguration;
btSoftBodyRigidBodyCollisionConfiguration.prototype.__class__ = btSoftBodyRigidBodyCollisionConfiguration;
btSoftBodyRigidBodyCollisionConfiguration.__cache__ = {};
Module['btSoftBodyRigidBodyCollisionConfiguration'] = btSoftBodyRigidBodyCollisionConfiguration;

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyRigidBodyCollisionConfiguration.prototype['__destroy__'] = btSoftBodyRigidBodyCollisionConfiguration.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration___destroy___0(self);
};

// Interface: btDefaultSoftBodySolver

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btDefaultSoftBodySolver() {
  this.ptr = _emscripten_bind_btDefaultSoftBodySolver_btDefaultSoftBodySolver_0();
  getCache(btDefaultSoftBodySolver)[this.ptr] = this;
};

btDefaultSoftBodySolver.prototype = Object.create(btSoftBodySolver.prototype);
btDefaultSoftBodySolver.prototype.constructor = btDefaultSoftBodySolver;
btDefaultSoftBodySolver.prototype.__class__ = btDefaultSoftBodySolver;
btDefaultSoftBodySolver.__cache__ = {};
Module['btDefaultSoftBodySolver'] = btDefaultSoftBodySolver;

/** @suppress {undefinedVars, duplicate} @this{Object} */
btDefaultSoftBodySolver.prototype['__destroy__'] = btDefaultSoftBodySolver.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btDefaultSoftBodySolver___destroy___0(self);
};

// Interface: btSoftBodyArray

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btSoftBodyArray() { throw "cannot construct a btSoftBodyArray, no constructor in IDL" }
btSoftBodyArray.prototype = Object.create(WrapperObject.prototype);
btSoftBodyArray.prototype.constructor = btSoftBodyArray;
btSoftBodyArray.prototype.__class__ = btSoftBodyArray;
btSoftBodyArray.__cache__ = {};
Module['btSoftBodyArray'] = btSoftBodyArray;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyArray.prototype['size'] = btSoftBodyArray.prototype.size = function() {
  var self = this.ptr;
  return _emscripten_bind_btSoftBodyArray_size_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyArray.prototype['at'] = btSoftBodyArray.prototype.at = function(n) {
  var self = this.ptr;
  if (n && typeof n === 'object') n = n.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyArray_at_1(self, n), btSoftBody);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyArray.prototype['__destroy__'] = btSoftBodyArray.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btSoftBodyArray___destroy___0(self);
};

// Interface: btSoftRigidDynamicsWorld

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btSoftRigidDynamicsWorld(dispatcher, pairCache, constraintSolver, collisionConfiguration, softBodySolver) {
  if (dispatcher && typeof dispatcher === 'object') dispatcher = dispatcher.ptr;
  if (pairCache && typeof pairCache === 'object') pairCache = pairCache.ptr;
  if (constraintSolver && typeof constraintSolver === 'object') constraintSolver = constraintSolver.ptr;
  if (collisionConfiguration && typeof collisionConfiguration === 'object') collisionConfiguration = collisionConfiguration.ptr;
  if (softBodySolver && typeof softBodySolver === 'object') softBodySolver = softBodySolver.ptr;
  this.ptr = _emscripten_bind_btSoftRigidDynamicsWorld_btSoftRigidDynamicsWorld_5(dispatcher, pairCache, constraintSolver, collisionConfiguration, softBodySolver);
  getCache(btSoftRigidDynamicsWorld)[this.ptr] = this;
};

btSoftRigidDynamicsWorld.prototype = Object.create(btDiscreteDynamicsWorld.prototype);
btSoftRigidDynamicsWorld.prototype.constructor = btSoftRigidDynamicsWorld;
btSoftRigidDynamicsWorld.prototype.__class__ = btSoftRigidDynamicsWorld;
btSoftRigidDynamicsWorld.__cache__ = {};
Module['btSoftRigidDynamicsWorld'] = btSoftRigidDynamicsWorld;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['addSoftBody'] = btSoftRigidDynamicsWorld.prototype.addSoftBody = function(body, collisionFilterGroup, collisionFilterMask) {
  var self = this.ptr;
  if (body && typeof body === 'object') body = body.ptr;
  if (collisionFilterGroup && typeof collisionFilterGroup === 'object') collisionFilterGroup = collisionFilterGroup.ptr;
  if (collisionFilterMask && typeof collisionFilterMask === 'object') collisionFilterMask = collisionFilterMask.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_addSoftBody_3(self, body, collisionFilterGroup, collisionFilterMask);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['removeSoftBody'] = btSoftRigidDynamicsWorld.prototype.removeSoftBody = function(body) {
  var self = this.ptr;
  if (body && typeof body === 'object') body = body.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_removeSoftBody_1(self, body);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['removeCollisionObject'] = btSoftRigidDynamicsWorld.prototype.removeCollisionObject = function(collisionObject) {
  var self = this.ptr;
  if (collisionObject && typeof collisionObject === 'object') collisionObject = collisionObject.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_removeCollisionObject_1(self, collisionObject);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['getWorldInfo'] = btSoftRigidDynamicsWorld.prototype.getWorldInfo = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getWorldInfo_0(self), btSoftBodyWorldInfo);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['getSoftBodyArray'] = btSoftRigidDynamicsWorld.prototype.getSoftBodyArray = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getSoftBodyArray_0(self), btSoftBodyArray);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['getDispatcher'] = btSoftRigidDynamicsWorld.prototype.getDispatcher = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getDispatcher_0(self), btDispatcher);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['rayTest'] = btSoftRigidDynamicsWorld.prototype.rayTest = function(rayFromWorld, rayToWorld, resultCallback) {
  var self = this.ptr;
  if (rayFromWorld && typeof rayFromWorld === 'object') rayFromWorld = rayFromWorld.ptr;
  if (rayToWorld && typeof rayToWorld === 'object') rayToWorld = rayToWorld.ptr;
  if (resultCallback && typeof resultCallback === 'object') resultCallback = resultCallback.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_rayTest_3(self, rayFromWorld, rayToWorld, resultCallback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['getPairCache'] = btSoftRigidDynamicsWorld.prototype.getPairCache = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getPairCache_0(self), btOverlappingPairCache);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['getDispatchInfo'] = btSoftRigidDynamicsWorld.prototype.getDispatchInfo = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getDispatchInfo_0(self), btDispatcherInfo);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['addCollisionObject'] = btSoftRigidDynamicsWorld.prototype.addCollisionObject = function(collisionObject, collisionFilterGroup, collisionFilterMask) {
  var self = this.ptr;
  if (collisionObject && typeof collisionObject === 'object') collisionObject = collisionObject.ptr;
  if (collisionFilterGroup && typeof collisionFilterGroup === 'object') collisionFilterGroup = collisionFilterGroup.ptr;
  if (collisionFilterMask && typeof collisionFilterMask === 'object') collisionFilterMask = collisionFilterMask.ptr;
  if (collisionFilterGroup === undefined) { _emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_1(self, collisionObject); return }
  if (collisionFilterMask === undefined) { _emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_2(self, collisionObject, collisionFilterGroup); return }
  _emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_3(self, collisionObject, collisionFilterGroup, collisionFilterMask);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['getBroadphase'] = btSoftRigidDynamicsWorld.prototype.getBroadphase = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getBroadphase_0(self), btBroadphaseInterface);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['convexSweepTest'] = btSoftRigidDynamicsWorld.prototype.convexSweepTest = function(castShape, from, to, resultCallback, allowedCcdPenetration) {
  var self = this.ptr;
  if (castShape && typeof castShape === 'object') castShape = castShape.ptr;
  if (from && typeof from === 'object') from = from.ptr;
  if (to && typeof to === 'object') to = to.ptr;
  if (resultCallback && typeof resultCallback === 'object') resultCallback = resultCallback.ptr;
  if (allowedCcdPenetration && typeof allowedCcdPenetration === 'object') allowedCcdPenetration = allowedCcdPenetration.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_convexSweepTest_5(self, castShape, from, to, resultCallback, allowedCcdPenetration);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['contactPairTest'] = btSoftRigidDynamicsWorld.prototype.contactPairTest = function(colObjA, colObjB, resultCallback) {
  var self = this.ptr;
  if (colObjA && typeof colObjA === 'object') colObjA = colObjA.ptr;
  if (colObjB && typeof colObjB === 'object') colObjB = colObjB.ptr;
  if (resultCallback && typeof resultCallback === 'object') resultCallback = resultCallback.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_contactPairTest_3(self, colObjA, colObjB, resultCallback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['contactTest'] = btSoftRigidDynamicsWorld.prototype.contactTest = function(colObj, resultCallback) {
  var self = this.ptr;
  if (colObj && typeof colObj === 'object') colObj = colObj.ptr;
  if (resultCallback && typeof resultCallback === 'object') resultCallback = resultCallback.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_contactTest_2(self, colObj, resultCallback);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['setForceUpdateAllAabbs'] = btSoftRigidDynamicsWorld.prototype.setForceUpdateAllAabbs = function(forceUpdateAllAabbs) {
  var self = this.ptr;
  if (forceUpdateAllAabbs && typeof forceUpdateAllAabbs === 'object') forceUpdateAllAabbs = forceUpdateAllAabbs.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_setForceUpdateAllAabbs_1(self, forceUpdateAllAabbs);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['updateSingleAabb'] = btSoftRigidDynamicsWorld.prototype.updateSingleAabb = function(colObj) {
  var self = this.ptr;
  if (colObj && typeof colObj === 'object') colObj = colObj.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_updateSingleAabb_1(self, colObj);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['setDebugDrawer'] = btSoftRigidDynamicsWorld.prototype.setDebugDrawer = function(debugDrawer) {
  var self = this.ptr;
  if (debugDrawer && typeof debugDrawer === 'object') debugDrawer = debugDrawer.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_setDebugDrawer_1(self, debugDrawer);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['getDebugDrawer'] = btSoftRigidDynamicsWorld.prototype.getDebugDrawer = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getDebugDrawer_0(self), btIDebugDraw);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['debugDrawWorld'] = btSoftRigidDynamicsWorld.prototype.debugDrawWorld = function() {
  var self = this.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_debugDrawWorld_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['debugDrawObject'] = btSoftRigidDynamicsWorld.prototype.debugDrawObject = function(worldTransform, shape, color) {
  var self = this.ptr;
  if (worldTransform && typeof worldTransform === 'object') worldTransform = worldTransform.ptr;
  if (shape && typeof shape === 'object') shape = shape.ptr;
  if (color && typeof color === 'object') color = color.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_debugDrawObject_3(self, worldTransform, shape, color);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['setGravity'] = btSoftRigidDynamicsWorld.prototype.setGravity = function(gravity) {
  var self = this.ptr;
  if (gravity && typeof gravity === 'object') gravity = gravity.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_setGravity_1(self, gravity);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['getGravity'] = btSoftRigidDynamicsWorld.prototype.getGravity = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getGravity_0(self), btVector3);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['addRigidBody'] = btSoftRigidDynamicsWorld.prototype.addRigidBody = function(body, group, mask) {
  var self = this.ptr;
  if (body && typeof body === 'object') body = body.ptr;
  if (group && typeof group === 'object') group = group.ptr;
  if (mask && typeof mask === 'object') mask = mask.ptr;
  if (group === undefined) { _emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_1(self, body); return }
  if (mask === undefined) { _emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_2(self, body, group); return }
  _emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_3(self, body, group, mask);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['removeRigidBody'] = btSoftRigidDynamicsWorld.prototype.removeRigidBody = function(body) {
  var self = this.ptr;
  if (body && typeof body === 'object') body = body.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_removeRigidBody_1(self, body);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['addConstraint'] = btSoftRigidDynamicsWorld.prototype.addConstraint = function(constraint, disableCollisionsBetweenLinkedBodies) {
  var self = this.ptr;
  if (constraint && typeof constraint === 'object') constraint = constraint.ptr;
  if (disableCollisionsBetweenLinkedBodies && typeof disableCollisionsBetweenLinkedBodies === 'object') disableCollisionsBetweenLinkedBodies = disableCollisionsBetweenLinkedBodies.ptr;
  if (disableCollisionsBetweenLinkedBodies === undefined) { _emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_1(self, constraint); return }
  _emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_2(self, constraint, disableCollisionsBetweenLinkedBodies);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['removeConstraint'] = btSoftRigidDynamicsWorld.prototype.removeConstraint = function(constraint) {
  var self = this.ptr;
  if (constraint && typeof constraint === 'object') constraint = constraint.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_removeConstraint_1(self, constraint);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['stepSimulation'] = btSoftRigidDynamicsWorld.prototype.stepSimulation = function(timeStep, maxSubSteps, fixedTimeStep) {
  var self = this.ptr;
  if (timeStep && typeof timeStep === 'object') timeStep = timeStep.ptr;
  if (maxSubSteps && typeof maxSubSteps === 'object') maxSubSteps = maxSubSteps.ptr;
  if (fixedTimeStep && typeof fixedTimeStep === 'object') fixedTimeStep = fixedTimeStep.ptr;
  if (maxSubSteps === undefined) { return _emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_1(self, timeStep) }
  if (fixedTimeStep === undefined) { return _emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_2(self, timeStep, maxSubSteps) }
  return _emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_3(self, timeStep, maxSubSteps, fixedTimeStep);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['setContactAddedCallback'] = btSoftRigidDynamicsWorld.prototype.setContactAddedCallback = function(funcpointer) {
  var self = this.ptr;
  if (funcpointer && typeof funcpointer === 'object') funcpointer = funcpointer.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_setContactAddedCallback_1(self, funcpointer);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['setContactProcessedCallback'] = btSoftRigidDynamicsWorld.prototype.setContactProcessedCallback = function(funcpointer) {
  var self = this.ptr;
  if (funcpointer && typeof funcpointer === 'object') funcpointer = funcpointer.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_setContactProcessedCallback_1(self, funcpointer);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['setContactDestroyedCallback'] = btSoftRigidDynamicsWorld.prototype.setContactDestroyedCallback = function(funcpointer) {
  var self = this.ptr;
  if (funcpointer && typeof funcpointer === 'object') funcpointer = funcpointer.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_setContactDestroyedCallback_1(self, funcpointer);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['addAction'] = btSoftRigidDynamicsWorld.prototype.addAction = function(action) {
  var self = this.ptr;
  if (action && typeof action === 'object') action = action.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_addAction_1(self, action);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['removeAction'] = btSoftRigidDynamicsWorld.prototype.removeAction = function(action) {
  var self = this.ptr;
  if (action && typeof action === 'object') action = action.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld_removeAction_1(self, action);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['getSolverInfo'] = btSoftRigidDynamicsWorld.prototype.getSolverInfo = function() {
  var self = this.ptr;
  return wrapPointer(_emscripten_bind_btSoftRigidDynamicsWorld_getSolverInfo_0(self), btContactSolverInfo);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['setInternalTickCallback'] = btSoftRigidDynamicsWorld.prototype.setInternalTickCallback = function(cb, worldUserInfo, isPreTick) {
  var self = this.ptr;
  if (cb && typeof cb === 'object') cb = cb.ptr;
  if (worldUserInfo && typeof worldUserInfo === 'object') worldUserInfo = worldUserInfo.ptr;
  if (isPreTick && typeof isPreTick === 'object') isPreTick = isPreTick.ptr;
  if (worldUserInfo === undefined) { _emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_1(self, cb); return }
  if (isPreTick === undefined) { _emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_2(self, cb, worldUserInfo); return }
  _emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_3(self, cb, worldUserInfo, isPreTick);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftRigidDynamicsWorld.prototype['__destroy__'] = btSoftRigidDynamicsWorld.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btSoftRigidDynamicsWorld___destroy___0(self);
};

// Interface: btSoftBodyHelpers

/** @suppress {undefinedVars, duplicate} @this{Object} */
function btSoftBodyHelpers() {
  this.ptr = _emscripten_bind_btSoftBodyHelpers_btSoftBodyHelpers_0();
  getCache(btSoftBodyHelpers)[this.ptr] = this;
};

btSoftBodyHelpers.prototype = Object.create(WrapperObject.prototype);
btSoftBodyHelpers.prototype.constructor = btSoftBodyHelpers;
btSoftBodyHelpers.prototype.__class__ = btSoftBodyHelpers;
btSoftBodyHelpers.__cache__ = {};
Module['btSoftBodyHelpers'] = btSoftBodyHelpers;
/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyHelpers.prototype['CreateRope'] = btSoftBodyHelpers.prototype.CreateRope = function(worldInfo, from, to, res, fixeds) {
  var self = this.ptr;
  if (worldInfo && typeof worldInfo === 'object') worldInfo = worldInfo.ptr;
  if (from && typeof from === 'object') from = from.ptr;
  if (to && typeof to === 'object') to = to.ptr;
  if (res && typeof res === 'object') res = res.ptr;
  if (fixeds && typeof fixeds === 'object') fixeds = fixeds.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyHelpers_CreateRope_5(self, worldInfo, from, to, res, fixeds), btSoftBody);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyHelpers.prototype['CreatePatch'] = btSoftBodyHelpers.prototype.CreatePatch = function(worldInfo, corner00, corner10, corner01, corner11, resx, resy, fixeds, gendiags) {
  var self = this.ptr;
  if (worldInfo && typeof worldInfo === 'object') worldInfo = worldInfo.ptr;
  if (corner00 && typeof corner00 === 'object') corner00 = corner00.ptr;
  if (corner10 && typeof corner10 === 'object') corner10 = corner10.ptr;
  if (corner01 && typeof corner01 === 'object') corner01 = corner01.ptr;
  if (corner11 && typeof corner11 === 'object') corner11 = corner11.ptr;
  if (resx && typeof resx === 'object') resx = resx.ptr;
  if (resy && typeof resy === 'object') resy = resy.ptr;
  if (fixeds && typeof fixeds === 'object') fixeds = fixeds.ptr;
  if (gendiags && typeof gendiags === 'object') gendiags = gendiags.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyHelpers_CreatePatch_9(self, worldInfo, corner00, corner10, corner01, corner11, resx, resy, fixeds, gendiags), btSoftBody);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyHelpers.prototype['CreatePatchUV'] = btSoftBodyHelpers.prototype.CreatePatchUV = function(worldInfo, corner00, corner10, corner01, corner11, resx, resy, fixeds, gendiags, tex_coords) {
  var self = this.ptr;
  ensureCache.prepare();
  if (worldInfo && typeof worldInfo === 'object') worldInfo = worldInfo.ptr;
  if (corner00 && typeof corner00 === 'object') corner00 = corner00.ptr;
  if (corner10 && typeof corner10 === 'object') corner10 = corner10.ptr;
  if (corner01 && typeof corner01 === 'object') corner01 = corner01.ptr;
  if (corner11 && typeof corner11 === 'object') corner11 = corner11.ptr;
  if (resx && typeof resx === 'object') resx = resx.ptr;
  if (resy && typeof resy === 'object') resy = resy.ptr;
  if (fixeds && typeof fixeds === 'object') fixeds = fixeds.ptr;
  if (gendiags && typeof gendiags === 'object') gendiags = gendiags.ptr;
  if (typeof tex_coords == 'object') { tex_coords = ensureFloat32(tex_coords); }
  return wrapPointer(_emscripten_bind_btSoftBodyHelpers_CreatePatchUV_10(self, worldInfo, corner00, corner10, corner01, corner11, resx, resy, fixeds, gendiags, tex_coords), btSoftBody);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyHelpers.prototype['CreateEllipsoid'] = btSoftBodyHelpers.prototype.CreateEllipsoid = function(worldInfo, center, radius, res) {
  var self = this.ptr;
  if (worldInfo && typeof worldInfo === 'object') worldInfo = worldInfo.ptr;
  if (center && typeof center === 'object') center = center.ptr;
  if (radius && typeof radius === 'object') radius = radius.ptr;
  if (res && typeof res === 'object') res = res.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyHelpers_CreateEllipsoid_4(self, worldInfo, center, radius, res), btSoftBody);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyHelpers.prototype['CreateFromTriMesh'] = btSoftBodyHelpers.prototype.CreateFromTriMesh = function(worldInfo, vertices, triangles, ntriangles, randomizeConstraints) {
  var self = this.ptr;
  ensureCache.prepare();
  if (worldInfo && typeof worldInfo === 'object') worldInfo = worldInfo.ptr;
  if (typeof vertices == 'object') { vertices = ensureFloat32(vertices); }
  if (typeof triangles == 'object') { triangles = ensureInt32(triangles); }
  if (ntriangles && typeof ntriangles === 'object') ntriangles = ntriangles.ptr;
  if (randomizeConstraints && typeof randomizeConstraints === 'object') randomizeConstraints = randomizeConstraints.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyHelpers_CreateFromTriMesh_5(self, worldInfo, vertices, triangles, ntriangles, randomizeConstraints), btSoftBody);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyHelpers.prototype['CreateFromConvexHull'] = btSoftBodyHelpers.prototype.CreateFromConvexHull = function(worldInfo, vertices, nvertices, randomizeConstraints) {
  var self = this.ptr;
  if (worldInfo && typeof worldInfo === 'object') worldInfo = worldInfo.ptr;
  if (vertices && typeof vertices === 'object') vertices = vertices.ptr;
  if (nvertices && typeof nvertices === 'object') nvertices = nvertices.ptr;
  if (randomizeConstraints && typeof randomizeConstraints === 'object') randomizeConstraints = randomizeConstraints.ptr;
  return wrapPointer(_emscripten_bind_btSoftBodyHelpers_CreateFromConvexHull_4(self, worldInfo, vertices, nvertices, randomizeConstraints), btSoftBody);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
btSoftBodyHelpers.prototype['__destroy__'] = btSoftBodyHelpers.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_btSoftBodyHelpers___destroy___0(self);
};

// Interface: Vec3Long

/** @suppress {undefinedVars, duplicate} @this{Object} */
function Vec3Long(x, y, z) {
  if (x && typeof x === 'object') x = x.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  if (z && typeof z === 'object') z = z.ptr;
  this.ptr = _emscripten_bind_Vec3Long_Vec3Long_3(x, y, z);
  getCache(Vec3Long)[this.ptr] = this;
};

Vec3Long.prototype = Object.create(WrapperObject.prototype);
Vec3Long.prototype.constructor = Vec3Long;
Vec3Long.prototype.__class__ = Vec3Long;
Vec3Long.__cache__ = {};
Module['Vec3Long'] = Vec3Long;
/** @suppress {undefinedVars, duplicate} @this{Object} */
Vec3Long.prototype['X'] = Vec3Long.prototype.X = function() {
  var self = this.ptr;
  return _emscripten_bind_Vec3Long_X_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Vec3Long.prototype['Y'] = Vec3Long.prototype.Y = function() {
  var self = this.ptr;
  return _emscripten_bind_Vec3Long_Y_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Vec3Long.prototype['Z'] = Vec3Long.prototype.Z = function() {
  var self = this.ptr;
  return _emscripten_bind_Vec3Long_Z_0(self);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
Vec3Long.prototype['__destroy__'] = Vec3Long.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_Vec3Long___destroy___0(self);
};

// Interface: Vec3Real

/** @suppress {undefinedVars, duplicate} @this{Object} */
function Vec3Real(x, y, z) {
  if (x && typeof x === 'object') x = x.ptr;
  if (y && typeof y === 'object') y = y.ptr;
  if (z && typeof z === 'object') z = z.ptr;
  this.ptr = _emscripten_bind_Vec3Real_Vec3Real_3(x, y, z);
  getCache(Vec3Real)[this.ptr] = this;
};

Vec3Real.prototype = Object.create(WrapperObject.prototype);
Vec3Real.prototype.constructor = Vec3Real;
Vec3Real.prototype.__class__ = Vec3Real;
Vec3Real.__cache__ = {};
Module['Vec3Real'] = Vec3Real;
/** @suppress {undefinedVars, duplicate} @this{Object} */
Vec3Real.prototype['X'] = Vec3Real.prototype.X = function() {
  var self = this.ptr;
  return _emscripten_bind_Vec3Real_X_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Vec3Real.prototype['Y'] = Vec3Real.prototype.Y = function() {
  var self = this.ptr;
  return _emscripten_bind_Vec3Real_Y_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Vec3Real.prototype['Z'] = Vec3Real.prototype.Z = function() {
  var self = this.ptr;
  return _emscripten_bind_Vec3Real_Z_0(self);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
Vec3Real.prototype['__destroy__'] = Vec3Real.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_Vec3Real___destroy___0(self);
};

// Interface: HACD

/** @suppress {undefinedVars, duplicate} @this{Object} */
function HACD() {
  this.ptr = _emscripten_bind_HACD_HACD_0();
  getCache(HACD)[this.ptr] = this;
};

HACD.prototype = Object.create(WrapperObject.prototype);
HACD.prototype.constructor = HACD;
HACD.prototype.__class__ = HACD;
HACD.__cache__ = {};
Module['HACD'] = HACD;
/** @suppress {undefinedVars, duplicate} @this{Object} */
HACD.prototype['SetCompacityWeight'] = HACD.prototype.SetCompacityWeight = function(alpha) {
  var self = this.ptr;
  if (alpha && typeof alpha === 'object') alpha = alpha.ptr;
  _emscripten_bind_HACD_SetCompacityWeight_1(self, alpha);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
HACD.prototype['SetVolumeWeight'] = HACD.prototype.SetVolumeWeight = function(beta) {
  var self = this.ptr;
  if (beta && typeof beta === 'object') beta = beta.ptr;
  _emscripten_bind_HACD_SetVolumeWeight_1(self, beta);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
HACD.prototype['SetConcavity'] = HACD.prototype.SetConcavity = function(concavity) {
  var self = this.ptr;
  if (concavity && typeof concavity === 'object') concavity = concavity.ptr;
  _emscripten_bind_HACD_SetConcavity_1(self, concavity);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
HACD.prototype['SetNClusters'] = HACD.prototype.SetNClusters = function(nClusters) {
  var self = this.ptr;
  if (nClusters && typeof nClusters === 'object') nClusters = nClusters.ptr;
  _emscripten_bind_HACD_SetNClusters_1(self, nClusters);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
HACD.prototype['SetNVerticesPerCH'] = HACD.prototype.SetNVerticesPerCH = function(nVerticesPerCH) {
  var self = this.ptr;
  if (nVerticesPerCH && typeof nVerticesPerCH === 'object') nVerticesPerCH = nVerticesPerCH.ptr;
  _emscripten_bind_HACD_SetNVerticesPerCH_1(self, nVerticesPerCH);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
HACD.prototype['SetPoints'] = HACD.prototype.SetPoints = function(points) {
  var self = this.ptr;
  if (points && typeof points === 'object') points = points.ptr;
  _emscripten_bind_HACD_SetPoints_1(self, points);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
HACD.prototype['SetNPoints'] = HACD.prototype.SetNPoints = function(nPoints) {
  var self = this.ptr;
  if (nPoints && typeof nPoints === 'object') nPoints = nPoints.ptr;
  _emscripten_bind_HACD_SetNPoints_1(self, nPoints);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
HACD.prototype['SetTriangles'] = HACD.prototype.SetTriangles = function(triangles) {
  var self = this.ptr;
  if (triangles && typeof triangles === 'object') triangles = triangles.ptr;
  _emscripten_bind_HACD_SetTriangles_1(self, triangles);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
HACD.prototype['SetNTriangles'] = HACD.prototype.SetNTriangles = function(nTriangles) {
  var self = this.ptr;
  if (nTriangles && typeof nTriangles === 'object') nTriangles = nTriangles.ptr;
  _emscripten_bind_HACD_SetNTriangles_1(self, nTriangles);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
HACD.prototype['Compute'] = HACD.prototype.Compute = function() {
  var self = this.ptr;
  _emscripten_bind_HACD_Compute_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
HACD.prototype['GetNClusters'] = HACD.prototype.GetNClusters = function() {
  var self = this.ptr;
  return _emscripten_bind_HACD_GetNClusters_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
HACD.prototype['GetNPointsCH'] = HACD.prototype.GetNPointsCH = function(c) {
  var self = this.ptr;
  if (c && typeof c === 'object') c = c.ptr;
  return _emscripten_bind_HACD_GetNPointsCH_1(self, c);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
HACD.prototype['GetNTrianglesCH'] = HACD.prototype.GetNTrianglesCH = function(c) {
  var self = this.ptr;
  if (c && typeof c === 'object') c = c.ptr;
  return _emscripten_bind_HACD_GetNTrianglesCH_1(self, c);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
HACD.prototype['GetCH'] = HACD.prototype.GetCH = function(c, points, triangles) {
  var self = this.ptr;
  if (c && typeof c === 'object') c = c.ptr;
  if (points && typeof points === 'object') points = points.ptr;
  if (triangles && typeof triangles === 'object') triangles = triangles.ptr;
  return _emscripten_bind_HACD_GetCH_3(self, c, points, triangles);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
HACD.prototype['__destroy__'] = HACD.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_HACD___destroy___0(self);
};

// Interface: VHACD

/** @suppress {undefinedVars, duplicate} @this{Object} */
function VHACD() {
  this.ptr = _emscripten_bind_VHACD_VHACD_0();
  getCache(VHACD)[this.ptr] = this;
};

VHACD.prototype = Object.create(WrapperObject.prototype);
VHACD.prototype.constructor = VHACD;
VHACD.prototype.__class__ = VHACD;
VHACD.__cache__ = {};
Module['VHACD'] = VHACD;
/** @suppress {undefinedVars, duplicate} @this{Object} */
VHACD.prototype['Compute'] = VHACD.prototype.Compute = function(points, stridePoints, nPoints, triangles, strideTriangles, nTriangles, params) {
  var self = this.ptr;
  ensureCache.prepare();
  if (typeof points == 'object') { points = ensureFloat64(points); }
  if (stridePoints && typeof stridePoints === 'object') stridePoints = stridePoints.ptr;
  if (nPoints && typeof nPoints === 'object') nPoints = nPoints.ptr;
  if (typeof triangles == 'object') { triangles = ensureInt32(triangles); }
  if (strideTriangles && typeof strideTriangles === 'object') strideTriangles = strideTriangles.ptr;
  if (nTriangles && typeof nTriangles === 'object') nTriangles = nTriangles.ptr;
  if (params && typeof params === 'object') params = params.ptr;
  return !!(_emscripten_bind_VHACD_Compute_7(self, points, stridePoints, nPoints, triangles, strideTriangles, nTriangles, params));
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
VHACD.prototype['GetNConvexHulls'] = VHACD.prototype.GetNConvexHulls = function() {
  var self = this.ptr;
  return _emscripten_bind_VHACD_GetNConvexHulls_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
VHACD.prototype['GetConvexHull'] = VHACD.prototype.GetConvexHull = function(index, ch) {
  var self = this.ptr;
  if (index && typeof index === 'object') index = index.ptr;
  if (ch && typeof ch === 'object') ch = ch.ptr;
  _emscripten_bind_VHACD_GetConvexHull_2(self, index, ch);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
VHACD.prototype['Cancel'] = VHACD.prototype.Cancel = function() {
  var self = this.ptr;
  _emscripten_bind_VHACD_Cancel_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
VHACD.prototype['Clean'] = VHACD.prototype.Clean = function() {
  var self = this.ptr;
  _emscripten_bind_VHACD_Clean_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
VHACD.prototype['Release'] = VHACD.prototype.Release = function() {
  var self = this.ptr;
  _emscripten_bind_VHACD_Release_0(self);
};


/** @suppress {undefinedVars, duplicate} @this{Object} */
VHACD.prototype['__destroy__'] = VHACD.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_VHACD___destroy___0(self);
};

// Interface: Parameters

/** @suppress {undefinedVars, duplicate} @this{Object} */
function Parameters() {
  this.ptr = _emscripten_bind_Parameters_Parameters_0();
  getCache(Parameters)[this.ptr] = this;
};

Parameters.prototype = Object.create(WrapperObject.prototype);
Parameters.prototype.constructor = Parameters;
Parameters.prototype.__class__ = Parameters;
Parameters.__cache__ = {};
Module['Parameters'] = Parameters;
/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['get_m_concavity'] = Parameters.prototype.get_m_concavity = function() {
  var self = this.ptr;
  return _emscripten_bind_Parameters_get_m_concavity_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['set_m_concavity'] = Parameters.prototype.set_m_concavity = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Parameters_set_m_concavity_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Parameters.prototype, 'm_concavity', { get: Parameters.prototype.get_m_concavity, set: Parameters.prototype.set_m_concavity });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['get_m_alpha'] = Parameters.prototype.get_m_alpha = function() {
  var self = this.ptr;
  return _emscripten_bind_Parameters_get_m_alpha_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['set_m_alpha'] = Parameters.prototype.set_m_alpha = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Parameters_set_m_alpha_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Parameters.prototype, 'm_alpha', { get: Parameters.prototype.get_m_alpha, set: Parameters.prototype.set_m_alpha });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['get_m_beta'] = Parameters.prototype.get_m_beta = function() {
  var self = this.ptr;
  return _emscripten_bind_Parameters_get_m_beta_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['set_m_beta'] = Parameters.prototype.set_m_beta = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Parameters_set_m_beta_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Parameters.prototype, 'm_beta', { get: Parameters.prototype.get_m_beta, set: Parameters.prototype.set_m_beta });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['get_m_gamma'] = Parameters.prototype.get_m_gamma = function() {
  var self = this.ptr;
  return _emscripten_bind_Parameters_get_m_gamma_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['set_m_gamma'] = Parameters.prototype.set_m_gamma = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Parameters_set_m_gamma_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Parameters.prototype, 'm_gamma', { get: Parameters.prototype.get_m_gamma, set: Parameters.prototype.set_m_gamma });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['get_m_minVolumePerCH'] = Parameters.prototype.get_m_minVolumePerCH = function() {
  var self = this.ptr;
  return _emscripten_bind_Parameters_get_m_minVolumePerCH_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['set_m_minVolumePerCH'] = Parameters.prototype.set_m_minVolumePerCH = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Parameters_set_m_minVolumePerCH_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Parameters.prototype, 'm_minVolumePerCH', { get: Parameters.prototype.get_m_minVolumePerCH, set: Parameters.prototype.set_m_minVolumePerCH });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['get_m_resolution'] = Parameters.prototype.get_m_resolution = function() {
  var self = this.ptr;
  return _emscripten_bind_Parameters_get_m_resolution_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['set_m_resolution'] = Parameters.prototype.set_m_resolution = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Parameters_set_m_resolution_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Parameters.prototype, 'm_resolution', { get: Parameters.prototype.get_m_resolution, set: Parameters.prototype.set_m_resolution });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['get_m_maxNumVerticesPerCH'] = Parameters.prototype.get_m_maxNumVerticesPerCH = function() {
  var self = this.ptr;
  return _emscripten_bind_Parameters_get_m_maxNumVerticesPerCH_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['set_m_maxNumVerticesPerCH'] = Parameters.prototype.set_m_maxNumVerticesPerCH = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Parameters_set_m_maxNumVerticesPerCH_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Parameters.prototype, 'm_maxNumVerticesPerCH', { get: Parameters.prototype.get_m_maxNumVerticesPerCH, set: Parameters.prototype.set_m_maxNumVerticesPerCH });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['get_m_depth'] = Parameters.prototype.get_m_depth = function() {
  var self = this.ptr;
  return _emscripten_bind_Parameters_get_m_depth_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['set_m_depth'] = Parameters.prototype.set_m_depth = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Parameters_set_m_depth_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Parameters.prototype, 'm_depth', { get: Parameters.prototype.get_m_depth, set: Parameters.prototype.set_m_depth });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['get_m_planeDownsampling'] = Parameters.prototype.get_m_planeDownsampling = function() {
  var self = this.ptr;
  return _emscripten_bind_Parameters_get_m_planeDownsampling_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['set_m_planeDownsampling'] = Parameters.prototype.set_m_planeDownsampling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Parameters_set_m_planeDownsampling_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Parameters.prototype, 'm_planeDownsampling', { get: Parameters.prototype.get_m_planeDownsampling, set: Parameters.prototype.set_m_planeDownsampling });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['get_m_convexhullDownsampling'] = Parameters.prototype.get_m_convexhullDownsampling = function() {
  var self = this.ptr;
  return _emscripten_bind_Parameters_get_m_convexhullDownsampling_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['set_m_convexhullDownsampling'] = Parameters.prototype.set_m_convexhullDownsampling = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Parameters_set_m_convexhullDownsampling_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Parameters.prototype, 'm_convexhullDownsampling', { get: Parameters.prototype.get_m_convexhullDownsampling, set: Parameters.prototype.set_m_convexhullDownsampling });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['get_m_pca'] = Parameters.prototype.get_m_pca = function() {
  var self = this.ptr;
  return _emscripten_bind_Parameters_get_m_pca_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['set_m_pca'] = Parameters.prototype.set_m_pca = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Parameters_set_m_pca_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Parameters.prototype, 'm_pca', { get: Parameters.prototype.get_m_pca, set: Parameters.prototype.set_m_pca });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['get_m_mode'] = Parameters.prototype.get_m_mode = function() {
  var self = this.ptr;
  return _emscripten_bind_Parameters_get_m_mode_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['set_m_mode'] = Parameters.prototype.set_m_mode = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Parameters_set_m_mode_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Parameters.prototype, 'm_mode', { get: Parameters.prototype.get_m_mode, set: Parameters.prototype.set_m_mode });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['get_m_convexhullApproximation'] = Parameters.prototype.get_m_convexhullApproximation = function() {
  var self = this.ptr;
  return _emscripten_bind_Parameters_get_m_convexhullApproximation_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['set_m_convexhullApproximation'] = Parameters.prototype.set_m_convexhullApproximation = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Parameters_set_m_convexhullApproximation_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Parameters.prototype, 'm_convexhullApproximation', { get: Parameters.prototype.get_m_convexhullApproximation, set: Parameters.prototype.set_m_convexhullApproximation });
/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['get_m_oclAcceleration'] = Parameters.prototype.get_m_oclAcceleration = function() {
  var self = this.ptr;
  return _emscripten_bind_Parameters_get_m_oclAcceleration_0(self);
};

/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['set_m_oclAcceleration'] = Parameters.prototype.set_m_oclAcceleration = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_Parameters_set_m_oclAcceleration_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(Parameters.prototype, 'm_oclAcceleration', { get: Parameters.prototype.get_m_oclAcceleration, set: Parameters.prototype.set_m_oclAcceleration });

/** @suppress {undefinedVars, duplicate} @this{Object} */
Parameters.prototype['__destroy__'] = Parameters.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_Parameters___destroy___0(self);
};

// Interface: ConvexHull

/** @suppress {undefinedVars, duplicate} @this{Object} */
function ConvexHull() {
  this.ptr = _emscripten_bind_ConvexHull_ConvexHull_0();
  getCache(ConvexHull)[this.ptr] = this;
};

ConvexHull.prototype = Object.create(WrapperObject.prototype);
ConvexHull.prototype.constructor = ConvexHull;
ConvexHull.prototype.__class__ = ConvexHull;
ConvexHull.__cache__ = {};
Module['ConvexHull'] = ConvexHull;
/** @suppress {undefinedVars, duplicate} @this{Object} */
ConvexHull.prototype['get_m_points'] = ConvexHull.prototype.get_m_points = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return _emscripten_bind_ConvexHull_get_m_points_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ConvexHull.prototype, 'm_points', { get: ConvexHull.prototype.get_m_points });
/** @suppress {undefinedVars, duplicate} @this{Object} */
ConvexHull.prototype['get_m_triangles'] = ConvexHull.prototype.get_m_triangles = function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  return _emscripten_bind_ConvexHull_get_m_triangles_1(self, arg0);
};

/** @suppress {checkTypes} */
Object.defineProperty(ConvexHull.prototype, 'm_triangles', { get: ConvexHull.prototype.get_m_triangles });
/** @suppress {undefinedVars, duplicate} @this{Object} */
ConvexHull.prototype['get_m_nPoints'] = ConvexHull.prototype.get_m_nPoints = function() {
  var self = this.ptr;
  return _emscripten_bind_ConvexHull_get_m_nPoints_0(self);
};

/** @suppress {checkTypes} */
Object.defineProperty(ConvexHull.prototype, 'm_nPoints', { get: ConvexHull.prototype.get_m_nPoints });
/** @suppress {undefinedVars, duplicate} @this{Object} */
ConvexHull.prototype['get_m_nTriangles'] = ConvexHull.prototype.get_m_nTriangles = function() {
  var self = this.ptr;
  return _emscripten_bind_ConvexHull_get_m_nTriangles_0(self);
};

/** @suppress {checkTypes} */
Object.defineProperty(ConvexHull.prototype, 'm_nTriangles', { get: ConvexHull.prototype.get_m_nTriangles });

/** @suppress {undefinedVars, duplicate} @this{Object} */
ConvexHull.prototype['__destroy__'] = ConvexHull.prototype.__destroy__ = function() {
  var self = this.ptr;
  _emscripten_bind_ConvexHull___destroy___0(self);
};

(function() {
  function setupEnums() {
    
// $PHY_ScalarType

    Module['PHY_FLOAT'] = _emscripten_enum_PHY_ScalarType_PHY_FLOAT();

    Module['PHY_DOUBLE'] = _emscripten_enum_PHY_ScalarType_PHY_DOUBLE();

    Module['PHY_INTEGER'] = _emscripten_enum_PHY_ScalarType_PHY_INTEGER();

    Module['PHY_SHORT'] = _emscripten_enum_PHY_ScalarType_PHY_SHORT();

    Module['PHY_FIXEDPOINT88'] = _emscripten_enum_PHY_ScalarType_PHY_FIXEDPOINT88();

    Module['PHY_UCHAR'] = _emscripten_enum_PHY_ScalarType_PHY_UCHAR();

    
// $eGIMPACT_SHAPE_TYPE

    Module['CONST_GIMPACT_COMPOUND_SHAPE'] = _emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_COMPOUND_SHAPE();

    Module['CONST_GIMPACT_TRIMESH_SHAPE_PART'] = _emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_TRIMESH_SHAPE_PART();

    Module['CONST_GIMPACT_TRIMESH_SHAPE'] = _emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_TRIMESH_SHAPE();

    
// $btConstraintParams

    Module['BT_CONSTRAINT_ERP'] = _emscripten_enum_btConstraintParams_BT_CONSTRAINT_ERP();

    Module['BT_CONSTRAINT_STOP_ERP'] = _emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_ERP();

    Module['BT_CONSTRAINT_CFM'] = _emscripten_enum_btConstraintParams_BT_CONSTRAINT_CFM();

    Module['BT_CONSTRAINT_STOP_CFM'] = _emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_CFM();

  }
  if (runtimeInitialized) setupEnums();
  else addOnInit(setupEnums);
})();

Module["CONTACT_ADDED_CALLBACK_SIGNATURE"] = "iiiiiiii";
Module["CONTACT_DESTROYED_CALLBACK_SIGNATURE"] = "ii";
Module["CONTACT_PROCESSED_CALLBACK_SIGNATURE"] = "iiii";
Module["INTERNAL_TICK_CALLBACK_SIGNATURE"] = "vif";

// Reassign global Ammo to the loaded module:
//globalThis["Ammo"] = Module;
