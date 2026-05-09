import { Router } from "express";
import ticketsController from "../controllers/tickets.controller.js";

const router = Router();

router.get("/", ticketsController.index);
router.get("/:id", ticketsController.show);
router.get("/:id/summary", ticketsController.summary);
router.post("/", ticketsController.store);
router.patch("/:id", ticketsController.update);
router.post("/:id/comments", ticketsController.addComment);

export default router;
