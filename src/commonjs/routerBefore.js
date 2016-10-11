/**
 * Created by Liu.Jun on 2016/9/21.
 */
module.exports = function (router) {
    router.beforeEach(function ({to, next}) {
        document.title = to.title;
        window.scrollTo(0, 0);
        next();
    });
};