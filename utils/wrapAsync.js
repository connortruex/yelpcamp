module.exports = function(fn) {
    return function(req, res, next) {
        fn(req, res).catch(err => next(err));
    }
}