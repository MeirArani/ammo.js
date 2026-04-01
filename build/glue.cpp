
#include <emscripten.h>
#include <stdlib.h>

EM_JS_DEPS(webidl_binder, "$intArrayFromString,$UTF8ToString,$alignMemory,$addOnInit");

class DebugDrawer : public btIDebugDraw {
public:
  void drawLine(const btVector3& from, const btVector3& to, const btVector3& color)  {
     (void) EM_ASM_INT({
      var self = Module['getCache'](Module['DebugDrawer'])[$0];
      if (!self.hasOwnProperty('drawLine')) throw 'a JSImplementation must implement all functions, you forgot DebugDrawer::drawLine.';
      self['drawLine']($1,$2,$3);
    }, (ptrdiff_t)this, &from, &to, &color);
  }
  void drawContactPoint(const btVector3& pointOnB, const btVector3& normalOnB, float distance, int lifeTime, const btVector3& color)  {
     (void) EM_ASM_INT({
      var self = Module['getCache'](Module['DebugDrawer'])[$0];
      if (!self.hasOwnProperty('drawContactPoint')) throw 'a JSImplementation must implement all functions, you forgot DebugDrawer::drawContactPoint.';
      self['drawContactPoint']($1,$2,$3,$4,$5);
    }, (ptrdiff_t)this, &pointOnB, &normalOnB, distance, lifeTime, &color);
  }
  void reportErrorWarning(const char* warningString)  {
     (void) EM_ASM_INT({
      var self = Module['getCache'](Module['DebugDrawer'])[$0];
      if (!self.hasOwnProperty('reportErrorWarning')) throw 'a JSImplementation must implement all functions, you forgot DebugDrawer::reportErrorWarning.';
      self['reportErrorWarning']($1);
    }, (ptrdiff_t)this, warningString);
  }
  void draw3dText(const btVector3& location, const char* textString)  {
     (void) EM_ASM_INT({
      var self = Module['getCache'](Module['DebugDrawer'])[$0];
      if (!self.hasOwnProperty('draw3dText')) throw 'a JSImplementation must implement all functions, you forgot DebugDrawer::draw3dText.';
      self['draw3dText']($1,$2);
    }, (ptrdiff_t)this, &location, textString);
  }
  void setDebugMode(int debugMode)  {
     (void) EM_ASM_INT({
      var self = Module['getCache'](Module['DebugDrawer'])[$0];
      if (!self.hasOwnProperty('setDebugMode')) throw 'a JSImplementation must implement all functions, you forgot DebugDrawer::setDebugMode.';
      self['setDebugMode']($1);
    }, (ptrdiff_t)this, debugMode);
  }
  int getDebugMode() const  {
    return  (int) EM_ASM_INT({
      var self = Module['getCache'](Module['DebugDrawer'])[$0];
      if (!self.hasOwnProperty('getDebugMode')) throw 'a JSImplementation must implement all functions, you forgot DebugDrawer::getDebugMode.';
      return self['getDebugMode']();
    }, (ptrdiff_t)this);
  }
  void __destroy__()  {
     (void) EM_ASM_INT({
      var self = Module['getCache'](Module['DebugDrawer'])[$0];
      if (!self.hasOwnProperty('__destroy__')) throw 'a JSImplementation must implement all functions, you forgot DebugDrawer::__destroy__.';
      self['__destroy__']();
    }, (ptrdiff_t)this);
  }
};

class MotionState : public btMotionState {
public:
  void getWorldTransform(btTransform& worldTrans) const  {
     (void) EM_ASM_INT({
      var self = Module['getCache'](Module['MotionState'])[$0];
      if (!self.hasOwnProperty('getWorldTransform')) throw 'a JSImplementation must implement all functions, you forgot MotionState::getWorldTransform.';
      self['getWorldTransform']($1);
    }, (ptrdiff_t)this, (ptrdiff_t)&worldTrans);
  }
  void setWorldTransform(const btTransform& worldTrans)  {
     (void) EM_ASM_INT({
      var self = Module['getCache'](Module['MotionState'])[$0];
      if (!self.hasOwnProperty('setWorldTransform')) throw 'a JSImplementation must implement all functions, you forgot MotionState::setWorldTransform.';
      self['setWorldTransform']($1);
    }, (ptrdiff_t)this, &worldTrans);
  }
  void __destroy__()  {
     (void) EM_ASM_INT({
      var self = Module['getCache'](Module['MotionState'])[$0];
      if (!self.hasOwnProperty('__destroy__')) throw 'a JSImplementation must implement all functions, you forgot MotionState::__destroy__.';
      self['__destroy__']();
    }, (ptrdiff_t)this);
  }
};

class ConcreteContactResultCallback : public btCollisionWorld::ContactResultCallback {
public:
  float addSingleResult(btManifoldPoint& cp, const btCollisionObjectWrapper* colObj0Wrap, int partId0, int index0, const btCollisionObjectWrapper* colObj1Wrap, int partId1, int index1)  {
    return  (float) EM_ASM_DOUBLE({
      var self = Module['getCache'](Module['ConcreteContactResultCallback'])[$0];
      if (!self.hasOwnProperty('addSingleResult')) throw 'a JSImplementation must implement all functions, you forgot ConcreteContactResultCallback::addSingleResult.';
      return self['addSingleResult']($1,$2,$3,$4,$5,$6,$7);
    }, (ptrdiff_t)this, (ptrdiff_t)&cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1);
  }
  void __destroy__()  {
     (void) EM_ASM_INT({
      var self = Module['getCache'](Module['ConcreteContactResultCallback'])[$0];
      if (!self.hasOwnProperty('__destroy__')) throw 'a JSImplementation must implement all functions, you forgot ConcreteContactResultCallback::__destroy__.';
      self['__destroy__']();
    }, (ptrdiff_t)this);
  }
};

