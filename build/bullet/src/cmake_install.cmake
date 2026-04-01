# Install script for directory: /Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/bullet/src

# Set the install prefix
if(NOT DEFINED CMAKE_INSTALL_PREFIX)
  set(CMAKE_INSTALL_PREFIX "/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot")
endif()
string(REGEX REPLACE "/$" "" CMAKE_INSTALL_PREFIX "${CMAKE_INSTALL_PREFIX}")

# Set the install configuration name.
if(NOT DEFINED CMAKE_INSTALL_CONFIG_NAME)
  if(BUILD_TYPE)
    string(REGEX REPLACE "^[^A-Za-z0-9_]+" ""
           CMAKE_INSTALL_CONFIG_NAME "${BUILD_TYPE}")
  else()
    set(CMAKE_INSTALL_CONFIG_NAME "Release")
  endif()
  message(STATUS "Install configuration: \"${CMAKE_INSTALL_CONFIG_NAME}\"")
endif()

# Set the component getting installed.
if(NOT CMAKE_INSTALL_COMPONENT)
  if(COMPONENT)
    message(STATUS "Install component: \"${COMPONENT}\"")
    set(CMAKE_INSTALL_COMPONENT "${COMPONENT}")
  else()
    set(CMAKE_INSTALL_COMPONENT)
  endif()
endif()

# Is this installation the result of a crosscompile?
if(NOT DEFINED CMAKE_CROSSCOMPILING)
  set(CMAKE_CROSSCOMPILING "TRUE")
endif()

# Set path to fallback-tool for dependency-resolution.
if(NOT DEFINED CMAKE_OBJDUMP)
  set(CMAKE_OBJDUMP "/opt/homebrew/opt/llvm/bin/llvm-objdump")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
   "/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet/btBulletCollisionCommon.h;/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet/btBulletDynamicsCommon.h;/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet/Bullet-C-Api.h")
  if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
  if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
  file(INSTALL DESTINATION "/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet" TYPE FILE FILES
    "/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/bullet/src/btBulletCollisionCommon.h"
    "/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/bullet/src/btBulletDynamicsCommon.h"
    "/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/bullet/src/Bullet-C-Api.h"
    )
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
   "/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet/vectormath/vmInclude.h")
  if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
  if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
  file(INSTALL DESTINATION "/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet/vectormath" TYPE FILE FILES "/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/bullet/src/vectormath/vmInclude.h")
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
   "/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet/vectormath/scalar/boolInVec.h;/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet/vectormath/scalar/floatInVec.h;/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet/vectormath/scalar/mat_aos.h;/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet/vectormath/scalar/quat_aos.h;/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet/vectormath/scalar/vec_aos.h;/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet/vectormath/scalar/vectormath_aos.h")
  if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
  if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
  file(INSTALL DESTINATION "/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet/vectormath/scalar" TYPE FILE FILES
    "/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/bullet/src/vectormath/scalar/boolInVec.h"
    "/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/bullet/src/vectormath/scalar/floatInVec.h"
    "/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/bullet/src/vectormath/scalar/mat_aos.h"
    "/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/bullet/src/vectormath/scalar/quat_aos.h"
    "/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/bullet/src/vectormath/scalar/vec_aos.h"
    "/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/bullet/src/vectormath/scalar/vectormath_aos.h"
    )
endif()

if(CMAKE_INSTALL_COMPONENT STREQUAL "Unspecified" OR NOT CMAKE_INSTALL_COMPONENT)
  list(APPEND CMAKE_ABSOLUTE_DESTINATION_FILES
   "/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet/vectormath/sse/boolInVec.h;/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet/vectormath/sse/floatInVec.h;/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet/vectormath/sse/mat_aos.h;/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet/vectormath/sse/quat_aos.h;/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet/vectormath/sse/vec_aos.h;/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet/vectormath/sse/vecidx_aos.h;/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet/vectormath/sse/vectormath_aos.h")
  if(CMAKE_WARN_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(WARNING "ABSOLUTE path INSTALL DESTINATION : ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
  if(CMAKE_ERROR_ON_ABSOLUTE_INSTALL_DESTINATION)
    message(FATAL_ERROR "ABSOLUTE path INSTALL DESTINATION forbidden (by caller): ${CMAKE_ABSOLUTE_DESTINATION_FILES}")
  endif()
  file(INSTALL DESTINATION "/Users/icer/source/hubs/emsdk/upstream/emscripten/cache/sysroot/include/bullet/vectormath/sse" TYPE FILE FILES
    "/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/bullet/src/vectormath/sse/boolInVec.h"
    "/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/bullet/src/vectormath/sse/floatInVec.h"
    "/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/bullet/src/vectormath/sse/mat_aos.h"
    "/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/bullet/src/vectormath/sse/quat_aos.h"
    "/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/bullet/src/vectormath/sse/vec_aos.h"
    "/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/bullet/src/vectormath/sse/vecidx_aos.h"
    "/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/bullet/src/vectormath/sse/vectormath_aos.h"
    )
endif()

if(NOT CMAKE_INSTALL_LOCAL_ONLY)
  # Include the install script for each subdirectory.
  include("/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/build/bullet/src/BulletSoftBody/cmake_install.cmake")
  include("/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/build/bullet/src/BulletCollision/cmake_install.cmake")
  include("/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/build/bullet/src/BulletDynamics/cmake_install.cmake")
  include("/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/build/bullet/src/LinearMath/cmake_install.cmake")

endif()

string(REPLACE ";" "\n" CMAKE_INSTALL_MANIFEST_CONTENT
       "${CMAKE_INSTALL_MANIFEST_FILES}")
if(CMAKE_INSTALL_LOCAL_ONLY)
  file(WRITE "/Users/icer/source/hubs/hubs-compose/services/hubs/packages/ammo.js/build/bullet/src/install_local_manifest.txt"
     "${CMAKE_INSTALL_MANIFEST_CONTENT}")
endif()
