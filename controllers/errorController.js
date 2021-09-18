exports.get404 = (req, res) => {
    res.status(404).send({ status: 404, message: "Page not found. Error 404." });
}