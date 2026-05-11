import { Router } from "express";

const router = Router();

router.route("/healthcheck").get((req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running smoothly" });
});

export default router;
