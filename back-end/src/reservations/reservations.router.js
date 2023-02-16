/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

/**
 *  URL/reservations
 * */

router
  .route("/:reservation_id/status")
  .put(controller.updateStatus)
  .all(methodNotAllowed);

router
  .route("/:reservation_id/edit")
  .put(controller.update)
  .all(methodNotAllowed);

router
  .route("/:reservation_id")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
