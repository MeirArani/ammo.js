//import * as Ammo from "./dist/Ammo";
//const Ammo = (await Ammo.default.bind(window)()) as typeof Ammo;

//import * as Ammo from "./dist/Ammo.wasm.wasm";

import * as Ammo from "./dist/Ammo";
const ammo = (await Ammo.default.bind(window)()) as typeof Ammo;

function main() {
  var collisionConfiguration = new ammo.btDefaultCollisionConfiguration(),
    dispatcher = new ammo.btCollisionDispatcher(collisionConfiguration),
    overlappingPairCache = new ammo.btDbvtBroadphase(),
    solver = new ammo.btSequentialImpulseConstraintSolver(),
    dynamicsWorld = new ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
  dynamicsWorld.setGravity(new ammo.btVector3(0, -10, 0));

  var groundShape = new ammo.btBoxShape(new ammo.btVector3(50, 50, 50)),
    bodies = [],
    groundTransform = new ammo.btTransform();

  groundTransform.setIdentity();
  groundTransform.setOrigin(new ammo.btVector3(0, -56, 0));

  (function () {
    var mass = 0,
      isDynamic = mass !== 0,
      localInertia = new ammo.btVector3(0, 0, 0);

    if (isDynamic) groundShape.calculateLocalInertia(mass, localInertia);

    var myMotionState = new ammo.btDefaultMotionState(groundTransform),
      rbInfo = new ammo.btRigidBodyConstructionInfo(mass, myMotionState, groundShape, localInertia),
      body = new ammo.btRigidBody(rbInfo);

    dynamicsWorld.addRigidBody(body);
    bodies.push(body);
  })();

  (function () {
    var colShape = new ammo.btSphereShape(1),
      startTransform = new ammo.btTransform();

    startTransform.setIdentity();

    var mass = 1,
      isDynamic = mass !== 0,
      localInertia = new ammo.btVector3(0, 0, 0);

    if (isDynamic) colShape.calculateLocalInertia(mass, localInertia);

    startTransform.setOrigin(new ammo.btVector3(2, 10, 0));

    var myMotionState = new ammo.btDefaultMotionState(startTransform),
      rbInfo = new ammo.btRigidBodyConstructionInfo(mass, myMotionState, colShape, localInertia),
      body = new ammo.btRigidBody(rbInfo);

    dynamicsWorld.addRigidBody(body);
    bodies.push(body);
  })();

  var trans = new ammo.btTransform(); // taking this out of the loop below us reduces the leaking

  for (var i = 0; i < 135; i++) {
    dynamicsWorld.stepSimulation(1 / 60, 10);

    bodies.forEach(function (body) {
      if (body.getMotionState()) {
        body.getMotionState().getWorldTransform(trans);
        console.log(
          "world pos = " +
            [trans.getOrigin().x().toFixed(2), trans.getOrigin().y().toFixed(2), trans.getOrigin().z().toFixed(2)]
        );
      }
    });
  }

  // Delete objects we created through |new|. We just do a few of them here, but you should do them all if you are not shutting down Ammo.js
  // we'll free the objects in reversed order as they were created via 'new' to avoid the 'dead' object links
  ammo.destroy(dynamicsWorld);
  ammo.destroy(solver);
  ammo.destroy(overlappingPairCache);
  ammo.destroy(dispatcher);
  ammo.destroy(collisionConfiguration);

  console.log("ok.");
}

main();
