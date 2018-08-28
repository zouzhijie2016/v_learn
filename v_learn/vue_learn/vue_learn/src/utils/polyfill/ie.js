
if ('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style) { // detect it's IE11
    window.addEventListener('hashchange', function (event) {
        // var currentPath = window.location.hash.slice(1);
        // if (store.state.route.path !== currentPath) {
        //     router.push(currentPath)
        // }
    }, false)
}
