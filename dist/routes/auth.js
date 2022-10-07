"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = require("../lib/middleware/passport");
const router = (0, express_1.Router)();
router.get("/login", (req, res, next) => {
    if (typeof req.query.redirectTo !== "string" || !req.query.redirectTo) {
        res.status(400);
        return next("Miss redirect query");
    }
    req.session.redirectTo = req.query.redirectTo;
    res.redirect("/auth/github/login");
});
router.get("/auth/github/login", passport_1.passport.authenticate("github", {
    scope: ["user:email"],
}));
router.get("/github/callback", 
//@ts-ignore
passport_1.passport.authenticate("github", {
    failureRedirect: "/auth/github/login",
    keepSessionInfo: true,
}), (req, res) => {
    if (typeof req.session.redirectTo !== "string") {
        return res.status(500).end();
    }
    res.redirect(req.session.redirectTo);
});
router.get("/logout", (req, res, next) => {
    if (typeof req.query.redirectTo !== "string" || !req.query.redirectTo) {
        res.status(400);
        return next("Miss redirect query");
    }
    const reidirectUrl = req.query.redirectTo;
    req.logout((e) => {
        if (e) {
            return next(e);
        }
        res.redirect(reidirectUrl);
    });
});
exports.default = router;
//# sourceMappingURL=auth.js.map