// Get /test/custom route

const Country = require('../../../../models/country/Country');
const Target = require('../../../../models/target/Target');

module.exports = (req, res) => {
  if (req.session.user)
    req.session.destroy(); // Destroy the logged in user to join custom campaign

  Target.getProjectFromTargetId(req.query.id, (err, project) => {
    if (err) return res.redirect('/');

    Country.getCountries((err, countries) => {
      if (err) return res.redirect('/');

      return res.render('test/custom', {
        page: 'test/custom',
        title: project.name,
        includes: {
          external: {
            css: ['page', 'general', 'fontawesome', 'buttons', 'inputs', 'confirm'],
            js: ['page', 'serverRequest', 'inputListeners', 'confirm']
          }
        },
        target_id: req.query.id,
        project,
        countries,
        genders: [
          {name: 'Female', id: 'female'},
          {name: 'Male', id: 'male'},
          {name: 'Other', id: 'other'},
          {name: 'Prefer not to say', id: 'not_specified'}
        ],
      });
    });
  });

  // if (req.session.custom_submition) {
  //   User.getSubmitionByIdOfCustomURL(req.session.custom_submition, req.query.id, (err, data) => {
  //     if (err) { // If error with old saved data, delete the submition, destroy the saved data and redirect to same route
  //       Submition.deleteSubmitionById(req.session.custom_submition, () => {
  //         req.session.destroy();
  //         return res.redirect(`/test/custom?id=${req.query.id}`);
  //       });
  //     } else {
  //       return res.render('test/custom', {
  //         page: 'test/custom',
  //         title: data.campaign.name,
  //         includes: {
  //           external: {
  //             css: ['page', 'general', 'fontawesome', 'buttons', 'inputs', 'confirm'],
  //             js: ['page', 'serverRequest', 'confirm']
  //           }
  //         }, 
  //         campaign: data.campaign,
  //         questions: data.questions,
  //         submition: data.submition
  //       });
  //     }
  //   });
  // } else {
  //   User.joinProjectFromCustomURL(req.query.id, (err, id) => {
  //     if (err) return res.redirect('/');

  //     req.session.custom_submition = id;

  //     User.getSubmitionByIdOfCustomURL(req.session.custom_submition, req.query.id, (err, data) => {
  //       if (err) { // If error with old saved data, delete the submition, destroy the saved data and redirect to same route
  //         Submition.deleteSubmitionById(req.session.custom_submition, () => {
  //           req.session.destroy();
  //           return res.redirect(`/test/custom?id=${req.query.id}`);
  //         });
  //       } else {
  //         return res.render('test/custom', {
  //           page: 'test/custom',
  //           title: data.campaign.name,
  //           includes: {
  //             external: {
  //               css: ['page', 'general', 'fontawesome', 'buttons', 'inputs', 'confirm'],
  //               js: ['page', 'serverRequest', 'confirm']
  //             }
  //           }, 
  //           campaign: data.campaign,
  //           questions: data.questions,
  //           submition: data.submition
  //         });
  //       }
  //     });
  //   })
  // }
}
