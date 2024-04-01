// GET Dashboard
exports.dashboard = async (erq, res) => {
    const locals = {
        title: 'Dashboard',
        description: 'Free NodeJs Notes App'
    }

    res.render('dashboard/index', {
        locals,
        layout: '../views/layouts/dashboard'
    });
}