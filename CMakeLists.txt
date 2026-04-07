cmake_minimum_required(VERSION 3.13 FATAL_ERROR)
set(CMAKE_POLICY_DEFAULT_CMP0077 NEW)

FIND_PACKAGE(Python3)
set(PYTHON ${Python3_EXECUTABLE} CACHE STRING "Python path")
set(EMSCRIPTEN_ROOT $ENV{EMSDK}/upstream/emscripten CACHE STRING "Emscripten path")
set(CMAKE_TOOLCHAIN_FILE ${EMSCRIPTEN_ROOT}/cmake/Modules/Platform/Emscripten.cmake)
set(WEBIDL_BINDER_SCRIPT ${EMSCRIPTEN_ROOT}/tools/webidl_binder.py)
set(AMMO_FRONT_MATTER_FILE ${CMAKE_CURRENT_SOURCE_DIR}/front-matter.mjs)
set(AMMO_HEADER_FILE ${CMAKE_CURRENT_SOURCE_DIR}/ammo.h)
set(AMMO_IDL_FILE ${CMAKE_CURRENT_SOURCE_DIR}/ammo.idl)
set(AMMO_ONLOAD_FILE ${CMAKE_CURRENT_SOURCE_DIR}/onload.mjs)
set(BULLET_SRC_DIR ${CMAKE_CURRENT_SOURCE_DIR}/bullet/src/)
set(BULLET_EXTRAS_DIR ${CMAKE_CURRENT_SOURCE_DIR}/bullet/Extras)
set(BUILD_EXTRAS ON)

set(BULLET_TARGETS BulletCollision BulletDynamics BulletSoftBody LinearMath HACD VHACD)
foreach(_TARGET ${BULLET_TARGETS})
  list(APPEND BULLET_LIBS $<TARGET_FILE:${_TARGET}>)
endforeach()

# Disable bullet graphical benchmarks
set(USE_GRAPHICAL_BENCHMARK OFF)

# Disable bullet GLUT
set(USE_GLUT OFF)

# Build Release by default
set(CMAKE_BUILD_TYPE Release CACHE STRING "Build Type")

# Default is 64*1024*1024 = 64MB
set(TOTAL_MEMORY 67108864 CACHE STRING "Total Memory")

# Enable for resizable heap, with some amount of slowness
set(ALLOW_MEMORY_GROWTH 0 CACHE STRING "Allow Memory Growth")

set(EMCC_ARGS
  --pre-js ${AMMO_FRONT_MATTER_FILE}
  #--llvm-lto 1
  --post-js glue.js
  --post-js ${AMMO_ONLOAD_FILE}
 # -O3
  -s ALLOW_MEMORY_GROWTH=${ALLOW_MEMORY_GROWTH}
  -s ALLOW_TABLE_GROWTH=1
  -s EXPORTED_FUNCTIONS=["_malloc","_free"]
  -s EXPORTED_RUNTIME_METHODS=["UTF8ToString","HEAP32","HEAPF32","HEAPF64"]
  -s EXPORT_NAME="Ammo"
  -s MODULARIZE=1
  -s EXPORT_ES6=1
  -s NO_EXIT_RUNTIME=1
  -s NO_FILESYSTEM=1
  -s ENVIRONMENT=web
  -s EXCEPTION_DEBUG=1
  -s SYSCALL_DEBUG=1
  -s LIBRARY_DEBUG=1
  -s TOTAL_MEMORY=${TOTAL_MEMORY})

if(${CLOSURE})
  # Ignore closure errors about the bullet Node class
  # (Node is a DOM thing too)
  LIST(APPEND EMCC_ARGS
    --closure 1
    -s IGNORE_CLOSURE_COMPILER_ERRORS=1)
else()
  LIST(APPEND EMCC_ARGS
    -s NO_DYNAMIC_EXECUTION=1)
endif()

set(EMCC_JS_ARGS ${EMCC_ARGS}
  #-s LEGACY_VM_SUPPORT=1
  -s SINGLE_FILE=1
  -s WASM=0)

set(EMCC_WASM_ARGS ${EMCC_ARGS}
  -s BINARYEN_IGNORE_IMPLICIT_TRAPS=1
#  -s WASM_ESM_INTEGRATION=1
  -s WASM=1)

set(EMCC_GLUE_ARGS
  -c
  -I${BULLET_SRC_DIR}
  -I${BULLET_EXTRAS_DIR}
  -include${AMMO_HEADER_FILE})


#######################################
project("ammo")
add_subdirectory(bullet EXCLUDE_FROM_ALL)


#######################################
add_custom_command(
  OUTPUT glue.cpp glue.js
  BYPRODUCTS parser.out WebIDLGrammar.pkl
  COMMAND ${PYTHON} ${WEBIDL_BINDER_SCRIPT} ${AMMO_IDL_FILE} glue
  DEPENDS ${AMMO_IDL_FILE}
  COMMENT "Generating ammo bindings"
  VERBATIM)
add_custom_command(
  OUTPUT glue.o
  COMMAND emcc glue.cpp ${EMCC_GLUE_ARGS} -g3 -gsource-map -o glue.o
  DEPENDS glue.cpp ${AMMO_HEADER_FILE}
  COMMENT "Building ammo bindings"
  VERBATIM)
add_custom_target(ammo-bindings ALL DEPENDS glue.js glue.o)


#######################################
add_custom_command(
  OUTPUT ammo.mjs
  COMMAND emcc glue.o ${BULLET_LIBS} ${EMCC_JS_ARGS} -g3 -gsource-map -o ammo.mjs --emit-tsd interface.d.ts
  DEPENDS ammo-bindings ${AMMO_FRONT_MATTER_FILE} ${AMMO_ONLOAD_FILE} ${BULLET_TARGETS}
  COMMENT "Building ammo javascript"
  VERBATIM)
add_custom_target(ammo-javascript ALL DEPENDS ammo.mjs)


#######################################
add_custom_command(
  OUTPUT ammo.wasm.mjs ammo.wasm
  COMMAND emcc glue.o ${BULLET_LIBS} ${EMCC_WASM_ARGS} -g3 -gsource-map -o ammo.wasm.mjs
  DEPENDS ammo-bindings ${AMMO_FRONT_MATTER_FILE} ${AMMO_ONLOAD_FILE} ${BULLET_TARGETS}
  COMMENT "Building ammo webassembly"
  VERBATIM)
add_custom_target(ammo-wasm ALL DEPENDS ammo.wasm.mjs ammo.wasm)