extern "C" {

// Define custom allocator functions that we can force export using
// EMSCRIPTEN_KEEPALIVE.  This avoids all webidl users having to add
// malloc/free to -sEXPORTED_FUNCTIONS.
EMSCRIPTEN_KEEPALIVE void webidl_free(void* p) { free(p); }
EMSCRIPTEN_KEEPALIVE void* webidl_malloc(size_t len) { return malloc(len); }


// Interface: btCollisionShape


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionShape_setLocalScaling_1(btCollisionShape* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionShape_getLocalScaling_0(btCollisionShape* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionShape_calculateLocalInertia_2(btCollisionShape* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionShape_setMargin_1(btCollisionShape* self, float margin) {
  self->setMargin(margin);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionShape_getMargin_0(btCollisionShape* self) {
  return self->getMargin();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionShape___destroy___0(btCollisionShape* self) {
  delete self;
}

// Interface: btCollisionWorld


btDispatcher* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionWorld_getDispatcher_0(btCollisionWorld* self) {
  return self->getDispatcher();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionWorld_rayTest_3(btCollisionWorld* self, const btVector3* rayFromWorld, const btVector3* rayToWorld, btCollisionWorld::RayResultCallback* resultCallback) {
  self->rayTest(*rayFromWorld, *rayToWorld, *resultCallback);
}

btOverlappingPairCache* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionWorld_getPairCache_0(btCollisionWorld* self) {
  return self->getPairCache();
}

btDispatcherInfo* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionWorld_getDispatchInfo_0(btCollisionWorld* self) {
  return &self->getDispatchInfo();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionWorld_addCollisionObject_1(btCollisionWorld* self, btCollisionObject* collisionObject) {
  self->addCollisionObject(collisionObject);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionWorld_addCollisionObject_2(btCollisionWorld* self, btCollisionObject* collisionObject, short collisionFilterGroup) {
  self->addCollisionObject(collisionObject, collisionFilterGroup);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionWorld_addCollisionObject_3(btCollisionWorld* self, btCollisionObject* collisionObject, short collisionFilterGroup, short collisionFilterMask) {
  self->addCollisionObject(collisionObject, collisionFilterGroup, collisionFilterMask);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionWorld_removeCollisionObject_1(btCollisionWorld* self, btCollisionObject* collisionObject) {
  self->removeCollisionObject(collisionObject);
}

const btBroadphaseInterface* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionWorld_getBroadphase_0(btCollisionWorld* self) {
  return self->getBroadphase();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionWorld_convexSweepTest_5(btCollisionWorld* self, const btConvexShape* castShape, const btTransform* from, const btTransform* to, btCollisionWorld::ConvexResultCallback* resultCallback, float allowedCcdPenetration) {
  self->convexSweepTest(castShape, *from, *to, *resultCallback, allowedCcdPenetration);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionWorld_contactPairTest_3(btCollisionWorld* self, btCollisionObject* colObjA, btCollisionObject* colObjB, btCollisionWorld::ContactResultCallback* resultCallback) {
  self->contactPairTest(colObjA, colObjB, *resultCallback);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionWorld_contactTest_2(btCollisionWorld* self, btCollisionObject* colObj, btCollisionWorld::ContactResultCallback* resultCallback) {
  self->contactTest(colObj, *resultCallback);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionWorld_setForceUpdateAllAabbs_1(btCollisionWorld* self, bool forceUpdateAllAabbs) {
  self->setForceUpdateAllAabbs(forceUpdateAllAabbs);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionWorld_updateSingleAabb_1(btCollisionWorld* self, btCollisionObject* colObj) {
  self->updateSingleAabb(colObj);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionWorld_setDebugDrawer_1(btCollisionWorld* self, btIDebugDraw* debugDrawer) {
  self->setDebugDrawer(debugDrawer);
}

btIDebugDraw* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionWorld_getDebugDrawer_0(btCollisionWorld* self) {
  return self->getDebugDrawer();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionWorld_debugDrawWorld_0(btCollisionWorld* self) {
  self->debugDrawWorld();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionWorld_debugDrawObject_3(btCollisionWorld* self, const btTransform* worldTransform, const btCollisionShape* shape, const btVector3* color) {
  self->debugDrawObject(*worldTransform, shape, *color);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionWorld___destroy___0(btCollisionWorld* self) {
  delete self;
}

// Interface: btCollisionObject


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_setAnisotropicFriction_2(btCollisionObject* self, const btVector3* anisotropicFriction, int frictionMode) {
  self->setAnisotropicFriction(*anisotropicFriction, frictionMode);
}

btCollisionShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_getCollisionShape_0(btCollisionObject* self) {
  return self->getCollisionShape();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_setContactProcessingThreshold_1(btCollisionObject* self, float contactProcessingThreshold) {
  self->setContactProcessingThreshold(contactProcessingThreshold);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_setActivationState_1(btCollisionObject* self, int newState) {
  self->setActivationState(newState);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_forceActivationState_1(btCollisionObject* self, int newState) {
  self->forceActivationState(newState);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_activate_0(btCollisionObject* self) {
  self->activate();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_activate_1(btCollisionObject* self, bool forceActivation) {
  self->activate(forceActivation);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_isActive_0(btCollisionObject* self) {
  return self->isActive();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_isKinematicObject_0(btCollisionObject* self) {
  return self->isKinematicObject();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_isStaticObject_0(btCollisionObject* self) {
  return self->isStaticObject();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_isStaticOrKinematicObject_0(btCollisionObject* self) {
  return self->isStaticOrKinematicObject();
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_getRestitution_0(btCollisionObject* self) {
  return self->getRestitution();
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_getFriction_0(btCollisionObject* self) {
  return self->getFriction();
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_getRollingFriction_0(btCollisionObject* self) {
  return self->getRollingFriction();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_setRestitution_1(btCollisionObject* self, float rest) {
  self->setRestitution(rest);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_setFriction_1(btCollisionObject* self, float frict) {
  self->setFriction(frict);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_setRollingFriction_1(btCollisionObject* self, float frict) {
  self->setRollingFriction(frict);
}

btTransform* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_getWorldTransform_0(btCollisionObject* self) {
  return &self->getWorldTransform();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_getCollisionFlags_0(btCollisionObject* self) {
  return self->getCollisionFlags();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_setCollisionFlags_1(btCollisionObject* self, int flags) {
  self->setCollisionFlags(flags);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_setWorldTransform_1(btCollisionObject* self, const btTransform* worldTrans) {
  self->setWorldTransform(*worldTrans);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_setCollisionShape_1(btCollisionObject* self, btCollisionShape* collisionShape) {
  self->setCollisionShape(collisionShape);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_setCcdMotionThreshold_1(btCollisionObject* self, float ccdMotionThreshold) {
  self->setCcdMotionThreshold(ccdMotionThreshold);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_setCcdSweptSphereRadius_1(btCollisionObject* self, float radius) {
  self->setCcdSweptSphereRadius(radius);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_getUserIndex_0(btCollisionObject* self) {
  return self->getUserIndex();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_setUserIndex_1(btCollisionObject* self, int index) {
  self->setUserIndex(index);
}

void* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_getUserPointer_0(btCollisionObject* self) {
  return self->getUserPointer();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_setUserPointer_1(btCollisionObject* self, void* userPointer) {
  self->setUserPointer(userPointer);
}

const btBroadphaseProxy* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject_getBroadphaseHandle_0(btCollisionObject* self) {
  return self->getBroadphaseHandle();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObject___destroy___0(btCollisionObject* self) {
  delete self;
}

// Interface: btConcaveShape


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConcaveShape_setLocalScaling_1(btConcaveShape* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConcaveShape_getLocalScaling_0(btConcaveShape* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConcaveShape_calculateLocalInertia_2(btConcaveShape* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConcaveShape___destroy___0(btConcaveShape* self) {
  delete self;
}

// Interface: btCollisionAlgorithm


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionAlgorithm___destroy___0(btCollisionAlgorithm* self) {
  delete self;
}

// Interface: btTypedConstraint


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTypedConstraint_enableFeedback_1(btTypedConstraint* self, bool needsFeedback) {
  self->enableFeedback(needsFeedback);
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btTypedConstraint_getBreakingImpulseThreshold_0(btTypedConstraint* self) {
  return self->getBreakingImpulseThreshold();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTypedConstraint_setBreakingImpulseThreshold_1(btTypedConstraint* self, const float threshold) {
  self->setBreakingImpulseThreshold(threshold);
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btTypedConstraint_getParam_2(btTypedConstraint* self, int num, int axis) {
  return self->getParam(num, axis);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTypedConstraint_setParam_3(btTypedConstraint* self, int num, float value, int axis) {
  self->setParam(num, value, axis);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTypedConstraint___destroy___0(btTypedConstraint* self) {
  delete self;
}

// Interface: btDynamicsWorld


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_addAction_1(btDynamicsWorld* self, btActionInterface* action) {
  self->addAction(action);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_removeAction_1(btDynamicsWorld* self, btActionInterface* action) {
  self->removeAction(action);
}

btContactSolverInfo* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_getSolverInfo_0(btDynamicsWorld* self) {
  return &self->getSolverInfo();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_setInternalTickCallback_1(btDynamicsWorld* self, void* cb) {
  self->setInternalTickCallback(cb);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_setInternalTickCallback_2(btDynamicsWorld* self, void* cb, void* worldUserInfo) {
  self->setInternalTickCallback(cb, worldUserInfo);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_setInternalTickCallback_3(btDynamicsWorld* self, void* cb, void* worldUserInfo, bool isPreTick) {
  self->setInternalTickCallback(cb, worldUserInfo, isPreTick);
}

btDispatcher* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_getDispatcher_0(btDynamicsWorld* self) {
  return self->getDispatcher();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_rayTest_3(btDynamicsWorld* self, const btVector3* rayFromWorld, const btVector3* rayToWorld, btCollisionWorld::RayResultCallback* resultCallback) {
  self->rayTest(*rayFromWorld, *rayToWorld, *resultCallback);
}

btOverlappingPairCache* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_getPairCache_0(btDynamicsWorld* self) {
  return self->getPairCache();
}

btDispatcherInfo* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_getDispatchInfo_0(btDynamicsWorld* self) {
  return &self->getDispatchInfo();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_addCollisionObject_1(btDynamicsWorld* self, btCollisionObject* collisionObject) {
  self->addCollisionObject(collisionObject);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_addCollisionObject_2(btDynamicsWorld* self, btCollisionObject* collisionObject, short collisionFilterGroup) {
  self->addCollisionObject(collisionObject, collisionFilterGroup);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_addCollisionObject_3(btDynamicsWorld* self, btCollisionObject* collisionObject, short collisionFilterGroup, short collisionFilterMask) {
  self->addCollisionObject(collisionObject, collisionFilterGroup, collisionFilterMask);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_removeCollisionObject_1(btDynamicsWorld* self, btCollisionObject* collisionObject) {
  self->removeCollisionObject(collisionObject);
}

const btBroadphaseInterface* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_getBroadphase_0(btDynamicsWorld* self) {
  return self->getBroadphase();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_convexSweepTest_5(btDynamicsWorld* self, const btConvexShape* castShape, const btTransform* from, const btTransform* to, btCollisionWorld::ConvexResultCallback* resultCallback, float allowedCcdPenetration) {
  self->convexSweepTest(castShape, *from, *to, *resultCallback, allowedCcdPenetration);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_contactPairTest_3(btDynamicsWorld* self, btCollisionObject* colObjA, btCollisionObject* colObjB, btCollisionWorld::ContactResultCallback* resultCallback) {
  self->contactPairTest(colObjA, colObjB, *resultCallback);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_contactTest_2(btDynamicsWorld* self, btCollisionObject* colObj, btCollisionWorld::ContactResultCallback* resultCallback) {
  self->contactTest(colObj, *resultCallback);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_setForceUpdateAllAabbs_1(btDynamicsWorld* self, bool forceUpdateAllAabbs) {
  self->setForceUpdateAllAabbs(forceUpdateAllAabbs);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_updateSingleAabb_1(btDynamicsWorld* self, btCollisionObject* colObj) {
  self->updateSingleAabb(colObj);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_setDebugDrawer_1(btDynamicsWorld* self, btIDebugDraw* debugDrawer) {
  self->setDebugDrawer(debugDrawer);
}

btIDebugDraw* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_getDebugDrawer_0(btDynamicsWorld* self) {
  return self->getDebugDrawer();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_debugDrawWorld_0(btDynamicsWorld* self) {
  self->debugDrawWorld();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld_debugDrawObject_3(btDynamicsWorld* self, const btTransform* worldTransform, const btCollisionShape* shape, const btVector3* color) {
  self->debugDrawObject(*worldTransform, shape, *color);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDynamicsWorld___destroy___0(btDynamicsWorld* self) {
  delete self;
}

// Interface: btIDebugDraw


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btIDebugDraw_drawLine_3(btIDebugDraw* self, const btVector3* from, const btVector3* to, const btVector3* color) {
  self->drawLine(*from, *to, *color);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btIDebugDraw_drawContactPoint_5(btIDebugDraw* self, const btVector3* pointOnB, const btVector3* normalOnB, float distance, int lifeTime, const btVector3* color) {
  self->drawContactPoint(*pointOnB, *normalOnB, distance, lifeTime, *color);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btIDebugDraw_reportErrorWarning_1(btIDebugDraw* self, const char* warningString) {
  self->reportErrorWarning(warningString);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btIDebugDraw_draw3dText_2(btIDebugDraw* self, const btVector3* location, const char* textString) {
  self->draw3dText(*location, textString);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btIDebugDraw_setDebugMode_1(btIDebugDraw* self, int debugMode) {
  self->setDebugMode(debugMode);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btIDebugDraw_getDebugMode_0(btIDebugDraw* self) {
  return self->getDebugMode();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btIDebugDraw___destroy___0(btIDebugDraw* self) {
  delete self;
}

// Interface: btVector3


btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3_btVector3_0() {
  return new btVector3();
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3_btVector3_3(float x, float y, float z) {
  return new btVector3(x, y, z);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3_length_0(btVector3* self) {
  return self->length();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3_length2_0(btVector3* self) {
  return self->length2();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3_x_0(btVector3* self) {
  return self->x();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3_y_0(btVector3* self) {
  return self->y();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3_z_0(btVector3* self) {
  return self->z();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3_setX_1(btVector3* self, float x) {
  self->setX(x);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3_setY_1(btVector3* self, float y) {
  self->setY(y);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3_setZ_1(btVector3* self, float z) {
  self->setZ(z);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3_setValue_3(btVector3* self, float x, float y, float z) {
  self->setValue(x, y, z);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3_normalize_0(btVector3* self) {
  self->normalize();
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3_rotate_2(btVector3* self, btVector3* wAxis, float angle) {
  static thread_local btVector3 temp;
  return (temp = self->rotate(*wAxis, angle), &temp);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3_dot_1(btVector3* self, btVector3* v) {
  return self->dot(*v);
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3_op_mul_1(btVector3* self, float x) {
  return &(*self *= x);
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3_op_add_1(btVector3* self, btVector3* v) {
  return &(*self += *v);
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3_op_sub_1(btVector3* self, btVector3* v) {
  return &(*self -= *v);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3___destroy___0(btVector3* self) {
  delete self;
}

// Interface: btQuadWord


float EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuadWord_x_0(btQuadWord* self) {
  return self->x();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuadWord_y_0(btQuadWord* self) {
  return self->y();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuadWord_z_0(btQuadWord* self) {
  return self->z();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuadWord_w_0(btQuadWord* self) {
  return self->w();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuadWord_setX_1(btQuadWord* self, float x) {
  self->setX(x);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuadWord_setY_1(btQuadWord* self, float y) {
  self->setY(y);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuadWord_setZ_1(btQuadWord* self, float z) {
  self->setZ(z);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuadWord_setW_1(btQuadWord* self, float w) {
  self->setW(w);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuadWord___destroy___0(btQuadWord* self) {
  delete self;
}

// Interface: btMotionState


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btMotionState_getWorldTransform_1(btMotionState* self, btTransform* worldTrans) {
  self->getWorldTransform(*worldTrans);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btMotionState_setWorldTransform_1(btMotionState* self, btTransform* worldTrans) {
  self->setWorldTransform(*worldTrans);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btMotionState___destroy___0(btMotionState* self) {
  delete self;
}

// Interface: RayResultCallback


bool EMSCRIPTEN_KEEPALIVE emscripten_bind_RayResultCallback_hasHit_0(btCollisionWorld::RayResultCallback* self) {
  return self->hasHit();
}

short EMSCRIPTEN_KEEPALIVE emscripten_bind_RayResultCallback_get_m_collisionFilterGroup_0(btCollisionWorld::RayResultCallback* self) {
  return self->m_collisionFilterGroup;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RayResultCallback_set_m_collisionFilterGroup_1(btCollisionWorld::RayResultCallback* self, short arg0) {
  self->m_collisionFilterGroup = arg0;
}

short EMSCRIPTEN_KEEPALIVE emscripten_bind_RayResultCallback_get_m_collisionFilterMask_0(btCollisionWorld::RayResultCallback* self) {
  return self->m_collisionFilterMask;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RayResultCallback_set_m_collisionFilterMask_1(btCollisionWorld::RayResultCallback* self, short arg0) {
  self->m_collisionFilterMask = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_RayResultCallback_get_m_closestHitFraction_0(btCollisionWorld::RayResultCallback* self) {
  return self->m_closestHitFraction;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RayResultCallback_set_m_closestHitFraction_1(btCollisionWorld::RayResultCallback* self, float arg0) {
  self->m_closestHitFraction = arg0;
}

const btCollisionObject* EMSCRIPTEN_KEEPALIVE emscripten_bind_RayResultCallback_get_m_collisionObject_0(btCollisionWorld::RayResultCallback* self) {
  return self->m_collisionObject;
}

const void EMSCRIPTEN_KEEPALIVE emscripten_bind_RayResultCallback_set_m_collisionObject_1(btCollisionWorld::RayResultCallback* self, btCollisionObject* arg0) {
  self->m_collisionObject = arg0;
}

unsigned int EMSCRIPTEN_KEEPALIVE emscripten_bind_RayResultCallback_get_m_flags_0(btCollisionWorld::RayResultCallback* self) {
  return self->m_flags;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RayResultCallback_set_m_flags_1(btCollisionWorld::RayResultCallback* self, unsigned int arg0) {
  self->m_flags = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RayResultCallback___destroy___0(btCollisionWorld::RayResultCallback* self) {
  delete self;
}

// Interface: ContactResultCallback


float EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactResultCallback_addSingleResult_7(btCollisionWorld::ContactResultCallback* self, btManifoldPoint* cp, const btCollisionObjectWrapper* colObj0Wrap, int partId0, int index0, const btCollisionObjectWrapper* colObj1Wrap, int partId1, int index1) {
  return self->addSingleResult(*cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ContactResultCallback___destroy___0(btCollisionWorld::ContactResultCallback* self) {
  delete self;
}

// Interface: ConvexResultCallback


bool EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexResultCallback_hasHit_0(btCollisionWorld::ConvexResultCallback* self) {
  return self->hasHit();
}

short EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexResultCallback_get_m_collisionFilterGroup_0(btCollisionWorld::ConvexResultCallback* self) {
  return self->m_collisionFilterGroup;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexResultCallback_set_m_collisionFilterGroup_1(btCollisionWorld::ConvexResultCallback* self, short arg0) {
  self->m_collisionFilterGroup = arg0;
}

short EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexResultCallback_get_m_collisionFilterMask_0(btCollisionWorld::ConvexResultCallback* self) {
  return self->m_collisionFilterMask;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexResultCallback_set_m_collisionFilterMask_1(btCollisionWorld::ConvexResultCallback* self, short arg0) {
  self->m_collisionFilterMask = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexResultCallback_get_m_closestHitFraction_0(btCollisionWorld::ConvexResultCallback* self) {
  return self->m_closestHitFraction;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexResultCallback_set_m_closestHitFraction_1(btCollisionWorld::ConvexResultCallback* self, float arg0) {
  self->m_closestHitFraction = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexResultCallback___destroy___0(btCollisionWorld::ConvexResultCallback* self) {
  delete self;
}

// Interface: btConvexShape


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexShape_setLocalScaling_1(btConvexShape* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexShape_getLocalScaling_0(btConvexShape* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexShape_calculateLocalInertia_2(btConvexShape* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexShape_setMargin_1(btConvexShape* self, float margin) {
  self->setMargin(margin);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexShape_getMargin_0(btConvexShape* self) {
  return self->getMargin();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexShape___destroy___0(btConvexShape* self) {
  delete self;
}

// Interface: btCapsuleShape


btCapsuleShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShape_btCapsuleShape_2(float radius, float height) {
  return new btCapsuleShape(radius, height);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShape_setMargin_1(btCapsuleShape* self, float margin) {
  self->setMargin(margin);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShape_getMargin_0(btCapsuleShape* self) {
  return self->getMargin();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShape_getUpAxis_0(btCapsuleShape* self) {
  return self->getUpAxis();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShape_getRadius_0(btCapsuleShape* self) {
  return self->getRadius();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShape_getHalfHeight_0(btCapsuleShape* self) {
  return self->getHalfHeight();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShape_setLocalScaling_1(btCapsuleShape* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShape_getLocalScaling_0(btCapsuleShape* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShape_calculateLocalInertia_2(btCapsuleShape* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShape___destroy___0(btCapsuleShape* self) {
  delete self;
}

// Interface: btCylinderShape


btCylinderShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShape_btCylinderShape_1(btVector3* halfExtents) {
  return new btCylinderShape(*halfExtents);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShape_setMargin_1(btCylinderShape* self, float margin) {
  self->setMargin(margin);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShape_getMargin_0(btCylinderShape* self) {
  return self->getMargin();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShape_setLocalScaling_1(btCylinderShape* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShape_getLocalScaling_0(btCylinderShape* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShape_calculateLocalInertia_2(btCylinderShape* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShape___destroy___0(btCylinderShape* self) {
  delete self;
}

// Interface: btConeShape


btConeShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeShape_btConeShape_2(float radius, float height) {
  return new btConeShape(radius, height);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeShape_setLocalScaling_1(btConeShape* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeShape_getLocalScaling_0(btConeShape* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeShape_calculateLocalInertia_2(btConeShape* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeShape___destroy___0(btConeShape* self) {
  delete self;
}

// Interface: btStridingMeshInterface


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btStridingMeshInterface_setScaling_1(btStridingMeshInterface* self, const btVector3* scaling) {
  self->setScaling(*scaling);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btStridingMeshInterface___destroy___0(btStridingMeshInterface* self) {
  delete self;
}

// Interface: btTriangleMeshShape


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTriangleMeshShape_setLocalScaling_1(btTriangleMeshShape* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btTriangleMeshShape_getLocalScaling_0(btTriangleMeshShape* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTriangleMeshShape_calculateLocalInertia_2(btTriangleMeshShape* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTriangleMeshShape___destroy___0(btTriangleMeshShape* self) {
  delete self;
}

// Interface: btPrimitiveManagerBase


bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btPrimitiveManagerBase_is_trimesh_0(btPrimitiveManagerBase* self) {
  return self->is_trimesh();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btPrimitiveManagerBase_get_primitive_count_0(btPrimitiveManagerBase* self) {
  return self->get_primitive_count();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPrimitiveManagerBase_get_primitive_box_2(btPrimitiveManagerBase* self, int prim_index, btAABB* primbox) {
  self->get_primitive_box(prim_index, *primbox);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPrimitiveManagerBase_get_primitive_triangle_2(btPrimitiveManagerBase* self, int prim_index, btPrimitiveTriangle* triangle) {
  self->get_primitive_triangle(prim_index, *triangle);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPrimitiveManagerBase___destroy___0(btPrimitiveManagerBase* self) {
  delete self;
}

// Interface: btGImpactShapeInterface


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactShapeInterface_updateBound_0(btGImpactShapeInterface* self) {
  self->updateBound();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactShapeInterface_postUpdate_0(btGImpactShapeInterface* self) {
  self->postUpdate();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactShapeInterface_getShapeType_0(btGImpactShapeInterface* self) {
  return self->getShapeType();
}

const char* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactShapeInterface_getName_0(btGImpactShapeInterface* self) {
  return self->getName();
}

eGIMPACT_SHAPE_TYPE EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactShapeInterface_getGImpactShapeType_0(btGImpactShapeInterface* self) {
  return self->getGImpactShapeType();
}

const btPrimitiveManagerBase* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactShapeInterface_getPrimitiveManager_0(btGImpactShapeInterface* self) {
  return self->getPrimitiveManager();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactShapeInterface_getNumChildShapes_0(btGImpactShapeInterface* self) {
  return self->getNumChildShapes();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactShapeInterface_childrenHasTransform_0(btGImpactShapeInterface* self) {
  return self->childrenHasTransform();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactShapeInterface_needsRetrieveTriangles_0(btGImpactShapeInterface* self) {
  return self->needsRetrieveTriangles();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactShapeInterface_needsRetrieveTetrahedrons_0(btGImpactShapeInterface* self) {
  return self->needsRetrieveTetrahedrons();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactShapeInterface_getBulletTriangle_2(btGImpactShapeInterface* self, int prim_index, btTriangleShapeEx* triangle) {
  self->getBulletTriangle(prim_index, *triangle);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactShapeInterface_getBulletTetrahedron_2(btGImpactShapeInterface* self, int prim_index, btTetrahedronShapeEx* tetrahedron) {
  self->getBulletTetrahedron(prim_index, *tetrahedron);
}

const btCollisionShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactShapeInterface_getChildShape_1(btGImpactShapeInterface* self, int index) {
  return self->getChildShape(index);
}

btTransform* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactShapeInterface_getChildTransform_1(btGImpactShapeInterface* self, int index) {
  static thread_local btTransform temp;
  return (temp = self->getChildTransform(index), &temp);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactShapeInterface_setChildTransform_2(btGImpactShapeInterface* self, int index, const btTransform* transform) {
  self->setChildTransform(index, *transform);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactShapeInterface_setLocalScaling_1(btGImpactShapeInterface* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactShapeInterface_getLocalScaling_0(btGImpactShapeInterface* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactShapeInterface_calculateLocalInertia_2(btGImpactShapeInterface* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactShapeInterface___destroy___0(btGImpactShapeInterface* self) {
  delete self;
}

// Interface: btActivatingCollisionAlgorithm


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btActivatingCollisionAlgorithm___destroy___0(btActivatingCollisionAlgorithm* self) {
  delete self;
}

// Interface: btDefaultCollisionConfiguration


btDefaultCollisionConfiguration* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_0() {
  return new btDefaultCollisionConfiguration();
}

btDefaultCollisionConfiguration* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDefaultCollisionConfiguration_btDefaultCollisionConfiguration_1(btDefaultCollisionConstructionInfo* info) {
  return new btDefaultCollisionConfiguration(*info);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDefaultCollisionConfiguration___destroy___0(btDefaultCollisionConfiguration* self) {
  delete self;
}

// Interface: btDispatcher


int EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcher_getNumManifolds_0(btDispatcher* self) {
  return self->getNumManifolds();
}

btPersistentManifold* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcher_getManifoldByIndexInternal_1(btDispatcher* self, int index) {
  return self->getManifoldByIndexInternal(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcher___destroy___0(btDispatcher* self) {
  delete self;
}

// Interface: btGeneric6DofConstraint


btGeneric6DofConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_3(btRigidBody* rbA, btTransform* rbB, bool frameInA) {
  return new btGeneric6DofConstraint(*rbA, *rbB, frameInA);
}

btGeneric6DofConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofConstraint_btGeneric6DofConstraint_5(btRigidBody* rbA, btRigidBody* rbB, btTransform* frameInA, btTransform* frameInB, bool useLinearFrameReferenceFrameA) {
  return new btGeneric6DofConstraint(*rbA, *rbB, *frameInA, *frameInB, useLinearFrameReferenceFrameA);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofConstraint_setLinearLowerLimit_1(btGeneric6DofConstraint* self, const btVector3* linearLower) {
  self->setLinearLowerLimit(*linearLower);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofConstraint_setLinearUpperLimit_1(btGeneric6DofConstraint* self, const btVector3* linearUpper) {
  self->setLinearUpperLimit(*linearUpper);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofConstraint_setAngularLowerLimit_1(btGeneric6DofConstraint* self, const btVector3* angularLower) {
  self->setAngularLowerLimit(*angularLower);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofConstraint_setAngularUpperLimit_1(btGeneric6DofConstraint* self, const btVector3* angularUpper) {
  self->setAngularUpperLimit(*angularUpper);
}

const btTransform* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofConstraint_getFrameOffsetA_0(btGeneric6DofConstraint* self) {
  return &self->getFrameOffsetA();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofConstraint_enableFeedback_1(btGeneric6DofConstraint* self, bool needsFeedback) {
  self->enableFeedback(needsFeedback);
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofConstraint_getBreakingImpulseThreshold_0(btGeneric6DofConstraint* self) {
  return self->getBreakingImpulseThreshold();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofConstraint_setBreakingImpulseThreshold_1(btGeneric6DofConstraint* self, const float threshold) {
  self->setBreakingImpulseThreshold(threshold);
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofConstraint_getParam_2(btGeneric6DofConstraint* self, int num, int axis) {
  return self->getParam(num, axis);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofConstraint_setParam_3(btGeneric6DofConstraint* self, int num, float value, int axis) {
  self->setParam(num, value, axis);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofConstraint___destroy___0(btGeneric6DofConstraint* self) {
  delete self;
}

// Interface: btDiscreteDynamicsWorld


btDiscreteDynamicsWorld* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_btDiscreteDynamicsWorld_4(btDispatcher* dispatcher, btBroadphaseInterface* pairCache, btConstraintSolver* constraintSolver, btCollisionConfiguration* collisionConfiguration) {
  return new btDiscreteDynamicsWorld(dispatcher, pairCache, constraintSolver, collisionConfiguration);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_setGravity_1(btDiscreteDynamicsWorld* self, btVector3* gravity) {
  self->setGravity(*gravity);
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_getGravity_0(btDiscreteDynamicsWorld* self) {
  static thread_local btVector3 temp;
  return (temp = self->getGravity(), &temp);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_1(btDiscreteDynamicsWorld* self, btRigidBody* body) {
  self->addRigidBody(body);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_addRigidBody_3(btDiscreteDynamicsWorld* self, btRigidBody* body, short group, short mask) {
  self->addRigidBody(body, group, mask);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_removeRigidBody_1(btDiscreteDynamicsWorld* self, btRigidBody* body) {
  self->removeRigidBody(body);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_addConstraint_1(btDiscreteDynamicsWorld* self, btTypedConstraint* constraint) {
  self->addConstraint(constraint);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_addConstraint_2(btDiscreteDynamicsWorld* self, btTypedConstraint* constraint, bool disableCollisionsBetweenLinkedBodies) {
  self->addConstraint(constraint, disableCollisionsBetweenLinkedBodies);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_removeConstraint_1(btDiscreteDynamicsWorld* self, btTypedConstraint* constraint) {
  self->removeConstraint(constraint);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_1(btDiscreteDynamicsWorld* self, float timeStep) {
  return self->stepSimulation(timeStep);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_2(btDiscreteDynamicsWorld* self, float timeStep, int maxSubSteps) {
  return self->stepSimulation(timeStep, maxSubSteps);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_stepSimulation_3(btDiscreteDynamicsWorld* self, float timeStep, int maxSubSteps, float fixedTimeStep) {
  return self->stepSimulation(timeStep, maxSubSteps, fixedTimeStep);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_setContactAddedCallback_1(btDiscreteDynamicsWorld* self, int funcpointer) {
  self->setContactAddedCallback(funcpointer);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_setContactProcessedCallback_1(btDiscreteDynamicsWorld* self, int funcpointer) {
  self->setContactProcessedCallback(funcpointer);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_setContactDestroyedCallback_1(btDiscreteDynamicsWorld* self, int funcpointer) {
  self->setContactDestroyedCallback(funcpointer);
}

btDispatcher* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_getDispatcher_0(btDiscreteDynamicsWorld* self) {
  return self->getDispatcher();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_rayTest_3(btDiscreteDynamicsWorld* self, const btVector3* rayFromWorld, const btVector3* rayToWorld, btCollisionWorld::RayResultCallback* resultCallback) {
  self->rayTest(*rayFromWorld, *rayToWorld, *resultCallback);
}

btOverlappingPairCache* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_getPairCache_0(btDiscreteDynamicsWorld* self) {
  return self->getPairCache();
}

btDispatcherInfo* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_getDispatchInfo_0(btDiscreteDynamicsWorld* self) {
  return &self->getDispatchInfo();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_1(btDiscreteDynamicsWorld* self, btCollisionObject* collisionObject) {
  self->addCollisionObject(collisionObject);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_2(btDiscreteDynamicsWorld* self, btCollisionObject* collisionObject, short collisionFilterGroup) {
  self->addCollisionObject(collisionObject, collisionFilterGroup);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_addCollisionObject_3(btDiscreteDynamicsWorld* self, btCollisionObject* collisionObject, short collisionFilterGroup, short collisionFilterMask) {
  self->addCollisionObject(collisionObject, collisionFilterGroup, collisionFilterMask);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_removeCollisionObject_1(btDiscreteDynamicsWorld* self, btCollisionObject* collisionObject) {
  self->removeCollisionObject(collisionObject);
}

const btBroadphaseInterface* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_getBroadphase_0(btDiscreteDynamicsWorld* self) {
  return self->getBroadphase();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_convexSweepTest_5(btDiscreteDynamicsWorld* self, const btConvexShape* castShape, const btTransform* from, const btTransform* to, btCollisionWorld::ConvexResultCallback* resultCallback, float allowedCcdPenetration) {
  self->convexSweepTest(castShape, *from, *to, *resultCallback, allowedCcdPenetration);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_contactPairTest_3(btDiscreteDynamicsWorld* self, btCollisionObject* colObjA, btCollisionObject* colObjB, btCollisionWorld::ContactResultCallback* resultCallback) {
  self->contactPairTest(colObjA, colObjB, *resultCallback);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_contactTest_2(btDiscreteDynamicsWorld* self, btCollisionObject* colObj, btCollisionWorld::ContactResultCallback* resultCallback) {
  self->contactTest(colObj, *resultCallback);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_setForceUpdateAllAabbs_1(btDiscreteDynamicsWorld* self, bool forceUpdateAllAabbs) {
  self->setForceUpdateAllAabbs(forceUpdateAllAabbs);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_updateSingleAabb_1(btDiscreteDynamicsWorld* self, btCollisionObject* colObj) {
  self->updateSingleAabb(colObj);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_setDebugDrawer_1(btDiscreteDynamicsWorld* self, btIDebugDraw* debugDrawer) {
  self->setDebugDrawer(debugDrawer);
}

btIDebugDraw* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_getDebugDrawer_0(btDiscreteDynamicsWorld* self) {
  return self->getDebugDrawer();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_debugDrawWorld_0(btDiscreteDynamicsWorld* self) {
  self->debugDrawWorld();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_debugDrawObject_3(btDiscreteDynamicsWorld* self, const btTransform* worldTransform, const btCollisionShape* shape, const btVector3* color) {
  self->debugDrawObject(*worldTransform, shape, *color);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_addAction_1(btDiscreteDynamicsWorld* self, btActionInterface* action) {
  self->addAction(action);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_removeAction_1(btDiscreteDynamicsWorld* self, btActionInterface* action) {
  self->removeAction(action);
}

btContactSolverInfo* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_getSolverInfo_0(btDiscreteDynamicsWorld* self) {
  return &self->getSolverInfo();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_1(btDiscreteDynamicsWorld* self, void* cb) {
  self->setInternalTickCallback(cb);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_2(btDiscreteDynamicsWorld* self, void* cb, void* worldUserInfo) {
  self->setInternalTickCallback(cb, worldUserInfo);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld_setInternalTickCallback_3(btDiscreteDynamicsWorld* self, void* cb, void* worldUserInfo, bool isPreTick) {
  self->setInternalTickCallback(cb, worldUserInfo, isPreTick);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDiscreteDynamicsWorld___destroy___0(btDiscreteDynamicsWorld* self) {
  delete self;
}

// Interface: btVehicleRaycaster


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleRaycaster_castRay_3(btVehicleRaycaster* self, const btVector3* from, const btVector3* to, btDefaultVehicleRaycaster::btVehicleRaycasterResult* result) {
  self->castRay(*from, *to, *result);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleRaycaster___destroy___0(btVehicleRaycaster* self) {
  delete self;
}

// Interface: btActionInterface


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btActionInterface_updateAction_2(btActionInterface* self, btCollisionWorld* collisionWorld, float deltaTimeStep) {
  self->updateAction(collisionWorld, deltaTimeStep);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btActionInterface___destroy___0(btActionInterface* self) {
  delete self;
}

// Interface: btGhostObject


btGhostObject* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_btGhostObject_0() {
  return new btGhostObject();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_getNumOverlappingObjects_0(btGhostObject* self) {
  return self->getNumOverlappingObjects();
}

btCollisionObject* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_getOverlappingObject_1(btGhostObject* self, int index) {
  return self->getOverlappingObject(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_setAnisotropicFriction_2(btGhostObject* self, const btVector3* anisotropicFriction, int frictionMode) {
  self->setAnisotropicFriction(*anisotropicFriction, frictionMode);
}

btCollisionShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_getCollisionShape_0(btGhostObject* self) {
  return self->getCollisionShape();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_setContactProcessingThreshold_1(btGhostObject* self, float contactProcessingThreshold) {
  self->setContactProcessingThreshold(contactProcessingThreshold);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_setActivationState_1(btGhostObject* self, int newState) {
  self->setActivationState(newState);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_forceActivationState_1(btGhostObject* self, int newState) {
  self->forceActivationState(newState);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_activate_0(btGhostObject* self) {
  self->activate();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_activate_1(btGhostObject* self, bool forceActivation) {
  self->activate(forceActivation);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_isActive_0(btGhostObject* self) {
  return self->isActive();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_isKinematicObject_0(btGhostObject* self) {
  return self->isKinematicObject();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_isStaticObject_0(btGhostObject* self) {
  return self->isStaticObject();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_isStaticOrKinematicObject_0(btGhostObject* self) {
  return self->isStaticOrKinematicObject();
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_getRestitution_0(btGhostObject* self) {
  return self->getRestitution();
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_getFriction_0(btGhostObject* self) {
  return self->getFriction();
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_getRollingFriction_0(btGhostObject* self) {
  return self->getRollingFriction();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_setRestitution_1(btGhostObject* self, float rest) {
  self->setRestitution(rest);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_setFriction_1(btGhostObject* self, float frict) {
  self->setFriction(frict);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_setRollingFriction_1(btGhostObject* self, float frict) {
  self->setRollingFriction(frict);
}

btTransform* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_getWorldTransform_0(btGhostObject* self) {
  return &self->getWorldTransform();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_getCollisionFlags_0(btGhostObject* self) {
  return self->getCollisionFlags();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_setCollisionFlags_1(btGhostObject* self, int flags) {
  self->setCollisionFlags(flags);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_setWorldTransform_1(btGhostObject* self, const btTransform* worldTrans) {
  self->setWorldTransform(*worldTrans);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_setCollisionShape_1(btGhostObject* self, btCollisionShape* collisionShape) {
  self->setCollisionShape(collisionShape);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_setCcdMotionThreshold_1(btGhostObject* self, float ccdMotionThreshold) {
  self->setCcdMotionThreshold(ccdMotionThreshold);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_setCcdSweptSphereRadius_1(btGhostObject* self, float radius) {
  self->setCcdSweptSphereRadius(radius);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_getUserIndex_0(btGhostObject* self) {
  return self->getUserIndex();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_setUserIndex_1(btGhostObject* self, int index) {
  self->setUserIndex(index);
}

void* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_getUserPointer_0(btGhostObject* self) {
  return self->getUserPointer();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_setUserPointer_1(btGhostObject* self, void* userPointer) {
  self->setUserPointer(userPointer);
}

const btBroadphaseProxy* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject_getBroadphaseHandle_0(btGhostObject* self) {
  return self->getBroadphaseHandle();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostObject___destroy___0(btGhostObject* self) {
  delete self;
}

// Interface: btSoftBodySolver


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodySolver___destroy___0(btSoftBodySolver* self) {
  delete self;
}

// Interface: VoidPtr


void EMSCRIPTEN_KEEPALIVE emscripten_bind_VoidPtr___destroy___0(void** self) {
  delete self;
}

// Interface: DebugDrawer


DebugDrawer* EMSCRIPTEN_KEEPALIVE emscripten_bind_DebugDrawer_DebugDrawer_0() {
  return new DebugDrawer();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_DebugDrawer_drawLine_3(DebugDrawer* self, const btVector3* from, const btVector3* to, const btVector3* color) {
  self->drawLine(*from, *to, *color);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_DebugDrawer_drawContactPoint_5(DebugDrawer* self, const btVector3* pointOnB, const btVector3* normalOnB, float distance, int lifeTime, const btVector3* color) {
  self->drawContactPoint(*pointOnB, *normalOnB, distance, lifeTime, *color);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_DebugDrawer_reportErrorWarning_1(DebugDrawer* self, const char* warningString) {
  self->reportErrorWarning(warningString);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_DebugDrawer_draw3dText_2(DebugDrawer* self, const btVector3* location, const char* textString) {
  self->draw3dText(*location, textString);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_DebugDrawer_setDebugMode_1(DebugDrawer* self, int debugMode) {
  self->setDebugMode(debugMode);
}

const int EMSCRIPTEN_KEEPALIVE emscripten_bind_DebugDrawer_getDebugMode_0(DebugDrawer* self) {
  return self->getDebugMode();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_DebugDrawer___destroy___0(DebugDrawer* self) {
  delete self;
}

// Interface: btVector4


btVector4* EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector4_btVector4_0() {
  return new btVector4();
}

btVector4* EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector4_btVector4_4(float x, float y, float z, float w) {
  return new btVector4(x, y, z, w);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector4_w_0(btVector4* self) {
  return self->w();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector4_setValue_4(btVector4* self, float x, float y, float z, float w) {
  self->setValue(x, y, z, w);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector4_length_0(btVector4* self) {
  return self->length();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector4_length2_0(btVector4* self) {
  return self->length2();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector4_x_0(btVector4* self) {
  return self->x();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector4_y_0(btVector4* self) {
  return self->y();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector4_z_0(btVector4* self) {
  return self->z();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector4_setX_1(btVector4* self, float x) {
  self->setX(x);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector4_setY_1(btVector4* self, float y) {
  self->setY(y);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector4_setZ_1(btVector4* self, float z) {
  self->setZ(z);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector4_normalize_0(btVector4* self) {
  self->normalize();
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector4_rotate_2(btVector4* self, btVector3* wAxis, float angle) {
  static thread_local btVector3 temp;
  return (temp = self->rotate(*wAxis, angle), &temp);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector4_dot_1(btVector4* self, btVector3* v) {
  return self->dot(*v);
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector4_op_mul_1(btVector4* self, float x) {
  return &(*dynamic_cast<btVector3*>(self) *= x);
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector4_op_add_1(btVector4* self, btVector3* v) {
  return &(*dynamic_cast<btVector3*>(self) += *v);
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector4_op_sub_1(btVector4* self, btVector3* v) {
  return &(*dynamic_cast<btVector3*>(self) -= *v);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector4___destroy___0(btVector4* self) {
  delete self;
}

// Interface: btQuaternion


btQuaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_btQuaternion_4(float x, float y, float z, float w) {
  return new btQuaternion(x, y, z, w);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_setValue_4(btQuaternion* self, float x, float y, float z, float w) {
  self->setValue(x, y, z, w);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_setEulerZYX_3(btQuaternion* self, float z, float y, float x) {
  self->setEulerZYX(z, y, x);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_setRotation_2(btQuaternion* self, btVector3* axis, float angle) {
  self->setRotation(*axis, angle);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_normalize_0(btQuaternion* self) {
  self->normalize();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_length2_0(btQuaternion* self) {
  return self->length2();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_length_0(btQuaternion* self) {
  return self->length();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_dot_1(btQuaternion* self, btQuaternion* q) {
  return self->dot(*q);
}

btQuaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_normalized_0(btQuaternion* self) {
  static thread_local btQuaternion temp;
  return (temp = self->normalized(), &temp);
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_getAxis_0(btQuaternion* self) {
  static thread_local btVector3 temp;
  return (temp = self->getAxis(), &temp);
}

btQuaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_inverse_0(btQuaternion* self) {
  static thread_local btQuaternion temp;
  return (temp = self->inverse(), &temp);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_getAngle_0(btQuaternion* self) {
  return self->getAngle();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_getAngleShortestPath_0(btQuaternion* self) {
  return self->getAngleShortestPath();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_angle_1(btQuaternion* self, btQuaternion* q) {
  return self->angle(*q);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_angleShortestPath_1(btQuaternion* self, btQuaternion* q) {
  return self->angleShortestPath(*q);
}

btQuaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_op_add_1(btQuaternion* self, btQuaternion* q) {
  return &(*self += *q);
}

btQuaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_op_sub_1(btQuaternion* self, btQuaternion* q) {
  return &(*self -= *q);
}

btQuaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_op_mul_1(btQuaternion* self, float s) {
  return &(*self *= s);
}

btQuaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_op_mulq_1(btQuaternion* self, btQuaternion* q) {
  return &(*self *= *q);
}

btQuaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_op_div_1(btQuaternion* self, float s) {
  return &(*self /= s);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_x_0(btQuaternion* self) {
  return self->x();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_y_0(btQuaternion* self) {
  return self->y();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_z_0(btQuaternion* self) {
  return self->z();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_w_0(btQuaternion* self) {
  return self->w();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_setX_1(btQuaternion* self, float x) {
  self->setX(x);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_setY_1(btQuaternion* self, float y) {
  self->setY(y);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_setZ_1(btQuaternion* self, float z) {
  self->setZ(z);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion_setW_1(btQuaternion* self, float w) {
  self->setW(w);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btQuaternion___destroy___0(btQuaternion* self) {
  delete self;
}

// Interface: btMatrix3x3


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btMatrix3x3_setEulerZYX_3(btMatrix3x3* self, float ex, float ey, float ez) {
  self->setEulerZYX(ex, ey, ez);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btMatrix3x3_getRotation_1(btMatrix3x3* self, btQuaternion* q) {
  self->getRotation(*q);
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btMatrix3x3_getRow_1(btMatrix3x3* self, int y) {
  static thread_local btVector3 temp;
  return (temp = self->getRow(y), &temp);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btMatrix3x3___destroy___0(btMatrix3x3* self) {
  delete self;
}

// Interface: btTransform


btTransform* EMSCRIPTEN_KEEPALIVE emscripten_bind_btTransform_btTransform_0() {
  return new btTransform();
}

btTransform* EMSCRIPTEN_KEEPALIVE emscripten_bind_btTransform_btTransform_2(btQuaternion* q, btVector3* v) {
  return new btTransform(*q, *v);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTransform_setIdentity_0(btTransform* self) {
  self->setIdentity();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTransform_setOrigin_1(btTransform* self, btVector3* origin) {
  self->setOrigin(*origin);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTransform_setRotation_1(btTransform* self, btQuaternion* rotation) {
  self->setRotation(*rotation);
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btTransform_getOrigin_0(btTransform* self) {
  return &self->getOrigin();
}

btQuaternion* EMSCRIPTEN_KEEPALIVE emscripten_bind_btTransform_getRotation_0(btTransform* self) {
  static thread_local btQuaternion temp;
  return (temp = self->getRotation(), &temp);
}

btMatrix3x3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btTransform_getBasis_0(btTransform* self) {
  return &self->getBasis();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTransform_setFromOpenGLMatrix_1(btTransform* self, float* m) {
  self->setFromOpenGLMatrix(m);
}

btTransform* EMSCRIPTEN_KEEPALIVE emscripten_bind_btTransform_inverse_0(btTransform* self) {
  static thread_local btTransform temp;
  return (temp = self->inverse(), &temp);
}

btTransform* EMSCRIPTEN_KEEPALIVE emscripten_bind_btTransform_op_mul_1(btTransform* self, btTransform* t) {
  return &(*self *= *t);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTransform___destroy___0(btTransform* self) {
  delete self;
}

// Interface: MotionState


MotionState* EMSCRIPTEN_KEEPALIVE emscripten_bind_MotionState_MotionState_0() {
  return new MotionState();
}

const void EMSCRIPTEN_KEEPALIVE emscripten_bind_MotionState_getWorldTransform_1(MotionState* self, btTransform* worldTrans) {
  self->getWorldTransform(*worldTrans);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_MotionState_setWorldTransform_1(MotionState* self, const btTransform* worldTrans) {
  self->setWorldTransform(*worldTrans);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_MotionState___destroy___0(MotionState* self) {
  delete self;
}

// Interface: btDefaultMotionState


btDefaultMotionState* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDefaultMotionState_btDefaultMotionState_0() {
  return new btDefaultMotionState();
}

btDefaultMotionState* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDefaultMotionState_btDefaultMotionState_1(btTransform* startTrans) {
  return new btDefaultMotionState(*startTrans);
}

btDefaultMotionState* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDefaultMotionState_btDefaultMotionState_2(btTransform* startTrans, btTransform* centerOfMassOffset) {
  return new btDefaultMotionState(*startTrans, *centerOfMassOffset);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDefaultMotionState_getWorldTransform_1(btDefaultMotionState* self, btTransform* worldTrans) {
  self->getWorldTransform(*worldTrans);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDefaultMotionState_setWorldTransform_1(btDefaultMotionState* self, btTransform* worldTrans) {
  self->setWorldTransform(*worldTrans);
}

btTransform* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDefaultMotionState_get_m_graphicsWorldTrans_0(btDefaultMotionState* self) {
  return &self->m_graphicsWorldTrans;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDefaultMotionState_set_m_graphicsWorldTrans_1(btDefaultMotionState* self, btTransform* arg0) {
  self->m_graphicsWorldTrans = *arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDefaultMotionState___destroy___0(btDefaultMotionState* self) {
  delete self;
}

// Interface: btCollisionObjectWrapper


const btTransform* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObjectWrapper_getWorldTransform_0(btCollisionObjectWrapper* self) {
  return &self->getWorldTransform();
}

const btCollisionObject* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObjectWrapper_getCollisionObject_0(btCollisionObjectWrapper* self) {
  return self->getCollisionObject();
}

const btCollisionShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionObjectWrapper_getCollisionShape_0(btCollisionObjectWrapper* self) {
  return self->getCollisionShape();
}

// Interface: ClosestRayResultCallback


btCollisionWorld::ClosestRayResultCallback* EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback_ClosestRayResultCallback_2(const btVector3* from, const btVector3* to) {
  return new btCollisionWorld::ClosestRayResultCallback(*from, *to);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback_hasHit_0(btCollisionWorld::ClosestRayResultCallback* self) {
  return self->hasHit();
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback_get_m_rayFromWorld_0(btCollisionWorld::ClosestRayResultCallback* self) {
  return &self->m_rayFromWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback_set_m_rayFromWorld_1(btCollisionWorld::ClosestRayResultCallback* self, btVector3* arg0) {
  self->m_rayFromWorld = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback_get_m_rayToWorld_0(btCollisionWorld::ClosestRayResultCallback* self) {
  return &self->m_rayToWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback_set_m_rayToWorld_1(btCollisionWorld::ClosestRayResultCallback* self, btVector3* arg0) {
  self->m_rayToWorld = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback_get_m_hitNormalWorld_0(btCollisionWorld::ClosestRayResultCallback* self) {
  return &self->m_hitNormalWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback_set_m_hitNormalWorld_1(btCollisionWorld::ClosestRayResultCallback* self, btVector3* arg0) {
  self->m_hitNormalWorld = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback_get_m_hitPointWorld_0(btCollisionWorld::ClosestRayResultCallback* self) {
  return &self->m_hitPointWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback_set_m_hitPointWorld_1(btCollisionWorld::ClosestRayResultCallback* self, btVector3* arg0) {
  self->m_hitPointWorld = *arg0;
}

short EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterGroup_0(btCollisionWorld::ClosestRayResultCallback* self) {
  return self->m_collisionFilterGroup;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterGroup_1(btCollisionWorld::ClosestRayResultCallback* self, short arg0) {
  self->m_collisionFilterGroup = arg0;
}

short EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback_get_m_collisionFilterMask_0(btCollisionWorld::ClosestRayResultCallback* self) {
  return self->m_collisionFilterMask;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback_set_m_collisionFilterMask_1(btCollisionWorld::ClosestRayResultCallback* self, short arg0) {
  self->m_collisionFilterMask = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback_get_m_closestHitFraction_0(btCollisionWorld::ClosestRayResultCallback* self) {
  return self->m_closestHitFraction;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback_set_m_closestHitFraction_1(btCollisionWorld::ClosestRayResultCallback* self, float arg0) {
  self->m_closestHitFraction = arg0;
}

const btCollisionObject* EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback_get_m_collisionObject_0(btCollisionWorld::ClosestRayResultCallback* self) {
  return self->m_collisionObject;
}

const void EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback_set_m_collisionObject_1(btCollisionWorld::ClosestRayResultCallback* self, btCollisionObject* arg0) {
  self->m_collisionObject = arg0;
}

unsigned int EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback_get_m_flags_0(btCollisionWorld::ClosestRayResultCallback* self) {
  return self->m_flags;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback_set_m_flags_1(btCollisionWorld::ClosestRayResultCallback* self, unsigned int arg0) {
  self->m_flags = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestRayResultCallback___destroy___0(btCollisionWorld::ClosestRayResultCallback* self) {
  delete self;
}

// Interface: btConstCollisionObjectArray


int EMSCRIPTEN_KEEPALIVE emscripten_bind_btConstCollisionObjectArray_size_0(btConstCollisionObjectArray* self) {
  return self->size();
}

const btCollisionObject* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConstCollisionObjectArray_at_1(btConstCollisionObjectArray* self, int n) {
  return self->at(n);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConstCollisionObjectArray___destroy___0(btConstCollisionObjectArray* self) {
  delete self;
}

// Interface: btScalarArray


int EMSCRIPTEN_KEEPALIVE emscripten_bind_btScalarArray_size_0(btScalarArray* self) {
  return self->size();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btScalarArray_at_1(btScalarArray* self, int n) {
  return self->at(n);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btScalarArray___destroy___0(btScalarArray* self) {
  delete self;
}

// Interface: AllHitsRayResultCallback


btCollisionWorld::AllHitsRayResultCallback* EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_AllHitsRayResultCallback_2(const btVector3* from, const btVector3* to) {
  return new btCollisionWorld::AllHitsRayResultCallback(*from, *to);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_hasHit_0(btCollisionWorld::AllHitsRayResultCallback* self) {
  return self->hasHit();
}

btConstCollisionObjectArray* EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_get_m_collisionObjects_0(btCollisionWorld::AllHitsRayResultCallback* self) {
  return &self->m_collisionObjects;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_set_m_collisionObjects_1(btCollisionWorld::AllHitsRayResultCallback* self, btConstCollisionObjectArray* arg0) {
  self->m_collisionObjects = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_get_m_rayFromWorld_0(btCollisionWorld::AllHitsRayResultCallback* self) {
  return &self->m_rayFromWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_set_m_rayFromWorld_1(btCollisionWorld::AllHitsRayResultCallback* self, btVector3* arg0) {
  self->m_rayFromWorld = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_get_m_rayToWorld_0(btCollisionWorld::AllHitsRayResultCallback* self) {
  return &self->m_rayToWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_set_m_rayToWorld_1(btCollisionWorld::AllHitsRayResultCallback* self, btVector3* arg0) {
  self->m_rayToWorld = *arg0;
}

btVector3Array* EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_get_m_hitNormalWorld_0(btCollisionWorld::AllHitsRayResultCallback* self) {
  return &self->m_hitNormalWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_set_m_hitNormalWorld_1(btCollisionWorld::AllHitsRayResultCallback* self, btVector3Array* arg0) {
  self->m_hitNormalWorld = *arg0;
}

btVector3Array* EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_get_m_hitPointWorld_0(btCollisionWorld::AllHitsRayResultCallback* self) {
  return &self->m_hitPointWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_set_m_hitPointWorld_1(btCollisionWorld::AllHitsRayResultCallback* self, btVector3Array* arg0) {
  self->m_hitPointWorld = *arg0;
}

btScalarArray* EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_get_m_hitFractions_0(btCollisionWorld::AllHitsRayResultCallback* self) {
  return &self->m_hitFractions;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_set_m_hitFractions_1(btCollisionWorld::AllHitsRayResultCallback* self, btScalarArray* arg0) {
  self->m_hitFractions = *arg0;
}

short EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterGroup_0(btCollisionWorld::AllHitsRayResultCallback* self) {
  return self->m_collisionFilterGroup;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterGroup_1(btCollisionWorld::AllHitsRayResultCallback* self, short arg0) {
  self->m_collisionFilterGroup = arg0;
}

short EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_get_m_collisionFilterMask_0(btCollisionWorld::AllHitsRayResultCallback* self) {
  return self->m_collisionFilterMask;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_set_m_collisionFilterMask_1(btCollisionWorld::AllHitsRayResultCallback* self, short arg0) {
  self->m_collisionFilterMask = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_get_m_closestHitFraction_0(btCollisionWorld::AllHitsRayResultCallback* self) {
  return self->m_closestHitFraction;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_set_m_closestHitFraction_1(btCollisionWorld::AllHitsRayResultCallback* self, float arg0) {
  self->m_closestHitFraction = arg0;
}

const btCollisionObject* EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_get_m_collisionObject_0(btCollisionWorld::AllHitsRayResultCallback* self) {
  return self->m_collisionObject;
}

const void EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_set_m_collisionObject_1(btCollisionWorld::AllHitsRayResultCallback* self, btCollisionObject* arg0) {
  self->m_collisionObject = arg0;
}

unsigned int EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_get_m_flags_0(btCollisionWorld::AllHitsRayResultCallback* self) {
  return self->m_flags;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback_set_m_flags_1(btCollisionWorld::AllHitsRayResultCallback* self, unsigned int arg0) {
  self->m_flags = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_AllHitsRayResultCallback___destroy___0(btCollisionWorld::AllHitsRayResultCallback* self) {
  delete self;
}

// Interface: btManifoldPoint


const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btManifoldPoint_getPositionWorldOnA_0(btManifoldPoint* self) {
  return &self->getPositionWorldOnA();
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btManifoldPoint_getPositionWorldOnB_0(btManifoldPoint* self) {
  return &self->getPositionWorldOnB();
}

const double EMSCRIPTEN_KEEPALIVE emscripten_bind_btManifoldPoint_getAppliedImpulse_0(btManifoldPoint* self) {
  return self->getAppliedImpulse();
}

const double EMSCRIPTEN_KEEPALIVE emscripten_bind_btManifoldPoint_getDistance_0(btManifoldPoint* self) {
  return self->getDistance();
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btManifoldPoint_get_m_localPointA_0(btManifoldPoint* self) {
  return &self->m_localPointA;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btManifoldPoint_set_m_localPointA_1(btManifoldPoint* self, btVector3* arg0) {
  self->m_localPointA = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btManifoldPoint_get_m_localPointB_0(btManifoldPoint* self) {
  return &self->m_localPointB;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btManifoldPoint_set_m_localPointB_1(btManifoldPoint* self, btVector3* arg0) {
  self->m_localPointB = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btManifoldPoint_get_m_positionWorldOnB_0(btManifoldPoint* self) {
  return &self->m_positionWorldOnB;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btManifoldPoint_set_m_positionWorldOnB_1(btManifoldPoint* self, btVector3* arg0) {
  self->m_positionWorldOnB = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btManifoldPoint_get_m_positionWorldOnA_0(btManifoldPoint* self) {
  return &self->m_positionWorldOnA;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btManifoldPoint_set_m_positionWorldOnA_1(btManifoldPoint* self, btVector3* arg0) {
  self->m_positionWorldOnA = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btManifoldPoint_get_m_normalWorldOnB_0(btManifoldPoint* self) {
  return &self->m_normalWorldOnB;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btManifoldPoint_set_m_normalWorldOnB_1(btManifoldPoint* self, btVector3* arg0) {
  self->m_normalWorldOnB = *arg0;
}

void* EMSCRIPTEN_KEEPALIVE emscripten_bind_btManifoldPoint_get_m_userPersistentData_0(btManifoldPoint* self) {
  return self->m_userPersistentData;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btManifoldPoint_set_m_userPersistentData_1(btManifoldPoint* self, void* arg0) {
  self->m_userPersistentData = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btManifoldPoint___destroy___0(btManifoldPoint* self) {
  delete self;
}

// Interface: ConcreteContactResultCallback


ConcreteContactResultCallback* EMSCRIPTEN_KEEPALIVE emscripten_bind_ConcreteContactResultCallback_ConcreteContactResultCallback_0() {
  return new ConcreteContactResultCallback();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_ConcreteContactResultCallback_addSingleResult_7(ConcreteContactResultCallback* self, btManifoldPoint* cp, const btCollisionObjectWrapper* colObj0Wrap, int partId0, int index0, const btCollisionObjectWrapper* colObj1Wrap, int partId1, int index1) {
  return self->addSingleResult(*cp, colObj0Wrap, partId0, index0, colObj1Wrap, partId1, index1);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConcreteContactResultCallback___destroy___0(ConcreteContactResultCallback* self) {
  delete self;
}

// Interface: LocalShapeInfo


int EMSCRIPTEN_KEEPALIVE emscripten_bind_LocalShapeInfo_get_m_shapePart_0(btCollisionWorld::LocalShapeInfo* self) {
  return self->m_shapePart;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_LocalShapeInfo_set_m_shapePart_1(btCollisionWorld::LocalShapeInfo* self, int arg0) {
  self->m_shapePart = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_LocalShapeInfo_get_m_triangleIndex_0(btCollisionWorld::LocalShapeInfo* self) {
  return self->m_triangleIndex;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_LocalShapeInfo_set_m_triangleIndex_1(btCollisionWorld::LocalShapeInfo* self, int arg0) {
  self->m_triangleIndex = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_LocalShapeInfo___destroy___0(btCollisionWorld::LocalShapeInfo* self) {
  delete self;
}

// Interface: LocalConvexResult


btCollisionWorld::LocalConvexResult* EMSCRIPTEN_KEEPALIVE emscripten_bind_LocalConvexResult_LocalConvexResult_5(const btCollisionObject* hitCollisionObject, btCollisionWorld::LocalShapeInfo* localShapeInfo, const btVector3* hitNormalLocal, const btVector3* hitPointLocal, float hitFraction) {
  return new btCollisionWorld::LocalConvexResult(hitCollisionObject, localShapeInfo, *hitNormalLocal, *hitPointLocal, hitFraction);
}

const btCollisionObject* EMSCRIPTEN_KEEPALIVE emscripten_bind_LocalConvexResult_get_m_hitCollisionObject_0(btCollisionWorld::LocalConvexResult* self) {
  return self->m_hitCollisionObject;
}

const void EMSCRIPTEN_KEEPALIVE emscripten_bind_LocalConvexResult_set_m_hitCollisionObject_1(btCollisionWorld::LocalConvexResult* self, btCollisionObject* arg0) {
  self->m_hitCollisionObject = arg0;
}

btCollisionWorld::LocalShapeInfo* EMSCRIPTEN_KEEPALIVE emscripten_bind_LocalConvexResult_get_m_localShapeInfo_0(btCollisionWorld::LocalConvexResult* self) {
  return self->m_localShapeInfo;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_LocalConvexResult_set_m_localShapeInfo_1(btCollisionWorld::LocalConvexResult* self, btCollisionWorld::LocalShapeInfo* arg0) {
  self->m_localShapeInfo = arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_LocalConvexResult_get_m_hitNormalLocal_0(btCollisionWorld::LocalConvexResult* self) {
  return &self->m_hitNormalLocal;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_LocalConvexResult_set_m_hitNormalLocal_1(btCollisionWorld::LocalConvexResult* self, btVector3* arg0) {
  self->m_hitNormalLocal = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_LocalConvexResult_get_m_hitPointLocal_0(btCollisionWorld::LocalConvexResult* self) {
  return &self->m_hitPointLocal;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_LocalConvexResult_set_m_hitPointLocal_1(btCollisionWorld::LocalConvexResult* self, btVector3* arg0) {
  self->m_hitPointLocal = *arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_LocalConvexResult_get_m_hitFraction_0(btCollisionWorld::LocalConvexResult* self) {
  return self->m_hitFraction;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_LocalConvexResult_set_m_hitFraction_1(btCollisionWorld::LocalConvexResult* self, float arg0) {
  self->m_hitFraction = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_LocalConvexResult___destroy___0(btCollisionWorld::LocalConvexResult* self) {
  delete self;
}

// Interface: ClosestConvexResultCallback


btCollisionWorld::ClosestConvexResultCallback* EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestConvexResultCallback_ClosestConvexResultCallback_2(const btVector3* convexFromWorld, const btVector3* convexToWorld) {
  return new btCollisionWorld::ClosestConvexResultCallback(*convexFromWorld, *convexToWorld);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestConvexResultCallback_hasHit_0(btCollisionWorld::ClosestConvexResultCallback* self) {
  return self->hasHit();
}

const btCollisionObject* EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestConvexResultCallback_get_m_hitCollisionObject_0(btCollisionWorld::ClosestConvexResultCallback* self) {
  return self->m_hitCollisionObject;
}

const void EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestConvexResultCallback_set_m_hitCollisionObject_1(btCollisionWorld::ClosestConvexResultCallback* self, btCollisionObject* arg0) {
  self->m_hitCollisionObject = arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestConvexResultCallback_get_m_convexFromWorld_0(btCollisionWorld::ClosestConvexResultCallback* self) {
  return &self->m_convexFromWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestConvexResultCallback_set_m_convexFromWorld_1(btCollisionWorld::ClosestConvexResultCallback* self, btVector3* arg0) {
  self->m_convexFromWorld = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestConvexResultCallback_get_m_convexToWorld_0(btCollisionWorld::ClosestConvexResultCallback* self) {
  return &self->m_convexToWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestConvexResultCallback_set_m_convexToWorld_1(btCollisionWorld::ClosestConvexResultCallback* self, btVector3* arg0) {
  self->m_convexToWorld = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestConvexResultCallback_get_m_hitNormalWorld_0(btCollisionWorld::ClosestConvexResultCallback* self) {
  return &self->m_hitNormalWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestConvexResultCallback_set_m_hitNormalWorld_1(btCollisionWorld::ClosestConvexResultCallback* self, btVector3* arg0) {
  self->m_hitNormalWorld = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestConvexResultCallback_get_m_hitPointWorld_0(btCollisionWorld::ClosestConvexResultCallback* self) {
  return &self->m_hitPointWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestConvexResultCallback_set_m_hitPointWorld_1(btCollisionWorld::ClosestConvexResultCallback* self, btVector3* arg0) {
  self->m_hitPointWorld = *arg0;
}

short EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterGroup_0(btCollisionWorld::ClosestConvexResultCallback* self) {
  return self->m_collisionFilterGroup;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterGroup_1(btCollisionWorld::ClosestConvexResultCallback* self, short arg0) {
  self->m_collisionFilterGroup = arg0;
}

short EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestConvexResultCallback_get_m_collisionFilterMask_0(btCollisionWorld::ClosestConvexResultCallback* self) {
  return self->m_collisionFilterMask;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestConvexResultCallback_set_m_collisionFilterMask_1(btCollisionWorld::ClosestConvexResultCallback* self, short arg0) {
  self->m_collisionFilterMask = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestConvexResultCallback_get_m_closestHitFraction_0(btCollisionWorld::ClosestConvexResultCallback* self) {
  return self->m_closestHitFraction;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestConvexResultCallback_set_m_closestHitFraction_1(btCollisionWorld::ClosestConvexResultCallback* self, float arg0) {
  self->m_closestHitFraction = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ClosestConvexResultCallback___destroy___0(btCollisionWorld::ClosestConvexResultCallback* self) {
  delete self;
}

// Interface: btConvexTriangleMeshShape


btConvexTriangleMeshShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_1(btStridingMeshInterface* meshInterface) {
  return new btConvexTriangleMeshShape(meshInterface);
}

btConvexTriangleMeshShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexTriangleMeshShape_btConvexTriangleMeshShape_2(btStridingMeshInterface* meshInterface, bool calcAabb) {
  return new btConvexTriangleMeshShape(meshInterface, calcAabb);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexTriangleMeshShape_setLocalScaling_1(btConvexTriangleMeshShape* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexTriangleMeshShape_getLocalScaling_0(btConvexTriangleMeshShape* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexTriangleMeshShape_calculateLocalInertia_2(btConvexTriangleMeshShape* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexTriangleMeshShape_setMargin_1(btConvexTriangleMeshShape* self, float margin) {
  self->setMargin(margin);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexTriangleMeshShape_getMargin_0(btConvexTriangleMeshShape* self) {
  return self->getMargin();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexTriangleMeshShape___destroy___0(btConvexTriangleMeshShape* self) {
  delete self;
}

// Interface: btBoxShape


btBoxShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btBoxShape_btBoxShape_1(btVector3* boxHalfExtents) {
  return new btBoxShape(*boxHalfExtents);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btBoxShape_setMargin_1(btBoxShape* self, float margin) {
  self->setMargin(margin);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btBoxShape_getMargin_0(btBoxShape* self) {
  return self->getMargin();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btBoxShape_setLocalScaling_1(btBoxShape* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btBoxShape_getLocalScaling_0(btBoxShape* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btBoxShape_calculateLocalInertia_2(btBoxShape* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btBoxShape___destroy___0(btBoxShape* self) {
  delete self;
}

// Interface: btCapsuleShapeX


btCapsuleShapeX* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShapeX_btCapsuleShapeX_2(float radius, float height) {
  return new btCapsuleShapeX(radius, height);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShapeX_setMargin_1(btCapsuleShapeX* self, float margin) {
  self->setMargin(margin);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShapeX_getMargin_0(btCapsuleShapeX* self) {
  return self->getMargin();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShapeX_getUpAxis_0(btCapsuleShapeX* self) {
  return self->getUpAxis();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShapeX_getRadius_0(btCapsuleShapeX* self) {
  return self->getRadius();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShapeX_getHalfHeight_0(btCapsuleShapeX* self) {
  return self->getHalfHeight();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShapeX_setLocalScaling_1(btCapsuleShapeX* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShapeX_getLocalScaling_0(btCapsuleShapeX* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShapeX_calculateLocalInertia_2(btCapsuleShapeX* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShapeX___destroy___0(btCapsuleShapeX* self) {
  delete self;
}

// Interface: btCapsuleShapeZ


btCapsuleShapeZ* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShapeZ_btCapsuleShapeZ_2(float radius, float height) {
  return new btCapsuleShapeZ(radius, height);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShapeZ_setMargin_1(btCapsuleShapeZ* self, float margin) {
  self->setMargin(margin);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShapeZ_getMargin_0(btCapsuleShapeZ* self) {
  return self->getMargin();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShapeZ_getUpAxis_0(btCapsuleShapeZ* self) {
  return self->getUpAxis();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShapeZ_getRadius_0(btCapsuleShapeZ* self) {
  return self->getRadius();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShapeZ_getHalfHeight_0(btCapsuleShapeZ* self) {
  return self->getHalfHeight();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShapeZ_setLocalScaling_1(btCapsuleShapeZ* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShapeZ_getLocalScaling_0(btCapsuleShapeZ* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShapeZ_calculateLocalInertia_2(btCapsuleShapeZ* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCapsuleShapeZ___destroy___0(btCapsuleShapeZ* self) {
  delete self;
}

// Interface: btCylinderShapeX


btCylinderShapeX* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShapeX_btCylinderShapeX_1(btVector3* halfExtents) {
  return new btCylinderShapeX(*halfExtents);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShapeX_setMargin_1(btCylinderShapeX* self, float margin) {
  self->setMargin(margin);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShapeX_getMargin_0(btCylinderShapeX* self) {
  return self->getMargin();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShapeX_setLocalScaling_1(btCylinderShapeX* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShapeX_getLocalScaling_0(btCylinderShapeX* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShapeX_calculateLocalInertia_2(btCylinderShapeX* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShapeX___destroy___0(btCylinderShapeX* self) {
  delete self;
}

// Interface: btCylinderShapeZ


btCylinderShapeZ* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShapeZ_btCylinderShapeZ_1(btVector3* halfExtents) {
  return new btCylinderShapeZ(*halfExtents);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShapeZ_setMargin_1(btCylinderShapeZ* self, float margin) {
  self->setMargin(margin);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShapeZ_getMargin_0(btCylinderShapeZ* self) {
  return self->getMargin();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShapeZ_setLocalScaling_1(btCylinderShapeZ* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShapeZ_getLocalScaling_0(btCylinderShapeZ* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShapeZ_calculateLocalInertia_2(btCylinderShapeZ* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCylinderShapeZ___destroy___0(btCylinderShapeZ* self) {
  delete self;
}

// Interface: btSphereShape


btSphereShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSphereShape_btSphereShape_1(float radius) {
  return new btSphereShape(radius);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSphereShape_setMargin_1(btSphereShape* self, float margin) {
  self->setMargin(margin);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btSphereShape_getMargin_0(btSphereShape* self) {
  return self->getMargin();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSphereShape_setLocalScaling_1(btSphereShape* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSphereShape_getLocalScaling_0(btSphereShape* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSphereShape_calculateLocalInertia_2(btSphereShape* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSphereShape___destroy___0(btSphereShape* self) {
  delete self;
}

// Interface: btMultiSphereShape


btMultiSphereShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btMultiSphereShape_btMultiSphereShape_3(const btVector3* positions, const float* radii, int numPoints) {
  return new btMultiSphereShape(positions, radii, numPoints);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btMultiSphereShape_setLocalScaling_1(btMultiSphereShape* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btMultiSphereShape_getLocalScaling_0(btMultiSphereShape* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btMultiSphereShape_calculateLocalInertia_2(btMultiSphereShape* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btMultiSphereShape___destroy___0(btMultiSphereShape* self) {
  delete self;
}

// Interface: btConeShapeX


btConeShapeX* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeShapeX_btConeShapeX_2(float radius, float height) {
  return new btConeShapeX(radius, height);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeShapeX_setLocalScaling_1(btConeShapeX* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeShapeX_getLocalScaling_0(btConeShapeX* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeShapeX_calculateLocalInertia_2(btConeShapeX* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeShapeX___destroy___0(btConeShapeX* self) {
  delete self;
}

// Interface: btConeShapeZ


btConeShapeZ* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeShapeZ_btConeShapeZ_2(float radius, float height) {
  return new btConeShapeZ(radius, height);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeShapeZ_setLocalScaling_1(btConeShapeZ* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeShapeZ_getLocalScaling_0(btConeShapeZ* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeShapeZ_calculateLocalInertia_2(btConeShapeZ* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeShapeZ___destroy___0(btConeShapeZ* self) {
  delete self;
}

// Interface: btIntArray


int EMSCRIPTEN_KEEPALIVE emscripten_bind_btIntArray_size_0(btIntArray* self) {
  return self->size();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btIntArray_at_1(btIntArray* self, int n) {
  return self->at(n);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btIntArray___destroy___0(btIntArray* self) {
  delete self;
}

// Interface: btFace


btIntArray* EMSCRIPTEN_KEEPALIVE emscripten_bind_btFace_get_m_indices_0(btFace* self) {
  return &self->m_indices;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btFace_set_m_indices_1(btFace* self, btIntArray* arg0) {
  self->m_indices = *arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btFace_get_m_plane_1(btFace* self, int arg0) {
  return self->m_plane[arg0];
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btFace_set_m_plane_2(btFace* self, int arg0, float arg1) {
  self->m_plane[arg0] = arg1;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btFace___destroy___0(btFace* self) {
  delete self;
}

// Interface: btVector3Array


int EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3Array_size_0(btVector3Array* self) {
  return self->size();
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3Array_at_1(btVector3Array* self, int n) {
  return &self->at(n);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVector3Array___destroy___0(btVector3Array* self) {
  delete self;
}

// Interface: btFaceArray


int EMSCRIPTEN_KEEPALIVE emscripten_bind_btFaceArray_size_0(btFaceArray* self) {
  return self->size();
}

const btFace* EMSCRIPTEN_KEEPALIVE emscripten_bind_btFaceArray_at_1(btFaceArray* self, int n) {
  return &self->at(n);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btFaceArray___destroy___0(btFaceArray* self) {
  delete self;
}

// Interface: btConvexPolyhedron


btVector3Array* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexPolyhedron_get_m_vertices_0(btConvexPolyhedron* self) {
  return &self->m_vertices;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexPolyhedron_set_m_vertices_1(btConvexPolyhedron* self, btVector3Array* arg0) {
  self->m_vertices = *arg0;
}

btFaceArray* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexPolyhedron_get_m_faces_0(btConvexPolyhedron* self) {
  return &self->m_faces;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexPolyhedron_set_m_faces_1(btConvexPolyhedron* self, btFaceArray* arg0) {
  self->m_faces = *arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexPolyhedron___destroy___0(btConvexPolyhedron* self) {
  delete self;
}

// Interface: btConvexHullShape


btConvexHullShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexHullShape_btConvexHullShape_0() {
  return new btConvexHullShape();
}

btConvexHullShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexHullShape_btConvexHullShape_1(const float* points) {
  return new btConvexHullShape(points);
}

btConvexHullShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexHullShape_btConvexHullShape_2(const float* points, int numPoints) {
  return new btConvexHullShape(points, numPoints);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexHullShape_addPoint_1(btConvexHullShape* self, const btVector3* point) {
  self->addPoint(*point);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexHullShape_addPoint_2(btConvexHullShape* self, const btVector3* point, bool recalculateLocalAABB) {
  self->addPoint(*point, recalculateLocalAABB);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexHullShape_setMargin_1(btConvexHullShape* self, float margin) {
  self->setMargin(margin);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexHullShape_getMargin_0(btConvexHullShape* self) {
  return self->getMargin();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexHullShape_getNumVertices_0(btConvexHullShape* self) {
  return self->getNumVertices();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexHullShape_initializePolyhedralFeatures_1(btConvexHullShape* self, int shiftVerticesByMargin) {
  return self->initializePolyhedralFeatures(shiftVerticesByMargin);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexHullShape_recalcLocalAabb_0(btConvexHullShape* self) {
  self->recalcLocalAabb();
}

const btConvexPolyhedron* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexHullShape_getConvexPolyhedron_0(btConvexHullShape* self) {
  return self->getConvexPolyhedron();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexHullShape_setLocalScaling_1(btConvexHullShape* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexHullShape_getLocalScaling_0(btConvexHullShape* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexHullShape_calculateLocalInertia_2(btConvexHullShape* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConvexHullShape___destroy___0(btConvexHullShape* self) {
  delete self;
}

// Interface: btShapeHull


btShapeHull* EMSCRIPTEN_KEEPALIVE emscripten_bind_btShapeHull_btShapeHull_1(btConvexShape* shape) {
  return new btShapeHull(shape);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btShapeHull_buildHull_1(btShapeHull* self, float margin) {
  return self->buildHull(margin);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btShapeHull_numVertices_0(btShapeHull* self) {
  return self->numVertices();
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btShapeHull_getVertexPointer_0(btShapeHull* self) {
  return self->getVertexPointer();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btShapeHull___destroy___0(btShapeHull* self) {
  delete self;
}

// Interface: btCompoundShape


btCompoundShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCompoundShape_btCompoundShape_0() {
  return new btCompoundShape();
}

btCompoundShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCompoundShape_btCompoundShape_1(bool enableDynamicAabbTree) {
  return new btCompoundShape(enableDynamicAabbTree);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCompoundShape_addChildShape_2(btCompoundShape* self, const btTransform* localTransform, btCollisionShape* shape) {
  self->addChildShape(*localTransform, shape);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCompoundShape_removeChildShape_1(btCompoundShape* self, btCollisionShape* shape) {
  self->removeChildShape(shape);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCompoundShape_removeChildShapeByIndex_1(btCompoundShape* self, int childShapeindex) {
  self->removeChildShapeByIndex(childShapeindex);
}

const int EMSCRIPTEN_KEEPALIVE emscripten_bind_btCompoundShape_getNumChildShapes_0(btCompoundShape* self) {
  return self->getNumChildShapes();
}

btCollisionShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCompoundShape_getChildShape_1(btCompoundShape* self, int index) {
  return self->getChildShape(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCompoundShape_updateChildTransform_2(btCompoundShape* self, int childIndex, const btTransform* newChildTransform) {
  self->updateChildTransform(childIndex, *newChildTransform);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCompoundShape_updateChildTransform_3(btCompoundShape* self, int childIndex, const btTransform* newChildTransform, bool shouldRecalculateLocalAabb) {
  self->updateChildTransform(childIndex, *newChildTransform, shouldRecalculateLocalAabb);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCompoundShape_setMargin_1(btCompoundShape* self, float margin) {
  self->setMargin(margin);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btCompoundShape_getMargin_0(btCompoundShape* self) {
  return self->getMargin();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCompoundShape_setLocalScaling_1(btCompoundShape* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCompoundShape_getLocalScaling_0(btCompoundShape* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCompoundShape_calculateLocalInertia_2(btCompoundShape* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCompoundShape___destroy___0(btCompoundShape* self) {
  delete self;
}

// Interface: btIndexedMesh


int EMSCRIPTEN_KEEPALIVE emscripten_bind_btIndexedMesh_get_m_numTriangles_0(btIndexedMesh* self) {
  return self->m_numTriangles;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btIndexedMesh_set_m_numTriangles_1(btIndexedMesh* self, int arg0) {
  self->m_numTriangles = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btIndexedMesh___destroy___0(btIndexedMesh* self) {
  delete self;
}

// Interface: btIndexedMeshArray


int EMSCRIPTEN_KEEPALIVE emscripten_bind_btIndexedMeshArray_size_0(btIndexedMeshArray* self) {
  return self->size();
}

const btIndexedMesh* EMSCRIPTEN_KEEPALIVE emscripten_bind_btIndexedMeshArray_at_1(btIndexedMeshArray* self, int n) {
  return &self->at(n);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btIndexedMeshArray___destroy___0(btIndexedMeshArray* self) {
  delete self;
}

// Interface: btTriangleMesh


btTriangleMesh* EMSCRIPTEN_KEEPALIVE emscripten_bind_btTriangleMesh_btTriangleMesh_0() {
  return new btTriangleMesh();
}

btTriangleMesh* EMSCRIPTEN_KEEPALIVE emscripten_bind_btTriangleMesh_btTriangleMesh_1(bool use32bitIndices) {
  return new btTriangleMesh(use32bitIndices);
}

btTriangleMesh* EMSCRIPTEN_KEEPALIVE emscripten_bind_btTriangleMesh_btTriangleMesh_2(bool use32bitIndices, bool use4componentVertices) {
  return new btTriangleMesh(use32bitIndices, use4componentVertices);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTriangleMesh_addTriangle_3(btTriangleMesh* self, const btVector3* vertex0, const btVector3* vertex1, const btVector3* vertex2) {
  self->addTriangle(*vertex0, *vertex1, *vertex2);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTriangleMesh_addTriangle_4(btTriangleMesh* self, const btVector3* vertex0, const btVector3* vertex1, const btVector3* vertex2, bool removeDuplicateVertices) {
  self->addTriangle(*vertex0, *vertex1, *vertex2, removeDuplicateVertices);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btTriangleMesh_findOrAddVertex_2(btTriangleMesh* self, const btVector3* vertex, bool removeDuplicateVertices) {
  return self->findOrAddVertex(*vertex, removeDuplicateVertices);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTriangleMesh_addIndex_1(btTriangleMesh* self, int index) {
  self->addIndex(index);
}

btIndexedMeshArray* EMSCRIPTEN_KEEPALIVE emscripten_bind_btTriangleMesh_getIndexedMeshArray_0(btTriangleMesh* self) {
  return &self->getIndexedMeshArray();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTriangleMesh_setScaling_1(btTriangleMesh* self, const btVector3* scaling) {
  self->setScaling(*scaling);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTriangleMesh___destroy___0(btTriangleMesh* self) {
  delete self;
}

// Interface: btEmptyShape


btEmptyShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btEmptyShape_btEmptyShape_0() {
  return new btEmptyShape();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btEmptyShape_setLocalScaling_1(btEmptyShape* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btEmptyShape_getLocalScaling_0(btEmptyShape* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btEmptyShape_calculateLocalInertia_2(btEmptyShape* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btEmptyShape___destroy___0(btEmptyShape* self) {
  delete self;
}

// Interface: btStaticPlaneShape


btStaticPlaneShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btStaticPlaneShape_btStaticPlaneShape_2(const btVector3* planeNormal, float planeConstant) {
  return new btStaticPlaneShape(*planeNormal, planeConstant);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btStaticPlaneShape_setLocalScaling_1(btStaticPlaneShape* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btStaticPlaneShape_getLocalScaling_0(btStaticPlaneShape* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btStaticPlaneShape_calculateLocalInertia_2(btStaticPlaneShape* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btStaticPlaneShape___destroy___0(btStaticPlaneShape* self) {
  delete self;
}

// Interface: btBvhTriangleMeshShape


btBvhTriangleMeshShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_2(btStridingMeshInterface* meshInterface, bool useQuantizedAabbCompression) {
  return new btBvhTriangleMeshShape(meshInterface, useQuantizedAabbCompression);
}

btBvhTriangleMeshShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btBvhTriangleMeshShape_btBvhTriangleMeshShape_3(btStridingMeshInterface* meshInterface, bool useQuantizedAabbCompression, bool buildBvh) {
  return new btBvhTriangleMeshShape(meshInterface, useQuantizedAabbCompression, buildBvh);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btBvhTriangleMeshShape_setLocalScaling_1(btBvhTriangleMeshShape* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btBvhTriangleMeshShape_getLocalScaling_0(btBvhTriangleMeshShape* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btBvhTriangleMeshShape_calculateLocalInertia_2(btBvhTriangleMeshShape* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btBvhTriangleMeshShape___destroy___0(btBvhTriangleMeshShape* self) {
  delete self;
}

// Interface: btHeightfieldTerrainShape


btHeightfieldTerrainShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btHeightfieldTerrainShape_btHeightfieldTerrainShape_9(int heightStickWidth, int heightStickLength, void* heightfieldData, float heightScale, float minHeight, float maxHeight, int upAxis, PHY_ScalarType hdt, bool flipQuadEdges) {
  return new btHeightfieldTerrainShape(heightStickWidth, heightStickLength, heightfieldData, heightScale, minHeight, maxHeight, upAxis, hdt, flipQuadEdges);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btHeightfieldTerrainShape_setMargin_1(btHeightfieldTerrainShape* self, float margin) {
  self->setMargin(margin);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btHeightfieldTerrainShape_getMargin_0(btHeightfieldTerrainShape* self) {
  return self->getMargin();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btHeightfieldTerrainShape_setLocalScaling_1(btHeightfieldTerrainShape* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btHeightfieldTerrainShape_getLocalScaling_0(btHeightfieldTerrainShape* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btHeightfieldTerrainShape_calculateLocalInertia_2(btHeightfieldTerrainShape* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btHeightfieldTerrainShape___destroy___0(btHeightfieldTerrainShape* self) {
  delete self;
}

// Interface: btAABB


btAABB* EMSCRIPTEN_KEEPALIVE emscripten_bind_btAABB_btAABB_4(const btVector3* V1, const btVector3* V2, const btVector3* V3, float margin) {
  return new btAABB(*V1, *V2, *V3, margin);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btAABB_invalidate_0(btAABB* self) {
  self->invalidate();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btAABB_increment_margin_1(btAABB* self, float margin) {
  self->increment_margin(margin);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btAABB_copy_with_margin_2(btAABB* self, const btAABB* other, float margin) {
  self->copy_with_margin(*other, margin);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btAABB___destroy___0(btAABB* self) {
  delete self;
}

// Interface: btPrimitiveTriangle


btPrimitiveTriangle* EMSCRIPTEN_KEEPALIVE emscripten_bind_btPrimitiveTriangle_btPrimitiveTriangle_0() {
  return new btPrimitiveTriangle();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPrimitiveTriangle___destroy___0(btPrimitiveTriangle* self) {
  delete self;
}

// Interface: btTriangleShapeEx


btTriangleShapeEx* EMSCRIPTEN_KEEPALIVE emscripten_bind_btTriangleShapeEx_btTriangleShapeEx_3(const btVector3* p1, const btVector3* p2, const btVector3* p3) {
  return new btTriangleShapeEx(*p1, *p2, *p3);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTriangleShapeEx_getAabb_3(btTriangleShapeEx* self, const btTransform* t, btVector3* aabbMin, btVector3* aabbMax) {
  self->getAabb(*t, *aabbMin, *aabbMax);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTriangleShapeEx_applyTransform_1(btTriangleShapeEx* self, const btTransform* t) {
  self->applyTransform(*t);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTriangleShapeEx_buildTriPlane_1(btTriangleShapeEx* self, btVector4* plane) {
  self->buildTriPlane(*plane);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTriangleShapeEx___destroy___0(btTriangleShapeEx* self) {
  delete self;
}

// Interface: btTetrahedronShapeEx


btTetrahedronShapeEx* EMSCRIPTEN_KEEPALIVE emscripten_bind_btTetrahedronShapeEx_btTetrahedronShapeEx_0() {
  return new btTetrahedronShapeEx();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTetrahedronShapeEx_setVertices_4(btTetrahedronShapeEx* self, const btVector3* v0, const btVector3* v1, const btVector3* v2, const btVector3* v3) {
  self->setVertices(*v0, *v1, *v2, *v3);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btTetrahedronShapeEx___destroy___0(btTetrahedronShapeEx* self) {
  delete self;
}

// Interface: CompoundPrimitiveManager


int EMSCRIPTEN_KEEPALIVE emscripten_bind_CompoundPrimitiveManager_get_primitive_count_0(btGImpactCompoundShape::CompoundPrimitiveManager* self) {
  return self->get_primitive_count();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_CompoundPrimitiveManager_get_primitive_box_2(btGImpactCompoundShape::CompoundPrimitiveManager* self, int prim_index, btAABB* primbox) {
  self->get_primitive_box(prim_index, *primbox);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_CompoundPrimitiveManager_get_primitive_triangle_2(btGImpactCompoundShape::CompoundPrimitiveManager* self, int prim_index, btPrimitiveTriangle* triangle) {
  self->get_primitive_triangle(prim_index, *triangle);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_CompoundPrimitiveManager_is_trimesh_0(btGImpactCompoundShape::CompoundPrimitiveManager* self) {
  return self->is_trimesh();
}

btGImpactCompoundShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_CompoundPrimitiveManager_get_m_compoundShape_0(btGImpactCompoundShape::CompoundPrimitiveManager* self) {
  return self->m_compoundShape;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_CompoundPrimitiveManager_set_m_compoundShape_1(btGImpactCompoundShape::CompoundPrimitiveManager* self, btGImpactCompoundShape* arg0) {
  self->m_compoundShape = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_CompoundPrimitiveManager___destroy___0(btGImpactCompoundShape::CompoundPrimitiveManager* self) {
  delete self;
}

// Interface: btGImpactCompoundShape


btGImpactCompoundShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_0() {
  return new btGImpactCompoundShape();
}

btGImpactCompoundShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_btGImpactCompoundShape_1(bool children_has_transform) {
  return new btGImpactCompoundShape(children_has_transform);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_childrenHasTransform_0(btGImpactCompoundShape* self) {
  return self->childrenHasTransform();
}

const btPrimitiveManagerBase* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_getPrimitiveManager_0(btGImpactCompoundShape* self) {
  return self->getPrimitiveManager();
}

btGImpactCompoundShape::CompoundPrimitiveManager* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_getCompoundPrimitiveManager_0(btGImpactCompoundShape* self) {
  return self->getCompoundPrimitiveManager();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_getNumChildShapes_0(btGImpactCompoundShape* self) {
  return self->getNumChildShapes();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_addChildShape_2(btGImpactCompoundShape* self, const btTransform* localTransform, btCollisionShape* shape) {
  self->addChildShape(*localTransform, shape);
}

btCollisionShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_getChildShape_1(btGImpactCompoundShape* self, int index) {
  return self->getChildShape(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_getChildAabb_4(btGImpactCompoundShape* self, int child_index, const btTransform* t, btVector3* aabbMin, btVector3* aabbMax) {
  self->getChildAabb(child_index, *t, *aabbMin, *aabbMax);
}

btTransform* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_getChildTransform_1(btGImpactCompoundShape* self, int index) {
  static thread_local btTransform temp;
  return (temp = self->getChildTransform(index), &temp);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_setChildTransform_2(btGImpactCompoundShape* self, int index, const btTransform* transform) {
  self->setChildTransform(index, *transform);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_calculateLocalInertia_2(btGImpactCompoundShape* self, float mass, btVector3* inertia) {
  self->calculateLocalInertia(mass, *inertia);
}

const char* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_getName_0(btGImpactCompoundShape* self) {
  return self->getName();
}

eGIMPACT_SHAPE_TYPE EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_getGImpactShapeType_0(btGImpactCompoundShape* self) {
  return self->getGImpactShapeType();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_setLocalScaling_1(btGImpactCompoundShape* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_getLocalScaling_0(btGImpactCompoundShape* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_updateBound_0(btGImpactCompoundShape* self) {
  self->updateBound();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_postUpdate_0(btGImpactCompoundShape* self) {
  self->postUpdate();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_getShapeType_0(btGImpactCompoundShape* self) {
  return self->getShapeType();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_needsRetrieveTriangles_0(btGImpactCompoundShape* self) {
  return self->needsRetrieveTriangles();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_needsRetrieveTetrahedrons_0(btGImpactCompoundShape* self) {
  return self->needsRetrieveTetrahedrons();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_getBulletTriangle_2(btGImpactCompoundShape* self, int prim_index, btTriangleShapeEx* triangle) {
  self->getBulletTriangle(prim_index, *triangle);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape_getBulletTetrahedron_2(btGImpactCompoundShape* self, int prim_index, btTetrahedronShapeEx* tetrahedron) {
  self->getBulletTetrahedron(prim_index, *tetrahedron);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCompoundShape___destroy___0(btGImpactCompoundShape* self) {
  delete self;
}

// Interface: TrimeshPrimitiveManager


btGImpactMeshShapePart::TrimeshPrimitiveManager* EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_0() {
  return new btGImpactMeshShapePart::TrimeshPrimitiveManager();
}

btGImpactMeshShapePart::TrimeshPrimitiveManager* EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_TrimeshPrimitiveManager_1(const btGImpactMeshShapePart::TrimeshPrimitiveManager* manager) {
  return new btGImpactMeshShapePart::TrimeshPrimitiveManager(*manager);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_lock_0(btGImpactMeshShapePart::TrimeshPrimitiveManager* self) {
  self->lock();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_unlock_0(btGImpactMeshShapePart::TrimeshPrimitiveManager* self) {
  self->unlock();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_is_trimesh_0(btGImpactMeshShapePart::TrimeshPrimitiveManager* self) {
  return self->is_trimesh();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_get_vertex_count_0(btGImpactMeshShapePart::TrimeshPrimitiveManager* self) {
  return self->get_vertex_count();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_get_indices_4(btGImpactMeshShapePart::TrimeshPrimitiveManager* self, int face_index, unsigned int i0, unsigned int i1, unsigned int i2) {
  self->get_indices(face_index, i0, i1, i2);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_get_vertex_2(btGImpactMeshShapePart::TrimeshPrimitiveManager* self, unsigned int vertex_index, btVector3* vertex) {
  self->get_vertex(vertex_index, *vertex);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_get_bullet_triangle_2(btGImpactMeshShapePart::TrimeshPrimitiveManager* self, int prim_index, btTriangleShapeEx* triangle) {
  self->get_bullet_triangle(prim_index, *triangle);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_get_m_margin_0(btGImpactMeshShapePart::TrimeshPrimitiveManager* self) {
  return self->m_margin;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_set_m_margin_1(btGImpactMeshShapePart::TrimeshPrimitiveManager* self, float arg0) {
  self->m_margin = arg0;
}

btStridingMeshInterface* EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_get_m_meshInterface_0(btGImpactMeshShapePart::TrimeshPrimitiveManager* self) {
  return self->m_meshInterface;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_set_m_meshInterface_1(btGImpactMeshShapePart::TrimeshPrimitiveManager* self, btStridingMeshInterface* arg0) {
  self->m_meshInterface = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_get_m_part_0(btGImpactMeshShapePart::TrimeshPrimitiveManager* self) {
  return self->m_part;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_set_m_part_1(btGImpactMeshShapePart::TrimeshPrimitiveManager* self, int arg0) {
  self->m_part = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_get_m_lock_count_0(btGImpactMeshShapePart::TrimeshPrimitiveManager* self) {
  return self->m_lock_count;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_set_m_lock_count_1(btGImpactMeshShapePart::TrimeshPrimitiveManager* self, int arg0) {
  self->m_lock_count = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_get_numverts_0(btGImpactMeshShapePart::TrimeshPrimitiveManager* self) {
  return self->numverts;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_set_numverts_1(btGImpactMeshShapePart::TrimeshPrimitiveManager* self, int arg0) {
  self->numverts = arg0;
}

PHY_ScalarType EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_get_type_0(btGImpactMeshShapePart::TrimeshPrimitiveManager* self) {
  return self->type;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_set_type_1(btGImpactMeshShapePart::TrimeshPrimitiveManager* self, PHY_ScalarType arg0) {
  self->type = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_get_stride_0(btGImpactMeshShapePart::TrimeshPrimitiveManager* self) {
  return self->stride;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_set_stride_1(btGImpactMeshShapePart::TrimeshPrimitiveManager* self, int arg0) {
  self->stride = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_get_indexstride_0(btGImpactMeshShapePart::TrimeshPrimitiveManager* self) {
  return self->indexstride;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_set_indexstride_1(btGImpactMeshShapePart::TrimeshPrimitiveManager* self, int arg0) {
  self->indexstride = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_get_numfaces_0(btGImpactMeshShapePart::TrimeshPrimitiveManager* self) {
  return self->numfaces;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_set_numfaces_1(btGImpactMeshShapePart::TrimeshPrimitiveManager* self, int arg0) {
  self->numfaces = arg0;
}

PHY_ScalarType EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_get_indicestype_0(btGImpactMeshShapePart::TrimeshPrimitiveManager* self) {
  return self->indicestype;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager_set_indicestype_1(btGImpactMeshShapePart::TrimeshPrimitiveManager* self, PHY_ScalarType arg0) {
  self->indicestype = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_TrimeshPrimitiveManager___destroy___0(btGImpactMeshShapePart::TrimeshPrimitiveManager* self) {
  delete self;
}

// Interface: btGImpactMeshShapePart


btGImpactMeshShapePart* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShapePart_btGImpactMeshShapePart_2(btStridingMeshInterface* meshInterface, int part) {
  return new btGImpactMeshShapePart(meshInterface, part);
}

btGImpactMeshShapePart::TrimeshPrimitiveManager* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShapePart_getTrimeshPrimitiveManager_0(btGImpactMeshShapePart* self) {
  return self->getTrimeshPrimitiveManager();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShapePart_getVertexCount_0(btGImpactMeshShapePart* self) {
  return self->getVertexCount();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShapePart_getVertex_2(btGImpactMeshShapePart* self, int vertex_index, btVector3* vertex) {
  self->getVertex(vertex_index, *vertex);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShapePart_getPart_0(btGImpactMeshShapePart* self) {
  return self->getPart();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShapePart_setLocalScaling_1(btGImpactMeshShapePart* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShapePart_getLocalScaling_0(btGImpactMeshShapePart* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShapePart_updateBound_0(btGImpactMeshShapePart* self) {
  self->updateBound();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShapePart_postUpdate_0(btGImpactMeshShapePart* self) {
  self->postUpdate();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShapePart_getShapeType_0(btGImpactMeshShapePart* self) {
  return self->getShapeType();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShapePart_needsRetrieveTriangles_0(btGImpactMeshShapePart* self) {
  return self->needsRetrieveTriangles();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShapePart_needsRetrieveTetrahedrons_0(btGImpactMeshShapePart* self) {
  return self->needsRetrieveTetrahedrons();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShapePart_getBulletTriangle_2(btGImpactMeshShapePart* self, int prim_index, btTriangleShapeEx* triangle) {
  self->getBulletTriangle(prim_index, *triangle);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShapePart_getBulletTetrahedron_2(btGImpactMeshShapePart* self, int prim_index, btTetrahedronShapeEx* tetrahedron) {
  self->getBulletTetrahedron(prim_index, *tetrahedron);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShapePart___destroy___0(btGImpactMeshShapePart* self) {
  delete self;
}

// Interface: btGImpactMeshShape


btGImpactMeshShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShape_btGImpactMeshShape_1(btStridingMeshInterface* meshInterface) {
  return new btGImpactMeshShape(meshInterface);
}

const btStridingMeshInterface* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShape_getMeshInterface_0(btGImpactMeshShape* self) {
  return self->getMeshInterface();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShape_getMeshPartCount_0(btGImpactMeshShape* self) {
  return self->getMeshPartCount();
}

const btGImpactMeshShapePart* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShape_getMeshPart_1(btGImpactMeshShape* self, int index) {
  return self->getMeshPart(index);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShape_calculateSerializeBufferSize_0(btGImpactMeshShape* self) {
  return self->calculateSerializeBufferSize();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShape_setLocalScaling_1(btGImpactMeshShape* self, const btVector3* scaling) {
  self->setLocalScaling(*scaling);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShape_getLocalScaling_0(btGImpactMeshShape* self) {
  return &self->getLocalScaling();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShape_updateBound_0(btGImpactMeshShape* self) {
  self->updateBound();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShape_postUpdate_0(btGImpactMeshShape* self) {
  self->postUpdate();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShape_getShapeType_0(btGImpactMeshShape* self) {
  return self->getShapeType();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShape_needsRetrieveTriangles_0(btGImpactMeshShape* self) {
  return self->needsRetrieveTriangles();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShape_needsRetrieveTetrahedrons_0(btGImpactMeshShape* self) {
  return self->needsRetrieveTetrahedrons();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShape_getBulletTriangle_2(btGImpactMeshShape* self, int prim_index, btTriangleShapeEx* triangle) {
  self->getBulletTriangle(prim_index, *triangle);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShape_getBulletTetrahedron_2(btGImpactMeshShape* self, int prim_index, btTetrahedronShapeEx* tetrahedron) {
  self->getBulletTetrahedron(prim_index, *tetrahedron);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactMeshShape___destroy___0(btGImpactMeshShape* self) {
  delete self;
}

// Interface: btCollisionAlgorithmConstructionInfo


btCollisionAlgorithmConstructionInfo* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_0() {
  return new btCollisionAlgorithmConstructionInfo();
}

btCollisionAlgorithmConstructionInfo* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionAlgorithmConstructionInfo_btCollisionAlgorithmConstructionInfo_2(btDispatcher* dispatcher, int temp) {
  return new btCollisionAlgorithmConstructionInfo(dispatcher, temp);
}

btDispatcher* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_dispatcher1_0(btCollisionAlgorithmConstructionInfo* self) {
  return self->m_dispatcher1;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_dispatcher1_1(btCollisionAlgorithmConstructionInfo* self, btDispatcher* arg0) {
  self->m_dispatcher1 = arg0;
}

btPersistentManifold* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionAlgorithmConstructionInfo_get_m_manifold_0(btCollisionAlgorithmConstructionInfo* self) {
  return self->m_manifold;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionAlgorithmConstructionInfo_set_m_manifold_1(btCollisionAlgorithmConstructionInfo* self, btPersistentManifold* arg0) {
  self->m_manifold = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionAlgorithmConstructionInfo___destroy___0(btCollisionAlgorithmConstructionInfo* self) {
  delete self;
}

// Interface: btGImpactCollisionAlgorithm


btGImpactCollisionAlgorithm* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCollisionAlgorithm_btGImpactCollisionAlgorithm_3(const btCollisionAlgorithmConstructionInfo* ci, const btCollisionObjectWrapper* body0Wrap, const btCollisionObjectWrapper* body1Wrap) {
  return new btGImpactCollisionAlgorithm(*ci, body0Wrap, body1Wrap);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCollisionAlgorithm_registerAlgorithm_1(btCollisionDispatcher* dispatcher) {
  btGImpactCollisionAlgorithm::registerAlgorithm(dispatcher);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGImpactCollisionAlgorithm___destroy___0(btGImpactCollisionAlgorithm* self) {
  delete self;
}

// Interface: btDefaultCollisionConstructionInfo


btDefaultCollisionConstructionInfo* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDefaultCollisionConstructionInfo_btDefaultCollisionConstructionInfo_0() {
  return new btDefaultCollisionConstructionInfo();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDefaultCollisionConstructionInfo___destroy___0(btDefaultCollisionConstructionInfo* self) {
  delete self;
}

// Interface: btPersistentManifold


btPersistentManifold* EMSCRIPTEN_KEEPALIVE emscripten_bind_btPersistentManifold_btPersistentManifold_0() {
  return new btPersistentManifold();
}

const btCollisionObject* EMSCRIPTEN_KEEPALIVE emscripten_bind_btPersistentManifold_getBody0_0(btPersistentManifold* self) {
  return self->getBody0();
}

const btCollisionObject* EMSCRIPTEN_KEEPALIVE emscripten_bind_btPersistentManifold_getBody1_0(btPersistentManifold* self) {
  return self->getBody1();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btPersistentManifold_getNumContacts_0(btPersistentManifold* self) {
  return self->getNumContacts();
}

btManifoldPoint* EMSCRIPTEN_KEEPALIVE emscripten_bind_btPersistentManifold_getContactPoint_1(btPersistentManifold* self, int index) {
  return &self->getContactPoint(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPersistentManifold___destroy___0(btPersistentManifold* self) {
  delete self;
}

// Interface: btCollisionDispatcher


btCollisionDispatcher* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionDispatcher_btCollisionDispatcher_1(btDefaultCollisionConfiguration* conf) {
  return new btCollisionDispatcher(conf);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionDispatcher_getNumManifolds_0(btCollisionDispatcher* self) {
  return self->getNumManifolds();
}

btPersistentManifold* EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionDispatcher_getManifoldByIndexInternal_1(btCollisionDispatcher* self, int index) {
  return self->getManifoldByIndexInternal(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionDispatcher___destroy___0(btCollisionDispatcher* self) {
  delete self;
}

// Interface: btOverlappingPairCallback


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btOverlappingPairCallback_removeOverlappingPairsContainingProxy_2(btOverlappingPairCallback* self, btBroadphaseProxy* proxy, btDispatcher* dispatcher) {
  self->removeOverlappingPairsContainingProxy(proxy, dispatcher);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btOverlappingPairCallback___destroy___0(btOverlappingPairCallback* self) {
  delete self;
}

// Interface: btOverlappingPairCache


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btOverlappingPairCache_setInternalGhostPairCallback_1(btOverlappingPairCache* self, btOverlappingPairCallback* ghostPairCallback) {
  self->setInternalGhostPairCallback(ghostPairCallback);
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btOverlappingPairCache_getNumOverlappingPairs_0(btOverlappingPairCache* self) {
  return self->getNumOverlappingPairs();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btOverlappingPairCache___destroy___0(btOverlappingPairCache* self) {
  delete self;
}

// Interface: btAxisSweep3


btAxisSweep3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btAxisSweep3_btAxisSweep3_2(btVector3* worldAabbMin, btVector3* worldAabbMax) {
  return new btAxisSweep3(*worldAabbMin, *worldAabbMax);
}

btAxisSweep3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btAxisSweep3_btAxisSweep3_3(btVector3* worldAabbMin, btVector3* worldAabbMax, int maxHandles) {
  return new btAxisSweep3(*worldAabbMin, *worldAabbMax, maxHandles);
}

btAxisSweep3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btAxisSweep3_btAxisSweep3_4(btVector3* worldAabbMin, btVector3* worldAabbMax, int maxHandles, btOverlappingPairCache* pairCache) {
  return new btAxisSweep3(*worldAabbMin, *worldAabbMax, maxHandles, pairCache);
}

btAxisSweep3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btAxisSweep3_btAxisSweep3_5(btVector3* worldAabbMin, btVector3* worldAabbMax, int maxHandles, btOverlappingPairCache* pairCache, bool disableRaycastAccelerator) {
  return new btAxisSweep3(*worldAabbMin, *worldAabbMax, maxHandles, pairCache, disableRaycastAccelerator);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btAxisSweep3___destroy___0(btAxisSweep3* self) {
  delete self;
}

// Interface: btBroadphaseInterface


btOverlappingPairCache* EMSCRIPTEN_KEEPALIVE emscripten_bind_btBroadphaseInterface_getOverlappingPairCache_0(btBroadphaseInterface* self) {
  return self->getOverlappingPairCache();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btBroadphaseInterface___destroy___0(btBroadphaseInterface* self) {
  delete self;
}

// Interface: btCollisionConfiguration


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btCollisionConfiguration___destroy___0(btCollisionConfiguration* self) {
  delete self;
}

// Interface: btDbvtBroadphase


btDbvtBroadphase* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDbvtBroadphase_btDbvtBroadphase_0() {
  return new btDbvtBroadphase();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDbvtBroadphase___destroy___0(btDbvtBroadphase* self) {
  delete self;
}

// Interface: btBroadphaseProxy


int EMSCRIPTEN_KEEPALIVE emscripten_bind_btBroadphaseProxy_get_m_collisionFilterGroup_0(btBroadphaseProxy* self) {
  return self->m_collisionFilterGroup;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btBroadphaseProxy_set_m_collisionFilterGroup_1(btBroadphaseProxy* self, int arg0) {
  self->m_collisionFilterGroup = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btBroadphaseProxy_get_m_collisionFilterMask_0(btBroadphaseProxy* self) {
  return self->m_collisionFilterMask;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btBroadphaseProxy_set_m_collisionFilterMask_1(btBroadphaseProxy* self, int arg0) {
  self->m_collisionFilterMask = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btBroadphaseProxy___destroy___0(btBroadphaseProxy* self) {
  delete self;
}

// Interface: btRigidBodyConstructionInfo


btRigidBody::btRigidBodyConstructionInfo* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_3(float mass, btMotionState* motionState, btCollisionShape* collisionShape) {
  return new btRigidBody::btRigidBodyConstructionInfo(mass, motionState, collisionShape);
}

btRigidBody::btRigidBodyConstructionInfo* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_btRigidBodyConstructionInfo_4(float mass, btMotionState* motionState, btCollisionShape* collisionShape, btVector3* localInertia) {
  return new btRigidBody::btRigidBodyConstructionInfo(mass, motionState, collisionShape, *localInertia);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_get_m_linearDamping_0(btRigidBody::btRigidBodyConstructionInfo* self) {
  return self->m_linearDamping;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_set_m_linearDamping_1(btRigidBody::btRigidBodyConstructionInfo* self, float arg0) {
  self->m_linearDamping = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_get_m_angularDamping_0(btRigidBody::btRigidBodyConstructionInfo* self) {
  return self->m_angularDamping;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_set_m_angularDamping_1(btRigidBody::btRigidBodyConstructionInfo* self, float arg0) {
  self->m_angularDamping = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_get_m_friction_0(btRigidBody::btRigidBodyConstructionInfo* self) {
  return self->m_friction;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_set_m_friction_1(btRigidBody::btRigidBodyConstructionInfo* self, float arg0) {
  self->m_friction = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_get_m_rollingFriction_0(btRigidBody::btRigidBodyConstructionInfo* self) {
  return self->m_rollingFriction;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_set_m_rollingFriction_1(btRigidBody::btRigidBodyConstructionInfo* self, float arg0) {
  self->m_rollingFriction = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_get_m_restitution_0(btRigidBody::btRigidBodyConstructionInfo* self) {
  return self->m_restitution;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_set_m_restitution_1(btRigidBody::btRigidBodyConstructionInfo* self, float arg0) {
  self->m_restitution = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_get_m_linearSleepingThreshold_0(btRigidBody::btRigidBodyConstructionInfo* self) {
  return self->m_linearSleepingThreshold;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_set_m_linearSleepingThreshold_1(btRigidBody::btRigidBodyConstructionInfo* self, float arg0) {
  self->m_linearSleepingThreshold = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_get_m_angularSleepingThreshold_0(btRigidBody::btRigidBodyConstructionInfo* self) {
  return self->m_angularSleepingThreshold;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_set_m_angularSleepingThreshold_1(btRigidBody::btRigidBodyConstructionInfo* self, float arg0) {
  self->m_angularSleepingThreshold = arg0;
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDamping_0(btRigidBody::btRigidBodyConstructionInfo* self) {
  return self->m_additionalDamping;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDamping_1(btRigidBody::btRigidBodyConstructionInfo* self, bool arg0) {
  self->m_additionalDamping = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalDampingFactor_0(btRigidBody::btRigidBodyConstructionInfo* self) {
  return self->m_additionalDampingFactor;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalDampingFactor_1(btRigidBody::btRigidBodyConstructionInfo* self, float arg0) {
  self->m_additionalDampingFactor = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalLinearDampingThresholdSqr_0(btRigidBody::btRigidBodyConstructionInfo* self) {
  return self->m_additionalLinearDampingThresholdSqr;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalLinearDampingThresholdSqr_1(btRigidBody::btRigidBodyConstructionInfo* self, float arg0) {
  self->m_additionalLinearDampingThresholdSqr = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingThresholdSqr_0(btRigidBody::btRigidBodyConstructionInfo* self) {
  return self->m_additionalAngularDampingThresholdSqr;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingThresholdSqr_1(btRigidBody::btRigidBodyConstructionInfo* self, float arg0) {
  self->m_additionalAngularDampingThresholdSqr = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_get_m_additionalAngularDampingFactor_0(btRigidBody::btRigidBodyConstructionInfo* self) {
  return self->m_additionalAngularDampingFactor;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo_set_m_additionalAngularDampingFactor_1(btRigidBody::btRigidBodyConstructionInfo* self, float arg0) {
  self->m_additionalAngularDampingFactor = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBodyConstructionInfo___destroy___0(btRigidBody::btRigidBodyConstructionInfo* self) {
  delete self;
}

// Interface: btRigidBody


btRigidBody* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_btRigidBody_1(const btRigidBody::btRigidBodyConstructionInfo* constructionInfo) {
  return new btRigidBody(*constructionInfo);
}

const btTransform* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getCenterOfMassTransform_0(btRigidBody* self) {
  return &self->getCenterOfMassTransform();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setCenterOfMassTransform_1(btRigidBody* self, const btTransform* xform) {
  self->setCenterOfMassTransform(*xform);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setSleepingThresholds_2(btRigidBody* self, float linear, float angular) {
  self->setSleepingThresholds(linear, angular);
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getLinearDamping_0(btRigidBody* self) {
  return self->getLinearDamping();
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getAngularDamping_0(btRigidBody* self) {
  return self->getAngularDamping();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setDamping_2(btRigidBody* self, float lin_damping, float ang_damping) {
  self->setDamping(lin_damping, ang_damping);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setMassProps_2(btRigidBody* self, float mass, const btVector3* inertia) {
  self->setMassProps(mass, *inertia);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getLinearFactor_0(btRigidBody* self) {
  return &self->getLinearFactor();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setLinearFactor_1(btRigidBody* self, const btVector3* linearFactor) {
  self->setLinearFactor(*linearFactor);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_applyTorque_1(btRigidBody* self, const btVector3* torque) {
  self->applyTorque(*torque);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_applyLocalTorque_1(btRigidBody* self, const btVector3* torque) {
  self->applyLocalTorque(*torque);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_applyForce_2(btRigidBody* self, const btVector3* force, const btVector3* rel_pos) {
  self->applyForce(*force, *rel_pos);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_applyCentralForce_1(btRigidBody* self, const btVector3* force) {
  self->applyCentralForce(*force);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_applyCentralLocalForce_1(btRigidBody* self, const btVector3* force) {
  self->applyCentralLocalForce(*force);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_applyTorqueImpulse_1(btRigidBody* self, const btVector3* torque) {
  self->applyTorqueImpulse(*torque);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_applyImpulse_2(btRigidBody* self, const btVector3* impulse, const btVector3* rel_pos) {
  self->applyImpulse(*impulse, *rel_pos);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_applyCentralImpulse_1(btRigidBody* self, const btVector3* impulse) {
  self->applyCentralImpulse(*impulse);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_updateInertiaTensor_0(btRigidBody* self) {
  self->updateInertiaTensor();
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getLinearVelocity_0(btRigidBody* self) {
  return &self->getLinearVelocity();
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getAngularVelocity_0(btRigidBody* self) {
  return &self->getAngularVelocity();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setLinearVelocity_1(btRigidBody* self, const btVector3* lin_vel) {
  self->setLinearVelocity(*lin_vel);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setAngularVelocity_1(btRigidBody* self, const btVector3* ang_vel) {
  self->setAngularVelocity(*ang_vel);
}

btMotionState* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getMotionState_0(btRigidBody* self) {
  return self->getMotionState();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setMotionState_1(btRigidBody* self, btMotionState* motionState) {
  self->setMotionState(motionState);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getAngularFactor_0(btRigidBody* self) {
  return &self->getAngularFactor();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setAngularFactor_1(btRigidBody* self, const btVector3* angularFactor) {
  self->setAngularFactor(*angularFactor);
}

btRigidBody* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_upcast_1(btRigidBody* self, btCollisionObject* colObj) {
  return self->upcast(colObj);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getAabb_2(btRigidBody* self, btVector3* aabbMin, btVector3* aabbMax) {
  self->getAabb(*aabbMin, *aabbMax);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_applyGravity_0(btRigidBody* self) {
  self->applyGravity();
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getGravity_0(btRigidBody* self) {
  return &self->getGravity();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setGravity_1(btRigidBody* self, const btVector3* acceleration) {
  self->setGravity(*acceleration);
}

const btBroadphaseProxy* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getBroadphaseProxy_0(btRigidBody* self) {
  return self->getBroadphaseProxy();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_clearForces_0(btRigidBody* self) {
  self->clearForces();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setFlags_1(btRigidBody* self, int flags) {
  self->setFlags(flags);
}

const int EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getFlags_0(btRigidBody* self) {
  return self->getFlags();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setAnisotropicFriction_2(btRigidBody* self, const btVector3* anisotropicFriction, int frictionMode) {
  self->setAnisotropicFriction(*anisotropicFriction, frictionMode);
}

btCollisionShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getCollisionShape_0(btRigidBody* self) {
  return self->getCollisionShape();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setContactProcessingThreshold_1(btRigidBody* self, float contactProcessingThreshold) {
  self->setContactProcessingThreshold(contactProcessingThreshold);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setActivationState_1(btRigidBody* self, int newState) {
  self->setActivationState(newState);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_forceActivationState_1(btRigidBody* self, int newState) {
  self->forceActivationState(newState);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_activate_0(btRigidBody* self) {
  self->activate();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_activate_1(btRigidBody* self, bool forceActivation) {
  self->activate(forceActivation);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_isActive_0(btRigidBody* self) {
  return self->isActive();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_isKinematicObject_0(btRigidBody* self) {
  return self->isKinematicObject();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_isStaticObject_0(btRigidBody* self) {
  return self->isStaticObject();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_isStaticOrKinematicObject_0(btRigidBody* self) {
  return self->isStaticOrKinematicObject();
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getRestitution_0(btRigidBody* self) {
  return self->getRestitution();
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getFriction_0(btRigidBody* self) {
  return self->getFriction();
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getRollingFriction_0(btRigidBody* self) {
  return self->getRollingFriction();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setRestitution_1(btRigidBody* self, float rest) {
  self->setRestitution(rest);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setFriction_1(btRigidBody* self, float frict) {
  self->setFriction(frict);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setRollingFriction_1(btRigidBody* self, float frict) {
  self->setRollingFriction(frict);
}

btTransform* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getWorldTransform_0(btRigidBody* self) {
  return &self->getWorldTransform();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getCollisionFlags_0(btRigidBody* self) {
  return self->getCollisionFlags();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setCollisionFlags_1(btRigidBody* self, int flags) {
  self->setCollisionFlags(flags);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setWorldTransform_1(btRigidBody* self, const btTransform* worldTrans) {
  self->setWorldTransform(*worldTrans);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setCollisionShape_1(btRigidBody* self, btCollisionShape* collisionShape) {
  self->setCollisionShape(collisionShape);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setCcdMotionThreshold_1(btRigidBody* self, float ccdMotionThreshold) {
  self->setCcdMotionThreshold(ccdMotionThreshold);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setCcdSweptSphereRadius_1(btRigidBody* self, float radius) {
  self->setCcdSweptSphereRadius(radius);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getUserIndex_0(btRigidBody* self) {
  return self->getUserIndex();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setUserIndex_1(btRigidBody* self, int index) {
  self->setUserIndex(index);
}

void* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getUserPointer_0(btRigidBody* self) {
  return self->getUserPointer();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_setUserPointer_1(btRigidBody* self, void* userPointer) {
  self->setUserPointer(userPointer);
}

const btBroadphaseProxy* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody_getBroadphaseHandle_0(btRigidBody* self) {
  return self->getBroadphaseHandle();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRigidBody___destroy___0(btRigidBody* self) {
  delete self;
}

// Interface: btConstraintSetting


btConstraintSetting* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConstraintSetting_btConstraintSetting_0() {
  return new btConstraintSetting();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btConstraintSetting_get_m_tau_0(btConstraintSetting* self) {
  return self->m_tau;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConstraintSetting_set_m_tau_1(btConstraintSetting* self, float arg0) {
  self->m_tau = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btConstraintSetting_get_m_damping_0(btConstraintSetting* self) {
  return self->m_damping;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConstraintSetting_set_m_damping_1(btConstraintSetting* self, float arg0) {
  self->m_damping = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btConstraintSetting_get_m_impulseClamp_0(btConstraintSetting* self) {
  return self->m_impulseClamp;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConstraintSetting_set_m_impulseClamp_1(btConstraintSetting* self, float arg0) {
  self->m_impulseClamp = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConstraintSetting___destroy___0(btConstraintSetting* self) {
  delete self;
}

// Interface: btPoint2PointConstraint


btPoint2PointConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_2(btRigidBody* rbA, btVector3* rbB) {
  return new btPoint2PointConstraint(*rbA, *rbB);
}

btPoint2PointConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_btPoint2PointConstraint_btPoint2PointConstraint_4(btRigidBody* rbA, btRigidBody* rbB, btVector3* pivotInA, btVector3* pivotInB) {
  return new btPoint2PointConstraint(*rbA, *rbB, *pivotInA, *pivotInB);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPoint2PointConstraint_setPivotA_1(btPoint2PointConstraint* self, const btVector3* pivotA) {
  self->setPivotA(*pivotA);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPoint2PointConstraint_setPivotB_1(btPoint2PointConstraint* self, const btVector3* pivotB) {
  self->setPivotB(*pivotB);
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btPoint2PointConstraint_getPivotInA_0(btPoint2PointConstraint* self) {
  return &self->getPivotInA();
}

const btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btPoint2PointConstraint_getPivotInB_0(btPoint2PointConstraint* self) {
  return &self->getPivotInB();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPoint2PointConstraint_enableFeedback_1(btPoint2PointConstraint* self, bool needsFeedback) {
  self->enableFeedback(needsFeedback);
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btPoint2PointConstraint_getBreakingImpulseThreshold_0(btPoint2PointConstraint* self) {
  return self->getBreakingImpulseThreshold();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPoint2PointConstraint_setBreakingImpulseThreshold_1(btPoint2PointConstraint* self, const float threshold) {
  self->setBreakingImpulseThreshold(threshold);
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btPoint2PointConstraint_getParam_2(btPoint2PointConstraint* self, int num, int axis) {
  return self->getParam(num, axis);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPoint2PointConstraint_setParam_3(btPoint2PointConstraint* self, int num, float value, int axis) {
  self->setParam(num, value, axis);
}

btConstraintSetting* EMSCRIPTEN_KEEPALIVE emscripten_bind_btPoint2PointConstraint_get_m_setting_0(btPoint2PointConstraint* self) {
  return &self->m_setting;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPoint2PointConstraint_set_m_setting_1(btPoint2PointConstraint* self, btConstraintSetting* arg0) {
  self->m_setting = *arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPoint2PointConstraint___destroy___0(btPoint2PointConstraint* self) {
  delete self;
}

// Interface: btGeneric6DofSpringConstraint


btGeneric6DofSpringConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_3(btRigidBody* rbA, btTransform* rbB, bool frameInA) {
  return new btGeneric6DofSpringConstraint(*rbA, *rbB, frameInA);
}

btGeneric6DofSpringConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofSpringConstraint_btGeneric6DofSpringConstraint_5(btRigidBody* rbA, btRigidBody* rbB, btTransform* frameInA, btTransform* frameInB, bool useLinearFrameReferenceFrameA) {
  return new btGeneric6DofSpringConstraint(*rbA, *rbB, *frameInA, *frameInB, useLinearFrameReferenceFrameA);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofSpringConstraint_enableSpring_2(btGeneric6DofSpringConstraint* self, int index, bool onOff) {
  self->enableSpring(index, onOff);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofSpringConstraint_setStiffness_2(btGeneric6DofSpringConstraint* self, int index, float stiffness) {
  self->setStiffness(index, stiffness);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofSpringConstraint_setDamping_2(btGeneric6DofSpringConstraint* self, int index, float damping) {
  self->setDamping(index, damping);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_0(btGeneric6DofSpringConstraint* self) {
  self->setEquilibriumPoint();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_1(btGeneric6DofSpringConstraint* self, int index) {
  self->setEquilibriumPoint(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofSpringConstraint_setEquilibriumPoint_2(btGeneric6DofSpringConstraint* self, int index, float val) {
  self->setEquilibriumPoint(index, val);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofSpringConstraint_setLinearLowerLimit_1(btGeneric6DofSpringConstraint* self, const btVector3* linearLower) {
  self->setLinearLowerLimit(*linearLower);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofSpringConstraint_setLinearUpperLimit_1(btGeneric6DofSpringConstraint* self, const btVector3* linearUpper) {
  self->setLinearUpperLimit(*linearUpper);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofSpringConstraint_setAngularLowerLimit_1(btGeneric6DofSpringConstraint* self, const btVector3* angularLower) {
  self->setAngularLowerLimit(*angularLower);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofSpringConstraint_setAngularUpperLimit_1(btGeneric6DofSpringConstraint* self, const btVector3* angularUpper) {
  self->setAngularUpperLimit(*angularUpper);
}

const btTransform* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofSpringConstraint_getFrameOffsetA_0(btGeneric6DofSpringConstraint* self) {
  return &self->getFrameOffsetA();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofSpringConstraint_enableFeedback_1(btGeneric6DofSpringConstraint* self, bool needsFeedback) {
  self->enableFeedback(needsFeedback);
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofSpringConstraint_getBreakingImpulseThreshold_0(btGeneric6DofSpringConstraint* self) {
  return self->getBreakingImpulseThreshold();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofSpringConstraint_setBreakingImpulseThreshold_1(btGeneric6DofSpringConstraint* self, const float threshold) {
  self->setBreakingImpulseThreshold(threshold);
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofSpringConstraint_getParam_2(btGeneric6DofSpringConstraint* self, int num, int axis) {
  return self->getParam(num, axis);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofSpringConstraint_setParam_3(btGeneric6DofSpringConstraint* self, int num, float value, int axis) {
  self->setParam(num, value, axis);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGeneric6DofSpringConstraint___destroy___0(btGeneric6DofSpringConstraint* self) {
  delete self;
}

// Interface: btSequentialImpulseConstraintSolver


btSequentialImpulseConstraintSolver* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSequentialImpulseConstraintSolver_btSequentialImpulseConstraintSolver_0() {
  return new btSequentialImpulseConstraintSolver();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSequentialImpulseConstraintSolver___destroy___0(btSequentialImpulseConstraintSolver* self) {
  delete self;
}

// Interface: btConeTwistConstraint


btConeTwistConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_2(btRigidBody* rbA, btTransform* rbB) {
  return new btConeTwistConstraint(*rbA, *rbB);
}

btConeTwistConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeTwistConstraint_btConeTwistConstraint_4(btRigidBody* rbA, btRigidBody* rbB, btTransform* rbAFrame, btTransform* rbBFrame) {
  return new btConeTwistConstraint(*rbA, *rbB, *rbAFrame, *rbBFrame);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeTwistConstraint_setLimit_2(btConeTwistConstraint* self, int limitIndex, float limitValue) {
  self->setLimit(limitIndex, limitValue);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeTwistConstraint_setAngularOnly_1(btConeTwistConstraint* self, bool angularOnly) {
  self->setAngularOnly(angularOnly);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeTwistConstraint_setDamping_1(btConeTwistConstraint* self, float damping) {
  self->setDamping(damping);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeTwistConstraint_enableMotor_1(btConeTwistConstraint* self, bool b) {
  self->enableMotor(b);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeTwistConstraint_setMaxMotorImpulse_1(btConeTwistConstraint* self, float maxMotorImpulse) {
  self->setMaxMotorImpulse(maxMotorImpulse);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeTwistConstraint_setMaxMotorImpulseNormalized_1(btConeTwistConstraint* self, float maxMotorImpulse) {
  self->setMaxMotorImpulseNormalized(maxMotorImpulse);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeTwistConstraint_setMotorTarget_1(btConeTwistConstraint* self, const btQuaternion* q) {
  self->setMotorTarget(*q);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeTwistConstraint_setMotorTargetInConstraintSpace_1(btConeTwistConstraint* self, const btQuaternion* q) {
  self->setMotorTargetInConstraintSpace(*q);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeTwistConstraint_enableFeedback_1(btConeTwistConstraint* self, bool needsFeedback) {
  self->enableFeedback(needsFeedback);
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeTwistConstraint_getBreakingImpulseThreshold_0(btConeTwistConstraint* self) {
  return self->getBreakingImpulseThreshold();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeTwistConstraint_setBreakingImpulseThreshold_1(btConeTwistConstraint* self, const float threshold) {
  self->setBreakingImpulseThreshold(threshold);
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeTwistConstraint_getParam_2(btConeTwistConstraint* self, int num, int axis) {
  return self->getParam(num, axis);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeTwistConstraint_setParam_3(btConeTwistConstraint* self, int num, float value, int axis) {
  self->setParam(num, value, axis);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConeTwistConstraint___destroy___0(btConeTwistConstraint* self) {
  delete self;
}

// Interface: btHingeConstraint


btHingeConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_btHingeConstraint_btHingeConstraint_2(btRigidBody* rbA, btTransform* rbB) {
  return new btHingeConstraint(*rbA, *rbB);
}

btHingeConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_btHingeConstraint_btHingeConstraint_3(btRigidBody* rbA, btTransform* rbB, bool pivotInA) {
  return new btHingeConstraint(*rbA, *rbB, pivotInA);
}

btHingeConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_btHingeConstraint_btHingeConstraint_4(btRigidBody* rbA, btRigidBody* rbB, btTransform* pivotInA, btTransform* pivotInB) {
  return new btHingeConstraint(*rbA, *rbB, *pivotInA, *pivotInB);
}

btHingeConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_btHingeConstraint_btHingeConstraint_5(btRigidBody* rbA, btRigidBody* rbB, btTransform* pivotInA, btTransform* pivotInB, bool axisInA) {
  return new btHingeConstraint(*rbA, *rbB, *pivotInA, *pivotInB, axisInA);
}

btHingeConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_btHingeConstraint_btHingeConstraint_6(btRigidBody* rbA, btRigidBody* rbB, btVector3* pivotInA, btVector3* pivotInB, btVector3* axisInA, btVector3* axisInB) {
  return new btHingeConstraint(*rbA, *rbB, *pivotInA, *pivotInB, *axisInA, *axisInB);
}

btHingeConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_btHingeConstraint_btHingeConstraint_7(btRigidBody* rbA, btRigidBody* rbB, btVector3* pivotInA, btVector3* pivotInB, btVector3* axisInA, btVector3* axisInB, bool useReferenceFrameA) {
  return new btHingeConstraint(*rbA, *rbB, *pivotInA, *pivotInB, *axisInA, *axisInB, useReferenceFrameA);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btHingeConstraint_getHingeAngle_0(btHingeConstraint* self) {
  return self->getHingeAngle();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btHingeConstraint_setLimit_4(btHingeConstraint* self, float low, float high, float softness, float biasFactor) {
  self->setLimit(low, high, softness, biasFactor);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btHingeConstraint_setLimit_5(btHingeConstraint* self, float low, float high, float softness, float biasFactor, float relaxationFactor) {
  self->setLimit(low, high, softness, biasFactor, relaxationFactor);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btHingeConstraint_enableAngularMotor_3(btHingeConstraint* self, bool enableMotor, float targetVelocity, float maxMotorImpulse) {
  self->enableAngularMotor(enableMotor, targetVelocity, maxMotorImpulse);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btHingeConstraint_setAngularOnly_1(btHingeConstraint* self, bool angularOnly) {
  self->setAngularOnly(angularOnly);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btHingeConstraint_enableMotor_1(btHingeConstraint* self, bool enableMotor) {
  self->enableMotor(enableMotor);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btHingeConstraint_setMaxMotorImpulse_1(btHingeConstraint* self, float maxMotorImpulse) {
  self->setMaxMotorImpulse(maxMotorImpulse);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btHingeConstraint_setMotorTarget_2(btHingeConstraint* self, float targetAngle, float dt) {
  self->setMotorTarget(targetAngle, dt);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btHingeConstraint_enableFeedback_1(btHingeConstraint* self, bool needsFeedback) {
  self->enableFeedback(needsFeedback);
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btHingeConstraint_getBreakingImpulseThreshold_0(btHingeConstraint* self) {
  return self->getBreakingImpulseThreshold();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btHingeConstraint_setBreakingImpulseThreshold_1(btHingeConstraint* self, const float threshold) {
  self->setBreakingImpulseThreshold(threshold);
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btHingeConstraint_getParam_2(btHingeConstraint* self, int num, int axis) {
  return self->getParam(num, axis);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btHingeConstraint_setParam_3(btHingeConstraint* self, int num, float value, int axis) {
  self->setParam(num, value, axis);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btHingeConstraint___destroy___0(btHingeConstraint* self) {
  delete self;
}

// Interface: btSliderConstraint


btSliderConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSliderConstraint_btSliderConstraint_3(btRigidBody* rbA, const btTransform* rbB, bool frameInA) {
  return new btSliderConstraint(*rbA, *rbB, frameInA);
}

btSliderConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSliderConstraint_btSliderConstraint_5(btRigidBody* rbA, btRigidBody* rbB, const btTransform* frameInA, const btTransform* frameInB, bool useLinearReferenceFrameA) {
  return new btSliderConstraint(*rbA, *rbB, *frameInA, *frameInB, useLinearReferenceFrameA);
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btSliderConstraint_getLinearPos_0(btSliderConstraint* self) {
  return self->getLinearPos();
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btSliderConstraint_getAngularPos_0(btSliderConstraint* self) {
  return self->getAngularPos();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSliderConstraint_setLowerLinLimit_1(btSliderConstraint* self, float lowerLimit) {
  self->setLowerLinLimit(lowerLimit);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSliderConstraint_setUpperLinLimit_1(btSliderConstraint* self, float upperLimit) {
  self->setUpperLinLimit(upperLimit);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSliderConstraint_setLowerAngLimit_1(btSliderConstraint* self, float lowerAngLimit) {
  self->setLowerAngLimit(lowerAngLimit);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSliderConstraint_setUpperAngLimit_1(btSliderConstraint* self, float upperAngLimit) {
  self->setUpperAngLimit(upperAngLimit);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSliderConstraint_setPoweredLinMotor_1(btSliderConstraint* self, bool onOff) {
  self->setPoweredLinMotor(onOff);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSliderConstraint_setMaxLinMotorForce_1(btSliderConstraint* self, float maxLinMotorForce) {
  self->setMaxLinMotorForce(maxLinMotorForce);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSliderConstraint_setTargetLinMotorVelocity_1(btSliderConstraint* self, float targetLinMotorVelocity) {
  self->setTargetLinMotorVelocity(targetLinMotorVelocity);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSliderConstraint_enableFeedback_1(btSliderConstraint* self, bool needsFeedback) {
  self->enableFeedback(needsFeedback);
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btSliderConstraint_getBreakingImpulseThreshold_0(btSliderConstraint* self) {
  return self->getBreakingImpulseThreshold();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSliderConstraint_setBreakingImpulseThreshold_1(btSliderConstraint* self, const float threshold) {
  self->setBreakingImpulseThreshold(threshold);
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btSliderConstraint_getParam_2(btSliderConstraint* self, int num, int axis) {
  return self->getParam(num, axis);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSliderConstraint_setParam_3(btSliderConstraint* self, int num, float value, int axis) {
  self->setParam(num, value, axis);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSliderConstraint___destroy___0(btSliderConstraint* self) {
  delete self;
}

// Interface: btFixedConstraint


btFixedConstraint* EMSCRIPTEN_KEEPALIVE emscripten_bind_btFixedConstraint_btFixedConstraint_4(btRigidBody* rbA, btRigidBody* rbB, const btTransform* frameInA, const btTransform* frameInB) {
  return new btFixedConstraint(*rbA, *rbB, *frameInA, *frameInB);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btFixedConstraint_enableFeedback_1(btFixedConstraint* self, bool needsFeedback) {
  self->enableFeedback(needsFeedback);
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btFixedConstraint_getBreakingImpulseThreshold_0(btFixedConstraint* self) {
  return self->getBreakingImpulseThreshold();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btFixedConstraint_setBreakingImpulseThreshold_1(btFixedConstraint* self, const float threshold) {
  self->setBreakingImpulseThreshold(threshold);
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btFixedConstraint_getParam_2(btFixedConstraint* self, int num, int axis) {
  return self->getParam(num, axis);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btFixedConstraint_setParam_3(btFixedConstraint* self, int num, float value, int axis) {
  self->setParam(num, value, axis);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btFixedConstraint___destroy___0(btFixedConstraint* self) {
  delete self;
}

// Interface: btConstraintSolver


void EMSCRIPTEN_KEEPALIVE emscripten_bind_btConstraintSolver___destroy___0(btConstraintSolver* self) {
  delete self;
}

// Interface: btDispatcherInfo


float EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_get_m_timeStep_0(btDispatcherInfo* self) {
  return self->m_timeStep;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_set_m_timeStep_1(btDispatcherInfo* self, float arg0) {
  self->m_timeStep = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_get_m_stepCount_0(btDispatcherInfo* self) {
  return self->m_stepCount;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_set_m_stepCount_1(btDispatcherInfo* self, int arg0) {
  self->m_stepCount = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_get_m_dispatchFunc_0(btDispatcherInfo* self) {
  return self->m_dispatchFunc;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_set_m_dispatchFunc_1(btDispatcherInfo* self, int arg0) {
  self->m_dispatchFunc = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_get_m_timeOfImpact_0(btDispatcherInfo* self) {
  return self->m_timeOfImpact;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_set_m_timeOfImpact_1(btDispatcherInfo* self, float arg0) {
  self->m_timeOfImpact = arg0;
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_get_m_useContinuous_0(btDispatcherInfo* self) {
  return self->m_useContinuous;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_set_m_useContinuous_1(btDispatcherInfo* self, bool arg0) {
  self->m_useContinuous = arg0;
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_get_m_enableSatConvex_0(btDispatcherInfo* self) {
  return self->m_enableSatConvex;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_set_m_enableSatConvex_1(btDispatcherInfo* self, bool arg0) {
  self->m_enableSatConvex = arg0;
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_get_m_enableSPU_0(btDispatcherInfo* self) {
  return self->m_enableSPU;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_set_m_enableSPU_1(btDispatcherInfo* self, bool arg0) {
  self->m_enableSPU = arg0;
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_get_m_useEpa_0(btDispatcherInfo* self) {
  return self->m_useEpa;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_set_m_useEpa_1(btDispatcherInfo* self, bool arg0) {
  self->m_useEpa = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_get_m_allowedCcdPenetration_0(btDispatcherInfo* self) {
  return self->m_allowedCcdPenetration;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_set_m_allowedCcdPenetration_1(btDispatcherInfo* self, float arg0) {
  self->m_allowedCcdPenetration = arg0;
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_get_m_useConvexConservativeDistanceUtil_0(btDispatcherInfo* self) {
  return self->m_useConvexConservativeDistanceUtil;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_set_m_useConvexConservativeDistanceUtil_1(btDispatcherInfo* self, bool arg0) {
  self->m_useConvexConservativeDistanceUtil = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_get_m_convexConservativeDistanceThreshold_0(btDispatcherInfo* self) {
  return self->m_convexConservativeDistanceThreshold;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo_set_m_convexConservativeDistanceThreshold_1(btDispatcherInfo* self, float arg0) {
  self->m_convexConservativeDistanceThreshold = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDispatcherInfo___destroy___0(btDispatcherInfo* self) {
  delete self;
}

// Interface: btContactSolverInfo


bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btContactSolverInfo_get_m_splitImpulse_0(btContactSolverInfo* self) {
  return self->m_splitImpulse;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btContactSolverInfo_set_m_splitImpulse_1(btContactSolverInfo* self, bool arg0) {
  self->m_splitImpulse = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btContactSolverInfo_get_m_splitImpulsePenetrationThreshold_0(btContactSolverInfo* self) {
  return self->m_splitImpulsePenetrationThreshold;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btContactSolverInfo_set_m_splitImpulsePenetrationThreshold_1(btContactSolverInfo* self, int arg0) {
  self->m_splitImpulsePenetrationThreshold = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btContactSolverInfo_get_m_numIterations_0(btContactSolverInfo* self) {
  return self->m_numIterations;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btContactSolverInfo_set_m_numIterations_1(btContactSolverInfo* self, int arg0) {
  self->m_numIterations = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btContactSolverInfo___destroy___0(btContactSolverInfo* self) {
  delete self;
}

// Interface: btVehicleTuning


btRaycastVehicle::btVehicleTuning* EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleTuning_btVehicleTuning_0() {
  return new btRaycastVehicle::btVehicleTuning();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleTuning_get_m_suspensionStiffness_0(btRaycastVehicle::btVehicleTuning* self) {
  return self->m_suspensionStiffness;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleTuning_set_m_suspensionStiffness_1(btRaycastVehicle::btVehicleTuning* self, float arg0) {
  self->m_suspensionStiffness = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleTuning_get_m_suspensionCompression_0(btRaycastVehicle::btVehicleTuning* self) {
  return self->m_suspensionCompression;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleTuning_set_m_suspensionCompression_1(btRaycastVehicle::btVehicleTuning* self, float arg0) {
  self->m_suspensionCompression = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleTuning_get_m_suspensionDamping_0(btRaycastVehicle::btVehicleTuning* self) {
  return self->m_suspensionDamping;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleTuning_set_m_suspensionDamping_1(btRaycastVehicle::btVehicleTuning* self, float arg0) {
  self->m_suspensionDamping = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleTuning_get_m_maxSuspensionTravelCm_0(btRaycastVehicle::btVehicleTuning* self) {
  return self->m_maxSuspensionTravelCm;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleTuning_set_m_maxSuspensionTravelCm_1(btRaycastVehicle::btVehicleTuning* self, float arg0) {
  self->m_maxSuspensionTravelCm = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleTuning_get_m_frictionSlip_0(btRaycastVehicle::btVehicleTuning* self) {
  return self->m_frictionSlip;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleTuning_set_m_frictionSlip_1(btRaycastVehicle::btVehicleTuning* self, float arg0) {
  self->m_frictionSlip = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleTuning_get_m_maxSuspensionForce_0(btRaycastVehicle::btVehicleTuning* self) {
  return self->m_maxSuspensionForce;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleTuning_set_m_maxSuspensionForce_1(btRaycastVehicle::btVehicleTuning* self, float arg0) {
  self->m_maxSuspensionForce = arg0;
}

// Interface: btVehicleRaycasterResult


btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleRaycasterResult_get_m_hitPointInWorld_0(btDefaultVehicleRaycaster::btVehicleRaycasterResult* self) {
  return &self->m_hitPointInWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleRaycasterResult_set_m_hitPointInWorld_1(btDefaultVehicleRaycaster::btVehicleRaycasterResult* self, btVector3* arg0) {
  self->m_hitPointInWorld = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleRaycasterResult_get_m_hitNormalInWorld_0(btDefaultVehicleRaycaster::btVehicleRaycasterResult* self) {
  return &self->m_hitNormalInWorld;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleRaycasterResult_set_m_hitNormalInWorld_1(btDefaultVehicleRaycaster::btVehicleRaycasterResult* self, btVector3* arg0) {
  self->m_hitNormalInWorld = *arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleRaycasterResult_get_m_distFraction_0(btDefaultVehicleRaycaster::btVehicleRaycasterResult* self) {
  return self->m_distFraction;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleRaycasterResult_set_m_distFraction_1(btDefaultVehicleRaycaster::btVehicleRaycasterResult* self, float arg0) {
  self->m_distFraction = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btVehicleRaycasterResult___destroy___0(btDefaultVehicleRaycaster::btVehicleRaycasterResult* self) {
  delete self;
}

// Interface: btDefaultVehicleRaycaster


btDefaultVehicleRaycaster* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDefaultVehicleRaycaster_btDefaultVehicleRaycaster_1(btDynamicsWorld* world) {
  return new btDefaultVehicleRaycaster(world);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDefaultVehicleRaycaster_castRay_3(btDefaultVehicleRaycaster* self, const btVector3* from, const btVector3* to, btDefaultVehicleRaycaster::btVehicleRaycasterResult* result) {
  self->castRay(*from, *to, *result);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDefaultVehicleRaycaster___destroy___0(btDefaultVehicleRaycaster* self) {
  delete self;
}

// Interface: RaycastInfo


btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastInfo_get_m_contactNormalWS_0(btWheelInfo::RaycastInfo* self) {
  return &self->m_contactNormalWS;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastInfo_set_m_contactNormalWS_1(btWheelInfo::RaycastInfo* self, btVector3* arg0) {
  self->m_contactNormalWS = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastInfo_get_m_contactPointWS_0(btWheelInfo::RaycastInfo* self) {
  return &self->m_contactPointWS;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastInfo_set_m_contactPointWS_1(btWheelInfo::RaycastInfo* self, btVector3* arg0) {
  self->m_contactPointWS = *arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastInfo_get_m_suspensionLength_0(btWheelInfo::RaycastInfo* self) {
  return self->m_suspensionLength;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastInfo_set_m_suspensionLength_1(btWheelInfo::RaycastInfo* self, float arg0) {
  self->m_suspensionLength = arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastInfo_get_m_hardPointWS_0(btWheelInfo::RaycastInfo* self) {
  return &self->m_hardPointWS;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastInfo_set_m_hardPointWS_1(btWheelInfo::RaycastInfo* self, btVector3* arg0) {
  self->m_hardPointWS = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastInfo_get_m_wheelDirectionWS_0(btWheelInfo::RaycastInfo* self) {
  return &self->m_wheelDirectionWS;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastInfo_set_m_wheelDirectionWS_1(btWheelInfo::RaycastInfo* self, btVector3* arg0) {
  self->m_wheelDirectionWS = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastInfo_get_m_wheelAxleWS_0(btWheelInfo::RaycastInfo* self) {
  return &self->m_wheelAxleWS;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastInfo_set_m_wheelAxleWS_1(btWheelInfo::RaycastInfo* self, btVector3* arg0) {
  self->m_wheelAxleWS = *arg0;
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastInfo_get_m_isInContact_0(btWheelInfo::RaycastInfo* self) {
  return self->m_isInContact;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastInfo_set_m_isInContact_1(btWheelInfo::RaycastInfo* self, bool arg0) {
  self->m_isInContact = arg0;
}

void* EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastInfo_get_m_groundObject_0(btWheelInfo::RaycastInfo* self) {
  return self->m_groundObject;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastInfo_set_m_groundObject_1(btWheelInfo::RaycastInfo* self, void* arg0) {
  self->m_groundObject = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_RaycastInfo___destroy___0(btWheelInfo::RaycastInfo* self) {
  delete self;
}

// Interface: btWheelInfoConstructionInfo


btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_get_m_chassisConnectionCS_0(btWheelInfoConstructionInfo* self) {
  return &self->m_chassisConnectionCS;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_set_m_chassisConnectionCS_1(btWheelInfoConstructionInfo* self, btVector3* arg0) {
  self->m_chassisConnectionCS = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelDirectionCS_0(btWheelInfoConstructionInfo* self) {
  return &self->m_wheelDirectionCS;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelDirectionCS_1(btWheelInfoConstructionInfo* self, btVector3* arg0) {
  self->m_wheelDirectionCS = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelAxleCS_0(btWheelInfoConstructionInfo* self) {
  return &self->m_wheelAxleCS;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelAxleCS_1(btWheelInfoConstructionInfo* self, btVector3* arg0) {
  self->m_wheelAxleCS = *arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionRestLength_0(btWheelInfoConstructionInfo* self) {
  return self->m_suspensionRestLength;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionRestLength_1(btWheelInfoConstructionInfo* self, float arg0) {
  self->m_suspensionRestLength = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionTravelCm_0(btWheelInfoConstructionInfo* self) {
  return self->m_maxSuspensionTravelCm;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionTravelCm_1(btWheelInfoConstructionInfo* self, float arg0) {
  self->m_maxSuspensionTravelCm = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelRadius_0(btWheelInfoConstructionInfo* self) {
  return self->m_wheelRadius;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelRadius_1(btWheelInfoConstructionInfo* self, float arg0) {
  self->m_wheelRadius = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_get_m_suspensionStiffness_0(btWheelInfoConstructionInfo* self) {
  return self->m_suspensionStiffness;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_set_m_suspensionStiffness_1(btWheelInfoConstructionInfo* self, float arg0) {
  self->m_suspensionStiffness = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingCompression_0(btWheelInfoConstructionInfo* self) {
  return self->m_wheelsDampingCompression;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingCompression_1(btWheelInfoConstructionInfo* self, float arg0) {
  self->m_wheelsDampingCompression = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_get_m_wheelsDampingRelaxation_0(btWheelInfoConstructionInfo* self) {
  return self->m_wheelsDampingRelaxation;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_set_m_wheelsDampingRelaxation_1(btWheelInfoConstructionInfo* self, float arg0) {
  self->m_wheelsDampingRelaxation = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_get_m_frictionSlip_0(btWheelInfoConstructionInfo* self) {
  return self->m_frictionSlip;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_set_m_frictionSlip_1(btWheelInfoConstructionInfo* self, float arg0) {
  self->m_frictionSlip = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_get_m_maxSuspensionForce_0(btWheelInfoConstructionInfo* self) {
  return self->m_maxSuspensionForce;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_set_m_maxSuspensionForce_1(btWheelInfoConstructionInfo* self, float arg0) {
  self->m_maxSuspensionForce = arg0;
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_get_m_bIsFrontWheel_0(btWheelInfoConstructionInfo* self) {
  return self->m_bIsFrontWheel;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo_set_m_bIsFrontWheel_1(btWheelInfoConstructionInfo* self, bool arg0) {
  self->m_bIsFrontWheel = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfoConstructionInfo___destroy___0(btWheelInfoConstructionInfo* self) {
  delete self;
}

// Interface: btWheelInfo


btWheelInfo* EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_btWheelInfo_1(btWheelInfoConstructionInfo* ci) {
  return new btWheelInfo(*ci);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_getSuspensionRestLength_0(btWheelInfo* self) {
  return self->getSuspensionRestLength();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_updateWheel_2(btWheelInfo* self, const btRigidBody* chassis, btWheelInfo::RaycastInfo* raycastInfo) {
  self->updateWheel(*chassis, *raycastInfo);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_suspensionStiffness_0(btWheelInfo* self) {
  return self->m_suspensionStiffness;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_suspensionStiffness_1(btWheelInfo* self, float arg0) {
  self->m_suspensionStiffness = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_frictionSlip_0(btWheelInfo* self) {
  return self->m_frictionSlip;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_frictionSlip_1(btWheelInfo* self, float arg0) {
  self->m_frictionSlip = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_engineForce_0(btWheelInfo* self) {
  return self->m_engineForce;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_engineForce_1(btWheelInfo* self, float arg0) {
  self->m_engineForce = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_rollInfluence_0(btWheelInfo* self) {
  return self->m_rollInfluence;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_rollInfluence_1(btWheelInfo* self, float arg0) {
  self->m_rollInfluence = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_suspensionRestLength1_0(btWheelInfo* self) {
  return self->m_suspensionRestLength1;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_suspensionRestLength1_1(btWheelInfo* self, float arg0) {
  self->m_suspensionRestLength1 = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_wheelsRadius_0(btWheelInfo* self) {
  return self->m_wheelsRadius;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_wheelsRadius_1(btWheelInfo* self, float arg0) {
  self->m_wheelsRadius = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_wheelsDampingCompression_0(btWheelInfo* self) {
  return self->m_wheelsDampingCompression;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_wheelsDampingCompression_1(btWheelInfo* self, float arg0) {
  self->m_wheelsDampingCompression = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_wheelsDampingRelaxation_0(btWheelInfo* self) {
  return self->m_wheelsDampingRelaxation;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_wheelsDampingRelaxation_1(btWheelInfo* self, float arg0) {
  self->m_wheelsDampingRelaxation = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_steering_0(btWheelInfo* self) {
  return self->m_steering;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_steering_1(btWheelInfo* self, float arg0) {
  self->m_steering = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_maxSuspensionForce_0(btWheelInfo* self) {
  return self->m_maxSuspensionForce;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_maxSuspensionForce_1(btWheelInfo* self, float arg0) {
  self->m_maxSuspensionForce = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_maxSuspensionTravelCm_0(btWheelInfo* self) {
  return self->m_maxSuspensionTravelCm;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_maxSuspensionTravelCm_1(btWheelInfo* self, float arg0) {
  self->m_maxSuspensionTravelCm = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_wheelsSuspensionForce_0(btWheelInfo* self) {
  return self->m_wheelsSuspensionForce;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_wheelsSuspensionForce_1(btWheelInfo* self, float arg0) {
  self->m_wheelsSuspensionForce = arg0;
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_bIsFrontWheel_0(btWheelInfo* self) {
  return self->m_bIsFrontWheel;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_bIsFrontWheel_1(btWheelInfo* self, bool arg0) {
  self->m_bIsFrontWheel = arg0;
}

btWheelInfo::RaycastInfo* EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_raycastInfo_0(btWheelInfo* self) {
  return &self->m_raycastInfo;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_raycastInfo_1(btWheelInfo* self, btWheelInfo::RaycastInfo* arg0) {
  self->m_raycastInfo = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_chassisConnectionPointCS_0(btWheelInfo* self) {
  return &self->m_chassisConnectionPointCS;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_chassisConnectionPointCS_1(btWheelInfo* self, btVector3* arg0) {
  self->m_chassisConnectionPointCS = *arg0;
}

btTransform* EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_worldTransform_0(btWheelInfo* self) {
  return &self->m_worldTransform;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_worldTransform_1(btWheelInfo* self, btTransform* arg0) {
  self->m_worldTransform = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_wheelDirectionCS_0(btWheelInfo* self) {
  return &self->m_wheelDirectionCS;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_wheelDirectionCS_1(btWheelInfo* self, btVector3* arg0) {
  self->m_wheelDirectionCS = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_wheelAxleCS_0(btWheelInfo* self) {
  return &self->m_wheelAxleCS;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_wheelAxleCS_1(btWheelInfo* self, btVector3* arg0) {
  self->m_wheelAxleCS = *arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_rotation_0(btWheelInfo* self) {
  return self->m_rotation;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_rotation_1(btWheelInfo* self, float arg0) {
  self->m_rotation = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_deltaRotation_0(btWheelInfo* self) {
  return self->m_deltaRotation;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_deltaRotation_1(btWheelInfo* self, float arg0) {
  self->m_deltaRotation = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_brake_0(btWheelInfo* self) {
  return self->m_brake;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_brake_1(btWheelInfo* self, float arg0) {
  self->m_brake = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_clippedInvContactDotSuspension_0(btWheelInfo* self) {
  return self->m_clippedInvContactDotSuspension;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_clippedInvContactDotSuspension_1(btWheelInfo* self, float arg0) {
  self->m_clippedInvContactDotSuspension = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_suspensionRelativeVelocity_0(btWheelInfo* self) {
  return self->m_suspensionRelativeVelocity;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_suspensionRelativeVelocity_1(btWheelInfo* self, float arg0) {
  self->m_suspensionRelativeVelocity = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_get_m_skidInfo_0(btWheelInfo* self) {
  return self->m_skidInfo;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo_set_m_skidInfo_1(btWheelInfo* self, float arg0) {
  self->m_skidInfo = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btWheelInfo___destroy___0(btWheelInfo* self) {
  delete self;
}

// Interface: btKinematicCharacterController


btKinematicCharacterController* EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_3(btPairCachingGhostObject* ghostObject, btConvexShape* convexShape, float stepHeight) {
  return new btKinematicCharacterController(ghostObject, convexShape, stepHeight);
}

btKinematicCharacterController* EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_btKinematicCharacterController_4(btPairCachingGhostObject* ghostObject, btConvexShape* convexShape, float stepHeight, int upAxis) {
  return new btKinematicCharacterController(ghostObject, convexShape, stepHeight, upAxis);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_setUpAxis_1(btKinematicCharacterController* self, int axis) {
  self->setUpAxis(axis);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_setWalkDirection_1(btKinematicCharacterController* self, const btVector3* walkDirection) {
  self->setWalkDirection(*walkDirection);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_setVelocityForTimeInterval_2(btKinematicCharacterController* self, const btVector3* velocity, float timeInterval) {
  self->setVelocityForTimeInterval(*velocity, timeInterval);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_warp_1(btKinematicCharacterController* self, const btVector3* origin) {
  self->warp(*origin);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_preStep_1(btKinematicCharacterController* self, btCollisionWorld* collisionWorld) {
  self->preStep(collisionWorld);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_playerStep_2(btKinematicCharacterController* self, btCollisionWorld* collisionWorld, float dt) {
  self->playerStep(collisionWorld, dt);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_setFallSpeed_1(btKinematicCharacterController* self, float fallSpeed) {
  self->setFallSpeed(fallSpeed);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_setJumpSpeed_1(btKinematicCharacterController* self, float jumpSpeed) {
  self->setJumpSpeed(jumpSpeed);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_setMaxJumpHeight_1(btKinematicCharacterController* self, float maxJumpHeight) {
  self->setMaxJumpHeight(maxJumpHeight);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_canJump_0(btKinematicCharacterController* self) {
  return self->canJump();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_jump_0(btKinematicCharacterController* self) {
  self->jump();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_setGravity_1(btKinematicCharacterController* self, float gravity) {
  self->setGravity(gravity);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_getGravity_0(btKinematicCharacterController* self) {
  return self->getGravity();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_setMaxSlope_1(btKinematicCharacterController* self, float slopeRadians) {
  self->setMaxSlope(slopeRadians);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_getMaxSlope_0(btKinematicCharacterController* self) {
  return self->getMaxSlope();
}

btPairCachingGhostObject* EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_getGhostObject_0(btKinematicCharacterController* self) {
  return self->getGhostObject();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_setUseGhostSweepTest_1(btKinematicCharacterController* self, bool useGhostObjectSweepTest) {
  self->setUseGhostSweepTest(useGhostObjectSweepTest);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_onGround_0(btKinematicCharacterController* self) {
  return self->onGround();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_setUpInterpolate_1(btKinematicCharacterController* self, bool value) {
  self->setUpInterpolate(value);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController_updateAction_2(btKinematicCharacterController* self, btCollisionWorld* collisionWorld, float deltaTimeStep) {
  self->updateAction(collisionWorld, deltaTimeStep);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btKinematicCharacterController___destroy___0(btKinematicCharacterController* self) {
  delete self;
}

// Interface: btRaycastVehicle


btRaycastVehicle* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_btRaycastVehicle_3(const btRaycastVehicle::btVehicleTuning* tuning, btRigidBody* chassis, btVehicleRaycaster* raycaster) {
  return new btRaycastVehicle(*tuning, chassis, raycaster);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_applyEngineForce_2(btRaycastVehicle* self, float force, int wheel) {
  self->applyEngineForce(force, wheel);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_setSteeringValue_2(btRaycastVehicle* self, float steering, int wheel) {
  self->setSteeringValue(steering, wheel);
}

const btTransform* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_getWheelTransformWS_1(btRaycastVehicle* self, int wheelIndex) {
  return &self->getWheelTransformWS(wheelIndex);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_updateWheelTransform_2(btRaycastVehicle* self, int wheelIndex, bool interpolatedTransform) {
  self->updateWheelTransform(wheelIndex, interpolatedTransform);
}

btWheelInfo* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_addWheel_7(btRaycastVehicle* self, const btVector3* connectionPointCS0, const btVector3* wheelDirectionCS0, const btVector3* wheelAxleCS, float suspensionRestLength, float wheelRadius, const btRaycastVehicle::btVehicleTuning* tuning, bool isFrontWheel) {
  return &self->addWheel(*connectionPointCS0, *wheelDirectionCS0, *wheelAxleCS, suspensionRestLength, wheelRadius, *tuning, isFrontWheel);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_getNumWheels_0(btRaycastVehicle* self) {
  return self->getNumWheels();
}

btRigidBody* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_getRigidBody_0(btRaycastVehicle* self) {
  return self->getRigidBody();
}

btWheelInfo* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_getWheelInfo_1(btRaycastVehicle* self, int index) {
  return &self->getWheelInfo(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_setBrake_2(btRaycastVehicle* self, float brake, int wheelIndex) {
  self->setBrake(brake, wheelIndex);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_setCoordinateSystem_3(btRaycastVehicle* self, int rightIndex, int upIndex, int forwardIndex) {
  self->setCoordinateSystem(rightIndex, upIndex, forwardIndex);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_getCurrentSpeedKmHour_0(btRaycastVehicle* self) {
  return self->getCurrentSpeedKmHour();
}

const btTransform* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_getChassisWorldTransform_0(btRaycastVehicle* self) {
  return &self->getChassisWorldTransform();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_rayCast_1(btRaycastVehicle* self, btWheelInfo* wheel) {
  return self->rayCast(*wheel);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_updateVehicle_1(btRaycastVehicle* self, float step) {
  self->updateVehicle(step);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_resetSuspension_0(btRaycastVehicle* self) {
  self->resetSuspension();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_getSteeringValue_1(btRaycastVehicle* self, int wheel) {
  return self->getSteeringValue(wheel);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_1(btRaycastVehicle* self, btWheelInfo* wheel) {
  self->updateWheelTransformsWS(*wheel);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_updateWheelTransformsWS_2(btRaycastVehicle* self, btWheelInfo* wheel, bool interpolatedTransform) {
  self->updateWheelTransformsWS(*wheel, interpolatedTransform);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_setPitchControl_1(btRaycastVehicle* self, float pitch) {
  self->setPitchControl(pitch);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_updateSuspension_1(btRaycastVehicle* self, float deltaTime) {
  self->updateSuspension(deltaTime);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_updateFriction_1(btRaycastVehicle* self, float timeStep) {
  self->updateFriction(timeStep);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_getRightAxis_0(btRaycastVehicle* self) {
  return self->getRightAxis();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_getUpAxis_0(btRaycastVehicle* self) {
  return self->getUpAxis();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_getForwardAxis_0(btRaycastVehicle* self) {
  return self->getForwardAxis();
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_getForwardVector_0(btRaycastVehicle* self) {
  static thread_local btVector3 temp;
  return (temp = self->getForwardVector(), &temp);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_getUserConstraintType_0(btRaycastVehicle* self) {
  return self->getUserConstraintType();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_setUserConstraintType_1(btRaycastVehicle* self, int userConstraintType) {
  self->setUserConstraintType(userConstraintType);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_setUserConstraintId_1(btRaycastVehicle* self, int uid) {
  self->setUserConstraintId(uid);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_getUserConstraintId_0(btRaycastVehicle* self) {
  return self->getUserConstraintId();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle_updateAction_2(btRaycastVehicle* self, btCollisionWorld* collisionWorld, float deltaTimeStep) {
  self->updateAction(collisionWorld, deltaTimeStep);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btRaycastVehicle___destroy___0(btRaycastVehicle* self) {
  delete self;
}

// Interface: btPairCachingGhostObject


btPairCachingGhostObject* EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_btPairCachingGhostObject_0() {
  return new btPairCachingGhostObject();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_setAnisotropicFriction_2(btPairCachingGhostObject* self, const btVector3* anisotropicFriction, int frictionMode) {
  self->setAnisotropicFriction(*anisotropicFriction, frictionMode);
}

btCollisionShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_getCollisionShape_0(btPairCachingGhostObject* self) {
  return self->getCollisionShape();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_setContactProcessingThreshold_1(btPairCachingGhostObject* self, float contactProcessingThreshold) {
  self->setContactProcessingThreshold(contactProcessingThreshold);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_setActivationState_1(btPairCachingGhostObject* self, int newState) {
  self->setActivationState(newState);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_forceActivationState_1(btPairCachingGhostObject* self, int newState) {
  self->forceActivationState(newState);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_activate_0(btPairCachingGhostObject* self) {
  self->activate();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_activate_1(btPairCachingGhostObject* self, bool forceActivation) {
  self->activate(forceActivation);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_isActive_0(btPairCachingGhostObject* self) {
  return self->isActive();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_isKinematicObject_0(btPairCachingGhostObject* self) {
  return self->isKinematicObject();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_isStaticObject_0(btPairCachingGhostObject* self) {
  return self->isStaticObject();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_isStaticOrKinematicObject_0(btPairCachingGhostObject* self) {
  return self->isStaticOrKinematicObject();
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_getRestitution_0(btPairCachingGhostObject* self) {
  return self->getRestitution();
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_getFriction_0(btPairCachingGhostObject* self) {
  return self->getFriction();
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_getRollingFriction_0(btPairCachingGhostObject* self) {
  return self->getRollingFriction();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_setRestitution_1(btPairCachingGhostObject* self, float rest) {
  self->setRestitution(rest);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_setFriction_1(btPairCachingGhostObject* self, float frict) {
  self->setFriction(frict);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_setRollingFriction_1(btPairCachingGhostObject* self, float frict) {
  self->setRollingFriction(frict);
}

btTransform* EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_getWorldTransform_0(btPairCachingGhostObject* self) {
  return &self->getWorldTransform();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_getCollisionFlags_0(btPairCachingGhostObject* self) {
  return self->getCollisionFlags();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_setCollisionFlags_1(btPairCachingGhostObject* self, int flags) {
  self->setCollisionFlags(flags);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_setWorldTransform_1(btPairCachingGhostObject* self, const btTransform* worldTrans) {
  self->setWorldTransform(*worldTrans);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_setCollisionShape_1(btPairCachingGhostObject* self, btCollisionShape* collisionShape) {
  self->setCollisionShape(collisionShape);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_setCcdMotionThreshold_1(btPairCachingGhostObject* self, float ccdMotionThreshold) {
  self->setCcdMotionThreshold(ccdMotionThreshold);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_setCcdSweptSphereRadius_1(btPairCachingGhostObject* self, float radius) {
  self->setCcdSweptSphereRadius(radius);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_getUserIndex_0(btPairCachingGhostObject* self) {
  return self->getUserIndex();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_setUserIndex_1(btPairCachingGhostObject* self, int index) {
  self->setUserIndex(index);
}

void* EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_getUserPointer_0(btPairCachingGhostObject* self) {
  return self->getUserPointer();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_setUserPointer_1(btPairCachingGhostObject* self, void* userPointer) {
  self->setUserPointer(userPointer);
}

const btBroadphaseProxy* EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_getBroadphaseHandle_0(btPairCachingGhostObject* self) {
  return self->getBroadphaseHandle();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_getNumOverlappingObjects_0(btPairCachingGhostObject* self) {
  return self->getNumOverlappingObjects();
}

btCollisionObject* EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject_getOverlappingObject_1(btPairCachingGhostObject* self, int index) {
  return self->getOverlappingObject(index);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btPairCachingGhostObject___destroy___0(btPairCachingGhostObject* self) {
  delete self;
}

// Interface: btGhostPairCallback


btGhostPairCallback* EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostPairCallback_btGhostPairCallback_0() {
  return new btGhostPairCallback();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btGhostPairCallback___destroy___0(btGhostPairCallback* self) {
  delete self;
}

// Interface: btSoftBodyWorldInfo


btSoftBodyWorldInfo* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyWorldInfo_btSoftBodyWorldInfo_0() {
  return new btSoftBodyWorldInfo();
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyWorldInfo_get_air_density_0(btSoftBodyWorldInfo* self) {
  return self->air_density;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyWorldInfo_set_air_density_1(btSoftBodyWorldInfo* self, float arg0) {
  self->air_density = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyWorldInfo_get_water_density_0(btSoftBodyWorldInfo* self) {
  return self->water_density;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyWorldInfo_set_water_density_1(btSoftBodyWorldInfo* self, float arg0) {
  self->water_density = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyWorldInfo_get_water_offset_0(btSoftBodyWorldInfo* self) {
  return self->water_offset;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyWorldInfo_set_water_offset_1(btSoftBodyWorldInfo* self, float arg0) {
  self->water_offset = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyWorldInfo_get_m_maxDisplacement_0(btSoftBodyWorldInfo* self) {
  return self->m_maxDisplacement;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyWorldInfo_set_m_maxDisplacement_1(btSoftBodyWorldInfo* self, float arg0) {
  self->m_maxDisplacement = arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyWorldInfo_get_water_normal_0(btSoftBodyWorldInfo* self) {
  return &self->water_normal;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyWorldInfo_set_water_normal_1(btSoftBodyWorldInfo* self, btVector3* arg0) {
  self->water_normal = *arg0;
}

btBroadphaseInterface* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyWorldInfo_get_m_broadphase_0(btSoftBodyWorldInfo* self) {
  return self->m_broadphase;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyWorldInfo_set_m_broadphase_1(btSoftBodyWorldInfo* self, btBroadphaseInterface* arg0) {
  self->m_broadphase = arg0;
}

btDispatcher* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyWorldInfo_get_m_dispatcher_0(btSoftBodyWorldInfo* self) {
  return self->m_dispatcher;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyWorldInfo_set_m_dispatcher_1(btSoftBodyWorldInfo* self, btDispatcher* arg0) {
  self->m_dispatcher = arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyWorldInfo_get_m_gravity_0(btSoftBodyWorldInfo* self) {
  return &self->m_gravity;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyWorldInfo_set_m_gravity_1(btSoftBodyWorldInfo* self, btVector3* arg0) {
  self->m_gravity = *arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyWorldInfo___destroy___0(btSoftBodyWorldInfo* self) {
  delete self;
}

// Interface: Face


btSoftBody::Node* EMSCRIPTEN_KEEPALIVE emscripten_bind_Face_get_m_n_1(btSoftBody::Face* self, int arg0) {
  return self->m_n[arg0];
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Face_set_m_n_2(btSoftBody::Face* self, int arg0, btSoftBody::Node* arg1) {
  self->m_n[arg0] = arg1;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Face_get_m_normal_0(btSoftBody::Face* self) {
  return &self->m_normal;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Face_set_m_normal_1(btSoftBody::Face* self, btVector3* arg0) {
  self->m_normal = *arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Face_get_m_ra_0(btSoftBody::Face* self) {
  return self->m_ra;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Face_set_m_ra_1(btSoftBody::Face* self, float arg0) {
  self->m_ra = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Face___destroy___0(btSoftBody::Face* self) {
  delete self;
}

// Interface: tFaceArray


const int EMSCRIPTEN_KEEPALIVE emscripten_bind_tFaceArray_size_0(btSoftBody::tFaceArray* self) {
  return self->size();
}

const btSoftBody::Face* EMSCRIPTEN_KEEPALIVE emscripten_bind_tFaceArray_at_1(btSoftBody::tFaceArray* self, int n) {
  return &self->at(n);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_tFaceArray___destroy___0(btSoftBody::tFaceArray* self) {
  delete self;
}

// Interface: Node


btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Node_get_m_x_0(btSoftBody::Node* self) {
  return &self->m_x;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Node_set_m_x_1(btSoftBody::Node* self, btVector3* arg0) {
  self->m_x = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Node_get_m_q_0(btSoftBody::Node* self) {
  return &self->m_q;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Node_set_m_q_1(btSoftBody::Node* self, btVector3* arg0) {
  self->m_q = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Node_get_m_v_0(btSoftBody::Node* self) {
  return &self->m_v;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Node_set_m_v_1(btSoftBody::Node* self, btVector3* arg0) {
  self->m_v = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Node_get_m_f_0(btSoftBody::Node* self) {
  return &self->m_f;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Node_set_m_f_1(btSoftBody::Node* self, btVector3* arg0) {
  self->m_f = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Node_get_m_n_0(btSoftBody::Node* self) {
  return &self->m_n;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Node_set_m_n_1(btSoftBody::Node* self, btVector3* arg0) {
  self->m_n = *arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Node_get_m_im_0(btSoftBody::Node* self) {
  return self->m_im;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Node_set_m_im_1(btSoftBody::Node* self, float arg0) {
  self->m_im = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Node_get_m_area_0(btSoftBody::Node* self) {
  return self->m_area;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Node_set_m_area_1(btSoftBody::Node* self, float arg0) {
  self->m_area = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Node___destroy___0(btSoftBody::Node* self) {
  delete self;
}

// Interface: tNodeArray


const int EMSCRIPTEN_KEEPALIVE emscripten_bind_tNodeArray_size_0(btSoftBody::tNodeArray* self) {
  return self->size();
}

const btSoftBody::Node* EMSCRIPTEN_KEEPALIVE emscripten_bind_tNodeArray_at_1(btSoftBody::tNodeArray* self, int n) {
  return &self->at(n);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_tNodeArray___destroy___0(btSoftBody::tNodeArray* self) {
  delete self;
}

// Interface: Material


float EMSCRIPTEN_KEEPALIVE emscripten_bind_Material_get_m_kLST_0(btSoftBody::Material* self) {
  return self->m_kLST;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Material_set_m_kLST_1(btSoftBody::Material* self, float arg0) {
  self->m_kLST = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Material_get_m_kAST_0(btSoftBody::Material* self) {
  return self->m_kAST;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Material_set_m_kAST_1(btSoftBody::Material* self, float arg0) {
  self->m_kAST = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Material_get_m_kVST_0(btSoftBody::Material* self) {
  return self->m_kVST;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Material_set_m_kVST_1(btSoftBody::Material* self, float arg0) {
  self->m_kVST = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Material_get_m_flags_0(btSoftBody::Material* self) {
  return self->m_flags;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Material_set_m_flags_1(btSoftBody::Material* self, int arg0) {
  self->m_flags = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Material___destroy___0(btSoftBody::Material* self) {
  delete self;
}

// Interface: tMaterialArray


const int EMSCRIPTEN_KEEPALIVE emscripten_bind_tMaterialArray_size_0(btSoftBody::tMaterialArray* self) {
  return self->size();
}

btSoftBody::Material* EMSCRIPTEN_KEEPALIVE emscripten_bind_tMaterialArray_at_1(btSoftBody::tMaterialArray* self, int n) {
  return self->at(n);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_tMaterialArray___destroy___0(btSoftBody::tMaterialArray* self) {
  delete self;
}

// Interface: Anchor


btSoftBody::Node* EMSCRIPTEN_KEEPALIVE emscripten_bind_Anchor_get_m_node_0(btSoftBody::Anchor* self) {
  return self->m_node;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Anchor_set_m_node_1(btSoftBody::Anchor* self, btSoftBody::Node* arg0) {
  self->m_node = arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Anchor_get_m_local_0(btSoftBody::Anchor* self) {
  return &self->m_local;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Anchor_set_m_local_1(btSoftBody::Anchor* self, btVector3* arg0) {
  self->m_local = *arg0;
}

btRigidBody* EMSCRIPTEN_KEEPALIVE emscripten_bind_Anchor_get_m_body_0(btSoftBody::Anchor* self) {
  return self->m_body;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Anchor_set_m_body_1(btSoftBody::Anchor* self, btRigidBody* arg0) {
  self->m_body = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Anchor_get_m_influence_0(btSoftBody::Anchor* self) {
  return self->m_influence;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Anchor_set_m_influence_1(btSoftBody::Anchor* self, float arg0) {
  self->m_influence = arg0;
}

btMatrix3x3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Anchor_get_m_c0_0(btSoftBody::Anchor* self) {
  return &self->m_c0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Anchor_set_m_c0_1(btSoftBody::Anchor* self, btMatrix3x3* arg0) {
  self->m_c0 = *arg0;
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_Anchor_get_m_c1_0(btSoftBody::Anchor* self) {
  return &self->m_c1;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Anchor_set_m_c1_1(btSoftBody::Anchor* self, btVector3* arg0) {
  self->m_c1 = *arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Anchor_get_m_c2_0(btSoftBody::Anchor* self) {
  return self->m_c2;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Anchor_set_m_c2_1(btSoftBody::Anchor* self, float arg0) {
  self->m_c2 = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Anchor___destroy___0(btSoftBody::Anchor* self) {
  delete self;
}

// Interface: tAnchorArray


const int EMSCRIPTEN_KEEPALIVE emscripten_bind_tAnchorArray_size_0(btSoftBody::tAnchorArray* self) {
  return self->size();
}

btSoftBody::Anchor* EMSCRIPTEN_KEEPALIVE emscripten_bind_tAnchorArray_at_1(btSoftBody::tAnchorArray* self, int n) {
  static thread_local btSoftBody::Anchor temp;
  return (temp = self->at(n), &temp);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_tAnchorArray_clear_0(btSoftBody::tAnchorArray* self) {
  self->clear();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_tAnchorArray_push_back_1(btSoftBody::tAnchorArray* self, btSoftBody::Anchor* val) {
  self->push_back(*val);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_tAnchorArray_pop_back_0(btSoftBody::tAnchorArray* self) {
  self->pop_back();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_tAnchorArray___destroy___0(btSoftBody::tAnchorArray* self) {
  delete self;
}

// Interface: Config


float EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_kVCF_0(btSoftBody::Config* self) {
  return self->kVCF;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_kVCF_1(btSoftBody::Config* self, float arg0) {
  self->kVCF = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_kDP_0(btSoftBody::Config* self) {
  return self->kDP;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_kDP_1(btSoftBody::Config* self, float arg0) {
  self->kDP = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_kDG_0(btSoftBody::Config* self) {
  return self->kDG;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_kDG_1(btSoftBody::Config* self, float arg0) {
  self->kDG = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_kLF_0(btSoftBody::Config* self) {
  return self->kLF;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_kLF_1(btSoftBody::Config* self, float arg0) {
  self->kLF = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_kPR_0(btSoftBody::Config* self) {
  return self->kPR;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_kPR_1(btSoftBody::Config* self, float arg0) {
  self->kPR = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_kVC_0(btSoftBody::Config* self) {
  return self->kVC;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_kVC_1(btSoftBody::Config* self, float arg0) {
  self->kVC = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_kDF_0(btSoftBody::Config* self) {
  return self->kDF;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_kDF_1(btSoftBody::Config* self, float arg0) {
  self->kDF = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_kMT_0(btSoftBody::Config* self) {
  return self->kMT;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_kMT_1(btSoftBody::Config* self, float arg0) {
  self->kMT = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_kCHR_0(btSoftBody::Config* self) {
  return self->kCHR;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_kCHR_1(btSoftBody::Config* self, float arg0) {
  self->kCHR = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_kKHR_0(btSoftBody::Config* self) {
  return self->kKHR;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_kKHR_1(btSoftBody::Config* self, float arg0) {
  self->kKHR = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_kSHR_0(btSoftBody::Config* self) {
  return self->kSHR;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_kSHR_1(btSoftBody::Config* self, float arg0) {
  self->kSHR = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_kAHR_0(btSoftBody::Config* self) {
  return self->kAHR;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_kAHR_1(btSoftBody::Config* self, float arg0) {
  self->kAHR = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_kSRHR_CL_0(btSoftBody::Config* self) {
  return self->kSRHR_CL;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_kSRHR_CL_1(btSoftBody::Config* self, float arg0) {
  self->kSRHR_CL = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_kSKHR_CL_0(btSoftBody::Config* self) {
  return self->kSKHR_CL;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_kSKHR_CL_1(btSoftBody::Config* self, float arg0) {
  self->kSKHR_CL = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_kSSHR_CL_0(btSoftBody::Config* self) {
  return self->kSSHR_CL;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_kSSHR_CL_1(btSoftBody::Config* self, float arg0) {
  self->kSSHR_CL = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_kSR_SPLT_CL_0(btSoftBody::Config* self) {
  return self->kSR_SPLT_CL;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_kSR_SPLT_CL_1(btSoftBody::Config* self, float arg0) {
  self->kSR_SPLT_CL = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_kSK_SPLT_CL_0(btSoftBody::Config* self) {
  return self->kSK_SPLT_CL;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_kSK_SPLT_CL_1(btSoftBody::Config* self, float arg0) {
  self->kSK_SPLT_CL = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_kSS_SPLT_CL_0(btSoftBody::Config* self) {
  return self->kSS_SPLT_CL;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_kSS_SPLT_CL_1(btSoftBody::Config* self, float arg0) {
  self->kSS_SPLT_CL = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_maxvolume_0(btSoftBody::Config* self) {
  return self->maxvolume;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_maxvolume_1(btSoftBody::Config* self, float arg0) {
  self->maxvolume = arg0;
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_timescale_0(btSoftBody::Config* self) {
  return self->timescale;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_timescale_1(btSoftBody::Config* self, float arg0) {
  self->timescale = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_viterations_0(btSoftBody::Config* self) {
  return self->viterations;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_viterations_1(btSoftBody::Config* self, int arg0) {
  self->viterations = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_piterations_0(btSoftBody::Config* self) {
  return self->piterations;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_piterations_1(btSoftBody::Config* self, int arg0) {
  self->piterations = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_diterations_0(btSoftBody::Config* self) {
  return self->diterations;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_diterations_1(btSoftBody::Config* self, int arg0) {
  self->diterations = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_citerations_0(btSoftBody::Config* self) {
  return self->citerations;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_citerations_1(btSoftBody::Config* self, int arg0) {
  self->citerations = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_get_collisions_0(btSoftBody::Config* self) {
  return self->collisions;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config_set_collisions_1(btSoftBody::Config* self, int arg0) {
  self->collisions = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Config___destroy___0(btSoftBody::Config* self) {
  delete self;
}

// Interface: btSoftBody


btSoftBody* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_btSoftBody_4(btSoftBodyWorldInfo* worldInfo, int node_count, btVector3* x, float* m) {
  return new btSoftBody(worldInfo, node_count, x, m);
}

const bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_checkLink_2(btSoftBody* self, int node0, int node1) {
  return self->checkLink(node0, node1);
}

const bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_checkFace_3(btSoftBody* self, int node0, int node1, int node2) {
  return self->checkFace(node0, node1, node2);
}

btSoftBody::Material* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_appendMaterial_0(btSoftBody* self) {
  return self->appendMaterial();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_appendNode_2(btSoftBody* self, const btVector3* x, float m) {
  self->appendNode(*x, m);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_appendLink_4(btSoftBody* self, int node0, int node1, btSoftBody::Material* mat, bool bcheckexist) {
  self->appendLink(node0, node1, mat, bcheckexist);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_appendFace_4(btSoftBody* self, int node0, int node1, int node2, btSoftBody::Material* mat) {
  self->appendFace(node0, node1, node2, mat);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_appendTetra_5(btSoftBody* self, int node0, int node1, int node2, int node3, btSoftBody::Material* mat) {
  self->appendTetra(node0, node1, node2, node3, mat);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_appendAnchor_4(btSoftBody* self, int node, btRigidBody* body, bool disableCollisionBetweenLinkedBodies, float influence) {
  self->appendAnchor(node, body, disableCollisionBetweenLinkedBodies, influence);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_addForce_1(btSoftBody* self, const btVector3* force) {
  self->addForce(*force);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_addForce_2(btSoftBody* self, const btVector3* force, int node) {
  self->addForce(*force, node);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_addAeroForceToNode_2(btSoftBody* self, const btVector3* windVelocity, int nodeIndex) {
  self->addAeroForceToNode(*windVelocity, nodeIndex);
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_getTotalMass_0(btSoftBody* self) {
  return self->getTotalMass();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_setTotalMass_2(btSoftBody* self, float mass, bool fromfaces) {
  self->setTotalMass(mass, fromfaces);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_setMass_2(btSoftBody* self, int node, float mass) {
  self->setMass(node, mass);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_transform_1(btSoftBody* self, const btTransform* trs) {
  self->transform(*trs);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_translate_1(btSoftBody* self, const btVector3* trs) {
  self->translate(*trs);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_rotate_1(btSoftBody* self, const btQuaternion* rot) {
  self->rotate(*rot);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_scale_1(btSoftBody* self, const btVector3* scl) {
  self->scale(*scl);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_generateClusters_1(btSoftBody* self, int k) {
  return self->generateClusters(k);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_generateClusters_2(btSoftBody* self, int k, int maxiterations) {
  return self->generateClusters(k, maxiterations);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_generateBendingConstraints_2(btSoftBody* self, int distance, btSoftBody::Material* mat) {
  return self->generateBendingConstraints(distance, mat);
}

btSoftBody* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_upcast_1(btSoftBody* self, btCollisionObject* colObj) {
  return self->upcast(colObj);
}

float EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_getRestLengthScale_0(btSoftBody* self) {
  return self->getRestLengthScale();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_setRestLengthScale_1(btSoftBody* self, float restLength) {
  self->setRestLengthScale(restLength);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_setAnisotropicFriction_2(btSoftBody* self, const btVector3* anisotropicFriction, int frictionMode) {
  self->setAnisotropicFriction(*anisotropicFriction, frictionMode);
}

btCollisionShape* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_getCollisionShape_0(btSoftBody* self) {
  return self->getCollisionShape();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_setContactProcessingThreshold_1(btSoftBody* self, float contactProcessingThreshold) {
  self->setContactProcessingThreshold(contactProcessingThreshold);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_setActivationState_1(btSoftBody* self, int newState) {
  self->setActivationState(newState);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_forceActivationState_1(btSoftBody* self, int newState) {
  self->forceActivationState(newState);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_activate_0(btSoftBody* self) {
  self->activate();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_activate_1(btSoftBody* self, bool forceActivation) {
  self->activate(forceActivation);
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_isActive_0(btSoftBody* self) {
  return self->isActive();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_isKinematicObject_0(btSoftBody* self) {
  return self->isKinematicObject();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_isStaticObject_0(btSoftBody* self) {
  return self->isStaticObject();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_isStaticOrKinematicObject_0(btSoftBody* self) {
  return self->isStaticOrKinematicObject();
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_getRestitution_0(btSoftBody* self) {
  return self->getRestitution();
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_getFriction_0(btSoftBody* self) {
  return self->getFriction();
}

const float EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_getRollingFriction_0(btSoftBody* self) {
  return self->getRollingFriction();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_setRestitution_1(btSoftBody* self, float rest) {
  self->setRestitution(rest);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_setFriction_1(btSoftBody* self, float frict) {
  self->setFriction(frict);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_setRollingFriction_1(btSoftBody* self, float frict) {
  self->setRollingFriction(frict);
}

btTransform* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_getWorldTransform_0(btSoftBody* self) {
  return &self->getWorldTransform();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_getCollisionFlags_0(btSoftBody* self) {
  return self->getCollisionFlags();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_setCollisionFlags_1(btSoftBody* self, int flags) {
  self->setCollisionFlags(flags);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_setWorldTransform_1(btSoftBody* self, const btTransform* worldTrans) {
  self->setWorldTransform(*worldTrans);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_setCollisionShape_1(btSoftBody* self, btCollisionShape* collisionShape) {
  self->setCollisionShape(collisionShape);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_setCcdMotionThreshold_1(btSoftBody* self, float ccdMotionThreshold) {
  self->setCcdMotionThreshold(ccdMotionThreshold);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_setCcdSweptSphereRadius_1(btSoftBody* self, float radius) {
  self->setCcdSweptSphereRadius(radius);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_getUserIndex_0(btSoftBody* self) {
  return self->getUserIndex();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_setUserIndex_1(btSoftBody* self, int index) {
  self->setUserIndex(index);
}

void* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_getUserPointer_0(btSoftBody* self) {
  return self->getUserPointer();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_setUserPointer_1(btSoftBody* self, void* userPointer) {
  self->setUserPointer(userPointer);
}

const btBroadphaseProxy* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_getBroadphaseHandle_0(btSoftBody* self) {
  return self->getBroadphaseHandle();
}

btSoftBody::Config* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_get_m_cfg_0(btSoftBody* self) {
  return &self->m_cfg;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_set_m_cfg_1(btSoftBody* self, btSoftBody::Config* arg0) {
  self->m_cfg = *arg0;
}

btSoftBody::tNodeArray* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_get_m_nodes_0(btSoftBody* self) {
  return &self->m_nodes;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_set_m_nodes_1(btSoftBody* self, btSoftBody::tNodeArray* arg0) {
  self->m_nodes = *arg0;
}

btSoftBody::tFaceArray* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_get_m_faces_0(btSoftBody* self) {
  return &self->m_faces;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_set_m_faces_1(btSoftBody* self, btSoftBody::tFaceArray* arg0) {
  self->m_faces = *arg0;
}

btSoftBody::tMaterialArray* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_get_m_materials_0(btSoftBody* self) {
  return &self->m_materials;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_set_m_materials_1(btSoftBody* self, btSoftBody::tMaterialArray* arg0) {
  self->m_materials = *arg0;
}

btSoftBody::tAnchorArray* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_get_m_anchors_0(btSoftBody* self) {
  return &self->m_anchors;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody_set_m_anchors_1(btSoftBody* self, btSoftBody::tAnchorArray* arg0) {
  self->m_anchors = *arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBody___destroy___0(btSoftBody* self) {
  delete self;
}

// Interface: btSoftBodyRigidBodyCollisionConfiguration


btSoftBodyRigidBodyCollisionConfiguration* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_0() {
  return new btSoftBodyRigidBodyCollisionConfiguration();
}

btSoftBodyRigidBodyCollisionConfiguration* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration_btSoftBodyRigidBodyCollisionConfiguration_1(btDefaultCollisionConstructionInfo* info) {
  return new btSoftBodyRigidBodyCollisionConfiguration(*info);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyRigidBodyCollisionConfiguration___destroy___0(btSoftBodyRigidBodyCollisionConfiguration* self) {
  delete self;
}

// Interface: btDefaultSoftBodySolver


btDefaultSoftBodySolver* EMSCRIPTEN_KEEPALIVE emscripten_bind_btDefaultSoftBodySolver_btDefaultSoftBodySolver_0() {
  return new btDefaultSoftBodySolver();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btDefaultSoftBodySolver___destroy___0(btDefaultSoftBodySolver* self) {
  delete self;
}

// Interface: btSoftBodyArray


const int EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyArray_size_0(btSoftBodyArray* self) {
  return self->size();
}

const btSoftBody* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyArray_at_1(btSoftBodyArray* self, int n) {
  return self->at(n);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyArray___destroy___0(btSoftBodyArray* self) {
  delete self;
}

// Interface: btSoftRigidDynamicsWorld


btSoftRigidDynamicsWorld* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_btSoftRigidDynamicsWorld_5(btDispatcher* dispatcher, btBroadphaseInterface* pairCache, btConstraintSolver* constraintSolver, btCollisionConfiguration* collisionConfiguration, btSoftBodySolver* softBodySolver) {
  return new btSoftRigidDynamicsWorld(dispatcher, pairCache, constraintSolver, collisionConfiguration, softBodySolver);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_addSoftBody_3(btSoftRigidDynamicsWorld* self, btSoftBody* body, short collisionFilterGroup, short collisionFilterMask) {
  self->addSoftBody(body, collisionFilterGroup, collisionFilterMask);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_removeSoftBody_1(btSoftRigidDynamicsWorld* self, btSoftBody* body) {
  self->removeSoftBody(body);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_removeCollisionObject_1(btSoftRigidDynamicsWorld* self, btCollisionObject* collisionObject) {
  self->removeCollisionObject(collisionObject);
}

btSoftBodyWorldInfo* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_getWorldInfo_0(btSoftRigidDynamicsWorld* self) {
  return &self->getWorldInfo();
}

btSoftBodyArray* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_getSoftBodyArray_0(btSoftRigidDynamicsWorld* self) {
  return &self->getSoftBodyArray();
}

btDispatcher* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_getDispatcher_0(btSoftRigidDynamicsWorld* self) {
  return self->getDispatcher();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_rayTest_3(btSoftRigidDynamicsWorld* self, const btVector3* rayFromWorld, const btVector3* rayToWorld, btCollisionWorld::RayResultCallback* resultCallback) {
  self->rayTest(*rayFromWorld, *rayToWorld, *resultCallback);
}

btOverlappingPairCache* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_getPairCache_0(btSoftRigidDynamicsWorld* self) {
  return self->getPairCache();
}

btDispatcherInfo* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_getDispatchInfo_0(btSoftRigidDynamicsWorld* self) {
  return &self->getDispatchInfo();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_1(btSoftRigidDynamicsWorld* self, btCollisionObject* collisionObject) {
  self->addCollisionObject(collisionObject);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_2(btSoftRigidDynamicsWorld* self, btCollisionObject* collisionObject, short collisionFilterGroup) {
  self->addCollisionObject(collisionObject, collisionFilterGroup);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_addCollisionObject_3(btSoftRigidDynamicsWorld* self, btCollisionObject* collisionObject, short collisionFilterGroup, short collisionFilterMask) {
  self->addCollisionObject(collisionObject, collisionFilterGroup, collisionFilterMask);
}

const btBroadphaseInterface* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_getBroadphase_0(btSoftRigidDynamicsWorld* self) {
  return self->getBroadphase();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_convexSweepTest_5(btSoftRigidDynamicsWorld* self, const btConvexShape* castShape, const btTransform* from, const btTransform* to, btCollisionWorld::ConvexResultCallback* resultCallback, float allowedCcdPenetration) {
  self->convexSweepTest(castShape, *from, *to, *resultCallback, allowedCcdPenetration);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_contactPairTest_3(btSoftRigidDynamicsWorld* self, btCollisionObject* colObjA, btCollisionObject* colObjB, btCollisionWorld::ContactResultCallback* resultCallback) {
  self->contactPairTest(colObjA, colObjB, *resultCallback);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_contactTest_2(btSoftRigidDynamicsWorld* self, btCollisionObject* colObj, btCollisionWorld::ContactResultCallback* resultCallback) {
  self->contactTest(colObj, *resultCallback);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_setForceUpdateAllAabbs_1(btSoftRigidDynamicsWorld* self, bool forceUpdateAllAabbs) {
  self->setForceUpdateAllAabbs(forceUpdateAllAabbs);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_updateSingleAabb_1(btSoftRigidDynamicsWorld* self, btCollisionObject* colObj) {
  self->updateSingleAabb(colObj);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_setDebugDrawer_1(btSoftRigidDynamicsWorld* self, btIDebugDraw* debugDrawer) {
  self->setDebugDrawer(debugDrawer);
}

btIDebugDraw* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_getDebugDrawer_0(btSoftRigidDynamicsWorld* self) {
  return self->getDebugDrawer();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_debugDrawWorld_0(btSoftRigidDynamicsWorld* self) {
  self->debugDrawWorld();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_debugDrawObject_3(btSoftRigidDynamicsWorld* self, const btTransform* worldTransform, const btCollisionShape* shape, const btVector3* color) {
  self->debugDrawObject(*worldTransform, shape, *color);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_setGravity_1(btSoftRigidDynamicsWorld* self, btVector3* gravity) {
  self->setGravity(*gravity);
}

btVector3* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_getGravity_0(btSoftRigidDynamicsWorld* self) {
  static thread_local btVector3 temp;
  return (temp = self->getGravity(), &temp);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_1(btSoftRigidDynamicsWorld* self, btRigidBody* body) {
  self->addRigidBody(body);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_addRigidBody_3(btSoftRigidDynamicsWorld* self, btRigidBody* body, short group, short mask) {
  self->addRigidBody(body, group, mask);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_removeRigidBody_1(btSoftRigidDynamicsWorld* self, btRigidBody* body) {
  self->removeRigidBody(body);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_1(btSoftRigidDynamicsWorld* self, btTypedConstraint* constraint) {
  self->addConstraint(constraint);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_addConstraint_2(btSoftRigidDynamicsWorld* self, btTypedConstraint* constraint, bool disableCollisionsBetweenLinkedBodies) {
  self->addConstraint(constraint, disableCollisionsBetweenLinkedBodies);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_removeConstraint_1(btSoftRigidDynamicsWorld* self, btTypedConstraint* constraint) {
  self->removeConstraint(constraint);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_1(btSoftRigidDynamicsWorld* self, float timeStep) {
  return self->stepSimulation(timeStep);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_2(btSoftRigidDynamicsWorld* self, float timeStep, int maxSubSteps) {
  return self->stepSimulation(timeStep, maxSubSteps);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_stepSimulation_3(btSoftRigidDynamicsWorld* self, float timeStep, int maxSubSteps, float fixedTimeStep) {
  return self->stepSimulation(timeStep, maxSubSteps, fixedTimeStep);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_setContactAddedCallback_1(btSoftRigidDynamicsWorld* self, int funcpointer) {
  self->setContactAddedCallback(funcpointer);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_setContactProcessedCallback_1(btSoftRigidDynamicsWorld* self, int funcpointer) {
  self->setContactProcessedCallback(funcpointer);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_setContactDestroyedCallback_1(btSoftRigidDynamicsWorld* self, int funcpointer) {
  self->setContactDestroyedCallback(funcpointer);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_addAction_1(btSoftRigidDynamicsWorld* self, btActionInterface* action) {
  self->addAction(action);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_removeAction_1(btSoftRigidDynamicsWorld* self, btActionInterface* action) {
  self->removeAction(action);
}

btContactSolverInfo* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_getSolverInfo_0(btSoftRigidDynamicsWorld* self) {
  return &self->getSolverInfo();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_1(btSoftRigidDynamicsWorld* self, void* cb) {
  self->setInternalTickCallback(cb);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_2(btSoftRigidDynamicsWorld* self, void* cb, void* worldUserInfo) {
  self->setInternalTickCallback(cb, worldUserInfo);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld_setInternalTickCallback_3(btSoftRigidDynamicsWorld* self, void* cb, void* worldUserInfo, bool isPreTick) {
  self->setInternalTickCallback(cb, worldUserInfo, isPreTick);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftRigidDynamicsWorld___destroy___0(btSoftRigidDynamicsWorld* self) {
  delete self;
}

// Interface: btSoftBodyHelpers


btSoftBodyHelpers* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyHelpers_btSoftBodyHelpers_0() {
  return new btSoftBodyHelpers();
}

btSoftBody* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyHelpers_CreateRope_5(btSoftBodyHelpers* self, btSoftBodyWorldInfo* worldInfo, const btVector3* from, const btVector3* to, int res, int fixeds) {
  return self->CreateRope(*worldInfo, *from, *to, res, fixeds);
}

btSoftBody* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyHelpers_CreatePatch_9(btSoftBodyHelpers* self, btSoftBodyWorldInfo* worldInfo, const btVector3* corner00, const btVector3* corner10, const btVector3* corner01, const btVector3* corner11, int resx, int resy, int fixeds, bool gendiags) {
  return self->CreatePatch(*worldInfo, *corner00, *corner10, *corner01, *corner11, resx, resy, fixeds, gendiags);
}

btSoftBody* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyHelpers_CreatePatchUV_10(btSoftBodyHelpers* self, btSoftBodyWorldInfo* worldInfo, const btVector3* corner00, const btVector3* corner10, const btVector3* corner01, const btVector3* corner11, int resx, int resy, int fixeds, bool gendiags, float* tex_coords) {
  return self->CreatePatchUV(*worldInfo, *corner00, *corner10, *corner01, *corner11, resx, resy, fixeds, gendiags, tex_coords);
}

btSoftBody* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyHelpers_CreateEllipsoid_4(btSoftBodyHelpers* self, btSoftBodyWorldInfo* worldInfo, const btVector3* center, const btVector3* radius, int res) {
  return self->CreateEllipsoid(*worldInfo, *center, *radius, res);
}

btSoftBody* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyHelpers_CreateFromTriMesh_5(btSoftBodyHelpers* self, btSoftBodyWorldInfo* worldInfo, float* vertices, int* triangles, int ntriangles, bool randomizeConstraints) {
  return self->CreateFromTriMesh(*worldInfo, vertices, triangles, ntriangles, randomizeConstraints);
}

btSoftBody* EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyHelpers_CreateFromConvexHull_4(btSoftBodyHelpers* self, btSoftBodyWorldInfo* worldInfo, const btVector3* vertices, int nvertices, bool randomizeConstraints) {
  return self->CreateFromConvexHull(*worldInfo, vertices, nvertices, randomizeConstraints);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_btSoftBodyHelpers___destroy___0(btSoftBodyHelpers* self) {
  delete self;
}

// Interface: Vec3Long


Vec3Long* EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3Long_Vec3Long_3(int x, int y, int z) {
  return new Vec3Long(x, y, z);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3Long_X_0(Vec3Long* self) {
  return self->X();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3Long_Y_0(Vec3Long* self) {
  return self->Y();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3Long_Z_0(Vec3Long* self) {
  return self->Z();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3Long___destroy___0(Vec3Long* self) {
  delete self;
}

// Interface: Vec3Real


Vec3Real* EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3Real_Vec3Real_3(double x, double y, double z) {
  return new Vec3Real(x, y, z);
}

double EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3Real_X_0(Vec3Real* self) {
  return self->X();
}

double EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3Real_Y_0(Vec3Real* self) {
  return self->Y();
}

double EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3Real_Z_0(Vec3Real* self) {
  return self->Z();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Vec3Real___destroy___0(Vec3Real* self) {
  delete self;
}

// Interface: HACD


HACD::HACD* EMSCRIPTEN_KEEPALIVE emscripten_bind_HACD_HACD_0() {
  return new HACD::HACD();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_HACD_SetCompacityWeight_1(HACD::HACD* self, double alpha) {
  self->SetCompacityWeight(alpha);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_HACD_SetVolumeWeight_1(HACD::HACD* self, double beta) {
  self->SetVolumeWeight(beta);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_HACD_SetConcavity_1(HACD::HACD* self, double concavity) {
  self->SetConcavity(concavity);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_HACD_SetNClusters_1(HACD::HACD* self, int nClusters) {
  self->SetNClusters(nClusters);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_HACD_SetNVerticesPerCH_1(HACD::HACD* self, int nVerticesPerCH) {
  self->SetNVerticesPerCH(nVerticesPerCH);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_HACD_SetPoints_1(HACD::HACD* self, Vec3Real* points) {
  self->SetPoints(points);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_HACD_SetNPoints_1(HACD::HACD* self, int nPoints) {
  self->SetNPoints(nPoints);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_HACD_SetTriangles_1(HACD::HACD* self, Vec3Long* triangles) {
  self->SetTriangles(triangles);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_HACD_SetNTriangles_1(HACD::HACD* self, int nTriangles) {
  self->SetNTriangles(nTriangles);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_HACD_Compute_0(HACD::HACD* self) {
  self->Compute();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_HACD_GetNClusters_0(HACD::HACD* self) {
  return self->GetNClusters();
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_HACD_GetNPointsCH_1(HACD::HACD* self, int c) {
  return self->GetNPointsCH(c);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_HACD_GetNTrianglesCH_1(HACD::HACD* self, int c) {
  return self->GetNTrianglesCH(c);
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_HACD_GetCH_3(HACD::HACD* self, int c, Vec3Real* points, Vec3Long* triangles) {
  return self->GetCH(c, points, triangles);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_HACD___destroy___0(HACD::HACD* self) {
  delete self;
}

// Interface: VHACD


VHACD::VHACD* EMSCRIPTEN_KEEPALIVE emscripten_bind_VHACD_VHACD_0() {
  return new VHACD::VHACD();
}

bool EMSCRIPTEN_KEEPALIVE emscripten_bind_VHACD_Compute_7(VHACD::VHACD* self, double* points, int stridePoints, int nPoints, int* triangles, int strideTriangles, int nTriangles, const VHACD::IVHACD::Parameters* params) {
  return self->Compute(points, stridePoints, nPoints, triangles, strideTriangles, nTriangles, *params);
}

unsigned short EMSCRIPTEN_KEEPALIVE emscripten_bind_VHACD_GetNConvexHulls_0(VHACD::VHACD* self) {
  return self->GetNConvexHulls();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_VHACD_GetConvexHull_2(VHACD::VHACD* self, unsigned short index, VHACD::IVHACD::ConvexHull* ch) {
  self->GetConvexHull(index, *ch);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_VHACD_Cancel_0(VHACD::VHACD* self) {
  self->Cancel();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_VHACD_Clean_0(VHACD::VHACD* self) {
  self->Clean();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_VHACD_Release_0(VHACD::VHACD* self) {
  self->Release();
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_VHACD___destroy___0(VHACD::VHACD* self) {
  delete self;
}

// Interface: Parameters


VHACD::IVHACD::Parameters* EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_Parameters_0() {
  return new VHACD::IVHACD::Parameters();
}

double EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_get_m_concavity_0(VHACD::IVHACD::Parameters* self) {
  return self->m_concavity;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_set_m_concavity_1(VHACD::IVHACD::Parameters* self, double arg0) {
  self->m_concavity = arg0;
}

double EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_get_m_alpha_0(VHACD::IVHACD::Parameters* self) {
  return self->m_alpha;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_set_m_alpha_1(VHACD::IVHACD::Parameters* self, double arg0) {
  self->m_alpha = arg0;
}

double EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_get_m_beta_0(VHACD::IVHACD::Parameters* self) {
  return self->m_beta;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_set_m_beta_1(VHACD::IVHACD::Parameters* self, double arg0) {
  self->m_beta = arg0;
}

double EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_get_m_gamma_0(VHACD::IVHACD::Parameters* self) {
  return self->m_gamma;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_set_m_gamma_1(VHACD::IVHACD::Parameters* self, double arg0) {
  self->m_gamma = arg0;
}

double EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_get_m_minVolumePerCH_0(VHACD::IVHACD::Parameters* self) {
  return self->m_minVolumePerCH;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_set_m_minVolumePerCH_1(VHACD::IVHACD::Parameters* self, double arg0) {
  self->m_minVolumePerCH = arg0;
}

unsigned short EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_get_m_resolution_0(VHACD::IVHACD::Parameters* self) {
  return self->m_resolution;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_set_m_resolution_1(VHACD::IVHACD::Parameters* self, unsigned short arg0) {
  self->m_resolution = arg0;
}

unsigned short EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_get_m_maxNumVerticesPerCH_0(VHACD::IVHACD::Parameters* self) {
  return self->m_maxNumVerticesPerCH;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_set_m_maxNumVerticesPerCH_1(VHACD::IVHACD::Parameters* self, unsigned short arg0) {
  self->m_maxNumVerticesPerCH = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_get_m_depth_0(VHACD::IVHACD::Parameters* self) {
  return self->m_depth;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_set_m_depth_1(VHACD::IVHACD::Parameters* self, int arg0) {
  self->m_depth = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_get_m_planeDownsampling_0(VHACD::IVHACD::Parameters* self) {
  return self->m_planeDownsampling;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_set_m_planeDownsampling_1(VHACD::IVHACD::Parameters* self, int arg0) {
  self->m_planeDownsampling = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_get_m_convexhullDownsampling_0(VHACD::IVHACD::Parameters* self) {
  return self->m_convexhullDownsampling;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_set_m_convexhullDownsampling_1(VHACD::IVHACD::Parameters* self, int arg0) {
  self->m_convexhullDownsampling = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_get_m_pca_0(VHACD::IVHACD::Parameters* self) {
  return self->m_pca;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_set_m_pca_1(VHACD::IVHACD::Parameters* self, int arg0) {
  self->m_pca = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_get_m_mode_0(VHACD::IVHACD::Parameters* self) {
  return self->m_mode;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_set_m_mode_1(VHACD::IVHACD::Parameters* self, int arg0) {
  self->m_mode = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_get_m_convexhullApproximation_0(VHACD::IVHACD::Parameters* self) {
  return self->m_convexhullApproximation;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_set_m_convexhullApproximation_1(VHACD::IVHACD::Parameters* self, int arg0) {
  self->m_convexhullApproximation = arg0;
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_get_m_oclAcceleration_0(VHACD::IVHACD::Parameters* self) {
  return self->m_oclAcceleration;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters_set_m_oclAcceleration_1(VHACD::IVHACD::Parameters* self, int arg0) {
  self->m_oclAcceleration = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_Parameters___destroy___0(VHACD::IVHACD::Parameters* self) {
  delete self;
}

// Interface: ConvexHull


VHACD::IVHACD::ConvexHull* EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexHull_ConvexHull_0() {
  return new VHACD::IVHACD::ConvexHull();
}

double EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexHull_get_m_points_1(VHACD::IVHACD::ConvexHull* self, int arg0) {
  return self->m_points[arg0];
}

int EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexHull_get_m_triangles_1(VHACD::IVHACD::ConvexHull* self, int arg0) {
  return self->m_triangles[arg0];
}

unsigned short EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexHull_get_m_nPoints_0(VHACD::IVHACD::ConvexHull* self) {
  return self->m_nPoints;
}

unsigned short EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexHull_get_m_nTriangles_0(VHACD::IVHACD::ConvexHull* self) {
  return self->m_nTriangles;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_ConvexHull___destroy___0(VHACD::IVHACD::ConvexHull* self) {
  delete self;
}

// $PHY_ScalarType
PHY_ScalarType EMSCRIPTEN_KEEPALIVE emscripten_enum_PHY_ScalarType_PHY_FLOAT() {
  return PHY_FLOAT;
}
PHY_ScalarType EMSCRIPTEN_KEEPALIVE emscripten_enum_PHY_ScalarType_PHY_DOUBLE() {
  return PHY_DOUBLE;
}
PHY_ScalarType EMSCRIPTEN_KEEPALIVE emscripten_enum_PHY_ScalarType_PHY_INTEGER() {
  return PHY_INTEGER;
}
PHY_ScalarType EMSCRIPTEN_KEEPALIVE emscripten_enum_PHY_ScalarType_PHY_SHORT() {
  return PHY_SHORT;
}
PHY_ScalarType EMSCRIPTEN_KEEPALIVE emscripten_enum_PHY_ScalarType_PHY_FIXEDPOINT88() {
  return PHY_FIXEDPOINT88;
}
PHY_ScalarType EMSCRIPTEN_KEEPALIVE emscripten_enum_PHY_ScalarType_PHY_UCHAR() {
  return PHY_UCHAR;
}

// $eGIMPACT_SHAPE_TYPE
eGIMPACT_SHAPE_TYPE EMSCRIPTEN_KEEPALIVE emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_COMPOUND_SHAPE() {
  return CONST_GIMPACT_COMPOUND_SHAPE;
}
eGIMPACT_SHAPE_TYPE EMSCRIPTEN_KEEPALIVE emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_TRIMESH_SHAPE_PART() {
  return CONST_GIMPACT_TRIMESH_SHAPE_PART;
}
eGIMPACT_SHAPE_TYPE EMSCRIPTEN_KEEPALIVE emscripten_enum_eGIMPACT_SHAPE_TYPE_CONST_GIMPACT_TRIMESH_SHAPE() {
  return CONST_GIMPACT_TRIMESH_SHAPE;
}

// $btConstraintParams
btConstraintParams EMSCRIPTEN_KEEPALIVE emscripten_enum_btConstraintParams_BT_CONSTRAINT_ERP() {
  return BT_CONSTRAINT_ERP;
}
btConstraintParams EMSCRIPTEN_KEEPALIVE emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_ERP() {
  return BT_CONSTRAINT_STOP_ERP;
}
btConstraintParams EMSCRIPTEN_KEEPALIVE emscripten_enum_btConstraintParams_BT_CONSTRAINT_CFM() {
  return BT_CONSTRAINT_CFM;
}
btConstraintParams EMSCRIPTEN_KEEPALIVE emscripten_enum_btConstraintParams_BT_CONSTRAINT_STOP_CFM() {
  return BT_CONSTRAINT_STOP_CFM;
}

}

