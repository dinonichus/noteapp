// GET homepage
exports.homepage = async (erq, res) => {
    const locals = {
        title: 'NodeJs Notes',
        description: 'Free NodeJs Notes App'
    }

    res.render('index', {
        locals,
        layout: '../views/layouts/front-page'
    });
}

// GET about page
exports.about = async (erq, res) => {
    const locals = {
        title: 'About - NodeJs Notes',
        description: 'Free NodeJs Notes App'
    }

    res.render('about', locals);
}